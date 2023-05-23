import { Training } from "./types";

export const serializeTraining = (
  training: Omit<Training, "id" | "date">
): string => {
  const { headline, exercises } = training;

  const serializedHeadline = headline ? `# ${headline}\n` : "";

  const serializedExercises = exercises
    ? training.exercises
        ?.map(
          ({ exerciseName, weight, repetitions }) =>
            `${exerciseName || ""} ${weight ? "@" + weight : ""} ${
              repetitions || ""
            }\n`
        )
        .join("")
        .trim()
    : "";

  return serializedHeadline + serializedExercises;
};
