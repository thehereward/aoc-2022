import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const blueprintRegex =
  /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/;

// [Ore, Clay, Obsidian]

class ResourceState {
  Quantity: number;
  Robots: number;
  NewRobots: number;
}

class State {
  Minute: number;
  Ore: ResourceState;
  Clay: ResourceState;
  Obsidian: ResourceState;
  Geode: ResourceState;
}

const initialState: State = {
  Minute: 0,
  Ore: { Quantity: 0, Robots: 1, NewRobots: 0 },
  Clay: { Quantity: 0, Robots: 0, NewRobots: 0 },
  Obsidian: { Quantity: 0, Robots: 0, NewRobots: 0 },
  Geode: { Quantity: 0, Robots: 0, NewRobots: 0 },
};

class Blueprint {
  Id: number;
  OreRobotCost: number[];
  ClayRobotCost: number[];
  ObsidianRobotCost: number[];
  GeodeRobotCost: number[];
}

export function instructionToBluePrint(line: string): Blueprint {
  const match = line.match(blueprintRegex);
  return {
    Id: parseInt(match[1]),
    OreRobotCost: [parseInt(match[2]), 0, 0],
    ClayRobotCost: [parseInt(match[3]), 0, 0],
    ObsidianRobotCost: [parseInt(match[4]), parseInt(match[5]), 0],
    GeodeRobotCost: [parseInt(match[6]), 0, parseInt(match[7])],
  };
}

const blueprints: Blueprint[] = data.map((line) => {
  return instructionToBluePrint(line);
});

function gatherResources(state: State): State {
  var newState = _.cloneDeep(state);
  newState.Ore.Quantity = state.Ore.Quantity + state.Ore.Robots;
  newState.Clay.Quantity = state.Clay.Quantity + state.Clay.Robots;
  newState.Obsidian.Quantity = state.Obsidian.Quantity + state.Obsidian.Robots;
  newState.Geode.Quantity = state.Geode.Quantity + state.Geode.Robots;
  return newState;
}

function addRobots(state: State): State {
  var newState = _.cloneDeep(state);
  newState.Ore.Robots = state.Ore.NewRobots + state.Ore.Robots;
  newState.Ore.NewRobots = 0;
  newState.Clay.Robots = state.Clay.NewRobots + state.Clay.Robots;
  newState.Clay.NewRobots = 0;
  newState.Obsidian.Robots = state.Obsidian.NewRobots + state.Obsidian.Robots;
  newState.Obsidian.NewRobots = 0;
  newState.Geode.Robots = state.Geode.NewRobots + state.Geode.Robots;
  newState.Geode.NewRobots = 0;
  return newState;
}

function advanceTime(state: State): State {
  var newState = _.cloneDeep(state);
  newState.Minute = state.Minute + 1;
  return newState;
}

function resourceToString(resource: ResourceState): string {
  return `${resource.Quantity} (${resource.Robots})`;
}

function printState(state: State) {
  console.log(
    `Time: ${state.Minute} | Ore: ${resourceToString(
      state.Ore
    )} | Clay: ${resourceToString(state.Clay)} | Obsidian: ${resourceToString(
      state.Obsidian
    )} | Geode: ${resourceToString(state.Geode)} `
  );
}

function canBuildRobot(cost: number[], state: State): boolean {
  return (
    cost[0] <= state.Ore.Quantity &&
    cost[1] <= state.Clay.Quantity &&
    cost[2] <= state.Obsidian.Quantity
  );
}

function buildRobot(cost: number[], state: State): State {
  var newState = _.cloneDeep(state);
  newState.Ore.Quantity = state.Ore.Quantity - cost[0];
  newState.Clay.Quantity = state.Clay.Quantity - cost[1];
  newState.Obsidian.Quantity = state.Obsidian.Quantity - cost[2];
  return newState;
}

export function buildBlueprint(blueprint: Blueprint, state: State): State[] {
  // console.log(state);
  const newStates: State[] = [];
  const canBuildOre = canBuildRobot(blueprint.OreRobotCost, state);
  if (canBuildOre) {
    // console.log("Ore");
    var newState = buildRobot(blueprint.OreRobotCost, state);
    newState.Ore.NewRobots = newState.Ore.NewRobots + 1;
    newStates.push(newState);
  }

  const canBuildClay = canBuildRobot(blueprint.ClayRobotCost, state);
  if (canBuildClay) {
    // console.log("Clay");
    var newState = buildRobot(blueprint.ClayRobotCost, state);
    newState.Clay.NewRobots++;
    newStates.push(newState);
  }

  const canBuildObsidian = canBuildRobot(blueprint.ObsidianRobotCost, state);
  if (canBuildObsidian) {
    // console.log("Obsidian");
    var newState = buildRobot(blueprint.ObsidianRobotCost, state);
    newState.Obsidian.NewRobots++;
    newStates.push(newState);
  }

  const canBuildGeode = canBuildRobot(blueprint.GeodeRobotCost, state);
  if (canBuildGeode) {
    // console.log("Geode");
    var newState = buildRobot(blueprint.GeodeRobotCost, state);
    newState.Geode.NewRobots++;
    newStates.push(newState);
  }

  // if (!canBuildOre && !canBuildClay && !canBuildObsidian && !canBuildGeode) {
  // console.log("None");
  newStates.push(_.cloneDeep(state));
  // }
  return newStates;
}

function cullExcessiveRobots(state: State, time: number): boolean {
  if (time > 8) {
    if (state.Ore.Robots > 5) {
      return false;
    }
    if (state.Clay.Robots > 5) {
      return false;
    }
  }
  return true;
}

function cullWithoutClay(state: State, time: number): boolean {
  if (time > 8) {
    if (state.Clay.Robots == 0) {
      return false;
    }
  }
  return true;
}

function cullWithoutObsidian(state: State, time: number): boolean {
  if (time > 14) {
    if (state.Obsidian.Robots == 0) {
      return false;
    }
  }
  return true;
}

function getResourceScore(state: ResourceState, weight: number): number {
  return state.Quantity * weight + state.Robots * weight * 2;
}

function getScore(state: State): number {
  return (
    getResourceScore(state.Ore, 1) +
    getResourceScore(state.Clay, 10) +
    getResourceScore(state.Obsidian, 100) +
    getResourceScore(state.Geode, 1000)
  );
}

var maxGeodes: number[] = [];
blueprints.forEach((blueprint) => {
  var states = [_.cloneDeep(initialState)];
  for (var time = 0; time < 24; time++) {
    states = states
      .flatMap((state) => buildBlueprint(blueprint, state))
      .flatMap((state) => gatherResources(state))
      .flatMap((state) => addRobots(state))
      .flatMap((state) => advanceTime(state))
      .sort((a, b) => getScore(b) - getScore(a))
      .slice(0, 1000);
    // .filter((state) => cullExcessiveRobots(state, time))
    // .filter((state) => cullWithoutClay(state, time))
    // .filter((state) => cullWithoutObsidian(state, time));
    // console.log(`Time: ${time} | ${states.length}`);
  }

  states.sort((a, b) => b.Geode.Quantity - a.Geode.Quantity);
  printState(states[0]);
  maxGeodes.push(states[0].Geode.Quantity);
});

var totalQuality = maxGeodes.reduce((a, c, i) => {
  return a + c * (i + 1);
});

console.log({ maxGeodes });
console.log({ totalQuality });

// while (state.Minute < 24) {
//   printState(state);
//   state = gatherResources(state);
//   state = advanceTime(state);
// }

// console.log(states);

logTime();
export {};
