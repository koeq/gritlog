import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import "./styles/suggestion.css";
import { Training } from "./types";
import { useCursorPosition } from "./use-cursor-position";

interface SuggestionsProps {
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

// TODO:
// Don't autocomplete for 100% match
// Autocomplete on keypress desktop & mobile

export const Suggestion = ({
  currentInput,
  textAreaRef,
}: SuggestionsProps): JSX.Element | null => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [{ trainings }, dispatch] = useTopLevelState();
  const cursorPosition = useCursorPosition(textAreaRef.current);
  const firstSuggestion = suggestions[0];

  const uniqueExercises = useMemo(
    () => (trainings ? getUniqueExercises(trainings) : []),
    [trainings]
  );

  useEffect(() => {
    if (textAreaRef.current === null) {
      return;
    }

    const wordAtCusor = getWordAtCursor(textAreaRef.current);

    if (wordAtCusor === null) {
      setSuggestions([]);

      return;
    }

    const matches = uniqueExercises.filter((word) =>
      currentInput === ""
        ? false
        : word.toLowerCase().startsWith(wordAtCusor.toLowerCase())
    );

    setSuggestions(matches);
  }, [currentInput, uniqueExercises, textAreaRef, cursorPosition]);

  if (textAreaRef.current === null) {
    return null;
  }

  return (
    <>
      {firstSuggestion && (
        <button
          className="suggestion"
          onClick={() => {
            if (!firstSuggestion) {
              return;
            }

            textAreaRef.current?.focus();

            dispatch({
              type: "set-input",
              currentInput: buildNewInput(
                currentInput,
                firstSuggestion,
                textAreaRef.current
              ),
            });
          }}
        >
          {firstSuggestion}
        </button>
      )}
    </>
  );
};

function getUniqueExercises(trainings: Training[]): string[] {
  const exerciseSet = new Set<string>();

  for (const training of trainings) {
    const { exercises } = training;
    for (const { exerciseName } of exercises) {
      if (exerciseName) {
        exerciseSet.add(exerciseName);
      }
    }
  }

  return Array.from(exerciseSet);
}

const getWordAtCursor = (textArea: HTMLTextAreaElement): string | null => {
  const startPos = textArea.selectionStart;
  const endPos = textArea.selectionEnd;
  const precedingChars = textArea.value.slice(0, startPos);
  const currentLine = precedingChars.split("\n").pop() || "";

  if (startPos !== endPos) {
    // Something is actively selected
    return textArea.value.slice(startPos, endPos).trim();
  }

  if (currentLine.startsWith("#")) {
    return null;
  }

  // Extract exercise name (sequence of letters possibly separated by whitespace)
  const exerciseMatch = currentLine.match(/([a-zA-Z\s]+)$/);

  return exerciseMatch && exerciseMatch[0].trim() !== ""
    ? exerciseMatch[0].trim()
    : null;
};

function buildNewInput(
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

  const exerciseMatch = currentLine.match(/([a-zA-Z\s]+)$/);
  const currentExercise = exerciseMatch?.[0];

  if (!currentExercise) {
    return currentInput;
  }

  lines[lineIndex] = currentLine.replace(currentExercise, suggestion);
  const newInput = lines.join("\n");

  return newInput;
}
