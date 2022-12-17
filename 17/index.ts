import _ from "lodash";
import { readFile } from "../common";

const start = Date.now();

// 0, 0 is the bottom left

const rockInput = [
  ["####"],
  [".#.", "###", ".#."],
  ["..#", "..#", "###"],
  ["#", "#", "#", "#"],
  ["##", "##"],
];

class Coords {
  x: number;
  y: number;
}

type Rock = Coords[];

const rocks: Rock[] = rockInput.map((rockString) => {
  const map: Coords[] = [];
  const height = rockString.length - 1;
  rockString.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char == "#") {
        map.push({ x, y: height - y });
      }
    });
  });
  return map;
});

function printRock(rock: Rock) {
  const lines = [];
  for (var y = 0; y <= 3; y++) {
    var line = [];
    for (var x = 0; x <= 3; x++) {
      if (rock.some((coord) => coord.x == x && coord.y == y)) {
        line.push("#");
      } else {
        line.push(".");
      }
    }
    lines.push(line.join(""));
  }
  lines.reverse().forEach((line) => {
    console.log(line);
  });
}

const leftWall = 0;
const rightWall = 8;
const floor = 0;

function printScene(rock: Rock) {
  const lines = [];
  for (var y = floor; y <= currentTop + 10; y++) {
    var line = [];
    for (var x = leftWall; x <= rightWall; x++) {
      if (y == floor && (x == leftWall || x == rightWall)) {
        line.push("+");
      } else if (y == floor) {
        line.push("-");
      } else if (x == leftWall || x == rightWall) {
        line.push("|");
      } else if (settledRocks.some((coord) => coord.x == x && coord.y == y)) {
        line.push("#");
      } else if (rock.some((coord) => coord.x == x && coord.y == y)) {
        line.push("@");
      } else {
        line.push(".");
      }
    }
    lines.push(line.join(""));
  }
  lines.reverse().forEach((line) => {
    console.log(line);
  });
}

function* rockSource() {
  var count = 0;
  while (true) {
    var rock = rocks[count % rocks.length];
    count++;
    yield _.cloneDeep(rock);
  }
}

const rockGenerator = rockSource();

function getNextRock(): Rock {
  var rock = rockGenerator.next().value;
  if (!rock) {
    throw new Error();
  } else {
    return rock;
  }
}

function* instructionSource() {
  var count = 0;
  while (true) {
    var instruction = instructions[count % instructions.length];
    count++;
    yield _.cloneDeep(instruction);
  }
}

const instructionGenerator = instructionSource();

function getNextInstruction(): string {
  var instruction = instructionGenerator.next().value;
  if (!instruction) {
    throw new Error();
  } else {
    return instruction;
  }
}

var data = readFile("input");
const instructions = data.flatMap((line) => line.split(""));

console.log(instructions);

var currentTop = 0;
function getStartLocation(): Coords {
  return {
    x: 3,
    y: currentTop + 4,
  };
}

function getNewRock(startingLocation: Coords) {
  var rock = getNextRock();
  return moveRock(rock, startingLocation);
}

function moveRock(rock: Rock, translation: Coords) {
  var newRock = rock.map((coord) => {
    return {
      x: coord.x + translation.x,
      y: coord.y + translation.y,
    };
  });
  return newRock;
}

export function getMax(rock: Rock) {
  const maxX = rock.reduce((a, c) => {
    return c.x > a ? c.x : a;
  }, -Infinity);
  return maxX;
}

export function getMin(rock: Rock) {
  const minX = rock.reduce((a, c) => {
    return c.x < a ? c.x : a;
  }, Infinity);
  return minX;
}

function intersectsRock(rock: Rock, coord: Coords): boolean {
  var newRock = moveRock(rock, coord);
  return settledRocks.some((settled) => {
    return newRock.some((rock) => rock.x == settled.x && rock.y == settled.y);
  });
}

const shiftLeft = { x: -1, y: 0 };
const shiftRight = { x: 1, y: 0 };
const shiftDown = { x: 0, y: -1 };

function moveHorizontal(rock: Rock) {
  const instruction = getNextInstruction();
  if (instruction == "<") {
    const minX = getMin(rock);
    if (minX == leftWall + 1 || intersectsRock(rock, shiftLeft)) {
      return rock;
    } else {
      return moveRock(rock, shiftLeft);
    }
  } else {
    const maxX = getMax(rock);
    if (maxX == rightWall - 1 || intersectsRock(rock, shiftRight)) {
      return rock;
    } else {
      return moveRock(rock, shiftRight);
    }
  }
}

function moveDown(rock: Rock) {
  const minY = rock.reduce((a, c) => {
    return c.y < a ? c.y : a;
  }, Infinity);
  if (minY == floor + 1 || intersectsRock(rock, shiftDown)) {
    return { rock, moved: false };
  } else return { rock: moveRock(rock, shiftDown), moved: true };
}

var rockCount = 0;
var settledRocks: Coords[] = [];
var check = Infinity;

function printCheck(rock: Rock) {
  if (check != Infinity) {
    if (rockCount == check) {
      printScene(rock);
    }
  }
}

while (rockCount < 2022) {
  var rock = getNewRock(getStartLocation());
  // printScene(rock);
  rockCount++;

  var moved = true;
  while (moved) {
    rock = moveHorizontal(rock);
    printCheck(rock);
    var result = moveDown(rock);
    rock = result.rock;
    printCheck(rock);
    moved = result.moved;
  }
  settledRocks.push(...rock);
  currentTop = settledRocks.reduce((a, c) => {
    return c.y > a ? c.y : a;
  }, -Infinity);
  // console.log("Rock stopped");
}

console.log(currentTop);

const end = Date.now();
console.log(`Time taken: ${end - start}ms`);

export {};
