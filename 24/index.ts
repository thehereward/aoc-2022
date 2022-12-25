import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

export const NW: Direction = [-1, -1];
export const N: Direction = [0, -1];
export const NE: Direction = [1, -1];
export const E: Direction = [1, 0];
export const SE: Direction = [1, 1];
export const S: Direction = [0, 1];
export const SW: Direction = [-1, 1];
export const W: Direction = [-1, 0];

const directions = [N, E, S, W];

type Direction = number[];

const logTime = getTimeLogger();

type Coords = number[];

export class Blizzard {
  position: Coords;
  direction: Coords;
  directionChar: string;
}

function pointToString(x: number, y: number) {
  return `${x}|${y}`;
}

function coordToString(coord: Coords) {
  return pointToString(coord[0], coord[1]);
}

export function getNextMoves(position: Coords): Coords[] {
  var [x, y] = position;
  return [
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x, y],
  ];
}

function add(a: number[], b: number[]) {
  if (a.length != 2 || b.length != 2) {
    throw new Error();
  }
  return [a[0] + b[0], a[1] + b[1]];
}

function mult(a: Coords, b: number) {
  return a.map((i) => i * b);
}

const getMax = (a: Coords, c: Coords) => {
  a[0] = Math.max(c[0], a[0]);
  a[1] = Math.max(c[1], a[1]);
  return a;
};

const getMin = (a: Coords, c: Coords) => {
  a[0] = Math.min(c[0], a[0]);
  a[1] = Math.min(c[1], a[1]);
  return a;
};

function printState(
  _blizzards: Blizzard[],
  _walls: Set<string>,
  char?: Coords
) {
  const blizzardSet = new Map<string, string>();
  _blizzards.reduce((a, c) => {
    const s = coordToString(c.position);
    if (blizzardSet.has(s)) {
      const value = blizzardSet.get(s);
      if (isNaN(parseInt(value))) {
        blizzardSet.set(s, "2");
      } else {
        blizzardSet.set(s, `${parseInt(value) + 1}`);
      }
    } else {
      blizzardSet.set(s, c.directionChar);
    }
    return a;
  }, blizzardSet);

  for (var y = YMIN; y <= YMAX; y++) {
    var line: string[] = [];
    for (var x = XMIN; x <= XMAX; x++) {
      const pointString = pointToString(x, y);
      if (char != undefined && char[0] == x && char[1] == y) {
        line.push("E");
      } else if (_walls.has(pointString)) {
        line.push("#");
      } else if (blizzardSet.has(pointString)) {
        line.push(blizzardSet.get(pointString));
      } else {
        line.push(".");
      }
    }
    console.log(line.join(""));
  }
  console.log("");
}

function getDirection(char: string): Coords {
  switch (char) {
    case ">":
      return E;
    case "<":
      return W;
    case "^":
      return N;
    case "v":
      return S;
  }
  throw new Error(char);
}

// x →
// y ↓

var data = readFile("input").filter((l) => l.length > 0);

const XMIN = 0;
const YMIN = 0;

const XMAX = data[0].length - 1;
const YMAX = data.length - 1;

const XCYCLE = XMAX - XMIN - 1;
const YCYCLE = YMAX - YMIN - 1;

const gcd = (...arr: number[]): number => {
  const _gcd = (x: number, y: number) => (!y ? x : gcd(y, x % y));
  return [...arr].reduce((a, b) => _gcd(a, b));
};

const lcm = (a: number, b: number): number => {
  return (Math.abs(a) * Math.abs(b)) / gcd(a, b);
};
const CYCLE = lcm(XCYCLE, YCYCLE);

console.log({ CYCLE });

const walls: Set<string> = new Set();
const emptySpaces: Coords[] = [];
var blizzards: Blizzard[] = [];
data.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    if (char == "#") {
      walls.add(pointToString(x, y));
      return;
    }
    if (char == ".") {
      emptySpaces.push([x, y]);
      return;
    }
    if (char != ".") {
      blizzards.push({
        position: [x, y],
        direction: getDirection(char),
        directionChar: char,
      });
    }
  });
});

function isInBounds(n: Coords): boolean {
  return n[0] >= XMIN && n[0] <= XMAX && n[1] >= YMIN && n[1] <= YMAX;
}

export function isABlizzard(position: Coords, blizzards: Blizzard[]): boolean {
  return blizzards.some((blizzard) => {
    return (
      blizzard.position[0] == position[0] && blizzard.position[1] == position[1]
    );
  });
}

const start: Coords = [data[0].indexOf("."), 0];
const end: Coords = [data[data.length - 1].indexOf("."), data.length - 1];

const timeToLog: number = undefined;

function getNextPositions(position: Coords, _blizzards: Blizzard[]): Coords[] {
  var moves = getNextMoves(position)
    .filter((move) => isInBounds(move))
    .filter((move) => !walls.has(coordToString(move)))
    .filter((move) => !isABlizzard(move, _blizzards));
  return moves;
}

export class Bounds {
  min: Coords;
  max: Coords;
}

const bounds: Bounds = {
  min: [XMIN, YMIN],
  max: [XMAX, YMAX],
};

export function getBlizzardAtTime(
  _blizzard: Blizzard,
  time: number,
  bounds: Bounds
): Blizzard {
  const blizzard = _.cloneDeep(_blizzard);
  const newDirection = mult(blizzard.direction, time);
  var newPosition = add(blizzard.position, [-1, -1]);
  newPosition = add(newPosition, newDirection);
  const xDiff = bounds.max[0] - bounds.min[0] - 1;
  newPosition[0] = ((newPosition[0] % xDiff) + xDiff) % xDiff;
  const yDiff = bounds.max[1] - bounds.min[1] - 1;
  newPosition[1] = ((newPosition[1] % yDiff) + yDiff) % yDiff;
  newPosition = add(newPosition, [1, 1]);
  return {
    ...blizzard,
    position: newPosition,
  };
}

const blizzardCache = new Map<number, Blizzard[]>();

function getBlizzardsAtTime(blizzards: Blizzard[], time: number) {
  const cTime = time % CYCLE;
  if (blizzardCache.has(cTime)) {
    return blizzardCache.get(cTime);
  }

  const newBlizzards = blizzards.map((b) => getBlizzardAtTime(b, time, bounds));
  blizzardCache.set(time, newBlizzards);
  return newBlizzards;
}

// Warming the cache
logTime("Start warming the cache");
for (var i = 0; i < CYCLE; i++) {
  getBlizzardsAtTime(blizzards, i);
}
logTime("Finish warming the cache");

var globalTime = 0;

console.log({ start });
console.log({ end });

function runUntilSuccess(currentStates: Coords[], target: Coords) {
  const targetString = coordToString(target);
  var finished = false;
  while (!finished) {
    globalTime++;
    const _blizzards = getBlizzardsAtTime(blizzards, globalTime);
    currentStates = currentStates.flatMap((history) =>
      getNextPositions(history, _blizzards)
    );
    const stateSet = new Set<string>();
    currentStates.forEach((state) => {
      stateSet.add(coordToString(state));
    });
    currentStates = [];
    stateSet.forEach((e) =>
      currentStates.push(e.split("|").map((c) => parseInt(c)))
    );
    finished = stateSet.has(targetString);
    if (globalTime % 10 == 0) {
      logTime(
        `Time: ${globalTime} | Possible Positions : ${currentStates.length}`
      );
    }
  }
}

logTime("Starting first journey");
runUntilSuccess([start], end);
logTime(`Part 1: ${globalTime}`);
logTime("Starting second journey");
runUntilSuccess([end], start);
logTime("Starting third journey");
runUntilSuccess([start], end);
logTime(`Part 2: ${globalTime}`);

logTime();
export {};
