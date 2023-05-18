import { IoMdAdd } from "react-icons/io";
import { IoPencilSharp } from "react-icons/io5";
import { HandleSetEditModeParams } from "./authed-app";
import { useTopLevelState } from "./context";
import "../src/styles/main-ctas.css";

interface ButtonsProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

export const Buttons = ({
  textAreaRef,
  handleSetEditMode,
}: ButtonsProps): JSX.Element => {
  const [{ trainings, inputOpen }, dispatch] = useTopLevelState();
  const latestTrainingId = trainings?.[0]?.id;

  return (
    <div className={inputOpen ? "btns btns-input-open" : "btns"}>
      <>
        <button
          aria-label="add"
          className="btn-round top"
          disabled={inputOpen}
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
          disabled={latestTrainingId === undefined || inputOpen ? true : false}
          onClick={() => {
            handleSetEditMode({
              id: latestTrainingId,
              trainings,
              dispatch,
              textAreaRef,
            });
          }}
        >
          <IoPencilSharp color="#fff" strokeWidth={3} size={19} />
        </button>
      </>
    </div>
  );
};
