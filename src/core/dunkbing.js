import Camera from '../entities/camera.js'
import Player from '../entities/player.js'
import Map from '../entities/map.js'
import Obstacle from '../entities/obstacle.js';

const controls = {
  left: false,
  up: false,
  right: false,
  down: false,
};
window.Game = {Camera, Player, Map, controls };

(function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const room = {
    width: 785,
    height: 441,
    map: new Game.Map(785, 441)
  };

  room.map.generate();

  const player = new Game.Player(50, 50);
  const obstacles = []
  for(let i = 0; i < 5; i++){
    obstacles.push(new Obstacle(Math.random()*room.width, Math.random()*room.height))
  }

  // Set the right viewport size for the camera
  let vWidth = Math.min(room.width, canvas.width);
  let vHeight = Math.min(room.height, canvas.height);

  // Setup the camera
  const camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
  camera.follow(player, vWidth / 2, vHeight / 2);

  const update = function (STEP) {
    player.update(STEP, room.width, room.height);
    camera.update();
  }

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    room.map.draw(context, camera.x, camera.y);
    player.draw(context, camera.x, camera.y);
    for(const obstacle of obstacles){
      obstacle.draw(context, camera.x, camera.y)
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
})();
window.addEventListener("keydown", function (e) {
  switch (e.keyCode) {
    case 37: // left arrow
      Game.controls.left = true;
      break;
    case 38: // up arrow
      Game.controls.up = true;
      break;
    case 39: // right arrow
      Game.controls.right = true;
      break;
    case 40: // down arrow
      Game.controls.down = true;
      break;
  }
}, false);

window.addEventListener("keyup", function (e) {
  switch (e.keyCode) {
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
window.onload = window.Game.play