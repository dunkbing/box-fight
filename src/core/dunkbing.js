import { Rectangle } from './rectangle.js'
import Camera from './camera.js'
import Player from './player.js'
import Map from './map.js'


// <-- configure Game controls:
const controls = {
  left: false,
  up: false,
  right: false,
  down: false,
};
window.Game = { Rectangle, Camera, Player, Map, controls };

(function () {
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const FPS = 60;
  const INTERVAL = 1000 / FPS; // milliseconds
  const STEP = INTERVAL / 1000 // seconds

  const room = {
    width: 500,
    height: 500,
    map: new Game.Map(500, 500)
  };

  room.map.generate();

  const player = new Game.Player(50, 50);

  // Set the right viewport size for the camera
  var vWidth = Math.min(room.width, canvas.width);
  var vHeight = Math.min(room.height, canvas.height);
  console.log(vWidth, vHeight)

  // Setup the camera
  const camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
  camera.follow(player, vWidth / 2, vHeight / 2);

  const update = function () {
    player.update(STEP, room.width, room.height);
    camera.update();
  }

  const draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    room.map.draw(context, camera.xView, camera.yView);
    player.draw(context, camera.xView, camera.yView);
  }

  const gameLoop = function () {
    update();
    draw();
  }

  var runningId = -1;

  Game.play = function () {
    if (runningId == -1) {
      runningId = setInterval(function () {
        gameLoop();
      }, INTERVAL);
      console.log("play");
    }
  }

  Game.togglePause = function () {
    if (runningId == -1) {
      Game.play();
    } else {
      clearInterval(runningId);
      runningId = -1;
      console.log("paused");
    }
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