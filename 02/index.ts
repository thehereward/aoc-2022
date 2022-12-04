import { readFile } from "../common";

var data = readFile("input");

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

const lookUp = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const values = data.map((line) => {
  const c1 = new Set(line.substring(0, line.length / 2).split(""));
  const c2 = new Set(line.substring(line.length / 2).split(""));
  const intersect = intersection(c1, c2);
  return intersect;
});

const secondPart = data.map((line) => {
  const set = new Set(line.split(""));
  return set;
});

const grouped = secondPart.reduce((a, c, i) => {
  const index = Math.floor(i / 3);
  if (!a[index]) {
    a[index] = [];
  }
  a[index].push(c);
  return a;
}, []);

// console.log(grouped);

const groups = grouped.map((group) => {
  const c1 = intersection(group[0], group[1]);
  return intersection(c1, group[2]);
});

// console.log(groups);

const finalSet = groups.reduce((a, c) => {
  for (const elem of c) {
    a.push(elem);
  }
  return a;
}, []);

// console.log(finalSet);

// const finalSet = values.reduce((a, c) => {
//   for (const elem of c) {
//     a.push(elem);
//   }
//   return a;
// }, []);

const result = [];
for (const elem of finalSet) {
  result.push(lookUp.indexOf(elem) + 1);
}

const answer = result.reduce((a, c) => a + c);

console.log(answer);

export {};
