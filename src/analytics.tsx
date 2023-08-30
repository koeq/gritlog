import { Suspense, lazy } from "react";
import { Section } from "./app";
import { Training } from "./types";

const ActivityMatrix = lazy(() => import("./activit-matrix"));
const VolumeOverTime = lazy(() => import("./volume-over-time-chart"));

interface AnalyticsProps {
  readonly trainings: Training[];
  readonly section: Extract<Section, { type: "analytics" }>;
}

export const Analytics = ({
  trainings,
  section,
}: AnalyticsProps): JSX.Element => {
  return (
    <Suspense fallback={<></>}>
      {section.analyticsType === "volume" && (
        <VolumeOverTime trainings={trainings} />
      )}
      {section.analyticsType === "activity" && (
        <ActivityMatrix trainings={trainings} />
      )}{" "}
    </Suspense>
  );
};
