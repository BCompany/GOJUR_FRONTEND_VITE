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
import { FaRegTimesCircle, FaCheck } from 'react-icons/fa';
import { BiSave } from 'react-icons/bi';
import { FiX, FiTrash } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import IntlCurrencyInput from "react-intl-currency-input";
import { currencyConfig } from 'Shared/utils/commonFunctions';
import { IPayments } from '../Interfaces/IPayments';
import { Modal, ModalPostBackValidation, OverlayFinancialPayment } from './styles';

const FinancialPaymentModal = (props) => {

  const {movementId, invoice, movementType, ClosePaymentModal} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
  const [paymentList, setPaymentList] = useState<IPayments[]>([]);
  const [showPostBackValidation, setShowPostBackValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    LoadPayments()
  },[])


  const LoadPayments = async () => {

    try {
      const response = await api.get<IPayments[]>('/Financeiro/ObterPagamentos', {
        params:{
          token,
          movementId
        }
      });

      const paymentListReturn = response.data.map(payment => payment && {
        ...payment,
        action: 'UPDATE'
      })

      setPaymentList(paymentListReturn)
      
    } catch (err) {
      console.log(err);
    }
  }


  const NewPayment = () => {
    const id = Math.random()
    const newPayment: IPayments = {
      cod_Movimento: movementId,
      cod_MovimentoLiquidacao: id.toString(),
      dta_LiquidacaoStr:format(new Date(), 'yyyy-MM-dd'),
      vlr_Liquidacao: 0,
      total_Restante: 0,
      tpo_Movimento: '',
      action:'NEW',
    }

    setPaymentList(oldPayment => [...oldPayment, newPayment])
  }


  const ChangeDate = useCallback((value, paymentId) => {
   
    const newPayment = paymentList.map(payment => payment.cod_MovimentoLiquidacao === paymentId ? {
      ...payment,
      dta_LiquidacaoStr: value
    }: payment)

    setPaymentList(newPayment)

  },[paymentList]);


  const ChangeValue = (value, paymentId) => {
    
    const newPayment = paymentList.map(payment => payment.cod_MovimentoLiquidacao === paymentId ? {
      ...payment,
      vlr_Liquidacao: Number(value)
    }: payment)

    setPaymentList(newPayment)
  };


  const RemovePayment = useCallback((paymentId) => {

    const payment = paymentList.map(i => i.cod_MovimentoLiquidacao === paymentId ? {
      ...i,
      action: 'DELETE'
    }: i);
    setPaymentList(payment)

  },[paymentList]);

  
  const CloseModal = () => {
    ClosePaymentModal()
  }


  const SavePayments = useCallback(async(item) => {
    try {
      setIsLoading(true)
      setShowPostBackValidation(false)

      if (!Validate(paymentList)) return;
    
      const response = await api.post<IPayments[]>('/Financeiro/SalvarPagamentos', {
        
        movementId,
        paymentList,
        postBackValidation: item,
        token
      });

      setIsLoading(false)
      CloseModal()
      
    } catch (err) {
      setShowPostBackValidation(true)
      setIsLoading(false)
      console.log(err);
    }
  },[paymentList]);


  const Validate =(paymentList) => {

    let isValid = true;
    
    if(invoice != 0 && invoice != undefined)
    {
      addToast({
        type: "info",
        title: "AVISO",
        description: "Esta movimentação esta vinculada diretamente a uma fatura, as alterações devem ser realizadas em sua fatura de origem."
      })
      
      isValid = false;
      setIsLoading(false)
    }

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
            {movementType == "R" && (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;Liquidar Receita
              </>
            )}
            {movementType == "D" && (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;Liquidar Despesa
              </>
            )} 
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModal()} />
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
                    value={payment.dta_LiquidacaoStr}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeDate(e.target.value, payment.cod_MovimentoLiquidacao)}
                  />
                </div>

                <div style={{float:'left', width:'35%', marginTop:'3px'}}>
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={payment.vlr_Liquidacao}
                    onChange={(e, value) => ChangeValue(value, payment.cod_MovimentoLiquidacao)}
                  />
                </div>

                <div style={{float:'left', width:'8%', marginLeft:'5px', marginTop:'9px'}}>
                  <button 
                    className="buttonLinkClick" 
                    title="Aumentar um mês"
                    type="submit"
                    onClick={() => RemovePayment(payment.cod_MovimentoLiquidacao)}
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
              onClick={()=> SavePayments(false)}
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
              onClick={() => CloseModal()}
              style={{width:'100px'}}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
        </div>

      </Modal>

      {(showPostBackValidation) && <OverlayFinancialPayment /> }
      {showPostBackValidation && (
        <ModalPostBackValidation>
          <div className='menuSection'>
            <FiX onClick={(e) => setShowPostBackValidation(false)} />
          </div>
          <div style={{marginLeft:'5%'}}>
            {/* A soma dos pagamentos totalizam: R$ 15,00, este valor excede o total da parcela de: ( R$ 10,00 ). Deseja continuar mesmo assim ? */}
            A soma dos pagamentos excedem o total da parcela. Deseja continuar mesmo assim ?
            <br />
            <br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> SavePayments(true)}
                  style={{width:'100px'}}
                >
                  <FaCheck />
                  Sim
                </button>
              </div>
                       
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => setShowPostBackValidation(false)}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Não
                </button>
              </div>
            </div>
          </div>

        </ModalPostBackValidation>
      )}

      {isLoading && (
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

export default FinancialPaymentModal;
