import { IoMdAdd } from "react-icons/io";
import { IoPencilSharp } from "react-icons/io5";
import "../src/styles/main-ctas.css";
import { HandleSetEditModeParams } from "./authed-app";
import { useTopLevelState } from "./context";

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
  const lastTrainingId = trainings?.[trainings.length - 1]?.id;

  return (
    <div className={inputOpen ? "btns btns-input-open" : "btns"}>
      <>
        <button
          className="btn-round top hover-active"
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
          className={`btn-round hover-active ${
            trainings && lastTrainingId === undefined ? "btn-disabled" : ""
          }`}
          type="button"
          disabled={lastTrainingId === undefined || inputOpen ? true : false}
          onClick={() => {
            handleSetEditMode({
              id: lastTrainingId,
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
