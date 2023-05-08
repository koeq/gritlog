import { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import "../src/styles/authed-app.css";
import { BottomBar } from "./bottom-bar";
import { useTopLevelState } from "./context";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { FormatInfo } from "./format-info";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { Buttons } from "./main-ctas";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { Action } from "./state-reducer";
import { MemoizedTrainings } from "./trainings";
import { Training } from "./types";

export interface HandleSetEditModeParams {
  id: number | undefined;
  trainings: Training[] | undefined;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const AuthedApp = (): JSX.Element => {
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const [topLevelState, dispatch] = useTopLevelState();
  const { trainings, currentInput, mode } = topLevelState;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const lastTrainingId = trainings?.[trainings.length - 1]?.id;
  const nextTrainingsId = lastTrainingId !== undefined ? lastTrainingId + 1 : 0;

  useEffect(() => {
    (async () => {
      const fetchedTrainings = await fetchTrainings();
      dispatch({ type: "set-trainings", trainings: fetchedTrainings });
    })();
  }, [dispatch]);

  const currentTraining: Training = {
    headline,
    date: new Date().toString(),
    id: nextTrainingsId,
    exercises: exercises,
  };

  return (
    <div className="authed">
      {trainings ? (
        <MemoizedTrainings
          trainings={trainings}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <Buttons
        textAreaRef={textAreaRef}
        handleSetEditMode={handleSetEditMode}
      />

      <BottomBar>
        <Input
          currentTraining={currentTraining}
          textAreaRef={textAreaRef}
          setShowInfo={setShowFormatInfo}
        />
      </BottomBar>

      {showFormatInfo && <FormatInfo setShowInfo={setShowFormatInfo} />}

      {mode.type === "delete" && <DeletionConfirmation id={mode.id} />}
    </div>
  );
};

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
    date: training.date,
  });

  textAreaRef.current?.focus();
};

export default AuthedApp;
