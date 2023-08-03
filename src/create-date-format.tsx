const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const createDateFormat = (
  date: Date,
  includeDayName?: boolean
): string => {
  const day = date.toLocaleString("default", {
    day: "2-digit",
  });

  const month = date.toLocaleString("default", {
    month: "short",
  });

  return `${includeDayName ? DAYS[date.getDay()] : ""} ${day} ${month}`;
};
