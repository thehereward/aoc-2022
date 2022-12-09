import each from "jest-each";
import { getNewTail, shouldMove } from ".";

describe("get new tail - when no movement required", () => {
  each([
    [
      [-1, -1],
      [0, 0],
    ],
    [
      [-1, 0],
      [0, 0],
    ],
    [
      [-1, -0],
      [0, 0],
    ],
    [
      [1, -1],
      [0, 0],
    ],
    [
      [1, 0],
      [0, 0],
    ],
    [
      [1, -0],
      [0, 0],
    ],
    [
      [0, -1],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 0],
    ],
    [
      [0, 1],
      [0, 0],
    ],
  ]).test("for %s, returns %s", (input, expected) => {
    expect(getNewTail(input, [0, 0])).toStrictEqual(expected);
  });
});

describe("get new tail - when movement IS required", () => {
  each([
    [
      [-2, -2],
      [-1, -1],
    ],
    [
      [-2, -1],
      [-1, -1],
    ],
    [
      [-2, 0],
      [-1, 0],
    ],
    [
      [-2, 1],
      [-1, 1],
    ],
    [
      [-2, 2],
      [-1, 1],
    ],
    [
      [-1, -2],
      [-1, -1],
    ],
    [
      [-1, 2],
      [-1, 1],
    ],
    [
      [0, -2],
      [0, -1],
    ],
    [
      [0, 2],
      [0, 1],
    ],
    [
      [1, -2],
      [1, -1],
    ],
    [
      [1, 2],
      [1, 1],
    ],
    [
      [2, -2],
      [1, -1],
    ],
    [
      [2, -1],
      [1, -1],
    ],
    [
      [2, -0],
      [1, 0],
    ],
    [
      [2, 1],
      [1, 1],
    ],
    [
      [2, 2],
      [1, 1],
    ],
  ]).test("for %s, returns %s", (input, expected) => {
    expect(getNewTail(input, [0, 0])).toStrictEqual(expected);
  });
});

describe("get new tail - when movement IS required", () => {
  each([
    [[-2, -2]],
    [[-2, -1]],
    [[-2, 0]],
    [[-2, 1]],
    [[-2, 2]],
    [[-1, -2]],
    [[-1, 2]],
    [[0, -2]],
    [[0, 2]],
    [[1, -2]],
    [[1, 2]],
    [[2, -2]],
    [[2, -1]],
    [[2, -0]],
    [[2, 1]],
    [[2, 2]],
  ]).test("for %s, returns true", (input) => {
    expect(shouldMove(input, [0, 0])).toBe(true);
  });
});
