import each from "jest-each";
import { getNeighbours } from ".";

describe("turns right", () => {
  each([[0, 0, [[]]]]).test(
    "neighbours [%s, %y] to be %s",
    (x, y, expected) => {
      expect(getNeighbours(x, y)).toEqual(expected);
    }
  );
});
