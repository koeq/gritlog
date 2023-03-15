import { Dispatch } from "react";
import {
  IoCheckmark,
  IoCloseOutline,
  IoPencil,
  IoRepeat,
} from "react-icons/io5";
import { addTraining } from "./add-training";
import { HandleSetEditModeParams } from "./authed-app";
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
  readonly lastTrainingId: number | undefined;
  readonly inputOpen: boolean;
  readonly trainings: Training[] | undefined;
  readonly handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

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

const handleCancelEdit = (dispatch: Dispatch<Action>) => {
  dispatch({ type: "cancel-edit" });
};

export const Input = ({
  dispatch,
  currentInput,
  mode,
  currentTraining,
  textAreaRef,
  lastTrainingId,
  handleSetEditMode,
  inputOpen,
  trainings,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

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
            handleAdd({ currentTraining, dispatch, logout, textAreaRef });
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
              onClick={() => handleCancelEdit(dispatch)}
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
                    handleSetEditMode({
                      id: lastTrainingId,
                      trainings,
                      dispatch,
                      textAreaRef,
                    });
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
