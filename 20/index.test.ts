import each from "jest-each";
import { instructionToBluePrint, buildBlueprint, part1, part2 } from ".";

describe("parses input lines to blue prints", () => {
  each([
    [
      "Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.",
      {
        Id: 1,
        OreRobotCost: [4, 0, 0],
        ClayRobotCost: [2, 0, 0],
        ObsidianRobotCost: [3, 14, 0],
        GeodeRobotCost: [2, 0, 7],
      },
    ],
    [
      "Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.",
      {
        Id: 2,
        OreRobotCost: [2, 0, 0],
        ClayRobotCost: [3, 0, 0],
        ObsidianRobotCost: [3, 8, 0],
        GeodeRobotCost: [3, 0, 12],
      },
    ],
    ,
  ]).test("for (%s) returns %s", (input, expected) => {
    expect(instructionToBluePrint(input)).toStrictEqual(expected);
  });
});

describe("gets all possible builds", () => {
  each([
    [
      {
        Id: 1,
        OreRobotCost: [4, 0, 0],
        ClayRobotCost: [2, 0, 0],
        ObsidianRobotCost: [3, 14, 0],
        GeodeRobotCost: [2, 0, 7],
      },
      {
        Minute: 0,
        Ore: { Quantity: 2, Robots: 1, NewRobots: 0 },
        Clay: { Quantity: 0, Robots: 0, NewRobots: 0 },
        Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
        Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
      },
      [
        {
          Minute: 0,
          Ore: { Quantity: 2, Robots: 1, NewRobots: 0 },
          Clay: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
        },
        {
          Minute: 0,
          Ore: { Quantity: 0, Robots: 1, NewRobots: 0 },
          Clay: { Quantity: 0, Robots: 0, NewRobots: 1 },
          Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
        },
      ],
    ],
    [
      {
        Id: 1,
        OreRobotCost: [4, 0, 0],
        ClayRobotCost: [2, 0, 0],
        ObsidianRobotCost: [3, 14, 0],
        GeodeRobotCost: [2, 0, 7],
      },
      {
        Minute: 0,
        Ore: { Quantity: 4, Robots: 1, NewRobots: 0 },
        Clay: { Quantity: 0, Robots: 0, NewRobots: 0 },
        Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
        Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
      },
      [
        {
          Minute: 0,
          Ore: { Quantity: 4, Robots: 1, NewRobots: 0 },
          Clay: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
        },
        {
          Minute: 0,
          Ore: { Quantity: 0, Robots: 1, NewRobots: 1 },
          Clay: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
        },
        {
          Minute: 0,
          Ore: { Quantity: 2, Robots: 1, NewRobots: 0 },
          Clay: { Quantity: 0, Robots: 0, NewRobots: 1 },
          Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
          Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
        },
      ],
    ],
  ]).test("for (%s) and (%s) returns %s", (blueprint, state, expected) => {
    expect(buildBlueprint(blueprint, state)).toStrictEqual(expected);
  });
});

describe("it passes", () => {
  it("part 1", () => {
    expect(part1()).toBe(1092);
  });
  it("part 2", () => {
    expect(part2()).toBe(3542);
  });
});
