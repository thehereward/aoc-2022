import _, { add } from "lodash";
import { readFile } from "../common";

var data = readFile("input");

var lines = data.map((line) => {
  return line
    .split(" -> ")
    .map((point) => point.split(",").map((c) => parseInt(c)));
});

function getVectorFromAtoB(pointA: number[], pointB: number[]) {
  return [pointB[0] - pointA[0], pointB[1] - pointA[1]];
}

function addVector(pointA: number[], pointB: number[]) {
  return [pointB[0] + pointA[0], pointB[1] + pointA[1]];
}

function normaliseVector(vector: number[]) {
  const size = Math.max(...vector.map((v) => Math.abs(v)));
  return vector.map((v) => v / size);
}

const points = lines.flatMap((line) => {
  var points = [];
  for (var i = 0; i < line.length - 1; i++) {
    var diff = getVectorFromAtoB(line[i], line[i + 1]);
    diff = normaliseVector(diff);
    var point = _.clone(line[i]);
    while (!_.isEqual(point, line[i + 1])) {
      points.push(point);
      point = addVector(point, diff);
    }
    points.push(point);
  }
  return points;
});

function pointToString(point: number[]) {
  return point.join("|");
}

const blockedPoints: any = {};
const maxDepth = points.reduce((a, c) => {
  return Math.max(a, c[1]);
}, 0);

points.forEach((point) => (blockedPoints[pointToString(point)] = "rock"));

const sandVectors = [
  [0, 1],
  [-1, 1],
  [1, 1],
];

function isBlocked(point: number[]) {
  if (point[1] == maxDepth + 2) {
    return true;
  }
  const item = blockedPoints[pointToString(point)];
  return item != undefined;
}

function getNewSand(sand: number[]) {
  var newSand: number[] = [];
  for (var i = 0; i < sandVectors.length; i++) {
    var newSand = addVector(sand, sandVectors[i]);
    if (!isBlocked(newSand)) {
      return newSand;
    }
  }
  return sand;
}

function shouldStop(point: number[]) {
  return _.isEqual(newSand, [500, 0]);
}

var isShouldStop = false;

var sandCount = 0;
while (!isShouldStop) {
  var sand = [500, 0];
  sandCount++;
  var newSand = _.clone(sand);
  var isStopped = false;

  while (!isStopped) {
    // console.log(newSand);
    newSand = getNewSand(sand);
    isStopped = _.isEqual(sand, newSand);
    sand = newSand;
    isShouldStop = shouldStop(newSand);
    if (isShouldStop) {
      break;
    }
  }
  blockedPoints[pointToString(newSand)] = "sand";
}

console.log(sandCount);

export {};
