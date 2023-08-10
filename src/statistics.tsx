import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { parseReps } from "./exercise-row";
import { parseWeight } from "./get-latest-percentage-change";
import "./styles/statistics.css";
import { Exercise, Training } from "./types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,

  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Benchpress",
    },
  },
};

type RequiredNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

interface DatedExercise extends RequiredNonNullable<Exercise> {
  date: Training["date"];
}

const collectExercise = (name: string, trainings: Training[]) => {
  const exercises: DatedExercise[] = [];

  for (const training of trainings) {
    for (const exercise of training.exercises) {
      if (exercise.exerciseName === name) {
        if (
          !exercise.exerciseName ||
          !exercise.weight ||
          !exercise.repetitions
        ) {
          continue;
        }

        exercise.weight;
        exercises.push({
          date: training.date,
          exerciseName: exercise.exerciseName,
          weight: exercise.weight,
          repetitions: exercise.repetitions,
        });
      }
    }
  }

  return exercises.reverse();
};

const collectData = (exercises: DatedExercise[]) => {
  const labels: string[] = [];
  const dataPoints: number[] = [];

  for (const { date, weight, repetitions } of exercises) {
    const temp = new Date(date);
    const day = temp.getDate();
    const monthShort = temp.toLocaleString("en-US", { month: "short" });
    const parsedWeight = parseWeight(weight);

    if (parsedWeight === null) {
      continue;
    }

    const parsedRepetitions = parseReps(repetitions);

    const movedWeight = parsedRepetitions.reduce((prev, curr) => {
      return prev + parseInt(curr) * parsedWeight;
    }, 0);

    labels.push(`${monthShort} ${day}`);
    dataPoints.push(movedWeight);
  }

  return { labels, dataPoints };
};

interface StatiscticsProps {
  trainings: Training[];
}

export function Statistics({ trainings }: StatiscticsProps): JSX.Element {
  const [exercise, _] = useState("Benchpress");

  const { dataPoints, labels } = collectData(
    collectExercise(exercise, trainings)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: dataPoints,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <section id="statistics">
      <Line options={options} data={data} redraw />
    </section>
  );
}
