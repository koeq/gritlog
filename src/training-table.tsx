import { Calendar } from "./calendar";
import { createDateFormat } from "./group-training-by-weeks";
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
  const { headline, date } = training;

  return (
    <table tabIndex={0}>
      <tbody>
        <tr>
          <th id="headline" className={"th-spacing"} colSpan={2}>
            {headline && <span id="headline">{headline}</span>}
          </th>
          <th className={"date-header th-spacing"} colSpan={2}>
            <div className="date">
              <Calendar />
              {createDateFormat(new Date(date))}
            </div>
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
      {exercises.length
        ? exercises.map((exercise, index) =>
            renderExerciseRow({
              exercise,
              percentageChanges,
              index,
              isLastIndex: index === exercises.length - 1,
            })
          )
        : renderEmptyRow()}
    </>
  );
};

interface RenderExerciseRow {
  index: number;
  exercise: Exercise;
  isLastIndex: boolean;
  percentageChanges: Record<string, number> | null;
}

const renderExerciseRow = ({
  index,
  exercise,
  isLastIndex,
  percentageChanges,
}: RenderExerciseRow) => {
  const { exerciseName, weight, repetitions } = exercise;

  const percentageChange = exerciseName
    ? percentageChanges?.[exerciseName] ?? null
    : null;

  const sign = percentageChange ? (percentageChange > 0 ? "↑" : "↓") : "";
  const tdClassName = isLastIndex ? "last-td" : "td";

  return (
    <tr key={index}>
      <td className={tdClassName} id="exercise">
        {exerciseName ?? "—"}
      </td>
      <td className={tdClassName} id="weight">
        {weight ?? "—"}
      </td>
      <td className={tdClassName} id="repetitions">
        {parseReps(repetitions) ?? "—"}
      </td>
      {percentageChange !== null && percentageChange !== undefined ? (
        <td
          id="change"
          className={
            percentageChange === 0
              ? `zero ${tdClassName}`
              : percentageChange > 0
              ? `positive ${tdClassName}`
              : `negative ${tdClassName}`
          }
        >
          {sign}
          {Math.abs(percentageChange).toFixed(0)}%
        </td>
      ) : (
        <td className={tdClassName} id="change" />
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
