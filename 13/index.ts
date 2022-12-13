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

var packets: any[][] = [];

var pair: any[] = [];
data.forEach((line) => {
  if (line.length == 0) {
    packets.push(_.cloneDeep(pair));
    pair = [];
  } else {
    pair.push(parseToPacket(line));
  }
});

const passFail = packets.map((packet) => {
  return comparePackets(packet[0], packet[1]);
});

const answer = passFail.reduce((a, c, i) => {
  if (c == true) {
    return a + (i + 1);
  } else if (c == false) {
    return a;
  } else {
    throw c;
  }
}, 0);

console.log(answer);

// 4493 incorrect

export {};
