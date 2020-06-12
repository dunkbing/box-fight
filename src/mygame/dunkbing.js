import Camera from '../entities/camera.js'
import Player from '../entities/player.js'
import Map from '../entities/map.js'
import QuadTree from '../entities/quadtree.js'
import Obstacle from '../entities/obstacle.js';
import createPlatforms from './platforms.js'
import Bullet from './bullet.js';
import {distance, normalizeVect, getAngle} from '../entities/vector.js';
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

(function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");
  const socket = io()

  const room = {
    width: 1100,
    height: 557,
    map: new Game.Map(1100, 557)
  };

  room.map.generate();

  let player = new Game.Player(Math.random()*room.width-50, 50, 50, 50);
  player.totalBullet = 25
  player.id = Math.random()
  const otherPlayers = []
  Game.otherPlayers = otherPlayers
  
  Game.player = player
  let point = null
  let d, grabbingBullet //distance from player to grabbing point/bullet
  //let player = createPlayer
  const quadTree = new QuadTree(0, new Rectangle(0, 0, room.width, room.height));
  const obstacles = createPlatforms()
  let bullets = []
  let allObjects = [...obstacles]
  socket.emit('create-obstacle', allObjects)
  socket.emit('player-connect', {player, allObstacles: allObjects})
  socket.on('player-connect', function(data){
    if(data.allObstacles){
      allObjects = data.allObstacles
      for(const obj of allObjects){
        Object.setPrototypeOf(obj, Obstacle.prototype)
      }
    }
    const playerList = data.playerList
    for(const id in playerList){
      if(player && Number(id) !== player.id){
        const p = playerList[id]
        Object.setPrototypeOf(p, Player.prototype)
        p.update = function(deltaTime){
          if(p.g){
            p.y += p.velY*deltaTime
            if(p.velY < 500) p.velY += p.g
          }
        }
        otherPlayers.push(p)
      }
    }
  })
  socket.on('player-move', function(data){
    const {x, y, id, hp} = data
    for(const player of otherPlayers){
      if(player.id === Number(id)){
        player.x = x
        player.y = y
        player.hp = hp
      }
    }
  })

  socket.on('shooting', function(data){
    const bulletList = data
    for(const bullet of bulletList){
      Object.setPrototypeOf(bullet, Bullet.prototype)
    }
    bullets = bullets.concat(bulletList)
  })

  socket.on('use-grapping-hook', function(data){
    const {playerId, point, d, grabbingBullet} = data
    const player = otherPlayers.find(p => p.id == playerId)
    if(player != null){
      Object.setPrototypeOf(player, Player.prototype)
      Object.setPrototypeOf(grabbingBullet, Bullet.prototype)
      bullets.push(grabbingBullet)
      player.useGrappingHook(point, d, context, grabbingBullet)
    }
  })

  socket.on('player-died', function(playerId){
    const deadPlayer = otherPlayers.find(p => p.id === playerId)
    if(deadPlayer){
      otherPlayers.splice(otherPlayers.indexOf(deadPlayer), 1)
    }
  })

  // Set the right viewport size for the camera
  let vWidth = Math.min(room.width, canvas.width);
  let vHeight = Math.min(room.height, canvas.height);

  // Setup the camera
  const camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
  camera.follow(player, vWidth / 2, vHeight / 2);
  window.camera = camera

  const update = function (STEP) {
    if(player){
      player.update(STEP, room.width, room.height);
    }
    for(const player of otherPlayers){
      player.update(STEP, room.width, room.height)
    }
    camera.update();
    checkPlayerCollide()
    checkOtherPlayerCollide()
    checkBulletsCollide()
    //checkBulletsCollideOtherPlayer()
    //bruteForceCollisionCheck()
    //quadTreeCollisionCheck()
  }

  const checkPlayerCollide = function(){
    if(player){
      for(const obstacle of allObjects){
        if(obstacle !== player){
          const collisionDirection = player.collide(obstacle)
          if (collisionDirection == "left" || collisionDirection == "right") {
            player.velX = 0
            player.jumping = false
            player.onGround = true
            //point.available = false
          } else if (collisionDirection == "bottom") {
            player.jumping = false
            player.onGround = true
          } else if (collisionDirection == "top") {
            player.velY *= -1
          }
        }
      }
    }
    if(player){
      for(const other of otherPlayers){
        const collisionDirection = player.collide(other)
        if (collisionDirection == "left" || collisionDirection == "right") {
          player.velX = 0
          player.jumping = false
          player.onGround = true
          //point.available = false
        } else if (collisionDirection == "bottom") {
          player.jumping = false
          player.onGround = true
        } else if (collisionDirection == "top") {
          //player.velY *= -1
        }
      }
    }
  }

  const checkOtherPlayerCollide = function(){
    for(const obstacle of allObjects){
      for(const player of otherPlayers){
        const collisionDirection = player.collide(obstacle)
        if (collisionDirection == "left" || collisionDirection == "right") {
          player.velX = 0
          player.jumping = false
          player.onGround = true
          //point.available = false
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
    for(const bullet of bullets){
      for(const obstacle of allObjects){
        if(obstacle !== player){
          const collisionDirection = bullet.collide(obstacle)
          if(collisionDirection){
            explode(bullet.x-camera.x, bullet.y-camera.y)
            let explodedBullet = bullets.splice(bullets.indexOf(bullet), 1)[0]
            if(explodedBullet){
              socket.emit('bullet-exploded', explodedBullet.id)
            }
            if(grabbingBullet && explodedBullet === grabbingBullet) {
              point = {x: grabbingBullet.x, y: grabbingBullet.y, available: true}
              grabbingBullet = null
            }
            explodedBullet = null
          }
        }
      }
      for(const p of otherPlayers){
        if(p.id !== bullet.playerId){
          const collisionDirection = bullet.collide(p)
          if(collisionDirection){
            explode(bullet.x-camera.x, bullet.y-camera.y)
            explode(player.x, player.y, 100, 100)
            let explodedBullet = bullets.splice(bullets.indexOf(bullet), 1)[0]
            if(explodedBullet){
              socket.emit('bullet-exploded', explodedBullet.id)
            }
            if(grabbingBullet && explodedBullet === grabbingBullet) {
              point = {x: grabbingBullet.x, y: grabbingBullet.y, available: true}
              grabbingBullet = null
            }
            explodedBullet = null
          }
        }
      }
      if(player && bullet.playerId !== player.id && bullet !== grabbingBullet){
        const collisionDirection = bullet.collide(player)
        if(collisionDirection){
          explode(bullet.x-camera.x, bullet.y-camera.y)
          player.x += bullet.velX*10
          player.y += bullet.velY*10
          player.hp -= 10
          if(player.hp <= 0) {
            explode(player.x+player.width/2, player.y+player.height/2, 100, 100)
            socket.emit('player-died', player.id)
            player = null
            //Game.togglePause()
          }
          let explodedBullet = bullets.splice(bullets.indexOf(bullet), 1)[0]
          if(explodedBullet){
            socket.emit('bullet-exploded', explodedBullet.id)
          }
          if(grabbingBullet && explodedBullet === grabbingBullet) {
            point = {x: grabbingBullet.x, y: grabbingBullet.y, available: true}
            grabbingBullet = null
          }
          explodedBullet = null
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
      returnObjects.length = 0
      if(allObjects[i] === player){
        returnObjects = quadTree.retrieve(returnObjects, quadTree.objects[i])
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
          if(returnObjects[x] !== player){
          }
        }
      }
    }
  }

  const drawAllObject = function(){
    for(const obj of allObjects){
      obj.draw(context, camera.x, camera.y)
    }
    for(const player of otherPlayers){
      player.draw(context, camera.x, camera.y)
    }
    for(const bullet of bullets){
      bullet.draw(context, camera.x, camera.y)
      bullet.update()
      /* if(bullet.x+bullet.width<=0 || bullet.x>=camera.width || bullet.y+bullet.height<=0 || bullet.y>=camera.height){
        bullets.splice(bullets.indexOf(bullet), 1);
      } */
    }
  }

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    room.map.draw(context, camera.x, camera.y);
    if(player !== null){
      player.draw(context, camera.x, camera.y);
    }
    
    if(point && point.available){
      player.useGrappingHook(point, d, context, grabbingBullet)
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
    if(player){
      const {x, y, id, hp} = player
      socket.emit('player-move', {x, y, id, hp})  
    }
    Game.printInfo(deltaTime)
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

  Game.printInfo = function(deltaTime){
    context.font = '20px Arial'
    context.fillText(`fps: ${(1000/deltaTime).toFixed(2)}`, 10, 20)
  }
  window.addEventListener("keydown", function (e) {
    if(player){
      switch (e.key) {
        case ' ':{//space
          Game.controls.space = true
          point.available = false
        } 
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
    if(player && player.totalBullet > 0){
      const d = distance({x: player.x+player.width/2-camera.x, y: player.y+player.height/2-camera.y}, {x: e.clientX, y: e.clientY});
      const vect = normalizeVect({x: e.clientX-(player.x+player.width/2-camera.x), y: e.clientY-(player.y+player.height/2-camera.y)}, d)
      const velX = vect.x;
      const velY = vect.y;
      const bullet = new Bullet(player.x+player.width/2, player.y+player.height/2, 10, 10, null, velX, velY)
      bullet.id = Math.random()
      bullet.playerId = player.id
      socket.emit('shooting', bullet)
    }
  }

  canvas.oncontextmenu = (e) => {
    e.preventDefault()
    point = {x: e.clientX+camera.x, y: e.clientY+camera.y, available: true}
    d = distance({x: player.x+player.width/2-camera.x, y: player.y+player.height/2-camera.y}, point);
    grabbingBullet = new Bullet(player.x+player.width/2, player.y+player.height/2, 10, 10, null, 1)
    grabbingBullet.g = 0
    bullets.push(grabbingBullet)
    socket.emit('use-grapping-hook', {playerId: player.id, point, d, grabbingBullet})
  }

  canvas.onmousemove = (e) => {
    if(player){
      const mouseVect = {x: e.clientX, y: e.clientY}
      const playerVect = {x: player.x+player.width/2-camera.x, y: player.y+player.height/2-camera.y}
      const d = distance(playerVect, mouseVect)
      const gunVect = normalizeVect({x: mouseVect.x-playerVect.x, y: mouseVect.y-playerVect.y}, d)
      const gunTipPos = {x: gunVect.x*30, y: gunVect.y*30}
    }
    //player.drawGun(context, gunTipPos.x, gunTipPos.y)
  }

  window.onload = window.Game.play
})();
