import {
  Dispatch,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import "../src/styles/authed-app.css";
import { BottomBar } from "./bottom-bar";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { FormatInfo } from "./format-info";
import { Input } from "./input";
import { LoadingSpinner } from "./loading-spinner";
import { Buttons } from "./main-ctas";
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

const AuthedApp = (): JSX.Element => {
  const [topLevelState, dispatch] = useReducer(reducer, initialState);
  const { trainings, currentInput, inputOpen, mode } = topLevelState;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const lastTrainingId = trainings?.[trainings.length - 1]?.id;
  const nextTrainingsId = lastTrainingId !== undefined ? lastTrainingId + 1 : 0;

  useEffect(() => {
    (async () => {
      const fetchedTrainings = await fetchTrainings();
      dispatch({ type: "set-trainings", trainings: fetchedTrainings });
    })();
  }, []);

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
          mode={mode}
          dispatch={dispatch}
          trainings={trainings}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
        />
      ) : (
        <LoadingSpinner />
      )}

      <Buttons
        dispatch={dispatch}
        trainings={trainings}
        inputOpen={inputOpen}
        textAreaRef={textAreaRef}
        handleSetEditMode={handleSetEditMode}
      />

      <BottomBar inputOpen={inputOpen}>
        <Input
          dispatch={dispatch}
          currentInput={currentInput}
          mode={mode}
          currentTraining={currentTraining}
          textAreaRef={textAreaRef}
          inputOpen={inputOpen}
          setShowInfo={setShowInfo}
        />
      </BottomBar>

      {showInfo && <FormatInfo setShowInfo={setShowInfo} />}

      {mode.type === "delete" && (
        <DeletionConfirmation id={mode.id} dispatch={dispatch} />
      )}
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
