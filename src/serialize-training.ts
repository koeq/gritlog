import { Training } from "../lambdas/db-handler/types";

export const serializeTraining = (training: Training): string => {
  const { headline, exercises } = training;

  const serializedHeadline = headline ? `# ${headline}\n` : "";

  const serializedeExercises = exercises
    ? training.exercises
        ?.map(
          ({ exerciseName, weight, repetitions }) =>
            `${exerciseName || ""} @${weight || ""} ${repetitions || ""}\n`
        )
        .join("")
        .trim()
    : "";

  return serializedHeadline + serializedeExercises;
};
