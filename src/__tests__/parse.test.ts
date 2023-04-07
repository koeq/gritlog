import { parse } from "../parser";

let singleLine: string;
let singleLineDecimalPoint: string;
let singleLineCommaPoint: string;
let singleLineMinimal: string;
let singleLineWithHeadline: string;
let singleLineLbs: string;
let multiLine: string;
let multiplicator: string;
let exerciseNameWithHyphen: string;

beforeEach(() => {
  singleLine = "Benchpress @100kg 8/8/8";
  singleLineDecimalPoint = "Benchpress @100.5kg 8/8/8";
  singleLineCommaPoint = "Benchpress @100,5kg 8/8/8";
  singleLineMinimal = "Benchpress @100 8 8 8";
  singleLineWithHeadline = "#some headline \n Benchpress @100kg 8/8/8";
  singleLineLbs = "Benchpress @100lbs 8/8/8";
  multiLine = "Squats @100kg 8/8/8 \n Benchpress @100kg 8/8/8";
  multiplicator = "Squats @100 3*8";
  exerciseNameWithHyphen = "T-Bar Row @50kg 3*8";
});

const singleLineResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "Benchpress",
      repetitions: "8/8/8",
      weight: "100kg",
    },
  ],
};

const singleLineDecimalPointResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "Benchpress",
      repetitions: "8/8/8",
      weight: "100.5kg",
    },
  ],
};

const singleLineCommaResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "Benchpress",
      repetitions: "8/8/8",
      weight: "100,5kg",
    },
  ],
};

const singleLineMinimalResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "Benchpress",
      repetitions: "8 8 8",
      weight: "100kg",
    },
  ],
};

const singleLineWithHeadlineResult = {
  headline: "some headline",
  exercises: [
    {
      exerciseName: "Benchpress",
      repetitions: "8/8/8",
      weight: "100kg",
    },
  ],
};

const singleLineLbsResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "Benchpress",
      repetitions: "8/8/8",
      weight: "100lbs",
    },
  ],
};

const multiplicatorResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "Squats",
      repetitions: "8/8/8",
      weight: "100kg",
    },
  ],
};

const exerciseNameWithHyphenResult = {
  headline: null,
  exercises: [
    {
      exerciseName: "T-Bar Row",
      weight: "50kg",
      repetitions: "8/8/8",
    },
  ],
};

test("No Input", () => {
  expect(parse(undefined)).toBe(undefined);
});

test("Single-line. Format: exercise @_kg _/_/_", () => {
  expect(parse(singleLine)).toEqual(singleLineResult);
});

test("Single-line decimal point. Format: exercise @_._kg _/_/_", () => {
  expect(parse(singleLineDecimalPoint)).toEqual(singleLineDecimalPointResult);
});

test("Single-line comma. Format: exercise @_,_kg _/_/_", () => {
  expect(parse(singleLineCommaPoint)).toEqual(singleLineCommaResult);
});

test("Single-line minimal. Format: exercise @_ _ _ _", () => {
  expect(parse(singleLineMinimal)).toEqual(singleLineMinimalResult);
});

test("Single-line with headline", () => {
  expect(parse(singleLineWithHeadline)).toEqual(singleLineWithHeadlineResult);
});

test("Single-line. Format: exercise @_lbs _/_/_", () => {
  expect(parse(singleLineLbs)).toEqual(singleLineLbsResult);
});

test("Multi-line. Format: exercise @_kg _/_/_", () => {
  expect(parse(multiLine)).toEqual({
    headline: null,
    exercises: [
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
    ],
  });
});

test("Multiplicator. Format: exercise @_kg _*_", () => {
  expect(parse(multiplicator)).toEqual(multiplicatorResult);
});

test("Exercise name with hyphen", () => {
  expect(parse(exerciseNameWithHyphen)).toEqual(exerciseNameWithHyphenResult);
});
