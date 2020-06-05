import { Rectangle } from "./rectangle.js";

const AXIS = {
  NONE: 1,
  HORIZONTAL: 2,
  VERTICAL: 3,
  BOTH: 4
};
export default function Camera(x, y, viewportWidth, viewportHeight, worldWidth, worldHeight){
  Rectangle.call(this, x, y, viewportWidth, viewportHeight)
  this.xDeadZone = 0 //min distance to the horizontal border
  this.yDeadZone = 0 //min distance to the vertical border
  // allow camera to move in vertical and horizontal axis
  this.axis = AXIS.BOTH;
  this.following = null
  this.viewportRect = new Rectangle(this.x, this.y, this.width, this.height)
  this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight)
}

Camera.prototype = new Rectangle()
Camera.prototype.constructor = Camera

Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone){
  this.following = gameObject
  this.xDeadZone = xDeadZone
  this.yDeadZone = yDeadZone
}

Camera.prototype.update = function() {
  // keep following the player (or other desired object)
  if (this.following !== null) {
    if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
      // moves camera on horizontal axis based on followed object position
      if (this.following.x - this.x + this.xDeadZone > this.width)
        this.x = this.following.x - (this.width - this.xDeadZone);
      else if (this.following.x - this.xDeadZone < this.x)
        this.x = this.following.x - this.xDeadZone;

    }
    if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
      // moves camera on vertical axis based on followed object position
      if (this.following.y - this.y + this.yDeadZone > this.height)
        this.y = this.following.y - (this.height - this.yDeadZone);
      else if (this.following.y - this.yDeadZone < this.y)
        this.y = this.following.y - this.yDeadZone;
    }

  }

  // update viewportRect
  this.viewportRect.set(this.x, this.y);

  // don't let camera leaves the world's boundary
  if (!this.viewportRect.within(this.worldRect)) {
    if (this.viewportRect.x < this.worldRect.x)
      this.x = this.worldRect.x;
    if (this.viewportRect.y < this.worldRect.y)
      this.y = this.worldRect.y;
    if (this.viewportRect.right > this.worldRect.right)
      this.x = this.worldRect.right - this.width;
    if (this.viewportRect.bottom > this.worldRect.bottom)
      this.y = this.worldRect.bottom - this.height;
  }

}