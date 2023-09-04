import {
  Dispatch,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImInfo } from "react-icons/im";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { addTraining } from "./add-training";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Input } from "./input";
import { parse } from "./parser";
import { Action } from "./state-reducer";
import "./styles/bottom-bar.css";
import { Suggestion } from "./suggestion";
import { CurrentInput, Mode, TrainingWithoutVolume } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";
import { useEscape } from "./utils/use-escape";

const BOTTOM_CTAS_MARGIN = 16;

interface BottomBarProps {
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly setShowFormatInfo: Dispatch<React.SetStateAction<boolean>>;
}

export function BottomBar({
  textAreaRef,
  setShowFormatInfo,
}: BottomBarProps): JSX.Element | null {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const bottomBarRef = useRef(null);
  const bottomCTAsBottomOffset = useBottomCTAsBottomOffset();

  const [{ trainings, currentInput, showBottomBar, mode }, dispatch] =
    useTopLevelState();

  const exercises =
    useMemo(() => parse(currentInput.exercises), [currentInput.exercises]) ||
    [];

  const highestTrainingId =
    trainings && trainings.length
      ? trainings.reduce((prev, curr) => (curr.id > prev.id ? curr : prev)).id
      : -1;

  const currentTraining: TrainingWithoutVolume = {
    headline: currentInput.headline,
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

  const disabled = isDisabled({ mode, currentTraining, currentInput });

  return (
    <footer
      ref={bottomBarRef}
      style={{ height: isMobile ? "calc(100% - 77px)" : "34%" }}
      className={`bottom-bar ${showBottomBar ? "" : "closed"}`}
    >
      <div className="input-btn-container input-top-container">
        <button
          aria-label="info"
          type="button"
          className="button circle-hover btn-info"
          onClick={() => setShowFormatInfo(true)}
        >
          <ImInfo size={15} color="var(--text-off)" />
        </button>
        <h3 id="bottom-bar-headline">{mode.type}</h3>
        <button
          aria-label="cancelation"
          type="button"
          className="btn-cancel"
          onClick={cancelHandler}
        >
          <IoMdClose size={24} />
        </button>
      </div>

      <Input
        textAreaRef={textAreaRef}
        currentInput={currentInput}
        actionHandler={actionHandler}
      />
      <div
        style={{ position: "absolute", bottom: bottomCTAsBottomOffset }}
        className="input-btn-container input-bottom-container"
      >
        <Suggestion currentInput={currentInput} textAreaRef={textAreaRef} />
        <button
          type="button"
          disabled={disabled}
          className="btn-confirm"
          onClick={actionHandler}
          aria-label="confirmation"
          style={{
            color: disabled ? "var(--cta-disabled)" : "var(--text-primary)",
          }}
        >
          {mode.type === "add" ? (
            <IoMdAdd size={24} />
          ) : (
            <IoCheckmarkSharp size={24} />
          )}
        </button>
      </div>
    </footer>
  );
}

interface IsDisabledParams {
  readonly mode: Mode;
  readonly currentInput: CurrentInput;
  readonly currentTraining: TrainingWithoutVolume;
}

const isDisabled = ({
  mode,
  currentInput,
  currentTraining,
}: IsDisabledParams): boolean =>
  mode.type === "add"
    ? isEmptyTraining(currentTraining)
    : mode.type === "edit"
    ? currentInput.exercises?.trim() === mode.initialInput.exercises &&
      currentInput.headline?.trim() === mode.initialInput.headline
    : false;

interface HandleActionParams {
  mode: Mode;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
  currentTraining: TrainingWithoutVolume;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const handleAction = ({
  mode,
  currentTraining,
  dispatch,
  logout,
  textAreaRef,
}: HandleActionParams): (() => void) =>
  mode.type === "add"
    ? () => handleAdd({ currentTraining, dispatch, logout, textAreaRef })
    : mode.type === "edit"
    ? () => handleEdit({ mode, currentTraining, dispatch, logout })
    : () => undefined;

const handleCancel = (mode: Mode, dispatch: React.Dispatch<Action>) =>
  mode.type === "add"
    ? () => dispatch({ type: "cancel-add" })
    : mode.type === "edit"
    ? () => dispatch({ type: "cancel-edit" })
    : () => undefined;

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

const useBottomCTAsBottomOffset = (): number => {
  const isMobile = useIsMobile();
  const changedHeightRef = useRef(false);

  const [bottomCTAsHeight, setBottomCTAsHeight] = useState(BOTTOM_CTAS_MARGIN);

  const resizeHandler = useCallback(() => {
    if (changedHeightRef.current || !visualViewport) {
      return;
    }

    setBottomCTAsHeight(
      window.innerHeight - visualViewport.height + BOTTOM_CTAS_MARGIN
    );

    changedHeightRef.current = true;
  }, []);

  useLayoutEffect(() => {
    if (!isMobile) {
      return;
    }

    visualViewport?.addEventListener("resize", resizeHandler);

    return () => visualViewport?.removeEventListener("resize", resizeHandler);
  }, [resizeHandler, isMobile]);

  return bottomCTAsHeight;
};
