import { Training } from "../types";

export const getLastTrainingId = (
  trainings: Training[] | undefined
): number | undefined => {
  if (!trainings || trainings.length === 0) {
    return undefined;
  }

  return trainings.reduce((maxId, { id }) => (id > maxId ? id : maxId), 0);
};
