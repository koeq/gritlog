import { Training } from "../types";
import { getDayOfYear, getDaysInYear } from "./date";

/**
 * Calculates number of the day of the year.
 *
 * @param trainings - A list of trainings.
 * @return On object containing the average volume of a training for the current year as well as a list of the training days containing the date and the total volume.
 */

interface DayOfYear {
  date: Date;
  volume: number;
}

interface VolumePerDayOfYearAndAverage {
  averageVolume: number;
  daysOfYear: (DayOfYear | undefined)[];
}

export const getVolumePerDayOfYearAndAverage = (
  trainings: Training[]
): VolumePerDayOfYearAndAverage => {
  let totalVolume = 0;
  let trainingsCounter = 0;
  const currentYear = new Date().getFullYear();

  const daysOfYear: (DayOfYear | undefined)[] = Array(
    getDaysInYear(new Date().getFullYear())
  ).fill(undefined);

  for (const training of trainings) {
    const date = new Date(training.date);

    if (date.getFullYear() !== currentYear || !training.exerciseVolumeMap) {
      continue;
    }

    // Mutate daysOfYear
    const trainingVolume = Object.values(training.exerciseVolumeMap).reduce(
      (acc, curr) => acc + curr,
      0
    );

    const dayOfYear = getDayOfYear(date);
    daysOfYear[dayOfYear - 1] = { date, volume: trainingVolume };

    // Keep track for calculating average volume
    totalVolume += trainingVolume;
    trainingsCounter += 1;
  }

  return { daysOfYear, averageVolume: totalVolume / trainingsCounter };
};
