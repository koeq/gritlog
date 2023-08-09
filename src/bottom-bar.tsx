import { Dispatch } from "react";
import { ImInfo } from "react-icons/im";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { addTraining } from "./add-training";
import { useAuth, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Input } from "./input";
import { Action } from "./state-reducer";
import "./styles/bottom-bar.css";
import { Suggestion } from "./suggestion";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";
import { useAnimatedMount } from "./utils/use-animate-mount";

interface BottomBarProps {
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly setShowFormatInfo: Dispatch<React.SetStateAction<boolean>>;
}

export function BottomBar({
  currentTraining,
  textAreaRef,
  setShowFormatInfo,
}: BottomBarProps): JSX.Element | null {
  const { logout } = useAuth();
  const [{ currentInput, showBottomBar, mode }, dispatch] = useTopLevelState();
  const { isActive, shouldBeMounted } = useAnimatedMount(showBottomBar);

  const actionHandler = handleAction(
    mode,
    currentTraining,
    dispatch,
    logout,
    textAreaRef
  );

  const disabled = isDisabled(mode, currentTraining, currentInput);
  const cancelHandler = handleCancel(mode, dispatch);

  if (!shouldBeMounted) {
    return null;
  }

  return (
    <footer className={`bottom-bar ${isActive ? "" : "closed"}`}>
      <div className="input-btn-container input-top-container">
        <button
          aria-label="info"
          type="button"
          className="button circle-hover btn-info"
          onClick={() => setShowFormatInfo(true)}
        >
          <ImInfo size={14} color="var(--cta-disabled)" />
        </button>
        <button
          aria-label="cancelation"
          type="button"
          className="btn-cancel"
          onClick={cancelHandler}
        >
          <IoMdClose size={22} />
        </button>
      </div>

      <Input
        currentTraining={currentTraining}
        textAreaRef={textAreaRef}
        setShowInfo={setShowFormatInfo}
      />
      <div className="input-btn-container input-bottom-container">
        <Suggestion currentInput={currentInput} textAreaRef={textAreaRef} />
        <button
          className="btn-confirm"
          aria-label="confirmation"
          type="button"
          disabled={disabled}
          onClick={actionHandler}
          style={{
            color: disabled ? "var(--cta-disabled)" : "var(--text-primary)",
          }}
        >
          {mode.type === "add" ? (
            <IoMdAdd size={21} />
          ) : (
            <IoCheckmarkSharp size={21} />
          )}
        </button>
      </div>
    </footer>
  );
}

const isDisabled = (
  mode: Mode,
  currentTraining: Training,
  currentInput: string
): boolean =>
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
): (() => void) | undefined =>
  mode.type === "add"
    ? () => handleAdd({ currentTraining, dispatch, logout, textAreaRef })
    : mode.type === "edit"
    ? () => handleEdit({ mode, currentTraining, dispatch, logout })
    : undefined;

const handleCancel = (mode: Mode, dispatch: React.Dispatch<Action>) =>
  mode.type === "add"
    ? () => dispatch({ type: "cancel-add" })
    : mode.type === "edit"
    ? () => dispatch({ type: "cancel-edit" })
    : undefined;

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

export const handleAdd = ({
  currentTraining,
  logout,
  dispatch,
  textAreaRef,
}: HandleAddParams): void => {
  if (isEmptyTraining(currentTraining)) {
    return;
  }

  addTraining(currentTraining, logout);
  dispatch({ type: "add", currentTraining });
  textAreaRef.current?.blur();
};

interface HandleEditParams {
  logout: () => void;
  readonly mode: Mode;
  readonly dispatch: React.Dispatch<Action>;
  readonly currentTraining: Training;
}

const handleEdit = ({
  mode,
  currentTraining,
  dispatch,
  logout,
}: HandleEditParams): void => {
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
