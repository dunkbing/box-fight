import {Rectangle} from './rectangle.js'
import {distance, normalizeVect} from './vector.js';
export default function Player(x, y, width, height, sprite){
  //x, y represent the coordinate of player's center on the game world(not the canvas)
  Rectangle.call(this, x, y, width, height, sprite)
  this.speed = 200
  this.velX = 200
  this.velY = 200
  this.g = 25
}

Player.prototype = new Rectangle()
Player.prototype.constructor = Player

Player.prototype.update = function(/*time between each frame in seconds*/deltaTime, worldWidth, worldHeight){
  if(this.g){
    this.y += this.velY*deltaTime
    if(this.velY < 500) this.velY += this.g
  }
  if (Game.controls.left){
    this.x -= this.velX * deltaTime;
    //this.speed++
  }
  if (Game.controls.right){
    this.x += this.velX * deltaTime;
    //this.speed++
  }
  if (Game.controls.up){
    //this.y -= this.velY * deltaTime;
    if(this.onGround){
      this.velY = -600
      this.onGround = false
    }
  }
  if (Game.controls.down){
    this.y += this.velY * deltaTime
  }
  if(Game.controls.space){
    this.velY = 200
  }
  //this.speed *= this.friction
  // don't let player leaves the world's boundary
  if (this.x < 0) {
    this.x = 0;
  }
  if (this.y < 0) {
    this.y = 0;
  }
  if (this.x + this.width > worldWidth) {
    this.x = worldWidth - this.width;
  }
  if (this.y + this.height > worldHeight) {
    this.y = worldHeight - this.height;
    this.onGround = true
  }
}

Player.prototype.draw = function(context, xView, yView) {
  context.save();
  context.fillStyle = "#353b48";
  // before drawing we need to convert player world's position to canvas position
  context.translate(-xView, -yView)
  if(this.sprite){
    //context.drawImage
  } else {
    context.fillRect((this.x), (this.y), this.width, this.height);
  }
  context.restore();
}

Player.prototype.useGrabbingGun = function(point, d, context, bullet){
  d = distance({x: this.x+this.width/2, y: this.y+this.height/2}, point);
  const vect = normalizeVect({x: point.x-(this.x+this.width/2), y: point.y-(this.y+this.height/2)}, d)
  const velX = vect.x;
  const velY = vect.y;
  this.velY = 0;
  this.g = 0;

  //const playerToBullet = distance({x: this.x+this.width/2, y:this.y+this.height/2}, {x: bullet.x, y: bullet.y})
  if(bullet !== null){
    bullet.velX = velX
    bullet.velY = velY
    shoot(this.x+this.width/2, this.y+this.height/2, bullet.x, bullet.y, context)
  } else if(d >= 25){
    this.x += velX*5;
    this.y += velY*5;
    shoot(this.x+this.width/2, this.y+this.height/2, point.x, point.y, context)
    d = distance({x: this.x+this.width/2, y: this.y+this.height/2}, point);
  } else {
    point = null
  }
}

function shoot(x1, y1, x2, y2, ctx){
  ctx.save()
  ctx.translate(-camera.x, -camera.y)
  drawLine(x1, y1, x2, y2, ctx)
  ctx.restore()
}

function drawLine(x1, y1, x2, y2, ctx){
  ctx.strokeStyle = "red"
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}