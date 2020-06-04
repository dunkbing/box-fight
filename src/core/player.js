export default function Player(x, y){
  //x, y represent the coordinate of player's center on the game world(not the canvas)
  this.x = x
  this.y = y
  this.speed = 200
  this.width = 50
  this.height = 50
}

Player.prototype.update = function(/*time between each frame*/step, worldWidth, worldHeight){
  if (Game.controls.left)
    this.x -= this.speed * step;
  if (Game.controls.up)
    this.y -= this.speed * step;
  if (Game.controls.right)
    this.x += this.speed * step;
  if (Game.controls.down)
    this.y += this.speed * step
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
  context.fillStyle = "black";
  // before draw we need to convert player world's position to canvas position            
  context.fillRect((this.x - this.width / 2) - xView, (this.y - this.height / 2) - yView, this.width, this.height);
  context.restore();
}