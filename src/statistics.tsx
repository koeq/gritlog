import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { parseReps } from "./exercise-row";
import { parseWeight } from "./get-latest-percentage-change";
import "./styles/statistics.css";
import { Exercise, Training } from "./types";
import { getUniqueExerciseNames } from "./utils/get-unique-exercises";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options: ChartOptions<"line"> = {
  responsive: true,
  font: {
    family: "Mona Sans",
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },

    title: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 10,
      },
      grid: { display: false },
    },
    y: {
      ticks: {
        maxTicksLimit: 4,
      },
      grid: { display: false },
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
  const [exercise, setExercise] = useState("Squats");

  const exercises = useMemo(
    () => getUniqueExerciseNames(trainings),
    [trainings]
  );

  const { dataPoints, labels } = useMemo(
    () => collectData(collectExercise(exercise, trainings)),
    [exercise, trainings]
  );

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        tension: 0.1,
        borderWidth: 2.5,
        pointBorderWidth: 1,
        pointRadius: 3,
        label: exercise,
        data: dataPoints,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // TODO:
  // 1. getUniqueExerciseNames only for exercises with weights and reps
  // 2. collectData needs to sum exercises with different weight in the same session

  return (
    <section id="statistics">
      <br />
      <br />
      <select
        name="exercise"
        id="exercise"
        value={exercise}
        onChange={(event) => setExercise(event.target.value)}
      >
        {exercises.map((exercise) => (
          <option key={exercise} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>
      <Line options={options} data={data} />
    </section>
  );
}
