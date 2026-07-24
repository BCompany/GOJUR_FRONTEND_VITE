import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FiPlus, FiTrash2, FiClock, FiLayout, FiX, FiCheck, FiEdit2 } from 'react-icons/fi';
import { MdPalette, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { FcSearch } from 'react-icons/fc';
import Search from 'components/Search';
import { HeaderPage } from 'components/HeaderPage';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { IComboData } from 'pages/Dashboard/MainViewContent/pages/Financeiro/Account/Modal';
import { useModal } from 'context/modal';
import { v4 as uuidv4 } from 'uuid';
import FilterCalendar, { ISelectValues } from 'components/FilterCalendar';
import api from 'services/api';
import {
  AddCardButton,
  AddPhaseColumn,
  AppointmentCard,
  BoardLayout,
  CardsList,
  ColorDot,
  ColorPickerWrapper,
  Container,
  Content,
  EmptyState,
  KanbanArea,
  ModalOverlay,
  PanelItem,
  PanelsModal,
  TaskBar,
  PhaseColumn,
  PhaseHeader,
} from './styles';
import { ItemBox } from '../Matter/InvertParts/styles';
import { Underline } from 'ckeditor5';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import Loader from 'react-spinners/ClipLoader';
import { IParameterData } from '../Matter/Interfaces/IMatter';
// import { useSecurity } from 'context/securityContext';
// import { Console } from 'console';
// import { set } from 'date-fns';
// import { Description } from '../Dashboard/resorces/DashboardComponents/Publicacoes/PublicationDetail/styles';

/* ─── Interfaces ─── */

interface ICard {
  id: number;
  eventId: number;
  phaseId: number;
  panelId: number;
  title: string;
  description: string;
  dateTime: string;
  favorited?: boolean;
}

interface IPhase {
  id: number;
  panelId: number;
  name: string;
  color: string;
  order: number;
}

interface IPanel {
  id: number;
  name: string;
}

interface IPhasePagination
{
  phaseId: number | any;
  lastIdEvent: number | any;
  lastDateEvent: Date | any;
  lastIdRecurrency: number | any;
  lastDateRecurrency: number | any;
}

/* ─── Colors for auto-assignment ─── */
const PHASE_COLORS = [
  // '#ffc9c9',
  // '#fde68a',
  // '#bbf7d0',
  // '#bfdbfe',
  // '#e9d5ff',
  // '#fed7aa',
  // '#a5f3fc',
];

let nextId = 100;
const uid = () => ++nextId;

/* ─── Initial demo data ─── */
//const INITIAL_PANELS: IPanel[] = [
  // { id: 1, name: 'Agenda Geral' },
  // { id: 2, name: 'Audiências' },
//];

//const INITIAL_PHASES: IPhase[] = [
  // { id: 1, panelId: 1, name: 'Aguardando', color: '#ffc9c9', order: 0 },
  // { id: 2, panelId: 1, name: 'Fazendo', color: '#fde68a', order: 1 },
  // { id: 3, panelId: 1, name: 'Concluído', color: '#bbf7d0', order: 2 },
  // { id: 4, panelId: 2, name: 'A Realizar', color: '#bfdbfe', order: 0 },
  // { id: 5, panelId: 2, name: 'Realizado', color: '#bbf7d0', order: 1 },
//];

const INITIAL_CARDS: ICard[] = [
  // {
  //   id: 1,
  //   phaseId: 1,
  //   panelId: 1,
  //   title: 'Audiência de conciliação',
  //   description: 'Audiência de conciliação entre as partes. Comparecer com documentos originais.',
  //   dateTime: '26/05 10:00',
  // },
  // {
  //   id: 2,
  //   phaseId: 2,
  //   panelId: 1,
  //   title: 'Prazo recursal',
  //   description: 'Interpor recurso de apelação no prazo legal.',
  //   dateTime: '28/05 17:00',
  // },
  // {
  //   id: 3,
  //   phaseId: 4,
  //   panelId: 2,
  //   title: 'Audiência de instrução',
  //   description: 'Oitiva de testemunhas arroladas pelas partes.',
  //   dateTime: '30/05 09:30',
  // },
];

/* ─── Component ─── */
export default function AgendaKanban() {
  const history = useHistory();

  const {
    isOpenModal,
    handleDeadLineCalculatorText,
    handleCaptureTextPublication,
    handleModalActive,
  } = useModal();

  const handleClickInclude = useCallback(() => {
    handleCaptureTextPublication('');
    handleDeadLineCalculatorText('');
    handleModalActive(true);
    isOpenModal('0');
  }, [handleCaptureTextPublication, handleDeadLineCalculatorText, handleModalActive, isOpenModal]);

  const optionsCalendarFilter = [
    { value: 'S_A',   label: 'Audiência' },
    { value: 'S_P',   label: 'Prazo' },
    { value: 'U_R',   label: 'Responsável' },
    { value: 'U_RC',  label: 'Responsável e Compartilhado' },
    { value: 'PE',    label: 'Apenas pendentes' },
  ];

  const token = localStorage.getItem('@GoJur:token');

  const [multiFilter1, setMultiFilter1] = useState<string[]>([]);
  const [multiFilter, setMultiFilter] = useState<{ value: string; label: string }[]>([]);
  const [optionsSubject, setOptionsSubject] = useState<ISelectValues[]>([]);
  const [appointmentSubject, setAppointmentSubject] = useState('');
  const [appointmentSubjectId, setAppointmentSubjectId] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isChangePeriod, setIsChangePeriod] = useState(false);
  const [loadEvents, setLoadEvents] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showSearchList] = useState(false);
  const[phasePagination, setPhasePagination] = useState<IPhasePagination[]>([])

  //const [panels, setPanels] = useState<IPanel[]>(INITIAL_PANELS);
  const [activePanelId, setActivePanelId] = useState<number>();
  const [panels, setPanels] = useState<IPanel[]>([]);
  //const [phases, setPhases] = useState<IPhase[]>(INITIAL_PHASES);
  const [phases, setPhases] = useState<IPhase[]>();
  const [cards, setCards] = useState<ICard[]>(INITIAL_CARDS);
  const { addToast } = useToast();

  const toggle = (value: string) => {
    setMultiFilter1(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
    );
  };

  useEffect(() => 
  {
      setIsLoading(true)
      setIsWaiting(true)

  },[])

  useEffect(() => 
  {
      if (isLoading)
      {
        GetParameterValue()
        SaveLogNavigation();  
        LoadKanban();        
      }
  },[isLoading])
      
  useEffect(() => {

    if (activePanelId > 0)
      LoadKanbanEtapa(activePanelId);
      
  }, [activePanelId]);

 const SaveLogNavigation = () => {
    api.post('/Usuario/SalvarLogNavegacaoUsuario', {token: token, module: 'EVT_AGENDAKANBAN'})
  };

  const LoadKanban = async () => {
    try
    {
       var response = await api.get('/Kanban/Listar', {
            params:{ token }
        })
      
      setPanels(response.data.map((item: any) => ({
        id: item.Id,
        name: item.Description
      })));

      // Será modificado para pegar do parametro
      const kanbanId = response.data.length > 0 ? response.data[0].Id : 0;
      setActivePanelId(kanbanId); 

      setIsLoading(false)
      setIsWaiting(false)
    }
    catch (err) {
      console.error('Error loading Kanban data:', err);
      setIsLoading(false)
      setIsWaiting(false)
    }
 };

 const LoadKanbanEtapa = async (kanbanId: number) => {
    try
    {
        // Listar Etapas aqui

        setLoadEvents(true)
    }
    catch (err) {
      console.error('Error loading Kanban data:', err);
    }
 }

 useEffect(() => {

  if (loadEvents)
  {
    LoadKanbanEvents(); 
  }
  
 },[loadEvents])

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

useEffect(() => {

  //console.log('resultado paginação state', phasePagination)

},[phasePagination])

 const LoadKanbanEvents = async () => { 
    try
    {     
        // Listar Eventos aqui
    }
    catch (err) {
      console.error('Error loading Kanban data:', err);
    }
  }

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
  };

  // const [activePanelId, setActivePanelId] = useState<number>(INITIAL_PANELS[0].id);
  
  // Permission flags — connect to backend later
  const [permissions] = useState({
    canManagePanels: true,   // show "Painéis" button
    canDeletePhase: true,    // show trash icon on phase header
    canChangePhaseColor: true, // show palette icon on phase header
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
  const [selectedPeriod, setSelectedPeriod] = useState<IComboData>();
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempPeriodStart, setTempPeriodStart] = useState('');
  const [tempPeriodEnd, setTempPeriodEnd] = useState('');

  // Panels modal
  const [showPanelsModal, setShowPanelsModal] = useState(false);

  // New panel form
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newPanelName, setNewPanelName] = useState('');

  // New phase form
  const [addingPhaseForPanel, setAddingPhaseForPanel] = useState<number | null>(null);
  const [newPhaseName, setNewPhaseName] = useState('');

  // Inline panel name editing
  const [editingPanelId, setEditingPanelId] = useState<number | null>(null);
  const [editingPanelName, setEditingPanelName] = useState('');

  // Inline phase name editing
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingPhaseName, setEditingPhaseName] = useState('');

  const panelNameRef = useRef<HTMLInputElement>(null);
  const phaseNameRef = useRef<HTMLInputElement>(null);

  const [activePhases, setActivePhases] = useState([] as IPhase[]);


  /* ── Derived ── */
  const activePanel = panels.find((p) => p.id === activePanelId);
  // const activePhases = phases
  //   .filter((ph) => ph.panelId === activePanelId)
  //   .sort((a, b) => a.order - b.order);



  useEffect(() => {
  // const [tempPeriodStart, setTempPeriodStart] = useState('');
  // const [tempPeriodEnd, setTempPeriodEnd] = useState('');

  },[tempPeriodStart, tempPeriodEnd])

  /* ── Panel actions ── */
  const handleAddPanel = useCallback(async () => {
    setIsWaiting(true)
    const name = newPanelName.trim();
    if (!name) 
    {
        addToast({
          type: 'info',
          title: 'Atenção',
          description:
            'Defina um novo para o novo painel',
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
        name: dadosKanban.Description
      };
        
      setPanels((prev) => [...prev, newPanel]);
      setActivePanelId(newPanel.id);
      setNewPanelName('');
      setShowAddPanel(false);

       addToast({
          type: 'success',
          title: 'Operação Realizada',
          description: 'Novo painel criado com sucesso  '
        });

      setIsWaiting(false)
      setShowPanelsModal(false)
    }
     catch (err) {
      console.log(err);
      setIsWaiting(false)
    }

  }, [newPanelName])
  
  ;

  const handleDeletePanel = useCallback(async(panelId: number, e: any) => {
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
        //setPhases((prev) => prev.filter((ph) => ph.panelId !== panelId));
        setCards((prev) => prev.filter((c) => c.panelId !== panelId));
        
        if (activePanelId === panelId) {
          setActivePanelId(panels.find((p) => p.id !== panelId)?.id ?? 0);
        }

        addToast({
            type: 'success',
            title: 'Operação Realizada',
            description: 'Painel deletado com sucesso  '
          });

        setIsWaiting(false)
        
        e.stopPropagation();

      }
      catch
      {
          addToast({
            type: 'error',
            title: 'Operação Não Realizada',
            description: 'Houve uma falha na execução desta operação'
          });

          setIsWaiting(false)
      }
    },
    [activePanelId, panels],
  );

  const handleSavePanelEdit = useCallback(() => {
    const name = editingPanelName.trim();
    if (name && editingPanelId !== null) {
      setPanels((prev) =>
        prev.map((p) => (p.id === editingPanelId ? { ...p, name } : p)),
      );
    }
    setEditingPanelId(null);
    setEditingPanelName('');
  }, [editingPanelId, editingPanelName]);

  const onPanelEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSavePanelEdit();
    if (e.key === 'Escape') { setEditingPanelId(null); setEditingPanelName(''); }
  };

  /* ── Phase actions ── */
  const handleAddPhase = useCallback(async () => {

    try
    {
        const name = newPhaseName.trim();
        if (!name || addingPhaseForPanel === null) return;
        const panelPhases = phases.filter((ph) => ph.panelId === addingPhaseForPanel);

        setIsWaiting(true);

        const colorIndex = panelPhases.length % PHASE_COLORS.length;
        var response = await api.post('/KanbanEtapa/Salvar', {
            token,
            kanbanId:addingPhaseForPanel,
            Description: name,
            ColorCode: "#GGGGG",
            NumPosition:panelPhases.length,
          })      

        var dadosKanban = response.data;
        
        const newPhase: IPhase = {
          id: dadosKanban.Id,
          panelId: addingPhaseForPanel,
          name,
          color: PHASE_COLORS[colorIndex],
          order: panelPhases.length
        };
        setPhases((prev) => [...prev, newPhase]);
        setNewPhaseName('');
        setAddingPhaseForPanel(null);

        setIsWaiting(false)
    }
    catch
    {
        setIsWaiting(false)
    }
  }, [newPhaseName, addingPhaseForPanel, phases]);

  const handleDeletePhase = useCallback(async(phaseId: number) => {
    try
    {
      setIsWaiting(true);

      var response = await api.delete('/KanbanEtapa/Deletar', {
        params:{
          id:phaseId,
          token
        }
      })   


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
      
    setPhases((prev) => prev.filter((ph) => ph.id !== phaseId));
    setCards((prev) => prev.filter((c) => c.phaseId !== phaseId));
  }, []);

  

  const handleChangePhaseColor = useCallback((phaseId: number, color: string) => {
    setPhases((prev) => prev.map((ph) => (ph.id === phaseId ? { ...ph, color } : ph)));
  }, []);

  const handleStartEditPhase = useCallback((phase: IPhase) => {
    setEditingPhaseId(phase.id);
    setEditingPhaseName(phase.name);
  }, []);

  const handleSavePhaseEdit = useCallback(() => {
    const name = editingPhaseName.trim();
    if (name && editingPhaseId !== null) {
      setPhases((prev) =>
        prev.map((ph) => (ph.id === editingPhaseId ? { ...ph, name } : ph)),
      );
    }
    setEditingPhaseId(null);
    setEditingPhaseName('');
  }, [editingPhaseId, editingPhaseName]);

  const onPhaseEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSavePhaseEdit();
    if (e.key === 'Escape') { setEditingPhaseId(null); setEditingPhaseName(''); }
  };

  /* ── Card actions ── */
  const handleDeleteCard = useCallback((cardId: number) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);
  


  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (type !== 'COLUMN' && source.droppableId === destination.droppableId) return;

    // ── Column reorder ──
    if (type === 'COLUMN') {
      const phaseId = parseInt(draggableId.replace('phase-', ''), 10);
      setPhases((prev) => {
        const panelPhases = prev
          .filter((ph) => ph.panelId === activePanelId)
          .sort((a, b) => a.order - b.order);
        const others = prev.filter((ph) => ph.panelId !== activePanelId);

        const reordered = [...panelPhases];
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);

        const updated = reordered.map((ph, i) => ({ ...ph, order: i }));
        return [...others, ...updated];
      });
      return;
    }

    // ── Card move ──
    const cardId = parseInt(draggableId, 10);
    const destPhaseId = parseInt(destination.droppableId, 10);

    setCards((prev) => {
      const withoutCard = prev.filter((c) => c.id !== cardId);
      const moved = prev.find((c) => c.id === cardId);
      if (!moved) return prev;

      const updated = { ...moved, phaseId: destPhaseId };
      const destPhaseCards = withoutCard.filter((c) => c.phaseId === destPhaseId);
      const otherCards = withoutCard.filter((c) => c.phaseId !== destPhaseId);

      destPhaseCards.splice(destination.index, 0, updated);
      return [...otherCards, ...destPhaseCards];
    });
  }, [activePanelId]);

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

  const handleChangeDate = item => {
    setSelectedPeriod(item);
    if (item.value === 'custom') {
      const today = new Date();
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      setTempPeriodStart(periodStart || fmt(oneYearAgo));
      setTempPeriodEnd(periodEnd || fmt(today));
      setShowDateModal(true);
    }
    else{
      setIsChangePeriod(true);
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
          
          setPeriodStart(startDate)
          setPeriodEnd(endDate)

          const dateSelected = `${formatDate(startDate)} - ${formatDate(endDate)}`;

          setSelectedPeriod({ value: 'custom', label: `${dateSelected}` })
          // var comboValue = PERIOD_OPTIONS.find(x=> x.value =='custom')
          // setSelectedPeriod(comboValue);
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
    
  },[token])

  // useEffect(() => {  

  //   if (isChangePeriod) 
  //   { 
  //     const parameterName = getKanbanParam(selectedPeriod.value, periodStart, periodEnd);

  //     api.post('/Parametro/Salvar', {
  //       token: token, 
  //       parametersName: '#calendarView',
  //       parameterType: 'P',
  //       parameterValue: parameterName        
  //     })

  //     setIsChangePeriod(false)
  //   }

  // },[isChangePeriod, periodStart, periodEnd]) 

    useEffect(() => {  

      if (selectedPeriod)
      {
        const parameterName = getKanbanParam(selectedPeriod.value, periodStart, periodEnd);

        if (periodEnd < periodStart)
        {
          addToast({
            type: 'info',
            title: 'Atenção',
            description:'A data final do periodo não pode ser menor que a data de início',
          });
          
          setShowDateModal(true);
          return
        }

        api.post('/Parametro/Salvar', {
          token: token, 
          parametersName: '#calendarView',
          parameterType: 'P',
          parameterValue: parameterName        
        })
      }

  },[selectedPeriod]) 

  /* ── Render ── */
  return (
    <Container>
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
      
      <Content>
        <TaskBar>
          <div className="taskbar-left">
            <Search
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) {
                  e.preventDefault();
                }
                if (e.key === 'Enter') {
                  setIsLoadingSearch(true);
                  setIsLoading(true);
                }
              }}
              placeholder="Pesquisar Compromissos"
              className="search"
              name="search"
              style={{minWidth: '10rem', marginTop: 0, marginLeft: 0 }}
              value={!isLoadingSearch ? filterTerm : ''}
              onChange={(e) => setFilterTerm(e.target.value)}
            />

            <FcSearch
              className="icons"
              title="Clique para realizar a pesquisa pelo termo digitado"
              onClick={() => {
                setIsLoadingSearch(true);
                setIsLoading(true);
              }}
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
                setIsLoading={setIsLoading}
                setIsLoadingSearch={setIsLoadingSearch}
                showSearchList={showSearchList}
              />
            </div>

            <div style={{ width: '180px' }}>
              <Select
                styles={selectStyles}
                options={PERIOD_OPTIONS}
                value={selectedPeriod}
                onChange={handleChangeDate}
              />
            </div>
          </div>

          <div className="taskbar-right">
            {permissions.canManagePanels && (
              <button
                type="button"
                className="buttonClick"
                onClick={() => setShowPanelsModal(true)}
              >
                <FiLayout size={12} /> Painéis
              </button>
            )}
            <button
              type="button"
              className="buttonClick"
              onClick={() => history.push('/calendar')}
            >
              Retornar Calendário
            </button>
          </div>
        </TaskBar>

        <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem' }}>{activePanel?.name ?? ''}</h3>

        {/* ── Panels modal ── */}
        {showPanelsModal && (
          <ModalOverlay onClick={() => { setShowPanelsModal(false); setShowAddPanel(false); setNewPanelName(''); }}>
            <PanelsModal onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Painéis</h4>
                <FiX onClick={() => { setShowPanelsModal(false); setShowAddPanel(false); setNewPanelName(''); }} />
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
                          handleDeletePanel(panel.id, e);
                        }}
                      />
                    </span>
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
                    <button type="button" className="buttonClick" onClick={handleAddPanel}>
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
                  <button
                    type="button"
                    className="buttonClick"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.3rem', alignItems: 'center' }}
                    onClick={() => { setShowAddPanel(true); setTimeout(() => panelNameRef.current?.focus(), 50); }}
                  >
                    <FiPlus size={12} /> Novo Painel
                  </button>
                )}
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
                <FiX onClick={() => { setShowDateModal(false); setSelectedPeriod(PERIOD_OPTIONS[0]); }} />
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
                    setPeriodStart(tempPeriodStart);
                    setPeriodEnd(tempPeriodEnd);
                    setShowDateModal(false);
                    setIsChangePeriod(true)
                    const fmt = (s: string) => { const [, m, d] = s.split('-'); return `${d}/${m}`; };
                    setSelectedPeriod({ value: 'custom', label: `${fmt(tempPeriodStart)} - ${fmt(tempPeriodEnd)}` });
                  }}
                >
                  <FiCheck size={12} /> Confirmar
                </button>
                <button
                  type="button"
                  className="buttonLinkClick"
                  onClick={() => { setShowDateModal(false); setSelectedPeriod(PERIOD_OPTIONS[0]); }}
                >
                  Cancelar
                </button>
              </div>
            </PanelsModal>
          </ModalOverlay>
        )}

        <BoardLayout>
          {activePanel ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="board" direction="horizontal" type="COLUMN">
                {(boardProvided) => (
            <KanbanArea ref={boardProvided.innerRef} {...boardProvided.droppableProps}>
              {activePhases.map((phase, colIndex) => {
                const phaseCards = cards.filter((c) => c.phaseId === phase.id);

                return (
                  <Draggable key={phase.id} draggableId={`phase-${phase.id}`} index={colIndex}>
                    {(colDrag, colSnapshot) => (
                  <PhaseColumn
                    ref={colDrag.innerRef}
                    {...colDrag.draggableProps}
                    style={{
                      ...colDrag.draggableProps.style,
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
                          <span
                            title="Clique para renomear"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleStartEditPhase(phase)}
                          >
                            {phase.name}
                          </span>
                        )}
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
                        <CardsList
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ background: snapshot.isDraggingOver ? '#f0f7ff' : undefined }}
                        >
                          {phaseCards.map((card, index) => (
                            <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                              {(drag, dragSnapshot) => (
                                <AppointmentCard
                                  ref={drag.innerRef}
                                  {...drag.draggableProps}
                                  {...drag.dragHandleProps}
                                  style={{
                                    ...drag.draggableProps.style,
                                    opacity: dragSnapshot.isDragging ? 0.85 : 1,
                                    boxShadow: dragSnapshot.isDragging
                                      ? '0 8px 24px rgba(2,6,23,0.18)'
                                      : undefined,
                                  }}
                                >
                                  <div className="card-header">
                                    <span className="card-title">{card.title}</span>
                                    {card.favorited ? (
                                      <MdFavorite
                                        className="card-favorite active"
                                        title="Desfavoritar"
                                        onClick={(e) => { e.stopPropagation(); handleToggleUndoFavorite(card.id); }}
                                      />
                                    ) : (
                                      <MdFavoriteBorder
                                        className="card-favorite"
                                        title="Favoritar"
                                        onClick={(e) => { e.stopPropagation(); handleToggleFavorite(card.id); }}
                                      />
                                    )}
                                  </div>
                                  {card.description && (
                                    <div className="card-description">{card.description}</div>
                                  )}
                                  <div className="card-meta">
                                    {card.dateTime && (
                                      <>
                                        <FiClock />
                                        <span>{card.dateTime}</span>
                                      </>
                                    )}
                                    <FiTrash2
                                      style={{ marginLeft: 'auto', cursor: 'pointer', color: '#fca5a5' }}
                                      title="Excluir compromisso"
                                      onClick={() => handleDeleteCard(card.id)}
                                    />
                                  </div>
                                </AppointmentCard>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </CardsList>
                      )}
                    </Droppable>

                    <AddCardButton
                      type="button"
                      onClick={handleClickInclude}
                    >
                      <FiPlus /> Criar Compromisso
                    </AddCardButton>
                  </PhaseColumn>
                    )}
                  </Draggable>
                );
              })}
              {boardProvided.placeholder}

              {/* ── Add phase column ── */}
   
            </KanbanArea>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <EmptyState>
              <FiLayout />
              <p>Nenhum painel selecionado. Crie um novo painel para começar.</p>
            </EmptyState>
          )}
        </BoardLayout>
      </Content>
    </Container>
  );
}
