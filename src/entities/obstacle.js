import { Rectangle } from "./rectangle.js";

export default function Obstacle(x, y, sprite){
  Rectangle.call(this, x, y)
  this.width = 50
  this.height = 50
  this.speed = 200
  this.sprite = sprite
}

Obstacle.prototype = new Rectangle()
Obstacle.prototype.constructor = Obstacle

Obstacle.prototype.draw = function(context, xView, yView) {
  // draw a simple rectangle shape as our player model
  context.save();
  context.fillStyle = "#192a56";
  // before draw we need to convert player world's position to canvas position
  context.translate(-xView, -yView)
  if(this.sprite){
    context.drawImage(this.sprite, (this.x - this.width / 2), (this.y - this.height / 2))
  } else{
    context.fillRect((this.x - this.width / 2), (this.y - this.height / 2), this.width, this.height);
  }
  context.restore();
}