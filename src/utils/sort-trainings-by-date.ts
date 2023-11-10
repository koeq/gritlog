import { Training } from "../types";

export const sortTrainingsByDate = (trainings: Training[]): Training[] =>
  trainings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
