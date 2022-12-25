import each from "jest-each";
import { dec2Snafu } from ".";

describe("dec 2 snafu", () => {
  each([
    [1, "1"],
    [2, "2"],
    [3, "1="],
    [4, "1-"],
    [5, "10"],
    [6, "11"],
    [7, "12"],
    [8, "2="],
    [9, "2-"],
    [10, "20"],
    [15, "1=0"],
    [20, "1-0"],
    [2022, "1=11-2"],
    [12345, "1-0---0"],
    [314159265, "1121-1110-1=0"],
  ]).test("for input %s produces %s", (input, expected) => {
    expect(dec2Snafu(input)).toEqual(expected);
  });
});
