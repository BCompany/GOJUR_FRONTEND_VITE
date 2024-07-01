/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiHelpCircle} from 'react-icons/fi';
import { GrMail } from 'react-icons/gr';
import api from 'services/api';
import {IPaymentSlipData, IInstallments } from '../../../Interfaces/IBIllingContract'
import { ModalBillingInvoiceEmail, OverlayModal } from './styles';

const BillingInvoiceEmailModal = (props) => {
  const {billingInvoiceId, CloseBillingInvoiceEmailModal} = props.callbackFunction
  const { addToast } = useToast();
  const [paymentSlipList, setPaymentSlipList] = useState<IInstallments[]>([]);
  const [paymentSlipIdList, setPaymentIdList] = useState<string[]>([]);
  const [isSendEmail, setIsSendEmail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    LoadPaymentSlip();
  },[])

  const SendEmail = useCallback(async() => {

    let slipsSelected = '';
    paymentSlipIdList.map((item) => {
      return slipsSelected += `${item},`;
    })

    try {

      setIsSendEmail(true)

      await api.post('/Financeiro/Faturamento/EnviarEmail', {  
        billingInvoiceId,
        slipsSelected,
        token
      })
 
      addToast({
        type: "success",
        title: "E-mail Enviado",
        description: "O e-mail foi enviado com sucesso."
      })

      setIsSendEmail(false)
      CloseBillingInvoiceEmailModal()

         
    } catch (err: any) {
      setIsSendEmail(false)
      addToast({
        type: "error",
        title: "Falha ao enviar e-mail.",
        description:  err.response.data.Message
      })
    }
  },[billingInvoiceId, paymentSlipIdList]);

  const LoadPaymentSlip = async () => {  
    try {
      setIsLoading(true)
      const response = await api.get<IPaymentSlipData>('/Financeiro/Faturamento/ListarBoletos', {
        params:{
          billingInvoiceId,
          token
        }    
      });
        
      setPaymentSlipList(response.data.listInstallments)

      response.data.listInstallments.map((item) => 
        {
          setPaymentIdList(previousValues => [...previousValues, item.cod_FaturaParcela])
          item.selected = true // eslint-disable-line no-param-reassign
        }
      )
      setIsLoading(false)
      

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }

  const AddPaymentSlipToList = useCallback((e) => {

    if(e.selected == true) {

      paymentSlipList.map((item) => 
      (item.cod_FaturaParcela == e.cod_FaturaParcela && (
        item.selected = false // eslint-disable-line no-param-reassign
      ))
    )


    const paymentSlipIdListUpdate = paymentSlipIdList.filter(item => item != e.cod_FaturaParcela);
    setPaymentIdList(paymentSlipIdListUpdate)

    }

    else {

      paymentSlipList.map((item) => 
        (item.cod_FaturaParcela == e.cod_FaturaParcela && (
          item.selected = true // eslint-disable-line no-param-reassign
        ))
      )

      const newSlip = paymentSlipIdList.concat(e.cod_FaturaParcela)
      

      setPaymentIdList(newSlip)
    }

  },[paymentSlipIdList, paymentSlipList])

  return (
    <>

      {isSendEmail && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Enviando E-Mail ...
          </div>
        </>
      )} 

      {isLoading && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
      )}   
    
       
      <ModalBillingInvoiceEmail show>

        <div className='header'>
          <p className='headerLabel'>Emissão da Fatura</p>
        </div>
    
        <div style={{marginTop:"2%"}}>
          <p style={{textAlign:"center", color:"var(--blue-twitter)"}}>Esta fatura possui boletos gerados.</p> 
        </div>
        
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"row"}}> 
          <div>
            <p style={{color:"var(--blue-twitter)"}}>Selecione abaixo para anexa-los no documento</p>
          </div>
          
          <div>
            <FiHelpCircle className='infoMessage' title="Marque a caixa de seleção do vencimento correspondente para adiciona-lo na impressão, quando finalizar clique no botão gerar documento." />
          </div>

        </div>

        <div className='border'>&nbsp;</div>

        <div className='mainDiv'>
  
          <div style={{margin:"15px"}}>
            {paymentSlipList.map((item) => {
              return(
                <>
                  <div style={{display:"flex", marginTop:"1%"}}>
          
                    <div className='flgDiv' style={{marginTop:"auto"}}>
                      <input
                        checked={item.selected}
                        type="checkbox"
                        name="select"
                        onChange={() => AddPaymentSlipToList(item)}
                      />
                    </div>
                  
                    <p style={{marginLeft:"2%", fontSize:"16px"}}>{item.Descricao}</p>

                  </div>
                      
                </>
            )})}

          </div>

        </div>

        <div style={{textAlign:"center", marginTop:"2%"}}>
          {paymentSlipIdList.length > 0 && (
            <p style={{color:"var(--blue-twitter)"}}>
              {paymentSlipIdList.length}
              {"  "}
              Vencimento(s) adicionado(s) para impressão
            </p>
          )}

          {paymentSlipIdList.length == 0 && (
            <p style={{color:"red"}}>Nenhum vencimento adicionado para impressão</p>
          )}
        </div>
      
        <div className='footer'>
          
          <div style={{float:'right', marginRight:'12px', marginTop:"10px"}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> SendEmail()}
                style={{width:'120px'}}
              >
                <GrMail />
                Enviar E-Mail 
              </button>
            </div>
                  
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => CloseBillingInvoiceEmailModal()}
                style={{width:'90px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>

      </ModalBillingInvoiceEmail>

    </>
    
  
  )
  
  
}
export default BillingInvoiceEmailModal;
