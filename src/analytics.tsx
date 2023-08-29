import { Suspense, lazy } from "react";
import { Training } from "./types";

const ActivityMatrix = lazy(() => import("./activit-matrix"));
const VolumeOverTime = lazy(() => import("./volume-over-time-chart"));

interface AnalyticsProps {
  trainings: Training[];
}

export const Analytics = ({ trainings }: AnalyticsProps): JSX.Element => {
  return (
    <Suspense fallback={<></>}>
      <VolumeOverTime trainings={trainings} />
      <ActivityMatrix trainings={trainings} />
    </Suspense>
  );
};
