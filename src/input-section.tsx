import { Dispatch, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { GoInfo } from "react-icons/go";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { addTraining } from "./add-training";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { FormatInfo } from "./format-info";
import { Input } from "./input";
import { parse } from "./parser";
import { Action } from "./state-reducer";
import "./styles/input-section.css";
import { Suggestion } from "./suggestion";
import { CurrentInput, Mode, TrainingWithoutVolume } from "./types";
import { useCTABarBottomOffset } from "./use-cta-bar-bottom-offset";
import { isEmptyTraining } from "./utils/is-empty-training";
import { useEscape } from "./utils/use-escape";

interface InputSectionProps {
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export function InputSection({
  textAreaRef,
}: InputSectionProps): JSX.Element | null {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const inputSectionRef = useRef(null);
  const ctaBarRef = useRef<HTMLDivElement>(null);

  const [{ mode, trainings, currentInput, showInputSection }, dispatch] =
    useTopLevelState();

  const [showInfo, setShowInfo] = useState(false);
  const ctaBarBottomOffset = useCTABarBottomOffset(showInputSection);

  useLayoutEffect(() => {
    if (!ctaBarRef.current) {
      return;
    }

    ctaBarRef.current.style.transform = `translateY(-${ctaBarBottomOffset}px)`;
  }, [ctaBarBottomOffset, showInfo]);

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
  useEscape(inputSectionRef, cancelHandler);

  const actionHandler = handleAction({
    mode,
    logout,
    dispatch,
    textAreaRef,
    currentTraining,
  });

  const disabled = isDisabled({ mode, currentTraining, currentInput });

  return (
    <section
      ref={inputSectionRef}
      style={{ height: isMobile ? "calc(100% - 44px)" : "44%" }}
      className={`input-section ${showInputSection ? "" : "closed"}`}
    >
      <div className="input-btn-container input-top-container">
        <button
          type="button"
          aria-label="show-info-navigation"
          className="button btn-info"
          onClick={() => setShowInfo((showInfo) => !showInfo)}
        >
          {showInfo ? (
            <BsArrowLeft size={20} color="var(--text-primary)" />
          ) : (
            <GoInfo size={20} color="var(--text-primary)" />
          )}
        </button>
        <h3 id="input-section-headline">{mode.type}</h3>
        <button
          aria-label="cancelation"
          type="button"
          className="btn-cancel"
          onClick={cancelHandler}
        >
          <IoMdClose size={26} />
        </button>
      </div>
      {showInfo ? (
        <FormatInfo />
      ) : (
        <>
          <Input
            textAreaRef={textAreaRef}
            currentInput={currentInput}
            actionHandler={actionHandler}
          />

          <div ref={ctaBarRef} className="input-btn-container input-cta-bar">
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
                <IoMdAdd size={28} />
              ) : (
                <IoCheckmarkSharp size={28} />
              )}
            </button>
          </div>
        </>
      )}
    </section>
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
  readonly mode: Mode;
  readonly logout: () => void;
  readonly dispatch: React.Dispatch<Action>;
  readonly currentTraining: TrainingWithoutVolume;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
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
    ? () => handleEdit({ mode, currentTraining, dispatch, logout, textAreaRef })
    : () => undefined;

const handleCancel = (mode: Mode, dispatch: React.Dispatch<Action>) =>
  mode.type === "add"
    ? () => dispatch({ type: "cancel-add" })
    : mode.type === "edit"
    ? () => dispatch({ type: "cancel-edit" })
    : () => undefined;

interface HandleAddParams {
  readonly logout: () => void;
  readonly currentTraining: TrainingWithoutVolume;
  readonly dispatch: Dispatch<Action>;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
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
  readonly logout: () => void;
  readonly mode: Mode;
  readonly dispatch: React.Dispatch<Action>;
  readonly currentTraining: TrainingWithoutVolume;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const handleEdit = ({
  mode,
  logout,
  dispatch,
  textAreaRef,
  currentTraining,
}: HandleEditParams): void => {
  if (mode.type !== "edit") {
    return;
  }

  const { id, date } = mode;
  textAreaRef.current?.blur();

  editTraining({ ...currentTraining, id, date }, logout);

  dispatch({
    type: "edit",
    currentTraining: { ...currentTraining, date },
    mode,
  });
};
