import { Dispatch } from "react";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";
import { addTraining } from "./add-training";
import { useAuth, useIsMobile } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/input.css";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";

interface InputProps {
  readonly dispatch: React.Dispatch<Action>;
  readonly currentInput: string;
  readonly mode: Mode;
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly inputOpen: boolean;
}

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

interface HandleEditParams {
  mode: Mode;
  currentInput: string;
  dispatch: Dispatch<Action>;
  currentTraining: Training;
  logout: () => void;
}

export const Input = ({
  dispatch,
  currentInput,
  mode,
  currentTraining,
  textAreaRef,
  inputOpen,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  return (
    <>
      <textarea
        placeholder="Squats 80kg 8/8/8"
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
            handleAdd({ currentTraining, dispatch, logout, textAreaRef });
          }
        }}
      ></textarea>

      <div className="bottom-bar-btns">
        {mode.type === "edit" ? (
          <>
            <button
              type="button"
              className="button"
              onClick={() =>
                handleEdit({
                  mode,
                  currentInput,
                  currentTraining,
                  dispatch,
                  logout,
                })
              }
            >
              <IoCheckmark size={28} />
            </button>

            <button
              type="button"
              id="cancel"
              className="button"
              onClick={() => handleCancelEdit(dispatch)}
            >
              <IoCloseOutline size={28} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="button"
              disabled={isEmptyTraining(currentTraining) ? true : false}
              onClick={() =>
                handleAdd({
                  currentTraining,
                  dispatch,
                  logout,
                  textAreaRef,
                })
              }
            >
              <IoCheckmark
                stroke={
                  isEmptyTraining(currentTraining)
                    ? "var(--cta-disabled)"
                    : "var(--cta)"
                }
                size={28}
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
              <IoCloseOutline stroke="var(--cta)" size={28} />
            </button>
          </>
        )}
      </div>
    </>
  );
};

const handleAdd = ({
  currentTraining,
  logout,
  dispatch,
  textAreaRef,
}: HandleAddParams) => {
  if (isEmptyTraining(currentTraining)) {
    return;
  }

  addTraining(currentTraining, logout);
  dispatch({ type: "add", currentTraining });
  textAreaRef.current?.blur();
};

const handleEdit = ({
  mode,
  currentInput,
  currentTraining,
  dispatch,
  logout,
}: HandleEditParams) => {
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

const handleCancelEdit = (dispatch: Dispatch<Action>) => {
  dispatch({ type: "cancel-edit" });
};
