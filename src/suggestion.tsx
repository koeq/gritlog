import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import { Action } from "./state-reducer";
import "./styles/suggestion.css";
import { Training } from "./types";
import { useCursorPosition } from "./use-cursor-position";
import {
  DEFAULT_EXERCISES,
  autocomplete,
  getExerciseMatch,
  getTextAreaCursorContext,
} from "./utils/autocomplete";
import { fuzzyFilter } from "./utils/fuzzy";

interface SuggestionsProps {
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}

// TODO:
// Autocomplete on keypress desktop & mobile

export const Suggestion = ({
  currentInput,
  textAreaRef,
}: SuggestionsProps): JSX.Element | null => {
  const [{ trainings }, dispatch] = useTopLevelState();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const cursorPosition = useCursorPosition(textAreaRef.current);

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

    const currentExercise = getCurrentExercise(textAreaRef.current);

    if (currentExercise === null) {
      // Reset previous suggestion
      setSuggestion(null);

      return;
    }

    const matches = uniqueExercises.filter(
      (exerciseName) =>
        exerciseName.toLowerCase() !== currentExercise.toLowerCase() &&
        exerciseName.toLowerCase().startsWith(currentExercise.toLowerCase())
    );

    if (!matches[0]) {
      const suggestionResult = fuzzyFilter(currentInput, uniqueExercises)[0];

      setSuggestion(
        suggestionResult
          ? // Input matches string 100%
            suggestionResult.score === Infinity
            ? null
            : suggestionResult.original
          : null
      );
    } else {
      setSuggestion(matches[0]);
    }
  }, [currentInput, uniqueExercises, textAreaRef, cursorPosition]);

  return (
    <>
      {suggestion && (
        <button
          className="suggestion"
          onClick={() =>
            handleAutocomplete({
              suggestion,
              currentInput,
              textAreaRef,
              dispatch,
            })
          }
        >
          {suggestion}
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

const getCurrentExercise = (textArea: HTMLTextAreaElement): string | null => {
  const { currentLine } = getTextAreaCursorContext(textArea);

  if (currentLine === undefined || currentLine.startsWith("#")) {
    return null;
  }

  const currentExercise = getExerciseMatch(currentLine);

  return currentExercise ?? null;
};

interface HandleAutocompleteParams {
  suggestion: string;
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  dispatch: (value: Action) => void;
}

function handleAutocomplete({
  suggestion,
  currentInput,
  textAreaRef,
  dispatch,
}: HandleAutocompleteParams) {
  const textArea = textAreaRef.current;

  if (!suggestion || !textArea) {
    return;
  }

  textArea.focus();

  dispatch({
    type: "set-input",
    currentInput: autocomplete(currentInput, suggestion, textArea),
  });
}
