/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import Loader from 'react-spinners/PulseLoader';
import {FiX }  from 'react-icons/fi';
import Modal from 'react-modal'
import { usePublication } from 'context/publication'
import api from 'services/api';
import { useToast } from 'context/toast';
import { PublicationDto } from 'pages/Dashboard/MainViewContent/pages/Publication/Interfaces/IPublication';
import { Container } from './style';

const ReportModal: React.FC = ( props ) => {

const publication = props.children as PublicationDto[]
    
const { addToast } = useToast();
const [isGeneratingReport, setIsGeneratingReport] = useState(false)
const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
const {isReportModalOpen, handleCloseReportModal } = usePublication();

// when exists report id verify if is avalaliable by 5 minutes
useEffect(() => {

    if (idReportGenerate > 0){

      const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 5000);

      // return () => {
      //   clearTimeout(checkInterval);
      // };
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
    handleCloseReportModal()

    window.open(`${response.data.des_Parametro}`, '_blank');     
  } 
    
  const handlePrintSelectPublications = useCallback(async () => {

    try {

      const userToken = localStorage.getItem('@GoJur:token');
      const response = await api.post(`/Publicacao/Relatorio`, {
        publicationIds: publication
          .filter(i => i.publicationSelected)
          .map(i => i.publicationSelected)
          .toString(),
        token: userToken,
      });

      setIsGeneratingReport(true)
      setIdReportGenerate(response.data)
      
    } catch (err) {
      console.log(err);
    }

  }, []); 
  
  return (
    <Modal
      isOpen={isReportModalOpen} 
      onRequestClose={handleCloseReportModal}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      {!isGeneratingReport && (
        <button 
          type="button" 
          className="react-modal-close"
          onClick={handleCloseReportModal} 
        >
          <FiX size={20} />
        </button>
      )}

      <Container>
        <h1>Aguarde enquanto geramos o relatório de publicações</h1>
      </Container>
      
      <br />

      <div style={{marginLeft: '35%'}}>
        <button 
          className="buttonClick"
          type='button'
          // onClick={handlePrintSelectPublications}
          title="Gerando Relatório"
        >
          <FaFileAlt />
          Gerando Relatório
          {isGeneratingReport && <Loader size={5} color="var(--orange)" /> }
          <Loader size={5} color="var(--orange)" />
        </button>  
      </div>
      
    </Modal>
  );
};

export default ReportModal;