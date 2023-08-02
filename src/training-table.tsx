import { Calendar } from "./calendar";
import { useTopLevelState } from "./context";
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
  return (
    <table tabIndex={0}>
      <tbody>
        <TableTopRow training={training} />
        <TableHeaders />
        <TableValues
          training={training}
          percentageChanges={percentageChanges}
        />
      </tbody>
    </table>
  );
};

const TableTopRow = ({
  training: { id, date, headline },
}: {
  training: Training;
}): JSX.Element => {
  return (
    <tr>
      <th className={"th-spacing headline"} colSpan={3}>
        {headline && <span>{headline}</span>}
      </th>
      <th className={"date-header th-spacing"} colSpan={1}>
        <div className="date">
          <p>{createDateFormat(new Date(date), true)}</p>
          <Calendar id={id} />
        </div>
      </th>
    </tr>
  );
};

const TableHeaders = (): JSX.Element => {
  return (
    <tr>
      <th className="label-header">
        <h3>exercise</h3>
      </th>
      <th className="label-header">
        <h3>weight</h3>
      </th>
      <th className="label-header">
        <h3>reps</h3>
      </th>
      <th className="label-header"></th>
    </tr>
  );
};

const TableValues = ({
  training,
  percentageChanges,
}: TableValueProps): JSX.Element => {
  const { exercises } = training;
  const [{ searchTerm }] = useTopLevelState();
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

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
              isSearchedExercise: normalizedSearchTerm
                ? exercise.exerciseName
                    ?.toLowerCase()
                    .includes(normalizedSearchTerm)
                : false,
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
  isSearchedExercise: boolean | undefined;
}

const renderExerciseRow = ({
  index,
  exercise,
  isLastIndex,
  percentageChanges,
  weightChange,
  isSearchedExercise,
}: RenderExerciseRowParams) => {
  const { exerciseName, weight, repetitions } = exercise;

  const percentageChange = exerciseName
    ? percentageChanges?.[exerciseName] ?? null
    : null;

  const sign = percentageChange ? (percentageChange > 0 ? "↑" : "↓") : "";
  const tdClassName = isLastIndex ? "last-td" : "td";

  return (
    <tr key={index}>
      <td
        className={`${tdClassName}${
          isSearchedExercise ? " searched-exercise-name" : ""
        }`}
        id="exercise"
      >
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
