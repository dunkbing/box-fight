import { Rectangle } from "../entities/rectangle.js";

export default function Bullet(x, y, width, height, sprite, velX, velY){
  Rectangle.call(this, x, y, width, height, sprite);
  this.velX = velX;
  this.velY = velY;
}

Bullet.prototype = new Rectangle()
Bullet.prototype.constructor = Bullet

Bullet.prototype.draw = function(context, xView, yView){
  context.save();
  context.fillStyle = "#192a56";
  // before draw we need to convert obstacle world's position to canvas position
  context.translate(-xView, -yView)
  if(this.sprite){
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(this.sprite, this.x, this.y)
  } else{
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  context.restore();
}

Bullet.prototype.update = function(){
  this.x += this.velX*8
  this.y += this.velY*8
}