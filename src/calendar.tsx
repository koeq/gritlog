import { useRef, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { useAuth, useIsMobile, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/calendar.css";
import { Training } from "./types";
import { formatDate } from "./utils/date";

export const Calendar = ({ id }: { id: number }): JSX.Element | null => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [{ trainings }, dispatch] = useTopLevelState();
  const currentTraining = trainings.find((t) => t.id === id);

  const [calendarDate, setCalendarDate] = useState(
    currentTraining?.date ? formatDate(currentTraining.date) : undefined
  );

  if (trainings === undefined) {
    return null;
  }

  const mobileEventHandlers = {
    onBlur: () => setDate({ id, trainings, dispatch, logout, calendarDate }),
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setCalendarDate(event.target.value),
  };

  const desktopEventHandlers = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value;

      setCalendarDate(newDate),
        setDate({ id, trainings, dispatch, logout, calendarDate: newDate });
    },
  };

  return (
    <button
      className="calendar"
      aria-label="calendar"
      onClick={(event) => event.stopPropagation()}
    >
      <IoCalendarOutline size={15} />

      <input
        ref={inputRef}
        id="date-picker"
        type="date"
        value={calendarDate}
        //  This workaround is necessary since the onChange event is not a
        // reliable indicator if the final date selection was confirmed.
        {...(isMobile ? mobileEventHandlers : desktopEventHandlers)}
      />
    </button>
  );
};

interface SetDateParams {
  id: number;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
  trainings: Training[];
  calendarDate: string | undefined;
}

const setDate = ({
  id,
  trainings,
  dispatch,
  calendarDate,
  logout,
}: SetDateParams) => {
  const training = trainings.find((training) => training.id === id);

  if (!calendarDate || !training) {
    return;
  }

  const currentTraining: Training = {
    ...training,
    date: new Date(calendarDate).toString(),
  };

  if (calendarDate === formatDate(training.date)) {
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
