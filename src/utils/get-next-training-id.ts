import { Training } from "../types";

export const getNextTrainingId = (
  trainings: Training[] | undefined
): number => {
  if (!trainings || trainings.length === 0) {
    return 0;
  }

  return trainings.reduce((maxId, { id }) => (id > maxId ? id : maxId), 0) + 1;
};
