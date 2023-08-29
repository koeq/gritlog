import { useLayoutEffect, useMemo, useRef } from "react";
import "./styles/activity-matrix.css";
import { Training } from "./types";
import { getSundaysPerMonth } from "./utils/date";
import { getVolumePerDayOfYearAndAverage } from "./utils/get-volume-per-day-of-year-and-average";

const daysOfWeek = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

interface ActivityMatrixProps {
  trainings: Training[];
}

const ActivityMatrix = ({ trainings }: ActivityMatrixProps): JSX.Element => {
  const monthsRef = useRef<HTMLUListElement>(null);

  const { daysOfYear, averageVolume } = useMemo(
    () => getVolumePerDayOfYearAndAverage(trainings),
    [trainings]
  );

  useLayoutEffect(() => {
    if (!monthsRef.current) {
      return;
    }

    const sundaysPerMonth = getSundaysPerMonth(new Date().getFullYear());

    const gridTemplateColumns = sundaysPerMonth
      .map((count) => `calc(var(--week-width) * ${count})`)
      .join(" ");

    monthsRef.current.style.gridTemplateColumns = gridTemplateColumns;
  }, []);

  return (
    <section className="activity-matrix-container">
      <br />
      <div id="activity-matrix">
        <ul ref={monthsRef} id="months">
          {months.map((month) => (
            <li key={month}>{month}</li>
          ))}
        </ul>
        <ul id="days">
          {daysOfWeek.map((day, index) => (
            <li key={index}>{day}</li>
          ))}
        </ul>
        <ul id="squares">
          {daysOfYear.map((day, index) => {
            const normalizedVolume = day
              ? day.volume / averageVolume
              : undefined;

            const className = normalizedVolume
              ? normalizedVolume < 0.8
                ? "below-average"
                : normalizedVolume > 1.2
                ? "above-average"
                : "average"
              : "no-training";

            return <li key={index} className={className}></li>;
          })}
        </ul>
      </div>
    </section>
  );
};

export default ActivityMatrix;
