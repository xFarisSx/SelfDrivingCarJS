class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
  }

  reDirect(angle, state) {
    let newme = new Vector(1 * Math.cos(angle), 1 * Math.sin(angle));
    newme.mult(this.mag());
    if (state == 1) newme.mult(-1);
    this.x = newme.x;
    this.y = newme.y;
  }

  mult(z) {
    this.x *= z;
    this.y *= z;
    return this;
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;

    this.angle = -Math.atan2(this.y, this.x);
    return this;
  }
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;

    this.angle = Math.atan2(this.y, this.x);
    return this;
  }
  normalize() {
    let newme = new Vector(this.x, this.y);
    newme.mult(1 / this.mag());
    return newme;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  vLerp(v2, t) {
    let newme = new Vector(lerp(this.x, v2.x, t), lerp(this.y, v2.y, t));
    return newme;
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}
