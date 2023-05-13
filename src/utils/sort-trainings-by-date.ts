import { Training } from "../types";

export function sortTrainingsByDate(trainings: Training[]): Training[] {
  return trainings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
