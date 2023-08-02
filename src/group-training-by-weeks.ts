import { Training } from "./types";

type TrainingGroup = {
  weekStart: Date;
  weekEnd: Date;
  trainings: Training[];
};

export const groupTrainingsByWeek = (
  trainings: Training[]
): TrainingGroup[] => {
  const groupedTrainings: Map<string, TrainingGroup> = new Map();

  for (const training of trainings) {
    const date = new Date(training.date);
    const weekStart = getWeekStart(date);
    const groupKey = createGroupKey(weekStart);

    if (!groupedTrainings.has(groupKey)) {
      const weekEnd = new Date(weekStart);
      // Add 6 days to get Sunday
      weekEnd.setDate(weekStart.getDate() + 6);

      groupedTrainings.set(groupKey, {
        weekStart,
        weekEnd,
        trainings: [],
      });
    }

    groupedTrainings.get(groupKey)?.trainings.push(training);
  }

  return [...groupedTrainings.values()];
};

export const createDateFormat = (date: Date): string => {
  const day = date.toLocaleString("default", {
    day: "2-digit",
  });

  const month = date.toLocaleString("default", {
    month: "short",
  });

  return `${day} ${month}`;
};

function getWeekStart(date: Date): Date {
  // Sunday is 0, but we want it to be 7
  const dayOfWeek = date.getDay() || 7;
  const weekStart = new Date(date.getTime());

  // Start on Monday
  weekStart.setDate(weekStart.getDate() - dayOfWeek + 1);

  return weekStart;
}

const createGroupKey = (date: Date): string => {
  // Format: YYYY-MM-DDTHH:mm:ss
  const isoString = date.toISOString();

  return isoString.substring(0, 10);
};
