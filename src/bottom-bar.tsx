import { Dispatch, useMemo, useRef } from "react";
import { ImInfo } from "react-icons/im";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { addTraining } from "./add-training";
import { useAuth, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Input } from "./input";
import { parse } from "./parser";
import { Action } from "./state-reducer";
import "./styles/bottom-bar.css";
import { Suggestion } from "./suggestion";
import { Mode, TrainingWithoutVolume } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";
import { useEscape } from "./utils/use-escape";

interface BottomBarProps {
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly setShowFormatInfo: Dispatch<React.SetStateAction<boolean>>;
}

export function BottomBar({
  textAreaRef,
  setShowFormatInfo,
}: BottomBarProps): JSX.Element | null {
  const { logout } = useAuth();
  const bottomBarRef = useRef(null);

  const [{ trainings, currentInput, showBottomBar, mode }, dispatch] =
    useTopLevelState();

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const highestTrainingId =
    trainings && trainings.length
      ? trainings.reduce((prev, curr) => (curr.id > prev.id ? curr : prev)).id
      : -1;

  const currentTraining: TrainingWithoutVolume = {
    headline,
    exercises,
    id: mode.type === "edit" ? mode.id : highestTrainingId + 1,
    date: new Date().toString(),
  };

  const cancelHandler = handleCancel(mode, dispatch);
  useEscape(bottomBarRef, cancelHandler);

  const actionHandler = handleAction({
    mode,
    logout,
    dispatch,
    textAreaRef,
    currentTraining,
  });

  const disabled = isDisabled(mode, currentTraining, currentInput);

  return (
    <footer
      ref={bottomBarRef}
      className={`bottom-bar ${showBottomBar ? "" : "closed"}`}
    >
      <div className="input-btn-container input-top-container">
        <button
          aria-label="info"
          type="button"
          className="button circle-hover btn-info"
          onClick={() => setShowFormatInfo(true)}
        >
          <ImInfo size={14} color="var(--text-off)" />
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
  currentTraining: TrainingWithoutVolume,
  currentInput: string
): boolean =>
  mode.type === "add"
    ? isEmptyTraining(currentTraining)
    : mode.type === "edit"
    ? currentInput?.trim() === mode.initialInput
    : false;

interface HandleActionParams {
  mode: Mode;
  logout: () => void;
  currentTraining: TrainingWithoutVolume;
  dispatch: React.Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const handleAction = ({
  mode,
  currentTraining,
  dispatch,
  logout,
  textAreaRef,
}: HandleActionParams): (() => void) | undefined =>
  mode.type === "add"
    ? () => handleAdd({ currentTraining, dispatch, logout, textAreaRef })
    : mode.type === "edit"
    ? () => handleEdit({ mode, currentTraining, dispatch, logout })
    : undefined;

const handleCancel = (mode: Mode, dispatch: React.Dispatch<Action>) =>
  mode.type === "add"
    ? () => dispatch({ type: "cancel-add" })
    : () => dispatch({ type: "cancel-edit" });

interface HandleAddParams {
  logout: () => void;
  currentTraining: TrainingWithoutVolume;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
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
  readonly currentTraining: TrainingWithoutVolume;
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
