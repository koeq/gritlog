import { Dispatch, useLayoutEffect } from "react";
import {
  IoCheckmark,
  IoCloseOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { addTraining } from "./add-training";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/input.css";
import { Suggestion } from "./suggestion";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";

interface InputProps {
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;

  readonly setShowInfo: Dispatch<React.SetStateAction<boolean>>;
}

interface ButtonsProps {
  mode: Mode;
  disabled: boolean;
  action: (() => void) | undefined;
  cancel: (() => void) | undefined;
}

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

interface HandleEditParams {
  logout: () => void;
  readonly mode: Mode;
  readonly dispatch: React.Dispatch<Action>;
  readonly currentTraining: Training;
}

export const Input = ({
  setShowInfo,
  textAreaRef,
  currentTraining,
}: InputProps): JSX.Element => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [{ currentInput, mode, inputOpen }, dispatch] = useTopLevelState();

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      autoGrow(textAreaRef.current);
    }
  }, [currentInput, textAreaRef]);

  const autoGrow = (element: HTMLTextAreaElement) => {
    const minHeight = 95;
    // Reset height
    element.style.height = `${minHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  };

  const actionHandler = handleAction(
    mode,
    currentTraining,
    dispatch,
    logout,
    textAreaRef
  );

  const disabled = isDisabled(mode, currentTraining, currentInput);
  const cancelHandler = handleCancel(mode, dispatch);

  return (
    <>
      <div className="input-wrapper">
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

        <Suggestion currentInput={currentInput} textAreaRef={textAreaRef} />
        <div className="bottom-bar-btns">
          <Buttons
            mode={mode}
            disabled={disabled}
            action={actionHandler}
            cancel={cancelHandler}
          />
        </div>
        <div className="info-btn">
          <button
            aria-label="info"
            type="button"
            className="button circle-hover"
            onClick={() => setShowInfo(true)}
          >
            <IoInformationCircleOutline size={17} />
          </button>
        </div>
      </div>
    </>
  );
};

const Buttons = ({ disabled, action, cancel }: ButtonsProps) => (
  <>
    <button
      aria-label="confirmation"
      type="button"
      className={disabled ? "button" : "button circle-hover"}
      disabled={disabled}
      onClick={action}
    >
      <IoCheckmark
        stroke={disabled ? "var(--cta-disabled)" : "var(--cta)"}
        size={28}
      />
    </button>
    <button
      aria-label="cancelation"
      type="button"
      className="button circle-hover"
      onClick={cancel}
    >
      <IoCloseOutline stroke="var(--cta)" size={28} />
    </button>
  </>
);

const isDisabled = (
  mode: Mode,
  currentTraining: Training,
  currentInput: string
) =>
  mode.type === "add"
    ? isEmptyTraining(currentTraining)
    : mode.type === "edit"
    ? currentInput?.trim() === mode.initialInput
    : false;

const handleAction = (
  mode: Mode,
  currentTraining: Training,
  dispatch: React.Dispatch<Action>,
  logout: () => void,
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>
) =>
  mode.type === "add"
    ? () => handleAdd({ currentTraining, dispatch, logout, textAreaRef })
    : mode.type === "edit"
    ? () => handleEdit({ mode, currentTraining, dispatch, logout })
    : undefined;

const handleCancel = (mode: Mode, dispatch: React.Dispatch<Action>) =>
  mode.type === "add"
    ? () => dispatch({ type: "cancel-add" })
    : mode.type === "edit"
    ? () => handleCancelEdit(dispatch)
    : undefined;

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
