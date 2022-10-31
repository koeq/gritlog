import { Training } from "../lambdas/db-handler/types";
import "./styles/current-training.css";
import { TrainingTable } from "./training-table";

interface CurrentTrainingProps {
  readonly currentTraining: Training;
}

export const CurrentTraining = ({
  currentTraining,
}: CurrentTrainingProps): JSX.Element => {
  return (
    <div className="current-training">
      <TrainingTable training={currentTraining} />
    </div>
  );
};
