import { useRef } from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { useIsMobile } from "./context";
import { Action } from "./state-reducer";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Training } from "./types";

interface TrainingTableProps {
  readonly training: Training;
  readonly dispatch: React.Dispatch<Action>;
  readonly handleSetEditMode: (id: number) => void;
  readonly percentageChanges: Record<string, number> | null;
}

const scrollOnClick = (element: HTMLDivElement | null): void => {
  if (!element) {
    return;
  }

  // Left value doesn't have to match exactly because of scroll snap.
  const leftValue = element.scrollLeft === 0 ? 160 : -160;

  element.scrollBy({
    left: leftValue,
    behavior: "smooth",
  });
};

export const TrainingTableWithButtons = ({
  training,
  dispatch,
  handleSetEditMode,
  percentageChanges,
}: TrainingTableProps): JSX.Element | null => {
  const trainingRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  return (
    <div
      className="training-with-buttons"
      ref={trainingRef}
      onClick={isMobile ? undefined : () => scrollOnClick(trainingRef.current)}
    >
      <TrainingTable
        training={training}
        percentageChanges={percentageChanges}
      />

      <div className="buttons-container">
        <button
          id="edit"
          className="action-btn-default"
          onClick={(e) => {
            e.stopPropagation();
            handleSetEditMode(training.id);
            scrollOnClick(trainingRef.current);
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="delete"
          className="action-btn-default"
          onClick={(e) => {
            e.stopPropagation();
            scrollOnClick(trainingRef.current);
            dispatch({
              type: "set-delete-mode",
              id: training.id,
            });
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
