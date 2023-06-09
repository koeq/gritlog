import { Dispatch, useLayoutEffect } from "react";
import { handleAdd } from "./bottom-bar";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import "./styles/input.css";
import { Training } from "./types";

interface InputProps {
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;

  readonly setShowInfo: Dispatch<React.SetStateAction<boolean>>;
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
    const minHeight = 90;
    // Reset height
    element.style.height = `${minHeight}px`;
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <>
      <div className="input-wrapper">
        <textarea
          autoComplete="on"
          placeholder="Squats @80kg 8/8/8"
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
