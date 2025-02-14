/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { GridSubContainer } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useConfirmBox } from 'context/confirmBox';
import { BiSearchAlt, BiTime, BiTrash } from 'react-icons/bi'
import { FaFileAlt, FaKey, FaUserCheck, FaUserCog, FaUsers, FaUserSlash, FaRegTimesCircle, FaArrowAltCircleRight, FaPlus, FaChevronLeft, FaChevronRight, FaBusinessTime } from 'react-icons/fa';
import { FcAbout } from 'react-icons/fc';
import { RiDashboardFill } from "react-icons/ri";
import { FiEdit, FiSearch, FiSave, FiArrowLeft } from 'react-icons/fi';
import { IoCompassOutline, IoReload } from "react-icons/io5";
import { MdHelp } from 'react-icons/md';
import { RiNewspaperFill, RiUserAddFill, RiAccountPinBoxLine } from 'react-icons/ri';
import { SiMinutemailer } from "react-icons/si";
import { months, financialYears } from 'Shared/utils/commonListValues';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { selectStyles, useDelay, FormatDate, FormatCurrency } from 'Shared/utils/commonFunctions';
import { PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { languageGridEmpty, languageGridPagination, languageGridLoading } from 'Shared/utils/commonConfig';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { format } from 'date-fns';
import { useToast } from 'context/toast';
import Search from 'components/Search';
import { useLocation, useHistory } from 'react-router-dom'
import api from 'services/api';
import LogModal from 'components/LogModal';
import { IUserData, ICustomerPendingData, ICustomerListData, ICustomerInformation, ICustomerPlanData, IPlanData, IResourcesData, ICustomerData, ISelectData, ISelectPlanData, ISelectResourcesData, IEmailData } from '../../../../Interfaces/ICustomerConfiguration';
import CustomerRobotModalEdit from './RobotModal';
import CustomerCancelPlanModalEdit from './CancelPlanModal';
import PublicationDateModal from './PublicationDateModal';
import PublicationClassification from './PublicationClassification';
import { Container, Content, Form, OverlayCustomerConfiguration, Box } from './styles';

export interface BusinessInformation {
  status: string;
  customerName: string;
  suspendedDate: string;
  lastPendencyDate: string;
}

export interface DashBoardMetrics {
  churnValue: string;
  churnQty: string;
  subscription: string;
  churnRate: string;
  salesValue: string;
  salesQty: string;
  conversionRate: string;
}

export interface CustomerXRayData {
  companyName: string;
  navigationTransactions: string;
  navigationTransactionsAverage: string;
  matterTransactions: string;
  matterTransactionsAverage: string;
  publicationTransactions: string;
  publicationTransactionsAverage: string;
  calendarTransactions: string;
  calendarTransactionsAverage: string;
  filesMB: string;
  filesQty: string;
  matterQty: string;
  users: string;
  days: number;
}

export interface PublicationData {
  releaseDate: string;
  publicationDate: string;
  customerName: string;
  description: string;
  matterNumber: string;
  totalRows: number;
  publicationId: number;
  showMore: boolean;
  id: number;
  flg_AtivoString: string;
  hasLog: boolean;
  tpo_Status: string;
  clearanceDate: string;
}

export interface PublicationDto extends PublicationData {
  openMenu: boolean;
  publicationSelected: number;
}

const CustomerConfiguration: React.FC = () => {
  const { addToast } = useToast();
  const { isMenuOpen, handleIsMenuOpen, } = useMenuHamburguer();
  const history = useHistory();
  const [isSaving, setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, handleCheckConfirm, caller, handleCaller } = useConfirmBox();
  const { pathname } = useLocation();
  const [companyId, setCompanyId] = useState<number>(0)
  const [customerCaller, setCustomerCaller] = useState<string>("");
  const [companyDescription, setCompanyDescription] = useState<string>("")
  const [planDescription, setPlanDescription] = useState<string>("")
  const [planReference, setPlanReference] = useState<string>("")
  const [customerStatus, setCustomerStatus] = useState<string>("")
  const [showRobotModal, setShowRobotModal] = useState<boolean>(false);
  const [showCancelPlanModal, setCancelPlanModal] = useState<boolean>(false);
  const [showPublicationDateModal, setShowPublicationDateModal] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [fromUserListByEmail, setFromUserListByEmail] = useState<boolean>(false)
  const [nom_Empresa, setNom_Empresa] = useState<string>("")
  const [fromUserListByEmailCompanyId, setFromUserListByEmailCompanyId] = useState<string>("")
  const [pageNumber, setPageNumber] = useState(1);

  const [tpo_StatusAcesso, setTpo_StatusAcesso] = useState<string>("")
  const [dta_Ativo, setDta_Ativo] = useState<string>("")
  const [dta_Teste, setDta_Teste] = useState<string>("")
  const [showTeste, setShowTeste] = useState<boolean>(false)

  // CustomerCompany Select Box
  const [customerCompanyValue, setCustomerCompanyValue] = useState('');
  const [customerCompanyId, setCustomerCompanyId] = useState('');
  const [customerCompanyTerm, setcustomerCompanyTerm] = useState('');
  const [customerCompany, setCustomerCompany] = useState<ISelectData[]>([]);

  // CustomerPlans
  const [accountInformationList, setAccountInformationList] = useState<ICustomerPlanData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [planValue, setPlanValue] = useState('');
  const [planId, setPlanId] = useState('');
  const [planTerm, setPlanTerm] = useState('');
  const [plans, setPlans] = useState<ISelectData[]>([]);
  const [resourcesValue, setResourcesValue] = useState('');
  const [resourcesId, setResourcesId] = useState('');
  const [resourcesTerm, setResourcesTerm] = useState('');
  const [resourceTpo, setResourceTpo] = useState("");
  const [codReferenceResource, setCodReferenceResource] = useState("")
  const [codReferencePlan, setCodReferencePlan] = useState("")
  const [resources, setResources] = useState<ISelectData[]>([]);
  const [planQtd, setPlanQtd] = useState<string>("1")

  const [confirmChangePlan, setConfirmChangePlan] = useState<boolean>(false)
  const [modalChangePlan, setModalChangePlan] = useState<boolean>(false)
  const [changePlan, setChangePlan] = useState<boolean>(false)

  const [modalLiberationSevenDays, setModalLiberationSevenDays] = useState<boolean>(false)
  const [confirmLiberationSevenDays, setConfirmLiberationSevenDays] = useState<boolean>(false)
  const [userCheck, setUserCheck] = useState<string>("N")
  const [doubleCheck, setDoubleCheck] = useState<boolean>(false)

  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [confirmLiberationModal, setConfirmLiberationModal] = useState<boolean>(false)

  // UserList
  const [isChangingPassWord, setIsChangingPassWord] = useState<boolean>(false);
  const [confirmResetPassword, setConfirmResetPassword] = useState<boolean>(false)
  const [modalResetPassword, setModalResetPassword] = useState<boolean>(false)
  const [userList, setUserList] = useState<IUserData[]>([]);
  const [userCompanyId, setUserCompanyId] = useState<number>(0)
  const [currentPageUserList, setCurrentPageUserList] = useState(0);
  const [totalRowsUserList, setTotalRowsUserList] = useState<number>(0);

  // UserListByEmail
  const [userListByEmail, setUserListByEmail] = useState<IUserData[]>([]);
  const [totalRowUserListByEmail, setRowUserListByEmail] = useState<number>(0)
  const [currentPageUserListByEmail, setCurrentPageUserListByEmail] = useState(0);
  const [pageSizeUserListByEmail, setPageSizeUserListByEmail] = useState(100);
  const [filterByEmail, setFilterByEmail] = useState<string>("")
  const [changeCompanyByUser, setChangeCompanyByUser] = useState<boolean>(false)

  // CustomerList
  const [customerList, setCustomerList] = useState<ICustomerListData[]>([]);
  const [currentPageCustomerList, setCurrentPageCustomerList] = useState(0);
  const [totalRowsCustomerList, setTotalRowsCustomerList] = useState(0);
  const [filterType, setFilterType] = useState<string>("01");
  const [pageSizeCustomerList, setPageSizeCustomerList] = useState(50);
  const [pageSizes] = useState([10, 20, 30, 50]);

  // Pending Jobs
  const [matterIdSearch, setMatterIdSearch] = useState<string>("")
  const [customerPendingJobsList, setCustomerPendingJobsList] = useState<ICustomerPendingData[]>([]);
  const [totalRowsPendingJobs, setTotalRowsPendingJobs] = useState<number>(0);
  const [currentPagePendingJobs, setCurrentPagePendingJobs] = useState(0);

  // Publication
  const [publiPageNumber, setPublicPageNumber] = useState(0)
  const [filterPublicationId, setFilterPublicationId] = useState(0)
  const [filterPeriod, setFilterPeriod] = useState('')
  const [filterTerm, setFilterTerm] = useState('')
  const [nameFilterValue, setNameFilterValue] = useState('filterNameFalse') // valor do filtro por nome
  const [totalPublications, setTotalPublications] = useState(0)
  const [publication, setPublication] = useState<PublicationDto[]>([]) // dados da publicação
  const [pageSizePublication, setPageSizPublication] = useState(20);
  const [changePage, setChangePage] = useState<boolean>(false)
  const [changeDates, setChangeDates] = useState<boolean>(false);
  const [dtaCustomStart, setDtaCustomStart] = useState<string>("")
  const [dtaCustomEnd, setDtaCustomEnd] = useState<string>("")
  const [showCustomDates, setShowCustomDates] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState(true) // trigger to reload page
  const [changeFilter, setChangeFilter] = useState<boolean>(false)
  const [currentPublicationId, setCurrentPublicationId] = useState<number>(0)
  const [showLog, setShowLog] = useState(false); // Controla a Abertura do modal de Log

  // RAIO-X
  const [xRayDays, setXRayDays] = useState('30');
  const [companyName, setCompanyName] = useState('');
  const [navigationTransactions, setNavigationTransactions] = useState('');
  const [navigationTransactionsAverage, setNavigationTransactionsAverage] = useState('');
  const [matterTransactions, setMatterTransactions] = useState('');
  const [matterTransactionsAverage, setMatterTransactionsAverage] = useState('');
  const [publicationTransactions, setPublicationTransactions] = useState('');
  const [publicationTransactionsAverage, setPublicationTransactionsAverage] = useState('');
  const [calendarTransactions, setCalendarTransactions] = useState('');
  const [calendarTransactionsAverage, setCalendarTransactionsAverage] = useState('');
  const [filesMB, setFilesMB] = useState('');
  const [filesQty, setFilesQty] = useState('');
  const [matterQty, setMatterQty] = useState('');
  const [users, setUsers] = useState('');
  const [days, setDays] = useState(0);

  // BusinessInformation

  // Suspended
  const [suspendedCustomersList, setSuspendedCustomersList] = useState<BusinessInformation[]>([]);
  const [currentPageSuspendedCustomersList, setCurrentPageSuspendedCustomersList] = useState(0);
  const [totalRowsSuspendedCustomersList, setTotalRowsSuspendedCustomersList] = useState<number>(0);

  // CustomerPayment
  const [paymentCustomersList, setPaymentCustomersList] = useState<BusinessInformation[]>([]);
  const [currentPagePaymentCustomersList, setCurrentPagePaymentCustomersList] = useState(0);
  const [totalRowsPaymentCustomersList, setTotalRowsPaymentCustomersList] = useState<number>(0);
  const [month, setMonth] = useState<string>(FormatDate(new Date(), 'MM'));
  const [year, setYear] = useState<string>(FormatDate(new Date(), 'yyyy'));


  // DashBoardMetrics
  const [churn, setChurn] = useState<string>("0")
  const [churnQty, setChurnQty] = useState<string>("0")
  const [subscriptions, setSubscriptions] = useState<string>("0")
  const [churnRate, setChurnRate] = useState<string>("0")
  const [salesValue, setSalesValue] = useState<string>("0")
  const [salesQty, setSalesQty] = useState<string>("0")
  const [conversionRate, setConversionRate] = useState<string>("0")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  useEffect(() => {
    CustomerInformation()
  }, [pathname])


  useEffect(() => {
    if (changeCompanyByUser == true) {
      CustomerInformation()
    }
  }, [changeCompanyByUser])


  useEffect(() => {
    LoadCustomer()
  }, [])


  useEffect(() => {
    if (customerCaller == "businessInformation") {

      const today = new Date(); // Obtém a data atual
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const formatarData = (data) => {
        const year = data.getFullYear();
        const month = (data.getMonth() + 1).toString().padStart(2, '0'); // O mês é base 0, então é necessário adicionar 1
        const day = data.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Formate as datas conforme necessário
      const primeiraDataFormatada = formatarData(firstDayOfMonth);
      const ultimaDataFormatada = formatarData(lastDayOfMonth);

      setStartDate(primeiraDataFormatada)
      setEndDate(ultimaDataFormatada)

      LoadDashBoardMetrics(primeiraDataFormatada, ultimaDataFormatada)

      setPaymentCustomersList([]);
      setSuspendedCustomersList([]);
    }
  }, [customerCaller])


  useEffect(() => {
    if (isCancelMessage) {
      if (caller === 'confirmLiberationSevenDays') {
        setModalLiberationSevenDays(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if (isConfirmMessage) {
      if (caller === 'confirmLiberationSevenDays') {
        setUserCheck("Y")
        setConfirmLiberationSevenDays(true)
      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if (confirmLiberationSevenDays) {
      setConfirmLiberationSevenDays(false)
      setModalLiberationSevenDays(false)
      handleCaller("")
      handleConfirmMessage(false)
      LiberateSevenDays()
    }
  }, [confirmLiberationSevenDays]);


  useDelay(() => {
    if (customerCompanyTerm.length > 0) {
      LoadCustomer()
    }
  }, [customerCompanyTerm], 500)


  // CustomerAccountPlan UseEffects
  useEffect(() => {
    if (customerCaller == 'accountPlan') {
      setIsLoading(true)
      LoadAccountInformation();
      LoadPlans()
      LoadResources()
    }
  }, [customerCaller])


  useEffect(() => {
    if (customerCaller != 'accountPlan') {
      setPlanQtd("1")
      setResourcesValue("")
      setResourcesId("")
      setResourcesTerm("")
    }
  }, [customerCaller])


  // CustomerPending UseEffects
  useEffect(() => {
    if (customerCaller == 'customerPendingJobs') {
      setIsLoading(true)
      LoadPendingJobs("")
    }
  }, [customerCaller])


  // UserList UseEffects
  useEffect(() => {
    if (customerCaller == 'userList') {
      setIsLoading(true)
      LoadUserInformation()
    }
  }, [customerCaller])


  // RAIO-X
  useEffect(() => {
    if (customerCaller == 'xray') {
      setIsLoading(true)
      LoadCustomerXRay(xRayDays)
    }
  }, [customerCaller])


  // SuspendedCustomers
  useEffect(() => {
    if (customerCaller == 'suspendedCustomers') {
      setIsLoading(true)
      LoadSuspendedCustomers()
    }
  }, [customerCaller])


  useEffect(() => {
    if (isCancelMessage) {
      if (caller === 'confirmChangePlan') {
        setModalChangePlan(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if (isConfirmMessage) {
      if (caller === 'confirmChangePlan') {
        setConfirmChangePlan(true)
      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if (confirmChangePlan) {
      setConfirmChangePlan(false)
      setModalChangePlan(false)
      handleCaller("")
      handleConfirmMessage(false)
      setChangePlan(true)
    }
  }, [confirmChangePlan]);


  // Change PassWord UserList
  useEffect(() => {
    if (isCancelMessage) {
      if (caller === 'confirmChangePassword') {
        setModalResetPassword(false)
        setUserCompanyId(0)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if (isConfirmMessage) {
      if (caller === 'confirmChangePassword') {
        setConfirmResetPassword(true)
      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if (confirmResetPassword) {
      setConfirmResetPassword(false)
      setModalResetPassword(false)
      handleCaller("")
      ResetPassword()
      handleConfirmMessage(false)
      setIsChangingPassWord(true)
    }
  }, [confirmResetPassword]);


  useEffect(() => {
    if (isCancelMessage) {
      if (caller === 'liberationByTerm') {
        setDoubleCheck(false)
        setOpenConfirmModal(false)
        handleCancelMessage(false)
        setErrorMessage("")
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if (isConfirmMessage) {
      if (caller === 'liberationByTerm') {
        setDoubleCheck(true)
        handleCheckConfirm(true)
        setDoubleCheck(true)
        setConfirmLiberationModal(true)
        handleCancelMessage(false)

      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if (confirmLiberationModal) {
      setOpenConfirmModal(false)
      handleCaller("")
      setConfirmLiberationModal(false)
      handleConfirmMessage(false)
      LiberateSevenDays()
      setErrorMessage("")

    }
  }, [confirmLiberationModal]);


  // CustomerList UseEffects
  useEffect(() => {
    if (customerCaller == 'customerList') {
      setIsLoading(true)
      LoadCustomerList()
    }
  }, [customerCaller, currentPageCustomerList, pageSizeCustomerList, filterType])


  useEffect(() => {
    if (changeFilter == true || changePage == true) {
      LoadPublications()
    }
  }, [changeFilter, pageSizePublication, filterPeriod, publiPageNumber])


  // Custom Dates
  useEffect(() => {
    if (changeDates == true) {
      setPublicPageNumber(0)
      setLoadingData(true)
      setFilterPeriod('')
    }
  }, [changeDates])


  useEffect(() => {
    // if loadingData is true reload screem publication
    if (loadingData == true) {
      LoadPublications()
    }
  }, [loadingData])


  useEffect(() => {
    if (fromUserListByEmail == true && nom_Empresa != "") {
      setcustomerCompanyTerm(nom_Empresa)
    }
  }, [fromUserListByEmail, nom_Empresa])


  // CustomerPlans columns
  const columnsCustomerPlans = [
    { name: 'des_RecursoSistema', title: 'Recurso' },
    { name: 'qtd_RecursoIncluso', title: 'Total Plano' },
    { name: 'btnEditar', title: ' ' },
    { name: "bntExcluir", title: ' ' }
  ];


  const [tableColumnExtensionsCustomerPlans] = useState([
    { columnName: 'des_RecursoSistema', width: '50%' },
    { columnName: 'qtd_RecursoIncluso', width: '30%' },
    { columnName: 'btnEditar', width: '10%' },
    { columnName: 'bntExcluir', width: '10%' }
  ]);


  // USERLIST columns
  const columnsUsrLists = [
    { name: 'nom_Pessoa', title: 'Nome' },
    { name: 'des_Email', title: 'E-Mail' },
    { name: 'tpo_Usuario', title: 'Tipo' },
    { name: 'flg_Ativo', title: 'Status' },
    { name: 'bntResetar', title: 'Senha' }
  ];


  const [tableColumnExtensionsUserLists] = useState([
    { columnName: 'nom_Pessoa', width: '30%' },
    { columnName: 'des_Email', width: '30%' },
    { columnName: 'tpo_Usuario', width: '16%' },
    { columnName: 'flg_Ativo', width: '12%' },
    { columnName: 'bntResetar', width: '12%' }
  ]);


  // USERLISTBYEMAIL columns
  const columnsUsrListsByEmail = [
    { name: 'nom_Pessoa', title: 'Nome' },
    { name: 'des_Email', title: 'E-Mail' },
    { name: 'tpo_Usuario', title: 'Tipo' },
    { name: 'cod_Empresa', title: 'Empresa' },
    { name: 'flg_AtivoString', title: 'Status' },
    { name: 'bntAcessar', title: ' ' },
  ];


  const [tableColumnExtensionsUserListsByEmail] = useState([
    { columnName: 'nom_Pessoa', width: '30%' },
    { columnName: 'des_Email', width: '30%' },
    { columnName: 'tpo_Usuario', width: '15%' },
    { columnName: 'cod_Empresa', width: '10%' },
    { columnName: 'flg_AtivoString', width: '10%' },
    { columnName: 'bntAcessar', width: '4%' },
  ]);


  // PENDINGJOBS colums 
  const columnsPendingJobs = [
    { name: 'matterTempId', title: 'ID' },
    { name: 'matterNumber', title: 'Nº Processo (CNJ)' },
    { name: 'matterTempDate', title: 'Data de Inclusão' },
    { name: 'matterTempType', title: 'Tipo Pesquisa' },
    { name: 'matterTempError', title: 'Erro Encontrado' },
    { name: 'bntConsulta', title: ' ' },
    { name: 'bntReprocessar', title: ' ' }
  ];


  const [tableColumnExtensionsPendingJobs] = useState([
    { columnName: 'matterTempId', width: '8%' },
    { columnName: 'matterNumber', width: '19%' },
    { columnName: 'matterTempDate', width: '15%' },
    { columnName: 'matterTempType', width: '13%' },
    { columnName: 'matterTempError', width: '36%' },
    { columnName: 'bntConsulta', width: '4%' },
    { columnName: 'bntReprocessar', width: '4%' }
  ]);


  // CustomerList colums 
  const columnsCustomerList = [
    { name: 'customerId', title: 'Código' },
    { name: 'peopleCompanyName', title: 'Nome' },
    { name: 'lastAccessDate', title: 'Última Operação' },
    { name: 'matterQtty', title: 'Processos' },
    { name: 'matterCourtImportQtty', title: 'Tribunal' },
    { name: 'robotPlanQtty', title: 'Robô Plano' },
    { name: 'robotOnQtty', title: 'Robô Ligado' },
    { name: 'customer_Plan', title: 'Plano Gojur' },
    { name: 'cadastro', title: 'Cadastro' }
  ];


  const [tableColumnExtensionsCustomerList] = useState([
    { columnName: 'customerId', width: '8%' },
    { columnName: 'peopleCompanyName', width: '15%' },
    { columnName: 'lastAccessDate', width: '15%' },
    { columnName: 'matterQtty', width: '9%' },
    { columnName: 'matterCourtImportQtty', width: '8%' },
    { columnName: 'robotPlanQtty', width: '10%' },
    { columnName: 'robotOnQtty', width: '10%' },
    { columnName: 'customer_Plan', width: '14%' },
    { columnName: 'cadastro', width: '11%' }
  ]);


  const columnsPublication = [
    { name: 'matterNumber', title: 'Processo' },
    { name: 'customerName', title: 'Nome' },
    { name: 'releaseDate', title: 'Data Disponib.' },
    { name: 'publicationDate', title: 'Data Pub./Lib.'},
    { name: 'description', title: 'Descrição' },
    { name: 'publicationId', title: 'ID' }
  ];


  const [tableColumnExtensionsPublication] = useState([
    { columnName: 'matterNumber', width: '23%' },
    { columnName: 'customerName', width: '15%' },
    { columnName: 'releaseDate', width: '14%' },
    { columnName: 'publicationDate', width: '14%' },
    { columnName: 'description', width: '25%' },
    { columnName: 'publicationId', width: '8%' },
  ]);


  const columnsCustomersSuspended = [
    { name: 'customerName', title: 'Cliente' },
    { name: 'suspendedDate', title: 'Data Suspensão' },
    { name: 'lastPendencyDate', title: 'Data Ult. Pendência' },
  ];


  const [tableColumnExtensionsCustomersSuspended] = useState([
    { columnName: 'customerName', width: '50%' },
    { columnName: 'suspendedDate', width: '25%' },
    { columnName: 'lastPendencyDate', width: '25%' },
  ]);


  const columnsCustomersPayment = [
    { name: 'customerName', title: 'Cliente' },
    { name: 'planValue', title: 'Valor Plano' },
    { name: 'paymentDate', title: 'Data Pagamento' },
  ];


  const [tableColumnExtensionsCustomersPayment] = useState([
    { columnName: 'customerName', width: '50%' },
    { columnName: 'planValue', width: '25%' },
    { columnName: 'paymentDate', width: '25%' },
  ]);


  // AccountInformationList AREA
  const LoadAccountInformation = async () => {
    try {
      setIsLoading(true)
      const response = await api.get<ICustomerPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarInformacoesConta', {
        params: {
          companyId,
          token,
        }
      });

      setAccountInformationList(response.data)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  // UserList AREA
  const LoadUserInformation = async () => {
    try {
      const response = await api.get<IUserData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarUsuarios', {
        params: {
          companyId,
          token,
        }
      });

      setUserList(response.data)
      setTotalRowsUserList(response.data.length)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  const LoadCustomerXRay = async (days) => {
    try {
      setIsLoading(true)

      const response = await api.get<CustomerXRayData>('/Empresa/RaioXCliente', {
        params: { companyId, days, token }
      });

      setCompanyName(response.data.companyName)
      setNavigationTransactions(response.data.navigationTransactions)
      setNavigationTransactionsAverage(response.data.navigationTransactionsAverage)
      setMatterTransactions(response.data.matterTransactions)
      setMatterTransactionsAverage(response.data.matterTransactionsAverage)
      setPublicationTransactions(response.data.publicationTransactions)
      setPublicationTransactionsAverage(response.data.publicationTransactionsAverage)
      setCalendarTransactions(response.data.calendarTransactions)
      setCalendarTransactionsAverage(response.data.calendarTransactionsAverage)
      setFilesMB(response.data.filesMB)
      setFilesQty(response.data.filesQty)
      setMatterQty(response.data.matterQty)
      setUsers(response.data.users)
      setDays(response.data.days)

      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  // UserListByEmail AREA
  const LoadUserByEmail = async () => {
    setIsLoading(true)

    handleClickListAllUsersByEmail()

    try {
      const response = await api.get<IUserData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarUsuariosPorEmail', {
        params: {
          filterType: "E",
          filterClause: filterByEmail,
          page: currentPageUserListByEmail + 1,
          rows: pageSizeUserListByEmail,
          companyId,
          token,
        }
      });

      setUserListByEmail(response.data)
      setRowUserListByEmail(response.data.length)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  // CustomerList AREA
  const LoadCustomerList = useCallback(async (state = '') => {
    try {

      const page = currentPageCustomerList + 1

      const response = await api.get<ICustomerListData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarTodosClientes', {
        params: {
          filter: filterType,
          page,
          rows: pageSizeCustomerList,
          token,
        }
      });

      setCustomerList(response.data)
      if (response.data.length > 0)
        setTotalRowsCustomerList(response.data[0].count)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }, [filterType, pageSizeCustomerList, currentPageCustomerList]);


  const ResetPassword = useCallback(async () => {
    try {
      const token = localStorage.getItem('@GoJur:token');

      await api.post('/CustomBCO_ID1/ConfiguracaoCliente/UsuarioResetarSenha', {
        companyId,
        userCompanyId,
        password: "123456",
        token
      })

      addToast({
        type: "success",
        title: "Senha Resetada",
        description: "A senha foi alterada com sucesso."
      })

      setUserCompanyId(0)
      setIsChangingPassWord(false)

    } catch (err) {
      setIsChangingPassWord(false)
      addToast({
        type: "error",
        title: "Falha ao resetar a senha.",
      })
    }
  }, [isChangingPassWord, userCompanyId, companyId]);


  // Pending Jobs Area
  const LoadPendingJobs = async (filter: String) => {

    try {
      const response = await api.get<ICustomerPendingData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarImportacoesPendentes', {
        params: {
          companyId,
          filter,
          token,
        }
      });

      setCustomerPendingJobsList(response.data)
      setTotalRowsPendingJobs(response.data.length)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  const LoadDashBoardMetrics = async (startDate: String, endDate: String) => {
    if (startDate == "" || endDate == "") {
      addToast({
        type: "error",
        title: "Data inválida.",
        description: "Por favor, insira uma data inicial e final."
      })

      return;
    }

    try {
      setIsLoading(true)
      const response = await api.get<DashBoardMetrics>('/InformacoesClientes/ListarDashBoardMetricas', {
        params: {
          startDate,
          endDate,
          token
        }
      });

      setChurn(response.data.churnValue)
      setChurnRate(response.data.churnRate)
      setChurnQty(response.data.churnQty)
      setSubscriptions(response.data.subscription)
      setSalesValue(response.data.salesValue)
      setSalesQty(response.data.salesQty)
      setConversionRate(response.data.conversionRate)

      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  const LoadPublications = useCallback(async () => {
    setIsLoading(true)
    let filterDatesCustom = "";
    const filterOptions = "";
    const nameFilterSearch = nameFilterValue;

    // filters variables
    const period = filterPeriod;
    const filterMulti = filterOptions;
    const term = filterTerm;
    const search = nameFilterSearch;

    const filters = `${period},${filterMulti},term_${term},${search},flg_Ativo='T'`

    try {

      if (changeDates) {
        filterDatesCustom = `${dtaCustomStart}|${dtaCustomEnd}`
      }

      const response = await api.post<PublicationData[]>(`/CustomBCO_ID1/ConfiguracaoCliente/ListarPublicacao`, {
        page: publiPageNumber + 1,
        rows: pageSizePublication,
        caller: 'webApplication',
        filters,
        publicationId: filterPublicationId,
        filterDateCustom: filterDatesCustom,
        companyId,
        token: localStorage.getItem('@GoJur:token')
      });

      console.log(response.data)

      // fill data values
      const newData = response.data.map(
        publications =>
          publications && {
            ...publications,
            openMenu: false,
            publicationSelected: 0,
          },
      );

      setTotalPublications(newData.length === 0 ? 0 : newData[0].totalRows)
      setPublication(newData)
      setIsLoading(false)
      setChangePage(false)
      setLoadingData(false)
      setChangeDates(false)
      setChangeFilter(false)
      filterDatesCustom = ''

    } catch (err) {
      setIsLoading(false)
      setLoadingData(false)
      setChangePage(false)
      setChangeDates(false)
      setChangeFilter(false)
      filterDatesCustom = ''
      console.log(err);
    }
  }, [publiPageNumber, pageSizePublication, filterPeriod, filterTerm, nameFilterValue, companyId, totalPublications, publication, dtaCustomStart, dtaCustomEnd, publiPageNumber, changeDates, changePage, changeFilter])


  // Resolve Push BIP BOP
  const ResolvePush = useCallback(async (matterId: Number) => {
    try {

      const response = await api.get('/CustomBCO_ID1/ConfiguracaoCliente/ResolverPushBipBop', {
        params: {
          companyId,
          matterTypeSearch: "tempMatter",
          matterNumber: matterId,
          token,
        }
      })

      if (response.data.Message == "Não foi possível encontrar um JOB para o processo informado") {

        addToast({
          type: "info",
          title: "Falha no reprocessamento.",
          description: 'Não foi possível resolver o Job relacionado a este processo.'
        })
        setIsLoading(false)


        await LoadPendingJobs("")

        return
      }

      addToast({
        type: "success",
        title: "Operação realizada com sucesso.",
        description: response.data.Message
      })

      setIsLoading(false)

      await LoadPendingJobs("")

    } catch (err: any) {
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha no reprocessamento.",
        description: err.response.data.Message
      })
    }
  }, [companyId]);


  // OPEN LINK BIP BOP
  const GetPush = useCallback(async (matterId: Number) => {
    try {

      const response = await api.get('/CustomBCO_ID1/ConfiguracaoCliente/ConsultaPushBipBop', {
        params: {
          companyId,
          matterTypeSearch: 0,
          matterNumber: matterId,
          token,
        }
      })

      if (response.data.Message == "Processo não localizado para este cliente") {

        addToast({
          type: "info",
          title: "Falha na consulta.",
          description: 'Processo não localizado para este cliente'
        })
        setIsLoading(false)
        return
      }

      let URL = response.data;

      // Verify if link has token
      // When has token is considerer a link for LegalData, so we need to encode Token to validate on LegalData API
      const hasToken = URL.split('token')
      if (hasToken.length == 2) {
        // Encode token to link
        URL = `${hasToken[0]}token=${encodeURIComponent(hasToken[1])}`
      }

      window.open(`${URL}`, '_blank');

      setIsLoading(false)

    } catch (err: any) {
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha na consulta.",
        description: err.response.data.Message
      })
    }
  }, [companyId]);


  const CustomerInformation = useCallback(async () => {
    try {
      setIsLoading(true)
      const customerId = pathname.substr(24)

      const response = await api.get<ICustomerInformation>('/CustomBCO_ID1/ConfiguracaoCliente/InformaçoesCliente', {
        params: {
          customerId,
          token,
        }
      })

      setCompanyDescription(response.data.nom_Company)
      setcustomerCompanyTerm(response.data.nom_Company)
      setPlanDescription(response.data.des_Plan)
      setCustomerStatus(response.data.des_Status)
      setCompanyId(response.data.cod_Empresa)
      setCustomerCompanyValue(response.data.nom_Company)
      setTpo_StatusAcesso(response.data.tpo_StatusAcesso)
      setDta_Ativo(response.data.dta_Ativo)
      setDta_Teste(response.data.dta_Teste)
      setPlanReference(response.data.cod_PlanReference)
      setCustomerCompanyId(customerId)
      localStorage.setItem('@GoJur:customerId', customerId);
      setIsLoading(false)
      handleResetPublication()

      if (fromUserListByEmail == true) {
        setCustomerCaller("userList")
      }

      if(response.data.tpo_StatusAcesso == "TG" || planReference != "GOJURFR") {
        setShowTeste(true)
      }

      setChangeCompanyByUser(false)
      setFromUserListByEmail(false)
      setNom_Empresa("")

    } catch (err: any) {
      setChangeCompanyByUser(false)
      setFromUserListByEmail(false)
      setNom_Empresa("")
      setIsLoading(false)
      setCompanyId(0)
      setCustomerStatus("")
      handleResetPublication()
      addToast({
        type: "error",
        title: "Falha ao Receber Informações do Cliente.",
        description: err.response.data.Message
      })
    }
  }, [companyDescription, planDescription, customerStatus, companyId, customerCompanyId, isLoading, customerCompanyValue, pathname, fromUserListByEmail, nom_Empresa, changeCompanyByUser]);


  const CustomerByReferenceId = useCallback(async (referenceId: number) => {
    try {

      setIsLoading(true)

      const response = await api.get<ICustomerInformation>('/CustomBCO_ID1/ConfiguracaoCliente/ClientePorCodReferencia', {
        params: {
          referenceId,
          token,
        }
      })

      if (response.data.nom_Company != null) {
        setFromUserListByEmail(true)
        setNom_Empresa(response.data.nom_Company)
        setFilterByEmail("")
      }
      else {
        setIsLoading(false)
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: ` Não foi possivel acessar as informações deste Cliente, pois o mesmo não está vinculado com a base Administrativa, cliente n° ${referenceId}`
        })
      }

    } catch (err: any) {
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha ao Receber Informações do Cliente.",
        description: err.response.data.Message
      })
    }

  }, [customerCompanyTerm, fromUserListByEmailCompanyId]);


  const ReactivePlan = useCallback(async () => {
    try {
      const customerId = pathname.substr(24)
      setIsLoading(true)
      const response = await api.post('/CustomBCO_ID1/ConfiguracaoCliente/ClienteReativarPlano', {
        companyId,
        customerId,
        token,

      })

      if (response.data.Message == "O cliente possui parcelas pendentes") {
        addToast({
          type: "info",
          title: "Operação Não Realizada",
          description: "Não é possivel reativar o plano do cliente, pois existem parcela(s) em aberto."
        })

        setIsLoading(false)
        return
      }

      addToast({
        type: "success",
        title: "Operação Concluída",
        description: "O plano do cliente está ativo novamente."
      })

      setIsLoading(false)
      CustomerInformation();

    } catch (err: any) {
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha ao reativar plano do cliente.",
        description: err.response.data.Message
      })
    }
  }, [companyId]);


  const LoadPlans = async (stateValue?: string) => {

    if (isLoadingComboData) {
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize" ? planValue : planTerm
    if (stateValue == 'reset') {
      filter = ''
    }

    try {
      const response = await api.get<IPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarBCPlanos', {
        params: {
          filter,
          token,
        }

      });

      const listPlans: ISelectPlanData[] = []

      response.data.map(item => {
        return listPlans.push({
          id: item.cod_PlanoComercial,
          label: item.des_PlanoComercial,
          cod_PlanReference: item.cod_PlanReference
        })
      })

      setPlans(listPlans)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadResources = async (stateValue?: string) => {

    if (isLoadingComboData) {
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize" ? resourcesValue : resourcesTerm
    if (stateValue == 'reset') {
      filter = ''
    }

    try {
      const response = await api.get<IResourcesData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarBCRecursos', {
        params: {
          filter,
          token,
        }
      });

      const listResources: ISelectResourcesData[] = []

      response.data.map(item => {
        return listResources.push({
          id: item.cod_RecursoSistema,
          label: item.des_RecursoSistema,
          tpo_Recurso: item.tpo_Recurso,
          cod_ResourceReference: item.cod_ResourceReference
        })
      })

      setResources(listResources)
      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadCustomer = useCallback(async (stateValue?: string) => {
    if (isLoadingComboData) {
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize" ? customerCompanyValue : customerCompanyTerm
    if (stateValue == 'reset') {
      filter = ''
    }

    try {
      const response = await api.post<ICustomerData[]>('/Clientes/ListarCombo', {
        rows: 50,
        filterClause: filter,
        token,

      });

      const listCustomerCompany: ISelectData[] = []

      response.data.map(item => {
        if (item.cod_Referencia != null && item.cod_Referencia != "") {
          return listCustomerCompany.push({
            id: item.cod_Cliente,
            label: item.nom_Pessoa
          })
        }

      })

      if (fromUserListByEmail == true && nom_Empresa != "") {
        response.data.map(item => {
          if (String(fromUserListByEmailCompanyId) == item.cod_Referencia) {
            history.push(`/customer/configuration/${item.cod_Cliente}`)
            setUserList([])
            setFromUserListByEmailCompanyId("")
            setChangeCompanyByUser(true)
            setcustomerCompanyTerm("")
            setIsLoadingComboData(false)
          }
        })
      }

      setCustomerCompany(listCustomerCompany)
      setcustomerCompanyTerm("")
      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }, [customerCompany, customerCompanyId, customerCompanyTerm, customerCompanyValue, fromUserListByEmail, nom_Empresa, history, userList, fromUserListByEmailCompanyId, changeCompanyByUser]);


  const ModifyPlan = async (planId: string) => {
    try {
      setIsLoading(true)
      const response = await api.get<ICustomerPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarDadosPlano', {
        params: {
          planId,
          token,
        }
      });

      console.log(response.data)

      setAccountInformationList(response.data)
      setPlanId("")
      setPlanValue("")
      setChangePlan(false)
      setIsLoading(false)

    } catch (err: any) {
      setIsLoading(false)
      setChangePlan(false)
      setPlanId("")
      setPlanValue("")
      addToast({
        type: "error",
        title: "Falha ao modificar o plano do cliente.",
        description: err.response.data.Message
      })
      console.log(err)
    }
  }


  const savePlans = useCallback(async () => {
    try {

      setisSaving(true)
      const reponse = await api.post('/CustomBCO_ID1/ConfiguracaoCliente/SalvarPlano', {
        customerPlanList: accountInformationList,
        companyId,
        token
      })

      addToast({
        type: "success",
        title: "Plano Salvo",
        description: "O plano do cliente foi alterado no sistema."
      })
      setisSaving(false)
      setCustomerCaller("")

    } catch (err: any) {
      setisSaving(false)
      setCustomerCaller("")
      addToast({
        type: "error",
        title: "Falha ao alterar plano.",
        description: err.response.data.Message
      })
    }
  }, [accountInformationList, companyId]);


  const LiberateSevenDays = useCallback(async () => {
    try {
      const customerId = pathname.substr(24)
      setIsLoading(true)
      const response = await api.post('/CustomBCO_ID1/ConfiguracaoCliente/LiberarSeteDias', {
        companyId,
        customerId,
        userCheck,
        doubleCheck,
        token,

      })

      if (response.data == "LiberationConfirmation") {
        setIsLoading(false)
        setModalLiberationSevenDays(true)
        return
      }

      if (response.data.Message == "Prazo para liberação temporária acima do limite") {
        addToast({
          type: "info",
          title: "Operação não concluida",
          description: "Prazo para liberação temporária acima do limite."
        })
        setIsLoading(false)
        return
      }

      if (response.data.Message == "Data de suspensão não preenchida na empresa") {
        addToast({
          type: "info",
          title: "Operação não concluida",
          description: "Data de suspensão não preenchida na empresa."
        })
        setIsLoading(false)
        return
      }

      addToast({
        type: "success",
        title: "Operação Concluída",
        description: "O plano do cliente está ativo novamente."
      })

      setUserCheck("N")
      setIsLoading(false)
      setDoubleCheck(false)
      CustomerInformation();

    } catch (err: any) {
      setIsLoading(false)
      if (err.response.data.typeError.warning == "confirmation") {
        setErrorMessage(err.response.data.Message)
        setOpenConfirmModal(true)
      }
      else {
        addToast({
          type: "error",
          title: "Falha no reativamento do plano do cliente.",
          description: err.response.data.Message
        })
      }
    }
  }, [companyId, userCheck, doubleCheck, errorMessage]);


  const LoadSuspendedCustomers = async () => {
    try {
      const response = await api.get<BusinessInformation[]>('/InformacoesClientes/ListarSuspensoes', {
        params: {
          token,
        }
      });

      setTotalRowsSuspendedCustomersList(response.data.length)
      setSuspendedCustomersList(response.data)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  const LoadPaymentCustomers = async (month: string, year: string) => {
    setIsLoading(true)

    try {
      const response = await api.get<BusinessInformation[]>('/InformacoesClientes/ListarVendas', {
        params: {
          month,
          year,
          token,
        }
      });

      setTotalRowsPaymentCustomersList(response.data.length)
      setPaymentCustomersList(response.data)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  // CustomCell UserList
  const CustomCellUserList = (props) => {
    const { column } = props;

    if (column.title === 'Senha') {
      return (
        <Table.Cell onClick={(e) => handleClickResetPassword(props)} {...props}>
          <FaKey title="Clique para resetar a senha" />

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  // CustomCell UserList
  const CustomCellUserListByEmail = (props) => {
    const { column } = props;

    if (column.name === 'tpo_Usuario') {
      return (
        <Table.Cell {...props}>

          {(props.row.tpo_Usuario == "A" || props.row.tpo_Usuario == "P" || props.row.tpo_Usuario == null) && (
            <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 500 }}>ADMINISTRADOR</span>
          )}

          {props.row.tpo_Usuario == "S" && (
            <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 500 }}>SISTEMA</span>
          )}

          {props.row.tpo_Usuario == "C" && (
            <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 500 }}>CLIENTE</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'bntAcessar') {
      if (props.row.tpo_Usuario == "A" || props.row.tpo_Usuario == "S" || props.row.tpo_Usuario == "P" || props.row.tpo_Usuario == null)
        return (
          <Table.Cell onClick={(e) => handleClickAcessCompanyByUser(props)} {...props}>
            <FaPlus title="Clique para listar todos usuários" />

          </Table.Cell>
        );
    }

    return <Table.Cell {...props} />;
  };


  // CustomCell Pending Jobs
  const CustomCellCustomerPending = (props) => {

    const { column } = props;

    if (column.name === 'bntConsulta') {
      return (
        <Table.Cell onClick={(e) => handleClickGetPush(props)} {...props}>
          &nbsp;&nbsp;
          <BiSearchAlt title="Clique para consultar se este processo possuí um resultado válido para importação" />

        </Table.Cell>
      );
    }

    if (column.name === 'bntReprocessar') {
      return (
        <Table.Cell onClick={(e) => handleClickResolvePush(props)} {...props}>
          &nbsp;&nbsp;
          <IoReload title="Clique para reprocessar este JOB pendente (É preferível que se consulte antes, para verificar se o JOB encontra-se disponível e assim evitar um novo erro de importação)" />

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  // CustomCell Pending Jobs
  const CustomCellAccountInformation = (props) => {

    const { column } = props;

    if (column.name === 'bntExcluir' && props.row.tpo_ItemList == "RA") {
      return (
        <Table.Cell onClick={(e) => handleRemoveResource(props)} {...props}>
          &nbsp;&nbsp;
          <BiTrash title="Excluir recurso" />

        </Table.Cell>
      );
    }

    if (column.name === 'btnEditar' && props.row.tpo_ItemList == "PL") {
      return (
        <Table.Cell onClick={(e) => handleClickChangePlan(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Editar Plano" />

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  // CustomCell CustomerList
  const CustomCellCustomerList = (props) => {

    const { column } = props;

    if (column.name === 'customerId' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.customerId}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'peopleCompanyName' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.peopleCompanyName}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'lastAccessDate' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.lastAccessDate}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'matterQtty' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.matterQtty}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'matterCourtImportQtty' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.matterCourtImportQtty}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'robotPlanQtty' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.robotPlanQtty}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'robotOnQtty' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.robotOnQtty}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'customer_Plan' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.customer_Plan}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'cadastro' && props.row.customer_Plan != "PLANO FREE") {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 600, }}>{props.row.cadastro}</span>

        </Table.Cell>
      );
    }


    return <Table.Cell {...props} />;
  };


  const CustomCellPublication = (props) => {

    const { column } = props;

    if (column.name === 'matterNumber') {
      return (
        <Table.Cell {...props}>

          {(props.row.tpo_Status == "A") && (
            <span style={{ color: 'black', fontWeight: 500 }}>{props.row.matterNumber}</span>
          )}

          {(props.row.tpo_Status == "D") && (
            <span style={{ color: '#a0a0a0' }}>{props.row.matterNumber}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'customerName') {
      return (
        <Table.Cell {...props}>

          {(props.row.tpo_Status == "A") && (
            <span style={{ color: 'black', fontWeight: 500 }}>{props.row.customerName}</span>
          )}

          {(props.row.tpo_Status == "D") && (
            <span style={{ color: '#a0a0a0' }}>{props.row.customerName}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'publicationDate') {
      return (
        <Table.Cell {...props}>

          {(props.row.tpo_Status == "A") && (
            <div>
              <span style={{ color: 'black', fontWeight: 500 }}>{format(new Date(props.row.publicationDate), 'dd/MM/yyyy')}</span>
              <br />
              <span style={{ color: 'black', fontWeight: 500 }}>{format(new Date(props.row.clearanceDate), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          )}

          {(props.row.tpo_Status == "D") && (
            <div>
              <span style={{ color: '#a0a0a0' }}>{format(new Date(props.row.publicationDate), 'dd/MM/yyyy')}</span>
              <br />
              <span style={{ color: '#a0a0a0' }}>{format(new Date(props.row.clearanceDate), 'dd/MM/yyyy HH:mm')}</span>
            </div>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'releaseDate') {
      return (
        <Table.Cell {...props}>

          {(props.row.tpo_Status == "A") && (
            <span style={{ color: 'black', fontWeight: 500 }}>{format(new Date(props.row.releaseDate), 'dd/MM/yyyy')}</span>
          )}

          {(props.row.tpo_Status == "D") && (
            <span style={{ color: '#a0a0a0' }}>{format(new Date(props.row.releaseDate), 'dd/MM/yyyy')}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'description') {
      return (
        <Table.Cell {...props}>

          {String(props.row.description).length >= 200 && (props.row.openMenu == false) && (props.row.tpo_Status == "A") && (

            <span title={props.row.description} style={{ color: 'black', fontWeight: 500 }}>
              {String(props.row.description).substring(0, 199)}
              ...
              <div>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="button"
                  onClick={(e) => handleClickMessage(props)}
                  {...props}
                >
                  Ver Mais
                </button>
              </div>
            </span>

          )}

          {String(props.row.description).length >= 200 && (props.row.openMenu == false) && (props.row.tpo_Status == "D") && (

            <span title={props.row.description} style={{ color: '#a0a0a0' }}>
              {String(props.row.description).substring(0, 199)}
              ...
              <div>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="button"
                  onClick={(e) => handleClickMessage(props)}
                  {...props}
                >
                  Ver Mais
                </button>
              </div>
            </span>

          )}

          {String(props.row.description).length >= 200 && (props.row.openMenu == true) && (props.row.tpo_Status == "A") && (

            <span style={{ color: 'black', fontWeight: 500 }}>
              {props.row.description}
              <div>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="button"
                  onClick={(e) => handleClickMessage(props)}
                  {...props}
                >
                  Ver Menos
                </button>
              </div>
            </span>

          )}

          {String(props.row.description).length >= 200 && (props.row.openMenu == true) && (props.row.tpo_Status == "D") && (

            <span style={{ color: '#a0a0a0' }}>
              {props.row.description}
              <div>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="button"
                  onClick={(e) => handleClickMessage(props)}
                  {...props}
                >
                  Ver Menos
                </button>
              </div>
            </span>

          )}

          {String(props.row.description).length < 200 && (props.row.tpo_Status == "A") && (

            <span style={{ color: 'black', fontWeight: 500 }}>
              {props.row.description}
            </span>

          )}

          {String(props.row.description).length < 200 && (props.row.tpo_Status == "D") && (

            <span style={{ color: '#a0a0a0' }}>
              {props.row.description}
            </span>

          )}

        </Table.Cell>
      );
    }

    if (column.name === 'publicationId') {
      return (
        <Table.Cell {...props}>

          {(props.row.tpo_Status == "A") && (
            <span style={{ color: 'black', fontWeight: 500 }}>{props.row.publicationId}</span>
          )}

          {(props.row.tpo_Status == "D") && (
            <span style={{ color: '#a0a0a0' }}>{props.row.publicationId}</span>
          )}

          {props.row.hasLog && (
            <div>
              <button
                className="buttonLinkClick buttonInclude"
                type="button"
                onClick={() => handleLog(props.row.id)}
              >
                Visualizar Log
              </button>
            </div>
          )}

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  const CustomCellSuspendedCustomersList = (props) => {

    const { column } = props;


    if (column.name === 'customerName') {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 400, }}>{props.row.customerName}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'suspendedDate') {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 4400, }}>{format(new Date(props.row.suspendedDate), 'dd/MM/yyyy')}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'lastPendencyDate') {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 400, }}>{format(new Date(props.row.lastPendencyDate), 'dd/MM/yyyy')}</span>

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  const CustomCellPaymentCustomersList = (props) => {
    const { column } = props;

    if (column.name === 'customerName') {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 400, }}>{props.row.customerName}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'planValue') {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 400, }}>{FormatCurrency.format(Number(props.row.planValue))}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'paymentDate') {
      return (
        <Table.Cell {...props}>

          <span style={{ color: 'black', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: 400, }}>{format(new Date(props.row.paymentDate), 'dd/MM/yyyy')}</span>

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  // If CustomerCompany Change
  const handlCustomerSelected = (item) => {

    if (item) {
      setCustomerCompanyValue(item.label)
      setCustomerCompanyId(item.id)
      history.push(`/customer/configuration/${item.id}`)
      setCustomerCaller("")
    } else {
      setCustomerCompanyValue('')
      LoadCustomer('reset')
      setCustomerCompanyId('')
    }
  }


  const handleClickPublicationList = () => {
    setCustomerCaller("publication")
  }


  const handleClickCustomerXRay = () => {
    setCustomerCaller("xray")
  }


  const handleClickBusinessInformation = () => {
    setCustomerCaller("businessInformation")
  }


  const handleChangeFilterDate = (period: string) => {
    setFilterPeriod(period);
    setChangeFilter(true)
  }


  // UserList Handles
  const handleClickUserList = () => {
    setCustomerCaller("userList")
    setUserListByEmail([])
  }


  const handleClickResetPassword = (e) => {
    setModalResetPassword(true)
    setUserCompanyId(e.row.cod_SistemaUsuarioEmpresa)
  }


  const handleClickListAllUsersByEmail = () => {
    setCustomerCaller("allUserList")
  }


  const handleClickAcessCompanyByUser = (e) => {
    setFromUserListByEmailCompanyId(e.row.cod_Empresa)
    CustomerByReferenceId(e.row.cod_Empresa)
  }


  const handleCurrentPageAllUserList = (value) => {
    setCurrentPageUserListByEmail(value)
  }


  const handlePageSizeAllUserList = (value) => {
    setPageSizeUserListByEmail(value)
  }


  // PendingJobs Handles
  const handleClickUserPendingJobs = () => {
    setCustomerCaller("customerPendingJobs")
  }


  const handleClickGetPush = (e) => {
    setIsLoading(true)
    GetPush(e.row.matterNumber)
  }


  const handleClickResolvePush = (e) => {
    setIsLoading(true)
    ResolvePush(e.row.matterNumber)
  }


  // Robot Push Handles
  const handleOpenRobotModal = () => {
    setShowRobotModal(true)
  }


  const CloseRobotModal = () => {
    setShowRobotModal(false)
  }


  // CancelPlans Handles
  const handleCancelPlanRobotModal = () => {
    setCancelPlanModal(true)
  }


  const CloseCancelPlanModal = () => {
    CustomerInformation()
    setCustomerCaller("")
    setCancelPlanModal(false)
  }


  const handleClickCloseModal = () => {
    setCancelPlanModal(false)
  }


  // CustomerList Handles
  const handleClickCustomerList = () => {
    setCustomerCaller("customerList")
  }


  const handleCurrentPageCustomerList = (value) => {
    setCurrentPageCustomerList(value)
  }


  const handlePageSizeCustomerList = (value) => {
    setPageSizeCustomerList(value)
  }


  // Publication Handles
  const handleCurrentPagePublication = (value) => {
    setPublicPageNumber(value)
    setChangePage(true)
  }


  const handlePageSizePublication = (value) => {
    setPageSizPublication(value)
    setChangePage(true)
  }


  const ClosePublicationDateModal = () => {
    setShowPublicationDateModal(false)
  }


  const handleOpenPublicationDateModal = () => {
    setShowPublicationDateModal(true)
    setChangeDates(false)
  }


  const handleLog = async (id: number) => {
    setCurrentPublicationId(id)
    setShowLog(true)
  }


  const handleCloseLog = () => {
    setShowLog(false)
  }


  const handleResetPublication = () => {
    setPublication([])
    setTotalPublications(0)
    setPublicPageNumber(0)
    setPageSizPublication(20)
    setFilterPeriod("");
  }


  // CELL CLICK
  const handleClickMessage = (props) => {
    publication.map((item) => {
      if (item.id == props.row.id) {
        if (props.row.openMenu == false) {
          item.openMenu = true // eslint-disable-line no-param-reassign
        }
        else {
          item.openMenu = false // eslint-disable-line no-param-reassign
        }

        const newArrayPublication = [...publication]

        setPublication(newArrayPublication)
      }
    })
  }


  // Configure Plan Handles
  const handleClickChangePlan = (e) => {
    setModalChangePlan(true)
  }


  const handleClickCancelChangePlan = () => {
    setCustomerCaller("")
    setChangePlan(false)
  }


  const handleClickConfigurePlan = () => {
    setCustomerCaller("accountPlan")
  }


  const handlPlanSelected = (item) => {
    if (item) {
      setPlanValue(item.label)
      setPlanId(item.id)
      ModifyPlan(item.id)
      setCodReferencePlan(item.cod_PlanReference)
    } else {
      setPlanValue('')
      LoadPlans('reset')
      setPlanId('')
    }
  }


  const handlResourcesSelected = (item) => {
    if (item) {
      setResourcesValue(item.label)
      setResourcesId(item.id)
      setResourceTpo(item.tpo_Recurso)
      setCodReferenceResource(item.cod_ResourceReference)

    } else {
      setResourcesValue('')
      LoadResources('reset')
      setResourcesId('')
    }
  }

  const handleClickTeste = () => {
    setCustomerCaller("testInformation")
  }


  const addResource = useCallback(() => {
    if (resourcesId == "") {
      addToast({
        type: "info",
        title: "Operação não Realizada.",
        description: "É necessário selecionar algum recurso antes de adicionar ao plano"
      })

      return
    }

    if (Number(planQtd) < 0) {
      addToast({
        type: "info",
        title: "Operação não Realizada.",
        description: "A quantidade de recursos não pode ser negativa."
      })

      return
    }

    const isUnlimited = accountInformationList.findIndex((obj => obj.des_RecursoSistema == resourcesValue && obj.qtd_RecursoIncluso == "ILIMITADO"));
    // If planQtd = 0 , qtd_RecursoIncluso = ILIMITADO
    if (planQtd == "0") {
      const newList = accountInformationList.map(item =>
        item.des_RecursoSistema == resourcesValue
          ?
          {
            ...item,
            qtd_RecursoIncluso: "ILIMITADO"
          }
          : item
      );

      setAccountInformationList(newList)
    }

    // If Resource exist add only planQtd and qtd_RecursoIncluso is diferrent of ILIMITADO
    else if (Number(planQtd) > 0 && isUnlimited < 0) {
      const newList = accountInformationList.map(item =>
        item.des_RecursoSistema == resourcesValue
          ?
          {
            ...item,
            qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(planQtd))
          }
          : item
      );

      setAccountInformationList(newList)
    }

    // If Resource and qtd_RecursoIncluso is ILIMITADO
    else if (Number(planQtd) > 0 && isUnlimited > 0) {
      const newList = accountInformationList.map(item =>
        item.des_RecursoSistema == resourcesValue
          ?
          {
            ...item,
            qtd_RecursoIncluso: planQtd
          }
          : item
      );

      setAccountInformationList(newList)
    }

    // Search in list if Resource exist in List
    const objIndex = accountInformationList.findIndex((obj => obj.des_RecursoSistema == resourcesValue));

    // If Resources not in List, add new Resource in List
    if (objIndex <= 0) {
      if (planQtd == "0") {
        const resourceOjb = { cod_RecursoSistema: resourcesId, des_RecursoSistema: resourcesValue, tpo_ItemList: "RA", qtd_RecursoIncluso: "ILIMITADO", tpo_Recurso: resourceTpo, cod_ResourceReference: codReferenceResource, cod_PlanReference: codReferencePlan, flg_PermiteAdicional: null }
        setAccountInformationList(previousValues => [...previousValues, resourceOjb])
      }
      else {
        const resourceOjb = { cod_RecursoSistema: resourcesId, des_RecursoSistema: resourcesValue, tpo_ItemList: "RA", qtd_RecursoIncluso: planQtd, tpo_Recurso: resourceTpo, cod_ResourceReference: codReferenceResource, cod_PlanReference: codReferencePlan, flg_PermiteAdicional: null }
        setAccountInformationList(previousValues => [...previousValues, resourceOjb])
      }

    }

    setResourcesId("")
    setResourcesValue("")
    setPlanQtd("1")
  }, [planQtd, resourcesValue, resourcesId, accountInformationList, resourceTpo, codReferenceResource, codReferencePlan]);


  const handleRemoveResource = (accountPlan) => {
    const matterPlanListUpdate = accountInformationList.filter(item => item.des_RecursoSistema != accountPlan.row.des_RecursoSistema);
    setAccountInformationList(matterPlanListUpdate)
  }


  const ChangeMonth = (item) => {
    setMonth(item)
  }


  const ChangeYear = (item) => {
    setYear(item)
  }


  const handleNextPage = () => {
    // Lógica para avançar para a próxima página
    // setPageNumber(pageNumber + 1);
    // Adicione aqui a lógica para carregar os dados da próxima página, se necessário
    setPageNumber(2);
  };


  const handlePrevPage = () => {
    // Lógica para voltar para a página anterior
    // if (pageNumber > 1) {
    // setPageNumber(pageNumber - 1);
    // Adicione aqui a lógica para carregar os dados da página anterior, se necessário
    // }
    setPageNumber(1);
  };


  const handleClickPublicationClassification = () => {
    setCustomerCaller("publicationClassification")
  }


  const handleClickSendConfirmationEmail = useCallback(async () => {
    setCustomerCaller("sendCustomSubscriptionConfirmationEmail")
    const customerId = pathname.substr(24)

    try {
      const response = await api.post('/CustomBCO_ID1/CustomerEmail/EnviarEmail', {
        referenceId: customerId,
        token,
      })

      addToast({type: "success", title: "E-mail enviado com sucesso", description: "O e-mail de confirmação de assinatura foi enviado!"})
    }
    catch (err: any) {
      setIsLoading(false)
      addToast({type: "error", title: "Falha ao enviar o e-mail.", description: err.response.data.Message})
    }
  },[]);

  const ExtendTest = useCallback(async () => {
    try {
      const response = await api.post('/CustomBCO_ID1/ConfiguracaoCliente/ProrrogarTeste', {
        companyId,
        token,
      });

      addToast({
        type: "success",
        title: "Teste Prorrogado",
        description: "O período de teste foi prorrogado com sucesso.",
      });

      CustomerInformation();
      
    } catch (err: any) {
      setIsLoading(false);
      addToast({
        type: "error",
        title: "Falha ao prorrogar o teste.",
        description: err.response.data.Message,
      });
    }
  }, [companyId, token]);

  return (
    <Container>

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

      {isChangingPassWord && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Alterando senha ...
          </div>
        </>
      )}

      {modalChangePlan && (
        <ConfirmBoxModal
          title="Aviso Troca de Plano"
          caller="confirmChangePlan"
          message="Deseja realmente alterar o plano ?, ao selecionar outro plano, todos os recursos adicionais serão perdidos.Clique em Confirmar para seguir com a troca de plano ou Cancelar para fechar a janela."
        />
      )}

      {modalResetPassword && (
        <ConfirmBoxModal
          title="Aviso"
          caller="confirmChangePassword"
          message="Deseja realmente alterar a senha para o padrão 123456 ?. Clique em Confirmar para confirmar a troca da senha ou Cancelar para fechar a janela."
        />
      )}

      {modalLiberationSevenDays && (
        <ConfirmBoxModal
          title="Confirmar Liberação Temporária"
          caller="confirmLiberationSevenDays"
          message="Cliente já liberado, deseja fazer nova liberação ?. Clique em Confirmar para prosseguir com a liberação ou Cancelar para fechar a janela."
        />
      )}

      {openConfirmModal && (
        <ConfirmBoxModal
          caller="liberationByTerm"
          title="Liberação Temporária - Prazo"
          useCheckBoxConfirm
          message={`${errorMessage}`}
        />
      )}

      <HeaderPage />

      {(showRobotModal) && <OverlayCustomerConfiguration />}
      {(showRobotModal) && <CustomerRobotModalEdit callbackFunction={{ CloseRobotModal, companyId }} />}

      {(showCancelPlanModal) && <OverlayCustomerConfiguration />}
      {(showCancelPlanModal) && <CustomerCancelPlanModalEdit callbackFunction={{ CloseCancelPlanModal, companyId, pathname, handleClickCloseModal }} />}

      {(showPublicationDateModal) && <OverlayCustomerConfiguration />}
      {(showPublicationDateModal) && <PublicationDateModal callbackFunction={{ ClosePublicationDateModal, dtaCustomStart, setDtaCustomStart, dtaCustomEnd, setDtaCustomEnd, changeDates, setChangeDates, showCustomDates, setShowCustomDates }} />}

      {showLog && (
        <LogModal
          idRecord={currentPublicationId}
          handleCloseModalLog={handleCloseLog}
          logType="publicationLogByBC01"
          companyId={companyId}
        />
      )}

      <div style={{ display: "flex", fontSize: "16px" }}>
        <label htmlFor="accountInformationCompany" className='accountInformationCompany'>
          <b>EMPRESA: &nbsp;</b>
        </label>
        <AutoCompleteSelect className="selectCompany">
          <Select
            isSearchable
            isClearable
            value={customerCompany.filter(options => options.id == customerCompanyId)}
            onChange={handlCustomerSelected}
            onInputChange={(term) => setcustomerCompanyTerm(term)}
            placeholder=""
            styles={selectStyles}
            options={customerCompany}
          />
        </AutoCompleteSelect>

        <label htmlFor="accountInformation" className='accountInformation'>
          <b>COD. REFERÊNCIA: &nbsp;</b>
          {companyId}
        </label>

        <label htmlFor="accountInformation" className='accountInformation'>
          <b>STATUS: &nbsp;</b>
          {customerStatus}
        </label>
      </div>

      <Content>

        <header style={{ display: "flex" }}>
          {pageNumber == 1 && (
            <>
              {customerStatus != "CLIENTE CANCELADO" && customerStatus != "CANCELAMENTO PROGRAMADO" && customerStatus != "CLIENTE SUSPENSO" && customerStatus != "" && (
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="submit"
                    onClick={handleClickConfigurePlan}
                  >
                    {customerCaller == "accountPlan" && (
                      <>
                        <FaUserCog style={{ color: "orange" }} />
                        <span style={{ color: "orange" }}>Configurar Plano</span>
                      </>
                    )}

                    {customerCaller != "accountPlan" && (
                      <>
                        <FaUserCog />
                        Configurar Plano
                      </>
                    )}
                  </button>
                </div>
              )}

              {customerStatus != "CLIENTE ATIVO" && customerStatus != "" && (
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="submit"
                    onClick={() => ReactivePlan()}
                  >
                    <FaUserCheck />
                    Reativar Plano
                  </button>
                </div>
              )}

              {customerStatus != "CLIENTE CANCELADO" && customerStatus != "CANCELAMENTO PROGRAMADO" && customerStatus != "" && (
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="submit"
                    onClick={handleCancelPlanRobotModal}
                  >
                    <FaUserSlash />
                    Cancelar Plano
                  </button>
                </div>
              )}

              {customerStatus != "CLIENTE ATIVO" && customerStatus != "CANCELAMENTO PROGRAMADO" && customerStatus != "CLIENTE CANCELADO" && customerStatus != "" && (
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="submit"
                    onClick={() => LiberateSevenDays()}
                  >
                    <BiTime />
                    Liberação Temporária
                  </button>
                </div>
              )}

              {customerStatus != "" && (
                <>
                  <div className='headerButtons'>
                    <button
                      className="buttonLinkClick buttonInclude"
                      type="submit"
                      onClick={handleOpenRobotModal}
                    >
                      <FiSearch />
                      Consultar Robô
                    </button>
                  </div>

                  <div className='headerButtons'>
                    <button
                      className="buttonLinkClick buttonInclude"
                      type="submit"
                      onClick={handleClickUserPendingJobs}
                    >
                      {customerCaller == "customerPendingJobs" && (
                        <>
                          <FaFileAlt style={{ color: "orange" }} />
                          <span style={{ color: "orange" }}>Importações Pendentes</span>
                        </>
                      )}

                      {customerCaller != "customerPendingJobs" && (
                        <>
                          <FaFileAlt />
                          <span>Importações Pendentes</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className='headerButtons'>
                    <button
                      className="buttonLinkClick buttonInclude"
                      type="submit"
                      onClick={handleClickCustomerList}
                    >
                      {customerCaller == "customerList" && (
                        <>
                          <RiUserAddFill style={{ color: "orange" }} />
                          <span style={{ color: "orange" }}>Lista de Clientes</span>
                        </>
                      )}

                      {customerCaller != "customerList" && (
                        <>
                          <RiUserAddFill />
                          <span>Lista de Clientes</span>
                        </>
                      )}

                    </button>
                  </div>

                  <div className='headerButtons'>
                    <button
                      className="buttonLinkClick buttonInclude"
                      type="submit"
                      onClick={handleClickUserList}
                    >
                      {customerCaller == "userList" && (
                        <>
                          <FaUsers style={{ color: "orange" }} />
                          <span style={{ color: "orange" }}>Listar Usuários</span>
                        </>
                      )}

                      {customerCaller != "userList" && (
                        <>
                          <FaUsers />
                          <span>Listar Usuários</span>
                        </>
                      )}

                    </button>
                  </div>
                </>
              )}

              <div className='headerButtons'>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="submit"
                  onClick={handleClickPublicationList}
                >
                  {customerCaller == "publication" && (
                    <>
                      <RiNewspaperFill style={{ color: "orange" }} />
                      <span style={{ color: "orange" }}>Lista Publicação</span>
                    </>
                  )}

                  {customerCaller != "publication" && (
                    <>
                      <RiNewspaperFill />
                      <span>Lista Publicação</span>
                    </>
                  )}

                </button>
              </div>

            </>
          )}

          {pageNumber == 2 && (
            <>
              <div className='headerButtons'>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="submit"
                  onClick={handleClickCustomerXRay}
                >
                  {customerCaller == "xray" && (
                    <>
                      <RiAccountPinBoxLine style={{ color: "orange" }} />
                      <span style={{ color: "orange" }}>Raio-X</span>
                    </>
                  )}

                  {customerCaller != "xray" && (
                    <>
                      <RiAccountPinBoxLine />
                      <span>Raio-X</span>
                    </>
                  )}

                </button>
              </div>

              <div className='headerButtons'>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="submit"
                  onClick={handleClickBusinessInformation}
                >
                  {customerCaller == "businessInformation" && (
                    <>
                      <RiDashboardFill style={{ color: "orange" }} />
                      <span style={{ color: "orange" }}>Dashboard</span>
                    </>
                  )}

                  {customerCaller != "businessInformation" && (
                    <>
                      <RiDashboardFill />
                      <span>Dashboard</span>
                    </>
                  )}

                </button>
              </div>

              <div className='headerButtons'>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="submit"
                  onClick={handleClickPublicationClassification}
                >
                  {customerCaller == "publicationClassification" && (
                    <>
                      <RiNewspaperFill style={{ color: "orange" }} />
                      <span style={{ color: "orange" }}>Classificar Publicações</span>
                    </>
                  )}

                  {customerCaller != "publicationClassification" && (
                    <>
                      <RiNewspaperFill />
                      <span>Classificar Publicações</span>
                    </>
                  )}

                </button>
              </div>

              <div className='headerButtons'>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="submit"
                  onClick={handleClickSendConfirmationEmail}
                >
                  {customerCaller == "sendCustomSubscriptionConfirmationEmail" && (
                    <>
                      <SiMinutemailer style={{ color: "orange" }} />
                      <span style={{ color: "orange" }}>Enviar e-mail de confirmação de assinatura</span>
                    </>
                  )}

                  {customerCaller != "sendCustomSubscriptionConfirmationEmail" && (
                    <>
                      <SiMinutemailer />
                      <span>Enviar e-mail de confirmação de assinatura</span>
                    </>
                  )}

                </button>
              </div>

              {showTeste == true && (
                <div className='headerButtons'>
                <button
                  className="buttonLinkClick buttonInclude"
                  type="submit"
                  onClick={handleClickTeste}
                >
                  {customerCaller == "businessInformation" && (
                    <>
                      <FaBusinessTime style={{ color: "orange" }} />
                      <span style={{ color: "orange" }}>Periodo de Teste</span>
                    </>
                  )}

                  {customerCaller != "businessInformation" && (
                    <>
                      <FaBusinessTime />
                      <span>Periodo de Teste</span>
                    </>
                  )}

                </button>
              </div>
              )}

            </>
          )}

          <div style={{ flex: 1 }} /> {/* Espaço flexível para empurrar a seção de paginação para a direita */}

          <div className='headerButtons' style={{ width: '100px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="buttonLinkClick buttonInclude"
              type="submit"
              onClick={handlePrevPage}
              style={{ marginRight: '-5px' }}
            >
              <FaChevronLeft />
            </button>

            <div className='headerButtons' style={{ flex: 1, textAlign: 'center' }}>
              <span>{pageNumber}</span>
            </div>

            <button
              className="buttonLinkClick buttonInclude"
              type="submit"
              onClick={handleNextPage}
            >
              <FaChevronRight />
            </button>
          </div>

        </header>

        <Form>
          <section>
            {customerCaller == "accountPlan" && (
              <>

                <div style={{ display: "flex" }}>
                  {changePlan == true && (
                    <>
                      <p className='selectPlan'>Planos:</p>
                      <AutoCompleteSelect className="select" style={{ width: "300px" }}>
                        <Select
                          isSearchable
                          value={plans.filter(options => options.id == planId)}
                          onChange={handlPlanSelected}
                          onInputChange={(term) => setPlanTerm(term)}
                          isClearable
                          placeholder=""
                          isLoading={isLoadingComboData}
                          loadingMessage={loadingMessage}
                          noOptionsMessage={noOptionsMessage}
                          styles={selectStyles}
                          options={plans}
                        />
                      </AutoCompleteSelect>
                    </>
                  )}

                  {changePlan == false && (
                    <>
                      <p className='selectResources'>Recursos:</p>
                      <AutoCompleteSelect className="select" style={{ width: "300px" }}>
                        <Select
                          isSearchable
                          value={resources.filter(options => options.id == resourcesId)}
                          onChange={handlResourcesSelected}
                          onInputChange={(term) => setResourcesTerm(term)}
                          isClearable
                          placeholder=""
                          isLoading={isLoadingComboData}
                          loadingMessage={loadingMessage}
                          noOptionsMessage={noOptionsMessage}
                          styles={selectStyles}
                          options={resources}
                        />
                      </AutoCompleteSelect>


                      <p className='qtdLabel'>Qtd:</p>
                      <label htmlFor="ResourceNumber" className='resourceNumber'>
                        <input
                          className='resourceNumberInput'
                          type="number"
                          name="ResourceNumber"
                          value={planQtd}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPlanQtd(e.target.value)}
                          autoComplete="off"
                        />
                      </label>

                      <MdHelp className='infoMessage' title="Utilize zero para ilimitado." />

                      <button
                        style={{ marginLeft: "20px" }}
                        className="buttonLinkClick buttonInclude"
                        type="button"
                        onClick={addResource}
                      >
                        Adicionar
                      </button>

                    </>
                  )}

                </div>

                <GridSubContainer>
                  <Grid
                    rows={accountInformationList}
                    columns={columnsCustomerPlans}
                  >
                    <PagingState
                      currentPage={currentPage}
                      pageSize={pageSize}
                      onCurrentPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                    />
                    <CustomPaging totalCount={totalRowsCustomerList} />
                    <Table
                      cellComponent={CustomCellAccountInformation}
                      columnExtensions={tableColumnExtensionsCustomerPlans}
                      messages={isLoading ? languageGridLoading : languageGridEmpty}
                    />
                    <TableHeaderRow />
                  </Grid>
                </GridSubContainer>

                <br />

                <div className='saveAndCancelDiv'>
                  <div style={{ float: 'left' }}>
                    <button
                      className="buttonClick"
                      type='button'
                      onClick={() => savePlans()}
                      style={{ width: '100px' }}
                    >
                      <FiSave />
                      Salvar
                    </button>
                  </div>

                  <div className='cancelButton'>
                    <button
                      type='button'
                      className="buttonClick"
                      onClick={() => handleClickCancelChangePlan()}
                      style={{ width: '100px' }}
                    >
                      <FaRegTimesCircle />
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            )}

            {customerCaller == "customerPendingJobs" && (
              <>
                <p>
                  Total de registros: &nbsp;
                  {totalRowsPendingJobs}
                </p>


                <label htmlFor="searchMatter">
                  <input type="text" style={{ display: "none" }} />
                  <Search
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) { e.preventDefault() }
                      if (e.key == 'Enter') { LoadPendingJobs(matterIdSearch); setIsLoading(true); }
                    }
                    }
                    placeholder='Pesquisar Nº de Processo'
                    className='searchMatter'
                    name='searchMatter'
                    value={matterIdSearch}
                    style={{ width: "100px", marginLeft: "0px" }}
                    onChange={(e) => setMatterIdSearch(e.target.value)}
                  />
                </label>

                <GridSubContainer>

                  <Grid
                    rows={customerPendingJobsList}
                    columns={columnsPendingJobs}
                  >
                    <SortingState
                      defaultSorting={[{ columnName: 'matterTempDate', direction: 'asc' }]}
                    />
                    <IntegratedSorting />
                    <PagingState
                      currentPage={currentPagePendingJobs}
                      pageSize={pageSize}
                      onCurrentPageChange={setCurrentPagePendingJobs}
                      onPageSizeChange={setPageSize}
                    />
                    <IntegratedPaging />
                    <CustomPaging totalCount={totalRowsPendingJobs} />

                    <Table
                      cellComponent={CustomCellCustomerPending}
                      columnExtensions={tableColumnExtensionsPendingJobs}
                      messages={languageGridEmpty}
                    />
                    <TableHeaderRow showSortingControls />
                    <PagingPanel
                      messages={languageGridPagination}
                    />
                  </Grid>

                </GridSubContainer>
              </>

            )}

            {customerCaller == "customerList" && (
              <>

                <div style={{ display: "flex" }}>
                  <span className='userListFilterLabel'>Filtrar Por:</span>
                  <label htmlFor="type">
                    <select
                      className='userListFilterSelect'
                      name="type"
                      value={filterType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                    >
                      <option value="01">Data do Último Acesso</option>
                      <option value="02">Empresa Crescente 0 - 9999</option>
                      <option value="03">Empresa Decrescente 9999 - 0</option>
                      <option value="04">Qtd Processos Crescente 0 - X</option>
                      <option value="05">Qtd Processos Decrescente X - 0</option>
                    </select>
                  </label>
                </div>

                <GridSubContainer>
                  <Grid
                    rows={customerList}
                    columns={columnsCustomerList}
                  >
                    <PagingState
                      currentPage={currentPageCustomerList}
                      pageSize={pageSizeCustomerList}
                      onCurrentPageChange={(e) => handleCurrentPageCustomerList(e)}
                      onPageSizeChange={(e) => handlePageSizeCustomerList(e)}
                    />
                    <CustomPaging totalCount={totalRowsCustomerList} />
                    <Table
                      cellComponent={CustomCellCustomerList}
                      columnExtensions={tableColumnExtensionsCustomerList}
                      messages={isLoading ? languageGridLoading : languageGridEmpty}
                    />
                    <TableHeaderRow />
                    <PagingPanel
                      messages={languageGridPagination}
                      pageSizes={pageSizes}
                    />
                  </Grid>
                </GridSubContainer>
              </>
            )}

            {customerCaller == "allUserList" && (
              <>

                <div style={{ display: "flex" }}>

                  <div style={{ marginLeft: "2px", marginTop: "15px", marginBottom: "auto", right: 0 }}>
                    <button
                      type='button'
                      className="buttonLinkClick buttonInclude"
                      onClick={() => handleClickUserList()}
                      style={{ width: '100px' }}
                    >
                      <FiArrowLeft />
                      Retornar
                    </button>
                  </div>

                </div>

                <GridSubContainer>
                  <Grid
                    rows={userListByEmail}
                    columns={columnsUsrListsByEmail}
                  >
                    <SortingState
                      defaultSorting={[{ columnName: 'flg_AtivoString', direction: 'asc' }]}
                    />

                    <IntegratedSorting />

                    <PagingState
                      currentPage={currentPageUserListByEmail}
                      pageSize={pageSizeUserListByEmail}
                      onCurrentPageChange={(e) => handleCurrentPageAllUserList(e)}
                      onPageSizeChange={(e) => handlePageSizeAllUserList(e)}
                    />
                    <CustomPaging totalCount={totalRowUserListByEmail} />
                    <Table
                      cellComponent={CustomCellUserListByEmail}
                      columnExtensions={tableColumnExtensionsUserListsByEmail}
                      messages={isLoading ? languageGridLoading : languageGridEmpty}
                    />
                    <TableHeaderRow />
                    <PagingPanel
                      messages={languageGridPagination}
                    />
                  </Grid>
                </GridSubContainer>
              </>

            )}

            {customerCaller == "userList" && (
              <>

                <div>
                  <label htmlFor="searchUsersByEmail">
                    <input type="text" style={{ display: "none" }} />
                    <Search
                      onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) { e.preventDefault() }
                        if (e.key == 'Enter') { LoadUserByEmail(); }
                      }
                      }
                      placeholder='Pesquise Usuário Pelo E-Mail'
                      className='searchUsersByEmail'
                      name='searchUsersByEmail'
                      value={filterByEmail}
                      style={{ width: "100px", marginLeft: "0px" }}
                      onChange={(e) => setFilterByEmail(e.target.value)}
                    />
                  </label>
                </div>

                <GridSubContainer>

                  <Grid
                    rows={userList}
                    columns={columnsUsrLists}
                  >
                    <SortingState
                      defaultSorting={[{ columnName: 'flg_Ativo', direction: 'asc' }]}
                    />
                    <IntegratedSorting />
                    <PagingState
                      currentPage={currentPageUserList}
                      pageSize={pageSize}
                      onCurrentPageChange={setCurrentPageUserList}
                      onPageSizeChange={setPageSize}
                    />
                    <IntegratedPaging />
                    <CustomPaging totalCount={totalRowsUserList} />

                    <Table
                      cellComponent={CustomCellUserList}
                      columnExtensions={tableColumnExtensionsUserLists}
                      messages={languageGridEmpty}
                    />
                    <TableHeaderRow showSortingControls />
                    <PagingPanel
                      messages={languageGridPagination}
                    />
                  </Grid>

                </GridSubContainer>
              </>

            )}

            {customerCaller == "publication" && (
              <>
                <div style={{ display: "flex" }}>
                  <label htmlFor="searchPublications">
                    <input type="text" style={{ display: "none" }} />
                    <Search
                      onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) { e.preventDefault() }
                        if (e.key == 'Enter') { LoadPublications(); }
                      }
                      }
                      placeholder='Pesquise Publicações'
                      className='searchPublications'
                      name='searchPublications'
                      value={filterTerm}
                      style={{ width: "100px", marginLeft: "0px" }}
                      onChange={(e) => setFilterTerm(e.target.value)}
                    />
                  </label>

                  <FcAbout style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "5px", width: "20px", height: "20px" }} id="tipMesssage" title="Pesquisa por advogado e texto da publicação" />
                </div>

                <div style={{ display: "flex", marginTop: "1%" }}>
                  <section id="week">
                    <button
                      type="button"
                      onClick={() => handleChangeFilterDate('1d')}
                      style={{ backgroundColor: `${filterPeriod}` === '1d' ? '#2C8ED6' : '#f7f7f8', }}
                    >Hoje
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChangeFilterDate('7d')}
                      style={{
                        backgroundColor:
                          `${filterPeriod}` === '7d' ? '#2C8ED6' : '#f7f7f8',
                      }}
                    >7 Dias
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChangeFilterDate('30d')}
                      style={{ backgroundColor: `${filterPeriod}` === '30d' ? '#2C8ED6' : '#f7f7f8', }}
                    >30 Dias
                    </button>
                  </section>

                  <div style={{ marginLeft: "5px" }}>
                    <button
                      type='button'
                      className="buttonClick"
                      onClick={() => handleOpenPublicationDateModal()}
                      style={{ width: '150px' }}
                    >
                      Selecionar Periodo
                    </button>
                  </div>

                  <p style={{ marginTop: "auto", marginBottom: "auto" }}>
                    Total de Publicações: &nbsp;
                    {totalPublications}
                  </p>
                </div>

                <GridSubContainer>
                  <Grid
                    rows={publication}
                    columns={columnsPublication}
                  >
                    <PagingState
                      currentPage={publiPageNumber}
                      pageSize={pageSizePublication}
                      onCurrentPageChange={(e) => handleCurrentPagePublication(e)}
                      onPageSizeChange={(e) => handlePageSizePublication(e)}
                    />
                    <CustomPaging totalCount={totalPublications} />
                    <Table
                      cellComponent={CustomCellPublication}
                      columnExtensions={tableColumnExtensionsPublication}
                      messages={isLoading ? languageGridLoading : languageGridEmpty}
                    />
                    <TableHeaderRow />
                    <PagingPanel
                      messages={languageGridPagination}
                      pageSizes={pageSizes}
                    />
                  </Grid>
                </GridSubContainer>
              </>
            )}

            {customerCaller == "xray" && (
              <>
                <div id='RAIO-X' style={{ marginLeft: '15%', width: '100%' }}>
                  <div style={{ display: "flex", marginLeft: '7%' }}>
                    <span className='xRayLabel'>Período de </span>
                    &nbsp;&nbsp;
                    <label htmlFor="type">
                      <input
                        type="text"
                        placeholder='Nº de dias'
                        autoComplete="off"
                        value={xRayDays}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setXRayDays(e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        style={{ width: '80px', height: '30px', backgroundColor: '#EFEFEF' }}
                      />
                    </label>
                    &nbsp;&nbsp;
                    <button
                      className="buttonClick"
                      type='button'
                      onClick={() => LoadCustomerXRay(xRayDays)}
                      style={{ width: '50px', height: '30px' }}
                    >
                      Aplicar
                    </button>
                  </div>
                  <br /><br />

                  <div>
                    <div className='xRayDiv'><span className='xRayLabel'>Cliente: {companyName}</span></div>
                    <div className='xRayDiv'><span className='xRayLabel'>Dias Avaliados: {days}</span></div>
                    <br />
                    <div style={{ fontWeight: 600 }}><span className='xRayLabel'>OPERAÇÕES NO PERÍODO</span></div>
                    <br />
                    <div className='xRayDivTable'><span className='xRayLabel'>Navegação no sistema: {navigationTransactions}</span></div>
                    <div className='xRayDivTable'><span className='xRayLabel'>Média: {navigationTransactionsAverage}</span></div>
                    <br />
                    <div className='xRayDivTable'><span className='xRayLabel'>Processos e Andamentos: {matterTransactions}</span></div>
                    <div className='xRayDivTable'><span className='xRayLabel'>Média: {matterTransactionsAverage}</span></div>
                    <br />
                    <div className='xRayDivTable'><span className='xRayLabel'>Operações Publicações: {publicationTransactions}</span></div>
                    <div className='xRayDivTable'><span className='xRayLabel'>Média: {publicationTransactionsAverage}</span></div>
                    <br />
                    <div className='xRayDivTable'><span className='xRayLabel'>Operações na Agenda: {calendarTransactions}</span></div>
                    <div className='xRayDivTable'><span className='xRayLabel'>Média: {calendarTransactionsAverage}</span></div>
                    <br />
                    <div className='xRayDivTable'><span className='xRayLabel'>Total Arquivos: {filesQty}</span></div>
                    <div className='xRayDivTable'><span className='xRayLabel'>{filesMB}MB</span></div>
                    <br /><br />
                    <div className='xRayDiv'><span className='xRayLabel'>Processos Cadastrados: {matterQty}</span></div>
                    <div style={{ width: '300px', height: '25px', marginTop: '5px' }}><span className='xRayLabel'>Usuários Ativos: {users}</span></div>
                    <br /><br /><br /><br /><br /><br /><br />
                  </div>
                </div>
              </>
            )}

            {customerCaller == "businessInformation" && (
              <>
                <div style={{ display: 'flex', marginLeft: "10%" }}>

                  <label htmlFor="dataCancelamento">
                    Data Inicio
                    <input
                      type="date"
                      style={{ backgroundColor: "white" }}
                      value={startDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                    />
                  </label>

                  <label htmlFor="dataCancelamento" style={{ marginLeft: "2%" }}>
                    Data Final
                    <input
                      type="date"
                      style={{ backgroundColor: "white" }}
                      value={endDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                    />
                  </label>

                  <button
                    className="buttonClick"
                    type='button'
                    onClick={() => LoadDashBoardMetrics(startDate, endDate)}
                    style={{ width: '200px', height: '40px', marginTop: "2%", marginLeft: "2%" }}
                  >
                    Pesquisar
                  </button>
                </div>

                <div className='headerLabel' id='headerLabel'>
                  <div>
                    Dashboard
                  </div>
                </div>

                <div style={{ display: "flex", marginTop: "1%" }}>

                  <Box>
                    <span style={{ fontSize: "15px" }}>Assinaturas:</span>
                    <p style={{ fontSize: "20px" }}>{subscriptions}</p>
                  </Box>

                  <Box>
                    <span style={{ fontSize: "15px" }}>Vendas:</span>
                    <p style={{ fontSize: "20px" }}>{salesQty}</p>
                  </Box>

                  <Box>
                    <span style={{ fontSize: "15px" }}>Vendas R$:</span>
                    <p style={{ fontSize: "20px" }}>{FormatCurrency.format(Number(salesValue))}</p>
                  </Box>

                  <Box>
                    <span style={{ fontSize: "15px" }}>Taxa Conversão:</span>
                    <p style={{ fontSize: "20px" }}>{conversionRate} %</p>
                  </Box>

                </div>

                <div style={{ display: "flex", marginTop: "2%", marginLeft: "10%" }}>
                  <Box>
                    <span style={{ fontSize: "15px" }}>Cancelamentos:</span>
                    <p style={{ fontSize: "20px" }}>{churnQty}</p>
                  </Box>

                  <Box>
                    <span style={{ fontSize: "15px" }}>Taxa Cancelamento:</span>
                    <p style={{ fontSize: "20px" }}>{churnRate} %</p>
                  </Box>

                  <Box>
                    <span style={{ fontSize: "15px" }}>Cancelamento R$:</span>
                    <p style={{ fontSize: "20px" }}>{FormatCurrency.format(Number(churn))}</p>
                  </Box>

                </div>

                <div style={{ marginLeft: '23%', display: 'flex', marginTop: "2%" }}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={() => setCustomerCaller("suspendedCustomers")}
                    style={{ width: '200px', height: '40px' }}
                  >
                    Listar Suspensões
                  </button>

                  <button
                    className="buttonClick"
                    type='button'
                    onClick={() => setCustomerCaller("paymentCustomers")}
                    style={{ width: '200px', height: '40px' }}
                  >
                    Listar Vendas
                  </button>
                </div>
              </>
            )}

            {customerCaller == "suspendedCustomers" && (
              <>

                <button
                  className="buttonLinkClick buttonInclude"
                  title="Clique para voltar as informações do plano"
                  type="submit"
                  onClick={() => setCustomerCaller("businessInformation")}
                >
                  <AiOutlineArrowLeft />
                  <span>Retornar</span>
                </button>

                <div className='headerLabel' id='headerLabel'>
                  <div>
                    Suspensões
                  </div>
                </div>

                <div>
                  <GridSubContainer>

                    <Grid
                      rows={suspendedCustomersList}
                      columns={columnsCustomersSuspended}
                    >
                      <SortingState
                        defaultSorting={[{ columnName: 'suspendedDate', direction: 'desc' }]}
                      />
                      <IntegratedSorting />
                      <PagingState
                        currentPage={currentPageSuspendedCustomersList}
                        pageSize={pageSize}
                        onCurrentPageChange={setCurrentPageSuspendedCustomersList}
                        onPageSizeChange={setPageSize}
                      />
                      <IntegratedPaging />
                      <CustomPaging totalCount={totalRowsSuspendedCustomersList} />

                      <Table
                        cellComponent={CustomCellSuspendedCustomersList}
                        columnExtensions={tableColumnExtensionsCustomersSuspended}
                        messages={languageGridEmpty}
                      />
                      <TableHeaderRow showSortingControls />
                      <PagingPanel
                        messages={languageGridPagination}
                      />
                    </Grid>

                  </GridSubContainer>
                </div>
              </>
            )}

            {customerCaller == "paymentCustomers" && (
              <>
                <div style={{ display: 'flex' }}>
                  <button
                    className="buttonLinkClick buttonInclude"
                    title="Clique para voltar as informações do plano"
                    type="submit"
                    onClick={() => setCustomerCaller("businessInformation")}
                  >
                    <AiOutlineArrowLeft />
                    <span>Retornar</span>
                  </button>

                  <div style={{ float: 'right', width: '40%', marginLeft: '5px' }}>
                    <AutoCompleteSelect>
                      <Select
                        isSearchable
                        value={months.filter(options => options.id == (month ? month.toString() : ''))}
                        onChange={(item) => ChangeMonth(item ? item.id : '')}
                        options={months}
                        styles={selectStyles}
                      />
                    </AutoCompleteSelect>
                  </div>

                  <div style={{ float: 'left', width: '40%', marginLeft: '-5px' }}>
                    <AutoCompleteSelect>
                      <Select
                        isSearchable
                        value={financialYears.filter(options => options.id == (year ? year.toString() : ''))}
                        onChange={(item) => ChangeYear(item ? item.id : '')}
                        options={financialYears}
                        styles={selectStyles}
                      />
                    </AutoCompleteSelect>
                  </div>

                  <button
                    className="buttonClick"
                    type='button'
                    onClick={() => LoadPaymentCustomers(month, year)}
                    style={{ width: '200px', height: '40px', marginTop: "0.4%" }}
                  >
                    Pesquisar
                  </button>
                </div>

                <div className='headerLabel' id='headerLabel'>
                  <div>
                    Vendas
                  </div>
                </div>

                <div>
                  <GridSubContainer>

                    <Grid
                      rows={paymentCustomersList}
                      columns={columnsCustomersPayment}
                    >
                      <SortingState
                        defaultSorting={[{ columnName: 'suspendedDate', direction: 'desc' }]}
                      />
                      <IntegratedSorting />
                      <PagingState
                        currentPage={currentPagePaymentCustomersList}
                        pageSize={pageSize}
                        onCurrentPageChange={setCurrentPagePaymentCustomersList}
                        onPageSizeChange={setPageSize}
                      />
                      <IntegratedPaging />
                      <CustomPaging totalCount={totalRowsPaymentCustomersList} />

                      <Table
                        cellComponent={CustomCellPaymentCustomersList}
                        columnExtensions={tableColumnExtensionsCustomersPayment}
                        messages={languageGridEmpty}
                      />
                      <TableHeaderRow showSortingControls />
                      <PagingPanel
                        messages={languageGridPagination}
                      />
                    </Grid>

                  </GridSubContainer>
                </div>
              </>
            )}

            {customerCaller == "publicationClassification" && (
              <PublicationClassification />
            )}

            {customerCaller == "testInformation" && (
              <>
                <div className='headerLabel' id='headerLabel'>
                  <div>
                    Período de Teste
                  </div>
                </div>

                <br />

                <div id='teste' style={{ width: '100%' }}>

                  <div style={{ marginBottom: '10px', marginTop: '5%', display: 'flex', flexDirection: 'column' }}>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ width: '150px', fontSize: '16px', fontWeight: 'bold' }}>Data Criação:</label>
                      <span style={{ fontSize: '16px' }}>{dta_Ativo}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <label style={{ width: '150px', fontSize: '16px', fontWeight: 'bold' }}>Teste Válido Até:</label>
                      <span style={{ fontSize: '16px' }}>{dta_Teste}</span>
                    </div>

                  </div>

                  <div style={{ alignItems: 'center', display: 'flex', marginTop: '15%', marginLeft: '20%' }}>
                    <button
                      style={{ padding: '10px 20px', backgroundColor: 'var(--blue-twitter)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      onClick={ExtendTest}
                      className="buttonClick"
                      type='button'
                    >
                      Prorrogar Teste
                    </button>
                  </div>
                  
                </div>
              </>
            )}

          </section>
        </Form>

      </Content>

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Salvando plano ...
          </div>
        </>
      )}

    </Container>

  );
};

export default CustomerConfiguration;
