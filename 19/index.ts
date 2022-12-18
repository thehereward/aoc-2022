import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

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

function pointToString(point: number[]) {
  return point.join("|");
}

function fill(inputFilled: Set<string>, startingPoints: Set<number[]>) {
  var filled = _.clone(inputFilled);
  var updates = new Set<number[]>(startingPoints);
  while (updates.size > 0) {
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

var start = [bounds[0][0], bounds[1][0], bounds[2][0]];
var end = [bounds[0][1], bounds[1][1], bounds[2][1]];

var flooded = fill(
  new Set<string>(points.map((p) => pointToString(p))),
  new Set<number[]>([start, end])
);
var volume =
  (Math.abs(end[0] - start[0]) + 1) *
  (Math.abs(end[1] - start[1]) + 1) *
  (Math.abs(end[2] - start[2]) + 1);
console.log(`Volume Total: ${volume}`);
console.log(`Volume Flooded: ${flooded.size}`);
console.log(`Calculated number of hidden cells: ${volume - flooded.size}`);

function getUnexposedCubes() {
  var hidden: number[][] = [];
  for (var i = bounds[0][0]; i <= bounds[0][1]; i++) {
    for (var j = bounds[1][0]; j <= bounds[1][1]; j++) {
      for (var k = bounds[2][0]; k <= bounds[2][1]; k++) {
        if (!flooded.has(pointToString([i, j, k]))) {
          hidden.push([i, j, k]);
        }
      }
    }
  }
  return hidden;
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
  return totalSides - adjacentSides;
}

const hidden = getUnexposedCubes();
console.log(`Found number of hidden cells: ${hidden.length}`);
const allExposedSides = getExposedSides(points);
const internalExposedSides = getExposedSides(hidden);
const difference = allExposedSides - internalExposedSides;
console.log({ allExposedSides });
console.log({ internalExposedSides });
console.log({ difference });

logTime();
export {};
