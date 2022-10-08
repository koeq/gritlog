import "./styles/training-table.css";
import { Training } from "../db-handler/types";
import { useSwipeable } from "react-swipeable";

interface TrainingTableProps {
  readonly training: Training;
}

export const TrainingTable = ({
  training,
}: TrainingTableProps): JSX.Element | null => {
  const swipeConfig = {
    delta: 10,
    preventScrollOnSwipe: true,
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => console.log("User Swipep left!", eventData),
    ...swipeConfig,
  });

  return (
    <table {...swipeHandlers}>
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
