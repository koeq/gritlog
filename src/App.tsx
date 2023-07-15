import { Suspense, lazy, useState } from "react";
import { useAuth } from "./context";
import { Header } from "./header";
import { LoadingDots } from "./loading-dots";
import { Menu } from "./menu";
import { useGoogleScript } from "./use-google-script";

const AuthedApp = lazy(() => import("./authed-app"));
const UnauthedApp = lazy(() => import("./unauthed-app"));

export const App = (): JSX.Element => {
  const { authed, logout } = useAuth();
  const [menuActive, setMenuActive] = useState(false);
  const googleScriptLoaded = useGoogleScript(authed === false);

  // We are still waiting for the status of authed.
  if (authed === undefined) {
    return <LoadingDots />;
  }

  return (
    <Suspense fallback={<LoadingDots />}>
      <Header
        authed={authed}
        menuActive={menuActive}
        setMenuActive={setMenuActive}
      />
      {authed ? (
        <>
          <AuthedApp />
          <Menu menuActive={menuActive} logout={logout} />
        </>
      ) : (
        <UnauthedApp googleScriptLoaded={googleScriptLoaded} />
      )}
    </Suspense>
  );
};
