import { Mode } from "./types";
import "./styles/deletion-confirmation.css";

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
}: DeletionConfirmationProps) => {
  if (!id && id !== 0) {
    return null;
  }

  return (
    <div className="deletion-confirmation-layer">
      <div className="dialog">
        <p className="dialog-text">Do you want to delete your training?</p>
        <br />
        <br />

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
