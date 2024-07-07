class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 2, color = "red") {
    this.controlType = controlType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;

    this.speed = new Vector(0, 0);
    this.maxSpeed = maxSpeed;
    this.a = 0.05;

    this.angularA = 0.01;
    this.friction = 0.98;
    this.angle = Math.PI / 2;

    this.controls = new Controls(controlType);

    this.reCalc();

    this.lastState = 0; // 1:ileri 2
    this.damaged = false;
    this.intersections = [];

    if (controlType != "DUMMY") this.sensor = new Sensor(this);
  }

  draw(ctx) {
    // ctx.save();
    // ctx.beginPath();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle - Math.PI / 2);
    // ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    // ctx.fill();
    // ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.borders[0][0].x, this.borders[0][0].y);
    for (let i = 0; i < this.borders.length; i++) {
      ctx.lineTo(this.borders[i][1].x, this.borders[i][1].y);
    }

    ctx.fillStyle = !this.damaged ? this.color : "gray";
    ctx.fill();
    ctx.restore();

    if (this.sensor) this.sensor.draw(ctx);
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

    this.reCalc();
  }

  applyFriction() {
    this.speed.mult(this.friction);
  }

  reCalc() {
    this.topLeft = { x: this.x - this.width / 2, y: this.y - this.height / 2 };
    this.topRight = { x: this.x + this.width / 2, y: this.y - this.height / 2 };
    this.bottomLeft = {
      x: this.x - this.width / 2,
      y: this.y + this.height / 2,
    };
    this.bottomRight = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
    this.corners = [
      this.topLeft,
      this.topRight,
      this.bottomLeft,
      this.bottomRight,
    ];

    this.borders = [
      [this.topLeft, this.bottomLeft],
      [this.bottomLeft, this.bottomRight],
      [this.bottomRight, this.topRight],
      [this.topRight, this.topLeft],
    ];

    this.corners.forEach((c) => {
      c.x -= this.x;
      c.y -= this.y;

      const newX =
        c.x * Math.cos(this.angle - Math.PI / 2) -
        c.y * Math.sin(this.angle - Math.PI / 2);
      const newY =
        c.x * Math.sin(this.angle - Math.PI / 2) +
        c.y * Math.cos(this.angle - Math.PI / 2);

      c.x = newX;
      c.y = newY;

      c.x += this.x;
      c.y += this.y;
    });

    `
    Another Method:
      111111111
      1      11
      1    1  1
      1  1    1
      11) = a 1   
      111111111
      the hypo/2 = rad

      ornek topright = this.x(center) + sin(angle+alpha)*rad
    
    `;
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

  checkIntersect() {}

  checkCol(borders, traffic) {
    let intersections = [];
    [...borders, ...traffic.map((t) => t.borders).flat()].forEach((b) => {
      this.borders.forEach((t) => {
        let intersection = getIntersection(t[0], t[1], b[0], b[1]);
        if (intersection != null) intersections.push(intersection);
      });
    });
    this.intersections = intersections;
    if (this.intersections.length != 0) this.damaged = true;
    // else this.damaged = false;
  }

  update(ctx, borders, traffic) {
    if (!this.damaged) {
      this.calcDirection();
      this.updateState();
      this.move();
      this.checkCol(borders, traffic);
    }
    if (this.sensor) this.sensor.update(borders, traffic);
    this.draw(ctx);
  }
}
