import { Training } from "./types";

export const getLatestPercentageChanges = (
  latestTraining: Training,
  trainings: Training[]
): Record<string, number> => {
  const percentageChanges: Record<string, number> = {
    trainingId: latestTraining.id,
  };

  if (trainings.length < 2) {
    percentageChanges;
  }

  const exerciseWorkMap = getWorkPerExercise(latestTraining);

  for (const [exercise, work] of Object.entries(exerciseWorkMap)) {
    if (work === 0) {
      continue;
    }

    for (let i = trainings.length - 2; i >= 0; i--) {
      const prevExerciseWorkMap = getWorkPerExercise(trainings[i]);

      if (
        !Object.prototype.hasOwnProperty.call(prevExerciseWorkMap, exercise)
      ) {
        continue;
      }

      const prevWork = prevExerciseWorkMap[exercise];

      if (prevWork === 0) {
        break;
      }

      const percentageChange = (work / prevWork - 1) * 100;
      percentageChanges[exercise] = percentageChange;
      break;
    }
  }

  return percentageChanges;
};

const getWorkPerExercise = (training: Training): Record<string, number> =>
  training.exercises.reduce(
    (acc: Record<string, number>, { exerciseName, weight, repetitions }) => {
      const doneWork = parseWeight(weight) * parseReps(repetitions);

      if (!exerciseName) {
        return acc;
      }

      if (Object.prototype.hasOwnProperty.call(acc, exerciseName)) {
        acc[exerciseName] += doneWork;
      } else {
        acc[exerciseName] = doneWork;
      }

      return acc;
    },
    {}
  );

const DEFAULT_VALUE = 0;
const MINIMUM_VALUE = 1;
// TODO: This logic only makes sense as long as you don't consider bodyweight exercises.
// For a progression like --- Pull ups @0 5*5 -> Pull ups @10 5*% to make sense we need
// a value for the bodyweight to make sense.
const parseWeight = (weight: string | null | undefined): number => {
  const match = weight?.match(/\d+/);
  const parsed = match ? parseInt(match[0]) : DEFAULT_VALUE;

  return parsed === 0 ? MINIMUM_VALUE : parsed;
};

const parseReps = (reps: string | null | undefined): number => {
  const summedReps = reps
    ?.split("/")
    .map((rep) => parseInt(rep))
    .reduce((acc, rep) => acc + rep);

  return summedReps || 0;
};
