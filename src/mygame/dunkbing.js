import Camera from '../entities/camera.js'
import Player from '../entities/player.js'
import Map from '../entities/map.js'
import Obstacle from '../entities/obstacle.js';
import createPlatforms from './platforms.js'
import Bullet from './bullet.js';
import {distance, reduceVect} from '../entities/utils.js';
import {explode} from '../entities/particle.js';

const controls = {
  left: false,
  up: false,
  right: false,
  down: false,
  space: false
};
window.Game = {Camera, Player, Map, controls };

(function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const room = {
    width: 1920,
    height: 1080,
    map: new Game.Map(1920, 1080)
  };

  room.map.generate();

  const player = new Game.Player(50, 50, 50, 50);
  const obstacles = createPlatforms()
  const bullets = []

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
  }

  const checkPlayerCollide = function(){
    for(const obstacle of obstacles){
      const collisionDirection = player.collide(obstacle)
      if (collisionDirection == "left" || collisionDirection == "right") {
        player.velX = 0
      } else if (collisionDirection == "bottom") {
        console.log('bot')
        player.jumping = false
        player.onGround = true
      } else if (collisionDirection == "top") {
        player.velY *= -1
      }
    }
  }

  const checkBulletsCollide = function(){
    for(const obstacle of obstacles){
      for(const bullet of bullets){
        const collisionDirection = bullet.collide(obstacle)
        if(collisionDirection){
          bullets.splice(bullets.indexOf(bullet), 1)
          explode(bullet.x, bullet.y)
        }
      }
    }
  }

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    room.map.draw(context, camera.x, camera.y);
    player.draw(context, camera.x, camera.y);
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
    const vect = reduceVect({x: e.clientX-(player.x+player.width/2-camera.x), y: e.clientY-(player.y+player.height/2-camera.y)}, d)
    const velX = vect.x;
    const velY = vect.y;
    bullets.push(new Bullet(player.x+player.width/2, player.y+player.height/2, 10, 10, null, velX, velY))
  }
  window.onload = window.Game.play
})();
