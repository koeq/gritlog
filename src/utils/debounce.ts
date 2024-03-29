// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  time: number
): {
  debounced: (...args: Parameters<F>) => void;
  cancel: () => void;
} {
  let timeoutId: number | undefined;

  return {
    debounced: (...args: Parameters<F>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        func(...args);
      }, time);
    },
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
  };
}
