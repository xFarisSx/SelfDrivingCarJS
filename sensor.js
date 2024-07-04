class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 20;
    this.rayLength = 150;
    this.raySpread = Math.PI * 2;

    this.rays = [];
  }

  draw(ctx) {
    this.rays.forEach((ray) => {
      ctx.beginPath();
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(ray[1].x, ray[1].y);
      ctx.strokeStyle = "yellow";
      ctx.stroke();

      ray[2].forEach((i) => {
        if (!i) return;
        ctx.beginPath();
        ctx.moveTo(i.x, i.y);
        ctx.lineTo(ray[1].x, ray[1].y);
        ctx.strokeStyle = "black";
        ctx.stroke();
      });
    });
  }

  #castRays(borders) {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      let rayAngle = lerp(
        -this.raySpread / 2,
        this.raySpread / 2,
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
      );
      rayAngle += this.car.angle - Math.PI;
      let start = { x: this.car.x, y: this.car.y };
      let end = {
        x: this.car.x + this.rayLength * Math.cos(rayAngle),
        y: this.car.y + this.rayLength * Math.sin(rayAngle),
      };
      let intersections = [];
      borders.forEach((b) => {
        let intersection = getIntersection(start, end, b[0], b[1]);
        intersections.push(intersection);
      });
      this.rays.push([start, end, intersections]);
    }
  }

  update(borders) {
    this.#castRays(borders);
  }
}
