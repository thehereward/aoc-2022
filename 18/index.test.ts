import each from "jest-each";
import { getMax } from ".";

describe("getMax", () => {
  each([
    [[{ x: 0, y: 0 }], 0],
    [[{ x: 1, y: 0 }], 1],
    [[{ x: 3, y: 0 }], 3],
    [
      [
        { x: 3, y: 0 },
        { x: 2, y: 0 },
      ],
      3,
    ],
  ]).test("for %s , returns %s", (rock, expected) => {
    expect(getMax(rock)).toStrictEqual(expected);
  });
});
