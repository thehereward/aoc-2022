import _ from "lodash";
import { readFile } from "../common";

const start = Date.now();

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
var currentRoomId = startRoom;
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
      weight: room.label == "AA" ? 0 : Infinity,
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
    // console.log(currentRoom);
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

var roomHistoryPressure: any[] = [];

function setPressure(pressure: number, roomHistory: string[]) {
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
  var timeRemaining = time - 1; // open current valve
  roomHistory.push(currentRoom.label);

  var pressure = currentRoom.flowRate * timeRemaining;
  var newPressure = cumulativePressure + pressure;
  setPressure(newPressure, roomHistory);

  // if (roomHistory.length > 1) {
  //   return;
  // }

  items.forEach((room) => {
    var newItems = items.filter((item) => item.label != room.label);
    var distance = distancesFrom[currentRoom.label][room.label];
    var myTime = timeRemaining - distance;
    if (myTime > 0) {
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

recurse(roomObject["AA"], workingSet, 31, 0, []);

console.log(roomHistoryPressure.filter((r) => r.pressure == maxPressure));
console.log(`Max Pressure: ${maxPressure}`);

// roomHistoryPressure.sort((a, b) => b.pressure - a.pressure);
// console.log(roomHistoryPressure.slice(0, 10));

// console.log({ count });
// console.log(
//   roomHistoryPressure.filter((r) => r.id.startsWith("AA|OT")).slice(0, 10)
// );

const end = Date.now();
console.log(`Time taken: ${end - start}ms`);

// 1574 -- too low
// 2029 -- too high

export {};
