import { ReactChild } from "react";
import { AuthProvider } from "./auth-provider";
import { IsMobileProvider } from "./is-mobile-provider";
import { ThemeProvider } from "./theme-provider";

interface AppProvidersProps {
  children: ReactChild;
}
export const AppProviders = ({ children }: AppProvidersProps): JSX.Element => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <IsMobileProvider>{children}</IsMobileProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
