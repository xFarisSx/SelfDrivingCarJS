const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");

const lineNumber = 2;

const road = new Road(10, canvas.width - 20, lineNumber);
const car = new Car(
  road.getLaneCenter(1),
  100,
  30,
  50,
  "KEYS",
  undefined,
  "blue"
);
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 1)];

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw();
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(ctx, road.borders, [car]);
  }

  car.update(ctx, road.borders, traffic);
  ctx.restore();

  requestAnimationFrame(update);
}
update();
