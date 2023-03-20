import { handleAdd } from "./authed-app";
import { useAuth, useIsMobile } from "./context";
import { Action } from "./state-reducer";
import "./styles/input.css";
import { Training } from "./types";

interface InputProps {
  readonly dispatch: React.Dispatch<Action>;
  readonly currentInput: string;
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly inputOpen: boolean;
}

export const Input = ({
  dispatch,
  currentInput,
  currentTraining,
  textAreaRef,
  inputOpen,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  return (
    <>
      <textarea
        placeholder=">"
        onChange={(event) =>
          dispatch({
            type: "set-input",
            currentInput: event.currentTarget.value,
          })
        }
        value={currentInput}
        name="training"
        id="training"
        className={inputOpen ? "open" : "close"}
        ref={textAreaRef}
        tabIndex={inputOpen ? undefined : -1}
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
    </>
  );
};
