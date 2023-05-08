import { IoCalendarOutline } from "react-icons/io5";
import "./styles/calendar.css";

export const Calendar = (): JSX.Element => {
  return (
    <span className="calendar">
      <IoCalendarOutline size={14} />
    </span>
  );
};
