import "./styles/deletion-confirmation.css";
import { Mode } from "./types";

interface DeletionConfirmationProps {
  readonly id: number | null;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
  readonly handleDelete: (id: number) => void;
  readonly nextTrainingId: number;
}

export const DeletionConfirmation = ({
  id,
  setMode,
  handleDelete,
  nextTrainingId,
}: DeletionConfirmationProps): JSX.Element | null => {
  if (!id && id !== 0) {
    return null;
  }

  return (
    <div className="deletion-confirmation-layer">
      <div className="dialog">
        <p className="dialog-text">Delete your training?</p>
        <button className="dialog-btn" onClick={() => handleDelete(id)}>
          yes
        </button>
        <br />
        <button
          className="dialog-btn"
          onClick={() => setMode({ type: "add", id: nextTrainingId })}
        >
          no
        </button>
      </div>
    </div>
  );
};
