import each from "jest-each";
import {
  turn,
  getSegment,
  getNextStateHard as gns,
  NORTH,
  SOUTH,
  EAST,
  WEST,
} from ".";

describe("turns right", () => {
  each([
    [EAST, SOUTH],
    [SOUTH, WEST],
    [WEST, NORTH],
    [NORTH, EAST],
  ]).test("heading %s turns R to %s", (initial, expected) => {
    expect(turn(initial, "R")).toEqual(expected);
  });
});

describe("turns left", () => {
  each([
    [EAST, NORTH],
    [SOUTH, EAST],
    [WEST, SOUTH],
    [NORTH, WEST],
  ]).test("heading %s turns L to %s", (initial, expected) => {
    expect(turn(initial, "L")).toEqual(expected);
  });
});

describe("get segment", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[8, 0], 1],
    [[11, 3], 1],
    [[0, 4], 2],
    [[3, 7], 2],
    [[4, 4], 3],
    [[7, 7], 3],
    [[8, 4], 4],
    [[11, 7], 4],
    [[8, 8], 5],
    [[11, 11], 5],
    [[12, 8], 6],
    [[15, 11], 6],
  ]).test("position %s is in segment %s", (initial, expected) => {
    expect(getSegment(maxX, maxY, initial)).toEqual(expected);
  });
});

describe("get next state (north)", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[8, 0], [3, 4], SOUTH],
    [[1, 4], [10, 0], SOUTH],
    [[4, 4], [8, 0], EAST],
    [[8, 4], [8, 3], NORTH],
    [[8, 8], [8, 7], NORTH],
    [[14, 8], [11, 5], WEST],
  ]).test(
    "position %s results in position %s and heading %s",
    (pos, expectedPosition, expectedHeading) => {
      expect(gns(maxX, maxY, pos, NORTH).position).toEqual(expectedPosition);
      expect(gns(maxX, maxY, pos, NORTH).heading).toEqual(expectedHeading);
    }
  );
});

describe("get next state (south)", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[8, 3], [8, 4], SOUTH],
    [[1, 7], [10, 11], NORTH],
    [[4, 7], [8, 11], EAST],
    [[8, 7], [8, 8], SOUTH],
    [[10, 11], [1, 7], NORTH],
    [[12, 11], [0, 7], EAST],
  ]).test(
    "position %s results in position %s and heading %s",
    (pos, expectedPosition, expectedHeading) => {
      expect(gns(maxX, maxY, pos, SOUTH).position).toEqual(expectedPosition);
      expect(gns(maxX, maxY, pos, SOUTH).heading).toEqual(expectedHeading);
    }
  );
});

describe("get next state (east)", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[11, 0], [15, 11], WEST],
    [[3, 4], [4, 4], EAST],
    [[7, 4], [8, 4], EAST],
    [[11, 5], [14, 8], SOUTH],
    [[11, 8], [12, 8], EAST],
    [[15, 9], [11, 2], WEST],
  ]).test(
    "position %s results in position %s and heading %s",
    (pos, expectedPosition, expectedHeading) => {
      expect(gns(maxX, maxY, pos, EAST).position).toEqual(expectedPosition);
      expect(gns(maxX, maxY, pos, EAST).heading).toEqual(expectedHeading);
    }
  );
});

describe("get next state (west)", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[8, 0], [4, 4], SOUTH],
    [[0, 5], [14, 11], NORTH],
    [[4, 5], [3, 5], WEST],
    [[8, 5], [7, 5], WEST],
    [[8, 9], [6, 7], NORTH],
    [[12, 8], [11, 8], WEST],
  ]).test(
    "position %s results in position %s and heading %s",
    (pos, expectedPosition, expectedHeading) => {
      expect(gns(maxX, maxY, pos, WEST).position).toEqual(expectedPosition);
      expect(gns(maxX, maxY, pos, WEST).heading).toEqual(expectedHeading);
    }
  );
});

describe("specific cases", () => {
  const maxX = 16;
  const maxY = 12;
  each([
    [[8, 0], EAST, [9, 0], EAST],
    [[9, 0], EAST, [10, 0], EAST],
  ]).test(
    "position %s results in position %s",
    (pos, head, expectedPosition, expectedHeading) => {
      expect(gns(maxX, maxY, pos, head).position).toEqual(expectedPosition);
      expect(gns(maxX, maxY, pos, head).heading).toEqual(expectedHeading);
    }
  );
});
