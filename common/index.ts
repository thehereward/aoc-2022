import { readFileSync } from "fs";
import { EOL } from "os";

export function readFile(filename: string): string[] {
  try {
    var data = readFileSync(filename, "utf8");
    return data.split(EOL);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
