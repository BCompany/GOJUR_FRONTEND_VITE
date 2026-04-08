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
import { IFinancialIntegrator } from '../../FinancialIntegrator/Interfaces/IFinancialIntegrator';
import { useAuth } from 'context/AuthContext';


const PaymentSlipModal = (props) => {
  const { setDtaVencimentoBoleto, dtaVencimentoBoleto, paymentSlipValue, dtaVencimentoFatura, selectedIntegrator, selectedPeople, invoice2MovementId, formattedInstallment, movementId, LoadMovement, LoadBillingInvoicing, setShowPaymentSlipModal, ClosePaymentSlipModal } = props.callbackFunction
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const [isSaving, setisSaving] = useState<boolean>(); // set trigger for show loader
  const [flg_Juros, setFlg_Juros] = useState<boolean>(true)
  const [paymentSlipValueAdditional, setPaymentSlipValueAdditional] = useState<string>("0");
  const [paymentSlipValueTotal, setPaymentSlipValueTotal] = useState<string>("0");

  const [pct_Juros, SetPct_Juros] = useState<string>("0");
  const [pct_JurosMora, setPct_JurosMora] = useState<string>("0");

  const token = localStorage.getItem('@GoJur:token');
  const apiKey = localStorage.getItem('@GoJur:apiKey');
  const companyId = localStorage.getItem('@GoJur:companyId');

  const { isMOBILE } = useDevice();

  useEffect(() => {

    const loadData = async () => {
      if (flg_Juros === true) {
        await loadFinancialIntegrator(selectedIntegrator?.id);
        await handleBankSlipCalculator();

        //RefreshTaxInsterests();
      }

      if (flg_Juros === false) {
        setPaymentSlipValueTotal(paymentSlipValue);
        setPaymentSlipValueAdditional("0");
      }
    };

    loadData();

  }, [flg_Juros, dtaVencimentoBoleto, pct_Juros, pct_JurosMora]);



  const loadFinancialIntegrator = useCallback(async (financialIntegratorId: number) => {
    try {
      const response = await api.get<IFinancialIntegrator>(
        '/IntegradorFinanceiro/Selecionar',
        {
          params: {
            id: financialIntegratorId,
            companyId,
            token,
            apiKey
          },
        }
      );

      const data = response.data;

      SetPct_Juros(String(data?.penaltyPercentage))
      setPct_JurosMora(String(data?.lateInterestPercentage))


      return data;

    } catch (err) {

      if (err.response.data.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }

      console.error(err);
      return null;
    }
  }, [token]);





  const handleBankSlipCalculator = async () => {
    try {

      //alert('dtaVencimentoFatura' + dtaVencimentoFatura); 
      //alert('dtaVencimentoBoleto' + dtaVencimentoBoleto); 

      const payload = {
        dueDate: dtaVencimentoFatura,
        installmentNewDate: dtaVencimentoBoleto,
        installmentValue: paymentSlipValue,
        taxPercent: pct_Juros,
        interestPercent: pct_JurosMora,
        financialIntegratorId: selectedIntegrator?.id,
        companyId,
        token,
        apiKey
      };

      const response = await api.post("/BankSlip/Calculator", payload);

      const data = response.data;

      setPaymentSlipValueAdditional(String(data.taxInterestValue?.toFixed(2)))
      setPaymentSlipValueTotal(response.data.totalValue)


    }

    catch (err: any) {

      addToast({
        type: "error",
        title: "Operação não realizada",
        description: err.response?.data?.Message
      });
    }

  };


const parseBRDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

  const handleGenerateBankSlip = async () => {
    try {


      if (!selectedIntegrator?.id) {
        addToast({
          type: 'info',
          title: 'Campo Obrigatório',
          description: 'Selecione o Integrador Financeiro para gerar o boleto',
        });
        return;
      }


    const today = new Date();


    const dueDate = new Date(dtaVencimentoBoleto + "T00:00:00");

    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    if (dueDateOnly < todayOnly) {
      addToast({
        type: 'error',
        title: 'Data inválida',
        description: 'A data de vencimento deve ser maior ou igual a hoje',
      });
      return;
    }

      const payload = {
        token: token,
        companyId,
        apiKey,
        customerId: selectedPeople.id,
        FinancialIntegratorId: selectedIntegrator?.id,
        amount: paymentSlipValueTotal,
        dueDate: dtaVencimentoBoleto,
        documentNumber: formattedInstallment,
        invoice2MovementId: invoice2MovementId
      };

      const response = await api.post("/BankSlip/Generate", payload);

      const data = response.data;

      const responseBilling = await LoadBillingInvoicing(movementId);
      await LoadMovement(movementId, responseBilling?.invoiceDescription);

      addToast({
        type: 'info',
        title: 'Boleto gerado',
        description: 'Seu boleto foi gerado com sucesso',
      });


      setShowPaymentSlipModal(false)
      

    }

    catch (err: any) {

      addToast({
        type: "error",
        title: "Operação não realizada",
        description: err.response?.data?.Message
      });
    }

  };



  /*
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
*/


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


  /*
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
*/

  return (
    <>
      {!isMOBILE && (
        <ModalPaymentSlip show>

          <div style={{ marginLeft: '15px', marginTop: '10px', marginRight: '10px' }}>
            Boleto
            <br />
            <br />

            <label htmlFor="data">
              <p>Vencimento</p>
              <input
                name='data'
                style={{ backgroundColor: "white" }}
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

            <div style={{ display: "flex" }}>

              <span style={{ width: "115px" }}>Multa/Juros ?</span>

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

            <div style={{ float: 'right', marginRight: '12px' }}>
              <div style={{ float: 'left' }}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={() => handleGenerateBankSlip()}
                  style={{ width: '100px' }}
                >
                  <FaFileAlt />
                  Gerar
                </button>
              </div>

              <div style={{ float: 'left', width: '100px' }}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => setShowPaymentSlipModal(false)}
                  style={{ width: '100px' }}
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