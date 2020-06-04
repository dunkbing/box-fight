export default function Map(width, height){
  this.width = width
  this.height = height
  this.background = null
}

Map.prototype.generate = function() {
  /* let ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = this.width;
  ctx.canvas.height = this.height;

  const rows = ~~(this.width / 44) + 1;
  const columns = ~~(this.height / 44) + 1;

  let color = "red";
  ctx.save();
  ctx.fillStyle = "red";
  for (var x = 0, i = 0; i < rows; x += 44, i++) {
    ctx.beginPath();
    for (var y = 0, j = 0; j < columns; y += 44, j++) {
      ctx.rect(x, y, 40, 40);
    }
    color = (color == "red" ? "blue" : "red");
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
  ctx.restore();

  // store the generate map as this image texture
  this.image = new Image();
  this.image.src = ctx.canvas.toDataURL("image/png"); */
  this.background = new Image()
  this.background.src = '../game-map.jpg'

  // clear context
  //ctx = null;
}

Map.prototype.draw = function(context, xView, yView) {
  let sx = xView;
  let sy = yView;

  let sWidth = context.canvas.width;
  let sHeight = context.canvas.height;

  if (this.background.width - sx < sWidth) {
    sWidth = this.background.width - sx;
  }
  if (this.background.height - sy < sHeight) {
    sHeight = this.background.height - sy;
  }
  let dx = 0;
  let dy = 0;
  let dWidth = sWidth;
  let dHeight = sHeight;
  console.log(dWidth, dHeight)
  context.drawImage(this.background, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}