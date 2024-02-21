import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import "../src/styles/authed-app.css";
import { Analytics } from "./analytics";
import { Section } from "./app";
import { BottomBar } from "./bottom-bar";
import { useTopLevelState } from "./context";
import { LoadingDots } from "./loading-dots";
import { serializeExercises } from "./serialize-exercises";
import { Trainings } from "./trainings";
import { useFetchTrainings } from "./use-fetch-trainings";

interface AuthedAppProps {
  readonly section: Section;
  readonly menuOpen: boolean;
  readonly setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthedApp = ({
  section,
  menuOpen,
  setMenuOpen,
}: AuthedAppProps): JSX.Element => {
  const [{ trainings }, dispatch] = useTopLevelState();
  const isLoading = useFetchTrainings(dispatch);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // TODO: this should probably be a dispatch action
  const handleSetEditMode = useCallback(
    (id: number) => {
      const training = trainings.find((training) => training.id === id);

      if (!training) {
        return;
      }

      dispatch({
        id,
        date: training.date,
        type: "set-edit-mode",
        serializedExercises: serializeExercises(training),
      });

      textAreaRef.current?.focus();
    },
    [trainings, dispatch]
  );

  if (isLoading) {
    return <LoadingDots />;
  }

  return (
    <section className={`${section.type}-section`}>
      {section.type === "trainings" && (
        <Trainings
          trainings={trainings}
          textAreaRef={textAreaRef}
          handleSetEditMode={handleSetEditMode}
        />
      )}
      {section.type === "analytics" && (
        <Analytics trainings={trainings} section={section} />
      )}
      <BottomBar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        textAreaRef={textAreaRef}
        handleSetEditMode={handleSetEditMode}
        isAnalytics={section.type === "analytics"}
      />
    </section>
  );
};

export default AuthedApp;
