import { Training } from "../db-handler/types";
import "./styles/training-table.css";

interface TrainingTableProps {
  readonly training: Training;
}

export const TrainingTable = ({
  training,
}: TrainingTableProps): JSX.Element | null => {
  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={3} className="date-header">
            {training.date}
          </th>
        </tr>
        <tr>
          <th className="label-header">exercise</th>
          <th className="label-header">weight</th>
          <th className="label-header">repetitions</th>
        </tr>

        {training.exercises &&
          training.exercises.map(
            ({ exerciseName, weight, repetitions }, index) => (
              <tr key={index}>
                <td>{exerciseName}</td>
                <td>{weight}</td>
                <td>{repetitions}</td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};
