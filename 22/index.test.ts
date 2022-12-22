import each from "jest-each";
import { turn, getSegment } from ".";

describe("turns right", () => {
  each([
    [
      [1, 0],
      [0, 1],
    ],
    [
      [0, 1],
      [-1, 0],
    ],
    [
      [-1, 0],
      [0, -1],
    ],
    [
      [0, -1],
      [1, 0],
    ],
  ]).test("heading %s turns R to %s", (initial, expected) => {
    expect(turn(initial, "R")).toEqual(expected);
  });
});

describe("turns left", () => {
  each([
    [
      [1, 0],
      [0, -1],
    ],
    [
      [0, 1],
      [1, 0],
    ],
    [
      [-1, 0],
      [0, 1],
    ],
    [
      [0, -1],
      [-1, 0],
    ],
  ]).test("heading %s turns L to %s", (initial, expected) => {
    expect(turn(initial, "L")).toEqual(expected);
  });
});

describe("get segment", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[0, 8], 1],
    [[3, 11], 1],
    [[4, 0], 2],
    [[7, 3], 2],
    [[4, 4], 3],
    [[7, 7], 3],
    [[4, 8], 4],
    [[7, 11], 4],
    [[8, 8], 5],
    [[11, 11], 5],
    [[12, 8], 6],
    [[15, 11], 6],
  ]).test("position %s is in segment %s", (initial, expected) => {
    expect(getSegment(maxX, maxY, initial)).toEqual(expected);
  });
});
