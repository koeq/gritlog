import "./styles/training-table.css";
import { Training } from "./types";

interface TrainingTableProps {
  readonly training: Training;
}

interface TableValueProps {
  readonly training: Training;
}

export const TrainingTable = ({
  training,
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
        <TableValues training={training} />
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

const TableValues = ({ training }: TableValueProps): JSX.Element => {
  const { exercises } = training;

  return exercises?.length > 0 ? (
    <>
      {exercises.map(({ exerciseName, weight, repetitions }, index) => {
        return (
          <tr key={index}>
            <td id="exercise">{exerciseName || "—"}</td>
            <td id="weight">{weight || "—"}</td>
            <td id="repetitions">{parseReps(repetitions) || "—"}</td>
          </tr>
        );
      })}
    </>
  ) : (
    <tr>
      <td id="exercise">—</td>
      <td id="weight">—</td>
      <td id="repetitions">—</td>
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
