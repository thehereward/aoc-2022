import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

export function parseToPacket(string: string) {
  return JSON.parse(string);
}

type PacketPart = number | PacketPart[];

export function comparePackets(
  left: PacketPart,
  right: PacketPart
): boolean | undefined {
  if (typeof left == "number" && typeof right != "number") {
    left = [left];
  }
  if (typeof left != "number" && typeof right == "number") {
    right = [right];
  }

  if (typeof left == "number" && typeof right == "number") {
    if (left == right) {
      return;
    } else {
      return left < right;
    }
  }

  if (typeof left != "number" && typeof right != "number") {
    while (true) {
      var leftA = left.shift();
      var rightA = right.shift();

      if (leftA == undefined && rightA != undefined) {
        return true;
      }

      if (leftA != undefined && rightA == undefined) {
        return false;
      }

      if (leftA == undefined && rightA == undefined) {
        return;
      }

      var result = comparePackets(leftA, rightA);
      if (result != undefined) {
        return result;
      }
    }
  }
}

export function sortPackets(left: PacketPart, right: PacketPart): number {
  const result = comparePackets(_.cloneDeep(left), _.cloneDeep(right));
  if (result == undefined) {
    return 0;
  }

  return result ? -1 : 1;
}

// var packets: any[][] = [];

// var pair: any[] = [];
// data.forEach((line) => {
//   if (line.length == 0) {
//     packets.push(_.cloneDeep(pair));
//     pair = [];
//   } else {
//     pair.push(parseToPacket(line));
//   }
// });

var packets2: PacketPart[] = [];
// console.log(data);
// console.log(typeof data);
// data.forEach((line) => console.log(line));
data.forEach((line) => {
  if (line.length == 0) {
    return;
  }
  packets2.push(parseToPacket(line));
});

const dividerA = [[2]];
const dividerB = [[6]];

packets2.push(dividerA);
packets2.push(dividerB);
// const passFail = packets.map((packet) => {
//   return comparePackets(packet[0], packet[1]);
// });

// const answer = passFail.reduce((a, c, i) => {
//   if (c == true) {
//     return a + (i + 1);
//   } else if (c == false) {
//     return a;
//   } else {
//     throw c;
//   }
// }, 0);

// console.log(answer);

packets2.sort((a, b) => sortPackets(a, b));

console.log(packets2.indexOf(dividerA));
console.log(packets2.indexOf(dividerB));

const indexA = packets2.indexOf(dividerA) + 1;
const indexB = packets2.indexOf(dividerB) + 1;

console.log(indexA * indexB);

// 4493 incorrect

export {};
