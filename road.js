class Road {
  constructor(x, width, count) {
    this.x = x;
    this.width = width;
    this.count = count;
    this.left = x;
    this.right = x + width;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneI) {
    const laneWidth = this.width / (this.count + 1);
    if (laneI > this.count) laneI = this.count;
    if (laneI < 0) laneI = 0;
    return this.left + laneWidth / 2 + laneI * laneWidth;
  }
  draw() {
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.stroke();
    });

    ctx.save();
    for (let i = 0; i < this.count; i++) {
      let x = (i + 1) * (this.width / (this.count + 1));
      ctx.beginPath();
      ctx.moveTo(this.x + x, this.top);
      ctx.lineTo(this.x + x, this.bottom);
      ctx.strokeStyle = "white";
      ctx.setLineDash([30, 30]);
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.restore();
  }
}
