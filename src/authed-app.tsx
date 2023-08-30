import "../src/styles/authed-app.css";
import { Analytics } from "./analytics";
import { useTopLevelState } from "./context";
import { LoadingDots } from "./loading-dots";
import { Trainings } from "./trainings";
import { useFetchTrainings } from "./use-fetch-trainings";

interface AuthedAppProps {
  readonly sectionType: "trainings" | "analytics";
}

const AuthedApp = ({ sectionType }: AuthedAppProps): JSX.Element => {
  const [{ trainings }, dispatch] = useTopLevelState();
  const isLoading = useFetchTrainings(dispatch);

  if (isLoading) {
    return <LoadingDots />;
  }

  return (
    <section className={`${sectionType}-section`}>
      {sectionType === "trainings" && <Trainings trainings={trainings} />}
      {sectionType === "analytics" && <Analytics trainings={trainings} />}
    </section>
  );
};

export default AuthedApp;
