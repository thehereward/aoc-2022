import _ from "lodash";
import { readFile } from "../common";

const start = Date.now();

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

//const row = 2000000;
// const row = 10;

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

const rowMax = 4000000;
const colMax = 4000000;

const allMaxMin: any[][] = [];
for (var row = 0; row <= rowMax; row++) {
  const maxMin: any[] = [];
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
  allMaxMin.push(maxMin);
}

function isInRange(range: any, value: number) {
  return value >= range.min && value <= range.max;
}

const allValidPoints = [];
for (var row = 0; row < rowMax; row++) {
  const validPoints = [];
  for (var col = 0; col < colMax; col++) {
    const exclusions = allMaxMin[row];
    const inRange = exclusions.reduce((a, c) => {
      if (isInRange(c, col)) {
        a = true;
        col = c.max;
      }
      return a;
    }, false);
    if (!inRange) {
      validPoints.push(col);
    } else {
    }
  }
  allValidPoints.push(validPoints);
}

// const allResult = allMaxMin.map((maxMin) => {
//   return maxMin.reduce(
//     (a, b) => {
//       if (b.max > a.max) {
//         a.max = b.max;
//       }
//       if (b.min < a.min) {
//         a.min = b.min;
//       }
//       return a;
//     },
//     { max: -Infinity, min: Infinity }
//   );
// });

// const result = allResult[10];
// console.log(`Part 1: ${result.max - result.min}`);

allValidPoints.forEach((points, i) => {
  points.forEach((point) => {
    console.log(
      `Part 2: x: ${point}, y: ${i}, strength: ${point * 4000000 + i}`
    );
  });
});

const end = Date.now();
console.log(end - start);

export {};
