import { Training } from "../lambdas/db-handler/types";
import { useIsMobile } from "./context/is-mobile-provider";
import "./styles/training-table.css";
import { SwipeHandlers, SwipeHelpers } from "./training-table-with-buttons";

interface TrainingTableProps {
  readonly training: Training;
  readonly swipeActions?: SwipeHandlers & SwipeHelpers;
}

const TableHeaders = (): JSX.Element => {
  return (
    <tr>
      <th id="exerciseLabel" className="label-header">
        exercise
      </th>
      <th id="weightLabel" className="label-header">
        weight
      </th>
      <th className="label-header">repetitions</th>
    </tr>
  );
};

interface TableValueProps {
  readonly training: Training;
}

const TableValues = ({ training }: TableValueProps): JSX.Element => {
  return training.exercises && training.exercises.length > 0 ? (
    <>
      {training.exercises.map(
        ({ exerciseName, weight, repetitions }, index) => (
          <tr key={index}>
            <td id="exercise">{exerciseName || "—"}</td>
            <td id="weight">{weight || "—"}</td>
            <td id="repetitions">{repetitions || "—"}</td>
          </tr>
        )
      )}
    </>
  ) : (
    <tr>
      <td id="exercise">—</td>
      <td id="weight">—</td>
      <td id="repetitions">—</td>
    </tr>
  );
};

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
        {training.headline && (
          <tr>
            <th colSpan={3}>{training.headline}</th>
          </tr>
        )}
        <tr>
          <th colSpan={3} className="date-header">
            {training.date}
          </th>
        </tr>

        <TableHeaders />
        <TableValues training={training} />
      </tbody>
    </table>
  );
};
