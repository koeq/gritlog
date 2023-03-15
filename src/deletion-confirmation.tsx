import { Dispatch } from "react";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";
import { useAuth } from "./context";
import { deleteTraining } from "./delete-training";
import { Action } from "./state-reducer";
import "./styles/deletion-confirmation.css";

interface DeletionConfirmationProps {
  readonly id: number | null;
  readonly nextTrainingId: number;
  readonly dispatch: React.Dispatch<Action>;
}

const handleDelete = (
  id: number,
  dispatch: Dispatch<Action>,
  logout: () => void
) => {
  deleteTraining(id, logout);
  dispatch({ type: "delete", id });
};

export const DeletionConfirmation = ({
  id,
  dispatch,
  nextTrainingId,
}: DeletionConfirmationProps): JSX.Element | null => {
  const { logout } = useAuth();

  if (id === null) {
    return null;
  }

  return (
    <div className="deletion-confirmation-layer">
      <div className="dialog">
        <p className="dialog-text">Delete your training?</p>
        <div className="button-container">
          <button onClick={() => handleDelete(id, dispatch, logout)}>
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
