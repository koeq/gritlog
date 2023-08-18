import { getNumberOfSets } from "./get-unique-numbers-of-sets";
import { Training } from "./types";

export const SHOW_ALL_SETS = -1;

export const collectVolumeOverTime = (
  exerciseName: string,
  trainings: Training[],
  targetNumberOfSets: number
): {
  dates: string[];
  volumens: number[];
} => {
  const dates: string[] = [];
  const volumens: number[] = [];

  for (const { date, exerciseVolumeMap, exercises } of [
    ...trainings,
  ].reverse()) {
    const volume = exerciseVolumeMap[exerciseName];

    if (volume === undefined) {
      continue;
    }

    const numberOfSets = getNumberOfSets(exerciseName, exercises);

    if (
      targetNumberOfSets !== SHOW_ALL_SETS &&
      targetNumberOfSets !== numberOfSets
    ) {
      continue;
    }

    const temp = new Date(date);
    const day = temp.getDate();
    const monthShort = temp.toLocaleString("en-US", { month: "short" });
    const dateString = `${monthShort} ${day}`;

    dates.push(dateString);
    volumens.push(volume);
  }

  return { dates, volumens };
};
