export default function Animation(sprite, context){
  this.sprite = sprite;
  this.context = context;
}

Animation.prototype.drawFrame = function(frameX, frameY, canvasX, canvasY, width, height) {
  this.context.drawImage(this.sprite,
    frameX * width, frameY * height, width, height,
    canvasX, canvasY, this.width, this.height);
}