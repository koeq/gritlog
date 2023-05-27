import { RefObject, useEffect, useState } from "react";

export const useCursorPosition = (
  textAreaRef: RefObject<HTMLTextAreaElement>
): number | null => {
  const [cursorPos, setCursorPos] = useState<number | null>(null);

  useEffect(() => {
    const handleCursorChange = () => {
      setCursorPos(textAreaRef.current?.selectionStart || null);
    };

    const currentElement = textAreaRef.current;
    currentElement?.addEventListener("keyup", handleCursorChange);
    currentElement?.addEventListener("click", handleCursorChange);
    currentElement?.addEventListener("touchend", handleCursorChange);

    return () => {
      currentElement?.removeEventListener("keyup", handleCursorChange);
      currentElement?.removeEventListener("click", handleCursorChange);
      currentElement?.removeEventListener("touchend", handleCursorChange);
    };
  }, [textAreaRef]);

  return cursorPos;
};
