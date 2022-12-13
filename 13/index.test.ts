import each from "jest-each";
import { parseToPacket, comparePackets } from ".";

describe("parseToInstruction", () => {
  each([["[1,1,3,1,1]", [1, 1, 3, 1, 1]]]).test(
    "for %s, returns %s",
    (string, expected) => {
      expect(parseToPacket(string)).toStrictEqual(expected);
    }
  );
});

describe("comparePackets", () => {
  each([
    [1, 1, undefined],
    [[], [], undefined],
    [[], [[]], true],
    [1, 9, true],
    [9, 1, false],
    [1, [9], true],
    [[1], 9, true],
    [[], 9, true],
    [[1, 1, 3, 1, 1], [1, 1, 5, 1, 1], true],
    [[1, 1, 5, 1, 1], [1, 1, 3, 1, 1], false],
    [[1, 1, 5, 1, 1], [1, 1, 5, 1, 1], undefined],
    [[1, 1, 5], [1, 1, 3, 1, 1], false],
    [[[1], [2, 3, 4]], [[1], 4], true],
    [[9], [[8, 7, 6]], false],
    [[[4, 4], 4, 4], [[4, 4], 4, 4, 4], true],
    [[7, 7, 7, 7], [7, 7, 7], false],
    [[], [3], true],
    [[[[]]], [[]], false],
    [[0, 0, 0], 2, true],
    [
      [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
      [1, [2, [3, [4, [5, 6, 0]]]], 8, 9],
      false,
    ],
  ]).test("for %s and %s, returns %s", (left, right, expected) => {
    expect(comparePackets(left, right)).toStrictEqual(expected);
  });
});

describe("comparePackets - actual inputs", () => {
  each([
    [
      [
        [],
        [[0, [10, 1], 3, [4]], 9, [2, 10, 4, 10]],
        [5, [0, 0, [1, 2, 7, 5]]],
      ],
      [
        [
          [],
          [
            [8, 5, 2, 8, 0],
            [4, 7, 0, 5],
            [2, 7, 7],
          ],
          4,
        ],
        [4],
        [2, 8, [[9, 4, 8]], 6, 10],
        [[[3, 0, 2, 5], [], 4, [7, 9], [1, 5, 10, 9, 6]], 4],
        [],
      ],
      true,
    ],
    [
      [[[8], 0, [[3], 10]], []],
      [
        [5, 1, [[0, 10, 5], 3, 10], 9],
        [[5, [0, 9, 3], [2, 1, 5], 10]],
        [1, [[10, 1, 9, 10], [10], 2, 1], [[9, 0, 8, 6, 7], 1], [3]],
      ],
      false,
    ],
    [[3, 8, 3, 3], [3, 8, 3, 3, 4], true],
  ]).test("for %s and %s, returns %s", (left, right, expected) => {
    expect(comparePackets(left, right)).toStrictEqual(expected);
  });
});

// describe("comparePackets", () => {
//   each([[[[1], [2, 3, 4]], [[1], 4], true]]).test(
//     "for %s and %s, returns %s",
//     (left, right, expected) => {
//       expect(comparePackets(left, right)).toStrictEqual(expected);
//     }
//   );
// });
