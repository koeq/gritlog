import { useEffect } from "react";

type Handler = () => void;

export const useEscape = (
  ref: React.RefObject<HTMLElement>,
  handler: Handler
): void => {
  useEffect(() => {
    const element = ref.current;
    const escapeHandler = createEscHandler(handler);

    element?.addEventListener("keydown", escapeHandler);

    return () => element?.removeEventListener("keydown", escapeHandler);
  }, [ref, handler]);
};

const createEscHandler = (handler: Handler) => (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handler();
  }
};
