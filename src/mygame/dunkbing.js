import Camera from '../entities/camera.js'
import Player from '../entities/player.js'
import Map from '../entities/map.js'
import QuadTree from '../entities/quadtree.js'
import Obstacle from '../entities/obstacle.js';
import createPlatforms from './platforms.js'
import Bullet from './bullet.js';
import {distance, normalizeVect} from '../entities/vector.js';
import {explode} from '../entities/particle.js';
import { Rectangle } from '../entities/rectangle.js';

const controls = {
  left: false,
  up: false,
  right: false,
  down: false,
  space: false
};

window.Game = {Camera, Player, Map, QuadTree, controls };
/* 
const createPlayer = (function(){
  let player
  const socket = new WebSocket('ws://localhost:8080', 'echo-protocol');
  socket.onopen = function (e) {
    socket.send(JSON.stringify(new Player(50, 50, 50, 50)))
  };

  socket.onmessage = function (event) {
    console.log('Message from server ', event.data);
    player = JSON.parse(event.data)
    console.log(player)
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      console.log(event.data)
    } else {
      console.log('[close] Connection died');
    }
  };

  socket.onerror = function (error) {
    console.log(`error ${error.message}`)
  };
  //return new Game.Player(player.x, player.y, player.width, player.height)
})();
 */
(function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const room = {
    width: 1920,
    height: 1080,
    map: new Game.Map(1920, 1080)
  };

  room.map.generate();

  let player = new Game.Player(50, 50, 50, 50);
  Game.player = player
  let point = null
  let d, grabbingBullet //distance from player to grabbing point/bullet
  //let player = createPlayer
  const quadTree = new QuadTree(0, new Rectangle(0, 0, room.width, room.height));
  const obstacles = createPlatforms()
  const bullets = []
  const allObjects = [...obstacles, player]
  for(let i = 0; i < 50; i++){
    allObjects.push(new Obstacle(Math.random()*room.width, Math.random()*room.height, Math.random()*200+50, Math.random()*20+10))
  }

  // Set the right viewport size for the camera
  let vWidth = Math.min(room.width, canvas.width);
  let vHeight = Math.min(room.height, canvas.height);

  // Setup the camera
  const camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
  camera.follow(player, vWidth / 2, vHeight / 2);
  window.camera = camera

  const update = function (STEP) {
    player.update(STEP, room.width, room.height);
    camera.update();
    checkPlayerCollide()
    checkBulletsCollide()
    //bruteForceCollisionCheck()
    //quadTreeCollisionCheck()
  }

  const checkPlayerCollide = function(){
    for(const obstacle of allObjects){
      if(obstacle !== player){
        const collisionDirection = player.collide(obstacle)
        if (collisionDirection == "left" || collisionDirection == "right") {
          player.velX = 0
          player.jumping = false
          player.onGround = true
        } else if (collisionDirection == "bottom") {
          player.jumping = false
          player.onGround = true
        } else if (collisionDirection == "top") {
          player.velY *= -1
        }
      }
    }
  }

  const checkBulletsCollide = function(){
    for(const obstacle of allObjects){
      for(const bullet of bullets){
        if(obstacle !== player){
          const collisionDirection = bullet.collide(obstacle)
          if(collisionDirection){
            explode(bullet.x-camera.x, bullet.y-camera.y)
            let explodedBullet = bullets.splice(bullets.indexOf(bullet), 1)[0]
            if(explodedBullet === grabbingBullet) {
              point = {x: grabbingBullet.x, y: grabbingBullet.y}
              grabbingBullet = null
            }
            //console.log(explodedBullet === grabbingBullet)
            explodedBullet = null
            //console.log(explodedBullet)
          }
        }
      }
    }
  }

  const bruteForceCollisionCheck = function(){
    for(const obj of allObjects){
      for(const obj2 of allObjects){
        if(obj !== obj2){
          const collisionDirection = obj2.collide(obj)
          if (collisionDirection == "left" || collisionDirection == "right") {
            player.velX = 0
          } else if (collisionDirection == "bottom") {
            player.jumping = false
            player.onGround = true
          } else if (collisionDirection == "top") {
            player.velY *= -1
          }
        }
      }
    }
  }

  const quadTreeCollisionCheck = function(){
    quadTree.clear();
    for(const obj of allObjects){
      quadTree.insert(obj)
    }
    let returnObjects = []
    for(let i = 0; i < allObjects.length; i++){
      if(allObjects[i] === player){
        returnObjects.splice(0, returnObjects.length)
        returnObjects = quadTree.retrieve(returnObjects, allObjects[i])
        for(let x = 0; x < returnObjects.length; x++){
          const collisionDirection = player.collide(returnObjects[x])
          if (collisionDirection == "left" || collisionDirection == "right") {
            player.velX = 0
          } else if (collisionDirection == "bottom") {
            player.jumping = false
            player.onGround = true
          } else if (collisionDirection == "top") {
            player.velY *= -1
          }
        }
      }
    }
  }

  const drawAllObject = function(){
    for(const obj of allObjects){
      obj.draw(context, camera.x, camera.y)
    }
  }

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    room.map.draw(context, camera.x, camera.y);
    player.draw(context, camera.x, camera.y);
    
    if(point !== null){
      player.useGrabbingGun(point, d, context, grabbingBullet)
    }
    for(const obstacle of obstacles){
      obstacle.draw(context, camera.x, camera.y)
    }
    for(const bullet of bullets){
      bullet.draw(context, camera.x, camera.y)
      bullet.update()
      /* if(bullet.x+bullet.width<=0 || bullet.x>=camera.width || bullet.y+bullet.height<=0 || bullet.y>=camera.height){
        bullets.splice(bullets.indexOf(bullet), 1);
      } */
    }
    drawAllObject()
  }

  let paused = false
  let now = performance.now()
  const gameLoop = function () {
    const deltaTime = performance.now()-now
    now = performance.now()
    update(deltaTime/1000);
    draw();
    Game.printFPS(deltaTime)
  }

  Game.play = function () {
    if(!paused){
      gameLoop()
    }
    requestAnimationFrame(Game.play)
  }

  Game.togglePause = function () {
    paused = !paused
  }

  Game.printFPS = function(deltaTime){
    context.font = '20px Arial'
    context.fillText(`fps: ${(1000/deltaTime).toFixed(2)}`, 10, 20)
  }
  window.addEventListener("keydown", function (e) {
    switch (e.key) {
      case ' ': //space
        Game.controls.space = true
      case 'ArrowLeft':{ // left arrow
        player.velX = 200;
        Game.controls.left = true;
        break;
      }
      case 'ArrowUp':{ // up arrow
        Game.controls.up = true;
        break;
      }
      case 'ArrowRight':{ // right arrow
        player.velX = 200;
        Game.controls.right = true;
        break;
      }
      case 'ArrowDown': // down arrow
        Game.controls.down = true;
        break;
    }
  }, false);
  
  window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
      case 32: //space
        Game.controls.space = false
      case 37: // left arrow
        Game.controls.left = false;
        break;
      case 38: // up arrow
        Game.controls.up = false;
        break;
      case 39: // right arrow
        Game.controls.right = false;
        break;
      case 40: // down arrow
        Game.controls.down = false;
        break;
      case 80: // key P pauses the game
        Game.togglePause();
        break;
    }
  }, false);

  canvas.onclick = (e) => {
    const d = distance({x: player.x+player.width/2-camera.x, y: player.y+player.height/2-camera.y}, {x: e.clientX, y: e.clientY});
    const vect = normalizeVect({x: e.clientX-(player.x+player.width/2-camera.x), y: e.clientY-(player.y+player.height/2-camera.y)}, d)
    const velX = vect.x;
    const velY = vect.y;
    bullets.push(new Bullet(player.x+player.width/2, player.y+player.height/2, 10, 10, null, velX, velY))
  }

  canvas.oncontextmenu = (e) => {
    e.preventDefault()
    point = {x: e.clientX+camera.x, y: e.clientY+camera.y}
    d = distance({x: player.x+player.width/2-camera.x, y: player.y+player.height/2-camera.y}, point);
    grabbingBullet = new Bullet(player.x+player.width/2, player.y+player.height/2, 10, 10, null, 1)
    bullets.push(grabbingBullet)
  }

  window.onload = window.Game.play
})();
