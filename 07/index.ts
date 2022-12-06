import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

function isThing(input: string, length: number) {
  return input.length == length && new Set(input.split("")).size == length;
}

function findThing(input: string, length: number) {
  for (var i = length; i < input.length; i = i + 1) {
    var sub = input.slice(i - length, i);
    if (isThing(sub, length)) {
      return i;
    }
  }
  return 0;
}

export function findMarker(input: string) {
  return findThing(input, 4);
}

export function findMessage(input: string) {
  return findThing(input, 14);
}

console.log(findMarker(data[0]));
console.log(findMessage(data[0]));

export {};
