import { Deletion } from "./authed-app";
import "./styles/deletion-confirmation.css";

interface DeletionConfirmationProps {
  readonly setDeletion: (
    value: Deletion | ((val: Deletion) => Deletion)
  ) => void;
  readonly handleDelete: (id: number) => void;
  readonly id: number | undefined;
}

export const DeletionConfirmation = ({
  setDeletion,
  handleDelete,
  id,
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

        <button
          className="dialog-btn"
          onClick={() => {
            handleDelete(id);
            setDeletion({ deleting: false, id: undefined });
          }}
        >
          yes
        </button>
        <br />
        <button
          className="dialog-btn"
          onClick={() => setDeletion({ deleting: false, id: undefined })}
        >
          no
        </button>
      </div>
    </div>
  );
};
