import React, { createContext,  useContext, useState, useCallback } from 'react';

interface ConfirmContextData {
  isConfirmMessage: boolean;
  isCancelMessage: boolean;
  isCheckConfirm:boolean;
  caller: string;
  handleConfirmMessage(value:boolean): void;
  handleCaller(value:string): void;  
  handleCancelMessage(value:boolean): void;
  handleCheckConfirm(value:boolean): void;
}

const ConfirmContext = createContext<ConfirmContextData>({} as ConfirmContextData);

const ConfirmProvider: React.FC =  ({ children }) => {
  
  const [confirmMessage, setConfirmMessage] = useState<boolean>(false);
  const [cancelMessage, setCancelMessage] = useState<boolean>(false);
  const [checkConfirm, setCheckConfirm] = useState<boolean>(false);
  const [caller, setCaller] = useState<string>('');

  const handleConfirmMessage = useCallback((value:boolean) => {
    if (checkConfirm){
      setConfirmMessage(value)   
    }
  }, [checkConfirm]);

  const handleCancelMessage = useCallback((value:boolean) => {
    setCancelMessage(value)
  }, []);

  const handleCheckConfirm = useCallback((value:boolean) => {
    setCheckConfirm(value)
  }, []);

  const handleCaller = useCallback((value:string) => {
    setCaller(value)
  }, []);

  return (

    <ConfirmContext.Provider
      value={{
          handleConfirmMessage,
          handleCancelMessage,
          handleCheckConfirm,
          handleCaller,
          isConfirmMessage: confirmMessage,
          isCancelMessage: cancelMessage,
          isCheckConfirm:checkConfirm,
          caller
        }}
    >
      {children}
    </ConfirmContext.Provider>

  );
};

function useConfirmBox(): ConfirmContextData {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirmBox usa como dependencia o ModalProvider');
  }

  return context;
}

export { ConfirmProvider, useConfirmBox };