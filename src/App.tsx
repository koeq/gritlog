import React, { Suspense } from "react";
import { useAuth } from "./context/auth-provider";

const AuthedApp = React.lazy(() => import("./authed-app"));
const UnauthedApp = React.lazy(() => import("./unauthed-app"));

export const App = () => {
  const { authed } = useAuth();

  return (
    <Suspense fallback={<p> ¯\_(ツ)_/¯</p>}>
      {authed ? <AuthedApp /> : <UnauthedApp />}
    </Suspense>
  );
};
