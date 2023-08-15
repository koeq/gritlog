import { getVolumeChanges } from "../get-volume-changes";
import { Training } from "../types";

describe("Calculate percentage change compared to the last time the exercises were performed:", () => {
  test("Should return percentage changes for exercises in the latest training", () => {
    const latestTraining: Training = {
      id: 2,
      date: "some date",
      headline: null,
      exercises: [
        { exerciseName: "squat", weight: "100kg", repetitions: "5" },
        { exerciseName: "bench press", weight: "80kg", repetitions: "5" },
      ],
    };

    const trainings: Training[] = [
      latestTraining,
      {
        date: "some date",
        id: 1,
        headline: null,
        exercises: [
          { exerciseName: "squat", weight: "80kg", repetitions: "5" },
          { exerciseName: "bench press", weight: "60kg", repetitions: "5" },
        ],
      },
    ];

    const result = getVolumeChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
      squat: 25,
      "bench press": 33.33333333333333,
    });
  });

  test("Should handle exercises not present in previous trainings", () => {
    const latestTraining: Training = {
      date: "some date",
      id: 2,
      headline: null,
      exercises: [
        { exerciseName: "squat", weight: "100kg", repetitions: "5" },
        { exerciseName: "deadlift", weight: "120kg", repetitions: "5" },
      ],
    };

    const trainings: Training[] = [
      latestTraining,
      {
        date: "some date",
        id: 1,
        headline: null,
        exercises: [
          { exerciseName: "squat", weight: "80kg", repetitions: "5" },
          { exerciseName: "bench press", weight: "60kg", repetitions: "5" },
        ],
      },
    ];

    const result = getVolumeChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
      squat: 25,
    });
  });

  test("Should handle 0 weighted exercises", () => {
    const latestTraining: Training = {
      date: "some date",
      id: 2,
      headline: null,
      exercises: [{ exerciseName: "squat", weight: "0kg", repetitions: "10" }],
    };

    const trainings: Training[] = [
      latestTraining,
      {
        date: "some date",
        id: 1,
        headline: null,
        exercises: [{ exerciseName: "squat", weight: "0kg", repetitions: "5" }],
      },
    ];

    const result = getVolumeChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
      squat: 100,
    });
  });

  test("Should handle missing weight or reps on the latest training and the training to compare against", () => {
    const latestTraining: Training = {
      date: "some date",
      id: 2,
      headline: null,
      exercises: [
        { exerciseName: "squat", weight: null, repetitions: "10" },
        { exerciseName: "bench press", weight: "80kg", repetitions: null },
        { exerciseName: "row", weight: "90kg", repetitions: "10" },
        { exerciseName: "pull ups", weight: "10kg", repetitions: "10" },
        { exerciseName: "chin ups", weight: "", repetitions: "10" },
      ],
    };

    const trainings: Training[] = [
      latestTraining,
      {
        date: "some date",
        id: 1,
        headline: null,
        exercises: [
          { exerciseName: "squat", weight: "80kg", repetitions: "5" },
          { exerciseName: "bench press", weight: "80kg", repetitions: "10" },
          { exerciseName: "row", weight: null, repetitions: "10" },
          { exerciseName: "pull ups", weight: "10kg", repetitions: null },
          { exerciseName: "chin ups", weight: "10kg", repetitions: "10" },
        ],
      },
    ];

    const result = getVolumeChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
    });
  });

  test("Should return null if there are less than two trainings", () => {
    const latestTraining: Training = {
      date: "some date",
      id: 2,
      headline: null,
      exercises: [
        { exerciseName: "squat", weight: null, repetitions: "10" },
        { exerciseName: "bench press", weight: "80kg", repetitions: null },
        { exerciseName: "row", weight: "90kg", repetitions: "10" },
        { exerciseName: "pull ups", weight: "10kg", repetitions: "10" },
        { exerciseName: "chin ups", weight: "", repetitions: "10" },
      ],
    };

    const trainings: Training[] = [latestTraining];

    const result = getVolumeChanges(latestTraining, trainings);

    expect(result).toBe(null);
  });
});
