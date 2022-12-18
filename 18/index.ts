import _, { initial } from "lodash";
import { readFile, getTimeLogger } from "../common";

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

const logTime = getTimeLogger();

var data = readFile("input");

var points = data.map((line) => line.split(",").map((c) => parseInt(c)));

export function isAdjacent(cubeA: number[], cubeB: number[]): boolean {
  return (
    Math.abs(cubeA[0] - cubeB[0]) +
      Math.abs(cubeA[1] - cubeB[1]) +
      Math.abs(cubeA[2] - cubeB[2]) ==
    1
  );
}

function getNeighbours(cube: number[]) {
  return [
    [cube[0] - 1, cube[1], cube[2]],
    [cube[0] + 1, cube[1], cube[2]],
    [cube[0], cube[1] - 1, cube[2]],
    [cube[0], cube[1] + 1, cube[2]],
    [cube[0], cube[1], cube[2] - 1],
    [cube[0], cube[1], cube[2] + 1],
  ];
}

function getMinMax(points: number[][], dimension: number): number[] {
  return points.reduce(
    (a, c) => {
      var value = c[dimension];
      var min = Math.min(a[0], value);
      var max = Math.max(a[1], value);
      return [min, max];
    },
    [Infinity, -Infinity]
  );
}

function getBounds(points: number[][]): number[][] {
  var x = getMinMax(points, 0);
  var y = getMinMax(points, 1);
  var z = getMinMax(points, 2);
  return [x, y, z];
}

function expandBounds(bounds: number[][]) {
  return bounds.map((bound) => {
    return [bound[0] - 1, bound[1] + 1];
  });
}

var bounds = getBounds(points);
bounds = expandBounds(bounds);

function isInRange(bounds: number[], value: number) {
  return value >= bounds[0] && value <= bounds[1];
}

function isInBounds(cube: number[]): boolean {
  return bounds.reduce((a, c, i) => {
    return a && isInRange(c, cube[i]);
  }, true);
}

var start = [bounds[0][0], bounds[1][0], bounds[2][0]];
var end = [bounds[0][1], bounds[1][1], bounds[2][1]];

function pointToString(point: number[]) {
  return point.join("|");
}

function fill(inputFilled: Set<string>, startingPoints: Set<number[]>) {
  var filled = _.clone(inputFilled);
  var updates = new Set<number[]>(startingPoints);
  while (updates.size > 0) {
    // console.log(updates);
    var newUpdates = new Set<number[]>();
    for (const value of updates) {
      getNeighbours(value)
        .filter((neighbour) => isInBounds(neighbour))
        .filter((neighbour) => !filled.has(pointToString(neighbour)))
        .forEach((neighbour) => {
          newUpdates.add(neighbour);
          filled.add(pointToString(neighbour));
        });
    }
    updates = newUpdates;
  }
  return filled;
}

function fill2(inputFilled: Set<string>, startingPoints: Set<number[]>) {
  var filled = new Set<string>();
  for (const value of startingPoints) {
    filled.add(pointToString(value));
  }
  var updates = _.cloneDeep(startingPoints);
  while (updates.size > 0) {
    // console.log(filled.size);
    // console.log(updates.size);
    var newUpdates = new Set<number[]>();
    for (const value of updates) {
      getNeighbours(value)
        .filter((neighbour) => isInBounds(neighbour))
        .filter((neighbour) => !inputFilled.has(pointToString(neighbour)))
        .filter((neighbour) => !filled.has(pointToString(neighbour)))
        .forEach((neighbour) => {
          newUpdates.add(neighbour);
          filled.add(pointToString(neighbour));
        });
    }
    updates = newUpdates;
  }
  return filled;
}

var flooded = fill(
  new Set<string>(points.map((p) => pointToString(p))),
  new Set<number[]>([start, end])
);
console.log({ start });
console.log({ end });
var volume =
  (Math.abs(end[0] - start[0]) + 1) *
  (Math.abs(end[1] - start[1]) + 1) *
  (Math.abs(end[2] - start[2]) + 1);
console.log(`Volume Total: ${volume}`);
console.log(`Volume Flooded:${flooded.size}`);
console.log(`Calculated number of hidden cells: ${volume - flooded.size}`);

function stringToPoint(str: string) {
  return str.split("|").map((c) => parseInt(c));
}

var hiddenPoints = new Set<string>();
points
  .flatMap((point) => getNeighbours(point))
  .forEach((point) => hiddenPoints.add(pointToString(point)));

var hiddenStart: number[][] = [];
for (const pointString of hiddenPoints) {
  if (!flooded.has(pointString)) {
    hiddenStart.push(stringToPoint(pointString));
  }
}
console.log(`Initial number of hidden cells: ${hiddenStart.length}`);
var hiddenString = fill2(flooded, new Set<number[]>(hiddenStart));
console.log(`Number of hidden cells after flood: ${hiddenString.size}`);

var hidden: number[][] = [];
for (const pointString of hiddenString) {
  if (!flooded.has(pointString)) {
    hidden.push(stringToPoint(pointString));
  }
}

export function getExposedSides(input: number[][]): number {
  var points = _.cloneDeep(input);
  var totalSides = points.length * 6;

  var pointA: number[] = points.shift();
  var adjacentSides: number = 0;
  while (pointA != undefined) {
    var numberOfAdjacent = points.reduce((a, c) => {
      if (isAdjacent(pointA, c)) {
        return a + 2; // Because each adjacency removes one side from each cube
      } else {
        return a;
      }
    }, 0);
    adjacentSides += numberOfAdjacent;
    pointA = points.shift();
  }
  //   console.log({ totalSides });
  //   console.log({ adjacentSides });
  return totalSides - adjacentSides;
}

const allExposedSides = getExposedSides(points);
const internalExposedSides = getExposedSides(hidden);
const difference = allExposedSides - internalExposedSides;
console.log({ allExposedSides });
console.log({ internalExposedSides });
console.log({ difference });

logTime();
export {};

// Part 1
// 11832 - is too high

// Part 2
// 1828 - is too low
// 2922 - is too high
