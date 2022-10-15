import { useEffect, useState } from "react";

export const useIsMobile = (): boolean => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return width <= 780;
};
