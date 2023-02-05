import throttle from "lodash.throttle";
import { useRef, useState } from "react";
import { IoTrashBin } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { SwipeCallback, SwipeEventData, useSwipeable } from "react-swipeable";
import "./styles/training-table-with-buttons.css";
import { TrainingTable } from "./training-table";
import { Mode, Training } from "./types";

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
  swiped: boolean;
}

const swipeConfig = {
  delta: 40,
};

const useSwipeHandlers = (
  trainingWithButtonsRef: React.MutableRefObject<HTMLTableElement | undefined>
): SwipeHandlers & SwipeHelpers => {
  const END = 160;

  const [swiped, setSwiped] = useState(
    trainingWithButtonsRef.current?.style.transform === `translateX(-${END}px)`
  );

  const swipeOpen = () => {
    if (!trainingWithButtonsRef.current) return;

    trainingWithButtonsRef.current.style.transform = `translateX(-${END}px)`;
    setSwiped(true);
  };

  const swipeClose = () => {
    if (!trainingWithButtonsRef.current) return;

    trainingWithButtonsRef.current.style.transform = `translateX(0px)`;
    setSwiped(false);
  };

  const toggleSwipe = () => {
    if (!trainingWithButtonsRef.current) return;

    if (swiped) {
      swipeClose();
    } else {
      swipeOpen();
    }
  };

  const swipe = throttle(
    (swipeEvent: SwipeEventData) => {
      if (!trainingWithButtonsRef?.current) {
        return;
      }

      // Swipe left
      if (!swiped && swipeEvent.deltaX < 0 && swipeEvent.deltaX >= -END) {
        trainingWithButtonsRef.current.style.transform = `translateX(${swipeEvent.deltaX}px)`;
      }

      // Swipe right
      if (swiped && swipeEvent.deltaX > 0 && swipeEvent.deltaX <= END) {
        trainingWithButtonsRef.current.style.transform = `translateX(${
          -END + swipeEvent.deltaX
        }px)`;
      }
    },
    15,
    { leading: true }
  );

  const onSwiping = (swipeEvent: SwipeEventData) => {
    swipe(swipeEvent);
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
    swiped,
  };
};

export const TrainingTableWithButtons = ({
  training,
  handleSetEditMode,
  setMode,
}: TrainingTableProps): JSX.Element | null => {
  const trainingWithButtonsRef = useRef<HTMLTableElement>();

  const swipeActions = useSwipeHandlers(trainingWithButtonsRef);
  const { onSwiping, onSwiped, toggleSwipe, swiped } = swipeActions;

  const swipeHandlers = useSwipeable({
    onSwiping,
    onSwiped,
    ...swipeConfig,
  });

  const refPassthrough = (el: HTMLTableElement) => {
    // Call useSwipeable ref prop with el.
    swipeHandlers.ref(el);
    // Set myRef el so we can access it.
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
          {...(!swiped && { tabIndex: -1 })}
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
          {...(!swiped && { tabIndex: -1 })}
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
