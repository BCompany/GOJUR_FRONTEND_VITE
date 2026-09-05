import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FiPlus, FiTrash2, FiClock, FiLayout, FiX, FiCheck, FiEdit2, FiEdit } from 'react-icons/fi';
import { MdPalette, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { FcSearch } from 'react-icons/fc';
import Search from 'components/Search';
import { HeaderPage } from 'components/HeaderPage';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { FormatDate, useDelay } from 'Shared/utils/commonFunctions';
import { IComboData } from 'pages/Dashboard/MainViewContent/pages/Financeiro/Account/Modal';
import { useModal } from 'context/modal';
import { v4 as uuidv4 } from 'uuid';
import FilterCalendar, { ISelectValues } from 'components/FilterCalendar';
import api from 'services/api';
import {AddCardButton, AddPhaseColumn, AppointmentCard, BoardLayout, CardsList, ColorDot,ColorPickerWrapper,Container,Content,EmptyState,KanbanArea,ModalOverlay,PanelItem,PanelsModal,TaskBar, PhaseColumn, PhaseHeader} from './styles';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import Loader from 'react-spinners/ClipLoader';
import { IParameterData } from '../Matter/Interfaces/IMatter';
import { ICard, IPanel, IPhase, IPhasePagination, PHASE_COLORS } from './IKanban';
import MenuItem from '@material-ui/core/MenuItem';
import { BiCalendarCheck, BiCalendarEdit } from 'react-icons/bi';
import { Menu } from '@material-ui/core';
import { AppointmentPropsSave } from '../Interfaces/ICalendar';
import { format } from 'date-fns';
import { selectedDayProps, selectedWeekProps } from '../Dashboard/resorces/DashboardComponents/CreateAppointment/Interfaces/ICalendar';
import { dayRecurrence, weekRecurrence } from '../Dashboard/resorces/DashboardComponents/CreateAppointment/ListValues/List';

export default function AgendaKanban() {
  const history = useHistory();

  const token = localStorage.getItem('@GoJur:token');

  const [multiFilter1, setMultiFilter1] = useState<string[]>([]);
  const [multiFilter, setMultiFilter] = useState<{ value: string; label: string }[]>([]);
  const [optionsSubject, setOptionsSubject] = useState<ISelectValues[]>([]);
  const [appointmentSubject, setAppointmentSubject] = useState('');
  const [currentKanbanStageId, setCurrentKanbanStageId] = useState<number>();
  const [currentAppointmentEdit, setCurrentAppointmentEdit] = useState<number>();
  const [appointmentSubjectId, setAppointmentSubjectId] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState<ISelectValues>();
  const [loadEvents, setLoadEvents] = useState(false);
  const [showSearchList] = useState(false);
  const [phasePagination, setPhasePagination] = useState<IPhasePagination[]>([])
  const [activePanelId, setActivePanelId] = useState<number>();
  const [panels, setPanels] = useState<IPanel[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [messageEmptyPanel, setMessageEmptyPanel] = useState<string>();  
  const [selectedPeriod, setSelectedPeriod] = useState<IComboData>();
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempPeriodStart, setTempPeriodStart] = useState('');
  const [tempPeriodEnd, setTempPeriodEnd] = useState('');
  const [showPanelsModal, setShowPanelsModal] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newPanelName, setNewPanelName] = useState('');
  const [addingPhaseForPanel, setAddingPhaseForPanel] = useState<number | null>(null);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [editingPanelId, setEditingPanelId] = useState<number | null>(null);
  const [editingPanelName, setEditingPanelName] = useState('');
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingPhaseName, setEditingPhaseName] = useState('');
  const panelNameRef = useRef<HTMLInputElement>(null);
  const phaseNameRef = useRef<HTMLInputElement>(null);
  const [dateEventStatus, setDateEventStatus] = useState<string>('');
  const [eventId, setEventId] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activePhases, setActivePhases] = useState([] as IPhase[]);
  const { addToast } = useToast();
  const toggle = (value: string) => { setMultiFilter1(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],);};
  
  const [permissions,setPermissions] = useState({
    canManagePanels: true,      // show "Painéis" button
    canDeletePhase: true,       // show trash icon on phase header
    canChangePhaseColor: true,  // show palette icon on phase header
  });

  const PERIOD_OPTIONS: IComboData[] = [
    { value: 'mes_atual', label: 'Mês Atual' },
    { value: 'semana', label: 'Semana Atual' },
    { value: 'proxima_semana', label: 'Próxima Semana' },
    { value: 'proximo_mes', label: 'Próxima Mês' },
    { value: 'dias_15', label: '15 dias' },
    { value: 'ultima_semana', label: 'Última Semana' },
    { value: 'ultimo_mes', label: 'Último Mês' },
    { value: 'custom', label: 'Selecionar Período' },
  ];
  
  let nextId = 100;
  const uid = () => ++nextId;

  const optionsCalendarFilter = [
    { value: 'S_A',   label: 'Audiência' },
    { value: 'S_P',   label: 'Prazo' },
    { value: 'U_R',   label: 'Responsável' },
    { value: 'U_RC',  label: 'Responsável e Compartilhado' },
    { value: 'PE',    label: 'Apenas pendentes' },
  ];
  
  const {
    isOpenModal,
    handleDeadLineCalculatorText,
    handleCaptureTextPublication,
    handleModalActive,
    modalActive,
  } = useModal();

  const QTDE_RECORDS_EVENTS = 10;

  useEffect(() => {
      GetParameterValue()
  },[])

  useEffect(() => {
      LoadKanban();        
  },[])
 
  useEffect(() => {

    if (activePanelId > 0)
      LoadKanbanEtapa(activePanelId);
      
  }, [activePanelId]);

useEffect(() => {
       
    let kanbanStageId = currentKanbanStageId;

    if (currentKanbanStageId == 0 && localStorage.getItem('@GoJur:kanbanStageId') !== '') {
      kanbanStageId = Number(localStorage.getItem('@GoJur:kanbanStageId'));
      setCurrentKanbanStageId(kanbanStageId)
    }
   }, [modalActive, isWaiting])

  const LoadKanban = async () => {
    try
    {
      var response = await api.get('/Kanban/Listar', {
          params:{ token }
      })

      if (response.data.length > 0)
      {
         const hasKanbanPermission = response.data[0].hasKanbanPermission;
         
         if (!hasKanbanPermission)
            setPermissions({
              canManagePanels: false,
              canDeletePhase: false,
              canChangePhaseColor: false,
            });
      }
      
      setPanels(response.data.map((item: any) => ({
        id: item.Id,
        name: item.Description
      })));

      // Load default from SQL or the first one if do not have default
      var findKanbanDefault = response.data.find(x=> x.Default);
      if (findKanbanDefault) {
        setActivePanelId(findKanbanDefault.Id);
      }
      else  
      {
        const kanbanId = response.data.length > 0 ? response.data[0].Id : 0;
        setActivePanelId(kanbanId); 
      }
    }
    catch (err) {
      addToast({ 
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha no carregamento do Painel'
      });

      console.log(err);
      setIsWaiting(false)
    }
 };

 const LoadKanbanEtapa = async (kanbanId: number) => {
    try
    {
        // Salva a flg_Padrao na tabela para recarregar automaticamente na proxima vez
        api.post('/Kanban/DefinirPadrao', {
          token,
          Id: activePanelId,
        }) 

        // Listagem de etapas por id de painel seleiconado
        var response = await api.get('/KanbanEtapa/Listar', {
            params:{ 
              token,
              kanbanId
            }
          })

        var listPhases = response.data.map((item: any) => ({ 
            id: item.Id, 
            panelId: item.KanbanId, 
            name: item.Description, 
            color: item.ColorCode,  
            order: item.NumPosition
        }));

        // setPhases(listPhases);

        if (listPhases.length == 0)
          setMessageEmptyPanel('Nenhum painel selecionado. Crie um novo painel para começar')
        
        var orderPhasesList = listPhases.filter((ph) => ph.panelId === activePanelId).sort((a, b) => a.order - b.order) 
        setActivePhases(orderPhasesList);

        setLoadEvents(true)   
    }
    catch (err) {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha no carregamento das etapas do painel'
      });   
    }
 }
 
const LoadKanbanEvents = async () => {  
    try 
    { 

      const { startDate, endDate } = getPeriodRange(selectedPeriod?.value)

      var filterItens = "";
        if (filterTerm.length > 0)
            filterItens += "|" + "KanbanTerm=" + filterTerm;

        if (multiFilter1.length > 0)
            filterItens += "|" + multiFilter1.join("|")

        if (subjectSelected)
            filterItens += "|" + "KanbanSubject=" + subjectSelected.id;

        let listPhases = activePhases;
        if (currentKanbanStageId > 0)
          listPhases = listPhases.filter(x=> x.id == currentKanbanStageId);

        const promises = listPhases?.map((phase) => 
        {
            const pagination = phasePagination.find(p => p.phaseId === phase.id);
            
            let lastIdPgDatabase =  0;
            let lastDatePgDatabase = "";
            let lastIdPgRecurrency = 0;
            let lastDatePgRecurrency = "";

          // If is a search by term, subject or responsible, clear cards to reload new values
            const clearPhases =(isLoadingSearch || subjectSelected || multiFilter1.length > 0);

            // When is not execution a search by term, considering a pagination
            if (!clearPhases && currentKanbanStageId == 0)
            {
                lastIdPgDatabase = pagination ? pagination.lastIdEvent : 0;
                lastDatePgDatabase = pagination ? pagination.lastDateEvent.toISOString() : "";
                lastIdPgRecurrency = pagination ? pagination.lastIdRecurrency : 0;
                lastDatePgRecurrency =pagination ? pagination.lastDateRecurrency.toISOString() : "";
            }

            return api.get('/KanbanEtapa/ListarEventos', {
              params: {
                token,
                kanbanStageId: phase.id, 
                startDate:  startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                filterItens:filterItens,
                lastIdPgDatabase: lastIdPgDatabase,
                lastDatePgDatabase: lastDatePgDatabase,
                lastIdPgRecurrency: lastIdPgRecurrency,
                lastDatePgRecurrency: lastDatePgRecurrency,
                qtdRecords:QTDE_RECORDS_EVENTS,
              },
            }).then((response) => ({ response, phase }))
      });

      const results = await Promise.all(promises);
 
      results.forEach(({ response, phase }) => {
        
        setCards((prevCards) => [
          ...prevCards,
          ...response.data.EventList.map((item: any) => ({
            id: `${uuidv4()}`,
            eventId: item.id,
            panelId: activePanelId,
            phaseId: phase.id, 
            title: item.subjectText,
            description: item.title,
            favorited: item.KanbanFavorite === 'S',
            start: item.start,
            hasDone: item.hasDone,
            backgroundColor: item.backgroundColor,
            recurrence: item.recurrence
          })) 
        ]);

        // atualiza a fase correspondente para habilitar o botão
        setActivePhases(prev =>
          prev.map(p =>
            p.id === phase.id
              ? { ...p, 
                  showButtonMore: response.data.EventList.length >= QTDE_RECORDS_EVENTS 
                }
              : p
          )
        );

        // Atualiza o controle de paginação 
        updatePhasePagination({
          phaseId: phase.id,
          lastIdEvent: response.data.LastIdEvent,
          lastDateEvent: new Date(response.data.LastDateEvent),
          lastIdRecurrency: response.data.LastIdRecurrency,
          lastDateRecurrency: new Date(response.data.LastDateRecurrency),
        });
      });

      setLoadEvents(false)
      setIsWaiting(false)
      setCurrentKanbanStageId(0)
      setIsLoadingSearch(false)
    }
    catch (err) {
      setIsWaiting(false)
      setIsLoadingSearch(false)
      console.log(err);
    }
  }

  const handleClickMenuCard = (event, eventId: number) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
  };

  const RefreshKanbanEvents = async () => {  
    try 
    { 
        const { startDate, endDate } = getPeriodRange(selectedPeriod.value)

        var filterItens = "";
        if (filterTerm.length > 0)
            filterItens += "KanbanTerm=" + filterTerm;
 
        const promises = activePhases
        .filter(phase => currentKanbanStageId > 0 ? phase.id === currentKanbanStageId : true)
        .map(phase => 
        {         
          phasePagination.find(p => p.phaseId === phase.id);
          return api.get('/KanbanEtapa/ListarEventos', {
            params: {
              token,
              kanbanStageId: phase.id, 
              startDate:  startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              filterItens:filterItens,
              lastIdPgDatabase: 0,
              lastDatePgDatabase: "",
              lastIdPgRecurrency: 0,
              lastDatePgRecurrency:"",
              qtdRecords:QTDE_RECORDS_EVENTS,
            },
          }).then((response) => ({ response, phase }));
      });

      const results = await Promise.all(promises);
 
      setCards(cards.filter(x=> x.phaseId != currentKanbanStageId));
      results.forEach(({ response, phase }) => {
        setCards((prevCards) => [
          ...prevCards,
          ...response.data.EventList.map((item: any) => ({
            id: `${uuidv4()}`,
            eventId: item.id,
            panelId: activePanelId,
            phaseId: phase.id, 
            title: item.subjectText,
            description: item.title,
            favorited: item.KanbanFavorite === 'S',
            start: item.start,
            hasDone: item.hasDone,
            backgroundColor: item.backgroundColor,
            recurrence: item.recurrence
          })) 
        ]);

        // atualiza a fase correspondente para habilitar o botão
        setActivePhases(prev =>
          prev.map(p =>
            p.id === phase.id
              ? {
                   ...p, 
                   showButtonMore: p.showButtonMore === true || response.data.EventList.length >= QTDE_RECORDS_EVENTS 
                }
              : p
          )
        );
        
        // Atualiza o controle de paginação 
        updatePhasePagination({
          phaseId: phase.id,
          lastIdEvent: response.data.LastIdEvent,
          lastDateEvent: new Date(response.data.LastDateEvent),
          lastIdRecurrency: response.data.LastIdRecurrency,
          lastDateRecurrency: new Date(response.data.LastDateRecurrency),
        });
      });

      setLoadEvents(false)
      setIsWaiting(false)
      setCurrentKanbanStageId(0)
    }
    catch (err) {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha no carregamento dos eventos relacionados as etapas do painel'
      });

      setIsWaiting(false)
      console.log(err);
    }
  }

  const handlePaginationStage = async (phaseId: number) => 
  {
    const { startDate, endDate } = getPeriodRange(selectedPeriod.value)

    setIsWaiting(true);

     var filterItens = "";
        if (filterTerm.length > 0)
            filterItens += "KanbanTerm=" + filterTerm;

    var currentPagination = phasePagination.find(x=> x.phaseId == phaseId)
    var response =  await api.get('/KanbanEtapa/ListarEventos', {
        params: {
          token,
          kanbanStageId: phaseId, 
          startDate:  startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          filterItens: filterItens,
          lastIdPgDatabase: currentPagination.lastIdEvent,
          lastDatePgDatabase: currentPagination.lastDateEvent,
          lastIdPgRecurrency: currentPagination.lastIdRecurrency,
          lastDatePgRecurrency:currentPagination.lastDateRecurrency,
          qtdRecords:QTDE_RECORDS_EVENTS,
        },
      });
                     
      if (response.data.EventList.length == 0)                          
      {
        addToast({
          type: 'info',
          title: 'Não há mais registros',
          description: 'Todos os eventos relacionados a esta etapa já foram carregados.'
        });

        setIsWaiting(false)
      }
                          
      setCards((prevCards) => [
          ...prevCards,
          ...response.data.EventList.map((item: any) => ({
            id: `${uuidv4()}`,
            eventId: item.id,
            panelId: activePanelId,
            phaseId: phaseId, 
            title: item.subjectText,
            description: item.title,
            favorited: item.KanbanFavorite === 'S',
            start: item.start,
            hasDone: item.hasDone,
            backgroundColor: item.backgroundColor,
            recurrence: item.recurrence
          })) 
      ]);

        // Atualiza o controle de paginação 
      updatePhasePagination({
        phaseId: phaseId,
        lastIdEvent: response.data.LastIdEvent,
        lastDateEvent: new Date(response.data.LastDateEvent),
        lastIdRecurrency: response.data.LastIdRecurrency,
        lastDateRecurrency: new Date(response.data.LastDateRecurrency),
      });

      setIsWaiting(false);
    }

  const SelectAppointment = async() => {
  try
  {      
      if ((currentAppointmentEdit ?? 0) == 0 && (currentKanbanStageId ?? 0) > 0 )
      {
          RefreshKanbanEvents();
          return; 
      }

      if ((currentAppointmentEdit ?? 0) == 0)
          return;

      var response = await api.post('Compromisso/Selecionar', {
        token,
        id: currentAppointmentEdit
      })

      
    RefreshKanbanEvents();
    
    setCurrentAppointmentEdit(0)
    setCurrentKanbanStageId(0)

      // if (response.data == null)
      // {
      //     setCards(prevCards =>
      //       prevCards.filter(card =>
      //         !(String(card.eventId) === String(currentAppointmentEdit) &&
      //           String(card.phaseId) === String(currentKanbanStageId))
      //       )
      //     );

      //     setCurrentAppointmentEdit(0)
      //     setCurrentKanbanStageId(0)

      //   return;
      // }
      
      // setCards(prevCards =>
      //   prevCards.map(card =>
      //     String(card.eventId) === String(response.data.eventId)
      //       ? {
      //           ...card,
      //           title: `${new Date(response.data.startDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${new Date(response.data.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${capitalize(response.data.subject)}`,
      //           description: response.data.description,
      //           hasDone: response.data.status === "L"
      //         }
      //       : card
      //   )
      // );

      // // Função para capitalizar primeira letra
      // function capitalize(text) {
      //   return text.charAt(0).toUpperCase() + text.slice(1);
      // }

      setIsWaiting(false)
      setCurrentAppointmentEdit(0)
      setCurrentKanbanStageId(0)
  }
  catch(err)
  {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha na atualização do compromisso'
      });

      setIsWaiting(false)
  }
}

useEffect(() => {

  if (!modalActive) 
  {
        SelectAppointment();
        
    // SelectAppointment();
    // setIsWaiting(false)
  }
  
}, [currentAppointmentEdit, modalActive]);


 function updatePhasePagination(newData: IPhasePagination) {
  setPhasePagination(prev => {
    const exists = prev.find(p => p.phaseId === newData.phaseId);

    if (!exists) 
    {
      return [...prev, newData];
    } 
    else 
    {
      return prev.map(p =>
        p.phaseId === newData.phaseId ? { ...p, ...newData } : p
      );
    }
  });
}

function getPeriodRange(value: string): { startDate: Date; endDate: Date } {
  
  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (value) {
    case 'mes_atual':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;

    case 'semana':
      // início da semana (segunda-feira)
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() + 1);
      // fim da semana (domingo)
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;

    case 'proxima_semana':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() + 8);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;

    case 'proximo_mes':
      startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      break;

    case 'dias_15':
      startDate = today;
      endDate = new Date(today);
      endDate.setDate(today.getDate() + 15);
      break;

    case 'ultima_semana':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() - 6);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;

    case 'ultimo_mes':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    case 'custom':

      if (tempPeriodStart && tempPeriodEnd) 
      {
          startDate = new Date(tempPeriodStart);
          endDate = new Date(tempPeriodEnd);
          endDate.setDate(endDate.getDate() + 1); 
      } else if (typeof tempPeriodStart === "string" && tempPeriodStart.includes(" - ")) {
          const [startStr, endStr] = tempPeriodStart.split(" - ");
          startDate = new Date(startStr.trim());
          endDate = new Date(endStr.trim());
          endDate.setDate(endDate.getDate() + 1); 
      }
      break;

    default:
      startDate = today;
      endDate = today;
  }

  return { startDate, endDate };
}

  const handleClickInclude = useCallback((phaseId: number) => {
    
    if (!permissions.canManagePanels){
      addToast({
        type: 'info',
        title: 'Acesso Negado',
        description: 'O seu usuário não possui permissão para o painel kanban, verifique com o administrador do sistema.'
      });

      return;
    }

    localStorage.setItem('@Gojur:kanbanStageId', phaseId.toString());
    setCurrentKanbanStageId(phaseId)
    handleCaptureTextPublication('');
    handleDeadLineCalculatorText('');
    handleModalActive(true);
    isOpenModal('0');

  }, [permissions, handleCaptureTextPublication, handleDeadLineCalculatorText, handleModalActive, isOpenModal]);


  const handleClickEdit = useCallback(async (e:  React.MouseEvent, phaseId: number, event: ICard) => {
    try
    {
      e.preventDefault();
      e.stopPropagation();

      setIsWaiting(true)

      if (e.button === 2) {
        if (e) {
          setDateEventStatus(event.start);
          setEventId(event.eventId);
          setCurrentKanbanStageId(event.phaseId)
          handleClickMenuCard(e, event.eventId);
          setIsWaiting(false)
          return;
        }
      }
      
      localStorage.setItem('@GoJur:RecurrenceDate', FormatDate(new Date(event.start), 'yyyy-MM-dd'),);
      isOpenModal(event.eventId.toString());
      setCurrentAppointmentEdit(event.eventId)
      localStorage.setItem('@Gojur:kanbanStageId', phaseId.toString());
      setCurrentKanbanStageId(phaseId)
      handleCaptureTextPublication('');
      handleDeadLineCalculatorText('');
      setIsWaiting(false)
    }
    catch(e)
    {
        console.log(e)
        setIsWaiting(false)
    }

  }, [permissions, handleCaptureTextPublication, handleDeadLineCalculatorText, handleModalActive, isOpenModal]);

  useEffect(() => {

    const mapped = optionsCalendarFilter
      .filter(opt => multiFilter1.includes(opt.value))
      .map(opt => ({ value: opt.value, label: opt.label }));
    
      setMultiFilter(mapped);

  }, [multiFilter1]);


  const LoadSubject = useCallback(async (reload = false, termSearch = '') => {
    try {
      if (termSearch === '') termSearch = appointmentSubject;
      if (reload) termSearch = '';

      const response = await api.post('/Assunto/Listar', {
        description: termSearch,
        token,
      });

      const subjectList: ISelectValues[] = response.data.map(item => ({
        id: item.id,
        label: item.value,
      }));

      setOptionsSubject(subjectList);
    } catch (err) {
      console.log(err);
    }
  }, [appointmentSubject, token]);

  useDelay(() => {
    LoadSubject();
  }, [appointmentSubject], 1000);

  const handleSubjectChange = (item: ISelectValues | null) => {
    if (item) {
      setAppointmentSubject(item.label);
      setAppointmentSubjectId(item.id);
    } else {
      setAppointmentSubject('');
      setAppointmentSubjectId('');
      LoadSubject(true);
    }

    setSubjectSelected(item)
  };

  const activePanel = panels.find((p) => p.id === activePanelId);

  const handleAddPanel = useCallback(async () => {
    setIsWaiting(true)
  
    const name = newPanelName.trim();
    if (!name) 
    {
        addToast({
          type: 'info',
          title: 'Atenção',
          description:
            'Defina um nome válido para o painél'
        });

        setIsWaiting(false)

        return;
    }

    try
    {
      var response = await api.post('/Kanban/Salvar', {
        token,
        Description: name
      })      

      var dadosKanban = response.data;

      const newPanel: IPanel = { 
        id: dadosKanban.Id, 
        name: dadosKanban.Description,
        hasKanbanPermission: true
      };
        
      setPanels((prev) => [...prev, newPanel]);
      setActivePanelId(dadosKanban.Id);
      setNewPanelName('');
      setShowAddPanel(false);

      setIsWaiting(false)
      setShowPanelsModal(false)
    }
     catch (err) {
      console.log(err);
      setIsWaiting(false)
    }

  }, [newPanelName])
   
  const handleSavePanelEdit = useCallback(async() => {

    setIsWaiting(true)
    
    try
    {
      const name = editingPanelName.trim();

      if (name === '') 
      {
        addToast({
          type: 'info',
          title: 'Atenção',
          description:
            'Defina um nome válido para o painél',
        });

        return;
      }

      await api.post('/Kanban/Salvar', {
        token,
        Description: name,
        Id: editingPanelId
      })      

      setPanels((prev) =>
        prev.map((p) => (p.id === editingPanelId ? { ...p, name } : p)),
      );

      setIsWaiting(false)
      setEditingPanelName('');
      setShowAddPanel(false);
      setShowPanelsModal(false)
      setEditingPanelId(null);
    }
    catch (err) {
      addToast({
        type: 'info',
        title: 'Operação Não Permitida',
        description: err.response.data.Message
      });

      setIsWaiting(false)
      setEditingPanelName('');
      setShowAddPanel(false);
      setEditingPanelId(null);
    }
  }, [editingPanelId, editingPanelName, showPanelsModal, showAddPanel, editingPanelName]);

  const onPanelEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSavePanelEdit();
    if (e.key === 'Escape') { setEditingPanelId(null); setEditingPanelName(''); }
  };

  const handleDeletePanel = useCallback(async(panelId: number) => {
      try
      {    
        setIsWaiting(true)

        await api.delete('/Kanban/Deletar', {
          params:{
            id:panelId,
            token
          }
        })     

        setPanels((prev) => prev.filter((p) => p.id !== panelId));
        setCards((prev) => prev.filter((c) => c.panelId !== panelId));

        // ADD o primeiro como default
        if (panels.length > 0)
          setActivePanelId(panels[0].id);

        setShowPanelsModal(false)
        setIsWaiting(false)
      }
      catch(err)
      {
        addToast({
          type: 'error',
          title: 'Operação Não Permitida',
          description: err.response.data.Message
        });

        setIsWaiting(false)
      }
    },
    [activePanelId, panels],
  );

  const handleAddPhase = useCallback(async () => {

    try
    {
        if (!permissions.canManagePanels)
        {
            addToast({
              type: 'info',
              title: 'Acesso Negado',
              description: 'O seu usuário não possui permissão para criação de novas etapas Kanban, verifique com o administrador do sistema.'
            });
            
            return;
        }
          
        const name = newPhaseName.trim();
        if (!name || addingPhaseForPanel === null)
        {
          addToast({
            type: 'info',
            title: 'Atenção',
            description:'Defina um nome válido para a etapa do painel',
          });

          setIsWaiting(false);
          return;
        }
        const panelPhases = activePhases.filter((ph) => ph.panelId === addingPhaseForPanel);

        setIsWaiting(true);

        const colorIndex = panelPhases.length % PHASE_COLORS.length;

        var response = await api.post('/KanbanEtapa/Salvar', {
            token,
            kanbanId:addingPhaseForPanel,
            Description: name,
            ColorCode: PHASE_COLORS[colorIndex],
          })      

        var dadosKanban = response.data;
        
        const newPhase: IPhase = {
          id: dadosKanban.Id,
          panelId: addingPhaseForPanel,
          name,
          color: PHASE_COLORS[colorIndex],
          order: panelPhases.length,
          showButtonMore: false
        };

        setActivePhases((prev) => [...prev, newPhase]);
        setNewPhaseName('');
        setAddingPhaseForPanel(null);
        setIsWaiting(false)
    }
    catch(err)
    {
        console.log(err)
        setIsWaiting(false)
    }
  }, [newPhaseName, addingPhaseForPanel, activePhases]); 

  const handleChangePhaseColor = useCallback(async (phaseId: number, color: string) => {
  
    try
    {
        setIsWaiting(true);

        var phaseSelected = activePhases.filter(x=> x.id == phaseId);

        if (phaseSelected.length == 0)
        {
          addToast({
            type: 'info',
            title: 'Atenção',
            description:'Não foi possível efetuar esta alteração',
          });

          setIsWaiting(false);
          return;
        }

        await api.post('/KanbanEtapa/Salvar', {
            token,
            id: phaseId,
            kanbanId:phaseSelected[0].panelId,
            Description: phaseSelected[0].name,
            NumPosition:phaseSelected[0].order,
            ColorCode: color
          })      

        setActivePhases((prev) => prev.map((ph) => (ph.id === phaseId ? { ...ph, color } : ph)));

        setIsWaiting(false)
    }
    catch(err)
    {
        console.log(err)
        setIsWaiting(false)
    }

  }, [activePhases, token, isWaiting]);

  const handleStartEditPhase = useCallback((phase: IPhase) => {
    setEditingPhaseId(phase.id);
    setEditingPhaseName(phase.name);
  }, []);

  const handleDeletePhase = useCallback(async(phaseId: number) => {
    try
    {
      setIsWaiting(true);

      await api.delete('/KanbanEtapa/Deletar', {
        params:{
          id:phaseId,
          token
        }
      })   

      setIsWaiting(false)

      setActivePhases((prev) => prev.filter((ph) => ph.id !== phaseId));
      setCards((prev) => prev.filter((c) => c.phaseId !== phaseId));

    }
    catch(err)
    {
      addToast({
        type: 'error',
        title: 'Operação Não Permitida',
        description: err.response.data.Message
      });

      setIsWaiting(false)
    }
  }, [activePanelId]);

  const handleSavePhaseEdit = useCallback(async () => {

    try
    {
        setIsWaiting(true)

        const name = editingPhaseName.trim();
       
        if (!name || editingPhaseId === null) 
        {
          addToast({
            type: 'info',
            title: 'Atenção',
            description:'Defina um nome válido para a etapa do painél',
          });

          setIsWaiting(false)
          return;
        }

        const phaseSelected = activePhases.filter(x=> x.id == editingPhaseId)
        if (phaseSelected.length == 0)
        {
          addToast({
            type: 'error',
            title: 'Operação NÃO realizada',
            description:'Não foi possível executar esta operação',
          });

          setIsWaiting(false)
          return;
        }

        await api.post('/KanbanEtapa/Salvar', {
            token,
            Id:editingPhaseId,
            kanbanId:activePanelId,
            Description: name,
            ColorCode: phaseSelected[0].color,
            NumPosition:phaseSelected[0].order,
          })      
 
        setActivePhases((prev) => prev.map((ph) => (ph.id === editingPhaseId ? { ...ph, name } : ph)));

        setEditingPhaseId(null);
        setEditingPhaseName('');

        setIsWaiting(false)
    }
    catch(err)
    {
        console.log(err)
        setIsWaiting(false)
    }
  }, [editingPhaseId, editingPhaseName]);

  const onPhaseEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSavePhaseEdit();
    if (e.key === 'Escape') { setEditingPhaseId(null); setEditingPhaseName(''); }
  };

  // const handleDeleteCard = useCallback((cardId: number) => {
  //   setCards((prev) => prev.filter((c) => c.id !== cardId));
  // }, []);
  
  const handleToggleFavorite = useCallback((cardId: number, favorite: string) => {

    var kanbanCardFilter = cards.filter(x=> x.id == cardId);

    var kanbanCard = kanbanCardFilter[0];
    
    SalvarFavorito(kanbanCard.id, kanbanCard.eventId, favorite)

  }, [cards]);


const ReordenarCards = (cardId: number) => 
{      
    setCards((prev) =>  prev.map((c) => c.id === cardId ? { ...c, favorited: !c.favorited } : c)
      .sort((a, b) => {
        if ((a.favorited ? 1 : 0) !== (b.favorited ? 1 : 0)) {
          return b.favorited ? 1 : -1;
        }
        const dateA = new Date(a.start).getTime();
        const dateB = new Date(b.start).getTime();
        return dateA - dateB;
    }));
}

const SalvarFavorito = async (id: number, eventId: number, FlagFavorite: string) => {
    try
    {
      await api.post('/KanbanEtapa/Favoritar', {
          EventId:eventId,
          FlagFavorite,
          Token: token
      })

      ReordenarCards(id)
    }
    catch
    {
      addToast({
        type: 'info',
        title: 'Operação Não Realizada',
        description: 'Houve uma falha na execução deste comando',
      });

      setIsWaiting(false);
    }
  }

  const onDragEnd = useCallback(async (result: DropResult) => {
    
    const { source, destination, draggableId, type } = result;

    if (!destination) 
      return;

    // se não houve mudança de posição
    if (source.droppableId === destination.droppableId && source.index === destination.index) 
      return;

    const reorder = (list: ICard[], startIndex:number, endIndex:number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    // mover colunas
    if (type === "COLUMN") {
      const phaseId = parseInt(draggableId.replace("phase-", ""), 10);
      const destinationIndex = destination.index;

      const response = await api.post("/KanbanEtapa/ArrastarEtapa", {
        kanbanStageId: phaseId,
        NumPosition: destinationIndex,
        Token: token,
      });

      setActivePhases((prev) =>
        prev
          .map((item) => {
            const atualizado = response.data.find((resp: any) => resp.Id === item.id);
            return atualizado ? { ...item, order: atualizado.NumPosition } : item;
          })
          .sort((a, b) => a.order - b.order)
      );
    }

    // mover cards
    if (type === "DEFAULT") {
    
      const match = draggableId.match(/event-(\d+)-phaseId=(\d+)-start=([\dT:-]+)/);
      if (match) {
        const eventId = parseInt(match[1], 10);
        const phaseIdUpdate = parseInt(destination.droppableId,10);
        const date = normalizeDateUTC(match[3]);
        const card = cards.find(x=> x.eventId == eventId)
        
        setCards(prevCards => {
          const reordered = reorder(prevCards, source.index, destination.index);

          return reordered.map(card => {
            if (card.eventId == eventId) {
              return { 
                ...card, 
                phaseId: phaseIdUpdate, 
                recurrence: "N" 
              };
            }
            return card;
          });
        });

      if (card?.recurrence === "S")
      {
          var response = await api.post('Compromisso/Selecionar', {  
            token,
            id: eventId,
            recurrenceDate:date
          })

          var data = response.data;
          const eventSaveData = buildRecurrenceObject(data, token, phaseIdUpdate);

          api.put<AppointmentPropsSave>(`/Compromisso/Salvar`, eventSaveData);
      }
      else
      {
          api.post("/KanbanEtapa/ArrastarEvento", {
            kanbanStageId: destination.droppableId,
            eventId,
            Token: token,
          });
      }
    }

  }

  }, [token, cards]);

  function buildRecurrenceObject(data: any, token: string, phaseIdUpdate: number) 
  {
    const formatDate = (date?: string | null) => date ? format(new Date(date), "yyyy-MM-dd") : undefined;

    const buildDayList = ( source: string, dictionary: { value: string; label: string }[]
    ) => source.split(",").filter((day) => day.length > 0)
        .map((day) => {
          const found = dictionary.find((item) => item.value === day);
          return {
            label: found ? found.label : "",
            value: day,
          };
        });

    const joinValues = (list?: { value: string }[]) =>list ? list.map((item) => item.value).join(",") : "";

    const recurrenceRule = JSON.parse(data.recurrenceRule);

    const recurrenceStartDate = formatDate(recurrenceRule.startDate);
    const recurrenceEndDate = formatDate(recurrenceRule.endDate);
    const recurrenceQtd = recurrenceRule.num_Quantity;
    const recurrenceSelectRepete = recurrenceRule.recurrenceType;
    const sharedParameterEnd = recurrenceRule.recurrenceTypeEnd;

    let selectWeek: selectedWeekProps[] | undefined;
    let selectDayMonth: selectedDayProps[] | undefined;
    let selectMonthYear: selectedDayProps[] | undefined;
    let selectDayYear: selectedDayProps[] | undefined;

    if (recurrenceSelectRepete === "W") {
      selectWeek = buildDayList(recurrenceRule.recurrenceWeekDays, weekRecurrence);
    }

    if (recurrenceSelectRepete === "M") {
      selectDayMonth = buildDayList(recurrenceRule.recurrenceDaysMonth, dayRecurrence);
    }

    if (recurrenceSelectRepete === "Y") {
      if (recurrenceRule.recurrenceMonth) {
        selectMonthYear = recurrenceRule.recurrenceMonth;
      }
      selectDayYear = buildDayList(recurrenceRule.recurrenceDaysMonth, dayRecurrence);
    }

    const daysWeekDesc = joinValues(selectWeek);
    const daysMonthDesc = joinValues(selectDayMonth);
    const daysYearDesc = joinValues(selectDayYear);

    return {
      ...data,
      recurrenceRuleJSON: JSON.stringify({
        dta_startDate: recurrenceStartDate,
        dta_endDate: recurrenceEndDate,
        recurrenceMonth: selectMonthYear,
        num_Quantity: recurrenceQtd,
        Interval: "",
        recurrenceType: recurrenceSelectRepete,
        recurrenceTypeEnd: sharedParameterEnd,
        recurrenceWeekDays: daysWeekDesc,
        recurrenceDaysMonth:
          recurrenceSelectRepete === "Y" ? daysYearDesc : daysMonthDesc,
      }),
      token,
      serieRecurrenceChange: "one",
      isConfirmSave: true,
      kanbanStageId: phaseIdUpdate,
    };
  }

  /* ── Keyboard shortcuts ── */
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') 
      handleAddPanel();
    if (e.key === 'Escape') { 
      setShowAddPanel(false);
       setNewPanelName(''); 
      }
  };

  const onPhaseKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPhase();
    if (e.key === 'Escape') { setAddingPhaseForPanel(null); setNewPhaseName(''); }
  };

  const handleReturnCalendar = () => {
    history.push('/calendar');
  }

  const handleChangeDate = item => {

    if (item.value === 'custom') {
      const today = new Date();
      const oneYearAgo = new Date(today);
      //oneYearAgo.setFullYear(today.getFullYear() - 1);
      oneYearAgo.setFullYear(today.getFullYear());
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
            
      setTempPeriodStart(tempPeriodStart || fmt(oneYearAgo));
      setTempPeriodEnd(tempPeriodEnd || fmt(today));
      setShowDateModal(true);
    }
    else
    {
      setSelectedPeriod(item);
      setPhasePagination([]);
      setActivePhases(prevPhases =>
        prevPhases.map(phase => ({
          ...phase,
          showButtonMore: false
        }))
      );
    }
    
  }  

  const mappingSelectToParameter = {
      mes_atual: "kanbanMonth",
      semana: "kanbanWeek",
      proxima_semana: "kanbanNextWeek",
      proximo_mes: "kanbanNextMonth",
      ultima_semana: "kanbanLastWeek",
      ultimo_mes: "kanbanLastMonth",
      dias_15: "kanban15dias",
      custom: (startDate, endDate) => `kanbanPeriod=${startDate}to${endDate}`
  };

    const mappingParameterToSelect = {
      kanbanMonth: "mes_atual",
      kanbanWeek: "semana",
      kanbanNextWeek: "proxima_semana",
      kanbanNextMonth: "proximo_mes",
      kanbanLastWeek: "ultima_semana",
      kanbanLastMonth: "ultimo_mes",
      kanban15dias: "dias_15",
      custom: (startDate, endDate) => `kanbanPeriod=${startDate}to${endDate}`
  };

  function getKanbanParam(value, startDate, endDate) {
    if (value === "custom") {
      return mappingSelectToParameter.custom(startDate, endDate);
    }
    
    return mappingSelectToParameter[value];
  }

  function getSelectParamValue(value) {
    return mappingParameterToSelect[value];
  }
  
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  };

  const GetParameterValue = useCallback(async () => {

      const response = await api.post<IParameterData[]>('/Parametro/Selecionar', {
        token,
        parametersName: '#CalendarView' 
      })

      var parameter = response.data[0];

      if (parameter.parameterValue.includes('kanbanPeriod'))
      {
          const periodString = parameter.parameterValue.replace("kanbanPeriod=", "");
          const [startDate, endDate] = periodString.split("to");
          
          setTempPeriodStart(startDate)
          setTempPeriodEnd(endDate)

          const dateSelected = `${formatDate(startDate)} - ${formatDate(endDate)}`;

          setSelectedPeriod({ value: 'custom', label: `${dateSelected}` })
      }
      else
      {
          var value = getSelectParamValue(parameter.parameterValue)
          
          if (value === undefined)
            setSelectedPeriod(PERIOD_OPTIONS[0])
          else
          {
            var comboValue = PERIOD_OPTIONS.find(x=> x.value == value)

            setSelectedPeriod(comboValue);
          }
      }
    
  },[selectedPeriod, tempPeriodStart, tempPeriodEnd])

  useEffect(() => {  

        if (!selectedPeriod)
          return;

        const parameterName = getKanbanParam(selectedPeriod.value, tempPeriodStart, tempPeriodEnd);

        if (selectedPeriod.value == "custom")
        {
          if (!tempPeriodEnd || !tempPeriodStart)
          {
            addToast({
              type: 'info',
              title: 'Atenção',
              description:'A data de inicio e termino do periodo não foi preenchida corretamente',
            });

            setIsWaiting(false)
            setShowDateModal(true);
            return;
          }

          if (tempPeriodEnd < tempPeriodStart)
          {
            // addToast({
            //   type: 'info',
            //   title: 'Atenção',
            //   description:'A data final do periodo não pode ser menor que a data de início',
            // });
            
            setIsWaiting(false)
            setShowDateModal(true);
            return
          }
        }

        setCards([]);
        setPhasePagination([]);
        setLoadEvents(true)

        api.post('/Parametro/Salvar', {
          token: token, 
          parametersName: '#calendarView',
          parameterType: 'P',
          parameterValue: parameterName        
        })

  },[selectedPeriod, tempPeriodStart, tempPeriodEnd]) 

  useDelay(
    () => {

      if (isLoadingSearch) {
        RebuildInterface();
      }
    },

    [filterTerm, isLoadingSearch], 500,
  );

  useEffect(() => {

      RebuildInterface();

  },[selectedPeriod,  multiFilter, subjectSelected]);
  
  useEffect(() => {

      if (loadEvents)
      {
         RebuildInterface();
         LoadKanbanEvents();
       }
  },[loadEvents, panels, activePhases, selectedPeriod]);

 const RebuildInterface = () =>
 {
      setPhasePagination([])
      setCards([])
      setIsWaiting(true)
      setLoadEvents(true);
 }

  const handleEventConclude = async () => {

    try {
       setIsWaiting(true)
       await api.post('/Compromisso/Concluir', {
         id: eventId,
         recurrenceDate: dateEventStatus,
         token,
       });
 
        setAnchorEl(null);
        setEventId(0);
        setIsWaiting(false)
 
       addToast({
         type: 'success',
         title: 'Compromisso Concluído',
         description: 'O compromisso foi concluído no sistema.',
       });
 
       await RefreshKanbanEvents()
       setDateEventStatus('');
       setCurrentKanbanStageId(0)
       

     } catch (err) 
     {
        setIsWaiting(false)
        addToast({
          type: 'error',
          title: 'Falha ao concluir compromisso.',
        });
     }
   };
 
   const handleEventReopen = async () => {

     try {
       setIsWaiting(true)
       await api.post('/Compromisso/Reabrir', {
         id: eventId,
         recurrenceDate: dateEventStatus,
         token,
       });
 
        setAnchorEl(null);
        setEventId(0);
        setIsWaiting(false)

       addToast({
         type: 'success',
         title: 'Compromisso reaberto',
         description: 'O compromisso foi reaberto no sistema.',
       });
 
       await RefreshKanbanEvents()
       setDateEventStatus('');
       setCurrentKanbanStageId(0)
     } 
     catch (err) 
     {
        setIsWaiting(false)
        addToast({
         type: 'error',
         title: 'Falha ao reabrir compromisso.',
       });
     }
   };

  const normalizeDateOnly = (dateString: string) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const normalizeDateUTC = (dateString: string) => {
    const d = new Date(dateString.replace(" ", "T") + "Z"); 
    return d.toISOString().substring(0, 10); // "2026-09-04"
};

  /* ── Render ── */
  return (

    <Container >
      <HeaderPage />
  
      {isWaiting && (
        <>
          <Overlay />
          <div className="waitingMessage">
            <Loader size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;Aguarde...
          </div>
        </>
      )}
      
      <Menu
        anchorEl={anchorEl}
        keepMounted
        className="headerCard"
        open={Boolean(anchorEl)}
        //onClose={handleCloseMenuCard}
      >
        <MenuItem
          style={{ fontSize: '0.75rem', color: 'var(--blue-twitter' }}
          onClick={() => handleEventConclude()}
        >
          <BiCalendarCheck />
          &nbsp;&nbsp;Concluir
        </MenuItem>

        <MenuItem
          style={{ fontSize: '0.75rem', color: 'var(--blue-twitter' }}
          onClick={() => handleEventReopen()}
        >
          <BiCalendarEdit />
          &nbsp;&nbsp;Reabrir
        </MenuItem>
      </Menu>

      
      <Content >
        <TaskBar>
          <div className="taskbar-left">
            <Search
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) {
                  e.preventDefault();
                }
                if (e.key === 'Enter') {
                  RebuildInterface();
                }
              }}
              placeholder="Pesquisar Compromissos"
              className="search"
              name="search"
              style={{minWidth: '10rem', marginTop: 0, marginLeft: 0 }}
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />

            <FcSearch
              className="icons"
              title="Clique para realizar a pesquisa pelo termo digitado"
              onClick={() => { RebuildInterface(); }}
            />

            <div style={{ zIndex: 9 }}>
              <FilterCalendar
                width={300} 
                optionsCalendarFilter={optionsCalendarFilter}
                multiFilter={multiFilter}
                selectedFilterValues={multiFilter1}
                onToggleFilter={toggle}
                optionsSubject={optionsSubject}
                appointmentSubjectId={appointmentSubjectId}
                appointmentSubject={appointmentSubject}
                onSubjectChange={handleSubjectChange}
                setIsLoading={setIsLoadingSearch}
                setIsLoadingSearch={setIsLoadingSearch}
                showSearchList={showSearchList}
              />
            </div>

            <div style={{ width: '180px' }}>
              <Select
                options={PERIOD_OPTIONS}
                onChange={handleChangeDate}
                value={
                  selectedPeriod?.value === "custom"
                    ? selectedPeriod 
                    : (
                        selectedPeriod
                          ? PERIOD_OPTIONS.find(p => p.value.toString() === selectedPeriod.value.toString())
                          : PERIOD_OPTIONS.find(p => p.value === "mes_atual")
                      )
                }
              />
            </div>
          </div>

          <div className="taskbar-right">
            <button
              type="button"
              className="buttonClick"
              onClick={() => setShowPanelsModal(true)}
            >
              <FiLayout size={12} /> Painéis
            </button>
            <button
              type="button"
              className="buttonClick"
              onClick={() => handleReturnCalendar()}
            >
              Retornar Calendário
            </button>
          </div>
        </TaskBar>

        <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem' }}>{activePanel?.name ?? ''}</h3>

        {/* ── Panels modal ── */}
        {showPanelsModal && (
          <ModalOverlay>
            <PanelsModal onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Painéis</h4>
                <FiX onClick={() => { 
                  setShowPanelsModal(false); 
                  setShowAddPanel(false); 
                  setNewPanelName('');
                  setEditingPanelId(null);
                  setIsWaiting(false) }} />
              </div>

              <div className="modal-body">
                {panels.map((panel) => (
                  <PanelItem
                    key={panel.id}
                    active={panel.id === activePanelId}
                    onClick={() => { if (editingPanelId !== panel.id) 
                      { 
                        setActivePanelId(panel.id); 
                        setShowPanelsModal(false); } 
                      }}
                  >
                    {editingPanelId === panel.id ? (
                      <input
                        autoFocus
                        value={editingPanelName}
                        onChange={(e) => setEditingPanelName(e.target.value)}
                        onKeyDown={onPanelEditKeyDown}
                        onBlur={handleSavePanelEdit}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          border: 'none',
                          borderBottom: '1px solid var(--blue)',
                          background: 'transparent',
                          fontSize: '0.8rem',
                          fontFamily: 'Poppins, Montserrat, sans-serif',
                          outline: 'none',
                          color: 'var(--secondary)',
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1 }}>{panel.name}</span>
                    )}

                    {permissions.canManagePanels && (
                      <span className="panel-actions">
                        <FiEdit2
                          title="Renomear painel"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPanelId(panel.id);
                            setEditingPanelName(panel.name);
                          }}
                        />
                        <FiTrash2
                          title="Excluir painel"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePanel(panel.id);
                          }}
                        />
                      </span>
                    )}
                  </PanelItem>
                ))}
              </div>

              <div className="modal-footer">
                {showAddPanel ? (
                  <>
                    <input
                      ref={panelNameRef}
                      autoFocus
                      placeholder="Nome do novo painel"
                      value={newPanelName}
                      onChange={(e) => setNewPanelName(e.target.value)}
                      onKeyDown={onPanelKeyDown}
                    />
                    <button type="button" className="buttonClick" onClick={handleAddPanel} style={{marginRight:"0"}}>
                      <FiCheck size={12} /> Salvar
                    </button>
                    <button
                      type="button"
                      className="buttonLinkClick"
                      onClick={() => { 
                        setShowAddPanel(false);
                        setNewPanelName(''); 
                      }}
                    >
                      <FiX size={12} />
                    </button>
                  </>
                ) : (
                  editingPanelId ? (
                  <>
                    <button
                      type="button"
                      className="buttonClick"
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.3rem', alignItems: 'center' }}
                    >
                        <FiEdit size={12} /> Atualizar Painel 
                    </button>
                  </>
                ) : (
                  <>
                    {permissions.canManagePanels && (
                    <button
                      type="button"
                      className="buttonClick"
                      style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.3rem', alignItems: 'center' }}
                      onClick={() => { setShowAddPanel(true); setTimeout(() => panelNameRef.current?.focus(), 50); }}
                    >
                      <FiPlus size={12} /> Novo Painel
                    </button>
                    )}
                  </>
                ))}
              </div>
            </PanelsModal>
          </ModalOverlay>
        )}

        {/* ── Date range modal ── */}
        {showDateModal && (
          <ModalOverlay onClick={() => { setShowDateModal(false); setSelectedPeriod(PERIOD_OPTIONS[0]); }}>
            <PanelsModal onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Selecionar Período</h4>
                <FiX onClick={() => 
                { 
                  setShowDateModal(false); 
                  setSelectedPeriod(PERIOD_OPTIONS[0]); 
                }} />
              </div>
              <div className="modal-body" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>De</label>
                  <input
                    type="date"
                    value={tempPeriodStart}
                    onChange={(e) => setTempPeriodStart(e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.8rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Até</label>
                  <input
                    type="date"
                    value={tempPeriodEnd}
                    min={tempPeriodStart}
                    onChange={(e) => setTempPeriodEnd(e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="buttonClick"
                  style={{ flex: 1, justifyContent: 'center', display: 'flex' }}
                  onClick={() => {
                    setTempPeriodStart(tempPeriodStart);
                    setTempPeriodEnd(tempPeriodEnd);
                    setShowDateModal(false);
                    //setIsChangePeriod(true)
                    const fmt = (s: string) => { const [, m, d] = s.split('-'); return `${d}/${m}`; };
                    setSelectedPeriod({ value: 'custom', label: `${fmt(tempPeriodStart)} - ${fmt(tempPeriodEnd)}` });
                  }}
                >
                  <FiCheck size={12} /> Confirmar
                </button>
                <button
                  type="button"
                  className="buttonLinkClick"
                  onClick={() => { setShowDateModal(false)}}
                >
                  Cancelar
                </button>
              </div>
            </PanelsModal>
          </ModalOverlay>
        )}

        <BoardLayout >
          {activePanel ? (
            <DragDropContext  onDragEnd={onDragEnd}>
              <Droppable droppableId="board" direction="horizontal" type="COLUMN">
              {(boardProvided) => (
              <KanbanArea ref={boardProvided.innerRef} {...boardProvided.droppableProps}>

              {activePhases.map((phase) => {
                const phaseCards = cards.filter((c) => c.phaseId === phase.id);
                return (
                   <>
                    <Draggable  key={phase.id} draggableId={`phase-${phase.id}`} index={phase.order}>
                      {(colDrag, colSnapshot) => (
                    <PhaseColumn
                      ref={colDrag.innerRef}
                      {...colDrag.draggableProps}
                      style={{
                        ...colDrag.draggableProps.style,
                        overflow:"auto",
                        opacity: colSnapshot.isDragging ? 0.88 : 1,
                      }}
                    >
                      <PhaseHeader color={phase.color} {...colDrag.dragHandleProps}>
                        <span className="phase-title">
                          {editingPhaseId === phase.id ? (
                            <input
                              autoFocus
                              value={editingPhaseName}
                              onChange={(e) => setEditingPhaseName(e.target.value)}
                              onKeyDown={onPhaseEditKeyDown}
                              onBlur={handleSavePhaseEdit}
                            />
                          ) : (
                            permissions.canManagePanels ? (
                            <span
                              title="Clique para renomear"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleStartEditPhase(phase)}
                            >
                              {phase.name}
                            </span>
                          ) : (
                            <span>{phase.name}</span>
                          ))
                        }
                        </span>
                        <span className="phase-count">{phaseCards.length}</span>
                        {permissions.canChangePhaseColor && (
                          <ColorPickerWrapper>
                            <ColorDot
                              color={phase.color}
                              title="Alterar cor"
                              onClick={(e) => {
                                e.stopPropagation();
                                (e.currentTarget.nextElementSibling as HTMLInputElement)?.click();
                              }}
                            >
                              <MdPalette />
                            </ColorDot>
                            <input
                              type="color"
                              value={phase.color}
                              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                              onChange={(e) => handleChangePhaseColor(phase.id, e.target.value)}
                            />
                          </ColorPickerWrapper>
                        )}
                        {permissions.canDeletePhase && (
                          <FiTrash2
                            title="Excluir etapa"
                            onClick={() => handleDeletePhase(phase.id)}
                          />
                        )}
                      </PhaseHeader>

                      <Droppable droppableId={String(phase.id)}>
                        {(provided, snapshot) => (
                          <>
                          <CardsList
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ background: snapshot.isDraggingOver ? '#f0f7ff' : undefined }}
                          >
                            {phaseCards.map((card, index) => (
                                <Draggable  
                                  key={card.id}
                                  draggableId={`event-${card.eventId}-phaseId=${card.phaseId}-start=${normalizeDateOnly(card.start)}`}
                                  index={index}>
                                  {(drag, dragSnapshot) => (
                                  <AppointmentCard
                                    onClick={(e) => handleClickEdit(e, phase.id, card)}
                                    onContextMenu={(e) => {
                                      e.preventDefault();   // bloqueia menu padrão
                                      e.stopPropagation();  // evita propagação
                                      handleClickEdit(e, phase.id, card);
                                    }}
                                    // onMouseDown={(e) => handleClickEdit(e, phase.id, card)}
                                    // onContextMenu={(e) => e.preventDefault()} // evita menu padrão
                                    ref={drag.innerRef}
                                    {...drag.draggableProps}
                                    {...drag.dragHandleProps}
                                    style={{
                                      cursor: 'pointer',                                      
                                      ...drag.draggableProps.style,
                                      borderLeft: `3px solid ${card.backgroundColor}`,
                                      opacity: dragSnapshot.isDragging ? 0.85 : 1,
                                      boxShadow: dragSnapshot.isDragging
                                        ? '0 8px 24px rgba(2,6,23,0.18)'
                                        : undefined,
                                                                WebkitLineClamp: 1,
                                      textOverflow: 'ellipsis',
                                      textDecoration:card.backgroundColor.includes('rgba')
                                        ? 'line-through underline'
                                        : 'none'
                                    }}
                                  >
                                    <div className="card-header">
                                      <span className="card-title">{card.title}</span>
                                      {card.favorited ? (
                                        <MdFavorite
                                          className="card-favorite active"
                                          title="Desfavoritar"
                                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(card.id, "N"); }}
                                        />
                                      ) : (
                                        <MdFavoriteBorder
                                          className="card-favorite"
                                          title="Favoritar"
                                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(card.id, "S"); }}
                                        />
                                      )}
                                    </div>
                                    {card.description && (
                                      <div className="card-description"
                                        title={card.description}>
                                        {card.description.length > 70 ? card.description.substring(0, 70) + '...' : card.description}
                                      </div>
                                    )}
                                    <div className="card-meta">
                                      {card.dateTime && (
                                        <>
                                          <FiClock />
                                          <span>{card.dateTime}</span>
                                        </>
                                      )}
                                    </div>
                                    
                                  </AppointmentCard>   
                                                                 
                                )}
                                
                              </Draggable>
                            ))}

                            {provided.placeholder}
                              {phase.showButtonMore && (
                                <AddCardButton type="button" onClick={() => handlePaginationStage(phase.id)}>
                                  <FiPlus />Ver mais 
                                </AddCardButton>
                              )}

                              <AddCardButton type="button" onClick={() => handleClickInclude(phase.id)}>
                                <FiPlus /> Criar Compromisso
                              </AddCardButton> 

                          </CardsList>

                          </>
                      )}
                      </Droppable>

                    </PhaseColumn>
                    
                    )}
                    </Draggable>
                    
                  </>
                );
              })}
              {boardProvided.placeholder}

              {/* ── Add phase column ── */}
              <AddPhaseColumn>
                {addingPhaseForPanel === activePanelId ? (
                  <div className="add-phase-form">
                    <input
                      ref={phaseNameRef}
                      autoFocus
                      placeholder="Nome da etapa"
                      value={newPhaseName}
                      onChange={(e) => setNewPhaseName(e.target.value)}
                      onKeyDown={onPhaseKeyDown}
                    />
                    <div className="form-actions">
                      <button type="button" className="buttonClick" onClick={handleAddPhase}>
                        <FiCheck size={12} /> Salvar
                      </button>
                      <button
                        type="button"
                        className="buttonLinkClick"
                        onClick={() => { setAddingPhaseForPanel(null); setNewPhaseName(''); }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {permissions.canManagePanels && (
                      <button
                        type="button"
                        className="add-phase-btn"
                        onClick={() => {
                          setAddingPhaseForPanel(activePanelId);
                          setTimeout(() => phaseNameRef.current?.focus(), 50);
                        }}
                      >
                        <FiPlus /> Nova Etapa
                      </button>
                    )}
                  </>
                )}
              </AddPhaseColumn>
            </KanbanArea>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <EmptyState>
              <FiLayout />
              <p>{messageEmptyPanel}</p>
            </EmptyState>
          )}
        </BoardLayout>
      </Content>
    </Container>
  );
}
