import { Dispatch } from "react";
import { IoAdd, IoRepeat } from "react-icons/io5";
import "../src/styles/buttons.css";
import { HandleSetEditModeParams } from "./authed-app";
import { Action } from "./state-reducer";
import { Training } from "./types";

interface ButtonsProps {
  dispatch: Dispatch<Action>;
  trainings: Training[] | undefined;
  inputOpen: boolean;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

export const Buttons = ({
  dispatch,
  trainings,
  inputOpen,
  textAreaRef,
  handleSetEditMode,
}: ButtonsProps): JSX.Element => {
  const lastTrainingId =
    trainings && trainings.length > 0
      ? trainings[trainings.length - 1].id
      : undefined;

  return (
    <div className="btns">
      <>
        <button
          className="btn-round top"
          disabled={inputOpen}
          type="button"
          onClick={() => {
            dispatch({ type: "open-input" });
            textAreaRef.current?.focus();
          }}
        >
          <IoAdd
            stroke={inputOpen ? "var(--cta-disabled)" : "var(--cta)"}
            size={28}
          />
        </button>
        <button
          className="btn-round"
          type="button"
          disabled={lastTrainingId === undefined || inputOpen ? true : false}
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
            size={28}
          />
        </button>
      </>
    </div>
  );
};
