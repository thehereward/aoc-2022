import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

// 0, 0 is the bottom left

const numberOfRocks = 1000000000000;
// const numberOfRocks = 2022;

var matchFound = false;

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
var currentFloor = floor;

function printScene(rock: Rock) {
  const lines = [];
  for (var y = currentFloor; y <= currentTop + 10; y++) {
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

var instructionCount = 0;
function* instructionSource() {
  while (true) {
    var instruction = instructions[instructionCount % instructions.length];
    instructionCount++;
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

function getHighestLeft() {
  return settledRocks
    .filter((r) => r.x == leftWall + 1)
    .reduce((a, c) => {
      return c.y > a ? c.y : a;
    }, -Infinity);
}

function getHighestRight() {
  return settledRocks
    .filter((r) => r.x == rightWall - 1)
    .reduce((a, c) => {
      return c.y > a ? c.y : a;
    }, -Infinity);
}

function getNeighbours(x: number, y: number) {
  return [
    {
      x: x + 1,
      y: y,
    },
    {
      x: x - 1,
      y: y,
    },
    {
      x: x,
      y: y + 1,
    },
    {
      x: x,
      y: y - 1,
    },
  ];
}

function updateWeight(source: WeightedCord, destination: WeightedCord) {
  destination.distance = Math.min(destination.distance, source.distance + 1);
}

class WeightedCord {
  coords: Coords;
  visited: boolean;
  distance: number;
}

function findPath(left: number, right: number) {
  const start = { x: leftWall + 1, y: left };
  const end = { x: rightWall - 1, y: right };
  const unvisitedNodes: WeightedCord[] = _.clone(settledRocks)
    .filter((coord) => !(coord.x == start.x && coord.y == start.y))
    .map((coords) => {
      return { coords, visited: false, distance: Infinity };
    });
  unvisitedNodes.push({
    coords: start,
    visited: false,
    distance: 0,
  });
  while (true) {
    var node = unvisitedNodes
      .filter((node) => !node.visited)
      .sort((a, b) => a.distance - b.distance)[0];

    if (!node) {
      break;
    }

    var coords = node.coords;
    const neighbours = getNeighbours(coords.x, coords.y).flatMap((id) =>
      unvisitedNodes.filter((n) => n.coords.x == id.x && n.coords.y == id.y)
    );
    neighbours
      .filter((neighbour) => neighbour != undefined)
      .filter((neighbour) => !neighbour.visited)
      .forEach((neighbour) => updateWeight(node, neighbour));

    node.visited = true;
  }

  var previous = unvisitedNodes.filter(
    (node) => node.coords.x == end.x && node.coords.y == end.y
  )[0];

  var path: WeightedCord[] = [];
  while (previous.distance > 0) {
    const neighbours = getNeighbours(
      previous.coords.x,
      previous.coords.y
    ).flatMap((id) =>
      unvisitedNodes.filter((n) => n.coords.x == id.x && n.coords.y == id.y)
    );
    previous = neighbours.filter((n) => n.distance == previous.distance - 1)[0];
    path.push(previous);
  }
  return path;
}

var previousPaths: WeightedCord[][] = [];
var previousRocks: Coords[][] = [];
var previousTops: number[] = [];
var previousIterations: number[] = [];
var previousInstructionCounts: number[] = [];

var bailAt = numberOfRocks;
var iterativeHeighToAdd = 0;

function lookForPatterns() {
  const left = getHighestLeft();
  const right = getHighestRight();

  if (Math.min(left, right) == -Infinity) {
    return currentFloor;
  }

  const path = findPath(left, right);

  var lowestPoint = path.reduce((a, c) => {
    return c.coords.y < a ? c.coords.y : a;
  }, Infinity);

  currentFloor = Math.max(lowestPoint, currentFloor);

  const normalised = _.cloneDeep(path);
  normalised.forEach(
    (point) => (point.coords.y = point.coords.y - currentFloor)
  );
  const normalisedRocks = _.clone(settledRocks)
    .filter((r) => r.y >= currentFloor)
    .map((point) => {
      return { x: point.x, y: point.y - currentFloor };
    });

  if (previousPaths.some((p) => _.isEqual(p, normalised))) {
    var index = previousPaths.findIndex((p) => _.isEqual(p, normalised));
    var sameRocks = previousRocks[index];
    if (_.isEqual(sameRocks, normalisedRocks)) {
      const previousInstructionCount = previousInstructionCounts[index];

      if (previousInstructionCount == instructionCount % instructions.length) {
        const previousTop = previousTops[index];
        const previousRockCount = previousIterations[index];
        console.log(
          `found a match at ${index} | ` +
            `previousTop: ${previousTop} | ` +
            `currentTop: ${currentTop} | ` +
            `previousRockCount: ${previousRockCount} | ` +
            `currentRockCount: ${rockCount}`
        );

        var numberOfRocksPerIteration = rockCount - previousRockCount;
        var heightIncreasePerIteration = currentTop - previousTop;
        var numberOfIterations = Math.floor(
          (numberOfRocks - previousRockCount) / numberOfRocksPerIteration
        );
        var heightFromAllIterations =
          numberOfIterations * heightIncreasePerIteration;
        iterativeHeighToAdd =
          heightFromAllIterations - heightIncreasePerIteration;
        var rocksCoveredByIteration =
          numberOfIterations * numberOfRocksPerIteration;
        var remainingRocks =
          numberOfRocks - previousRockCount - rocksCoveredByIteration;
        bailAt = rockCount + remainingRocks;
        matchFound = true;
        return currentFloor;
      }
    }
  }

  previousPaths.push(normalised);
  previousRocks.push(normalisedRocks);
  previousTops.push(currentTop);
  previousIterations.push(rockCount);
  previousInstructionCounts.push(instructionCount % instructions.length);

  return currentFloor;
}

function logState(
  rockCount: number,
  currentFloor: number,
  settledRocks: Coords[],
  currentTop: number
) {
  logTime(
    `Iteration: ${rockCount}. CurrentFloor: ${currentFloor}. Rocks: ${settledRocks.length}. Current Top: ${currentTop}`
  );
}

while (rockCount < bailAt) {
  var rock = getNewRock(getStartLocation());
  printCheck(rock);
  rockCount++;

  var moved = true;
  while (moved) {
    rock = moveHorizontal(rock);
    var result = moveDown(rock);
    rock = result.rock;
    moved = result.moved;
  }
  settledRocks.push(...rock);
  currentTop = settledRocks.reduce((a, c) => {
    return c.y > a ? c.y : a;
  }, -Infinity);

  if (matchFound) {
    logState(rockCount, currentFloor, settledRocks, currentTop);
  }

  if (!matchFound && rockCount % 5 == 0) {
    currentFloor = lookForPatterns();
    settledRocks = settledRocks.filter((rock) => rock.y >= currentFloor);
  }
}

console.log(currentTop + iterativeHeighToAdd);

logTime();
export {};
