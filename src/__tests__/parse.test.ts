import { parse } from "./../parser";

let singleLine: string;
let singleLineSpaceBeforeWeight: string;
let singleLineLbs: string;
let multiLine: string;

beforeEach(() => {
  singleLine = "Benchpress 100kg 8/8/8";
  singleLineSpaceBeforeWeight = "Benchpress 100 kg 8/8/8";
  singleLineLbs = "Benchpress 100lbs 8/8/8";
  multiLine = "Squats 100kg 8/8/8 \n Benchpress 100kg 8/8/8";
});

test("No Input", () => {
  expect(parse(undefined)).toBe(undefined);
});

test("Single-line. Format: exercise _kg _/_/_", () => {
  expect(parse(singleLine)).toEqual([
    {
      exerciseName: "Benchpress",
      weight: "100kg",
      repetitions: "8/8/8",
    },
  ]);
});

test("Single-line. Format: exercise _ kg _/_/_", () => {
  expect(parse(singleLineSpaceBeforeWeight)).toEqual([
    {
      exerciseName: "Benchpress",
      weight: "100kg",
      repetitions: "8/8/8",
    },
  ]);
});

test("Single-line. Format: exercise _lbs _/_/_", () => {
  expect(parse(singleLineLbs)).toEqual([
    {
      exerciseName: "Benchpress",
      weight: "100lbs",
      repetitions: "8/8/8",
    },
  ]);
});

test("Multi-line. Format: exercise _kg _/_/_", () => {
  expect(parse(multiLine)).toEqual([
    {
      exerciseName: "Squats",
      weight: "100kg",
      repetitions: "8/8/8",
    },
    {
      exerciseName: "Benchpress",
      weight: "100kg",
      repetitions: "8/8/8",
    },
  ]);
});
