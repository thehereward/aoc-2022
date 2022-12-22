import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

export const NORTH = [0, -1];
export const SOUTH = [0, 1];
export const EAST = [1, 0];
export const WEST = [-1, 0];

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
console.log({ maxX });
console.log({ maxY });
export function getSegment(
  maxX: number,
  maxY: number,
  position: number[]
): number {
  console.log(maxX);
  console.log(maxY);
  const xIncrement = maxX / 4;
  const yIncrement = maxY / 3;
  console.log(xIncrement);
  console.log(yIncrement);
  if (xIncrement != yIncrement) {
    throw new Error();
  }

  const x = Math.floor(position[0] / xIncrement);
  const y = Math.floor(position[1] / yIncrement);
  // console.log({ x, y });

  const s = pointToString(x, y);
  switch (s) {
    case "0|2":
      return 1;
    case "1|0":
      return 2;
    case "1|1":
      return 3;
    case "1|2":
      return 4;
    case "2|2":
      return 5;
    case "2|3":
      return 6;
  }

  return 0;
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
  console.log("");
}

function add(a: number[], b: number[]) {
  if (a.length != 2 || b.length != 2) {
    throw new Error();
  }
  return [a[0] + b[0], a[1] + b[1]];
}

const states: State[] = [];

function getNextStateOld(lastState: State): State {
  const heading = lastState.heading;
  var nextPosition = add(lastState.position, heading);
  var nextPositionString = positionToString(nextPosition);
  if (!mapData.has(nextPositionString)) {
    const tempHeading = turn(turn(heading, "R"), "R");
    do {
      nextPosition = add(nextPosition, tempHeading);
      nextPositionString = positionToString(nextPosition);
      // console.log({ nextPosition });
    } while (mapData.has(nextPositionString));
    nextPosition = add(nextPosition, heading);
    // console.log({ nextPosition });
    nextPositionString = positionToString(nextPosition);
    // throw new Error();
  }
  return {
    position: nextPosition,
    heading: heading,
  };
}

export function getNextStateHard(
  maxX: number,
  maxY: number,
  position: number[],
  heading: number[]
): State {
  var nextPosition = add(position, heading);
  var nextPositionString = positionToString(nextPosition);
  if (mapData.has(nextPositionString)) {
    return {
      position: nextPosition,
      heading: heading,
    };
  }

  const segment = getSegment(maxX, maxY, position);
  const yIncrement = maxY / 3;
  const xIncrement = maxX / 4;
  const x = position[0];
  const y = position[1];
  switch (segment) {
    case 1:
      switch (`${heading[0]}|${heading[1]}`) {
        case "0|1":
          var newPosition = [x, y + 1];
          return { position: newPosition, heading: SOUTH };
        case "0|-1":
          var newPosition = [xIncrement - (x % xIncrement) - 1, yIncrement];
          return { position: newPosition, heading: SOUTH };
        case "1|0":
          var newPosition = [maxX - 1, maxY - (y % yIncrement) - 1];
          return { position: newPosition, heading: WEST };
        case "-1|0":
          var newPosition = [xIncrement + (y % yIncrement), yIncrement];
          return { position: newPosition, heading: SOUTH };
        // return "<";
      }
      break;
    case 2:
      switch (`${heading[0]}|${heading[1]}`) {
        case "0|1":
          var newPosition = [xIncrement * 3 - 1 - x, maxY - 1];
          return { position: newPosition, heading: NORTH };
        // return "V";
        case "0|-1":
          var newPosition = [xIncrement * 3 - 1 - x, 0];
          return { position: newPosition, heading: SOUTH };
        case "1|0":
          var newPosition = [x + 1, y];
          return { position: newPosition, heading: EAST };
        case "-1|0":
          var newPosition = [maxX - (y % yIncrement) - 1, maxY - 1];
          return { position: newPosition, heading: NORTH };
        // return "<";
      }
      break;
    case 3:
      switch (`${heading[0]}|${heading[1]}`) {
        case "0|1":
          var newPosition = [
            xIncrement * 2,
            maxY - (position[0] % xIncrement) - 1,
          ];
          return { position: newPosition, heading: EAST };
        case "0|-1":
          var newPosition = [xIncrement * 2, position[0] - xIncrement];
          return { position: newPosition, heading: EAST };
        case "1|0":
          var newPosition = [x + 1, y];
          return { position: newPosition, heading: EAST };
        case "-1|0":
          var newPosition = [x - 1, y];
          return { position: newPosition, heading: WEST };
      }
      break;
    case 4:
      switch (`${heading[0]}|${heading[1]}`) {
        case "0|1":
          var newPosition = [x, y + 1];
          return { position: newPosition, heading: SOUTH };
        case "0|-1":
          var newPosition = [x, y - 1];
          return { position: newPosition, heading: NORTH };
        case "1|0":
          var newPosition = [maxX - (y % yIncrement) - 1, yIncrement * 2];
          return { position: newPosition, heading: SOUTH };
        case "-1|0":
          var newPosition = [x - 1, y];
          return { position: newPosition, heading: WEST };
      }
      break;
    case 5:
      switch (`${heading[0]}|${heading[1]}`) {
        case "0|1":
          var newPosition = [
            xIncrement - (x % xIncrement) - 1,
            yIncrement * 2 - 1,
          ];
          return { position: newPosition, heading: NORTH };
        // return "V";
        case "0|-1":
          var newPosition = [x, y - 1];
          return { position: newPosition, heading: NORTH };
        case "1|0":
          var newPosition = [x + 1, y];
          return { position: newPosition, heading: EAST };
        case "-1|0":
          var newPosition = [
            2 * xIncrement - (y % yIncrement) - 1,
            yIncrement * 2 - 1,
          ];
          return { position: newPosition, heading: NORTH };
        // return "<";
      }
      break;
    case 6:
      switch (`${heading[0]}|${heading[1]}`) {
        case "0|1":
          var newPosition = [0, 2 * xIncrement - (x % xIncrement) - 1];
          return { position: newPosition, heading: EAST };
        case "0|-1":
          var newPosition = [
            xIncrement * 3 - 1,
            2 * xIncrement - (x % xIncrement) - 1,
          ];
          return { position: newPosition, heading: WEST };
        case "1|0":
          var newPosition = [
            xIncrement * 3 - 1,
            yIncrement - (y % yIncrement) - 1,
          ];
          return { position: newPosition, heading: WEST };
        case "-1|0":
          var newPosition = [x - 1, y];
          return { position: newPosition, heading: WEST };
      }
      break;
  }
  throw new Error();
}

function getNextState(lastState: State): State {
  const heading = lastState.heading;
  var nextPosition = add(lastState.position, heading);
  var nextPositionString = positionToString(nextPosition);
  if (mapData.has(nextPositionString)) {
    return {
      position: nextPosition,
      heading: heading,
    };
  }

  const tempHeading = turn(turn(heading, "R"), "R");
  do {
    nextPosition = add(nextPosition, tempHeading);
    nextPositionString = positionToString(nextPosition);
    // console.log({ nextPosition });
  } while (mapData.has(nextPositionString));
  nextPosition = add(nextPosition, heading);
  // console.log({ nextPosition });
  nextPositionString = positionToString(nextPosition);
  // throw new Error();

  return {
    position: nextPosition,
    heading: heading,
  };
}

function walkUntilWall(state: State, distance: number): State {
  // printState(state);
  if (distance == 0) {
    return state;
  }
  var newState = getNextStateHard(maxX, maxY, state.position, state.heading);
  // var newState = getNextState(state);

  if (mapData.get(positionToString(newState.position)) == "#") {
    return state;
  } else {
    return walkUntilWall(newState, distance - 1);
  }
}

var globalState = initialState;
for (var i = 0; i < distances.length; i++) {
  var distance = distances[i];
  globalState = walkUntilWall(globalState, distance);
  // throw new Error();
  var direction = directions.shift();
  var heading = direction
    ? turn(globalState.heading, direction)
    : globalState.heading;
  globalState = {
    ...globalState,
    heading,
  };
}

const score =
  1000 * (globalState.position[1] + 1) +
  4 * (globalState.position[0] + 1) +
  getScore(globalState.heading);

console.log(score);
// console.log(distances);
// console.log(directions);

logTime();
export {};
