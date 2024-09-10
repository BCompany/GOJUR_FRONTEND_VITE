/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { FaRegTimesCircle } from 'react-icons/fa';
import Loader from 'react-spinners/PulseLoader';
import { FiSave } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import Select from 'react-select'
import DatePicker from 'components/DatePicker';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { FormatDate, selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import ReportModal from 'components/Modals/Report';
import { useLocation } from 'react-router-dom';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { IFullCalendar, IAutoCompleteData, ISelectData, ISubject, filterProps, IFilterDesc, IDefaultsProps} from '../../Interfaces/ICalendar';
import { ModalReport, ItemList, ModalFilter, ModalReportMobile } from './styles';


const CalendarReport: React.FC = () => {
  
  const [calendarList, setCalendarList] = useState<IFullCalendar[]>([])
  const [calendarListSearch, setCalendarListSearch] = useState<IFullCalendar[]>([])
  const { isMenuOpen, handleIsMenuOpen, caller, isOpenMenuConfig, isOpenMenuReport, handleCaller, handleIsOpenMenuReport } = useMenuHamburguer();
  const { addToast } = useToast();
  const [pageNumber, setPageNumber] = useState(1)
  const { handleUserPermission } = useDefaultSettings();
  const { isOpenModal, handleDeadLineCalculatorText, handleCaptureTextPublication, handleModalActive, modalActive } = useModal();
  const [showSearchList, setShowSearchList]= useState<boolean>(false)
  const [openModalFast, setOpenModalFast]= useState<boolean>(false)
  const [openModalParameters, setOpenModalParameters]= useState<boolean>(false)
  const [openModalCalendarReport, setOpenModalCalendarReport]= useState<boolean>(false)
  const [isLoading, setIsLoading]= useState<boolean>(false)
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false)
  const [isEndPage, setIsEndPage] = useState(false)           
  const [isPagination, setIsPagination] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [totalPageCount, setTotalPageCount] = useState<number>(0)
  const [filterTerm, setFilterTerm] = useState<string>('')
  const [multiFilter, setMultiFilter] = useState<filterProps[]>([]) // valor do multi filter
  const { handleShowVideoTrainning } = useModal();
  const { pathname } = useLocation();
  const token = localStorage.getItem('@GoJur:token');
  const [description, setDescription] = useState<string>();
  const [dateString, setDateString] = useState<string>();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [viewName, setViewName] = useState('');
  const [eventId, setEventId] = useState<number>(0)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [defaultUserCompanyId, setDefaultUserCompanyId] = useState('');
  const [defaultUserCompanyName, setDefaultUserCompanyName] = useState<string|null>('');
  const [showReportOpenFileModal, setShowReportOpenFileModal] = useState<boolean>(false);
  const [reportLink, setReportLink] = useState<string>('');
  const { isMOBILE } = useDevice();

  // PARAMETERS
  const [subjectParameter, setSubjectParameter] = useState<ISelectData[]>([]);
  const [subjectParameterTerm, setSubjectParameterTerm] = useState(''); 
  const [subjectParameterId, setSubjectParameterId] = useState('');
  const [subjectParameterValue, setSubjectParameterValue] = useState('');
  const [sharedParameter, setSharedParameter] = useState<string>('R');
  const [viewParameter, setViewParameter] = useState<string>('');
  const [updatePermissionParameter, setUpdatePermissionParameter] = useState<string>('restricted');
  const [userTypeParameter, setUserTypeParameter] = useState<string>('R');
  const [sendEmailParameter, setSendEmailParameter] = useState<string>('R');

  const [periodId, setPeriodId] = useState<string>('')
  const [reportPeriodId, setReportPeriodId] = useState<string>('currentWeek');
  const [reportPeriodValue, setReportPeriodValue] = useState<string>('Semana Atual');
  
  const [includeId, setIncludeId] = useState<string>('')
  const [reportIncludeId, setReportIncludeId] = useState<string>('includeSelecione');
  const [reportIncludeValue, setReportIncludeValue] = useState<string>('Selecione...');
  
  const [concludeId, setConcludeId] = useState<string>('')
  const [reportConcludeId, setReportConcludeId] = useState<string>('concludeSelecione');
  const [reportConcludeValue, setReportConcludeValue] = useState<string>('Selecione...');
  
  const [situationId, setSituationId] = useState<string>('')
  const [layoutId, setLayoutId] = useState<string>('')
  const [stateId, setStateId] = useState<string>('')

  // MODAL FILTER
  const [openModalFilter, setOpenModalFilter]= useState<boolean>(false)
  const [filterNameId, setFilterNameId] = useState('');
  const [filterList, setFilterList] = useState<ISelectData[]>([]);

  const periodOptions = [
    {
      key: 'currentWeek',
      value: 'Semanal Atual'
    },
    {
      key: 'currentMonth',
      value: 'Mês Atual'
    },
    {
      key: 'nextWeek',
      value: 'Próxima Semana'
    },
    {
      key: 'nextMonth',
      value: 'Próximo Mês'
    },
    {
      key: 'custom',
      value: 'Informar Datas'
    },
    {
      key: 'all',
      value: 'Todo o Período'
    }
  ]

  const includeOptions = [
    {
      key: 'includeSelecione',
      value: 'Selecione...'
    },
    {
      key: 'includeToday',
      value: 'Hoje'
    },
    {
      key: 'includeYesterday',
      value: 'Ontem'
    },
    {
      key: 'includeCustom',
      value: 'Informar Datas'
    }
  ]

  const concludeOptions = [
    {
      key: 'concludeSelecione',
      value: 'Selecione...'
    },
    {
      key: 'concludeToday',
      value: 'Hoje'
    },
    {
      key: 'concludeCurrentWeek',
      value: 'Esta Semana'
    },
    {
      key: 'concludeCurrentMonth',
      value: 'Mês Atual'
    },
    {
      key: 'concludeLastMonth',
      value: 'Mês Anterior'
    },
    {
      key: 'concludeCustom',
      value: 'Informar Datas'
    }
  ]

  const situationOptions = [
    {
      key: 'both',
      value: 'Ambos'
    },
    {
      key: 'L',
      value: 'Concluído'
    },
    {
      key: 'P',
      value: 'Pendente'
    }
  ]

  const layoutOptions = [
    {
      key: 'pdf',
      value: 'PDF'
    },
    {
      key: 'excel',
      value: 'Excel'
    }
  ]

  // REPORT
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [states, setStates] = useState<IAutoCompleteData[]>([]);
  const [favoriteCalendarUserFilterId, setFavoriteCalendarUserFilterId] = useState<string>('');
  
  const [reportSituationId, setReportSituationId] = useState<string>('both');
  const [reportSituationValue, setReportSituationValue] = useState<string>('Ambos');

  const [reportStateId, setReportStateId] = useState<string>('');
  const [reportStateValue, setReportStateValue] = useState<string>('');

  const [reportLayoutId, setReportLayoutId] = useState<string>('pdf');
  const [reportLayoutValue, setReportLayoutValue] = useState<string>('PDF');

  const [appointmentDateBeggin, setAppointmentDateBeggin] = useState<string>('');
  const [appointmentDateEnd, setAppointmentDateEnd] = useState<string>('');

  const [includeNewDate, setIncludeNewDate] = useState<string>('');
  const [includeNewDateEnd, setIncludeNewDateEnd] = useState<string>('');

  const [concludeNewDate, setConcludeNewDate] = useState<string>('');
  const [concludeNewDateEnd, setConcludeNewDateEnd] = useState<string>('');

  const [subjectTerm, setSubjectTerm] = useState(''); 
  const [subjectId, setSubjectId] = useState('');
  const [subjectValue, setSubjectValue] = useState('');
  const [subject, setSubject] = useState<ISelectData[]>([]);

  const [customerGroupTerm, setCustomerGroupTerm] = useState('');
  const [customerGroupId, setCustomerGroupId] = useState('');
  const [customerGroupValue, setCustomerGroupValue] = useState('');
  const [customerGroupDesc, setCustomerGroupDesc] = useState('');
  const [customerGroup, setCustomerGroup] = useState<IAutoCompleteData[]>([]);

  const [customerTerm, setCustomerTerm] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [customerDesc, setCustomerDesc] = useState('');
  const [customer, setCustomer] = useState<IAutoCompleteData[]>([]);

  const [calendarOfTerm, setCalendarOfTerm] = useState('');
  const [calendarOfId, setCalendarOfId] = useState<string|null>('');
  const [calendarOfValue, setCalendarOfValue] = useState<string|null>('');
  const [calendarOfDesc, setCalendarOfDesc] = useState<string|null>('');
  const [calendarOf, setCalendarOf] = useState<IAutoCompleteData[]>([]);

  const [responsibleTerm, setResponsibleTerm] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [responsibleValue, setResponsibleValue] = useState('');
  const [responsibleDesc, setResponsibleDesc] = useState('');
  const [responsible, setResponsible] = useState<IAutoCompleteData[]>([]);

  const [opposingTerm, setOpposingTerm] = useState('');
  const [opposingId, setOpposingId] = useState('');
  const [opposingValue, setOpposingValue] = useState('');
  const [opposingDesc, setOpposingDesc] = useState('');
  const [opposing, setOpposing] = useState<IAutoCompleteData[]>([]);

  const [matterTerm, setMatterTerm] = useState('');
  const [matterId, setMatterId] = useState('');
  const [matterValue, setMatterValue] = useState('');
  const [matterDesc, setMatterDesc] = useState('');
  const [matter, setMatter] = useState<IAutoCompleteData[]>([]);

  const [subjectReportList, setSubjectReportList] = useState<ISelectData[]>([]);
  const [stateReportList, setStateReportList] = useState<ISelectData[]>([]);
  const [filterDesc, setFilterDesc] = useState<IFilterDesc[]>([]);
  
  // When exists report id verify if is avaiable every 5 seconds
  useEffect(() => {

    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 5000);
    }
  
  },[idReportGenerate])


  // Check is report is already 
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

        if (response.data == "W")
        {
          setButtonText("Gerar Relatório");
          clearInterval(checkInterval);
          setIsGeneratingReport(false)

          addToast({
            type: "info",
            title: "Verificar filtros",
            description: "Não foram encontrados dados na agenda, verifique os filtros aplicados."
          })
        }

        if (response.data == "E"){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
          setButtonText("Gerar Relatório");
  
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

    setReportLink(response.data.des_Parametro)
    setIdReportGenerate(0)

    const newWin = window.open(`${response.data.des_Parametro}`, '_blank');

    if(!newWin || newWin.closed || typeof newWin.closed=='undefined')
      setShowReportOpenFileModal(true)
  }


  const CloseReportModal = async () => {
    setShowReportOpenFileModal(false)
    setReportLink('')
    handleCalendarReportClose()
  }


  useDelay(() => {
    if (subjectParameterTerm.length > 0){
      LoadParameterSubjects()
    }
  }, [subjectParameterTerm], 1000)


  useEffect(() => {
   
    if (caller == "calendarReportModal" && isOpenMenuReport)
    {
      setCalendarOfId(localStorage.getItem('@GoJur:userCompanyId'))
      setCalendarOfValue(localStorage.getItem('@GoJur:name'))
      setCalendarOfDesc(localStorage.getItem('@GoJur:name'))
      
      setOpenModalCalendarReport(true)
    }
  },[caller, isMenuOpen])


  // REPORT FIELDS
  useDelay(() => {
    if (subjectTerm.length > 0){
      LoadSubjects()
    }
  }, [subjectTerm], 1000)


  useDelay(() => {
    if (customerGroupTerm.length > 0){
      LoadCustomerGroup()
    }
  }, [customerGroupTerm], 1000)


  useDelay(() => {
    if (customerTerm.length > 0){
      LoadCustomer()
    }
  }, [customerTerm], 1000)


  useDelay(() => {
    if (calendarOfTerm.length > 0){
      LoadCalendarOf()
    }
  }, [calendarOfTerm], 1000)


  useDelay(() => {
    if (responsibleTerm.length > 0){
      LoadResponsible()
    }
  }, [responsibleTerm], 1000)


  useDelay(() => {
    if (opposingTerm.length > 0){
      LoadOpposing()
    }
  }, [opposingTerm], 1000)


  useDelay(() => {
    if (matterTerm.length > 0){
      LoadMatter()
    }
  }, [matterTerm], 1000)


  useEffect(() => {
    LoadSubjects('reset')
    LoadCustomerGroup()
    LoadCustomer()
    LoadCalendarOf()
    LoadResponsible()
    LoadOpposing()
    LoadMatter()
    setSubjectReportList([])
    LoadStates()
    LoadUserFilters()
  },[])
  

  // REPORT FIELDS - GET API DATA
  const LoadSubjects = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? subjectValue:subjectTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Assunto/Listar', {
        description: filter,
        token,
      });

      const listSubject: ISelectData[] = []

      response.data.map(item => {
        return listSubject.push({
          id: item.id,
          label: item.value
        })
      })
      
      setSubject(listSubject)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadCustomerGroup = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? customerGroupValue:customerGroupTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Clientes/ListarGrupoClientes', {
        description: filter,
        token,
      });

      const listCustomerGroup: IAutoCompleteData[] = []

      response.data.map(item => {
        return listCustomerGroup.push({
          id: item.id,
          label: item.value
        })
      })
      
      setCustomerGroup(listCustomerGroup)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadCustomer = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? customerValue:customerTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Clientes/ListarComboBox', {
        filterClause: filter,
        rows: 50,
        token,
      });

      const listCustomer: IAutoCompleteData[] = []

      response.data.map(item => {
        return listCustomer.push({
          id: item.id,
          label: item.value
        })
      })
      
      setCustomer(listCustomer)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadCalendarOf = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? calendarOfValue:calendarOfTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Usuario/ListarUsuarios', {
        userName: filter,
        removeCurrentUser: false,
        token,
      });

      const listCalendarOf: IAutoCompleteData[] = []

      response.data.map(item => {
        return listCalendarOf.push({
          id: item.id,
          label: item.value
        })
      })
      
      setCalendarOf(listCalendarOf)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadResponsible = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? responsibleValue:responsibleTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Usuario/ListarUsuarios', {
        userName: filter,
        removeCurrentUser: false,
        token,
      });

      const listResponsible: IAutoCompleteData[] = []

      response.data.map(item => {
        return listResponsible.push({
          id: item.id,
          label: item.value
        })
      })
      
      setResponsible(listResponsible)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadOpposing = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? opposingValue:opposingTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Contrario/ListarPorNome', {
        filterDesc: filter,
        token,
      });

      const listOpposing: IAutoCompleteData[] = []

      response.data.map(item => {
        return listOpposing.push({
          id: item.id,
          label: item.value
        })
      })
      
      setOpposing(listOpposing)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadMatter = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? matterValue:matterTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Processo/ListarCombo', {
        filterClause: filter,
        token,
      });

      const listMatter: IAutoCompleteData[] = []

      response.data.map(item => {
        return listMatter.push({
          id: item.id,
          label: item.value
        })
      })
      
      setMatter(listMatter)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const LoadStates = async () => {

    try {
      const response = await api.post('/Estados/Listar', {
        token
      });

      const listStates: IAutoCompleteData[] = []

      response.data.map(item => {
        return listStates.push({
          id: item.id,
          label: item.value
        })
      })
      
      setStates(listStates)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  // REPORT FIELDS - CHANGE
  const handleSubjectSelected = (item) => { 
      
    if (item){
      setSubjectValue(item.label)
      setSubjectId(item.id)
      handleListItemSubject(item)
    }else{
      setSubjectValue('')
      LoadSubjects('reset')
      setSubjectId('')
    }
  }


  const handleListItemSubject = (subject) => {

    // if is already add on list return false
    const existItem = subjectReportList.filter(item => item.id === subject.id);
    if (existItem.length > 0){
      return;
    }

    subjectReportList.push(subject)
    setSubjectReportList(subjectReportList)
  }


  const handleRemoveItemSubject = (subject) => {

    const subjectListUpdate = subjectReportList.filter(item => item.id != subject.id);
    setSubjectReportList(subjectListUpdate)
  }


  const handleCustomerGroupSelected = (item) => { 
      
    if (item){
      setCustomerGroupValue(item.label)
      setCustomerGroupId(item.id)
      setCustomerGroupDesc(item.label)
    }else{
      setCustomerGroupValue('')
      LoadCustomerGroup('reset')
      setCustomerGroupId('')
    }
  }


  const handleCustomerSelected = (item) => { 
      
    if (item){
      setCustomerValue(item.label)
      setCustomerId(item.id)
      setCustomerDesc(item.label)
    }else{
      setCustomerValue('')
      LoadCustomer('reset')
      setCustomerId('')
    }
  }


  const handleCalendarOfSelected = (item) => { 
      
    if (item){
      setCalendarOfValue(item.label)
      setCalendarOfId(item.id)
      setCalendarOfDesc(item.label)
    }else{
      setCalendarOfValue('')
      LoadCalendarOf('reset')
      setCalendarOfId('')
    }
  }


  const handleResponsibleSelected = (item) => { 
      
    if (item){
      setResponsibleValue(item.label)
      setResponsibleId(item.id)
      setResponsibleDesc(item.label)
    }else{
      setResponsibleValue('')
      LoadResponsible('reset')
      setResponsibleId('')
    }
  }


  const handleOpposingSelected = (item) => { 
      
    if (item){
      setOpposingValue(item.label)
      setOpposingId(item.id)
      setOpposingDesc(item.label)
    }else{
      setOpposingValue('')
      LoadOpposing('reset')
      setOpposingId('')
    }
  }


  const handleMatterSelected = (item) => { 
      
    if (item){
      setMatterValue(item.label)
      setMatterId(item.id)
      setMatterDesc(item.label)
    }else{
      setMatterValue('')
      LoadMatter('reset')
      setMatterId('')
    }
  }


  const LoadParameterSubjects = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? subjectParameterValue:subjectParameterTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ISubject[]>('/Assunto/ListarPorParametros', {
        description: filter,
        token,
      });

      const listSubject: ISelectData[] = []

      response.data.map(item => {
        return listSubject.push({
          id: item.id,
          label: item.value
        })
      })
      
      setSubjectParameter(listSubject)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  // REPORT CLOSE
  const handleCalendarReportClose = () => { 
    setOpenModalCalendarReport(false)
    handleCaller("")
    handleIsMenuOpen(false)
    ResetReportStates()
    handleIsOpenMenuReport(false)
  }


  const [buttonText, setButtonText] = useState("Gerar Relatório");
  const changeText = (text) => setButtonText(text);


  // GENERATE REPORT
  const handleGenerateReport = useCallback(async() => {

    if (isGeneratingReport){
      return;
    }

    try {
      const token = localStorage.getItem('@GoJur:token');
      
      setIsGeneratingReport(true)   

      let subjectdListItens = 'assunto=';
      subjectReportList.map((subject) => {
        return subjectdListItens += `${subject.id}-`
      })

      let subjectdListItensDesc = '';
      subjectReportList.map((subject) => {
        return subjectdListItensDesc += `${subject.label},`
      })

      let stateListItens = 'state=';
      stateReportList.map((state) => {
        return stateListItens += `${state.id}-`
      })

      let stateListItensDesc = '';
      stateReportList.map((state) => {
        return stateListItensDesc += `${state.label},`
      })

      let statesListItens = 'state=';
      stateReportList.map((state) => {
        return statesListItens += `${state.id}-`
      })

      let statesListItensDesc = '';
      stateReportList.map((state) => {
        return statesListItensDesc += `${state.label},`
      })

      const response = await api.post('/Compromisso/GerarRelatorio', {
        subjectId: subjectdListItens,
        customerGroupId,
        customerId,
        calendarUserId: calendarOfId,
        responsibleId,
        opposingId,
        matterId,
        period: reportPeriodId,
        situation: reportSituationId,
        state: stateListItens,
        layout: reportLayoutId,
        startDate: appointmentDateBeggin,
        endDate: appointmentDateEnd,
        token,
        filterDescription: "",
        subjectDesc: subjectdListItensDesc,
        customerGroupDesc,
        customerDesc,
        calendarUserDesc: calendarOfDesc,
        responsibleDesc,
        opposingDesc,
        matterDesc,
        stateDesc: stateListItensDesc,
        includePeriod: reportIncludeId,
        includeStartDate: includeNewDate,
        includeEndDate: includeNewDateEnd,
        concludePeriod: reportConcludeId,
        concludeStartDate: concludeNewDate,
        concludeEndDate: concludeNewDateEnd
      })
      
      setIdReportGenerate(response.data)

    } catch (err: any) {
      setIsGeneratingReport(false)    
      addToast({
        type: "info",
        title: "Falha ao gerar o relatório",
        description: err.response.data.Message
      })
    }
  },[addToast, subjectId, customerGroupId, customerId, calendarOfId, responsibleId, opposingId, matterId, reportPeriodId, reportSituationId, reportStateId, reportLayoutId, customerGroupDesc, customerDesc, calendarOfDesc, responsibleDesc, opposingDesc, matterDesc, subjectReportList, stateReportList, appointmentDateBeggin, appointmentDateEnd, reportIncludeId, includeNewDate, includeNewDateEnd, reportConcludeId, concludeNewDate, concludeNewDateEnd]); 


  const handleNewDateBeggin = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAppointmentDateBeggin(event.target.value);
    },
    [],
  );


  const handleIncludeNewDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setIncludeNewDate(event.target.value);
    },
    [],
  );


  const handleConcludeNewDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setConcludeNewDate(event.target.value);
    },
    [],
  );


  const handleNewDateEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAppointmentDateEnd(event.target.value);
    },
    [],
  );


  const handleIncludeNewDateEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setIncludeNewDateEnd(event.target.value);
    },
    [],
  );


  const handleConcludeNewDateEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setConcludeNewDateEnd(event.target.value);
    },
    [],
  );


  const handleChangePeriodSelect = (item) => {
    setReportPeriodId(item.target.value)
    setPeriodId(item.target.value)
    setReportPeriodValue(item.target.children[item.target.selectedIndex].label)
  };


  const handleChangeIncludeSelect = (item) => {
    setReportIncludeId(item.target.value)
    setIncludeId(item.target.value)
    setReportIncludeValue(item.target.children[item.target.selectedIndex].label)

    setReportPeriodId('all')
    setPeriodId('all')
    setReportPeriodValue('Todo o Período')

    setCalendarOfTerm('')
    setCalendarOfDesc('')
    setCalendarOfId('')
    setCalendarOfValue('')
  };


  const handleChangeConcludeSelect = (item) => {
    setReportConcludeId(item.target.value)
    setConcludeId(item.target.value)
    setReportConcludeValue(item.target.children[item.target.selectedIndex].label)

    setReportPeriodId('all')
    setPeriodId('all')
    setReportPeriodValue('Todo o Período')

    setCalendarOfTerm('')
    setCalendarOfDesc('')
    setCalendarOfId('')
    setCalendarOfValue('')
  };


  const handleChangeSituationSelect = (item) => {
    setReportSituationId(item.target.value)
    setSituationId(item.target.value)
    setReportSituationValue(item.target.children[item.target.selectedIndex].label)
  };


  const handleStateSelected = (item) => { 
    setReportStateId(item.target.value)
    setReportStateValue(item.target.children[item.target.selectedIndex].label)
    handleListItemState(item)
  }


  const handleListItemState = (state) => {

    // if is already add on list return false
    const existItem = stateReportList.filter(item => item.id === state.target.value);
    if (existItem.length > 0){
      return;
    }

    const stateObject = {
      label:state.target.children[state.target.selectedIndex].label,
      id: state.target.value
    }

    stateReportList.push(stateObject)
    setStateReportList(stateReportList)
  }


  const handleRemoveItemState = (state) => {

    const stateListUpdate = stateReportList.filter(item => item.id != state.id);
    setStateReportList(stateListUpdate)
  }


  const handleChangeLayoutSelect = (item) => {
    setReportLayoutId(item.target.value)
    setLayoutId(item.target.value)
    setReportLayoutValue(item.target.children[item.target.selectedIndex].label)
  };


  const handleRemoveItemFilterDesc = (desc) => {

    const filterUpdate = filterDesc.filter(item => item.desc != desc);
    setFilterDesc(filterUpdate)
  }


  const ResetReportStates = () => {
    setDescription('');
    setFavoriteCalendarUserFilterId('');
    
    setAppointmentDateBeggin('');
    setAppointmentDateEnd('');

    setIncludeNewDate('');
    setIncludeNewDateEnd('');

    setConcludeNewDate('');
    setConcludeNewDateEnd('');

    setSubjectTerm('');
    setSubjectId('');
    setSubjectValue('');

    setCustomerGroupTerm('');
    setCustomerGroupDesc('');
    setCustomerGroupId('');
    setCustomerGroupValue('');

    setCustomerTerm('');
    setCustomerDesc('');
    setCustomerId('');
    setCustomerValue('');

    setCalendarOfTerm('');
    setCalendarOfDesc('');
    setCalendarOfId('');
    setCalendarOfValue('');

    setResponsibleTerm('');
    setResponsibleDesc('');
    setResponsibleId('');
    setResponsibleValue('');

    setOpposingTerm('');
    setOpposingDesc('');
    setOpposingId('');
    setOpposingValue('');

    setMatterTerm('');
    setMatterDesc('');
    setMatterId('');
    setMatterValue('');
    
    setSubjectReportList([]);
    setStateReportList([]);

    setPeriodId('currentWeek')
    setReportPeriodId('currentWeek');
    setReportPeriodValue('Semana Atual');

    setIncludeId('includeSelecione')
    setReportIncludeId('includeSelecione');
    setReportIncludeValue('Selecione...');

    setConcludeId('concludeSelecione')
    setReportConcludeId('concludeSelecione');
    setReportConcludeValue('Selecione...');

    setSituationId('both')
    setReportSituationId('both');
    setReportSituationValue('Ambos');

    setLayoutId('pdf')
    setReportLayoutId('pdf')
    setReportLayoutValue('PDF')

    setStateId('0');
    setReportStateId('');
    setReportStateValue('');

    changeText('Gerar Relatório')
    setIsGeneratingReport(false)
  };


  // MODAL FILTER
  const LoadUserFilters = async () => {

    try {
      const response = await api.post<ISubject[]>('/Compromisso/ListarFiltrosPorUsuario', {
        token
      });

      const listFilter: ISelectData[] = []

      response.data.map(item => {
        return listFilter.push({
          id: item.id,
          label: item.value
        })
      })
      
      setFilterList(listFilter)
      
    } catch (err) {
      console.log(err);
    }
  }


  const handleRemoveItemFilter = async (filter) => {

    try {
      const response = await api.post<ISubject[]>('/Compromisso/ApagarFiltros', {
        favoriteCalendarUserFilterId: filter.id,
        token
      });

      ResetReportStates()
      const filterListUpdate = filterList.filter(item => item.id != filter.id);
      setFilterList(filterListUpdate)
    
      addToast({
        type: "success",
        title: "Filtro apagado",
        description: "O filtro foi apagado no sistema."
      })
      
    } catch (err) {
      console.log(err);
    }
  }


  const handleApplyItemFilter = useCallback(async (filter) => {

    ResetReportStates()

    try {
      const response = await api.post('/Compromisso/ObterFiltrosPorUsuario', {
        favoriteCalendarUserFilterId: filter.id,
        token
      });

      setFavoriteCalendarUserFilterId(response.data.favoriteCalendarReportFilterIdDTO.id)

      if (response.data.customerGroupDTO != null)
      {
        setCustomerGroupId(response.data.customerGroupDTO.id)
        setCustomerGroupValue(response.data.customerGroupDTO.value)
      }
      
      if (response.data.customerDTO != null)
      {
        setCustomerId(response.data.customerDTO.id)
        setCustomerValue(response.data.customerDTO.value)  
      }

      if (response.data.calendarUserDTO != null)
      {
        setCalendarOfId(response.data.calendarUserDTO.id)
        setCalendarOfValue(response.data.calendarUserDTO.value)  
      }

      if (response.data.responsibleUserDTO != null)
      {
        setResponsibleId(response.data.responsibleUserDTO.id)
        setResponsibleValue(response.data.responsibleUserDTO.value)  
      }

      if (response.data.opposingDTO != null)
      {
        setOpposingId(response.data.opposingDTO.id)
        setOpposingValue(response.data.opposingDTO.value)  
      }

      if (response.data.matterDTO != null)
      {
        setMatterId(response.data.matterDTO.id)
        setMatterValue(response.data.matterDTO.value)  
      }

      if (response.data.situationDTO != null)
      {
        setReportSituationId(response.data.situationDTO.id)
        setReportSituationValue(response.data.situationDTO.value)  
        setSituationId(response.data.situationDTO.id)
      }

      if (response.data.layoutDTO != null)
      {
        setReportLayoutId(response.data.layoutDTO.id)
        setReportLayoutValue(response.data.layoutDTO.value)  
        setLayoutId(response.data.layoutDTO.id)
      }

      if (response.data.periodDTO != null)
      {
        setReportPeriodId(response.data.periodDTO.id)
        setReportPeriodValue(response.data.periodDTO.value)  
        setPeriodId(response.data.periodDTO.id)
      }

      if (response.data.includePeriodDTO != null)
      {
        setReportIncludeId(response.data.includePeriodDTO.id)
        setReportIncludeValue(response.data.includePeriodDTO.value)  
        setIncludeId(response.data.includePeriodDTO.id)
      }

      if (response.data.concludePeriodDTO != null)
      {
        setReportConcludeId(response.data.concludePeriodDTO.id)
        setReportConcludeValue(response.data.concludePeriodDTO.value)  
        setConcludeId(response.data.concludePeriodDTO.id)
      }
      
      if (response.data.startDateDTO != null)
      {
        setAppointmentDateBeggin(FormatDate(new Date(response.data.startDateDTO), 'yyyy-MM-dd'))  
      }

      if (response.data.includeStartDateDTO != null)
      {
        setIncludeNewDate(FormatDate(new Date(response.data.includeStartDateDTO), 'yyyy-MM-dd'))  
      }

      if (response.data.concludeStartDateDTO != null)
      {
        setConcludeNewDate(FormatDate(new Date(response.data.concludeStartDateDTO), 'yyyy-MM-dd'))  
      }
      
      if (response.data.endDateDTO != null)
      {
        setAppointmentDateEnd(FormatDate(new Date(response.data.endDateDTO), 'yyyy-MM-dd'))  
      }

      if (response.data.includeEndDateDTO != null)
      {
        setIncludeNewDateEnd(FormatDate(new Date(response.data.includeEndDateDTO), 'yyyy-MM-dd'))  
      }

      if (response.data.concludeEndDateDTO != null)
      {
        setConcludeNewDateEnd(FormatDate(new Date(response.data.concludeEndDateDTO), 'yyyy-MM-dd'))  
      }

      if (response.data.calendarSubjectDTO != null)
      {
        const newData: ISelectData[] = []
        response.data.calendarSubjectDTO.map(item => {
          return newData.push({
            id: item.id,
            label: item.value
          })
        })
        
        setSubjectReportList(newData)
      }
      
      if(response.data.stateDTO != null)
      {
        const newData: ISelectData[] = []
        response.data.stateDTO.map(item => {
          return newData.push({
            id: item.id,
            label: item.value
          })
        })
        
        setStateReportList(newData)
      }
      
    } catch (err) {
      console.log(err);
    }

  },[subjectId, customerGroupId, customerId, calendarOfId, responsibleId, opposingId, matterId, reportPeriodId, reportSituationId, reportStateId, reportLayoutId, customerGroupDesc, customerDesc, calendarOfDesc, responsibleDesc, opposingDesc, matterDesc, description, subjectReportList, stateReportList])


  const handleModalFilter = (item) => {

    if(favoriteCalendarUserFilterId == ""){
      setOpenModalFilter(true)
    }
    else{
      handleSaveFilter()
    }
    
  };


  const handleModalFilterClose = () => {
    setDescription('')
    setOpenModalFilter(false)
  };


  const handleSaveFilter = useCallback(async() => {

    try {
      
      const token = localStorage.getItem('@GoJur:token');
      
      let subjectdListItens = 'subject=';
      subjectReportList.map((subject) => {
        return subjectdListItens += `${subject.id}-`
      })

      let stateListItens = 'state=';
      stateReportList.map((state) => {
        return stateListItens += `${state.id}:${state.label}-`
      })

      const response = await api.post('/Compromisso/SalvarFiltros', {
        favoriteCalendarUserFilterId,
        userCustomReportFilterName: description,
        subjectId: subjectdListItens,
        customerGroupId,
        customerId,
        calendarUserId: calendarOfId,
        responsibleId,
        opposingId,
        matterId,
        period: reportPeriodId,
        situation: reportSituationId,
        state: stateListItens,
        layout: reportLayoutId,
        startDate: appointmentDateBeggin,
        endDate: appointmentDateEnd,
        includePeriod: reportIncludeId,
        includeStartDate: includeNewDate,
        includeEndDate: includeNewDateEnd,
        concludePeriod: reportConcludeId,
        concludeStartDate: concludeNewDate,
        concludeEndDate: concludeNewDateEnd,
        token
      })
      
      addToast({
        type: "success",
        title: "Filtro salvo",
        description: "O filtro foi salvo no sistema"
      })

      handleModalFilterClose()
      LoadUserFilters()
      ResetReportStates()

    } catch (err: any) {
      setIsGeneratingReport(false)    
      addToast({
        type: "info",
        title: "Falha ao salvar filtro",
        description: err.response.data.Message
      })
    }
  },[addToast, subjectId, customerGroupId, customerId, calendarOfId, responsibleId, opposingId, matterId, reportPeriodId, reportSituationId, reportStateId, reportLayoutId, customerGroupDesc, customerDesc, calendarOfDesc, responsibleDesc, opposingDesc, matterDesc, description, subjectReportList, stateReportList, appointmentDateBeggin, appointmentDateEnd, reportIncludeId, includeNewDate, includeNewDateEnd, reportConcludeId, concludeNewDate, concludeNewDateEnd]); 


  return (
    <>
      <div>
        {!isMOBILE && (
          <ModalReport show={openModalCalendarReport}>
            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Selecione um ou mais filtros para relatório de compromissos
              <br /><br />

              <div style={{float:'left', width:'45%'}}>

                <AutoCompleteSelect className="selectSubject">
                  <p>Assunto</p>  
                  <Select
                    isSearchable   
                    value={subject.filter(options => options.id == subjectId)}
                    onChange={handleSubjectSelected}
                    onInputChange={(term) => setSubjectTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={subject}
                  />
                </AutoCompleteSelect>
                
                <ItemList>

                  {subjectReportList.map(item => {
                    return (
                      <span>
                        {item.label}
                        <p className="buttonLinkClick" onClick={() => handleRemoveItemSubject(item)}> 
                          Excluir
                        </p> 
                      </span>
                    )
                  })} 

                </ItemList>

                <AutoCompleteSelect className="selectCustomerGroup">
                  <p>Grupo Cliente</p>  
                  <Select
                    isSearchable   
                    value={customerGroup.filter(options => options.id == customerGroupId)}
                    onChange={handleCustomerGroupSelected}
                    onInputChange={(term) => setCustomerGroupTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={customerGroup}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectCustomer">
                  <p>Cliente</p>  
                  <Select
                    isSearchable   
                    value={customer.filter(options => options.id == customerId)}
                    onChange={handleCustomerSelected}
                    onInputChange={(term) => setCustomerTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={customer}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectCalendarOf">
                  <p>Agenda de</p>  
                  <Select
                    isSearchable   
                    value={calendarOf.filter(options => options.id == calendarOfId)}
                    onChange={handleCalendarOfSelected}
                    onInputChange={(term) => setCalendarOfTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={calendarOf}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectResponsible">
                  <p>Responsável</p>  
                  <Select
                    isSearchable   
                    value={responsible.filter(options => options.id == responsibleId)}
                    onChange={handleResponsibleSelected}
                    onInputChange={(term) => setResponsibleTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={responsible}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectOpposing">
                  <p>Contrário</p>  
                  <Select
                    isSearchable   
                    value={opposing.filter(options => options.id == opposingId)}
                    onChange={handleOpposingSelected}
                    onInputChange={(term) => setOpposingTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={opposing}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectMatter">
                  <p>Processos</p>  
                  <Select
                    isSearchable   
                    value={matter.filter(options => options.id == matterId)}
                    onChange={handleMatterSelected}
                    onInputChange={(term) => setMatterTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={matter}
                  />
                </AutoCompleteSelect>
              </div>

              <div style={{float:'right', width:'45%'}}>
                <label htmlFor="type">
                  Período
                  <br />
                  <select 
                    name="userType"
                    value={periodId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangePeriodSelect(e)}
                  >
                    {periodOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />
                {reportPeriodId === 'custom' && (
                <>
                  <div style={{width:'50%', float:'left'}}>
                    <DatePicker title="Data Inicio" value={appointmentDateBeggin} onChange={handleNewDateBeggin} />
                  </div>
                  <div style={{width:'50%', float:'right', marginRight:'-10px'}}>
                    <DatePicker title="Data Final" value={appointmentDateEnd} onChange={handleNewDateEnd} />
                  </div>
                  <br /><br /><br /><br />
                </>
                )}

                <label htmlFor="type">
                  Compromisso Incluído em
                  <br />
                  <select 
                    name="userType"
                    value={includeId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeIncludeSelect(e)}
                  >
                    {includeOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />
                {reportIncludeId === 'includeCustom' && (
                <>
                  <div style={{width:'50%', float:'left'}}>
                    <DatePicker title="Data Inicio" value={includeNewDate} onChange={handleIncludeNewDate} />
                  </div>
                  <div style={{width:'50%', float:'right', marginRight:'-10px'}}>
                    <DatePicker title="Data Final" value={includeNewDateEnd} onChange={handleIncludeNewDateEnd} />
                  </div>
                  <br /><br /><br /><br />
                </>
                )}

                <label htmlFor="type">
                  Compromisso Concluído em
                  <br />
                  <select 
                    name="userType"
                    value={concludeId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeConcludeSelect(e)}
                  >
                    {concludeOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />
                {reportConcludeId === 'concludeCustom' && (
                <>
                  <div style={{width:'50%', float:'left'}}>
                    <DatePicker title="Data Inicio" value={concludeNewDate} onChange={handleConcludeNewDate} />
                  </div>
                  <div style={{width:'50%', float:'right', marginRight:'-10px'}}>
                    <DatePicker title="Data Final" value={concludeNewDateEnd} onChange={handleConcludeNewDateEnd} />
                  </div>
                  <br /><br /><br /><br />
                </>
                )}
                  
                <label htmlFor="type">
                  Situação
                  <br />
                  <select 
                    name="userType"
                    value={situationId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeSituationSelect(e)}
                  >
                    {situationOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />

                <label htmlFor="type">
                  Estado
                  <br />
                  <select 
                    name="userType"
                    value={stateId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleStateSelected(e)}
                  >
                    <option value="0">Selecione</option>

                    {states.map((option, i) => (
                      <option
                        key={option.id}
                        value={option.id}
                      >
                        {option.label}
                      </option>
                      ))}
                  </select>
                </label>

                <ItemList>

                  {stateReportList.map(item => {
                    return (
                      <span>
                        {item.label}
                        <p className="buttonLinkClick" onClick={() => handleRemoveItemState(item)}> 
                          Excluir
                        </p> 
                      </span>
                    )
                  })} 

                </ItemList>
                <br /><br />

                <label htmlFor="type">
                  Layout
                  <br />
                  <select 
                    name="userType"
                    value={layoutId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeLayoutSelect(e)}
                  >
                    {layoutOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <br />

              <div style={{float:'right', marginRight:'-20px', marginBottom:'20px', width:'100%'}}>
                <div style={{float:'right', marginRight:'68px'}}>
                  <button 
                    className="buttonLinkClick" 
                    title="Salvar os filtros de relatório."
                    onClick={(e) => handleModalFilter(e)}
                    type="submit"
                  >
                    Salvar filtro
                  </button>
                </div>

                <br />
                <br />
                            
                <div style={{float:'right', width:'150px', marginRight:'30px'}}>
                  <button 
                    type='button'
                    className="buttonClick"
                    onClick={() => handleCalendarReportClose()}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>

                <div style={{float:'right'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=>{ handleGenerateReport(); changeText("Gerando Relatório ") }}
                    title="Clique para gerar o relatório de compromissos"
                  >
                    <FiSave />
                    {buttonText}
                    {isGeneratingReport && <Loader size={5} color="var(--orange)" /> }
                  </button>
                </div>
              </div>

              <div style={{float:'left', width:'100%', marginBottom:'40px', borderTop:'1px solid blue', marginTop:'10px'}}>
                <br />
                Meus relatórios

                <button 
                  className="buttonLinkClick" 
                  title="Limpar os filtros de relatório."
                  onClick={(e) => ResetReportStates()}
                  type="submit"
                >
                  &nbsp;&nbsp;&nbsp;Limpar filtros
                </button>

                <br />
                <br />
                
                {filterList.map(item => {
                  return (
                    <span style={{display:'flex'}}>
                      <p className="buttonLinkClick" onClick={() => handleApplyItemFilter(item)}> 
                        {item.label}
                      </p>
                      &nbsp;&nbsp;&nbsp;
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemFilter(item)}> 
                        [Excluir]
                      </p> 
                    </span>
                  )
                })}

              </div>
            </div>          
          </ModalReport>
        )}

        <ModalFilter show={openModalFilter}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Nome do filtro
              <br />
              <input 
                type="text"
                value={description}
                name="descricao"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            
            <br /><br /><br />

            <div style={{float:'right', marginRight:'30px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> handleSaveFilter()}
                >
                  <FiSave />
                  Salvar
                </button>
              </div>
                        
              <div style={{float:'left', width:'150px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleModalFilterClose()}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalFilter>

        {isMOBILE && (
          <ModalReportMobile show={openModalCalendarReport}>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              
              Selecione um ou mais filtros para relatório de compromissos

              <br />
              <br />

              <div style={{float:'left', width:'45%'}}>

                <AutoCompleteSelect className="selectSubject">
                  <p>Assunto</p>  
                  <Select
                    isSearchable   
                    value={subject.filter(options => options.id == subjectId)}
                    onChange={handleSubjectSelected}
                    onInputChange={(term) => setSubjectTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={subject}
                  />
                </AutoCompleteSelect>
                
                <ItemList>

                  {subjectReportList.map(item => {
                    return (
                      <span>
                        {item.label}
                        <p className="buttonLinkClick" onClick={() => handleRemoveItemSubject(item)}> 
                          Excluir
                        </p> 
                      </span>
                    )
                  })} 

                </ItemList>

                <AutoCompleteSelect className="selectCustomerGroup">
                  <p>Grupo Cliente</p>  
                  <Select
                    isSearchable   
                    value={customerGroup.filter(options => options.id == customerGroupId)}
                    onChange={handleCustomerGroupSelected}
                    onInputChange={(term) => setCustomerGroupTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={customerGroup}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectCustomer">
                  <p>Cliente</p>  
                  <Select
                    isSearchable   
                    value={customer.filter(options => options.id == customerId)}
                    onChange={handleCustomerSelected}
                    onInputChange={(term) => setCustomerTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={customer}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectCalendarOf">
                  <p>Agenda de</p>  
                  <Select
                    isSearchable   
                    value={calendarOf.filter(options => options.id == calendarOfId)}
                    onChange={handleCalendarOfSelected}
                    onInputChange={(term) => setCalendarOfTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={calendarOf}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectResponsible">
                  <p>Responsável</p>  
                  <Select
                    isSearchable   
                    value={responsible.filter(options => options.id == responsibleId)}
                    onChange={handleResponsibleSelected}
                    onInputChange={(term) => setResponsibleTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={responsible}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectOpposing">
                  <p>Contrário</p>  
                  <Select
                    isSearchable   
                    value={opposing.filter(options => options.id == opposingId)}
                    onChange={handleOpposingSelected}
                    onInputChange={(term) => setOpposingTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={opposing}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectMatter">
                  <p>Processos</p>  
                  <Select
                    isSearchable   
                    value={matter.filter(options => options.id == matterId)}
                    onChange={handleMatterSelected}
                    onInputChange={(term) => setMatterTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={matter}
                  />
                </AutoCompleteSelect>
              </div>

              <div style={{float:'right', width:'45%'}}>

                <label htmlFor="type">
                  Período
                  <br />
                  <select 
                    name="userType"
                    value={periodId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangePeriodSelect(e)}
                  >
                    {periodOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />
                {reportPeriodId === 'custom' && (
                <>
                  <DatePicker
                    title="Data Inicio"
                    onChange={handleNewDateBeggin}
                    value={appointmentDateBeggin}
                  />

                  <DatePicker
                    title="Data Final"
                    onChange={handleNewDateEnd}
                    value={appointmentDateEnd}
                  />
                  <br />
                  <br />
                </>
                )}

                <label htmlFor="type">
                  Compromisso Incluído em
                  <br />
                  <select 
                    name="userType"
                    value={includeId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeIncludeSelect(e)}
                  >
                    {includeOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />
                {reportIncludeId === 'includeCustom' && (
                <>
                  <DatePicker
                    title="Data Inicio"
                    onChange={handleIncludeNewDate}
                    value={includeNewDate}
                  />

                  <DatePicker
                    title="Data Final"
                    onChange={handleIncludeNewDateEnd}
                    value={includeNewDateEnd}
                  />
                  <br /><br /><br /><br />
                </>
                )}

                <label htmlFor="type">
                  Compromisso Concluído em
                  <br />
                  <select 
                    name="userType"
                    value={concludeId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeConcludeSelect(e)}
                  >
                    {concludeOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
                <br /><br />
                {reportConcludeId === 'concludeCustom' && (
                <>
                  <DatePicker
                    title="Data Inicio"
                    onChange={handleConcludeNewDate}
                    value={concludeNewDate}
                  />

                  <DatePicker
                    title="Data Final"
                    onChange={handleConcludeNewDateEnd}
                    value={concludeNewDateEnd}
                  />
                  <br /><br /><br /><br />
                </>
                )}
                  
                <label htmlFor="type">
                  Situação
                  <br />
                  <select 
                    name="userType"
                    value={situationId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeSituationSelect(e)}
                  >
                    {situationOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>

                <br />
                <br />

                <label htmlFor="type">
                  Estado
                  <br />
                  <select 
                    name="userType"
                    value={stateId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleStateSelected(e)}
                  >
                    <option value="0">Selecione</option>

                    {states.map((option, i) => (
                      <option
                        key={option.id}
                        value={option.id}
                      >
                        {option.label}
                      </option>
                      ))}
                  </select>
                </label>

                <ItemList>

                  {stateReportList.map(item => {
                    return (
                      <span>
                        {item.label}
                        <p className="buttonLinkClick" onClick={() => handleRemoveItemState(item)}> 
                          Excluir
                        </p> 
                      </span>
                    )
                  })} 

                </ItemList>

                <br />
                <br />

                <label htmlFor="type">
                  Layout
                  <br />
                  <select 
                    name="userType"
                    value={layoutId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeLayoutSelect(e)}
                  >
                    {layoutOptions.map(ol => (
                      <option key={ol.key} value={ol.key}>
                        {ol.value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <br />

              <div style={{float:'right', marginRight:'-20px', marginBottom:'20px', width:'100%'}}>
                <div style={{float:'right', marginRight:'68px'}}>
                  <button 
                    className="buttonLinkClick" 
                    title="Salvar os filtros de relatório."
                    onClick={(e) => handleModalFilter(e)}
                    type="submit"
                  >
                    Salvar filtro
                  </button>
                </div>

                <br />
                <br />
                            
                <div style={{float:'right', width:'150px', marginRight:'30px'}}>
                  <button 
                    type='button'
                    className="buttonClick"
                    onClick={() => handleCalendarReportClose()}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>

                <div style={{float:'right'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=>{ handleGenerateReport(); changeText("Gerando Relatório ") }}
                    title="Clique para gerar o relatório de compromissos"
                  >
                    <FiSave />
                    {buttonText}
                    {isGeneratingReport && <Loader size={5} color="var(--orange)" /> }
                  </button>
                </div>
              </div>

              <div style={{float:'left', width:'100%', marginBottom:'40px', borderTop:'1px solid blue', marginTop:'10px'}}>
                <br />
                Meus relatórios

                <button 
                  className="buttonLinkClick" 
                  title="Limpar os filtros de relatório."
                  onClick={(e) => ResetReportStates()}
                  type="submit"
                >
                  &nbsp;&nbsp;&nbsp;Limpar filtros
                </button>

                <br />
                <br />
                
                {filterList.map(item => {
                  return (
                    <span style={{display:'flex'}}>
                      <p className="buttonLinkClick" onClick={() => handleApplyItemFilter(item)}> 
                        {item.label}
                      </p>
                      &nbsp;&nbsp;&nbsp;
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemFilter(item)}> 
                        [Excluir]
                      </p> 
                    </span>
                  )
                })}

              </div>

            </div>          

          </ModalReportMobile>
        )}

        {(showReportOpenFileModal) && <ReportModal callbackFunction={{CloseReportModal, reportLink}} /> }

      </div>
    </>
  );
};

export default CalendarReport;
