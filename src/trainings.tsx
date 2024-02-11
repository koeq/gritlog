import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import "../src/styles/authed-app.css";
import { AddFirstTraining } from "./add-first-training";
import { BottomBar } from "./bottom-bar";
import { useTopLevelState } from "./context";
import { DeletionDialog } from "./deletion-dialog";
import { filterTrainings } from "./filter-trainings";
import { InputSection } from "./input-section";
import { InputSectionLayer } from "./input-section-layer";
import { Layer } from "./layer";
import { serializeExercises } from "./serialize-exercises";
import { MemoizedTrainingList } from "./training-list";
import { Training } from "./types";

interface TrainingsSectionProps {
  readonly menuOpen: boolean;
  readonly trainings: Training[];
  readonly setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const Trainings = ({
  menuOpen,
  trainings,
  setMenuOpen,
}: TrainingsSectionProps): JSX.Element => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [{ mode, searchTerm, showInputSection }, dispatch] = useTopLevelState();

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
          dispatch={dispatch}
          searchTerm={searchTerm}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
          trainings={filterTrainings(searchTerm, trainings)}
        />
      )}

      {/* <AddEditCTAs
        textAreaRef={textAreaRef}
        handleSetEditMode={handleSetEditMode}
      /> */}

      <BottomBar
        textAreaRef={textAreaRef}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      {mode.type === "delete" && (
        <Layer>
          <DeletionDialog id={mode.id} />
        </Layer>
      )}

      {showInputSection && <InputSectionLayer />}
      <InputSection textAreaRef={textAreaRef} />
    </>
  );
};
