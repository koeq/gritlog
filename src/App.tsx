import { Suspense, lazy, useState } from "react";
import { useAuth } from "./context";
import { Header } from "./header";
import { Menu } from "./menu";
import { useGoogleScript } from "./use-google-script";

const AuthedApp = lazy(() => import("./authed-app"));
const UnauthedApp = lazy(() => import("./unauthed-app"));

export const App = (): JSX.Element | null => {
  const { authed } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const googleScriptLoaded = useGoogleScript(authed === false);

  const [sectionType, setSectionType] = useState<"trainings" | "analytics">(
    "trainings"
  );

  if (authed === undefined) {
    return null;
  }

  return (
    <Suspense fallback={<></>}>
      <Header
        authed={authed}
        menuOpen={menuOpen}
        sectionType={sectionType}
        setMenuOpen={setMenuOpen}
      />
      {authed ? (
        <>
          <AuthedApp sectionType={sectionType} />
          <Menu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setSectionType={setSectionType}
          />
        </>
      ) : (
        <UnauthedApp googleScriptLoaded={googleScriptLoaded} />
      )}
    </Suspense>
  );
};
