import { DatedExercise } from "./collect-exercise-occurences";
import { parseReps } from "./exercise-row";
import { parseWeight } from "./get-latest-percentage-change";

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

    if (parsedWeight === null) {
      continue;
    }

    const parsedRepetitions = parseReps(repetitions);

    const movedWeight = parsedRepetitions.reduce((prev, curr) => {
      return prev + parseInt(curr) * parsedWeight;
    }, 0);

    const currentVolume = volumesByDate.get(dateString) || 0;
    volumesByDate.set(dateString, currentVolume + movedWeight);
  }

  const dates: string[] = [];
  const volumens: number[] = [];

  for (const [date, volume] of volumesByDate) {
    dates.push(date);
    volumens.push(volume);
  }

  return { dates, volumens };
};
