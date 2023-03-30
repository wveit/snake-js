class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawSnake(snake) {
    snake.getArray().forEach(([x, y]) => {
      this.context.fillRect(x, this.canvas.height - y, 1, 1);
    });
  }
  drawFood(food) {
    this.context.fillRect(food.x, this.canvas.height - food.y, 1, 1);
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
const snake = new Snake([world.width / 2, world.height / 2]);
const food = new Food(20, 20);

const canvas = createCanvas({
  elementId: "main",
  width: world.width,
  height: world.height,
});
const renderer = new Renderer(canvas);

function tick(world, snake, food) {
  if (!snake.isAlive) return;

  snake.advanceHead();

  if (world.border === "WRAP") {
    snake.wrap(world);
  } else if (world.border === "WALL" && snake.isOutsideBorder(world)) {
    snake.isAlive = false;
  }

  if (snake.isTouchingSelf()) {
    snake.isAlive = false;
  }

  if (snake.atFood(food)) {
    food.move(world, snake);
  } else {
    snake.advanceTail();
  }
}

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

  if (!snake.isAlive) {
    clearInterval(intervalId);
    alert("Game Over");
  }
}, 300);
