import React from "react";
import { useAuth } from "./auth";

const AuthedApp = React.lazy(() => import("./authed-app"));
const UnauthedApp = React.lazy(() => import("./auth/unauthed-app"));

export const App = () => {
  const authed = useAuth();

  return authed ? <AuthedApp /> : <UnauthedApp />;
};
