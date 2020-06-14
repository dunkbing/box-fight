import { Rectangle } from "./rectangle.js";

export default function Obstacle(x, y, width, height, sprite, color){
  Rectangle.call(this, x, y, width, height, sprite)
  this.speed = 200
  this.color = color
  this.velX = Math.random()*70+30
  this.velY = Math.random()*70+30
  //this.sprite = sprite
}

Obstacle.prototype = new Rectangle()
Obstacle.prototype.constructor = Obstacle

Obstacle.prototype.draw = function(context, xView, yView) {
  // draw a simple rectangle shape as our player model
  context.save();
  context.fillStyle = this.color;
  // before draw we need to convert obstacle world's position to canvas position
  context.translate(-xView, -yView)
  if(this.sprite){
    console.log(this.sprite)
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(this.sprite, (this.x - this.width / 2), (this.y - this.height / 2))
  } else{
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  context.restore();
}

Obstacle.prototype.update = function(step, boundary){
  if(this.x <= 0 || this.x + this.width >= boundary.width) this.velX = -this.velX
  if(this.y <= 0 || this.y + this.height >= boundary.height) this.velY = -this.velY
  this.x += this.velX*step
  this.y += this.velY*step
}