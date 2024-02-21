import { Suspense, lazy, useState } from "react";
import { useAuth } from "./context";
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
  const { isAuthed } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isGoogleScriptLoaded = useGoogleScript(isAuthed === false);

  const [section, setSection] = useState<Section>({
    type: "trainings",
  });

  if (isAuthed === undefined) {
    return null;
  }

  return (
    <Suspense fallback={<></>}>
      {/* TODO: delete */}
      {/* <Header
        isAuthed={isAuthed}
        section={section}
        menuOpen={menuOpen}
        setSection={setSection}
        setMenuOpen={setMenuOpen}
      /> */}
      {isAuthed ? (
        <>
          <AuthedApp
            section={section}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
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
