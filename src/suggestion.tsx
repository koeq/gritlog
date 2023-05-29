import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import "./styles/suggestion.css";
import { Training } from "./types";
import { useCursorPosition } from "./use-cursor-position";
import { autocomplete } from "./utils/autocomplete";

interface SuggestionsProps {
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

// TODO:
// Autocomplete on keypress desktop & mobile
// Write tests

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

    const matches = uniqueExercises.filter((exerciseName) =>
      exerciseName.toLowerCase() === wordAtCusor.toLowerCase()
        ? false
        : exerciseName.toLowerCase().startsWith(wordAtCusor.toLowerCase())
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
  const cursorEndPosition = textArea.selectionEnd;

  // Something is actively being selected
  if (cursorStartPosition !== cursorEndPosition) {
    return textArea.value.slice(cursorStartPosition, cursorEndPosition).trim();
  }

  const lines = textArea.value.split("\n");

  const lineIndex =
    textArea.value.slice(0, cursorStartPosition).split("\n").length - 1;

  const currentLine = lines[lineIndex];

  if (currentLine === undefined) {
    return null;
  }

  if (currentLine.startsWith("#")) {
    return null;
  }

  // Extract exercise name (sequence of letters possibly separated by whitespace)
  const exerciseMatch = currentLine.match(/([a-zA-Z\s]+)/);
  const wordAtCusor = exerciseMatch?.[0]?.trim();

  return wordAtCusor ? wordAtCusor : null;
};
