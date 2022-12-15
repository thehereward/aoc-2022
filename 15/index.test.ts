import each from "jest-each";
import { getHoizontalDistance } from ".";

describe("getHoizontalDistance", () => {
  each([[[0, 0], 10, 0]]).test(
    "for %s and %s, returns %s",
    (sensor, distance, expected) => {
      expect(getHoizontalDistance(10, sensor, distance)).toStrictEqual(
        expected
      );
    }
  );
});
