import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../src/styles/authed-app.css";
import { AddTrainingCallToAction } from "./add-training-text";
import { BottomBar } from "./bottom-bar";
import { BottomBarLayer } from "./bottom-bar-layer";
import { useTopLevelState } from "./context";
import { DeletionConfirmation } from "./deletion-confirmation";
import { fetchTrainings } from "./fetch-trainings";
import { filterTrainings } from "./filter-trainings";
import { FormatInfo } from "./format-info";
import { Layer } from "./layer";
import { LoadingDots } from "./loading-dots";
import { Buttons } from "./main-ctas";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import { MemoizedTrainings } from "./trainings";
import { Training } from "./types";

const VolumeOverTime = lazy(() => import("./volume-over-time"));

interface AuthedAppProps {
  readonly contentType: "trainings" | "statistics";
}

const AuthedApp = ({ contentType }: AuthedAppProps): JSX.Element => {
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [
    { trainings, currentInput, mode, showBottomBar, searchTerm },
    dispatch,
  ] = useTopLevelState();

  const { headline = null, exercises = [] } =
    useMemo(() => parse(currentInput), [currentInput]) || {};

  const highestTrainingId =
    trainings && trainings.length
      ? trainings.reduce((prev, curr) => (curr.id > prev.id ? curr : prev)).id
      : -1;

  const nextTrainingId = highestTrainingId + 1;

  useEffect(() => {
    (async () => {
      const fetchedTrainings = await fetchTrainings();

      dispatch({
        type: "set-trainings",
        trainings: fetchedTrainings,
      });
    })();
  }, [dispatch]);

  const currentTraining: Training = {
    headline,
    id: nextTrainingId,
    exercises: exercises,
    date: new Date().toString(),
  };

  const handleSetEditMode = useCallback(
    (id: number) => {
      const training = trainings?.find((training) => training.id === id);

      if (!training) {
        return;
      }

      dispatch({
        id,
        date: training.date,
        type: "set-edit-mode",
        serializedTraining: serializeTraining(training),
      });

      textAreaRef.current?.focus();
    },
    [trainings, dispatch]
  );

  if (trainings === undefined) {
    return <LoadingDots />;
  }

  if (contentType === "statistics") {
    return (
      <div className="authed">
        <Suspense fallback={<LoadingDots />}>
          <VolumeOverTime trainings={trainings} />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <div className="authed">
        {trainings.length ? (
          <MemoizedTrainings
            mode={mode}
            dispatch={dispatch}
            searchTerm={searchTerm}
            textAreaRef={textAreaRef}
            handleSetEditMode={handleSetEditMode}
            trainings={filterTrainings(searchTerm, trainings)}
          />
        ) : (
          <AddTrainingCallToAction />
        )}

        <Buttons
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
        />

        {showFormatInfo && (
          <Layer
            clickHandler={() => {
              setShowFormatInfo(false);
              textAreaRef?.current?.focus();
            }}
          >
            <FormatInfo />
          </Layer>
        )}

        {mode.type === "delete" && (
          <Layer>
            <DeletionConfirmation id={mode.id} />
          </Layer>
        )}
      </div>
      {showBottomBar && !showFormatInfo && <BottomBarLayer />}
      <BottomBar
        textAreaRef={textAreaRef}
        currentTraining={currentTraining}
        setShowFormatInfo={setShowFormatInfo}
      />
    </>
  );
};

export default AuthedApp;
