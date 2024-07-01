/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import Loader from 'react-spinners/PulseLoader';
import {FiX }  from 'react-icons/fi';
import Modal from 'react-modal'
import { useCustomer } from 'context/customer'
import { useToast } from 'context/toast';
import { Container } from './style';

const DetailedReportModal: React.FC = ( props ) => {
    
  const { addToast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const {isReportModalOpen, handleCloseReportModal } = useCustomer();

  
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
        <h1>Aguarde enquanto geramos a ficha do cliente</h1>
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

export default DetailedReportModal;