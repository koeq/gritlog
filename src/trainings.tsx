import { useCallback, useRef, useState } from "react";
import "../src/styles/authed-app.css";
import { AddEditCTAs } from "./add-edit-ctas";
import { AddFirstTraining } from "./add-first-training";
import { BottomBar } from "./bottom-bar";
import { BottomBarLayer } from "./bottom-bar-layer";
import { useTopLevelState } from "./context";
import { DeletionDialog } from "./deletion-dialog";
import { filterTrainings } from "./filter-trainings";
import { FormatInfo } from "./format-info";
import { Layer } from "./layer";
import { serializeExercises } from "./serialize-exercises";
import { MemoizedTrainingList } from "./training-list";
import { Training } from "./types";

interface TrainingsSectionProps {
  readonly trainings: Training[];
}

export const Trainings = ({
  trainings,
}: TrainingsSectionProps): JSX.Element => {
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [{ mode, showBottomBar, searchTerm }, dispatch] = useTopLevelState();

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
        serializedExercises: serializeExercises(training),
      });

      textAreaRef.current?.focus();
    },
    [trainings, dispatch]
  );

  return (
    <>
      {trainings.length === 0 ? (
        <AddFirstTraining />
      ) : (
        <MemoizedTrainingList
          mode={mode}
          dispatch={dispatch}
          searchTerm={searchTerm}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
          trainings={filterTrainings(searchTerm, trainings)}
        />
      )}

      <AddEditCTAs
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

      {showBottomBar && !showFormatInfo && <BottomBarLayer />}
      <BottomBar
        textAreaRef={textAreaRef}
        setShowFormatInfo={setShowFormatInfo}
      />
    </>
  );
};
