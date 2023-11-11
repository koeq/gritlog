import { useMemo, useRef, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { useAuth, useIsMobile } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/calendar.css";
import { Training } from "./types";
import { formatDate, mergeDateStrings } from "./utils/date";

interface Props {
  readonly training: Training;
  readonly dispatch: React.Dispatch<Action>;
}

export const Calendar = ({ training, dispatch }: Props): JSX.Element | null => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Internal date state is necessary because the onBlur event does not receive
  // the updated value.
  const [datePickerDate, setDatePickerDate] = useState(new Date(training.date));

  // Different event handlers for mobile and desktop are necessary since the
  // onChange is not a reliable indicator if the date selection was made.
  const eventHandlers = useMemo(
    () =>
      isMobile
        ? {
            onBlur: () => {
              updateDate({
                training,
                dispatch,
                logout,
                newDate: datePickerDate,
              });
            },
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              // If the datepicker "clear" button is used the target might be an empty string.
              if (!event.target.value) {
                return;
              }
              const newDate = mergeDateStrings({
                datePicker: event.target.value,
                trainingDate: training.date,
              });

              if (!newDate) {
                return;
              }

              setDatePickerDate(newDate);
            },
          }
        : {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              // If the datepicker "clear" button is used the target might be an empty string.
              if (!event.target.value) {
                return;
              }

              const newDate = mergeDateStrings({
                datePicker: event.target.value,
                trainingDate: training.date,
              });

              if (!newDate) {
                return;
              }

              updateDate({
                training,
                dispatch,
                logout,
                newDate,
              });
            },
          },
    [isMobile, training, dispatch, logout, datePickerDate]
  );

  return (
    <button
      className="calendar"
      aria-label="calendar"
      onClick={(event) => event.stopPropagation()}
    >
      <IoCalendarOutline size={15} />

      <input
        type="date"
        ref={inputRef}
        id="date-picker"
        value={formatDate(datePickerDate)}
        {...eventHandlers}
      />
    </button>
  );
};

interface UpdateDateParams {
  readonly training: Training;
  readonly logout: () => void;
  readonly newDate: Date;
  readonly dispatch: React.Dispatch<Action>;
}

const updateDate = ({
  logout,
  training,
  dispatch,
  newDate,
}: UpdateDateParams) => {
  const updatedTraining: Training = {
    ...training,
    date: newDate.toISOString(),
  };

  if (updatedTraining.date === "Invalid Date") {
    console.warn(
      `Encountered invalid date on training with id ${updatedTraining.id}.`
    );

    return;
  }

  editTraining(updatedTraining, logout);

  dispatch({
    type: "set-training-date",
    training: updatedTraining,
  });
};
