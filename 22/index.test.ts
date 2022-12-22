import each from "jest-each";
import { turn } from ".";

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
