import { serializeExercises } from "../serialize-exercises";
import { Training } from "../types";

let multipleExercises: Training;

beforeEach(() => {
  multipleExercises = {
    id: 0,
    date: "",
    headline: "some headline",
    exercises: [
      {
        exerciseName: "Benchpress",
        weight: "100kg",
        repetitions: "8/8/8",
      },

      {
        exerciseName: "Benchpress",
        weight: "100",
        repetitions: "8 8 8",
      },
    ],
    exerciseVolumeMap: {},
    volumeChanges: null,
  };
});

const multipleExercisesResult = `Benchpress @100kg 8/8/8\nBenchpress @100 8 8 8`;

test("Multiple exercises.", () =>
  expect(serializeExercises(multipleExercises)).toBe(multipleExercisesResult));
