import { useRef } from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { useIsMobile } from "./context";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Mode, Training } from "./types";

interface TrainingTableProps {
  readonly training: Training;
  readonly handleSetEditMode: (id: number) => void;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
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
  setMode,
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
            setMode({ type: "delete", id: training.id });
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
