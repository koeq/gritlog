export function autocomplete(
  currentInput: string,
  suggestion: string,
  textArea: HTMLTextAreaElement | null
): string {
  if (textArea === null) {
    return currentInput;
  }

  const cursorStartPosition = textArea.selectionStart;
  const lines = textArea.value.split("\n");

  const lineIndex =
    textArea.value.slice(0, cursorStartPosition).split("\n").length - 1;

  const currentLine = lines[lineIndex];

  if (!currentLine || currentLine.startsWith("#")) {
    return currentInput;
  }

  // This regular expression matches one or more words composed of alphabetic characters (either uppercase or lowercase),
  // separated by single spaces, optionally followed by a single space, and appearing at the end of a string.
  // eslint-disable-next-line security/detect-unsafe-regex
  const exerciseMatch = currentLine.match(/([a-zA-Z]+(\s[a-zA-Z]+)*)\s?$/);
  const currentExercise = exerciseMatch?.[0];

  if (!currentExercise) {
    return currentInput;
  }

  lines[lineIndex] = currentLine.replace(currentExercise, suggestion + " ");
  const newInput = lines.join("\n");

  return newInput;
}
