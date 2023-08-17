import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import { Action } from "./state-reducer";
import "./styles/suggestion.css";
import {
  DEFAULT_EXERCISES,
  autocomplete,
  getExerciseMatch,
  getTextAreaCursorContext,
} from "./utils/autocomplete";
import { fuzzyFilter } from "./utils/fuzzy";
import { getUniqueExerciseNames } from "./utils/get-unique-exercises";

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

  const uniqueExercises = useMemo(
    () =>
      trainings && trainings.length
        ? getUniqueExerciseNames(trainings)
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
  }, [currentInput, uniqueExercises, textAreaRef]);

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
