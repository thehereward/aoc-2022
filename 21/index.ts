import _, { indexOf } from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const KEY = 811589153;

class Item {
  value: number;
}

var items: Item[] = data.map((line) => {
  return {
    value: parseInt(line),
  };
});

export function moveItem(list: Item[], item: Item) {
  var index = list.indexOf(item);
  list.splice(index, 1);
  var length = list.length;
  var value = item.value;
  var newIndex = (index + value) % length;
  if (newIndex == 0) {
    newIndex = length;
  }

  list.splice(newIndex, 0, item);
  return list;
}

function mix(instructions: Item[], list: Item[]) {
  instructions.forEach((item) => {
    list = moveItem(list, item);
  });
  return list;
}

function getCoordinates(list: Item[]) {
  var indexOfZero = list.findIndex((item) => item.value == 0);
  var coords = [1000, 2000, 3000].map((number) => {
    var index = (indexOfZero + number) % list.length;
    return list[index];
  });
  return coords.reduce((a, c) => a + c.value, 0);
}

function part1(list: Item[]) {
  var instructions = _.clone(list);
  list = mix(instructions, list);
  var answer = getCoordinates(list);
  logTime(`Part 1: ${answer}`);
}

function part2(list: Item[]) {
  list = list.map((i) => {
    return {
      value: i.value * KEY,
    };
  });
  var instructions = _.clone(list);
  for (var i = 0; i < 10; i++) {
    list = mix(instructions, list);
  }
  var answer = getCoordinates(list);
  logTime(`Part 2: ${answer}`);
}

part1(_.clone(items));
part2(_.clone(items));

logTime();
export {};
