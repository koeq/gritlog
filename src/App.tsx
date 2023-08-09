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

  // We are still waiting for the status of authed.
  if (authed === undefined) {
    return <LoadingDots />;
  }

  return (
    <Suspense fallback={<LoadingDots />}>
      <Header authed={authed} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {authed ? (
        <>
          <AuthedApp />
          <Menu menuOpen={menuOpen} />
        </>
      ) : (
        <UnauthedApp googleScriptLoaded={googleScriptLoaded} />
      )}
    </Suspense>
  );
};
