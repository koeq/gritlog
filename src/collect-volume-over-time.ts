import { DatedExercise } from "./collect-exercise-occurences";

import { parseReps } from "./utils/parse-reps";
import { parseWeight } from "./utils/parse-weight";

export const collectVolumeOverTime = (
  exercises: DatedExercise[]
): {
  dates: string[];
  volumens: number[];
} => {
  const volumesByDate = new Map<string, number>();

  for (const { date, weight, repetitions } of exercises) {
    const temp = new Date(date);
    const day = temp.getDate();
    const monthShort = temp.toLocaleString("en-US", { month: "short" });
    const dateString = `${monthShort} ${day}`;
    const parsedWeight = parseWeight(weight);

    if (!parsedWeight) {
      continue;
    }

    const parsedReps = parseReps(repetitions);

    const volume = parsedReps.reduce((prev, curr) => {
      return prev + curr * parsedWeight.value;
    }, 0);

    const currentVolume = volumesByDate.get(dateString) || 0;
    volumesByDate.set(dateString, currentVolume + volume);
  }

  const dates: string[] = [];
  const volumens: number[] = [];

  for (const [date, volume] of volumesByDate) {
    dates.push(date);
    volumens.push(volume);
  }

  return { dates, volumens };
};
