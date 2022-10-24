import { useRef } from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { SwipeCallback, SwipeEventData, useSwipeable } from "react-swipeable";
import { Training } from "../db-handler/types";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Mode } from "./types";

interface TrainingTableProps {
  readonly training: Training;
  readonly handleSetEditMode: (id: number) => void;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
}

export interface SwipeHandlers {
  onSwiping: SwipeCallback;
  onSwiped: SwipeCallback;
}

export interface SwipeHelpers {
  toggleSwipe: () => void;
}

const swipeConfig = {
  delta: 40,
};

const createSwipeHandlers = (
  trainingWithButtonsRef: React.MutableRefObject<HTMLTableElement | undefined>
): SwipeHandlers & SwipeHelpers => {
  const END = 160;

  let swiped =
    trainingWithButtonsRef.current?.style.transform === `translateX(-${END}px)`;

  const swipeOpen = () => {
    if (!trainingWithButtonsRef.current) return;

    trainingWithButtonsRef.current.style.transform = `translateX(-${END}px)`;
    swiped = true;
  };

  const swipeClose = () => {
    if (!trainingWithButtonsRef.current) return;

    trainingWithButtonsRef.current.style.transform = `translateX(0px)`;
    swiped = false;
  };

  const toggleSwipe = () => {
    if (!trainingWithButtonsRef.current) return;

    if (swiped) {
      swipeClose();
    } else {
      swipeOpen();
    }
  };

  const onSwiping = (swipeEvent: SwipeEventData) => {
    if (!trainingWithButtonsRef.current) return;

    // swipe left
    if (!swiped && swipeEvent.deltaX < 0 && swipeEvent.deltaX >= -END) {
      trainingWithButtonsRef.current.style.transform = `translateX(${swipeEvent.deltaX}px)`;
    }

    // swipe right
    if (swiped && swipeEvent.deltaX > 0 && swipeEvent.deltaX <= END) {
      trainingWithButtonsRef.current.style.transform = `translateX(${
        -END + swipeEvent.deltaX
      }px)`;
    }
  };

  const onSwiped = (swipeEvent: SwipeEventData) => {
    if (!trainingWithButtonsRef.current) return;

    const threshold = END / 2;

    if (!swiped && swipeEvent.deltaX <= -threshold) {
      swipeOpen();
    }

    if (!swiped && swipeEvent.deltaX >= -threshold) {
      swipeClose();
    }

    if (swiped && swipeEvent.deltaX >= threshold) {
      swipeClose();
    }

    if (swiped && swipeEvent.deltaX < threshold) {
      swipeOpen();
    }
  };

  return {
    onSwiping,
    onSwiped,
    toggleSwipe,
  };
};

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  setMode,
}: TrainingTableProps): JSX.Element | null => {
  const trainingWithButtonsRef = useRef<HTMLTableElement>();

  const swipeActions = createSwipeHandlers(trainingWithButtonsRef);
  const { onSwiping, onSwiped, toggleSwipe } = swipeActions;

  const swipeHandlers = useSwipeable({
    onSwiping,
    onSwiped,
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
      <TrainingTable training={training} swipeActions={swipeActions} />
      <div className="buttons-container">
        <button
          id="edit"
          className="action-btn-default"
          onClick={() => {
            handleSetEditMode(training.id);
            toggleSwipe();
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="delete"
          className="action-btn-default"
          onClick={() => {
            setMode({ type: "delete", id: training.id });
            toggleSwipe();
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
