/**
 * Formats a date string to a standardized format ("YYYY-MM-DD").
 * This format is used for date input elements.
 *
 * @param date - The input date string. Needs to be compatible with the JavaScript Date constructor (ISO 8601 or RFC2822 timestamps).
 * @return A date string formatted as "YYYY-MM-DD".
 */
export const formatDate = (date: string): string =>
  new Date(date).toISOString().slice(0, 10);
