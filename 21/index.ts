import _, { indexOf } from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");
const instructionRegex = /([a-z]{4}) ([\+\-\*\/]) ([a-z]{4})/;

class Unsolved {
  id: string;
  op1: string;
  op: string;
  op2: string;
}

class Solved {
  id: string;
  value: number;
}

var unsolved: Unsolved[] = [];
var solved: Solved[] = [];
var solvedIds: Set<string> = new Set<string>();

data.forEach((line) => {
  if (line.length == 0) {
    return;
  }
  var parts = line.split(": ");
  var value = parseInt(parts[1]);
  if (isNaN(value)) {
    const match = parts[1].match(instructionRegex);
    unsolved.push({
      id: parts[0],
      op1: match[1],
      op: match[2],
      op2: match[3],
    });
  } else {
    solved.push({
      id: parts[0],
      value,
    });
    solvedIds.add(parts[0]);
  }
});

while (unsolved.length > 0) {
  unsolved.forEach((line, index) => {
    if (solvedIds.has(line.op1) && solvedIds.has(line.op2)) {
      const id = line.id;
      const op1 = solved.filter((i) => i.id == line.op1)[0].value;
      const op2 = solved.filter((i) => i.id == line.op2)[0].value;
      var value: number = undefined;
      switch (line.op) {
        case "+":
          value = op1 + op2;
          break;
        case "-":
          value = op1 - op2;
          break;
        case "*":
          value = op1 * op2;
          break;
        case "/":
          value = op1 / op2;
          break;
      }
      const answer = {
        id,
        value,
      };
      solved.push(answer);
      solvedIds.add(id);
      unsolved.splice(index, 1);
      // console.log(answer);
    }
  });
}

console.log(solved);
console.log(unsolved);
console.log(solved.filter((s) => s.id == "root"));

logTime();
export {};
