#!/usr/bin/env node
const WebSocketServer = require('websocket').server;
const http = require('http');
const clients = []

const server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on("connect", function(ws){
  /* ws.id = ""
  if(!clients.includes(ws))
    clients.push(ws)
  console.log(clients[0].send) */
})

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept('echo-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      if(message.utf8Data.includes("username: ")){
        if(!clients.map(client => client.username).includes(message.utf8Data)){
          connection.username = message.utf8Data
          clients.push(connection)
          clients.forEach(client => console.log(client.username))
        }
      }
      clients.push(connection)
      //connection.sendUTF(message.utf8Data)
      sendAll(message.utf8Data)
      //connection.sendUTF(message.utf8Data);
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function (reasonCode, description) {
    connection.sendUTF("bye from server")
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

function sendAll(message){
  for(const ws of clients){
    ws.sendUTF(message)
  }
}