import { memo } from "react";
import { HandleSetEditModeParams } from "./authed-app";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Training } from "./types";

interface TrainingsProps {
  readonly trainings: Training[];
  readonly dispatch: React.Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;

  readonly handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

export const Trainings = ({
  dispatch,
  trainings,
  textAreaRef,
  handleSetEditMode,
}: TrainingsProps): JSX.Element | null => {
  if (trainings.length === 0) {
    return null;
  }

  console.log("trainings render");

  return (
    <section className="trainings">
      {trainings
        .map((training) => (
          <TrainingTableWithButtons
            key={training.id}
            dispatch={dispatch}
            training={training}
            handleSetEditMode={() =>
              handleSetEditMode({
                id: training.id,
                trainings,
                dispatch,
                textAreaRef,
              })
            }
          />
        ))
        .reverse()}
    </section>
  );
};

export const MemoizedTrainings = memo(Trainings);
