import { IoMdAdd } from "react-icons/io";
import { IoPencilSharp } from "react-icons/io5";
import "../src/styles/add-edit-ctas.css";
import { useTopLevelState } from "./context";

interface AddEditCTAsProps {
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly handleSetEditMode: (id: number) => void;
}

export const AddEditCTAs = ({
  textAreaRef,
  handleSetEditMode,
}: AddEditCTAsProps): JSX.Element => {
  const [{ trainings, showInputSection }, dispatch] = useTopLevelState();
  const latestTrainingId = trainings[0]?.id;

  return (
    <div className={showInputSection ? "btns btns-input-open" : "btns"}>
      <>
        <button
          aria-label="add"
          className="btn-round top"
          disabled={showInputSection}
          type="button"
          onClick={() => {
            dispatch({ type: "open-input" });
            textAreaRef.current?.focus();
          }}
        >
          <IoMdAdd color="#fff" size={24} strokeWidth={10} />
        </button>
        <button
          aria-label="edit"
          className={`btn-round ${
            trainings && latestTrainingId === undefined ? "btn-disabled" : ""
          }`}
          type="button"
          disabled={
            latestTrainingId === undefined || showInputSection ? true : false
          }
          onClick={
            latestTrainingId !== undefined
              ? () => handleSetEditMode(latestTrainingId)
              : undefined
          }
        >
          <IoPencilSharp color="#fff" strokeWidth={3} size={19} />
        </button>
      </>
    </div>
  );
};
