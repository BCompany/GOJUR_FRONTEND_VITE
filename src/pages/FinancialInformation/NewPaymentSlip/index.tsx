/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Modal } from './styles';

const NewPaymentSlipModal = (props) => {
  const { CloseNewPaymentSlipModal, link } = props.callbackFunction
  
  useEffect(() => {

  }, [])


  const OpenPaymentSlip = async () => {
    window.open(link);
    CloseNewPaymentSlipModal()
  }

  return(
    <>
      <Modal show>

        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Visualizar Fatura
          </div>
        </div>
        <br />

        <div style={{marginLeft:'5%'}}>
          Clique no botão abaixo para exibir o boleto, <b>aguarde 1 hora para efetuar o pagamento devido ao processamento bancário.</b>
        </div>
        <br /><br /><br /><br />

        <div id='Buttons' style={{float:'right', marginRight:'30%', height:'60px'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> OpenPaymentSlip()}
              style={{width:'100px', height:'32px'}}
            >
              <FaFileInvoiceDollar />
              Abrir
            </button>
          </div>
        </div>

      </Modal>
    </>
  );
};

export default NewPaymentSlipModal;
