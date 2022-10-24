import { ReactChild } from "react";
import { AuthProvider } from "./auth-provider";
import { IsMobileProvider } from "./is-mobile-provider";

interface AppProvidersProps {
  children: ReactChild;
}
export const AppProviders = ({ children }: AppProvidersProps): JSX.Element => {
  return (
    <AuthProvider>
      <IsMobileProvider>{children}</IsMobileProvider>
    </AuthProvider>
  );
};
