import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

var head = [0, 0];
var tail = [0, 0];
var tailHistory: number[][] = [];
var headHistory: number[][] = [];

function addToHeadHistory(head: number[]) {
  var newHead = [...head];
  headHistory.push(newHead);
}

function addToTailHistory(tail: number[]) {
  var newTail = [...tail];
  tailHistory.push(newTail);
}

addToHeadHistory(head);
addToTailHistory(tail);

var instructions = data.flatMap((line) => {
  var parts = line.split(" ");
  var number = parseInt(parts[1]);
  return Array.from(parts[0].repeat(number));
});

// console.log(instructions);

function shouldMove() {
  if (Math.abs(head[0] - tail[0]) >= 2) {
    return true;
  }

  if (Math.abs(head[1] - tail[1]) >= 2) {
    return true;
  }

  return false;
}

instructions.forEach((instruction) => {
  switch (instruction) {
    case "U":
      head = [head[0], head[1] + 1];
      break;
    case "D":
      head = [head[0], head[1] - 1];
      break;
    case "L":
      head = [head[0] - 1, head[1]];
      break;
    case "R":
      head = [head[0] + 1, head[1]];
      break;
  }

  if (shouldMove()) {
    if (Math.abs(head[1] - tail[1]) > 1) {
      if (head[1] > tail[1]) {
        tail = [head[0], tail[1] + 1];
      } else {
        tail = [head[0], tail[1] - 1];
      }
    } else {
      if (head[0] > tail[0]) {
        tail = [tail[0] + 1, head[1]];
      } else {
        tail = [tail[0] - 1, head[1]];
      }
    }
  }
  addToHeadHistory(head);
  addToTailHistory(tail);
});

// for (var i = 0; i < headHistory.length; i = i + 1) {
//   console.log(i);
//   console.log(headHistory[i]);
//   console.log(tailHistory[i]);
// }

var tailSet = new Set(tailHistory.map((t) => `${t[0]}|${t[1]}`));
console.log(tailSet.size);

// console.log(headHistory)
// console.log(tailHistory);
export {};
