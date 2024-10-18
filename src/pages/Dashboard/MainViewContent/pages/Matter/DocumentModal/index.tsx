/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDocument } from 'context/document';
import { useToast } from 'context/toast';
import {MdBlock} from 'react-icons/md';
import { FcAbout }from 'react-icons/fc';
import api from 'services/api';
import { envProvider } from 'services/hooks/useEnv';
import Loader from 'react-spinners/PulseLoader';
import Select from 'react-select'
import { FaFileAlt } from 'react-icons/fa';
import { BsEye } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { Container } from './styles';

export interface IPeopleMatterDTO{
  cod_Pessoa: string
  nom_Pessoa: string
  flg_Principal: string
}

export interface ISelectData{
  id: string;
  label: string;
  flg_Principal: string
}

export const documentExtensionsList = [
  {id: "1", label: "PDF"},
  {id: "2", label: "WORD (.docx)"}
];

export default function DocumentModal() {

  const { handleLoadDocumentModelList, handleOpenDocumentModal, handleBlockButton, isBlockButton,isOpenDocumentModal, isLoadingDocumentData, documentList, legalPersonList, legalPersonTermSearch, prepostoList, legalPrepostoTermSearch, customerQtdeLegalPerson, loadLegalPerson, loadLegalPreposto, handleLegalPersonTermSearchTerm, handleLoadInitialPropsFromDocument, handleResetValues, handlePrepostoSearchTerm } = useDocument();
  const { addToast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false); 
  const [isVisualizeReport, setIsVisualizeReport] = useState<boolean>(false); 
  const [documentModelName, setDocumentModelName] = useState(''); 
  const [documentModelId, setDocumentModelId] = useState(''); 
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [parameterValue, setParameterValue] = useState<string>('principal')
  const [totalCustomer, setTotalCustomer] = useState<number>(0)
  const [buttonText, setButtonText] = useState("Gerar Relatório");
  const changeText = (text) => setButtonText(text);
  const [documentLPId, setDocumentLPId] = useState('');
  const [documentPrepostoId, setDocumentPrepostoId] = useState('');
  const history = useHistory();
  const [peopleId, setPeopleId] = useState<string>("0")
  const [customerList, setCustomerList] = useState<ISelectData[]>([]);
  const [documentExtensionId, setDocumentExtensionId] = useState(''); 
  const [selectedFormat, setSelectedFormat] = useState(null);
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    changeText("Gerar Documento ")
    handleLoadDocumentModelList("'PR'", '')
    handleResetValues();
    
  }, [])

  useEffect(() => {
    if((peopleId == "all") == false ){
      handleResetValues();
      handleLoadInitialPropsFromDocument(Number(peopleId))
    }
    
  }, [peopleId])

  useEffect(() => {

    async function handleEffects() {
      handleResetValues();
      const filteredDocument = documentList.filter(
        i => i.id === documentModelId,
      );
      const hasLegalPerson = filteredDocument.map(i => i.HasLegalPersonContent);
      const hasPreposto = filteredDocument.map(
        i => i.HasRepresentativeAgentContent,
      );

      if( customerQtdeLegalPerson.legalPersonCount > 1 && hasLegalPerson[0] === true) {
        loadLegalPerson('');
      }
      if(customerQtdeLegalPerson.representativeAgentCount > 1 && hasPreposto[0] === true) {
        loadLegalPreposto('');
      }
    }

    handleEffects();

  }, [addToast, customerQtdeLegalPerson , documentModelId]);


  useEffect(() => {
    const defaultFormat = documentExtensionsList[0]; 
    setSelectedFormat(defaultFormat);
    handleModelDocumentExtensionValue(defaultFormat); 
  }, []);
  

  useDelay(() => {
    
    if (documentModelName.length == 0 && !isLoadingDocumentData){
      return;
    }

    handleLoadDocumentModelList("'PR'", documentModelName);

  },[documentModelName], 1000)

  useEffect(() => {
    
    if (isOpenDocumentModal)
      GetTotalCustomer()

  },[isOpenDocumentModal])

  // When has more than 1 customer, show dropcdown with options all customer or principal
  const GetTotalCustomer = async () => {
  
    const matterId = localStorage.getItem('@GoJur:matterId');

    const response = await api.get<IPeopleMatterDTO[]>('/Processo/ListarClientesPorProcesso', {
        params:{
          token,
          matterId
        }
      })

      const listCustomer: ISelectData[] = []
      response.data.map(item => {
        if(item.flg_Principal == "S"){
          setPeopleId(item.cod_Pessoa)
        }
        return listCustomer.push({
          id: item.cod_Pessoa,
          label: item.nom_Pessoa,
          flg_Principal: item.flg_Principal
        })
      })

      const object:ISelectData = {
        id: "all",
        label: "TODOS",
        flg_Principal: "N",
      }

      setCustomerList(listCustomer)
      setCustomerList(previousValues => [...previousValues, object])
  }

  // visualize report
  const validateParameters = () => {

    if (documentModelId == '' || documentModelId == null){
      setIsGeneratingReport(false)    
      addToast({
        title: 'Operação não realizada',
        type: 'info',
        description: 'Selecione um modelo de relatório para executar a operação',
      });

      changeText("Gerar Documento ")
      return false;
    }

    const filteredDocument = documentList.filter(i => i.id === documentModelId);

    if (filteredDocument.length == 0 || filteredDocument == null){
      setIsGeneratingReport(false)    
      addToast({
        title: 'Operação não realizada',
        type: 'info',
        description: 'Modelo de relatório não encontrado',
      });

      changeText("Gerar Documento ")
      return false;
    }

    return true;
  }

  const handleVisualizeReport = async () => {
        
    const matterId = localStorage.getItem('@GoJur:matterId');

    if (!validateParameters()){
      return;
    }

    const hasError = false;

    setIsVisualizeReport(true)

    const filteredDocument = documentList.find(i => i.id === documentModelId);
    
    const baseUrl = envProvider.redirectUrl;
    const documentId = filteredDocument? Number(filteredDocument.id): 0;

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(documentId)){
      addToast({
        title: 'Falha ao gerar o relatório',
        type: 'info',
        description: 'Modelo de documento inválido / não encontrado',
      });     
      setIsVisualizeReport(false)
      return;
    }   

    // create parameters redirect exclusive for visualization using old implementation on Gojur
    const parametersRedirect = `tpoDocument=PR,matterId=${matterId}
    ",documentModelId=${documentId}` + 
    `,peopleId=null` +
    `,legalPersonId=null` +
    `,representantiveAgentId=null` +
    `,printAllCustomer=${parameterValue}` +
    `,caller=matterModule` 

    const urlRedirect = `${baseUrl}Customer/list?token=${token}&documentModelParams=${parametersRedirect}`
    window.open(urlRedirect, '_parent')

    setDocumentModelId('');
    setDocumentModelName('')
    handleOpenDocumentModal(false);
    setIsVisualizeReport(false)
  
    if (hasError){
      addToast({
        title: 'Falha ao gerar o relatório',
        type: 'error',
        description: 'Não foi possível gerar o relatório, tente novamente',
      });     
      setIsVisualizeReport(false)
      handleOpenDocumentModal(false)
    }

    localStorage.removeItem('@GoJur:matterId')
  }


  const handleVisualizeDocument = useCallback(async () => {

    const matterId = localStorage.getItem('@GoJur:matterId');
    const customerId = localStorage.getItem('@GoJur:customerId');

    if (isGeneratingReport){
      return;
    }

    if (!validateParameters()){
      setIsGeneratingReport(false)   
      return;
    }
    
    const token = localStorage.getItem('@GoJur:token');

    setIsGeneratingReport(true)    
    
    const filteredDocument = documentList.find(i => i.id === documentModelId);

    let legalPersonId
    let caller = "matterModule"

    if (legalPersonList.length > 1 && parameterValue == "principal"){
      legalPersonId = documentLPId
      caller = "hasLegalOrAgent"
    }
    else{
      legalPersonId = null
    }

    let representativeAgentId

    if (prepostoList.length > 1 && parameterValue == "principal"){
      representativeAgentId = documentPrepostoId
      caller = "hasLegalOrAgent"
    }
    else{
      representativeAgentId = null
    }

    const response = await api.post('/DocumentosModelo/VerDocumentoProcesso',
      {
        cod_DocumentoModelo: filteredDocument? Number(filteredDocument.id): 0,
        matterId,
        peopleId:(parameterValue == "principal" || totalCustomer == 0) && (parameterValue != "T")? peopleId: null,
        legalPersonId: legalPersonId == ""? null: legalPersonId,
        representativeAgentId: representativeAgentId == ""? null: representativeAgentId,
        des_Titulo: filteredDocument? filteredDocument.label.toString(): "",
        printAllCustomer: parameterValue,
        caller,
        token,
      },
    );

    localStorage.setItem('@GoJur:documentText', response.data);
    localStorage.setItem('@GoJur:documentLocation', 'matter');
    
    history.push(`/documentmodel/visualize/${filteredDocument? Number(filteredDocument.id): 0}`)
    handleCloseModal()
   
    localStorage.removeItem('@GoJur:matterId')

  }, [documentList, documentModelId, isGeneratingReport, parameterValue, legalPersonList, totalCustomer, documentLPId, documentPrepostoId, prepostoList, parameterValue]);

  
  const handleGenerateReport = useCallback(async () => {

    const matterId = localStorage.getItem('@GoJur:matterId');
    const customerId = localStorage.getItem('@GoJur:customerId');

    if (isGeneratingReport){
      return;
    }

    if (!validateParameters()){
      setIsGeneratingReport(false)   
      return;
    }
    
    const token = localStorage.getItem('@GoJur:token');

    setIsGeneratingReport(true)    
    
    const filteredDocument = documentList.find(i => i.id === documentModelId);

    const extensionId = Number(
      documentExtensionsList
        .filter(extension => extension.id === documentExtensionId)
        .map(extension => extension.id),
    );

    if(extensionId == 0){
      addToast({
        title: 'Não foi possivel completar a operação',
        type: 'info',
        description: 'Para gerar um documento do tipo processo favor selecionar um formato',
      });     
      setIsGeneratingReport(false)   
      return;
    }

    let legalPersonId
    let caller = "matterModule"

    if (legalPersonList.length > 1 && parameterValue == "principal"){
      legalPersonId = documentLPId
      caller = "hasLegalOrAgent"
    }
    else{
      legalPersonId = null
    }

    let representativeAgentId

    if (prepostoList.length > 1 && parameterValue == "principal"){
      representativeAgentId = documentPrepostoId
      caller = "hasLegalOrAgent"
    }
    else{
      representativeAgentId = null
    }

    const response = await api.post(
      '/DocumentosModelo/GerarDocumentoProcesso',
      {
        cod_DocumentoModelo: filteredDocument? Number(filteredDocument.id): 0,
        matterId,
        peopleId:(parameterValue == "principal" || totalCustomer == 0) && (parameterValue != "T")? peopleId: null,
        legalPersonId: legalPersonId == ""? null: legalPersonId,
        representativeAgentId: representativeAgentId == ""? null: representativeAgentId,
        des_Titulo: filteredDocument? filteredDocument.label.toString(): "",
        printAllCustomer: parameterValue,
        caller,
        token,
        documentExtensionId: extensionId
      },
    );
    
    setIdReportGenerate(response.data)
    
    localStorage.removeItem('@GoJur:matterId')

  }, [documentList, documentModelId, isGeneratingReport, parameterValue, totalCustomer, legalPersonList, documentLPId, prepostoList, documentPrepostoId, parameterValue, peopleId, documentExtensionId]);

    // when exists report id verify if is avaiable every 2 seconds
    useEffect(() => {
      if (idReportGenerate > 0){
        const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 2000);
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
            OpenReportAmazon()
          }

          if (response.data == "W" && isGeneratingReport){
          
            clearInterval(checkInterval);
            setIsGeneratingReport(false)
            GetWarningProcessMessage()
          }

          if (response.data == "E"){
            clearInterval(checkInterval);
            setIsGeneratingReport(false)
            handleCloseModal()
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
    window.open(`${response.data.des_Parametro}`, '_blank');     
    handleOpenDocumentModal(false)
    setDocumentModelId('');
    setDocumentModelName('')
    changeText("Gerar Documento ")
  } 


  // Get the warning message
  const GetWarningProcessMessage = async() => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    });      

    addToast({
      type: "info",
      title: "Operação não realizada",
      description: response.data.des_ErroProcessoGOJUR
    })

    setIdReportGenerate(0)  ;
    handleCloseModal();
    handleResetValues();
    setDocumentModelId('');
    setDocumentModelName('')
    setDocumentExtensionId('');
    changeText("Gerar Documento ")
  } 


  const handleCloseModal = () => {

    setDocumentModelId('');
    handleOpenDocumentModal(false)
    handleBlockButton(true)
  }

  const handleModelDocumentValue = (item: any) => {

    if (item){
      setDocumentModelId(item.id)
      setDocumentModelName(item.label)
      
      if(item.id == documentModelId){
        handleBlockButton(false)
      }
      else {
        handleBlockButton(true)
      }
    }else{
      handleLoadDocumentModelList("'PR'", '');
      setDocumentModelId('')
      setDocumentModelName('')
      handleBlockButton(false)
    }
  }

  const handleLegalPersonDocumentValue = (item: any) => {
    if (item){
      setDocumentLPId(item.id)
    }else{
      setDocumentLPId('')
      loadLegalPerson('')
    }
  }

  const handlePrepostoDocumentValue = (item: any) => {
    if (item){
      setDocumentPrepostoId(item.id)
    }else{
      setDocumentPrepostoId('')
      loadLegalPreposto('')
    }
  }

  // REPORT FIELDS - CHANGE
  const handleCustomerSelected = (item) => { 
      
    if (item){
      if(item.id == "all"){
        setParameterValue("all")
        setPeopleId(item.id)
      }
      else if(item.id == peopleId)
      {  
        handleBlockButton(false)
      }
      else {
        setParameterValue('principal')
        handleBlockButton(true)
        setPeopleId(item.id)
      }
    }else{
      setPeopleId("0")
      setParameterValue('T')
      handleResetValues();
    }

  }

  const handleModelDocumentExtensionValue = (item: any) => {
    
    if (item){
      setSelectedFormat(item);
      setDocumentExtensionId(item.id);
      handleBlockButton(false);
    }else{
      setSelectedFormat(null);
      setDocumentExtensionId('');
      handleBlockButton(true);
    }
  }
  
  // const optionsParameter = [
  //   {
  //     id: 'principal',
  //     label: peopleName,
  //   },
  //   {
  //     id: 'all',
  //     label: 'Todos',
  //   },
  // ];

  return (
    <Modal
      isOpen={isOpenDocumentModal}
      onRequestClose={() => {
        setDocumentModelId('')
      }}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      {/* { !isGeneratingReport && (
        <button
          type="button"
          className="react-modal-close"
          onClick={() => {
            setDocumentModelId('');
            handleOpenDocumentModal(false)
          }}
        >
          <FiX size={20} />
        </button>
      )} */}

      <Container>
        <h1>Escolha na lista abaixo um modelo para gerar o documento</h1>
        <div>

          <AutoCompleteSelect>
            <p>Modelo do documento</p>
            <Select
              isSearchable   
              isClearable
              placeholder="Selecione um modelo de documento"
              value={documentList.filter(item => item.id == documentModelId)}   
              onChange={(item) => handleModelDocumentValue(item)}
              onInputChange={(term) => setDocumentModelName(term)} 
              loadingMessage={loadingMessage}
              noOptionsMessage={noOptionsMessage}
              isLoading={isLoadingDocumentData}
              styles={selectStyles}         
              options={documentList}
            />
          </AutoCompleteSelect>

          {customerList.length > 2 && (
            // <AutoCompleteSelect>
            //   <p>
            //     Cliente
            //     {' '}
            //     <FcAbout title='Gerar documento apenas para o cliente selecionado ou um documento para cada cliente que esteja associado ao processo' />
            //   </p>
            //   <Select
            //     isSearchable   
            //     isClearable
            //     placeholder="Selecione um modelo de documento"
            //     value={optionsParameter.filter(item => item.id == parameterValue)}   
            //     onChange={(item) => setParameterValue(item? item.id: 'T')}
            //     loadingMessage={loadingMessage}
            //     noOptionsMessage={noOptionsMessage}
            //     styles={selectStyles}         
            //     options={optionsParameter}
            //   />
            // </AutoCompleteSelect>
            <AutoCompleteSelect>
              <p>Cliente</p>  
              <Select
                isSearchable   
                value={customerList.filter(options => options.id == peopleId)}
                onChange={handleCustomerSelected}
                isClearable
                placeholder=""
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={customerList}
              />
            </AutoCompleteSelect>
          )}

          {(legalPersonList.length > 1 || legalPersonTermSearch.length > 0) && (parameterValue == 'principal') && (
            <AutoCompleteSelect>
              <p>Representante legal</p>  
              <Select
                isSearchable   
                isClearable
                isLoading={isLoadingDocumentData}
                placeholder="Selecione um representante legal"
                onChange={(item) => handleLegalPersonDocumentValue(item)}
                onInputChange={(term) => handleLegalPersonTermSearchTerm(term)} 
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}                 
                options={legalPersonList}
              />
            </AutoCompleteSelect>
          )}

          {(prepostoList.length > 1 || legalPrepostoTermSearch.length > 0) && (parameterValue == 'principal') && (
            <AutoCompleteSelect>
              <p>Preposto</p>  
              <Select
                isSearchable   
                isClearable
                isLoading={isLoadingDocumentData}
                placeholder="Selecione um preposto"
                onChange={(item) => handlePrepostoDocumentValue(item)}
                onInputChange={(term) => handlePrepostoSearchTerm(term)} 
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}                 
                options={prepostoList}
              />
            </AutoCompleteSelect>
          )}
          
          <AutoCompleteSelect>
                <p>Formato</p>  
                <Select
                  isSearchable   
                  isClearable
                  placeholder="Selecione um formato"
                  onChange={(item) => handleModelDocumentExtensionValue(item)}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}                 
                  options={documentExtensionsList}
                  defaultValue={documentExtensionsList[0]}
                  value={selectedFormat} 
                />
          </AutoCompleteSelect>

        </div>

        <footer>

          <button
            disabled={isBlockButton}
            className="buttonClick" 
            type="button"
            onClick={() => setTimeout(() => handleVisualizeDocument(), 500)}
            title="Clique para visualizar o documento selecionado"
          >
            <BsEye />
            Visualizar
            {isVisualizeReport ? <Loader size={5} color="#f19000" /> : null}
          </button>   
          
          <button
            disabled={isBlockButton}
            className="buttonClick" 
            type="button"
            onClick={()=>{ setTimeout(() => handleGenerateReport(), 500); changeText("Gerando Documento ") }}
            title="Clique para emitir o documento selecionado"
          >
            <FaFileAlt />
            {buttonText}
            {isGeneratingReport && <Loader size={5} color="var(--orange)" />}
          </button>  
          
          <button 
            className="buttonClick" 
            type="button"
            onClick={handleCloseModal}
            title="Clique para retornar a listagem de processos"
          >
            <MdBlock />
            Fechar            
          </button> 

        </footer>
 
      </Container>

    </Modal>
  );
}
