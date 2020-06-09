import Rectangle from './rectangle.js'

export default function QuadTree(level, bound){
  this.maxObjects = 10
  this.maxLevel = 5

  this.level = level
  this.objects = []
  this.bound = bound
  this.nodes = new Array(4)
}

QuadTree.prototype.clear = function(){
  this.objects.splice(0, this.objects.length)
  for(const node of this.nodes){
    if(node){
      node.clear()
      node = null
    }
  }
}

QuadTree.prototype.split = function(){
  const subWidth = ~~(this.bound.width/2);
  const subHeight = ~~(this.bound.height/2);
  const x = this.bound.x;
  const y = this.bound.y;

  this.nodes[0] = new Quadtree(this.level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
  this.nodes[1] = new Quadtree(this.level+1, new Rectangle(x, y, subWidth, subHeight));
  this.nodes[2] = new Quadtree(this.level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
  this.nodes[3] = new Quadtree(this.level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
}

QuadTree.prototype.getIndex = function(pRect) {
  let index = -1;
  let verticalMidpoint = this.bound.x + (this.bound.width / 2);
  let horizontalMidpoint = this.bound.y + (this.bound.height / 2);

  // Object can completely fit within the top quadrants
  const topQuadrant = (pRect.y < horizontalMidpoint && pRect.y + pRect.height < horizontalMidpoint);
  // Object can completely fit within the bottom quadrants
  const bottomQuadrant = (pRect.y > horizontalMidpoint);

  // Object can completely fit within the left quadrants
  if (pRect.x < verticalMidpoint && pRect.x + pRect.width < verticalMidpoint) {
    if (topQuadrant) {
      index = 1;
    }
    else if (bottomQuadrant) {
      index = 2;
    }
   }
   // Object can completely fit within the right quadrants
   else if (pRect.getX() > verticalMidpoint) {
    if (topQuadrant) {
      index = 0;
    }
    else if (bottomQuadrant) {
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
    if (this.nodes[0] == null) { 
      this.split(); 
    }

    let i = 0;
    while (i < this.objects.length) {
      let index = getIndex(this.objects[i]);
      if (index != -1) {
        this.nodes[index].insert(this.objects.splice(i, 1)[0]);
      }
      else {
        i++;
      }
    }
  }
}

QuadTree.prototype.retrieve = function(returnObjects, pRect) {
  let index = this.getIndex(pRect);
  if (index != -1 && this.nodes[0] != null) {
    this.nodes[index].retrieve(returnObjects, pRect);
  }

  returnObjects = returnObjects.concat(this.objects);
  return returnObjects;
}