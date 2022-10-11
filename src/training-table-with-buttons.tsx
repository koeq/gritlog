import { Training } from "../db-handler/types";
import { useSwipeable } from "react-swipeable";
import { useRef } from "react";
import { TrainingTable } from "./training-table";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { Deletion } from "./authed-app";
import "./styles/training-table-with-buttons.css";

interface TrainingTableProps {
  readonly training: Training;
  readonly handleEdit: (id: number) => void;
  readonly setDeletion: (
    value: Deletion | ((val: Deletion) => Deletion)
  ) => void;
}

const swipeConfig = {
  delta: 5,
  preventScrollOnSwipe: true,
};

export const TrainingTableWithButtons = ({
  training,
  handleEdit,
  setDeletion,
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
          id="btn-edit"
          className="btn-blue action-btn-default"
          onClick={() => {
            handleEdit(training.id);
            onSwipedRight();
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="btn-delete"
          className="btn-red action-btn-default"
          onClick={() => {
            setDeletion({ deleting: true, id: training.id });
            onSwipedRight();
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
