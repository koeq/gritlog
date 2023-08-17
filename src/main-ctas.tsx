import { IoMdAdd } from "react-icons/io";
import { IoPencilSharp } from "react-icons/io5";
import "../src/styles/main-ctas.css";
import { useTopLevelState } from "./context";

interface ButtonsProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  handleSetEditMode: (id: number) => void;
}

export const Buttons = ({
  textAreaRef,
  handleSetEditMode,
}: ButtonsProps): JSX.Element => {
  const [{ trainings, showBottomBar }, dispatch] = useTopLevelState();
  const latestTrainingId = trainings[0]?.id;

  return (
    <div className={showBottomBar ? "btns btns-input-open" : "btns"}>
      <>
        <button
          aria-label="add"
          className="btn-round top"
          disabled={showBottomBar}
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
            latestTrainingId === undefined || showBottomBar ? true : false
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
