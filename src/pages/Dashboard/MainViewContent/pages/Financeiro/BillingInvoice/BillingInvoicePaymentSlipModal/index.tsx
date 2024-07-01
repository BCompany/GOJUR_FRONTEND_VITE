import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaFileAlt, FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FormatCurrency } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { IPositionData } from '../../../Interfaces/IBIllingContract'
import { ModalPaymentSlip } from './styles';

const PaymentSlipModal = (props) => {
  const {num_PaymentSlip, cod_Fatura, setDtaVencimentoBoleto, dtaVencimentoBoleto, paymentSlipValue, pct_Juros, pct_JurosMora, dtaVencimentoFatura, setShowPaymentSlipModal, ClosePaymentSlipModal} = props.callbackFunction
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [flg_Juros, setFlg_Juros] = useState<boolean>(true)
  const [paymentSlipValueAdditional, setPaymentSlipValueAdditional] = useState<string>("0");
  const [paymentSlipValueTotal, setPaymentSlipValueTotal] = useState<string>("0");
  const token = localStorage.getItem('@GoJur:token');

  const { isMOBILE } = useDevice();

  useEffect(() => {  
    if (flg_Juros == true){
      RefreshTaxInsterests()
    }

    if (flg_Juros == false){
      setPaymentSlipValueTotal(paymentSlipValue)
      setPaymentSlipValueAdditional("0")
    }

  },[flg_Juros, dtaVencimentoBoleto])


  const GeneratePaymentSlip = useCallback(async() => {
    try {

      setisSaving(true)
    
      await api.post('/Financeiro/Faturamento/GerarNovoBoleto', {   
        billingInvoiceId: cod_Fatura,
        newDueDate: dtaVencimentoBoleto,
        installmentNumber: num_PaymentSlip,
        calcTaxInterest: flg_Juros,
        token
      });

      setisSaving(false)
      ClosePaymentSlipModal()
      addToast({
        type: 'success',
        title: 'Faturamento - Faturas',
        description: 'O(s) boleto(s) foram gerado(s), não esqueça de gerar a REMESSA e enviar ao banco para registro do boleto.',
      });
      
    } catch (err: any) {

      addToast({
        type: 'error',
        title: 'Não foi possível executar esta operação',
        description: err.response.data.Message,
      });
  
      setisSaving(false)
      console.log(err);
    }
  },[flg_Juros, dtaVencimentoBoleto, num_PaymentSlip]);

  function CalcTaxInterest(installmentDueDate, installmentValue, taxPercent, interestPercent, installmentNewDate) {

    // millisecs in one day
    const oneDay = 1000 * 60 * 60 * 24;
    const dtaInstallmentNewDate = new Date(installmentNewDate);
    const dtaInstallmentDuewDate = new Date(installmentDueDate);
    const daysToCalc = (dtaInstallmentNewDate.getTime() - dtaInstallmentDuewDate.getTime()) / oneDay;

    if (daysToCalc > 0) {
        const taxVaue = installmentValue * (taxPercent / 100);
        const interestValue = installmentValue * (interestPercent / 30 / 100) * daysToCalc;
        return taxVaue + interestValue;
    }
    if (daysToCalc <= 0) {
        return 0;
    }
  }

  function RefreshTaxInsterests() {
    const installmentNewDate = dtaVencimentoBoleto
    const installmentValue2 = paymentSlipValue
    const taxPercent = pct_Juros;
    const interestPercent = pct_JurosMora;
    const taxInterestValue = CalcTaxInterest(dtaVencimentoFatura , installmentValue2, taxPercent, interestPercent, installmentNewDate);
    const totalValue = installmentValue2 + taxInterestValue;
    

    // Fmt the values as currency 
    setPaymentSlipValueAdditional(String(taxInterestValue?.toFixed(2)))
    setPaymentSlipValueTotal(totalValue)

    }

  return (
    <>
      {!isMOBILE &&(
        <ModalPaymentSlip show>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Boleto
            <br />
            <br />
         
            <label htmlFor="data">
              <p>Vencimento</p> 
              <input
                name='data'
                style={{backgroundColor:"white"}}
                type="date"
                value={dtaVencimentoBoleto}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaVencimentoBoleto(e.target.value)}
              />
            </label>

            <br />
            <br />

            <div>
              Valor
              <br />
              <input
                disabled
                value={FormatCurrency.format(Number(paymentSlipValue))}
              />
            </div>

            <br />

            <div style={{display:"flex"}}>

              <span style={{width:"115px"}}>Multa/Juros ?</span>

              <div className='flgDiv'>
                <input
                  type="checkbox"
                  name="select"
                  checked={flg_Juros}
                  onChange={() => setFlg_Juros(!flg_Juros)}
                />
              </div>
            </div>

            <br />

            <div>
              Multa/Juros R$:
              <br />
              <input
                disabled
                name="descricao"
                value={FormatCurrency.format(Number(paymentSlipValueAdditional))}
              />
            </div>

            <br />

            <div>
              Total:
              <br />
              <input
                disabled
                name="descricao"
                value={FormatCurrency.format(Number(paymentSlipValueTotal))}
              />
            </div>

            <br />
       
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> GeneratePaymentSlip()}
                  style={{width:'100px'}}
                >
                  <FaFileAlt />
                  Gerar 
                </button>
              </div>
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => setShowPaymentSlipModal(false)}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalPaymentSlip>
      )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Gerando Boletos ...
          </div>
        </>
  )} 

    </>
  )

}
export default PaymentSlipModal;