import { Dispatch, useLayoutEffect } from "react";
import { handleAdd } from "./bottom-bar";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import "./styles/input.css";
import { TrainingWithoutVolume } from "./types";

interface InputProps {
  readonly currentTraining: TrainingWithoutVolume;
  readonly setShowInfo: Dispatch<React.SetStateAction<boolean>>;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const Input = ({
  textAreaRef,
  currentTraining,
}: InputProps): JSX.Element => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [{ currentInput, showBottomBar }, dispatch] = useTopLevelState();

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      autoGrow(textAreaRef.current);
    }
  }, [currentInput, textAreaRef]);

  const autoGrow = (element: HTMLTextAreaElement) => {
    const minHeight = 130;
    // Reset height
    element.style.height = `${minHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <>
      <div className="input-wrapper">
        <textarea
          autoComplete="off"
          placeholder="Squats @80kg 8/8/8 ..."
          onChange={(event) =>
            dispatch({
              type: "set-input",
              currentInput: event.currentTarget.value,
            })
          }
          value={currentInput}
          name="training"
          id="training"
          className={showBottomBar ? "open" : "close"}
          ref={textAreaRef}
          tabIndex={showBottomBar ? undefined : -1}
          onKeyDown={(e) => {
            if (isMobile) {
              return;
            }

            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd({ currentTraining, dispatch, logout, textAreaRef });
            }
          }}
        ></textarea>
      </div>
    </>
  );
};
