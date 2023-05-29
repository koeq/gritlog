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

  if (!currentLine) {
    return currentInput;
  }

  const exerciseMatch = currentLine.match(/([a-zA-Z\s]+)/);
  const currentExercise = exerciseMatch?.[0];

  if (!currentExercise) {
    return currentInput;
  }

  lines[lineIndex] = currentLine.replace(currentExercise, suggestion + " ");
  const newInput = lines.join("\n");

  return newInput;
}
