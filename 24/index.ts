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

type Direction = number[];

const NORTH: Direction[] = [NW, N, NE];
const SOUTH: Direction[] = [SW, S, SE];
const EAST: Direction[] = [NE, E, SE];
const WEST: Direction[] = [NW, W, SW];

const ORDER = [NORTH, SOUTH, WEST, EAST];

const logTime = getTimeLogger();

type Coords = number[];

class Elf {
  position: Coords;
  nextPosition?: Coords;
}

function pointToString(x: number, y: number) {
  return `${x}|${y}`;
}

function coordToString(coord: Coords) {
  return pointToString(coord[0], coord[1]);
}

export function getNeighbours(x: number, y: number): Coords[] {
  return [
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
  ];
}

function add(a: number[], b: number[]) {
  if (a.length != 2 || b.length != 2) {
    throw new Error();
  }
  return [a[0] + b[0], a[1] + b[1]];
}

const getMax = (a: Coords, c: Elf) => {
  a[0] = Math.max(c.position[0], a[0]);
  a[1] = Math.max(c.position[1], a[1]);
  return a;
};

const getMin = (a: Coords, c: Elf) => {
  a[0] = Math.min(c.position[0], a[0]);
  a[1] = Math.min(c.position[1], a[1]);
  return a;
};

function printState(elves: Elf[]) {
  const max = elves.reduce(getMax, [-Infinity, -Infinity]);
  const min = elves.reduce(getMin, [Infinity, Infinity]);

  const currentPositions = new Set<string>(
    elves.map((e) => coordToString(e.position))
  );

  for (var y = min[1]; y <= max[1]; y++) {
    var line: string[] = [];
    for (var x = min[0]; x <= max[0]; x++) {
      if (currentPositions.has(pointToString(x, y))) {
        line.push("#");
      } else {
        line.push(".");
      }
    }
    console.log(line.join(""));
  }
  console.log("");
}

function calculateAnswer(elves: Elf[]) {
  const max = elves.reduce(getMax, [-Infinity, -Infinity]);
  const min = elves.reduce(getMin, [Infinity, Infinity]);

  const rectangle = (max[0] - min[0] + 1) * (max[1] - min[1] + 1);
  return rectangle - elves.length;
}

// x →
// y ↓

const initialElves: Elf[] = [];

var data = readFile("input");
data.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    if (char == "#") {
      initialElves.push({
        position: [x, y],
      });
    }
  });
});

function iterate(
  elves: Elf[],
  count: number
): { elves: Elf[]; moved?: boolean } {
  const currentPositions = new Set<String>();
  const nextPositions = new Set<String>();
  const clashes = new Set<String>();

  function canMoveInDirection(elf: Elf, directions: Direction[]): boolean {
    return !directions
      .map((direction) => add(elf.position, direction))
      .some((d) => currentPositions.has(coordToString(d)));
  }

  elves.forEach((elf) => {
    currentPositions.add(coordToString(elf.position));
  });

  function canMove(elf: Elf): boolean {
    return getNeighbours(elf.position[0], elf.position[1]).some((neighbour) =>
      currentPositions.has(coordToString(neighbour))
    );
  }

  const elvesToMove = elves.filter(canMove);

  elvesToMove.forEach((elf) => {
    for (var i = 0; i < ORDER.length; i++) {
      const direction = ORDER[(i + count) % ORDER.length];
      if (elf.nextPosition == undefined && canMoveInDirection(elf, direction)) {
        elf.nextPosition = add(elf.position, direction[1]);
        break;
      }
    }
  });

  if (elvesToMove.length == 0) {
    return { elves, moved: false };
  }

  elvesToMove
    .filter((elf) => elf.nextPosition != undefined)
    .forEach((elf) => {
      const nextPositionString = coordToString(elf.nextPosition);

      if (nextPositions.has(nextPositionString)) {
        clashes.add(nextPositionString);
      } else {
        nextPositions.add(nextPositionString);
      }
    });

  elves
    .filter((elf) => elf.nextPosition != undefined)
    .forEach((elf) => {
      const nextPositionString = coordToString(elf.nextPosition);
      if (clashes.has(nextPositionString)) {
        elf.nextPosition = undefined;
      }

      if (elf.nextPosition != undefined) {
        elf.position = elf.nextPosition;
      }
      elf.nextPosition = undefined;
    });

  return { elves, moved: true };
}

var elves = initialElves;
var count = 0;
var wereMoves = true;
while (wereMoves) {
  var { elves, moved } = iterate(elves, count);
  wereMoves = moved;
  count++;
  if (count == 10) {
    const answer = calculateAnswer(elves);
    logTime(`Part 1: ${answer}`);
  }
}
logTime(`Part 2: ${count}`);

logTime();
export {};
