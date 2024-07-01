import React, { createContext,  useContext, useState, useCallback } from 'react';

// Type Inactive is used to inform caller to rebuild a filter 

interface StateContextData {
  stateType: 'Finance' | 'Matter' | 'Publication' | 'Inactive';
  jsonStateObject: string;  
  handleJsonStateObject(value:string): void;  
  handleStateType(value: 'Finance' | 'Matter' | 'Publication' | 'Inactive'): void;
}

const statesContext = createContext<StateContextData>({} as StateContextData);

const StateFilterProvider: React.FC =  ({ children }) => {
  
  const [jsonStateObject, setJsonStateObject] = useState<string>('');
  const [stateType, setStateType] = useState<'Finance' | 'Matter' | 'Publication' | 'Inactive'>('Inactive');

  const handleJsonStateObject = useCallback((value:string) => {
    setJsonStateObject(value)
  }, []);

  const handleStateType = useCallback((value:'Finance' | 'Matter' | 'Publication' | 'Inactive') => {
    setStateType(value)
  }, []);

  return (

    <statesContext.Provider
      value={{
          handleJsonStateObject,
          handleStateType,
          jsonStateObject,
          stateType
        }}
    >
      {children}
    </statesContext.Provider>

  );
};

function useStateContext(): StateContextData {
  const context = useContext(statesContext);

  if (!context) {
    throw new Error('useConfirmBox usa como dependencia o ModalProvider');
  }

  return context;
}

export { StateFilterProvider, useStateContext };