import { Training } from "../db-handler/types";

export const createTrainingInput = (training: Training) => {
  if (!training.exercises) {
    return "";
  }

  let trainingInput: string = "";

  const exercisesInput = training.exercises.map(
    ({ exerciseName, weight, repetitions }) =>
      `${exerciseName || ""} ${weight || ""} ${repetitions || ""}`
  );

  exercisesInput.forEach((exercise) => {
    trainingInput += `${exercise}\n`;
  });

  return trainingInput.trim();
};
