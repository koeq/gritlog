import { MutableRefObject } from "react";
import "../src/styles/authed-app.css";
import { AddFirstTraining } from "./add-first-training";
import { useTopLevelState } from "./context";
import { DeletionDialog } from "./deletion-dialog";
import { filterTrainings } from "./filter-trainings";
import { InputSection } from "./input-section";
import { InputSectionLayer } from "./input-section-layer";
import { Layer } from "./layer";
import { SearchBox } from "./search-box";
import { MemoizedTrainingList } from "./training-list";
import { Training } from "./types";

interface TrainingsSectionProps {
  readonly trainings: Training[];
  readonly textAreaRef: MutableRefObject<HTMLTextAreaElement | null>;
  readonly handleSetEditMode: (id: number) => void;
}

export const Trainings = ({
  trainings,
  textAreaRef,
  handleSetEditMode,
}: TrainingsSectionProps): JSX.Element => {
  const [{ mode, searchTerm, showInputSection, searchActive }, dispatch] =
    useTopLevelState();

  return (
    <>
      {trainings.length === 0 ? (
        <AddFirstTraining />
      ) : (
        <>
          <SearchBox />
          <MemoizedTrainingList
            dispatch={dispatch}
            searchTerm={searchTerm}
            searchActive={searchActive}
            textAreaRef={textAreaRef}
            handleSetEditMode={handleSetEditMode}
            trainings={filterTrainings(searchTerm, trainings)}
          />
        </>
      )}

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
