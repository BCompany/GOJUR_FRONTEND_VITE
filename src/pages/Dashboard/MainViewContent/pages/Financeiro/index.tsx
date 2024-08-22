/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-lonely-if */
/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState, useCallback} from 'react';
import api from 'services/api';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { GoDash, GoPlus } from 'react-icons/go';
import { FiTrash, FiEdit, FiX } from 'react-icons/fi';
import { FaRegTimesCircle, FaCheck, FaFileContract, FaFileInvoiceDollar, FaHandshake } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { envProvider } from 'services/hooks/useEnv';
import { useStateContext } from 'context/statesContext';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import { useAuth } from 'context/AuthContext';
import { useHeader } from 'context/headerContext';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Select from 'react-select';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, FormatDate, FormatCurrency, useDelay } from 'Shared/utils/commonFunctions';
import { months, financialYears } from 'Shared/utils/commonListValues';
import { languageGridEmpty,languageGridLoading, languageGridPagination } from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { format } from 'date-fns';
import { IFinancialTotal, IAccount, ISelectData, IFinancial, IFinancialDeal } from './Interfaces/IFinancial';
import FinancialDocumentModal from './DocumentModal';
import FinancialPaymentModal from './PaymentModal';
import DealDefaultModal from './Category/Modal/DealDefaultModal';
import FinanceOptionsMenu from 'components/MenuHamburguer/FinanceOptions';
import { Container, Content, GridContainerFinancial, ModalDeleteOptions, OverlayFinancial, HamburguerHeader, ModalMarkedPaid } from './styles';

const Financeiro: React.FC = () => {
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller} = useConfirmBox();
  const { isMenuOpen, handleIsMenuOpen, isOpenMenuDealDefaultCategory, handleIsOpenMenuDealDefaultCategory } = useMenuHamburguer();
  const baseUrl = envProvider.redirectUrl;
  const { handleJsonStateObject, handleStateType, jsonStateObject, stateType }  = useStateContext();
  const history = useHistory();
  const {captureText, captureType, handleLoadingData, handleCaptureText, handleCaptureType} = useHeader();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [account, setAccount] = useState<ISelectData[]>([]);
  const [accountId, setAccountId] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [accountTerm, setAccountTerm] = useState('');
  const [visualizeType, setVisualizeType] = useState('V');
  const [movementList, setMovementList] = useState<IFinancial[]>([]);
  const [dealList, setDealList] = useState<IFinancialDeal[]>([]);
  const [month, setMonth] = useState<string>(FormatDate(new Date(), 'MM'));
  const [year, setYear] = useState<string>(FormatDate(new Date(), 'yyyy'));
  const [movementId, setMovementId] = useState('');
  const [dealDetailId, setDealDetailId] = useState('');
  const [invoice, setInvoice] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState<boolean>(false);
  const [showDeleteDealOptions, setShowDeleteDealOptions] = useState<boolean>(false);
  const [showDeleteDealInstallmentOptions, setShowDeleteDealInstallmentOptions] = useState<boolean>(false);
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [loadByFilter, setLoadByFilter] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialize, setIsInitialize] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');
  const MDLFAT = localStorage.getItem('@GoJur:moduleCode');
  const [checkBillingContract, setCheckBillingContract] = useState<boolean>(false);
  const [parcelaAtual, setParcelaAtual] = useState('');
  const [isDeal, setIsDeal] = useState<boolean>(false);
  const [showValidateFinancialIntegration, setShowValidateFinancialIntegration] = useState<boolean>(false);
  const [showMarkedPaidModal, setShowMarkedPaidModal] = useState<boolean>(false);
  const [endMarkedPaid, setEndMarkedPaid] = useState<boolean>(false);
  const [countMarkedPaid, setCountMarkedPaid] = useState<number>(0);

  // GRID
  const [pageSizes] = useState([10, 20, 30, 50]);
  const [dateColumns] = useState(['date']);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (<DataTypeProvider formatterComponent={DateFormatter} {...props} />);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  // RESUME
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [totalExpectedDebit, setTotalExpectedDebit] = useState<number>(0);
  const [totalExpectedIncome, setTotalExpectedIncome] = useState<number>(0);
  const [totalOverdueIncome, setTotalOverdueIncome] = useState<number>(0);
  const [totalPaidDebit, setTotalPaidDebit] = useState<number>(0);
  const [totalPaidIncome, setTotalPaidIncome] = useState<number>(0);
  const [totalNetExpected, setTotalNetExpected] = useState<number>(0);
  const [totalNetPaid, setTotalNetPaid] = useState<number>(0);


  useEffect(() => {
    if(MDLFAT == 'MDLFAT#')
    {
      setCheckBillingContract(true)
    }
  }, [])

    
  useEffect(() => {
    if (isCancelMessage)
    {
      if(caller == "validateFinancialIntegration"){
        setShowValidateFinancialIntegration(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller])


  useEffect(() => {
    if(isConfirmMessage)
    {
      if (caller == "validateFinancialIntegration"){
        handleConfirmMessage(false)
        Delete(true, false)
      }
    }
  }, [isConfirmMessage, caller])


  useEffect(() => {
    Initialize()
  }, [])


  // LOAD ACCOUNT
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

      if (jsonStateObject.length > 0)
      {
        const jsonFilter = JSON.parse(jsonStateObject);
        setAccountId(jsonFilter.accountId)
      }
      else{
        setAccountId(response.data.cod_Conta)
      }

      setIsInitialize(false)
    } catch (err) {
      console.log(err);
    }
  },[isLoading])


  // LOAD DEALS BY PERIOD
  const LoadDealsByPeriod = async (parameters) => {
    try {
      setIsDeal(true);
      setVisualizeType("V");

      const response = await api.get<IFinancialDeal[]>('/Financeiro/ListarAcordos', { params: parameters });

      setDealList(response.data)
      setIsLoadingComboData(false)
      handleLoadingData(false)
      handleJsonStateObject('')
      setLoadByFilter(false)

      if (response.data.length > 0)
        setTotalCount(response.data[0].totalRecords)

      setIsLoading(false)
      LoadTotalByDeal()
    } catch (err) {
      console.log(err);
    }
  };


  // LOAD MOVIMENTS BY PERIOD
  const LoadMovementsByPeriod = useCallback(async () => {
    setIsDeal(false);

    // get parameters object JSON
    const parameters = CreateParameterList();

    if(captureType == "2")
    {
      LoadDealsByPeriod(parameters);
      return;
    }

    try {
      // get values by parameters
      const response = await api.get<IFinancial[]>('/Financeiro/ListarMovimentosPorPeriodo', { params: parameters });

      setMovementList(response.data)
      setIsLoadingComboData(false)
      handleLoadingData(false)
      handleJsonStateObject('')
      setLoadByFilter(false)

      if (response.data.length > 0)
        setTotalCount(response.data[0].totalRecords)

      setIsLoading(false)
      
      // get total
      LoadTotalByPeriod()
    } catch (err: any) {
      setIsLoading(false)
      handleLoadingData(false)
      console.log(err)
      if (err.response.data.statusCode == 1002){
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }
    }
  },[accountId, captureText, captureType, handleJsonStateObject, handleLoadingData, jsonStateObject, loadByFilter, month, pageSize, token, year, currentPage])


  // LOAD MOVIMENTS BY EXTRACT
  const LoadMovementsByExtract = useCallback(async () => {
    setIsDeal(false);

    // get parameters object JSON
    const parameters = CreateParameterList();

    if(captureType == "2")
    {
      LoadDealsByPeriod(parameters);
      return;
    }

    try {
      // get values by parameters
      const response = await api.get<IFinancial[]>('/Financeiro/ListarMovimentosPorExtrato', { params: parameters })

      setMovementList(response.data)
      setIsLoadingComboData(false)
      handleLoadingData(false)
      handleJsonStateObject('')

      if (response.data.length > 0)
        setTotalCount(response.data[0].totalRecords)

      setIsLoading(false)

      // get total
      LoadTotalByExtract()
    } catch (err) {
      setIsLoading(false)
      handleLoadingData(false)
      console.log(err);
    }
  },[accountId, captureText, captureType, handleJsonStateObject, handleLoadingData, jsonStateObject, loadByFilter, month, pageSize, token, year, currentPage])


  // LOAD TOTAL BY EXTRACT
  const LoadTotalByExtract = async () => {
    // get parameters object JSON
    const parameter = CreateParameterTotal()

    try {
      const response = await api.get<IFinancialTotal>('/Financeiro/ObterTotalPorExtrato', { params: parameter });

      setOpeningBalance(response.data.openingBalance);
      setTotalExpectedIncome(response.data.totalExpectedIncome);
      setTotalExpectedDebit(response.data.totalExpectedDebit);
      setTotalPaidIncome(response.data.totalPaidIncome);
      setTotalPaidDebit(response.data.totalPaidDebit);
      setTotalOverdueIncome(response.data.totalOverdueIncome);
      setLoadByFilter(false)

    } catch (err) {
      console.log(err);
    }
  };


  // LOAD TOTAL BY PERIOD
  const LoadTotalByPeriod = async () => {
    // Get parameters object JSON
    const parameter = CreateParameterTotal()

    try {
      const response = await api.get<IFinancialTotal>('/Financeiro/ObterTotalPorPeriodo', { params: parameter });

      setTotalExpectedIncome(response.data.totalExpectedIncome);
      setTotalExpectedDebit(response.data.totalExpectedDebit);
      setTotalPaidIncome(response.data.totalPaidIncome);
      setTotalPaidDebit(response.data.totalPaidDebit);
      setTotalOverdueIncome(response.data.totalOverdueIncome);
      setTotalNetExpected(response.data.totalNetExpected);
      setTotalNetPaid(response.data.totalNetPaid);
      setLoadByFilter(false)

      if (isInitialize)
        api.post('/Usuario/SalvarLogNavegacaoUsuario', {token, module: 'MEN_FINANCEIRO'});

    } catch (err) {
      console.log(err);
    }
  }


  // LOAD DEAK BY PERIOD
  const LoadTotalByDeal = async () => {
    // Get parameters object JSON
    const parameter = CreateParameterTotal()

    try {
      const response = await api.get<IFinancialTotal>('/Financeiro/ObterTotalPorAcordo', { params: parameter });

      setTotalExpectedIncome(response.data.totalExpectedIncome);
      setTotalExpectedDebit(response.data.totalExpectedDebit);
      setTotalPaidIncome(response.data.totalPaidIncome);
      setTotalPaidDebit(response.data.totalPaidDebit);
      setTotalOverdueIncome(response.data.totalOverdueIncome);
      setTotalNetExpected(response.data.totalNetExpected);
      setTotalNetPaid(response.data.totalNetPaid);
      setLoadByFilter(false)

      if (isInitialize)
        api.post('/Usuario/SalvarLogNavegacaoUsuario', {token, module: 'MEN_FINANCEIRO'});

    } catch (err) {
      console.log(err);
    }
  }


  // LOAD FINANCE BY VISUALIZE TYPE
  const LoadFinance = useCallback(async () => {
    if(visualizeType == 'V')
      await LoadMovementsByPeriod()
    else
      await LoadMovementsByExtract()
  },[visualizeType, isInitialize, isLoading])

  
  // FIRST LOAD - LOAD ACCOUNT AND ACCOUNT DEFAULT
  const Initialize= async() => {
    await LoadAccount()
    await LoadDefaultAccount();
  }


  // FIRST INITIALIZATION PAGE
  useEffect(() => {
    if (isLoading && !isInitialize)
      LoadFinance()
  }, [isInitialize, isLoading])


  // EXECUTE ONCE - WHEN OPEN COMPONENET
  useEffect(() => {
    if (isInitialize)
      Initialize();
  }, [LoadAccount, isInitialize])


  useDelay(() => {
    if (accountTerm.length > 0 && !isLoading)
      LoadAccount()
  }, [accountTerm], 750)


  // WHEN CHANGE VISUALIZATION TYPE SET PAGE TO ZERO AND RELOAD
  useEffect(() => {
    setCurrentPage(0)
    setIsLoading(true)
  }, [visualizeType])


  // WHEN CHANGE CAPTURE TYPE TYPE SET PAGE TO ZERO AND RELOAD
  useEffect(() => {
    setCurrentPage(0)
    setIsLoading(true)
  }, [captureType])


  // WHEN CHANGE CAPTURETEXT SET PAGE TO ZERO AND RELOAD
  useEffect(() => {
    setCurrentPage(0)
    setIsLoading(true)
  }, [captureText])


  // WHEN CALLBACK REDIRECT EDIT RETURN AND FLAG AS SAVE BUILD PARAMTER USING FILTER SAVED
  useEffect(() => {
    if (stateType == 'Inactive' && jsonStateObject.length > 0)
      handleLoadByFilter()
  }, [stateType, jsonStateObject])


  // HANDLE FILTER SAVED BY FILL STATE OF LAST PAGE
  const handleLoadByFilter = useCallback(async () => {
    const jsonFilter = JSON.parse(jsonStateObject);

    setMonth(jsonFilter.month)
    setYear(jsonFilter.year)
    setCurrentPage(jsonFilter.page)
    setPageSize(jsonFilter.pageSize)
    setVisualizeType(jsonFilter.visualizeType)
    setAccountId(jsonFilter.accountId)
    handleCaptureText(jsonFilter.searchFinancial)
    handleCaptureType(jsonFilter.searchMonths)
    setLoadByFilter(true)
    setIsLoading(true)
  }, [jsonStateObject, stateType])


  // BUILD PARAMETER FOR LIST USING OR NOT A FILTER SAVE
  const CreateParameterList = useCallback(() => {

    // build parameters by filter
    if (loadByFilter)  {
      const jsonFilter = JSON.parse(jsonStateObject);
      return  {
        token,
        accountId: jsonFilter.accountId,
        page: Number(jsonFilter.page) + 1,
        rows: Number(jsonFilter.pageSize),
        month: jsonFilter.month,
        year: jsonFilter.year,
        searchFinancial: jsonFilter.searchFinancial,
        searchMonths: Number(jsonFilter.searchMonths)
      }
    }

    // build parameter by user options - default
    return  {
      token,
      accountId,
      page: currentPage + 1,
      rows: pageSize,
      month,
      year,
      searchFinancial: captureText,
      searchMonths: Number(captureType)
    }

  },[accountId, captureText, captureType, jsonStateObject, loadByFilter, month, pageSize, token, year, currentPage])


  // BUILD PARAMETER FOR TOTAL USING OR NOT A FILTER SAVE
  const CreateParameterTotal = useCallback(() => {

    // build parameters by filter
    if (loadByFilter)  {
      const jsonFilter = JSON.parse(jsonStateObject);
      return  {
          token,
          accountId: jsonFilter.accountId,
          month: jsonFilter.month,
          year: jsonFilter.year,
          searchFinancial: jsonFilter.searchFinancial,
          searchMonths: Number(jsonFilter.searchMonths)
        }
    }

    // build parameter by user options - default
    return  {
        token,
        accountId,
        month,
        year,
        searchFinancial: captureText,
        searchMonths: Number(captureType)
      }

  },[accountId, captureText, captureType, jsonStateObject, loadByFilter, month, token, year, currentPage])


  const ReceitaOpen = useCallback(async () => {
    handleSaveState();
    history.push(`/financeiro/movement/R/account=${accountId}/id=0`)
  }, [accountId, year, month, captureText, captureType, visualizeType, currentPage, pageSize]);


  const DespesaOpen = useCallback(async () => {
    handleSaveState();
    history.push(`/financeiro/movement/D/account=${accountId}/id=0`)
  }, [accountId, year, month, captureText, captureType, visualizeType, currentPage, pageSize]);


  const NewDealOpen = useCallback(async () => {
    handleSaveState();
    history.push(`/financeiro/deal/account=${accountId}/installment=1/id=0`)
  }, [accountId, year, month, captureText, captureType, visualizeType, currentPage, pageSize]);


  const AddMonth = useCallback(async() => {
    setIsLoading(true)
    setCurrentPage(0)

    if(month == '12')
    {
      setMonth('01')
      const newYear = Number(year) + 1;
      setYear(newYear.toString())
    }
    else{
      const newMonth = Number(month) + 1;

      if(newMonth == 10 || newMonth == 11 || newMonth == 12){
        setMonth(newMonth.toString())
      }
      else{
        let value = '0';
        value += newMonth.toString()
        setMonth(value)
      }
    }
  },[month]);


  const DecreaseMonth = useCallback(async() => {
    setIsLoading(true)
    setCurrentPage(0)

    if(month == '01')
    {
      setMonth('12')
      const newYear = Number(year) - 1;
      setYear(newYear.toString())
    }
    else{

      const newMonth = Number(month) - 1;

      if(newMonth == 10 || newMonth == 11 || newMonth == 12){
        setMonth(newMonth.toString())
      }
      else{
        let value = '0';
        value += newMonth.toString()
        setMonth(value)
      }
    }
  },[month]);


  const ChangeMonth = (item) => {
    setIsLoading(true)
    setCurrentPage(0)
    setMonth(item)
  }


  const ChangeYear = (item) => {
    setIsLoading(true)
    setCurrentPage(0)
    setYear(item)
  }


  const handleAccountSelected = (item) => {
    if (item){
      setAccountValue(item.label)
      setAccountId(item.id)
      setCurrentPage(0)
      setIsLoading(true)
    }else{
      setAccountValue('')
      LoadAccount('reset')
      setCurrentPage(0)
      setAccountId('')
    }
  }


  const CustomCell = (props) => {
    const { column } = props;

    if (column.name === 'dta_Movimento') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.dta_Movimento} style={{fontSize:'12px'}}>
            {props.row.dta_Movimento}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'dta_Liquidacao') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.dta_Liquidacao} style={{fontSize:'12px'}}>
            {props.row.dta_Liquidacao}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'des_Movimento') {
      let cell = props.row.des_Movimento;

      if(props.row.des_Movimento.length > 100)
      {
        cell = `${props.row.des_Movimento.substring(0, 90)}...`
      }

      let title = props.row.des_Movimento;
      let matter = '';
      let people = '';

      if (props.row.qtd_Parcelamento > 1) {
        cell += ` - Parcela ${props.row.num_Parcela} / ${props.row.qtd_Parcelamento}`
        title += ` - Parcela ${props.row.num_Parcela} / ${props.row.qtd_Parcelamento}`
      }
      let separator = "";
      if (props.row.matterCustomerDesc != null) {
        matter += `${props.row.num_Processo} - ${props.row.matterCustomerDesc}`
        title += `${props.row.num_Processo} - ${props.row.matterCustomerDesc}`
        separator = " x ";
      }
      if (props.row.matterOpposingDesc != null) {
        matter += separator + props.row.matterOpposingDesc;
        title += separator + props.row.matterOpposingDesc;
      }

      if (props.row.userNames != null) {
        people += `${props.row.userNames}`
        title += `${props.row.userNames}`
      }

      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={title} style={{fontSize:'12px', height:'35px', marginTop:'-10px', width:'100%', textOverflow:'ellipsis', whiteSpace:'break-spaces', overflow:'hidden'}}>
            {cell}
          </div>
          <div title={matter + people} style={{fontSize:'12px', height:'25px'}}>
            {matter}
            {matter != '' && (<br />)}
            {people}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'nom_Categoria') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.nom_Categoria} style={{fontSize:'12px'}}>
            {props.row.nom_Categoria}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Movimento_Contabil') {
      if(props.row.tpo_Movimento == "R")
      {
        return (
          <Table.Cell onClick={(e) => (e)} {...props}>
            <div title={props.row.vlr_Movimento_Contabil} style={{fontSize:'12px', color:'green'}}>
              {props.row.vlr_Movimento_Contabil}
            </div>
          </Table.Cell>
        );
      }

      if(props.row.tpo_Movimento == "D")
      {
        return (
          <Table.Cell onClick={(e) => (e)} {...props}>
            <div title={props.row.vlr_Movimento_Contabil} style={{fontSize:'12px', color:'red'}}>
              {props.row.vlr_Movimento_Contabil}
            </div>
          </Table.Cell>
        );
      }
    }

    if (column.name === 'vlr_Liquidacao_Contabil') {
      if(props.row.tpo_Movimento == "R")
      {
        return (
          <Table.Cell onClick={(e) => (e)} {...props}>
            <div title={props.row.vlr_Liquidacao_Contabil} style={{fontSize:'12px', color:'green'}}>
              {props.row.vlr_Liquidacao_Contabil}
            </div>
          </Table.Cell>
        );
      }

      if(props.row.tpo_Movimento == "D")
      {
        return (
          <Table.Cell onClick={(e) => (e)} {...props}>
            <div title={props.row.vlr_Liquidacao_Contabil} style={{fontSize:'12px', color:'red'}}>
              {props.row.vlr_Liquidacao_Contabil}
            </div>
          </Table.Cell>
        );
      }
    }

    if (column.name === 'paid') {
      if(Number(props.row.vlr_Liquidacao) == 0)
      {
        return (
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            <div>
              <RiMoneyDollarBoxFill style={{height:'30px', width:'25px'}} title="Clique aqui para realizar o pagamento." />
            </div>
          </Table.Cell>
        );
      }

      if(Number(props.row.vlr_Liquidacao) >= Number(props.row.vlr_Movimento))
      {
        return (
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            <div>
              <RiMoneyDollarBoxFill style={{color:'#48C71F', height:'30px', width:'25px'}} title="Pagamento efetuado. Clique aqui para editar." />
            </div>
          </Table.Cell>
        );
      }

      if(Number(props.row.vlr_Liquidacao) != Number(props.row.vlr_Movimento))
      {
        return (
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            <div>
              <RiMoneyDollarBoxFill style={{color:'#E9ED00', height:'30px', width:'25px'}} title="Clique aqui para completar o pagamento." />
            </div>
          </Table.Cell>
        );
      }
    }

    if (column.name === 'edit') {
      if(props.row.cod_AcordoDetalhe == null)
      {
        return (
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            <FiEdit title="Alterar movimento " />
          </Table.Cell>
        );
      }

      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FaHandshake title="Alterar acordo " />
        </Table.Cell>
      );
    }

    if (column.name === 'document') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <CgFileDocument title="Gerar documento " />
        </Table.Cell>
      );
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiTrash title="Excluir movimento" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }


  const handleSaveState = () => {
    // set type filter
    handleStateType('Finance')

    const dataState = {
      token,
      month,
      year,
      accountId,
      visualizeType,
      page:currentPage,
      pageSize,
      searchFinancial:captureText,
      searchMonths:Number(captureType)
    }

    // save object filter
    handleJsonStateObject(JSON.stringify(dataState))
  }


  const handleClick = useCallback(async (props: any) => {
    setMovementId(props.row.cod_Movimento)
    setDealDetailId(props.row.cod_AcordoDetalhe)
    setInvoice(props.row.cod_FaturaParcela)

    if (props.column.name === 'paid'){
      setShowPaymentModal(true)
    }

    if (props.column.name === 'edit'){
      handleSaveState();

      if(props.row.cod_AcordoDetalhe == null)
      {
        history.push(`/financeiro/movement/${props.row.tpo_Movimento}/account=${accountId}/id=${props.row.cod_Movimento}`);
      }
      else
      {
        history.push(`/financeiro/deal/account=${accountId}/installment=${props.row.num_Parcela}/id=${props.row.cod_AcordoDetalhe}`);
      }
    }

    if (props.column.name === 'document'){
      setShowDocumentModal(true)
    }

    if (props.column.name === 'remove'){
      CheckDeleteType(props.row.cod_Movimento, props.row.qtd_Parcelamento, props.row.cod_AcordoDetalhe, props.row.num_Parcela)
    }
  }, [accountId, year, month, captureText, captureType, visualizeType, currentPage, pageSize]);


  const CheckDeleteType = (id, qtd, dealDetailId, numParcela) => {
    setMovementId(id);
    setDealDetailId(dealDetailId);
    setParcelaAtual(numParcela);

    if (dealDetailId > 0)
    {
      if (qtd > 1)
      {
        setShowDeleteDealInstallmentOptions(true);
      }
      else{
        setShowDeleteDealOptions(true);
      }  
    }
    else
    {
      if (qtd > 1)
      {
        setShowDeleteOptions(true)
      }
      else{
        setShowConfirmDelete(true)
      }  
    }
  }


  const ClosePaymentModal = async () => {
    setMovementId('')
    setInvoice('')
    setShowPaymentModal(false)
    setIsLoading(true)
  }


  const CloseDocumentModal = () => {
    setMovementId('')
    setShowDocumentModal(false)
  }


  const Delete = useCallback(async (deleteAll: boolean, validateFinancialIntegration: boolean) => {
    try {
      setIsDeleting(true)

      const response = await api.delete<IFinancialTotal>('/Financeiro/Deletar', {
        params:{
          token,
          id: movementId,
          deleteAll,
          validateFinancialIntegration
        }
      });

      setMovementId('')
      setDealDetailId('')
      setShowDeleteOptions(false)
      setShowDeleteDealOptions(false)
      setShowConfirmDelete(false)
      setIsLoading(true)
      setIsDeleting(false)
      setShowValidateFinancialIntegration(false)
    } 
    catch (err:any) {
      setShowDeleteOptions(false)
      setShowDeleteDealOptions(false)
      setShowConfirmDelete(false)
      
      if (err.response.data.typeError.warning == "awareness"){
        setShowValidateFinancialIntegration(true)
      }
      else{
        console.log(err.response.data);
      }
    }
  }, [movementId, token]);


  const DeleteDeal = useCallback(async () => {
    try
    {
      setIsDeleting(true);

      const response = await api.delete<IFinancialTotal>('/Acordo/ApagarAcordoPorMovimento', {
        params:{ dealDetailId, movementId, token }
      });

      setMovementId('')
      setDealDetailId('')
      setShowDeleteOptions(false)
      setShowDeleteDealOptions(false)
      setShowConfirmDelete(false)
      setIsLoading(true)
      setIsDeleting(false)
      setShowDeleteDealInstallmentOptions(false)
    }
    catch (err)
    {
      setShowDeleteOptions(false)
      setShowDeleteDealOptions(false)
      setShowConfirmDelete(false)
      console.log(err);
    }
  }, [movementId, dealDetailId, token]);


  const columnsPeriod = [
    { name: 'dta_Movimento',           title: 'Vencimento'},
    { name: 'des_Movimento',           title: 'Descrição'},
    { name: 'nom_Categoria',           title: 'Categoria'},
    { name: 'vlr_Movimento_Contabil',  title: 'Valor R$'},
    { name: 'vlr_Liquidacao_Contabil', title: 'Pago/Recebido R$'},
    { name: 'paid',                    title: ' '},
    { name: 'edit',                    title: ' '},
    { name: 'document',                title: ' '},
    { name: 'remove',                  title: ' '}
  ];


  const [tableColumnExtensionsPeriod] = useState([
    { columnName: 'dta_Movimento',           width: '12%' },
    { columnName: 'des_Movimento',           width: '33%' },
    { columnName: 'nom_Categoria',           width: '15%' },
    { columnName: 'vlr_Movimento_Contabil',  width: '10%' },
    { columnName: 'vlr_Liquidacao_Contabil', width: '10%' },
    { columnName: 'paid',                    width: '5%' },
    { columnName: 'edit',                    width: '5%' },
    { columnName: 'document',                width: '5%' },
    { columnName: 'remove',                  width: '5%' },
  ]);


  const columnsExtract = [
    { name: 'dta_Liquidacao',          title: 'Data'},
    { name: 'des_Movimento',           title: 'Descrição'},
    { name: 'nom_Categoria',           title: 'Categoria'},
    { name: 'vlr_Liquidacao_Contabil', title: 'Valor R$'},
    { name: 'paid',                    title: ' '},
    { name: 'edit',                    title: ' '},
    { name: 'document',                title: ' '},
    { name: 'remove',                  title: ' '}
  ];


  const [tableColumnExtensionsExtract] = useState([
    { columnName: 'dta_Liquidacao',          width: '12%' },
    { columnName: 'des_Movimento',           width: '35%' },
    { columnName: 'nom_Categoria',           width: '20%' },
    { columnName: 'vlr_Liquidacao_Contabil', width: '10%' },
    { columnName: 'paid',                    width: '5%' },
    { columnName: 'edit',                    width: '5%' },
    { columnName: 'document',                width: '5%' },
    { columnName: 'remove',                  width: '5%' },
  ]);


  const handleCurrentPage = (value) => {
    setIsLoading(true)
    setCurrentPage(value)
  }


  const handlePageSize = (value) => {
    setPageSize(value)
    setIsLoading(true)
  }


  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);


  const handleClickBillingContract = () => {
    handleRedirect(`/financeiro/billingcontract/list`)
  }


  const handleClickInvoicing = () => {
    handleRedirect(`/financeiro/billinginvoice/list`)
  }


  const DeleteOneInstallment = useCallback(async() => {
    try {
      setIsLoading(true);
      const response = await api.delete('/Acordo/ApagarAcordoPorMovimentoParcela', {
        params:{ dealDetailId, parcelaAtual, token }
      });

      setMovementId('')
      setDealDetailId('')
      setShowDeleteOptions(false)
      setShowDeleteDealOptions(false)
      setShowConfirmDelete(false)
      setIsDeleting(false)
      setShowDeleteDealInstallmentOptions(false)
      setIsLoading(true)
      setParcelaAtual('')
    } catch (err:any) {
      setIsLoading(false);
      setMovementId('')
      setDealDetailId('')
      setShowDeleteOptions(false)
      setShowDeleteDealOptions(false)
      setShowConfirmDelete(false)
      setIsLoading(true)
      setIsDeleting(false)
      setShowDeleteDealInstallmentOptions(false)
      setParcelaAtual('')
    }
  }, [dealDetailId, parcelaAtual]);


  const DealCell = (props) => {
    const { column } = props;

    if (column.name === 'dta_Movimento') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.dta_Movimento1} style={{fontSize:'12px', height:'30px'}}>{props.row.dta_Movimento1}</div><br />
          <div title={props.row.dta_Movimento2} style={{fontSize:'12px', height:'30px'}}>{props.row.dta_Movimento2}</div><br />
          <div title={props.row.dta_Movimento3} style={{fontSize:'12px', height:'30px'}}>{props.row.dta_Movimento3}</div>
        </Table.Cell>
      );
    }

    if (column.name === 'des_Movimento') {
      let cell1 = props.row.des_Movimento1;
      let title1 = props.row.des_Movimento1;
      if(props.row.des_Movimento1.length > 100)
        cell1 = `${props.row.des_Movimento1.substring(0, 90)}...`
      if (props.row.qtd_Parcelamento > 1) {
        cell1 += ` - Parcela ${props.row.num_Parcela1} / ${props.row.qtd_Parcelamento}`
        title1 += ` - Parcela ${props.row.num_Parcela1} / ${props.row.qtd_Parcelamento}`
      }

      let cell2 = props.row.des_Movimento2;
      let title2 = props.row.des_Movimento2;
      if(props.row.des_Movimento2.length > 100)
        cell2 = `${props.row.des_Movimento2.substring(0, 90)}...`
      if (props.row.qtd_Parcelamento > 1) {
        cell2 += ` - Parcela ${props.row.num_Parcela2} / ${props.row.qtd_Parcelamento}`
        title2 += ` - Parcela ${props.row.num_Parcela2} / ${props.row.qtd_Parcelamento}`
      }

      let cell3 = props.row.des_Movimento3;
      let title3 = props.row.des_Movimento3;
      if(props.row.des_Movimento3.length > 100)
        cell3 = `${props.row.des_Movimento3.substring(0, 90)}...`
      if (props.row.qtd_Parcelamento > 1) {
        cell3 += ` - Parcela ${props.row.num_Parcela3} / ${props.row.qtd_Parcelamento}`
        title3 += ` - Parcela ${props.row.num_Parcela3} / ${props.row.qtd_Parcelamento}`
      }

      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={title1} style={{fontSize:'12px', height:'35px', marginTop:'-10px', width:'100%', textOverflow:'ellipsis', whiteSpace:'break-spaces', overflow:'hidden'}}>{cell1}</div><br />
          <div title={title2} style={{fontSize:'12px', height:'35px', marginTop:'-10px', width:'100%', textOverflow:'ellipsis', whiteSpace:'break-spaces', overflow:'hidden'}}>{cell2}</div><br />
          <div title={title3} style={{fontSize:'12px', height:'35px', marginTop:'-10px', width:'100%', textOverflow:'ellipsis', whiteSpace:'break-spaces', overflow:'hidden'}}>{cell3}</div>
        </Table.Cell>
      );
    }

    if (column.name === 'nom_Categoria') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.nom_Categoria1} style={{fontSize:'12px', height:'30px'}}>{props.row.nom_Categoria1}</div><br />
          <div title={props.row.nom_Categoria2} style={{fontSize:'12px', height:'30px'}}>{props.row.nom_Categoria2}</div><br />
          <div title={props.row.nom_Categoria3} style={{fontSize:'12px', height:'30px'}}>{props.row.nom_Categoria3}</div>
        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Movimento_Contabil') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.vlr_MovimentoStr1} style={{fontSize:'12px', color:'green', height:'30px'}}>{props.row.vlr_MovimentoStr1}</div><br />
          <div title={props.row.vlr_MovimentoStr2} style={{fontSize:'12px', color:'green', height:'30px'}}>{props.row.vlr_MovimentoStr2}</div><br />
          <div title={props.row.vlr_MovimentoStr3} style={{fontSize:'12px', color:'red', height:'30px'}}>{props.row.vlr_MovimentoStr3}</div>
        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Liquidacao_Contabil') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.vlr_LiquidacaoStr1} style={{fontSize:'12px', color:'green', height:'30px'}}>{props.row.vlr_LiquidacaoStr1}</div><br />
          <div title={props.row.vlr_LiquidacaoStr2} style={{fontSize:'12px', color:'green', height:'30px'}}>{props.row.vlr_LiquidacaoStr2}</div><br />
          <div title={props.row.vlr_LiquidacaoStr3} style={{fontSize:'12px', color:'red', height:'30px'}}>{props.row.vlr_LiquidacaoStr3}</div>
        </Table.Cell>
      );
    }

    if (column.name === 'paid') {
      let color1 = '';
      let color2 = '';
      let color3 = '';

      let title1 = '';
      let title2 = '';
      let title3 = '';

      if(Number(props.row.vlr_Liquidacao1) != Number(props.row.vlr_Movimento1))
      {
        color1 = 'dealYellow';
        title1 = 'Clique aqui para completar o pagamento.';
      }
      if(Number(props.row.vlr_Liquidacao2) != Number(props.row.vlr_Movimento2))
      {
        color2 = 'dealYellow';
        title2 = 'Clique aqui para completar o pagamento.';
      }
      if(Number(props.row.vlr_Liquidacao3) != Number(props.row.vlr_Movimento3))
      {
        color3 = 'dealYellow';
        title3 = 'Clique aqui para completar o pagamento.';
      }

      if(Number(props.row.vlr_Liquidacao1) == 0)
      {
        color1 = 'dealBlue';
        title1 = 'Clique aqui para realizar o pagamento.';
      }
      if(Number(props.row.vlr_Liquidacao2) == 0)
      {
        color2 = 'dealBlue';
        title2 = 'Clique aqui para realizar o pagamento.';
      }
      if(Number(props.row.vlr_Liquidacao3) == 0)
      {
        color3 = 'dealBlue';
        title3 = 'Clique aqui para realizar o pagamento.';
      }

      if(Number(props.row.vlr_Liquidacao1) >= Number(props.row.vlr_Movimento1))
      {
        color1 = 'dealGreen';
        title1 = 'Pagamento efetuado. Clique aqui para editar.';
      }
      if(Number(props.row.vlr_Liquidacao2) >= Number(props.row.vlr_Movimento2))
      {
        color2 = 'dealGreen';
        title2 = 'Pagamento efetuado. Clique aqui para editar.';
      }
      if(Number(props.row.vlr_Liquidacao3) >= Number(props.row.vlr_Movimento3))
      {
        color3 = 'dealGreen';
        title3 = 'Pagamento efetuado. Clique aqui para editar.';
      }

      return (
        <Table.Cell {...props}>
          <div style={{marginTop:'-6px'}} onClick={(e) => handleDealGridClick(props, 1)}><RiMoneyDollarBoxFill className={color1} title={title1} /></div><br />
          <div onClick={(e) => handleDealGridClick(props, 2)}><RiMoneyDollarBoxFill className={color2} title={title2} /></div><br />
          <div onClick={(e) => handleDealGridClick(props, 3)}><RiMoneyDollarBoxFill className={color3} title={title3} /></div>
        </Table.Cell>
      );
    }

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => handleDealGridClick(props, 1)} {...props}>
          <div style={{height:'20px', marginTop:'15px'}}><FaHandshake className='dealButton' title="Alterar acordo" /></div><br />
          <div style={{height:'20px', marginTop:'8px'}}><FaHandshake className='dealButton' title="Alterar acordo" /></div><br />
          <div style={{height:'20px', marginTop:'10px'}}><FaHandshake className='dealButton' title="Alterar acordo" /></div><br />
        </Table.Cell>
      );
    }

    if (column.name === 'document') {
      return (
        <Table.Cell {...props}>
          <div onClick={(e) => handleDealGridClick(props, 1)} style={{marginTop:'-6px'}}><CgFileDocument className='dealButton' title="Gerar documento " /></div><br />
          <div onClick={(e) => handleDealGridClick(props, 1)}><CgFileDocument className='dealButton' title="Gerar documento " /></div><br />
          <div onClick={(e) => handleDealGridClick(props, 1)}><CgFileDocument className='dealButton' title="Gerar documento " /></div>
        </Table.Cell>
      );
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell {...props}>
          <div onClick={(e) => handleDealGridClick(props, 1)}><FiTrash title="Excluir movimento" /></div>
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }


  const handleDealGridClick = useCallback(async (props: any, row: number) => {
    if(row == 1)
    {
      setMovementId(props.row.cod_Movimento1)
      setDealDetailId(props.row.cod_AcordoDetalhe1)

      if (props.column.name === 'paid'){
        setShowPaymentModal(true)
      }
      if (props.column.name === 'document'){
        setShowDocumentModal(true)
      }
      if (props.column.name === 'edit'){
        handleSaveState();
        history.push(`/financeiro/deal/account=${accountId}/installment=${props.row.num_Parcela1}/id=${props.row.cod_AcordoDetalhe1}`);
      }
      if (props.column.name === 'remove'){
        CheckDeleteType(props.row.cod_Movimento1, props.row.qtd_Parcelamento, props.row.cod_AcordoDetalhe1, props.row.num_Parcela1)
      }
    }
    if(row == 2)
    {
      setMovementId(props.row.cod_Movimento2)
      setDealDetailId(props.row.cod_AcordoDetalhe2)

      if (props.column.name === 'paid'){
        setShowPaymentModal(true)
      }
      if (props.column.name === 'document'){
        setShowDocumentModal(true)
      }
      if (props.column.name === 'edit'){
        handleSaveState();
        history.push(`/financeiro/deal/account=${accountId}/installment=${props.row.num_Parcela2}/id=${props.row.cod_AcordoDetalhe2}`);
      }
      if (props.column.name === 'remove'){
        CheckDeleteType(props.row.cod_Movimento2, props.row.qtd_Parcelamento, props.row.cod_AcordoDetalhe2, props.row.num_Parcela2)
      }
    }
    if(row == 3)
    {
      setMovementId(props.row.cod_Movimento3)
      setDealDetailId(props.row.cod_AcordoDetalhe3)

      if (props.column.name === 'paid'){
        setShowPaymentModal(true)
      }
      if (props.column.name === 'document'){
        setShowDocumentModal(true)
      }
      if (props.column.name === 'edit'){
        handleSaveState();
        history.push(`/financeiro/deal/account=${accountId}/installment=${props.row.num_Parcela3}/id=${props.row.cod_AcordoDetalhe3}`);
      }
      if (props.column.name === 'remove'){
        CheckDeleteType(props.row.cod_Movimento3, props.row.qtd_Parcelamento, props.row.cod_AcordoDetalhe3, props.row.num_Parcela3)
      }
    }

  }, [accountId, year, month, captureText, captureType, visualizeType, currentPage, pageSize]);


  const handleMarkedPaid = async () => {
    setEndMarkedPaid(false)
    setCountMarkedPaid(0)
    setShowMarkedPaidModal(true)
    handleIsMenuOpen(false)
  };
  
  
  const ConfirmMarkedPaid = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const response = await api.post(`/BoletoBancario/RealizarBaixar`, {token: token});
     
      setEndMarkedPaid(true)
      setCountMarkedPaid(response.data)
    }
    catch (err) {
      addToast({type: 'error', title: 'Falha ao baixar os pagamentos', description: 'Não foi possivel realizar a baixa dos pagamentos'});
      setEndMarkedPaid(false)
      setCountMarkedPaid(0)
    }
  }, []);


  return (
    <Container>

      <HeaderPage />

      <HamburguerHeader>
        <div style={{float:'right'}} className='buttonHamburguer'>
          <button
            type="button"
            onClick={() => handleIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <ImMenu4 className='iconMenu' /> : <ImMenu3 className='iconMenu' />}
          </button>

          {isMenuOpen ? (
            <FinanceOptionsMenu callbackList={{
              handleMarkedPaid
            }} />
          ) : null}
        </div>
      </HamburguerHeader>

      {!isMOBILE &&(
        <Content>

          <div style={{height:'300px'}}>
            {/* ESQUERDA */}
            <div style={{float:'left', width:'33%', height:'280px', textAlign:'center'}}>
              <div style={{float:'left', width:'5%'}}><>&nbsp;</></div>
              <div style={{float:'left', width:'90%'}}>
                <span>
                  Selecionar período
                </span>
                <br />
                <div style={{float:'left', width:'10%', marginTop:'1px'}}>
                  <button
                    className="monthButton2"
                    title="Diminuir um mês"
                    type="submit"
                    onClick={DecreaseMonth}
                  >
                    &nbsp;&nbsp;
                    <GoDash />
                  </button>
                </div>

                <div style={{float:'left', width:'40%', marginLeft:'5px'}}>
                  <AutoCompleteSelect>
                    <Select
                      isSearchable
                      value={months.filter(options => options.id == (month? month.toString(): ''))}
                      onChange={(item) => ChangeMonth(item? item.id: '')}
                      options={months}
                      styles={selectStyles}
                    />
                  </AutoCompleteSelect>
                </div>

                <div style={{float:'left', width:'40%', marginLeft:'-5px'}}>
                  <AutoCompleteSelect>
                    <Select
                      isSearchable
                      value={financialYears.filter(options => options.id == (year? year.toString(): ''))}
                      onChange={(item) => ChangeYear(item? item.id: '')}
                      options={financialYears}
                      styles={selectStyles}
                    />
                  </AutoCompleteSelect>
                </div>

                <div style={{float:'left', width:'10%', marginTop:'1px'}}>
                  <button
                    className="monthButton2"
                    title="Aumentar um mês"
                    type="submit"
                    onClick={AddMonth}
                  >
                    &nbsp;&nbsp;
                    <GoPlus />
                  </button>
                </div>
              </div>
              <div style={{float:'left', width:'5%'}}><>&nbsp;</></div>

              <div id='addButtons'>
                <div style={{float:'left', marginTop:'180px', marginLeft:'-1%', width:"170%"}}>
                  <div style={{float:'left'}}>
                    <button
                      className="buttonLinkClick"
                      title="Clique para adicionar uma receita"
                      type="submit"
                      onClick={ReceitaOpen}
                      style={{width:'100px'}}
                    >
                      <GoPlus />
                      Receita
                    </button>
                  </div>

                  <div style={{float:'left'}}>
                    <button
                      className="buttonLinkClick"
                      title="Clique para adicionar uma despesa"
                      type="submit"
                      onClick={DespesaOpen}
                      style={{width:'100px'}}
                    >
                      <GoDash />
                      Despesa
                    </button>
                  </div>

                  <div style={{float:'left'}}>
                    <button
                      className="buttonLinkClick"
                      title="Clique para criar o acordo"
                      type="submit"
                      onClick={NewDealOpen}
                      style={{width:'110px'}}
                    >
                      <FaHandshake />
                      Acordo
                    </button>
                  </div>

                  {checkBillingContract && (
                    <div style={{float:'left', marginLeft:"10px"}}>
                      <button
                        className="buttonLinkClick"
                        title="Clique para listar os contratos"
                        type="submit"
                        onClick={handleClickBillingContract}
                      >
                        <FaFileContract />
                        Contratos
                      </button>
                    </div>
                  )}

                  {checkBillingContract && (
                    <div style={{float:'left', marginLeft:"30px"}}>
                      <button
                        className="buttonLinkClick"
                        title="Clique para listar os faturamentos"
                        type="submit"
                        onClick={handleClickInvoicing}
                      >
                        <FaFileInvoiceDollar />
                        Faturamento
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* CENTRO */}
            <div style={{float:'left', width:'33%', height:'200px', textAlign:'center'}}>
              <div>
                <span>
                  Visualização
                </span>
                <br />

                <div className='item2a'>
                  <div>
                    {visualizeType == 'V' && (
                      <>
                        <div className='visualizeButtons'>
                          <button
                            className="selectedButton"
                            type='button'
                            onClick={()=> setVisualizeType('V')}
                            style={{width:'130px'}}
                            disabled={isDeal}
                          >
                            Por Vencimento
                          </button>
                        </div>

                        <div className='visualizeButtons'>
                          <button
                            type='button'
                            className="buttonClick"
                            onClick={() => setVisualizeType('E')}
                            style={{width:'130px'}}
                            disabled={isDeal}
                          >
                            Extrato
                          </button>
                        </div>
                      </>
                    )}

                    {visualizeType == 'E' && (
                      <>
                        <div className='visualizeButtons'>
                          <button
                            className="buttonClick"
                            type='button'
                            onClick={()=> setVisualizeType('V')}
                            style={{width:'130px'}}
                            disabled={isDeal}
                          >
                            Por Vencimento
                          </button>
                        </div>

                        <div className='visualizeButtons'>
                          <button
                            type='button'
                            className="selectedButton"
                            onClick={() => setVisualizeType('E')}
                            style={{width:'130px'}}
                            disabled={isDeal}
                          >
                            Extrato
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* DIREITA */}
            <div style={{float:'left', width:'33%', height:'280px'}}>
              <div className='autoComplete'>
                <AutoCompleteSelect className="selectAccount">
                  <p style={{height:'27px'}}>Conta</p>
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

              {visualizeType == 'V' && (
                <div className='informTable'>
                  <table style={{width:'100%'}}>
                    <th colSpan={3} className='header'>Resumo</th>
                    <tr>
                      <td className='left'>&nbsp;</td>
                      <td className='rightBold'>Previsto</td>
                      <td className='rightBold'>Realizado</td>
                    </tr>
                    <tr>
                      <td className='leftGreen'>Receitas</td>
                      <td className='credit'>{FormatCurrency.format(totalExpectedIncome)}</td>
                      <td className='credit'>{FormatCurrency.format(totalPaidIncome)}</td>
                    </tr>
                    <tr>
                      <td className='leftRed'>Despesas</td>
                      <td className='debit'>{FormatCurrency.format(totalExpectedDebit)}</td>
                      <td className='debit'>{FormatCurrency.format(totalPaidDebit)}</td>
                    </tr>
                    <tr>
                      <td className='left'>&nbsp;</td>
                      <td className='right'>-----------</td>
                      <td className='right'>-----------</td>
                    </tr>
                    <tr>
                      <td className='left'>Resultado</td>
                      <td className='right'>{FormatCurrency.format(totalNetExpected)}</td>
                      <td className='right'>{FormatCurrency.format(totalNetPaid)}</td>
                    </tr>
                    <tr>
                      <td className='leftRed'>Receitas em atraso</td>
                      <td className='debit'>{FormatCurrency.format(totalOverdueIncome)}</td>
                      <td>&nbsp;</td>
                    </tr>
                  </table>
                </div>
              )}

              {visualizeType == 'E' && (
                <div className='informTable'>
                  <table style={{width:'100%'}}>
                    <th colSpan={2} className='header'>Resumo</th>
                    <tr>
                      <td className='left'>Saldo Inicial</td>
                      <td className={(openingBalance > 0 ? 'credit' : 'debit')}>{FormatCurrency.format(openingBalance)}</td>
                    </tr>
                    <tr>
                      <td className='leftGreen'>Recebido</td>
                      <td className='credit'>{FormatCurrency.format(totalPaidIncome)}</td>
                    </tr>
                    <tr>
                      <td className='leftRed'>Pago</td>
                      <td className='debit'>{FormatCurrency.format(totalPaidDebit)}</td>
                    </tr>
                    <tr>
                      <td className='left'>&nbsp;</td>
                      <td className='right'>-----------</td>
                    </tr>
                    <tr>
                      <td className='left'>Saldo Final</td>
                      <td className={(totalOverdueIncome > 0 ? 'credit' : 'debit')}>{FormatCurrency.format(totalOverdueIncome)}</td>
                    </tr>
                  </table>
                </div>
              )}

            </div>
          </div>

          {/* GRID VENCIMENTO */}
          {(visualizeType == 'V' && !isDeal) &&(
            <div style={{marginTop:'10px'}}>
              <GridContainerFinancial>
                <Grid
                  rows={movementList}
                  columns={columnsPeriod}
                >
                  <PagingState
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onCurrentPageChange={(e) => handleCurrentPage(e)}
                    onPageSizeChange={(e) => handlePageSize(e)}
                  />
                  <CustomPaging totalCount={totalCount} />
                  <DateTypeProvider for={dateColumns} />
                  <Table
                    cellComponent={CustomCell}
                    columnExtensions={tableColumnExtensionsPeriod}
                    messages={isLoading? languageGridLoading: languageGridEmpty}
                  />
                  <TableHeaderRow />
                  <PagingPanel
                    messages={languageGridPagination}
                    pageSizes={pageSizes}
                  />
                </Grid>
              </GridContainerFinancial>
            </div>
          )}

          {/* GRID EXTRATO */}
          {(visualizeType == 'E' && !isDeal) &&(
            <div style={{marginTop:'10px'}}>
              <GridContainerFinancial>
                <Grid
                  rows={movementList}
                  columns={columnsExtract}
                >
                  <PagingState
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onCurrentPageChange={(e) => handleCurrentPage(e)}
                    onPageSizeChange={(e) => handlePageSize(e)}
                  />
                  <CustomPaging totalCount={totalCount} />
                  <DateTypeProvider for={dateColumns} />
                  <Table
                    cellComponent={CustomCell}
                    columnExtensions={tableColumnExtensionsExtract}
                    messages={isLoading? languageGridLoading: languageGridEmpty}
                  />
                  <TableHeaderRow />
                  <PagingPanel
                    messages={languageGridPagination}
                    pageSizes={pageSizes}
                  />
                </Grid>
              </GridContainerFinancial>
            </div>
          )}

          {/* GRID ACORDOS */}
          {isDeal &&(
            <div style={{marginTop:'10px'}}>
              <GridContainerFinancial>
                <Grid rows={dealList} columns={columnsPeriod}>
                  <PagingState currentPage={currentPage} pageSize={pageSize} onCurrentPageChange={(e) => handleCurrentPage(e)} onPageSizeChange={(e) => handlePageSize(e)} />
                  <CustomPaging totalCount={totalCount} />
                  <DateTypeProvider for={dateColumns} />
                  <Table cellComponent={DealCell} columnExtensions={tableColumnExtensionsPeriod} messages={isLoading? languageGridLoading: languageGridEmpty} />
                  <TableHeaderRow />
                  <PagingPanel messages={languageGridPagination} pageSizes={pageSizes} />
                </Grid>
              </GridContainerFinancial>
            </div>
          )}
        </Content>
      )}

      {isMOBILE &&(
        <Content id='ContentMobile'>
          {visualizeType == 'V' && (
            <div style={{width:'300px'}}>
              <table style={{width:'100%'}}>
                <th colSpan={3} className='header'>Resumo</th>
                <tr>
                  <td className='left'>&nbsp;</td>
                  <td className='rightBold'>Previsto</td>
                  <td className='rightBold'>Realizado</td>
                </tr>
                <tr>
                  <td className='leftGreen'>Receitas</td>
                  <td className='credit'>{FormatCurrency.format(totalExpectedIncome)}</td>
                  <td className='credit'>{FormatCurrency.format(totalPaidIncome)}</td>
                </tr>
                <tr>
                  <td className='leftRed'>Despesas</td>
                  <td className='debit'>{FormatCurrency.format(totalExpectedDebit)}</td>
                  <td className='debit'>{FormatCurrency.format(totalPaidDebit)}</td>
                </tr>
                <tr>
                  <td className='left'>&nbsp;</td>
                  <td className='right'>-----------</td>
                  <td className='right'>-----------</td>
                </tr>
                <tr>
                  <td className='left'>Resultado</td>
                  <td className='right'>{FormatCurrency.format(totalNetExpected)}</td>
                  <td className='right'>{FormatCurrency.format(totalNetPaid)}</td>
                </tr>
                <tr>
                  <td className='leftRed'>Receitas em atraso</td>
                  <td className='debit'>{FormatCurrency.format(totalOverdueIncome)}</td>
                  <td>&nbsp;</td>
                </tr>
              </table>
            </div>
          )}

          {visualizeType == 'E' && (
            <div style={{width:'300px'}}>
              <table style={{width:'100%'}}>
                <th colSpan={2} className='header'>Resumo</th>
                <tr>
                  <td className='left'>Saldo Inicial</td>
                  <td className={(openingBalance > 0 ? 'credit' : 'debit')}>{FormatCurrency.format(openingBalance)}</td>
                </tr>
                <tr>
                  <td className='leftGreen'>Recebido</td>
                  <td className='credit'>{FormatCurrency.format(totalPaidIncome)}</td>
                </tr>
                <tr>
                  <td className='leftRed'>Pago</td>
                  <td className='debit'>{FormatCurrency.format(totalPaidDebit)}</td>
                </tr>
                <tr>
                  <td className='left'>&nbsp;</td>
                  <td className='right'>-----------</td>
                </tr>
                <tr>
                  <td className='left'>Saldo Final</td>
                  <td className={(totalOverdueIncome > 0 ? 'credit' : 'debit')}>{FormatCurrency.format(totalOverdueIncome)}</td>
                </tr>
              </table>
            </div>
          )}
          <br />

          <div style={{width:'300px'}}>
            <span>
              Visualização
            </span>
            <br />

            {visualizeType == 'V' && (
              <>
                <div style={{float:'left', width:'120px'}}>
                  <button
                    className="selectedButton"
                    type='button'
                    onClick={()=> setVisualizeType('V')}
                    style={{width:'100px'}}
                  >
                    Por Vencimento
                  </button>
                </div>

                <div style={{float:'left', width:'100px'}}>
                  <button
                    type='button'
                    className="buttonClick"
                    onClick={() => setVisualizeType('E')}
                    style={{width:'100px'}}
                  >
                    Extrato
                  </button>
                </div>
              </>
            )}

            {visualizeType == 'E' && (
              <>
                <div style={{float:'left', width:'120px'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> setVisualizeType('V')}
                    style={{width:'100px'}}
                  >
                    Por Vencimento
                  </button>
                </div>

                <div style={{float:'left', width:'100px'}}>
                  <button
                    type='button'
                    className="selectedButton"
                    onClick={() => setVisualizeType('E')}
                    style={{width:'100px'}}
                  >
                    Extrato
                  </button>
                </div>
              </>
            )}

          </div>
          <br /><br />

          <div style={{width:'300px'}}>
            <AutoCompleteSelect className="selectAccount">
              <p style={{height:'27px'}}>Conta</p>
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

          <div style={{width:'300px', marginLeft:'5px'}}>
            <span>
              Selecionar período
            </span>
            <br />
            <div style={{float:'left', width:'6%', marginTop:'-1px'}}>
              <button
                className="monthButton2"
                title="Diminuir um mês"
                type="submit"
                onClick={DecreaseMonth}
              >
                &nbsp;&nbsp;
                <GoDash />
              </button>
            </div>

            <div style={{float:'left', width:'35%', marginLeft:'25px'}}>
              <AutoCompleteSelect>
                <Select
                  isSearchable
                  value={months.filter(options => options.id == (month? month.toString(): ''))}
                  onChange={(item) => ChangeMonth(item? item.id: '')}
                  options={months}
                  styles={selectStyles}
                />
              </AutoCompleteSelect>
            </div>

            <div style={{float:'left', width:'35%', marginLeft:'-5px'}}>
              <AutoCompleteSelect>
                <Select
                  isSearchable
                  value={financialYears.filter(options => options.id == (year? year.toString(): ''))}
                  onChange={(item) => ChangeYear(item? item.id: '')}
                  options={financialYears}
                  styles={selectStyles}
                />
              </AutoCompleteSelect>
            </div>

            <div style={{float:'left', width:'6%', marginTop:'-1px'}}>
              <button
                className="monthButton2"
                title="Aumentar um mês"
                type="submit"
                onClick={AddMonth}
              >
                &nbsp;&nbsp;
                <GoPlus />
              </button>
            </div>
          </div>
          <br /><br /><br /><br /><br />

          <div style={{float:'left', marginLeft:'-20px'}}>
            <div style={{float:'left'}}>
              <button
                className="buttonLinkClick"
                title="Clique para incluir um modelo de documento"
                type="submit"
                onClick={ReceitaOpen}
                style={{width:'100px'}}
              >
                <GoPlus />
                Receita
              </button>
            </div>

            <div style={{float:'left'}}>
              <button
                className="buttonLinkClick"
                title="Clique para incluir um modelo de documento"
                type="submit"
                onClick={DespesaOpen}
              >
                <GoDash />
                Despesa
              </button>
            </div>

            <div style={{float:'left'}}>
              <button
                className="buttonLinkClick"
                title="Clique para criar o acordo"
                type="submit"
                onClick={NewDealOpen}
                style={{width:'110px'}}
              >
                <FaHandshake />
                Acordo
              </button>
            </div>

          </div>
          <br /><br />

          {/* GRID VENCIMENTO */}
          {(visualizeType == 'V' && !isDeal) &&(
            <div style={{width:'300px', overflowY:'auto'}}>
              <div id='GridMobile' style={{width:'1000px'}}>

                <GridContainerFinancial>
                  <Grid
                    rows={movementList}
                    columns={columnsPeriod}
                  >
                    <PagingState
                      currentPage={currentPage}
                      pageSize={pageSize}
                      onCurrentPageChange={(e) => handleCurrentPage(e)}
                      onPageSizeChange={(e) => handlePageSize(e)}
                    />
                    <CustomPaging totalCount={totalCount} />
                    <DateTypeProvider for={dateColumns} />
                    <Table
                      cellComponent={CustomCell}
                      columnExtensions={tableColumnExtensionsPeriod}
                      messages={isLoading? languageGridLoading: languageGridEmpty}
                    />
                    <TableHeaderRow />
                    <PagingPanel
                      messages={languageGridPagination}
                      pageSizes={pageSizes}
                    />
                  </Grid>
                </GridContainerFinancial>

              </div>
            </div>
          )}

          {/* GRID EXTRATO */}
          {(visualizeType == 'E' && !isDeal) &&(
            <div style={{width:'300px', overflowY:'auto'}}>
              <div style={{width:'1000px'}}>

                <GridContainerFinancial>
                  <Grid
                    rows={movementList}
                    columns={columnsExtract}
                  >
                    <PagingState
                      currentPage={currentPage}
                      pageSize={pageSize}
                      onCurrentPageChange={(e) => handleCurrentPage(e)}
                      onPageSizeChange={(e) => handlePageSize(e)}
                    />
                    <CustomPaging totalCount={totalCount} />
                    <DateTypeProvider for={dateColumns} />
                    <Table
                      cellComponent={CustomCell}
                      columnExtensions={tableColumnExtensionsExtract}
                      messages={isLoading? languageGridLoading: languageGridEmpty}
                    />
                    <TableHeaderRow />
                    <PagingPanel
                      messages={languageGridPagination}
                      pageSizes={pageSizes}
                    />
                  </Grid>
                </GridContainerFinancial>

              </div>
            </div>
          )}

          {isDeal &&(
            <div style={{width:'300px', overflowY:'auto'}}>
              <div style={{width:'1000px'}}>

                <GridContainerFinancial>
                  <Grid rows={dealList} columns={columnsPeriod}>
                    <PagingState currentPage={currentPage} pageSize={pageSize} onCurrentPageChange={(e) => handleCurrentPage(e)} onPageSizeChange={(e) => handlePageSize(e)} />
                    <CustomPaging totalCount={totalCount} />
                    <DateTypeProvider for={dateColumns} />
                    <Table cellComponent={DealCell} columnExtensions={tableColumnExtensionsPeriod} messages={isLoading? languageGridLoading: languageGridEmpty} />
                    <TableHeaderRow />
                    <PagingPanel messages={languageGridPagination} pageSizes={pageSizes} />
                  </Grid>
                </GridContainerFinancial>

              </div>
            </div>
          )}
        </Content>
      )}

      {showValidateFinancialIntegration && (
        <ConfirmBoxModal
          title="Integrador Financeiro"
          caller="validateFinancialIntegration"
          useCheckBoxConfirm
          message="Não existe um integrador financeiro para o boleto vinculado a este movimento. Ao confirmar, o movimento será excluído mas o boleto permanecera existente em seu banco."
        />
      )}

      {(showPaymentModal) && <OverlayFinancial /> }
      {(showPaymentModal) && <FinancialPaymentModal callbackFunction={{movementId, invoice, visualizeType, ClosePaymentModal, LoadMovementsByPeriod, LoadTotalByPeriod, LoadMovementsByExtract, LoadTotalByExtract }} /> }

      {(showDocumentModal) && <OverlayFinancial /> }
      {(showDocumentModal) && <FinancialDocumentModal callbackFunction={{movementId, CloseDocumentModal}} /> }

      {(showDeleteOptions) && <OverlayFinancial /> }
      {showDeleteOptions && (
        <ModalDeleteOptions>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowDeleteOptions(false); setMovementId('')}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Este movimento está parcelado, deseja excluir também as outras parcelas ?
            <br /><br /><br />
            <div style={{float:'right', marginRight:'22%', bottom:0}}>
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
                  onClick={() => {setShowDeleteOptions(false); setMovementId('')}}
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

      {(showDeleteDealOptions) && <OverlayFinancial /> }
      {showDeleteDealOptions && (
        <ModalDeleteOptions>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowDeleteDealOptions(false); setDealDetailId('')}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Este movimento foi gerado através de um acordo. Ao confirmar, também serão excluídos os demais lançamentos referentes ao acordo. Confirma a exclusão ?
            <br /><br />
            <div style={{float:'right', marginRight:'32%', bottom:0}}>
              <div style={{float:'left'}}>
                <button className="buttonClick" type='button' style={{width:'120px'}} onClick={()=> DeleteDeal()}>
                  <FaCheck />
                  Sim
                </button>
              </div>

              <div style={{float:'left', width:'100px'}}>
                <button type='button' className="buttonClick" style={{width:'100px'}} onClick={() => {setShowDeleteDealOptions(false); setDealDetailId('')}}>
                  <FaRegTimesCircle />
                  Cancelar
                </button>
              </div>
            </div>
          </div>

        </ModalDeleteOptions>
      )}

      {(showDeleteDealInstallmentOptions) && <OverlayFinancial /> }
      {showDeleteDealInstallmentOptions && (
        <ModalDeleteOptions>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowDeleteDealInstallmentOptions(false); setDealDetailId('')}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            O acordo foi parcelado, selecione uma das opções abaixo para excluir apenas esta parcela ou todas referente ao acordo.
            <br /><br />
            <div style={{float:'right', marginRight:'20%', bottom:0, marginTop:'-15px'}}>
              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> DeleteOneInstallment()}
                  style={{width:'120px'}}
                >
                  Excluir este
                </button>
              </div>

              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> DeleteDeal()}
                  style={{width:'120px'}}
                >
                  Excluir todos
                </button>
              </div>

              <div style={{float:'left', width:'100px'}}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => {setShowDeleteDealInstallmentOptions(false)}}
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
            <FiX onClick={(e) => {setShowConfirmDelete(false); setMovementId('')}} />
          </div>
          <div style={{marginLeft:'5%'}}>
            Confirma a Exclusão ?
            <br /><br /><br />
            <div style={{float:'right', marginRight:'32%', bottom:0}}>
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
                  onClick={() => {setShowConfirmDelete(false); setMovementId('')}}
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

      {showMarkedPaidModal && <OverlayFinancial /> }
      {showMarkedPaidModal && (
        <ModalMarkedPaid>
          <div className='menuSection'>
            <FiX onClick={(e) => {setShowMarkedPaidModal(false)}} />
          </div>

          {endMarkedPaid == true ? (
            <>
              <div style={{marginLeft:'5%'}}>
                <label>Foi realizada a baixa de {totalCount} pagamentos.</label>
              </div>
              <div style={{float:'left', width:'100px'}}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => {setShowMarkedPaidModal(false)}}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{marginLeft:'5%'}}>
                Realizar a baixa dos pagamentos ?
                <br /><br /><br />
                <div style={{float:'right', marginRight:'32%', bottom:0}}>
                  <div style={{float:'left'}}>
                    <button
                      className="buttonClick"
                      type='button'
                      onClick={()=> ConfirmMarkedPaid()}
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
                      onClick={() => {setShowMarkedPaidModal(false)}}
                      style={{width:'100px'}}
                    >
                      <FaRegTimesCircle />
                      Não
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          

        </ModalMarkedPaid>
      )}

      {(isLoading || isDeleting) && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            {' '}
            {isDeleting? 'Removendo...': 'Aguarde...'}
          </div>
        </>
      )}

      {(isOpenMenuDealDefaultCategory) && <OverlayFinancial /> }
      {isOpenMenuDealDefaultCategory && <DealDefaultModal />}

    </Container>
  );
};

export default Financeiro;
