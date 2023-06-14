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
  const { id, date, headline } = training;

  return (
    <table tabIndex={0}>
      <tbody>
        <tr>
          <th className={"th-spacing headline"} colSpan={3}>
            {headline && <span>{headline}</span>}
          </th>
          <th className={"date-header th-spacing"} colSpan={1}>
            <div className="date">
              <Calendar id={id} />
              <p>{createDateFormat(new Date(date))}</p>
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
    <tr style={{ border: "1px solid var(--border-primary)" }}>
      <th id="exercise-header" className="label-header">
        <h3>exercise</h3>
      </th>
      <th id="weight-header" className="label-header">
        <h3>weight</h3>
      </th>
      <th id="reps-header" className="label-header">
        <h3>reps</h3>
      </th>
      <th id="percentage-header" className="label-header"></th>
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
        ? exercises.map((exercise, index) => {
            const weightChange =
              exercise.exerciseName === exercises[index - 1]?.exerciseName;

            return renderExerciseRow({
              exercise,
              percentageChanges,
              index,
              isLastIndex: index === exercises.length - 1,
              weightChange,
            });
          })
        : renderEmptyRow()}
    </>
  );
};

interface RenderExerciseRowParams {
  index: number;
  exercise: Exercise;
  isLastIndex: boolean;
  percentageChanges: Record<string, number> | null;
  weightChange: boolean;
}

const renderExerciseRow = ({
  index,
  exercise,
  isLastIndex,
  percentageChanges,
  weightChange,
}: RenderExerciseRowParams) => {
  const { exerciseName, weight, repetitions } = exercise;

  const percentageChange = exerciseName
    ? percentageChanges?.[exerciseName] ?? null
    : null;

  const sign = percentageChange ? (percentageChange > 0 ? "↑" : "↓") : "";
  const tdClassName = isLastIndex ? "last-td" : "td";

  return (
    <tr key={index}>
      <td className={tdClassName} id="exercise">
        {weightChange ? "" : exerciseName ?? "—"}
      </td>
      <td className={tdClassName} id="weight">
        {weight ?? "—"}
      </td>
      <td className={tdClassName} id="repetitions">
        {parseReps(repetitions) ?? "—"}
      </td>
      {percentageChange !== null && !weightChange ? (
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
