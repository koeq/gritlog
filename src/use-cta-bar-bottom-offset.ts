import { useCallback, useLayoutEffect, useState } from "react";
import { useIsMobile } from "./context";

const BOTTOM_CTAS_MARGIN = 20;

export const useCTABarBottomOffset = (showInputSection: boolean): number => {
  const isMobile = useIsMobile();
  const [bottomCTAsHeight, setBottomCTAsHeight] = useState(BOTTOM_CTAS_MARGIN);

  const resizeHandler = useCallback(() => {
    if (!visualViewport) {
      return;
    }

    setBottomCTAsHeight(
      window.innerHeight - visualViewport.height + BOTTOM_CTAS_MARGIN
    );
  }, []);

  useLayoutEffect(() => {
    if (!visualViewport || !isMobile || !showInputSection) {
      return;
    }

    visualViewport.addEventListener("resize", resizeHandler);

    return () => visualViewport?.removeEventListener("resize", resizeHandler);
  }, [isMobile, showInputSection, resizeHandler]);

  return bottomCTAsHeight;
};
