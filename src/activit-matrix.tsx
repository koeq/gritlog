import { useLayoutEffect, useRef } from "react";
import "./styles/activity-matrix.css";

// How is the width of a month determined?
// Number of sundays in that Month!

function getSundaysPerMonth(year: number) {
  const sundaysPerMonth = [];

  for (let month = 0; month < 12; month++) {
    let count = 0;
    const date = new Date(year, month, 1);

    while (date.getMonth() === month) {
      // 0 represents Sunday
      if (date.getDay() === 0) {
        count++;
      }
      date.setDate(date.getDate() + 1);
    }

    sundaysPerMonth.push(count);
  }

  return sundaysPerMonth;
}

const getDaysInYear = (year: number): 366 | 365 =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

export const ActivityMatrix = () => {
  const monthsRef = useRef<HTMLUListElement>(null);

  const squares = Array(getDaysInYear(new Date().getFullYear())).fill(
    undefined
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
  }, [monthsRef]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "120px",
        width: "100%",
        overflowX: "scroll",
      }}
    >
      <div id="activity-matrix">
        <ul ref={monthsRef} id="months">
          <li>Jan</li>
          <li>Feb</li>
          <li>Mar</li>
          <li>Apr</li>
          <li>May</li>
          <li>Jun</li>
          <li>Jul</li>
          <li>Aug</li>
          <li>Sep</li>
          <li>Oct</li>
          <li>Nov</li>
          <li>Dec</li>
        </ul>
        <ul id="days">
          <li></li>
          <li>Mon</li>
          <li></li>
          <li>Wed</li>
          <li></li>
          <li>Fri</li>
          <li></li>
        </ul>
        <ul id="squares">
          {squares.map((_, index) => (
            <li key={index}></li>
          ))}
        </ul>
      </div>
    </div>
  );
};
