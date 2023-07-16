import "./styles/no-filter-result.css";
import { Training } from "./types";

export const filterTrainings = (
  searchTerm: string,
  trainings: Training[]
): Training[] =>
  searchTerm
    ? trainings.filter(({ exercises }) =>
        exercises.some((exercise) =>
          exercise.exerciseName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
        )
      )
    : trainings;

interface NoFilterResultProps {
  searchTerm: string;
}

export function NoFilterResult({
  searchTerm,
}: NoFilterResultProps): JSX.Element {
  return (
    <p className="no-result-text">
      Can&apos;t find exercise
      <br />
      <span className="no-result-term">{searchTerm}</span>
    </p>
  );
}
