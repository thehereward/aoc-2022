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

const roomsToVisit = rooms.filter((room) => room.flowRate > 0);
const startRoom = "AA";
var currentRoomId = startRoom;
var startingRoom = roomObject[startRoom];
roomsToVisit.unshift(startingRoom);

function getNeighbours(roomObject: any, room: Room): Room[] {
  return room.tunnelsTo.map((id) => roomObject[id]);
}

const distancesFrom: any = {};

function getEmptyDistance(roomObject: any): any {
  const keys = Object.keys(roomObject);
  const result: any = {};
  keys.forEach((key) => (result[key] = Infinity));
  return result;
}

const roomsToGetDistancesFor = _.cloneDeep(roomsToVisit);
while (roomsToGetDistancesFor.length > 0) {
  var sourceRoom = roomsToGetDistancesFor.shift();
  var distances: any = getEmptyDistance(roomObject);
  distances[sourceRoom.label] = 0;
  var visited: string[] = [];

  var currentRoom = sourceRoom;

  while (currentRoom != undefined) {
    var currentDistance = distances[currentRoom.label];
    const neighbours = getNeighbours(roomObject, currentRoom);
    const unvisitedNeighbours = neighbours.filter((room) =>
      visited.every((id) => id != room.label)
    );
    unvisitedNeighbours.forEach((room) => {
      var previousDistance = distances[room.label];
      distances[room.label] = Math.min(currentDistance + 1, previousDistance);
    });
    visited.push(currentRoom.label);
    var currentRoomId = Object.keys(distances).filter(
      (key) => distances[key] < Infinity && visited.every((id) => id != key)
    )[0];
    if (!currentRoomId) {
      break;
    }
    currentRoom = roomObject[currentRoomId];
  }
  distancesFrom[sourceRoom.label] = distances;
}
const toArrange = roomsToVisit
  .sort((a, b) => b.flowRate - a.flowRate)
  .filter((a) => a.flowRate > 0);

const startId = "AA";
var time = 30;

function getTotalFlow(workingSet: Room[]) {
  var opened: any = getEmptyDistance(roomObject);
  var currentLocation = startId;
  workingSet
    .map((o) => o.label)
    .forEach((label) => {
      var distance = distancesFrom[currentLocation][label];
      time = time - distance;
      if (opened[label] == Infinity) {
        time = time + 1;
        opened[label] = time;
      }
      currentLocation = label;
    });

  return workingSet.reduce((a, c) => {
    const flow = c.flowRate;
    const time = opened[c.label];
    return a + flow * time;
  }, 0);
}

var workingSet = _.cloneDeep(toArrange);
// const result = getTotalFlow(workingSet);
// console.log({ workingSet });
// console.log(result);

var myTime = 30;
var myLocation = startId;
var maxPressure = 0;
var count = 0;

function setPressure(pressure: number) {
  maxPressure = Math.max(maxPressure, pressure);
  count++;
  if (count % 1000 == 0) {
    console.log(count);
  }
}

function recurse(
  currentRoom: Room,
  items: Room[],
  time: number,
  currentPressure: number
) {
  var newTime = time - 1;
  if (newTime <= 0) {
    setPressure(currentPressure);
    return;
  }
  var pressure = currentRoom.flowRate * newTime;
  var newPressure = currentPressure + pressure;
  if (items.length == 0) {
    setPressure(newPressure);
    return;
  }

  items.forEach((room) => {
    var newItems = items.filter((item) => item.label != room.label);
    var distance = distancesFrom[currentRoom.label][room.label];
    var myTime = newTime - distance;
    recurse(room, newItems, myTime, newPressure);
  });
}
console.log(workingSet);
recurse(roomObject["AA"], workingSet, 31, 0);

console.log(maxPressure);

const end = Date.now();
console.log(`Time taken: ${end - start}ms`);

export {};
