import "./styles/training-table.css";
import { Exercise, Training } from "./types";

interface TrainingTableProps {
  readonly training: Training;
  readonly percentageChanges: Record<string, number> | null;
}

interface TableValueProps {
  readonly training: Training;
  readonly percentageChanges: Record<string, number> | null;
}

export const TrainingTable = ({
  training,
  percentageChanges,
}: TrainingTableProps): JSX.Element | null => {
  const { headline } = training;

  return (
    <table tabIndex={0}>
      <tbody>
        <tr>
          <th id="headline" className={"border-bottom"} colSpan={2}>
            {headline && <span id="headline">{headline}</span>}
          </th>
          <th className={"date-header border-bottom"} colSpan={2}>
            {training.date}
          </th>
        </tr>
        <TableHeaders />
        <TableValues
          training={training}
          percentageChanges={percentageChanges}
        />
      </tbody>
    </table>
  );
};

const TableHeaders = (): JSX.Element => {
  return (
    <tr>
      <th id="exerciseLabel" className="label-header">
        <h3>exercise</h3>
      </th>
      <th id="weightLabel" className="label-header">
        <h3>weight</h3>
      </th>
      <th className="label-header">
        <h3>reps</h3>
      </th>
    </tr>
  );
};

const TableValues = ({
  training,
  percentageChanges,
}: TableValueProps): JSX.Element => {
  const { exercises } = training;

  return (
    <>
      {exercises?.length
        ? exercises.map((exercise, index) =>
            renderExerciseRow(exercise, percentageChanges, index)
          )
        : renderEmptyRow()}
    </>
  );
};

const renderExerciseRow = (
  exercise: Exercise,
  percentageChanges: Record<string, number> | null,
  index: number
) => {
  const { exerciseName, weight, repetitions } = exercise;

  const percentageChange =
    exerciseName && percentageChanges?.[exerciseName]
      ? percentageChanges?.[exerciseName]
      : 0;

  const sign = percentageChange === 0 ? "" : percentageChange > 0 ? "↑ " : "↓ ";

  return (
    <tr key={index}>
      <td id="exercise">{exerciseName || "—"}</td>
      <td id="weight">{weight ?? "—"}</td>
      <td id="repetitions">{parseReps(repetitions) ?? "—"}</td>
      {percentageChanges && (
        <td
          id="change"
          className={
            percentageChange === 0
              ? "zero"
              : percentageChange > 0
              ? "positive"
              : "negative"
          }
        >
          {sign}
          {Math.abs(percentageChange).toFixed(0)}%
        </td>
      )}
    </tr>
  );
};

const parseReps = (repetitions: string | null | undefined) => {
  if (!repetitions) {
    return;
  }

  const reps = repetitions.split("/");
  const firstRep = reps[0];

  if (reps.length > 1 && reps.every((rep) => rep === firstRep)) {
    return `${reps.length}x${firstRep}`;
  }

  return repetitions;
};

const renderEmptyRow = () => (
  <tr>
    <td id="exercise">—</td>
    <td id="weight">—</td>
    <td id="repetitions">—</td>
    <td id="change"></td>
  </tr>
);
