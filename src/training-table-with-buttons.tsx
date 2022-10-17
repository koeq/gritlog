import { useRef } from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { SwipeEventData, useSwipeable } from "react-swipeable";
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
  delta: 25,
  preventScrollOnSwipe: true,
};

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  setMode,
}: TrainingTableProps): JSX.Element | null => {
  const trainingWithButtonsRef = useRef<HTMLTableElement>();

  const END = 160;
  let swiped =
    trainingWithButtonsRef.current?.style.transform === "translateX(-160px)";

  const onSwiping = (swipeEvent: SwipeEventData) => {
    if (trainingWithButtonsRef.current) {
      // swipe left
      if (!swiped && swipeEvent.deltaX < 0 && swipeEvent.deltaX >= -160) {
        trainingWithButtonsRef.current.style.transform = `translateX(${swipeEvent.deltaX}px)`;
      }

      // swipe right
      if (swiped && swipeEvent.deltaX > 0 && swipeEvent.deltaX <= 160) {
        trainingWithButtonsRef.current.style.transform = `translateX(${
          -160 + swipeEvent.deltaX
        }px)`;
      }
    }
  };

  const onSwipedLeft = (swipeEvent: SwipeEventData) => {
    if (trainingWithButtonsRef.current) {
      if (!swiped) {
        if (swipeEvent.absX >= END / 2) {
          trainingWithButtonsRef.current.style.transform = `translateX(-${END}px)`;
          swiped = true;
        }
        if (swipeEvent.absX < END / 2) {
          trainingWithButtonsRef.current.style.transform = `translateX(0px)`;
          swiped = false;
        }
      }
    }
  };
  const onSwipedRight = (swipeEvent: SwipeEventData) => {
    if (trainingWithButtonsRef.current) {
      if (swiped) {
        if (swipeEvent.absX >= END / 2) {
          trainingWithButtonsRef.current.style.transform = `translateX(0px)`;
          swiped = false;
        }
        if (swipeEvent.absX < END / 2) {
          trainingWithButtonsRef.current.style.transform = `translateX(-${END}px)`;
          swiped = true;
        }
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft,
    onSwipedRight,
    onSwiping,
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
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="delete"
          className="action-btn-default"
          onClick={() => {
            setMode({ type: "delete", id: training.id });
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
