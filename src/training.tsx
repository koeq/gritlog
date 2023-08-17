import { Calendar } from "./calendar";
import { createDateFormat } from "./create-date-format";
import { ExerciseRow } from "./exercise-row";
import "./styles/training.css";
import { Training as TrainingType } from "./types";

interface TrainingProps {
  readonly searchTerm: string;
  readonly training: TrainingType;
}

export const Training = ({
  training,
  searchTerm,
}: TrainingProps): JSX.Element | null => {
  return (
    <div className="training" tabIndex={0}>
      <HeadlineDateRow training={training} />
      <Headers />
      <Values training={training} searchTerm={searchTerm} />
    </div>
  );
};

const HeadlineDateRow = ({
  training: { id, date, headline },
}: {
  training: TrainingType;
}): JSX.Element => {
  return (
    <div className="headline-date-row">
      <span id="headline">{headline}</span>
      <div className="date">
        {createDateFormat(new Date(date), true)}
        <Calendar id={id} />
      </div>
    </div>
  );
};

const Headers = (): JSX.Element => {
  return (
    <div id="header-row">
      <h3 id="exercise-header" className="label-header">
        exercise
      </h3>
      <h3 className="label-header">weight</h3>
      <h3 id="repetition-header" className="label-header">
        reps
      </h3>
    </div>
  );
};

interface TrainingValuesProps {
  readonly searchTerm: string;
  readonly training: TrainingType;
}

const Values = ({ training, searchTerm }: TrainingValuesProps): JSX.Element => {
  const { exercises } = training;
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return (
    <>
      {exercises.length
        ? exercises.map((exercise, index) => {
            const weightChange =
              exercise.exerciseName === exercises[index - 1]?.exerciseName;

            const isSearchedExercise = normalizedSearchTerm
              ? exercise.exerciseName
                  ?.toLowerCase()
                  .includes(normalizedSearchTerm)
              : false;

            return (
              <ExerciseRow
                key={index}
                exercise={exercise}
                weightChange={weightChange}
                isLastExercise={index === exercises.length - 1}
                volumeChanges={training.volumeChanges}
                isSearchedExercise={isSearchedExercise}
              />
            );
          })
        : renderEmptyRow()}
    </>
  );
};

const renderEmptyRow = () => (
  <div className="header-row">
    <div id="exercise">—</div>
    <div id="weight">—</div>
    <div id="repetitions">—</div>
    <div id="change"></div>
  </div>
);
