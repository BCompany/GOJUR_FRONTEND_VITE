/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */

import React, {
  useCallback,
  useEffect,
  useState,
  UIEvent,
  ChangeEvent,
  useRef,
} from 'react';
import '@fullcalendar/react/dist/vdom';
import FullCalendar from '@fullcalendar/react';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import Loader from 'react-spinners/ClipLoader';
import { AiOutlineReload, AiOutlineCheckCircle } from 'react-icons/ai';
import { BiCalendarCheck, BiCalendarEdit, BiLoader } from 'react-icons/bi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useAlert } from 'context/alert';
import ProcessModal from 'components/HeaderPage/TopNavBar/EnvelopeNotificationList/ProcessModal';
import ptbr from '@fullcalendar/core/locales/pt-br';
import { FiSave } from 'react-icons/fi';
import { envProvider } from 'services/hooks/useEnv';
import { useDevice } from 'react-use-device';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useConfirmBox } from 'context/confirmBox';
import interactionPlugin from '@fullcalendar/interaction';
import { HeaderPage } from 'components/HeaderPage';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useAuth } from 'context/AuthContext';
import { FaCalculator } from 'react-icons/fa';
import { FcAbout, FcSearch } from 'react-icons/fc';
import { useMenuHamburguer } from 'context/menuHamburguer';
import MenuHamburguer from 'components/MenuHamburguer';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useToast } from 'context/toast';
import { format } from 'date-fns';
import { MultiSelect } from 'react-multi-select-component';
import Search from 'components/Search';
import Select from 'react-select';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { usePublication } from 'context/publication';
import {
  ConvertDayOfWeekToPtBr,
  ConvertMonthToPtBr,
  selectStyles,
  useDelay,
  ConvertMonthToPtBr2,
  FormatDate,
} from 'Shared/utils/commonFunctions';
import VideoTrainningModal from 'components/Modals/VideoTrainning/Index';
import { useLocation } from 'react-router-dom';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import CompanyAccessDenied from 'components/CompanyAccessDenied';
import {
  IFullCalendar,
  filterProps,
  ISubject,
  IAutoCompleteData,
  IParameter,
  ISelectData,
} from '../Interfaces/ICalendar';
import {
  Container,
  Content,
  ListSearch,
  ModalFast,
  TaskBar,
  ModalParameters,
  TaskBarMobile,
  ModalFastMobile,
  ListSearchMobile,
  ModalDateSelect,
  ModalDateSelectMobile,
  ModalParametersMobile,
} from './styles';
import CalendarReport from './Report';
import CalendarExportConfig from './Export';

const Calendar: React.FC = () => {
  const { signOut } = useAuth();
  const { alertData, openProcessModal } = useAlert();
  const { handlePublicationModal, handleDetailsAnyType } = usePublication();
  const [calendarList, setCalendarList] = useState<IFullCalendar[]>([]);
  const [calendarListSearch, setCalendarListSearch] = useState<IFullCalendar[]>(
    [],
  );
  const { addToast } = useToast();
  const [pageNumber, setPageNumber] = useState(1);
  const { handleUserPermission } = useDefaultSettings();
  const {
    isMenuOpen,
    handleIsMenuOpen,
    caller,
    isOpenMenuConfig,
    handleCaller,
    isOpenMenuReport,
    handleOpenOldVersion,
    isOpenOldVersion,
  } = useMenuHamburguer();
  const {
    isOpenModal,
    handleDeadLineCalculatorText,
    handleCaptureTextPublication,
    handleModalActive,
    modalActive,
  } = useModal();
  const { isConfirmMessage, isCancelMessage } = useConfirmBox();
  const [defaultView, setDefaultView] = useState<string>('');
  const [finishDefaultView, setFinishDefaultView] = useState<boolean>(false);
  const [showSearchList, setShowSearchList] = useState<boolean>(false);
  const [openModalFast, setOpenModalFast] = useState<boolean>(false);
  const [openModalParameters, setOpenModalParameters] =
    useState<boolean>(false);
  const [openExportConfig, setOpenExportConfig] = useState<boolean>(false);
  const [openModalSubject, setOpenModalSubject] = useState<boolean>(false);
  const [openModalCalendarReport, setOpenModalCalendarReport] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const [showAboutMessage, setShowAboutMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [multiFilter, setMultiFilter] = useState<filterProps[]>([]); // MULTI FILTER VALUE
  const [description, setDescription] = useState<string>();
  const [dateString, setDateString] = useState<string>();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [viewName, setViewName] = useState('');
  const [eventId, setEventId] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [eventIdStr, setEventIdStr] = useState<string>('');
  const [startDateDrop, setStartDateDrop] = useState<string>('');
  const [endDateDrop, setEndDateDrop] = useState<string>('');
  const [defaultUserCompanyId, setDefaultUserCompanyId] = useState('');
  const [defaultUserCompanyName, setDefaultUserCompanyName] = useState('');
  const [subjectParameter, setSubjectParameter] = useState<ISelectData[]>([]);
  const [subjectParameterTerm, setSubjectParameterTerm] = useState('');
  const [subjectParameterId, setSubjectParameterId] = useState('');
  const [subjectParameterValue, setSubjectParameterValue] = useState('');
  const [sharedParameter, setSharedParameter] = useState<string>('R');
  const [viewParameter, setViewParameter] = useState<string>('');
  const [updatePermissionParameter, setUpdatePermissionParameter] =
    useState<string>('restricted');
  const [userTypeParameter, setUserTypeParameter] = useState<string>('RC');
  const [sendEmailParameter, setSendEmailParameter] = useState<string>('R');
  const [customerNotification, setCustomerNotification] =
    useState<string>('EM');
  const [integrationParameter, setIntegrationParameter] = useState<string>('N');
  const [periodIntegrationParameter, setTimeZoneCalendarParameter] =
    useState('-3');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0);
  const [states, setStates] = useState<IAutoCompleteData[]>([]);
  const [reportPeriodId, setReportPeriodId] = useState<string>('currentWeek');
  const [reportPeriodValue, setReportPeriodValue] =
    useState<string>('Semana Atual');
  const [reportSituationId, setReportSituationId] = useState<string>('both');
  const [reportSituationValue, setReportSituationValue] =
    useState<string>('Ambos');
  const [reportStateId, setReportStateId] = useState<string>('');
  const [reportStateValue, setReportStateValue] = useState<string>('');
  const [reportLayoutId, setReportLayoutId] = useState<string>('pdf');
  const [reportLayoutValue, setReportLayoutValue] = useState<string>('PDF');
  const [appointmentDateBeggin, setAppointmentDateBeggin] =
    useState<string>('');
  const [appointmentDateEnd, setAppointmentDateEnd] = useState<string>('');
  const [subjectTerm, setSubjectTerm] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [subjectValue, setSubjectValue] = useState('');
  const [subject, setSubject] = useState<ISelectData[]>([]);
  const [customerGroupTerm, setCustomerGroupTerm] = useState('');
  const [customerGroupId, setCustomerGroupId] = useState('');
  const [customerGroupValue, setCustomerGroupValue] = useState('');
  const [customerGroup, setCustomerGroup] = useState<IAutoCompleteData[]>([]);
  const [customerTerm, setCustomerTerm] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [customer, setCustomer] = useState<IAutoCompleteData[]>([]);
  const [calendarOfTerm, setCalendarOfTerm] = useState('');
  const [calendarOfId, setCalendarOfId] = useState('');
  const [calendarOfValue, setCalendarOfValue] = useState('');
  const [calendarOf, setCalendarOf] = useState<IAutoCompleteData[]>([]);
  const [responsibleTerm, setResponsibleTerm] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [responsibleValue, setResponsibleValue] = useState('');
  const [responsible, setResponsible] = useState<IAutoCompleteData[]>([]);
  const [opposingTerm, setOpposingTerm] = useState('');
  const [opposingId, setOpposingId] = useState('');
  const [opposingValue, setOpposingValue] = useState('');
  const [opposing, setOpposing] = useState<IAutoCompleteData[]>([]);
  const [matterTerm, setMatterTerm] = useState('');
  const [matterId, setMatterId] = useState('');
  const [matterValue, setMatterValue] = useState('');
  const [matter, setMatter] = useState<IAutoCompleteData[]>([]);
  const [dateEventStatus, setDateEventStatus] = useState<string>('');
  const baseUrl = envProvider.redirectUrl;
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');

  // SUBJECT
  const [subjectModalId, setSubjectModalId] = useState<string>();
  const [subjectDescription, setSubjectDescription] = useState<string>();
  const [subjectType, setSubjectType] = useState<string>('A');
  const [principalColor, setPrincipalColor] = useState<string>('#51B749');

  // DATE SELECT
  const [openModalDateSelect, setOpenModalDateSelect] =
    useState<boolean>(false);
  const [selectDateStart, setSelectDateStart] = useState<string>('');
  const calendarRef = useRef<any>(null);

  useDelay(
    () => {
      if (subjectTerm.length > 0 && !isLoading) {
        LoadSubjects();
      }
    },
    [subjectTerm],
    1000,
  );

  // LOAD FULL CALENDAR
  const LoadCalendar = useCallback(async () => {
    try {
      if (startDate == '' || endDate == '') {
        return;
      }

      setIsLoading(true);
      // await LoadDefaultProps();

      let filterItens = '';
      if (multiFilter.length > 0) {
        multiFilter.map(item => {
          return (filterItens += `|${item.value}`);
        });
      }

      const response = await api.get<IFullCalendar[]>(
        '/Compromisso/ListarCalendario',
        {
          params: {
            startDate,
            endDate,
            filterItens,
            token,
          },
        },
      );

      setCalendarList(response.data);
      setIsLoading(false);
      localStorage.removeItem('@GoJur:DeadLineJson');
    } catch (err: any) {
      setIsLoading(false);

      if (err.response.data.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description:
            'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut();
      } else {
        addToast({
          type: 'info',
          title: 'Falha ao exibir os compromissos da agenda',
          description:
            'Houve uma falha na exibição dos compromissos da agenda na data solicitada',
        });
      }
    }
  }, [multiFilter, startDate, endDate, token, defaultView]);

  // LOAD CALENDAR SEARCH VIEW
  const LoadCalendarSearch = useCallback(async () => {
    let filterItens = '';
    if (multiFilter.length > 0) {
      multiFilter.map(item => {
        return (filterItens += `|${item.value}`);
      });
    }

    if (filterTerm.length == 0) {
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'É necessário digitar um termo para realizar a busca',
      });

      setIsLoadingSearch(false);
      setIsLoading(false);
      return;
    }

    const response = await api.get<IFullCalendar[]>(
      '/Compromisso/PesquisarCalendario',
      {
        params: {
          page: pageNumber,
          rows: 50,
          filterItens,
          filterTerm,
          token,
        },
      },
    );

    setTotalPageCount(
      response.data.length == 0 ? 0 : response.data[0].totalPage,
    );
    setShowSearchList(true);

    if (response.data.length == 0) {
      setIsLoadingSearch(false);
      setIsEndPage(true);
      setIsLoading(false);
      setPageNumber(1);
      return;
    }

    if (!isPagination) {
      setIsEndPage(false);
      setCalendarListSearch(response.data);
    } else {
      response.data.map(item => calendarListSearch.push(item));
      setCalendarListSearch(calendarListSearch);
    }

    setIsLoadingSearch(false);
    setIsLoading(false);
  }, [
    calendarListSearch,
    filterTerm,
    isPagination,
    multiFilter,
    pageNumber,
    token,
    defaultView,
  ]);

  // FIRST INITIALIZATION
  useEffect(() => {
    LoadCalendarParameters();
    handleIsMenuOpen(false);
  }, []);

  // OPEN MODAL FAST
  useEffect(() => {
    if (openModalParameters) {
      LoadParameterSubjects();
    }
  }, [openModalParameters]);

  // WHEN EXISTS REPORT ID VERIFY IF IS AVAIABLE EVERY 5 SECONDS
  useEffect(() => {
    if (idReportGenerate > 0) {
      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval);
      }, 5000);
    }
  }, [idReportGenerate]);

  // CHECK IS REPORT IS ALREADY
  const CheckReportPending = useCallback(
    async checkInterval => {
      if (isGeneratingReport) {
        const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
          id: idReportGenerate,
          token: localStorage.getItem('@GoJur:token'),
        });

        if (response.data == 'F' && isGeneratingReport) {
          clearInterval(checkInterval);
          setIsGeneratingReport(false);
          OpenReportAmazon();
        }

        if (response.data == 'E') {
          clearInterval(checkInterval);
          setIsGeneratingReport(false);

          addToast({
            type: 'error',
            title: 'Operação não realizada',
            description: 'Não foi possível gerar o relatório.',
          });
        }
      }
    },
    [isGeneratingReport, idReportGenerate],
  );

  // OPEN LINK WITH REPORT
  const OpenReportAmazon = async () => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token'),
    });

    setIdReportGenerate(0);
    handleCalendarReportClose();

    window.open(`${response.data.des_Parametro}`, '_blank');
  };

  // WHEN MODAL APPOINTMENT OR DEADLINE IS CLOSE BY DELETE OR SAVE - RELOAD PAGE
  useEffect(() => {
    if (!modalActive) {
      const checkModal = localStorage.getItem('@GoJur:appointmentClose');
      if (checkModal != 'S') {
        LoadCalendar();
      }

      localStorage.removeItem('@fullCalendarDate');
      localStorage.removeItem('@GoJur:appointmentClose');
    }

    if (!modalActive && showSearchList) {
      LoadCalendarSearch();
    }
  }, [modalActive]);

  // WHEN IS RELOAD PAGE SEARCH BY APPLIED FILTER
  useEffect(() => {
    if (isLoadingSearch) {
      LoadCalendarSearch();
    }
  }, [isLoadingSearch]);

  useEffect(() => {
    if (caller == 'parameterCalendarModal' && isOpenMenuConfig) {
      LoadCalendarParameters();
      setOpenModalParameters(true);
    }

    if (caller == 'exportConfig' && isOpenMenuConfig) {
      setOpenExportConfig(true);
    }

    if (caller == 'subjectModal' && isOpenMenuConfig) {
      setOpenModalSubject(true);
    }
  }, [caller, isMenuOpen]);

  useEffect(() => {
    LoadCalendar();
  }, [multiFilter]);

  useEffect(() => {
    LoadCalendar();
  }, [startDate, endDate]);

  useDelay(
    () => {
      if (subjectParameterTerm.length > 0) {
        LoadParameterSubjects();
      }
    },
    [subjectParameterTerm],
    1000,
  );

  useEffect(() => {
    handleOpenOldVersion(false);
  }, [isCancelMessage]);

  useEffect(() => {
    if (isConfirmMessage) {
      handleRedirect(
        `${baseUrl}ReactRequest/Redirect?token=${token}&route=calendar/calendar`,
      );
    }

    handleOpenOldVersion(false);
  }, [isConfirmMessage]);

  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);

  // LOAD CALENDAR PARAMETERS
  const LoadCalendarParameters = async () => {
    const calendarRedirect = localStorage.getItem('@GoJur:CalendarRedirect');

    try {
      const response = await api.get<IParameter[]>(
        '/Parametro/ListarPorModulo',
        {
          params: {
            moduleName: 'calendarModule',
            token,
          },
        },
      );

      response.data.map(item => {
        if (item.parameterName == '#CALENDARSHARED') {
          if (item.parameterValue == 'S') setSharedParameter('U');
          else setSharedParameter('R');
        }

        if (item.parameterName == '#CALENDARVIEW') {
          setViewParameter(item.parameterValue);

          if (calendarRedirect == 'dayGridWeek') {
            setDefaultView('dayGridWeek');
            localStorage.removeItem('@GoJur:CalendarRedirect');
          } else {
            if (item.parameterValue == 'month') {
              setDefaultView('dayGridMonth');
            }
            if (item.parameterValue == 'agendaWeek') {
              setDefaultView('timeGridWeek');
            }
            if (item.parameterValue == 'basicWeek') {
              setDefaultView('dayGridWeek');
            }
            if (item.parameterValue == 'agendaDay') {
              setDefaultView('timeGridDay');
            }
            if (item.parameterValue == 'basicDay') {
              setDefaultView('listDay');
            }
          }
        }

        if (item.parameterName == '#CALENDARUPDATE') {
          setUpdatePermissionParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDARSUBJ') {
          setSubjectParameterId(item.parameterValue);
          setSubjectParameterValue(item.parameterDesc);
        }
        if (item.parameterName == '#CALENDARSUBJNAME') {
          setSubjectParameterId(item.parameterValue);
          setSubjectParameterValue(item.parameterDesc);
        }
        if (item.parameterName == '#CALENDARUSERS') {
          setUserTypeParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDAREMAIL') {
          setSendEmailParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDAREXPORT') {
          setIntegrationParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDARTIMEZO') {
          setTimeZoneCalendarParameter(item.parameterValue);
        }
        if (item.parameterName == '#WPNOTIFICATION') {
          setCustomerNotification(item.parameterValue);
        }

        return;
      });

      setFinishDefaultView(true);
    } catch (err) {
      console.log(err);
    }
  };

  // CLICK EDIT APPOINTMENT
  const handleClickEdit = item => {
    localStorage.setItem(
      '@GoJur:RecurrenceDate',
      FormatDate(new Date(item.event.start), 'yyyy-MM-dd'),
    );
    handleModalActive(true);
    isOpenModal(item.event.id);

    item.jsEvent.preventDefault();
  };

  // CLICK EDIT APPOINTMENT BY SEARCH LIST
  const handleClickEditSearch = (id: string, start: string) => {
    localStorage.setItem(
      '@GoJur:RecurrenceDate',
      FormatDate(new Date(start), 'yyyy-MM-dd'),
    );
    handleModalActive(true);
    isOpenModal(id);
  };

  // CLICK INCLUDE NEW FAST APPOINTMENT
  const handleClickIncludeFast = e => {
    setOpenModalFast(true);
    LoadSubjects();

    const dateClick = e.date;
    const date = dateClick.toString().split(' ');

    const dayWeek = date[0];
    const mounth = date[1];
    const day = date[2];
    const hour = date[4].substring(0, 5);

    const dayWeekStr = ConvertDayOfWeekToPtBr(dayWeek, false);
    const mounthStr = ConvertMonthToPtBr2(mounth, true);

    if (hour == '00:00') {
      setDateString(`${dayWeekStr}, ${day} de ${mounthStr}`);
    } else {
      setDateString(`${dayWeekStr}, ${day} de ${mounthStr} - ${hour}`);
    }

    setViewName(e.view.type);

    localStorage.setItem('@fullCalendarDate', e.dateStr.substring(0, 10));
  };

  // CLICK INCLUDE NEW APPOINTMENT
  const handleClickInclude = item => {
    handleCaptureTextPublication('');
    handleDeadLineCalculatorText('');
    handleModalActive(true);
    setOpenModalFast(false);
    isOpenModal('0');
  };

  const optionsCalendarFilter = [
    { value: 'S_A', label: 'Audiência' },
    { value: 'S_P', label: 'Prazo' },
    { value: 'U_R', label: 'Responsável' },
    { value: 'U_RC', label: 'Responsável e Compartilhado' },
    { value: 'PE', label: 'Apenas pendentes' },
  ];

  // TRIGGUER EVENT WHEN ACHIEVE END OF SCROOL AND ACTIVE PAGINATION FOR PUBLICATION LIST
  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || calendarListSearch.length == 0 || !showSearchList) return;

    const isEndScrool =
      element.scrollHeight - element.scrollTop - 50 <= element.clientHeight;

    // calculate if achieve end of scrool page
    if (isEndScrool) {
      if (!isLoadingSearch) {
        setPageNumber(pageNumber + 1);
      }

      setIsLoadingSearch(true);
      setIsPagination(true);
    }
  }

  const saveFastEvent = async () => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      const startDate = localStorage.getItem('@fullCalendarDate');

      setIsSaving(true);

      await api.put('/Compromisso/SalvarRapido', {
        subjectId,
        description,
        viewName,
        startDate,
        token,
      });

      setOpenModalFast(false);
      setIsSaving(false);
      setDescription('');
      setSubject([]);

      LoadCalendar();

      addToast({
        type: 'success',
        title: 'Compromisso salvo',
        description: 'O compromisso foi adicionado no sistema.',
      });
    } catch (err) {
      setIsSaving(false);
      addToast({
        type: 'error',
        title: 'Falha ao salvar compromisso.',
        description:
          'Verifique se o assunto e/ou a descrição do compromisso foi informada corretamente',
      });
    }
  };

  // REPORT FIELDS - GET API DATA
  const LoadSubjects = async (stateValue?: string) => {
    if (isLoadingComboData) {
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == 'initialize' ? subjectValue : subjectTerm;
    if (stateValue == 'reset') {
      filter = '';
    }

    try {
      const response = await api.post<ISubject[]>('/Assunto/Listar', {
        description: filter,
        token,
      });

      const listSubject: ISelectData[] = [];

      response.data.map(item => {
        return listSubject.push({
          id: item.id,
          label: item.value,
        });
      });

      setSubject(listSubject);

      setIsLoadingComboData(false);
    } catch (err) {
      console.log(err);
    }
  };

  // REPORT FIELDS - CHANGE
  const handleSubjectSelected = item => {
    if (item) {
      setSubjectValue(item.label);
      setSubjectId(item.id);
    } else {
      setSubjectValue('');
      setSubjectTerm('');
      LoadSubjects('reset');
      setSubjectId('');
    }
  };

  const handleFastEventClose = () => {
    setOpenModalFast(false);
    localStorage.removeItem('@fullCalendarDate');
    setDescription('');
    setSubjectValue('');
    setSubjectTerm('');
    setSubjectId('');
  };

  const handleSubjectParameterSelected = item => {
    if (item) {
      setSubjectParameterValue(item.label);
      setSubjectParameterId(item.id);
    } else {
      setSubjectParameterValue('');
      LoadParameterSubjects('reset');
      setSubjectParameterId('');
    }
  };

  const LoadParameterSubjects = async (stateValue?: string) => {
    if (isLoadingComboData) {
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter =
      stateValue == 'initialize' ? subjectParameterValue : subjectParameterTerm;
    if (stateValue == 'reset') {
      filter = '';
    }

    try {
      const response = await api.post<ISubject[]>(
        '/Assunto/ListarPorParametros',
        {
          description: filter,
          token,
        },
      );

      const listSubject: ISelectData[] = [];

      response.data.map(item => {
        return listSubject.push({
          id: item.id,
          label: item.value,
        });
      });

      setSubjectParameter(listSubject);

      setIsLoadingComboData(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleParametersClose = () => {
    setOpenModalParameters(false);
    setOpenExportConfig(false);
    handleCaller('');
    handleIsMenuOpen(false);
  };

  const saveParameter = async () => {
    try {
      const token = localStorage.getItem('@GoJur:token');

      setIsLoading(true);

      await api.post('/Compromisso/SalvarParametrosCalendario', {
        subjectIdParameter: subjectParameterId,
        sharedParameter,
        viewParameter,
        updatePermissionParameter,
        userTypeParameter,
        sendEmailParameter,
        integrationParameter,
        periodIntegrationParameter,
        customerNotificationParameter: customerNotification,
        token,
      });

      setOpenModalParameters(false);
      setOpenExportConfig(false);
      handleCaller('');
      handleIsMenuOpen(false);

      await LoadCalendar();

      if (viewParameter == 'month') {
        setDefaultView('dayGridMonth');
      }
      if (viewParameter == 'agendaWeek') {
        setDefaultView('timeGridWeek');
      }

      window.location.reload();

      setIsLoading(false);

      addToast({
        type: 'success',
        title: 'Parâmetros salvos',
        description: 'Os parâmetros foram adicionado no sistema.',
      });
    } catch (err) {
      setIsLoading(false);

      addToast({
        type: 'error',
        title: 'Falha ao salvar parâmetros.',
        // description:  err.response.data.Message
      });
    }
  };

  // REPORT
  const handleCalendarReportClose = () => {
    setOpenModalCalendarReport(false);
    handleCaller('');
    handleIsMenuOpen(false);
    ResetReportStates();
  };

  const handleExportState = (status: boolean) => {
    setIsLoading(status);
  };

  const handleCloseExportConfig = () => {
    setOpenExportConfig(false);
    setIsLoading(false);
    handleCaller('');
  };

  const [buttonText, setButtonText] = useState('Gerar Relatório');
  const changeText = text => setButtonText(text);

  const renderAppointmentCell = item => {
    // Mês
    if (item.view.type == 'dayGridMonth') {
      return (
        <>
          {/* event right click on cell  */}
          <div
            key={item.id}
            title={item.event.title}
            onContextMenu={e => e.stopPropagation()}
            onMouseDown={e => handleRightClick(e, item)}
            onClick={e => console.log('click', e)}
            style={{
              WebkitLineClamp: 1,
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              textDecoration: item.event.backgroundColor.includes('rgba')
                ? 'line-through underline'
                : 'none',
            }}
          >
            {/* text description appointment */}
            {item.event.title.length > 50
              ? item.event.title.substring(0, 50)
              : item.event.title}
          </div>
        </>
      );
    }

    // Lista Semana
    if (item.view.type == 'dayGridWeek') {
      return (
        <>
          {/* event right click on cell  */}
          <div
            key={item.id}
            title={item.event.title}
            onContextMenu={e => e.stopPropagation()}
            onMouseDown={e => handleRightClick(e, item)}
            onClick={e => console.log('click', e)}
            style={{
              whiteSpace: 'normal',
              height: '50px',
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textDecoration: item.event.backgroundColor.includes('rgba')
                ? 'line-through underline'
                : 'none',
            }}
          >
            {/* text description appointment */}
            {/* {item.event.title.length> 100? item.event.title.substring(0,100): item.event.title} */}
            {item.event.title}
          </div>
        </>
      );
    }

    // Lista Dia
    if (item.view.type == 'listDay') {
      return (
        <>
          {/* event right click on cell  */}
          <div
            key={item.id}
            title={item.event.title}
            onContextMenu={e => e.stopPropagation()}
            onMouseDown={e => handleRightClick(e, item)}
            onClick={e => console.log('click', e)}
            style={{
              fontSize: '12px',
              height: '50px',
              color: 'white',
              backgroundColor: item.event.backgroundColor,
              WebkitLineClamp: 1,
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              textDecoration: item.event.backgroundColor.includes('rgba')
                ? 'line-through underline'
                : 'none',
            }}
          >
            {item.event.title}
          </div>
        </>
      );
    }

    // Semana
    if (item.view.type == 'timeGridWeek') {
      return (
        <>
          {/* event right click on cell  */}
          <div
            key={item.id}
            title={item.event.title}
            onContextMenu={e => e.stopPropagation()}
            onMouseDown={e => handleRightClick(e, item)}
            onClick={e => console.log('click', e)}
            style={{
              WebkitLineClamp: 1,
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              textDecoration: item.event.backgroundColor.includes('rgba')
                ? 'line-through underline'
                : 'none',
            }}
          >
            {/* text description appointment */}

            <div
              className="fc-event-main"
              style={{
                height: '20px',
                WebkitLineClamp: 1,
                cursor: 'pointer',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                textDecoration: item.event.backgroundColor.includes('rgba')
                  ? 'line-through underline'
                  : 'none',
              }}
            >
              {/* {item.event.title.length> 20? item.event.title.substring(0,20): item.event.title} */}
              {item.event.title}
            </div>
          </div>
        </>
      );
    }

    // Dia
    return (
      <>
        {/* event right click on cell  */}
        <div
          key={item.id}
          title={item.event.title}
          onContextMenu={e => e.stopPropagation()}
          onMouseDown={e => handleRightClick(e, item)}
          onClick={e => console.log('click', e)}
          style={{
            WebkitLineClamp: 1,
            cursor: 'pointer',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textDecoration: item.event.backgroundColor.includes('rgba')
              ? 'line-through underline'
              : 'none',
          }}
        >
          {/* text description appointment */}
          <div
            className="fc-event-main"
            style={{
              height: '20px',
              WebkitLineClamp: 1,
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              textDecoration: item.event.backgroundColor.includes('rgba')
                ? 'line-through underline'
                : 'none',
            }}
          >
            {/* {item.event.title.length> 40? item.event.title.substring(0,40): item.event.title} */}
            {item.event.title}
          </div>
        </div>
      </>
    );
  };

  const handleRightClick = (e: any, item: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button === 2) {
      if (e) {
        setDateEventStatus(item.event.startStr);
        setEventId(item.event.id);
        handleClickMenuCard(e, item.event.id);
      }
    }
  };

  const handleClickMenuCard = (event, eventId: number) => {
    setAnchorEl(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
  };

  const handleEventConclude = async () => {
    try {
      await api.post('/Compromisso/Concluir', {
        id: eventId,
        recurrenceDate: dateEventStatus,
        token,
      });

      setAnchorEl(null);
      setEventId(0);

      addToast({
        type: 'success',
        title: 'Compromisso Concluído',
        description: 'O compromisso foi concluído no sistema.',
      });

      await LoadCalendar();
      setDateEventStatus('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Falha ao concluir compromisso.',
      });
    }
  };

  const handleEventReopen = async () => {
    try {
      await api.post('/Compromisso/Reabrir', {
        id: eventId,
        recurrenceDate: dateEventStatus,
        token,
      });

      setAnchorEl(null);
      setEventId(0);

      addToast({
        type: 'success',
        title: 'Compromisso reaberto',
        description: 'O compromisso foi marcado reaberto no sistema.',
      });

      await LoadCalendar();
      setDateEventStatus('');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Falha ao reabrir compromisso.',
      });
    }
  };

  const handleCloseMenuCard = () => {
    setAnchorEl(null);
    setEventId(0);
  };

  const ResetReportStates = () => {
    setSubjectTerm('');
    setSubjectId('');
    setSubjectValue('');

    setCustomerGroupTerm('');
    setCustomerGroupId('');
    setCustomerGroupValue('');

    setCustomerTerm('');
    setCustomerId('');
    setCustomerValue('');

    setCalendarOfTerm('');
    setCalendarOfId('');
    setCalendarOfValue('');

    setResponsibleTerm('');
    setResponsibleId('');
    setResponsibleValue('');

    setOpposingTerm('');
    setOpposingId('');
    setOpposingValue('');

    setMatterTerm('');
    setMatterId('');
    setMatterValue('');

    setReportPeriodId('currentWeek');
    setReportPeriodValue('Semana Atual');
    setReportSituationId('both');
    setReportSituationValue('Ambos');
    setReportStateId('');
    setReportStateValue('');
    setReportLayoutId('pdf');
    setReportLayoutValue('PDF');

    changeText('Gerar Relatório');
    setIsGeneratingReport(false);
  };

  const saveDragDrop = async item => {
    try {
      const token = localStorage.getItem('@GoJur:token');

      await api.post('/Compromisso/Arrastar', {
        eventId: item.event.id,
        startDate: item.event.startStr,
        endDate: item.event.endStr,
        allDay: item.event.allDay,
        token,
      });

      addToast({
        type: 'success',
        title: 'Compromisso salvo',
        description: 'O compromisso foi alterado no sistema.',
      });

      setStartDateDrop('');
      setEndDateDrop('');
      setEventIdStr('');
    } catch (err) {
      LoadCalendar();
      addToast({
        type: 'error',
        title: 'Falha ao salvar compromisso.',
        // description:  err.response.data.Message
      });
    }
  };

  const handleDatesChange = (e: any) => {
    const sDate = format(e.start, 'yyyy-MM-dd');
    const eDate = format(e.end, 'yyyy-MM-dd');

    setStartDate(sDate);
    setEndDate(eDate);
  };

  const handleOpenDeadLineCalculator = () => {
    handleDetailsAnyType(null);
    handlePublicationModal('Calc');
  };

  const buttonsCalendarLabel = {
    dayGridMonth: 'Mês',
    timeGridWeek: 'Semana',
    dayGridWeek: 'Lista Sem',
    timeGridDay: 'Dia',
    listDay: 'Lista Dia',
    today: 'Hoje',
  };

  const handleAboutInfo = () => {
    setShowAboutMessage(!showAboutMessage);
  };

  const selectDate = () => {
    setSelectDateStart('');
    setOpenModalDateSelect(true);
  };

  const CloseDateSelect = () => {
    setOpenModalDateSelect(false);
    setSelectDateStart('');
  };

  const ApplyDateSelect = (e: any) => {
    setOpenModalDateSelect(false);
    setSelectDateStart('');
    calendarRef.current._calendarApi.gotoDate(e);
  };

  const AutomaticDateSelect = useCallback(
    (e: any) => {
      const check = Date.parse(e);

      if (check < 0) return;

      const dateInput = e.substring(8);
      let dateChange = selectDateStart.substring(8);

      if (dateChange == '') {
        const newDate = new Date();
        const date1 = newDate.getDate();

        if (
          date1 == 1 ||
          date1 == 2 ||
          date1 == 3 ||
          date1 == 4 ||
          date1 == 5 ||
          date1 == 6 ||
          date1 == 7 ||
          date1 == 8 ||
          date1 == 9
        ) {
          dateChange = `0${date1.toString()}`;
        } else {
          dateChange = date1.toString();
        }
      }

      if (dateInput != dateChange) {
        setOpenModalDateSelect(false);
        setSelectDateStart('');
        calendarRef.current._calendarApi.gotoDate(e);
      }
    },
    [selectDateStart],
  );

  return (
    <>
      {!isMOBILE && (
        <Container
          onScrollCapture={handleScroll}
          onContextMenu={e => e.preventDefault()}
        >
          {isLoading && (
            <>
              <Overlay />
              <div className="waitingMessage">
                <Loader size={15} color="var(--blue-twitter)" />
                &nbsp;&nbsp;Aguarde...
              </div>
            </>
          )}

          <HeaderPage />

          <TaskBar>
            <div>
              <Search
                onKeyPress={(e: React.KeyboardEvent) => {
                  if (
                    e.key === 'Delete' ||
                    e.key === 'Backspace' ||
                    e.which === 8
                  ) {
                    e.preventDefault();
                  }
                  if (e.key == 'Enter') {
                    setIsLoadingSearch(true);
                    setIsLoading(true);
                    setCalendarListSearch([]);
                    setPageNumber(1);
                  }
                }}
                placeholder="Pesquisar Compromissos"
                className="search"
                name="search"
                value={!isLoadingSearch ? filterTerm : ''}
                onChange={e => setFilterTerm(e.target.value)}
              />

              <FcSearch
                className="icons"
                title="Clique para realizar a pesquisa pelo termo digitado"
                onClick={() => {
                  setIsLoadingSearch(true);
                  setIsLoading(true);
                  setCalendarListSearch([]);
                  setPageNumber(1);
                }}
              />

              <FcAbout
                className="icons"
                title="Pesquisa de compromissos por assunto, descrição e observação"
              />

              <div style={{ zIndex: 9997 }}>
                <MultiSelect
                  options={optionsCalendarFilter}
                  value={multiFilter}
                  onChange={(values: []) => {
                    setIsLoadingSearch(showSearchList); // set reload for list search
                    setIsLoading(!showSearchList); // set reload for full calendar
                    setMultiFilter(values);
                  }}
                  labelledBy="Selecione"
                  className="select"
                  selectAllLabel="Selecione"
                  overrideStrings={{
                    allItemsAreSelected: 'Todos',
                    selectSomeItems: 'Filtragem Rápida',
                  }}
                  hasSelectAll={false}
                  disableSearch
                />
              </div>

              <button
                className="buttonLinkClick"
                onClick={() => handleOpenDeadLineCalculator()}
                title="Clique para abrir a calculadora de prazos"
                type="submit"
              >
                <FaCalculator />
                Calculadora de Prazos
              </button>
            </div>

            <div className="buttonHamburguer">
              <button
                type="button"
                onClick={() => handleIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <ImMenu4 className="iconMenu" />
                ) : (
                  <ImMenu3 className="iconMenu" />
                )}
              </button>

              {isMenuOpen ? <MenuHamburguer name="calendarOptions" /> : null}
            </div>
          </TaskBar>

          <Content>
            {openModalDateSelect && (
              <ModalDateSelect>
                <div id="Header" style={{ height: '30px' }}>
                  <div className="menuTitle">
                    &nbsp;&nbsp;&nbsp;&nbsp;Selecionar Data
                  </div>
                  <div className="menuSection">
                    <FiX onClick={e => CloseDateSelect()} />
                  </div>
                </div>

                <br />

                <div
                  style={{ marginLeft: '35%', width: '150px', float: 'left' }}
                >
                  <label htmlFor="data" style={{ width: '35%' }}>
                    Selecionar Data
                    <input
                      style={{ backgroundColor: 'white', marginLeft: '-20px' }}
                      type="date"
                      value={selectDateStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSelectDateStart(e.target.value)
                      }
                      onInput={(e: ChangeEvent<HTMLInputElement>) =>
                        AutomaticDateSelect(e.target.value)
                      }
                    />
                  </label>
                </div>

                <br />
                <br />
                <br />
                <br />

                <div
                  style={{ float: 'left', width: '150px', marginLeft: '70px' }}
                >
                  <button
                    type="button"
                    className="buttonClick"
                    onClick={() => ApplyDateSelect(selectDateStart)}
                  >
                    <AiOutlineCheckCircle />
                    Aplicar
                  </button>
                </div>

                <div style={{ float: 'left', width: '150px' }}>
                  <button
                    type="button"
                    className="buttonClick"
                    onClick={() => CloseDateSelect()}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </ModalDateSelect>
            )}

            {openExportConfig && (
              <CalendarExportConfig
                handleExportState={handleExportState}
                handleCloseExportConfig={handleCloseExportConfig}
              />
            )}

            <ModalFast show={openModalFast}>
              <div
                style={{
                  marginLeft: '15px',
                  marginTop: '10px',
                  marginRight: '10px',
                }}
              >
                Em:&nbsp;
                {dateString}
                <br />
                <br />
                O que:
                <br />
                <br />
                <AutoCompleteSelect className="selectSubject">
                  <p>Assunto</p>
                  <Select
                    isSearchable
                    value={subject.filter(options => options.id == subjectId)}
                    onChange={handleSubjectSelected}
                    onInputChange={term => setSubjectTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={subject}
                  />
                </AutoCompleteSelect>
                <br />
                <br />
                <label htmlFor="descricao" style={{ fontSize: '12px' }}>
                  Descrição, exemplo: Audiência às 10h ou 10:30h
                  <br />
                  <input
                    type="text"
                    style={{ backgroundColor: 'white' }}
                    value={description}
                    name="descricao"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDescription(e.target.value)
                    }
                    autoComplete="off"
                  />
                </label>
                <br />
                <br />
                <br />
                <button
                  className="buttonLinkClick"
                  title="Clique para retornar a agenda do GOJUR"
                  onClick={item => handleClickInclude(item)}
                  type="submit"
                >
                  + Detalhes...
                </button>
                <br />
                <br />
                <div style={{ float: 'right', marginRight: '-40px' }}>
                  <div style={{ float: 'left' }}>
                    {!isSaving && (
                      <button
                        className="buttonClick"
                        type="button"
                        onClick={() => saveFastEvent()}
                      >
                        <FiSave />
                        {!isSaving && <span>Salvar </span>}
                        {/* {isGeneratingMerge && <Loader size={5} color="var(--orange)" />} */}
                      </button>
                    )}
                    {isSaving && (
                      <button className="buttonClick" type="button">
                        <BiLoader />
                        {isSaving && <span>Aguarde...</span>}
                        {/* {isGeneratingMerge && <Loader size={5} color="var(--orange)" />} */}
                      </button>
                    )}
                  </div>

                  <div style={{ float: 'left', width: '150px' }}>
                    <button
                      type="button"
                      className="buttonClick"
                      onClick={() => handleFastEventClose()}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </ModalFast>

            <ModalParameters
              show={openModalParameters && caller === 'parameterCalendarModal'}
            >
              <div
                style={{
                  marginLeft: '15px',
                  marginTop: '10px',
                  marginRight: '10px',
                }}
              >
                <label htmlFor="type">
                  Privacidade padrão
                  <br />
                  <select
                    name="userType"
                    value={sharedParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSharedParameter(e.target.value)
                    }
                  >
                    <option value="U">Público</option>
                    <option value="R">Privado</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Visualização padrão
                  <br />
                  <select
                    name="userType"
                    value={viewParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setViewParameter(e.target.value)
                    }
                  >
                    <option value="month">Mensal</option>
                    <option value="agendaWeek">Semanal</option>
                    <option value="basicWeek">Semanal Lista</option>
                    <option value="agendaDay">Diária</option>
                    <option value="basicDay">Diária Lista</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Permissão atualização
                  <br />
                  <select
                    name="userType"
                    value={updatePermissionParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setUpdatePermissionParameter(e.target.value)
                    }
                  >
                    <option value="restricted">Não</option>
                    <option value="allowed">Sim</option>
                  </select>
                </label>

                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <p>Prazo Padrão</p>
                  <Select
                    isSearchable
                    value={subjectParameter.filter(
                      options => options.id == subjectParameterId,
                    )}
                    onChange={handleSubjectParameterSelected}
                    onInputChange={term => setSubjectParameterTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={subjectParameter}
                  />
                </div>

                <label htmlFor="type">
                  Mostrar na agenda:
                  <br />
                  <select
                    name="userType"
                    value={userTypeParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setUserTypeParameter(e.target.value)
                    }
                  >
                    <option value="RC">Responsável e Compartilhado</option>
                    <option value="R">Responsável</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Receber alertas e-mail:
                  <br />
                  <select
                    name="userType"
                    value={sendEmailParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSendEmailParameter(e.target.value)
                    }
                  >
                    <option value="RC">Responsável e Compartilhado</option>
                    <option value="R">Responsável</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Notificar cliente por:
                  <br />
                  <select
                    name="userType"
                    value={customerNotification}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setCustomerNotification(e.target.value)
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="EM">E-Mail</option>
                    <option value="WA">WhatsApp</option>
                    <option value="AM">E-Mail e WhatsApp</option>
                  </select>
                </label>
                <br />
                <br />
                <br />

                <div
                  id="Buttons"
                  style={{ float: 'right', marginRight: '-40px' }}
                >
                  <div style={{ float: 'left' }}>
                    <button
                      className="buttonClick"
                      type="button"
                      onClick={() => saveParameter()}
                    >
                      <FiSave />
                      Salvar
                    </button>
                  </div>

                  <div style={{ float: 'left', width: '150px' }}>
                    <button
                      type="button"
                      className="buttonClick"
                      onClick={() => handleParametersClose()}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                  </div>
                </div>
                <br />
              </div>
            </ModalParameters>

            {isOpenMenuReport && <CalendarReport />}

            <Menu
              anchorEl={anchorEl}
              keepMounted
              className="headerCard"
              open={Boolean(anchorEl)}
              onClose={handleCloseMenuCard}
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

            <ListSearch show={showSearchList}>
              <div>
                <div className="headerSearch">
                  <button
                    className="buttonLinkClick"
                    title="Clique para retornar a agenda do GOJUR"
                    onClick={() => {
                      setShowSearchList(false);
                      setFilterTerm('');
                      setCalendarListSearch([]);
                    }}
                    type="submit"
                  >
                    Voltar para a agenda
                  </button>

                  <span>{totalPageCount} Compromissos Encontrados</span>
                </div>

                {calendarListSearch.map(item => {
                  return (
                    <>
                      <div
                        key={item.id}
                        onClick={() =>
                          handleClickEditSearch(item.id, item.start)
                        }
                        className="itemCalendar"
                        title={item.title}
                      >
                        <div style={{ width: '2%' }}>
                          {item.recorrencia != 0 && (
                            <p>
                              <div style={{ marginTop: '-1px' }}>
                                <AiOutlineReload
                                  style={{
                                    height: '20px',
                                    width: '20px',
                                    color: '#2C8ED6',
                                  }}
                                />
                              </div>
                            </p>
                          )}
                        </div>
                        &nbsp;&nbsp;
                        <div style={{ width: '15%' }}>
                          {`
                              ${format(new Date(item.start), 'dd')}
                              ${` ${ConvertMonthToPtBr(
                                new Date(item.start).getMonth() + 1,
                                true,
                              )} de ${new Date(item.start).getFullYear()}`}
                              ${`(${ConvertDayOfWeekToPtBr(item.dayOfWeek)})`}
                          `}
                        </div>
                        {item.status == 'P' && (
                          <div
                            style={{
                              width: '15%',
                              color: 'white',
                              textAlign: 'center',
                              justifyContent: 'center',
                              paddingTop: '5px',
                              marginRight: '1rem',
                              borderRadius: '20px',
                              backgroundColor: item.backgroundColor,
                            }}
                          >
                            &nbsp;&nbsp;
                            {item.subjectText}
                          </div>
                        )}
                        {item.status == 'L' && (
                          <div
                            style={{
                              width: '15%',
                              color: 'white',
                              textAlign: 'center',
                              justifyContent: 'center',
                              paddingTop: '5px',
                              marginRight: '1rem',
                              borderRadius: '20px',
                              backgroundColor: item.backgroundColor,
                              opacity: 0.5,
                              textDecoration: 'line-through underline',
                            }}
                          >
                            &nbsp;&nbsp;
                            {item.subjectText}
                          </div>
                        )}
                        {item.status == 'P' && (
                          <div style={{ width: '65%' }}>
                            &nbsp;&nbsp;
                            {item.title.length > 200
                              ? `${item.title.substring(0, 200)}...`
                              : item.title}
                          </div>
                        )}
                        {item.status == 'L' && (
                          <div
                            style={{
                              width: '65%',
                              textDecoration: 'line-through underline',
                            }}
                          >
                            &nbsp;&nbsp;
                            {item.title.length > 200
                              ? `${item.title.substring(0, 200)}...`
                              : item.title}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </ListSearch>

            {finishDefaultView && (
              <FullCalendar
                ref={calendarRef}
                locale={ptbr}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  listPlugin,
                  interactionPlugin,
                ]}
                initialView={defaultView}
                events={calendarList}
                buttonText={buttonsCalendarLabel}
                datesSet={e => handleDatesChange(e)}
                showNonCurrentDates
                dateClick={handleClickIncludeFast}
                eventClick={handleClickEdit}
                displayEventTime={false}
                views={{ dayGridMonth: { dayMaxEventRows: 7 } }}
                height="100vh"
                eventDragStart={item => {
                  setEventIdStr(item.event.id);
                  setStartDateDrop(item.event.startStr);
                }}
                eventChange={item => saveDragDrop(item)}
                eventContent={renderAppointmentCell}
                customButtons={{
                  myCustomButton: {
                    text: 'Ir para',
                    click() {
                      selectDate();
                    },
                  },
                }}
                headerToolbar={{
                  left: 'today',
                  center: 'title',
                  right:
                    'dayGridMonth,timeGridWeek,dayGridWeek,timeGridDay,listDay,myCustomButton,prev,next',
                }}
              />
            )}
          </Content>

          {/* When click on button Saiba Mais show message info */}
          {showAboutMessage && (
            <CompanyAccessDenied
              title="Exportação da Agenda"
              description="Através desta funcionalidade será possível gerar arquivos no padrão iCal (norma RFC5545) com extensão .ics. Este formato padrão permite a importação de dados da agenda para o outros players do mercado como por ex o Google Calendar e o Microsoft Outlook."
              removeFixedMessages
              handleCloseModal={handleAboutInfo}
            />
          )}

          {openProcessModal ? <ProcessModal /> : null}
        </Container>
      )}

      {isMOBILE && (
        <Container
          onScrollCapture={handleScroll}
          onContextMenu={e => e.preventDefault()}
        >
          {isLoading && (
            <>
              <Overlay />
              <div className="waitingMessage">
                <Loader size={15} color="var(--blue-twitter)" />
                &nbsp;&nbsp;Aguarde...
              </div>
            </>
          )}

          <HeaderPage />

          <TaskBarMobile>
            <div>
              <div>
                <div style={{ float: 'left' }}>
                  <Search
                    width="90%"
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (
                        e.key === 'Delete' ||
                        e.key === 'Backspace' ||
                        e.which === 8
                      ) {
                        e.preventDefault();
                      }
                      if (e.key == 'Enter') {
                        setIsLoadingSearch(true);
                        setIsLoading(true);
                        setCalendarListSearch([]);
                        setPageNumber(1);
                      }
                    }}
                    placeholder="Pesquisar Compromissos"
                    className="search"
                    name="search"
                    value={!isLoadingSearch ? filterTerm : ''}
                    onChange={e => setFilterTerm(e.target.value)}
                  />
                </div>

                <div style={{ float: 'left' }}>
                  <FcSearch
                    className="icons"
                    title="Clique para realizar a pesquisa pelo termo digitado"
                    onClick={() => {
                      setIsLoadingSearch(true);
                      setIsLoading(true);
                      setCalendarListSearch([]);
                      setPageNumber(1);
                    }}
                  />

                  <FcAbout
                    className="icons"
                    title="Pesquisa de compromissos por assunto, descrição e observação"
                  />
                </div>
              </div>

              <div style={{ zIndex: 9997 }}>
                <MultiSelect
                  options={optionsCalendarFilter}
                  value={multiFilter}
                  onChange={(values: []) => {
                    setIsLoadingSearch(showSearchList); // set reload for list search
                    setIsLoading(!showSearchList); // set reload for full calendar
                    setMultiFilter(values);
                  }}
                  labelledBy="Selecione"
                  className="select"
                  selectAllLabel="Selecione"
                  overrideStrings={{
                    allItemsAreSelected: 'Todos',
                    selectSomeItems: 'Filtragem Rápida',
                  }}
                  hasSelectAll={false}
                  disableSearch
                />
              </div>

              <div>
                <div style={{ float: 'left' }}>
                  <button
                    className="buttonLinkClick"
                    onClick={() => handleOpenDeadLineCalculator()}
                    title="Clique para abrir a calculadora de prazos"
                    type="submit"
                  >
                    <FaCalculator />
                    Calculadora de Prazos
                  </button>
                </div>

                <div className="buttonHamburguer">
                  <button
                    type="button"
                    onClick={() => handleIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? (
                      <ImMenu4 className="iconMenu" />
                    ) : (
                      <ImMenu3 className="iconMenu" />
                    )}
                  </button>

                  {isMenuOpen ? (
                    <MenuHamburguer name="calendarOptions" />
                  ) : null}
                </div>
              </div>
            </div>
          </TaskBarMobile>

          <Content>
            {openModalDateSelect && (
              <ModalDateSelectMobile>
                <div id="Header" style={{ height: '30px' }}>
                  <div className="menuTitle">
                    &nbsp;&nbsp;&nbsp;&nbsp;Selecionar Data
                  </div>
                  <div className="menuSection">
                    <FiX onClick={e => CloseDateSelect()} />
                  </div>
                </div>

                <br />

                <div
                  style={{ marginLeft: '29%', width: '150px', float: 'left' }}
                >
                  <label htmlFor="data" style={{ marginLeft: '10%' }}>
                    Selecionar Data
                    <input
                      style={{ backgroundColor: 'white', marginLeft: '-20px' }}
                      type="date"
                      value={selectDateStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setSelectDateStart(e.target.value)
                      }
                    />
                  </label>
                </div>

                <br />
                <br />
                <br />
                <br />

                <div
                  style={{ float: 'left', width: '100px', marginLeft: '40px' }}
                >
                  <button
                    type="button"
                    className="buttonClick"
                    onClick={() => ApplyDateSelect(selectDateStart)}
                  >
                    <AiOutlineCheckCircle />
                    Aplicar
                  </button>
                </div>

                <div style={{ float: 'left', width: '100px' }}>
                  <button
                    type="button"
                    className="buttonClick"
                    onClick={() => CloseDateSelect()}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </ModalDateSelectMobile>
            )}

            {openExportConfig && (
              <CalendarExportConfig
                handleExportState={handleExportState}
                handleCloseExportConfig={handleCloseExportConfig}
              />
            )}

            <ModalFastMobile show={openModalFast}>
              <div
                style={{
                  marginLeft: '15px',
                  marginTop: '10px',
                  marginRight: '10px',
                }}
              >
                Em:&nbsp;
                {dateString}
                <br />
                <br />
                O que:
                <br />
                <br />
                <AutoCompleteSelect className="selectSubject">
                  <p>Assunto</p>
                  <Select
                    isSearchable
                    value={subject.filter(options => options.id == subjectId)}
                    onChange={handleSubjectSelected}
                    onInputChange={term => setSubjectTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={subject}
                  />
                </AutoCompleteSelect>
                <br />
                <br />
                <label htmlFor="descricao" style={{ fontSize: '12px' }}>
                  Descrição, exemplo: Audiência às 10h ou 10:30h
                  <br />
                  <input
                    type="text"
                    style={{ backgroundColor: 'white' }}
                    value={description}
                    name="descricao"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDescription(e.target.value)
                    }
                    autoComplete="off"
                  />
                </label>
                <br />
                <br />
                <br />
                <button
                  className="buttonLinkClick"
                  title="Clique para retornar a agenda do GOJUR"
                  onClick={item => handleClickInclude(item)}
                  type="submit"
                >
                  + Detalhes...
                </button>
                <br />
                <br />
                <div style={{ float: 'right', marginRight: '-80px' }}>
                  <div style={{ float: 'left' }}>
                    {!isSaving && (
                      <button
                        className="buttonClick"
                        type="button"
                        onClick={() => saveFastEvent()}
                      >
                        <FiSave />
                        {!isSaving && <span>Salvar </span>}
                      </button>
                    )}
                    {isSaving && (
                      <button className="buttonClick" type="button">
                        <BiLoader />
                        {isSaving && <span>Aguarde...</span>}
                      </button>
                    )}
                  </div>

                  <div style={{ float: 'left', width: '150px' }}>
                    <button
                      type="button"
                      className="buttonClick"
                      onClick={() => handleFastEventClose()}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </ModalFastMobile>

            <ModalParametersMobile
              show={openModalParameters && caller === 'parameterCalendarModal'}
            >
              <div
                style={{
                  marginLeft: '15px',
                  marginTop: '10px',
                  marginRight: '10px',
                }}
              >
                <label htmlFor="type">
                  Privacidade padrão
                  <br />
                  <select
                    name="userType"
                    value={sharedParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSharedParameter(e.target.value)
                    }
                  >
                    <option value="U">Público</option>
                    <option value="R">Privado</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Visualização padrão
                  <br />
                  <select
                    name="userType"
                    value={viewParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setViewParameter(e.target.value)
                    }
                  >
                    <option value="month">Mensal</option>
                    <option value="agendaWeek">Semanal</option>
                    <option value="basicWeek">Semanal Lista</option>
                    <option value="agendaDay">Diária</option>
                    <option value="basicDay">Diária Lista</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Permissão atualização
                  <br />
                  <select
                    name="userType"
                    value={updatePermissionParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setUpdatePermissionParameter(e.target.value)
                    }
                  >
                    <option value="restricted">Não</option>
                    <option value="allowed">Sim</option>
                  </select>
                </label>
                <br />
                <br />

                <AutoCompleteSelect className="selectSubjectParameter">
                  <p>Prazo Padrão</p>
                  <Select
                    isSearchable
                    value={subjectParameter.filter(
                      options => options.id == subjectParameterId,
                    )}
                    onChange={handleSubjectParameterSelected}
                    onInputChange={term => setSubjectParameterTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={subjectParameter}
                  />
                </AutoCompleteSelect>
                <br />
                <br />

                <label htmlFor="type">
                  Mostrar na agenda:
                  <br />
                  <select
                    name="userType"
                    value={userTypeParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setUserTypeParameter(e.target.value)
                    }
                  >
                    <option value="RC">Responsável e Compartilhado</option>
                    <option value="R">Responsável</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Receber alertas e-mail:
                  <br />
                  <select
                    name="userType"
                    value={sendEmailParameter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSendEmailParameter(e.target.value)
                    }
                  >
                    <option value="RC">Responsável e Compartilhado</option>
                    <option value="R">Responsável</option>
                  </select>
                </label>
                <br />
                <br />

                <label htmlFor="type">
                  Notificar cliente por:
                  <br />
                  <select
                    name="userType"
                    value={customerNotification}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setCustomerNotification(e.target.value)
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="EM">E-Mail</option>
                    <option value="WA">WhatsApp</option>
                    <option value="AM">E-Mail e WhatsApp</option>
                  </select>
                </label>
                <br />
                <br />

                <div style={{ float: 'right', marginRight: '-40px' }}>
                  <div style={{ float: 'left' }}>
                    <button
                      className="buttonClick"
                      type="button"
                      onClick={() => saveParameter()}
                    >
                      <FiSave />
                      Salvar
                    </button>
                  </div>

                  <div style={{ float: 'left', width: '150px' }}>
                    <button
                      type="button"
                      className="buttonClick"
                      onClick={() => handleParametersClose()}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </ModalParametersMobile>

            {isOpenMenuReport && <CalendarReport />}

            <Menu
              anchorEl={anchorEl}
              keepMounted
              className="headerCard"
              open={Boolean(anchorEl)}
              onClose={handleCloseMenuCard}
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

            <ListSearchMobile show={showSearchList}>
              <div>
                <div className="headerSearch">
                  <button
                    className="buttonLinkClick"
                    title="Clique para retornar a agenda do GOJUR"
                    onClick={() => {
                      setShowSearchList(false);
                      setFilterTerm('');
                      setCalendarListSearch([]);
                    }}
                    type="submit"
                  >
                    Voltar para a agenda
                  </button>

                  <span>{totalPageCount} Compromissos Encontrados</span>
                </div>

                {calendarListSearch.map(item => {
                  return (
                    <>
                      <div
                        key={item.id}
                        onClick={() =>
                          handleClickEditSearch(item.id, item.start)
                        }
                        className="itemCalendar"
                        title={item.title}
                      >
                        <div style={{ width: '2%' }}>
                          {item.recorrencia != 0 && (
                            <p>
                              <div style={{ marginTop: '-1px' }}>
                                <AiOutlineReload
                                  style={{
                                    height: '20px',
                                    width: '20px',
                                    color: '#2C8ED6',
                                  }}
                                />
                              </div>
                            </p>
                          )}
                        </div>
                        &nbsp;&nbsp;
                        <div style={{ width: '15%' }}>
                          {`
                              ${format(new Date(item.start), 'dd')}
                              ${` ${ConvertMonthToPtBr(
                                new Date(item.start).getMonth() + 1,
                                true,
                              )} de ${new Date(item.start).getFullYear()}`}
                              ${`(${ConvertDayOfWeekToPtBr(item.dayOfWeek)})`}
                          `}
                        </div>
                        {item.status == 'P' && (
                          <div
                            style={{
                              height: '25px',
                              width: '15%',
                              color: 'white',
                              textAlign: 'center',
                              justifyContent: 'center',
                              paddingTop: '5px',
                              marginRight: '1rem',
                              borderRadius: '20px',
                              backgroundColor: item.backgroundColor,
                            }}
                          >
                            &nbsp;&nbsp;
                            {item.subjectText}
                          </div>
                        )}
                        {item.status == 'L' && (
                          <div
                            style={{
                              height: '25px',
                              width: '15%',
                              color: 'white',
                              textAlign: 'center',
                              justifyContent: 'center',
                              paddingTop: '5px',
                              marginRight: '1rem',
                              borderRadius: '20px',
                              backgroundColor: item.backgroundColor,
                              opacity: 0.5,
                              textDecoration: 'line-through underline',
                            }}
                          >
                            &nbsp;&nbsp;
                            {item.subjectText}
                          </div>
                        )}
                        {item.status == 'P' && (
                          <div style={{ width: '65%' }}>
                            &nbsp;&nbsp;
                            {item.title.length > 200
                              ? `${item.title.substring(0, 200)}...`
                              : item.title}
                          </div>
                        )}
                        {item.status == 'L' && (
                          <div
                            style={{
                              width: '65%',
                              textDecoration: 'line-through underline',
                            }}
                          >
                            &nbsp;&nbsp;
                            {item.title.length > 200
                              ? `${item.title.substring(0, 200)}...`
                              : item.title}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </ListSearchMobile>

            {finishDefaultView && (
              <FullCalendar
                ref={calendarRef}
                locale={ptbr}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  listPlugin,
                  interactionPlugin,
                ]}
                initialView={defaultView}
                events={calendarList}
                buttonText={buttonsCalendarLabel}
                datesSet={e => handleDatesChange(e)}
                showNonCurrentDates
                dateClick={handleClickIncludeFast}
                eventClick={handleClickEdit}
                displayEventTime={false}
                views={{ dayGridMonth: { dayMaxEventRows: 7 } }}
                height="100vh"
                eventDragStart={item => {
                  setEventIdStr(item.event.id);
                  setStartDateDrop(item.event.startStr);
                }}
                eventChange={item => saveDragDrop(item)}
                eventContent={renderAppointmentCell}
                customButtons={{
                  myCustomButton: {
                    text: 'Ir para',
                    click() {
                      selectDate();
                    },
                  },
                }}
                headerToolbar={{
                  left: 'today',
                  center: 'title',
                  right:
                    'dayGridMonth,timeGridWeek,dayGridWeek,timeGridDay,listDay,myCustomButton,prev,next',
                }}
              />
            )}
          </Content>

          {openProcessModal ? <ProcessModal /> : null}
        </Container>
      )}

      <VideoTrainningModal />

      {(openModalParameters ||
        openModalFast ||
        isOpenMenuReport ||
        openModalSubject ||
        openModalDateSelect) && <Overlay />}

      {isOpenOldVersion && (
        <ConfirmBoxModal
          message="A versão anterior ficará disponível para acesso até o dia 28/02/2022"
          caller="warningCalendar30Days"
        />
      )}
    </>
  );
};

export default Calendar;
