import { useEffect, useState } from "react";

export const useCursorPosition = (
  textArea: HTMLTextAreaElement | null
): number | null => {
  const [cursorPos, setCursorPos] = useState<number | null>(null);

  useEffect(() => {
    const handleCursorChange = () => {
      setCursorPos(textArea?.selectionStart || null);
    };

    const currentElement = textArea;
    currentElement?.addEventListener("keyup", handleCursorChange);
    currentElement?.addEventListener("click", handleCursorChange);
    currentElement?.addEventListener("touchend", handleCursorChange);

    return () => {
      currentElement?.removeEventListener("keyup", handleCursorChange);
      currentElement?.removeEventListener("click", handleCursorChange);
      currentElement?.removeEventListener("touchend", handleCursorChange);
    };
  }, [textArea]);

  return cursorPos;
};
