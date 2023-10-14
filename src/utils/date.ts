/**
 * Formats a date string to a standardized format ("YYYY-MM-DD").
 *
 * @param date - The input date string. Needs to be compatible with the JavaScript Date constructor (ISO 8601 or RFC2822 timestamps).
 * @return A date string formatted as "YYYY-MM-DD".
 */
export const formatDate = (date: string): string =>
  new Date(date).toISOString().slice(0, 10);

/**
 * Calculates number of the day of the year.
 *
 * @param date - The input date string. Needs to be compatible with the JavaScript Date constructor (ISO 8601 or RFC2822 timestamps).
 * @return A number between 1 - 366 signaling the day of the year.
 */
export const getDayOfYear = (day: Date): number => {
  const startOfYear = new Date(day.getFullYear(), 0, 1);
  const diffInMilliseconds = day.valueOf() - startOfYear.valueOf();
  const oneDayInMilliseconds = 1000 * 60 * 60 * 24;

  return Math.floor(diffInMilliseconds / oneDayInMilliseconds) + 1;
};

export const getSundaysPerMonth = (year: number): number[] => {
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
};

export const getDaysInYear = (year: number): 366 | 365 =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
