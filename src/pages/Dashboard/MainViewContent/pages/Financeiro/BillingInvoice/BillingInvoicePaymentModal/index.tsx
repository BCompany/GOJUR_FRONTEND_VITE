/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import api from 'services/api';
import { format } from 'date-fns';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { BiSave } from 'react-icons/bi';
import { FiX, FiTrash } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { useToast } from 'context/toast';
import LoaderWaiting from 'react-spinners/ClipLoader';
import IntlCurrencyInput from "react-intl-currency-input";
import { currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import { IPaymentData } from '../../../Interfaces/IBIllingContract'
import { Modal, OverlayModal } from './styles';

const BillingInvoicePaymentModal = (props) => {

  const {paymentId, dtaVencimentoFatura, paymentSlipValue, paymentSitutation, setShowPaymentModal, ClosePaymentModal} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
  const [paymentList, setPaymentList] = useState<IPaymentData[]>([]);
  const [modalConfirmSave, setModalConfirmSave] = useState<boolean>(false)
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [confirmSave, setConfirmSave] = useState<boolean>(false)
  const [postBackValidation, setPostBackValidation] = useState<boolean>(false)
  const [warningMessage, setWarningMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    LoadPayments()
  },[])

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmSave')
      {
        setModalConfirmSave(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmSave')
      {
        setConfirmSave(true)
        setPostBackValidation(true)
      }
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmSave)
    {  

      setConfirmSave(false)
      setModalConfirmSave(false)
      handleCaller("")
      handleConfirmMessage(false)
      SavePayments()
    }
  },[confirmSave]);


  const LoadPayments = async () => {

    setIsLoading(true)

    try {
      const response = await api.get<IPaymentData[]>('/Financeiro/Faturamento/ListarPagamentosModal', {
        params:{
          paymentId,
          token
        }
      });

      let paymentListReturn

      if (paymentSitutation == "A"){
         paymentListReturn = response.data.map(payment => payment && {
          ...payment,
          action: 'UPDATE',
          vlr_Liquidacao: 0, // eslint-disable-line no-param-reassign 
          dta_Liquidacao: (FormatDate(new Date(payment.dta_Liquidacao), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign 
        })
      }

      if(paymentSitutation != "A"){
        paymentListReturn = response.data.map(payment => payment && {
          ...payment,
          action: 'UPDATE',
          vlr_Liquidacao: payment.vlr_Liquidacao, // eslint-disable-line no-param-reassign 
          dta_Liquidacao: (FormatDate(new Date(payment.dta_Liquidacao), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign 
        })
      }
 
      setPaymentList(paymentListReturn)
      setIsLoading(false)
      
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  const NewPayment = () => {
    const id = Math.random()
    const newPayment: IPaymentData = {
      cod_FaturaParcela: paymentId,
      cod_FaturaParcelaLiquidacao: id.toString(),
      dta_Liquidacao:format(new Date(), 'yyyy-MM-dd'),
      vlr_Liquidacao: 0,
      total_Restante: 0,
      action:'NEW',
    }

    setPaymentList(oldPayment => [...oldPayment, newPayment])
  }


  const ChangeDate = useCallback((value, paymentId) => {
   
    const newPayment = paymentList.map(payment => payment.cod_FaturaParcelaLiquidacao === paymentId ? {
      ...payment,
      dta_Liquidacao: value
    }: payment)

    setPaymentList(newPayment)

  },[paymentList]);


  const ChangeValue = (value, paymentId) => {
    
    const newPayment = paymentList.map(payment => payment.cod_FaturaParcelaLiquidacao === paymentId ? {
      ...payment,
      vlr_Liquidacao: Number(value)
    }: payment)

    setPaymentList(newPayment)
  };


  const RemovePayment = useCallback((paymentId) => {

    const paymentListUpdate = paymentList.filter(item => item.cod_FaturaParcelaLiquidacao != paymentId);
    setPaymentList(paymentListUpdate)

  },[paymentList]);

  
  const CloseModal = () => {
    ClosePaymentModal()
  }


  const SavePayments = useCallback(async() => {
    try {

      if (!Validate(paymentList)) return;
      setIsSaving(true)
    
      await api.post('/Financeiro/Faturamento/SalvarPagamentos', {   
        cod_FaturaParcela: paymentId,
        dta_Vencimento: dtaVencimentoFatura,
        vlr_Parcela: paymentSlipValue,
        billingInvoicePaymentDTOList: paymentList,
        postBackValidation,
        token
      });

      addToast({
        type: 'success',
        title: 'Faturamento - Faturas',
        description: 'O(s) pagamento(s) foram salvo(s) no sistema.',
      });

      setIsSaving(false)
      setPostBackValidation(false)
      CloseModal()
      
    } catch (err: any) {

      if(err.response.data.Message.includes("ValueBiggerThanInstallment")){
        setModalConfirmSave(true)
        setWarningMessage(err.response.data.Message.split("?", 1)[0])
        
      }
      setIsSaving(false)
      console.log(err);
    }
  },[paymentList, paymentSlipValue, postBackValidation]);


  const Validate =(paymentList) => {

    let isValid = true;
    
    paymentList.map((item) => {
      
      if(item.vlr_Liquidacao <= 0)
      {
        addToast({
          type: "info",
          title: "Valor não permitido",
          description: "Os valores dos pagamentos devem ser maiores que zero"
        })

        isValid = false;
        setIsLoading(false)
      }

      return;
    })
    
    return isValid;
  }


  return(
    <>
      <Modal show>

        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Realizar pagamento
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => setShowPaymentModal(false)} />
          </div>
        </div>

        <div id='Labels' style={{marginLeft:'5%', marginTop:'5px', height:'30px'}}>
          <div style={{float:'left', width:'40%'}}>
            Recebimento:
          </div>
          <div style={{float:'left', width:'42%'}}>
            Valor:
          </div>
          <div style={{float:'left', width:'18%'}}>
            {/* <button 
              className="buttonLinkClick" 
              title="Adicionar novo pagamento"
              type="button"
              onClick={(e) => NewPayment()}
            >
              <GoPlus />
              Adicionar
            </button> */}
          </div>
        </div>

        {paymentList.map(payment => (
          <>
            {payment.action != 'DELETE' && (
              <div id='Elements' style={{marginLeft:'4.5%', height:'40px'}}>
               
                <div style={{float:'left', width:'35%'}}>
                  <input
                    type='date'
                    title=""
                    style={{width:'90%'}}
                    value={payment.dta_Liquidacao}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeDate(e.target.value, payment.cod_FaturaParcelaLiquidacao)}
                  />
                </div>

                <div style={{float:'left', width:'35%', marginTop:'3px'}}>
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={payment.vlr_Liquidacao}
                    onChange={(e, value) => ChangeValue(value, payment.cod_FaturaParcelaLiquidacao)}
                  />
                </div>

                <div style={{float:'left', width:'8%', marginLeft:'5px', marginTop:'9px'}}>
                  <button 
                    className="buttonLinkClick" 
                    title="Remover Pagamento"
                    type="submit"
                    onClick={() => RemovePayment(payment.cod_FaturaParcelaLiquidacao)}
                  >
                    &nbsp;&nbsp;
                    <FiTrash />
                  </button>
                </div>
              </div>
            )}
          </>
        ))}

        <div>
          <div style={{float:'right', marginRight:'10px', marginTop:'-30px'}}>
            <button 
              className="buttonLinkClick" 
              title="Adicionar novo pagamento"
              type="button"
              onClick={(e) => NewPayment()}
            >
              <GoPlus />
              Adicionar
            </button>
          </div>
        </div>

        <br />
        <br />

        <div id='Buttons' style={{float:'right', marginRight:'7%', height:'60px'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> SavePayments()}
              style={{width:'100px'}}
            >
              <BiSave />
              Salvar
            </button>
          </div>
                    
          <div style={{float:'left', width:'100px'}}>
            <button 
              type='button'
              className="buttonClick"
              onClick={() => setShowPaymentModal(false)}
              style={{width:'100px'}}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
        </div>

      </Modal>

      {modalConfirmSave && (
        <ConfirmBoxModal
          title="Faturamento - Pagamento"
          caller="confirmSave"
          message={`${warningMessage} ?`}
        />
      )}

      {isLoading && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}

      {isSaving && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Salvando Pagamento...
          </div>
        </>
      )}

    </>
  );


};

export default BillingInvoicePaymentModal;
