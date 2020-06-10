export default function Gun(x, y){
  this.x = x
  this.y = y
  this.c = document.createElement('canvas');
  this.ctx = this.c.getContext('2d');
  this.img = new Image()
  this.img.src = "../../gun.png"

  this.c.style.position = 'absolute';
  this.c.style.left = (this.x) + 'px';
  this.c.style.top = (this.y) + 'px';
  this.c.style.backgroundColor = "white"
  this.c.style.pointerEvents = 'none';
  this.c.style.width = 50 + 'px';
  this.c.style.height = 50 + 'px';
  this.c.style.zIndex = 100;
  document.body.appendChild(this.c)

  this.draw = function(x, y, angle){
    //this.ctx.save()
    //this.ctx.fillStyle = "white"
    //this.ctx.scale(0.2, 0.2)
    this.ctx.translate(this.c.width/2, this.c.height/2)
    this.ctx.rotate(45*Math.PI/180)
    this.ctx.fillRect(0, 0, 100, 20)
    this.c.style.left = x + 'px';
    this.c.style.top = y + 'px';
    //this.ctx.restore()
    //this.ctx.clearRect(0, 0, this.c.width, this.c.height)
    //requestAnimationFrame(this.draw)
  }
}