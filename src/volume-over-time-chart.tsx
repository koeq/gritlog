import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  SHOW_ALL_SETS,
  collectVolumeOverTime,
} from "./collect-volume-over-time";
import { useTheme } from "./context";
import { getUniqueNumbersOfSets } from "./get-unique-numbers-of-sets";
import "./styles/volume-over-time-chart.css";
import { Training } from "./types";
import { getUniqueExerciseNames } from "./utils/get-unique-exercises";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface VolumeOverTimeChartProps {
  trainings: Training[];
}

function VolumeOverTimeChart({
  trainings,
}: VolumeOverTimeChartProps): JSX.Element {
  const { theme } = useTheme();
  const chartBorderColor = theme === "dark" ? "#282A32" : "#e6e6e9";

  const exercises = useMemo(
    () => getUniqueExerciseNames(trainings),
    [trainings]
  );

  const [exercise, setExercise] = useState(exercises[0] || "");
  const [numberOfSets, setNumberOfSets] = useState<number>(SHOW_ALL_SETS);

  const numbersOfSets = useMemo(
    () => getUniqueNumbersOfSets(exercise, trainings),
    [exercise, trainings]
  );

  const { volumens, dates } = useMemo(
    () => collectVolumeOverTime(exercise, trainings, numberOfSets),
    [exercise, trainings, numberOfSets]
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
        borderColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue("--color-progress"),
        backgroundColor: "rgba(90, 130, 255, 0.6)",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
        border: {
          color: chartBorderColor,
        },
        ticks: {
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        border: {
          color: chartBorderColor,
        },
        ticks: {
          maxTicksLimit: 4,
        },
        grid: { display: false },
      },
    },
  };

  return (
    <section id="volume-over-time">
      <div id="selects">
        <div className="select-section">
          <label htmlFor="exercise-select">exercise:</label>
          <select
            id="exercise-select"
            value={exercise}
            onChange={(event) => {
              setExercise(event.target.value);
              setNumberOfSets(SHOW_ALL_SETS);
            }}
          >
            {exercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>

        <div className="select-section">
          <label htmlFor="number-of-sets-select">number of sets:</label>
          <select
            id="number-of-sets-select"
            value={numberOfSets}
            onChange={(event) => setNumberOfSets(parseInt(event.target.value))}
          >
            <option key="all" value={SHOW_ALL_SETS}>
              all
            </option>
            {numbersOfSets.map((numberOfSets) => (
              <option key={numberOfSets} value={numberOfSets}>
                {numberOfSets}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Line options={options} data={data} />
    </section>
  );
}

export default VolumeOverTimeChart;
