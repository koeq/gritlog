import { useCallback, useLayoutEffect } from "react";
import { useIsMobile, useTopLevelState } from "./context";
import "./styles/input.css";
import { CurrentInput } from "./types";

interface InputSectionProps {
  readonly currentInput: CurrentInput;
  readonly actionHandler: () => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const Input = ({
  textAreaRef,
  currentInput,
  actionHandler,
}: InputSectionProps): JSX.Element => {
  const isMobile = useIsMobile();
  const [{ showBottomBar }, dispatch] = useTopLevelState();

  const keyDownHandler = useCallback(
    (e) => {
      if (isMobile) {
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        actionHandler();
      }
    },
    [isMobile, actionHandler]
  );

  const inputOnChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({
        type: "set-input",
        currentInput: {
          headline: event.currentTarget.value,
          exercises: currentInput.exercises,
        },
      }),
    [currentInput.exercises, dispatch]
  );

  const textAreaOnChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      dispatch({
        type: "set-input",
        currentInput: {
          headline: currentInput.headline || "",
          exercises: event.currentTarget.value,
        },
      }),
    [currentInput.headline, dispatch]
  );

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      autoGrow(textAreaRef.current);
    }
  }, [currentInput.exercises, textAreaRef]);

  return (
    <>
      <div className="input-wrapper">
        <input
          type="text"
          id="title-input"
          placeholder="Title"
          className="text-input"
          onKeyDown={keyDownHandler}
          value={currentInput.headline}
          onChange={inputOnChangeHandler}
        />
        <textarea
          ref={textAreaRef}
          onKeyDown={keyDownHandler}
          value={currentInput.exercises}
          onChange={textAreaOnChangeHandler}
          placeholder="Squats @80kg 8/8/8..."
          tabIndex={showBottomBar ? undefined : -1}
          className={`text-input ${showBottomBar ? "open" : "close"}`}
        ></textarea>
      </div>
    </>
  );
};

const autoGrow = (element: HTMLTextAreaElement) => {
  const minHeight = 120;
  // Reset height
  element.style.height = `${minHeight}px`;
  element.style.height = `${element.scrollHeight}px`;
};
