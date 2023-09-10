import { memo, useRef } from "react";
import { IoPencilSharp, IoRepeat, IoTrashBin } from "react-icons/io5";
import { useIsMobile } from "./context";
import { Action } from "./state-reducer";
import "./styles/training-card.css";
import { Training } from "./training";
import { Training as TrainingType } from "./types";

interface TrainingCard {
  readonly searchTerm: string;
  readonly training: TrainingType;
  readonly handleRepeat: (id: number) => void;
  readonly handleSetEditMode: (id: number) => void;
  readonly dispatch: React.Dispatch<Action>;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const TrainingCard = ({
  training,
  dispatch,
  searchTerm,
  textAreaRef,
  handleRepeat,
  handleSetEditMode,
}: TrainingCard): JSX.Element | null => {
  const isMobile = useIsMobile();
  const trainingRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="training-with-buttons "
      ref={trainingRef}
      onClick={isMobile ? undefined : () => scrollOnClick(trainingRef.current)}
    >
      <Training
        training={training}
        dispatch={dispatch}
        searchTerm={searchTerm}
      />
      <div className="buttons-container">
        <button
          aria-label="edit"
          id="edit"
          className="action-btn-default hover"
          onClick={(e) => {
            e.stopPropagation();
            textAreaRef.current?.focus();
            handleSetEditMode(training.id);
            scrollOnClick(trainingRef.current);
          }}
        >
          <IoPencilSharp size={23} />
        </button>
        <button
          aria-label="repeat"
          id="repeat"
          className="action-btn-default hover"
          onClick={(e) => {
            e.stopPropagation();
            handleRepeat(training.id);
            scrollOnClick(trainingRef.current);
          }}
        >
          <IoRepeat size={26} />
        </button>
        <button
          aria-label="delete"
          id="delete"
          className="action-btn-default hover"
          onClick={(e) => {
            e.stopPropagation();
            scrollOnClick(trainingRef.current);
            dispatch({
              type: "set-delete-mode",
              id: training.id,
            });
          }}
        >
          <IoTrashBin size={21} />
        </button>
      </div>
    </div>
  );
};

export const MemoizedTrainingCard = memo(TrainingCard);

const scrollOnClick = (element: HTMLDivElement | null): void => {
  if (!element) {
    return;
  }

  const elementWidth = element.clientWidth;
  const scrollValue = element.scrollLeft === 0 ? elementWidth : -elementWidth;

  element.scrollBy({
    left: scrollValue,
    behavior: "smooth",
  });
};
