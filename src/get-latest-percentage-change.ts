import { Training } from "./types";

export const getLatestPercentageChanges = (
  latestTraining: Training,
  trainings: Training[]
): Record<string, number> | null => {
  const percentageChanges: Record<string, number> = {
    trainingId: latestTraining.id,
  };

  if (trainings.length < 2) {
    return null;
  }

  const exerciseWorkMap = getWorkPerExercise(latestTraining);

  for (const [exercise, work] of Object.entries(exerciseWorkMap)) {
    if (work === 0) {
      continue;
    }

    for (let i = trainings.length - 2; i >= 0; i--) {
      const prevTraining = trainings[i];

      if (prevTraining === undefined) {
        continue;
      }

      const prevExerciseWorkMap = getWorkPerExercise(prevTraining);

      if (
        !Object.prototype.hasOwnProperty.call(prevExerciseWorkMap, exercise)
      ) {
        continue;
      }

      const prevWork = prevExerciseWorkMap[exercise];

      if (prevWork === 0 || prevWork === undefined) {
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
    (
      acc: Record<string, number>,
      { exerciseName, weight, repetitions: reps }
    ) => {
      if (!exerciseName) {
        return acc;
      }
      const parsedWeight = weight ? parseWeight(weight) : null;
      const parsedReps = reps ? parseReps(reps) : null;

      if (parsedWeight === null || parsedReps === null) {
        return acc;
      }

      const doneWork = parsedWeight * parsedReps;
      const exercise = acc[exerciseName];

      acc[exerciseName] =
        exercise !== undefined &&
        Object.prototype.hasOwnProperty.call(acc, exerciseName)
          ? exercise + doneWork
          : doneWork;

      return acc;
    },
    {}
  );

const ZERO_WEIGHT_VALUE = 1;
// TODO: This logic only makes sense as long as you don't consider bodyweight exercises.
// For a progression like --- Pull ups @0 5*5 -> Pull ups @10 5*% to make sense we need
// a value for the bodyweight to make sense.
const parseWeight = (weight: string): number | null => {
  const match = weight.match(/\d+/);
  const parsed = match && match[0] ? parseInt(match[0]) : null;

  return parsed === 0 ? ZERO_WEIGHT_VALUE : parsed;
};

const parseReps = (reps: string): number | null => {
  const parsedReps = reps
    .split("/")
    .map((rep) => parseInt(rep))
    .filter((rep) => !isNaN(rep));

  const summedReps = parsedReps.reduce((acc, rep) => acc + rep, 0);

  return summedReps || null;
};
