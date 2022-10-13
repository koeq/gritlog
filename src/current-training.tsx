import { Training } from "../db-handler/types";
import { TrainingTable } from "./training-table";
import "./styles/current-training.css";

interface CurrentTrainingProps {
  readonly currentTraining: Training;
}

export const CurrentTraining = ({ currentTraining }: CurrentTrainingProps) => {
  return (
    <div className="current-training">
      <TrainingTable training={currentTraining} />
      <hr />
    </div>
  );
};
