export function sortTrainingsByDate<T extends { date: string }>(
  trainings: T[]
): T[] {
  return trainings.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
