import _ from "lodash";

const start = Date.now();

const testRelief = 23n * 19n * 13n * 17n;
const realRelief = 7n * 11n * 13n * 3n * 17n * 2n * 5n * 19n;

class Monkey {
  id: number;
  items: bigint[];
  inspect: (old: bigint) => bigint;
  test: (x: bigint) => boolean;
  throwTo: number[];
  itemCount: bigint;
}

const realMonkeys: Monkey[] = [
  {
    id: 0,
    items: [63n, 57n],
    inspect: (old: bigint) => old * 11n,
    test: (x: bigint) => x % 7n == 0n,
    throwTo: [6, 2],
    itemCount: 0n,
  },
  {
    id: 1,
    items: [82n, 66n, 87n, 78n, 77n, 92n, 83n],
    inspect: (old: bigint) => old + 1n,
    test: (x: bigint) => x % 11n == 0n,
    throwTo: [5, 0],
    itemCount: 0n,
  },
  {
    id: 2,
    items: [97n, 53n, 53n, 85n, 58n, 54n],
    inspect: (old: bigint) => old * 7n,
    test: (x: bigint) => x % 13n == 0n,
    throwTo: [4, 3],
    itemCount: 0n,
  },
  {
    id: 3,
    items: [50n],
    inspect: (old: bigint) => old + 3n,
    test: (x: bigint) => x % 3n == 0n,
    throwTo: [1, 7],
    itemCount: 0n,
  },
  {
    id: 4,
    items: [64n, 69n, 52n, 65n, 73n],
    inspect: (old: bigint) => old + 6n,
    test: (x: bigint) => x % 17n == 0n,
    throwTo: [3, 7],
    itemCount: 0n,
  },
  {
    id: 5,
    items: [57n, 91n, 65n],
    inspect: (old: bigint) => old + 5n,
    test: (x: bigint) => x % 2n == 0n,
    throwTo: [0, 6],
    itemCount: 0n,
  },
  {
    id: 6,
    items: [67n, 91n, 84n, 78n, 60n, 69n, 99n, 83n],
    inspect: (old: bigint) => old * old,
    test: (x: bigint) => x % 5n == 0n,
    throwTo: [2, 4],
    itemCount: 0n,
  },
  {
    id: 6,
    items: [58n, 78n, 69n, 65n],
    inspect: (old: bigint) => old + 7n,
    test: (x: bigint) => x % 19n == 0n,
    throwTo: [5, 1],
    itemCount: 0n,
  },
];

const testMonkeys: Monkey[] = [
  {
    id: 0,
    items: [79n, 98n],
    inspect: (old: bigint) => old * 19n,
    test: (x: bigint) => x % 23n == 0n,
    throwTo: [2, 3],
    itemCount: 0n,
  },
  {
    id: 1,
    items: [54n, 65n, 75n, 74n],
    inspect: (old: bigint) => old + 6n,
    test: (x: bigint) => x % 19n == 0n,
    throwTo: [2, 0],
    itemCount: 0n,
  },
  {
    id: 2,
    items: [79n, 60n, 97n],
    inspect: (old: bigint) => old * old,
    test: (x: bigint) => x % 13n == 0n,
    throwTo: [1, 3],
    itemCount: 0n,
  },
  {
    id: 3,
    items: [74n],
    inspect: (old: bigint) => old + 3n,
    test: (x: bigint) => x % 17n == 0n,
    throwTo: [0, 1],
    itemCount: 0n,
  },
];

const monkeys: Monkey[] = realMonkeys;
const specialRelief = realRelief;

function relief(item: number) {
  return Math.floor(item / 3);
}

function newRelief(item: bigint) {
  return item % specialRelief;
}

function inspectItem(monkey: Monkey) {
  var item = monkey.items.shift();
  item = monkey.inspect(item);
  // item = relief(item);
  item = newRelief(item);
  const throwTo = monkey.test(item) ? monkey.throwTo[0] : monkey.throwTo[1];
  monkeys[throwTo].items.push(item);
  monkey.itemCount = monkey.itemCount + 1n;
}

function printItems(monkeys: Monkey[]) {
  monkeys.forEach((monkey) => {
    console.log(`Monkey: ${monkey.id}: ${monkey.items.join(", ")}`);
  });
}

function runRound() {
  monkeys.forEach((monkey) => {
    while (monkey.items.length > 0) {
      inspectItem(monkey);
    }
  });
}

function printCounts() {
  monkeys.forEach((monkey) => {
    console.log(
      `Monkey ${monkey.id} inspected items ${monkey.itemCount} times`
    );
  });
}

function log(i: number) {
  if (i % 100 == 0) {
    console.log(`${i} - ${Date.now() - start}ms`);
  }
}

for (var i = 1; i <= 10000; i = i + 1) {
  log(i);
  runRound();
  // printItems(monkeys);
}

printCounts();

const end = Date.now();

console.log(end - start);

// 23,132,301,336 too low

export {};
