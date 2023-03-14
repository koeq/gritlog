import { useCallback, useEffect, useReducer, useRef } from "react";
import "../src/styles/authed-app.css";
import { addTraining } from "./add-training";
import { BottomBar } from "./bottom-bar";
import { useAuth } from "./context";
import { deleteTraining } from "./delete-training";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { Header } from "./header";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { initialState, reducer } from "./state-reducer";
import { MemoizedTrainings } from "./trainings";
import { Training } from "./types";
import { isEmptyTraining } from "./utils/training-has-content";

const AuthedApp = (): JSX.Element => {
  const [topLevelState, dispatch] = useReducer(reducer, initialState);
  const { trainings, currentInput, inputOpen, mode } = topLevelState;
  const lastTrainingId = trainings && trainings[trainings.length - 1].id;
  const nextTrainingId = lastTrainingId === undefined ? 0 : lastTrainingId + 1;
  //TODO: should probably be memoized
  const { headline = null, exercises = [] } = parse(currentInput) || {};
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { logout } = useAuth();

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

  const handleAdd = (currentTraining: Training) => {
    if (isEmptyTraining(currentTraining)) {
      return;
    }

    addTraining(currentTraining, logout);
    dispatch({ type: "add", currentTraining });
    textAreaRef.current?.blur();
  };

  const handleSetEditMode = useCallback(
    (id: number | undefined) => {
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
    },
    [trainings, textAreaRef, dispatch]
  );

  const handleDelete = (id: number) => {
    deleteTraining(id, logout);
    dispatch({ type: "delete", id });
  };

  return (
    <div className="authed">
      <Header authed />

      {trainings ? (
        <MemoizedTrainings
          dispatch={dispatch}
          trainings={trainings}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <BottomBar>
        <Input
          dispatch={dispatch}
          currentInput={currentInput}
          handleAdd={handleAdd}
          mode={mode}
          currentTraining={currentTraining}
          textAreaRef={textAreaRef}
          lastTrainingId={lastTrainingId}
          handleSetEditMode={handleSetEditMode}
          inputOpen={inputOpen}
        />
      </BottomBar>

      {mode.type === "delete" && (
        <DeletionConfirmation
          id={mode.id}
          dispatch={dispatch}
          nextTrainingId={nextTrainingId}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AuthedApp;
