import { Exercise } from "./types";
import { parseReps } from "./utils/parse-reps";
import { parseWeight } from "./utils/parse-weight";

// TODO: This logic only makes sense as long as you don't consider bodyweight exercises.
// For a progression like --- Pull ups @0kg 3x8 -> Pull ups @10kg 3x8 to make sense we need
// a value for the bodyweight to make sense.
const ZERO_WEIGHT_VALUE = 1;

export const getVolumePerExercise = (
  exercises: Exercise[]
): Record<string, number> =>
  exercises.reduce(
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
