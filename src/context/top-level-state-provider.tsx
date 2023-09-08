import { ReactNode, createContext, useReducer } from "react";
import { Action, TopLevelState, initialState, reducer } from "../state-reducer";
import { useSafeContext } from "../utils/use-safe-context";

interface TopLevelStateProviderProps {
  readonly children: ReactNode;
}

export const TopLevelStateContext = createContext<
  [TopLevelState, React.Dispatch<Action>] | undefined
>(undefined);

export const TopLevelStateProvider = ({
  children,
}: TopLevelStateProviderProps): JSX.Element => {
  const [topLevelState, dispatch] = useReducer(reducer, initialState);

  return (
    <TopLevelStateContext.Provider value={[topLevelState, dispatch]}>
      {children}
    </TopLevelStateContext.Provider>
  );
};

export const useTopLevelState: () => [
  TopLevelState,
  React.Dispatch<Action>
] = () => useSafeContext(TopLevelStateContext, "Top level state");
