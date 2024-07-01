/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal'
import { useCustomer } from 'context/customer'
import { useToast } from 'context/toast'
import { FiX } from 'react-icons/fi';
import api from 'services/api';
import { envProvider } from 'services/hooks/useEnv';
import Loader from 'react-spinners/PulseLoader';
import { FaFileAlt } from 'react-icons/fa';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { months } from 'Shared/utils/commonListValues';
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

export default function BirthdayModal() {

  const {isBirthdayModalOpen, handleCloseBirthdayModal } = useCustomer();
  const {addToast } = useToast();
  const [ customerGroup , setCustomerGroup] = useState<SelectData[]>([]); // grupo de clientes
  const [ customerGroupValue , setCustomerGroupValue] = useState(''); // group field value
  const [ customerGroupId , setCustomerGroupId] = useState(''); // group field id
  const [ reportLayout, setReportLayout] = useState('Birthdaysimple'); // layout
  const [ reportBirthday, setReportBirthday] = useState('currentMonth'); // aniversario
  const [ reportInitialDate, setReportInitialDate] = useState('01'); // aniversario date select
  const [ reportEndDate, setReportEndDate] = useState('01'); // aniversario date select
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [groupSearchTerm , setGroupSearchTerm] = useState(''); 

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)

  useEffect(() => {

    LoadGroups()

  },[]);

  // when exists report id verify if is avaiable every 5 seconds
  useEffect(() => {

    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 5000);
    }

  },[idReportGenerate])

  // Check is report is already 
  const CheckReportPending = useCallback(async (checkInterval) => {
              
    if (isGeneratingReport){
        const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
          id: idReportGenerate,
          token: localStorage.getItem('@GoJur:token')
        })

        if (response.data == "F" && isGeneratingReport){
          
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
          setButtonText("Gerar Relatório")
          OpenReportAmazon()
        }

        if (response.data == "E"){
          clearInterval(checkInterval);
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

    setIdReportGenerate(0)
    handleCloseBirthdayModal()

    window.open(`${response.data.des_Parametro}`, '_blank');     
  } 
  

  const handleGenerateToReport = useCallback(async() => {

    if (isGeneratingReport){
      return;
    }
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      setIsGeneratingReport(true)   

      const response = await api.post('/Clientes/RelatorioAniversario', {
        customerGroupId: Number(customerGroupId),
        filterDesc: `Grupo de Cliente: ${customerGroupValue}`,
        dateDesc: reportBirthday === 'custom'? `custom-${reportInitialDate}-${reportEndDate}` : reportBirthday,
        layout: reportLayout,
        token
      })

      setCustomerGroupValue('')
      setCustomerGroupId('')
      setReportLayout('Birthdaysimple')
      setCustomerGroupId('currentMonth')
      setReportInitialDate('01')
      setReportEndDate('01')
      
      setIdReportGenerate(response.data)

    } catch (err: any) {
      setIsGeneratingReport(false)
      setButtonText("Gerar Relatório")
      addToast({
        type: "info",
        title: "Falha ao gerar o relatório",
        description:  err.response.data.Message
      })
    }
    },[addToast, customerGroupId, customerGroupValue, reportBirthday, reportEndDate, reportInitialDate, reportLayout]); 

    useDelay(() => {
        
      if (groupSearchTerm.length > 0){
        LoadGroups()
      }
  
    }, [groupSearchTerm], 1000)

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
    
    const layoutOptions = [
      { label: 'Lista Simples', id: 'Birthdaysimple'},
      { label: 'Excel', id: 'Birthdayexcel'}
    ]
  
    const monthBirthday = [
      { label: 'Mês Atual', id: 'currentMonth'},
      { label: 'Próximo Mês', id: 'nextMonth'},
      { label: 'Selecionar datas', id: 'custom'}
    ]
    
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

    const handleTypeLayout = (item: any) => {
    
      if (item){
        setReportLayout(item.id)
      }else{
        setCustomerGroupValue('')
      }
    }

    const handleBirthdayMonth = (item: any) => {
    
      if (item){
        
        setReportBirthday(item.id)
      }else{
        setReportBirthday('')
      }
    }

    const handleStartMonth = (item: any) => {
    
      if (item){
        setReportInitialDate(item.id)
      }else{
        setReportInitialDate('')
      }
    }

    const handleEndMonth = (item: any) => {
    
      if (item){
        setReportEndDate(item.id)
      }else{
        setReportEndDate('')
      }
    }

    const [buttonText, setButtonText] = useState("Gerar Relatório");
    const changeText = (text) => setButtonText(text);

  return (
    <Modal
      isOpen={isBirthdayModalOpen} 
      onRequestClose={handleCloseBirthdayModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      {!isGeneratingReport && (
        <button 
          type="button" 
          className="react-modal-close"
          onClick={handleCloseBirthdayModal} 
        >
          <FiX size={20} />
        </button>
      )}

      <Container>
        <h1>Selecione um ou mais filtros para o relatório de clientes</h1>
        
        <div>
          
          <AutoCompleteSelect className='autoSelect'>
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

          <AutoCompleteSelect className='selectData'>
            <p>Layout</p>
            <Select
              isSearchable   
              styles={selectStyles}
              defaultValue={layoutOptions.filter(item => item.id ==="Birthdaysimple")}
              placeholder="Selecione"
              onChange={(item) => handleTypeLayout(item)}
              options={layoutOptions}
            />
          </AutoCompleteSelect>


          <AutoCompleteSelect style={{width:'186%'}} className='selectData'>
            <p>Aniversário</p>
            <Select
              isSearchable   
              placeholder="Selecione"
              styles={selectStyles}       
              defaultValue={monthBirthday.filter(item => item.id === "currentMonth")}
              onChange={(item) => handleBirthdayMonth(item)}
              options={monthBirthday}
            />
          </AutoCompleteSelect>
         
          {reportBirthday !== 'custom' ? (
              null
         ) : (
           <>
             <br />
             
             <AutoCompleteSelect className='selectData'>
               <p>De:</p>
               <Select
                 isSearchable   
                 placeholder="Selecione"
                 styles={selectStyles}       
                 defaultValue={months.filter(item => item.id ==="01")}
                 onChange={(item) => handleStartMonth(item)}
                 options={months}
               />
             </AutoCompleteSelect>

             <AutoCompleteSelect className='selectData'>
               <p>Até:</p>
               <Select
                 isSearchable   
                 placeholder="Selecione"
                 styles={selectStyles}       
                 defaultValue={months.filter(item => item.id ==="01")}
                 onChange={(item) => handleEndMonth(item)}
                 options={months}
               />
             </AutoCompleteSelect>

           </>
         )}
         
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

