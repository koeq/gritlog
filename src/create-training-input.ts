import { Training } from "../db-handler/types";

export const createTrainingInput = (training: Training): string => {
  if (!training.exercises) {
    return "";
  }

  let trainingInput = "";

  const exercisesInput = training.exercises.map(
    ({ exerciseName, weight, repetitions }) =>
      `${exerciseName || ""} ${weight || ""} ${repetitions || ""}`
  );

  exercisesInput.forEach((exercise) => {
    trainingInput += `${exercise}\n`;
  });

  return trainingInput.trim();
};
