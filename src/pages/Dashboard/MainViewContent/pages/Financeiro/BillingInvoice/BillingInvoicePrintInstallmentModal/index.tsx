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
import { AiOutlinePrinter } from 'react-icons/ai';
import api from 'services/api';
import {IPaymentSlipData, IInstallments } from '../../../Interfaces/IBIllingContract'
import { ModalBillingInvoicePrintModal, OverlayModalPrinter } from './styles';

const BillingInvoicePrintInstallmentModal = (props) => {
  const {documentModelId, cod_Fatura, CloseBillingInvoicePrintInstallmentModal, CloseModal} = props.callbackFunction
  const { addToast } = useToast();
  const [paymentSlipList, setPaymentSlipList] = useState<IInstallments[]>([]);
  const [paymentSlipIdList, setPaymentIdList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0);
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    LoadPaymentSlip();
  },[])

  const GenerateDocument = useCallback(async () => {

    let slips = '';
    paymentSlipIdList.map((item) => {
      return slips += `${item},`;
    })

    try {

      setIsGeneratingReport(true)

      const response = await api.post('/DocumentosModelo/GerarFaturaFinanceiro',
        {
          id: Number(cod_Fatura),
          documentModelId: Number(documentModelId),
          slipsSelected: slips,
          token,
        },
      );

      setIdReportGenerate(response.data)

    } catch (err: any) {
      setIsGeneratingReport(false)
      addToast({
        type: "error",
        title: "Falha ao gerar documento.",
        description:  err.response.data.Message
      })
    }

  }, [documentModelId, cod_Fatura, paymentSlipIdList]);

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

        if(response.data == "E"){
          setIsGeneratingReport(false)
          clearInterval(checkInterval);
          addToast({
            type: "error",
            title: "Falha ao gerar documento.",
            description:  response.data.Message
          })
        }

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

  const LoadPaymentSlip = async () => {  
    try {
      setIsLoading(true)
      const response = await api.get<IPaymentSlipData>('/Financeiro/Faturamento/ListarBoletos', {
        params:{
          billingInvoiceId: cod_Fatura,
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

      {isGeneratingReport && (
        <>
          <OverlayModalPrinter />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Gerando Relatório ...
          </div>
        </>
      )} 

      {isLoading && (
        <>
          <OverlayModalPrinter />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
      )}   
    
       
      <ModalBillingInvoicePrintModal show>

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
                onClick={()=> GenerateDocument()}
                style={{width:'170px'}}
              >
                <AiOutlinePrinter />
                Gerar Documento 
              </button>
            </div>
                  
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => CloseBillingInvoicePrintInstallmentModal()}
                style={{width:'90px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>

      </ModalBillingInvoicePrintModal>

    </>
    
  
  )
  
  
}
export default BillingInvoicePrintInstallmentModal;
