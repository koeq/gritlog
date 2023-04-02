import { getLatestPercentageChanges } from "../get-latest-percentage-change";
import { Training } from "../types";

describe("Calculate percentage change compared to the last time the exercises were performed:", () => {
  test("Should return an object with the training id only when there are not enough trainings", () => {
    const latestTraining: Training = {
      date: "2023-04-02",
      id: 1,
      exercises: [{ exerciseName: "squat", weight: "100kg", repetitions: "5" }],
    };

    const trainings: Training[] = [latestTraining];

    const result = getLatestPercentageChanges(latestTraining, trainings);
    expect(result).toEqual({ trainingId: 1 });
  });

  test("Should return percentage changes for exercises in the latest training", () => {
    const latestTraining: Training = {
      date: "2023-04-02",
      id: 2,
      exercises: [
        { exerciseName: "squat", weight: "100kg", repetitions: "5" },
        { exerciseName: "bench press", weight: "80kg", repetitions: "5" },
      ],
    };

    const trainings: Training[] = [
      {
        date: "2023-04-01",
        id: 1,
        exercises: [
          { exerciseName: "squat", weight: "80kg", repetitions: "5" },
          { exerciseName: "bench press", weight: "60kg", repetitions: "5" },
        ],
      },
      latestTraining,
    ];

    const result = getLatestPercentageChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
      squat: 25,
      "bench press": 33.33333333333333,
    });
  });

  test("Should handle exercises not present in previous trainings", () => {
    const latestTraining: Training = {
      date: "2023-04-02",
      id: 2,
      exercises: [
        { exerciseName: "squat", weight: "100kg", repetitions: "5" },
        { exerciseName: "deadlift", weight: "120kg", repetitions: "5" },
      ],
    };

    const trainings: Training[] = [
      {
        date: "2023-04-01",
        id: 1,
        exercises: [
          { exerciseName: "squat", weight: "80kg", repetitions: "5" },
          { exerciseName: "bench press", weight: "60kg", repetitions: "5" },
        ],
      },
      latestTraining,
    ];

    const result = getLatestPercentageChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
      squat: 25,
    });
  });

  test("Should handle 0 weighted exercises", () => {
    const latestTraining: Training = {
      date: "2023-04-02",
      id: 2,
      exercises: [{ exerciseName: "squat", weight: "0kg", repetitions: "10" }],
    };

    const trainings: Training[] = [
      {
        date: "2023-04-01",
        id: 1,
        exercises: [{ exerciseName: "squat", weight: "0kg", repetitions: "5" }],
      },
      latestTraining,
    ];

    const result = getLatestPercentageChanges(latestTraining, trainings);

    expect(result).toEqual({
      trainingId: 2,
      squat: 100,
    });
  });
});
