import { Training } from "../db-handler/types";
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
          <th style={{ width: "99.5px" }} className="label-header">
            exercise
          </th>
          <th style={{ padding: "0 10px" }} className="label-header">
            weight
          </th>
          <th className="label-header">repetitions</th>
        </tr>

        {training.exercises &&
          training.exercises.map(
            ({ exerciseName, weight, repetitions }, index) => (
              <tr key={index}>
                <td
                  style={{
                    width: "130px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {exerciseName}
                </td>
                <td
                  style={{
                    padding: "0 10px",
                    width: "90px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {weight}
                </td>
                <td
                  style={{
                    width: "90px",
                    overflowWrap: "anywhere",
                  }}
                >
                  {repetitions}
                </td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};
