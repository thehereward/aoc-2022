import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

const regex =
  /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

class Datum {
  sensor: number[];
  beacon: number[];
  distance?: number;
}

var lines: Datum[] = data.map((line) => {
  const match = line.match(regex);
  return {
    sensor: [parseInt(match[1]), parseInt(match[2])],
    beacon: [parseInt(match[3]), parseInt(match[4])],
  };
});

lines.forEach((line) => {
  line.distance = distance(line.beacon, line.sensor);
});

function distance(a: number[], b: number[]) {
  return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
}

const row = 2000000;

const maxMin: any[] = [];

export function getHoizontalDistance(
  targetRow: number,
  sensor: number[],
  distance: number
) {
  const sensorRow = sensor[1];
  const verticalDistance = Math.abs(sensorRow - targetRow);
  const horizontalDistance = distance - verticalDistance;
  return horizontalDistance;
}

lines.forEach((line) => {
  const horizontalDistance = getHoizontalDistance(
    row,
    line.sensor,
    line.distance
  );
  if (horizontalDistance >= 0) {
    const max = line.sensor[0] + horizontalDistance;
    const min = line.sensor[0] - horizontalDistance;
    maxMin.push({
      max,
      min,
    });
  }
});

const result = maxMin.reduce(
  (a, b) => {
    if (b.max > a.max) {
      a.max = b.max;
    }
    if (b.min < a.min) {
      a.min = b.min;
    }
    return a;
  },
  { max: -Infinity, min: Infinity }
);

console.log(result.max - result.min);

export {};
