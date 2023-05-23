import { useEffect, useMemo, useState } from "react";
import { useTopLevelState } from "./context";
import { parse } from "./parser";
import { serializeTraining } from "./serialize-training";
import "./styles/suggestion.css";
import { Training } from "./types";

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
  const firstSuggestion = suggestions[0];

  const uniqueExercises = useMemo(
    () => (trainings ? getUniqueExercises(trainings) : []),
    [trainings]
  );

  useEffect(() => {
    const lastWord = currentInput.split("\n")?.pop()?.split(" ").pop();

    if (lastWord === undefined || lastWord === "") {
      setSuggestions([]);

      return;
    }

    const matches = uniqueExercises.filter((word) =>
      currentInput === ""
        ? false
        : word.toLowerCase().startsWith(lastWord.toLowerCase())
    );

    setSuggestions(matches);
  }, [currentInput, uniqueExercises]);

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
// 1. Support for autocomplete not just on last exercise
// 2. Don't show suggestion on headline
// 3. Autocomplete on tab (maybe more)
// 4. Remove suggestion on delete
// 5. Not working with trailing whitespaces/newlines
