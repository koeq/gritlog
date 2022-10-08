import { Training } from "../db-handler/types";
import { useSwipeable } from "react-swipeable";
import { useRef } from "react";
import { TrainingTable } from "./training-table";
import "./styles/training-table-with-buttons.css";

interface TrainingTableProps {
  readonly training: Training;
  readonly handleEdit: (id: number) => void;
  readonly handleDelete: (id: number) => void;
}

export const TrainingTableWithButtons = ({
  training,
  handleEdit,
  handleDelete,
}: TrainingTableProps): JSX.Element | null => {
  const tableRef = useRef<HTMLTableElement>();

  const swipeConfig = {
    delta: 10,
    preventScrollOnSwipe: true,
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      console.log("User Swipep left!", eventData);
      if (tableRef.current) {
        tableRef.current.classList.add("swiped");
      }
    },
    onSwipedRight: (eventData) => {
      console.log("User Swipep left!", eventData);
      if (tableRef.current) {
        tableRef.current.classList.remove("swiped");
      }
    },
    ...swipeConfig,
  });

  const refPassthrough = (el: HTMLTableElement) => {
    // call useSwipeable ref prop with el
    swipeHandlers.ref(el);
    // set myRef el so you can access it yourself
    tableRef.current = el;
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
          className="btn-blue btn-right"
          onClick={() => handleEdit(training.id)}
        >
          edit
        </button>
        <button className="btn-red" onClick={() => handleDelete(training.id)}>
          x
        </button>
      </div>
    </div>
  );
};
