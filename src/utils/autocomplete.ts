export function autocomplete(
  currentInput: string,
  suggestion: string,
  textArea: HTMLTextAreaElement | null
): string {
  if (textArea === null) {
    return currentInput;
  }

  const cursorPos = textArea.selectionStart || 0;
  const lines = textArea.value.split("\n");
  const lineIndex = textArea.value.slice(0, cursorPos).split("\n").length - 1;
  const currentLine = lines[lineIndex];

  if (!currentLine || currentLine.startsWith("#")) {
    return currentInput;
  }

  // eslint-disable-next-line security/detect-unsafe-regex
  const exerciseMatch = currentLine.match(/([a-zA-Z]+(\s[a-zA-Z]+)*)/);
  const currentExercise = exerciseMatch?.[0];

  if (!currentExercise) {
    return currentInput;
  }

  lines[lineIndex] = currentLine.replace(currentExercise, suggestion + " ");
  const newInput = lines.join("\n");

  return newInput;
}
