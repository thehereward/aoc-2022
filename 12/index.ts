import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

class Node {
  i: number;
  j: number;
  id: string;
  weight: number;
  height: number;
  visited: boolean;
  source?: Node;
  onPath: boolean;
}

var elevations: Node[] = [];

var startI: number;
var startJ: number;

var targetI: number;
var targetJ: number;

function getHeight(index: number) {
  return "abcdefghijklmnopqrstuvwxyz"[index];
}

function getElevation(string: string) {
  if (string == "S") {
    return 0;
  }
  if (string == "E") {
    return 25;
  }
  return "abcdefghijklmnopqrstuvwxyz".indexOf(string);
}

for (var i = 0; i < data.length; i++) {
  var line = data[i];
  for (var j = 0; j < line.length; j++) {
    if (line[j] == "S") {
      startI = i;
      startJ = j;
    }
    if (line[j] == "E") {
      targetI = i;
      targetJ = j;
    }
    elevations.push({
      i,
      j,
      id: `${i}|${j}`,
      weight: line[j] == "S" ? 0 : -1,
      height: getElevation(line[j]),
      visited: false,
      onPath: false,
    });
  }
}

const nodes: any = {};

elevations.map((elevation) => {
  nodes[elevation.id] = elevation;
});

const unvisitedNodes = _.clone(elevations);

function getNeighbouringIds(i: number, j: number) {
  return [`${i - 1}|${j}`, `${i + 1}|${j}`, `${i}|${j - 1}`, `${i}|${j + 1}`];
}

function canVisit(heightA: number, heightB: number) {
  return heightB <= heightA + 1;
}

function getNewWeight(weightA: number, weightB: number) {
  if (weightA == -1) {
    return weightB + 1;
  } else {
    return Math.min(weightA, weightB + 1);
  }
}

function updateWeight(source: Node, destination: Node) {
  if (destination.weight == -1 || destination.weight > source.weight + 1) {
    destination.weight = source.weight + 1;
    destination.source = source;
  }
}

function sortAscending(a: Node, b: Node) {
  if (a.weight < b.weight) {
    return -1;
  }

  if (a.weight > b.weight) {
    return 1;
  }

  return 0;
}

while (true) {
  var node = unvisitedNodes
    .filter((node) => !node.visited)
    .filter((node) => node.weight >= 0)
    .sort(sortAscending)
    .shift();

  if (!node) {
    break;
  }

  getNeighbouringIds(node.i, node.j)
    .map((id) => nodes[id])
    .filter((neighbour) => neighbour != undefined)
    .filter((neighbour) => !neighbour.visited)
    .filter((neighbour) => canVisit(node.height, neighbour.height))
    .forEach((neighbour) => updateWeight(node, neighbour));

  node.visited = true;
  //   console.log(unvisitedNodes.filter((node) => node.weight >= 0));
  //   break;
}

// console.log(unvisitedNodes.filter((n) => !n.visited));
console.log(nodes[`${startI}|${startJ}`]);
console.log(nodes[`${targetI}|${targetJ}`]);

function getThing(node: Node) {
  if (!node.visited) {
    return ".";
  } else if (node.onPath) {
    return getHeight(node.height).toUpperCase();
  } else {
    return getHeight(node.height);
  }
}

function getWeightString(node: Node) {
  return (node.weight % 16).toString(16);
}

var nextNode = nodes[`${targetI}|${targetJ}`];
var count = 0;
while (nextNode != undefined) {
  nextNode.onPath = true;
  nextNode = nextNode.source;
  count++;
}

function printMap(func: (node: Node) => string) {
  for (var i = 0; i < data.length; i++) {
    console.log(
      unvisitedNodes
        .filter((node) => node.i == i)
        .sort((node) => node.j)
        .map((node) => func(node))
        .join("")
    );
  }
}

// printMap(getThing);
// printMap(getWeightString);
// console.log(count);

// 544 - wrong
// 494 - wrong
// 832 - wrong - too high

export {};
