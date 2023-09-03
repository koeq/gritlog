import { Training } from "./types";

export const serializeExercises = (training: Training): string =>
  training.exercises
    ?.map(
      ({ exerciseName, weight, repetitions }) =>
        `${exerciseName || ""} ${weight ? "@" + weight : ""} ${
          repetitions || ""
        }\n`
    )
    .join("")
    .trim();
