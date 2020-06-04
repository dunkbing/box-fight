import { Rectangle } from "./rectangle.js";

const AXIS = {
  NONE: 1,
  HORIZONTAL: 2,
  VERTICAL: 3,
  BOTH: 4
};
export default function Camera(xView, yView, viewportWidth, viewportHeight, worldWidth, worldHeight){
  this.xView = xView || 0
  this.yView = yView || 0
  this.xDeadZone = 0 //min distance to the horizontal border
  this.yDeadZone = 0 //min distance to the vertical border
  this.wView = viewportWidth
  this.hView = viewportHeight
  // allow camera to move in vertical and horizontal axis
  this.axis = AXIS.BOTH;
  this.following = null
  this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView)
  this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight)
}

Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone){
  this.following = gameObject
  this.xDeadZone = xDeadZone
  this.yDeadZone = yDeadZone
}

Camera.prototype.update = function(){
  if(this.following !== null){
    if(this.axis === AXIS.HORIZONTAL || this.axis === AXIS.BOTH){
      if (this.following.x - this.xView + this.xDeadZone > this.wView)
        this.xView = this.following.x - (this.wView - this.xDeadZone)
      else if (this.following.x - this.xDeadZone < this.xView)
        this.xView = this.following.x - this.xDeadZone
    }
    if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
      if (this.following.y - this.yView + this.yDeadZone > this.hView)
        this.yView = this.following.y - (this.hView - this.yDeadZone);
      else if (this.following.y - this.yDeadZone < this.yView)
        this.yView = this.following.y - this.yDeadZone;
    }
  }
  
  this.viewportRect.set(this.xView, this.yView);
  if (!this.viewportRect.within(this.worldRect)) {
    if (this.viewportRect.left < this.worldRect.left)
      this.xView = this.worldRect.left;
    if (this.viewportRect.top < this.worldRect.top)
      this.yView = this.worldRect.top;
    if (this.viewportRect.right > this.worldRect.right)
      this.xView = this.worldRect.right - this.wView;
    if (this.viewportRect.bottom > this.worldRect.bottom)
      this.yView = this.worldRect.bottom - this.hView;
  }
}