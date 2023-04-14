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
import { Buttons } from "./buttons";
import { useAuth } from "./context";
import { DeletionConfirmation } from "./deletion-confirmation";
import { editTraining } from "./edit-training";
import { fetchTrainings } from "./fetch-trainings";
import { FormatInfo } from "./format-info";
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

// TODO: Remove once dates are transformed for all users
const parseDates = (trainings: Training[], logout: () => void) => {
  for (const training of trainings) {
    const splittedDate = training.date.includes(".")
      ? training.date.split(".")
      : training.date.split("/");

    // format is already updated
    if (splittedDate.length !== 3) {
      continue;
    }

    const parsedDate = `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`;
    const newDateFormat = new Date(parsedDate).toString();

    console.log(training.id, newDateFormat);

    setTimeout(
      () =>
        editTraining(
          {
            ...training,
            date: newDateFormat,
            headline:
              training.headline === undefined ? null : training.headline,
          },
          logout
        ),
      1000 * training.id + 1
    );
  }
};

const AuthedApp = (): JSX.Element => {
  const [topLevelState, dispatch] = useReducer(reducer, initialState);
  const { trainings, currentInput, inputOpen, mode } = topLevelState;
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const { logout } = useAuth();

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const nextTrainingsId =
    trainings && trainings?.length > 0
      ? trainings[trainings.length - 1].id + 1
      : 0;

  useEffect(() => {
    (async () => {
      const fetchedTrainings = await fetchTrainings();
      parseDates(fetchedTrainings, logout);
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
