import each from "jest-each";
import { applyInstruction } from ".";

describe("apply instruction - noop", () => {
  each([[{ instruction: "noop" }, { cycle: 2, x: 1 }]]).test(
    "for %s, returns %s",
    (instruction, expected) => {
      expect(applyInstruction({ cycle: 1, x: 1 }, instruction)).toStrictEqual(
        expected
      );
    }
  );
});

describe("apply instruction - add x", () => {
  each([
    [
      { instruction: "addx", value: 1 },
      { cycle: 3, x: 2 },
    ],
  ]).test("for %s, returns %s", (instruction, expected) => {
    expect(applyInstruction({ cycle: 1, x: 1 }, instruction)).toStrictEqual(
      expected
    );
  });
});
