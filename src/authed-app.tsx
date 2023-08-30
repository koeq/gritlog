import "../src/styles/authed-app.css";
import { Analytics } from "./analytics";
import { Section } from "./app";
import { useTopLevelState } from "./context";
import { LoadingDots } from "./loading-dots";
import { Trainings } from "./trainings";
import { useFetchTrainings } from "./use-fetch-trainings";

interface AuthedAppProps {
  readonly section: Section;
}

const AuthedApp = ({ section }: AuthedAppProps): JSX.Element => {
  const [{ trainings }, dispatch] = useTopLevelState();
  const isLoading = useFetchTrainings(dispatch);

  if (isLoading) {
    return <LoadingDots />;
  }

  return (
    <section className={`${section.type}-section`}>
      {section.type === "trainings" && <Trainings trainings={trainings} />}
      {section.type === "analytics" && (
        <Analytics trainings={trainings} section={section} />
      )}
    </section>
  );
};

export default AuthedApp;
