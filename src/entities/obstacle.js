import { Rectangle } from "./rectangle.js";

export default function Obstacle(x, y){
  Rectangle.call(this, x, y)
  this.width = 50
  this.height = 50
  this.speed = 200
}

Obstacle.prototype = new Rectangle()
Obstacle.prototype.constructor = Obstacle

Obstacle.prototype.draw = function(context, xView, yView) {
  // draw a simple rectangle shape as our player model
  context.save();
  context.fillStyle = "#192a56";
  // before draw we need to convert player world's position to canvas position
  context.translate(-xView, -yView)  
  context.fillRect((this.x - this.width / 2), (this.y - this.height / 2), this.width, this.height);
  context.restore();
}