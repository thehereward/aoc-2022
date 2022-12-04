import { readFile } from "../common";

var data = readFile("input");

var pairs = data.map((line) => line.split(","));

var converted = pairs.map((pair) => {
  return [
    pair[0].split("-").map((i) => parseInt(i)),
    pair[1].split("-").map((i) => parseInt(i)),
  ];
});

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function doesAContainB(a: number[], b: number[]) {
  // x1 <= y2 && y1 <= x2
  return a[0] <= b[1] && b[0] <= a[1];
  // return a[1] >= b[1] && a[0] <= b[0];
}

// console.log(converted);
var contained = converted.map((pair) => {
  const p1 = pair[0];
  const p2 = pair[1];
  if (p1[1] - p1[0] > p2[1] - p2[0]) {
    return doesAContainB(p1, p2);
  } else {
    return doesAContainB(p2, p1);
  }
});

const lookUp = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

console.log(
  contained.reduce((a, c) => {
    if (c) {
      return a + 1;
    } else {
      return a;
    }
  }, 0)
);

export {};
