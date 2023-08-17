import { Training } from "./types";

export const collectVolumeOverTime = (
  exercise: string,
  trainings: Training[]
): {
  dates: string[];
  volumens: number[];
} => {
  const dates: string[] = [];
  const volumens: number[] = [];

  for (const { date, exerciseVolumeMap } of [...trainings].reverse()) {
    const volume = exerciseVolumeMap[exercise];

    if (volume === undefined) {
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
