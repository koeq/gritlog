import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Mode, Training } from "./types";

interface TrainingTableProps {
  readonly training: Training;
  readonly handleSetEditMode: (id: number) => void;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
}

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  setMode,
}: TrainingTableProps): JSX.Element | null => {
  return (
    <div className="training-with-buttons">
      <TrainingTable training={training} />
      <div className="buttons-container">
        <button
          id="edit"
          className="action-btn-default"
          onClick={() => {
            handleSetEditMode(training.id);
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="delete"
          className="action-btn-default"
          onClick={() => {
            setMode({ type: "delete", id: training.id });
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
