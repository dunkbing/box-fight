function RigidBody(img) {
  this.x = Math.random() * 500 + 50
  this.y = 40
  this.width = 40
  this.height = 40
  this.speed = 5
  this.velX = 0
  this.velY = 1
  this.jumping = false
  this.grounded = false
  this.img = img
  this.img.width = "10%"
  this.imgLoaded = false
  this.img.onload = function () {
    this.imgLoaded = true
  }.bind(this)
  this.distance = 0
  this.moveLeft = false

  this.update = function() {
    this.y += this.velY;
    if (this.velX <= 5 && this.grounded) {
      this.velX++
    }
    if (this.distance >= 0 && !this.moveLeft) {
      this.distance++
      this.x += this.velX;
      if (this.distance == 49) this.moveLeft = true
    }
    else if (this.distance <= 50 && this.moveLeft) {
      this.distance--
      this.x -= this.velX
      if (this.distance == 1) this.moveLeft = false
    }

    this.velX *= friction;
    if (this.velY <= 3 && !this.grounded) {
      this.velY += gravity;
    }
  }
}

export { RigidBody }