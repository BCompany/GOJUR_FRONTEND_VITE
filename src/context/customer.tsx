import React, { createContext, useCallback, useContext, useState } from 'react';
import { CustomerData, MatterData } from './Interfaces/ICustomer';

interface CustomerContextData {
  isBirthdayModalOpen: boolean;
  isCustomerListModalOpen: boolean;
  isCustomerDocumentModalOpen: boolean;
  customerSearchList: CustomerData[];
  customerMatterList: MatterData[];
  isPaginationCustomer: boolean;
  isEndPaginationCustomer:boolean;
  pageNumberCustomer: number;
  isLoadingCustomerReport: boolean;
  reloadBusinessCard:boolean;
  isReportModalOpen: boolean;
  objectJSON: string;
  isCustomerMergeModalOpen: boolean;  
  handleLoadSearchCustomerList: (data: CustomerData[]) => void
  handleLoadMatterList: (data: MatterData[]) => void
  handleOpenBirthdayModal: () => void;
  handleCloseBirthdayModal: () => void;
  handleOpenCustomerMergeModal: () => void;
  handleCloseCustomerMergeModal: () => void;
  handleOpenCustomerListModal: () => void;
  handleReloadBusinesCard: (value: boolean) => void;
  handleCloseCustomerListModal: () => void;
  handleOpenCustomerDocumentModal: () => void;
  handleCloseCustomerDocumentModal: () => void;
  handleIsPaginationCustomer: (value: boolean) => void;
  handleIsEndPaginationCustomer: (value: boolean) => void;
  handlePageNumberCustomer: (value: number) => void;
  handleIsLoadingCustomerReport: (value: boolean) => void;
  handleOpenReportModal: () => void;
  handleCloseReportModal: () => void;
  handleObjectJSON: (value: string) => void;
 }
 
const CustomerContext = createContext({} as CustomerContextData);

const CustomerProvider: React.FC = ({children}) => {
 
  const [isBirthdayModalOpen , setIsBirthdayModalOpen] = useState(false);
  const [isCustomerMergeModalOpen , setIsCustomerMergeModalOpen] = useState(false);
  const [isCustomerListModalOpen , setIsCustomerListModalOpen] = useState(false);
  const [isCustomerDocumentModalOpen , setIsCustomerDocumentModalOpen] = useState(false);
  const [customerSearchList , setCustomerSearchList] = useState<CustomerData[]>([]);
  const [customerMatterList , setCustomerMatterList] = useState<MatterData[]>([]); 
  const [isPaginationCustomer , setIsPaginationCustomer] = useState<boolean>(false);
  const [objectJSON , setObjectJSON] = useState<string>('');
  const [isEndPaginationCustomer , setIsEndPaginationCustomer] = useState<boolean>(false);
  const [pageNumberCustomer , setPageNumberCustomer] = useState<number>(1);
  const [isLoadingReport , setLoadingReport] = useState<boolean>(false);
  const [reloadBusinessCard , setReloadBusinessCard] = useState<boolean>(false);
  const [isReportModalOpen , setIsReportModalOpen] = useState(false);

  const handleOpenReportModal = useCallback(() => {
    setIsReportModalOpen(true)
  },[]);

  const handleOpenBirthdayModal = useCallback(() => {
    setIsBirthdayModalOpen(true)
  },[]);

  const handleOpenCustomerMergeModal = useCallback(() => {
    setIsCustomerMergeModalOpen(true)
  },[]);

  const handleCloseCustomerMergeModal = useCallback(() => {
    setIsCustomerMergeModalOpen(false)
  },[]);

  const handleOpenCustomerListModal = useCallback(() => {
    setIsCustomerListModalOpen(true)    
  },[]);
  
  const handleCloseCustomerListModal = useCallback(() => {
    setIsCustomerListModalOpen(false)
  },[]);

  const handleOpenCustomerDocumentModal = useCallback(() => {
    setIsCustomerDocumentModalOpen(true)
  },[]);
      
  const handleCloseCustomerDocumentModal = useCallback(() => {
    setIsCustomerDocumentModalOpen(false)
    },[]);

  const handleReloadBusinesCard = useCallback(() => {
    setReloadBusinessCard(!reloadBusinessCard)
  },[]);

  const handleObjectJSON = useCallback((json: string) => {
    setObjectJSON(json)
  },[]);
    
  const handleLoadSearchCustomerList = useCallback((data: CustomerData[]) => {
      setCustomerSearchList(data)
  },[]);

  const handleLoadMatterList = useCallback((data: MatterData[]) => {
    setCustomerMatterList(data)
},[]);

  const handleIsPaginationCustomer = useCallback((value:boolean) => {
    setIsPaginationCustomer(value)
  },[])

  const handleIsEndPaginationCustomer = useCallback((value:boolean) => {
    setIsEndPaginationCustomer(value)
  },[])

  const handlePageNumberCustomer = useCallback((value:number) => {
    setPageNumberCustomer(value)
  },[])

  const handleIsLoadingCustomerReport = useCallback((value:boolean) => {
    setLoadingReport(value)
  },[])

  const handleCloseBirthdayModal = useCallback(() => {
    setIsBirthdayModalOpen(false)
  },[]);

  const handleCloseReportModal = useCallback(() => {
    setIsReportModalOpen(false)
  },[]);
  
  return (
    <CustomerContext.Provider
      value={{
        isCustomerMergeModalOpen,
        isReportModalOpen,
        isBirthdayModalOpen,
        isCustomerListModalOpen,
        isCustomerDocumentModalOpen,
        customerSearchList,
        customerMatterList,
        isPaginationCustomer,
        isEndPaginationCustomer,
        pageNumberCustomer,
        reloadBusinessCard,
        objectJSON,
        isLoadingCustomerReport: isLoadingReport,
        handleCloseBirthdayModal,
        handleReloadBusinesCard,
        handleCloseCustomerListModal,
        handleOpenBirthdayModal,
        handleOpenCustomerListModal,
        handleOpenCustomerDocumentModal,
        handleCloseCustomerDocumentModal,
        handleLoadSearchCustomerList,
        handleLoadMatterList,
        handleIsPaginationCustomer,
        handleIsEndPaginationCustomer,
        handlePageNumberCustomer,
        handleIsLoadingCustomerReport,
        handleOpenReportModal,
        handleCloseReportModal,
        handleObjectJSON,
        handleOpenCustomerMergeModal,
        handleCloseCustomerMergeModal,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

function useCustomer(): CustomerContextData {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomer usa como dependencia o CustomerProvider');
  }

  return context;
}

export { CustomerProvider, useCustomer };

