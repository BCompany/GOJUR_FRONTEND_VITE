/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React, {useEffect, useState, useCallback} from 'react';
import api from 'services/api';
  import { FiX } from 'react-icons/fi';
import { FaFileAlt, FaRegTimesCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { BsEye } from 'react-icons/bs';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Select from 'react-select'
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { Modal } from './styles';
import { ISelectData} from '../../../Interfaces/IBIllingContract'

const BillingContractDocumentModal = (props) => {

  const {billingContractId, CloseBillingContractDocumentModal} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const { addToast } = useToast();
  const [documentList, setDocumentList] = useState<ISelectData[]>([]);
  const [documentModelId, setDocumentModelId] = useState('');
  const [documentModelName, setDocumentModelName] = useState('');
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  useEffect(() => {
    LoadDocuments()
  },[])


  const LoadDocuments = async () => {

    try {
      const response = await api.post<ISelectData[]>('/DocumentosModelo/ListarPorFiltro', {
        documentType: "'FC'",
        filterDesc: documentModelName,
        token
      });

      setDocumentList(response.data);

    } catch (err) {
      console.log(err);
    }
  }


  const handleModelDocumentValue = (item: any) => {

    if (item){
      setDocumentModelId(item.id)
      setDocumentModelName(item.label)
    }else{
      setDocumentModelId('')
      setDocumentModelName('')
    }
  }


  const CloseModal = () => {
    setDocumentModelId('')
    setDocumentModelName('')
    CloseBillingContractDocumentModal()
    setIsGeneratingReport(false)
  }


  // DOCUMENT MODEL
  const VisualizeDocument = useCallback(async () => {

    if(documentModelId == '')
    {
      addToast({
        title: 'Aviso.',
        type: 'info',
        description: 'Favor selecionar um documento antes de continuar.',
      });

      return;
    }

    setIsGeneratingReport(true)

    const response = await api.post('/DocumentosModelo/VerDocumentoContratoFinanceiro',
      {
        id: Number(billingContractId),
        documentModelId: Number(documentModelId),
        token,
      },
    );

    localStorage.setItem('@GoJur:documentText', response.data);
    localStorage.setItem('@GoJur:billingContractId', billingContractId);

    CloseModal()
    history.push(`/documentmodel/visualize/${documentModelId? Number(documentModelId): 0}`)

  }, [documentModelId, billingContractId]);

  const GenerateDocument = useCallback(async () => {

    if(documentModelId == '')
    {
      addToast({
        title: 'Aviso.',
        type: 'info',
        description: 'Favor selecionar um documento antes de continuar.',
      });

      return;
    }

    setIsGeneratingReport(true)

    const response = await api.post('/DocumentosModelo/GerarContratoFinanceiro',
      {
        id: Number(billingContractId),
        documentModelId: Number(documentModelId),
        token,
      },
    );

    setIdReportGenerate(response.data)

  }, [documentModelId, billingContractId]);

  useEffect(() => {
    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval)
      }, 2000);
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

        if (response.data == "E"){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
          
  
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
    window.open(`${response.data.des_Parametro}`, '_blank')
    CloseModal()
  }


  return(
    <>
      <Modal show>

        <div>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Modelo de Documento
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModal()} />
          </div>
        </div>

        <div id='autoComplete' style={{width:'70%', marginLeft:'15%', marginTop:'50px'}}>
          <AutoCompleteSelect>
            <p>Modelo do documento</p>
            <Select
              isSearchable
              isClearable
              // isLoading={isLoadingDocumentData}
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
        </div>

        <div id='buttons' style={{float:'right', marginRight:'7%', marginTop:'30px'}}>
          <div style={{float:'left'}}>
            <button
              className="buttonClick"
              type='button'
              onClick={()=> VisualizeDocument()}
              style={{width:'120px'}}
            >
              <BsEye />
              Visualizar
            </button>
          </div>

          <div style={{float:'left'}}>
            <button
              className="buttonClick"
              type='button'
              onClick={()=> GenerateDocument()}
              style={{width:'150px'}}
            >
              <FaFileAlt />
              Gerar Documento
            </button>
          </div>

          <div style={{float:'right', width:'100px'}}>
            <button
              type='button'
              className="buttonClick"
              onClick={() => CloseModal()}
              style={{width:'120px'}}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
        </div>

      </Modal>

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}
    </>
  );

};

export default BillingContractDocumentModal;
