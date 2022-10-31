import { Training } from "../lambdas/db-handler/types";
import { useIsMobile } from "./context/is-mobile-provider";
import "./styles/training-table.css";
import { SwipeHandlers, SwipeHelpers } from "./training-table-with-buttons";

interface TrainingTableProps {
  readonly training: Training;
  readonly swipeActions?: SwipeHandlers & SwipeHelpers;
}

export const TrainingTable = ({
  training,
  swipeActions,
}: TrainingTableProps): JSX.Element | null => {
  const isMobile = useIsMobile();

  const { toggleSwipe } = swipeActions || {};

  return (
    <table
      className={!isMobile ? "pointer" : undefined}
      {...(!isMobile && toggleSwipe && { onClick: () => toggleSwipe() })}
    >
      <tbody>
        <tr>
          <th colSpan={3} className="date-header">
            {training.date}
          </th>
        </tr>
        <tr>
          <th id="exerciseLabel" className="label-header">
            exercise
          </th>
          <th id="weightLabel" className="label-header">
            weight
          </th>
          <th className="label-header">repetitions</th>
        </tr>

        {training.exercises &&
          training.exercises.map(
            ({ exerciseName, weight, repetitions }, index) => (
              <tr key={index}>
                <td id="exercise">{exerciseName}</td>
                <td id="weight">{weight}</td>
                <td id="repetitions">{repetitions}</td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};
