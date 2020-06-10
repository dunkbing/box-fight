function Rectangle(x, y, width, height, sprite){
  this.x = x || 0
  this.y = y || 0
  this.width = width || 0
	this.height = height || 0
	this.sprite = sprite
  this.right = this.x+this.width
	this.bottom = this.y+this.height
	this.midX = this.x+this.width/2
	this.midY = this.y+this.height/2
	this.onGround = this.y+this.height === this.bottom
}

Rectangle.prototype.set = function(x, y, width, height){
  this.x = x
  this.y = y
  this.width = width || this.width
  this.height = height || this.height
  this.right = (this.x + this.width)
  this.bottom = (this.y + this.height)
}

Rectangle.prototype.within = function(r){
  return r.x <= this.x && r.y <= this.y && r.right >= this.right && r.bottom >= this.bottom
}

Rectangle.prototype.overlaps = function(r) {
  return (this.x < r.right &&
    r.x < this.right &&
    this.top < r.bottom &&
    r.top < this.bottom);
}

Rectangle.prototype.collide = function(otherRect) {
	const vectorX = (this.x + (this.width / 2)) - (otherRect.x + (otherRect.width / 2))
	const vectorY = (this.y + (this.height / 2)) - (otherRect.y + (otherRect.height / 2))

	const halfWidth = (this.width / 2) + (otherRect.width / 2)
	const halfHeight = (this.height / 2) + (otherRect.height / 2)

	let collisionDirection = null
	if (Math.abs(vectorX) < halfWidth && Math.abs(vectorY) < halfHeight) {
		const offsetX = halfWidth - Math.abs(vectorX)
		const offsetY = halfHeight - Math.abs(vectorY)
		if (offsetX < offsetY) {
			if (vectorX > 0) {
				collisionDirection = "left"
				this.x += offsetX
			} else {
				collisionDirection = "right"
				this.x -= offsetX
			}
		} else {
			if (vectorY > 0) {
				collisionDirection = "top";
				this.y += offsetY;
			} else {
				collisionDirection = "bottom";
				this.y -= offsetY;
			}
		}
	}
	return collisionDirection
}

export {Rectangle}
