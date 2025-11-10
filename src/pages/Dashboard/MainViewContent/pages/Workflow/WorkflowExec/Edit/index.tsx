import React, { ChangeEvent, useCallback, useEffect, useRef, useState, UIEvent } from 'react'
import Select from 'react-select'
import { formatField, selectStyles, useDelay, currencyConfig } from 'Shared/utils/commonFunctions';
import { RiFolder2Fill, RiEraserLine, RiCalendarCheckFill } from 'react-icons/ri';
import { useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { FiDelete, FiLock, FiPlus, FiSave, FiTrash, FiSearch, FiX } from 'react-icons/fi';
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import { RiCloseLine, RiNewspaperFill } from 'react-icons/ri';
import { MdBlock } from 'react-icons/md';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { Clear, Tab, Tabs } from 'Shared/styles/Tabs';
import api from 'services/api';
import { useMatter } from 'context/matter';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useModal } from 'context/modal';
import { useDocument } from 'context/document';
import DocumentModal from 'components/Modals/CustomerModal/DocumentModal';
import { useCustomer } from 'context/customer';
import { IWorkflowTriggers, IWorkflowActions, IWorkflowData, ISelectValues, ITriggerAction, IWorkflowActionsExecDTO, IReminder } from '../../Interfaces/IWorkflowEdit';
import { workflowTriggerTypes } from 'Shared/utils/commonListValues';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { trigger } from 'swr';
import { FcAbout } from 'react-icons/fc';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { AppointmentPropsSave, AppointmentPropsDelete, SelectValues, Data, dataProps, LembretesData, MatterData, ModalProps, ResponsibleDTO, Settings, ShareListDTO, userListData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import { dayRecurrence, optionsLembrete, weekRecurrence } from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment/ListValues/List'
import TimePicker from 'components/TimePicker';
import { Form, Container, Content, Section, Input, Button, Process, Timeline, Step, Circle, Card } from './styles';
import { HeaderPage } from 'components/HeaderPage';
import { ISelectData } from '../../../Interfaces/IMatter';
import GridSelectProcess from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { IMatterData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { useAuth } from 'context/AuthContext';

interface IOption {
  value: number;
  label: string;
}

interface IExecParameter {
  label: string;
  value: string;
}

export interface IDefaultsProps {
  id: string;
  value: string;
}

export default function WorkflowPage() {

  const { signOut } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const { pathname } = useLocation();
  const [isPagination, setIsPagination] = useState(false);
  const [isSaving, setisSaving] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [customerList, setCustomerList] = useState<ISelectData[]>([])
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [personSearch, setPersonSearch] = useState<string | null>('')
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const { matterSelected, dateEnd, selectProcess, openSelectProcess, handleSelectProcess, jsonModalObjectResult, handleJsonModalObjectResult, deadLineText, publicationText, modalActiveId } = useModal();
  const userToken = localStorage.getItem('@GoJur:token');
  const [redirectLink, setRedirectLink] = useState('/####');
  const [completeLink, setCompleteLink] = useState<boolean>(false);
  const [workflowList, setWorkflowList] = useState<IOption[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');
  const [workflowTrigger, setWorkflowTrigger] = useState<IWorkflowTriggers[]>([]);
  //const [workflow, setWorkflow] = useState({} as IWorkflowData);
  const [triggerDates, setTriggerDates] = useState<Record<number, string>>({});
  const [optionsSubject, setOptionsSubject] = useState<ISelectValues[]>([]);
  const [triggerActions, setTriggerActions] = useState<ITriggerAction[]>([]);
  const [triggerActionsMap, setTriggerActionsMap] = useState<Record<number, ITriggerAction[]>>({});
  const [userList, setUserList] = useState<userListData[]>([]);
  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData); // processo associado
  const [workflowExecId, setWorkflowExecId] = useState<number>(0);
  const [workflowExec, setWorkflowExec] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);
  const [blockUpdate, setBlockUpdate] = useState(false);
  const { isConfirmMessage, isCancelMessage, caller, handleCancelMessage, handleConfirmMessage, handleCheckConfirm, handleCaller } = useConfirmBox();
  const [isDeleting, setIsDeleting] = useState<boolean>(); // set trigger for show loader
  const [workflowView, setWorkflowView] = useState('')
  const [notificationTag, setNotificationTag] = useState(null);
  const [matterFileId, setMatterFileId] = useState('');
  const [customerFileId, setCustomerFileId] = useState('');

  const {
    isOpenModal,
    handleDeadLineCalculatorText,
    handleCaptureTextPublication,
    handleModalActive,
    modalActive
  } = useModal();

  const [wasOpened, setWasOpened] = useState(false);



  useEffect(() => {
    const tag = localStorage.getItem('@Gojur:notificationTag');
    setNotificationTag(tag);

    setMatterFileId(localStorage.getItem('@Gojur:filterMatterId'))
    setCustomerFileId(localStorage.getItem('@Gojur:filterCustomerId'))

  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {

        if (modalActive) {
          setWasOpened(true);
        } else if (wasOpened && !modalActive) {

          let id;

          if (workflowExecId)
            id = workflowExecId;
          else
            id = pathname.substr(19)

          await loadWorkflowExec(id);

        }

      } catch (err) {
        console.error("Erro no useEffect:", err);
      }
    };

    fetchData();
  }, [modalActive, wasOpened]);




  const customStyles = {
    input: (provided: any) => ({
      ...provided,
      textIndent: 0,
      margin: 0,
      padding: 0,
    }),
  };


  const workflowOptions = [
    { value: 'sentenca', label: 'Sentença' },
    { value: 'intimacao', label: 'Intimação' },
    { value: 'prazo', label: 'Prazo Judicial' },
  ];

  const ListCustomerData = async (term: string) => {
    const token = localStorage.getItem("@GoJur:token");
    const customerListData: ISelectData[] = [];

    const response = await api.post("/Clientes/ListarComboBox", {
      token,
      page: 0,
      rows: 50,
      filterClause: term,
    });

    response.data.forEach((item: any) => {
      customerListData.push({
        id: item.id,
        label: item.value,
      });
    });

    return customerListData;
  };


  const LoadPerson = async () => {
    setCustomerList(await ListCustomerData(""))
  }

  useEffect(() => {
    LoadPerson()
    ListWorkflow("")
    LoadSubject();
    LoadUserList();

  }, [])


  const handleReactInputText = (term: string) => {
    setPersonSearch(term)
    setCustomer(term)
  }

  const RefreshPersonList = useCallback(async (inputValue: string) => {
    const list = await ListCustomerData(inputValue ?? "");
    setCustomerList(list);
  }, []);


  const RefreshWorkflowList = useCallback(async (inputValue: string) => {
    const list = await ListWorkflow(inputValue ?? "");
    setWorkflowList(list);
  }, []);


  const handleChangeCustomer = (oldCustomer, newValue) => {
    console.log("Valor antigo:", oldCustomer);
    console.log("Novo cliente selecionado:", newValue);

    setCustomer(newValue);
  };


  const handleScroolSeeMore = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    const isEndScrool = ((element.scrollHeight - element.scrollTop) - 50) <= element.clientHeight

    if (isEndScrool && !isLoading) {
      setIsPagination(true)
    }
  }


  const handleGridSelectProcess = useCallback(() => {
    if (processTitle === 'Associar Processo') {
      handleSelectProcess('Open');
      setTriggerActionsMap({});
    }
  }, [handleSelectProcess, processTitle]);


  useEffect(() => {

    const inputs = document.querySelectorAll<HTMLInputElement>('.rs__input input');

    inputs.forEach((inp) => {
      // aplica os estilos
      Object.assign(inp.style, {
        all: "unset",
        font: "inherit",
        boxSizing: "border-box",
        width: "100%",
        minWidth: "270px",
        padding: "0",
        margin: "0",
        textIndent: "0",
        direction: "ltr",
        position: "relative",
        left: "0",
        transform: "none",
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        caretColor: "auto",
      });

      // faz o scroll acompanhar o cursor
      const handleInput = () => {
        inp.scrollLeft = inp.selectionStart || 0;
      };
      inp.addEventListener("input", handleInput);

      // remove o listener na limpeza do efeito
      return () => {
        inp.removeEventListener("input", handleInput);
      };
    });
  }, []);


  useEffect(() => {
  
    if (matterSelected !== null && processTitle === 'Associar Processo') {

      setProcessTitle(`${matterSelected.matterNumber} - ${(matterSelected.matterFolder != null ? "-" : "")} ${matterSelected.matterCustomerDesc} - ${matterSelected.matterOppossingDesc}`,);

      api.post<IMatterData>('/Processo/SelecionarProcesso', {
        matterId: matterSelected.matterId,
        token: userToken,
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey')
      })
        .then(response => {
          const matterType = response.data.typeAdvisorId == null ? 'legal' : 'advisory'
          const url = `/matter/edit/${matterType}/${matterSelected.matterId}`
          setRedirectLink(url)
          setCompleteLink(true)
        })
    }
    else {
      setProcessTitle('Associar Processo');
    }
  }, [matterSelected, dateEnd]);


  const ListWorkflow = useCallback(async (term: string) => {
    try {
      const token = localStorage.getItem("@GoJur:token");

      const response = await api.get<IWorkflowData[]>("/Workflow/Listar", {
        params: {
          page: 0,
          rows: 50,
          filterClause: term,
          token,
        },
      });

      const options = response.data.map((item) => ({
        value: item.workflowId,
        label: item.name,
      }));

      setWorkflowList(options);

      return options;

    } catch (err) {
      //console.error(err);

      if (err.response.data.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }

    }
  }, []);



  const selectWorkflow = useCallback(async (workflowId: string) => {

    let hasFilterSaved = false;
    const filterStorage = localStorage.getItem('@GoJur:CustomerFilter')

    if (Number.isNaN(Number(workflowId))) {
      if (filterStorage == null) {
        return false;
      }

      const filterJSON = JSON.parse(filterStorage)
      workflowId = filterJSON.workflowId;
      hasFilterSaved = true;
    }

    try {

      const response = await api.get<IWorkflowData[]>('/Workflow/Selecionar', {
        params: {
          id: Number(workflowId),
          token
        }
      })

      if (response.data.triggers.length < 1) {
        const id = Math.random()

        const firstAction: IWorkflowActions = {
          workflowactionId: Math.random(),
          companyId,
          workflowtriggerId: id,
          actionType: 'criarcompromisso',
          daysbeforeandafter: 0
        };

        const newTrigger: IWorkflowTriggers = {
          workflowTriggerId: id,
          companyId,
          workflowId: 0,
          triggerType: 'data',
          configuration: { label: "" },
          actions: [firstAction]
        };

        setWorkflowTrigger(oldState => [...oldState, newTrigger])

      }
      else {
        setWorkflowTrigger(response.data.triggers)

        console.log(workflowTrigger);
      }



    } catch (err) {
      setIsLoading(false)
      console.log(err)
    }
  }, []);


  const handleChangeWorkflow = (newValue: any) => {
    setWorkflow(newValue);

    if (newValue) {
      selectWorkflow(newValue.value);

    }

    setTriggerDates({});
    setTriggerActionsMap({});

  };



  const fetchTriggerActions = async (triggerId: number): Promise<ITriggerAction[]> => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      const selectedDate = triggerDates[triggerId];

      let matterId;
      if (processTitle !== 'Associar Processo')
        matterId = matterSelected?.matterId ?? null;

      const response = await api.post(`/WorkflowExec/ListarAcoesSimulacao`, {
        workflowTriggerId: triggerId,
        value: selectedDate,
        triggerType: "data",
        matterId,
        token
      });

      console.log("Retorno API:", response.data);

      // Forçar o vínculo do workflowTriggerId em cada action
      const actionsWithTriggerId: ITriggerAction[] = response.data.map((action: ITriggerAction) => ({
        ...action,
        workflowTriggerId: triggerId,
        isConfirmSave: true
      }));

      return actionsWithTriggerId;

    } catch (err) {

      const status = err.response?.data?.statusCode;
      const message = err.response?.data?.Message || err.message || "Erro desconhecido";

      // eslint-disable-next-line no-alert
      if (status !== 500) {

        addToast({
          type: "error",
          title: "Falha ao Executar Workflow",
          description: message
        })
      }

      if (err.response.data.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }

      //return [];
      throw new Error("error");

    }
  };




  const handleSimularWorkflow = async () => {
    try {
      setTriggerActionsMap({});

      if (Object.keys(triggerDates).length == 0) {
        addToast({
          type: "info",
          title: "Campos Obrigatórios",
          description: "Selecione o workflow, e preencha todas as datas antes de continuar"
        })
        return;
      }



      for (const triggerIdStr of Object.keys(triggerDates)) {
        const triggerId = Number(triggerIdStr);
        const actions = await fetchTriggerActions(triggerId);

        //if (!actions || actions.length === 0) {
        if (actions === "error") {

          return;
        }

        setTriggerActionsMap((prev) => ({ ...prev, [triggerId]: actions }));
      }

    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const LoadSubject = useCallback(async () => {
    try {

      const response = await api.post(`/Assunto/Listar`, {
        description: '',
        token
      });

      const subjectList: ISelectValues[] = [];
      response.data.map(item => {
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
  }, [])




  const getSubjectLabel = (id?: number | string, maxLength: number = 15) => {
    if (!id) return "";
    const subject = optionsSubject.find(s => String(s.id) === String(id));

    if (!subject) return `ID ${id} não encontrado`;

    const label = subject.label;
    return label.length > maxLength
      ? label.substring(0, maxLength) + "..."
      : label;
  };


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

    } catch (err: any) {
      console.log(err.message);
    }
  }, []);


  const handleExecutarWorkflow = async () => {

    setisSaving(true)

    if (Object.keys(triggerActionsMap).length === 0) {

      addToast({
        type: "error",
        title: "Campos Obrigatórios",
        description: "É necessário simular Workflow"
      })

      setisSaving(false)
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    let invalido = false;

    Object.values(triggerActionsMap).forEach((actions) => {
      actions.forEach((action) => {
        if (!action.responsibleList || action.responsibleList.length === 0) {
          invalido = true;
        }
      });
    });

    if (invalido) {
      addToast({
        type: "error",
        title: "Campos Obrigatórios",
        description: "Existem ações sem usuário selecionado"
      })

      setisSaving(false);
      return;
    }


    const jsonTriggers = workflowTrigger
      .filter(trigger => trigger.triggerType === "data")
      .map(trigger => ({
        label: trigger.configuration?.label || "Trigger sem nome",
        value: triggerDates[trigger.workflowTriggerId] || "",
        workflowTriggerId: trigger.workflowTriggerId
      }));



    let matterId;
    if (processTitle !== 'Associar Processo') {

      const storedIdFromLocalStorage = localStorage.getItem('@Gojur:matterId') ?? '';

      if (storedIdFromLocalStorage.length == 0) {

        const storedMatterId = matterSelected?.matterId ?? null;

        if (storedMatterId !== null) {
          matterId = storedMatterId;
        } else {
          matterId = null;
        }
      }
      else
        matterId = storedIdFromLocalStorage;

    }



    let selectCustomerId;
    selectCustomerId = customer?.id ?? null;

    if (selectCustomerId == null) {

      const storedCustomerId = customerId;

      if (storedCustomerId !== null) {
        selectCustomerId = storedCustomerId;
      } else {
        selectCustomerId = null;
      }
    }

    //const allActions = Object.values(triggerActionsMap).flat();

    const followUpIdFromStorage = localStorage.getItem('@Gojur:followUpId');
    const publicationIdFromStorage = localStorage.getItem('@Gojur:publicationId');


    const allActions = Object.values(triggerActionsMap)
      .flat()
      .map(action => {
        const updatedAction = { ...action };

        if (matterId != null && matterId !== "null") {
          updatedAction.matter = {
            ...action.matter,
            matterId: Number(matterId),
          };
        }

        if (notificationTag != null && notificationTag !== "null") {
          updatedAction.matterEventId =
            (followUpIdFromStorage != null && followUpIdFromStorage !== "null")
              ? Number(followUpIdFromStorage)
              : null;

          updatedAction.publicationId =
            (publicationIdFromStorage != null && publicationIdFromStorage !== "null")
              ? Number(publicationIdFromStorage)
              : null;
        }

        return updatedAction;
      });




    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    const workflowActionsExec: IWorkflowActionsExecDTO[] = allActions.map((action, index) => {
      const execParams = {
        startDate: action.startDate,
        endDate: action.endDate,
        status: action.status,
        description: action.description,
        subjectId: action.subjectId,
        privateEvent: action.privateEvent,
        remindersList: action.remindersList,
        responsibleList: action.responsibleList,
        workflowTriggerId: action.workflowTriggerId
      };

      return {
        workflowactionsexecId: 0,
        companyId,
        workflowexecId: 0,
        actionType: "CRIARCOMPROMISSO",
        des_ExecParameters: JSON.stringify(execParams),
        //sequence: index + 1,
        //relatedactionId: action.relatedactionId ?? null,
        daysBeforeAndAfter: action.daysBeforeAndAfter,
        statusType: "PENDENTE"
      };
    });


    const payload = {
      workflowexecId: workflowExecId ? workflowExecId : 0,
      companyId,
      workflowId: workflow?.value ?? 0,
      matterId,
      customerId: selectCustomerId,
      publicationId: localStorage.getItem('@Gojur:publicationId') ?? null,
      followUpId: localStorage.getItem('@Gojur:followUpId') ?? null,
      des_ExecParameters: JSON.stringify(jsonTriggers),
      startDate: todayISO,
      endDate: null,
      statusType: "EMANDAMENTO",
      count: null,
      eventDTO: allActions,
      actionsExecDTO: workflowActionsExec,
      token,
      apiKey
    };

    console.log("Payload enviado:", payload);

    try {

      const response = await api.put(`/WorkflowExec/Salvar`, payload);

      const id = Number(response.data);
      setWorkflowExecId(id);

      setTriggerActionsMap({});
      await loadWorkflowExec(id);

      addToast({
        type: "success",
        title: "Workflow salvo",
        description: workflow.workflowId ? "As alterações feitas no ao executar o workflow foram salvas" : "Workflow adicionado"
      })

      setisSaving(false);


    } catch (err: any) {
      const status = err.response?.data?.statusCode;
      const message = err.response?.data?.Message || err.message || "Erro desconhecido";

      // eslint-disable-next-line no-alert
      if (status !== 500) {

        addToast({
          type: "error",
          title: "Falha ao Executar Workflow",
          description: message
        })
      }

    }

    setisSaving(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadWorkflowExec(pathname.substr(19));
      } catch (err) {
        console.error("Erro no useEffect:", err);
      }
    };

    fetchData();
  }, [pathname]);


  const loadWorkflowExec = useCallback(async (workflowExecIdParam: number) => {
    //let workflowExecId = pathname.substr(19);
    // alert(workflowExecIdParam);
    if (workflowExecIdParam == 0) {
      return
    }

    try {
      const response = await api.get('/WorkflowExec/SelecionarExec', {
        params: {
          id: Number(workflowExecIdParam),
          token,
        },
      });

      setWorkflowExecId(workflowExecIdParam);
      setWorkflowExec(response.data);
      setBlockUpdate(true);

      setNotificationTag(response.data.notificationTag);

      const execParams: { label: string; value: string; workflowTriggerId: number }[] =
        response.data.des_ExecParameters
          ? JSON.parse(response.data.des_ExecParameters)
          : [];

      const newTriggers: IWorkflowTriggers[] = execParams.map((param) => {
        const triggerId = param.workflowTriggerId;

        const firstAction: IWorkflowActions = {
          workflowactionId: Math.random(),
          companyId,
          workflowtriggerId: triggerId,
          actionType: "criarcompromisso",
          daysbeforeandafter: 0,
        };

        return {
          workflowTriggerId: triggerId,
          companyId,
          workflowId: response.data.workflowId,
          triggerType: "data",
          configuration: { label: param.label },
          actions: [firstAction],
        };
      });

      setWorkflowTrigger(newTriggers);


      const newTriggerDates: { [key: number]: string } = {};
      execParams.forEach((param) => {
        newTriggerDates[param.workflowTriggerId] = param.value;
      });
      setTriggerDates(newTriggerDates);


      const newTriggerActionsMap: { [key: number]: any[] } = {};

      (response.data.actionsExecDTO || []).forEach((action: any) => {
        let parsedParams: any = null;
        try {
          parsedParams = action.des_ExecParameters
            ? JSON.parse(action.des_ExecParameters)
            : null;
        } catch (e) {
          console.error("Erro ao parsear action.des_ExecParameters:", e, action.des_ExecParameters);
        }


        const triggerId = parsedParams?.workflowTriggerId;

        if (!triggerId) {
          console.warn("Action sem workflowTriggerId no des_ExecParameters:", action);
          return;
        }

        if (!newTriggerActionsMap[triggerId]) {
          newTriggerActionsMap[triggerId] = [];
        }

        newTriggerActionsMap[triggerId].push({
          //eventId: action.workflowactionsexecId,
          eventId: action.eventId,
          actionType: action.actionType,
          status: action.statusType,
          description: parsedParams?.description ?? "",
          subjectId: parsedParams?.subjectId ?? null,
          startDate: parsedParams?.startDate ?? null,
          endDate: parsedParams?.endDate ?? null,
          eventStartDate: action.eventStartDate ?? null,
          eventEndDate: action.eventEndDate ?? null,
          responsibleList: parsedParams?.responsibleList ?? [],
          remindersList: parsedParams?.remindersList ?? [],
        });
      });

      setTriggerActionsMap(newTriggerActionsMap);

      console.log("newTriggerActionsMap", newTriggerActionsMap);


    } catch (err) {
      console.error("Erro ao carregar WorkflowExec:", err);
    }
  }, [token, companyId, pathname]);




  useEffect(() => {
    if (localStorage.getItem('@Gojur:customer') && localStorage.getItem('@Gojur:customerId') && pathname.substr(19) == 0) {
      RefreshPersonList(localStorage.getItem('@Gojur:customer'));
    }
  }, []);


  useEffect(() => {
    if (customerList.length === 0) return;

    const storedCustomerId = localStorage.getItem('@Gojur:customerId');

    if (storedCustomerId) {
      const selected = customerList.find(
        (c) => String(c.id) === String(storedCustomerId)
      );


      setCustomer(selected ? { value: selected.id, label: selected.label } : null);


      if (selected) {
        setCustomerId(localStorage.getItem('@Gojur:customerId'));
        localStorage.removeItem('@Gojur:customerId');
        localStorage.removeItem('@Gojur:customer');
      }
    }
  }, [customerList]);




  useEffect(() => {

    const matterId = localStorage.getItem('@Gojur:matterId');

    if (matterId && matterId !== "null" && matterId.trim() !== "") {

      const loadProcess = async () => {
        try {

          const responseMatter = await api.post('/Processo/SelecionarProcesso', {
            matterId: localStorage.getItem('@Gojur:matterId'),
            token: userToken,
            companyId: localStorage.getItem('@GoJur:companyId'),
            apiKey: localStorage.getItem('@GoJur:apiKey')
          })
            .then(response => {
              const matterType = response.data.typeAdvisorId == null ? 'legal' : 'advisory'
              const url = `/matter/edit/${matterType}/${localStorage.getItem('@Gojur:matterId')}`
              setRedirectLink(url);
              setCompleteLink(true);


              const title = `${response.data.matterNumber} - ${response.data.matterFolder} - ${response.data.matterCustomerDesc} - ${response.data.matterOppossingDesc}`;
              setProcessTitle(title);
              console.log('Process title set:', title);

            })

        } catch (err) {
          console.error('Erro ao carregar processo:', err);
        }
      };

      loadProcess();
    }
    else {
      setRedirectLink('');
      setCompleteLink(false);
      setProcessTitle('Associar Processo');
    }

  }, []);



  useEffect(() => {
  
    if (workflowExec?.matterId) {
      const loadProcess = async () => {
        try {
          const responseMatter = await api.post('/Processo/SelecionarProcesso', {
            matterId: workflowExec.matterId,
            token: userToken,
            companyId: localStorage.getItem('@GoJur:companyId'),
            apiKey: localStorage.getItem('@GoJur:apiKey')
          })
            .then(response => {
              const matterType = response.data.typeAdvisorId == null ? 'legal' : 'advisory'
              const url = `/matter/edit/${matterType}/${workflowExec.matterId}`
              setRedirectLink(url);
              setCompleteLink(true);

              const title = `${response.data.matterNumber} - ${response.data.matterFolder} - ${response.data.matterCustomerDesc} - ${response.data.matterOppossingDesc}`;
              setProcessTitle(title);
              console.log('Process title set:', title);

              localStorage.removeItem('@Gojur:matterId');
            })

        } catch (err) {
          console.error('Erro ao carregar processo:', err);
        }
      };

      loadProcess();
    }
    else {
      setRedirectLink('');
      setCompleteLink(false);
      setProcessTitle('Associar Processo');
    }
  }, [workflowExec]);




  /*
  useEffect(() => {
    if (workflowExec && customerList.length > 0 && !customer) {
      RefreshPersonList(localStorage.getItem('@Gojur:customer'));
  
      const selected = customerList.find(
        (c) => String(c.id) === String(workflowExec.customerId)
      );
  
      setCustomer(
        selected
          ? { value: selected.id, label: selected.label }
          : null
      );
    }
  }, [workflowExec, customerList]);
  */


  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const runRefresh = async () => {
      if (refreshCount < 2 && workflowExec && customerList.length > 0 && !customer) {


        await RefreshPersonList(localStorage.getItem('@Gojur:customer'));


        const selected = customerList.find(
          (c) => String(c.id) === String(workflowExec.customerId)
        );

        if (selected && pathname.substr(19) != 0) {
          setRefreshCount((prev) => prev + 1);
          setCustomer({ value: selected.id, label: selected.label });
        }

        if (pathname.substr(19) == 0) {
          //alert('refreshCount11: ' + refreshCount) 
          setRefreshCount((prev) => prev + 1);

        }
      }
    };

    runRefresh();
  }, [workflowExec, customerList, customer, refreshCount]);



  useEffect(() => {
    if (workflowExec && workflowList.length > 0) {
      const selected = workflowList.find(
        (w) => String(w.value) === String(workflowExec.workflowId)
      );
      setWorkflow(selected || null);
    }
  }, [workflowExec, workflowList]);



  useEffect(() => {

    if (isConfirmMessage && caller == "workflowDelete") {
      handleDeleteWorkflow(workflowExecId, true)
      handleConfirmMessage(false)
    }

  }, [isConfirmMessage, caller])


  useEffect(() => {

    if (isCancelMessage && caller == "workflowDelete") {
      setConfirmDeleteModal(false)
      handleCancelMessage(false)
    }

  }, [isCancelMessage, caller])


  const handleDeleteWorkflow = useCallback(async (workflowExecId: number, confirmDelete: boolean) => {
    try {
      if (confirmDelete == false) {
        //setCurrentWorkflowExecId(workflowId)
        setConfirmDeleteModal(true)
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)


      await api.delete('/WorkflowExec/Deletar', {
        params: {
          filterClause: 'cod_WorkflowExec=' + workflowExecId,
          token
        }
      })

      addToast({
        type: "success",
        title: "Workflow Deletado",
        description: "O workflow selecionado foi deletado"
      })

      setIsDeleting(false)
      //history.push('/workflowexec/list')

      if (workflowView == "LISTA")
        history.push('/workflowexec/list')
      else if (workflowView == "KANBAN")
        history.push('/workflowexec/kanban')

      //setCurrentCustomerId(0)
      setConfirmDeleteModal(false)
    }
    catch (err: any) {
      setIsDeleting(false)
      setConfirmDeleteModal(false)
      addToast({
        type: "info",
        title: "Falha ao apagar cliente",
        description: err.response.data.Message
      })
    }
  }, [addToast, history, workflowView]);




  const handleClickEdit = (eventId: any) => {
    /*localStorage.setItem(
      '@GoJur:RecurrenceDate',
      FormatDate(new Date(item.event.start), 'yyyy-MM-dd'),
    );*/
    //handleModalActive(true);
    isOpenModal(eventId);


  };


  const handleClose = () => {
    //localStorage.removeItem('@Gojur:customer');
   selectProcess(null);

    if (matterFileId)
      localStorage.setItem('@Gojur:matterId', matterFileId)
    
    
    if (customerFileId)
    {
      localStorage.setItem('@Gojur:customerId', customerFileId)
    }
    

    if (customer) {
      localStorage.setItem('@Gojur:customer', customer.label)
    }

    if (workflowView == "LISTA")
      history.push('/workflowexec/list')
    else if (workflowView == "KANBAN")
      history.push('/workflowexec/kanban')

  };


  useEffect(() => {
    LoadDefaultProps();

  }, [workflowView]);

  const LoadDefaultProps = async () => {
    try {

      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const workflowViewDefault = response.data.find(item => item.id === 'defaultWorkflowParameter' || item.id === 'adm')

      // // default view workflow
      if (workflowViewDefault) {
        setWorkflowView(workflowViewDefault.value)
      } else {
        setWorkflowView('KANBAN')
      }


    } catch (err) {
      console.log(err);
    }
  }


  return (
    <Container onScroll={handleScroolSeeMore} ref={scrollRef}>



      <HeaderPage />

      <Content>
        <div>
          <header>
            <h1 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem", marginLeft: "1.5rem" }}>
              Executar Workflow
            </h1>
            <p style={{ fontSize: "0.675rem", color: "#64748b", marginLeft: "1.5rem" }}>
              Selecione o workflow, informe os parâmetros e visualize automaticamente as ações geradas.
            </p>
          </header>

          {/* FORM */}
          <Form>
            <Section>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

                <div>
                  <label>Escolha o Workflow</label>

                  <Select
                    isClearable
                    isSearchable
                    id="workflow"
                    options={workflowList}
                    placeholder="Selecione"
                    value={workflow}
                    onChange={handleChangeWorkflow}
                    onInputChange={(inputValue, { action }) => {
                      if (action === "input-change") {
                        ListWorkflow(inputValue);
                      }
                    }}
                    filterOption={(option, inputValue) =>
                      option.label.toLowerCase().includes(inputValue.toLowerCase())
                    }
                    classNamePrefix="rs"
                    isDisabled={blockUpdate}
                  />

                </div>


                <div>

                  <label>Processo</label>
                  <Process>


                    {processTitle === 'Associar Processo' && (
                      <button
                        type="button"
                        id="associar"
                        onClick={handleGridSelectProcess}
                        disabled={blockUpdate}
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
                    {processTitle === 'Associar Processo' && (
                      <button
                        type="button"
                        onClick={handleGridSelectProcess}
                        disabled={blockUpdate}
                      >
                        <RiFolder2Fill />
                      </button>
                    )}

                    {processTitle !== 'Associar Processo' && (
                      <button
                        type="button"
                        disabled={blockUpdate}
                        onClick={() => {
                          setProcessTitle('Associar Processo');
                          setAppointmentMatter(undefined);
                          setTriggerActionsMap({});
                        }}
                      >
                        {<RiEraserLine />}
                      </button>
                    )}
                  </Process>

                </div>

                <div>
                  <label>Cliente</label>

                  <Select
                    isClearable
                    isSearchable
                    classNamePrefix="rs"
                    inputId="select-input"
                    placeholder="Selecione"
                    options={customerList}
                    value={customer}
                    onChange={(e) => setCustomer(e)}
                    onInputChange={(inputValue) => {
                      RefreshPersonList(inputValue);
                    }}
                    filterOption={(option, inputValue) =>
                      option.label.toLowerCase().includes(inputValue.toLowerCase())
                    }
                    isDisabled={blockUpdate}
                  />

                </div>


                {notificationTag && (
                  <div>
                    <label>Notificação</label>
                    <Input
                      type="text"
                      autoComplete="off"
                      name="nome"
                      required
                      maxLength={100}
                      disabled
                      value={notificationTag}
                    />
                  </div>
                )}


                {workflowTrigger.map((trigger) => (
                  trigger.triggerType === "data" && (
                    <div key={trigger.workflowTriggerId}>
                      <label>{trigger.configuration?.label}</label>
                      {/*
                      <Input
                        type="date"
                        value={triggerDates[trigger.workflowTriggerId] || ""}
                        onChange={(e) =>
                          setTriggerDates((prev) => ({
                            ...prev,
                            [trigger.workflowTriggerId]: e.target.value,
                          }))
                        }
                        disabled={blockUpdate}
                      />
                        */}

                      <Input
                        type="date"
                        value={triggerDates[trigger.workflowTriggerId] || ""}
                        onChange={(e) => {

                          setTriggerDates((prev) => ({
                            ...prev,
                            [trigger.workflowTriggerId]: e.target.value,
                          }));

                          setTriggerActionsMap({});
                        }}
                        disabled={blockUpdate}
                      />



                    </div>
                  )
                ))}

              </div>

              <div style={{ marginTop: "1rem", marginBottom: "3rem" }}>

                <button type="button" className='buttonClick' onClick={handleSimularWorkflow} disabled={blockUpdate}>
                  <FiSearch />
                  Simular Workflow
                </button>

              </div>
            </Section>


            <Section>
              <h2 style={{ fontSize: "0.875rem", fontWeight: 500, paddingBottom: "1rem" }}>
                Ações Geradas
              </h2>

              {workflowTrigger.map((trigger) => {
                const actions = triggerActionsMap[trigger.workflowTriggerId] ?? [];


                if (actions.length === 0) return null;

                return (
                  <div key={trigger.workflowTriggerId} style={{ marginBottom: "2rem" }}>

                    <Timeline>

                      <Step style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                        <span style={{ fontSize: "0.675rem", marginBottom: "0.25rem", fontWeight: 500 }}>
                          {trigger.configuration?.label
                            ? trigger.configuration.label.length > 15
                              ? trigger.configuration.label.substring(0, 15) + "..."
                              : trigger.configuration.label
                            : "Trigger sem nome"}

                        </span>

                        {triggerDates[trigger.workflowTriggerId] && (
                          <span style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "0.25rem" }}>
                            {(() => {
                              const [year, month, day] = triggerDates[trigger.workflowTriggerId].split("-").map(Number);
                              const date = new Date(year, month - 1, day); // JS: mês é 0-based
                              return `${date.getDate().toString().padStart(2, "0")}/${date
                                .toLocaleDateString("pt-BR", { month: "short" })
                                .toUpperCase()
                                .replace(".", "")}`;
                            })()}
                          </span>
                        )}
                        <Circle
                          style={{
                            border: "2px solid",
                            borderColor: "#22c55e",
                            background: "#d1fae5",
                            color: "#065f46",
                          }}
                        >1</Circle>
                      </Step>

                      {actions.length > 0 && (
                        <div
                          style={{
                            height: "2px",
                            width: "100px",
                            background: "#cbd5e1",
                            alignSelf: "center",
                            marginTop: "50px",
                          }}
                        />
                      )}


                      {actions.map((action, index) => (
                        <React.Fragment key={action.eventId}>
                          <Step style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>

                            <span style={{ fontSize: "0.675rem", marginBottom: "0.25rem", fontWeight: 500 }}>
                              {getSubjectLabel(action.subjectId)}
                            </span>

                            <span style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "0.25rem" }}>
                              {action.startDate ? (
                                <span
                                  style={{
                                    textDecoration:
                                      action.eventStartDate && action.eventStartDate !== action.startDate
                                        ? "line-through"
                                        : "none",
                                  }}
                                >
                                  {new Date(action.startDate).getDate().toString().padStart(2, "0")}/
                                  {new Date(action.startDate)
                                    .toLocaleDateString("pt-BR", { month: "short" })
                                    .toUpperCase()
                                    .replace(".", "")}
                                </span>
                              ) : (
                                <span style={{ color: "red" }}>Deletada</span>
                              )}

                              {/* Mostra o eventStartDate se for diferente do startDate */}
                              {action.eventStartDate && action.eventStartDate !== action.startDate && (
                                <>
                                  &nbsp;-&nbsp;
                                  {new Date(action.eventStartDate).getDate().toString().padStart(2, "0")}/
                                  {new Date(action.eventStartDate)
                                    .toLocaleDateString("pt-BR", { month: "short" })
                                    .toUpperCase()
                                    .replace(".", "")}
                                </>
                              )}
                            </span>


                            <Circle
                              style={{
                                border: "2px solid",
                                borderColor:
                                  action.status === "CONCLUIDO"
                                    ? "#22c55e"
                                    : action.status === "EXCLUIDO"
                                      ? "#f87171"
                                      : "#9ca3af",

                                background:
                                  action.status === "CONCLUIDO"
                                    ? "#d1fae5"
                                    : action.status === "EXCLUIDO"
                                      ? "#fee2e2"
                                      : "#fff",

                                color:
                                  action.status === "CONCLUIDO"
                                    ? "#065f46"
                                    : action.status === "EXCLUIDO"
                                      ? "#7f1d1d"
                                      : "#374151",
                              }}
                            >
                              {index + 2}
                            </Circle>

                          </Step>

                          {index < actions.length - 1 && (
                            <div
                              style={{
                                height: "2px",
                                width: "100px",
                                background: "#cbd5e1",
                                alignSelf: "center",
                                marginTop: "50px",
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </Timeline>

                    <div style={{ display: "flex", flexDirection: "column", paddingTop: "1rem" }}>
                      {actions.map((action) => (
                        <Card key={action.eventId} style={{ marginBottom: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <h3 style={{ fontSize: "0.675rem", fontWeight: 500 }}>{getSubjectLabel(action.subjectId, 50)}</h3>
                              <p style={{ fontSize: "0.55rem", color: "#64748b" }}>
                                {action.description}
                              </p>
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>


                              <label>Responsável</label>

                              <Select
                                isMulti
                                name={`responsavel-${action.eventId}`}
                                placeholder="Selecione usuários"
                                options={userList.map((user) => ({
                                  value: user.id,
                                  label: user.value,
                                }))}
                                value={action.responsibleList?.map((resp) => {
                                  const user = userList.find(
                                    (u) => String(u.id) === String(resp.userCompanyId)
                                  );
                                  return user ? { value: user.id, label: user.value } : null;
                                }).filter(Boolean)}
                                onChange={(selectedOptions) => {

                                  const newResponsibleList = selectedOptions?.map((option) => ({
                                    userCompanyId: option.value, userType: "R"
                                  })) ?? [];

                                  // atualiza a lista dentro da action
                                  action.responsibleList = newResponsibleList;

                                  setTriggerActionsMap((prev) => ({ ...prev }));

                                }}
                                isDisabled={blockUpdate}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    width: "350px",
                                    minWidth: "160px",
                                  }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  option: (base) => ({
                                    ...base,
                                    fontSize: "0.7rem",
                                  }),
                                  multiValueLabel: (base) => ({
                                    ...base,
                                    fontSize: "0.7rem",
                                  }),
                                }}
                                menuPortalTarget={document.body}
                              />


                              <span
                                style={{
                                  width: "100px",
                                  textAlign: "center",
                                  fontSize: "0.75rem",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "0px",
                                  ...(action.status === "CONCLUIDO" && {
                                    background: "#d1fae5", // verde claro
                                    color: "#065f46",
                                  }),
                                  ...(action.status === "EXCLUIDO" && {
                                    background: "#fee2e2", // vermelho claro
                                    color: "#991b1b",
                                  }),
                                }}
                              >
                                {action.status
                                  ? action.status.charAt(0).toUpperCase() + action.status.slice(1).toLowerCase()
                                  : "Pendente"}
                              </span>



                              {action.eventId > 0 ? (
                                <p onClick={() => handleClickEdit(action.eventId)} style={{ cursor: "pointer" }}>
                                  <RiCalendarCheckFill />
                                  <span>Evento</span>
                                </p>
                              ) : (
                                <p style={{ cursor: "not-allowed", opacity: 0.5 }}>
                                  <RiCalendarCheckFill />
                                  <span>Evento</span>
                                </p>
                              )}


                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Section>




            <footer style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>

              {blockUpdate === false && (
                <button type="button" className='buttonClick' onClick={handleExecutarWorkflow}>
                  <FiSave />
                  Executar Workflow
                </button>
              )}


              <button type="button" className='buttonClick' onClick={() => handleDeleteWorkflow(workflowExecId, false)}>
                <FiTrash />
                Excluir
              </button>


              <button className="buttonClick" type="button" onClick={() => handleClose()}>
                <MdBlock />
                Fechar
              </button>

              {/*<Button variant="outline">Status: Em andamento</Button>*/}
            </footer>

          </Form>

        </div>


        {openSelectProcess === 'Open' ? <GridSelectProcess /> : null}



      </Content>

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Salvando...
          </div>
        </>
      )}


      {confirmDeleteModal && (
        <ConfirmBoxModal
          title="Excluir Registro"
          useCheckBoxConfirm
          caller="workflowDelete"
          message="Confirma a exclusão deste workflow ? Todos os compromissos associados serão excluidos"
        />
      )}

    </Container>
  );
}