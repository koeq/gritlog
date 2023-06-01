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
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
      setSuggestions([]);

      return;
    }

    const matches = uniqueExercises.filter(
      (exerciseName) =>
        exerciseName.toLowerCase() !== currentExercise.toLowerCase() &&
        exerciseName.toLowerCase().startsWith(currentExercise.toLowerCase())
    );

    setSuggestions(matches);
  }, [currentInput, uniqueExercises, textAreaRef, cursorPosition]);

  const firstSuggestion = suggestions[0];

  return (
    <>
      {firstSuggestion && (
        <button
          className="suggestion"
          onClick={() =>
            handleAutocomplete({
              firstSuggestion,
              currentInput,
              textAreaRef,
              dispatch,
            })
          }
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

const getCurrentExercise = (textArea: HTMLTextAreaElement): string | null => {
  const { currentLine } = getTextAreaCursorContext(textArea);

  if (currentLine === undefined || currentLine.startsWith("#")) {
    return null;
  }

  const currentExercise = getExerciseMatch(currentLine);

  return currentExercise ?? null;
};

interface HandleAutocompleteParams {
  firstSuggestion: string;
  currentInput: string;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  dispatch: (value: Action) => void;
}

function handleAutocomplete({
  firstSuggestion,
  currentInput,
  textAreaRef,
  dispatch,
}: HandleAutocompleteParams) {
  const textArea = textAreaRef.current;

  if (!firstSuggestion || !textArea) {
    return;
  }

  textArea.focus();

  dispatch({
    type: "set-input",
    currentInput: autocomplete(currentInput, firstSuggestion, textArea),
  });
}
