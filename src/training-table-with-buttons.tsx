import { useRef } from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { useSwipeable } from "react-swipeable";
import { Training } from "../db-handler/types";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Mode } from "./types";

interface TrainingTableProps {
  readonly training: Training;
  readonly handleSetEditMode: (id: number) => void;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
}

const swipeConfig = {
  delta: 5,
  preventScrollOnSwipe: true,
};

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  setMode,
}: TrainingTableProps): JSX.Element | null => {
  const trainingWithButtonsRef = useRef<HTMLTableElement>();

  const onSwipedLeft = () => {
    if (trainingWithButtonsRef.current) {
      trainingWithButtonsRef.current.classList.add("swiped");
    }
  };

  const onSwipedRight = () => {
    if (trainingWithButtonsRef.current) {
      trainingWithButtonsRef.current.classList.remove("swiped");
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft,
    onSwipedRight,
    ...swipeConfig,
  });

  const refPassthrough = (el: HTMLTableElement) => {
    // call useSwipeable ref prop with el
    swipeHandlers.ref(el);
    // set myRef el so you can access it yourself
    trainingWithButtonsRef.current = el;
  };

  return (
    <div
      {...swipeHandlers}
      ref={refPassthrough}
      className="training-with-buttons"
    >
      <TrainingTable training={training} />
      <div className="buttons-container">
        <button
          id="edit"
          className="action-btn-default"
          onClick={() => {
            handleSetEditMode(training.id);
            onSwipedRight();
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="delete"
          className="action-btn-default"
          onClick={() => {
            setMode({ type: "delete", id: training.id });
            onSwipedRight();
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
