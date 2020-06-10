import Player from '../entities/player.js'
const socket = new WebSocket('ws://localhost:8080', 'echo-protocol');
socket.onopen = function (e) {
  socket.send(JSON.stringify(new Player(50, 50, 50, 50)))
};

socket.onmessage = function (event) {
  console.log('Message from server ', event.data);
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