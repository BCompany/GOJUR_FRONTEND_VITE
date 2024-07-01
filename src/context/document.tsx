import React, {createContext, useCallback, useContext, useState } from 'react';
import api from 'services/api';
import { useDelay } from 'Shared/utils/commonFunctions';
import { useToast } from './toast';

interface LegalPersonProps {
  legalPersonCount: number;
  representativeAgentCount: number;
}

// cannot change name label to another like value because will be affect directally the select autocomplete
interface ProcessListProps {
  id: string;
  label: string;
}

// cannot change name label to another like value because will be affect directally the select autocomplete
interface LegalPersonListProps {
  id: string;
  label: string;
}

// cannot change name label to another like value because will be affect directally the select autocomplete
interface DocumentListProps {
  id: string;
  label: string;
  documentType: string;
  HasLegalPersonContent: boolean;
  HasRepresentativeAgentContent: boolean;
}

interface DocumentContextData {
  customerQtdeProcess: number;
  customerQtdeLegalPerson: LegalPersonProps;
  documentList: DocumentListProps[];
  processList: ProcessListProps[];
  processTermSearch: string;
  legalPersonTermSearch: string;
  legalPrepostoTermSearch: string;
  peopleId: number;
  legalPersonList: LegalPersonListProps[];
  prepostoList: LegalPersonListProps[];
  isLoadingDocumentData: boolean;
  isOpenDocumentModal: boolean;
  isBlockButton: boolean;
  handleLoadInitialPropsFromDocument: (peopleId: number) => void;
  handleLoadDocumentModelList: (optionsType: string, modalName: string) => void;
  handleProcessSearchTerm: (term: string) => void;
  handleLegalPersonTermSearchTerm: (term: string) => void;
  handlePrepostoSearchTerm: (term: string) => void;
  loadProcess: (searchTerm: string) => void;
  loadLegalPerson: (searchTerm: string) => void;
  loadLegalPreposto: (searchTerm: string) => void;
  handleOpenDocumentModal: (value: boolean) => void;
  handleResetValues: () => void;
  handleBlockButton: (term: boolean) => void;
}
const DocumentContext = createContext({} as DocumentContextData);

const DocumentProvider: React.FC = ({ children }) => {
  const { addToast } = useToast();

  const [customerQtdeProcess, setCustomerQtdeProcess] = useState(0);
  const [customerId, setCustomerId] = useState<number>(0);
  const [customerQtdeLegalPerson, setCustomerQtdeLegalPerson] = useState({} as LegalPersonProps)
  const [documentList , setDocumentList] = useState<DocumentListProps[]>([]);
  const [processList , setProcessList] = useState<ProcessListProps[]>([]);
  const [processTermSearch , setProcessTermSearch] = useState<string>('');
  const [legalPersonTermSearch , setLegalPersonTermSearch] = useState<string>('');
  const [legalPrepostoTermSearch , setLegalPrepostoTermSearch] = useState<string>('');
  const [legalPersonList , setLegalPersonList] = useState<LegalPersonListProps[]>([]);
  const [prepostoList , setPrepostoList] = useState<LegalPersonListProps[]>([]);
  const [isLoadingDocumentData , setIsLoadingDocumentData] = useState<boolean>(false);
  const [isBlockButton , setisBlockButton] = useState<boolean>(true);
  const [isOpenDocumentModal , setIsOpenDocumentModal] = useState<boolean>(false);

  // load process using delay
  useDelay(() => {
    
    if (processTermSearch.length == 0 && !isLoadingDocumentData){
      return;
    }

    loadProcess(processTermSearch);

  },[processTermSearch], 1000)
  
  // load legal person using delay
  useDelay(() => {
    
    if (legalPersonTermSearch.length == 0 && !isLoadingDocumentData){
      return;
    }

    loadLegalPerson(legalPersonTermSearch);

  },[legalPersonTermSearch], 1000)

  // load preposto using delay
  useDelay(() => {
    
    if (legalPrepostoTermSearch.length == 0 && !isLoadingDocumentData){
      return;
    }

    loadLegalPreposto(legalPrepostoTermSearch);

  },[legalPrepostoTermSearch], 1000)

  const handleOpenDocumentModal = (value:boolean) => {
    setIsOpenDocumentModal(value)
  }

  const loadProcess = async(searchTerm: string) => {
    const token = localStorage.getItem('@GoJur:token');

    if(customerId === 0) return;
    try {

      const response = await api.post('/DocumentosModelo/ListarProcessoPorCliente', {
          peopleId: customerId,
          // qualificationType: "all",
          filterDesc: searchTerm,
          token
      })

      const processListData:ProcessListProps[] = [] 

      if (response.data.length ==0){
        processListData.push({
          id:'0',
          label: ''
        })

        return processListData
      }

      // convert list response to object
      response.data.map((item) => {
        processListData.push({
          id: item.id, 
          label: item.value
        })

        return processListData;
      })

      setProcessList(processListData)

    } catch (error) {
      addToast({
        title: 'Falha ao carregar processos',
        type: 'error',
        description: 'Não foi possível carregar os processos para essa operação'
      })
    }
  }

  const loadLegalPerson = async(searchTerm: string) => {

    const token = localStorage.getItem('@GoJur:token');

    if(customerId === 0) return;
    try {
      const response = await api.post('/DocumentosModelo/ListarRepresentanteLegalPorCliente', {
          peopleId: customerId,
          qualificationType: 'all',
          filterDesc: searchTerm,
          token
      })

      // convert list response to object
      const personListData:ProcessListProps[] = [] 

      if (response.data.length ==0){
        personListData.push({
          id:'0',
          label: ''
        })
        personListData.push({
          id:'0',
          label: ''
        })

        return personListData
      }

      response.data.map((item) => {
        personListData.push({
          id: item.id, 
          label: item.value
        })

        return personListData;
      })

      if (personListData.length ==1){
        personListData.push({
          id:'0',
          label: ''
        })

        return personListData
      }

      setLegalPersonList(personListData)

    } catch (error) {
      addToast({
        title: 'Falha ao carregar processos',
        type: 'error',
        description: 'Não foi possível carregar os processos para essa operação'
      })
    }
  }

  const loadLegalPreposto = async(searchTerm?: string) => {

    const token = localStorage.getItem('@GoJur:token');

    if(customerId === 0) return;
    try {
      const response = await api.post('/DocumentosModelo/ListarRepresentanteLegalPorCliente', {
          peopleId: customerId,
          qualificationType: 'representativeAgent',
          filterDesc: searchTerm,
          token
      })

      // convert list response to object
      const personListData:ProcessListProps[] = [] 

      if (response.data.length ==0){
        personListData.push({
          id:'0',
          label: ''
        })

        return personListData
      }
      
      response.data.map((item) => {
        personListData.push({
          id: item.id, 
          label: item.value
        })

        return personListData;
      })

      setPrepostoList(personListData)

    } catch (error) {
      addToast({
        title: 'Falha ao carregar processos',
        type: 'error',
        description: 'Não foi possível carregar os processos para essa operação'
      })
    }
  }

  const handleProcessSearchTerm = (term: string) => {
    setProcessTermSearch(term)
  }

  const handleLegalPersonTermSearchTerm = (term: string) => {
    setLegalPersonTermSearch(term)
  }

  const handlePrepostoSearchTerm = (term: string) => {
    setLegalPrepostoTermSearch(term)
  }

  const handleBlockButton = (term: boolean) => {
    setisBlockButton(term)
  }

  const handleLoadInitialPropsFromDocument = useCallback(
    async (peopleId: number) => {
      setCustomerId(peopleId)
      // pega a quantidade de processos do cliente
      try {
        const token = localStorage.getItem('@GoJur:token');

        const response = await api.post(
          '/DocumentosModelo/QuantidadeProcessosPorCliente',
          {
            peopleId,
            token,
          },
        );

        setCustomerQtdeProcess(response.data);
        handleBlockButton(false)
      } catch (error) {
        handleBlockButton(false)
        addToast({
          title: 'Falha na operação ',
          type: 'error',
          description:
            'Falha não foi possivel carregar os dados necessarios para realizar essa operação',
        });
      }

      // pega a quantidade de representante legal do cliente
      try {
        const token = localStorage.getItem('@GoJur:token');

        const response = await api.post<LegalPersonProps>(
          '/DocumentosModelo/QuantidadeRepresentantesLegaisPorCliente',
          {
            peopleId,
            token,
          },
        );

        setCustomerQtdeLegalPerson(response.data);
        handleBlockButton(false)
      } catch (error) {
        handleBlockButton(false)
        addToast({
          title: 'Falha na operação ',
          type: 'error',
          description:
            'Falha não foi possivel carregar os dados necessarios para realizar essa operação',
        });
      }
    },
    [addToast],
  ); // carrega os valores iniciais para a tela de documentos -- qtde processos e qtde representante legal

  const handleLoadDocumentModelList = useCallback(
    async (optionsType = "'CL', 'PR", modelName: string) => {
      try {

        const token = localStorage.getItem('@GoJur:token');
        setIsLoadingDocumentData(true)

        const response = await api.post<DocumentListProps[]>(
          '/DocumentosModelo/ListarPorFiltro',
          {
            documentType: optionsType,
            filterDesc: modelName,
            token
          },
        );

        setDocumentList(response.data);    
        setIsLoadingDocumentData(false)
        handleBlockButton(false)

      } catch (err) {
        handleBlockButton(false)
        addToast({
          title: 'Falha na operação ',
          type: 'error',
          description:
            'Falha não foi possivel carregar os dados necessarios para realizar essa operação',
        });
      }
    },
    [addToast],
  );

  const handleResetValues = useCallback(() => {
      setProcessList([])
      setLegalPersonList([])
      setPrepostoList([])
      setProcessTermSearch("")
      setLegalPersonTermSearch("")
      setLegalPrepostoTermSearch("")
    },[]);


  return (
    <DocumentContext.Provider
      value={{
        customerQtdeLegalPerson,
        customerQtdeProcess,
        peopleId: customerId,
        documentList,
        prepostoList,
        processList,
        legalPersonTermSearch,
        legalPrepostoTermSearch,
        legalPersonList,
        isLoadingDocumentData,
        processTermSearch,
        isOpenDocumentModal,
        isBlockButton,
        handleLoadDocumentModelList,
        handleProcessSearchTerm,
        handlePrepostoSearchTerm,
        handleLegalPersonTermSearchTerm,
        handleLoadInitialPropsFromDocument,
        handleOpenDocumentModal,
        loadProcess,
        loadLegalPerson,
        loadLegalPreposto,
        handleResetValues,
        handleBlockButton
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

function useDocument(): DocumentContextData {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error('useDocument usa como dependencia o DocumentProvider');
  }

  return context;
}

export { DocumentProvider, useDocument };
