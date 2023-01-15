import { Suspense, lazy } from "react";
import { useAuth } from "./context/auth-provider";
import { LoadingSpinner } from "./loading-spinner";

const AuthedApp = lazy(() => import("./authed-app"));
const UnauthedApp = lazy(() => import("./unauthed-app"));

export const App = (): JSX.Element => {
  const { authed } = useAuth();

  // We are still waiting for the status of authed.
  if (typeof authed === "undefined") {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {authed ? <AuthedApp /> : <UnauthedApp />}
    </Suspense>
  );
};
