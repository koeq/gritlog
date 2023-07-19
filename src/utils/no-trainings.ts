import { Training } from "../types";

export const noTrainings = (trainings: Training[] | undefined): boolean =>
  !trainings || trainings.length === 0;
