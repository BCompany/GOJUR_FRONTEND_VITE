import React, { createContext, useCallback, useContext, useState } from 'react'

interface TriggerContextData {
  handleTriggerExecute(value:boolean): void;
  handleTriggerCaller(value:string): void;
  triggerExecute: boolean;
  triggerCaller: string;
}

const TriggerContext = createContext<TriggerContextData>({} as TriggerContextData);

const TriggerProvider: React.FC = ({children}) => {

  const [triggerExecute, setExecute] = useState<boolean>(false)
  const [triggerCaller, setCaller] = useState<string>('')

  const handleTriggerExecute = useCallback((value:boolean) => {
    setExecute(value)
  },[])

  const handleTriggerCaller = useCallback((value:string) => {
    setCaller(value)
    // setExecute((value??"").length != 0)
  },[])

  return (

    <TriggerContext.Provider
      value={{
        handleTriggerExecute,
        handleTriggerCaller,
        triggerExecute,
        triggerCaller
      }}
    >
      {children}
    </TriggerContext.Provider>
  
    )
}

function useTrigger(): TriggerContextData {
  const context = useContext(TriggerContext);

  if (!context) {
    throw new Error('useTrigger usa como dependencia o ModalProvider');
  }

  return context;
}

export { TriggerProvider, useTrigger };