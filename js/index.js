class Renderer {
  constructor(canvas, world) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.world = world;
    this.scaleX = canvas.width / world.width;
    this.scaleY = canvas.height / world.height;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  convertRect(x, y, dx, dy) {
    return [
      x * this.scaleX,
      this.canvas.height - y * this.scaleY,
      this.scaleX * dx,
      -this.scaleY * dy,
    ];
  }

  drawSnake(snake) {
    const head = snake.getHead();
    this.context.fillStyle = "#00FF00";
    this.context.fillRect(...this.convertRect(head[0], head[1], 1, 1));

    const rest = snake.getArray().slice(1);
    this.context.fillStyle = "#000000";
    rest.forEach(([x, y]) => {
      this.context.fillRect(...this.convertRect(x, y, 1, 1));
    });
  }

  drawFood(food) {
    this.context.fillStyle = "#FFa500";
    this.context.fillRect(...this.convertRect(food.x, food.y, 1, 1));
  }
}

function createCanvas({ elementId, width, height }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  document.getElementById(elementId).appendChild(canvas);
  return canvas;
}

////////////////////////////////////////////////////////////////////////////

const world = new World();
const snake = new Snake([
  Math.round(world.width / 2),
  Math.round(world.height / 2),
]);
const food = new Food(20, 20);

const scoreElement = document.getElementById("score");

const canvas = createCanvas({
  elementId: "main",
  width: world.width * 20,
  height: world.height * 20,
});
const renderer = new Renderer(canvas, world);

addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    snake.turnLeft();
  } else if (event.key === "ArrowRight") {
    snake.turnRight();
  }
});

const intervalId = setInterval(() => {
  tick(world, snake, food);
  renderer.clear();
  renderer.drawSnake(snake);
  renderer.drawFood(food);
  scoreElement.innerHTML = `${snake.getArray().length - 5}`;

  if (!snake.isAlive) {
    clearInterval(intervalId);
    alert("Game Over");
  }
}, 100);
