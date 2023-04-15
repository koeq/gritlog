import { Dispatch, useEffect } from "react";
import {
  IoCheckmark,
  IoCloseOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
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
  readonly setShowInfo: Dispatch<React.SetStateAction<boolean>>;
}

interface AddButtonsProps {
  disabled: boolean;
  add: React.MouseEventHandler<HTMLButtonElement> | undefined;
  cancel: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface EditButtonsProps {
  disabled: boolean;
  edit: React.MouseEventHandler<HTMLButtonElement> | undefined;
  cancel: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

interface HandleEditParams {
  mode: Mode;
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
  setShowInfo,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  useEffect(() => {
    if (textAreaRef.current) {
      autoGrow(textAreaRef.current);
    }
  }, [currentInput]);

  const autoGrow = (element: HTMLTextAreaElement) => {
    const minHeight = 90;
    // Reset height
    element.style.height = `${minHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <>
      <div className="input-wrapper">
        <div className="grow-wrap">
          <textarea
            autoComplete="on"
            placeholder="Squats @80kg 8/8/8"
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
        </div>
        <div className="info-btn">
          <button
            type="button"
            className="button"
            onClick={() => setShowInfo(true)}
          >
            <IoInformationCircleOutline size={17} />
          </button>
        </div>
        <div className="bottom-bar-btns">
          {mode.type === "edit" ? (
            <EditButtons
              disabled={currentInput?.trim() === mode.initialInput}
              edit={() =>
                handleEdit({
                  mode,
                  currentTraining,
                  dispatch,
                  logout,
                })
              }
              cancel={() => handleCancelEdit(dispatch)}
            />
          ) : (
            <AddButtons
              disabled={isEmptyTraining(currentTraining) ? true : false}
              add={() =>
                handleAdd({
                  currentTraining,
                  dispatch,
                  logout,
                  textAreaRef,
                })
              }
              cancel={() => {
                dispatch({ type: "cancel-add" });
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

const AddButtons = ({ disabled, add, cancel }: AddButtonsProps) => (
  <>
    <button type="button" className="button" disabled={disabled} onClick={add}>
      <IoCheckmark
        stroke={disabled ? "var(--cta-disabled)" : "var(--cta)"}
        size={28}
      />
    </button>
    <button type="button" className="button" onClick={cancel}>
      <IoCloseOutline stroke="var(--cta)" size={28} />
    </button>
  </>
);

const EditButtons = ({ disabled, edit, cancel }: EditButtonsProps) => (
  <>
    <button type="button" className="button" disabled={disabled} onClick={edit}>
      <IoCheckmark
        stroke={disabled ? "var(--cta-disabled)" : "var(--cta)"}
        size={28}
      />
    </button>
    <button type="button" className="button" onClick={cancel}>
      <IoCloseOutline size={28} />
    </button>
  </>
);

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
  currentTraining,
  dispatch,
  logout,
}: HandleEditParams) => {
  if (mode.type !== "edit") {
    return;
  }

  const { id, date } = mode;

  editTraining({ ...currentTraining, id, date }, logout);
  dispatch({
    type: "edit",
    currentTraining: { ...currentTraining, date },
    mode,
  });
};

const handleCancelEdit = (dispatch: Dispatch<Action>) => {
  dispatch({ type: "cancel-edit" });
};
