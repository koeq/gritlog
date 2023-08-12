import { collectExerciseOccurences } from "../collect-exercise-occurences";
import { collectVolumeOverTime } from "../collect-volume-over-time";
import { Training } from "../types";

const trainings: Training[] = [
  {
    date: new Date().toDateString(),
    exercises: [
      { exerciseName: "Squats", weight: "100kg", repetitions: "8/8/8" },
      { exerciseName: "Squats", weight: "110kg", repetitions: "7/7" },
    ],
    headline: null,
    id: 100,
  },
];

const temp = new Date();
const day = temp.getDate();
const monthShort = temp.toLocaleString("en-US", { month: "short" });

const result: {
  dates: string[];
  volumens: number[];
} = {
  dates: [`${monthShort} ${day}`],
  volumens: [3940],
};

test("Add volume of the same exercise if dates match.", () =>
  expect(
    collectVolumeOverTime(collectExerciseOccurences("Squats", trainings))
  ).toEqual(result));
