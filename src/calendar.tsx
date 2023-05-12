import { IoCalendarOutline } from "react-icons/io5";
import { useAuth, useTopLevelState } from "./context";
import { editTraining } from "./edit-training";
import { Action } from "./state-reducer";
import "./styles/calendar.css";
import { Training } from "./types";

export const Calendar = ({ id }: { id: number }): JSX.Element | null => {
  const { logout } = useAuth();
  const [{ trainings }, dispatch] = useTopLevelState();

  if (trainings === undefined) {
    return null;
  }

  return (
    <button className="calendar" onClick={(event) => event.stopPropagation()}>
      <IoCalendarOutline size={14} />

      <input
        id="date-picker"
        type="date"
        onChange={(event) => setDate(id, trainings, dispatch, event, logout)}
      />
    </button>
  );
};

const setDate = (
  id: number,
  trainings: Training[],
  dispatch: React.Dispatch<Action>,
  event: React.ChangeEvent<HTMLInputElement>,
  logout: () => void
) => {
  const pickedDate = event.target.value;
  const training = trainings[id];

  if (!pickedDate || !training) {
    return;
  }

  const date = new Date(pickedDate).toString();
  const currentTraining: Training = { ...training, date };

  // TODO: sort by date
  // sorting should happen where we render -> not here
  const updatedTrainings = trainings.map((training) =>
    training.id === id ? currentTraining : training
  );

  editTraining(currentTraining, logout);

  dispatch({
    type: "set-trainings",
    trainings: updatedTrainings,
  });
};
