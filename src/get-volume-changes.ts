import { Training } from "./types";

const ZERO_WEIGHT_VALUE = 1;

export const getVolumeChanges = (
  training: Training,
  trainings: Training[]
): Record<string, number> | null => {
  const volumeChanges: Record<string, number> = {
    trainingId: training.id,
  };

  if (trainings.length < 2) {
    return null;
  }

  const exerciseVolumeMap = getVolumePerExercise(training);

  for (const [exercise, work] of Object.entries(exerciseVolumeMap)) {
    if (work === 0) {
      continue;
    }

    const latestTrainingIndex = trainings.findIndex(
      (training) => training.id === training.id
    );

    for (let i = latestTrainingIndex + 1; i < trainings.length; i++) {
      const prevTraining = trainings[i];

      if (prevTraining === undefined) {
        continue;
      }

      const prevExerciseWorkMap = getVolumePerExercise(prevTraining);

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
      volumeChanges[exercise] = percentageChange;
      break;
    }
  }

  return volumeChanges;
};

const getVolumePerExercise = (training: Training): Record<string, number> =>
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

      const volume = parsedWeight * parsedReps;
      const prevVolume = acc[exerciseName];

      acc[exerciseName] =
        prevVolume === undefined ? volume : prevVolume + volume;

      return acc;
    },
    {}
  );

// TODO: This logic only makes sense as long as you don't consider bodyweight exercises.
// For a progression like --- Pull ups @0 5*5 -> Pull ups @10 5*% to make sense we need
// a value for the bodyweight to make sense.
export const parseWeight = (weight: string): number | null => {
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
