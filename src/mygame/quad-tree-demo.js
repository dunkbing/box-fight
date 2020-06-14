import { Rectangle } from '../entities/rectangle.js';
import Obstacle from '../entities/obstacle.js';
import Map from '../entities/map.js'
import QuadTree from '../entities/quadtree.js'

window.Game = {Obstacle, Map, QuadTree };

(function(){
  const cv = document.querySelector('#cv')
  const context = cv.getContext('2d')
  const obstacles = []
  
  const room = {
    width: 500,
    height: 500,
    map: new Map(500, 500)
  }
  const quadTree = new QuadTree(0, new Rectangle(0, 0, room.width, room.height));
  
  room.map.generate()
  for(let i = 0; i < 100; i++){
    const obstacle = new Obstacle(Math.random()*room.width-20, Math.random()*room.height-20, 20, 20, null, 'white')
    obstacles.push(obstacle)
  }

  const update = function(step){
    for(const obstacle of obstacles){
      obstacle.update(step, room)
      //bruteForceCollisionCheck()
      quadTreeCollisionCheck()
    }
  }

  const draw = function(){
    context.clearRect(0, 0, room.width, room.height)
    for(const obstacle of obstacles){
      obstacle.draw(context, 0, 0)
    }
  }

  let n = Date.now()
  const bruteForceCollisionCheck = function(){
    for(const o1 of obstacles){
      for(const o2 of obstacles){
        if(o1 !== o2){
          const collision = o1.collide(o2)
          if(collision) {
            n = Date.now()
            o1.color = o2.color = 'red'
          } 
          if(Date.now() - n > 2000){
            o1.color = 'white'
            o2.color = 'white'
          }
        }
        
      }
    }
  }
  const quadTreeCollisionCheck = function(){
    quadTree.clear();
    for(const obj of obstacles){
      quadTree.insert(obj)
    }
    let returnObjects = []
    for(let i = 0; i < obstacles.length; i++){
      returnObjects.length = 0
      returnObjects = quadTree.retrieve(returnObjects, quadTree.objects[i])
      for(const obj of returnObjects){
        if(obj !== obstacles[i]){
          const direction = obj.collide(obstacles[i])
          //console.log(direction)
        }
      }
    }
  }

  let now = performance.now()
  const gameLoop = function(){
    const deltaTime = performance.now()-now
    now = performance.now()
    update(deltaTime/1000);
    draw();
    Game.printInfo(deltaTime)
  }

  Game.play = function(){
    gameLoop()
    requestAnimationFrame(Game.play)
  }

  Game.printInfo = function(deltaTime){
    context.font = '20px Arial'
    context.fillStyle = 'white'
    context.fillText(`fps: ${(1000/deltaTime).toFixed(2)}`, 10, 20)
  }

  window.onload = Game.play
})()