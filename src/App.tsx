import React from "react";
import { useState } from "react";
import { useSignIn } from "./auth";

const AuthedApp = React.lazy(() => import("./authed-app"));
const UnauthedApp = React.lazy(() => import("./auth/unauthed-app"));

export const App = () => {
  const [signedIn, setSignedIn] = useState(false);
  const userData = useSignIn(setSignedIn);
  console.log(userData);

  return signedIn ? <AuthedApp /> : <UnauthedApp />;
};
