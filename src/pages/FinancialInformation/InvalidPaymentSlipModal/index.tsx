/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import api from 'services/api';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiX } from 'react-icons/fi';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { format } from 'date-fns';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useToast } from 'context/toast';
import { Modal } from './styles';

const InvalidModal = (props) => {
  const { CloseModal, CloseModalCancel, billingInvoiceId, setLink } = props.callbackFunction
  const [isLoader, setIsLoader] = useState(false);
  const [paymentSlipDate, setPaymentSlipDate] = useState<string>("");
  const { addToast } = useToast();

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    setPaymentSlipDate(format(date, 'yyyy-MM-dd'));
  }, [])


  const GeneratePaymentSlip = useCallback(async() => {
    try {
      if(paymentSlipDate == "")
      {
        addToast({
          type: 'info',
          title: 'Data invalida',
          description: 'Favor informar uma data válida',
        });
        return;
      }

      setIsLoader(true)

      const response = await api.post('/InformacoesFinanceiras/GerarNovoBoleto', {   
        billingInvoiceId,
        newDueDate: paymentSlipDate,
        installmentNumber: 1,
        token: ''
      });

      setLink(response.data)

      setIsLoader(false);
      CloseModal();
    } catch (err: any) {
      setIsLoader(false);
      addToast({type: 'error', title: 'Não foi possível executar esta operação', description: err.response.data.Message});
    }
  }, [billingInvoiceId, paymentSlipDate]);


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
        <div style={{marginLeft:'4%'}}>
          O boleto referente a esta fatura não é mais válido para pagamento. Informe uma data para um novo boleto.
        </div>
        <br />

        <div style={{ marginLeft:'30%', width:"150px", float:"left"}}>
          <label htmlFor="data" style={{width:"20%"}}>
            Data de vencimento
            <input 
              style={{backgroundColor:"white"}}
              type="date"
              value={paymentSlipDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentSlipDate(e.target.value)}
            />
          </label>
        </div>

        <br /><br /><br /><br />

        <div id='Buttons' style={{float:'right', marginRight:'25%', height:'60px'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> GeneratePaymentSlip()}
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

export default InvalidModal;