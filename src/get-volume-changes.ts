import { Training } from "./types";
import { parseReps } from "./utils/parse-reps";
import { parseWeight } from "./utils/parse-weight";

// TODO: This logic only makes sense as long as you don't consider bodyweight exercises.
// For a progression like --- Pull ups @0kg 3x8 -> Pull ups @10kg 3x8 to make sense we need
// a value for the bodyweight to make sense.
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

  for (const [exerciseName, volume] of Object.entries(exerciseVolumeMap)) {
    if (volume === 0) {
      continue;
    }

    const trainingIndex = trainings.findIndex((t) => t.id === training.id);

    for (let i = trainingIndex + 1; i < trainings.length; i++) {
      const prevTraining = trainings[i];

      if (prevTraining === undefined) {
        continue;
      }

      const prevExerciseVolumeMap = getVolumePerExercise(prevTraining);
      const prevVolume = prevExerciseVolumeMap[exerciseName];

      if (!prevVolume) {
        continue;
      }

      const percentageChange = (volume / prevVolume - 1) * 100;
      volumeChanges[exerciseName] = percentageChange;
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
      const parsedWeight = parseWeight(weight);
      const summedReps = parseReps(reps)?.reduce((acc, rep) => acc + rep, 0);

      if (!parsedWeight || summedReps === 0) {
        return acc;
      }

      const volume = (parsedWeight.value || ZERO_WEIGHT_VALUE) * summedReps;
      const prevVolume = acc[exerciseName];

      acc[exerciseName] =
        prevVolume === undefined ? volume : prevVolume + volume;

      return acc;
    },
    {}
  );
