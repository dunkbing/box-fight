const express = require('express')
const app = express()
const server = require('http').Server(app)

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html')
})

app.use('/src', express.static(__dirname+'/src'))
app.use('/mygame', express.static(__dirname+'/mygame'))
app.use('/bg.png', express.static(__dirname+'/bg.png'))

server.listen(2000, () => console.log('server started'))

const socketList = {}
const playerList = {}
const bulletList = []
let allObstacles = null
const io = require('socket.io')(server, {})
io.sockets.on('connection', function(socket){
  //socket.id = Math.random()
  //socketList[socket.id] = socket

  socket.on('disconnect', function(){
    delete socketList[socket.id]
    delete playerList[socket.id]
  })

  socket.on('player-connect', function(data){
    console.log('new player connected')
    const {player} = data
    playerList[player.id] = player
    socket.id = player.id
    socketList[socket.id] = socket
    if(allObstacles === null){
      allObstacles = data.allObstacles
    }
    for(const socketId in socketList){
      socketList[socketId].emit('player-connect', {playerList, allObstacles})
    }
  })

  socket.on('player-move', function(data){
    const {x, y, id} = data
    for(const socketId in socketList){
      socketList[socketId].emit('player-move', {x, y, id})
    }
  })

  socket.on('shooting', function(data){
    bulletList.push(data)
    for(const socketId in socketList){
      socketList[socketId].emit('shooting', bulletList)
    }
  })

  socket.on('bullet-exploded', function(bulletId){
    const bullet = bulletList.find(bul => bul.id == bulletId)
    bulletList.splice(bulletList.indexOf(bullet), 1)
  })

  socket.on('use-grabbing-gun', function(data){
    const {playerId, point, d, grabbingBullet} = data
    for(const socketId in socketList){
      socketList[socketId].emit('use-grabbing-gun', {playerId, point, d, grabbingBullet})
    }
  })

})
