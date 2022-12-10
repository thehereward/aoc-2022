import _, { sum } from "lodash";
import { readFile } from "../common";

var data = readFile("input");

const instructionRegex = /^([a-z]+) ?(-?[\d]*)$/;

class State {
  cycle: number;
  x: number;
}

class Instruction {
  instruction: string;
  value?: number;
}

var state: State = {
  cycle: 1,
  x: 1,
};

const instructions: Instruction[] = data.flatMap((line) => {
  if (line.startsWith("noop")) {
    return {
      instruction: "noop",
    };
  }

  if (line.startsWith("addx ")) {
    return [
      {
        instruction: "noop",
      },
      {
        instruction: "addx",
        value: parseInt(line.replace("addx ", "")),
      },
    ];
  }
});

export function applyInstruction(
  state: State,
  instruction: Instruction
): State {
  switch (instruction.instruction) {
    case "noop":
      return {
        cycle: state.cycle + 1,
        x: state.x,
      };
    case "addx":
      return {
        cycle: state.cycle + 1,
        x: state.x + instruction.value,
      };
  }
}

var sumSignalStrength = 0;

function log(state: State, instruction: Instruction) {
  if ((state.cycle - 20) % 40 == 0) {
    sumSignalStrength = sumSignalStrength + state.cycle * state.x;
    console.log(
      `Cycle: ${state.cycle} | X: ${state.x} | Strength: ${
        state.cycle * state.x
      } | Instruction: ${instruction.instruction} | Value: ${instruction.value}`
    );
    1249872;
  }
}

var pixels: string[] = [];

function drawPixel(state: State) {
  var pixelNumber = (state.cycle - 1) % 40;
  if (pixelNumber >= state.x - 1 && pixelNumber <= state.x + 1) {
    pixels.push("#");
  } else {
    pixels.push(".");
  }
  // console.log(
  //   `Cycle: ${state.cycle} | Pixel: ${pixelNumber} | X: ${
  //     state.x
  //   } | P: ${pixels.join("")}`
  // );
}

instructions.forEach((instruction) => {
  drawPixel(state);
  state = applyInstruction(state, instruction);
  // if (pixels.length > 20) {
  //   process.exit();
  // }
});

for (var i = 0; i <= 5; i = i + 1) {
  var index = i * 40;
  var row = pixels.slice(index, index + 40);
  console.log(row.join(""));
}

// console.log(sumSignalStrength);

export {};
