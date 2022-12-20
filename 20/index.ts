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
    value: parseInt(line) * KEY,
  };
});

// console.log(items.length);
// var set = new Set(items);
// console.log(set.size);

var newOrder = _.clone(items);

function printList(list: Item[]) {
  logTime(list.map((i) => i.value).join(", "));
}

export function moveItem(list: Item[], item: Item) {
  // printList(list);
  var index = list.indexOf(item);
  list.splice(index, 1);
  var length = list.length;
  var value = item.value;
  var newIndex = index + value;
  if (newIndex > length) {
    newIndex = newIndex % length;
  } else if (newIndex < 0) {
    // while (newIndex < 0) {
    //   newIndex = newIndex + length;
    // }
    newIndex = newIndex % length;
  } else if (newIndex == 0) {
    newIndex = length;
  }

  // console.log({
  //   index,
  //   length,
  //   value,
  //   newIndex,
  // });

  list.splice(newIndex, 0, item);
  return list;
}

for (var i = 0; i < 10; i++) {
  items.forEach((item) => {
    newOrder = moveItem(newOrder, item);
  });
}
// printList(newOrder);

var indexOfZero = newOrder.findIndex((item) => item.value == 0);

var coords = [1000, 2000, 3000].map((number) => {
  var index = (indexOfZero + number) % newOrder.length;
  return newOrder[index];
});

console.log(coords.reduce((a, c) => a + c.value, 0));

// Part 1
// 12570 - incorrect

logTime();
export {};
