import { useRef } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/calendar.css";
import { Training } from "./types";

export const Calendar = ({ id }: { id: number }): JSX.Element | null => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [{ trainings }, dispatch] = useTopLevelState();

  if (trainings === undefined) {
    return null;
  }

  return (
    <button className="calendar" onClick={(event) => event.stopPropagation()}>
      <IoCalendarOutline size={14} />

      <input
        ref={inputRef}
        id="date-picker"
        type="date"
        // The mobile browsers use the native date picker of the mobile OS
        // which fires an onChange event with the current date on opening the date picker.
        // As a workaround we use onBlur instead of onChange.
        {...(isMobile
          ? {
              onBlur: () =>
                setDateMobile({ id, trainings, dispatch, logout, inputRef }),
            }
          : {
              onChange: (event) =>
                setDate({ id, trainings, dispatch, event, logout }),
            })}
      />
    </button>
  );
};

interface SetDateMobileParams {
  id: number;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
  trainings: Training[];
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const setDateMobile = ({
  id,
  logout,
  inputRef,
  dispatch,
  trainings,
}: SetDateMobileParams) => {
  if (!inputRef.current) {
    return;
  }

  const event = {
    target: {
      value: inputRef.current.value,
    },
  };

  setDate({ id, trainings, dispatch, event, logout });
};

type SetDateParams = Omit<SetDateMobileParams, "inputRef"> & {
  event: { target: { value: string } };
};

const setDate = ({ id, trainings, dispatch, event, logout }: SetDateParams) => {
  const pickedDate = event.target.value;
  const training = trainings.find((training) => training.id === id);

  if (!pickedDate || !training) {
    return;
  }

  const date = new Date(pickedDate).toString();
  const currentTraining: Training = { ...training, date };

  if (date === training.date) {
    return;
  }

  const updatedTrainings = trainings.map((training) =>
    training.id === id ? currentTraining : training
  );
  editTraining(currentTraining, logout);

  dispatch({
    type: "set-trainings",
    trainings: updatedTrainings,
  });
};
