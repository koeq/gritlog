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
  readonly handleSetEditMode: (id: number) => void;
  readonly dispatch: React.Dispatch<Action>;
}

const scrollOnClick = (element: HTMLDivElement | null): void => {
  if (element) {
    // The single pixel works because of the scroll-snap styles
    const leftValue = element.scrollLeft === 0 ? 1 : -1;

    element.scrollBy({
      left: leftValue,
      behavior: "smooth",
    });
  }
};

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  dispatch,
}: TrainingTableProps): JSX.Element | null => {
  const trainingRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  return (
    <div
      className="training-with-buttons"
      ref={trainingRef}
      onClick={isMobile ? undefined : () => scrollOnClick(trainingRef.current)}
    >
      <TrainingTable training={training} />

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
              type: "set-mode",
              mode: { type: "delete", id: training.id },
            });
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
