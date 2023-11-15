export const MILLISECONDS_IN_HOUR = 3600000;
/**
 * Formats a date string to a standardized format ("YYYY-MM-DD").
 *
 * @param date A date object.
 * @return A date string formatted as "YYYY-MM-DD".
 */
export const formatDate = (date: Date): string =>
  date.toISOString().slice(0, 10);

const isValidDate = (date: Date): boolean => !isNaN(date.valueOf());

interface Dates {
  datePicker: string;
  trainingDate: string;
}

/**
 * Merges two date strings of different formats into a combined date object by taking the date
 * of the first argument and the time of the second argument.
 *
 * @param datePicker A date string formatted as "YYYY-MM-DD" which is returned by the datepicker.
 * @param trainingDate A date string in the ISO 8601 format.
 * @return A date object.
 */
export const mergeDateStrings = ({
  datePicker,
  trainingDate,
}: Dates): Date | undefined => {
  const date = new Date(trainingDate);
  const combinedDate = new Date(datePicker);

  if (!isValidDate(date) || !isValidDate(combinedDate)) {
    console.error(
      `Trying to merge invalid date strings: ${date}, ${combinedDate}.`
    );

    return;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  combinedDate.setHours(hours, minutes, seconds, milliseconds);

  return combinedDate;
};

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
