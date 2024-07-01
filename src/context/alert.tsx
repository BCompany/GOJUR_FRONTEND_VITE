import React, { createContext, useCallback, useContext, useState } from 'react';
import api from 'services/api';

interface alertDto {
  cod_Mensagem: number;
  cod_Processo: number;
  dta_Mensagem: string;
  des_Mensagem: string;
  messageType: string;
  warningMessage: boolean;
}
interface MessageIdList {
  id: number;
  value: number;
}
interface AlertContextData {
  alertData: alertDto[];
  openProcessModal: boolean;
  openListMessages: boolean;
  reloadMessages: boolean;
  idProcess: number;
  handleCaptureData(data: alertDto[]): void;
  handleProcessModal(): void;
  handleProcessModalClose(): void;
  handleOpenListMessages(data: MessageIdList[]): void;
  handleCloseListMessages(): void;
  handleReloadMessages(v: boolean): void;
}

const AlertContext = createContext({} as AlertContextData);

const AlertProvider: React.FC = ({ children }) => {
  const [mensagensData, setMensagensData] = useState<alertDto[]>([]);
  const [processeModal, setProcesseModal] = useState(false);
  const [reloadM, setReloadM] = useState(false);
  const [listMessages, setListMessages] = useState(true);
  const [processId, setProcessId] = useState<number>(0);

  const handleCaptureData = useCallback((data: alertDto[]) => {
    setMensagensData(data);
  }, []);

  const handleProcessModal = useCallback(() => {
    setProcesseModal(true);
  }, []);

  const handleProcessModalClose = useCallback(() => {
    localStorage.removeItem('@GoJur:ProcessId');
    setProcesseModal(false);
  }, []);

  const handleOpenListMessages = useCallback(async data => {
    setListMessages(false);

    let list = []

    list = data

    if (list.length > 0) {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');

        await api.post('/Dashboard/SalvarLogMensagens', {
          messageType: 'ALL',
          messageIdsList: data,
          token: tokenapi,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  const handleCloseListMessages = useCallback(() => {
    setListMessages(true);
    setReloadM(true);
  }, []);
  const handleReloadMessages = useCallback((value: boolean) => {
    setReloadM(value);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        alertData: mensagensData,
        openProcessModal: processeModal,
        idProcess: processId,
        openListMessages: listMessages,
        reloadMessages: reloadM,
        handleReloadMessages,
        handleProcessModal,
        handleCaptureData,
        handleProcessModalClose,
        handleOpenListMessages,
        handleCloseListMessages,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

function useAlert(): AlertContextData {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert usa como dependencia o AlertProvider');
  }

  return context;
}

export { AlertProvider, useAlert };
