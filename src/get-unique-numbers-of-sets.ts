import { Exercise, Training } from "./types";
import { parseReps } from "./utils/parse-reps";

export const getUniqueNumbersOfSets = (
  exerciseName: string,
  trainings: Training[]
): number[] => {
  const numbersOfSets = new Set<number>();

  for (const { exercises } of trainings) {
    const numberOfSets = getNumberOfSets(exerciseName, exercises);

    if (numberOfSets === 0) {
      continue;
    }

    numbersOfSets.add(numberOfSets);
  }

  return [...numbersOfSets].sort((a, b) => a - b);
};

export const getNumberOfSets = (
  exerciseName: string,
  exercises: Exercise[]
): number =>
  exercises
    .filter(({ exerciseName: name }) => name === exerciseName)
    .reduce((acc, { repetitions }) => {
      const parsedReps = parseReps(repetitions);

      return acc + parsedReps.length;
    }, 0);
