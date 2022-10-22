import { Training } from "../db-handler/types";
import { editTraining } from "./edit-training";
import "./styles/input.css";
import { Mode } from "./types";
import { useIsMobile } from "./utils/use-is-mobile";

interface InputProps {
  readonly handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  readonly currentInput: string | undefined;
  readonly handleAdd: () => void;
  readonly mode: Mode;
  readonly setMode: (value: Mode | ((val: Mode) => Mode)) => void;
  readonly setCurrentInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  readonly nextTrainingId: number;
  readonly currentTraining: Training;
  readonly setTrainings: React.Dispatch<React.SetStateAction<Training[] | []>>;
  readonly logout: () => void;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
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
}: InputProps): JSX.Element => {
  const isMobile = useIsMobile();

  const handleCancelEdit = (
    setMode: (value: Mode | ((val: Mode) => Mode)) => void
  ) => {
    setMode({ type: "add", id: nextTrainingId });
    setCurrentInput("");
  };

  const handleEdit = () => {
    if (mode.type !== "edit") return;

    const { id, initialInput } = mode;

    // only edit if training changed
    if (currentInput?.trim() !== initialInput) {
      editTraining({ ...currentTraining, id }, logout);

      setTrainings((pastTrainings) => {
        return pastTrainings.map((training) => {
          if (training.id === id) {
            return { ...currentTraining, id };
          }

          return training;
        });
      });
    }

    setCurrentInput("");
    setMode({ type: "add", id: nextTrainingId });
  };

  return (
    <>
      <textarea
        onChange={handleInputChange}
        value={currentInput}
        name="training"
        id="training"
        ref={textAreaRef}
        onKeyDown={(e) => {
          if (!isMobile && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
          }
        }}
      ></textarea>

      <div className="buttons">
        {mode.type === "edit" ? (
          <>
            <button id="save" onClick={() => handleEdit()}>
              save
            </button>

            <button id="cancel" onClick={() => handleCancelEdit(setMode)}>
              cancel
            </button>
          </>
        ) : (
          <button id="add" onClick={() => handleAdd()}>
            add
          </button>
        )}
      </div>
    </>
  );
};
