import { IoCheckmark, IoCloseOutline } from "react-icons/io5";
import { Action } from "./state-reducer";
import "./styles/deletion-confirmation.css";

interface DeletionConfirmationProps {
  readonly id: number | null;
  readonly dispatch: React.Dispatch<Action>;
  readonly handleDelete: (id: number) => void;
  readonly nextTrainingId: number;
}

export const DeletionConfirmation = ({
  id,
  dispatch,
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
        <div className="button-container">
          <button onClick={() => handleDelete(id)}>
            <IoCheckmark size={32} />
          </button>
          <button
            onClick={() =>
              dispatch({
                type: "set-mode",
                mode: { type: "add", id: nextTrainingId },
              })
            }
          >
            <IoCloseOutline size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};
