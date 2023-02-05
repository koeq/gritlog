import { serializeTraining } from "../serialize-training";
import { Training } from "../types";

let multipleExercisesWithHeadline: Training;

beforeEach(() => {
  multipleExercisesWithHeadline = {
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
  };
});

const multipleExercisesWithHeadlineResult = `# some headline\nBenchpress @100kg 8/8/8\nBenchpress @100 8 8 8`;

test("Multiple exercises with headline.", () =>
  expect(serializeTraining(multipleExercisesWithHeadline)).toBe(
    multipleExercisesWithHeadlineResult
  ));
