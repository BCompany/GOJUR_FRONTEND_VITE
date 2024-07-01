/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AppointmentsModal from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment';
import api from 'services/api';
import { useToast } from './toast';

interface ProcessData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
  forumName: string;
  currentInstance: string;
  currentCourt: string;
}
interface ModalContextData {
  isOpenModal(id: string): string;
  isCloseModal(): void;
  selectProcess(data: object | null): void;
  setAppointmentTimeEnd(data: string): void;
  handleDeleteAppointment(): void;
  handleReload(key: string): void;
  handleSelectProcess(open: string): void;
  handleDeadLineCalculatorText(text: string | null): void;
  handleCaptureTextPublication(text: string | null): void;
  handleCaller(key: string): void;
  handleModalActive(value: boolean): void;
  handleModalActiveId(value: number): void;
  handleMatterAssociated(value: boolean): void;
  handleShowVideoTrainning(value: boolean): void;
  handleWorkTeamModal(value: boolean): void;
  handleShowSalesChannelModal(value: boolean): void;
  handleShowSalesFunnelModal(value: boolean): void;
  handleShowOpposingPartyModal(value: boolean): void;
  handleShowThirdPartyModal(value: boolean): void;
  handleShowLawyerModal(value: boolean): void;
  handleShowCustomerModal(value: boolean): void;
  handleShowSalesFunnelStepModal(value: boolean): void;
  handleReferenceId(value: number): void;
  handleJsonModalObjectResult(value: string):void;
  openSelectProcess: string;
  reload: string;
  modalActive: boolean;
  modalActiveId: number;
  caller: string;
  jsonModalObjectResult: string;
  matterSelected: ProcessData | null;
  hasMatterAssociated: boolean;
  dateEnd: string | null;  
  deadLineText: string | null;
  publicationText: string | null;
  showVideoTrainning: boolean;
  showWorkTeamModal: boolean;
  showSalesChannelModal: boolean;
  showSalesFunnelStepModal: boolean;
  showSalesFunnelModal: boolean;
  showOpposingPartyModal: boolean;
  showThirdPartyModal: boolean;
  showLawyerModal: boolean;
  showCustomerModal: boolean;
  referenceId: number;
}

const ModalContext = createContext({} as ModalContextData);

const ModalProvider: React.FC = ({ children }) => {
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalProcess, setAbrirModalProcess] = useState('Close');
  const [processSelect, setProcessSelect] = useState(null);
  const [appointmentDateEnd, setAppointmentDateEnd] = useState('');
  const [appointmentTrigger, setAppointmentTrigger] = useState('');
  const [publicationText, setPublicationText] = useState('');
  const [deadLineText, setDeadLineText] = useState('');
  const [caller, setCaller] = useState('');
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [modalActiveId, setModalActiveId] = useState<number>(0);
  const [isMatterAssociated, setIsMatterAssociated] = useState<boolean>(false);
  const [showVideoTrainning, setShowVideoTrainning] = useState<boolean>(false);
  const [showWorkTeamModal, setShowWorkTeamModal] = useState<boolean>(false);
  const [showSalesChannelModal, setSalesChannelModal] = useState<boolean>(false);
  const [showSalesFunnelStepModal, setShowSalesFunnelStepModal] = useState<boolean>(false);
  const [showSalesFunnelModal, setShowSalesFunnelModal] = useState<boolean>(false);
  const [showOpposingPartyModal, setShowOpposingPartyModal] = useState<boolean>(false);
  const [showThirdPartyModal, setShowThirdPartyModal] = useState<boolean>(false);
  const [showLawyerModal, setShowLawyerModal] = useState<boolean>(false);
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<number>(0);
  const [jsonModalObjectResult, setJsonModalObjectResult] = useState<string>('');

  const { addToast } = useToast();

  const handleSelectProcess = useCallback(open => {

    setAbrirModalProcess(open);
  }, []);

  const isCloseModal = useCallback(() => {
    setAbrirModal(false);
    setAppointmentTrigger('Save');

  }, [abrirModal]);

  const selectProcess = useCallback(data => {
    const matter = data;

    setProcessSelect(matter);
  }, []);

  const setAppointmentTimeEnd = useCallback(data => {
    const dateEnd = data;
    setAppointmentDateEnd(dateEnd);
  }, []);

  const handleShowVideoTrainning = useCallback(state => {
    setShowVideoTrainning(state)

  },[showVideoTrainning])

  const handleWorkTeamModal = useCallback(state => {
    setShowWorkTeamModal(state)

  },[showWorkTeamModal])

  const handleCaller = useCallback(caller => {
    setCaller(caller)

  },[caller])

  const handleModalActiveId = useCallback(id => {
      setModalActiveId(id)
  },[modalActiveId, isModalActive])

  const handleJsonModalObjectResult = useCallback(json => {
    setJsonModalObjectResult(json)

  },[jsonModalObjectResult])
  
  const handleShowSalesChannelModal = useCallback(state => {
    setSalesChannelModal(state)

  },[showSalesChannelModal])

  const handleShowSalesFunnelStepModal = useCallback(state => {
    setShowSalesFunnelStepModal(state)

  },[showSalesFunnelStepModal])

  const handleShowSalesFunnelModal = useCallback(state => {
    setShowSalesFunnelModal(state)

  },[showSalesFunnelModal])
  
  const handleShowOpposingPartyModal = useCallback(state => {
    setShowOpposingPartyModal(state)

  },[showOpposingPartyModal])
  
  const handleShowThirdPartyModal = useCallback(state => {
    setShowThirdPartyModal(state)

  },[showThirdPartyModal])
  
  const handleShowLawyerModal = useCallback(state => {
    setShowLawyerModal(state)

  },[showLawyerModal])

  const handleShowCustomerModal = useCallback(state => {
    setShowCustomerModal(state)

  },[showCustomerModal])

  const handleDeleteAppointment = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');
      
      const appointment = modalActiveId;
      const recurrenceDate = localStorage.getItem('@GoJur:RecurrenceDate');

      await api.post(`/Compromisso/Deletar`, {
        id: appointment,
        token: userToken,
        recurrenceDate,
        serieRecurrenceChange: 'one',
      });

      addToast({
        type: 'success',
        title: 'Compromisso deletado',
        description: 'Seu compromisso foi deletado com sucesso',
      });

      setAbrirModal(!abrirModal);
      setIsModalActive(false)
      setAppointmentTrigger('Save');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Falha ao deletar o compromisso',
        description:
          'Não foi possivel deletar seu compromisso, tente novamente!',
      });
    }
  }, [abrirModal, addToast]);

  const handleReload = useCallback(key => {
    const trigger = key;

    setAppointmentTrigger(trigger);
  }, []);

  const handleCaptureTextPublication = useCallback(text => {

    setPublicationText(text);
  }, []);

  const handleDeadLineCalculatorText = useCallback(text => {
    setDeadLineText(text);
  }, []);

  const handleModalActive = useCallback(value => {
    setIsModalActive(value)
  },[])

  const handleMatterAssociated = useCallback(value => {
    setIsMatterAssociated(value)
  },[])

  const handleReferenceId = useCallback(value => {
    setReferenceId(value)
  },[])  

  const isOpenModal = useCallback((id): string => 
  {
      setAppointmentId(id);

      // Edit event
      if (id !== '' && id != '0') {
        // localStorage.setItem('@GoJur:AppointmentId', id);
        handleModalActiveId(id)
        handleModalActive(true)
        handleCaller('calendarModal')
        setAbrirModal(true);
      }
      // Include event
      if (id === '' || id === '0'){
        handleCaller('calendarModalInclude')
        handleModalActive(true)
        setAbrirModal(true);
      }

      return id;
    },

  []);

  const handleClose = () => {
    
    setAbrirModal(false);            
    handleModalActive(false)
    selectProcess(null);
    handleCaller('')
    setAppointmentTrigger('Save');
    handleCaptureTextPublication('');
    handleDeadLineCalculatorText('');
    localStorage.removeItem('@GoJur:DeadLineJson');
    localStorage.removeItem('@GoJur:PublicationId');
    localStorage.removeItem('@GoJur:MatterEventId');
    localStorage.removeItem('@GoJur:PublicationHasMatter');
    localStorage.removeItem('@fullCalendarDate')
    handleModalActiveId(0)
  }

  return (
    <ModalContext.Provider
      value={{
        isOpenModal,
        isCloseModal,
        selectProcess,
        setAppointmentTimeEnd,
        handleDeleteAppointment,
        handleModalActive,
        handleModalActiveId,
        handleCaller,
        handleReload,
        handleShowVideoTrainning,
        handleWorkTeamModal,
        handleMatterAssociated,
        handleSelectProcess,
        handleCaptureTextPublication,
        handleDeadLineCalculatorText,
        handleReferenceId,
        handleShowSalesChannelModal,
        handleShowSalesFunnelModal,
        handleShowOpposingPartyModal,
        handleShowThirdPartyModal,
        handleShowLawyerModal,
        handleShowCustomerModal,
        handleShowSalesFunnelStepModal,
        handleJsonModalObjectResult,
        reload: appointmentTrigger,
        openSelectProcess: abrirModalProcess,
        matterSelected: processSelect,
        dateEnd: appointmentDateEnd,
        modalActive: isModalActive,
        hasMatterAssociated: isMatterAssociated,
        modalActiveId,
        jsonModalObjectResult,
        publicationText,
        deadLineText,
        caller,
        showVideoTrainning,
        showWorkTeamModal,
        showSalesChannelModal,
        showSalesFunnelModal,
        showOpposingPartyModal,
        showThirdPartyModal,
        showLawyerModal,
        showCustomerModal,
        showSalesFunnelStepModal,
        referenceId
      }}
    >
      {children} 

      {abrirModal ? (
        <AppointmentsModal
          isOpen={abrirModal}
          isClosed={handleClose}
        />
      ) : null}

    </ModalContext.Provider>
  );
};

function useModal(): ModalContextData {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal usa como dependencia o ModalProvider');
  }

  return context;
}

export { ModalProvider, useModal };
