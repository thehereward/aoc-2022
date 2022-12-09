import _, { maxBy } from "lodash";
import { readFile } from "../common";

var data = readFile("input");

const numberOfKnots = 10;

var history: number[][][] = new Array();
var state: number[][] = getNewState();

function getNewState() {
  var newState = new Array(numberOfKnots);
  for (var i = 0; i < newState.length; i = i + 1) {
    newState[i] = [0, 0];
  }
  return newState;
}

function copyStateToHistory() {
  var newState = state.map((s) => [...s]);
  history.push(newState);
}

copyStateToHistory();

var instructions = data.flatMap((line) => {
  var parts = line.split(" ");
  var number = parseInt(parts[1]);
  return Array.from(parts[0].repeat(number));
});

// console.log(instructions);

export function shouldMove(head: number[], tail: number[]) {
  if (Math.abs(head[0] - tail[0]) >= 2) {
    return true;
  }

  if (Math.abs(head[1] - tail[1]) >= 2) {
    return true;
  }

  return false;
}

export function getNewTail(head: number[], tail: number[]) {
  if (!shouldMove(head, tail)) {
    return tail;
  }

  var yDiff = (head[0] - tail[0]) / 2;
  var xDiff = (head[1] - tail[1]) / 2;

  var yMov = yDiff > 0 ? Math.ceil(yDiff) : Math.floor(yDiff);
  var xMov = xDiff > 0 ? Math.ceil(xDiff) : Math.floor(xDiff);

  return [tail[0] + yMov, tail[1] + xMov];
}

instructions.forEach((instruction) => {
  var head = state[0];
  var newHead = [...head];

  switch (instruction) {
    case "U":
      newHead = [head[0], head[1] + 1];
      break;
    case "D":
      newHead = [head[0], head[1] - 1];
      break;
    case "L":
      newHead = [head[0] - 1, head[1]];
      break;
    case "R":
      newHead = [head[0] + 1, head[1]];
      break;
  }
  state[0] = newHead;

  for (var i = 1; i < state.length; i = i + 1) {
    var lead = state[i - 1];
    var follow = state[i];
    follow = getNewTail(lead, follow);
    state[i] = follow;
  }

  copyStateToHistory();
});

function arrayToString(t: number[]) {
  return `${t[0]}|${t[1]}`;
}

var tailIndex = state.length - 1;
var tailSet = new Set(history.map((t) => arrayToString(t[tailIndex])));
console.log(tailSet.size);

const blocks = ["█", " ", "_", "▁", "▂", "▃", "▄", "▅", "▆", "▇"];
const block = blocks[0];

var tailArray = history.map((t) => {
  return t[tailIndex];
});
// console.log(tailArray);

function plot(toPlot: number[][]) {
  var minMax = toPlot.reduce(
    (a, c) => {
      if (a.maxX == null || a.maxX < c[0]) {
        a.maxX = c[0];
      }
      if (a.minX == null || a.minX > c[0]) {
        a.minX = c[0];
      }
      if (a.maxY == null || a.maxY < c[1]) {
        a.maxY = c[1];
      }
      if (a.minY == null || a.minY > c[1]) {
        a.minY = c[1];
      }

      return a;
    },
    {
      maxY: null,
      minY: null,
      maxX: null,
      minX: null,
    }
  );

  for (var y = minMax.maxY; y >= minMax.minY; y = y - 1) {
    var line = [];
    for (var x = minMax.minX; x <= minMax.maxX; x = x + 1) {
      line.push(tailSet.has(arrayToString([x, y])) ? "#" : ".");
    }
    console.log(line.join(""));
  }
  console.log(minMax);
}

function specialChars(state: number[][]) {
  var chars: any = {};
  for (var i = 0; i < state.length; i = i + 1) {
    chars[arrayToString(state[i])] = `${i}`;
  }
  return chars;
}

function plotIteration(toPlot: number[][]) {
  var minMax = toPlot.reduce(
    (a, c) => {
      if (a.maxX == null || a.maxX < c[0]) {
        a.maxX = c[0];
      }
      if (a.minX == null || a.minX > c[0]) {
        a.minX = c[0];
      }
      if (a.maxY == null || a.maxY < c[1]) {
        a.maxY = c[1];
      }
      if (a.minY == null || a.minY > c[1]) {
        a.minY = c[1];
      }

      return a;
    },
    {
      maxY: null,
      minY: null,
      maxX: null,
      minX: null,
    }
  );

  var specials = specialChars(toPlot);

  for (var y = minMax.maxY; y >= minMax.minY; y = y - 1) {
    var line = [];
    for (var x = minMax.minX; x <= minMax.maxX; x = x + 1) {
      line.push(tailSet.has(arrayToString([x, y])) ? "#" : ".");
    }
    console.log(line.join(""));
  }
  console.log(minMax);
}

// plot(tailArray);

// 2678 - too high

export {};
