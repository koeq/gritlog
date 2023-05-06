import { IoCalendarOutline } from "react-icons/io5";
import { useTheme } from "./context/theme-provider";
import "./styles/calendar.css";

export const Calendar = (): JSX.Element => {
  const [theme] = useTheme();

  return (
    <span
      className={`calendar ${
        theme === "light" ? "calendar-light" : "calendar-dark"
      }`}
    >
      <IoCalendarOutline size={14} />
    </span>
  );
};
