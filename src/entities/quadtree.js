import {Rectangle} from './rectangle.js'

export default function QuadTree(level, bound){
  this.maxObjects = 10
  this.maxLevel = 5

  this.level = level
  this.objects = []
  this.bound = bound
  this.nodes = new Array(4)
}

QuadTree.prototype.clear = function(){
  this.objects.length = 0

  for(let i = 0; i < this.nodes.length; i++){
    if(this.nodes[i]){
      this.nodes[i].clear()
      this.nodes[i] = null
    }
  }
}

QuadTree.prototype.split = function(){
  const subWidth = ~~(this.bound.width/2);
  const subHeight = ~~(this.bound.height/2);
  const x = this.bound.x;
  const y = this.bound.y;

  this.nodes[0] = new QuadTree(this.level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
  this.nodes[1] = new QuadTree(this.level+1, new Rectangle(x, y, subWidth, subHeight));
  this.nodes[2] = new QuadTree(this.level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
  this.nodes[3] = new QuadTree(this.level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
}

QuadTree.prototype.getIndex = function(pRect) {
  let index = -1;
  const verticalMidpoint = this.bound.x + (this.bound.width / 2);
  const horizontalMidpoint = this.bound.y + (this.bound.height / 2);

  const topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint);
  const bottomQuadrant = (pRect.y > horizontalMidpoint);

  if (pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint) {
    if (topQuadrant) {
      index = 1;
    } else if (bottomQuadrant) {
      index = 2;
    }
  } else if (pRect.x > verticalMidpoint) {
    if (topQuadrant) {
      index = 0;
    } else if (bottomQuadrant) {
      index = 3;
    }
  }

  return index;
}

QuadTree.prototype.insert = function(pRect) {
  if (this.nodes[0]) {
    let index = this.getIndex(pRect);
    if (index != -1) {
      this.nodes[index].insert(pRect);
      return;
    }
  }

  this.objects.push(pRect);

  if (this.objects.length > this.maxObjects && this.level < this.maxLevel) {
    if (!this.nodes[0]) { 
      this.split(); 
    }
    let i = 0;
    while (i < this.objects.length) {
      let index2 = this.getIndex(this.objects[i]);
      if (index2 != -1) {
        this.nodes[index2].insert(this.objects.splice(i, 1)[0]);
      } else {
        i++;
      }
    }
  }
}

QuadTree.prototype.retrieve = function(returnObjects, pRect) {
  let index = this.getIndex(pRect);
  if (index !== -1 && this.nodes[0]) {
    this.nodes[index] = this.nodes[index].retrieve(returnObjects, pRect);
  }

  return returnObjects.concat(this.objects);
}