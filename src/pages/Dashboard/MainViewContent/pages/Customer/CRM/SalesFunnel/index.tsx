/* eslint-disable radix */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { ChangeEvent, useCallback, useEffect, useState,UIEvent } from 'react';
import api from 'services/api';
import Select from 'react-select';
import { useHeader } from 'context/headerContext';
import { BsTextRight } from 'react-icons/bs';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { FormatCurrency, selectStyles, useDelay, FormatDate } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { BsFunnel, BsThreeDotsVertical } from 'react-icons/bs';
import { FcEditImage, FcSearch, FcAbout, FcCancel, FcPlus, FcDeleteDatabase }from 'react-icons/fc';
import {  BiLoader, BiCopyAlt } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { MdEventAvailable } from 'react-icons/md';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { ImCalendar } from 'react-icons/im';
import { RiDashboardLine } from 'react-icons/ri';
import { MdFavorite, MdFavoriteBorder, MdComment, MdAttachFile} from 'react-icons/md';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal';
import Loader from 'react-spinners/PulseLoader';
import Search from 'components/Search';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from 'components/DatePicker';
import WarningMessage from 'components/WarningMessage';
import { useDefaultSettings } from 'context/defaultSettings';
import { IBusinessActivitiesReport, IBusinessData, ISalesFunnelData, ISalesFunnelDataSteps } from '../../Interfaces/IBusiness';
import { ISelectData } from '../../Interfaces/ICustomerEdit';
import { BusinessCard, Card, Container, Content, List, ListActivitiesSearch } from './styles';
import { IDefaultsProps } from '../../Interfaces/ICustomerList';

const SalesFunnel = () => {
  // #region STATES
  const { addToast } = useToast()
  const history = useHistory()
  const [businessList, setBusinessList] = useState<IBusinessData[]>([])
  const [salesFunnelList, setSalesFunnelList] = useState<ISelectData[]>([])
  const [salesFunnelId, setSalesFunnelId] = useState<number>(0)
  const [totalLines, setTotalLines] = useState<number>(0)
  const [funnelStepsList, setFunnelStepsList] = useState<ISalesFunnelDataSteps[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false)
  const [showActivities, setShowActivities] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [userSalesFunnelTerm, setSalesFunnelTerm] = useState<string>('')
  const [businessCardId, setBusinessCardId] = useState<number>(0)
  const [listActivities, setListActivitiesSearch] = useState<IBusinessActivitiesReport[]>([])
  const { captureText, handleCaptureText } = useHeader()
  const [totalValue, setTotalValue] = useState<number>(0)
  const { isOpenModal, handleJsonModalObjectResult, handleModalActive, modalActive } = useModal()
  const [statusEA, setStatusEA] = useState<boolean>(true)
  const [statusFE, setStatusFE] = useState<boolean>(true)
  const [statusPE, setStatusPE] = useState<boolean>(false)
  const [statusAR, setStatusAR] = useState<boolean>(false)
  const [searchStartDate, setSearchStartDate] = useState<string>(FormatDate(new Date(), 'yyyy-MM-dd'))
  const [searchEndDate, setSearchEndDate] = useState<string>('')
  const [searchFilterTerm, setSearchFilterTerm] = useState<string>('')
  const [helpTitleSearch, setHelpTitleSearch] = useState<string>('')
  const [filterTerm, setFilterTerm] = useState<string>('')
  const [permissionCRM, setPermissionCRM] = useState<boolean>(true)
  const [businessTotal, setBusinessTotal] = useState<number>(0)
  const [isEndPage, setIsEndPage] = useState(false)
  const [isPagination, setIsPagination] = useState(false)
  const [page, setPage] = useState(1)
  const [businessStartDate, setBusinessStartDate] = useState<string>(FormatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd'))
  const [businessEndDate, setBusinessEndDate] = useState<string>(FormatDate(new Date(new Date().setFullYear(new Date().getFullYear())), 'yyyy-MM-dd'))
  const { handleUserPermission, permission } = useDefaultSettings()
  const [period, setPeriod] = useState<string>('limitDate')
  const token = localStorage.getItem('@GoJur:token')
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const showBusinessDashboard = permissionsSecurity.find(item => item.name === "CFGSDASH");
  const salesFunnelFilter = localStorage.getItem('@GoJur:SalesFunnelFilter');
  const salesFunnelStatus = localStorage.getItem('@GoJur:SalesFunnelStatus');
  const filterDateType = localStorage.getItem('@GoJur:SalesFunnelDateType');
  const sDate = localStorage.getItem('@GoJur:SalesFunnelStartDate');
  const eDate = localStorage.getItem('@GoJur:SalesFunnelEndDate');
  const [selectDate, setSelectDate] = useState('A');
  // #endregion


  const selectDateList = [
    { id:'A', label: 'Período um ano Atualização' },
    { id:'I', label: 'Informar datas Atualização' },
    { id:'S', label: 'Informar datas Início' },
    { id:'E', label: 'Informar datas Encerramento' }
  ];


  // first initialization
  useEffect(() => {
    handleValidateSecurity(SecurityModule.customer)
    LoadSalesFunnel()
    LoadDefaultProps()

    if(salesFunnelFilter)
      setFilterTerm(salesFunnelFilter)

    if(filterDateType)
      setSelectDate(filterDateType)
      
    if(sDate)
      setBusinessStartDate(sDate)

    if(eDate){
      setBusinessEndDate(eDate)
      setStatusEA(false)

      if(salesFunnelStatus == 'TO'){
        setStatusEA(true)
        setStatusFE(false)
        setStatusPE(false)
        setBusinessStartDate('')
      }
      if(salesFunnelStatus == 'EA'){
        setStatusEA(true)
        setStatusFE(false)
        setStatusPE(false)
      }
      if(salesFunnelStatus == 'PE'){
        setStatusEA(false)
        setStatusFE(false)
        setStatusPE(true)
      }
      if(salesFunnelStatus == 'FE'){
        setStatusEA(false)
        setStatusFE(true)
        setStatusPE(false)
      }
    }

    ListBusinessCustomer()
  }, [])


  // delay load combo funnel responsible
  useDelay(() => {
    if (userSalesFunnelTerm.length > 0){
      LoadSalesFunnel()
    }
  }, [userSalesFunnelTerm], 500)


  useEffect(() => {
    if (salesFunnelId > 0){
      LoadSalesFunnelSteps()
      ListBusinessCustomer()
    }
  }, [salesFunnelId])


  useEffect(() => {
    if (!isLoading){
      ListBusinessCustomer()
    }
  }, [statusEA, statusFE, statusPE, statusAR, isLoading])


  // show report
  useEffect(() => {
    if (showActivities){
      LoadReportSearch()
    }
    else{
      setIsLoading(false)
      setListActivitiesSearch([])
      setIsEndPage(false)
      setIsPagination(false)
      setPage(1)
    }
  }, [showActivities])


  useEffect(() => {
    setListActivitiesSearch([])
    setIsEndPage(false)
    setPage(1)

    if (period == 'limitDate')
      setHelpTitleSearch('Exibe atividades e compromissos executados até a data limite informada  dentro do limite de 1 ano a partir do mais recente')

    if (period == 'currentWeek')
      setHelpTitleSearch('Exibe compromissos e atividades da semana atual')

    if (period == 'nextWeek')
      setHelpTitleSearch('Exibe compromissos programados para a próxima semana')

    if (period == 'period')
      setHelpTitleSearch('Exibe atividades e compromissos executados no período selecionado')

    if (period === 'limitDate')
      setSearchEndDate('')

    if (period === 'limitDate')
      setSearchEndDate(FormatDate(new Date(), 'yyyy-MM-dd'))

    if (period != 'period')
      LoadReportSearch()

  }, [period, showActivities])


  const LoadSalesFunnel = async () => {
    const response = await api.get<ISalesFunnelData[]>('FunilVendas/Listar', {
      params:{
        token,
        filterClause: ""
      }
    })

    setSalesFunnelList(response.data)

    // get first the default option
    const salesFunnelDefault  = response.data.filter(row => row.isDefault == 'S')
    if (salesFunnelDefault.length > 0) {
      setSalesFunnelId(Number(salesFunnelDefault[0].id))
    }

    // When is edit by sales funnel redirect
    const redirectBySearchFunnel = localStorage.getItem('@Gojur:funnelRedirectSearch')
    if (redirectBySearchFunnel){
        setShowActivities(true)
    }
  }


  const BuildFilterClause = () => {
    let filterClause = "";

    // set status search
    let filterStatus = "status="
    if (statusEA){ filterStatus += "'EA',"}
    if (statusFE){ filterStatus += "'FE',"}
    if (statusPE){ filterStatus += "'PE'," }
    if (statusAR){ filterStatus += "'AR'" }

    // set term
    filterClause = `${filterStatus} ${`|term=${filterTerm}`}`

    // set date start
    filterClause += `|startDate=${businessStartDate }`

    if(selectDate == 'I' || selectDate == 'S' || selectDate == 'E')
      filterClause += `|endDate=${businessEndDate }`

    filterClause += `|filterDateType=${selectDate}`

    filterClause += `|filterStatusAll=${salesFunnelStatus}`

    return filterClause;
  }


  const LoadPage = async () => {
    if(salesFunnelStatus != "TO"){
      const newLocal = businessStartDate == "" || businessStartDate == undefined;

      if (newLocal){
        addToast({type: "info", title: "Data de início inválida", description:'Insira uma data de inicio válida para realizar a pesquisa no funil de vendas'})
        return false;
      }
    }

    ListBusinessCustomer()
    LoadSalesFunnelSteps()
    LoadDefaultProps()
  }


  const LoadSalesFunnelSteps = async() => {
    const filterClause = BuildFilterClause();

    const response = await api.get<ISalesFunnelDataSteps[]>('FunilVendasEtapas/Listar', {
      params:{
        token,
        salesFunnelId,
        filterClause
      }
    })

    setFunnelStepsList(response.data)
    setIsLoading(false);
  }


  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token });

      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      const CRMPermission = response.data.filter(item => item.id === 'defaultPlanPermissionCRM')
      const businessCount = response.data.filter(item => item.id === 'defaultCRMBusinessTotal')

      // verify if have CRM permission to include
      if (CRMPermission){
        // eslint-disable-next-line radix
        setPermissionCRM(CRMPermission[0].value == "S")
      }

      // get total business count
      if (businessCount){
        // eslint-disable-next-line radix
        // eslint-disable-next-line no-alert
        setBusinessTotal(parseInt(businessCount[0].value))
      }

      setIsEndPage(false)
      setIsPagination(false)
      setPage(1)
      setIsLoading(false)
      handleCaptureText('')
      handleUserPermission(userPermissions[0].value.split('|'));
      localStorage.removeItem('@Gojur:funnelRedirectSearch')
    }
    catch (err) {
      console.log(err);
    }
  }


  const ListBusinessCustomer = async () => {
    try
    {
      const filterClause  = BuildFilterClause();

      if (salesFunnelId === 0){
        setIsLoading(false);
        return;
      }

      const response = await api.get<IBusinessData[]>('/NegocioCliente/ListarTodos', {
        params:{filterClause, salesFunnelId, token}
      });

      setTotalLines(response.data.length)
      setTotalValue(response.data.length == 0? 0: response.data[0].businessTotal)
      setBusinessList(response.data)
      RemoveLocalStorage()
    }
    catch (ex){
      setIsLoading(false)
      RemoveLocalStorage()
    }
  }


  const RemoveLocalStorage = () => {
    localStorage.removeItem('@GoJur:SalesFunnelFilter');
    localStorage.removeItem('@GoJur:SalesFunnelStatus');
    localStorage.removeItem('@GoJur:SalesFunnelDateType');
    localStorage.removeItem('@GoJur:SalesFunnelStartDate');
    localStorage.removeItem('@GoJur:SalesFunnelEndDate');
  }


  const handleSalesFunell = (item) => {
    if (item){
      setSalesFunnelId(item.id)
    }
    else{
      setSalesFunnelId(0)
      LoadSalesFunnel()
    }
  }


  const handleDragStart = (cardId: number) => {
    setBusinessCardId(cardId)
  }


  // called when is save a apppointment by modal to reload list
  useEffect(() => {
    if (!modalActive && !isLoading) {
      LoadPage()
    }
  }, [isLoading, modalActive, captureText])


  const handleDragDrop = (e) => {
    // avoid error on the same card
    if (e.target.id == undefined || e.target.id == ''){
      e.preventDefault();
      return false;
    }

    // get current drop card
    const cardFunnelCurrent = Number(e.target.id);

    // get bussiness card for specific step funnel
    const businessCard = businessList.find(item => item.id === businessCardId);

    // avoid error on move at the same card
    if (e.target.id.toString() === businessCard?.salesFunnelStepId.toString()){
      e.preventDefault();
      return false;
    }

    if (businessCard){
      // When is dragging for DIFFERENT card sales funnel step
      if (e.target.id.toString() != businessCard?.salesFunnelStepId.toString()){
        const businessListRefresh = businessList.map(item =>
          item.id == businessCardId?
          {
            ...item,
            salesFunnelStepId: cardFunnelCurrent,
          }
          : item
        )

        // update state list card
        setBusinessList(businessListRefresh)

        const businessCardMoved = businessListRefresh.find(item => item.id == businessCardId)
        if (businessCardMoved){
          handleSaveCard(businessCardMoved);
        }
      }
    }
  }


  const handleSaveCardFavorite = useCallback(async (businessCard : IBusinessData, numOrder:number) => {
    try
    {
      // eslint-disable-next-line no-param-reassign
      businessCard.token =  token;

      // eslint-disable-next-line no-param-reassign
      businessCard.numOrder = numOrder;

      await api.put('NegocioCliente/Salvar', businessCard)

      // reaload sales funnel
      await LoadPage();

      handleCloseMenuCard()

      addToast({type: "success", title: "Operação realizada com sucesso", description: numOrder == 0? `O Card selecionado favoritado com sucesso`: `O Card selecionado desfavoritado com sucesso`})
    }
    catch(err){
      addToast({type: "info", title: "Operação não realizada", description: `Houve uma falha ao salvar o card selecionado`})
    }
  }, [businessList])


  const handleSaveCard = useCallback(async (businessCard : IBusinessData) => {
    try
    {
      // eslint-disable-next-line no-param-reassign
      businessCard.token =  token;
      await api.put('NegocioCliente/Salvar', businessCard)
      await LoadPage()

      addToast({type: "success", title: "Operação realizada com sucesso", description: `O Card selecionado foi salvo com sucesso`})
    }
    catch(err){
      addToast({type: "info", title: "Operação não realizada", description: `Houve uma falha ao salvar o card selecionado`})
    }
  }, [businessList])


  const handleDeleteBusinessCard  = async () =>{
    try {
      setIsDeleting(true)

      await api.delete('/NegocioCliente/Deletar', {
        params:{
          id:businessCardId,
          token
        }
      })

      addToast({type: "success", title: "Operação realizada com sucesso", description: "O negócio selecionado foi deletado com sucesso"})

      await LoadPage()
      handleCloseMenuCard()
      setIsDeleting(false)
    }
    catch (err) {
      addToast({type: "info", title: "Falha ao deletar o registro", description:  "Houve uma falha ao deletar este registro"})
    }
  }


  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleClickMenuCard = (event, businessId: number, businessStatus:string) => {
    setBusinessCardId(businessId)
    setAnchorEl(event.currentTarget)
  }


  const handleCloseMenuCard = () => {
    setAnchorEl(null)
    setBusinessCardId(0)
  }

  
  const handleClickCard = (businessId: number) => {
    localStorage.setItem('@Gojur:funnelRedirect', 'S')
    history.push(`../../customer/business/edit/${  businessId}`)
    handleCloseMenuCard()
  }


  const handleEditCard = () => {
    localStorage.setItem('@Gojur:funnelRedirect', 'S')
    history.push(`../../customer/business/edit/${  businessCardId}`)
    handleCloseMenuCard()
  }


  const handleRedirectClickSearchBusiness = (e: any, businessId: number) => {
    localStorage.setItem('@Gojur:funnelRedirectSearch', JSON.stringify({
      businessId,
      period,
      searchStartDate,
      searchEndDate,
      searchFilterTerm
    }))

    history.push(`../../customer/business/edit/${  businessId}`)
    e.preventDefault();
  }


  const handleCreateAppointment = () => {
    try {
      isOpenModal('0')
      handleModalActive(true)

      const businessJSON = { businessId:businessCardId }
      handleJsonModalObjectResult(JSON.stringify(businessJSON));
      handleCloseMenuCard();
    }
    catch (err) {
      console.log('Houve um erro ao abrir o cadastro de compromisso, tente novamente')
    }
  }


  const handleCreateNewBusiness = (funnelStepId: string) => {
    if (!permissionCRM){
      addToast({type: 'info', title: 'Operação não realizada', description: `O seu plano atual permite a inclusão de apenas ${ businessTotal } negócios, faça um upgrade para obter acesso ilimitado a este serviço`})
      return false;
    }

    const funnelStep = funnelStepsList.find(item => item.id ==  funnelStepId);
    if (funnelStep){
      localStorage.setItem('@Gojur:funnelStep', JSON.stringify(funnelStep))
    }

    history.push(`../../customer/business/edit/0`)
  }


  const handleBusinessStartDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBusinessStartDate(event.target.value)
  }, [businessStartDate])


  const handleBusinessEndDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBusinessEndDate(event.target.value)
  }, [businessEndDate]) 


  const handleSearchStartDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setListActivitiesSearch([])
    setSearchStartDate(event.target.value)
  }, [])


  const handleSearchEndDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setListActivitiesSearch([])
    setSearchEndDate(event.target.value)
  }, [])


  const handleCustomerInformation = (e, businessId, status) => {
    const businessListRefresh = businessList.map(item =>
      item.id == businessId?{
        ...item,
        openCustomerDetails: status,
      }
      : item
    )

    setBusinessList(businessListRefresh)
    e.stopPropagation()
  }


  const handleOpenWhatsApp = useCallback((e, number) => {
    if (number === null) return;
      const message = 'Olá,'
      window.open(`https://web.whatsapp.com/send?phone=+55${number}&text=${message}`, '_blank')

      e.stopPropagation();
      e.preventDefault();
  }, []); // inicia a conversa no whatsapp


  const handleCopyClipBoard = (e, text) => {
    const ta = document.createElement("textarea");
    ta.innerText = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();

    addToast({type: 'success', title: 'Operação realizada com sucesso', description: `O conteúdo foi copiada para a área de transferência e já pode ser utilizado`})
    e.stopPropagation();
  }


  const periodDates = [
    { id:'limitDate',   label: 'Executadas Até:' },
    { id:'currentWeek', label: 'Semana Atual:' },
    { id:'nextWeek',    label: 'Próxima Semana:' },
    { id:'period',      label: 'Informar periodo'},
  ]


  const handlePeriod = (item) => {
    setPage(1)
    if (item){
      setPeriod(item.id)
    }
    else{
      setPeriod('currentMonth')
    }
  }


  const LoadReportSearch = useCallback(async (callBySearchTerm = false, callBySearchIcon = false) => {
    try
    {
      if (isLoadingSearch || isLoading) { return; }

      if (period === 'period' && searchEndDate == ''){
        addToast({type: "info", title: "Periodo de datas não informado", description:'O periodo de datas não foi informado corretamente'})
        return;
      }

      setIsLoadingSearch(true)

      let request = {};
      // Build request params by JSON redirect saved values (when user click and go to business edit and go back to list view search keep values filtered)
      const redirectBySearchFunnel = localStorage.getItem('@Gojur:funnelRedirectSearch')
      if (redirectBySearchFunnel){
        const JsonObject = JSON.parse(redirectBySearchFunnel)
        request = {
          searchStartDate: JsonObject.searchStartDate,
          searchEndDate: JsonObject.searchEndDate,
          searchFilterTerm: JsonObject.searchFilterTerm,
          period: JsonObject.period,
          page:1,
          rows:50,
          token
        }

        // save filter localstorage to effect o shows on controllers
        setSearchStartDate(JsonObject.searchStartDate)
        setSearchEndDate(JsonObject.searchEndDate)
        setPeriod(JsonObject.period)
        setSearchFilterTerm(JsonObject.searchFilterTerm)
      }
      else{
        // Common filter by interaction screen
        let pageNumber = callBySearchTerm? 1: page;
        if (callBySearchIcon){
          pageNumber = 1;
        }

        request = {
          searchStartDate,
          searchEndDate,
          searchFilterTerm,
          period,
          page:pageNumber,
          rows:50,
          token
        }
      }

      const response = await api.get<IBusinessActivitiesReport[]>('NegocioAtividade/ListarAtividadesRelatorio', {
        params: request
      })

      const listResult: IBusinessActivitiesReport[] = [];

      // Append activities
      response.data.map((item) => {
        return listResult.push(item)
      })

      if (listResult.length == 0 ){
        setIsEndPage(true)
        setIsPagination(false)
      }

      if (!isPagination){
        setIsEndPage(false)
        setListActivitiesSearch(listResult)
      }
      else{
        listResult.map(((item) => {
          return listActivities.push(item)
        }))

        setListActivitiesSearch(listActivities)
      }

      setIsLoadingSearch(false)
    }
    catch(e:any){
      setIsLoadingSearch(false)
      setIsPagination(false)
    }
  }, [isLoadingSearch, isLoading, period, searchEndDate, searchStartDate, page, token, searchFilterTerm, isPagination, addToast, listActivities])


  // when page number is than 1 load customer as pagination
  useEffect(() => {
    if (page > 1){
      LoadReportSearch()
    }
  }, [page])


  const handleScrool = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || listActivities.length == 0)
    {
      setPage(1)
      return;
    }

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight

    if (isEndScrool && !isLoadingSearch) {
      setPage(page + 1)
      setIsPagination(true)
    }
  }


  const handleSelectDate = (item) => {
    if (item){
      setSelectDate(item.id)

      if(item.id == 'A')
        setBusinessStartDate(FormatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd'))
    }
    else{
      setSelectDate('')
    }
  };
  


  return (
    <Container>
      <Content>
        {!permissionCRM && (
          <WarningMessage>
            O seu plano atual permite a inclusão de apenas 
            {' '}
            {businessTotal}
            {' '}
            oportunidades de negócios. 
            <br />
            <a target='_blank' href='https://www.bcompany.com.br/planos/' rel="noreferrer">Clique Aqui </a>
            para fazer um upgrade e acessar esta e outras funcionalides de forma ilimitada.
          </WarningMessage>
        )}

        <AutoCompleteSelect className="selectFunnelSteps">
          <p>Funil de Vendas</p>
          <Select
            isSearchable
            IsClearable
            value={salesFunnelList.filter(options => options.id == (salesFunnelId? salesFunnelId.toString(): ''))}
            onChange={handleSalesFunell}
            onInputChange={(term) => setSalesFunnelTerm(term)}
            placeholder="Selecione"
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            noOptionsMessage={noOptionsMessage}
            styles={selectStyles}
            options={salesFunnelList}
          />

          <div className="buttonsHeader">
            <button
              type="button"
              className="buttonLinkClick" 
              title="Clique para visualizar as atividades do funil de vendas em ordem cronológica"
              onClick={() => setShowActivities(true)}
            >
              <BsTextRight />
              Atividades
            </button>

            {showBusinessDashboard && (
              <button
                type="button"
                className="buttonLinkClick"
                title="Clique para visualizar clientes"
                onClick={() => history.push('/CRM/Dashboard')}
              >
                <RiDashboardLine />
                Dashboard
              </button>
            )}

            <button
              type="button"
              className="buttonLinkClick"
              title="Clique para visualizar clientes"
              onClick={() => history.push('../../customer/list')}
            >
              <AiOutlineUser />
              Clientes
            </button>

            <button
              type="button"
              className="buttonLinkClick"
              title="Clique para visualizar as etapas do funil de vendas"
              onClick={() => history.push(`../../CRM/configuration/salesFunnelSteps`)}
            >
              <BsFunnel />
              Etapas Funil
            </button>
          </div>
        </AutoCompleteSelect>

        {/* Three Dots Menu Options */}
        <div className="headerInformation">
          <label htmlFor="totalValue" style={{marginRight:'20px'}}>
            <b>Total:</b>
            &nbsp;
            {FormatCurrency.format(totalValue)}
          </label>

          <label htmlFor="filterFollowing" className="filterFollowing">
            <input
              type="checkbox"
              checked={statusEA}
              onChange={(e) => setStatusEA(e.target.checked)}
            />
            &nbsp;Em andamento
          </label>

          <label htmlFor="filterConclude" className="filterConclude">
            <input
              type="checkbox"
              checked={statusFE}
              onChange={(e) => setStatusFE(e.target.checked)}
            />
            &nbsp;Fechado (Êxito)
          </label>

          <label htmlFor="filterLose" className="filterLose">
            <input
              type="checkbox"
              checked={statusPE}
              onChange={(e) => setStatusPE(e.target.checked)}
            />
            &nbsp;Perdido
          </label>

          <label htmlFor="filterLose" className="filterFile">
            <input
              type="checkbox"
              checked={statusAR}
              onChange={(e) => setStatusAR(e.target.checked)}
            />
            &nbsp;Arquivado
          </label>

          {selectDate == "A" ? (
            <>
              <div id='SelectDate' style={{width:'240px', marginTop:'-1px'}}>
                <AutoCompleteSelect>
                  <Select
                    isSearchable
                    value={selectDateList.filter(options => options.id == selectDate)}
                    onChange={handleSelectDate}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={selectDateList}
                  />
                </AutoCompleteSelect>
              </div>
              &nbsp;&nbsp;
              <div style={{marginTop:'10px'}}>
                <label id='DateStartInput' className='dateStartInput'>
                  <DatePicker
                    title=""
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key == 'Enter'){
                        LoadPage();
                      }
                    }}
                    onChange={handleBusinessStartDate}
                    value={businessStartDate}
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div id='SelectDate' style={{width:'240px', marginTop:'-1px'}}>
                <AutoCompleteSelect>
                  <Select
                    isSearchable
                    value={selectDateList.filter(options => options.id == selectDate)}
                    onChange={handleSelectDate}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={selectDateList}
                  />
                </AutoCompleteSelect>
              </div>

              &nbsp;&nbsp;
              <div>
                <div>
                  <label id='DateStartInput' className='dateStartInput'>
                    <DatePicker
                      title=""
                      onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key == 'Enter'){
                          LoadPage();
                        }
                      }}
                      onChange={handleBusinessStartDate}
                      value={businessStartDate}
                    />
                  </label>
                </div>
                <div style={{marginTop:'5px'}}>
                  <label id='DateEndInput' className='dateStartInput'>
                    <DatePicker
                      title=""
                      onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key == 'Enter'){
                          LoadPage();
                        }
                      }}
                      onChange={handleBusinessEndDate}
                      value={businessEndDate}
                    />
                  </label>
                </div>
              </div>
            </>
          )}
          &nbsp;&nbsp;

          <FcSearch
            className='infoButton'
            title='Clique para recarregar a pagina com base na nova data de inicio informada'
            onClick={() => LoadPage()}
          />

          <div />

          <Search
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) { e.preventDefault() }
              if (e.key == 'Enter'){ LoadPage() }}
            }
            onChange={(e) =>  {
              setFilterTerm(e.target.value)
              setIsEndPage(false)
              setIsPagination(false)
            }}
            placeholder='Pesquisar no funil de vendas'
            name='search'
            style={{ marginTop:'-3px', marginRight: '15px', minWidth:'13rem'}}
            value={filterTerm}
          />

          <FcAbout
            className='infoButton'
            title='Pesquisa por negócios através dos campos: Cliente | Responsável | Descrição | Funil de venda'
            onClick={() => LoadPage()}
          />
        </div>

        <div className="totalLines">
          {totalLines}
          &nbsp;
          {`${totalLines == 1? "Negócio": "Negócios"  } encontrados`}
        </div>

        <List>
          {funnelStepsList.map(funnelStep => (
            <Card
              id={funnelStep.id}
              onDragOverCapture={(e) => e.preventDefault()}
              onDrop={(e) => handleDragDrop(e)}
            >
              <header>
                {funnelStep.label}
                &nbsp;&nbsp;
                <FcPlus
                  onClick={() => handleCreateNewBusiness(funnelStep.id)}
                  title='Clique para incluir uma nova oportunidade de negócio'
                />
              </header>

              <div className="totalHeader">
                {/* Total:
                {' '} */}
                {FormatCurrency.format(funnelStep.totalValue??0)}
              </div>

              {businessList.filter(business => business.salesFunnelStepId === Number(funnelStep.id)).map(business => (
                <BusinessCard
                  key={business.id}
                  id={funnelStep.id}
                  colorName={business.statusColor}
                  draggable
                  onDragStart={() => handleDragStart(business.id)}
                >
                  <BsThreeDotsVertical
                    className="headerCard"
                    title='Clique para visualizar opções'
                    onClick={(e) => handleClickMenuCard(e, business.id, business.status)}
                  />

                  {business.numOrder == 2 && (
                    <MdFavoriteBorder
                      style={{marginRight:'0'}}
                      className="headerCard"
                      title="Clique para favoritar esta oportunidade de negócio e coloca-la no topo da lista"
                      onClick={() => handleSaveCardFavorite(business, 1)}
                    />
                  )}

                  {business.numOrder == 1 && (
                    <MdFavorite
                      style={{marginRight:'0'}}
                      className="headerCard"
                      title="Clique para desfavoritar esta oportunidade de negócio e visualiza-la através da ordenação por data de inicio"
                      onClick={() => handleSaveCardFavorite(business, 2)}
                    />
                  )}

                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    className="headerCard"
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenuCard}
                  >
                    <MenuItem
                      style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}}
                      onClick={() => handleEditCard()}
                    >
                      <FcEditImage />
                      &nbsp;&nbsp;Editar
                    </MenuItem>

                    <MenuItem
                      style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}}
                      onClick={() => handleDeleteBusinessCard()}
                    >
                      {!isDeleting && (
                        <>
                          {' '}
                          <FcDeleteDatabase />
                          {'  '}
                          &nbsp;&nbsp;Deletar
                          {' '}
                        </>
                      )}
                      {isDeleting && (
                        <>
                            {' '}
                          <BiLoader />
                            {'  '}
                            &nbsp;&nbsp;Deletando
                            {' '}
                        </>
                      )}
                    </MenuItem>

                    <MenuItem
                      style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}}
                      onClick={() => handleCreateAppointment()}
                    >
                      <MdEventAvailable />
                      &nbsp;&nbsp;Criar Compromisso
                    </MenuItem>

                    <MenuItem
                      style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}}
                      onClick={handleCloseMenuCard}
                    >
                      <FcCancel />
                      &nbsp;&nbsp;Fechar
                    </MenuItem>
                  </Menu>
                  <br />

                  <div
                    id={funnelStep.id}
                    onClick={()=> handleClickCard(business.id)}
                    title="Clique para visualizar detalhes desta oportunidade de negócio"
                  >
                    <p id={funnelStep.id}>
                      <label>Cliente:</label>
                      <span
                        className='customerLink'
                        onClick={(e) => handleCustomerInformation(e, business.id, true)}
                      >
                        {business.nomCustomer}
                      </span>

                      <div
                        className='customerInfo'
                        onClick={(e)=> e.stopPropagation()}
                        style={{display: (business.openCustomerDetails?'block': 'none')}}
                      >
                        {(business.phoneNumber??"").length > 0 && (
                          <p>
                            <span>Telefone:</span>
                            {' '}
                            <span>
                              {business.phoneNumber}
                              {' '}
                              <BiCopyAlt
                                className='copyIcon'
                                onClick={(e) => handleCopyClipBoard(e, business.phoneNumber)}
                                title="Clique para copiar o conteúdo para a área de transferência"
                              />
                            </span>
                          </p>
                        )}

                        {(business.whatsAppNumber??"").length > 0 && (
                          <>
                            <p>
                              <span>WhatsApp:</span>
                              {' '}
                              <span
                                className='whatsIcon'
                                onClick={(e) => handleOpenWhatsApp(e, business.whatsAppNumber)}
                              >
                                <span style={{color:'var(--green-dark'}}>
                                  {business.whatsAppNumber}
                                  {' '}
                                  <BiCopyAlt
                                    className='copyIcon'
                                    onClick={(e) => handleCopyClipBoard(e, business.whatsAppNumber)}
                                    title="Clique para copiar o conteúdo para a área de transferência"
                                  />
                                </span>
                              </span>
                              {' '}
                            </p>
                          </>
                        )}

                        {(business.email??"").length > 0 && (
                          <p>
                            <span>Email:</span>
                            {' '}
                            <span>
                              {business.email}
                              {' '}
                              <BiCopyAlt
                                className='copyIcon'
                                onClick={(e) => handleCopyClipBoard(e, business.email)}
                                title="Clique para copiar o conteúdo para a área de transferência"
                              />
                            </span>
                          </p>
                        )}

                        {((business.phoneNumber??"").length == 0 && (business.whatsAppNumber??"").length == 0 && (business.email??"").length == 0) && (
                          <p>Não existem informações de contato cadastradas para este cliente</p>
                        )}

                        <button
                          type="button"
                          style={{marginLeft:'42%', fontSize:'0.6rem'}}
                          className="buttonLinkClick"
                          onClick={(e) => handleCustomerInformation(e, business.id, false)}
                          title="Clique para fechar as informações de contato do cliente"
                        >
                          Fechar
                        </button>
                      </div>
                    </p>

                    <p id={funnelStep.id}>
                      <label>Descrição:</label>
                      {business.description}
                    </p>

                    <p id={funnelStep.id}>
                      <label>Valor:</label>
                      {FormatCurrency.format(business.businessValue)}
                    </p>

                    <p id={funnelStep.id}>
                      <label>Início:</label>
                      {FormatDate(new Date(business.startDate), 'dd/MM/yyyy')}
                    </p>

                    {business.finishDate != null && (
                      <p id={funnelStep.id}>
                        <label>Encerramento:</label>
                        {business.finishDate != null? FormatDate(new Date(business.finishDate), 'dd/MM/yyyy'): " vigente "}
                      </p>
                    )}

                    {business.nomUserResponsible != null && (
                      <p id={funnelStep.id}>
                        <label>Responsável:</label>
                        {business.nomUserResponsible}
                      </p>
                    )}

                    <p id={funnelStep.id}>
                      <label>Status:</label>
                      {business.statusComplete}
                    </p>

                    <p id={funnelStep.id}>
                      <label>Últ. Atualização:</label>
                      {FormatDate(new Date(business.lastUpdate), "dd/MM/yyyy HH:mm")}
                    </p>

                    {business.totalComments > 0 && (
                    <span className="notificationsCard">
                      <MdComment title="Clique para visualizar os comentários inseridos nesta oportunidade de negócio" />
                            &nbsp;
                      {business.totalComments}
                    </span>
                    )}

                    {business.totalDocuments > 0 && (
                      <span className="notificationsCard" style={{marginLeft:'0.5rem'}}>
                        <MdAttachFile title="Clique para visualizar os documentos anexados nesta oportunidade de negócio" />
                              &nbsp;
                        {business.totalDocuments}
                      </span>
                    )}


                    {business.totalAppointments > 0 && (
                      <span className="notificationsCard" style={{marginLeft:'0.5rem'}}>
                        <MdEventAvailable title="Clique para visualizar os compromissos inseridos nesta oportunidade de negócio" />
                                &nbsp;
                        {business.totalAppointments}
                      </span>
                    )}
                  </div>
                </BusinessCard>
              ))}
              <br />

              <button
                type="button"
                className="buttonLinkClick"
                title="Clique para incluir uma nova oportunidade de negócio"
                onClick={() => handleCreateNewBusiness(funnelStep.id)}
              >
                <FcPlus />
                Novo Negócio
              </button>
              <br />
            </Card>
          ))}
        </List>

        {/* if there is no steps of funnel */}
        {(funnelStepsList.length == 0 && salesFunnelId> 0) && (
        <div className="messageEmpty">
          <Loader size={10} color="var(--blue-twitter)" />
        </div>
        )}
      </Content>

      {/* Report list - display none as default */}
      <ListActivitiesSearch onScroll={handleScrool} show={showActivities}>
        <div className="toolBarButtons">
          <button
            type="button"
            className="buttonLinkClick"
            title="Clique para retornar ao funil de vendas"
            onClick={() => setShowActivities(false)}
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>
        </div>

        <div className="toolBarSearch">
          <Select
            className="select"
            isSearchable
            value={periodDates.filter(options => options.id == (period? period.toString(): ''))}
            onChange={handlePeriod}
            placeholder=""
            options={periodDates}
            styles={selectStyles}
          />

          <FcAbout className='infoIcon' title={helpTitleSearch} />

          {period === "limitDate" && (
            <>
              <label>
                <DatePicker
                  title=""
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key == 'Enter'){ LoadReportSearch(); }
                  }}
                  onChange={handleSearchStartDate}
                  value={searchStartDate}
                />
              </label>
            </>
          )}

          {period === "period" && (
            <>
              <label>
                <DatePicker
                  title=""
                  onChange={handleSearchStartDate}
                  value={searchStartDate}
                />
              </label>

              <label>
                <DatePicker
                  title=""
                  onChange={handleSearchEndDate}
                  value={searchEndDate}
                />
              </label>
            </>
          )}

          {(period != 'nextWeek' && period != 'currentWeek') && (
            <FcSearch
              className='searchIcon'
              onClick={LoadReportSearch}
              title='Clique para recarregar a pagina com base na nova data de inicio informada'
            />
          )}

          {isLoadingSearch && (
            <div className='loaderSearch'>
              <Loader size={5} color="var(--blue-twitter)" />
            </div>
          )}

          <Search
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) { e.preventDefault() }
              if (e.key == 'Enter'){ LoadReportSearch(true) }}
            }
            onChange={(e) => setSearchFilterTerm(e.target.value)}
            value={searchFilterTerm}
            placeholder='Pesquisar atividades realizadas'
            name='search'
            style={{ marginTop:'-3px'}}
          />
        </div>

        <div className="contentList">
          <div className="itemList" style={{backgroundColor:'var(--gray)', fontWeight:500}}>
            <div className='customerColumn'>
              Cliente
            </div>

            <div className='descColumn'>
              Oportunidade de Negócio
            </div>

            <div className='activityColumn'>
              Descrição da Atividade
            </div>

            <div className='dateColumn'>
              Data
              &nbsp;&nbsp;
              <FcAbout
                className='infoIcon'
                title='Data do lançamento da atividade ou data inicial do compromisso agendado'
              />
            </div>
          </div>

          {listActivities.map((item) => {
            return (
              <div
                className="itemList"
                onClick={(e) => handleRedirectClickSearchBusiness(e, item.businessId)}
                id={item.id.toString()}
              >

                <div className='customerColumn'>
                  {item.tpo_Activity === 'appointment' ? (
                    <ImCalendar title='Compromisso registrado ao negócio' />
                    ): (
                      <BsTextRight title='Atividade registrada ao negócio' />
                  )}
                  &nbsp;&nbsp;
                  {item.customerName}
                </div>

                <div className='descColumn'>
                  {item.businessDescription}
                </div>

                <div title={item.activityDescription} className='activityColumn'>
                  {item.activityDescription.length > 500? `${item.activityDescription.substring(0, 500)  }...` : item.activityDescription}
                </div>

                <div className='dateColumn'>
                  {FormatDate(new Date(item.date), 'dd/MM/yyyy HH:mm')}
                </div>
              </div>
            )
          })}
        </div>
      </ListActivitiesSearch>
    </Container>
  )
}

export default SalesFunnel