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
    } else {
      setSuggestion(getSuggestion(currentExercise, uniqueExercises));
    }
  }, [currentInput, uniqueExercises, textAreaRef, cursorPosition]);

  return (
    <>
      {suggestion ? (
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
      ) : (
        <span></span>
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

const getSuggestion = (currentExercise: string, uniqueExercises: string[]) => {
  // match exercise which start with currentExercise
  const matches = uniqueExercises.filter(
    (exerciseName) =>
      exerciseName.toLowerCase() !== currentExercise.toLowerCase() &&
      exerciseName.toLowerCase().startsWith(currentExercise.toLowerCase())
  );

  if (matches[0]) {
    return matches[0];
  }

  const suggestionResult = fuzzyFilter(currentExercise, uniqueExercises)[0];

  // Infinity for exact match
  if (!suggestionResult || suggestionResult.score === Infinity) {
    return null;
  }

  return suggestionResult.original;
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
