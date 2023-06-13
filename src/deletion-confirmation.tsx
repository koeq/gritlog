import { Dispatch } from "react";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useAuth, useTopLevelState } from "./context";
import { deleteTraining } from "./delete-training";
import { Action } from "./state-reducer";
import "./styles/deletion-confirmation.css";

interface DeletionConfirmationProps {
  readonly id: number | null;
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
}: DeletionConfirmationProps): JSX.Element | null => {
  const { logout } = useAuth();
  const [_, dispatch] = useTopLevelState();

  if (id === null) {
    return null;
  }

  return (
    <div className="dialog">
      <p className="dialog-text">Delete your training?</p>
      <div className="button-container">
        <button
          aria-label="deletion-confirmation"
          onClick={() => handleDelete(id, dispatch, logout)}
          className="circle-hover-large"
        >
          <IoCheckmarkSharp size={32} />
        </button>
        <button
          aria-label="deletion-cancelation"
          onClick={() =>
            dispatch({
              type: "set-mode",
              mode: { type: "add" },
            })
          }
          className="circle-hover-large"
        >
          <IoMdClose size={32} />
        </button>
      </div>
    </div>
  );
};
