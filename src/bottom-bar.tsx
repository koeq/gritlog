import { Dispatch } from "react";
import { ImInfo } from "react-icons/im";
import { addTraining } from "./add-training";
import { useAuth, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Input } from "./input";
import { Action } from "./state-reducer";
import "./styles/bottom-bar.css";
import { Suggestion } from "./suggestion";
import { Mode, Training } from "./types";
import { isEmptyTraining } from "./utils/is-empty-training";

interface BottomBarProps {
  readonly currentTraining: Training;
  readonly textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  readonly setShowFormatInfo: Dispatch<React.SetStateAction<boolean>>;
}

export function BottomBar({
  currentTraining,
  textAreaRef,
  setShowFormatInfo,
}: BottomBarProps): JSX.Element {
  const { logout } = useAuth();
  const [{ currentInput, showBottomBar, mode }, dispatch] = useTopLevelState();

  const actionHandler = handleAction(
    mode,
    currentTraining,
    dispatch,
    logout,
    textAreaRef
  );

  const disabled = isDisabled(mode, currentTraining, currentInput);
  const cancelHandler = handleCancel(mode, dispatch);

  return (
    <footer className={`bottom-bar ${showBottomBar ? "" : "closed"}`}>
      <div
        style={{
          width: "min(450px, 92%)",
          padding: "14px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          aria-label="info"
          type="button"
          className="button circle-hover"
          onClick={() => setShowFormatInfo(true)}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ImInfo size={14} color="var(--text-primary)" />
        </button>
        <button
          aria-label="cancelation"
          type="button"
          onClick={cancelHandler}
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: "var(--text-primary)",
          }}
        >
          cancel
        </button>
      </div>

      <Input
        currentTraining={currentTraining}
        textAreaRef={textAreaRef}
        setShowInfo={setShowFormatInfo}
      />
      <div
        className=""
        style={{
          display: "flex",
          width: "min(450px, 92%)",
          height: "20px",

          marginBottom: "18px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Suggestion currentInput={currentInput} textAreaRef={textAreaRef} />
        <button
          aria-label="confirmation"
          type="button"
          disabled={disabled}
          onClick={actionHandler}
          style={{
            fontSize: 15,
            color: disabled ? "var(--cta-disabled)" : "var(--text-primary)",
            fontWeight: "500",
          }}
        >
          add
        </button>
      </div>
    </footer>
  );
}

const isDisabled = (
  mode: Mode,
  currentTraining: Training,
  currentInput: string
): boolean =>
  mode.type === "add"
    ? isEmptyTraining(currentTraining)
    : mode.type === "edit"
    ? currentInput?.trim() === mode.initialInput
    : false;

const handleAction = (
  mode: Mode,
  currentTraining: Training,
  dispatch: React.Dispatch<Action>,
  logout: () => void,
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>
): (() => void) | undefined =>
  mode.type === "add"
    ? () => handleAdd({ currentTraining, dispatch, logout, textAreaRef })
    : mode.type === "edit"
    ? () => handleEdit({ mode, currentTraining, dispatch, logout })
    : undefined;

const handleCancel = (mode: Mode, dispatch: React.Dispatch<Action>) =>
  mode.type === "add"
    ? () => dispatch({ type: "cancel-add" })
    : mode.type === "edit"
    ? () => handleCancelEdit(dispatch)
    : undefined;

interface HandleAddParams {
  logout: () => void;
  dispatch: Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  currentTraining: Training;
}

export const handleAdd = ({
  currentTraining,
  logout,
  dispatch,
  textAreaRef,
}: HandleAddParams): void => {
  if (isEmptyTraining(currentTraining)) {
    return;
  }

  addTraining(currentTraining, logout);
  dispatch({ type: "add", currentTraining });
  textAreaRef.current?.blur();
};

interface HandleEditParams {
  logout: () => void;
  readonly mode: Mode;
  readonly dispatch: React.Dispatch<Action>;
  readonly currentTraining: Training;
}

const handleEdit = ({
  mode,
  currentTraining,
  dispatch,
  logout,
}: HandleEditParams): void => {
  if (mode.type !== "edit") {
    return;
  }

  const { id, date } = mode;
  editTraining({ ...currentTraining, id, date }, logout);

  dispatch({
    type: "edit",
    currentTraining: { ...currentTraining, date },
    mode,
  });
};

const handleCancelEdit = (dispatch: Dispatch<Action>): void => {
  dispatch({ type: "cancel-edit" });
};
