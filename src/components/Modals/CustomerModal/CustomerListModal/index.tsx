
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {ChangeEvent, useCallback, useState , useEffect} from 'react';
import { useToast} from 'context/toast'
import Modal from 'react-modal'
import { useCustomer } from 'context/customer'
import { FiX } from 'react-icons/fi';
import Loader from 'react-spinners/PulseLoader';
import api from 'services/api';
import { FaFileAlt } from 'react-icons/fa';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { personTypes } from 'Shared/utils/commonListValues';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { Container } from './styles';

interface CustomerGroup {
  id: string;
  value: string;
}

interface SelectData {
  id: string;
  label: string;
}

export default function CustomerListModal() {

  const {isCustomerListModalOpen, handleCloseCustomerListModal } = useCustomer()
  const {addToast} = useToast() 
  const [customerGroup , setCustomerGroup] = useState<SelectData[]>([]); // grupo de clientes
  const [customerGroupValue , setCustomerGroupValue] = useState(''); // group field value
  const [customerGroupId , setCustomerGroupId] = useState(''); // group field id
  const [ reportLayout, setReportLayout] = useState('simple'); // layout
  const [ reportTypePerson, setReportTypePerson] = useState('N'); // pessoa fisica
  const [ reportFantasia, setReportFantasia] = useState(''); // nome fantasia 
  // const [isGeneratingReport2, setIsGeneratingReport2] = useState<boolean>(false); // handle flag is generating report
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [groupSearchTerm , setGroupSearchTerm] = useState(''); 

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)

  useEffect(() => {

    LoadGroups()

  },[]);

  useDelay(() => {
        
    if (groupSearchTerm.length > 0){
      LoadGroups()
    }

  }, [groupSearchTerm], 1000)

  // when exists report id verify if is avalaliable by 5 minutes
  useEffect(() => {

    if (idReportGenerate > 0){

      const checkInterval = setInterval(() => { CheckReportPending() }, 5000);

      return () => {
        clearTimeout(checkInterval);
      };
    }

  },[idReportGenerate])

  // Check is report is already 
  const CheckReportPending = useCallback(async () => {
              
    if (isGeneratingReport){
    
        const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
          id: idReportGenerate,
          token: localStorage.getItem('@GoJur:token')
        })

        if (response.data == "F"){
          OpenReportAmazon()
        }

        if(response.data == "E"){
          setIsGeneratingReport(false)
          setButtonText("Gerar Relatório")
  
          addToast({
            type: "error",
            title: "Operação não realizada",
            description: "Não foi possível gerar o relatório."
            
          })
        }
    }
      
  },[isGeneratingReport, idReportGenerate])

  // Open link with report
  const OpenReportAmazon = async() => {
    
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    });      

    setIsGeneratingReport(false)
    setIdReportGenerate(0)
    handleCloseCustomerListModal()

    window.open(`${response.data.des_Parametro}`, '_blank');     
  } 
   

  const LoadGroups = async (stateValue?: string) => {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');

        const filter = stateValue == 'reset'? '': groupSearchTerm
        setIsLoadingComboData(true)

        const response = await api.post<CustomerGroup[]>('/Clientes/ListarGrupoClientes', {
          filterClause: filter,
          token: tokenapi,
        });

        const listSelectData: SelectData[] = []; //
      
        response.data.map((item) => {
          listSelectData.push({
            id: item.id, 
            label:item.value
          })

          return listSelectData
        })

      setCustomerGroup(listSelectData)
      setIsLoadingComboData(false)

      } catch (err) {
        console.log(err);
      }
    }

  const handleGenerateToReport = useCallback(async() => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      setIsGeneratingReport(true)    

      if (!reportLayout){
        addToast({
          type: "info",
          title: "Não foi possível completar a operação",
          description:  "Nenhum layout de relatório foi definido, escolha um modelo e tente novamente"
        })

        setIsGeneratingReport(false)    
        return
      }

      const response = await api.post('/Clientes/RelatorioCLientes', {
        customerGroupId:  Number(customerGroupId),
        filterDesc: `Grupo de Cliente: ${customerGroupValue}`,
        peopleType: `${reportTypePerson}`,
        peopleFantasyName: reportFantasia,
        layout: reportLayout,
        token
      })
      
      setIsGeneratingReport(false)  
      
      // reset initial values
      setReportLayout('simple')
      setReportTypePerson('N')
      setReportFantasia('')
      setCustomerGroupId('')
      setCustomerGroupValue('')
      
      // handleCloseCustomerListModal()

      setIsGeneratingReport(true)
      setIdReportGenerate(response.data)

    } catch (err) {
      setIsGeneratingReport(false)    
      addToast({
        type: "info",
        title: "Falha ao gerar o relatório",
        description:  "Não foram encontrados clientes, verifique os filtros aplicados"
      })
      
    }
  },[addToast, customerGroupId, customerGroupValue, reportFantasia, reportLayout, reportTypePerson]); 

  const handleLoadGroups = (item: any) => {
    
    if (item){
      setCustomerGroupValue(item.label)
      setCustomerGroupId(item.id)
    }else{
      setCustomerGroupId('')
      setCustomerGroupValue('')
      LoadGroups('')
    }
  }

  const handleLayoutOptions = (item: any) => {
    
    if (item){
      setReportLayout(item.id)
    }else{
      setReportLayout('')
    }
  }

  const handlePeopleType = (item: any) => {
    
    if (item){
      setReportTypePerson(item.id)      
    }else{
      setReportTypePerson('')
    }
  }

  const layoutOptions = [
    { label: 'Lista Simples', id: 'simple'},
    { label: 'Ficha Detalhada', id: 'detailedRecord'},
    { label: 'Excel', id: 'excel'}
  ]

  // same as creating your state variable where "Next" is the default value for buttonText and setButtonText is the setter function for your state variable instead of setState
  const [buttonText, setButtonText] = useState("Gerar Relatório");

  const changeText = (text) => setButtonText(text);

  return (
    <Modal
      isOpen={isCustomerListModalOpen} 
      onRequestClose={handleCloseCustomerListModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      { !isGeneratingReport && (
        <button 
          type="button" 
          className="react-modal-close"
          onClick={handleCloseCustomerListModal} 
        >
          <FiX size={20} />
        </button>
      )}

      <Container>
        <h1>Selecione um ou mais filtros para relatório de clientes</h1>
        
        <div>

          <AutoCompleteSelect className='selectData'>
            <p>Grupo de Cliente</p>
            <Select
              isSearchable   
              isClearable
              placeholder="Selecione"
              onChange={(item) => handleLoadGroups(item)}
              onInputChange={(term) => setGroupSearchTerm(term)}
              loadingMessage={loadingMessage}
              noOptionsMessage={noOptionsMessage}
              isLoading={isLoadingComboData}
              styles={selectStyles}              
              options={customerGroup}
            />
          </AutoCompleteSelect>

          <AutoCompleteSelect className='autoSelect'>
            <p>Layout</p>
            <Select
              isSearchable   
              styles={selectStyles}         
              defaultValue={layoutOptions.filter(options => options.id === 'simple')}
              placeholder="Selecione"
              onChange={(item) => handleLayoutOptions(item)}
              options={layoutOptions}
            />
          </AutoCompleteSelect>
          
          <label htmlFor="fantasia">
            <p>Nome Fantasia</p>
            <input 
              type="text" 
              id="fantasia"
              autoComplete="off"
              value={reportFantasia}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setReportFantasia(e.target.value)}
            />
          </label>
          
          <AutoCompleteSelect className='selectData'>
            <p>Tipo Pessoa</p>
            <Select
              isSearchable   
              isClearable
              styles={selectStyles}         
              placeholder="Selecione"
              onChange={(item) => handlePeopleType(item)}
              options={personTypes}
            />
          </AutoCompleteSelect>

        </div>

      </Container>

      <br />
      
      <div style={{marginLeft: '35%'}}>
        <button 
          className="buttonClick"
          type='button'
          onClick={()=>{ handleGenerateToReport(); changeText("Gerando Relatório ") }}
          title="Clique para gerar o documento selecionado"
        >
          <FaFileAlt />
          {buttonText}
          {isGeneratingReport && <Loader size={5} color="var(--orange)" /> }
        </button>  
      </div>

    </Modal>
  );
};

 
