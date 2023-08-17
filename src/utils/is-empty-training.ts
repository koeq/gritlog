import { Training, TrainingWithoutVolume } from "../types";

export const isEmptyTraining = (
  currentTraining: Training | TrainingWithoutVolume
): boolean =>
  !(
    currentTraining.headline?.length ||
    currentTraining.exercises.some(
      (exercise) =>
        exercise.exerciseName || exercise.repetitions || exercise.weight
    )
  );
