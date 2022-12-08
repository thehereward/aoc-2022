import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

class Tree {
  height: number;
  tallest_north: number;
  tallest_east: number;
  tallest_south: number;
  tallest_west: number;
}

var trees: Tree[][] = data.map((line) => {
  return line.split("").map((char) => {
    return {
      height: parseInt(char),
      tallest_north: -1,
      tallest_east: -1,
      tallest_south: -1,
      tallest_west: -1,
    };
  });
});

const yMax = trees.length - 1;
const xMax = trees[0].length - 1;

for (var y = 1; y < yMax; y = y + 1) {
  for (var x = 1; x < xMax; x = x + 1) {
    trees[y][x] = {
      ...trees[y][x],
      tallest_north: Math.max(
        trees[y - 1][x].tallest_north,
        trees[y - 1][x].height
      ),
      tallest_west: Math.max(
        trees[y][x - 1].tallest_west,
        trees[y][x - 1].height
      ),
    };

    trees[yMax - y][xMax - x] = {
      ...trees[yMax - y][xMax - x],
      tallest_south: Math.max(
        trees[yMax - y + 1][xMax - x].tallest_south,
        trees[yMax - y + 1][xMax - x].height
      ),
      tallest_east: Math.max(
        trees[yMax - y][xMax - x + 1].tallest_east,
        trees[yMax - y][xMax - x + 1].height
      ),
    };
  }
}

function isVisible(tree: Tree): boolean {
  return (
    tree.height > tree.tallest_north ||
    tree.height > tree.tallest_east ||
    tree.height > tree.tallest_south ||
    tree.height > tree.tallest_west
  );
}

var count = 0;

for (var y = 0; y <= yMax; y = y + 1) {
  for (var x = 0; x <= xMax; x = x + 1) {
    if (isVisible(trees[y][x])) {
      count = count + 1;
    }
  }
}

console.log(count);

export {};
