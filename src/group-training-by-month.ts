import { Training } from "./types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type Month = typeof MONTHS[number];

export type TrainingsByMonth = {
  date: {
    month: Month;
    year: number;
  };
  trainings: Training[];
};

export const groupTrainingsByMonth = (
  trainings: Training[]
): TrainingsByMonth[] => {
  const groupedTrainings: Map<string, TrainingsByMonth> = new Map();

  for (const training of trainings) {
    const date = new Date(training.date);
    const month = getMonth(date);
    const year = date.getFullYear();
    const groupKey = `${month}-${year}`;

    if (!groupedTrainings.has(groupKey)) {
      groupedTrainings.set(groupKey, { date: { month, year }, trainings: [] });
    }

    groupedTrainings.get(groupKey)?.trainings.push(training);
  }

  return [...groupedTrainings.values()];
};

function getMonth(date: Date): Month {
  const month = MONTHS[date.getMonth()];

  if (month === undefined) {
    throw new Error("Invalid month index");
  }

  return month;
}
