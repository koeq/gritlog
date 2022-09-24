import React, { Suspense } from "react";
import { useAuth } from "./context/auth-provider";
import { LoadingSpinner } from "./loading-spinner";

const AuthedApp = React.lazy(() => import("./authed-app"));
const UnauthedApp = React.lazy(() => import("./unauthed-app"));

export const App = () => {
  const { authed } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {authed ? <AuthedApp /> : <UnauthedApp />}
    </Suspense>
  );
};
