import { Training } from "../../lambdas/db-handler/types";

export const getNextTrainingId = (trainings: Training[]): number => {
  if (trainings.length === 0) {
    return 0;
  }

  return Math.max(...trainings.map((training) => training.id)) + 1;
};
