import React, { Suspense } from "react";
import { useAuth } from "./auth";

const AuthedApp = React.lazy(() => import("./authed-app"));
const UnauthedApp = React.lazy(() => import("./auth/unauthed-app"));

export const App = () => {
  const authed = useAuth();

  return (
    <Suspense fallback={<></>}>
      {authed ? <AuthedApp /> : <UnauthedApp />}
    </Suspense>
  );
};
