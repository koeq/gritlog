import { Dispatch, useEffect, useMemo, useReducer, useRef } from "react";
import "../src/styles/authed-app.css";
import { BottomBar } from "./bottom-bar";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { Header } from "./header";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { Action, initialState, reducer } from "./state-reducer";
import { MemoizedTrainings } from "./trainings";
import { Training } from "./types";

export interface HandleSetEditModeParams {
  id: number | undefined;
  trainings: Training[] | undefined;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const handleSetEditMode = ({
  id,
  trainings,
  dispatch,
  textAreaRef,
}: HandleSetEditModeParams) => {
  if (id === undefined) {
    return;
  }

  const training = trainings?.find((training) => training.id === id);

  if (!training) {
    return;
  }

  dispatch({
    type: "set-edit-mode",
    id,
    serializedTraining: serializeTraining(training),
  });

  textAreaRef.current?.focus();
};

const AuthedApp = (): JSX.Element => {
  const [topLevelState, dispatch] = useReducer(reducer, initialState);
  const { trainings, currentInput, inputOpen, mode } = topLevelState;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const nextTrainingsId =
    trainings && trainings?.length > 0
      ? trainings[trainings.length - 1].id + 1
      : 0;

  useEffect(() => {
    (async () =>
      dispatch({ type: "set-trainings", trainings: await fetchTrainings() }))();
  }, []);

  const currentTraining: Training = {
    headline,
    date: new Date().toLocaleDateString(),
    id: nextTrainingsId,
    exercises: exercises,
  };

  return (
    <div className="authed">
      <Header authed />

      {trainings ? (
        <MemoizedTrainings
          dispatch={dispatch}
          trainings={trainings}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <BottomBar>
        <Input
          dispatch={dispatch}
          currentInput={currentInput}
          mode={mode}
          currentTraining={currentTraining}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
          inputOpen={inputOpen}
          trainings={trainings}
        />
      </BottomBar>

      {mode.type === "delete" && (
        <DeletionConfirmation id={mode.id} dispatch={dispatch} />
      )}
    </div>
  );
};

export default AuthedApp;
