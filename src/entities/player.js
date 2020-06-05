import {Rectangle} from './rectangle.js'
export default function Player(x, y){
  //x, y represent the coordinate of player's center on the game world(not the canvas)
  Rectangle.call(this, x, y)
  this.speed = 200
  this.width = 50
  this.height = 50
}

Player.prototype = new Rectangle()
Player.prototype.constructor = Player

Player.prototype.update = function(/*time between each frame in seconds*/deltaTime, worldWidth, worldHeight){
  if (Game.controls.left)
    this.x -= this.speed * deltaTime;
  if (Game.controls.up)
    this.y -= this.speed * deltaTime;
  if (Game.controls.right)
    this.x += this.speed * deltaTime;
  if (Game.controls.down)
    this.y += this.speed * deltaTime
  // don't let player leaves the world's boundary
  if (this.x - this.width / 2 < 0) {
    this.x = this.width / 2;
  }
  if (this.y - this.height / 2 < 0) {
    this.y = this.height / 2;
  }
  if (this.x + this.width / 2 > worldWidth) {
    this.x = worldWidth - this.width / 2;
  }
  if (this.y + this.height / 2 > worldHeight) {
    this.y = worldHeight - this.height / 2;
  }
}

Player.prototype.draw = function(context, xView, yView) {
  // draw a simple rectangle shape as our player model
  context.save();
  context.fillStyle = "#353b48";
  // before draw we need to convert player world's position to canvas position
  context.translate(-xView, -yView)  
  context.fillRect((this.x - this.width / 2), (this.y - this.height / 2), this.width, this.height);
  context.restore();
}