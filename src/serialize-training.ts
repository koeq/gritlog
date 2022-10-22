import { Training } from "../db-handler/types";

export const serializeTraining = (training: Training): string => {
  if (!training.exercises) {
    return "";
  }

  return training.exercises
    .map(
      ({ exerciseName, weight, repetitions }) =>
        `${exerciseName || ""} ${weight || ""} ${repetitions || ""}\n`
    )
    .join("")
    .trim();
};
