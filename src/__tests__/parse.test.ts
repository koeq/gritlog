import { parse } from "./../parser";

let singleLine: string;
let singleLineSpaceBeforeWeight: string;
let singleLineLbs: string;
let exerciseNameOnly: string;
let multiLine: string;
let multiLineNoNewline: string;

beforeEach(() => {
  singleLine = "Benchpress 100kg 8/8/8";
  singleLineSpaceBeforeWeight = "Benchpress 100 kg 8/8/8";
  singleLineLbs = "Benchpress 100lbs 8/8/8";
  exerciseNameOnly = "Benchpress";
  multiLine = "Squats 100kg 8/8/8 \n Benchpress 100kg 8/8/8";
  multiLineNoNewline = "Squats 100kg 8/8/8 Benchpress 100kg 8/8/8";
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

test("Exercise name only. Format: exercise", () => {
  expect(parse(exerciseNameOnly)).toEqual([
    {
      exerciseName: "Benchpress",
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

test("Multi-line no newline between. Format: exercise _kg _/_/_", () => {
  expect(parse(multiLineNoNewline)).toEqual([
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
