import each from "jest-each";
import { findMarker, findMessage } from ".";

describe("find message", () => {
  each([
    ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 19],
    ["bvwbjplbgvbhsrlpgdmjqwftvncz", 23],
    ["nppdvjthqldpwncqszvftbrmjlhg", 23],
    ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 29],
    ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 26],
  ]).test("for %s, returns %s", (input, expected) => {
    expect(findMessage(input)).toBe(expected);
  });
});

describe("find marker", () => {
  each([
    ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 7],
    ["bvwbjplbgvbhsrlpgdmjqwftvncz", 5],
    ["nppdvjthqldpwncqszvftbrmjlhg", 6],
    ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 10],
    ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 11],
  ]).test("for %s, returns %s", (input, expected) => {
    expect(findMarker(input)).toBe(expected);
  });
});
