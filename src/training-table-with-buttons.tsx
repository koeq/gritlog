import { useRef } from "react";
import { IoPencilSharp, IoRepeat, IoTrashBin } from "react-icons/io5";
import { useIsMobile } from "./context";
import { Action } from "./state-reducer";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Training } from "./types";

interface TrainingTableProps {
  readonly editing: boolean;
  readonly training: Training;
  readonly dispatch: React.Dispatch<Action>;
  readonly handleRepeat: () => void;
  readonly handleSetEditMode: () => void;
  readonly percentageChanges: Record<string, number> | null;
}

export const TrainingTableWithButtons = ({
  editing,
  training,
  dispatch,
  handleRepeat,
  handleSetEditMode,
  percentageChanges,
}: TrainingTableProps): JSX.Element | null => {
  const isMobile = useIsMobile();
  const trainingRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={`training-with-buttons ${editing ? "editing" : ""}`}
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
          className="action-btn-default hover"
          onClick={(e) => {
            e.stopPropagation();
            scrollOnClick(trainingRef.current);
            setTimeout(() => handleSetEditMode(), 280);
          }}
        >
          <IoPencilSharp size={23} />
        </button>
        <button
          id="repeat"
          className="action-btn-default hover"
          onClick={(e) => {
            e.stopPropagation();
            handleRepeat();
            scrollOnClick(trainingRef.current);
          }}
        >
          <IoRepeat size={26} />
        </button>
        <button
          id="delete"
          className="action-btn-default hover"
          onClick={(e) => {
            e.stopPropagation();
            scrollOnClick(trainingRef.current);
            dispatch({
              type: "set-delete-mode",
              id: training.id,
            });
          }}
        >
          <IoTrashBin size={21} />
        </button>
      </div>
    </div>
  );
};

const scrollOnClick = (element: HTMLDivElement | null): void => {
  if (!element) {
    return;
  }

  const elementWidth = element.clientWidth;
  const scrollValue = element.scrollLeft === 0 ? elementWidth : -elementWidth;

  element.scrollBy({
    left: scrollValue,
    behavior: "smooth",
  });
};
