import { useRef, useState } from "react";

function retrieveFromLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);

    return item && JSON.parse(item);
  } catch (err) {
    console.log(err);

    return null;
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): readonly [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(
    () => retrieveFromLocalStorage(key) || defaultValue
  );

  const setValueRef = useRef((value: T | ((val: T) => T)) => {
    try {
      // alllow value to be a function to imitate the useState API
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.log(err);
    }
  });

  return [storedValue, setValueRef.current] as const;
}
