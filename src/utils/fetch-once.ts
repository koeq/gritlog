import { useEffect, useRef } from "react";

export const fetchOnce = (effect: () => Promise<void>) => {
  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current) {
      effect();
    }
    fetched.current = true;
  }, [fetched]);
};
