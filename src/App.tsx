import { Suspense, lazy, useState } from "react";
import { useAuth } from "./context";
import { Header } from "./header";
import { LoadingDots } from "./loading-dots";
import { Menu } from "./menu";
import { useGoogleScript } from "./use-google-script";

const AuthedApp = lazy(() => import("./authed-app"));
const UnauthedApp = lazy(() => import("./unauthed-app"));

export const App = (): JSX.Element => {
  const { authed } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const googleScriptLoaded = useGoogleScript(authed === false);

  const [contentType, setContentType] = useState<"trainings" | "statistics">(
    "trainings"
  );

  // We are still waiting for the status of authed.
  if (authed === undefined) {
    return <LoadingDots />;
  }

  return (
    <Suspense fallback={<></>}>
      <Header
        authed={authed}
        menuOpen={menuOpen}
        contentType={contentType}
        setMenuOpen={setMenuOpen}
      />
      {authed ? (
        <>
          <AuthedApp contentType={contentType} />
          <Menu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setContentType={setContentType}
          />
        </>
      ) : (
        <UnauthedApp googleScriptLoaded={googleScriptLoaded} />
      )}
    </Suspense>
  );
};
