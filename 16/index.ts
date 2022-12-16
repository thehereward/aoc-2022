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

var lines: Room[] = data.map((line) => {
  const match = line.match(regex);
  return {
    label: match[1],
    flowRate: parseInt(match[2]),
    tunnelsTo: match[3].split(", "),
  };
});

const rooms: any = {};
lines.map((line) => {
  rooms[line.label] = line;
});

const startRoom = "AA";
console.log(rooms);

var currentRoom = rooms[startRoom];
var visited = new Set<string>();
var path: string[] = [];
path.push(startRoom);
visited.add(startRoom);

function searchDown(
  visited: Set<string>,
  path: string[],
  currentRoom: Room
): string[][] {
  if (visited.size == lines.length) {
    console.log(path);
    return [path];
  }
  if (path.length > lines.length * 2) {
    // We've looped
    console.log(path);
    return [path];
  }
  visited.add(currentRoom.label);
  path.push(currentRoom.label);
  return currentRoom.tunnelsTo.flatMap((tunnel) => {
    return searchDown(_.clone(visited), _.clone(path), rooms[tunnel]);
  });
}

var paths = searchDown(new Set<string>(), [], currentRoom);
console.log(paths);

function openValve(room: Room) {}

const end = Date.now();
console.log(`Time taken: ${end - start}ms`);

export {};
