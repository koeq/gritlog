import { Dispatch } from "react";
import "./styles/format-info.css";

export const FormatInfo = ({
  setShowInfo,
}: {
  setShowInfo: Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  return (
    <div className="layer" onClick={() => setShowInfo(false)}>
      <div className="training-format-explanation">
        <div className="format-container">
          <div className="exercise-name-explanation">
            <div className="exercise-label">Exercise name</div>
            <svg width="20" height="58" viewBox="0 0 20 58">
              <rect x="9" y="0" width="1" height="58" fill="grey" />
            </svg>
          </div>
          <div className="reps-explanation">
            <div>Repetitions</div>
            <span style={{ whiteSpace: "nowrap" }} className="description">
              (abbreviate with 3*8)
            </span>
            <svg
              className="margin-top"
              width="20"
              height="50"
              viewBox="0 0 20 50"
            >
              <rect x="9" y="0" width="1" height="40" fill="grey" />
            </svg>
          </div>
          <p className="format-box">
            <span className="training-info">Squats @100 8/8/8 @90 8</span>
          </p>
          <div className="weight-explanation">
            <svg width="20" height="50" viewBox="0 0 20 50">
              <rect x="9" y="0" width="1" height="40" fill="grey" />
            </svg>
            <div className="weight-label">Weight</div>
            <span className="description">
              (starts with &apos;@&apos; and defaults to &apos;kg&apos; - add
              lbs to change weight unit)
            </span>
          </div>
          <div className="extra-set-explanation">
            <svg width="20" height="50" viewBox="0 0 20 50">
              <rect x="9" y="0" width="1" height="40" fill="grey" />
            </svg>
            <div className="extra-set-label">Additional set</div>
            <span className="description">(different weight)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
