import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input").filter((l) => l.length > 0);

const lines = data.map((line) => line.split("").reverse());

function snafu2Dec(snafu: string[]) {
  var output = 0;
  output = snafu.reduce((a, c, i) => {
    const power = Math.pow(5, i);
    switch (c) {
      case "0":
        a = a + 0;
        break;
      case "1":
        a = a + power;
        break;
      case "2":
        a = a + power * 2;
        break;
      case "-":
        a = a - power;
        break;
      case "=":
        a = a - power * 2;
        break;
    }

    return a;
  }, 0);
  return output;
}

class SnafuChar {
  char: string;
  carried: number;
}

function getChar(number: number, power: number, carried: number): SnafuChar {
  const value = (number + carried) % power;
  switch (value) {
    case 0:
      return { char: "0", carried: 0 };
    case 1:
      return { char: "1", carried: 0 };
    case 2:
      return { char: "2", carried: 0 };
    case 3:
      return { char: "=", carried: 1 };
    case 4:
      return { char: "-", carried: 1 };
  }
}

export function dec2Snafu(input: number): string {
  var _input = input;
  var _carried = 0;
  var chars: string[] = [];
  while (_input > 0) {
    var { char, carried } = getChar(_input, 5, _carried);
    chars.push(char);
    _input = Math.floor(_input / 5) + carried;
  }
  return chars.reverse().join("");
}

const numbers = lines.map(snafu2Dec);

const total = numbers.reduce((a, c) => {
  return a + c;
});

console.log(dec2Snafu(total));

logTime();
export {};
