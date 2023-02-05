import { useIsMobile } from "./context/is-mobile-provider";
import "./styles/training-table.css";
import { SwipeHandlers, SwipeHelpers } from "./training-table-with-buttons";
import { Training } from "./types";

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

const handleKeyDown = (
  event: React.KeyboardEvent<HTMLTableElement>,
  toggleSwipe: (() => void) | undefined
) => {
  if (!toggleSwipe) {
    return;
  }

  if (event.key === "Enter" && toggleSwipe) {
    toggleSwipe();
  }
};

export const TrainingTable = ({
  training,
  swipeActions,
}: TrainingTableProps): JSX.Element | null => {
  const isMobile = useIsMobile();
  const { headline } = training;

  const { toggleSwipe, swiped } = swipeActions || {};

  return (
    <table
      tabIndex={0}
      className={swiped ? "table-swiped" : ""}
      onKeyDown={(event) => handleKeyDown(event, toggleSwipe)}
      {...(!isMobile && toggleSwipe && { onClick: () => toggleSwipe() })}
    >
      <tbody>
        {headline && (
          <tr>
            <th colSpan={3} className="border-bottom">
              {headline}
            </th>
          </tr>
        )}
        <tr>
          <th
            className={!headline ? "date-header border-bottom" : "date-header"}
            colSpan={3}
          >
            {training.date}
          </th>
        </tr>

        <TableHeaders />
        <TableValues training={training} />
      </tbody>
    </table>
  );
};
