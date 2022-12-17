import _ from "lodash";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");
console.log(data.length);

logTime();
export {};
