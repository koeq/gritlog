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

const swipeConfig = {
  delta: 40,
};

interface SwipeHandlers {
  onSwiping: SwipeCallback;
  onSwipedLeft: SwipeCallback;
  onSwipedRight: SwipeCallback;
}

interface SwipeHelpers {
  swipeOpen: () => void;
  swipeClose: () => void;
}

const createSwipeHandlers = (
  trainingWithButtonsRef: React.MutableRefObject<HTMLTableElement | undefined>
): SwipeHandlers & SwipeHelpers => {
  const END = 160;
  let swiped =
    trainingWithButtonsRef.current?.style.transform === `translateX(-${END}px)`;

  const swipeOpen = () => {
    if (trainingWithButtonsRef.current) {
      trainingWithButtonsRef.current.style.transform = `translateX(-${END}px)`;
      swiped = true;
    }
  };

  const swipeClose = () => {
    if (trainingWithButtonsRef.current) {
      trainingWithButtonsRef.current.style.transform = `translateX(0px)`;
      swiped = false;
    }
  };

  const onSwiping = (swipeEvent: SwipeEventData) => {
    if (trainingWithButtonsRef.current) {
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
    }
  };

  const onSwipedLeft = (swipeEvent: SwipeEventData) => {
    if (trainingWithButtonsRef.current) {
      if (!swiped) {
        if (swipeEvent.absX >= END / 2) {
          swipeOpen();
        }
        if (swipeEvent.absX < END / 2) {
          swipeClose();
        }
      }
    }
  };

  const onSwipedRight = (swipeEvent: SwipeEventData) => {
    if (trainingWithButtonsRef.current) {
      if (swiped) {
        if (swipeEvent.absX >= END / 2) {
          swipeClose();
        }
        if (swipeEvent.absX < END / 2) {
          swipeOpen();
        }
      }
    }
  };

  return { onSwiping, onSwipedLeft, onSwipedRight, swipeOpen, swipeClose };
};

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  setMode,
}: TrainingTableProps): JSX.Element | null => {
  const trainingWithButtonsRef = useRef<HTMLTableElement>();

  const { onSwipedLeft, onSwipedRight, onSwiping, swipeClose } =
    createSwipeHandlers(trainingWithButtonsRef);

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
            swipeClose();
          }}
        >
          <MdModeEdit size={20} />
        </button>
        <button
          id="delete"
          className="action-btn-default"
          onClick={() => {
            setMode({ type: "delete", id: training.id });
            swipeClose();
          }}
        >
          <IoTrashBin size={20} />
        </button>
      </div>
    </div>
  );
};
