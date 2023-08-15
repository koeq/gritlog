export const parseReps = (reps: string | undefined | null): number[] =>
  reps
    ? reps
        .split("/")
        .map((rep) => parseInt(rep))
        .filter((rep) => !isNaN(rep))
    : [];
