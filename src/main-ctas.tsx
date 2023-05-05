import { Dispatch } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoPencilSharp } from "react-icons/io5";
import "../src/styles/main-ctas.css";
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
  const lastTrainingId = trainings?.[trainings.length - 1]?.id;

  return (
    <div className={inputOpen ? "btns btns-input-open" : "btns"}>
      <>
        <button
          className="btn-round top hover-active"
          disabled={inputOpen}
          type="button"
          onClick={() => {
            dispatch({ type: "open-input" });
            textAreaRef.current?.focus();
          }}
        >
          <IoMdAdd size={24} strokeWidth={10} />
        </button>
        <button
          className={`btn-round hover-active ${
            trainings && lastTrainingId === undefined ? "btn-disabled" : ""
          }`}
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
          <IoPencilSharp strokeWidth={3} size={19} />
        </button>
      </>
    </div>
  );
};
