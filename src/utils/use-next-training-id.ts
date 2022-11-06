import { Training } from "../../lambdas/db-handler/types";

export const getNextTrainingId = (
  trainings: Training[] | undefined
): number => {
  if (!trainings || trainings.length === 0) {
    return 0;
  }

  return Math.max(...trainings.map((training) => training.id)) + 1;
};
