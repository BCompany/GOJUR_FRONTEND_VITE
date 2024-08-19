import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import api from 'services/api';
import DatePicker from 'components/DatePicker';
import { FormatCurrency, FormatDate } from 'Shared/utils/commonFunctions';
import { format } from 'date-fns';
import { FaCheck, FaRegTimesCircle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { ModalBankPaymentSlipSecond } from './styles';

export interface IBankPaymentSlip{
  paymentSlipId: string
  dueDate: string
  value: string
  paymentSlipValue: number
  paymentSlipPartnerId: string
  pct_Juros: string
  pct_Multa: string
}

const BankPaymentSlipSecondCopyModal = (props) => {
  const {setShowBankPaymentSlipSecondCopyModal, setBankPaymentSlipDate, setMovementValue, movementId, movementValue, GeneratePaymentSlip} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token')
  const { addToast } = useToast()
  const [flg_Juros, setFlg_Juros] = useState<boolean>(true)
  const [paymentSlipValueAdditional, setPaymentSlipValueAdditional] = useState<string>("0")
  const [paymentSlipValueTotal, setPaymentSlipValueTotal] = useState<string>("0")
  const [paymentSlipValue, setPaymentSlipValue] = useState<string>("0")
  const [paymentSlipDate, setPaymentSlipDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [pct_Juros, setPct_Juros] = useState<string>("0")
  const [pct_Multa, setPct_Multa] = useState<string>("0")


  useEffect(() => {
    LoadBankPaymentSlip()
  }, [])


  useEffect(() => {
    if (flg_Juros == true){
      RefreshTaxInsterests()
    }
    if (flg_Juros == false){
      setPaymentSlipValueTotal(paymentSlipValue)
      setPaymentSlipValueAdditional("0")
    }
  }, [flg_Juros, paymentSlipDate])


  const LoadBankPaymentSlip = async () => {
    try{
      const response = await api.get<IBankPaymentSlip>('/BoletoBancario/ObterPorMovimento', { params:{ movementId, partnerId: 'AS', token }});

      setPaymentSlipDate(FormatDate(new Date(response.data.dueDate), 'yyyy-MM-dd'))
      setPaymentSlipValue(response.data.value)
      setPct_Juros(response.data.pct_Juros)
      setPct_Multa(response.data.pct_Multa)
    }
    catch (err:any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  function RefreshTaxInsterests() {
    const installmentNewDate = paymentSlipDate
    const installmentValue2 = paymentSlipValue
    const taxPercent = pct_Juros;
    const interestPercent = pct_Multa;
    const taxInterestValue = CalcTaxInterest(paymentSlipDate , installmentValue2, taxPercent, interestPercent, installmentNewDate);
    const totalValue = installmentValue2 + taxInterestValue;

    // Fmt the values as currency 
    setPaymentSlipValueAdditional(String(taxInterestValue?.toFixed(2)))
    setPaymentSlipValueTotal(totalValue)
    setMovementValue(totalValue)
  }


  function CalcTaxInterest(installmentDueDate, installmentValue, taxPercent, interestPercent, installmentNewDate) {
    // Millisecs in one day
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


  const handleChangeDate = (item) => { 
    setPaymentSlipDate(item)
    setBankPaymentSlipDate(item)
  }

  setBankPaymentSlipDate


  return (
    <ModalBankPaymentSlipSecond>
      <div className='menuSection'>
        <FiX onClick={(e) => {setShowBankPaymentSlipSecondCopyModal(false)}} />
      </div>

      <div id='ModalContent' style={{marginTop:'-25px', textAlign:'-webkit-center'}}>
        Informe a data de vencimento da segunda via do boleto
        <br /><br />
        <div style={{width:'290px'}}>
          <label htmlFor="data">
            <p>Vencimento</p> 
            <input
              name='data'
              style={{backgroundColor:"white"}}
              type="date"
              value={paymentSlipDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDate(e.target.value)}
            />
          </label>
        </div>
        <br />

        <div style={{width:'290px'}}>
          Valor
          <br />
          <input disabled value={FormatCurrency.format(Number(movementValue))} style={{backgroundColor:'white'}} />
        </div>
        <br />

        <div style={{width:'290px'}}>
          <div style={{width:'200px', float:'left'}}>
            <span style={{width:"115px"}}>Multa/Juros ?</span>
          </div>
          <div className='flgDiv' style={{float:'left'}}>
            <input type="checkbox" name="select" checked={flg_Juros} onChange={() => setFlg_Juros(!flg_Juros)}/>
          </div>
        </div>
        <br /><br />
        
        <div style={{width:'290px'}}>
          Multa/Juros R$:
          <br />
          <input disabled name="descricao" value={FormatCurrency.format(Number(paymentSlipValueAdditional))}/>
        </div>
        <br />

        <div style={{width:'290px'}}>
          Total:
          <br />
          <input disabled name="descricao" value={FormatCurrency.format(Number(paymentSlipValueTotal))}/>
        </div>
        <br /><br />

        <div id='Buttons' style={{marginLeft:'130px'}}>
          <div style={{float:'left'}}>
            <button className="buttonClick" type='button' onClick={()=> GeneratePaymentSlip('justOne', true)} style={{width:'150px'}}>
              <FaCheck />
              Gerar 2ª Via
            </button>
          </div>

          <div style={{float:'left'}}>
            <button type='button' className="buttonClick" onClick={()=> {setShowBankPaymentSlipSecondCopyModal(false)}} style={{width:'150px'}}>
              <FaRegTimesCircle />
              Fechar
            </button>
          </div>
        </div>
      </div>
    </ModalBankPaymentSlipSecond>
  )
}
export default BankPaymentSlipSecondCopyModal;