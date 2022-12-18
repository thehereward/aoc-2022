import each from "jest-each";
import { isAdjacent } from ".";

describe("isAdjacent when cubes are adjacent", () => {
  each([
    [[0, 0, 0], [0, 0, 1], true],
    [[0, 0, 0], [0, 1, 0], true],
    [[0, 0, 0], [1, 0, 0], true],
    [[0, 0, 0], [1, 1, 0], false],
    [[0, 0, 0], [1, 0, 1], false],
    [[0, 0, 0], [0, 1, 1], false],
    [[0, 0, 0], [1, 1, 1], false],
  ]).test("for (%s) and ($s) returns %s", (cubeA, cubeB, expected) => {
    expect(isAdjacent(cubeA, cubeB)).toStrictEqual(expected);
  });
});
