import {
  SHOW_ALL_SETS,
  collectVolumeOverTime,
} from "../collect-volume-over-time";
import { Training } from "../types";

const trainings: Training[] = [
  {
    id: 100,
    headline: null,
    date: new Date().toDateString(),
    exercises: [
      { exerciseName: "Squats", weight: "100kg", repetitions: "8/8/8" },
      { exerciseName: "Squats", weight: "110kg", repetitions: "7/7" },
    ],
    exerciseVolumeMap: {
      Squats: 3940,
    },
    volumeChanges: null,
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
  expect(collectVolumeOverTime("Squats", trainings, SHOW_ALL_SETS)).toEqual(
    result
  ));
