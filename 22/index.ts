import _, { identity, indexOf, last } from "lodash";
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
class Solvable {
  id: string;
  op1: string | number;
  op: string;
  op2: string | number;
}

class Solved {
  id: string;
  value: number;
}

var unsolved: Unsolved[] = [];
var solved: Solved[] = [];
const solvedIds: Set<string> = new Set<string>();

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
      op: parts[0] == "root" ? "==" : match[2],
      op2: match[3],
    });
  } else {
    if (parts[0] != "humn") {
      solved.push({
        id: parts[0],
        value,
      });
      solvedIds.add(parts[0]);
    }
  }
});

solved = solved.filter((i) => i.id != "humn");

var lastLength = Infinity;
while (unsolved.length != lastLength) {
  lastLength = unsolved.length;
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
    }
  });
}

var solvables: Solvable[] = _.cloneDeep(unsolved);
solvables.forEach((i) => {
  if (typeof i.op1 == "string") {
    if (solvedIds.has(i.op1)) {
      i.op1 = solved.filter((m) => m.id == i.op1)[0].value;
    }
  }
  if (typeof i.op2 == "string") {
    if (solvedIds.has(i.op2)) {
      i.op2 = solved.filter((m) => m.id == i.op2)[0].value;
    }
  }
});

const root = solvables.filter((i) => i.id == "root")[0];

function TryToSolve(unsolved: number | string, rightHandSide: number) {
  if (typeof unsolved == "string") {
    var ob = solvables.filter((solvable) => solvable.id == unsolved)[0];
    if (unsolved == "humn") {
      console.log(`answer: ${rightHandSide}`);
      return;
    }
    console.log(ob);
    console.log(rightHandSide);
    switch (ob.op) {
      case "+":
        if (typeof ob.op2 == "number") {
          TryToSolve(ob.op1, rightHandSide - ob.op2);
        } else if (typeof ob.op1 == "number") {
          TryToSolve(ob.op2, rightHandSide - ob.op1);
        }
        break;
      case "-":
        if (typeof ob.op2 == "number") {
          var newRHS = rightHandSide + ob.op2;
          TryToSolve(ob.op1, newRHS);
        } else if (typeof ob.op1 == "number") {
          var newRHS = (rightHandSide - ob.op1) * -1;
          TryToSolve(ob.op2, newRHS);
        }
        break;
      case "*":
        if (typeof ob.op2 == "number") {
          TryToSolve(ob.op1, rightHandSide / ob.op2);
        } else if (typeof ob.op1 == "number") {
          TryToSolve(ob.op2, rightHandSide / ob.op1);
        }
        break;
      case "/":
        if (typeof ob.op2 != "number") {
          throw new Error();
        }
        var newRHS = rightHandSide * ob.op2;
        TryToSolve(ob.op1, newRHS);
        break;
    }
  }
}

if (typeof root.op2 == "number") {
  TryToSolve(root.op1, root.op2);
}

function log(input: number) {
  if (input % 100 == 0) {
    logTime(`input: ${input}`);
  }
}

logTime();
export {};
