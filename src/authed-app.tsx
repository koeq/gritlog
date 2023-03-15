import { Dispatch, useEffect, useReducer, useRef } from "react";
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
  const lastTrainingId = trainings && trainings[trainings.length - 1].id;
  const nextTrainingId = lastTrainingId === undefined ? 0 : lastTrainingId + 1;
  // TODO: should probably be memoized
  const { headline = null, exercises = [] } = parse(currentInput) || {};
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    (async () =>
      dispatch({ type: "set-training", trainings: await fetchTrainings() }))();
  }, []);

  const currentTraining: Training = {
    headline,
    date: new Date().toLocaleDateString(),
    id: nextTrainingId,
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
          lastTrainingId={lastTrainingId}
          handleSetEditMode={handleSetEditMode}
          inputOpen={inputOpen}
          trainings={trainings}
        />
      </BottomBar>

      {mode.type === "delete" && (
        <DeletionConfirmation
          id={mode.id}
          dispatch={dispatch}
          nextTrainingId={nextTrainingId}
        />
      )}
    </div>
  );
};

export default AuthedApp;
