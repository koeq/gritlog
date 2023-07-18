export function debounce<F extends (...args: any[]) => void>(
  func: F,
  time: number
) {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, time);
  };
}
