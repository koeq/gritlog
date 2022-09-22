import { ReactChild } from "react";
import { AuthProvider } from "./auth-provider";

interface AppProvidersProps {
  children: ReactChild;
}
export const AppProviders = ({ children }: AppProvidersProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProviders;
