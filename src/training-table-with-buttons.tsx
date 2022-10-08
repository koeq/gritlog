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

const swipeConfig = {
  delta: 5,
  preventScrollOnSwipe: true,
};

export const TrainingTableWithButtons = ({
  training,
  handleEdit,
  handleDelete,
}: TrainingTableProps): JSX.Element | null => {
  const tableRef = useRef<HTMLTableElement>();
  const editRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (tableRef.current && editRef.current && deleteRef.current) {
        tableRef.current.classList.add("swiped");
        editRef.current.classList.add("action-btn-swiped");
        deleteRef.current.classList.add("action-btn-swiped");
      }
    },
    onSwipedRight: () => {
      if (tableRef.current && editRef.current && deleteRef.current) {
        tableRef.current.classList.remove("swiped");
        editRef.current.classList.remove("action-btn-swiped");
        deleteRef.current.classList.remove("action-btn-swiped");
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
          ref={editRef}
          className="btn-blue btn-right action-btn-default"
          onClick={() => handleEdit(training.id)}
        >
          edit
        </button>
        <button
          ref={deleteRef}
          className="btn-red action-btn-default"
          onClick={() => handleDelete(training.id)}
        >
          x
        </button>
      </div>
    </div>
  );
};
