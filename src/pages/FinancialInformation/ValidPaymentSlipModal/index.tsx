/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState, useCallback} from 'react';
import api from 'services/api';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiX } from 'react-icons/fi';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useToast } from 'context/toast';
import { Modal } from './styles';

const ValidModal = (props) => {
  const { CloseModal, CloseModalCancel, billingInvoiceId, companyId, days } = props.callbackFunction
  const [isLoader, setIsLoader] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {

  }, [])


  const OpenPaymentSlip = useCallback(async () => {
    try {
      setIsLoader(true);

      const response = await api.post('/InformacoesFinanceiras/LinkBoleto', {
        billingInvoiceId,
        companyId,
        token: ''
      });

      window.open(response.data);
      setIsLoader(false);
      CloseModal();
    } catch (err: any) {
      setIsLoader(false);
      addToast({type: 'error', title: 'Não foi possível executar esta operação', description: err.response.data.Message});
    }
  }, [billingInvoiceId, companyId]);


  return(
    <>
      <Modal show>

        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Gerar Fatura
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModalCancel()} />
          </div>
        </div>

        <br />
        <div style={{marginLeft:'2%'}}>
          {days > 0 ? (
            <>O boleto referente a esta fatura está vencido há {days} dias <b>mas ainda é valido para pagamento</b> em qualquer banco/internet.</>
          ):(
            <>Clique no botão Gerar abaixo para visualizar sua fatura.</>
          )}
        </div>
        <br /><br />

        <div id='Buttons' style={{float:'right', marginRight:'25%', height:'60px'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> OpenPaymentSlip()}
              style={{width:'100px', height:'32px'}}
            >
              <FaFileInvoiceDollar />
              Gerar
            </button>
          </div>

          <div style={{float:'left', width:'100px'}}>
            <button 
              type='button'
              className="buttonClick"
              onClick={() => CloseModalCancel()}
              style={{width:'100px', height:'32px'}}
            >
              <MdCancel />
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {isLoader && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Gerando...
          </div>
        </>
      )}

    </>
  );
};

export default ValidModal;