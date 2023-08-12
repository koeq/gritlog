import { Exercise, Training } from "./types";

type RequiredNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export interface DatedExercise extends RequiredNonNullable<Exercise> {
  date: Training["date"];
}

export const collectExerciseOccurences = (
  name: string,
  trainings: Training[]
): DatedExercise[] => {
  const exercises: DatedExercise[] = [];

  for (const training of trainings) {
    for (const exercise of training.exercises) {
      if (exercise.exerciseName === name) {
        if (
          !exercise.exerciseName ||
          !exercise.weight ||
          !exercise.repetitions
        ) {
          continue;
        }

        exercises.push({
          date: training.date,
          exerciseName: exercise.exerciseName,
          weight: exercise.weight,
          repetitions: exercise.repetitions,
        });
      }
    }
  }

  return exercises.reverse();
};
