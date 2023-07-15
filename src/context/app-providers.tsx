import { ReactChild } from "react";
import { AuthProvider } from "./auth-provider";
import { IsMobileProvider } from "./is-mobile-provider";
import { ThemeProvider } from "./theme-provider";
import { TopLevelStateProvider } from "./top-level-state-provider";

interface AppProvidersProps {
  children: ReactChild;
}
export const AppProviders = ({ children }: AppProvidersProps): JSX.Element => {
  return (
    <AuthProvider>
      <TopLevelStateProvider>
        <ThemeProvider>
          <IsMobileProvider>{children}</IsMobileProvider>
        </ThemeProvider>
      </TopLevelStateProvider>
    </AuthProvider>
  );
};
