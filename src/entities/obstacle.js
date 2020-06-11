import { Rectangle } from "./rectangle.js";

export default function Obstacle(x, y, width, height, sprite){
  Rectangle.call(this, x, y, width, height, sprite)
  this.speed = 200
  //this.sprite = sprite
}

Obstacle.prototype = new Rectangle()
Obstacle.prototype.constructor = Obstacle

Obstacle.prototype.draw = function(context, xView, yView) {
  // draw a simple rectangle shape as our player model
  context.save();
  context.fillStyle = "#192a56";
  // before draw we need to convert obstacle world's position to canvas position
  context.translate(-xView, -yView)
  if(this.sprite){
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(this.sprite, (this.x - this.width / 2), (this.y - this.height / 2))
  } else{
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  context.restore();
}