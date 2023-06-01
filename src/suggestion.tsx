import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import "./styles/suggestion.css";
import { Training } from "./types";
import { useCursorPosition } from "./use-cursor-position";
import { autocomplete } from "./utils/autocomplete";

const DEFAULT_EXERCISES = [
  "Squat",
  "Bench Press",
  "Deadlift",
  "Pull Up",
  "Push Up",
  "Chin Up",
  "Lunge",
];

interface SuggestionsProps {
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

// TODO:
// Autocomplete on keypress desktop & mobile
// Write tests √ (search for edge cases)
// Get ride of duplicated logic in autocomplete and getWordAtCursor

export const Suggestion = ({
  currentInput,
  textAreaRef,
}: SuggestionsProps): JSX.Element | null => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [{ trainings }, dispatch] = useTopLevelState();
  const cursorPosition = useCursorPosition(textAreaRef.current);
  const firstSuggestion = suggestions[0];

  const uniqueExercises = useMemo(
    () =>
      trainings && trainings.length
        ? getUniqueExercises(trainings)
        : DEFAULT_EXERCISES,
    [trainings]
  );

  useEffect(() => {
    if (textAreaRef.current === null) {
      return;
    }

    const wordAtCursor = getWordAtCursor(textAreaRef.current);

    if (wordAtCursor === null) {
      // Reset previous suggestion
      setSuggestions([]);

      return;
    }

    const matches = uniqueExercises.filter(
      (exerciseName) =>
        exerciseName.toLowerCase() !== wordAtCursor.toLowerCase() &&
        exerciseName.toLowerCase().startsWith(wordAtCursor.toLowerCase())
    );

    setSuggestions(matches);
  }, [currentInput, uniqueExercises, textAreaRef, cursorPosition]);

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
              currentInput: autocomplete(
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
  const cursorStartPosition = textArea.selectionStart;

  const linesBeforeCursor = textArea.value
    .slice(0, cursorStartPosition)
    .split("\n");

  const currentLine = linesBeforeCursor[linesBeforeCursor.length - 1];

  if (currentLine === undefined || currentLine.startsWith("#")) {
    return null;
  }

  // This regular expression matches one or more words composed of alphabetic characters (either uppercase or lowercase),
  // separated by single spaces, optionally followed by a single space, and appearing at the end of a string.
  // eslint-disable-next-line security/detect-unsafe-regex
  const exerciseMatch = currentLine.match(/([a-zA-Z]+(\s[a-zA-Z]+)*)\s?$/);
  const wordAtCusor = exerciseMatch?.[0];

  return wordAtCusor ?? null;
};
