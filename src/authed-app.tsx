import { Suspense, lazy, useCallback, useRef, useState } from "react";
import "../src/styles/authed-app.css";
import { ActivityMatrix } from "./activit-matrix";
import { AddTrainingCallToAction } from "./add-training-text";
import { BottomBar } from "./bottom-bar";
import { BottomBarLayer } from "./bottom-bar-layer";
import { useTopLevelState } from "./context";
import { DeletionDialog } from "./deletion-dialog";
import { filterTrainings } from "./filter-trainings";
import { FormatInfo } from "./format-info";
import { Layer } from "./layer";
import { LoadingDots } from "./loading-dots";
import { Buttons } from "./main-ctas";
import { serializeTraining } from "./serialize-training";
import { MemoizedTrainings } from "./trainings";
import { useFetchTrainings } from "./use-fetch-trainings";

const VolumeOverTime = lazy(() => import("./volume-over-time-chart"));

interface AuthedAppProps {
  readonly contentType: "trainings" | "statistics";
}

const AuthedApp = ({ contentType }: AuthedAppProps): JSX.Element => {
  const [{ trainings, mode, showBottomBar, searchTerm }, dispatch] =
    useTopLevelState();

  const isLoading = useFetchTrainings(dispatch);
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSetEditMode = useCallback(
    (id: number) => {
      const training = trainings.find((training) => training.id === id);

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

  if (isLoading) {
    return <LoadingDots />;
  }

  if (contentType === "statistics" && trainings.length > 0) {
    return (
      <div className="statistics">
        <Suspense fallback={<></>}>
          <VolumeOverTime trainings={trainings} />
          <ActivityMatrix trainings={trainings} />
        </Suspense>
      </div>
    );
  }

  return (
    <>
      <div className="authed">
        {trainings.length === 0 ? (
          <AddTrainingCallToAction />
        ) : (
          <MemoizedTrainings
            mode={mode}
            dispatch={dispatch}
            searchTerm={searchTerm}
            textAreaRef={textAreaRef}
            handleSetEditMode={handleSetEditMode}
            trainings={filterTrainings(searchTerm, trainings)}
          />
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
            <DeletionDialog id={mode.id} />
          </Layer>
        )}
      </div>
      {showBottomBar && !showFormatInfo && <BottomBarLayer />}
      <BottomBar
        textAreaRef={textAreaRef}
        setShowFormatInfo={setShowFormatInfo}
      />
    </>
  );
};

export default AuthedApp;
