import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import "./styles/suggestion.css";
import { Training } from "./types";
import { useCursorPosition } from "./use-cursor-position";

interface SuggestionsProps {
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

export const Suggestion = ({
  currentInput,
  textAreaRef,
}: SuggestionsProps): JSX.Element | null => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [{ trainings }, dispatch] = useTopLevelState();
  const cursorPosition = useCursorPosition(textAreaRef);
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
              currentInput: buildNewInput(currentInput, firstSuggestion),
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

  return exerciseMatch ? exerciseMatch[0].trim() : null;
};

function buildNewInput(currentInput: string, suggestion: string) {
  const currentTraining = parse(currentInput);

  if (currentTraining === undefined) {
    return currentInput;
  }

  const lastExercise =
    currentTraining?.exercises[currentTraining?.exercises?.length - 1];

  if (lastExercise === undefined) {
    return currentInput;
  }

  lastExercise.exerciseName = suggestion;

  return serializeTraining(currentTraining) + " ";
}

// TODO
// 1. Support for autocomplete not just on last exercise √
// 2. Don't show suggestion on headline √
// 3. Autocomplete on tab (maybe more)
// 5. Not working with trailing whitespaces/newlines
// 6. Add autocomplete on keyinput
