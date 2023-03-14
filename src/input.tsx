import {
  IoCheckmark,
  IoCloseOutline,
  IoPencil,
  IoRepeat,
} from "react-icons/io5";
import { useAuth, useIsMobile } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/input.css";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/training-has-content";

interface InputProps {
  readonly dispatch: React.Dispatch<Action>;
  readonly currentInput: string;
  readonly handleAdd: (currentTraining: Training) => void;
  readonly mode: Mode;
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly lastTrainingId: number | undefined;
  readonly handleSetEditMode: (id: number | undefined) => void;
  readonly inputOpen: boolean;
}

export const Input = ({
  dispatch,
  currentInput,
  handleAdd,
  mode,
  currentTraining,
  textAreaRef,
  lastTrainingId,
  handleSetEditMode,
  inputOpen,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const handleCancelEdit = () => {
    dispatch({ type: "cancel-edit" });
  };

  const handleEdit = () => {
    if (mode.type !== "edit") {
      return;
    }

    const { id, initialInput } = mode;

    // Only edit if training changed
    if (currentInput?.trim() === initialInput) {
      return;
    }

    editTraining({ ...currentTraining, id }, logout);
    dispatch({ type: "edit", currentTraining, mode });
  };

  return (
    <>
      <textarea
        placeholder=" >"
        onChange={(event) =>
          dispatch({
            type: "set-input",
            currentInput: event.currentTarget.value,
          })
        }
        value={currentInput}
        name="training"
        id="training"
        className={inputOpen ? "open" : "close"}
        ref={textAreaRef}
        tabIndex={inputOpen ? undefined : -1}
        onKeyDown={(e) => {
          if (isMobile) {
            return;
          }

          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd(currentTraining);
          }
        }}
      ></textarea>

      <div className="buttons">
        {mode.type === "edit" ? (
          <>
            <button type="button" className="button" onClick={handleEdit}>
              <IoCheckmark size={32} />
            </button>

            <button
              type="button"
              id="cancel"
              className="button"
              onClick={handleCancelEdit}
            >
              <IoCloseOutline size={32} />
            </button>
          </>
        ) : (
          <>
            {inputOpen ? (
              <>
                <button
                  type="button"
                  className="button"
                  disabled={isEmptyTraining(currentTraining) ? true : false}
                  onClick={() => handleAdd(currentTraining)}
                >
                  <IoCheckmark
                    stroke={
                      isEmptyTraining(currentTraining)
                        ? "var(--cta-disabled)"
                        : "var(--cta)"
                    }
                    size={32}
                  />
                </button>
                <button
                  type="button"
                  id="cancel"
                  className="button"
                  onClick={() => {
                    dispatch({ type: "cancel-add" });
                  }}
                >
                  <IoCloseOutline stroke="var(--cta)" size={32} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    dispatch({ type: "open-input" });
                    textAreaRef.current?.focus();
                  }}
                >
                  <IoPencil stroke="var(--cta)" size={25} />
                </button>
                <button
                  type="button"
                  id="edit-last"
                  className="button"
                  disabled={lastTrainingId === undefined ? true : false}
                  onClick={() => {
                    handleSetEditMode(lastTrainingId);
                  }}
                >
                  <IoRepeat
                    stroke={
                      lastTrainingId === undefined
                        ? "var(--cta-disabled)"
                        : "var(--cta)"
                    }
                    size={32}
                  />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
