class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = new Vector(0, 0);
    this.maxSpeed = 2;
    this.a = 0.05;

    this.angularA = 0.01;
    this.friction = 0.98;
    this.angle = Math.PI / 2;

    this.controls = new Controls();

    this.lastState = 0; // 1:ileri 2

    this.sensor = new Sensor(this);
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle - Math.PI / 2);
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.restore();

    this.sensor.draw(ctx);
  }

  move() {
    let add = new Vector(
      this.a * Math.cos(this.angle),
      Math.sin(this.angle) * this.a
    );
    this.controls.forward
      ? this.speed.subtract(add)
      : this.controls.back
      ? this.speed.add(add.mult(1 / 4))
      : 0;

    if (this.speed.mag() > this.maxSpeed) {
      this.speed = this.speed.normalize();
      this.speed.mult(this.maxSpeed);
    }
    this.applyFriction();

    this.y += this.speed.y;
    this.x += this.speed.x;
  }

  applyFriction() {
    this.speed.mult(this.friction);
  }

  calcDirection() {
    this.angle = this.controls.right
      ? this.angle + this.angularA
      : this.controls.left
      ? this.angle - this.angularA
      : this.angle;

    if (!(this.controls.forward || this.controls.back))
      this.speed.reDirect(this.angle, this.lastState);
  }

  updateState() {
    if (this.controls.forward) {
      this.lastState = 1;
    } else if (this.controls.back) {
      this.lastState = 2;
    }
  }

  update(ctx, borders) {
    this.calcDirection();
    this.updateState();
    this.move();

    this.sensor.update(borders);
    this.draw(ctx);
  }
}
