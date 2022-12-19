import _, { initial } from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const blueprintRegex =
  /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/;

// [Ore, Clay, Obsidian]

class ResourceState {
  Quantity: number;
  Robots: number;
  NewRobots?: number;
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
  Ore: { Quantity: 0, Robots: 1 },
  Clay: { Quantity: 0, Robots: 0 },
  Obsidian: { Quantity: 0, Robots: 0 },
  Geode: { Quantity: 0, Robots: 0 },
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

var states = [_.cloneDeep(initialState)];

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
  const canBuildOre = canBuildRobot(blueprint.OreRobotCost, state);
  if (canBuildOre) {
    var newState = buildRobot(blueprint.OreRobotCost, state);
    newState.Ore.NewRobots++;
  }
  const canBuildClay = canBuildRobot(blueprint.ClayRobotCost, state);
  const canBuildObsidian = canBuildRobot(blueprint.ObsidianRobotCost, state);
  const canBuildGeode = canBuildRobot(blueprint.GeodeRobotCost, state);
  return [state];
}

// for (var time = 0; time < 24; time++){
//   states.flatMap(state =>
//     {

//     }
//     )
// }

// while (state.Minute < 24) {
//   printState(state);
//   state = gatherResources(state);
//   state = advanceTime(state);
// }

console.log(blueprints);

logTime();
export {};
