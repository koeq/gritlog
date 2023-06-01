export const DEFAULT_EXERCISES = [
  "Squat",
  "Bench Press",
  "Deadlift",
  "Pull Up",
  "Push Up",
  "Chin Up",
  "Lunge",
];

export function autocomplete(
  currentInput: string,
  suggestion: string,
  textArea: HTMLTextAreaElement
): string {
  const { currentLine, lines, currentLineIndex } =
    getTextAreaCursorContext(textArea);

  if (!currentLine || currentLine.startsWith("#")) {
    return currentInput;
  }

  const currentExercise = getExerciseMatch(currentLine);

  if (!currentExercise) {
    return currentInput;
  }

  lines[currentLineIndex] = currentLine.replace(
    currentExercise,
    suggestion + " "
  );
  const newInput = lines.join("\n");

  return newInput;
}

export function getTextAreaCursorContext(textArea: HTMLTextAreaElement): {
  lines: string[];
  currentLineIndex: number;
  currentLine: string | undefined;
} {
  const cursorStartPosition = textArea.selectionStart;
  const lines = textArea.value.split("\n");

  const currentLineIndex =
    textArea.value.slice(0, cursorStartPosition).split("\n").length - 1;

  const currentLine = lines[currentLineIndex];

  return { lines, currentLineIndex, currentLine };
}

/**
 * Gets the matching exercise from the current line.
 *
 * Matches one or more words composed of alphabetic characters (either uppercase or lowercase),
 * separated by single spaces, optionally followed by a single space, and appearing at the end of a string.
 *
 * @param {string} currentLine - The current line of text to search for the exercise match.
 * @returns {string | undefined} - Returns the matched exercise from the current line or undefined if no match is found.
 */
export const getExerciseMatch = (currentLine: string): string | undefined =>
  // eslint-disable-next-line security/detect-unsafe-regex
  currentLine.match(/([a-zA-Z]+(\s[a-zA-Z]+)*)\s?$/)?.[0];
