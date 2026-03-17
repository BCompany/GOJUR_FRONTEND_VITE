/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import api from 'services/api';
import ModalOptions from 'components/ModalOptions';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import Select from 'react-select';
import { format } from 'date-fns';
import { FaRegTimesCircle, FaCheck } from 'react-icons/fa';
import { BiSave } from 'react-icons/bi';
import { FiX, FiTrash } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import IntlCurrencyInput from "react-intl-currency-input";
import { currencyConfig, selectStyles } from 'Shared/utils/commonFunctions';
import { IPayments } from '../Interfaces/IPayments';
import { Modal, ModalPostBackValidation, OverlayFinancialPayment } from './styles';
import { ISelectData, MatterData, IMovementUploadFile } from '../Interfaces/IFinancial';
import { parcelas, parcelasDatas, financialReminders } from 'Shared/utils/commonListValues';


interface IFinancial {
  cod_Movimento: string;
  dta_Movimento: string;
  dta_Liquidacao: string;
  des_Movimento: string;
  nom_Categoria: string;
  tpo_Movimento: string;
  cod_FormaPagamento: string;
  vlr_Movimento_Contabil: string;
  vlr_Liquidacao_Contabil: string;
  qtd_Parcelamento: string;
  num_Parcela: string;
  matterCustomerDesc: string;
  matterOpposingDesc: string;
  userNames: string;
  num_Processo: string;
  totalRecords: number;
  cod_FaturaParcela: number;
  cod_Acordo: string;
  parcelaFormatada?: string;
  cod_Fatura2Movimento?: string;
  flg_MovimentoExccluido?: string;
  des_Observacao?: string;
}


const FinancialInvoicingModal = (props) => {

  const { movementId, movementIdEdit, invoiceId, billingInvoicing, movementList, ClosePaymentModal, LoadMovement, LoadBillingInvoicing } = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
   const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller} = useConfirmBox();
  const [paymentList, setPaymentList] = useState<IPayments[]>([]);
  const [showPostBackValidation, setShowPostBackValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormDescription, setPaymentFormDescription] = useState<string>("")
  const [movementParcelas, setMovementParcelas] = useState('1');
  const [movementNumParcelas, setMovementNumParcelas] = useState('1');
  const [movement, setMovement] = useState<IFinancial>();
  const [movementDate, setMovementDate] = useState<string>('');
  const [movementValue, setMovementValue] = useState<number | null>(null);
  const [observation, setObservation] = useState<string>('');
  const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [movementParcelasDatas, setMovementParcelasDatas] = useState('M');
  const [movementType, setMovementType] = useState('');
  const [movementParcelasFirst, setMovementParcelasFirst] = useState('1');
  const [codParcelamento, setCodParcelamento] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [centerCostId, setCenterCostId] = useState('');
  const [centerCostDescription, setCenterCostDescription] = useState<string>('')
  const [taxInvoice, setTaxInvoice] = useState<string>('');
  const [movementDescription, setMovementDescription] = useState('');
  const [flgNotifyPeople, setFlgNotifyPeople] = useState<boolean>(false);
  const [flgNotifyEmail, setFlgNotifyEmail] = useState<boolean>(true);
  const [flgNotifyWhatsApp, setFlgNotifyWhatsApp] = useState<boolean>(false);
  const [reminders, setReminders] = useState('00');
  const [showNotifyPeople, setShowNotifyPeople] = useState<boolean>(false);
  const [flgReembolso, setFlgReembolso] = useState<boolean>(false);
  const [flgStatus, setFlgStatus] = useState('A');
  const [showParcelasDatas, setShowParcelasDatas] = useState<boolean>(false);
  const [accountId, setAccountId] = useState('');
  const [paymentQtd, setPaymentQtd] = useState('');
  //const [invoice, setInvoice] = useState<number>(0);
  const [sequence, setSequence] = useState<string>('');
  const [enablePayments, setEnablePayments] = useState<boolean>(true);
  const [matterId, setMatterId] = useState('');
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
  const [actionSave, setActionSave] = useState<string>('');
  const [changeInstallments, setChangeInstallments] = useState<boolean>(false);
  const [changeCustomer, setChangeCustomer] = useState<boolean>(true);
  const [showChangeInstallments, setShowChangeInstallments] = useState<boolean>(false);
  const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
  const companyId = localStorage.getItem('@GoJur:companyId');
  const [showChangeCustomer, setShowChangeCustomer] = useState<boolean>(false);
  const [movementdiscount, setMovementDiscount] = useState<number>();
  const [movementNetValue, setMovementNetValue] = useState<number>();

  useEffect(() => {
      if (isCancelMessage && caller === 'changeDefaultHeader')
      {
        setShowChangeInstallments(false)
        handleCancelMessage(false)
      }
 
      if (isCancelMessage && caller === 'changeDefaultHeader2')
      {
        setShowChangeCustomer(false)
        handleCancelMessage(false)
      }
    }, [isCancelMessage, caller]);
  
  
    useEffect(() => {

      if(isConfirmMessage && caller === 'changeDefaultHeader')
      {
        handleConfirmChangeInstallments()
        setShowChangeInstallments(false)
        handleConfirmMessage(false)
      }
      
      if(isConfirmMessage && caller === 'changeDefaultHeader2')
      {
        handleConfirmChangeCustomer()
        setShowChangeCustomer(false)
        handleConfirmMessage(false)
      }


    }, [isConfirmMessage, caller]);
  

  const handleConfirmChangeInstallments = async () => {
    setChangeInstallments(false);
    setChangeCustomer(false);
    setActionSave('all');
  }

  const handleConfirmChangeCustomer = async () => {
    setChangeCustomer(false);
    setActionSave('all');
  }

  useEffect(() => {
    LoadMovementForm(Number(movementIdEdit))
    LoadPaymentForm()
  }, [])


    const LoadPayments = async () => {

    try {
      const response = await api.get<IPayments[]>('/Financeiro/ObterPagamentos', {
        params: {
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
      dta_LiquidacaoStr: format(new Date(), 'yyyy-MM-dd'),
      vlr_Liquidacao: 0,
      total_Restante: 0,
      tpo_Movimento: '',
      action: 'NEW',
    }

    setPaymentList(oldPayment => [...oldPayment, newPayment])
  }


  const ChangeDate = useCallback((value, paymentId) => {

    const newPayment = paymentList.map(payment => payment.cod_MovimentoLiquidacao === paymentId ? {
      ...payment,
      dta_LiquidacaoStr: value
    } : payment)

    setPaymentList(newPayment)

  }, [paymentList]);


  const ChangeValue = (value, paymentId) => {

    const newPayment = paymentList.map(payment => payment.cod_MovimentoLiquidacao === paymentId ? {
      ...payment,
      vlr_Liquidacao: Number(value)
    } : payment)

    setPaymentList(newPayment)
  };


  const RemovePayment = useCallback((paymentId) => {

    const payment = paymentList.map(i => i.cod_MovimentoLiquidacao === paymentId ? {
      ...i,
      action: 'DELETE'
    } : i);
    setPaymentList(payment)

  }, [paymentList]);


  const CloseModal = () => {
    ClosePaymentModal()
  }


   

  const LoadPaymentForm = async () => {
    try {
      const response = await api.get<ISelectData[]>('FormaDePagamento/ListarPorFiltro', { params: { filterClause: paymentFormTerm, token } })
      setPaymentFormList(response.data)
    }
    catch (err: any) {
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data })
    }
  }


  const handlePaymentFormSelected = (item) => {
    if (item) {
      setPaymentFormId(item.id)
      setPaymentFormDescription(item.label)
    } else {
      setPaymentFormId('')
      setPaymentFormDescription('')
      LoadPaymentForm()
    }
  }



  const handleChangeParcelas = (id: string) => {
    setMovementParcelas(id)

    setShowParcelasDatas(id != '1')

    if(movementIdEdit != '0' && id != movementParcelasFirst)
    {
      setChangeInstallments(true)
    }
    else{
      setChangeInstallments(false)
    }


  }


  
  useEffect(() => {
 
    if (movement?.des_Observacao) {
      setObservation(movement.des_Observacao);
    }
    

  }, [movement]);


  const convertBRToISO = (dateBR: string) => {
    if (!dateBR) return '';

    const [day, month, year] = dateBR.split('/');
    return `${year}-${month}-${day}`;
  };



    const LoadMovementForm = async (movementId) => {
      try {
        setIsLoading(true);
    
        const response = await api.get('/Financeiro/Editar', { params:{ id: Number(movementId), token }})
  
        setMovementDate(format(new Date(response.data.dta_Movimento), "yyyy-MM-dd"))
        setMovementValue(response.data.vlr_Movimento)
        //setMovementType(movementType)
        setMovementType('R')

        setMovementParcelas(response.data.qtd_Parcelamento.toString())
        setMovementParcelasFirst(response.data.qtd_Parcelamento.toString())
        setMovementParcelasDatas(response.data.Periodicidade)
        setCodParcelamento(response.data.cod_Parcelamento)
  
        setMovementNumParcelas(response.data.num_Parcela.toString())
        setCurrentInstallment(response.data.num_Parcela.toString() + '/' + response.data.qtd_Parcelamento.toString())
  
        setPaymentFormId(response.data.cod_FormaPagamento)
        setPaymentFormDescription(response.data.des_FormaPagamento)

        
        setCategoryId(response.data.cod_Categoria)
        setCategoryDescription(response.data.nom_Categoria)
        setCenterCostId(response.data.cod_CentroCusto)
        setCenterCostDescription(response.data.des_CentroCusto)
        setTaxInvoice(response.data.num_NotaFiscal)
        setMovementDescription(response.data.des_Movimento)
        
        setSelectedPeopleList(response.data.UserList.map(item => ({ ...item })));
        
        
        setFlgNotifyPeople(response.data.flg_NotificaPessoa)
        setFlgNotifyEmail(response.data.flg_NotificaEmail)
        setFlgNotifyWhatsApp(response.data.flg_NotificaWhatsApp)
        setReminders(response.data.Lembrete)
        setShowNotifyPeople(response.data.UserList.length > 0 && response.data.Lembrete != null)
        setFlgReembolso(response.data.flg_Reembolso)
        setFlgStatus(response.data.flg_Status)
        setShowParcelasDatas(response.data.qtd_Parcelamento != "1")
        setAccountId(response.data.cod_Conta)
        setPaymentQtd(response.data.qtd_Parcelamento)
        //setInvoice(response.data.cod_FaturaParcela)
        setSequence(response.data.num_SequenciaFatura)

        setMovementDiscount(response.data.pct_Desconto)
        setMovementNetValue(response.data.vlr_Liquido)
    
        if(response.data.qtd_Parcelamento != "1"){
          setEnablePayments(false)
        }
  
        if(response.data.cod_Processo != null)
        {
          setMatterId(response.data.cod_Processo)
          setProcessTitle(`${response.data.num_Processo} - ${response.data.matterCustomerDesc} x ${response.data.matterOpposingDesc}`)
        }
  
        //await LoadPayments()
        //await LoadDocuments()
        //await LoadBillingInvoicing(movementId);
        

        const movement = movementList.find(
          item => item.cod_Movimento === Number(movementIdEdit)
        );

        setMovement(movement);

        setIsLoading(false);
      }
      catch (err:any) {
        setIsLoading(false)
        addToast({type: "info", title: "Operação não realizada", description: err.response.data.Message})
      }
    }
  

  const Validate =() => {
    let isValid = true;

    // avoid click many times
    if (isSaving){
      return;
    }

    if (categoryId == '')
    {
      addToast({ type: "info", title: "Preencher campo", description: "O campo categoria deve ser preenchido" })
      isValid = false;
    }

    if (!movementDate)
    {
      addToast({ type: "info", title: "Preencher campo", description: "O campo vencimento deve ser preenchido" })
      isValid = false;
    }

    if (movementValue == 0)
    {
      addToast({ type: "info", title: "Preencher campo", description: "O campo valor deve ser preenchido" })
      isValid = false;
    }

    if (movementDescription == '')
    {
      addToast({ type: "info", title: "Preencher campo", description: "O campo descrição deve ser preenchido" })
      isValid = false;
    }

    /*
    if(invoiceId != 0)
    {
      addToast({ type: "info", title: "AVISO", description: "Esta movimentação esta vinculada diretamente a uma fatura, as alterações devem ser realizadas em sua fatura de origem." })
      isValid = false;
    }
    */
  
    if (changeInstallments)
    {
      setShowChangeInstallments(true)
      isValid = false;
    }
    //else if ( ( billingInvoicing.personId != billingInvoicing.personIdOld ) && changeCustomer == true)
    //{
    //  setShowChangeCustomer(true);
    //  isValid = false;
    //}
    else if (movementParcelas !=  '1' && actionSave.length == 0 && movementIdEdit.toString() != '0')
    {
      setShowModalOptions(true)
      isValid = false;
    }


    return isValid;
  }




    const Save = useCallback(async(caller: string) => {
    try {

      if (!Validate()) return;

      setIsSaving(true)
      setShowModalOptions(false)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      let codFatura2Movimento = movementList.find(
          item => item.cod_Movimento === movementIdEdit
      )?.cod_Fatura2Movimento;

      const response = await api.post('/Financeiro/Faturamento2/Salvar', {
        invoiceId: billingInvoicing.invoiceId || 0,
        companyId: billingInvoicing.companyId,
        invoiceNumber: billingInvoicing.invoiceNumber,
        personId: billingInvoicing.personId,
        personName: billingInvoicing.personName,
        personIdOld: billingInvoicing.personIdOld,
        billingRulerId: billingInvoicing.billingRulerId ?? null,
        invoiceDescription: billingInvoicing.invoiceDescription,
        issueDate: billingInvoicing.issueDate,
        movementId: movementIdEdit,
        token: token,
        financialDTO: {
          cod_Movimento: movementIdEdit,
          dta_Movimento: movementDate,
          vlr_Movimento: movementValue,
          tpo_Movimento : movementType,
          qtd_Parcelamento: movementParcelas,
          num_Parcela: movementNumParcelas,
          Periodicidade: movementParcelasDatas,
          cod_FormaPagamento: paymentFormId,
          cod_Categoria: categoryId,
          cod_CentroCusto: centerCostId,
          num_NotaFiscal: taxInvoice,
          des_Movimento: observation,
          peopleIds: peopleIdsItems,
          flg_NotificaPessoa: flgNotifyPeople,
          flg_NotificaEmail: flgNotifyEmail,
          flg_NotificaWhatsApp: flgNotifyWhatsApp,
          flg_Status: flgStatus,
          Lembrete: reminders,
          editChild: actionSave.length == 0? "justOne": actionSave, // Action save is used to define if is save one, all or next, when is empty consider only one
          flg_Reembolso: flgReembolso,
          cod_Processo: matterId,
          cod_Conta: accountId,
          pct_Desconto:movementdiscount,
          vlr_Liquido:movementNetValue,
          token
        },
        billingIssuingInvoices: movementList.map(item => ({
          invoiceMovimentId: item.cod_Fatura2Movimento || 0,
          companyId,
          invoiceId: invoiceId || 0,
          movementID: Number(item.cod_Movimento),
          descriptionObservation:
              item.cod_Movimento === movementIdEdit
                  ? observation || ''
                  : item.des_Observacao || ''
      }))

      })

      addToast({type: "success", title: "Operação realizada com sucesso", description: `${  movementType == 'R'? 'Receita': 'Despesa'  } salva com sucesso`})

      //handleStateType('Inactive')

      CloseModal();

      const responseBilling = await LoadBillingInvoicing(movementId.toString());
      await LoadMovement(movementId.toString(), responseBilling?.invoiceDescription);

   
      
    } catch (err:any) {
      addToast({type: "info", title: "Falha ao salvar movimento.", description: err.response.data.Message})
      setIsSaving(false)
      setShowChangeInstallments(false)
    }
  }, [isSaving, selectedPeopleList, movementIdEdit, invoiceNumber, movementDate, movementValue, movementType, movementParcelas, movementParcelasDatas, paymentFormId, categoryId, centerCostId, taxInvoice, movementDescription, flgNotifyPeople, reminders, actionSave, flgReembolso, matterId, accountId, movementdiscount, movementNetValue, token, flgStatus, changeInstallments, changeCustomer, invoiceId, flgNotifyEmail, flgNotifyWhatsApp]);


  const handleCallback = (actionSave: string) => {
    setActionSave(actionSave)
  }

  useEffect (() => {
    if (actionSave.length > 0){
      Save('');
    }
  }, [actionSave])


  const handleDiscount = (event, value, maskedValue) => {
    event.preventDefault();
    setMovementDiscount(value)

    calculateNetValue(movementValue, value);
  };

  const calculateNetValue = (value, discount) => {
  const val = Number(value || 0);
  const desc = Number(discount || 0);

  const result = val - (val * (desc / 100));

  setMovementNetValue(parseFloat(result.toFixed(4)));
};

const handleValue = (event, value, maskedValue) => {
  event.preventDefault();
  setMovementValue(value)

  calculateNetValue(value, movementdiscount);

};


const fourDecimalPlacesConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      }
    }
  }
};


  return (
    <>
      <Modal show>

        <div id='Header' style={{ height: '30px' }}>
          <div className='menuTitle'>
       
            Parcela {currentInstallment}
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModal()} />
          </div>
        </div>


        <div id='Labels' style={{ marginLeft: '5%', marginTop: '5px', height: '30px' }}>
          <div style={{ float: 'left', width: '33%' }}>
            Vencimento:
          </div>
          <div style={{ float: 'left', width: '33%' }}>
            Forma Pagto:
          </div>
          <div style={{ float: 'left', width: '33%' }}>
            Parcelas :
          </div>
        </div>
        <div id='Elements' style={{ marginLeft: '4.5%', height: '40px' }}>

          <div style={{ float: 'left', width: '30%', marginRight:'10px' }}>
            <input
              type="date"
              value={movementDate}
              onChange={(e) => setMovementDate(e.target.value)}
              style={{ width: '100%' }}
              className='inputField'
            />
          </div>

          <div style={{ float: 'left', width: '30%', marginRight:'10px' }}>
        
          <Select
              isSearchable
              isClearable
              value={{ id: paymentFormId, label: paymentFormDescription }}
              onChange={handlePaymentFormSelected}
              onInputChange={(term) => setPaymentFormTerm(term)}
              required
              placeholder=""
              styles={{
                ...selectStyles, 
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({ ...base, fontSize: '12px' }),
              }}
              options={paymentFormList}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              
            />
          </div>

          <div style={{ float: 'left', width: '30%' }}>
          <Select
              autoComplete="off"
              styles={{
                ...selectStyles, 
                menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                menu: (base) => ({ ...base, fontSize: '12px' }),
              }}
              value={parcelas.filter(options => options.id === movementParcelas)}
              onChange={(item) => handleChangeParcelas(item ? item.id : '')}
              options={parcelas}
               menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            
          </div>

        </div>



        <div id='Labels' style={{ marginLeft: '5%', marginTop: '5px', height: '30px' }}>
          <div style={{ float: 'left', width: '33%' }}>
            Valor:
          </div>
          <div style={{ float: 'left', width: '33%' }}>
            (%)Desconto:
          </div>
          <div style={{ float: 'left', width: '33%' }}>
            Valor Liquido:
          </div>
        </div>

        <div id='Elements' style={{ marginLeft: '4.5%', height: '40px' }}>

          <div style={{ float: 'left', width: '30%', marginRight:'10px' }}>
            <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                value={movementValue}
                onChange={handleValue}
                className='inputField'
              />
          </div>

          <div style={{ float: 'left', width: '30%', marginRight:'10px' }}>
            <IntlCurrencyInput
              currency="BRL"
              config={fourDecimalPlacesConfig}
              value={movementdiscount}
              onChange={handleDiscount}
              className='inputField'
            />
          </div>

          <div style={{ float: 'left', width: '30%' }}>
            <IntlCurrencyInput
              currency="BRL"
              config={currencyConfig}
              value={movementNetValue}
              className='inputField'
              disabled={true}
            />
          </div>

        </div>


        <div id='Labels' style={{ marginLeft: '5%', marginTop: '5px', height: '30px' }}>
          <div style={{ float: 'left', width: '40%' }}>
            Observação
          </div>

        </div>


        <div id='Elements' style={{ marginLeft: '4.5%', height: '40px' }}>

          <div style={{ float: 'left', width: '94%' }}>
             <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              style={{ width: '100%' }}
              className='inputField'
               rows={4}
             />
          </div>


        </div>


        <br />
        <br />

        <div id='Buttons' style={{ float: 'right', marginRight: '7%', height: '60px' }}>
          <div style={{ float: 'left' }}>
            <button
              className="buttonClick"
              type='button'
              onClick={() => Save('')}
              style={{ width: '100px' }}
            >
              <BiSave />
              Salvar
            </button>
          </div>

          <div style={{ float: 'left', width: '100px' }}>
            <button
              type='button'
              className="buttonClick"
              onClick={() => CloseModal()}
              style={{ width: '100px' }}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
        </div>

      </Modal>

      {showModalOptions && (
        <ModalOptions
          description="Este movimento está parcelado, deseja atualizar também as outras parcelas ?"
          close={() => setShowModalOptions(false)}
          callback={handleCallback}
        />
      )}

       {showChangeInstallments && (
        <ConfirmBoxModal
          title="Alterar parcelas do movimento"
          caller="changeDefaultHeader"
          useCheckBoxConfirm
          message="Foi alterado o número de parcelas do movimento, o reparcelamento implica em alterar todas as parcelas considerando os dados do movimento atual. Eventuais liquidações serão mantidas desde que a parcela não seja removida (no caso de redução de parcelas)."
        />
      )}
      
      {showChangeCustomer && (
          <ConfirmBoxModal
              title="Alterar cliente da fatura"
              caller="changeDefaultHeader2"
              useCheckBoxConfirm
              message="Você esta alterando o cliente através da fatura, todos os movimentos serão alterados"
          />
      )}


      {(showPostBackValidation) && <OverlayFinancialPayment />}
      {showPostBackValidation && (
        <ModalPostBackValidation>
          <div className='menuSection'>
            <FiX onClick={(e) => setShowPostBackValidation(false)} />
          </div>
          <div style={{ marginLeft: '5%' }}>
            {/* A soma dos pagamentos totalizam: R$ 15,00, este valor excede o total da parcela de: ( R$ 10,00 ). Deseja continuar mesmo assim ? */}
            A soma dos pagamentos excedem o total da parcela. Deseja continuar mesmo assim ?
            <br />
            <br />
            <div style={{ float: 'right', marginRight: '7%', bottom: 0 }}>
              <div style={{ float: 'left' }}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={() => SavePayments(true)}
                  style={{ width: '100px' }}
                >
                  <FaCheck />
                  Sim
                </button>
              </div>

              <div style={{ float: 'left', width: '100px' }}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => setShowPostBackValidation(false)}
                  style={{ width: '100px' }}
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

export default FinancialInvoicingModal;
