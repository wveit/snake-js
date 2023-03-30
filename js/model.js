class World {
  width = 50;
  height = 25;
  border = "WALL"; // NONE | WRAP | WALL
}

class Food {
  constructor(x = -1, y = -1) {
    this.setPosition(x, y);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  move(world, snake) {
    const newX = Math.round(Math.random() * world.width);
    const newY = Math.round(Math.random() * world.height);
    this.setPosition(newX, newY);
  }
}

class Snake {
  constructor(headPosition) {
    this.array = [headPosition];
    this.array.push([headPosition[0] - 1, headPosition[1]]);
    this.array.push([headPosition[0] - 2, headPosition[1]]);
    this.array.push([headPosition[0] - 3, headPosition[1]]);
    this.array.push([headPosition[0] - 4, headPosition[1]]);
    this.direction = 0;
    this.allowedToTurn = true;
    this.isAlive = true;
  }
  atFood(food) {
    const head = this.getHead();
    return food.x == head[0] && food.y == head[1];
  }
  isOutsideBorder(world) {
    const head = this.getHead();
    const [x, y] = head;
    if (x < 0) return true;
    else if (x >= world.width) return true;
    if (y < 0) return true;
    else if (y >= world.height) return true;
    return false;
  }
  wrap(world) {
    const head = this.getHead();
    const [x, y] = head;
    let newX = x,
      newY = y;

    if (x < 0) newX = world.width - 1;
    else if (x >= world.width) newX = 0;
    if (y < 0) newY = world.height - 1;
    else if (y >= world.height) newY = 0;

    head[0] = newX;
    head[1] = newY;
  }
  isTouchingSelf() {
    const head = this.getHead();
    const rest = this.array.slice(1);
    for (const segment of rest) {
      if (segment[0] === head[0] && segment[1] === head[1]) return true;
    }
    return false;
  }
  turnLeft() {
    if (!this.allowedToTurn) return;
    this.direction += Math.PI / 2;
    this.allowedToTurn = false;
  }
  turnRight() {
    if (!this.allowedToTurn) return;
    this.direction -= Math.PI / 2;
    this.allowedToTurn = false;
  }
  advanceHead() {
    const head = this.array[0];
    const newHead = [
      Math.round(head[0] + Math.cos(this.direction)),
      Math.round(head[1] + Math.sin(this.direction)),
    ];
    this.array.unshift(newHead);
    this.allowedToTurn = true;
  }
  advanceTail() {
    this.array.pop();
  }
  getArray() {
    return this.array;
  }
  getHead() {
    return this.array[0];
  }
  debug() {
    return JSON.stringify(this.array);
  }
}
