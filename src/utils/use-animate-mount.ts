import { useEffect, useState } from "react";

export const useAnimatedMount = (
  shouldRender: boolean
): { isActive: boolean; shouldBeMounted: boolean } => {
  const [isActive, setIsActive] = useState(false);
  const [shouldBeMounted, setShouldBeMounted] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (shouldRender) {
      setShouldBeMounted(true);
      // Delay to allow for mounting before activating transition
      timeoutId = window.setTimeout(() => setIsActive(true), 50);
    } else {
      setIsActive(false);
      // Delay to allow for transition before unmounting
      timeoutId = window.setTimeout(() => setShouldBeMounted(false), 500); // 500ms should match the transition duration
    }

    return () => clearTimeout(timeoutId);
  }, [shouldRender]);

  return { isActive, shouldBeMounted };
};
