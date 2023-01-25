import { useEffect, useState } from "react";
import { CurrentInput, Mode, currentInput, mode } from "./types";

export function parseMode(item: unknown): Mode {
  return mode.parse(item);
}

export function parseCurrentInput(item: unknown): CurrentInput {
  return currentInput.parse(item);
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  parse: (x: unknown) => T
): readonly [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return defaultValue;
      }

      return parse(JSON.parse(item));
    } catch (err) {
      console.error(err);

      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
