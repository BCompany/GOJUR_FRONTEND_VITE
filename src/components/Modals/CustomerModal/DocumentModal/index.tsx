/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useCustomer } from 'context/customer';
import { useDocument } from 'context/document';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { FiX } from 'react-icons/fi';
import api from 'services/api';
import { envProvider } from 'services/hooks/useEnv';
import Loader from 'react-spinners/PulseLoader';
import Select from 'react-select'
import { FaFileAlt } from 'react-icons/fa';
import { BsEye } from 'react-icons/bs';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { Container } from './styles';

export const documentExtensionsList = [
  {id: "1", label: "PDF"},
  {id: "2", label: "WORD (.docx)"}
];

export default function DocumentModal() {
  // Context imports
  const { isCustomerDocumentModalOpen, handleCloseCustomerDocumentModal } = useCustomer();
  const { handleLoadDocumentModelList, peopleId, documentList, processList, legalPersonList, prepostoList, customerQtdeLegalPerson, handleLegalPersonTermSearchTerm,handlePrepostoSearchTerm, handleBlockButton,isBlockButton,legalPrepostoTermSearch,legalPersonTermSearch,isLoadingDocumentData,handleProcessSearchTerm,loadProcess, loadLegalPerson, loadLegalPreposto, customerQtdeProcess, handleResetValues  } = useDocument();
  const { addToast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false); 
  const [isVisualizeReport, setIsVisualizeReport] = useState<boolean>(false); 
  const [disableVisualizeButton, setDisableVisualizeButton] = useState<boolean>(false); 
  const [generateWithoutMatter, setGenerateWithoutMatter] = useState<boolean>(false); 
  const [documentModelName, setDocumentModelName] = useState(''); 
  const [documentModelId, setDocumentModelId] = useState(''); 
  const [documentProcessId, setDocumentProcessId] = useState(''); 
  const [documentLPId, setDocumentLPId] = useState(''); 
  const [documentPrepostoId, setDocumentPrepostoId] = useState('');
  const history = useHistory();
  const token = localStorage.getItem('@GoJur:token');
  const [documentExtensionId, setDocumentExtensionId] = useState(''); 
  const [selectedFormat, setSelectedFormat] = useState(null);


  useEffect(() => {
    changeText("Gerar Documento ")
    handleResetValues();
  }, [isCustomerDocumentModalOpen])


  useEffect(() => {

    loadProcess("")
    handleLoadDocumentModelList("'CL', 'PR'",'')
    handleResetValues();

  }, [])


  useDelay(() => {
    
    if (documentModelName.length == 0 && !isLoadingDocumentData){
      return;
    }

    handleLoadDocumentModelList("'CL', 'PR'", documentModelName);

  },[documentModelName], 1000)


  useEffect(() => {

    async function handleEffects() {
      const filteredDocument = documentList.filter(
        i => i.id === documentModelId,
      );
      const typeDocument = String(
        filteredDocument.map(item => item.documentType),
      );

      if (typeDocument === 'PR') {
        if (customerQtdeProcess === 0) {
          addToast({
            title: 'Não há processos cadastrados para esse cliente.',
            type: 'info',
            description:
              'Se quiser prosseguir, as palavras-chave do tipo processo para este documento não serão substituídas.',
          });

          setGenerateWithoutMatter(true)
        }

        if (customerQtdeProcess > 0) {
          loadProcess('');
        }
      } else {
        handleResetValues();
      }

      const hasLegalPerson = filteredDocument.map(i => i.HasLegalPersonContent);
      const hasPreposto = filteredDocument.map(
        i => i.HasRepresentativeAgentContent,
      );

      if( customerQtdeLegalPerson.legalPersonCount >= 1 && hasLegalPerson[0] === true) {
        loadLegalPerson('');
      }

      if(customerQtdeLegalPerson.representativeAgentCount >= 1 && hasPreposto[0] === true) {
        loadLegalPreposto('');
      }
    }
    handleEffects();

  }, [addToast, customerQtdeProcess, documentList]);


  useEffect(() => {
    const defaultFormat = documentExtensionsList[0]; 
    setSelectedFormat(defaultFormat);
    handleModelDocumentExtensionValue(defaultFormat); 
  }, []);


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

  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)

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
          handleCloseCustomerDocumentModal()
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
    handleResetValues();
    handleCloseCustomerDocumentModal();
    setDocumentModelId('');
    setDocumentModelName('')
    setDocumentExtensionId('');
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

    setIdReportGenerate(0)  
    handleResetValues();
    handleCloseCustomerDocumentModal();
    setDocumentModelId('');
    setDocumentModelName('')
    setDocumentExtensionId('');
    changeText("Gerar Documento ")
  } 


  // generate report
  const handleGenerateReport = useCallback(async () => {

    if (isGeneratingReport){
      return;
    }

    if (!validateParameters()){
      return;
    }
    
    const token = localStorage.getItem('@GoJur:token');

    setIsGeneratingReport(true)    
    
    const filteredDocument = documentList.find(i => i.id === documentModelId);
    let typeDocument = filteredDocument? String(filteredDocument.documentType): "";

    const duplicateTypes = typeDocument.split(',');
    if (duplicateTypes.length > 1){
      // eslint-disable-next-line prefer-destructuring
      typeDocument = duplicateTypes[0]
    }

    // handleCloseCustomerDocumentModal()
    const lPersonId = Number(
      legalPersonList
        .filter(person => person.id === documentLPId)
        .map(person => person.id),
    );
    
    const prepostoId = Number(
      prepostoList
        .filter(person => person.id === documentPrepostoId)
        .map(person => person.id),
    );

    const idMatter = processList.length === 1 ? Number(processList.map(process => process.id)) : Number(
      processList
        .filter(process => process.id === documentProcessId)
        .map(i => i.id),
    );

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

    // validation if same process was selected
    if (typeDocument == 'PR' && idMatter == 0 && !generateWithoutMatter){
        addToast({
          title: 'Não foi possivel completar a operação',
          type: 'info',
          description: 'Para gerar um documento do tipo processo favor selecionar um dos processos',
        });     
        setIsGeneratingReport(false)   
        return;
    }

    if (typeDocument === 'PR' && processList.length >= 1) {

      try {
        const response = await api.post(
          '/DocumentosModelo/GerarDocumentoProcesso',
          {
            cod_DocumentoModelo: filteredDocument? Number(filteredDocument.id): 0,
            matterId: idMatter,
            peopleId,
            legalPersonId: lPersonId === 0 || legalPersonList.length === 1 ? null : lPersonId,
            representativeAgentId: prepostoId === 0 || prepostoList.length === 1 ? null : prepostoId,
            des_Titulo: filteredDocument? filteredDocument.label.toString(): "",
            printAllCustomer: 'notset',
            caller: 'customerModule',
            token,
            documentExtensionId: extensionId
          }, 
        ) ;

        // window.open(`${envProvider.ApiBaseUrl}${response.data}`, '_blank');
        setIdReportGenerate(response.data)
  
        setGenerateWithoutMatter(false)
      } catch (err) {
        setIsGeneratingReport(false)    
        addToast({
          title: 'Falha ao gerar o relatório',
          type: 'error',
          description: 'Não foi possível gerar o relatório, tente novamente',
        });
      }
    } else if (typeDocument === 'PR' && processList.length === 0) {
      try {
        const response = await api.post(
          '/DocumentosModelo/GerarDocumentoTipoProcessoSemClienteAssociadoAoProcesso',
          {
            cod_DocumentoModelo: filteredDocument? Number(filteredDocument.id): 0,
            peopleId,
            legalPersonId: lPersonId === 0 || legalPersonList.length === 1 ? null : lPersonId,
            representativeAgentId: prepostoId === 0  || prepostoList.length === 1 ? null : prepostoId,
            des_Titulo: filteredDocument? filteredDocument.label.toString(): "",
            token,
            documentExtensionId: extensionId
          },
        );

        setGenerateWithoutMatter(false)
        
        setIdReportGenerate(response.data)

      } catch (err) {
        setIsGeneratingReport(false)    
        addToast({
          title: 'Falha ao gerar o relatório',
          type: 'error',
          description: 'Não foi possível gerar o relatório, tente novamente',
        });     
        // setIsGeneratingReport(false)    
        setDocumentModelId('');
        setDocumentModelName('')
        setDocumentExtensionId('');
        handleResetValues(); 
        // handleCloseCustomerDocumentModal()
        setGenerateWithoutMatter(false)
        
      }
    } else if (typeDocument === 'CL') {
     
      try {
        const response = await api.post(
          '/DocumentosModelo/GerarDocumentoCliente',
          {
            cod_DocumentoModelo: filteredDocument? Number(filteredDocument.id): 0,
            peopleId,
            legalPersonId: lPersonId === 0 || legalPersonList.length === 1  ? null : lPersonId,
            representativeAgentId: prepostoId === 0 || prepostoList.length === 1 ? null : prepostoId,
            des_Titulo: filteredDocument? filteredDocument.label.toString(): "",
            token,
            documentExtensionId: extensionId
          },
        );

        // window.open(`${envProvider.ApiBaseUrl}${response.data}`, '_blank');
        setIdReportGenerate(response.data)

        setGenerateWithoutMatter(false)
      } catch (err) {
        setIsGeneratingReport(false)    
        addToast({
          title: 'Falha ao gerar o relatório',
          type: 'error',
          description: 'Não foi possível gerar o relatório, tente novamente',
        });
        // handleCloseCustomerDocumentModal()
      }
    }
  }, [addToast, customerQtdeLegalPerson, customerQtdeProcess, documentLPId, documentList, documentLPId, documentModelName, documentPrepostoId, documentProcessId, legalPersonList, peopleId, prepostoList, processList, documentExtensionId]);

  
  const handleVisualizeReport = async () => {
    
    if (!validateParameters()){
      return;
    }

    let hasError = false;

    setIsVisualizeReport(true)

    const filteredDocument = documentList.find(i => i.id === documentModelId);
    let typeDocument = "";

    if (filteredDocument){
      typeDocument = String(filteredDocument.documentType);
    }

    const duplicateTypes = typeDocument.split(',');
    if (duplicateTypes.length > 1){
      // eslint-disable-next-line prefer-destructuring
      typeDocument = duplicateTypes[0]
    }

    // handleCloseCustomerDocumentModal()
    const lPersonId = Number(
      legalPersonList
        .filter(person => person.id === documentLPId)
        .map(person => person.id),
    );

    const prepostoId = Number(
      prepostoList
        .filter(person => person.id === documentPrepostoId)
        .map(person => person.id),
    );

    const idMatter = processList.length === 1 ? Number(processList.map(process => process.id)) : Number(
      processList
        .filter(process => process.id === documentProcessId)
        .map(i => i.id),
    );

    // values report
    const tokenapi = localStorage.getItem('@GoJur:token');
    const baseUrl = envProvider.redirectUrl;
    const documentId = filteredDocument? Number(filteredDocument.id): 0;
    const legalPersonId = lPersonId === 0 || legalPersonList.length === 1 ? null : lPersonId
    const pressupostoId = prepostoId === 0 || prepostoList.length === 1 ? null : prepostoId

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

    // validation if same process was selected
    if (typeDocument == 'PR' && idMatter == 0  && !generateWithoutMatter){
      addToast({
        title: 'Não foi possivel completar a operação',
        type: 'info',
        description: 'Para gerar um documento do tipo processo favor selecionar um dos processos',
      });     
      setIsVisualizeReport(false)
      return;
    }

    if (typeDocument === 'PR' && processList.length >= 1) {
      try {

        // create parameters redirect exclusive for visualization using old implementation on Gojur
        // const parametersRedirect = `tpoDocument=PR,matterId=${ idMatter === null? 0: idMatter } + 
        // ",documentModelId=${documentId}` + 
        // `,peopleId=${peopleId}` +
        // `,legalPersonId=${legalPersonId}` +
        // `,representantiveAgentId=${pressupostoId}` +
        // `,printAllCustomer=notSet` +
        // `,caller=customerModule` 

        // const urlRedirect = `${baseUrl}Customer/list?token=${tokenapi}&documentModelParams=${parametersRedirect}`
        // window.open(urlRedirect, '_parent')

        const response = await api.post('/DocumentosModelo/VerDocumentoProcesso',
        {
          cod_DocumentoModelo: documentId,
          matterId: idMatter === null? 0: idMatter,
          peopleId,
          legalPersonId,
          representativeAgentId: pressupostoId,
          des_Titulo: "",
          printAllCustomer: "notSet",
          caller: 'customerModule',
          token,
        });

        localStorage.setItem('@GoJur:documentLocation', 'customer');
        localStorage.setItem('@GoJur:documentText', response.data);
        history.push(`/documentmodel/visualize/${documentId}`)

        setDocumentModelId('');
        setDocumentModelName('')
        setDocumentExtensionId('');
        handleResetValues();
        handleCloseCustomerDocumentModal();
        setIsVisualizeReport(false)
        setGenerateWithoutMatter(false)

      } catch (err) {
        hasError = true;
      }
    } 
    else if (typeDocument === 'PR' && processList.length === 0) {
      try {
       
        // create parameters redirect exclusive for visualization using old implementation on Gojur
        // const parametersRedirect = `tpoDocument=PR,matterId=null,documentModelId=${documentId}` + 
        // `,peopleId=${peopleId}` +
        // `,legalPersonId=${legalPersonId}` +
        // `,representantiveAgentId=${pressupostoId}` +
        // `,printAllCustomer=notSet` +
        // `,caller=customerModule` 
        
        // const urlRedirect = `${baseUrl}Customer/list?token=${tokenapi}&documentModelParams=${parametersRedirect}`
        // window.open(urlRedirect,'_parent')

        const response = await api.post('/DocumentosModelo/VerDocumentoTipoProcessoSemClienteAssociadoAoProcesso',
        {
          cod_DocumentoModelo: documentId,
          matterId: null,
          peopleId,
          legalPersonId,
          representativeAgentId: pressupostoId,
          des_Titulo: "",
          printAllCustomer: "notSet",
          caller: 'customerModule',
          token,
        });

        localStorage.setItem('@GoJur:documentLocation', 'customer');
        localStorage.setItem('@GoJur:documentText', response.data);
        history.push(`/documentmodel/visualize/${documentId}`)

        setDocumentModelId('');
        setDocumentModelName('')
        handleResetValues();
        setDocumentExtensionId('');
        handleCloseCustomerDocumentModal();
        setIsVisualizeReport(false)
        setGenerateWithoutMatter(false)

      } catch (err) {
        hasError = true
      }
    } 
    else if (typeDocument === 'CL') {
      try {
       
          // create parameters redirect exclusive for visualization using old implementation on Gojur
          // const parametersRedirect = `tpoDocument=CL,peopleId=${peopleId}` +
          // `,documentModelId=${documentId}` +
          // `,legalPersonId=${legalPersonId}` +
          // `,representantiveAgentId=${pressupostoId}`
          
          // const urlRedirect = `${baseUrl}Customer/list?token=${tokenapi}&documentModelParams=${parametersRedirect}`
          // window.open(urlRedirect, '_parent')

          const response = await api.post('/DocumentosModelo/VerDocumentoCliente',
          {
            cod_DocumentoModelo: documentId,
            matterId: null,
            peopleId,
            legalPersonId,
            representativeAgentId: pressupostoId,
            des_Titulo: "",
            printAllCustomer: "notSet",
            caller: 'customerModule',
            token,
          });
  
          localStorage.setItem('@GoJur:documentLocation', 'customer');
          localStorage.setItem('@GoJur:documentText', response.data);
          history.push(`/documentmodel/visualize/${documentId}`)

          setDocumentModelId('');
          setDocumentModelName('')
          setDocumentExtensionId('');
          handleResetValues();
          handleCloseCustomerDocumentModal();
          setIsVisualizeReport(false)
          setGenerateWithoutMatter(false)

      } catch (err) {
        hasError = true
      }
    }

    if (hasError){
      addToast({
        title: 'Falha ao gerar o relatório',
        type: 'error',
        description: 'Não foi possível gerar o relatório, tente novamente',
      });     
      setIsVisualizeReport(false)
      handleCloseCustomerDocumentModal()
    }
  }


  const handleModelDocumentValue = (item: any) => {
    handleBlockButton(true)

    if (item){
      setDocumentModelId(item.id)
      setDocumentModelName(item.label)
    }else{
      handleLoadDocumentModelList("'CL', 'PR'",'');
      setDocumentModelId('')
      setDocumentModelName('')
    }
  }


  const handleProcessDocumentValue = (item: any) => {
    
    if (item){
      setDocumentProcessId(item.id)
    }else{
      setDocumentProcessId('')
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


  const handleModelDocumentExtensionValue = (item: any) => {
    
    if (item){
      handleBlockButton(false);
      setSelectedFormat(item);
      setDocumentExtensionId(item.id);

      if(item.id == 1){
        setDisableVisualizeButton(false);
      }
      else if(item.id == 2){
        setDisableVisualizeButton(true);
      }
    }
    else{
      setSelectedFormat(null);
      setDocumentExtensionId('');
      handleBlockButton(true);
    }
  }

  
  const [buttonText, setButtonText] = useState("Gerar Relatório");
  const changeText = (text) => setButtonText(text);

  
  return (
    <Modal
      isOpen={isCustomerDocumentModalOpen}
      onRequestClose={() => {
        setDocumentModelId('');
        handleResetValues();
        handleCloseCustomerDocumentModal();
        setDocumentExtensionId('');
        setDisableVisualizeButton(false);
      }}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      { !isGeneratingReport && (
        <button
          type="button"
          className="react-modal-close"
          onClick={() => {
            handleResetValues();
            setDocumentModelId('');
            handleCloseCustomerDocumentModal();
            setDocumentExtensionId('');
            setDisableVisualizeButton(false);
          }}
        >
          <FiX size={20} />
        </button>
      )}

      <Container>
        <h1>Selecione na lista abaixo um modelo para gerar o documentos</h1>

        <div>

          <AutoCompleteSelect>
            <p>Modelo do documento</p>
            <Select
              isSearchable   
              isClearable
              isLoading={isLoadingDocumentData}
              placeholder="Selecione um modelo de documento"
              value={documentList.filter(item => item.id == documentModelId)}   
              onChange={(item) => handleModelDocumentValue(item)}
              onInputChange={(term) => setDocumentModelName(term)} 
              loadingMessage={loadingMessage}
              noOptionsMessage={noOptionsMessage}
              styles={selectStyles}         
              options={documentList}
            />
          </AutoCompleteSelect>

          
          {/* {processList.length > 1 && ( */}
          {processList.length > 1 && (
            <AutoCompleteSelect>
              <p>Processo</p>     
              <Select
                isSearchable   
                isClearable
                isLoading={isLoadingDocumentData}
                placeholder="Selecione um processo"
                onChange={(item) => handleProcessDocumentValue(item)}
                onInputChange={(term) => handleProcessSearchTerm(term)} 
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}                 
                options={processList}
              />
            </AutoCompleteSelect>
                    
            // <AutoCompleteSelect>
            //   <p>Processo</p>     
            //   <Select
            //     isSearchable   
            //     styles={selectStyles}         
            //     isClearable
            //     placeholder="Selecione um processo"
            //     onChange={(item) => handleProcessDocumentValue(item)}                
            //     options={processList}
            //   />
            // </AutoCompleteSelect>
          )}

          {(legalPersonList.length > 1 || legalPersonTermSearch.length > 0) && (
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

          {(prepostoList.length > 1 || legalPrepostoTermSearch.length > 0) && (
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
        </div>

          <AutoCompleteSelect>
                <p>Formato</p>  
                <Select
                  isSearchable   
                  isClearable
                  isLoading={isLoadingDocumentData}
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

        <footer>


          <button
            disabled={disableVisualizeButton}
            className="buttonClick" 
            type="button"
            onClick={() => setTimeout(() => handleVisualizeReport(), 500)}
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

          
        </footer>

      </Container>

    </Modal>
  );
}
