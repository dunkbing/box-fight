const colors = ['#ffc000', '#ff3b3b', '#ff8400'];
const bubbles = 25;

const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));

const explode = (x, y, width, height) => {
  const particles = [];
  const ratio = window.devicePixelRatio;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');

  c.style.position = 'absolute';
  c.style.left = (x - 50) + 'px';
  c.style.top = (y - 50) + 'px';
  c.style.pointerEvents = 'none';
  c.style.width = 100 + 'px';
  c.style.height = 100 + 'px';
  c.style.zIndex = 100;
  c.width = width || 200 * ratio;
  c.height = height || 200 * ratio;
  document.body.appendChild(c);

  for (let i = 0; i < bubbles; i++) {
    particles.push({
      x: c.width / 2,
      y: c.height / 2,
      radius: r(10, 15),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: r(0, 360, true),
      speed: r(8, 12),
      friction: 0.9,
      opacity: r(0, 0.5, true),
      yVel: 0,
      gravity: 0.1
    });
  }

  render(particles, ctx, c.width, c.height);
  setTimeout(() => document.body.removeChild(c), 1000);
}

const render = (particles, ctx, width, height) => {
  requestAnimationFrame(() => render(particles, ctx, width, height));
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, i) => {
    p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
    p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

    p.opacity -= 0.01;
    p.speed *= p.friction;
    p.radius *= p.friction;
    p.yVel += p.gravity;
    p.y += p.yVel;

    if (p.opacity < 0 || p.radius < 0) return;

    ctx.beginPath();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  });

  return ctx;
}


export {explode}