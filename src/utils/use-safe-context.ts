import { useContext } from "react";

export function useSafeContext<T>(
  context: React.Context<T | undefined>,
  contextName: string
): T {
  const contextValue = useContext(context);

  if (contextValue === undefined) {
    throw new Error(`No value provided for context: ${contextName}.`);
  }

  return contextValue;
}
