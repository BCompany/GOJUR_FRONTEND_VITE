/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-const-assign */
// ESLINT PAGE RULES
/* eslint-disable no-undef */
/* eslint-disable default-case */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-useless-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

// IMPORTACOES
import React, {ChangeEvent,useCallback,useEffect,useState } from 'react';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { RiFolder2Fill, RiEraserLine } from 'react-icons/ri';
import { IoIosPaper } from 'react-icons/io';
import { FiClock, FiTrash, FiSave, FiMail } from 'react-icons/fi';
import { GoGitMerge } from "react-icons/go"
import { FaRegTimesCircle, FaWhatsapp } from 'react-icons/fa';
import { BsCheckBox } from 'react-icons/bs';
import { TiCancel } from 'react-icons/ti';
import { FcSearch } from 'react-icons/fc';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { format } from 'date-fns';
import { isMobile } from 'react-device-detect'
import { useModal } from 'context/modal';
import { useToast } from 'context/toast';
import { useDelay, FormatDate } from 'Shared/utils/commonFunctions';
import Select from 'react-select';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import api from 'services/api';
import HeaderComponent from 'components/HeaderComponent';
import TextArea from 'components/TextArea';
import DatePicker from 'components/DatePicker';
import TimePicker from 'components/TimePicker';
import Loader from 'react-spinners/ClipLoader';
import { useLocation } from 'react-router-dom';
import { AppointmentPropsSave, AppointmentPropsDelete, SelectValues, Data, dataProps, LembretesData, MatterData, ModalProps, ResponsibleDTO, Settings, ShareListDTO, userListData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import { IMatterData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import LogModal from '../../../../../../../../components/LogModal';
import ConfirmDeleteModal from 'components/ConfirmDeleteModal';
import GridSelectProcess from './GridSelectProcess';
import SaveModal from './SaveModal';
import DeleteModal from './DeleteModal';
import { selectedDayProps, selectedWeekProps } from './Interfaces/ICalendar';
import { dayRecurrence, optionsLembrete, weekRecurrence } from './ListValues/List';
import CalendarReminderModal from './CustomizeCalendarReminderModal';
import { Container2, Container, ModalContent, ModalDateSettings, Wrapper, WrapperResp, Process, DropArea, Footer, Lembrete, Responsavel, ResponsibleList, ReminderList, ShareList, Privacidade, Share, ModalRecurrence, Multi, ConfirmOverlay, ModalConfirm} from './styles';




export interface IParameterData {
  parameterId: number;
  parameterName: string;
  parameterValue: string;
  message: string;
}

const layout = [{
  idElement: 1,
  name: 'Modal',
  // positions: { i: '1', x: (window.innerWidth >= 1080 ? 2.2 : 0), y: (window.innerWidth >= 1080 ? 4 : 0), w: 7, h: (isMobile ? 12 : 17) },
  // positions: { i: '1', x: 2.2, y: 4, w: 7, h: (isMobile?12:17) },
  positions: { i: '1', x: 0, y: 0, w: 7, h: (isMobile?12:17) },
}];

const layoutBig = [{
  idElement: 1,
  name: 'Modal',
  positions: { i: '1', x: 2.2, y: 4, w: 7, h: (isMobile?12:17) },
}];

const CreateAppointment: React.FC<ModalProps> = ({ isClosed }) => {
  const {matterSelected, dateEnd, handleModalActiveId, selectProcess,handleModalActive,openSelectProcess,handleSelectProcess,jsonModalObjectResult,handleJsonModalObjectResult,deadLineText,publicationText, modalActiveId, caller } = useModal();
  const { addToast} = useToast();
  const [appointmentAllowEdit, setAppointmentAllowEdit] = useState<string>('N'); // Pode editar
  const [appointmentBlockUpdate, setAppointmentBlockUpdate] = useState(true);
  const [screenWitdh, setScreenWitdh] = useState(window.innerWidth);
  const [layoutComp, setLayoutComp] = useState<dataProps[]>(layout);
  const [layoutCompBig, setLayoutBig] = useState<dataProps[]>(layoutBig);
  const [onDrag, setOnDrag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const [appointmentStore, setAppointmentStore] = useState<AppointmentPropsSave>({} as AppointmentPropsSave); // Armazena os dados para salvar o compromisso
  const [appointmentDeleteStore, setAppointmentDeleteStore] = useState<AppointmentPropsDelete>({} as AppointmentPropsDelete); // Armazena os dados para salvar o compromisso
  const [appointmentId, setAppointmentId] = useState(0);
  const [appointmentSubject, setAppointmentSubject] = useState<string>(''); // Assuntos do Compromisso
  const [appointmentSubjectId, setAppointmentSubjectId] = useState<string>(''); // Assuntos do Compromisso
  const [appointmentDateBeggin, setAppointmentDateBeggin] = useState<string>('',); // Data de inicio do compromisso
  const [appointmentHourBeggin, setAppointmentHourBeggin] = useState<string>('',); // Hora de Inicio do compromisso
  const [appointmentDateEnd, setAppointmentDateEnd] = useState<string>(''); // Data de termino do compromisso
  const [appointmentHourEnd, setAppointmentHourEnd] = useState<string>(''); // Hora de termino do compromisso
  const [appointmentUser, setAppointmentUser] = useState(localStorage.getItem('@GoJur:name'),); // Nome do usuário criador do compromisso
  const [appointmentAllDay, setAppointmentAllDay] = useState<string>('N'); // Dia todo
  const [appointmentRecurrent, setAppointmentRecurrent] = useState<string>('N'); // recorrencia
  const [appointmentStatus, setAppointmentStatus] = useState<string>('P'); // Status
  const [appointmentDescription, setAppointmentDescription] = useState<string>(''); // Descrição do compromisso
  const [appointmentObs, setAppointmentObs] = useState<string>(''); // Observação do compromisso
  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData); // processo associado
  const [appointmentRemindersList, setAppointmentRemindersList] = useState<LembretesData[]>([]); // Lista de Lembretes
  const [appointmentPrivateEvent, setAppointmentPrivateEvent,] = useState<string>(''); // Privacidade do compromisso
  const [userList, setUserList] = useState<userListData[]>([]); // Lista de Usuarios
  const [appointmentResponsibleList, setAppointmentResponsibleList] = useState<ResponsibleDTO[]>([]); // Lista de responsaveis
  const [appointmentSharedList, setAppointmentSharedList] = useState<ShareListDTO[]>([]); // Lista de compartilhados
  const [statusEvent, setStatusEvent] = useState<string>(''); // Status do evento
  const [optionsSubject, setOptionsSubject] = useState<SelectValues[]>([]); // Lista de Assuntos
  const [openSaveModal, setOpenSaveModal] = useState(false); // Controla a Abertura do modal de salvar
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Controla a Abertura do modal de apagar
  const [showLog, setShowLog] = useState(false); // Controla a Abertura do modal de Log
  const [redirectLink, setRedirectLink] = useState('/####'); // link de redirecionamento para o processo
  const [allowEditController, setAllowEditController] = useState(false); // Controla o Input de edição do modo publico
  const [recurrentController, setRecurrentController] = useState(false); // Controla o Icone de recorrencia
  const [appointmentNotifyMatterCustomer, setAppointmentNotifyMatterCustomer,] = useState<string>('N'); // Controla o Input de notificação de cliente
  const [appointmentNotifyResponsibleCustomer, setAppointmentNotifyResponsibleCustomer,] = useState<string>('N'); // Controla o Input de notificação de cliente
  const [appointmentNotifySharedCustomer, setAppointmentNotifySharedCustomer,] = useState<string>('N'); // Controla o Input de notificação de cliente
  const [privacyChange, setPrivacyChange] = useState(true); // Controla o component de privacidade e seus eventos
  const [processTitle, setProcessTitle] = useState('Associar Processo'); // Titulo do component de processo
  const [textButton, setTextButton] = useState('Concluir'); // Titulo do button concluir | reabrir
  const [isCreate, setIsCreate] = useState(false); // Controle do Footer do modal
  const [dragControll, setDragControll] = useState(false);
  const [blockAssociateMatter, setBlockAssociateMatter] = useState(false);
  const [userResponsibleValue, setUserResponsibleValue] = useState('');
  const [userSharedValue, setUserSharedValue] = useState('');
  const [defaultSettings, setDefaultSettings] = useState<Settings | undefined>({} as Settings,);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [userIdCurrentDrag, setUserIdCurrentDrag] = useState<string>('');
  const [numWhatsApp, setNumWhatsApp] = useState<string>('');
  const [customerNameWhatsApp, setCustomerNameWhatsApp] = useState<string>('');  // RECURRENCE
  const [openModalRecurrence, setLoadEventRecurrence]= useState<boolean>(false)
  const [isRecurrence , setIsRecurrence] = useState<string>('N');
  const [recurrenceStartDate, setRecurrenceStartDate] = useState<string>(''); // Iniciar em
  const [recurrenceSelectRepete, setRecurrenceSelectRepete] = useState<string>(''); // Repetir a cada
  const [selectDay, setSelectDay] = useState<string>(''); // Diária
  const [selectWeek, setSelectWeek] = useState<selectedWeekProps[]>([]); // Semanal
  const [selectDayMonth, setSelectDayMonth] = useState<selectedDayProps[]>([]); // Dias do Mês
  const [selectMonthYear, setSelectMonthYear] = useState<string>(''); // Mês
  const [selectDayYear, setSelectDayYear] = useState<selectedDayProps[]>([]); // Dias
  const [sharedParameterEnd, setSharedParameterEnd] = useState<string>('1'); // Termina em
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>(FormatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-MM-dd'))
  const [recurrenceQtd , setRecurrenceQtd] = useState<string>(''); // Quantidade
  const [hideRecurrenceButton , setHideRecurrenceButton] = useState<boolean>(false);
  const userToken = localStorage.getItem('@GoJur:token');
  const [openReminderModal, setOpenReminderModal] = useState<boolean>(false)
  const [big, setBig] = useState<boolean>(false);
  const [small, setSmall] = useState<boolean>(false);
  const [checkMessage, setCheckMessage] = useState(false)
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmDeleteCalendarEvent, setConfirmDeleteCalendarEvent] = useState<boolean>(false)
  const { handleCancelMessage, handleConfirmMessage, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [completeLink, setCompleteLink] = useState<boolean>(false);
  const [appointmentWorkflowActionsExecId, setAppointmentWorkflowActionsExecId] = useState(0);


  useEffect(() => {
    if (isCancelMessage) {
      alert("CANCELA")
      handleCancelMessage(false)
    }
  }, [isCancelMessage]);


  useEffect(() => {
    if (isConfirmMessage) {
      alert("CONFIRMA")
      handleConfirmMessage(false)
      // handleDeleteModal()
    }
  }, [isConfirmMessage]);


  useEffect(() => {
    if(pathname != '/publication'){
      localStorage.removeItem('@GoJur:PublicationId')
      localStorage.removeItem('@GoJur:MatterEventId')
    }

    if(window.innerWidth >= 1080)
    {
      setBig(true)
      setSmall(false)
    }
    else
    {
      setSmall(true)
      setBig(false)
    }
  }, [])


  useEffect(() => {
    if (confirmSave){
      handleSaveModal()
    }
  }, [confirmSave])


  useEffect(() => {
    // New event - Open modal with defaults
    if (caller === 'calendarModalInclude'){
      NewEvent()
    }

    // Edit event - Open modal with values
    if (modalActiveId > 0 && caller === 'calendarModal'){
      LoadEvent()
    }
  }, [caller, modalActiveId])


  const NewEvent = async() => {
      // Load Lists
      await LoadSubject();
      await LoadUserList()
      await LoadDefaults()

      setAppointmentBlockUpdate(false)
      setScreenWitdh(window.innerWidth);
      ValidateRecurrenceButton();

      const userNameResp = localStorage.getItem('@GoJur:name');
      const userIdResp = localStorage.getItem('@GoJur:userCompanyId');
      if (userIdResp && userNameResp){
        setAppointmentResponsibleList([
          {
            userCompanyId: userIdResp,
            userName: userNameResp,
            userType: 'R',
            allowEdit: 'S',
            accessType: 'U'
          },
        ]);
      }

      setAppointmentStatus('P');
      setAppointmentAllDay('N');
      setAppointmentRecurrent('N');
      setAppointmentHourBeggin('00:00');
      setAppointmentHourEnd('00:30');
      // setAppointmentDescription('');

      // when user click on fullcalendar
      const date = format(new Date(), 'yyyy-MM-dd');
      const fullCalendarDate = localStorage.getItem('@fullCalendarDate')

      if (fullCalendarDate && pathname === '/calendar'){
        setAppointmentDateBeggin(fullCalendarDate);
        setAppointmentDateEnd(fullCalendarDate);
        setRecurrenceStartDate(fullCalendarDate);
      }
      else{
        setAppointmentDateBeggin(date);
        setAppointmentDateEnd(date);
      }

      // When inclusion cames from deadline calculator, get result date and set in start and end date
      const json = localStorage.getItem('@GoJur:DeadLineJson');
      if (json){
        try{
          const deadLineResult = JSON.parse(json.toString())
          setAppointmentDateBeggin(format(new Date(deadLineResult.dateResult), 'yyyy-MM-dd'));
          setAppointmentDateEnd(format(new Date(deadLineResult.dateResult), 'yyyy-MM-dd'));
        }
        catch{
          setAppointmentDateBeggin(date);
          setAppointmentDateEnd(date);
        }
      }

      setIsLoading(false)
  }


  const LoadEvent = async () => {
    // Load Lists
    await LoadUserList()

    // setPrivacyChange(false);
    setScreenWitdh(window.innerWidth);
    ValidateRecurrenceButton();

    const appointmentId = modalActiveId

    // for edit event - call endpoint select
    if (appointmentId.toString() !== '0') {
      SelectAppointment();
    }
  }


  const SelectAppointment = useCallback(async () => {
   
    const appointmentId = modalActiveId
    const recurrenceDate = localStorage.getItem('@GoJur:RecurrenceDate');

    try {
      const response = await api.post<Data>('/Compromisso/Selecionar', {
        id: appointmentId,
        token: userToken,
        recurrenceDate,
      });

      const { data } = response;

      // Load subject with term saved
      await LoadSubject(false, data.subject);

      setAppointmentSubject(data.subject); // salva o subject(assunto) no state
      setAppointmentSubjectId(data.subjectId.toString()); // salva o subject(assunto) no state
      setAppointmentDateBeggin(format(new Date(data.startDate), 'yyyy-MM-dd')); // salva somente a data inicial do compromisso selecionado no state
      setAppointmentHourBeggin(format(new Date(data.startDate), 'HH:mm')); // salva somente a hora inicial do compromisso selecionado no state
      setAppointmentDateEnd(format(new Date(data.endDate), 'yyyy-MM-dd')); // salva somente a data final do compromisso selecionado no state
      setAppointmentHourEnd(format(new Date(data.endDate), 'HH:mm')); // salva somente a hora final do compromisso selecionado no state
      setAppointmentAllDay(data.allDay); // salva  o campo que identifica se o compromisso é o dia todo ou não
      setAppointmentDescription(data.description); // salva a descrição do compromisso no state
      setAppointmentObs(data.eventNote); // salva a observação do compromisso no state
      setAppointmentRemindersList(data.remindersList); // salva a lista de lembretes do compromisso no state
      setAppointmentResponsibleList(data.responsibleList); // lista de responsaveis
      setAppointmentSharedList(data.sharedList); // lista de compartilhados
      setAppointmentNotifyMatterCustomer('N'); // notifica o responsavel
      setAppointmentUser(data.userCreator); // criador do compromisso
      setAppointmentWorkflowActionsExecId(data.workflowActionsExecId); //Workflow relacionado

      setIsLoading(false)
      setAppointmentId(Number(appointmentId))

      if (data.matter !== null) {
        setAppointmentMatter(data.matter);

        setNumWhatsApp(data.matter.num_WhatsApp)
        setCustomerNameWhatsApp(data.matter.matterCustomerDesc)

        api.post('/Processo/SelecionarProcesso', {
          matterId: data.matter.matterId,
          token: userToken,
          companyId: localStorage.getItem('@GoJur:companyId'),
          apiKey: localStorage.getItem('@GoJur:apiKey')
        })
        .then(response => {
          const matterType = response.data.typeAdvisorId == null? 'legal': 'advisory'
          const url = `/matter/edit/${matterType}/${data.matter.matterId}`
          setRedirectLink(url);
          setCompleteLink(true)
        })

        setProcessTitle(
          `${data.matter.matterNumber} - ${data.matter.matterFolder} - ${data.matter.matterCustomerDesc} - ${data.matter.matterOppossingDesc}`,
        );
      }

      setAllowEditController(data.AllowEdit == "S")

      // Controle de privacidade
      if (data.privateEvent === 'N') {
        setAppointmentPrivateEvent(data.privateEvent);
        setPrivacyChange(privacyChange);
        setAppointmentAllowEdit(data.AllowEdit);

        if (data.blockUpdate === true) {
          setPrivacyChange(!privacyChange);
        }

        //setAppointmentBlockUpdate(false);
        setAppointmentBlockUpdate(data.blockUpdate);
      } 
      else {
        setAppointmentPrivateEvent(data.privateEvent);
        setPrivacyChange(!privacyChange);
        setAppointmentAllowEdit(data.AllowEdit);
        setAppointmentBlockUpdate(data.blockUpdate);
      }

      // controle concluir | reabrir
      if (data.status === 'P') {
        setTextButton('Concluir');
        setStatusEvent(data.status);
      } 
      else {
        setTextButton('Reabrir');
        setStatusEvent(data.status);
      }

      // Controle da recorrencia
      if (data.recurrent === 'S') {
        setAppointmentRecurrent(data.recurrent);
        setRecurrentController(!recurrentController);

      } 
      else {
        setAppointmentRecurrent(data.recurrent);
      }

      // convert recurrence Rule to state
      const dataRecurrence = JSON.parse(data.recurrenceRule)

      setRecurrenceStartDate(format(new Date(dataRecurrence.startDate), 'yyyy-MM-dd'))
      setSharedParameterEnd(dataRecurrence.recurrenceTypeEnd)
      setRecurrenceQtd(dataRecurrence.num_Quantity)
      setRecurrenceSelectRepete(dataRecurrence.recurrenceType)

      if(dataRecurrence.endDate != null){
        setRecurrenceEndDate(format(new Date(dataRecurrence.endDate), 'yyyy-MM-dd'))
      }

      if(dataRecurrence.recurrenceType == 'W')
      {
        const arrayDaysWeek:selectedWeekProps[] = []

        dataRecurrence.recurrenceWeekDays.split(',').map(day => {
          if(day.length == 0) return

          const daySelected = weekRecurrence.find(item => item.value == day);
          let dayDescription = '';
          if (daySelected){
            dayDescription = daySelected.label
          }

          return arrayDaysWeek.push({
            label: dayDescription,
            value: day
          })
        })

        setSelectWeek(arrayDaysWeek)
      }

      if(dataRecurrence.recurrenceType == 'M')
      {
        const arrayDaysMonth:selectedWeekProps[] = []

        dataRecurrence.recurrenceDaysMonth.split(',').map(day => {

          if(day.length == 0) return

          const daySelected = dayRecurrence.find(item => item.value == day);
          let dayDescription = '';
          if (daySelected){
            dayDescription = daySelected.label
          }

          return arrayDaysMonth.push({
            label: dayDescription,
            value: day
          })
        })

        setSelectDayMonth(arrayDaysMonth)
      }

      if(dataRecurrence.recurrenceType == 'Y')
      {
        if (dataRecurrence.recurrenceMonth)
          setSelectMonthYear(dataRecurrence.recurrenceMonth)

          const arrayDaysMonth:selectedWeekProps[] = []

          dataRecurrence.recurrenceDaysMonth.split(',').map(day => {
            if(day.length == 0) return

            const daySelected = dayRecurrence.find(item => item.value == day);
            let dayDescription = '';
            if (daySelected){
              dayDescription = daySelected.label
            }

            return arrayDaysMonth.push({
              label: dayDescription,
              value: day
            })
          })

          setSelectDayYear(arrayDaysMonth)
      }

      setIsLoading(false)

      // validação do lembrete.
    } catch (err) {
      setIsLoading(false)
    }
  }, [])


  const ValidateRecurrenceButton = () => {
    let businessId = 0;
    try {
      const objectJsonTrasfer = JSON.parse(jsonModalObjectResult)
      if (objectJsonTrasfer.businessId){
        businessId = objectJsonTrasfer.businessId
      }
    }
    catch{
      businessId = 0;
    }
    setHideRecurrenceButton(businessId>0)
  }


  useEffect(() => {
    if (openModalRecurrence && recurrenceStartDate === ''){
      setRecurrenceStartDate(appointmentDateBeggin)
    }
  }, [appointmentDateBeggin, openModalRecurrence, recurrenceStartDate])


  useEffect(() => {
    // Validação se é criação ou edição do compromisso
    const userNameResp = localStorage.getItem('@GoJur:name');
    const userIdResp = localStorage.getItem('@GoJur:userCompanyId');
    const appointmentId = modalActiveId

    if (appointmentId.toString() === '0') {

      if (userNameResp && userIdResp) {
        setAppointmentResponsibleList([
          {
            userCompanyId: userIdResp,
            userName: userNameResp,
            userType: 'R',
            allowEdit: 'S',
            accessType: 'U'
          },
        ]);
      }
    } 
    else {
      setIsCreate(!isCreate);
    }

    const hasMatterFromPublication = localStorage.getItem('@GoJur:PublicationHasMatter')

    setBlockAssociateMatter(hasMatterFromPublication == 'S')

    let matterDescription = '';

    // fill details about matter select if exists
    if (matterSelected !== null){
      setAppointmentMatter({
        matterId: matterSelected.matterId,
        matterCustomerDesc: matterSelected.matterCustomerDesc,
        matterFolder: matterSelected.matterFolder,
        matterNumber: matterSelected.matterNumber,
        matterOppossingDesc: matterSelected.matterOppossingDesc,
        matterForumName: matterSelected.forumName,
        matterVaraName: matterSelected.currentCourt,
        matterVaraNum: matterSelected.currentInstance,
        num_WhatsApp: ""
      });

      matterDescription = `Pasta: ${matterSelected.matterFolder} - Proc.: ${matterSelected.matterNumber} ${matterSelected.matterFolder} \n${matterSelected.matterCustomerDesc} x ${matterSelected.matterOppossingDesc}\n${matterSelected.forumName??""}\n${matterSelected.currentInstance??""} ${matterSelected.currentCourt??""}`;
    }

    // 1 - if exists a deadline text priorit0y that
    if (deadLineText){
      setAppointmentDescription(deadLineText)

      if (matterSelected !== null && appointmentDescription.length > 0){
        setAppointmentDescription(`${matterDescription} \n\n ${appointmentDescription} `);
      }
      else{
        setAppointmentDescription(`${deadLineText}`);
      }

      return;
    }

    // 2 - if exists a matter selected complements
    if (matterSelected !== null) {

      if (matterSelected.matterFolder == null){
        matterSelected.matterFolder = "";
      }

      if (publicationText == undefined || publicationText == ""){                     // without text publication set only description + matter if exists
        if (appointmentDescription.length > 0){
          setAppointmentDescription(`${appointmentDescription}\n${matterDescription} `);
        }
        else{
          setAppointmentDescription(`${matterDescription} `);
        }
      }
      else if (hasMatterFromPublication == 'S'){                                    // create by publication append all text publication here
        setAppointmentDescription(`${publicationText} `);
        setBlockAssociateMatter(true)
      }
      else{
        setAppointmentDescription(`${matterDescription} \n\n ${appointmentDescription} `);
        setBlockAssociateMatter(false)
      }

      const eventByFollow = localStorage.getItem('@GoJur.eventByFollow')
      if (eventByFollow === 'S'){
        setAppointmentDescription(`${publicationText} `);
        setBlockAssociateMatter(true)
        localStorage.removeItem('@GoJur.eventByFollow')
      }

      return;
    }

    if (publicationText != null){
        // setPublicationTextSaved(publicationText);
        setAppointmentDescription(publicationText)

        return;
    }
  }, [matterSelected, publicationText]); // valida se é uma criação de appointment


  useEffect(() => {
    if (matterSelected !== null && processTitle === 'Associar Processo') {
   
      setProcessTitle(`${matterSelected.matterNumber} - ${(matterSelected.matterFolder != null? "-": "")} ${matterSelected.matterCustomerDesc} - ${matterSelected.matterOppossingDesc}`,);

      api.post<IMatterData>('/Processo/SelecionarProcesso', {
        matterId: matterSelected.matterId,
        token: userToken,
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey')
      })
      .then(response => {
        const matterType = response.data.typeAdvisorId == null? 'legal': 'advisory'
        const url = `/matter/edit/${matterType}/${matterSelected.matterId}`
        setRedirectLink(url)
        setCompleteLink(true)
      })
    } 
    else {
      setProcessTitle('Associar Processo');
    }
  }, [matterSelected, dateEnd]);


  // Close modal
  const handleCloseModalLog = () => {
    localStorage.setItem('@GoJur:appointmentClose', 'S');
    isClosed()
  } // mudança de data final


  const handleDragControllMouseOver = useCallback(() => {
    setDragControll(true);
  }, [dragControll]); // Controle do drag and drop


  const handleDragControllMouseOut = useCallback(() => {
    setDragControll(false);
  }, [dragControll]); // Controle do drag and drop


  const handleNewDateBeggin = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAppointmentDateBeggin(event.target.value);
      setAppointmentDateEnd(event.target.value);
    },
    [],
  ); // mudança de data inicio


  const handleNewDateEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAppointmentDateEnd(event.target.value);
    },
    [],
  ); // mudança de data final


  const handleNewHourBeggin = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const time = event.target.value;
      setAppointmentHourBeggin(time);

      if (time) {
        const startTime = time.split(':');
        const hour = parseInt(startTime[0].toString());
        const minutes = parseInt(startTime[1].toString());

        const hourEnd = new Date();
        hourEnd.setHours(hour);
        hourEnd.setMinutes(minutes + 30);

        const nData = format(new Date(hourEnd), 'HH:mm');

        setAppointmentHourEnd(nData);
      }
    },
    [],
  ); // mudança da hora inicial


  const handleNewHourEnd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const time = event.target.value;
      setAppointmentHourEnd(time);
    },
    [],
  ); // mudança da hora final


  const handleAllDayChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (appointmentAllDay === 'S') {
        setAppointmentAllDay('N');
      } 
      else {
        setAppointmentAllDay('S');
      }
    },
    [appointmentAllDay],
  ); // Ativa o dia todo


  const handlePrivacyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const privacy = event.target.value;

      setAppointmentPrivateEvent(privacy);
      setPrivacyChange(!privacyChange);

      if (appointmentSharedList.length > 0) {
        setAppointmentSharedList([]);
      }
    },
    [privacyChange, appointmentSharedList],
  ); // Mudança de Privacidade


  const handleChangeAllowEdit = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const edit = event.target.value;
      setAllowEditController(!allowEditController);

      if (allowEditController !== true) {
        setAppointmentAllowEdit('S');
      } 
      else {
        setAppointmentAllowEdit('N');
      }
    },
    [allowEditController],
  ); // Permite alteração


  const handleNewDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const description = event.target.value;

      setAppointmentDescription(description);
    },
    [],
  ); // salva o valor da descrição


  const handleNewObs = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const obs = event.target.value;

      setAppointmentObs(obs);
    },
    [],
  ); // salva o valor da OBS


  const handleGridSelectProcess = useCallback(() => {
    if (processTitle === 'Associar Processo') {
      handleSelectProcess('Open');
    }
  }, [handleSelectProcess, processTitle]); // abre o grid de processos


  const handleSelectLembretes = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const appendLembretes = event.target.value;
      setAppointmentNotifyMatterCustomer('N');

      if (event.target.value === '00'){
        return;
      };

      if (event.target.value === 'PE'){
        setOpenReminderModal(true)

        event.target.value = "00"

        return
      };

      setAppointmentRemindersList([
        ...appointmentRemindersList,
        {
          qtdReminder: appendLembretes,
          notifyMatterCustomer: appointmentNotifyMatterCustomer,
          emailNotification: 'N',
          whatsAppNotification: 'N'
        },
      ]);

      if (
        appointmentRemindersList.findIndex(
          key => key.qtdReminder === appendLembretes,
        ) != -1
      ) {
        const newdata = Array.from(appointmentRemindersList);
        const key = newdata.findIndex(
          item => item.qtdReminder === appendLembretes,
        );
        newdata.slice(key, 1);

        setAppointmentRemindersList(newdata);
      }
    },
    [appointmentNotifyMatterCustomer, appointmentRemindersList],
  ); // adiciona um lembrete a lista


  const handleDisableNotification = useCallback(
    key => {
      const list = Array.from(appointmentRemindersList);
      const item = list.findIndex(i => i.qtdReminder === key);

      if (item !== -1) {
        list.splice(item, 1);

        setAppointmentRemindersList(list);
      } else {
        setAppointmentRemindersList(list);
      }
    },
    [appointmentRemindersList],
  ); // deleta o lembrete selecionado da lista


  const handleNotifySelect = useCallback(
    (key, value) => {
      const newList = Array.from(appointmentRemindersList);
      const chave = newList.findIndex(i => i.qtdReminder === key);

      if (newList[chave].notifyMatterCustomer === 'N') {
        setAppointmentNotifyMatterCustomer('S');
        newList[chave].notifyMatterCustomer = 'S';
        setAppointmentRemindersList(newList);
      } else {
        setAppointmentNotifyMatterCustomer('N');
        newList[chave].notifyMatterCustomer = 'N';
        setAppointmentRemindersList(newList);
      }
    },
    [appointmentRemindersList],
  ); // desabilita a notificação do lembrete


  const HandleResponsibleUser = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      const user = event.target.value;

      setUserResponsibleValue(user);

      const userRespId = userList.filter(i => i.value === user).map(n => n.id).toString();

      const userAccessType = userList.filter(i => i.value === user).map(n => n.accessType).toString();

      let edit = '';

      defaultSettings?.value === 'restricted' ? (edit = 'N') : (edit = 'S');

      if (user !== '' && user !== ' ' && user.length > 3 && userList.findIndex(i => i.value === user) !== -1) {
        setAppointmentResponsibleList([
          ...appointmentResponsibleList,
          {
            userCompanyId: userRespId,
            userName: user,
            userType: 'R',
            allowEdit: edit,
            accessType:userAccessType,
          },
        ]);

        setUserResponsibleValue('');
      }

      if (
        appointmentSharedList.findIndex(i => i.userName === user) != -1 ||
        appointmentResponsibleList.findIndex(i => i.userName === user) != -1
      ) {
        const newdata = Array.from(appointmentResponsibleList);
        const key = newdata.findIndex(item => item.userName === user);
        newdata.slice(key, 1);

        setAppointmentResponsibleList(newdata);
        setUserResponsibleValue(user)

        addToast({
          type: 'info',
          title: 'Usuário não adicionado',
          description: `${user} já foi adicionado neste compromisso`
        });

        setUserResponsibleValue('');
      }
    },
    [
      appointmentResponsibleList,
      appointmentSharedList,
      defaultSettings,
      userList
    ],
  ); // adiciona o responsavel na lista


  const HandleShareUser = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const user = event.target.value;

    setUserSharedValue(user)

    const userRespId = userList.filter(i => i.value === user).map(n => n.id).toString();

    const userAccessType = userList.filter(i => i.value === user).map(n => n.accessType).toString();

    let edit = '';

    defaultSettings?.value === 'restricted' ? (edit = 'N') : (edit = 'S');

    if (user !== '' && user !== ' ' && user.length > 3 && userList.findIndex(i => i.value === user) !== -1) {
      setAppointmentSharedList([
        ...appointmentSharedList,
        {
          userCompanyId: userRespId,
          userName: user,
          userType: 'C',
          allowEdit: edit,
          accessType:userAccessType,
        },
      ]);

      setUserSharedValue('')
    }

    if (
      appointmentSharedList.findIndex(i => i.userName === user) != -1 ||
      appointmentResponsibleList.findIndex(i => i.userName === user) != -1
    ) {
      const newdata = Array.from(appointmentSharedList);
      const key = newdata.findIndex(item => item.userName === user);
      newdata.slice(key, 1);

      setAppointmentSharedList(newdata);
      setUserSharedValue(user)

      addToast({
        type: 'info',
        title: 'Usuário não adicionado',
        description: `${user} já foi adicionado neste compromisso`
      });

      setUserSharedValue('')
    }
  },
  [addToast, appointmentResponsibleList, appointmentSharedList, defaultSettings?.value, userList],
); // adiciona um compartilhado a lista


  const LoadDefaults = async () => {
    const response = await api.post<Settings[]>(`/Defaults/Listar`, {token: userToken });

      // private default
      const privateDefault = response.data.find(item => item.id == "defaultPrivateEvent")
      if (privateDefault){
        setAppointmentPrivateEvent(privateDefault.value == "R"? "S": "N");
        setPrivacyChange(privateDefault.value === 'U')
      }

      const allowEditEvent = response.data.find(item => item.id == "defaultAllowEditEvent")
      if (allowEditEvent){
        setAppointmentAllowEdit(allowEditEvent.value == "allowed"? "S": "N")
        setDefaultSettings(allowEditEvent);
        setAllowEditController(allowEditEvent.value == "allowed")
      }

      // default subject only when applyed deadline calculator
      if (modalActiveId.toString() === '0'){
        const subjectDefault = response.data.find(item => item.id == "defaultSubject")
        if (subjectDefault && deadLineText != null && deadLineText != ''){

          setAppointmentSubjectId(subjectDefault.value.split('|')[0])
          setAppointmentSubject(subjectDefault.value.split('|')[1])
        }
      }
  }


  const LoadUserList = useCallback(async () => {
    try {
      const response = await api.post<userListData[]>(
        `/Compromisso/ListarUsuariosETimes`,
        {
          userName: '',
          token: userToken,
        },
      );

      setUserList(response.data);

      // setUserShareList(response.data);
    } catch (err: any) {
      console.log(err.message);
    }
  }, []);


  const handleCancelResponsible = useCallback(
    key => {
      const list = Array.from(appointmentResponsibleList);
      const item = list.findIndex(i => i.userName === key);

      if (item !== -1) {
        list.splice(item, 1);

        setAppointmentResponsibleList(list);
      } else {
        setAppointmentResponsibleList(list);
      }
    },
    [appointmentResponsibleList],
  ); // deleta um responsavel da lista


  const handleResposibleAllowEditChange = useCallback(
    (responsavel, value) => {
      const newList = Array.from(appointmentResponsibleList);
      const chave = newList.findIndex(i => i.userName === responsavel);

      if (newList[chave].allowEdit === 'N') {
        setAppointmentNotifyResponsibleCustomer('S');
        newList[chave].allowEdit = 'S';
        setAppointmentResponsibleList(newList);
      } else {
        setAppointmentNotifyResponsibleCustomer('N');
        newList[chave].allowEdit = 'N';
        setAppointmentResponsibleList(newList);
      }
    },
    [appointmentResponsibleList],
  ); // muda o parametro de edição do responsavel


  const handleCancelShare = useCallback(
    key => {
      const list = Array.from(appointmentSharedList);
      const item = list.findIndex(i => i.userName === key);

      if (item !== -1) {
        list.splice(item, 1);

        setAppointmentSharedList(list);
      } else {
        setAppointmentSharedList(list);
      }
    },
    [appointmentSharedList],
  ); // deleta um responsavel da lista


  const handleResposibleSAllowEditChange = useCallback(
    (responsavel, value) => {
      const newList = Array.from(appointmentSharedList);
      const chave = newList.findIndex(i => i.userName === responsavel);

      if (newList[chave].allowEdit === 'N') {
        setAppointmentNotifySharedCustomer('S');
        newList[chave].allowEdit = 'S';
        setAppointmentSharedList(newList);
      } else {
        setAppointmentNotifySharedCustomer('N');
        newList[chave].allowEdit = 'N';
        setAppointmentSharedList(newList);
      }
    },
    [appointmentSharedList],
  ); // muda o parametro de edição do compartilhado


  const handleLogOnDisplay = useCallback(async () => {
    setShowLog(true);
  }, []);


  const handleCloseLog = () => {
    setShowLog(false)
  }


  const handleDoneOrReopen = useCallback(async () => {
    setLoadingDone(!loadingDone);

    if (statusEvent === 'P') {
      try {
        const appointment = modalActiveId

        const recurrenceDate = localStorage.getItem('@GoJur:RecurrenceDate');
        await api.post(`/Compromisso/Concluir`, {
          id: appointment,
          token: userToken,
          recurrenceDate,
          serieRecurrenceChange: 'one',
        });

        addToast({
          type: 'success',
          title: 'Compromisso concluido',
          description: 'Seu compromisso foi concluido com sucesso',
        });

        setStatusEvent('L');
        isClosed();
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Falha ao concluir o compromisso',
          description:
            'Não foi possivel concluir seu comprimisso, tente novamente!',
        });
      }
    } 
    else {
      try {
        const appointment = modalActiveId
        const recurrenceDate = localStorage.getItem('@GoJur:RecurrenceDate');

        await api.post(`/Compromisso/Reabrir`, {
          id: appointment,
          token: userToken,
          recurrenceDate,
          serieRecurrenceChange: 'one',
        });

        addToast({
          type: 'success',
          title: 'Compromisso Reaberto',
          description: 'Seu compromisso foi reaberto com sucesso',
        });
        setStatusEvent('P');
        isClosed();

      } catch (error) {
        addToast({
          type: 'error',
          title: 'Falha ao reabrir o compromisso',
          description:
            'Não foi possivel reabrir seu comprimisso, tente novamente!',
        });
      }
    }

    setLoadingDone(loadingDone);
  }, [addToast, isClosed, statusEvent, loadingDone]); // muda de concluido para reaberto


  const handleSaveModal = useCallback(async () => {
    const appointmentId = modalActiveId
    const publicationId = localStorage.getItem('@GoJur:PublicationId');
    const matterEventId = localStorage.getItem('@GoJur:MatterEventId');
    const deadLineJson = localStorage.getItem('@GoJur:DeadLineJson');
    const startDateN = `${appointmentDateBeggin}T${appointmentHourBeggin}`;
    const endDateN = `${appointmentDateEnd}T${appointmentHourEnd}`;

    const newStartDate= new Date(startDateN);
    const newEndDate=new Date();

    const diference = Math.floor(
      (Date.UTC(newEndDate.getFullYear(), newEndDate.getMonth(), newEndDate.getDate()) 
       - 
       Date.UTC(newStartDate.getFullYear(), newStartDate.getMonth(), newStartDate.getDate())
      ) 
      /
      (1000 * 60 * 60 * 24)
    )

    if(!confirmSave && (diference > 0)){
      setCheckMessage(true)
      return;
    }

    setLoadingSave(!loadingSave);

    let daysMonthDesc = ''
    selectDayMonth.map((item) => {
      daysMonthDesc += `${item.value },`
      return false;
    })

    let daysYearDesc = ''
    selectDayYear.map((item) => {
      daysYearDesc += `${item.value },`
      return false;
    })

    let daysWeekDesc = ''
    selectWeek.map((item) => {
      daysWeekDesc += `${item.value },`
      return false;
    })

    let dataRecurrence = {}

    if (isRecurrence)
    {
      if(recurrenceSelectRepete == "Y")
      {
        dataRecurrence = {
          dta_startDate: recurrenceStartDate,
          dta_endDate: recurrenceEndDate,
          recurrenceMonth: selectMonthYear,
          num_Quantity: recurrenceQtd,
          Interval: '',
          recurrenceType: recurrenceSelectRepete,
          recurrenceTypeEnd: sharedParameterEnd,
          recurrenceWeekDays: daysWeekDesc,
          recurrenceDaysMonth: daysYearDesc
        }
      }
      else
      {
        dataRecurrence = {
          dta_startDate: recurrenceStartDate,
          dta_endDate: recurrenceEndDate,
          recurrenceMonth: selectMonthYear,
          num_Quantity: recurrenceQtd,
          Interval: '',
          recurrenceType: recurrenceSelectRepete,
          recurrenceTypeEnd: sharedParameterEnd,
          recurrenceWeekDays: daysWeekDesc,
          recurrenceDaysMonth: daysMonthDesc
        }
      }
    }

    if (appointmentRecurrent === 'N') {

      if (appointmentResponsibleList.length == 0){
        addToast({
          type: 'info',
          title: 'Falha ao salvar o compromisso',
          description: 'É necessário que este compromisso tenha ao menos um usuário ou equipe responsável',
        });

        setLoadingSave(false)

        return;
      }

      // verify if was open by business customer
      let businessId = 0;
      try {
        const objectJsonTrasfer = JSON.parse(jsonModalObjectResult)
        if (objectJsonTrasfer.businessId){
          businessId = objectJsonTrasfer.businessId
        }
      }
      catch{
        businessId = 0;
      }

      const data = {
        eventId: appointmentId,
        publicationId: publicationId == null? 0: publicationId,
        matterEventId: matterEventId == null? 0: matterEventId,
        description: appointmentDescription,
        eventNote: appointmentObs,
        startDate: startDateN, // v
        endDate: endDateN, // v
        subjectId: appointmentSubjectId,
        subject: appointmentSubject,
        userCreator: appointmentUser,
        allDay: appointmentAllDay,
        subjectColor: '#024121', // V
        status: appointmentStatus,
        AllowEdit: appointmentAllowEdit,
        privateEvent: appointmentPrivateEvent,
        recurrent: isRecurrence,
        responsibleList: appointmentResponsibleList,
        remindersList: appointmentRemindersList,
        sharedList: appointmentSharedList,
        matter: appointmentMatter,
        token: userToken,
        serieRecurrenceChange: null,
        deadLineCalculatorJson: deadLineJson,
        businessId,
        isConfirmSave: confirmSave,
        recurrenceRuleJSON: JSON.stringify(dataRecurrence),
      }

      try {
        await api.put<AppointmentPropsSave>(`/Compromisso/Salvar`, data)

        selectProcess(null)
        addToast({type: 'success', title: 'Compromisso Salvo', description: 'Seu compromisso foi salvo com sucesso'});
        isClosed()
        handleModalActive(false)
        handleJsonModalObjectResult('')
      }
      catch (err:any) {
        if (err.response.data.typeError.warning == "awareness"){
          setCheckMessage(true)
        }
        else{
          addToast({type: 'info', title: 'Falha ao salvar o compromisso', description: err.response.data.Message});
        }
      }
    }
    else {
      setOpenSaveModal(!openSaveModal);
    }

    const data: AppointmentPropsSave = {
      eventId: appointmentId,
      publicationId: publicationId == null? 0: publicationId,
      description: appointmentDescription,
      eventNote: appointmentObs,
      startDate: startDateN, // v
      endDate: endDateN, // v
      subjectId: appointmentSubjectId,
      subject: appointmentSubject,
      userCreator: appointmentUser,
      allDay: appointmentAllDay,
      subjectColor: '#024121', // V
      status: appointmentStatus,
      AllowEdit: appointmentAllowEdit,
      privateEvent: appointmentPrivateEvent,
      recurrent: appointmentRecurrent,
      responsibleList: appointmentResponsibleList,
      remindersList: appointmentRemindersList,
      sharedList: appointmentSharedList,
      matter: appointmentMatter,
      token: userToken,
      dateRecurrence: localStorage.getItem('@GoJur:RecurrenceDate'),
      recurrenceRuleJSON: JSON.stringify(dataRecurrence),
      serieRecurrenceChange: null,
      isConfirmSave: confirmSave,
    };

    setAppointmentStore(data);
    setLoadingSave(loadingSave);
    localStorage.removeItem('@fullCalendarDate')

  }, [loadingSave, appointmentDateBeggin, appointmentHourBeggin, appointmentDateEnd, appointmentHourEnd, appointmentRecurrent, appointmentDescription, appointmentObs, appointmentSubjectId, appointmentSubject, appointmentUser, appointmentAllDay, appointmentStatus, appointmentAllowEdit, appointmentPrivateEvent, appointmentResponsibleList, appointmentRemindersList, appointmentSharedList, appointmentMatter, addToast, jsonModalObjectResult, selectProcess, isClosed, handleModalActive, handleJsonModalObjectResult, openSaveModal, selectDayMonth, recurrenceStartDate, recurrenceEndDate, selectWeek, selectDay, recurrenceSelectRepete, selectMonthYear, selectDayYear, isRecurrence, confirmSave]); // Salva o compromisso


  const handleDeleteModal = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');
      const appointment = modalActiveId
      const recurrenceDate = localStorage.getItem('@GoJur:RecurrenceDate');
      
      if (appointmentRecurrent === 'N') {


        if (confirmDeleteCalendarEvent == false)
        {
          setConfirmDeleteCalendarEvent(true);
          return;
        }

        await api.post(`/Compromisso/Deletar`, {
          eventId: appointment,
          token: userToken,
          dateRecurrence: recurrenceDate,
          serieRecurrenceChange: 'one',
        });


        addToast({
          type: 'success',
          title: 'Compromisso deletado',
          description: 'Seu compromisso foi deletado com sucesso',
        });

        isClosed()
        handleModalActiveId(0)
        handleModalActive(false)
        setConfirmDeleteCalendarEvent(false);
      }
      else{
        const data: AppointmentPropsDelete = {
          eventId: appointmentId,
          token: userToken,
          dateRecurrence: localStorage.getItem('@GoJur:RecurrenceDate'),
          serieRecurrenceChange: null
        };

        handleModalActiveId(0)
        setAppointmentDeleteStore(data);
        setOpenDeleteModal(!openDeleteModal);
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Falha ao deletar o compromisso',
        description:
          'Não foi possivel deletar seu comprimisso, tente novamente!',
      });
    }
  }, [appointmentRecurrent, openDeleteModal, addToast, confirmDeleteCalendarEvent]);


  const handleUserDragInDrop = (e: any, origin: string) => {
    let edit = '';

    const dragResponsibleUser = () => {

      // validate if exists in current list to avoid duplication
      const userExistent = appointmentSharedList.find(item => item.userCompanyId == userIdCurrentDrag);
      if (userExistent){
        return;
      }

      // if is a public don't allow drop
      if (privacyChange){
        return;
      }

      // default configuration user permission
      const user = userList.find(item => item.id == userIdCurrentDrag);
      defaultSettings?.value === 'restricted' ? (edit = 'N') : (edit = 'S');

      // get current user and your configuration edit
      const userShared = appointmentResponsibleList.find(item => item.userCompanyId == userIdCurrentDrag)
      if (userShared){
        edit = userShared.allowEdit;
      }

      if (user)
      {
        setAppointmentSharedList([
          ...appointmentSharedList,
          {
            userCompanyId: user.id,
            userName: user.value,
            userType: 'C',
            allowEdit: edit,
            accessType:user.accessType
          },
        ]);

        handleCancelResponsible(user.value);
        setUserIdCurrentDrag('')
      }
    }

    // copy user from origin responsible to target shared
    const dragSharedUser = () => {

        // validate if exists in current list to avoid duplication
        const userExistent = appointmentResponsibleList.find(item => item.userCompanyId == userIdCurrentDrag);
        if (userExistent){
          return;
        }

        // default configuration user permission
        const user = userList.find(item => item.id == userIdCurrentDrag);
        defaultSettings?.value === 'restricted' ? (edit = 'N') : (edit = 'S');

        // get current user and your configuration edit
        const userResp = appointmentSharedList.find(item => item.userCompanyId == userIdCurrentDrag)
        if (userResp){
          edit = userResp.allowEdit;
        }

        if (user)
        {
          setAppointmentResponsibleList([
            ...appointmentResponsibleList,
            {
              userCompanyId: user.id,
              userName: user.value,
              userType: 'R',
              allowEdit: edit,
              accessType: user.accessType
            },
          ]);

          handleCancelShare(user.value);
          setUserIdCurrentDrag('')
        }
    }

    if (origin == 'responsible'){
      dragResponsibleUser();
    }

    if (origin == 'shared'){
      dragSharedUser();
    }
  }


  const handleClickRecurrence = (e) => {
    setLoadEventRecurrence(true)
    e.preventDefault()
  }


  const handleRecurrenceClose = () => {
    setLoadEventRecurrence(false)
  }


  const handleRecurrenceRemove = () => {
    setIsRecurrence('N');
    setAppointmentRecurrent('N')
    setLoadEventRecurrence(false)
  }


  const handleCloseReminderModal = () => {
    setOpenReminderModal(false)
  }


  const handleSaveRecurrence = () => {
    // Validation
    if(recurrenceSelectRepete == "")
    {
      addToast({
        type: 'info',
        title: 'Aviso',
        description: 'Informe a regra de repetição da recorrência'
      });

      return;
    }

    if(recurrenceSelectRepete == "W")
    {
      if(selectWeek.length == 0)
      {
        addToast({
          type: 'info',
          title: 'Aviso',
          description: 'Nenhum dia da semana não informado para a geração da recorrência'
        });

        return;
      }
    }

    if(recurrenceSelectRepete == "M")
    {
      if(selectDayMonth.length == 0)
      {
        addToast({
          type: 'info',
          title: 'Aviso',
          description: 'Nenhum dia do mês foi informado para a geração da recorrência'
        });

        return;
      }
    }

    if(recurrenceSelectRepete == "Y")
    {
      if(selectMonthYear.length == 0)
      {
        addToast({
          type: 'info',
          title: 'Aviso',
          description: 'Nenhum mês foi informado para a geração da recorrência'
        });

        return;
      }

      if(selectDayYear.length == 0)
      {
        addToast({
          type: 'info',
          title: 'Aviso',
          description: 'Nenhum dia do mês foi informado para a geração da recorrência'
        });

        return;
      }
    }

    if(sharedParameterEnd == "1")
    {
      if(recurrenceEndDate == "")
      {
        addToast({
          type: 'info',
          title: 'Aviso',
          description: 'Data de término da recorrência não informada'
        });

        return;
      }
    }

    if(sharedParameterEnd == "2")
    {
      if(recurrenceQtd == "" || recurrenceQtd == "0")
      {
        addToast({
          type: 'info',
          title: 'Aviso',
          description: 'Quantidade de recorrências não informada'
        });

        return;
      }
    }

    setIsRecurrence('S');
    setLoadEventRecurrence(false)
  }


  const handleRecurrenceStartDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRecurrenceStartDate(event.target.value);
    },
    [],
  );


  const handleRecurrenceEndDate = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRecurrenceEndDate(event.target.value);
    },
    [],
  );


  const handleChangeRepete = (item) => {
    setRecurrenceSelectRepete(item)

    if(item == "D"){
      setSelectDay(item)
    }
  }


  useDelay(() => {
    if (appointmentSubject.length > 0 && !isLoading){
      LoadSubject()
    }
  }, [appointmentSubject], 1000)


  const LoadSubject = useCallback(async (reload = false, termSearch = '') => {
    try {
      if (termSearch  === ''){
        termSearch = appointmentSubject;
      }

      if (reload){
        termSearch = '';
      }

      const response = await api.post(`/Assunto/Listar`,{
          description: termSearch,
          token: userToken
      });

      const subjectList: SelectValues[] = [];
      response.data.map(item =>{
        return subjectList.push({
          id: item.id,
          label: item.value
        })
      })

      setOptionsSubject(subjectList);
    }
    catch (err) {
      console.log(err);
    }
  }, [appointmentSubject])


  const handleChangeMonthYear = (item) => {
    setSelectMonthYear(item)
  }


  const handleChangeEnd = (item) => {
    setSharedParameterEnd(item)
  }


  const handleWhatsAppLink = async () => {
    
    if (numWhatsApp != '')
    {
      let cleanNumber = numWhatsApp.replace(/\D/g, ''); 
      let whatsAppText = 
        `Olá ${customerNameWhatsApp}\n\n` +
        `Você tem um compromisso agendado:\n` +
        `*Data:* ${format(new Date(`${appointmentDateBeggin}T00:00:00`), 'dd-MM-yyyy')} às ${appointmentHourBeggin}\n` +
        `*Assunto:* ${appointmentSubject}\n` +
        `*Descrição:* ${appointmentDescription}\n`;

      const whatsAppLink = `https://web.whatsapp.com/send?phone=55${cleanNumber}&text=${encodeURIComponent(whatsAppText)}`;
      window.open(whatsAppLink);
    }
    else 
    {
      const response = await api.get('/Clientes/ObterWhatsAppPorProcesso', { params:{ matterId: Number(appointmentMatter?.matterId), token: userToken }})

      if(response.data)
      {
        let cleanNumber = response.data.replace(/\D/g, ''); 
        let whatsAppText = 
          `Olá ${customerNameWhatsApp}\n\n` +
          `Você tem um compromisso agendado:\n` +
          `*Data:* ${format(new Date(`${appointmentDateBeggin}T00:00:00`), 'dd-MM-yyyy')} às ${appointmentHourBeggin}\n` +
          `*Assunto:* ${appointmentSubject}\n` +
          `*Descrição:* ${appointmentDescription}\n`;

        const whatsAppLink = `https://web.whatsapp.com/send?phone=55${cleanNumber}&text=${encodeURIComponent(whatsAppText)}`;
        window.open(whatsAppLink);
      }
      else
      {
        addToast({type: 'info', title: 'Aviso', description: 'Processo sem cliente associado, ou cliente com número de whatsapp inválido'});
      }
    }
  }


  const handleSubjectChange = (item) => {
    if (item){
      setAppointmentSubject(item.label)
      setAppointmentSubjectId(item.id)
    }
    else{
      setAppointmentSubject('')
      setAppointmentSubjectId('')
      LoadSubject(true)
    }
  }


  const ConfirmSave = () => {
    setCheckMessage(false)
    setConfirmSave(true)
  }


  const CustomerNotification =  useCallback(async key => {
    try{
      const response = await api.post<IParameterData[]>('/Parametro/Selecionar', { token: userToken, allowNull: true, parametersName: '#WPNOTIFICATION' })

      if (response.data.length > 0) {
        if(response.data[0].parameterValue == 'EM') {
          const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].emailNotification = 'S'
        }
        if(response.data[0].parameterValue == 'WA') {
          const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].whatsAppNotification = 'S'
        }
        if(response.data[0].parameterValue == 'AM') {
          const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].emailNotification = 'S'
          newList[chave].whatsAppNotification = 'S'
        }
      }
      else{
        const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].emailNotification = 'N'
          newList[chave].whatsAppNotification = 'N'
      }
      
      const newList = Array.from(appointmentRemindersList);
      const chave = newList.findIndex(i => i.qtdReminder === key);
  
      newList[chave].notifyMatterCustomer = 'S';
      setAppointmentRemindersList(newList);
    }
    catch (err:any){
      console.log(err.response.data.Message)
    }
  }, [appointmentRemindersList])


  const CustomerEmailNotification = useCallback(key => {
    const newList = Array.from(appointmentRemindersList);
    const chave = newList.findIndex(i => i.qtdReminder === key);

    if (newList[chave].emailNotification === 'N')
      newList[chave].emailNotification = 'S'
    else
      newList[chave].emailNotification = 'N'

      setAppointmentRemindersList(newList)
  }, [appointmentRemindersList])


  const CustomerWhatsNotification = useCallback(key => {
    const newList = Array.from(appointmentRemindersList);
    const chave = newList.findIndex(i => i.qtdReminder === key);

    if (newList[chave].whatsAppNotification === 'N')
      newList[chave].whatsAppNotification = 'S'
    else
      newList[chave].whatsAppNotification = 'N'

      setAppointmentRemindersList(newList);
  }, [appointmentRemindersList])


  if (isLoading){
    return (
      <>
        <Overlay />
        <div className='waitingMessage'>
          <Loader size={15} color="var(--blue-twitter)" />
          &nbsp;&nbsp;Aguarde...
        </div>
      </>
    )
  }


  const HandleCheckMessage = () => {
    setCheckMessage(true)
  }


  const handleCloseConfirmDelete = () => {
    setConfirmDeleteCalendarEvent(false);
  }


  const handleConfirmDelete = () => {
    setConfirmDeleteCalendarEvent(false);
    handleDeleteModal();
  }


  return (
    <DropArea
      visible={isClosed}
      id="DropArea"
    >
      {big && (
        <ResponsiveGridLayout
          className="layoutBig"
          rowHeight={28}
          width={screenWitdh}
          isDraggable={dragControll}
          isResizable={false}
          isBounded
        >
          {layoutCompBig.map(modal => (
            <Container2
              key={modal.positions.i}
              data-grid={{
                x: modal.positions.x,
                y: modal.positions.y,
                w: modal.positions.w,
                h: modal.positions.h,
              }}
            >

              {checkMessage && (
                <ConfirmOverlay />
              )}

              <ModalConfirm id='ModalConfirm' show={checkMessage}>
                <header>Aviso</header>
                <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
                  <br />
                  A data inicial do compromisso é menor que a data atual.
                  <br />
                  Deseja confirmar a operação ?

                  <br /><br />

                  <footer>
                    <button
                      className="accept"
                      type="button"
                      onClick={() => ConfirmSave()}
                    >
                      <BsCheckBox />
                      Confirmar
                    </button>

                    <button
                      className="cancel"
                      type="button"
                      onClick={() => setCheckMessage(false)}
                    >
                      <TiCancel />
                      Cancelar
                    </button>
                  </footer>
                </div>
                <br />
              </ModalConfirm>
              
              <ModalRecurrence id='ModalRecurrence' show={openModalRecurrence}>
                <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
                  Regras de Recorrência
                  <br />
                  <br />

                  <DatePicker
                    title="Inicia em:"
                    disabled
                    onChange={handleRecurrenceStartDate}
                    value={recurrenceStartDate}
                  />
                  <br />
                  <br />

                  <label htmlFor="type">
                    Repetir a cada
                    <br />
                    <select
                      name="userType"
                      className='dropdown'
                      value={recurrenceSelectRepete}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeRepete(e.target.value)}
                    >
                      <option>Selecione</option>
                      <option value="D">Diária</option>
                      <option value="W">Semanal</option>
                      <option value="M">Mensal</option>
                      <option value="Y">Anual</option>
                    </select>
                  </label>
                  <br />

                  {recurrenceSelectRepete === 'W' && (
                    <>
                      <br />
                      <section>
                        <Multi
                          options={weekRecurrence}
                          value={selectWeek}
                          onChange={(setSelectWeek)}
                          labelledBy="Selecione"
                          selectAllLabel="Selecione"
                          disableSearch
                          ClearIcon
                          overrideStrings={{
                            selectSomeItems: 'Selecionar um dia da semana',
                          }}
                        />
                      </section>
                      <br />
                      <br />
                    </>
                  )}

                  {recurrenceSelectRepete === 'M' && (
                    <>
                      <br />
                      <Multi
                        options={dayRecurrence}
                        value={selectDayMonth}
                        onChange={setSelectDayMonth}
                        labelledBy="Selecione"
                        selectAllLabel="Selecione"
                        disableSearch
                        ClearIcon
                        overrideStrings={{
                          selectSomeItems: 'Selecionar um dia do mês',
                        }}
                      />
                      <br />
                      <br />
                    </>
                  )}

                  {recurrenceSelectRepete === 'Y' && (
                    <>
                      <br />
                      <label htmlFor="type">
                        Mês
                        <br />
                        <select
                          name="userType"
                          className='dropdown'
                          value={selectMonthYear}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeMonthYear(e.target.value)}
                        >
                          <option>Selecione</option>
                          <option value="1">Janeiro</option>
                          <option value="2">Fevereiro</option>
                          <option value="3">Março</option>
                          <option value="4">Abril</option>
                          <option value="5">Maio</option>
                          <option value="6">Junho</option>
                          <option value="7">Julho</option>
                          <option value="8">Agosto</option>
                          <option value="9">Setembro</option>
                          <option value="10">Outubro</option>
                          <option value="11">Novembro</option>
                          <option value="12">Dezembro</option>
                        </select>
                      </label>

                      <br />
                      <br />
                      <Multi
                        options={dayRecurrence}
                        value={selectDayYear}
                        onChange={setSelectDayYear}
                        labelledBy="Selecione"
                        selectAllLabel="Selecione"
                        disableSearch
                        ClearIcon
                        overrideStrings={{
                          selectSomeItems: 'Selecionar um dia do mês',
                        }}
                      />
                      <br />
                      <br />
                    </>
                  )}
                  <br />
                  <br />

                  <label htmlFor="type">
                    Termina em:
                    <br />
                    <select
                      name="end"
                      className='dropdown'
                      value={sharedParameterEnd}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeEnd(e.target.value)}
                    >
                      <option value="0">Nunca</option>
                      <option value="1">Em</option>
                      <option value="2">Após</option>
                    </select>
                  </label>
                  <br />
                  <br />

                  {sharedParameterEnd == '1' && (
                    <>
                      <DatePicker
                        title="Data de termino:"
                        onChange={handleRecurrenceEndDate}
                        value={recurrenceEndDate}
                      />
                    </>
                  )}

                  {sharedParameterEnd == '2' && (
                    <>
                      <label htmlFor="nome">
                        Quantidade
                        <br />
                        <input
                          type="text"
                          className='textInput'
                          value={recurrenceQtd}
                          name="qtd"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setRecurrenceQtd(e.target.value)}
                          required
                          autoComplete="off"
                        />
                      </label>
                    </>
                  )}
                  <br />
                  <br />

                  <footer>
                    <button
                      className="buttonClick"
                      type='button'
                      onClick={()=> handleSaveRecurrence()}
                    >
                      <FiSave />
                      Salvar
                    </button>

                    {appointmentRecurrent  === 'S' && (
                      <button
                        type='button'
                        className="buttonClick"
                        onClick={() => handleRecurrenceRemove()}
                      >
                        <FiTrash />
                        Remover
                      </button>
                    )}

                    <button
                      type='button'
                      className="buttonClick"
                      onClick={() => handleRecurrenceClose()}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                    <br />
                    <br />
                  </footer>

                  <br />
                  <br />
                </div>
                <br />
              </ModalRecurrence>

              <HeaderComponent
                id='HeaderComponent'
                title="Agenda"
                cursor
                action={handleCloseModalLog}
                onMouseOver={handleDragControllMouseOver}
                onMouseOut={handleDragControllMouseOut}
              />

              <ModalContent id='ModalContent' isDrag={onDrag}>

                {(openReminderModal) && <Overlay /> }
                {(openReminderModal) && <CalendarReminderModal callbackFunction={{ handleCloseReminderModal, setAppointmentNotifyMatterCustomer, setAppointmentRemindersList, appointmentRemindersList, appointmentNotifyMatterCustomer }} /> }

                <div className='autoComplete'>
                  <p>Assunto</p>
                  <Select
                    isSearchable
                    isClearable
                    placeholder='Selecione o Assunto'
                    onChange={handleSubjectChange}
                    onInputChange={(term) => setAppointmentSubject(term)}
                    value={optionsSubject.filter(options => options.id == appointmentSubjectId)}
                    options={optionsSubject}
                    className='andamentoType'
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                  />
                </div>

                <ModalDateSettings>
                  <DatePicker
                    title="Data Inicio"
                    onChange={handleNewDateBeggin}
                    value={appointmentDateBeggin}
                    disabled={appointmentBlockUpdate}
                  />
                  <TimePicker
                    title="Hora Inicio"
                    name="timepicker"
                    list="times"
                    value={appointmentHourBeggin}
                    onChange={handleNewHourBeggin}
                    disabled={appointmentBlockUpdate}
                  />

                  <DatePicker
                    title="Data Final"
                    onChange={handleNewDateEnd}
                    value={appointmentDateEnd}
                    disabled={appointmentBlockUpdate}
                  />
                  <TimePicker
                    title="Hora Termino"
                    list="times"
                    id="timepickerend"
                    value={appointmentHourEnd}
                    onChange={handleNewHourEnd}
                    disabled={appointmentBlockUpdate}
                  />

                  <div>
                    {appointmentAllDay === 'N' ? (
                      <input
                        type="checkbox"
                        title="Dia Todo"
                        id="allday"
                        value={appointmentAllDay}
                        onChange={handleAllDayChange}
                        disabled={appointmentBlockUpdate}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        title="Dia Todo"
                        id="allday"
                        checked
                        value={appointmentAllDay}
                        onChange={handleAllDayChange}
                        disabled={appointmentBlockUpdate}
                      />
                    )}
                    {/* {recurrentController ? <FiClock title="Recorrencia" /> : null} */}


                    {!hideRecurrenceButton && (
                      <>
                        <FiClock title="Tornar este item recorrente ou editar um padrão de recorrência. Um item recorrente é aquele que se repete regularmente." />
                        <button
                          title="Tornar este item recorrente ou editar um padrão de recorrência. Um item recorrente é aquele que se repete regularmente."
                          className="buttonLinkClick"
                          onClick={(e) => handleClickRecurrence(e)}
                          type="submit"
                          disabled={appointmentBlockUpdate}
                        >
                          &nbsp;
                          { appointmentRecurrent =='S' && <span style={{fontSize:'0.55rem'}}>Ver Recorrência</span>}
                          { appointmentRecurrent == 'N' && <span style={{fontSize:'0.55rem'}}>Recorrência</span>}
                        </button>
                      </>
                    )}

                  </div>
                </ModalDateSettings>

                <TextArea
                  name="Descrição"
                  value={appointmentDescription}
                  onChange={handleNewDescription}
                  disabled={appointmentBlockUpdate}
                  style={{overflow:'auto'}}
                />

                <TextArea
                  name="Observação"
                  value={appointmentObs}
                  onChange={handleNewObs}
                  style={{overflow:'auto'}}
                  maxLength={1000}
                />

                <Process>
                  <label htmlFor="process">Processo</label>

                  {processTitle === 'Associar Processo' && (
                    <button
                      type="button"
                      id="associar"
                      onClick={handleGridSelectProcess}
                      disabled={appointmentBlockUpdate}
                    >
                      <p>{processTitle}</p>
                    </button>
                  )}
                  {processTitle !== 'Associar Processo' && (
                    <>
                      {completeLink && (
                        <a href={redirectLink}>
                          <p>{processTitle}</p>
                        </a>
                      )}
                    </>
                  )}

                  {processTitle !== 'Associar Processo' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleWhatsAppLink()
                      }}
                    >
                      <FaWhatsapp />
                    </button>
                  )}

                  {processTitle === 'Associar Processo' && (
                    <button
                      type="button"
                      onClick={handleGridSelectProcess}
                      disabled={appointmentBlockUpdate}
                    >
                      <RiFolder2Fill />
                    </button>
                  )}

                  {processTitle !== 'Associar Processo' && (
                    <button
                      type="button"
                      disabled={appointmentBlockUpdate}
                      onClick={() => {
                        setProcessTitle('Associar Processo');
                        setAppointmentMatter(undefined);
                        setNumWhatsApp("")
                      }}
                    >
                      {!blockAssociateMatter &&  <RiEraserLine /> }
                    </button>
                  )}
                </Process>

                <Wrapper isPublic={privacyChange}>
                  <Lembrete>
                    <div id="content">
                      <label>Lembrete</label>

                      <select
                        name="lembretes"
                        id="lembretes"
                        onChange={handleSelectLembretes}
                        disabled={appointmentBlockUpdate}
                      >
                        {optionsLembrete.map(ol => (
                          <option key={ol.key} value={ol.key}>
                            {ol.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div id="divTable" style={{width:'100%'}}>
                      <table id='Table' style={{float:'right', marginRight:'20px'}}>
                        {appointmentRemindersList.map(item => (
                          <tr id='Tr'>
                            <td id='tdLabel' style={{width:'80px', textAlign:'left', height:'20px', fontSize:'12px'}}>
                              {item.qtdReminder === '0M' && <p>No Horário</p>}
                              {item.qtdReminder === '12H' && <p>Meio Dia</p>}
                              {item.qtdReminder != '12H' && item.qtdReminder != '0M' && item.qtdReminder.includes("M") && <p>{item.qtdReminder.split('M')[0]} Minuto(s)</p>}
                              {item.qtdReminder != '12H' && item.qtdReminder != '0M' && item.qtdReminder.includes("H") && <p>{item.qtdReminder.split('H')[0]} Hora(s)</p>}
                              {item.qtdReminder != '12H' && item.qtdReminder != '0M' && item.qtdReminder.includes("D") && <p>{item.qtdReminder.split('D')[0]} Dia(s)</p>}
                              {item.qtdReminder != '12H' && item.qtdReminder != '0M' && item.qtdReminder.includes("S") && <p>{item.qtdReminder.split('S')[0]} Semana(s)</p>}
                              {item.qtdReminder != '12H' && item.qtdReminder != '0M' && item.qtdReminder.includes("E") && <p>{item.qtdReminder.split('E')[0]} Mês(es)</p>}
                            </td>
                            <td id='tdNotButtons' style={{width:'115px', textAlign:'right', height:'20px', fontSize:'12px'}}>
                              {item.notifyMatterCustomer === 'S' ? (
                                <>
                                  {item.emailNotification === 'S' ? (
                                    <button type="button" onClick={() => {CustomerEmailNotification(item.qtdReminder)}} title='Clique para desativar o envio de lembrete email ao cliente'>
                                      <FiMail style={{color:'blue', height:'16px', width:'16px'}} />
                                    </button>
                                  ) : (
                                    <button type="button" onClick={() => {CustomerEmailNotification(item.qtdReminder)}} title='Clique para ativar o envio de lembrete email ao cliente'>
                                      <FiMail style={{color:'var(--grey)', height:'16px', width:'16px'}} />
                                    </button>
                                  )}
                                  &nbsp;&nbsp;
                                  {item.whatsAppNotification === 'S' ? (
                                    <button type="button" onClick={() => {CustomerWhatsNotification(item.qtdReminder)}} title='Clique para desativar o envio de lembrete whatsapp ao cliente'>
                                      <FaWhatsapp style={{color:'green', height:'16px', width:'16px'}} />
                                    </button>
                                  ) : (
                                    <button type="button" onClick={() => {CustomerWhatsNotification(item.qtdReminder)}} title='Clique para ativar o envio de lembrete whatsapp ao cliente'>
                                      <FaWhatsapp style={{color:'var(--grey)', height:'16px', width:'16px'}} />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <button type="button" id="NotificationCustomerButton" onClick={() => {CustomerNotification(item.qtdReminder)}} style={{color:'blue'}} title='Após clicar no botão selecione as opções de notificação por E-Mail ou WhatsApp'>
                                    <p>Notifica Cliente</p>
                                  </button>
                                </>
                              )}
                            </td>
                            <td id='Trash' style={{width:'20px', textAlign:'left', height:'20px', fontSize:'12px'}}>
                              <button type="button" onClick={() => {handleDisableNotification(item.qtdReminder)}}>
                                &nbsp;<FiTrash title="Excluir o lembrete" style={{color:'var(--grey)', height:'16px', width:'16px'}} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </table>
                    </div>
                  </Lembrete>

                  <Privacidade isPublic={privacyChange}>
                    <div>
                      <label>Privacidade</label>

                      <select
                        name="privacidade"
                        id="privacidade"
                        onChange={handlePrivacyChange}
                        value={appointmentPrivateEvent}
                        disabled={appointmentBlockUpdate}
                      >
                        <option value="N">Público</option>
                        <option value="S">Privado</option>
                      </select>
                    </div>

                    <section>
                      <div>
                        <input
                          type="checkbox"
                          name="Permissão"
                          id="permissaoAlteracao"
                          checked={allowEditController}
                          title="Permissão de alteração"
                          onChange={handleChangeAllowEdit}
                        />
                        <p>Permitir que outras pessoas alterem</p>
                      </div>
                    </section>
                  </Privacidade>
                </Wrapper>

                <WrapperResp isPublic={privacyChange}>
                  <Responsavel
                    onDrop={(e) => handleUserDragInDrop(e, 'shared')}
                    onDragOverCapture={(e) => e.preventDefault()}
                  >
                    <div>
                      <label>Responsável</label>
                      <input
                        name="responsavel"
                        type="select"
                        placeholder="Pesquise um usuário"
                        onChange={HandleResponsibleUser}
                        disabled={appointmentBlockUpdate}
                        value={userResponsibleValue}
                        list="responsible"
                      />
                      <datalist id="responsible">
                        {userList.map(user => (
                          <option key={user.id} value={user.value}>
                            {user.value}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <ResponsibleList>
                      {appointmentResponsibleList.map(item => (
                        <div key={item.userCompanyId}>
                          <div
                            id={item.userCompanyId}
                            draggable
                            onDrag={() => setUserIdCurrentDrag(item.userCompanyId)}
                            style={{cursor: 'move'}}
                          >
                            <p>{item.userName}</p>
                            <p style={{display:'none'}}>{item.accessType}</p>
                          </div>
                          <button
                            type="button"
                            disabled={appointmentBlockUpdate}
                            onClick={() => { handleCancelResponsible(item.userName);}}
                          >
                            <FiTrash title="Excluir" />
                          </button>

                          {item.allowEdit === 'S' ? (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifyResponsibleCustomer}
                              title="Permitir Alteração"
                              disabled={appointmentBlockUpdate}
                              checked
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifyResponsibleCustomer}
                              disabled={appointmentBlockUpdate}
                              title="Permitir Alteração"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </ResponsibleList>

                  </Responsavel>

                  <Share
                    onDrop={(e) => handleUserDragInDrop(e, 'responsible')}
                    onDragOverCapture={(e) => e.preventDefault()}
                    isPublic={privacyChange}
                  >
                    <div>
                      <label>Compartilhar com</label>

                      <input
                        name="compartilhado"
                        type="select"
                        placeholder="Pesquise um usuário"
                        disabled={privacyChange || appointmentBlockUpdate}
                        onChange={HandleShareUser}
                        value={userSharedValue}
                        list="shared"
                      />
                      <datalist id="shared">
                        {userList.map(list => (
                          <option key={list.id} value={list.value}>
                            {list.value}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <ShareList>
                      {appointmentSharedList.map(item => (
                        <div key={item.userCompanyId}>
                          <div
                            id={item.userCompanyId}
                            draggable
                            onDrag={() => setUserIdCurrentDrag(item.userCompanyId)}
                            style={{ cursor: 'move'}}
                          >
                            <p>{item.userName}</p>
                            <p style={{display:'none'}}>{item.accessType}</p>
                          </div>
                          <button
                            type="button"
                            disabled={appointmentBlockUpdate}
                            onClick={() => {
                              handleCancelShare(item.userName);
                            }}
                          >
                            <FiTrash title="Excluir" />
                          </button>
                          {item.allowEdit === 'S' ? (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifySharedCustomer}
                              title="Permitir Alteração"
                              disabled={appointmentBlockUpdate}
                              checked
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleSAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifySharedCustomer}
                              disabled={appointmentBlockUpdate}
                              title="Permitir Alteração"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleSAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </ShareList>
                  </Share>
                </WrapperResp>
              </ModalContent>

              <Footer id='Footer' showButtons={isCreate}>
                <section>
                  <button type="button" id="log" onClick={handleLogOnDisplay}>
                    <IoIosPaper title="Ver Historico" />
                    <p>Ver Histórico</p>
                  </button>

                  <p>
                    Criado Por:&nbsp;
                    {appointmentUser}
                  </p>
                </section>

                {appointmentWorkflowActionsExecId !== 0 && (
                  <div title="Esse compromisso está associado a um Workflow">
                    <GoGitMerge/>
                  </div>
                )}
  

                <div>
                  <button type="button" onClick={handleSaveModal}>
                    Salvar
                    {loadingSave ? <Loader size={20} color="#f19000" /> : null}
                  </button>
                  <button
                    type="button"
                    id="delete"
                    disabled={appointmentBlockUpdate}
                    onClick={() => {
                      handleDeleteModal();
                      setLoadingDelete(!loadingDelete);
                    }}
                  >
                    Excluir
                    {loadingDelete ? <Loader size={20} color="#f19000" /> : null}
                  </button>
         
                  <button type="button" id="done" onClick={handleDoneOrReopen}>
                    {textButton}
                    {loadingDone ? <Loader size={20} color="#f19000" /> : null}
                  </button>
                  <button type="button" onClick={handleCloseModalLog}>
                    Fechar
                  </button>
                </div>
              </Footer>


            </Container2>
          ))}

        </ResponsiveGridLayout>
      )}
      

      {small && (
        <ResponsiveGridLayout
          className="layout"
          rowHeight={28}
          width={screenWitdh}
          isDraggable={dragControll}
          isResizable={false}
          isBounded
        >
          {layoutComp.map(modal => (
            <Container2
              key={modal.positions.i}
              data-grid={{
                x: modal.positions.x,
                y: modal.positions.y,
                w: modal.positions.w,
                h: modal.positions.h,
              }}
            >

              {checkMessage && (
                <ConfirmOverlay />
              )}

              <ModalConfirm id='ModalConfirm' show={checkMessage}>
                <header>Aviso</header>
                <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
                  <br />
                  A data inicial do compromisso é menor que a data atual.
                  <br />
                  Deseja confirmar a operação ?

                  <br /><br />

                  <footer>
                    <button
                      className="accept"
                      type="button"
                      onClick={() => ConfirmSave()}
                    >
                      <BsCheckBox />
                      Confirmar
                    </button>

                    <button
                      className="cancel"
                      type="button"
                      onClick={() => setCheckMessage(false)}
                    >
                      <TiCancel />
                      Cancelar
                    </button>
                  </footer>
                </div>
                <br />
              </ModalConfirm>

              <ModalRecurrence id='ModalRecurrence' show={openModalRecurrence}>
                <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
                  Regras de Recorrência
                  <br />
                  <br />

                  <DatePicker
                    title="Inicia em:"
                    disabled
                    onChange={handleRecurrenceStartDate}
                    value={recurrenceStartDate}
                  />
                  <br />
                  <br />

                  <label htmlFor="type">
                    Repetir a cada
                    <br />
                    <select
                      name="userType"
                      className='dropdown'
                      value={recurrenceSelectRepete}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeRepete(e.target.value)}
                    >
                      <option>Selecione</option>
                      <option value="D">Diária</option>
                      <option value="W">Semanal</option>
                      <option value="M">Mensal</option>
                      <option value="Y">Anual</option>
                    </select>
                  </label>
                  <br />

                  {recurrenceSelectRepete === 'W' && (
                    <>
                      <br />
                      <section>
                        <Multi
                          options={weekRecurrence}
                          value={selectWeek}
                          onChange={(setSelectWeek)}
                          labelledBy="Selecione"
                          selectAllLabel="Selecione"
                          disableSearch
                          ClearIcon
                          overrideStrings={{
                            selectSomeItems: 'Selecionar um dia da semana',
                          }}
                        />
                      </section>
                      <br />
                      <br />
                    </>
                  )}

                  {recurrenceSelectRepete === 'M' && (
                    <>
                      <br />
                      <Multi
                        options={dayRecurrence}
                        value={selectDayMonth}
                        onChange={setSelectDayMonth}
                        labelledBy="Selecione"
                        selectAllLabel="Selecione"
                        disableSearch
                        ClearIcon
                        overrideStrings={{
                          selectSomeItems: 'Selecionar um dia do mês',
                        }}
                      />
                      <br />
                      <br />
                    </>
                  )}

                  {recurrenceSelectRepete === 'Y' && (
                    <>
                      <br />
                      <label htmlFor="type">
                        Mês
                        <br />
                        <select
                          name="userType"
                          className='dropdown'
                          value={selectMonthYear}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeMonthYear(e.target.value)}
                        >
                          <option>Selecione</option>
                          <option value="1">Janeiro</option>
                          <option value="2">Fevereiro</option>
                          <option value="3">Março</option>
                          <option value="4">Abril</option>
                          <option value="5">Maio</option>
                          <option value="6">Junho</option>
                          <option value="7">Julho</option>
                          <option value="8">Agosto</option>
                          <option value="9">Setembro</option>
                          <option value="10">Outubro</option>
                          <option value="11">Novembro</option>
                          <option value="12">Dezembro</option>
                        </select>
                      </label>

                      <br />
                      <br />
                      <Multi
                        options={dayRecurrence}
                        value={selectDayYear}
                        onChange={setSelectDayYear}
                        labelledBy="Selecione"
                        selectAllLabel="Selecione"
                        disableSearch
                        ClearIcon
                        overrideStrings={{
                          selectSomeItems: 'Selecionar um dia do mês',
                        }}
                      />
                      <br />
                      <br />
                    </>
                  )}
                  <br />
                  <br />

                  <label htmlFor="type">
                    Termina em:
                    <br />
                    <select
                      name="end"
                      className='dropdown'
                      value={sharedParameterEnd}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => handleChangeEnd(e.target.value)}
                    >
                      <option value="0">Nunca</option>
                      <option value="1">Em</option>
                      <option value="2">Após</option>
                    </select>
                  </label>
                  <br />
                  <br />

                  {sharedParameterEnd == '1' && (
                    <>
                      <DatePicker
                        title="Data de termino:"
                        onChange={handleRecurrenceEndDate}
                        value={recurrenceEndDate}
                      />
                    </>
                  )}

                  {sharedParameterEnd == '2' && (
                    <>
                      <label htmlFor="nome">
                        Quantidade
                        <br />
                        <input
                          type="text"
                          className='textInput'
                          value={recurrenceQtd}
                          name="qtd"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setRecurrenceQtd(e.target.value)}
                          required
                          autoComplete="off"
                        />
                      </label>
                    </>
                  )}
                  <br />
                  <br />

                  <footer>
                    <button
                      className="buttonClick"
                      type='button'
                      onClick={()=> handleSaveRecurrence()}
                    >
                      <FiSave />
                      Salvar
                    </button>

                    {appointmentRecurrent  === 'S' && (
                      <button
                        type='button'
                        className="buttonClick"
                        onClick={() => handleRecurrenceRemove()}
                      >
                        <FiTrash />
                        Remover
                      </button>
                    )}

                    <button
                      type='button'
                      className="buttonClick"
                      onClick={() => handleRecurrenceClose()}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                    <br />
                    <br />
                  </footer>

                  <br />
                  <br />
                </div>
                <br />
              </ModalRecurrence>

              <HeaderComponent
                id='HeaderComponent'
                title="Agenda"
                cursor
                action={handleCloseModalLog}
                onMouseOver={handleDragControllMouseOver}
                onMouseOut={handleDragControllMouseOut}
              />

              <ModalContent id='ModalContent' isDrag={onDrag}>
                <div className='autoComplete'>
                  <p>Assunto</p>
                  <Select
                    isSearchable
                    isClearable
                    placeholder='Selecione o Assunto'
                    onChange={handleSubjectChange}
                    onInputChange={(term) => setAppointmentSubject(term)}
                    value={optionsSubject.filter(options => options.id == appointmentSubjectId)}
                    options={optionsSubject}
                    className='andamentoType'
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                  />
                </div>

                <ModalDateSettings>
                  <DatePicker
                    title="Data Inicio"
                    onChange={handleNewDateBeggin}
                    value={appointmentDateBeggin}
                    disabled={appointmentBlockUpdate}
                  />
                  <TimePicker
                    title="Hora Inicio"
                    name="timepicker"
                    list="times"
                    value={appointmentHourBeggin}
                    onChange={handleNewHourBeggin}
                    disabled={appointmentBlockUpdate}
                  />

                  <DatePicker
                    title="Data Final"
                    onChange={handleNewDateEnd}
                    value={appointmentDateEnd}
                    disabled={appointmentBlockUpdate}
                  />
                  <TimePicker
                    title="Hora Termino"
                    list="times"
                    id="timepickerend"
                    value={appointmentHourEnd}
                    onChange={handleNewHourEnd}
                    disabled={appointmentBlockUpdate}
                  />

                  <div>
                    {appointmentAllDay === 'N' ? (
                      <input
                        type="checkbox"
                        title="Dia Todo"
                        id="allday"
                        value={appointmentAllDay}
                        onChange={handleAllDayChange}
                        disabled={appointmentBlockUpdate}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        title="Dia Todo"
                        id="allday"
                        checked
                        value={appointmentAllDay}
                        onChange={handleAllDayChange}
                        disabled={appointmentBlockUpdate}
                      />
                    )}
                    {/* {recurrentController ? <FiClock title="Recorrencia" /> : null} */}


                    {!hideRecurrenceButton && (
                      <>
                        <FiClock title="Tornar este item recorrente ou editar um padrão de recorrência. Um item recorrente é aquele que se repete regularmente." />
                        <button
                          title="Tornar este item recorrente ou editar um padrão de recorrência. Um item recorrente é aquele que se repete regularmente."
                          className="buttonLinkClick"
                          onClick={(e) => handleClickRecurrence(e)}
                          type="submit"
                          disabled={appointmentBlockUpdate}
                        >
                          &nbsp;
                          { appointmentRecurrent =='S' && <span style={{fontSize:'0.55rem'}}>Ver Recorrência</span>}
                          { appointmentRecurrent == 'N' && <span style={{fontSize:'0.55rem'}}>Recorrência</span>}
                        </button>
                      </>
                    )}

                  </div>
                </ModalDateSettings>

                <TextArea
                  name="Descrição"
                  value={appointmentDescription}
                  onChange={handleNewDescription}
                  disabled={appointmentBlockUpdate}
                  style={{overflow:'auto'}}
                />

                <TextArea
                  name="Observação"
                  value={appointmentObs}
                  onChange={handleNewObs}
                  style={{overflow:'auto'}}
                  maxLength={1000}
                />

                <Process>
                  <label htmlFor="process">Processo</label>

                  {processTitle === 'Associar Processo' && (
                    <button
                      type="button"
                      id="associar"
                      onClick={handleGridSelectProcess}
                      disabled={appointmentBlockUpdate}
                    >
                      <p>{processTitle}</p>
                    </button>
                  )}

                  {processTitle !== 'Associar Processo' && (
                    <>
                      {completeLink && (
                        <a href={redirectLink}>
                          <p>{processTitle}</p>
                        </a>
                      )}
                    </>
                  )}

                  {processTitle !== 'Associar Processo' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleWhatsAppLink()
                      }}
                    >
                      <FaWhatsapp />
                    </button>
                  )}

                  {processTitle === 'Associar Processo' && (
                    <button
                      type="button"
                      onClick={handleGridSelectProcess}
                      disabled={appointmentBlockUpdate}
                    >
                      <RiFolder2Fill />
                    </button>
                  )}

                  {processTitle !== 'Associar Processo' && (
                    <button
                      type="button"
                      disabled={appointmentBlockUpdate}
                      onClick={() => {
                        setProcessTitle('Associar Processo');
                        setAppointmentMatter(undefined);
                        setNumWhatsApp("")
                      }}
                    >
                      {!blockAssociateMatter &&  <RiEraserLine /> }
                    </button>
                  )}
                </Process>

                <Wrapper isPublic={privacyChange}>
                  <Lembrete>
                    <div id="content">
                      <label>Lembrete</label>

                      <select
                        name="lembretes"
                        id="lembretes"
                        onChange={handleSelectLembretes}
                        disabled={appointmentBlockUpdate}
                      >
                        {optionsLembrete.map(ol => (
                          <option key={ol.key} value={ol.key}>
                            {ol.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ReminderList>
                      {appointmentRemindersList.map(item => (
                        <div key={item.qtdReminder}>
                          <p>
                            {item.qtdReminder === '0M' && <p>No Horário</p>}
                            {item.qtdReminder === '5M' && <p>05 Minutos</p>}
                            {item.qtdReminder === '10M' && <p>10 Minutos</p>}
                            {item.qtdReminder === '15M' && <p>15 Minutos</p>}
                            {item.qtdReminder === '30M' && <p>30 Minutos</p>}
                            {item.qtdReminder === '1H' && <p>01 Hora</p>}
                            {item.qtdReminder === '2H' && <p>02 Horas</p>}
                            {item.qtdReminder === '4H' && <p>04 Horas</p>}
                            {item.qtdReminder === '8H' && <p>08 Horas</p>}
                            {item.qtdReminder === '12H' && <p>Meio Dia</p>}
                            {item.qtdReminder === '1D' && <p>Um Dia</p>}
                            {item.qtdReminder === '2D' && <p>Dois Dias</p>}
                            {item.qtdReminder === '1S' && <p>Uma Semana</p>}
                            {item.qtdReminder === '2S' && <p>Duas Semanas</p>}
                            {item.qtdReminder === '1E' && <p>Um Mês</p>}
                            {item.qtdReminder === '2E' && <p>Dois Meses</p>}
                          </p>

                          {item.notifyMatterCustomer === 'S' ? (
                            <>
                              {item.emailNotification === 'S' ? (
                                <button type="button" onClick={() => {CustomerEmailNotification(item.qtdReminder)}} title='Clique para desativar o envio de lembrete email ao cliente'>
                                  <FiMail style={{color:'blue'}} />
                                </button>
                              ) : (
                                <button type="button" onClick={() => {CustomerEmailNotification(item.qtdReminder)}} title='Clique para ativar o envio de lembrete email ao cliente'>
                                  <FiMail style={{color:'var(--grey)'}} />
                                </button>
                              )}
                              &nbsp;
                              {item.whatsAppNotification === 'S' ? (
                                <button type="button" onClick={() => {CustomerWhatsNotification(item.qtdReminder)}} title='Clique para desativar o envio de lembrete whatsapp ao cliente'>
                                  <FaWhatsapp style={{color:'green'}} />
                                </button>
                              ) : (
                                <button type="button" onClick={() => {CustomerWhatsNotification(item.qtdReminder)}} title='Clique para ativar o envio de lembrete whatsapp ao cliente'>
                                  <FaWhatsapp style={{color:'var(--grey)'}} />
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button type="button" id="NotificationCustomerButton" onClick={() => {CustomerNotification(item.qtdReminder)}} style={{color:'blue'}} title='Após clicar no botão selecione as opções de notificação por E-Mail ou WhatsApp'>
                                <p>Notif. Cliente</p>
                              </button>
                            </>
                          )}

                          &nbsp;

                          <button type="button" onClick={() => {handleDisableNotification(item.qtdReminder)}}>
                            <FiTrash title="Excluir" />
                          </button>

                        </div>
                      ))}
                    </ReminderList>
                  </Lembrete>

                  <Privacidade isPublic={privacyChange}>
                    <div>
                      <label>Privacidade</label>

                      <select
                        name="privacidade"
                        id="privacidade"
                        onChange={handlePrivacyChange}
                        value={appointmentPrivateEvent}
                        disabled={appointmentBlockUpdate}
                      >
                        <option value="N">Público</option>
                        <option value="S">Privado</option>
                      </select>
                    </div>

                    <section>
                      <div>
                        <input
                          type="checkbox"
                          name="Permissão"
                          id="permissaoAlteracao"
                          checked={allowEditController}
                          title="Permissão de alteração"
                          onChange={handleChangeAllowEdit}
                        />
                        <p>Permitir que outras pessoas alterem</p>
                      </div>
                    </section>
                  </Privacidade>
                </Wrapper>

                <WrapperResp isPublic={privacyChange}>
                  <Responsavel
                    onDrop={(e) => handleUserDragInDrop(e, 'shared')}
                    onDragOverCapture={(e) => e.preventDefault()}
                  >

                    <div>
                      <label>Responsável</label>
                      <input
                        name="responsavel"
                        type="select"
                        placeholder="Pesquise um usuário"
                        onChange={HandleResponsibleUser}
                        disabled={appointmentBlockUpdate}
                        value={userResponsibleValue}
                        list="responsible"
                      />
                      <datalist id="responsible">
                        {userList.map(user => (
                          <option key={user.id} value={user.value}>
                            {user.value}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <ResponsibleList>
                      {appointmentResponsibleList.map(item => (
                        <div key={item.userCompanyId}>
                          <div
                            id={item.userCompanyId}
                            draggable
                            onDrag={() => setUserIdCurrentDrag(item.userCompanyId)}
                            style={{cursor: 'move'}}
                          >
                            <p>{item.userName}</p>
                            <p style={{display:'none'}}>{item.accessType}</p>
                          </div>
                          <button
                            type="button"
                            disabled={appointmentBlockUpdate}
                            onClick={() => { handleCancelResponsible(item.userName);}}
                          >
                            <FiTrash title="Excluir" />
                          </button>

                          {item.allowEdit === 'S' ? (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifyResponsibleCustomer}
                              title="Permitir Alteração"
                              disabled={appointmentBlockUpdate}
                              checked
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifyResponsibleCustomer}
                              disabled={appointmentBlockUpdate}
                              title="Permitir Alteração"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </ResponsibleList>

                  </Responsavel>

                  <Share
                    onDrop={(e) => handleUserDragInDrop(e, 'responsible')}
                    onDragOverCapture={(e) => e.preventDefault()}
                    isPublic={privacyChange}
                  >
                    <div>
                      <label>Compartilhar com</label>

                      <input
                        name="compartilhado"
                        type="select"
                        placeholder="Pesquise um usuário"
                        disabled={privacyChange || appointmentBlockUpdate}
                        onChange={HandleShareUser}
                        value={userSharedValue}
                        list="shared"
                      />
                      <datalist id="shared">
                        {userList.map(list => (
                          <option key={list.id} value={list.value}>
                            {list.value}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <ShareList>
                      {appointmentSharedList.map(item => (
                        <div key={item.userCompanyId}>
                          <div
                            id={item.userCompanyId}
                            draggable
                            onDrag={() => setUserIdCurrentDrag(item.userCompanyId)}
                            style={{ cursor: 'move'}}
                          >
                            <p>{item.userName}</p>
                            <p style={{display:'none'}}>{item.accessType}</p>
                          </div>
                          <button
                            type="button"
                            disabled={appointmentBlockUpdate}
                            onClick={() => {
                              handleCancelShare(item.userName);
                            }}
                          >
                            <FiTrash title="Excluir" />
                          </button>
                          {item.allowEdit === 'S' ? (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifySharedCustomer}
                              title="Permitir Alteração"
                              disabled={appointmentBlockUpdate}
                              checked
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleSAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name={item.userName}
                              id={item.userName}
                              value={appointmentNotifySharedCustomer}
                              disabled={appointmentBlockUpdate}
                              title="Permitir Alteração"
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) => {
                                handleResposibleSAllowEditChange(
                                  item.userName,
                                  event.target.value,
                                );
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </ShareList>
                  </Share>
                </WrapperResp>
              </ModalContent>

              <Footer id='Footer' showButtons={isCreate}>
                <section>
                  <button type="button" id="log" onClick={handleLogOnDisplay}>
                    <IoIosPaper title="Ver Historico" />
                    <p>Ver Histórico</p>
                  </button>

                  <p>
                    Criado Por:&nbsp;
                    {appointmentUser}
                  </p>
                </section>
                <div>
                  <button type="button" onClick={handleSaveModal}>
                    Salvar
                    {loadingSave ? <Loader size={20} color="#f19000" /> : null}
                  </button>
                  <button
                    type="button"
                    id="delete"
                    disabled={appointmentBlockUpdate}
                    onClick={() => {
                      handleDeleteModal();
                      setLoadingDelete(!loadingDelete);
                    }}
                  >
                    Excluir
                    {loadingDelete ? <Loader size={20} color="#f19000" /> : null}
                  </button>
                  <button type="button" id="done" onClick={handleDoneOrReopen}>
                    {textButton}
                    {loadingDone ? <Loader size={20} color="#f19000" /> : null}
                  </button>
                  <button type="button" onClick={handleCloseModalLog}>
                    Fechar
                  </button>
                </div>
              </Footer>

            </Container2>
          ))}
        

        </ResponsiveGridLayout>
      )}

      {openSelectProcess === 'Open' ? <GridSelectProcess /> : null}

      {openSaveModal ? (
        <SaveModal
          handleCheckMessage={HandleCheckMessage}
          close={handleSaveModal}
          data={appointmentStore}
          closeModal={isClosed}
        />
      ) : null}

      {openDeleteModal ? (
        <DeleteModal
          close={handleDeleteModal}
          data={appointmentDeleteStore}
          closeModal={isClosed}
        />
      ) : null}

      {showLog && (
        <LogModal
          idRecord={appointmentId}
          handleCloseModalLog={handleCloseLog}
          logType="eventLog"
        />
      )}

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            {' '}
            <FcSearch title='O relatório solicitado esta sendo processado, em breve será aberto automaticamente' />
            {' '}
            Aguarde um instante...
            <Loader size={4} color="var(--blue-twitter)" />
          </div>
          
        </>
      )}

      {(confirmDeleteCalendarEvent) && <Overlay /> }
      {confirmDeleteCalendarEvent && (
        <ConfirmDeleteModal 
        appointmentWorkflowActionsExecId={appointmentWorkflowActionsExecId}
        callbackFunction={{handleCloseConfirmDelete, handleConfirmDelete}} />
      )}


    </DropArea>
  );
};

export default CreateAppointment;
