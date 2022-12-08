import _ from "lodash";
import { readFile } from "../common";

var data = readFile("input");

var wd: string[] = [];
var dContents: any = {};
var fileSizes: any = {};

var fileRegex = /(\d+) (.+)/;

function addToDir(item: string) {
  if (!dContents[wd.join("/")]) {
    dContents[wd.join("/")] = [];
  }
  dContents[wd.join("/")].push(item);
}

function setSize(fileName: string, item: number) {
  fileSizes[wd.join("/") + "/" + fileName] = item;
}

data.forEach((line) => {
  // console.log(line);
  if (line.startsWith("$ cd ")) {
    var dir = line.replace("$ cd ", "");
    switch (dir) {
      case "..":
        wd.pop();
        break;
      case "/":
        wd = ["/"];
        break;
      default:
        wd.push(dir);
      // dContents[wd.join("/")] = [];
    }
  } else {
    if (line.startsWith("$ ls")) {
      // ignore
    } else {
      if (line.startsWith("dir ")) {
        var dirName = line.replace("dir ", "");
        addToDir(dirName);
      } else {
        var match = line.match(fileRegex);
        addToDir(match[2]);
        setSize(match[2], parseInt(match[1]));
      }
    }
  }
});

var dirSizes: any = {};

var dirs = Object.keys(dContents);
var fileNames = Object.keys(fileSizes);
dirs.forEach((dir) => {
  dirSizes[dir] = 0;
  fileNames.forEach((fileName) => {
    if (fileName.startsWith(dir)) {
      dirSizes[dir] = dirSizes[dir] + fileSizes[fileName];
    }
  });
});

console.log(dContents);
console.log(fileSizes);
console.log(dirSizes);

var answer = 0;
dirs.forEach((dir) => {
  var size = dirSizes[dir];
  if (size <= 100000) {
    answer = answer + size;
  }
});

// console.log(answer);

const totalSpace = 70000000;
var used = dirSizes["/"];
var remaining = totalSpace - used;
const update = 30000000;
var toFind = update - remaining; //528671
console.log(toFind);

var smallestDir = "";
var smallestSize = used;

dirs.forEach((dir) => {
  var size = dirSizes[dir];
  if (size >= toFind && size < smallestSize) {
    smallestDir = dir;
    smallestSize = size;
  }
});

console.log(smallestDir);
console.log(smallestSize);

export {};
