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
import { collectExerciseOccurences } from "./collect-exercise-occurences";
import { collectVolumeOverTime } from "./collect-volume-over-time";
import "./styles/volume-over-time.css";
import { Training } from "./types";
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

interface VolumeOverTime {
  trainings: Training[];
}

export function VolumeOverTime({ trainings }: VolumeOverTime): JSX.Element {
  const [exercise, setExercise] = useState("Squats");

  const exercises = useMemo(
    () => getUniqueExerciseNames(trainings),
    [trainings]
  );

  const { volumens, dates } = useMemo(
    () => collectVolumeOverTime(collectExerciseOccurences(exercise, trainings)),
    [exercise, trainings]
  );

  const data: ChartData<"line"> = {
    labels: dates,
    datasets: [
      {
        tension: 0.1,
        borderWidth: 2.5,
        pointBorderWidth: 1,
        pointRadius: 3,
        label: exercise,
        data: volumens,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  console.log(trainings);

  return (
    <section id="volume-over-time">
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
