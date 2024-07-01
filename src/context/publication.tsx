/* eslint-disable no-useless-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
import React, { createContext, useCallback, useContext, useState } from 'react';

import PublicationDatail from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/Publicacoes/PublicationDetail';
import AssociatedProcessModal from 'components/Modals/PublicationModal/AssociatedProcessModal';
import { useToast } from 'context/toast';
import NameModal from 'components/Modals/PublicationModal/NameModal';
import EmailModal from 'components/Modals/PublicationModal/EmailModal';
import CalcModal from 'components/Modals/PublicationModal/DeadLineCalculator';
import { CompromissosData, PublicationData, PublicationDto } from './Interfaces/IPublication';

interface PublicationContextData {
  isReportModalOpen: boolean;
  handleOpenReportModal: () => void;
  handleCloseReportModal: () => void;
  handleDetails(data: PublicationData): PublicationData;
  handleDetailsAnyType(data: any): any;
  handleCloseDetails(): void;
  handleReload(trigger: boolean): void;
  handleMatterAssociated: (trigger: boolean) => void;
  handlePublicationModal(
    type:
      | 'Email'
      | 'Name'
      | 'Calc'
      | 'CalendarModal' 
      | 'Associated'
      | 'CalendarRead'
      | 'None',
    data?: PublicationDto[],
  ): void;
  data: PublicationData;
  reloadTrigger: boolean;
  matterAssociated: boolean;
  handleSetFilterName(value: 'pubNameAll' | 'filterNameFalse'): void;
  handleSetFilterChanged(value: true | false): void;
  filterChanged: false | true,
  filterName: 'pubNameAll' | 'filterNameFalse';
}

const PublicationContext = createContext({} as PublicationContextData);

const PublicationProvider: React.FC = ({ children }) => {
  const { addToast } = useToast();
  const [publicationData, setPublicationData] = useState({} as PublicationData);
  const [publicationModalType, setPublicationModalType] = useState<
    | 'Email'
    | 'Name'
    | 'Calc'
    | 'CalendarModal'
    | 'Associated'
    | 'CalendarRead'
    | 'None'
  >('None');
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [filterChanged, setFilterChanged] = useState<true | false>(false);
  const [matterAssociated, setMatterAssociated] = useState<true | false>(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [eventData, setEventData] = useState<CompromissosData[]>([]);
  const [filterName, setFilterName] = useState<'pubNameAll' | 'filterNameFalse'>('filterNameFalse');
  const [isReportModalOpen , setIsReportModalOpen] = useState(false);

  const handleOpenReportModal = useCallback(() => {
    setIsReportModalOpen(true)
  },[]);

  const handleCloseReportModal = useCallback(() => {
    setIsReportModalOpen(false)
  },[]);

  const handleDetails = useCallback(
    (data): PublicationData => {
      setPublicationData(data);

      if (publicationData !== undefined) {
        setOpenDetail(true);
      }

      return publicationData;
    },
    [publicationData],
  );

  const handleDetailsAnyType = useCallback((data): any => {
      setPublicationData(data as PublicationData);
    },
    [publicationData],
  );

  const handleReload = useCallback(trigger => {
    setReloadTrigger(trigger);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setOpenDetail(openDetail);
  }, [openDetail]);


  const handlePublicationModal = useCallback(
    (
      
      type:
        | 'Email'
        | 'Name'
        | 'Calc'
        | 'CalendarModal'
        | 'CalendarRead'
        | 'None',
      data?: PublicationDto[],      
    ) => {
      if (type === 'CalendarRead') {

        if (!data) return;

        const { hasEvent } = data[0];

        if (!hasEvent) {
          addToast({
            type: 'info',
            title: '',
            description:
              'A publicação selecionada ainda não possui prazos cadastrados',
          });
        } else {
          setPublicationModalType(type);

          const dataEvent = data[0].eventList;
          setEventData(dataEvent);
        }
      } else {    
        setPublicationModalType(type);
      }
    },
    [addToast],
  );

  const handleSetFilterName = useCallback(
    (value: 'pubNameAll' | 'filterNameFalse') => {
      
      setFilterName(value);
    
    },[]
  );

  const handleSetFilterChanged = useCallback( (value: true | false) => {
      
      setFilterChanged(value);
    
    },[]
  );

  const handleMatterAssociated = useCallback((value: true | false) => {
      
      setMatterAssociated(value);
    
    },[]
  );
  
  return (
    <PublicationContext.Provider
      value={{
        isReportModalOpen,
        handlePublicationModal,
        handleDetails,
        handleDetailsAnyType,
        handleCloseDetails,
        handleReload,
        handleSetFilterName,
        handleSetFilterChanged,
        handleMatterAssociated,
        handleOpenReportModal,
        handleCloseReportModal,
        matterAssociated,
        filterName,
        filterChanged,
        data: publicationData,
        reloadTrigger,
      }}
    >
      {children}

      {openDetail ? (
        <PublicationDatail
          handleDetails={openDetail}
          handleCloseDetails={() => {
            setOpenDetail(false);
            localStorage.removeItem('@GoJur:AppointmentId');
          }}
        />
      ) : null}
      
      {publicationModalType === 'Name' ? (
        <NameModal />
      ) : publicationModalType === 'Email' ? (
        <EmailModal />
      ) : publicationModalType === 'Calc' ? (
        <CalcModal />
      ) : publicationModalType === 'Associated' ? (
        <AssociatedProcessModal />
      ) :null}

    </PublicationContext.Provider>
  );
};

function usePublication(): PublicationContextData {
  const context = useContext(PublicationContext);

  if (!context) {
    throw new Error('usePublication usa como dependencia o ModalProvider');
  }

  return context;
}

export { PublicationProvider, usePublication };
