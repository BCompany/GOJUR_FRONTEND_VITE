/* eslint-disable-next-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-return-assign */
/* eslint no-unneeded-ternary: "error" */
/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState, useCallback, ChangeEvent, useRef} from 'react';
import api from 'services/api';
import DatePicker from 'components/DatePicker';
import IntlCurrencyInput from "react-intl-currency-input";
import Select from 'react-select';
import ModalOptions from 'components/ModalOptions';
import ModalBankPaymentSlipOptions from 'components/ModalBankPaymentSlipOptions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { languageGridEmpty} from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useStateContext } from 'context/statesContext';
import { useDelay, currencyConfig, selectStyles, FormatCurrency, FormatFileName, AmazonPost } from 'Shared/utils/commonFunctions';
import { useModal } from 'context/modal';
import { AiOutlineBarcode, AiOutlineMail } from 'react-icons/ai';
import { IoIosPaper } from 'react-icons/io';
import { BiSave } from 'react-icons/bi'
import { BsImage } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';
import { FaCheck, FaRegTimesCircle, FaRegCopy, FaFileAlt, FaFilePdf, FaWhatsapp, FaFileInvoiceDollar } from 'react-icons/fa';
import { FiTrash, FiEdit, FiX, FiDownloadCloud, FiMail, FiPrinter } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi';
import { MdHelp, MdAttachMoney } from 'react-icons/md';
import { RiFolder2Fill, RiEraserLine } from 'react-icons/ri';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useDevice } from "react-use-device";
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { parcelas, parcelasDatas, financialReminders } from 'Shared/utils/commonListValues';
import { languageGridPagination } from 'Shared/utils/commonConfig';
import { format } from 'date-fns';
import { HeaderPage } from 'components/HeaderPage';
import LogModal from 'components/LogModal';
import { DataTypeProvider, PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import GridSelectProcess from '../../Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { ISelectData, MatterData, IMovementUploadFile, IPaymentFormData } from '../Interfaces/IFinancial';
import { IPayments } from '../Interfaces/IPayments';
import FinancialPaymentModal from '../PaymentModal';
import FinancialDocumentModal from '../DocumentModal';
import BankPaymentSlipSecondCopyModal from '../BankPaymentSlipSecondCopy';
import { ModalDeleteOptions, OverlayFinancial } from '../styles';
import { Container, Content, Process, GridSubContainer, ModalPaymentInformation, ModalBankPaymentSlip, ModalBankPaymentSlipErrors, ModalPlan, Line, ItemLine } from './styles';


export interface IBankPaymentSlip{
  paymentSlipId: string;
  dueDate: string;
  hasBankPaymentSlip: boolean;
  bankPaymentSlipLink: string;
  paymentSlipPartnerId: string;
  hasFinancialIntegration: boolean;
};

const FinancialMovement: React.FC = () => {
  // #region STATES
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller} = useConfirmBox();
  const { handleStateType }  = useStateContext();
  const token = localStorage.getItem('@GoJur:token');
  const { pathname } = useLocation();
  const history = useHistory();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isMOBILE } = useDevice();
  const {handleSelectProcess, selectProcess, matterSelected, openSelectProcess } = useModal();
  const [accountId, setAccountId] = useState('');
  const [movementId, setMovementId] = useState('');
  const [movementType, setMovementType] = useState('');
  const [paymentFormList, setPaymentFormList] = useState<IPaymentFormData[]>([]);
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormDescription, setPaymentFormDescription] = useState<string>("")
  const [paymentFormType, setPaymentFormType] = useState<string>("")
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [categoryList, setCategoryList] = useState<ISelectData[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('');
  const [centerCostList, setCenterCostList] = useState<ISelectData[]>([]);
  const [centerCostId, setCenterCostId] = useState('');
  const [centerCostDescription, setCenterCostDescription] = useState<string>('')
  const [centerCostTerm, setCenterCostTerm] = useState('');
  const [peopleList, setPeopleList] = useState<ISelectData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleDescription, setPeopleDescription] = useState<string>('');
  const [peopleTerm, setPeopleTerm] = useState('');
  const [paymentList, setPaymentList] = useState<IPayments[]>([]);
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [movementDate, setMovementDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [movementValue, setMovementValue] = useState<number>();
  const [cod_Parcelamento, setCod_Parcelamento] = useState('');
  const [movementParcelas, setMovementParcelas] = useState('1');
  const [movementParcelasFirst, setMovementParcelasFirst] = useState('1');
  const [movementParcelasDatas, setMovementParcelasDatas] = useState('M');
  const [showParcelasDatas, setShowParcelasDatas] = useState<boolean>(false);
  const [taxInvoice, setTaxInvoice] = useState<string>('');
  const [movementDescription, setMovementDescription] = useState('');
  const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
  const [showNotifyPeople, setShowNotifyPeople] = useState<boolean>(false);
  const [checkPeopleList, setCheckPeopleList] = useState<boolean>(false);
  const [reminders, setReminders] = useState('00');
  const [flgNotifyPeople, setFlgNotifyPeople] = useState<boolean>(false);
  const [flgNotifyEmail, setFlgNotifyEmail] = useState<boolean>(true);
  const [flgNotifyWhatsApp, setFlgNotifyWhatsApp] = useState<boolean>(false);
  const [flgReembolso, setFlgReembolso] = useState<boolean>(false);
  const [flgStatus, setFlgStatus] = useState('A');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [actionSave, setActionSave] = useState<string>('');
  const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState<boolean>(false);
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [showPaymentInformation, setShowPaymentInformation] = useState<boolean>(false);
  const [paymentQtd, setPaymentQtd] = useState('');
  const [matterId, setMatterId] = useState('');
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const [blockAssociateMatter, setBlockAssociateMatter] = useState(false);
  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData);
  const [matterAttachedModal, setMatterAttachedModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [enablePayments, setEnablePayments] = useState<boolean>(true);
  const [showPayments, setShowPayments] = useState<boolean>(false);
  const [showChangeInstallments, setShowChangeInstallments] = useState<boolean>(false);
  const [changeInstallments, setChangeInstallments] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<number>(0);
  const [sequence, setSequence] = useState<string>('');
  const [uploadingStatus, setUploadingStatus] = useState<string>('none');
  const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [documentList, setDocumentList] = useState<IMovementUploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tokenContinuation, setTokenContinuation] = useState<string | null>('');
  const [showLog, setShowLog] = useState(false);
  const [showChangePaymentForm, setShowChangePaymentForm] = useState<boolean>(false);
  const [changePaymentForm, setChangePaymentForm] = useState<boolean>(false);
  const [showInstallmentInvoiceConfirm, setShowInstallmentInvoiceConfirm] = useState<boolean>(false);
  const [showInstallmentPaymentSlipConfirm, setShowInstallmentPaymentSlipConfirm] = useState<boolean>(false);

  const [discountPercetage, setDiscountPercentage] = useState<number>(0)
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [billingInvoiceId, setBillingInvoiceId] = useState<string>('')
  const [pixKey, setPixKey] = useState<string>('')

  const [showBankPaymentSlipSecondCopyModal, setShowBankPaymentSlipSecondCopyModal] = useState<boolean>(false);
  const [hasFinancialIntegration, setHasFinancialIntegration] = useState<boolean>(false);
  const [hasBankPaymentSlip, setHasBankPaymentSlip] = useState<boolean>(false);
  const [paymentSlipId, setPaymentSlipId] = useState<string>('');
  const [bankPaymentSlipDate, setBankPaymentSlipDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [bankPaymentSlipLinkDate, setBankPaymentSlipLinkDate] = useState<string>("");
  const [bankPaymentSlipLink, setBankPaymentSlipLink] = useState<string>('');
  const [paymentSlipPartnerId, setPaymentSlipPartnerId] = useState<string>('');
  const [actionGenerate, setActionGenerate] = useState<string>('');
  const [hasBankPaymentSlipErrors, setHasBankPaymentSlipErrors] = useState<boolean>(false);
  const [bankPaymentSlipErrors, setBankPaymentSlipErrors] = useState<string>('');
  const [showValidateFinancialIntegration, setShowValidateFinancialIntegration] = useState<boolean>(false);
  const [isTotalPaid, setIsTotalPaid] = useState<boolean>(false);
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)
  const [showModalPlan, setShowModalPlan] = useState<boolean>(false)
  const companyPlan = localStorage.getItem('@GoJur:companyPlan')

  const ref = useRef<any>(null);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  )
  // #endregion

  
  // #region USE EFFECT
  useEffect(() => {
    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval)
      }, 2000);
    }
  }, [idReportGenerate])


  const CheckReportPending = useCallback(async (checkInterval) => {
    if (isGeneratingReport){
      const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
        id: idReportGenerate,
        token: localStorage.getItem('@GoJur:token')
      })

      if (response.data == "F" && isGeneratingReport){
        clearInterval(checkInterval);
        setIsGeneratingReport(false)
        OpenReportAmazon()
      }
    }
  }, [isGeneratingReport, idReportGenerate])


  const OpenReportAmazon = async() => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    });

    setIdReportGenerate(0)
    window.open(`${response.data.des_Parametro}`, '_blank');
    setIsGeneratingReport(false)
  }


  useEffect(() => {
    if (isCancelMessage)
    {
      if(caller == "changeDefaultHeader"){
        setShowChangeInstallments(false)
        handleCancelMessage(false)
      }

      if(caller == "changePaymentForm"){
        setShowChangePaymentForm(false)
        handleCancelMessage(false)
      }

      if(caller == "validateFinancialIntegration"){
        setShowValidateFinancialIntegration(false)
        handleCancelMessage(false)
      }

      if(caller == "invoiceInstallment"){
        setShowInstallmentInvoiceConfirm(false)
        handleCancelMessage(false)
      }

      if(caller == "paymentSlipInstallment"){
        setShowInstallmentPaymentSlipConfirm(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller])


  useEffect(() => {
    if(isConfirmMessage)
    {
      if(caller == "changeDefaultHeader"){
        handleConfirmMessage(false)
        handleConfirmChangeInstallments()
        setShowChangeInstallments(false)
      }

      if (caller == "changePaymentForm"){
        handleConfirmMessage(false)
        setChangePaymentForm(true)
        Save('', true)
      }

      if (caller == "validateFinancialIntegration"){
        handleConfirmMessage(false)
        Delete(true, false)
      }

      if(caller == "invoiceInstallment"){
        handleConfirmMessage(false)
        setShowInstallmentInvoiceConfirm(false)
        CreateInvoice(false)
      }

      if(caller == "paymentSlipInstallment"){
        handleConfirmMessage(false)
        setShowInstallmentPaymentSlipConfirm(false)
        GeneratePaymentSlip('all', false, false)
      }
    }
  }, [isConfirmMessage, caller])


  useEffect(() => {
    Initialize()
  }, [])


  useEffect(() => {
    if(openSelectProcess == "Close")
    {
      setMatterAttachedModal(false)
    }
  }, [openSelectProcess])


  useEffect(() => {
    if(matterSelected)
    {
      setMatterId(matterSelected.matterId.toString())
      setProcessTitle(`${matterSelected.matterNumber} - ${matterSelected.matterCustomerDesc} x ${matterSelected.matterOppossingDesc}`)
      selectProcess(null)
    }

    setMatterAttachedModal(false)
  }, [matterSelected])


  useEffect(() => {
    if(movementId != '' && movementId != '0')
    {
      LoadMovement(movementId)
    }
  }, [movementId])


  useEffect (() => {
    if (actionSave.length > 0){
      Save('', false);
    }
  }, [actionSave])


  useEffect(() => {
    if (uploadingStatus  === 'conclude') {
      handleValidateFiles();
    }
  }, [uploadingStatus])
  // #endregion


  // #region USE DELAY
  useDelay(() => {
    if (peopleTerm.length > 0 && !isLoading){
      LoadPeople()
    }
  }, [peopleTerm], 750)


  useDelay(() => {
    if (categoryTerm.length && !isLoading){
      LoadCategory()
    }
  }, [categoryTerm], 750)


  useDelay(() => {
    if (paymentFormTerm.length > 0 && !isLoading){
      LoadPaymentForm()
    }
  }, [paymentFormTerm], 750)


   useDelay(() => {
    if (centerCostTerm.length > 0 && !isLoading){
      LoadCenterCost()
    }
  }, [centerCostTerm], 750)
  // #endregion


  // #region MOVEMENT
  const Initialize = async () => {
    await LoadStates()
    LoadPaymentForm()
    LoadCategory()
    LoadCenterCost()
    LoadPeople()
  }


  const LoadStates = async() => {
    const type = pathname.slice(21, 22)
    setMovementType(type)

    const indexAccount1 = pathname.indexOf('account=')
    const indexAccount2 = pathname.indexOf('/', indexAccount1)

    const account = pathname.slice(indexAccount1 + 8,indexAccount2)
    setAccountId(account)

    const indexId1 = pathname.indexOf('id=')

    const id = pathname.substring(indexId1 + 3)
    setMovementId(id)
  }


  const LoadMovement = async (movementId) => {
    try {
      setIsLoading(true);

      const response = await api.get('/Financeiro/Editar', { params:{ id: Number(movementId), token }})

      setMovementDate(format(new Date(response.data.dta_Movimento), "yyyy-MM-dd"))
      setMovementValue(response.data.vlr_Movimento)
      setMovementType(movementType)
      setCod_Parcelamento(response.data.cod_Parcelamento.toString())
      setMovementParcelas(response.data.qtd_Parcelamento.toString())
      setMovementParcelasFirst(response.data.qtd_Parcelamento.toString())
      setMovementParcelasDatas(response.data.Periodicidade)
      setPaymentFormId(response.data.cod_FormaPagamento)
      setPaymentFormDescription(response.data.des_FormaPagamento)
      setPaymentFormType(response.data.tpo_FormaPagamento)
      setCategoryId(response.data.cod_Categoria)
      setCategoryDescription(response.data.nom_Categoria)
      setCenterCostId(response.data.cod_CentroCusto)
      setCenterCostDescription(response.data.des_CentroCusto)
      setTaxInvoice(response.data.num_NotaFiscal)
      setMovementDescription(response.data.des_Movimento)
      setSelectedPeopleList(response.data.UserList)
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
      setInvoice(response.data.cod_FaturaParcela)
      setSequence(response.data.num_SequenciaFatura)
      setBankPaymentSlipDate(format(new Date(response.data.dta_Movimento), "yyyy-MM-dd"))
      setPixKey(response.data.des_ChavePix)
      setBillingInvoiceId(response.data.num_Fatura)

      if(response.data.pct_Desconto != null)
      {
        setDiscountPercentage(response.data.pct_Desconto)
        setDiscountValue((response.data.vlr_Movimento / 100) * response.data.pct_Desconto )
      }

      if(response.data.qtd_Parcelamento != "1"){
        setEnablePayments(false)
      }

      if(response.data.cod_Processo != null)
      {
        setMatterId(response.data.cod_Processo)
        setProcessTitle(`${response.data.num_Processo} - ${response.data.matterCustomerDesc} x ${response.data.matterOpposingDesc}`)
      }

      await LoadPayments()
      await LoadDocuments()
      await LoadBankPaymentSlip(movementId)

      setIsLoading(false);
    }
    catch (err:any) {
      setIsLoading(false)
      addToast({type: "info", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const LoadPayments = async () => {
    try {
      const response = await api.get<IPayments[]>('/Financeiro/ObterPagamentos', { params:{ token, movementId }});

      const paymentListReturn = response.data.map(payment => payment && {
        ...payment,
        action: 'UPDATE'
      })

      setPaymentList(paymentListReturn)

      if(paymentListReturn.length == 1 && paymentListReturn[0].cod_MovimentoLiquidacao == '0')
      {
        const message = 'Nenhum pagamento foi realizado. Para incluir novas liquidações clique no botão acima.';
        setPaymentMessage(message)
      }
      else if (paymentListReturn[0].total_Restante == 0) {
        setShowPayments(true)
        const message = paymentListReturn[0].tpo_Movimento == "D" ? 'Pago' : 'Recebido';
        setPaymentMessage(message)
        setIsTotalPaid(true)
      }
      else{
        setShowPayments(true)
        const message = paymentListReturn[0].tpo_Movimento == "D" ? 'Saldo a pagar' : 'Saldo a receber';
        setPaymentMessage(`${message} R$: ${FormatCurrency.format(paymentListReturn[0].total_Restante)}`)
      }
    }
    catch (err:any) {
      setIsLoading(false)
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  const LoadPaymentForm = async () => {
    try {
      const  response = await api.get<IPaymentFormData[]>('FormaDePagamento/ListarPorFiltro', { params:{filterClause: paymentFormTerm, token}})
      setPaymentFormList(response.data)
    }
    catch (err:any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  const LoadCategory =  async (stateValue?: string) => {
    let filter = categoryTerm

    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ISelectData[]>('/Categoria/ListarPorDescrição', { params:{ rows: 50, filterClause: filter, token }})
      setCategoryList(response.data)
    }
    catch (err:any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  const LoadCenterCost = async () => {
    try {
      const response = await api.get<ISelectData[]>('/CentroDeCusto/Listar', { params:{ page: 0, rows: 0, filterClause: centerCostTerm, token }})
      setCenterCostList(response.data)
    }
    catch (err:any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  const LoadPeople = async () => {
    try {
      const response = await api.get<ISelectData[]>('/Pessoas/ListarPorEmpresa', { params:{ filterClause: peopleTerm, peopleTypeSelected: 'CLTO', token }})
      setPeopleList(response.data)
    }
    catch (err:any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  const handleMovementDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMovementDate(event.target.value)
  }, [])


  const handleValue = (event, value, maskedValue) => {
    event.preventDefault();
    setMovementValue(value)
  }


  const handleChangeParcelas = (id: string) => {
    setMovementParcelas(id)
    setShowParcelasDatas(id != '1')

    if(movementId != '0' && id != movementParcelasFirst)
    {
      setChangeInstallments(true)
    }
    else{
      setChangeInstallments(false)
    }
  }


  const ChangeDiscountPercentage = (event, value) => {
    event.preventDefault();
    setDiscountPercentage(value)
  }


  const BlurDiscountPercentage = async() => {
    if(movementValue == 0)
      return;

    if(discountPercetage > 100)
    {
      addToast({ type: "info", title: "Alerta", description: "O percentual do campo Desconto não pode ser maior que 100%" });
      setDiscountValue(0);
      return;
    }

    setDiscountValue((movementValue / 100) * (100 - discountPercetage))

  }


  const handleCategorySelected = (item) => {
    if (item){
      setCategoryId(item.id)
      setCategoryDescription(item.label)
    }else{
      setCategoryId('')
      setCategoryDescription('')
      LoadCategory('reset')
    }
  }


  const handlePaymentFormSelected = (item) => {
    if (item){
      setPaymentFormId(item.id)
      setPaymentFormDescription(item.label)
      setPaymentFormType(item.paymentFormType)
    }
    else{
      setPaymentFormId('')
      setPaymentFormDescription('')
      setPaymentFormType('')
      LoadPaymentForm()
    }
  }


  const handleCenterCostSelected = (item) => {
    if (item){
      setCenterCostId(item.id)
      setCenterCostDescription(item.label)
    }else{
      setCenterCostId('')
      setCenterCostDescription('')
      LoadCenterCost()
    }
  }


  const handlePeopleSelected = (item) => {
    if (item){
      setPeopleId(item.id)
      setPeopleDescription(item.label)
      setShowNotifyPeople(reminders != '00' && reminders != null)
      handleListItemPeople(item)
    }else{
      setPeopleId('')
      setPeopleDescription('')
      LoadPeople()
    }
  }


  const handleListItemPeople = (people) => {
    const existItem = selectedPeopleList.filter(item => item.id === people.id);

    if (existItem.length > 0){
      return;
    }

    selectedPeopleList.push(people)
    setSelectedPeopleList(selectedPeopleList)
    setCheckPeopleList(!checkPeopleList)
  }


  const handleRemoveItemPeople = (people) => {
    const selectedPeopleUpdate = selectedPeopleList.filter(item => item.id != people.id);
    setSelectedPeopleList(selectedPeopleUpdate)
    setCheckPeopleList(!checkPeopleList)
    setShowNotifyPeople(selectedPeopleUpdate.length > 0 && reminders != '00')
  }


  const handleReminders = (item:any) => {
    const value =item? item.id: ''
    setReminders(value)

    const showNotifyPeople = (value != '00' && value != '') && selectedPeopleList.length > 0;
    setShowNotifyPeople(showNotifyPeople)
  }


  const handleCallback = (actionSave: string) => {
    setActionSave(actionSave)
  }


  const Save = useCallback(async(caller: string, changePaymentForm: boolean) => {
    try {

      if (!Validate()) return;

      setIsSaving(true)
      setShowModalOptions(false)
      setChangePaymentForm(false)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      const response = await api.post('/Financeiro/Salvar', {
        cod_Movimento: movementId,
        dta_Movimento: movementDate,
        vlr_Movimento: movementValue,
        tpo_Movimento : movementType,
        qtd_Parcelamento: movementParcelas,
        Periodicidade: movementParcelasDatas,
        cod_FormaPagamento: paymentFormId,
        tpo_FormaPagamento: paymentFormType,
        cod_Categoria: categoryId,
        cod_CentroCusto: centerCostId,
        num_NotaFiscal: taxInvoice,
        des_Movimento: movementDescription,
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
        changePaymentForm,
        des_ChavePix: pixKey,
        pct_Desconto: discountPercetage,
        num_Fatura: billingInvoiceId,
        token
      })

      addToast({type: "success", title: "Operação realizada com sucesso", description: `${  movementType == 'R'? 'Receita': 'Despesa'  } salva com sucesso`})

      handleStateType('Inactive')

      if(caller != 'payment')
      {
        history.push(`/financeiro`)
      }
      else{
        history.push(`/financeiro/movement/${movementType}/account=${accountId}/id=${response.data}`)
        setIsSaving(false)
        setShowChangeInstallments(false)
        setMovementId(response.data)
        setShowPaymentModal(true)
      }
    } catch (err:any) {
      setIsSaving(false)
      setShowChangeInstallments(false)

      if (err.response.data.typeError.warning == "awareness"){
        setShowChangePaymentForm(true)
      }
      else {
        addToast({type: "info", title: "Falha ao salvar movimento.", description: err.response.data.Message})
      }
    }
  }, [isSaving, selectedPeopleList, movementId, movementDate, movementValue, movementType, movementParcelas, movementParcelasDatas, paymentFormId, categoryId, centerCostId, taxInvoice, movementDescription, flgNotifyPeople, reminders, actionSave, flgReembolso, matterId, accountId, token, flgStatus, changeInstallments, invoice, flgNotifyEmail, flgNotifyWhatsApp, paymentFormType, pixKey, discountPercetage, billingInvoiceId]);


  const Copy = useCallback(async() => {
    try {

      if  (!ValidateCopy()) return;

      setIsSaving(true)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      await api.post('/Financeiro/Salvar', {
        cod_Movimento: 0,
        dta_Movimento: movementDate,
        vlr_Movimento: movementValue,
        tpo_Movimento : movementType,
        qtd_Parcelamento: movementParcelas,
        Periodicidade: movementParcelasDatas,
        cod_FormaPagamento: paymentFormId,
        cod_Categoria: categoryId,
        cod_CentroCusto: centerCostId,
        num_NotaFiscal: taxInvoice,
        des_Movimento: movementDescription,
        peopleIds: peopleIdsItems,
        flg_NotificaPessoa: flgNotifyPeople,
        flg_NotificaEmail: flgNotifyEmail,
        flg_NotificaWhatsApp: flgNotifyWhatsApp,
        Lembrete: reminders,
        editChild: actionSave.length == 0? "justOne": actionSave, // Action save is used to define if is save one, all or next, when is empty consider only one
        flg_Reembolso: flgReembolso,
        cod_Processo: matterId,
        cod_Conta: accountId,
        des_ChavePix:pixKey,
        pct_Desconto: discountPercetage,
        token
      })

      addToast({type: "success", title: "Movimento salvo", description: "O movimento foi salvo no sistema"})

      handleStateType('Inactive')
      setIsSaving(false)
      history.push(`/financeiro`)
    }
    catch (err:any) {
      addToast({type: "info", title: "Falha ao copiar movimento.", description: err.response.data.Message})
      setIsSaving(false)
    }
  }, [isSaving, selectedPeopleList, movementId, movementDate, movementValue, movementType, movementParcelas, movementParcelasDatas, paymentFormId, categoryId, centerCostId, taxInvoice, movementDescription, flgNotifyPeople, reminders, actionSave, flgReembolso, matterId, accountId, token, flgNotifyEmail, flgNotifyWhatsApp, pixKey, discountPercetage]);


  const CheckDeleteType = (qtd) => {
    if (qtd > 1)
    {
      setShowDeleteOptions(true)
    }
    else{
      setShowConfirmDelete(true)
    }
  }


  const Delete = useCallback(async (deleteAll: boolean, validateFinancialIntegration: boolean) => {
    try {
      if (movementId == '0') {
        addToast({type: "info", title: "Operação NÃO realizada", description: `O movimento ainda não foi salvo no sistema`})
        setShowConfirmDelete(false)
        return;
      }

      const response = await api.delete('/Financeiro/Deletar', { params:{ token, id: movementId, deleteAll, validateFinancialIntegration }});

      handleStateType('Inactive')
      setShowDeleteOptions(false)
      setShowConfirmDelete(false)
      history.push(`/financeiro`)
    }
    catch (err:any) {
      if (err.response.data.typeError.warning == "awareness"){
        setShowValidateFinancialIntegration(true)
      }
      else{
        addToast({type: "info", title: "Operação não realizada", description: err.response.data})
      }
    }
  }, [movementId]);


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

    if(invoice != 0)
    {
      addToast({ type: "info", title: "AVISO", description: "Esta movimentação esta vinculada diretamente a uma fatura, as alterações devem ser realizadas em sua fatura de origem." })
      isValid = false;
    }

    if (changeInstallments)
    {
      setShowChangeInstallments(true)
      isValid = false;
    }
    else if (movementParcelas !=  '1' && actionSave.length == 0 && movementId != '0')
    {
      setShowModalOptions(true)
      isValid = false;
    }

    return isValid;
  }


  const ValidateCopy =() => {
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

    return isValid;
  }


  const handleGridSelectProcess = useCallback(() => {
    if (processTitle === 'Associar Processo') {
      setMatterAttachedModal(true)
      handleSelectProcess("Open")
    }
  }, [handleSelectProcess, processTitle]);


  const ClosePaymentModal = () => {
    setShowPaymentModal(false)
    LoadMovement(movementId)
  }


  const GenerateDocument = () => {
    setShowDocumentModal(true)
  }


  const CloseDocumentModal = () => {
    setShowDocumentModal(false)
  }


  const handleSaveFile = (event: any) => {
    const {files} = event.target;
    UploadFiles(files)
  }


  const UploadFiles = useCallback(async (files: any[]) => {
    try
    {
      const request:any[] = []

      if (movementId == '0') {
        addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário salvar o movimento antes de gravar o documento`})
        return;
      }

      // flag as executing to show progress bar
      setUploadingStatus('executing')

      let errorList = '';
      // save each file in a collection
      for (let index = 0; index < files.length; index++) {

        if (files[index].size > 11000000){
          errorList += `${files[index].name  } `;
        }
        else{
          // remove special characters from file name
          const fileName = FormatFileName(files[index].name, false);

          request.push({
            referenceId: movementId,
            fileName,
            fileSize: files[index].size,
            token
          });
        }
      }

      const hasError = errorList.length > 0;

      if (!hasError) {

        try
        {
            // save all files as pending in lot mode
            const response = await CraeteFileUpload(request)

            // get document ids for all pending files to verify after and save
            const documentIds: number[] = [];
            response.data.map((item) => { return documentIds.push(item.id) })
            setFilesUploadIds(documentIds)

            // if everythings ok with pending save files save now each file in amazon
            const promisses: any[] = [];
            if (response.status == 200){

              for (let index = 0; index < files.length; index++) {
                promisses.push(AmazonPost(Number(movementId), files[index],"/Movimentos/Movimento_"))
              }

              // when conclude set upload status as 'conclude' so now whe can, by use effect call endpoint to validate all files
              Promise.all(promisses).then(() => {
                setUploadingStatus('conclude')
              })
            }
        }
        catch(err:any){
          setUploadingStatus('none')
          addToast({type: "info", title: "Operação não realizada", description: err.response.data})
        }
      }
      else{
        setUploadingStatus('none')
        addToast({type: "info", title: "Operação não realizada", description: `O(s) arquivo(s) ${ errorList } excedem o tamanho máximo de 10MB, remova-os e tente novamente`})
      }

      ref.current.value = "";
    }
    catch(e){
      console.log(e)
      setUploadingStatus('none')
    }
  }, [addToast, movementId, token])


  const CraeteFileUpload = async(request: any) => {
    const response = api.post<IMovementUploadFile[]>('/MovimentoArquivos/CriarArquivoPendente', request)
    return response;
  }


  const CustomCell = (props) => {
    const { column } = props;

    if (column.title === 'Download') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiDownloadCloud title="Clique para fazer o download do arquivo" />
        </Table.Cell>
      );
    }

    if (column.title === '') {
      const imageExtensions = ['gif', 'png', 'svg', 'jpg', 'jpeg']
      const docExtension = ['pdf', 'doc', 'docx']
      const planExtensions = ['xlsx', 'xls']

      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          {/* image extensions image */}
          {(imageExtensions.includes(props.row.fileType) &&
            <BsImage title='Clique para fazer o download desta imagem' />
          )}
          {(planExtensions.includes(props.row.fileType) &&
            <SiMicrosoftexcel title='Clique para fazer o download desta planilha' />
          )}
          {(docExtension.includes(props.row.fileType) &&
            <FaFilePdf title='Clique para fazer o download deste documento' />
          )}
          {((!imageExtensions.includes(props.row.fileType)
            && !planExtensions.includes(props.row.fileType)
            && !docExtension.includes(props.row.fileType)) &&
            <HiDocumentText title='Clique para fazer o download deste documento' />
          )}
        </Table.Cell>
      );
    }

    if (column.title === 'Excluir') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiTrash title="Clique para remover o arquivo" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }


  const handleClick = (props: any) => {
    // call download function
    if (props.column.name === 'download' || props.column.name === ''){
      handleDownloadFile(props.row.fileName)
    }

    // call delete function
    if (props.column.name === 'delete'){
      handleDeleteFile(props.row.fileName)
    }
  }


  const handleValidateFiles = async () => {
    try
    {
      const request: any[] = [];

      filesUploadIds.map((item) => {
        return request.push({ id: item, token  })
      })

      await ValidateFileUpload(request)

      addToast({type: "success", title: "Upload efetuado com sucesso", description: `Upload de ${ filesUploadIds.length } arquivos efetuados com sucesso`})

      LoadDocuments()
      setUploadingStatus('none')
      setFilesUploadIds([])
    }
    catch(e){
      console.log(e)
      setIsLoading(true)
    }
  }


  const ValidateFileUpload = async(request: any) => {
    const response = api.post<IMovementUploadFile[]>('/MovimentoArquivos/ValidarArquivo', request);
    return response;
  }


  const LoadDocuments = useCallback(async (reloadList = false) => {
    try
    {
      const response = await ListMovementFiles(
        Number(movementId),
        reloadList ? 10: pageSize,
        reloadList ? null: tokenContinuation
      )

      setDocumentList(response.data)

      if (response.data.length > 0) {
        setTotalRows(response.data[0].Count)
        setTokenContinuation(response.data[0].tokenPagination)
      }
      else{
        setTotalRows(0)
        setTokenContinuation(null)
      }

      setIsDeletingFile(false)
      setUploadingStatus('none')
    }
    catch(ex){
      setIsLoading(false)
    }
  }, [movementId, pageSize, tokenContinuation])


  const ListMovementFiles = async(movementId: number, rows:number, tokenPaginationAmazon: string|null) => {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post<IMovementUploadFile[]>('/MovimentoArquivos/ListarArquivos', {
      referenceId: movementId,
      rows,
      tokenPaginationAmazon,
      token
    })

    return response;
  }


  const handleDownloadFile = async (fileName: any) => {
    const document = documentList.find(doc => doc.fileName === fileName);

    if (document)
    {
      const response = await DownloadFile({
        referenceId:movementId,
        fileName:document.fileName,
        fileNameAmazon:  document.fileNameAmazon,
        token
      })

      window.open(response.data, 'blank')
      await LoadDocuments()

      return false;
    }
  }


  const DownloadFile = async(request: any) => {
    const response =  api.post('/MovimentoArquivos/DownloadFile', request)
    return response;
  }


  const handleDeleteFile = async (fileName: string) => {
    try{
      setIsDeletingFile(true)

      const response = await DeleteFile({movementId, fileName: fileName.toLowerCase(), token})

      // if something wront happen on server side response.data = false and we don't make anything on front end
      if (response.data)
      {
        const listDocumentRefresh = documentList.filter(doc => doc.fileName.toLowerCase() !== fileName.toLowerCase());

        if (listDocumentRefresh.length >= 1){
          setDocumentList(listDocumentRefresh)
          setIsDeletingFile(false)
          setTotalRows(totalRows-1)
        }
        else{
          await LoadDocuments(true)
        }
      }
      else{
        setIsDeletingFile(false)
      }
    }
    catch(ex:any){
      addToast({type: "info", title: "Operação NÃO realizada", description: ex.response.data.Message})
      setIsDeletingFile(false)
    }
  }


  const DeleteFile = async(request: any) => {
    const token = localStorage.getItem('@GoJur:token');

    const response = api.delete('/MovimentoArquivos/Deletar', {
      params:{referenceId: request.movementId, fileName: request.fileName.toLowerCase(), token}
    })

    return response;
  }


  const handlePayments = useCallback(() => {
    if(movementId == '' || movementId == '0'){
      setShowPaymentInformation(true)
    }
    else{
      setShowPaymentModal(true)
    }
  }, [movementId])


  const handleConfirmChangeInstallments = async () => {
    setChangeInstallments(false);
    setActionSave('all');
  }


  const SaveByPaymentInformation = () => {
    setShowPaymentInformation(false)
    Save('payment', false)
  }


  const [tableColumnExtensions] = useState([
    { columnName: '',               width: '8%' },
    { columnName: 'fileName',       width: '30%' },
    { columnName: 'dateUpload',     width: '30%' },
    { columnName: 'btnDownload',    width: '8%' },
    { columnName: 'btnDelete',      width: '8%' }
  ]);


  const [dateColumns] = useState(['dateUpload']);
  const columns = [
    { name: '',               title: ''  },
    { name: 'fileName',       title: 'Arquivo' },
    { name: 'dateUpload',     title: 'Data' },
    { name: 'download',       title: 'Download'  },
    { name: 'delete',         title: 'Excluir' }
  ];


  const handleLogOnDisplay = useCallback(async () => {
    setShowLog(true);
  }, [])


  const handleCloseLog = () => {
    setShowLog(false)
  }
  // #endregion


  // #region BANK PAYMENT SLIP
  const LoadBankPaymentSlip = async (movementId:number) => {
    try{
      const response = await api.get<IBankPaymentSlip>('/BoletoBancario/ObterPorMovimento', { params:{ movementId, partnerId: 'AS', token }});

      setHasFinancialIntegration(response.data.hasFinancialIntegration)

      if (response.data.paymentSlipId != "0"){
        setPaymentSlipId(response.data.paymentSlipId)
        setBankPaymentSlipLinkDate(response.data.dueDate)
        setHasBankPaymentSlip(response.data.hasBankPaymentSlip)
        setBankPaymentSlipLink(response.data.bankPaymentSlipLink)
        setPaymentSlipPartnerId(response.data.paymentSlipPartnerId)
      }
    }
    catch (err:any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data})
    }
  }


  const HandleCreateInvoice = () => {
    if (paymentFormType == "B"){
      // Boleto parcelado
      if (movementParcelas != '1'){
        setShowInstallmentPaymentSlipConfirm(true)
        return;
      }
      // Boleto único
      else {
        GeneratePaymentSlip('justOne', false, true)
        return;
      }
    }
    else {
      CreateInvoice(true)
    }
  }


  const CreateInvoice = useCallback(async (checkInstallment:boolean) => {
    try{
      if(checkInstallment){
        if(movementParcelas != '1'){
          setShowInstallmentInvoiceConfirm(true)
          return
        }
      }

      setIsSaving(true)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      const response = await api.post('/Fatura/GerarFaturaPorMovimento', {
        cod_Movimento: movementId,
        peopleIds: peopleIdsItems,
        tpo_FormaPagamento: paymentFormType,
        token
      })

      setIsSaving(false)
      LoadMovement(movementId)
    }
    catch(err:any){
      setIsSaving(false)

      if (err.response.data.typeError.warning == "awareness"){
        setShowModalPlan(true)
      }
      else{
        addToast({type: "info", title: "Falha ao criar fatura", description: err.response.data.Message})
      }
    }
  }, [movementId, movementParcelas, selectedPeopleList, paymentFormType])


  const GeneratePaymentSlip = useCallback(async(actionGenerate: string, secondPayment: boolean, checkInstallment:boolean) => {
    try {
      if(checkInstallment){
        if(movementParcelas != '1'){
          setShowInstallmentInvoiceConfirm(true)
          return
        }
      }

      setIsSaving(true)
      setShowModalOptions(false)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      const response = await api.post('/BoletoBancario/Gerar', {
        cod_Movimento: movementId,
        dta_Movimento: movementDate,
        vlr_Movimento: movementValue,
        tpo_Movimento : movementType,
        cod_Parcelamento: cod_Parcelamento,
        qtd_Parcelamento: movementParcelas,
        Periodicidade: movementParcelasDatas,
        cod_FormaPagamento: paymentFormId,
        tpo_FormaPagamento: paymentFormType,
        cod_Categoria: categoryId,
        cod_CentroCusto: centerCostId,
        num_NotaFiscal: taxInvoice,
        des_Movimento: movementDescription,
        peopleIds: peopleIdsItems,
        flg_NotificaPessoa: flgNotifyPeople,
        flg_NotificaEmail: flgNotifyEmail,
        flg_NotificaWhatsApp: flgNotifyWhatsApp,
        flg_Status: flgStatus,
        Lembrete: reminders,
        editChild: actionGenerate,
        flg_Reembolso: flgReembolso,
        cod_Processo: matterId,
        cod_Conta: accountId,
        dta_VencimentoBoleto: bankPaymentSlipDate,
        secondPayment,
        paymentSlipId,
        paymentSlipPartnerId: 'AS',
        vlr_MovimentoDesconto: discountValue,
        token
      })

      setBillingInvoiceId(response.data.num_Fatura)

      addToast({type: "success", title: "Operação realizada com sucesso", description: "Boleto criado com sucesso"})

      await LoadBankPaymentSlip(Number(movementId))
      setIsSaving(false)
      setShowBankPaymentSlipSecondCopyModal(false)
    }
    catch (err:any) {
      setIsSaving(false)
      setShowBankPaymentSlipSecondCopyModal(false)

      if (err.response.data.typeError.warning == "awareness"){
        setBankPaymentSlipErrors(err.response.data.Message)
        setHasBankPaymentSlipErrors(true)
      }
      else {
        addToast({type: "info", title: "Falha ao gerar boleto.", description: err.response.data.Message})
      }
    }
  }, [isSaving, selectedPeopleList, movementId, movementDate, movementValue, movementType, cod_Parcelamento, movementParcelas, movementParcelasDatas, paymentFormId, paymentFormType, categoryId, centerCostId, taxInvoice, movementDescription, flgNotifyPeople, reminders, actionSave, flgReembolso, matterId, accountId, token, flgStatus, changeInstallments, invoice, flgNotifyEmail, flgNotifyWhatsApp, bankPaymentSlipDate, paymentSlipPartnerId, paymentSlipId, discountValue])


  const OpenBankPaymentSlipNewWindow = (item) => {
    window.open(item.bankPaymentSlipLink, '_blank')
  }


  const GenerateSecondBankPaymentSlip = () => {
    setShowBankPaymentSlipSecondCopyModal(true)
  }


  const PrintBillingInvoice = useCallback(async() => {
    try{
      setIsGeneratingReport(true)
      
      const response = await api.post('/Fatura/EmitirFatura', {
        cod_Movimento: movementId,
        tpo_FormaPagamento: paymentFormType,
        bankPaymentSlipLink,
        token
      })

      setIdReportGenerate(response.data)
    }
    catch (err:any) {
      setIsGeneratingReport(false)
      addToast({type: "info", title: "Falha ao gerar boleto.", description: err.response.data.Message}) 
    }
  }, [movementId, paymentFormType, bankPaymentSlipLink])


  const SendEmailBillingInvoice = useCallback(async() => {
    try{
      setIsLoading(true)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })
      
      const response = await api.post('/Fatura/EnviarEmailFatura', {
        cod_Movimento: movementId,
        tpo_FormaPagamento: paymentFormType,
        bankPaymentSlipLink,
        peopleIds: peopleIdsItems,
        token
      })

      setIdReportGenerate(response.data)
      setIsLoading(false)
    }
    catch (err:any) {
      setIsLoading(false)
      addToast({type: "info", title: "Falha ao gerar boleto.", description: err.response.data.Message}) 
    }
  }, [movementId, paymentFormType, selectedPeopleList, bankPaymentSlipLink])
  // #endregion


  return (
    <Container>
      <HeaderPage />

      <Content id='Content'>
        {isLoading || isSaving && (
          <>
            <Overlay />
            <div className='waitingMessage'>
              <LoaderWaiting size={15} color="var(--blue-twitter)" />
              {isSaving? 'Salvando...': 'Aguarde...'}
            </div>
          </>
        )}

        <div style={{height:'50px'}}>
          {movementType == "R" && <span>RECEITA</span> }
          {movementType == "D" && <span>DESPESA</span> }
          {billingInvoiceId != "" && (
            <span className='invoiceWarning'>
              Fatura nº &nbsp; {billingInvoiceId}
              &nbsp;
            </span>
          )}
        </div>

        <Line id='Line1'>
          <ItemLine id='ItemLine1'>
            <div>
              <label htmlFor='Data'>
                <DatePicker title="Vencimento" onChange={handleMovementDate} value={movementDate} />
              </label>
            </div>
          </ItemLine>

          <ItemLine id='ItemLine2'>
            <div>
              <label htmlFor="valor">
                Valor
                <IntlCurrencyInput currency="BRL" config={currencyConfig} value={movementValue} className='inputField' onChange={handleValue} />
              </label>
            </div>
          </ItemLine>

          <ItemLine id='ItemLine3'>
            <div style={{height:'60px'}}>
              <div style={{float:'left', width:'50%'}}>
                <label htmlFor="Desconto" style={{height:'50px'}}>
                  % Desconto
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={discountPercetage}
                    className='inputField'
                    onChange={ChangeDiscountPercentage}
                    onBlur={BlurDiscountPercentage}
                  />
                </label>
              </div>

              <div style={{float:'left', width:'50%'}}>
                <label htmlFor="Liquido" style={{height:'40px'}}>
                  Liquido
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={discountValue}
                    className='inputField'
                    disabled
                  />
                </label>
              </div>
            </div>
          </ItemLine>

          <ItemLine id='ItemLine4'>
            <div style={{height:'60px'}}>
              <div style={{float:'left', width:'50%'}}>
                <label htmlFor="parcela">
                  Parcelas ?
                  <Select
                    autoComplete="off"
                    styles={selectStyles}
                    value={parcelas.filter(options => options.id === movementParcelas)}
                    onChange={(item) => handleChangeParcelas(item? item.id: '')}
                    options={parcelas}
                  />
                </label>
              </div>

              <div style={{float:'left', width:'50%', marginTop:'-6px'}}>
                {showParcelasDatas && (
                  <div
                    className='disableDiv'
                    style={{pointerEvents: ((!enablePayments && movementId != '0')? 'none': 'auto'), opacity:((!enablePayments && movementId != '0')? '0.5': '1')}}
                  >
                    <label htmlFor="parcelaData">
                      &nbsp;
                      <Select
                        disabled={enablePayments}
                        autoComplete="off"
                        styles={selectStyles}
                        placeholder="Selecionar"
                        value={parcelasDatas. filter(options => options.id === movementParcelasDatas)}
                        onChange={(item) => setMovementParcelasDatas(item? item.id: '')}
                        options={parcelasDatas}
                      />
                    </label>
                  </div>
                )}

                {!showParcelasDatas && <label />}
              </div>
            </div>
          </ItemLine>
        </Line>

        <Line id='Line2'>
          <ItemLine id='ItemLine1'>
            <div>
              <label htmlFor='Categoria'>
                Categoria
                <Select
                  isSearchable
                  value={{ id: categoryId, label: categoryDescription }}
                  onChange={handleCategorySelected}
                  onInputChange={(term) => setCategoryTerm(term)}
                  isClearable
                  placeholder=""
                  styles={selectStyles}
                  options={categoryList}
                  required
                />
              </label>
            </div>
          </ItemLine>

          <ItemLine id='ItemLine2'>
            <div>
              <label htmlFor='CentroCusto'>
                Centro de Custo
                <Select
                  isSearchable
                  isClearable
                  value={{ id: centerCostId, label: centerCostDescription }}
                  onChange={handleCenterCostSelected}
                  onInputChange={(term) => setCenterCostTerm(term)}
                  required
                  placeholder=""
                  styles={selectStyles}
                  options={centerCostList}
                />
              </label>
            </div>
          </ItemLine>

          <ItemLine id='ItemLine3'>
            <div>
              <label htmlFor='FormaPagamento'>
                Forma Pagto.
                <Select
                  isSearchable
                  isClearable
                  value={{ id: paymentFormId, label: paymentFormDescription }}
                  onChange={handlePaymentFormSelected}
                  onInputChange={(term) => setPaymentFormTerm(term)}
                  required
                  placeholder=""
                  styles={selectStyles}
                  options={paymentFormList}
                />
              </label>
            </div>
          </ItemLine>

          {paymentFormType == "P" ? (
            <ItemLine id='ItemLine4'>
              <div>
                <label htmlFor="chavePIX">
                  Chave Pix
                  <input
                    type="text"
                    className='inputField'
                    maxLength={200}
                    value={pixKey}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPixKey(e.target.value)}
                  />
                </label>
              </div>
            </ItemLine>
          ) : (
            <ItemLine id='ItemLine4'>
              <div>
                <label htmlFor="NotaFiscal">
                  Nota Fiscal
                  <input
                    type="text"
                    className='inputField'
                    maxLength={20}
                    value={taxInvoice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTaxInvoice(e.target.value)}
                  />
                </label>
              </div>
            </ItemLine>
          )}
        </Line>

        {paymentFormType == "P" &&(
          <Line id='Line2'>
            <ItemLine id='ItemLine4'>
              <div>
                <label htmlFor="NotaFiscal">
                  Nota Fiscal
                  <input
                    type="text"
                    className='inputField'
                    maxLength={20}
                    value={taxInvoice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTaxInvoice(e.target.value)}
                  />
                </label>
              </div>
            </ItemLine>
          </Line>
        )}

        <section id='Description'>
          <label htmlFor="description">
            Descrição
            <textarea
              maxLength={1000}
              value={movementDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMovementDescription(e.target.value)}
            />
          </label>
        </section>

        <section id='PeopleAndReminders'>
          <label htmlFor="pessoas">
            Pessoas
            <Select
              isSearchable
              isClearable
              value={{ id: peopleId, label: peopleDescription }}
              onChange={handlePeopleSelected}
              onInputChange={(term) => setPeopleTerm(term)}
              required
              placeholder="Selecione "
              styles={selectStyles}
              options={peopleList}
            />
          </label>

          <label htmlFor="lembretes">
            Lembrete &nbsp;
            <div style={{marginTop: '-18px', marginLeft:'68px'}}>
              <MdHelp
                style={{color:'#2C8ED6'}}
                className='help'
                title="Escolhendo o lembrete, todos os usuários que tem acesso ao financeiro recebem uma notificação de movimento de acordo com o lembrete escolhido"
              />
            </div>

            <Select
              autoComplete="off"
              placeholder="Selecione"
              styles={selectStyles}
              value={financialReminders.filter(options => options.id === reminders)}
              onChange={(item) => handleReminders(item)}
              options={financialReminders}
            />
          </label>

          <label htmlFor="reembolso">
            &nbsp;
            <div style={{float:'left', marginTop:'28px'}}>
              Reembolso ?
            </div>
            <div style={{float:'left', marginTop:'30px', marginLeft:'5px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgReembolso}
                onChange={() => setFlgReembolso(!flgReembolso)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
          </label>
        </section>

        <section id='PeopleListAdd'>
          <div className="personList">

            {isMOBILE && (
              <>
                <br />
                <br />
                <br />
              </>
            )}

            {selectedPeopleList.map(item => {
              return (
                <p>
                  {item.label}
                  <FiTrash onClick={() => handleRemoveItemPeople(item)} />
                </p>
              )
            })}
          </div>

          <div className="flexDiv">
            {flgNotifyPeople ? (
              <>
                {flgNotifyEmail == true ? (
                  <button type="button" onClick={() => {setFlgNotifyEmail(false)}} title='O lembrete será enviado para o e-mail do cliente'>
                    &nbsp;&nbsp;&nbsp;<FiMail className='notificationEmailActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyEmail(true)}} title='O lembrete não será enviado para o e-mail do cliente'>
                    &nbsp;&nbsp;&nbsp;<FiMail className='notificationEmailInactive' />
                  </button>
                )}
                &nbsp;&nbsp;
                {flgNotifyWhatsApp == true ? (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp(false)}} title='O lembrete será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp(true)}} title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button>
                )}
                &nbsp;&nbsp;
                <button type="button" onClick={() => {setFlgNotifyPeople(false); setFlgNotifyEmail(false); setFlgNotifyWhatsApp(false)}}>
                  <FiTrash className='trash' title="Excluir" />
                </button>
              </>
            ) : (
              <button type="button" id="NotificationCustomerButton" onClick={() => {setFlgNotifyPeople(true)}} style={{color:'blue'}} title='Após clicar no botão selecione as opções de notificação por E-Mail ou WhatsApp'>
                <p>&nbsp;&nbsp;&nbsp;Notificar Cliente</p>
              </button>  
            )}
          </div>

          <div className="flexDiv"><></></div>
        </section>
        <br />

        <section id='MatterAndPaymentSlip'>
          <div id='AttachMatter' className="flexDiv" style={{marginLeft:'10px'}}>
            <Process>
              {processTitle === 'Associar Processo' && (
                <button type="button" id="associar" onClick={handleGridSelectProcess}>
                  <p>{processTitle}</p>
                </button>
              )}

              {processTitle !== 'Associar Processo' && (
                <>
                  <span style={{fontSize:'0.625rem', fontWeight:500, fontFamily:'montserrat'}}>Processo:&nbsp;</span>
                  <span style={{fontSize:'0.625rem', fontWeight:500, fontFamily:'montserrat'}}>{processTitle}</span>
                </>
              )}

              {processTitle === 'Associar Processo' && (
                <button type="button" onClick={handleGridSelectProcess}>
                  &nbsp;&nbsp;
                  <RiFolder2Fill className='erase' />
                </button>
              )}

              {processTitle !== 'Associar Processo' && (
                <button type="button" onClick={() => {setProcessTitle('Associar Processo'); setAppointmentMatter(undefined); setMatterId('0')}}>
                  &nbsp;&nbsp;
                  {!blockAssociateMatter && <RiEraserLine className='erase' /> }
                </button>
              )}
            </Process>
          </div>

          <div id='BankPaymentSlip' className="flexDiv">
            {hasBankPaymentSlip &&(
              <div id='BankPaymentSlip' style={{marginTop:'6px'}}>
                <div style={{float:'left'}}>
                  <button type="button" onClick={(e) => OpenBankPaymentSlipNewWindow({bankPaymentSlipLink})}>
                    <AiOutlineBarcode 
                      style={{height:'30px', width:'25px', color:'blue'}} 
                      title={`Vencimento do boleto em: ${(format(new Date(bankPaymentSlipLinkDate), 'dd/MM/yyyy'))} `}
                    />
                  </button>
                </div>
                <div style={{float:'left', fontSize:'13px', marginLeft:'7px', marginTop:'6px'}}>
                  <a href={bankPaymentSlipLink} target="blank" style={{color:'blue'}}>Ver boleto - Venc.({(format(new Date(bankPaymentSlipLinkDate), 'dd/MM/yyyy'))})</a>
                </div>
              </div>
            )}
          </div>
          <div className="flexDiv">
            <>
              {(!isMOBILE && movementId != '0' && movementType == "R" && paymentFormType == "B" && companyPlan != 'GOJURFR' && !isTotalPaid && hasBankPaymentSlip) &&(
                <button className="buttonClick" type='button' onClick={()=> GenerateSecondBankPaymentSlip()}>
                  <FaFileInvoiceDollar  />
                  Gerar 2ª Via Boleto
                </button>
              )}
            </>
          </div>
        </section>
        <br />

        <div id='PaymentElements' className='paymentElements'>

          {invoice == 0 && (
            <div style={{width:'100%', marginTop:'15px'}}>
              <button
                className="buttonClick"
                type='button'
                onClick={()=> handlePayments()}
              >
                <MdAttachMoney />
                {movementType == "R" && <span style={{fontSize:'0.625rem', fontWeight:500, fontFamily:'montserrat'}}>Receber</span>}
                {movementType == "D" && <span style={{fontSize:'0.625rem', fontWeight:500, fontFamily:'montserrat'}}>Pagar</span>}
              </button>
              <br />

              {showPayments && (
                <>
                  {paymentList.map(payment => (
                    <>
                      <div id='Elements' style={{height:'40px'}}>
                        <div style={{float:'left', width:'140px'}}>
                          <input
                            type='date'
                            title=""
                            style={{width:'70%', pointerEvents:'none', opacity:'0.5'}}
                            value={payment.dta_LiquidacaoStr}
                          />
                        </div>

                        <div style={{float:'left', width:'85px', marginTop:'1px', pointerEvents:'none', opacity:'0.5'}}>
                          <IntlCurrencyInput
                            currency="BRL"
                            config={currencyConfig}
                            value={payment.vlr_Liquidacao}
                          />
                        </div>

                        <div style={{float:'left', width:'40px', marginTop:'2px'}}>
                          <button
                            className="buttonLinkClick"
                            title="Editar pagamento"
                            type="submit"
                            onClick={() => setShowPaymentModal(true)}
                          >
                            &nbsp;&nbsp;
                            <FiEdit />
                          </button>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              )}

              <div>
                <span style={{fontSize:'0.625rem', fontFamily:'montserrat', color:'red'}}>
                  {paymentMessage}
                </span>
              </div>
            </div>
          )}

          {invoice != 0 && (
            <>
              <br />
              <span className='invoiceWarningPayment'>Os dados de recebimento deverão ser informados na fatura de origem.</span>
              <br />
              <span className='invoiceWarningPayment'>O GOJUR irá fazer a integração com a movimentação automaticamente.</span>
              <br />
              <br />
            </>
          )}

        </div>
        <br />

        <div id='AttachDocument' style={{width:'95%'}}>
          {invoice == 0 && (
            <label htmlFor='file' className="buttonLinkClick" style={{position: "relative"}} title="Clique para selecionar arquivos em seu computador">
              <FaFileAlt />
              Anexar Arquivo
              <input
                ref={ref}
                type="file"
                multiple
                style={{opacity: '0', position: "absolute", marginLeft: "-100%", width:"100%", height:"35px", cursor:"pointer"}}
                onChange={(e) => handleSaveFile(e)}
              />
            </label>
          )}
        </div>
        <br />

        <GridSubContainer style={{pointerEvents:(isDeletingFile?'none':'all')}}>
          <Grid
            rows={documentList}
            columns={columns}
          >
            <SortingState
              defaultSorting={[{ columnName: 'dateUpload', direction: 'desc' }]}
            />
            <IntegratedSorting />
            <PagingState
              currentPage={currentPage}
              pageSize={pageSize}
              onCurrentPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
            <IntegratedPaging />
            <CustomPaging totalCount={totalRows} />
            <DateTypeProvider for={dateColumns} />
            <Table
              cellComponent={CustomCell}
              columnExtensions={tableColumnExtensions}
              messages={languageGridEmpty}
            />
            <TableHeaderRow showSortingControls />
            <PagingPanel
              messages={languageGridPagination}
            />
          </Grid>

        </GridSubContainer>
        <br />

        <div id='Buttons'>
          <div className='log'>
            {movementId != "0" && (
              <button type="button" id="log" onClick={handleLogOnDisplay}>
                <div style={{float:'left'}}><IoIosPaper title="Ver Historico" /></div>
                <div style={{float:'left'}}>&nbsp;Ver Histórico</div>
              </button>
            )}
          </div>

          <div id='Buttons' style={{float:'right'}}>
            <button className="buttonClick" type='button' onClick={()=> Save('', false)}>
              <BiSave />
              Salvar
            </button>

            {(movementId != '0' && invoice == 0) && (
              <button className="buttonClick" type='button' onClick={()=> Copy()}>
                <FaRegCopy />
                Copiar
              </button>
            )}

            {(movementId != '0' && invoice == 0 && movementType == "R" && billingInvoiceId == "0" && paymentFormType != "" && !hasBankPaymentSlip) && (
              <button className="buttonClick" type='button' onClick={()=> HandleCreateInvoice()}>
                <FaRegCopy />
                Faturar
              </button>
            )}

            {(movementId != '0' && movementType == "R" && companyPlan != 'GOJURFR' && paymentFormType == "B" && billingInvoiceId != "0" && !hasBankPaymentSlip) && (
              <button className="buttonClick" type='button' onClick={()=> GeneratePaymentSlip('justOne', false, true)}>
                <FaRegCopy />
                Gerar Boleto
              </button>
            )}

            {(!isMOBILE && movementId != '0' && movementType == "R" && billingInvoiceId != "") &&(
              <>
                <button className="buttonClick" type='button' onClick={()=> PrintBillingInvoice()}>
                  <FiPrinter />
                  Emitir Fatura
                </button>

                <button className="buttonClick" type='button' onClick={()=> SendEmailBillingInvoice()}>
                  <AiOutlineMail />
                  Fatura Por E-Mail
                </button>
              </>
            )}

            {(!isMOBILE && movementId != '0' && invoice == 0) &&(
              <button className="buttonClick" type='button' onClick={()=> GenerateDocument()}>
                <CgFileDocument />
                Documento
              </button>
            )}

            {(movementId != '0' && invoice == 0) && (
              <button className="buttonClick" type='button' onClick={()=> CheckDeleteType(paymentQtd)}>
                <FiTrash />
                Excluir
              </button>
            )}

            <button type='button' className="buttonClick" onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`)}}>
              <FaRegTimesCircle />
              Fechar
            </button>
          </div>
        </div>
        <br />

        {isMOBILE && (
          <>
            <br /><br /><br /><br /><br /><br /><br />
          </>
        )}

        &nbsp;
      </Content>

      {(showDocumentModal) && <OverlayFinancial /> }
      {(showDocumentModal) && <FinancialDocumentModal callbackFunction={{movementId, invoice, CloseDocumentModal}} /> }

      {matterAttachedModal &&(<OverlayFinancial />)}
      {matterAttachedModal &&(<GridSelectProcess />)}

      {(showPaymentModal) && <OverlayFinancial /> }
      {(showPaymentModal) && <FinancialPaymentModal callbackFunction={{movementId, ClosePaymentModal }} /> }

      {showModalOptions && (
        <ModalOptions
          description="Este movimento está parcelado, deseja atualizar também as outras parcelas ?"
          close={() => setShowModalOptions(false)}
          callback={handleCallback}
        />
      )}

      {(showDeleteOptions) && <OverlayFinancial /> }
      {showDeleteOptions && (
        <ModalDeleteOptions>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowDeleteOptions(false)}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Este movimento está parcelado, deseja excluir também as outras parcelas ?
            <br />
            {hasBankPaymentSlip == true ? (
              <>
                Os boletos também serão removidos.
                <br />
              </>
            ) : <br />}
            
            <br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> Delete(false, true)}
                  style={{width:'120px'}}
                >
                  Excluir este
                </button>
              </div>

              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> Delete(true, true)}
                  style={{width:'120px'}}
                >
                  Excluir todos
                </button>
              </div>

              <div style={{float:'left', width:'100px'}}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => {setShowDeleteOptions(false)}}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Cancelar
                </button>
              </div>
            </div>
          </div>

        </ModalDeleteOptions>
      )}

      {(showConfirmDelete) && <OverlayFinancial /> }
      {showConfirmDelete && (
        <ModalDeleteOptions>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowConfirmDelete(false)}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Confirma a Exclusão ?
            <br />
            <br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> Delete(false, true)}
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
                  onClick={() => {setShowConfirmDelete(false)}}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Não
                </button>
              </div>
            </div>
          </div>

        </ModalDeleteOptions>
      )}

      {(showPaymentInformation) && <OverlayFinancial /> }
      {showPaymentInformation && (
        <ModalPaymentInformation>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowPaymentInformation(false)}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Você esta em um processo de inclusão do registo, para prosseguir é necessário salva-lo, deseja realizar este processo agora ?
            <br /><br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> SaveByPaymentInformation()}
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
                  onClick={() => {setShowPaymentInformation(false)}}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Não
                </button>
              </div>
            </div>
          </div>

        </ModalPaymentInformation>
      )}

      {showBankPaymentSlipSecondCopyModal && <OverlayFinancial /> }
      {showBankPaymentSlipSecondCopyModal && <BankPaymentSlipSecondCopyModal callbackFunction={{setShowBankPaymentSlipSecondCopyModal, setBankPaymentSlipDate, setMovementValue, movementId, movementValue, GeneratePaymentSlip }} /> }
      
      {hasBankPaymentSlipErrors && <OverlayFinancial /> }
      {hasBankPaymentSlipErrors && (
        <ModalBankPaymentSlipErrors>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;ATENÇÃO
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => {setHasBankPaymentSlipErrors(false)}} />
          </div>
          <br />

          <div id='Message' style={{marginLeft:'30px', marginTop:'20px', height:'110px'}} dangerouslySetInnerHTML={{ __html: bankPaymentSlipErrors }} />

          <div id='Button' style={{textAlign:'center'}}>
            <button type='button' className="buttonClick" onClick={()=> {setHasBankPaymentSlipErrors(false)}} style={{width:'150px'}}>
              <FaRegTimesCircle />
              Fechar
            </button>
          </div>
        </ModalBankPaymentSlipErrors>
      )}

      {showChangeInstallments && (
        <ConfirmBoxModal
          title="Alterar parcelas do movimento"
          caller="changeDefaultHeader"
          useCheckBoxConfirm
          message="Foi alterado o número de parcelas do movimento, o reparcelamento implica em alterar todas as parcelas considerando os dados do movimento atual. Eventuais liquidações serão mantidas desde que a parcela não seja removida (no caso de redução de parcelas)."
        />
      )}

      {showChangePaymentForm && (
        <ConfirmBoxModal
          title="Alterar forma de pagamento"
          caller="changePaymentForm"
          useCheckBoxConfirm
          message="Você está alterando a forma de pagamento de um movimento com boleto cadastrado. Ao confirmar o boleto será excluído."
        />
      )}

      {showValidateFinancialIntegration && (
        <ConfirmBoxModal
          title="Integrador Financeiro"
          caller="validateFinancialIntegration"
          useCheckBoxConfirm
          message="Não existe um integrador financeiro para o boleto vinculado a este movimento. Ao confirmar, o movimento será excluído mas o boleto permanecera existente em seu banco."
        />
      )}

      {showInstallmentInvoiceConfirm && (
        <ConfirmBoxModal
          title="Faturar"
          caller="invoiceInstallment"
          useCheckBoxConfirm
          message="Este movimento está parcelado, todas as parcelas serão faturadas."
        />
      )}

      {showInstallmentPaymentSlipConfirm && (
        <ConfirmBoxModal
          title="Gerar Boletos"
          caller="paymentSlipInstallment"
          message="Este movimento está parcelado, serão gerados os boletos para todas as parcelas com período de vencimento posterior a hoje."
        />
      )}

      {showModalPlan && <OverlayFinancial /> }
      {showModalPlan && (
        <ModalPlan>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;ATENÇÃO
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => {setHasBankPaymentSlipErrors(false)}} />
          </div>
          <br /><br />

          &nbsp;&nbsp;Atenção, você já atingiu o limite de geração de boleto para o seu plano.<br />
          &nbsp;&nbsp;Você pode adquirir mais através de um dos nossos planos.<br />
          &nbsp;&nbsp;Confira nossas opções a seguir.

          <br /><br /><br />

          <div id='Button' style={{textAlign:'center'}}>
            <button type='button' className="buttonClick" onClick={()=> {history.push('/changeplan')}} style={{width:'150px'}}>
              <FaRegTimesCircle />
              Trocar Plano
            </button>
            <button type='button' className="buttonClick" onClick={()=> {setShowModalPlan(false)}} style={{width:'150px'}}>
              <FaRegTimesCircle />
              Fechar
            </button>
          </div>
        </ModalPlan>
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

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Gerando fatura...
          </div>
        </>
      )}

      {(uploadingStatus != 'none') && (
        <>
          <OverlayFinancial />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Carregando Arquivos...
          </div>
        </>
      )}

      {(isDeletingFile) && (
        <>
          <OverlayFinancial />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Deletando Arquivo...
          </div>
        </>
      )}

      {showLog && (
        <LogModal
          idRecord={Number(movementId)}
          handleCloseModalLog={handleCloseLog}
          logType="movementLog"
        />
      )}

    </Container>
  );
};

export default FinancialMovement;
