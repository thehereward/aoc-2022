import _ from "lodash";
import { readFile } from "../common";

const initialReal = [
  "NSDCVQT".split(""),
  "MFV".split(""),
  "FQWDPNHM".split(""),
  "DQRTF".split(""),
  "RFMNQHVB".split(""),
  "CFGNPWQ".split(""),
  "WFRLCT".split(""),
  "TZNS".split(""),
  "MSDJRQHN".split(""),
];

const initialTest = ["ZN".split(""), "MCD".split(""), "P".split("")];

var data = readFile("input");

const regex = /^move (\d+) from (\d+) to (\d+)$/;
const instructions = data.map((line) => {
  var match = line.match(regex);
  return {
    number: parseInt(match[1]),
    from: parseInt(match[2]),
    to: parseInt(match[3]),
  };
});

function applyInstructionPart1(
  cols: string[][],
  instruction: { number: number; from: number; to: number }
) {
  for (var i = 0; i < instruction.number; i = i + 1) {
    var moved = cols[instruction.from - 1].pop();
    cols[instruction.to - 1].push(moved);
  }
  return cols;
}

function applyInstructionPart2(
  cols: string[][],
  instruction: { number: number; from: number; to: number }
) {
  var moved = cols[instruction.from - 1].slice(-1 * instruction.number);
  cols[instruction.from - 1].splice(-1 * instruction.number);
  cols[instruction.to - 1].push(...moved);
  return cols;
}

var cols = _.cloneDeep(initialReal);
instructions.forEach(
  (instruction) => (cols = applyInstructionPart1(cols, instruction))
);

var answer: string[] = [];
cols.forEach((col) => {
  answer.push(col.pop());
});

console.log(`Part 1: ${answer.join("")}`);

cols = _.cloneDeep(initialReal);
instructions.forEach(
  (instruction) => (cols = applyInstructionPart2(cols, instruction))
);

answer = [];
cols.forEach((col) => {
  answer.push(col.pop());
});

console.log(`Part 2: ${answer.join("")}`);

export {};
