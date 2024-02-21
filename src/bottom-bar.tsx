import { PlusCircle, Search, SquarePen } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useTopLevelState } from "./context";
import { Hamburger } from "./hamburger";
import "./styles/bottom-bar.css";

interface BottomBarProps {
  readonly menuOpen: boolean;
  readonly isAnalytics: boolean;
  readonly handleSetEditMode: (id: number) => void;
  readonly setMenuOpen: Dispatch<SetStateAction<boolean>>;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const BottomBar = ({
  menuOpen,
  textAreaRef,
  isAnalytics,
  setMenuOpen,
  handleSetEditMode,
}: BottomBarProps): JSX.Element => {
  const [{ trainings }, dispatch] = useTopLevelState();
  const latestTrainingId = trainings[0]?.id;
  const noTrainings = trainings.length === 0;

  return (
    <nav id="bottom-bar">
      <Hamburger setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <button
        className={noTrainings || isAnalytics ? "btn-disabled" : ""}
        disabled={noTrainings || isAnalytics}
      >
        <Search size={25} onClick={() => dispatch({ type: "toggle-search" })} />
      </button>
      <button
        aria-label="edit"
        className={`btn-round ${
          noTrainings || isAnalytics ? "btn-disabled" : ""
        }`}
        type="button"
        disabled={noTrainings}
        onClick={
          latestTrainingId !== undefined
            ? () => handleSetEditMode(latestTrainingId)
            : undefined
        }
      >
        <SquarePen size={25} />
      </button>
      <button
        aria-label="add"
        className={isAnalytics ? "btn-disabled" : ""}
        disabled={isAnalytics}
        type="button"
        onClick={() => {
          dispatch({ type: "open-input" }),
            dispatch({ type: "set-mode", mode: { type: "add" } }),
            textAreaRef.current?.focus();
        }}
      >
        <PlusCircle size={28} />
      </button>
    </nav>
  );
};
