/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-no-target-blank */

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiPrinter } from "react-icons/fi";
import { Container } from './styles';

const ReportModal = (props) => {
  const { CloseReportModal, reportLink} = props.callbackFunction


  const OpenReport = () => {
    window.open(`${reportLink}`, '_blank');
  }


  const CloseModal = () => {
    CloseReportModal()
  }


  return (
    <Container show>
      <br />
      &nbsp;&nbsp;&nbsp;&nbsp;Se o relatório não abrir automaticamente em até 5 segundos, <br />
      &nbsp;&nbsp;&nbsp;&nbsp;clique no botão abrir para visualizar o seu relatório.
      <br /><br />
      &nbsp;&nbsp;&nbsp;&nbsp;Para abrir automaticamente configure o pop-up do seu <br />
      &nbsp;&nbsp;&nbsp;&nbsp;navegador conforme instruções abaixo.
      <br /><br />
      &nbsp;&nbsp;&nbsp;&nbsp;<a href='https://gojur.tawk.help/article/permiss%C3%A3o-pop-up' target='_blank'>https://gojur.tawk.help/article/permissao-pop-up</a>
      <br /><br /><br />

      <div id='Buttons' style={{float:'right', marginRight:'25%', height:'60px'}}>
        <div style={{float:'left'}}>
          <button 
            className="buttonClick"
            type='button'
            onClick={()=> OpenReport()}
            style={{width:'100px', height:'35px'}}
          >
            <FiPrinter />
            Abrir
          </button>
        </div>
                  
        <div style={{float:'left', width:'100px'}}>
          <button 
            type='button'
            className="buttonClick"
            onClick={() => CloseModal()}
            style={{width:'100px', height:'35px'}}
          >
            <FaRegTimesCircle />
            Fechar
          </button>
        </div>
      </div>
    </Container>
  )
}
  
export default ReportModal;
