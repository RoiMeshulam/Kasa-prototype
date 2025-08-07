import { createContext, PropsWithChildren, useState } from "react";

type MachineState = {
  counter: number;
  insert: () => void;
  reset: () => void;
};

export const MachineContext = createContext<MachineState>({
  counter: 0,
  insert: () => {},
  reset: () => {},
});

export const MachineProvider = ({ children }: PropsWithChildren) => {
  const [counter, setCounter] = useState(0);

  const insert = () => setCounter((prev) => prev + 1);

  const reset = () => {
    setCounter(0);
  };

  return (
    <MachineContext.Provider value={{ counter, insert, reset }}>
      {children}
    </MachineContext.Provider>
  );
};
