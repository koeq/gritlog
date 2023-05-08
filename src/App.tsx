import { Suspense, lazy } from "react";
import { TopLevelStateProvider, useAuth } from "./context";
import { Header } from "./header";
import { LoadingSpinner } from "./loading-spinner";
import { useGoogleScript } from "./use-google-script";

const AuthedApp = lazy(() => import("./authed-app"));
const UnauthedApp = lazy(() => import("./unauthed-app"));

export const App = (): JSX.Element => {
  const { authed } = useAuth();
  const googleScriptLoaded = useGoogleScript(authed === false);

  // We are still waiting for the status of authed.
  if (authed === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header authed={authed} />
      {authed ? (
        <TopLevelStateProvider>
          <AuthedApp />
        </TopLevelStateProvider>
      ) : (
        <UnauthedApp googleScriptLoaded={googleScriptLoaded} />
      )}
    </Suspense>
  );
};
