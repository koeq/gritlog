import { createContext, useEffect, useState } from "react";
import { useSafeContext } from "../utils/use-safe-context";

interface IsMobileProviderProps {
  children: React.ReactNode;
}

const IsMobileContext = createContext<boolean | undefined>(undefined);

export const IsMobileProvider = ({
  children,
}: IsMobileProviderProps): JSX.Element => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const handleWindowResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <IsMobileContext.Provider value={width <= 560}>
      {children}
    </IsMobileContext.Provider>
  );
};

export const useIsMobile: () => boolean = () =>
  useSafeContext(IsMobileContext, "IsMobile");
