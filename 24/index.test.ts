import each from "jest-each";
import { getBlizzardAtTime, Blizzard, Bounds, isABlizzard } from ".";

describe("get blizzard at time - easterly", () => {
  //
  // #####
  // #>..#
  // #####
  //

  const bounds: Bounds = {
    min: [0, 0],
    max: [4, 2],
  };

  const blizzard: Blizzard = {
    position: [1, 1],
    direction: [1, 0],
    directionChar: ">",
  };
  each([
    [0, [1, 1]],
    [1, [2, 1]],
    [2, [3, 1]],
    [3, [1, 1]],
    [4, [2, 1]],
    [5, [3, 1]],
  ]).test("at time %s, position is %s", (time, expected) => {
    expect(getBlizzardAtTime(blizzard, time, bounds).position).toEqual(
      expected
    );
  });
});

describe("get blizzard at time - westerly", () => {
  //
  // #####
  // #<..#
  // #####
  //

  const bounds: Bounds = {
    min: [0, 0],
    max: [4, 2],
  };

  const blizzard: Blizzard = {
    position: [1, 1],
    direction: [-1, 0],
    directionChar: "<",
  };
  each([
    [0, [1, 1]],
    [1, [3, 1]],
    [2, [2, 1]],
    [3, [1, 1]],
    [4, [3, 1]],
    [5, [2, 1]],
  ]).test("at time %s, position is %s", (time, expected) => {
    expect(getBlizzardAtTime(blizzard, time, bounds).position).toEqual(
      expected
    );
  });
});

describe("get blizzard at time - southerly", () => {
  //
  // ####
  // #v.#
  // #..#
  // #..#
  // ####
  //

  const bounds: Bounds = {
    min: [0, 0],
    max: [2, 4],
  };

  const blizzard: Blizzard = {
    position: [1, 1],
    direction: [0, 1],
    directionChar: "v",
  };
  each([
    [0, [1, 1]],
    [1, [1, 2]],
    [2, [1, 3]],
    [3, [1, 1]],
    [4, [1, 2]],
    [5, [1, 3]],
  ]).test("at time %s, position is %s", (time, expected) => {
    expect(getBlizzardAtTime(blizzard, time, bounds).position).toEqual(
      expected
    );
  });
});

describe("is a blizzard", () => {
  const blizzards: Blizzard[] = [
    { position: [5, 1], direction: [1, 0], directionChar: ">" },
    { position: [5, 2], direction: [0, -1], directionChar: "^" },
    { position: [5, 2], direction: [-1, 0], directionChar: "<" },
    { position: [5, 1], direction: [0, -1], directionChar: "^" },
    { position: [4, 1], direction: [1, 0], directionChar: ">" },
    { position: [4, 3], direction: [1, 0], directionChar: ">" },
    { position: [4, 4], direction: [-1, 0], directionChar: "<" },
    { position: [4, 1], direction: [0, -1], directionChar: "^" },
    { position: [3, 1], direction: [-1, 0], directionChar: "<" },
    { position: [3, 2], direction: [-1, 0], directionChar: "<" },
    { position: [3, 3], direction: [1, 0], directionChar: ">" },
    { position: [3, 3], direction: [0, 1], directionChar: "v" },
    { position: [3, 4], direction: [1, 0], directionChar: ">" },
    { position: [2, 2], direction: [-1, 0], directionChar: "<" },
    { position: [2, 2], direction: [0, 1], directionChar: "v" },
    { position: [2, 3], direction: [-1, 0], directionChar: "<" },
    { position: [2, 1], direction: [0, -1], directionChar: "^" },
    { position: [1, 1], direction: [-1, 0], directionChar: "<" },
    { position: [1, 3], direction: [1, 0], directionChar: ">" },
  ];
  each([
    [[1, 1], true],
    [[0, 0], false],
  ]).test("at time %s, position is %s", (coord, expected) => {
    expect(isABlizzard(coord, blizzards)).toEqual(expected);
  });
});
