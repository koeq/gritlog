import {
  IoCheckmark,
  IoCloseOutline,
  IoPencil,
  IoRepeat,
} from "react-icons/io5";
import { useIsMobile } from "./context/is-mobile-provider";
import { editTraining } from "./edit-training";
import "./styles/input.css";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/training-has-content";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string;
  readonly handleAdd: () => void;
  readonly mode: Mode;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
  readonly setCurrentInput: React.Dispatch<React.SetStateAction<string>>;
  readonly nextTrainingId: number;
  readonly currentTraining: Training;
  readonly setTrainings: React.Dispatch<
    React.SetStateAction<Training[] | undefined>
  >;
  readonly logout: () => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly lastTrainingId: number | undefined;
  readonly handleSetEditMode: (id: number | undefined) => void;
  readonly inputOpen: boolean;
  readonly setInputOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Input = ({
  handleInputChange,
  currentInput,
  handleAdd,
  mode,
  setMode,
  setCurrentInput,
  nextTrainingId,
  currentTraining,
  setTrainings,
  logout,
  textAreaRef,
  lastTrainingId,
  handleSetEditMode,
  inputOpen,
  setInputOpen,
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();

  const handleCancelEdit = () => {
    setMode({ type: "add", id: nextTrainingId });
    setInputOpen(false);
    setCurrentInput("");
  };

  const handleEdit = () => {
    if (mode.type !== "edit") {
      return;
    }

    const { id, initialInput } = mode;

    // only edit if training changed
    if (currentInput?.trim() !== initialInput) {
      // CHECK: why do we pass the logout function here
      editTraining({ ...currentTraining, id }, logout);

      setTrainings((pastTrainings) => {
        return pastTrainings?.map((training) => {
          if (training.id === id) {
            return { ...currentTraining, id };
          }

          return training;
        });
      });
    }

    setCurrentInput("");
    setInputOpen(false);
    setMode({ type: "add", id: nextTrainingId });
  };

  return (
    <>
      <textarea
        placeholder=" >"
        onChange={handleInputChange}
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
            handleAdd();
          }
        }}
      ></textarea>

      <div className="buttons">
        {mode.type === "edit" ? (
          <>
            <button type="button" className="button" onClick={handleEdit}>
              <IoCheckmark size={32} />
            </button>

            <button
              type="button"
              id="cancel"
              className="button"
              onClick={handleCancelEdit}
            >
              <IoCloseOutline size={32} />
            </button>
          </>
        ) : (
          <>
            {inputOpen ? (
              <>
                <button
                  type="button"
                  className="button"
                  disabled={isEmptyTraining(currentTraining) ? true : false}
                  onClick={handleAdd}
                >
                  <IoCheckmark
                    stroke={
                      isEmptyTraining(currentTraining)
                        ? "var(--cta-disabled)"
                        : "var(--cta)"
                    }
                    size={32}
                  />
                </button>
                <button
                  type="button"
                  id="cancel"
                  className="button"
                  onClick={() => {
                    setCurrentInput("");
                    setInputOpen(false);
                  }}
                >
                  <IoCloseOutline stroke="var(--cta)" size={32} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="button"
                  onClick={() => {
                    setInputOpen(true);
                    textAreaRef.current?.focus();
                  }}
                >
                  <IoPencil stroke="var(--cta)" size={25} />
                </button>
                <button
                  type="button"
                  id="edit-last"
                  className="button"
                  disabled={lastTrainingId === undefined ? true : false}
                  onClick={() => {
                    handleSetEditMode(lastTrainingId);
                  }}
                >
                  <IoRepeat
                    stroke={
                      lastTrainingId === undefined
                        ? "var(--cta-disabled)"
                        : "var(--cta)"
                    }
                    size={32}
                  />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
