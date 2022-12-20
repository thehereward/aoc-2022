import each from "jest-each";
import { moveItem } from ".";

describe("move item", () => {
  const list = [
    { value: 1 },
    { value: 2 },
    { value: -3 },
    { value: 3 },
    { value: -2 },
    { value: 0 },
    { value: 4 },
  ];
  each([
    [
      list,
      list[0],
      [
        { value: 2 },
        { value: 1 },
        { value: -3 },
        { value: 3 },
        { value: -2 },
        { value: 0 },
        { value: 4 },
      ],
    ],
  ]).test("processes index 0 (2)", (list, item, expected) => {
    expect(moveItem(list, item)).toEqual(expected);
  });
});

describe("move item", () => {
  const list = [
    { value: 1 },
    { value: 2 },
    { value: -2 },
    { value: -3 },
    { value: 0 },
    { value: 3 },
    { value: 4 },
  ];
  each([
    [
      list,
      list[2],
      [
        { value: 1 },
        { value: 2 },
        { value: -3 },
        { value: 0 },
        { value: 3 },
        { value: 4 },
        { value: -2 },
      ],
    ],
  ]).test("processes index 2 (-2)", (list, item, expected) => {
    expect(moveItem(list, item)).toEqual(expected);
  });
});

describe("move item", () => {
  const list = [
    { value: 1 },
    { value: 2 },
    { value: -3 },
    { value: 0 },
    { value: 3 },
    { value: 4 },
    { value: -2 },
  ];
  each([
    [
      list,
      list[5],
      [
        { value: 1 },
        { value: 2 },
        { value: -3 },
        { value: 4 },
        { value: 0 },
        { value: 3 },
        { value: -2 },
      ],
    ],
  ]).test("processes index 5 (4)", (list, item, expected) => {
    expect(moveItem(list, item)).toEqual(expected);
  });
});

describe("move item", () => {
  const list = [
    { value: 1 },
    { value: 2 },
    { value: -3 },
    { value: 0 },
    { value: 3 },
    { value: 4 },
    { value: -2 },
  ];
  each([
    [
      list,
      list[3],
      [
        { value: 1 },
        { value: 2 },
        { value: -3 },
        { value: 0 },
        { value: 3 },
        { value: 4 },
        { value: -2 },
      ],
    ],
  ]).test("processes index 3 (0)", (list, item, expected) => {
    expect(moveItem(list, item)).toEqual(expected);
  });
});

describe("move item", () => {
  const list = [
    { value: 4 },
    { value: -2 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
  ];
  each([
    [
      list,
      list[1],
      [
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: -2 },
        { value: 9 },
      ],
    ],
  ]).test("processes index 1 (-2)", (list, item, expected) => {
    expect(moveItem(list, item)).toEqual(expected);
  });
});
