import { Training } from "../types";

export const isEmptyTraining = (currentTraining: Training): boolean => {
  return !(
    currentTraining.headline?.length ||
    currentTraining.exercises.some(
      (exercise) =>
        exercise.exerciseName || exercise.repetitions || exercise.weight
    )
  );
};
