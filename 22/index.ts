import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const instructionString = data.pop();

var map: string[][] = [];

data.forEach((line) => {
  if (line.length == 0) {
    return;
  }

  map.push(line.split(""));
});

const maxY = map.length;
const maxX = map.reduce((a, c) => {
  return a >= c.length ? a : c.length;
}, -Infinity);

// const rowMinMax: number[] = map.reduce((a, c) => {

// }, [Infinity, -Infinity])

var mapData = new Map<string, string>();

for (var y = 0; y < maxY; y++) {
  for (var x = 0; x < maxX; x++) {
    if (x >= map[y].length) {
      break;
    }
    if (map[y][x] != " ") {
      mapData.set(`${y}|${x}`, map[y][x]);
    }
  }
}

// console.log(mapData);

var distances = instructionString
  .split(/[R|L]/)
  .filter((d) => d.length > 0)
  .map((d) => parseInt(d));
var directions = instructionString.split(/\d+/).filter((d) => d.length > 0);

class State {
  position: number[];
  heading: number[];
}

var initialState: State = {
  position: [map[0].indexOf("."), 0],
  heading: [1, 0],
};

export function turn(heading: number[], direction: string) {
  var newHeading;
  if (direction == "R") {
    newHeading = [-1 * heading[1], heading[0]];
  } else {
    newHeading = [heading[1], -1 * heading[0]];
  }
  return newHeading.map((c) => (c == -0 ? 0 : c));
}

function pointToString(x: number, y: number) {
  return `${y}|${x}`;
}

function positionToString(position: number[]) {
  return pointToString(position[0], position[1]);
}

function getDirection(heading: number[]) {
  switch (`${heading[0]}|${heading[1]}`) {
    case "0|1":
      return "V";
    case "0|-1":
      return "^";
    case "1|0":
      return ">";
    case "-1|0":
      return "V";
  }
}

function getScore(heading: number[]): number {
  switch (`${heading[0]}|${heading[1]}`) {
    case "0|1":
      return 1;
    case "0|-1":
      return 3;
    case "1|0":
      return 0;
    case "-1|0":
      return 2;
  }
}

function printState(state?: State) {
  for (var y = 0; y < maxY; y++) {
    var line: string[] = [];
    for (var x = 0; x < maxX; x++) {
      if (
        state != undefined &&
        state.position[0] == x &&
        state.position[1] == y
      ) {
        line.push(getDirection(state.heading));
      } else if (mapData.has(pointToString(x, y))) {
        line.push(mapData.get(pointToString(x, y)));
      } else {
        line.push(" ");
      }
    }
    console.log(line.join(""));
  }
}

function add(a: number[], b: number[]) {
  if (a.length != 2 || b.length != 2) {
    throw new Error();
  }
  return [a[0] + b[0], a[1] + b[1]];
}

const states: State[] = [];

function walkUntilWall(state: State, distance: number): State {
  if (distance == 0) {
    return state;
  }
  var nextPosition = add(state.position, state.heading);
  var nextPositionString = positionToString(nextPosition);
  if (!mapData.has(nextPositionString)) {
    const tempHeading = turn(turn(state.heading, "R"), "R");
    do {
      nextPosition = add(nextPosition, tempHeading);
      nextPositionString = positionToString(nextPosition);
      // console.log({ nextPosition });
    } while (mapData.has(nextPositionString));
    nextPosition = add(nextPosition, state.heading);
    // console.log({ nextPosition });
    nextPositionString = positionToString(nextPosition);
    // throw new Error();
  }

  if (mapData.get(nextPositionString) == "#") {
    return state;
  } else {
    var newState = { position: nextPosition, heading: state.heading };
    states.push(state);
    return walkUntilWall(newState, distance - 1);
  }
}

var state = initialState;
for (var i = 0; i < distances.length; i++) {
  var distance = distances[i];
  state = walkUntilWall(state, distance);
  var direction = directions.shift();
  var heading = direction ? turn(state.heading, direction) : state.heading;
  state = {
    ...state,
    heading,
  };
  // printState(state);
  // console.log("");
}

const score =
  1000 * (state.position[1] + 1) +
  4 * (state.position[0] + 1) +
  getScore(state.heading);

console.log(score);
// console.log(distances);
// console.log(directions);

logTime();
export {};
