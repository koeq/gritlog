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
          <th className={"date-header border-bottom"} colSpan={3}>
            {training.date}
          </th>
        </tr>
        {headline && (
          <tr>
            <th colSpan={3} id="headline">
              {headline}
            </th>
          </tr>
        )}

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
        exercise
      </th>
      <th id="weightLabel" className="label-header">
        weight
      </th>
      <th className="label-header">reps</th>
    </tr>
  );
};

const TableValues = ({
  training,
  percentageChanges,
}: TableValueProps): JSX.Element => {
  const { exercises } = training;

  const renderExerciseRow = (exercise: Exercise, index: number) => {
    const { exerciseName, weight, repetitions } = exercise;

    const percentageChange =
      percentageChanges && exerciseName
        ? percentageChanges?.[exerciseName]?.toFixed(2)
        : "";

    return (
      <tr key={index}>
        <td id="exercise">{exerciseName || "—"}</td>
        <td id="weight">{weight ?? "—"}</td>
        <td id="repetitions">{parseReps(repetitions) ?? "—"}</td>
        {percentageChanges && <td id="change">{percentageChange}</td>}
      </tr>
    );
  };

  const renderEmptyRow = () => (
    <tr>
      <td id="exercise">—</td>
      <td id="weight">—</td>
      <td id="repetitions">—</td>
      <td id="change">—</td>
    </tr>
  );

  return (
    <>
      {exercises?.length ? exercises.map(renderExerciseRow) : renderEmptyRow()}
    </>
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
