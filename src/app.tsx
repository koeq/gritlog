import { Suspense, lazy, useState } from "react";
import { useAuth } from "./context";
import { Header } from "./header";
import { Menu } from "./menu";
import { useGoogleScript } from "./use-google-script";

const AuthedApp = lazy(() => import("./authed-app"));
const UnauthedApp = lazy(() => import("./unauthed-app"));

export type AnalyticsSectionType = "activity" | "volume";

export type Section =
  | {
      readonly type: "trainings";
    }
  | {
      readonly type: "analytics";
      readonly analyticsType: AnalyticsSectionType;
    };

export const App = (): JSX.Element | null => {
  const { isAuthed: authed } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isGoogleScriptLoaded = useGoogleScript(authed === false);

  const [section, setSection] = useState<Section>({
    type: "trainings",
  });

  if (authed === undefined) {
    return null;
  }

  return (
    <Suspense fallback={<></>}>
      <Header
        authed={authed}
        section={section}
        menuOpen={menuOpen}
        setSection={setSection}
        setMenuOpen={setMenuOpen}
      />
      {authed ? (
        <>
          <AuthedApp section={section} />
          <Menu
            menuOpen={menuOpen}
            setSection={setSection}
            setMenuOpen={setMenuOpen}
          />
        </>
      ) : (
        <UnauthedApp isGoogleScriptLoaded={isGoogleScriptLoaded} />
      )}
    </Suspense>
  );
};
