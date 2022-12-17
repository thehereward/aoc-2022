import _ from "lodash";
import { readFile } from "../common";

const start = Date.now();
const TIME = 26;

var data = readFile("input");

const regex =
  /^Valve ([A-Z]+) has flow rate=([\d]+); tunnels? leads? to valves? (.*)$/;

class Room {
  label: string;
  flowRate: number;
  tunnelsTo: string[];
}

class RoomToVisit extends Room {
  visited: boolean;
  weight: number;
}

var rooms: Room[] = data.map((line) => {
  const match = line.match(regex);
  return {
    label: match[1],
    flowRate: parseInt(match[2]),
    tunnelsTo: match[3].split(", "),
  };
});

const roomObject: any = {};
rooms.map((line) => {
  roomObject[line.label] = line;
});

const roomsToGetDistancesFor = rooms.filter((room) => room.flowRate > 0);
const startRoom = "AA";
var startingRoom = roomObject[startRoom];
roomsToGetDistancesFor.unshift(startingRoom);

function getNeighbours(rooms: RoomToVisit[], room: Room): RoomToVisit[] {
  return rooms.filter((r) => room.tunnelsTo.some((id) => id == r.label));
}

const distancesFrom: any = {};

function getEmptyDistance(): RoomToVisit[] {
  return _.cloneDeep(rooms).map((room) => {
    return {
      ...room,
      visited: false,
      weight: Infinity,
    };
  });
}

const roomIds: string[] = roomsToGetDistancesFor.map((room) => room.label);

while (roomIds.length > 0) {
  var sourceRoomId = roomIds.shift();
  var roomsToVisit: RoomToVisit[] = getEmptyDistance();
  var sourceRoom = roomsToVisit.find((room) => room.label == sourceRoomId);
  sourceRoom.weight = 0;

  var currentRoom = sourceRoom;

  while (currentRoom != undefined) {
    var currentDistance = currentRoom.weight;
    const neighbours = getNeighbours(roomsToVisit, currentRoom);
    const unvisitedNeighbours = neighbours.filter((room) => !room.visited);
    unvisitedNeighbours.forEach((room) => {
      room.weight = Math.min(currentDistance + 1, room.weight);
    });
    currentRoom.visited = true;
    currentRoom = roomsToVisit
      .filter((room) => !room.visited)
      .sort((a, b) => a.weight - b.weight)[0];
  }
  distancesFrom[sourceRoomId] = roomsToVisit.reduce((a: any, c) => {
    a[c.label] = c.weight;
    return a;
  }, {});
}

// console.log(distancesFrom);
// process.exit();

// const startId = "AA";
// var time = 30;

// function getTotalFlow(workingSet: Room[]) {
//   var opened: any = getEmptyDistance(roomObject);
//   var currentLocation = startId;
//   workingSet
//     .map((o) => o.label)
//     .forEach((label) => {
//       var distance = distancesFrom[currentLocation][label];
//       time = time - distance;
//       if (opened[label] == Infinity) {
//         time = time + 1;
//         opened[label] = time;
//       }
//       currentLocation = label;
//     });

//   return workingSet.reduce((a, c) => {
//     const flow = c.flowRate;
//     const time = opened[c.label];
//     return a + flow * time;
//   }, 0);
// }

var workingSet = _.cloneDeep(roomsToGetDistancesFor)
  .filter((a) => a.flowRate > 0)
  .sort((a, b) => b.flowRate - a.flowRate);
// console.log(workingSet.length);

// workingSet.forEach((r) => {
//   const distance = distancesFrom["AA"][r.label];
//   console.log(`${r.label},${r.flowRate},${distance}`);
// });

var maxPressure = 0;
var count = 0;

class RoomHistory {
  id: string;
  pressure: number;
}

var roomHistoryPressure: RoomHistory[] = [];

function setPressure(forWhom: number, pressure: number, roomHistory: string[]) {
  roomHistoryPressure.push({
    id: roomHistory.join("|"),
    pressure,
  });
  maxPressure = Math.max(maxPressure, pressure);
  count++;
}

function recurse(
  currentRoom: Room,
  items: Room[],
  time: number,
  cumulativePressure: number,
  roomHistory: string[]
) {
  const forWhom = 0;
  var timeRemaining = time - 1; // open current valve
  roomHistory.push(currentRoom.label);

  var pressure = currentRoom.flowRate * timeRemaining;
  var newPressure = cumulativePressure + pressure;
  setPressure(forWhom, newPressure, roomHistory);

  // if (roomHistory.length > 1) {
  //   return;
  // }

  items.forEach((room) => {
    var newItems = items.filter((item) => item.label != room.label);
    var distance = distancesFrom[currentRoom.label][room.label];
    var myTime = timeRemaining - distance;
    if (myTime > 1) {
      recurse(
        _.clone(room),
        _.cloneDeep(newItems),
        myTime,
        newPressure,
        _.cloneDeep(roomHistory)
      );
    }
  });
}

recurse(roomObject["AA"], workingSet, TIME + 1, 0, []);

class PathRoom {
  rooms: Set<string>;
  pressure: number;
}

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

var paths: PathRoom[] = roomHistoryPressure.map((room) => {
  return {
    rooms: new Set(room.id.split("|").filter((id) => id != "AA")),
    pressure: room.pressure,
  };
});

paths.shift();

function areCompatible(pathA: PathRoom, pathB: PathRoom) {
  return intersection(pathA.rooms, pathB.rooms).size == 0;
}

class PossiblePair {
  pathA: PathRoom;
  pathB: PathRoom;
}

const possiblePairs: PossiblePair[] = [];

for (var i = 0; i < paths.length - 1; i++) {
  for (var j = i + 1; j < paths.length; j++) {
    var pathA = paths[i];
    var pathB = paths[j];
    if (areCompatible(pathA, pathB)) {
      possiblePairs.push({ pathA, pathB });
    }
  }
}

console.log(paths.length);
console.log(possiblePairs.length);
var heighestPair: PossiblePair;
var heighestPressure: number = 0;
possiblePairs.forEach((pairs) => {
  const pressure = pairs.pathA.pressure + pairs.pathB.pressure;
  if (pressure > heighestPressure) {
    heighestPair = pairs;
    heighestPressure = pressure;
  }
});
console.log(heighestPressure);

// console.log(roomHistoryPressure.filter((r) => r.pressure == maxPressure));
// console.log(`Max Pressure: ${maxPressure}`);

// roomHistoryPressure.sort((a, b) => b.pressure - a.pressure).reverse();
// console.log(roomHistoryPressure.slice(0, 10));

// console.log(roomHistoryPressure.length);

// console.log({ count });
// console.log(
//   roomHistoryPressure.filter((r) => r.id.startsWith("AA|OT")).slice(0, 10)
// );

const end = Date.now();
console.log(`Time taken: ${end - start}ms`);

// 1574 -- too low
// 2029 -- too high

export {};
