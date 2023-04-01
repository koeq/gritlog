import { memo } from "react";
import { HandleSetEditModeParams } from "./authed-app";
import { Action } from "./state-reducer";
import "./styles/trainings.css";
import { TrainingTableWithButtons } from "./training-table-with-buttons";
import { Training } from "./types";

interface TrainingsProps {
  readonly trainings: Training[];
  readonly dispatch: React.Dispatch<Action>;
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;

  readonly handleSetEditMode: ({
    id,
    trainings,
    dispatch,
    textAreaRef,
  }: HandleSetEditModeParams) => void;
}

const parseWeight = (weight: string | null | undefined) => {
  const match = weight?.match(/\d+/);

  return match ? parseInt(match[0]) : 0;
};

const parseReps = (reps: string | null | undefined) => {
  const summedReps = reps
    ?.split("/")
    .map((rep) => parseInt(rep))
    .reduce((acc, rep) => acc + rep);

  return summedReps || 0;
};

const getWorkPerExercise = (training: Training) =>
  training.exercises.reduce(
    (acc: Record<string, number>, { exerciseName, weight, repetitions }) => {
      const doneWork = parseWeight(weight) * parseReps(repetitions);

      if (!exerciseName) {
        return acc;
      }

      if (Object.prototype.hasOwnProperty.call(acc, exerciseName)) {
        acc[exerciseName] += doneWork;
      } else {
        acc[exerciseName] = doneWork;
      }

      return acc;
    },
    {}
  );

const getLatestPercentageChanges = (
  latestTraining: Training,
  trainings: Training[]
) => {
  const percentageChanges: Record<string, number> = {
    trainingId: latestTraining.id,
  };

  if (trainings.length < 2) {
    percentageChanges;
  }

  const exerciseWorkMap = getWorkPerExercise(latestTraining);

  for (const [exercise, work] of Object.entries(exerciseWorkMap)) {
    if (work === 0) {
      continue;
    }

    for (let i = trainings.length - 2; i >= 0; i--) {
      const prevExerciseWorkMap = getWorkPerExercise(trainings[i]);

      if (
        !Object.prototype.hasOwnProperty.call(prevExerciseWorkMap, exercise)
      ) {
        continue;
      }

      const prevWork = prevExerciseWorkMap[exercise];

      if (prevWork === 0) {
        break;
      }

      const percentageChange = (work / prevWork - 1) * 100;
      percentageChanges[exercise] = percentageChange;
      break;
    }
  }

  return percentageChanges;
};

export const Trainings = ({
  dispatch,
  trainings,
  textAreaRef,
  handleSetEditMode,
}: TrainingsProps): JSX.Element | null => {
  if (trainings.length === 0) {
    return null;
  }

  const latestTraining = trainings[trainings.length - 1];

  const percentageChanges = getLatestPercentageChanges(
    latestTraining,
    trainings
  );

  return (
    <main className="trainings">
      <section>
        {trainings
          .map((training) => {
            return (
              <TrainingTableWithButtons
                key={training.id}
                dispatch={dispatch}
                training={training}
                percentageChanges={
                  training.id === percentageChanges?.trainingId
                    ? percentageChanges
                    : null
                }
                handleSetEditMode={() =>
                  handleSetEditMode({
                    id: training.id,
                    trainings,
                    dispatch,
                    textAreaRef,
                  })
                }
              />
            );
          })
          .reverse()}
      </section>
    </main>
  );
};

export const MemoizedTrainings = memo(Trainings);
