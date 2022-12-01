import { readFile } from "../common";

var data = readFile("input");

var index = 0;
var munged = data.reduce(
  (a: number[], c: string) => {
    if (c.length == 0) {
      index = index + 1;
      a[index] = 0;
      return a;
    }

    a[index] = a[index] + parseInt(c);
    return a;
  },
  [0]
);

munged.sort().reverse();

const answer = munged[0] + munged[1] + munged[2];

console.log(answer);

export {};
