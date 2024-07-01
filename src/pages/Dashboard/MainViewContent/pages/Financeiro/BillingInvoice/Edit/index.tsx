/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useLocation, useHistory } from 'react-router-dom'
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AutoCompleteSelect, GridSubContainer } from 'Shared/styles/GlobalStyle';
import { languageGridEmpty, languageGridLoading, loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { CgAdd } from 'react-icons/cg';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import IntlCurrencyInput from "react-intl-currency-input"
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { AiOutlineBarcode, AiOutlinePrinter } from 'react-icons/ai';
import { IoIosPaper } from 'react-icons/io';
import { FaFileContract, FaFileInvoiceDollar, FaRegTimesCircle } from 'react-icons/fa';
import { GrMail } from 'react-icons/gr';
import { useToast } from 'context/toast';
import { FiEdit, FiSave, FiTrash } from 'react-icons/fi';
import { currencyConfig } from 'Shared/utils/commonFunctions';
import { parcelasBillingInvoice } from 'Shared/utils/commonListValues';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { format } from 'date-fns';
import api from 'services/api';
import Select from 'react-select'
import { selectStyles, useDelay, FormatDate, FormatCurrency} from 'Shared/utils/commonFunctions';
import LogModal from '../../../../../../../components/LogModal';
import BillingInvoicePaymentModal from '../BillingInvoicePaymentModal';
import PaymentSlipModal from '../BillingInvoicePaymentSlipModal';
import BillingInvoiceDocumentModal from '../BillingInvoiceDocumentModal';
import BillingInvoiceEmailModal from '../BillingInvoiceEmailModal'
import { Container, Content, Form, OverlayPaymentModal } from './styles';
import { ISelectData, IServiceTypeSelectData, IPaymentFormSelectData, IPeopleData, ICategoryData, IFinancialStatusData, IServiceTypeData, IPaymentFormData, ICostCenterData, IPaymentSlipContractData, IAccount, IBillingInvoiceData, IBillingInvoiceServiceData, IBillingInvoiceInstallmentData, IBillingInvoicePaymentData, IlistInstallments, IEmailOptions } from '../../../Interfaces/IBIllingContract'

const BillingInvoiceEdit: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { pathname } = useLocation();
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const billingInvoiceId = pathname.substr(32)
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isSaving, setIsSaving]= useState<boolean>(false);
  const [addNewInstallments, setAddNewInstallments]= useState<boolean>(false);
  const [isDeleting, setIsDeleting]= useState<boolean>(false);
  const [peopleType, setPeopleType] = useState<string>("C")
  const [numSequencial, setNumSequencial] = useState<string>("Novo")
  const [paymentType, setPaymentType] = useState<string>("U")
  const [paymentParcelas, setPaymentParcelas] = useState<string>("2");
  const [tpo_Parcelamento, setTpo_Parcelamento] = useState<string>("M")
  const [totalValueGrid, setTotalValueGrid] = useState<string>("")
  const [totalValueGridNew, setTotalValueGridNew] = useState<number>(0)
  const [flgExpiration, setFlgExpiration] = useState<string>("")
  const [billingInvoiceServiceId, setBillingInvoiceServiceId] = useState <string>("")
  const [gridValueUpdate, setGridValueUpdate] = useState<boolean>(false)
  const [cod_Fatura, setCod_Fatura] = useState<string>("0")
  const [numSequenciaFatura, setNumSequenciaFatura] = useState<string>("0")
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [showLog, setShowLog] = useState(false);
  const [payment, setPayment] = useState<string>("Pendente")
  const [billingInvoiceInstallmentList, setBillingInvoiceInstallmentList] = useState<IBillingInvoiceInstallmentData[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string>("0")
  const [hasPaymentSlip, setHasPaymentSlip] = useState<boolean>(false);
  const [recalculate, setRecalculate] = useState<boolean>(false);
  const [billingContractId, setBillingContractId] = useState<string>("0")

  const [people, setPeople] = useState<ISelectData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleValue, setPeopleValue] = useState('');
  const [peopleTerm, setPeopleTerm] = useState('');

  const [financialStatus, setFinancialStatus] = useState<ISelectData[]>([]);
  const [financialStatusId, setFinancialStatusId] = useState('');
  const [financialStatusType, setFinancialStatusType] = useState<string>("")
  const [financialStatusValue, setFinancialStatusValue] = useState('');
  const [financialStatusTerm, setFinancialStatusTerm] = useState('');

  const [serviceType, setServiceType] = useState<IServiceTypeSelectData[]>([]);
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [serviceTypeValue, setServiceTypeValue] = useState('');
  const [serviceTypeTerm, setServiceTypeTerm] = useState('');
  const [calculationType, setCalculationType] = useState<string>("")
  const [flgMultipleUnit, setFlgMultipleUnit] = useState<string>("N")

  const [serviceValue, setServiceValue] = useState<string>("0")
  const [serviceQtd, setServiceQtd] = useState<string>("1")
  const [serviceDescount, setServiceDescount] = useState<string>("0")
  const [serviceDescription, setServiceDescription] = useState<string>("")

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalRowsServiceTypeList, setTotalRowsServiceTypeList] = useState(0);
  const [billingInvoiceServiceGridList, setBillingInvoiceServiceGridList] = useState<IBillingInvoiceServiceData[]>([]);

  const [paymentForm, setPaymentForm] = useState<IPaymentFormSelectData[]>([]);
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormValue, setPaymentFormValue] = useState('');
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [paymentFormType, setPaymentFormType] = useState<string>("")

  const [dtaVencimento, setDtaVencimento] = useState("");

  const [costCenter, setCostCenter] = useState<ISelectData[]>([]);
  const [costCenterId, setCostCenterId] = useState('');
  const [costCenterValue, setCostCenterValue] = useState('');
  const [costCenterTerm, setCostCenterTerm] = useState('');

  const [paymentSlipContract, setPaymentSlipContract] = useState<ISelectData[]>([]);
  const [paymentSlipContractId, setPaymentSlipContractId] = useState('');
  const [paymentSlipContractValue, setPaymentSlipContractValue] = useState('');
  const [paymentSlipContractTerm, setPaymentSlipContractTerm] = useState('');

  const [account, setAccount] = useState<ISelectData[]>([]);
  const [accountId, setAccountId] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [accountTerm, setAccountTerm] = useState('');

  const [category, setCategory] = useState<ISelectData[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('');

  const [showPaymentSlipModal, setShowPaymentSlipModal] = useState<boolean>(false);
  const [dtaVencimentoBoleto, setDtaVencimentoBoleto] = useState("");
  const [dtaVencimentoFatura, setDtaVencimentoFatura] = useState("")
  const [paymentSlipValue, setPaymentSlipValue] = useState<string>("0");
  const [pct_Juros, setPct_Juros] = useState<string>("0")
  const [pct_JurosMora, setPct_JurosMora] = useState<string>("0")
  const [num_PaymentSlip, setNum_PaymentSlip] = useState<string>("0")
  const [openChangeParcelasModal, setOpenChangeParcelasModal] = useState(false);
  const [confirmChangeParcelas, setConfirmChangeParcelas] = useState<boolean>(false)
  const [num_ParcelaChange, setNum_ParcelaForChange] = useState<string>("0")
  const [paymentTypeChange, setPaymentTypeChange] = useState<string>("U")
  const [addSequencial, setAddSequencial] = useState<boolean>(false)
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [confirmSave, setConfirmSave] = useState<boolean>(false)
  const [openExclusionModal, setOpenExclusionModal] = useState(false);
  const [confirmExclusion, setConfirmExclusion] = useState<boolean>(false)
  const [showBillingInvoiceDocumentModal, setShowBillingInvoiceDocumentModal] = useState<boolean>(false);
  const [showBillingInvoiceEmailModal, setShowBillingInvoiceEmailModal] = useState<boolean>(false);
  const [isSendEmail, setIsSendEmail] = useState<boolean>(false);
  const [openSendEmailModal, setOpenSendEmailModal] = useState(false);
  const [confirmSendEmail, setConfirmSendEmail] = useState(false);
  const [modalConfirmSave, setModalConfirmSave] = useState<boolean>(false)
  const [saveIfHasPaymentSlip, setSaveIfHasPaymentSlip] = useState<boolean>(false)
  const [postBackValidation, setPostBackValidation] = useState<boolean>(false)
  const [paymentSitutation, setPaymentSituation] = useState<string>("A")
  const [peopleEmail, setPeopleEmail] = useState<string>("")
  const [billingInvoiceEmail, setBillingInvoiceEmail] = useState<string>("")

  useEffect(() => {
    LoadFinancialStatus();
    LoadServiceType();
    LoadPaymentForm();
    LoadCostCenter();
    LoadPaymentSlipContract(); 
    LoadAccount();
    LoadCategory();
  },[])

  useEffect(() => {  
    if (addSequencial == true){
      saveBillingInvoice()
    }

  },[addSequencial])

  useEffect(() => {  
    if (recalculate == true){
      handleConfiguraInstallment(1, "recalculate")
    }

  },[recalculate])

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmOpenParcelasModal')
      {
        setOpenChangeParcelasModal(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenParcelasModal')
      {
        setConfirmChangeParcelas(true)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmChangeParcelas)
    {  

      setConfirmChangeParcelas(false)
      setOpenChangeParcelasModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      RemoveItensList(num_ParcelaChange)
      setPaymentParcelas(num_ParcelaChange)
      setAddNewInstallments(true)
      setPaymentType(paymentTypeChange)

    }
  },[confirmChangeParcelas]);


  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmSaveModal')
      {
        setOpenSaveModal(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmSaveModal')
      {
        setConfirmSave(true)
        setPaymentType(paymentTypeChange)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmSave)
    {  

      setConfirmSave(false)
      setOpenSaveModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      saveBillingInvoice()
    
    }
  },[confirmSave]);

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmExclusionModal')
      {
        setOpenExclusionModal(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmExclusionModal')
      {
        setConfirmExclusion(true)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmExclusion)
    {  
      setConfirmExclusion(false)
      setOpenExclusionModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      deleteBillingInvoice()
      
    }
  },[confirmExclusion]);

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmOpenSendEmailModal')
      {
        setOpenSendEmailModal(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenSendEmailModal')
      {
        setConfirmSendEmail(true)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmSendEmail)
    {  
      setConfirmSendEmail(false)
      setOpenSendEmailModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      EmailOptions()
    }
  },[confirmSendEmail]);

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
        setSaveIfHasPaymentSlip(true)
        setPostBackValidation(true)
      }
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(saveIfHasPaymentSlip)
    {  

      setSaveIfHasPaymentSlip(false)
      setModalConfirmSave(false)
      handleCaller("")
      handleConfirmMessage(false)
      saveBillingInvoice()
    }
  },[saveIfHasPaymentSlip]);


  useEffect(() => {  
    if (billingInvoiceId != "0"){
      LoadBillingInvoiceGridList();
      SelectBillingInvoice();
    }

  },[billingInvoiceId])

  useEffect(() => {  
    if (addNewInstallments == true){
      handleConfiguraDate()
    }

  },[addNewInstallments])

  useEffect(() => {  
    if (billingInvoiceId == "0"){
      GetDefaultFinancialStatus();
      LoadDefaultAccount();
      LoadDefaultCategory();
    }

  },[billingInvoiceId])

  useEffect(() => {  
    LoadPeople();

  },[peopleType])

  useDelay(() => {
    if (peopleTerm.length > 0){
      LoadPeople()
    }
  }, [peopleTerm], 500)

  useDelay(() => {
    if (financialStatusTerm.length > 0){
      LoadFinancialStatus()
    }
  }, [financialStatusTerm], 500)

  useDelay(() => {
    if (serviceTypeTerm.length > 0){
      LoadServiceType()
    }
  }, [serviceTypeTerm], 500)

  useDelay(() => {
    if (paymentFormTerm.length > 0){
      LoadPaymentForm()
    }
  }, [paymentFormTerm], 500)

  useDelay(() => {
    if (paymentSlipContractTerm.length > 0){
      LoadPaymentSlipContract()
    }
  }, [paymentSlipContractTerm], 500)

  useDelay(() => {
    if (costCenterTerm.length > 0){
      LoadCostCenter()
    }
  }, [costCenterTerm], 500)

  // ServiceType columns
  const columnsServiceType = [
    { name: 'des_TipoServicoView',            title: 'Descrição' },
    { name: 'vlr_Servico',                    title: 'Valor' },
    { name: 'pct_Desconto',                   title: 'Desconto %' },
    { name: "vlr_Liquido",                    title: 'Líquido' },
    { name: "editar",                         title: ' ' },
    { name: "excluir",                        title: ' ' }
  ];

  const [tableColumnExtensionsServiceType] = useState([
    { columnName: 'des_TipoServicoView',       width: '50%' },
    { columnName: 'vlr_Servico',               width: '15%' },
    { columnName: 'pct_Desconto',              width: '15%' },
    { columnName: 'vlr_Liquido',               width: '10%' },
    { columnName: 'editar',                    width: '5%'  },
    { columnName: 'excluir',                   width: '5%'  }
  ]);


  const CustomCellUserList = (props) => {

    const { column } = props;

    if (column.name === 'editar') {
      return (
        <Table.Cell onClick={(e) => handleEditService(props)} {...props}>
          <FiEdit title="Clique para editar" />

        </Table.Cell>
      );
    }

    if (column.name === 'des_TipoServicoView' && props.row.tpo_Calculo == "DP" || column.name === 'des_TipoServicoView' && props.row.tpo_Calculo == "DV") {
      return (
        <Table.Cell {...props}>

          <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial', fontWeight:600,}}>{props.row.des_TipoServicoView}</span>
  
        </Table.Cell>
      );
    }

    if (column.name === 'excluir') {
      return (
        <Table.Cell onClick={(e) => handleRemoveService(props)} {...props}>
          <FiTrash title="Clique para excluir" />

        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Servico') {
      return (
        <Table.Cell {...props}>

          {props.row.tpo_Calculo != "DP" && props.row.tpo_Calculo != "DV" && (
            <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Servico)}</span>
          )}

          {props.row.tpo_Calculo == "DP" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Servico)}</span>
          )}

          {props.row.tpo_Calculo == "DV" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Servico)}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'pct_Desconto') {
      return (
        <Table.Cell {...props}>

          {props.row.tpo_Calculo != "DP" && props.row.tpo_Calculo != "DV" && (
            <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{Number(props.row.pct_Desconto).toFixed(2)}</span>
          )}

          {props.row.tpo_Calculo == "DP" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{Number(props.row.pct_Desconto).toFixed(2)}</span>
          )}

          {props.row.tpo_Calculo == "DV" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{Number(props.row.pct_Desconto).toFixed(2)}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Liquido') {
      return (
        <Table.Cell {...props}>

          {props.row.tpo_Calculo != "DP" && props.row.tpo_Calculo != "DV" && (
            <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Liquido)}</span>
          )}

          {props.row.tpo_Calculo == "DP" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Liquido)}</span>
          )}

          {props.row.tpo_Calculo == "DV" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Liquido)}</span>
          )}

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const saveBillingInvoice = useCallback(async() => {
    try {

      if(cod_Fatura == "0" && paymentType == "P" && totalValueGridNew == 0){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Para gerar o parcelamento é necessário que a fatura tenha valor, a data do 1º vencimento seja preenchida e o valor da 1ª parcela seja inferior ao total."
        })
        setPaymentType("U")
        return
      }

      if(peopleId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo tipo de pessoa deve ser preenchido."
        })
        setPaymentType("U")
        return
      }

      if(financialStatusId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo status deve ser preenchido."
        })
        setPaymentType("U")
        return
      }

      if(paymentFormType == "B" && paymentSlipContractId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Ao selecionar uma forma de pagamento do tipo 'Boleto', tambem é necessario escolher um item na Carteira de Cobrança."
        })
        setPaymentType("U")
        return
      }

      if(dtaVencimento == "" || dtaVencimento == "0"){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O vencimento não foi informado."
        })
        setPaymentType("U")
        return
      }

      if(categoryId == "0" || categoryId == "null"){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "A categoria não foi informada."
        })
        setPaymentType("U")
        return
      }

      if(billingInvoiceInstallmentList.length == 0 && paymentType == "P"){
        handleChangeParcelas("2")
      }

      if(billingInvoiceInstallmentList.length == 0 && paymentType == "U"){
        
        const installmentObject = {

          cod_FaturaParcela: (`N, 1`),
          cod_Fatura,
          num_Parcela: "1",
          dta_Vencimento: dtaVencimento,
          vlr_Parcela: totalValueGridNew,
          hasPaymentSlip: false,
          dta_VencimentoPaymentSlip: "",
          num_DiasVencimento: "",
          documentUrl: "",
          pct_Multa: "",
          cod_Movimento: "",
          pct_JurosMora: "",
          cod_Empresa: "",
          paymentDetails: {cod_FaturaParcelaLiquidacao: "0", dta_Liquidacao: "0", vlr_Liquidacao: "0", status: "A"}    
        }
    
        setBillingInvoiceInstallmentList(previousValues => [...previousValues, installmentObject])
        setAddNewInstallments(true)    
      }

      let liquidado = ""

      if(cod_Fatura != "0"){
        billingInvoiceInstallmentList.map((item) => {
          if(item.paymentDetails){
            if(item.paymentDetails.status == "F"){
              liquidado = "L"
            }
            if(item.paymentDetails.status != "F"){
              liquidado = "P"
            }
          }       
        })
      }

      if(billingInvoiceInstallmentList.length == 1){
        setRecalculate(true)
      }

      if (numSequencial == "Novo"){
        await GetNextSequence()
        setAddSequencial(true)
        return
      }
      

      setIsSaving(true)
 
      const response = await api.post('/Financeiro/Faturamento/SalvarFatura', {
        cod_Fatura,
        num_Sequencia: numSequencial,
        vlr_Fatura: totalValueGridNew,
        cod_Pessoa: peopleId,
        nom_Pessoa: peopleValue,
        cod_Conta: accountId,
        des_Conta: accountValue,
        cod_CarteiraCobranca: paymentSlipContractId,
        des_CarteiraCobranca: paymentSlipContractValue,
        cod_CentroCusto: costCenterId,
        des_CentroCusto: costCenterValue,
        cod_FormaPagamento: paymentFormId,
        tpo_FormaPagamento: paymentFormType,
        cod_StatusFinanceiro: financialStatusId,
        tpo_StatusFinanceiro: financialStatusType,
        qtd_Parcela: paymentParcelas,
        dta_PrimeiroVencimento: dtaVencimento,
        tpo_ClassePessoa: peopleType,
        tpo_Pagamento: paymentType,
        cod_Categoria: categoryId,
        nom_Categoria: categoryValue,
        tpo_StatusLiquidacao: liquidado,
        tpo_Parcelamento,
        servicos: billingInvoiceServiceGridList,
        parcelas: billingInvoiceInstallmentList,
        callbackValidation: postBackValidation,
        cod_ContratoFinanceiro: billingContractId,
        des_EmailFaturamentoPessoa: peopleEmail == "" ? null : peopleEmail,
        des_EmailFaturamento: billingInvoiceEmail == "" ? null : billingInvoiceEmail,
        token
      })
 
      addToast({
        type: "success",
        title: "Fatura Salva",
        description: "A fatura foi salva no sistema."
      })

      setPostBackValidation(false)
      setIsSaving(false)
      setRecalculate(false)
      setAddSequencial(false)
      
      if(cod_Fatura == "0"){
        history.push(`/financeiro/billinginvoice/edit/${response.data}`)
      }

      if(cod_Fatura != "0"){
        SelectBillingInvoice()
      }      
         
    } catch (err: any) {

      if(err.response.data.Message.includes("SlipGenerated")){
        setModalConfirmSave(true)
        setIsSaving(false)
        setRecalculate(false)
   
        return
      }
      setIsSaving(false)
      setRecalculate(false)

      addToast({
        type: "error",
        title: "Falha ao salvar.",
        description:  err.response.data.Message
      })
      
    }
  },[billingInvoiceInstallmentList, hasPaymentSlip,billingInvoiceServiceGridList, categoryValue, categoryId, accountValue, accountId, cod_Fatura, peopleId, totalValueGridNew, peopleValue, paymentSlipContractId, paymentSlipContractValue, costCenterId, costCenterValue, paymentFormId, paymentFormType, financialStatusId, financialStatusType, paymentParcelas, dtaVencimento, peopleType, paymentType, tpo_Parcelamento, numSequencial, postBackValidation, billingContractId, peopleEmail, billingInvoiceEmail]);

  const GetNextSequence = useCallback(async() => {

    const response = await api.get<IBillingInvoiceData>('/Financeiro/Faturamento/ObterProximoNumeroSequencia', {
      params:{
        token
      }
    })

    setNumSequencial(response.data.num_Sequencia)
  
  },[numSequencial]);


  const deleteBillingInvoice = async() => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)
      
      await api.delete('/Financeiro/Faturamento/Deletar', {
        params:{
        billingInvoiceId,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Faturamento excluído",
        description: "A fatura foi excluída no sistema."
      })

      history.push(`/financeiro/billinginvoice/list`)
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)
      console.log(err)
      addToast({
        type: "error",
        title: "Falha ao excluir fatura.",
        description:  err.response.data.Message
      })
    }
  };


  const SelectBillingInvoice = useCallback(async() => {
    const billingInvoiceId = pathname.substr(32)
    setIsLoading(true)

    const response = await api.get<IBillingInvoiceData>('/Financeiro/Faturamento/Editar', {
      params:{
        billingInvoiceId,
        token
      }
    })

    setBillingContractId(response.data.cod_ContratoFinanceiro)
    setPeopleType(response.data.tpo_ClassePessoa)
    setPeopleId(response.data.cod_Pessoa)
    setPeopleTerm(response.data.nom_Pessoa)
    setPeopleValue(response.data.nom_Pessoa)
    setNumSequencial(response.data.num_Sequencia)
    setFinancialStatusId(response.data.cod_StatusFinanceiro)
    setFinancialStatusValue(response.data.des_StatusFinanceiro)
    setFinancialStatusTerm(response.data.des_StatusFinanceiro)
    setPaymentType(response.data.tpo_Pagamento)
    setPaymentTypeChange(response.data.tpo_Pagamento)
    setPaymentFormId(response.data.cod_FormaPagamento)
    setCostCenterId(response.data.cod_CentroCusto)
    setPaymentFormType(response.data.tpo_FormaPagamento)
    setPaymentSlipContractId(response.data.cod_CarteiraCobranca)
    setPaymentSlipContractValue(response.data.des_CarteiraCobranca)
    setPaymentParcelas(response.data.qtd_Parcela.toString())
    setPeopleEmail(response.data.des_EmailFaturamentoPessoa)
    setBillingInvoiceEmail(response.data.des_EmailFaturamento)

    setHasPaymentSlip(response.data.parcelas[0].hasPaymentSlip)
    
    if(response.data.dta_PrimeiroVencimento != null){
      setDtaVencimento(FormatDate(new Date(response.data.dta_PrimeiroVencimento), 'yyyy-MM-dd'))
    }

    response.data.parcelas.map((item) => {
      item.dta_Vencimento = (FormatDate(new Date(item.dta_Vencimento), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign
      item.dta_VencimentoPaymentSlip = (FormatDate(new Date(item.dta_VencimentoPaymentSlip), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign
    })

    const newArrayParcelas = [...response.data.parcelas]

    setBillingInvoiceInstallmentList(newArrayParcelas)
    
    setCategoryId(response.data.cod_Categoria)
    setTpo_Parcelamento(response.data.tpo_Parcelamento)
    setFinancialStatusType(response.data.tpo_StatusFinanceiro)
    setCod_Fatura(response.data.cod_Fatura)
    setAccountId(response.data.cod_Conta)

    if(response.data.tpo_StatusLiquidacao == "P"){ 
      setPayment("Pendente")
    }
    else{
      setPayment("Liquidado")
    }

    setIsLoading(false)

  },[peopleType, accountId, paymentTypeChange,hasPaymentSlip,billingInvoiceInstallmentList, categoryId, payment, paymentParcelas, numSequenciaFatura, cod_Fatura, peopleId, peopleValue, peopleTerm, numSequencial, financialStatusId, financialStatusTerm, financialStatusValue, paymentType, paymentFormId, costCenterId, paymentFormType, paymentSlipContractId, dtaVencimento, paymentParcelas, tpo_Parcelamento, financialStatusType, billingInvoiceId, billingContractId, billingInvoiceEmail]);


  const EmailOptions = useCallback(async() => {
    setIsLoading(true)

    try {
   
      const response = await api.get<IEmailOptions>('/Financeiro/Faturamento/EnviarEmailOpcoes', {
        params:{
          billingInvoiceId,
          token
        }
      })

      if(response.data.invoiceHasSlipGenerated == true && response.data.listInstallments.length > 1){
        openEmailModal()
        setIsLoading(false)
      }

      else {
        SendEmail(response.data.listInstallments)
        setIsLoading(false)
      }
      
         
    } catch (err: any) {
      setIsLoading(false)
      console.log(err)
    }
  },[billingInvoiceId]);


  const SendEmail = useCallback(async(listInstallments: IlistInstallments[]) => {

    let slipsSelected = '';
    listInstallments.map((item) => {
      return slipsSelected += `${item.cod_faturaParcela},`;
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
         
    } catch (err: any) {
      setIsSendEmail(false)
      addToast({
        type: "error",
        title: "Falha ao enviar e-mail.",
        description:  err.response.data.Message
      })
    }
  },[billingInvoiceId]);


  const GeneratePaymentSlip = useCallback(async() => {

    try {

      setIsLoading(true)
    
      await api.post('/Financeiro/Faturamento/GerarBoletos', {   
        billingInvoiceId: cod_Fatura,
        token
      });

      addToast({
        type: 'success',
        title: 'Faturamento - Faturas',
        description: 'O(s) boleto(s) foram gerado(s), não esqueça de gerar a REMESSA e enviar ao banco para registro do boleto.',
      });

      setIsLoading(false)
      SelectBillingInvoice()
      
    } catch (err: any) {

      addToast({
        type: 'error',
        title: 'Não foi possível executar esta operação',
        description: err.response.data.Message,
      });
  
      setIsLoading(false)
      console.log(err);
    }
  },[cod_Fatura]);

  const LoadAccount = useCallback(async(stateValue?: string) => {

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? accountValue: accountTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<IAccount[]>('/ContasBancarias/Listar', {
        term: filter,
        token,
      });

      const listAccount: ISelectData[] = []
      response.data.map(item => {
        return listAccount.push({
          id: item.id,
          label: item.value
        })
      })

      setAccount(listAccount)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }

  },[accountTerm, accountValue, token])


  // LOAD DEFAULT ACCOUNT
  const LoadDefaultAccount = useCallback(async () => {

    try {
      const response = await api.get<IAccount>('/ContasBancarias/ListarPadrao', {
        params:{
          filterClause: 'default',
          token,
        }
      });    

        setAccountId(response.data.cod_Conta)

    } catch (err) {
      console.log(err);
    }

  },[isLoading])

  const LoadDefaultCategory = useCallback(async () => {

    try {
      const response = await api.get<ICategoryData>('/Categoria/ObterCategoriaPadrao', {
        params:{
          token,
        }
      });    

        setCategoryId(response.data.categoryId)

    } catch (err) {
      console.log(err);
    }

  },[isLoading])

  const LoadPeople = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? peopleValue:peopleTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPeopleData[]>('/Pessoas/ListarPorTipo', {
        params:{
          filterClause: filter,
          peopleType,
          token
        }    
      });

      const listPeople: ISelectData[] = []

      response.data.map(item => {
        return listPeople.push({
          id: item.id,
          label: item.value
        })
      })

      setPeople(listPeople)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const LoadFinancialStatus = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? financialStatusValue:financialStatusTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IFinancialStatusData[]>('/StatusFinanceiro/Listar', {
        params:{rows: 20, filterClause: filter, token}
      });

      const listFinancialStatus: ISelectData[] = []

      response.data.map(item => { 
        return listFinancialStatus.push({
          id: item.financialStatusId,
          label: item.financialStatusDescription
        })
      })

      setFinancialStatus(listFinancialStatus)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadServiceType = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? serviceTypeValue:serviceTypeTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IServiceTypeData[]>('/TipoServico/Listar', {
          params:{rows: 20, filterClause: filter, token}
      });

      const listServiceType: IServiceTypeSelectData[] = []

      response.data.map(item => {
        if(item.calculationType != "RP"){
          return listServiceType.push({
            id: item.serviceTypeId,
            label: item.serviceTypeDescription,
            calculationType: item.calculationType,
            flgMultipleUnit: item.flgMultipleUnit,
            standardValue: item.standardValue,
            flgExpire: item.flgExpire,
          })
        }    
      })

      setServiceType(listServiceType)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const LoadBillingInvoiceGridList = async () => {
    try {
      
      const response = await api.get<IBillingInvoiceServiceData[]>('/Financeiro/Faturamento/ListarServicosGrid', {
        params:{
        billingInvoiceId,
        token,
        }
      });

      setBillingInvoiceServiceGridList(response.data)
      setIsLoading(false)
      setGridValueUpdate(true)
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (gridValueUpdate == true){

      let totalContract = 0;
      let totalDiscount = 0;
  
      billingInvoiceServiceGridList.map( (item) => {
  
        if (item.tpo_Calculo == "RV") {
            totalContract += Number(item.vlr_Liquido);
        }
        else if (item.tpo_Calculo == "DV") {
            totalContract -= Number(item.vlr_Liquido);
        }
        else if (item.tpo_Calculo == "DP") {
            totalDiscount += Number(item.vlr_Servico);
        }
      
      })
  
      setTotalValueGrid(FormatCurrency.format(totalContract - (totalContract * totalDiscount / 100)))
      setTotalValueGridNew((totalContract - (totalContract * totalDiscount / 100)))
      setGridValueUpdate(false)
          
    } 

  },[gridValueUpdate, billingInvoiceServiceGridList])

  const LoadPaymentForm = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? paymentFormValue:paymentFormTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPaymentFormData[]>('/FormaDePagamento/ListarPorFiltro', {
          params:{filterClause: filter, token}
      });

      const listPaymentForm: IPaymentFormSelectData[] = []

      response.data.map(item => {
        return listPaymentForm.push({
          id: item.paymentFormId,
          label: item.paymentFormDescription,
          paymentFormType: item.paymentFormType
        })
      })

      setPaymentForm(listPaymentForm)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const LoadCostCenter = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? costCenterValue:costCenterTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ICostCenterData[]>('/CentroDeCusto/Listar', {
          params:{
          page: 0,
          rows: 20,
          filterClause: filter,
          token
          }
      });

      const listCostCenter: ISelectData[] = []

      response.data.map(item => {
        return listCostCenter.push({
          id: item.id,
          label: item.label,
        })
      })

      setCostCenter(listCostCenter)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const LoadPaymentSlipContract = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? paymentSlipContractValue:paymentSlipContractTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPaymentSlipContractData[]>('/CarteiraDeCobrança/Listar', {
          params:{page: 0, rows: 20, filterClause: filter, token}
      });

      const listPaymentSlipContract: ISelectData[] = []

      response.data.map(item => {
        return listPaymentSlipContract.push({
          id: item.paymentSlipContractId,
          label: item.paymentSlipContractDescription,
        })
      })

      setPaymentSlipContract(listPaymentSlipContract)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const GetDefaultFinancialStatus = useCallback(async() => {

    const response = await api.get<IFinancialStatusData>('/StatusFinanceiro/ObterStatusPadrao', {
      params:{
      token
      }
    })

    setFinancialStatusId(response.data.financialStatusId)
    setFinancialStatusValue(response.data.financialStatusDescription)
    setFinancialStatusTerm(response.data.financialStatusDescription)
    setFinancialStatusType(response.data.financialStatusType)


  },[financialStatusId, financialStatusValue, financialStatusTerm, financialStatusType]);

  const LoadCategory = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? categoryValue:categoryTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ICategoryData[]>('/Categoria/ListarPorDescrição', {
        params:{
          rows: 20,
          filterClause: filter,
          token
        }    
      });

      const listCategory: ISelectData[] = []

      response.data.map(item => {
        return listCategory.push({
          id: item.id,
          label: item.label
        })
      })

      setCategory(listCategory)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const handleChangeParcelas = useCallback (async (id: string) => {

    if(hasPaymentSlip) {
      addToast({
        type: "info",
        title: "Faturamento - Faturas",
        description: "Não é mais possível efetuar alterações nos parcelamentos desta fatura porque o arquivo de remessa relacionado a ela já foi gerado."
      })

      return;
    }

    if(Number(id) < Number(paymentParcelas)){ // Se diminuir a quantidade de parcelas.
      setOpenChangeParcelasModal(true)
      setNum_ParcelaForChange(id)
      return;
    }

    setPaymentParcelas(id)

  
    for( let qtd = (Number(id) - billingInvoiceInstallmentList.length); qtd  >= 1  ; qtd--){
    
    const installmentObject = {
      cod_FaturaParcela: "",
      cod_Fatura,
      num_Parcela: "0",
      dta_Vencimento: "0",
      vlr_Parcela: 0,
      hasPaymentSlip: false,
      dta_VencimentoPaymentSlip: "",
      num_DiasVencimento: "",
      documentUrl: "",
      pct_Multa: "",
      cod_Movimento: "",
      pct_JurosMora: "",
      cod_Empresa: "",
      paymentDetails: {cod_FaturaParcelaLiquidacao: "0", dta_Liquidacao: "0", vlr_Liquidacao: "0", status: "A"}    
    }

    setBillingInvoiceInstallmentList(previousValues => [...previousValues, installmentObject])

    }

    setAddNewInstallments(true)
         
  }, [billingInvoiceInstallmentList, paymentParcelas])

  function addMonth(date, month) {
    const result = new Date(date);
    result.setHours(result.getHours() + 4);
    result.setMonth(result.getMonth() + month);
    return result;
  }

  function addYear(date, years) {
    const result = new Date(date);
    result.setHours(result.getHours() + 4);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  function addWeek(date, days) {
    const result = new Date(date);
    result.setHours(result.getHours() + 4);
    result.setDate(result.getDate() + (days * 7));
    return result;
  }

  function addBiweekly(date, days) {
    const result = new Date(date);
    result.setHours(result.getHours() + 4);
    result.setDate(result.getDate() + (days * 15));
    return result;
  }

  const handleConfiguraDate = () => { 

    billingInvoiceInstallmentList.map((item, i) => {

      if(tpo_Parcelamento == "M"){

        item.dta_Vencimento = (FormatDate(new Date(addMonth(dtaVencimento, i).toString()), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign
        item.num_Parcela = (i + 1).toString() // eslint-disable-line no-param-reassign
        item.cod_FaturaParcela = (`N,${i}`) // eslint-disable-line no-param-reassign

        const newArrayBillingInvoice = [...billingInvoiceInstallmentList]
  
        setBillingInvoiceInstallmentList(newArrayBillingInvoice)
      }

      if(tpo_Parcelamento == "A"){

        item.dta_Vencimento = (FormatDate(new Date(addYear(dtaVencimento, i).toString()), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign
        item.num_Parcela = (i + 1).toString() // eslint-disable-line no-param-reassign
        item.cod_FaturaParcela = (`N,${i}`) // eslint-disable-line no-param-reassign

        const newArrayBillingInvoice = [...billingInvoiceInstallmentList]
  
        setBillingInvoiceInstallmentList(newArrayBillingInvoice)
      }

      if(tpo_Parcelamento == "S"){

        item.dta_Vencimento = (FormatDate(new Date(addWeek(dtaVencimento, i).toString()), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign
        item.num_Parcela = (i + 1).toString() // eslint-disable-line no-param-reassign
        item.cod_FaturaParcela = (`N,${i}`) // eslint-disable-line no-param-reassign

        const newArrayBillingInvoice = [...billingInvoiceInstallmentList]
  
        setBillingInvoiceInstallmentList(newArrayBillingInvoice)
      }

      if(tpo_Parcelamento == "Q"){

        item.dta_Vencimento = (FormatDate(new Date(addBiweekly(dtaVencimento, i).toString()), 'yyyy-MM-dd')) // eslint-disable-line no-param-reassign
        item.num_Parcela = (i + 1).toString() // eslint-disable-line no-param-reassign
        item.cod_FaturaParcela = (`N,${i}`) // eslint-disable-line no-param-reassign

        const newArrayBillingInvoice = [...billingInvoiceInstallmentList]
  
        setBillingInvoiceInstallmentList(newArrayBillingInvoice)
      }
 
    })

    setAddNewInstallments(false)
    handleConfiguraInstallment(1, "recalculate")
    saveBillingInvoice()
    
  }

  const handlePeopleSelected = (item) => { 
    
    if (item){
      setPeopleId(item.id)
      setPeopleValue(item.label)
    }else{
      setPeopleId('')
      LoadPeople('reset')
      setPeopleValue('')
    }
  }

  const handleServiceTypeSelected = (item) => { 
    
    if (item){
      handleResetServicesStates()
      setServiceTypeValue(item.label)
      setServiceTypeId(item.id)
      setCalculationType(item.calculationType)
      setFlgMultipleUnit(item.flgMultipleUnit)
      setServiceValue(item.standardValue)
      
      setFlgExpiration(item.flgExpire)
    }else{
      setServiceTypeValue('')
      LoadServiceType('reset')
      setServiceTypeId('')
      setCalculationType("")
      setFlgMultipleUnit("")
    }
  }

  const handleFinancialStatusSelected = (item) => { 
    
    if (item){
      setFinancialStatusValue(item.label)
      setFinancialStatusId(item.id)
      setFinancialStatusType(item.financialStatusType)
    }else{
      setFinancialStatusValue('')
      setFinancialStatusType("")
      LoadFinancialStatus('reset')
      setFinancialStatusId('')
    }
  }

  const handlePaymentFormSelected = (item) => { 
    
    if (item){
      setPaymentFormValue(item.label)
      setPaymentFormId(item.id)
      setPaymentFormType(item.paymentFormType)
    }else{
      setPaymentFormValue('')
      LoadPaymentForm('reset')
      setPaymentFormId('')
      setPaymentFormType("")
    }
  }

  const handleCostCenterSelected = (item) => { 
    
    if (item){
      setCostCenterValue(item.label)
      setCostCenterId(item.id)
    }else{
      setCostCenterValue('')
      LoadCostCenter('reset')
      setCostCenterId('')
    }
  }

  const handleAccountSelected = (item) => {

    if (item){
      setAccountValue(item.label)
      setAccountId(item.id)
    }else{
      setAccountValue('')
      LoadAccount('reset')
      setAccountId('')
    }
  }

  const handlePaymentSlipContractSelected = (item) => { 
    
    if (item){
      setPaymentSlipContractValue(item.label)
      setPaymentSlipContractId(item.id)
    }else{
      setPaymentSlipContractValue('')
      LoadPaymentSlipContract('reset')
      setPaymentSlipContractId("")
    }
  }

  const handleCategorySelected = (item) => { 
    
    if (item){
      setCategoryValue(item.label)
      setCategoryId(item.id)
    }else{
      setCategoryValue('')
      LoadCategory('reset')
      setCategoryId('')
    }
  }

  const handleLogOnDisplay = useCallback(async () => {
    setShowLog(true);
  }, []);

  const handleCloseLog = () => {
    setShowLog(false)
  }

  const addService = useCallback(() => {

    if(serviceQtd < "1"){
      addToast({
        type: "info",
        title: "Faturamento",
        description: "A quantidade de serviços não pode ser menor que 1."
      })

      return;
    }

    const idItem = billingInvoiceServiceId;
    const itemValue = Number(serviceValue).toFixed(2);
    const itemQtty = Number(serviceQtd);
    const itemDiscount = Number(serviceDescount).toFixed(2);
    const itemNetValue = Number(itemValue) - (Number(itemValue) * (Number(itemDiscount) / 100));
    const itemTotalValue = (itemNetValue * itemQtty)
    let serviceDesc = serviceTypeValue;
    if (serviceQtd != "1"){
      serviceDesc += ` - Quantidade: ${itemQtty}`;
    }
  
    // add new Service
    if(idItem == ""){
      const serviceObject = {
        cod_FaturaServico: (`N,${new Date().getTime().toString()}`),
        cod_TipoServico: serviceTypeId,
        cod_Fatura: billingInvoiceId,
        des_TipoServico: serviceTypeValue,
        des_TipoServicoView: serviceDesc,
        qtd_Servico: String(serviceQtd),
        pct_Desconto: String(serviceDescount),
        vlr_Liquido: String(itemTotalValue),
        vlr_Servico: String(itemValue),
        tpo_Calculo: calculationType,
        des_Observacao: serviceDescription,
        flg_Expira: flgExpiration,
        flgMultipleUnit,

    }
      setBillingInvoiceServiceGridList(previousValues => [...previousValues, serviceObject])
    }

    // update record
    else{

      const newList = billingInvoiceServiceGridList.map(item => 
        item.cod_FaturaServico == idItem
        ?
        {
            ...item,
            cod_TipoServico: serviceTypeId,
            des_TipoServico: serviceTypeValue,
            des_TipoServicoView: serviceDesc,
            qtd_Servico: String(serviceQtd),
            pct_Desconto: String(itemDiscount),
            vlr_Liquido: String(itemTotalValue),
            vlr_Servico: String(itemValue),
            tpo_Calculo: calculationType,
            des_Observacao: serviceDescription,
            flg_Expira: flgExpiration,
            flgMultipleUnit,
        }
        :item      
      );
  
      setBillingInvoiceServiceGridList(newList)
    }

    handleResetServicesStates()
    setGridValueUpdate(true)

  }, 
  [serviceTypeId, serviceTypeValue, serviceTypeValue, serviceQtd, serviceDescount, serviceValue, calculationType, serviceDescription, billingInvoiceServiceGridList, flgExpiration, flgMultipleUnit, billingInvoiceServiceId],
);

const handleRemoveService = (service) => {
  const billingConctractListUpdate = billingInvoiceServiceGridList.filter(item => item.cod_FaturaServico != service.row.cod_FaturaServico);
  setBillingInvoiceServiceGridList(billingConctractListUpdate)
  setGridValueUpdate(true)
}

const handleEditService = (service) => {
  setBillingInvoiceServiceId(service.row.cod_FaturaServico)
  setServiceTypeId(service.row.cod_TipoServico)
  setServiceDescription(service.row.des_Observacao)
  setServiceTypeValue(service.row.des_TipoServico)
  setServiceDescount(service.row.pct_Desconto)
  setServiceQtd(service.row.qtd_Servico)
  setCalculationType(service.row.tpo_Calculo)
  setServiceValue(service.row.vlr_Servico)
  setFlgExpiration(service.row.flg_Expira)
  setFlgMultipleUnit(service.row.flgMultipleUnit)
}

const handleResetServicesStates = () => {
  setServiceValue("0")
  setServiceQtd("1")
  setServiceDescount("0")
  setCalculationType("")
  setServiceDescription("")
  setServiceTypeId("")
  setServiceTypeValue("")
  setFlgMultipleUnit("")
  setFlgExpiration("")
  setBillingInvoiceServiceId("")  
}

const handleServiceValue = (event, value) => {
  event.preventDefault();
  setServiceValue(value)
}

const handleDescountValue = (event, value) => {
  event.preventDefault();
  setServiceDescount(value)
}

const ChangeDate = useCallback((value, billingInvoiceInstallmentId) => {
  const newInstallment = billingInvoiceInstallmentList.map(billingInstallment => billingInstallment.cod_FaturaParcela === billingInvoiceInstallmentId ? {
    ...billingInstallment,
    dta_Vencimento: value
  }: billingInstallment)

  setBillingInvoiceInstallmentList(newInstallment)

},[billingInvoiceInstallmentList]);

const ChangeValue = (value, billingInvoiceInstallmentId) => {
    
  const newInstallment = billingInvoiceInstallmentList.map(billingInstallment => billingInstallment.cod_FaturaParcela === billingInvoiceInstallmentId ? {
    ...billingInstallment,
    vlr_Parcela: Number(value)
  }: billingInstallment)

  setBillingInvoiceInstallmentList(newInstallment)
};

const handleOpenModalPayment = (item) => {
  setPaymentId(item.cod_FaturaParcela)
  setPaymentSlipValue(item.vlr_Parcela)
  setDtaVencimentoFatura(item.dta_Vencimento)
  setPaymentSituation(item.paymentDetails[0].status)
  setShowPaymentModal(true)
}

const handleOpenModalPaymentFromFirstInstallments = (cod_FaturaParcela, vlr_Parcela, dta_Vencimento) => {
  setPaymentId(cod_FaturaParcela)
  setPaymentSlipValue(vlr_Parcela)
  setDtaVencimentoFatura(dta_Vencimento)
  setPaymentSituation(billingInvoiceInstallmentList[0].paymentDetails[0].status)
  setShowPaymentModal(true)
}

const ClosePaymentModal = async () => {
  setPaymentSlipValue("0")
  setPaymentId('0')
  setDtaVencimentoFatura("")
  setShowPaymentModal(false)
  saveBillingInvoice()
}

const ClosePaymentSlipModal = async () => {
  setPaymentId('0')
  setPaymentSlipValue("0")
  setDtaVencimentoBoleto("")
  setDtaVencimentoFatura("")
  setPct_Juros("")
  setPct_JurosMora("")
  setNum_PaymentSlip("")
  setShowPaymentSlipModal(false)
  SelectBillingInvoice()
}

const handleOpenPaymentSlipDocument = (item) => {
  window.open(`${item}`)
}

const handleOpenPaymentSlipModal = (item) => {
  const data = new Date();
  const dia = String(data. getDate()). padStart(2, '0');
  const mes = String(data. getMonth() + 1). padStart(2, '0');
  const ano = data. getFullYear();
  const dataAtual = `${ano}/${mes}/${dia}`
  setPaymentSlipValue(item.vlr_Parcela)
  setDtaVencimentoBoleto(FormatDate(new Date(dataAtual), 'yyyy-MM-dd'))
  setDtaVencimentoFatura(item.dta_Vencimento)
  setPct_Juros(item.pct_Multa)
  setPct_JurosMora(item.pct_JurosMora)
  setNum_PaymentSlip(item.num_Parcela)
  setShowPaymentSlipModal(true)
}

const handleOpenPaymentSlipModalFromFirstInstallments = (vlr_Parcela, dta_Vencimento, pct_Multa, pct_JurosMora, num_Parcela) => {
  const data = new Date();
  const dia = String(data. getDate()). padStart(2, '0');
  const mes = String(data. getMonth() + 1). padStart(2, '0');
  const ano = data. getFullYear();
  const dataAtual = `${ano}/${mes}/${dia}`
  setPaymentSlipValue(vlr_Parcela)
  setDtaVencimentoBoleto(FormatDate(new Date(dataAtual), 'yyyy-MM-dd'))
  setDtaVencimentoFatura(dta_Vencimento)
  setPct_Juros(pct_Multa)
  setPct_JurosMora(pct_JurosMora)
  setNum_PaymentSlip(num_Parcela)
  setShowPaymentSlipModal(true)
}

const RemoveItensList = useCallback((parcelas) => {

  const billingInvoiceListUpdate = billingInvoiceInstallmentList.filter(item => Number(item.num_Parcela) <= Number(parcelas));
  setBillingInvoiceInstallmentList(billingInvoiceListUpdate)


},[billingInvoiceInstallmentList]);

const handleChangePaymentType = (item) => { 

  if(hasPaymentSlip) {
      addToast({
        type: "info",
        title: "Faturamento - Faturas",
        description: "Não é mais possível efetuar alterações nos parcelamentos desta fatura porque o arquivo de remessa relacionado a ela já foi gerado."
      })

      return;
    }
    
  if (item == "P" && cod_Fatura != "0"){
      setPaymentTypeChange(item)
      setPaymentType(item)
      handleChangeParcelas("2")
    }

    if (item == "P" && cod_Fatura == "0"){
      setPaymentTypeChange(item)
      setOpenSaveModal(true)
    }

  if (item == "U"){
    setPaymentTypeChange(item)
    handleChangeParcelas("1")

  }
}

const handleChangeInstallmentType = (item) => { 
  setTpo_Parcelamento(item)
  setAddNewInstallments(true)
}

const handleClickDocument = () => {
  setShowBillingInvoiceDocumentModal(true)
  localStorage.setItem('@GoJur:documentLocation', 'billingInvoiceEdit');
}

const CloseBillingInvoiceDocumentModal = () => {
  setShowBillingInvoiceDocumentModal(false)
}

const CloseBillingInvoiceEmailModal = () => {
  setShowBillingInvoiceEmailModal(false)
}

const openEmailModal = () => {
  setShowBillingInvoiceEmailModal(true)
};

const handleConfiguraInstallment = useCallback((item, method: String) => {

  if(item.num_Parcela == 1){
    let installmentValueNew = 0

    const invoiceValue = Number(String(totalValueGridNew).replace(",", "."));
    const firstInstallmentValue = Number(String(billingInvoiceInstallmentList[0].vlr_Parcela));
    const installmentsQty = Number(paymentParcelas);

    const installmentValue = (invoiceValue - firstInstallmentValue) / (installmentsQty - 1);
    installmentValueNew = Number(installmentValue.toFixed(2));

    const installmentRoundDif = (invoiceValue - firstInstallmentValue) - (installmentValueNew * (installmentsQty - 1))
    const installmentRoundDifNew = Number(installmentRoundDif.toFixed(2));

    billingInvoiceInstallmentList.map((item, i) => {

      installmentValueNew = installmentValue > 0 ? installmentValueNew : 0

      if(i + 1 == installmentsQty){       
        item.vlr_Parcela = installmentValueNew + installmentRoundDifNew // eslint-disable-line no-param-reassign
      }

      if (i > 0 && i < (installmentsQty - 1)){
   
        item.vlr_Parcela = installmentValueNew // eslint-disable-line no-param-reassign

      }     
    })

    const newArrayBillingInvoice = [...billingInvoiceInstallmentList]

    setBillingInvoiceInstallmentList(newArrayBillingInvoice)
  }

  if(method == "recalculate"){
    let installmentValueNew = 0

    const invoiceValue = Number(String(totalValueGridNew).replace(",", "."));
    const installmentsQty = Number(paymentParcelas);

    const installmentValue = totalValueGridNew / installmentsQty
    installmentValueNew = Number(installmentValue.toFixed(2));

    let total = 0

    billingInvoiceInstallmentList.map((item, i) => {

      installmentValueNew = installmentValue > 0 ? installmentValueNew : 0
   
      if (i => 0 && i < (installmentsQty - 1)){
   
        item.vlr_Parcela = installmentValueNew // eslint-disable-line no-param-reassign

        total += item.vlr_Parcela

      }     
    })


    if(total > invoiceValue){  
      const newValue = total - invoiceValue
      billingInvoiceInstallmentList[0].vlr_Parcela = Number((billingInvoiceInstallmentList[0].vlr_Parcela -= newValue).toFixed(2)) // eslint-disable-line no-param-reassign
    }
    
    if(total < invoiceValue){
      const newValue = invoiceValue - total
      billingInvoiceInstallmentList[0].vlr_Parcela = Number((billingInvoiceInstallmentList[0].vlr_Parcela += newValue).toFixed(2)) // eslint-disable-line no-param-reassign
    }


    const newArrayBillingInvoice = [...billingInvoiceInstallmentList]

    setBillingInvoiceInstallmentList(newArrayBillingInvoice)
    setRecalculate(false)
  }
     
},[billingInvoiceInstallmentList, paymentParcelas, recalculate, totalValueGridNew])

  return (

    <Container>

      {openChangeParcelasModal && (
        <ConfirmBoxModal
          useCheckBoxConfirm
          caller="confirmOpenParcelasModal"
          title="Faturamento - Faturas"
          message="A quantidade de parcelas selecionada é menor do que a quantidade definida anteriormente. Ao confirmar esta operação todas as parcelas geradas e suas respectivas liquidações (se houver) serão removidas."
        />
      )}

      {openSaveModal && (
        <ConfirmBoxModal
          caller="confirmSaveModal"
          title="Faturamento - Faturas"
          message="Você esta em um processo de inclusão do registo, para proseguir é necessário salva-lo, deseja realizar este processo ?"
        />
      )}

      {openExclusionModal && (
        <ConfirmBoxModal
          useCheckBoxConfirm
          caller="confirmExclusionModal"
          title="Faturamento - Faturas"
          message="Deseja realmente excluir esta fatura ? Todos os registros relacionados (boletos, parcelas e liquidações) também serão removidos."
        />
      )}

      {openSendEmailModal && (
        <ConfirmBoxModal
          caller="confirmOpenSendEmailModal"
          title="Faturamento - Faturas"
          message="Confirma o envio desta fatura por email para todos os emails definidos no cliente e/ou no contrato financeiro ?"
        />
      )}

      {modalConfirmSave && (
        <ConfirmBoxModal
          useCheckBoxConfirm
          title="Faturamento - Pagamento"
          caller="confirmSave"
          message="Esta fatura já possui um arquivo de remessa e/ou boleto gerado. Ao proseguir com esta alteração estes registros serão removidos e deverão ser gerados novamente. Deseja continuar mesmo assim ?"
        />
      )}

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
    )}

      {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Excluindo...
          </div>
        </>
      )}

      {isSendEmail && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Enviando E-Mail ...
          </div>
        </>
      )}

      {showLog && (
        <LogModal
          idRecord={Number(billingInvoiceId)}
          handleCloseModalLog={handleCloseLog}
          logType="billingInvoiceLog"
        />
      )}

      {(showPaymentModal) && <OverlayPaymentModal /> }
      {(showPaymentModal) && <BillingInvoicePaymentModal callbackFunction={{ paymentId, dtaVencimentoFatura, paymentSlipValue, paymentSitutation, setShowPaymentModal, ClosePaymentModal }} /> }

      {(showPaymentSlipModal) && <OverlayPaymentModal /> }
      {(showPaymentSlipModal) && <PaymentSlipModal callbackFunction={{ num_PaymentSlip, cod_Fatura, setDtaVencimentoBoleto, dtaVencimentoBoleto , setPaymentSlipValue, paymentSlipValue, pct_Juros, pct_JurosMora, dtaVencimentoFatura, setShowPaymentSlipModal, ClosePaymentSlipModal }} /> }

      {(showBillingInvoiceDocumentModal) && <OverlayPaymentModal /> }
      {(showBillingInvoiceDocumentModal) && <BillingInvoiceDocumentModal callbackFunction={{cod_Fatura, CloseBillingInvoiceDocumentModal}} /> }

      {(showBillingInvoiceEmailModal) && <OverlayPaymentModal /> }
      {(showBillingInvoiceEmailModal) && <BillingInvoiceEmailModal callbackFunction={{billingInvoiceId, CloseBillingInvoiceEmailModal}} /> }

      <div style={{marginLeft:"-2%"}}>
        <HeaderPage />
      </div>

      <Content>

        <header>

          <div style={{display:"flex"}}>

            <div>      
              <button
                type='button'
                onClick={() => history.push(`/financeiro/billingcontract/list`)}  
              >
                <div className='Desactive' style={{display:"flex"}}>
                  <FaFileContract style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Contratos</p> 
                </div>
                
                
              </button>

            </div>
            
            <div style={{marginLeft:"1%"}}>
              
              <button
                type='button'
                onClick={console.log}
              >  

                <div className='Active' style={{display:"flex"}}>
                  <FaFileInvoiceDollar style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Faturamento</p> 
                </div> 

                
              </button>
            </div>
            
          </div>
          

        </header>

        <Form>

          <section>

            <div style={{display:"flex"}}>
              
              <h3 style={{fontFamily:"montserrat"}}>Fatura</h3>

            </div>
            
            <div>
              <div style={{display:"flex", marginTop:"1%"}}>
                <div className='selectPeople'>
                  <label htmlFor="type">   
                    <p>Tipo Pessoa</p> 
                    <select
                      name="peopleType"
                      value={peopleType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeopleType(e.target.value)}
                    >
                      <option value="C">Cliente</option>
                      <option value="A">Advogado</option>
                      <option value="T">Terceiro</option>
                      <option value="F">Funcionário</option>
                    </select>
                  </label>
                </div>
 
                <div className='selectPeopleCombo' style={{marginLeft:"1%"}}>
                  <AutoCompleteSelect>
                    {peopleType == "C" && (
                    <p>Cliente</p>
                    )}
                    {peopleType == "F" && (
                    <p>Funcionário</p>
                    )}
                    {peopleType == "T" && (
                    <p>Terceiro</p>
                    )}
                    {peopleType == "A" && (
                    <p>Advogado</p>
                    )}
                    <Select
                      isSearchable
                      value={people.filter(options => options.id == peopleId)}
                      onChange={handlePeopleSelected}
                      onInputChange={(term) => setPeopleTerm(term)}
                      isClearable
                      placeholder=""
                      isLoading={isLoadingComboData}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      styles={selectStyles}
                      options={people}
                    />
                  </AutoCompleteSelect>
                </div>

                <div className='selectPeopleCombo' style={{marginLeft:"1%"}}> 
                  <AutoCompleteSelect>
                    <p>Status</p> 
                    <Select
                      isSearchable
                      value={financialStatus.filter(options => options.id == financialStatusId)}
                      onChange={handleFinancialStatusSelected}
                      onInputChange={(term) => setFinancialStatusTerm(term)}
                      isClearable
                      placeholder=""
                      isLoading={isLoadingComboData}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      styles={selectStyles}
                      options={financialStatus}
                    />
                  </AutoCompleteSelect>
                </div>
                
                <div className='numSequencial'>
                  <label htmlFor="descricao">
                    <p>Nº Fatura</p>
                    <input
                      placeholder='Novo'
                      maxLength={50}
                      type="text"
                      name="descricao"
                      value={numSequencial}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNumSequencial(e.target.value)}
                      autoComplete="off"
                      disabled
                    />
                  </label>
                </div>
          
              </div>

            </div>
            
            <div className='border'>&nbsp;</div>

            <h3 style={{fontFamily:"montserrat"}}>Serviços</h3>

            <div style={{display:"flex", marginTop:"1%"}}>
              <div className='selectDescription'>
                <AutoCompleteSelect>
                  <p>Descrição</p> 
                  <Select
                    isSearchable
                    value={serviceType.filter(options => options.id == serviceTypeId)}
                    onChange={handleServiceTypeSelected}
                    onInputChange={(term) => setServiceTypeTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={serviceType}
                  />
                </AutoCompleteSelect>
              </div>

              {calculationType != "" && (
                <div className='serviceValue'>
                  <label htmlFor="descricao">

                    {calculationType == "RV" && (
                      <p>Valor R$:</p>
                    )}

                    {calculationType == "DV" && (
                      <p>Valor R$:</p>
                    )}

                    {calculationType == "DP" && (
                      <p>Valor %:</p>
                    )}

                    {calculationType == "RP" && (
                      <p>Valor %:</p>
                    )}
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      name="descricao"
                      value={serviceValue}
                      onChange={handleServiceValue}
                    />
                  </label>
                </div>
              )}

              {flgMultipleUnit == "S" && (
                <div className='serviceQtd'>
                  <label htmlFor="descricao">
                    <p>Quantidade:</p>
                    <input
                      required
                      maxLength={50}
                      type="number"
                      name="descricao"
                      value={serviceQtd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceQtd(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                </div>
              )}

              {calculationType == "RV" && (
                <div className='serviceDescount'>
                  <label htmlFor="descricao">
                    <p>Desconto %:</p>
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      name="descricao"
                      value={serviceDescount}
                      onChange={handleDescountValue}
                    />
                  </label>
                </div>
              )}

            </div>

            {calculationType != "" && (
            <>
              <div style={{display:"flex"}}>
                <div className='serviceDescription'>
                  <label htmlFor="descricao">
                    <p>Observação:</p>
                    <input
                      maxLength={100}
                      type="text"
                      name="descricao"
                      value={serviceDescription}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceDescription(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <div className='divAddButon'>

                  <div style={{float:'left'}}>
                    <button 
                      className="buttonClick"
                      type='button'
                      onClick={()=> addService()}
                      style={{width:'80px'}}
                    >
                      <CgAdd />
                      {billingInvoiceServiceId == "" && (
                        <span>Adicionar</span>
                      )}

                      {billingInvoiceServiceId != "" && (
                        <span>Atualizar</span> 
                      )}
                    </button>
                  </div>

                  {billingInvoiceServiceId != "" && (
                    <div style={{float:'right'}}>
                      <button 
                        className="buttonClick"
                        type='button'
                        onClick={()=> handleResetServicesStates()}
                        style={{width:'80px'}}
                      >
                        <FaRegTimesCircle />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}

                </div>
                
              </div>
            </>
            )}

            <div>
              <GridSubContainer>
                <Grid
                  rows={billingInvoiceServiceGridList}
                  columns={columnsServiceType}
                >
                  <PagingState
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onCurrentPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                  <CustomPaging totalCount={totalRowsServiceTypeList} />
                  <Table
                    cellComponent={CustomCellUserList}
                    columnExtensions={tableColumnExtensionsServiceType}
                    messages={isLoading? languageGridLoading: languageGridEmpty}
                  />
                  <TableHeaderRow />
                </Grid>
              </GridSubContainer>

              <div style={{marginTop:"1%"}}>
                
                <b style={{fontFamily:"Montserrat"}}>
                  Valor Total Serviço - &nbsp;
                  {totalValueGrid}
                </b>
    
              </div>
              
            </div>

            <div className='border'>&nbsp;</div>

            <h3 style={{fontFamily:"montserrat"}}>Pagamento</h3>

            <div style={{display:"flex", marginTop:"1%"}}>

              <div className='selectAccount'>
                <AutoCompleteSelect>
                  <p>Conta Bancária</p> 
                  <Select
                    isSearchable
                    value={account.filter(options => options.id == accountId)}
                    onChange={handleAccountSelected}
                    onInputChange={(term) => setAccountTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={account}
                  />
                </AutoCompleteSelect>
              </div>

              <div className='selectCategory'>
                <AutoCompleteSelect>
                  <p>Categoria</p> 
                  <Select
                    isSearchable
                    value={category.filter(options => options.id == categoryId)}
                    onChange={handleCategorySelected}
                    onInputChange={(term) => setCategoryTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={category}
                  />
                </AutoCompleteSelect>
              </div>

              <div className='selectCostCenter'>
                <AutoCompleteSelect>
                  <p>Centro de Custo</p> 
                  <Select
                    isSearchable
                    value={costCenter.filter(options => options.id == costCenterId)}
                    onChange={handleCostCenterSelected}
                    onInputChange={(term) => setCostCenterTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={costCenter}
                  />
                </AutoCompleteSelect>
              </div>   

              {cod_Fatura == "0" && (
                <div className='selectDtaVencimento2'>
                  <label htmlFor="data">
                    <p>Data Fatura</p> 
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaVencimento}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaVencimento(e.target.value)}
                    />
                  </label>
                </div>
              )}

            </div>

            <div style={{display:"flex", marginTop:"1%"}}>

              <div className='paymentType'>
                <label htmlFor="type">   
                  <p>Tipo Pagamento</p>
                  <select
                    name="paymentType"
                    value={paymentType}
                    onChange={(e) => handleChangePaymentType(e.target.value)}
                  >
                    <option value="U">Único</option>
                    <option value="P">Parcelado</option>
                  </select>
                </label>
              </div>

              <div className='parcelamento'>
                <label htmlFor="descricao">
                  <p>Pagamento</p>
                  <input
                    placeholder='Novo'
                    maxLength={50}
                    type="text"
                    name="descricao"
                    value={payment}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPayment(e.target.value)}
                    autoComplete="off"
                    disabled
                  />
                </label>
              </div>        

              {paymentType == "P" && (
                <>
                  <div className='qtdRecorrencia'>
                    <label htmlFor="parcela">
                      Parcelas
                      <Select
                        placeholder="Selecione"
                        autoComplete="off"
                        styles={selectStyles}
                        value={parcelasBillingInvoice.filter(options => options.id === paymentParcelas)}
                        onChange={(item) => handleChangeParcelas(item? item.id: '')}
                        options={parcelasBillingInvoice}
                      />
                    </label>
                  </div>

                  <div className='recorrenciaType'>
                    <label htmlFor="type">   
                      <p>&nbsp;</p>
                      <select
                        name="tpoParcelamento"
                        value={tpo_Parcelamento}
                        onChange={(e) => handleChangeInstallmentType(e.target.value)}
                      >
                        <option value="M">Mensal</option>
                        <option value="A">Anual</option>
                        <option value="S">Semanal</option>
                        <option value="Q">Quinzenal</option>
                      </select>
                    </label>
                  </div>
                </>
              )}
      
              <div className='selectPaymentForm'>
                <AutoCompleteSelect>
                  <p>Forma Pagamento</p> 
                  <Select
                    isSearchable
                    value={paymentForm.filter(options => options.id == paymentFormId)}
                    onChange={handlePaymentFormSelected}
                    onInputChange={(term) => setPaymentFormTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={paymentForm}
                  />
                </AutoCompleteSelect>
              </div>

              {paymentFormType == "B" && (
                <>
                  {billingInvoiceInstallmentList.length <= 1 && (
                    <div className='selectPaymentSlip'>
                      <AutoCompleteSelect>
                        <p>Carteira Cobrança</p> 
                        <Select
                          isSearchable
                          value={paymentSlipContract.filter(options => options.id == paymentSlipContractId)}
                          onChange={handlePaymentSlipContractSelected}
                          onInputChange={(term) => setPaymentSlipContractTerm(term)}
                          isClearable
                          placeholder=""
                          isLoading={isLoadingComboData}
                          loadingMessage={loadingMessage}
                          noOptionsMessage={noOptionsMessage}
                          styles={selectStyles}
                          options={paymentSlipContract}
                        />
                      </AutoCompleteSelect>
                    </div>
                  )}

                  {billingInvoiceInstallmentList.length > 1 && (
                    <div className='selectPaymentSlip2'>
                      <AutoCompleteSelect>
                        <p>Carteira Cobrança</p> 
                        <Select
                          isSearchable
                          value={paymentSlipContract.filter(options => options.id == paymentSlipContractId)}
                          onChange={handlePaymentSlipContractSelected}
                          onInputChange={(term) => setPaymentSlipContractTerm(term)}
                          isClearable
                          placeholder=""
                          isLoading={isLoadingComboData}
                          loadingMessage={loadingMessage}
                          noOptionsMessage={noOptionsMessage}
                          styles={selectStyles}
                          options={paymentSlipContract}
                        />
                      </AutoCompleteSelect>
                    </div>
                  )}
                </>
              )}

            </div>

            {cod_Fatura != "0" && (
              <>
                <div style={{display:"flex", marginTop:"2%"}}>

                  <div style={{width:"11.5%"}}>
                    <h4 style={{textAlign:"center"}}>Data Fatura</h4>
                  </div>

                  {billingInvoiceInstallmentList.length > 1 && (
                    <div style={{marginLeft:"1.5%", width:"10%"}}>
                      <h4 style={{textAlign:"center"}}>Valor R$</h4>
                    </div>
                  )}

                  {hasPaymentSlip && (
                    <div style={{width:"11.5%"}}>
                      <h4 style={{textAlign:"center"}}>Venc. Boleto</h4>
                    </div>  
                  )}   
                  
                </div>
   
                {billingInvoiceInstallmentList.length == 1 && (
                  <>
                    <div style={{display:"flex", marginTop:"1%"}}>
                      {hasPaymentSlip == false && (
                        <div style={{width:'11.5%'}}>
                          <label htmlFor="data"> 
                            <input 
                              style={{backgroundColor:"white"}}
                              type="date"
                              value={billingInvoiceInstallmentList[0].dta_Vencimento}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeDate(e.target.value, billingInvoiceInstallmentList[0].cod_FaturaParcela)}
                            />
                          </label>
                        </div>
                        )}

                      {hasPaymentSlip == true && (
                        <>
                          <div style={{width:'11.5%'}}>
                            <label htmlFor="data">
                              <input 
                                style={{backgroundColor:"white"}}
                                type="date"
                                value={dtaVencimento}
                                disabled
                              />
                            </label>
                          </div>

                          <div style={{width:'8.5%', marginLeft:"2%"}}>
                            <label htmlFor="data">
                              <input 
                                style={{backgroundColor:"white"}}
                                type="date"
                                value={billingInvoiceInstallmentList[0].dta_VencimentoPaymentSlip}
                                disabled
                              />
                            </label>
                          </div>
                        </>
                      )}

                      <div style={{marginLeft:"2%", marginBottom:"auto"}}>
                        <button 
                          type="button" 
                          onClick={(e) => handleOpenModalPaymentFromFirstInstallments(billingInvoiceInstallmentList[0].cod_FaturaParcela, billingInvoiceInstallmentList[0].vlr_Parcela,billingInvoiceInstallmentList[0].dta_Vencimento)}
                        >
                          
                          {billingInvoiceInstallmentList[0].paymentDetails[0].status == "A" && (
                            <div className='value1'>
                              <RiMoneyDollarBoxFill style={{height:'30px', width:'25px'}} title="Clique aqui para realizar o pagamento." />
                            </div>
                          )}

                          {billingInvoiceInstallmentList[0].paymentDetails[0].status == "F" && (
                            <div className='value2'>
                              <RiMoneyDollarBoxFill style={{height:'30px', width:'25px'}} title="Pagamento efetuado. Clique aqui para editar." />
                            </div>
                          )}

                          {billingInvoiceInstallmentList[0].paymentDetails[0].status == "P" && (
                            <div className='value3'>
                              <RiMoneyDollarBoxFill style={{height:'30px', width:'25px'}} title="Clique aqui para completar o pagamento." />
                            </div>
                          )}
                        </button>
                      </div>

                      {hasPaymentSlip == true && (
                        <>
                          <div style={{marginLeft:"1.5%", marginBottom:"auto"}}>
                            {billingInvoiceInstallmentList[0].hasPaymentSlip == true && (
                              <>
                                <button 
                                  type="button" 
                                  onClick={(e) => handleOpenPaymentSlipDocument(billingInvoiceInstallmentList[0].documentUrl)}
                                  style={{marginLeft:"1%"}}
                                > 
                                  {Number(billingInvoiceInstallmentList[0].num_DiasVencimento) <= 0 && (   
                                  <div>
                                    <AiOutlineBarcode style={{height:'30px', width:'25px'}} title={` Vencimento Boleto: ${(format(new Date(`${billingInvoiceInstallmentList[0].dta_VencimentoPaymentSlip}T00:00:00`), 'dd/MM/yyyy'))} `} />
                                  </div>
                                  )}

                                  {Number(billingInvoiceInstallmentList[0].num_DiasVencimento) >= 1 && (   
                                  <div>
                                    <AiOutlineBarcode style={{height:'30px', width:'25px'}} title={` Vencimento Boleto: ${(format(new Date(`${billingInvoiceInstallmentList[0].dta_VencimentoPaymentSlip}T00:00:00`), 'dd/MM/yyyy'))} ${billingInvoiceInstallmentList[0].num_DiasVencimento} dia(s) vencido(s)`} />
                                  </div>
                                  )}
                                  
                                </button>

                              </>
                            )}
                          </div>

                          <div style={{marginLeft:"1%", marginTop:"4px", marginBottom:"auto"}}>
                            {billingInvoiceInstallmentList[0].hasPaymentSlip == true && (
                              <>

                                <button 
                                  type="button" 
                                  onClick={(e) => handleOpenPaymentSlipModalFromFirstInstallments(billingInvoiceInstallmentList[0].vlr_Parcela, billingInvoiceInstallmentList[0].dta_Vencimento, billingInvoiceInstallmentList[0].pct_Multa, billingInvoiceInstallmentList[0].pct_JurosMora, billingInvoiceInstallmentList[0].num_Parcela)}
                                  style={{marginLeft:"1%"}}
                                >   
                                  <div>
                                    <FiEdit className='value1' style={{height:'20px', width:'25px'}} title="Gerar Novo Boleto" />
                                  </div>
                                  
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}

                    </div>                
                  </>
                )}
                                        
                {billingInvoiceInstallmentList.length > 1 && (
                  <div style={{marginTop:"1%"}}>
                    {billingInvoiceInstallmentList.map((item, i) => {
                      return(
                        <>
                          <div style={{display:"flex", marginTop:"1%"}}>

                            {hasPaymentSlip == false && (
                              <>
                                <div style={{width:'11.5%'}}>
                                  <input
                                    type='date'
                                    title=""
                                    value={item.dta_Vencimento}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeDate(e.target.value, item.cod_FaturaParcela)}                    
                                  />
                                </div>

                                <div className={`vlr_Vencimento${i}`} style={{marginLeft:"2%", width:"8.5%"}}>
                                  <IntlCurrencyInput
                                    currency="BRL"
                                    config={currencyConfig}
                                    value={item.vlr_Parcela}
                                    onChange={(e, value) => ChangeValue(value, item.cod_FaturaParcela)}
                                    onKeyPress={(e) => handleConfiguraInstallment(item, "")}
                                  />
                                </div>
                              </>
                            )}

                            {hasPaymentSlip == true && (
                              <>
                                <div style={{width:'11.5%'}}>
                                  <input
                                    type='date'
                                    title=""
                                    value={item.dta_Vencimento}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeDate(e.target.value, item.cod_FaturaParcela)}
                                    disabled                    
                                  />
                                </div>
                                
                                <div className={`vlr_Vencimento${i}`} style={{marginLeft:"2%", width:"8.5%"}}>
                                  <IntlCurrencyInput
                                    currency="BRL"
                                    config={currencyConfig}
                                    value={item.vlr_Parcela}
                                    onChange={(e, value) => ChangeValue(value, item.cod_FaturaParcela)}
                                    onKeyPress={(e) => handleConfiguraInstallment(item, "")}
                                  />
                                </div>
                              </>
                            )}

                            {item.hasPaymentSlip && (
                              <div style={{width:'9%', marginLeft:"2%"}}>
                                <input
                                  type='date'
                                  title=""
                                  value={item.dta_VencimentoPaymentSlip}
                                  disabled                     
                                />
                              </div>
                            )}

                            {item.paymentDetails[0] && (
                              <button 
                                type="button" 
                                onClick={(e) => handleOpenModalPayment(item)}
                                style={{marginLeft:"2%"}}
                              >
                                
                                {item.paymentDetails[0].status == "A" && (
                                  <div className='teste'>
                                    <RiMoneyDollarBoxFill className='value1' style={{height:'30px', width:'25px'}} title="Clique aqui para realizar o pagamento." />
                                  </div>
                                )}

                                {item.paymentDetails[0].status == "F" && (
                                  <div>
                                    <RiMoneyDollarBoxFill className='value2' style={{color:'#48C71F', height:'30px', width:'25px'}} title="Pagamento efetuado. Clique aqui para editar." />
                                  </div>
                                )}

                                {item.paymentDetails[0].status == "P" && (
                                  <div>
                                    <RiMoneyDollarBoxFill className='value3' style={{color:'#E9ED00', height:'30px', width:'25px'}} title="Clique aqui para completar o pagamento." />
                                  </div>
                                )}
                              </button>
                            )}

                            {item.documentUrl && (
                              <>

                                <button 
                                  type="button" 
                                  onClick={(e) => handleOpenPaymentSlipDocument(item.documentUrl)}
                                  style={{marginLeft:"1%"}}
                                >
                                  {Number(item.num_DiasVencimento) <= 0 && (    
                                    <div>
                                      <AiOutlineBarcode style={{height:'30px', width:'25px'}} title={` Vencimento Boleto: ${(format(new Date(`${item.dta_VencimentoPaymentSlip}T00:00:00`), 'dd/MM/yyyy'))} `} />
                                    </div>
                                  )}

                                  {Number(item.num_DiasVencimento) >= 1 && (    
                                    <div>
                                      <AiOutlineBarcode style={{height:'30px', width:'25px'}} title={` Vencimento Boleto: ${(format(new Date(`${item.dta_VencimentoPaymentSlip}T00:00:00`), 'dd/MM/yyyy'))} ${item.num_DiasVencimento} dia(s) vencido(s)`} />
                                    </div>
                                  )}
                                  
                                </button>

                                <button 
                                  type="button" 
                                  onClick={(e) => handleOpenPaymentSlipModal(item)}
                                  style={{marginLeft:"1%"}}
                                >   
                                  <div>
                                    <FiEdit className='value1' style={{height:'20px', width:'25px'}} title="Gerar Novo Boleto" />
                                  </div>
                                  
                                </button>

                              </>
              
                            )}
                          </div>   
                        </>
                      )
                    })}
                  </div>
                )}
              </>
            )}
            
          
            {billingInvoiceId != "0" && (
              <section style={{marginTop:"2%"}}>
                <button type="button" id="log" onClick={handleLogOnDisplay}>
                  <IoIosPaper title="Ver Historico" />
                  <p>&nbsp;Ver Histórico</p>
                </button>
              </section>
            )}        
    
            <div className='border'>&nbsp;</div>

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveBillingInvoice()}
                  style={{width:'90px'}}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>

              {billingInvoiceId != "0" && (
                <>

                  {paymentFormType == "B" && (
                    <div style={{float:'left'}}>
                      <button 
                        className="buttonClick"
                        type='button'
                        onClick={()=> GeneratePaymentSlip()}
                        style={{width:'140px'}}
                      >
                        <FaFileInvoiceDollar />
                        Gerar Boletos
                      </button>
                    </div>
                  )}   

                  <div style={{float:'left'}}>
                    <button 
                      className="buttonClick"
                      type='button'
                      onClick={handleClickDocument}
                      style={{width:'140px'}}
                    >
                      <AiOutlinePrinter />
                      Emitir Fatura
                    </button>
                  </div>           

                  {billingInvoiceServiceGridList.length > 0 && (
                    <div style={{float:'left'}}>
                      <button 
                        className="buttonClick"
                        type='button'
                        onClick={() => setOpenSendEmailModal(true)}
                        style={{width:'150px'}}
                      >
                        <GrMail />
                        Enviar E-mail
                      </button>
                    </div> 
                  )}          
                    
                  <div style={{float:'left'}}>
                    <button 
                      type='button'
                      className="buttonClick"
                      onClick={() => setOpenExclusionModal(true)}
                      style={{width:'90px'}}
                    >
                      <FiTrash />
                      Excluir
                    </button>
                  </div>
                </>
              )}
                           
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => history.push(`/financeiro/billinginvoice/list`)}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </section>

        </Form>

      </Content>
      
        
    </Container>
    
  
  );
};

export default BillingInvoiceEdit;
