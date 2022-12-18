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
console.log({ totalSides });
console.log({ adjacentSides });
console.log(totalSides - adjacentSides);

logTime();
export {};

// Part 1
// 11832 - is too high
