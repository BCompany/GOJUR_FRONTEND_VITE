/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
import React, { ChangeEvent, useCallback, useEffect, useRef, useState, UIEvent } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { FiDelete, FiLock, FiPlus, FiSave, FiTrash, FiX } from 'react-icons/fi';
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import { RiCloseLine, RiNewspaperFill } from 'react-icons/ri';
import { MdBlock } from 'react-icons/md';
import { formatField, selectStyles, useDelay, currencyConfig } from 'Shared/utils/commonFunctions';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { Clear, Tab, Tabs } from 'Shared/styles/Tabs';
import api from 'services/api';
import { useMatter } from 'context/matter';
import Select from 'react-select'
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useModal } from 'context/modal';
import { useDocument } from 'context/document';
import DocumentModal from 'components/Modals/CustomerModal/DocumentModal';
import { useCustomer } from 'context/customer';
import { Card, Container, Content, Form, ListCards, CardMatter, MatterListCards } from './styles';
import { IWorkflowTriggers, IWorkflowActions, IWorkflowData, ISelectValues } from '../Interfaces/IWorkflowEdit';
import { workflowTriggerTypes } from 'Shared/utils/commonListValues';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { trigger } from 'swr';
import { FcAbout } from 'react-icons/fc';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { AppointmentPropsSave, AppointmentPropsDelete, SelectValues, Data, dataProps, LembretesData, MatterData, ModalProps, ResponsibleDTO, Settings, ShareListDTO, userListData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import { dayRecurrence, optionsLembrete, weekRecurrence } from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment/ListValues/List'
import TimePicker from 'components/TimePicker';

export default function Workflow() {

  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { handleUserPermission, permission } = useDefaultSettings();
  const { permissionsSecurity, handleValidateSecurity } = useSecurity();
  const { addToast } = useToast();
  const { pathname } = useLocation();
  const { handleSubmit } = useForm<IWorkflowData>();
  const { handleReloadBusinesCard, reloadBusinessCard } = useCustomer();
  const [showSalesFunnelMenu, setShowSalesFunnelMenu] = useState<boolean>(true)
  const [configureEvent, setConfigureEvent] = useState<boolean>(false)
  const [saveTrigger, setSaveTrigger] = useState<boolean>(false)
  const [whenChange, setWhenChange] = useState('');


  const { showSalesChannelModal } = useModal();
  const [isLoading, setIsLoading] = useState(true); // objecto todo de do cliente
  const [isPagination, setIsPagination] = useState(false); // objecto todo de do cliente
  const [workflow, setWorkflow] = useState({} as IWorkflowData); // objecto todo de do cliente
  const [workflowTrigger, setWorkflowTrigger] = useState<IWorkflowTriggers[]>([]); // objeto de endereço que compoe o cliente
  const [workflowAction, setWorkflowAction] = useState<IWorkflowActions[]>([]); // objeto de endereço que compoe o cliente
  const [customerLegalPerson, setCustomerLegalPerson] = useState<ICustomerLegalPerson[]>([]); // objeto de representante que compoe o cliente
  const [customerCitysDefault, setCustomerCitysDefault] = useState<ISelectData[]>([]); // count field for address block
  const [customerCitys, setCustomerCitys] = useState<ISelectData[]>([]); // count field for address block
  const [customerCitysLP, setCustomerCitysLP] = useState<ISelectData[]>([]); // count field for address block
  const [customerGroup, setCustomerGroup] = useState<ISelectData[]>([]); // count field for address block
  const [salesChannelList, setSalesChannelList] = useState<ISelectData[]>([]); // count field for address block
  const [workflowName, setWorkflowName] = useState(''); // field nome
  const [nameTrigger, setNameTrigger] = useState(''); // field nome
  const [customerFantasia, setCustomerFantasia] = useState(''); // field nome fantasia
  const [customerEmail, setCustomerEmail] = useState(''); // field e-mail
  const [customerSenha, setCustomerSenha] = useState(''); // field senha
  const [customerRef, setCustomerRef] = useState(''); // field Referencia
  const [customerWhatsapp, setCustomerWhatsapp] = useState(''); // field whatsapp
  const [customerGroupValue, setCustomerGroupValue] = useState(''); // group field value
  const [workflowId, setWorkflowId] = useState<number>(0);
  const [workflowtriggerId, setWorkflowTriggerId] = useState<number>(0);
  const [customerSalesChannelId, setCustomerSalesChannelId] = useState(''); // group field id
  const [customerType, setCustomerType] = useState('F'); //  field type
  const [customerRepresent, setCustomerRepresent] = useState(''); //  field Representado
  const [customerNumDoc, setCustomerNumDoc] = useState(''); //  field num doc
  const [customerSex, setCustomerSex] = useState('F'); //  field Sexo
  const [customerNacionalidade, setCustomerNacionalidade] = useState(''); //  field nacionalidade
  const [customerNasc, setCustomerNasc] = useState(''); //  field Nascimento
  const [customerAbertura, setCustomerAbertura] = useState(''); //  field Abertura
  const [customerRg, setCustomerRg] = useState(''); //  field Rg
  const [customerPis, setCustomerPis] = useState(''); //  field Pis
  const [customerECivil, setCustomerECivil] = useState('I'); //  field estado civil
  const [customerMae, setCustomerMae] = useState(''); //  field mae
  const [customerProf, setCustomerProf] = useState(''); //  field profissao
  const [customerPai, setCustomerPai] = useState(''); //  field pai
  const [customerInss, setCustomerInss] = useState(''); //  field Inss
  const [customerCtps, setCustomerCtps] = useState(''); //  field Ctps
  const [customerSCtps, setCustomerSCtps] = useState(''); //  field Serie Ctps
  const [customerSalary, setCustomerSalary] = useState<number>(); //  field Salário
  const [customerIE, setCustomerIE] = useState(''); //  field numero insc estadual
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [salesChannelSearchTerm, setSalesChannelSearchTerm] = useState('');
  const [customerObs, setCustomerObs] = useState(''); //  field observação
  const [customerStatus, setCustomerStatus] = useState('A'); //  field customerStatus
  const [customerEmailFinanAdd, setCustomerEmailFinanAdd] = useState<string>(''); //  field email de faturamento add
  const [customerCityValue, setCustomerCityValue] = useState(''); //  field city
  const [isSaving, setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isDeleting, setIsDeleting] = useState<boolean>(); // set trigger for show loader
  const [isFetchTriggerActions, setIsFetchTriggerActions] = useState<boolean>(false); // set trigger for show loader

  const [customerActivePassword, setCustomerActivePassword] = useState(false); //  field email de faturamento
  const [customerActiveModalDoubleCheck, setCustomerActiveModalDoubleCheck] = useState(false); //  modal double check
  const [matterList, setMatterList] = useState<IMatterData[]>([]);
  const [businessList, setBusinessList] = useState<IBusinessData[]>([]);
  const { isOpenCardBox, matterReferenceId } = useMatter();
  const [hasMatter, setHasMatter] = useState<boolean>(false);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isInitialize, setIsInitialize] = useState<boolean>(true);
  const [searchTermBusinnes, setSearchTermBusiness] = useState<string>('');
  const [isLoadingSearchTerm, setIsLoadingSearchTerm] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [customerStartDate, setCustomerStartDate] = useState<string>('')
  const [currentCustomerId, setCurrentCustomerId] = useState<number>(0);
  const [permissionCRM, setPermissionCRM] = useState<boolean>(false)
  const [businessTotal, setBusinessTotal] = useState<number>(0)
  const [tabsControl, setTabsControl] = useState<ITabsControl>({ tab1: true, tab2: false, tab3: false, tab4: false, activeTab: 'customer' });
  const [changeCEPCustomer, setChangeCEPCustomer] = useState<boolean>(false)
  const [changeCEPLP, setChangeCEPLP] = useState<boolean>(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const { handleLoadInitialPropsFromDocument } = useDocument();
  const { handleOpenCustomerDocumentModal, handleOpenReportModal, handleCloseReportModal, isReportModalOpen } = useCustomer();
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');
  const checkpermissionDocument = permissionsSecurity.find(item => item.name === "CFGDCMEM");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const { isConfirmMessage, isCancelMessage, caller, handleCancelMessage, handleConfirmMessage, handleCheckConfirm, handleCaller } = useConfirmBox();
  const [currentWorkflowId, setCurrentWorkflowId] = useState<number>(0);
  const [isDeletingTrigger, setIsDeletingTrigger] = useState(false);
  const [currentWorkflowActionId, setCurrentWorkflowActionId] = useState<number>(0);
  const [currentWorkflowTriggerId, setCurrentWorkflowTriggerId] = useState<number>(0);
  const [painelAberto, setPainelAberto] = useState<string | null>(null);
  const [appointmentSubject, setAppointmentSubject] = useState<string>(''); // Assuntos do Compromisso
  const [optionsSubject, setOptionsSubject] = useState<ISelectValues[]>([]); // Lista de Assuntos
  const [appointmentSubjectId, setAppointmentSubjectId] = useState<string>(''); // Assuntos do Compromisso
  const [appointmentNotifyMatterCustomer, setAppointmentNotifyMatterCustomer,] = useState<string>('N'); // Controla o Input de notificação de cliente
  const [appointmentRemindersList, setAppointmentRemindersList] = useState<LembretesData[]>([]); // Lista de Lembretes
  const [openReminderModal, setOpenReminderModal] = useState<boolean>(false)
  const [appointmentBlockUpdate, setAppointmentBlockUpdate] = useState(true);
  const [appointmentHourBeggin, setAppointmentHourBeggin] = useState<string>('',); // Hora de Inicio do compromisso
  const [appointmentHourEnd, setAppointmentHourEnd] = useState<string>(''); // Hora de termino do compromisso


  // Initialization
  useEffect(() => {
    //handleValidateSecurity(SecurityModule.configuration)
    LoadWorkflow()
    LoadSubject();
    setAppointmentBlockUpdate(false)

  }, [])

  // Insert new sales chanel and update combo

  const LoadWorkflow = useCallback(async () => {
    let workflowId;
    workflowId = pathname.substr(15);

    //setWorkflowId(pathname.substr(15))


    let hasFilterSaved = false;
    const filterStorage = localStorage.getItem('@GoJur:CustomerFilter')

    // verify if exists filter saved
    if (Number.isNaN(Number(workflowId))) {
      if (filterStorage == null) {
        return false;
      }
      // if exists filter exists associate to specific variables and rebuild page
      const filterJSON = JSON.parse(filterStorage)
      workflowId = filterJSON.workflowId;
      hasFilterSaved = true;
    }


    // when is id
    if (Number(workflowId) === 0) {
      handleNewTrigger();
      return;
    }


    try {

      const response = await api.get<IWorkflowData[]>('/Workflow/Selecionar', {
        params: {
          id: Number(workflowId),
          token
        }
      })

      setWorkflow(response.data)

      setWorkflowName(response.data.name);


      if (response.data.triggers.length < 1) {
        const id = Math.random()

        const firstAction: IWorkflowActions = {
          workflowActionId: Math.random(),
          companyId,
          workflowTriggerId: id,
          actionType: 'criarcompromisso',
          daysbeforeandafter: 1
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
      }


      setIsLoading(false)
      setIsInitialize(false)


    } catch (err) {
      setIsLoading(false)
      history.push('/workflow/list')
      console.log(err)
    }
  }, [workflowId]);



  async function handleSalvarWorkflow() {

    const isValid = workflowTrigger.every(t => {
      if (t.triggerType === "data") {
        return Boolean(t.configuration?.label?.trim());
      }
      return 0; // outros tipos não precisam de label
    });

    if (!isValid) {
      addToast({
        type: "error",
        title: "Erro de validação",
        description: "Gatilhos do tipo 'data' precisam ter um label preenchido."
      });
      return 0;
    }

    const triggerList = workflowTrigger.map(i => ({
      ...i,
      cod_Endereco: 0
    }));

    try {
      const response = await api.put('/Workflow/Salvar', {
        token,
        apiKey,
        workflowId: workflow.workflowId ? workflow.workflowId : 0, // cod Workflow
        name: workflowName, // nome do Workflow
        companyId, // Cod Empresa   
        triggers: triggerList // Listagem de gatilhos
      })


      const id = Number(response.data);
      setWorkflowId(id);

      await reloadWorkflow(id);

      addToast({
        type: "success",
        title: "Workflow salvo",
        description: workflow.workflowId ? "As alterações feitas no workflow foram salvas" : "Workflow adicionado"
      })

      return id;

    } catch (err: any) {
      const status = err.response?.data?.statusCode;  // protegemos com ?.
      const message = err.response?.data?.Message || err.message || "Erro desconhecido";

      // eslint-disable-next-line no-alert
      if (status !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar workflow",
          description: message
        })
      }

      if (status === 1011) {
        setCustomerActiveModalDoubleCheck(true)
      }

      setisSaving(false)
      localStorage.removeItem('@GoJur:businessCustomerId')

      return 0;
    }

  }


  const handleSubmitWorkflow = useCallback(async () => {
    // Valida apenas gatilhos do tipo "data"
    const isValid = workflowTrigger.every(t => {
      if (t.triggerType === "data") {
        return Boolean(t.configuration?.label?.trim());
      }
      return true; // outros tipos não precisam de label
    });

    if (!isValid) {
      addToast({
        type: "error",
        title: "Erro de validação",
        description: "Gatilhos do tipo 'data' precisam ter um label preenchido."
      });
      return;
    }

    const triggerList = workflowTrigger.map(i => ({
      ...i,
      cod_Endereco: 0
    }));

    try {
      const response = await api.put('/Workflow/Salvar', {
        token,
        apiKey,
        workflowId: workflow.workflowId ? workflow.workflowId : 0, // cod Workflow
        name: workflowName, // nome do Workflow
        companyId, // Cod Empresa   
        triggers: triggerList // Listagem de gatilhos
      })


      const id = Number(response.data);
      setWorkflowId(id);


      const trigger = workflowTrigger.find(t => t.workflowTriggerId === painelAberto);

      if (Array.isArray(trigger?.actions) && configureEvent == true) {
    
        
          for (const action of trigger.actions) {
            const sucesso: boolean = await handleSalvarCompromissoWorkflow(
              action.workflowtriggerId,
              action.workflowactionId
            );

            if(sucesso == false)
                return;

          }
     
        await reloadWorkflow(id);
    
        fetchTriggerActions(trigger.workflowTriggerId);
     
      }
      else
        reloadWorkflow(id)
      //handleSalvarCompromisso()


      addToast({
        type: "success",
        title: "Workflow salvo",
        description: workflow.workflowId ? "As alterações feitas no workflow foram salvas" : "Workflow adicionado"
      })

      return true;

    } catch (err: any) {
      const status = err.response?.data?.statusCode;  // protegemos com ?.
      const message = err.response?.data?.Message || err.message || "Erro desconhecido";

      // eslint-disable-next-line no-alert
      if (status !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar workflow",
          description: message
        })
      }

      if (status === 1011) {
        setCustomerActiveModalDoubleCheck(true)
      }

      setisSaving(false)
      localStorage.removeItem('@GoJur:businessCustomerId')
    }

  }, [workflowTrigger, workflow.name, workflow.tpo_Telefone01, workflow.num_Telefone01, workflow.tpo_Telefone02, workflow.num_Telefone02, workflow.cod_PessoaFisica, workflow.cod_Cliente, workflow.cod_PessoaJuridica, workflow.cod_SistemaUsuarioEmpresa, workflow.doubleCheck, workflow.cod_Empresa, workflowName, workflowId, addToast, history]);



  /*
  useEffect(() => {
   
    if (!workflowId) return;
  
    if( configureEvent == true )
    {
      reloadWorkflow(workflowId);
    }
  
  }, [workflowId]);
  
   
  const workflowTriggerRef = useRef(workflowTrigger);
  
  useEffect(() => {
  
    workflowTriggerRef.current = workflowTrigger; 
   
  }, [workflowTrigger]);
  
  */

  useEffect(() => {

    if (!workflowTrigger || workflowTrigger.length === 0) return;

    const wantedLabel = nameTrigger;

    const triggerFound = workflowTrigger.find(
      (trigger) => trigger.configuration?.label?.trim() === wantedLabel
    );

    if (!triggerFound) { return };

    const triggerId = triggerFound.workflowTriggerId;

    //alert(triggerId);
    if (configureEvent == true)
      setPainelAberto(triggerId)



    if (painelAberto !== triggerId && configureEvent == true) {
      //setTimeout(() => setPainelAberto(triggerId), 100);
      fetchTriggerActions(triggerId);
      //handleNewAction(triggerId);

    }

  }, [workflowTrigger, painelAberto]);



  const reloadWorkflow = useCallback(async (workflowIdParam: Number) => {
    let workflowId = workflowIdParam;
    let hasFilterSaved = false;

    const filterStorage = localStorage.getItem('@GoJur:CustomerFilter');

    // verify if exists filter saved
    if (Number.isNaN(Number(workflowId))) {
      if (filterStorage == null) {
        return false;
      }

      // if exists filter exists associate to specific variables and rebuild page
      const filterJSON = JSON.parse(filterStorage);
      workflowId = filterJSON.workflowId;
      hasFilterSaved = true;
    }

    // when is id
    if (Number(workflowId) === 0) {
      handleNewTrigger();
      return;
    }

    try {
      const response = await api.get<IWorkflowData>('/Workflow/Selecionar', {
        params: {
          id: Number(workflowId),
          token,
        },
      });

      setWorkflow(response.data);
      setWorkflowName(response.data.name);

      if (response.data.triggers.length < 1) {
        const id = Math.random();

        const firstAction: IWorkflowActions = {
          workflowActionId: Math.random(),
          companyId,
          workflowTriggerId: id,
          actionType: 'criarcompromisso',
          daysbeforeandafter: 1,
          configuration: {
            when: "depois", // 👈 já vem preenchido com "depois"
            privacy: "N"
          }
        };

        const newTrigger: IWorkflowTriggers = {
          workflowTriggerId: id,
          companyId,
          workflowId: 0,
          triggerType: 'data',
          configuration: { label: '' },
          actions: [firstAction],
        };

        setWorkflowTrigger((oldState) => [...oldState, newTrigger]);
      } else {
        setWorkflowTrigger(response.data.triggers);

        console.log(response.data.triggers.configuration);
      }


      //setIsLoading(false);
      //setIsInitialize(false);
    } catch (err) {
      setIsLoading(false);
      history.push('/workflow/list');
      console.log(err);
    }
  }, []);




  const handleNewTrigger = useCallback(() => {
    const id = Math.random();

    const newTrigger: IWorkflowTriggers = {
      workflowTriggerId: id,
      companyId,
      workflowId: 0,
      triggerType: 'data',
      configuration: { label: "" },
      actions: []
      //actions: [firstAction] // 👈 já começa com uma ação
    };

    setWorkflowTrigger(oldTrigger => [...oldTrigger, newTrigger]);

    setConfigureEvent(false);

  }, [companyId]);




  const handleNewAction = useCallback((triggerId: string) => {
    const id = Math.random();
    const newAction: IWorkflowActions = {
      workflowactionId: id,
      companyId,
      workflowTriggerId: triggerId,
      actionType: 'criarcompromisso',
      daysbeforeandafter: 1,
      configuration: {
        when: "depois",
        privacy: "N"
      }
    };


    setWorkflowTrigger((oldTriggers) =>
      oldTriggers.map((trigger) =>
        trigger.workflowTriggerId === triggerId
          ? { ...trigger, actions: [...(trigger.actions ?? []), newAction] }
          : trigger
      )
    );

  }, [companyId]);


  const handleDeleteTrigger = useCallback((triggerId) => {
    const address = workflowTrigger.filter(item => item.workflowTriggerId !== triggerId);
    
    if (address.length >= 1) {
      setWorkflowTrigger(address)
    } else {
      addToast({
        type: "info",
        title: "Operação invalida",
        description: "Só é possivel excluir quando há mais de um gatilho cadastrado"
      })
    }
  }, [addToast, workflowTrigger]); // remove um endereço da interface


  const handleChangeTriggerType = useCallback((value, triggerId) => {

    const newTypePhone = workflowTrigger.map(trigger => trigger.workflowTriggerId === triggerId ? {
      ...trigger,
      triggerType: value,
      configuration: {
        ...trigger.configuration,
        label: ""
      }
    } : trigger)

    setWorkflowTrigger(newTypePhone)

  }, [workflowTrigger]); // atualiza o tipo de telefone 1



  const handleChangeTrigger = useCallback((value: string, triggerId: number) => {

    const newPhone = workflowTrigger.map(trigger =>
      trigger.workflowTriggerId === triggerId
        ? {
          ...trigger,
          configuration: {
            ...trigger.configuration,
            label: trigger.triggerType === "acaoconcluida" ? "" : value
          }
        }
        : trigger
    );


    setWorkflowTrigger(newPhone);

    setConfigureEvent(false);

    setNameTrigger(value);


  }, [workflowTrigger]);




  // pagination for load more customer
  const handleScroolSeeMore = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    const isEndScrool = ((element.scrollHeight - element.scrollTop) - 50) <= element.clientHeight

    if (isEndScrool && !isLoading) {
      setIsPagination(true)
    }
  }


  useEffect(() => {

    if (isConfirmMessage && caller == "WorkflowList") {

      if (!isDeleting) {
        window.open(`${envProvider.redirectUrl}ReactRequest/Redirect?token=${token}&route=workflow/list`)
      }
      else {
        handleDeleteWorkflowGatilho(currentWorkflowId)
      }

      setIsDeleting(false)
      handleConfirmMessage(false)
      handleCaller('')
      handleCheckConfirm(false)
    }

  }, [isConfirmMessage])


  const handleDeleteWorkflowGatilho = async (workflowtriggerId: number) => {
    try {
      setIsDeletingTrigger(true)

      await api.delete('/Workflow/DeletarGatilho', {
        params: {
          id: workflowtriggerId,
          token
        }
      })

      handleDeleteTrigger(workflowtriggerId)

      addToast({
        type: 'success',
        title: 'Gatilho Deletado',
        description: 'O gatilho selecionado foi deletado',
      });

      setIsDeleting(false)
      setIsDeletingTrigger(false)
      setCurrentWorkflowId(0)

    } catch (err) {
      addToast({
        type: 'info',
        title: 'Falha ao apagar Gatilho',
        description: err.response.data.Message
      });

      handleDeleteTrigger(workflowtriggerId)

      setIsDeletingTrigger(false)
      setIsDeleting(false)
      setCurrentWorkflowId(0)
    }
  }



  const handleDeleteWorkflowAcao = async (workflowtriggerId: number, workflowactionId: number) => {
    try {
      setIsDeletingTrigger(true)

      await api.delete('/Workflow/DeletarAcao', {
        params: {
          id: workflowactionId,
          token
        }
      })

      handleDeleteAction(workflowtriggerId, workflowactionId)

      addToast({
        type: 'success',
        title: 'Ação Deletada',
        description: 'A ação selecionada foi deletada',
      });

      setIsDeleting(false)
      setIsDeletingTrigger(false)
      //setCurrentWorkflowId(0)

      await reloadWorkflow(workflowId);


      setPainelAberto(workflowtriggerId);
      fetchTriggerActions(workflowtriggerId);
      handleNewAction(workflowtriggerId);


    } catch (err) {
      addToast({
        type: 'info',
        title: 'Falha ao apagar Ação',
        description: err.response.data.Message
      });

      handleDeleteAction(workflowtriggerId, workflowactionId)

      setIsDeletingTrigger(false)
      setIsDeleting(false)
      //setCurrentWorkflowId(0)
    }
  }



  useEffect(() => {
    if (isCancelMessage) {
      setIsDeleting(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])


  const handleCheckBoxDeleteTrigger = (workflowId: number) => {
    setIsDeleting(true)
    setCurrentWorkflowId(workflowId);
  }


  const handleCheckBoxDeleteAction = (workflowactionId: number) => {
    setIsDeleting(true)
    setCurrentWorkflowActionId(workflowactionId);
  }


  const abrirPainel = (id: number) => {
    setPainelAberto(prev => (prev === id ? null : id));

  };



  const LoadSubject = useCallback(async (reload = false, termSearch = '') => {
    try {
      if (termSearch === '') {
        termSearch = appointmentSubject;
      }

      if (reload) {
        termSearch = '';
      }

      const response = await api.post(`/Assunto/Listar`, {
        description: termSearch,
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
  }, [appointmentSubject])



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



  const CustomerNotification = useCallback(async key => {
    try {
      const response = await api.post<IParameterData[]>('/Parametro/Selecionar', { token: userToken, allowNull: true, parametersName: '#WPNOTIFICATION' })

      if (response.data.length > 0) {
        if (response.data[0].parameterValue == 'EM') {
          const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].emailNotification = 'S'
        }
        if (response.data[0].parameterValue == 'WA') {
          const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].whatsAppNotification = 'S'
        }
        if (response.data[0].parameterValue == 'AM') {
          const newList = Array.from(appointmentRemindersList);
          const chave = newList.findIndex(i => i.qtdReminder === key);
          newList[chave].emailNotification = 'S'
          newList[chave].whatsAppNotification = 'S'
        }
      }
      else {
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
    catch (err: any) {
      console.log(err.response.data.Message)
    }
  }, [appointmentRemindersList])


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
  );


  const handleDeleteAction = useCallback((triggerId: number, actionId: number) => {
    setWorkflowTrigger((oldTriggers) =>
      oldTriggers.map((trigger) =>
        trigger.workflowTriggerId === triggerId
          ? { ...trigger, actions: trigger.actions.filter(a => a.workflowactionId !== actionId) }
          : trigger
      )
    );
  }, []);


  const handleChangeDays = (
    value: string,
    workflowTriggerId?: number,
    workflowActionId?: number
  ) => {

    const numericValue = Number(value) || 0;

    setWorkflowTrigger(prev =>
      prev.map(trigger =>
        trigger.workflowTriggerId === workflowTriggerId
          ? {
            ...trigger,
            actions: trigger.actions?.map(action =>
              action.workflowactionId === workflowActionId
                ? {
                  ...action,

                  daysbeforeandafter:
                    action.configuration?.when === "antes"
                      ? -Math.abs(numericValue)
                      : Math.abs(numericValue),
                }
                : action
            ),
          }
          : trigger
      )
    );

  };


  type Cfg = NonNullable<IWorkflowActions["configuration"]>;

  const withConfig = (cfg: IWorkflowActions["configuration"]): Cfg => ({
    subject: "",
    starttime: "",
    description: "",
    reminders: [],
    privacy: "N",
    responsible: "U",
    ...(cfg ?? {}),
  });


  const handleNewHourBeggin = (
    time: Date | string,
    workflowTriggerId: number,
    workflowActionId: number
  ) => {
    let formattedTime = "";

    console.log(time);
    if (time instanceof Date) {
      const hh = time.getHours().toString().padStart(2, "0");
      const mm = time.getMinutes().toString().padStart(2, "0");
      formattedTime = `${hh}:${mm}`;
    } else if (typeof time === "string") {
      formattedTime = time;
    }

    setWorkflowTrigger(prev =>
      prev.map(trigger =>
        trigger.workflowTriggerId === workflowTriggerId
          ? {
            ...trigger,
            actions: trigger.actions.map(action =>
              action.workflowactionId === workflowActionId
                ? {
                  ...action,
                  configuration: {
                    ...action.configuration,
                    starttime: formattedTime,
                  },
                }
                : action
            ),
          }
          : trigger
      )
    );
  };

  const toHHmm = (time: string | undefined | null) => {
    if (!time || typeof time !== "string") return "";
    const [h = "00", m = "00"] = time.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };


  const handleSubjectChange = (
    selected: { id: string | number; label: string } | null,
    workflowTriggerId: number | undefined,
    workflowActionId: number | undefined
  ) => {
    setWorkflowTrigger(prev =>
      prev.map(trigger =>
        trigger.workflowTriggerId === workflowTriggerId
          ? {
            ...trigger,
            actions: trigger.actions?.map(action =>
              action.workflowactionId === workflowActionId
                ? {
                  ...action,
                  configuration: {
                    ...action.configuration,
                    subject: selected ? String(selected.id) : "",
                  },
                }
                : action
            ),
          }
          : trigger
      )
    );
  };


  const handleSelectLembretes = (
    newValues: string[],
    workflowTriggerId: number,
    workflowActionId: number
  ) => {
    setWorkflowTrigger(prev =>
      prev.map(trigger => {
        if (trigger.workflowTriggerId !== workflowTriggerId) return trigger;

        return {
          ...trigger,
          actions: trigger.actions.map(action => {
            if (action.workflowactionId !== workflowActionId) return action;

            return {
              ...action,
              configuration: {
                ...action.configuration,
                reminders: newValues, // já salva array direto
              },
            };
          }),
        };
      })
    );
  };


  const handlePrivacyChange = (
    newValue: string,
    workflowTriggerId: number,
    workflowActionId: number
  ) => {
    setWorkflowTrigger(prev =>
      prev.map(trigger => {
        if (trigger.workflowTriggerId !== workflowTriggerId) return trigger;

        return {
          ...trigger,
          actions: trigger.actions.map(action => {
            if (action.workflowactionId !== workflowActionId) return action;

            return {
              ...action,
              configuration: {
                ...action.configuration,
                privacy: newValue, // aqui atualiza o valor selecionado
              },
            };
          }),
        };
      })
    );
  };

  const handleResponsibleChange = (
    newValue: string,
    workflowTriggerId?: number,
    workflowActionId?: number
  ) => {
    setWorkflowTrigger((prev) =>
      prev.map((tr) =>
        tr.workflowTriggerId === workflowTriggerId
          ? {
            ...tr,
            actions: tr.actions?.map((ac) =>
              ac.workflowactionId === workflowActionId
                ? {
                  ...ac,
                  configuration: {
                    ...ac.configuration!,
                    responsible: newValue,
                  },
                }
                : ac
            ),
          }
          : tr
      )
    );
  };

  const handleDescriptionChange = (
    newValue: string,
    workflowTriggerId?: number,
    workflowActionId?: number
  ) => {
    setWorkflowTrigger((prev) =>
      prev.map((tr) =>
        tr.workflowTriggerId === workflowTriggerId
          ? {
            ...tr,
            actions: tr.actions?.map((ac) =>
              ac.workflowactionId === workflowActionId
                ? {
                  ...ac,
                  configuration: {
                    ...ac.configuration!,
                    description: newValue,
                  },
                }
                : ac
            ),
          }
          : tr
      )
    );
  };


  /*
    const handleWhenChange = (
      newValue: "antes" | "depois",
      workflowTriggerId?: number,
      workflowActionId?: number
    ) => {
      setWorkflowTrigger(prev =>
        prev.map(trigger =>
          trigger.workflowTriggerId === workflowTriggerId
            ? {
              ...trigger,
              actions: trigger.actions?.map(action =>
                action.workflowactionId === workflowActionId
                  ? {
                    ...action,
                    configuration: {
                      ...action.configuration!,
                      when: newValue ?? action.configuration?.when ?? "depois",
                      daysbeforeandafter: newValue === "antes"
                        ? -Math.abs(action.daysbeforeandafter ?? 1)
                        : Math.abs(action.daysbeforeandafter ?? 1),
                    },
  
                  }
                  : action
              ),
            }
            : trigger
        )
      );
  
    };
  */


  const handleWhenChange = (
    newValue: "antes" | "depois",
    workflowTriggerId?: number,
    workflowActionId?: number
  ) => {
    console.log("handleWhenChange disparado:", { newValue, workflowTriggerId, workflowActionId });

    setWorkflowTrigger(prev => {
      const editTrigger = prev.map(trigger =>
        trigger.workflowTriggerId === workflowTriggerId
          ? {
            ...trigger,
            actions: trigger.actions?.map(action =>
              action.workflowactionId === workflowActionId
                ? {
                  ...action,
                  configuration: {
                    ...action.configuration!,
                    when: newValue,
                  },
                }
                : action
            ),
          }
          : trigger
      );
      console.log("Novo workflowTrigger:", editTrigger);

      setWhenChange(newValue);
      setCurrentWorkflowActionId(workflowActionId);
      setCurrentWorkflowTriggerId(workflowTriggerId);

      return editTrigger;
    });
  };


  useEffect(() => {
    if (!currentWorkflowTriggerId || !currentWorkflowActionId) return;
    setWorkflowTrigger(prev =>
      prev.map(trigger =>
        trigger.workflowTriggerId === currentWorkflowTriggerId
          ? {
            ...trigger,
            actions: trigger.actions?.map(action =>
              action.workflowactionId === currentWorkflowActionId
                ? {
                  ...action,
                  configuration: {
                    ...action.configuration!,
                    when: whenChange,
                  },
                }
                : action
            ),
          }
          : trigger
      )
    );
  }, [workflowTrigger, whenChange, currentWorkflowTriggerId, currentWorkflowActionId]);


  async function handleConfigurarCompromisso(triggerId: number) {
    if (!workflowName || workflowName.trim() === "") {
      addToast({
        type: "error",
        title: "Campo obrigatório",
        description: "O nome do workflow precisa ser preenchido."
      })

      return;
    }

    // encontra o trigger específico
    const trigger = workflowTrigger.find(t => t.workflowTriggerId === triggerId);

    if (!trigger.configuration?.label || trigger.configuration.label.trim() === "") {
      addToast({
        type: "error",
        title: "Campo obrigatório",
        description: "O label do gatilho precisa ser preenchido."
      })

      return;
    }

    if (!trigger) {
      alert("Trigger não encontrada.");
      return;
    }


    const id = await handleSalvarWorkflow();

    if (id > 0) {

      setConfigureEvent(true);
      setNameTrigger(trigger.configuration?.label);


    }


  };


  const fetchTriggerActions = async (triggerId: string) => {
    try {

      const response = await api.get<IWorkflowActions[]>('/Workflow/ListarAcoes', {
        params: { filterTerm: triggerId, token }
      });

      let data: IWorkflowActions[] = response.data.map((action: any) => {
        let configuration = null;
        if (action.configDescription) {
          try {
            configuration = JSON.parse(action.configDescription);
            configuration.when = (action.daysbeforeandafter ?? 0) < 0 ? "antes" : "depois";
            configuration.starttime = configuration.starttime ?? "";
          } catch (err) {
            console.error("Erro ao desserializar configDescription:", err);
          }
        }

        return {
          workflowactionId: action.workflowactionId,
          companyId: action.companyId,
          workflowTriggerId: action.workflowTriggerId,
          actionType: action.actionType,
          daysbeforeandafter: action.daysbeforeandafter,
          configuration
        };
      });

      // 👇 se a API não trouxe nada, cria uma nova action padrão
      if (data.length === 0) {
        data = [
          {
            workflowactionId: Math.random(),
            companyId,
            workflowTriggerId: triggerId,
            actionType: "criarcompromisso",
            daysbeforeandafter: 1,
            configuration: { when: "depois" }
          }
        ];
      }

      setWorkflowTrigger(prev =>
        prev.map(tr =>
          tr.workflowTriggerId === triggerId ? { ...tr, actions: data } : tr
        )
      );


    } catch (error) {
      //console.error(error);
      //alert("Erro ao carregar ações do compromisso.");
    }
  };


  const handleSalvarCompromissoWorkflow = async (triggerId: number, actionId: number) => {
    try {

 
      const trigger = workflowTrigger.find(
        (trigger) => trigger.configuration?.label?.trim() === nameTrigger
      );
      if (!trigger) {
        alert("Trigger não encontrada");
        return false;
      }



      console.log(trigger);
      // encontra a action específica
      const action = trigger.actions?.find(a => a.workflowactionId === actionId);
      if (!action) {
        alert("Action não encontrada");
        return false;
      }


      if (!action.configuration?.subject) {
         addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo 'Assunto' é obrigatório"
        })
        return false;
      }

      if (!action.daysbeforeandafter || action.daysbeforeandafter == 0) {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo de dias antes/depois deve ser diferente que zero"
        })
        return false;
      }

      const hora = action.configuration?.starttime;

      if (!hora || hora.trim() === "") {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo de hora é obrigatório"
        })
        return false;
      }


      const lembretes = action.configuration?.reminders;

      if (!Array.isArray(lembretes) || lembretes.length === 0) {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "Selecione pelo menos um lembrete"
        })
        return false;
      }

      const descricao = action.configuration?.description;

      if (!descricao || descricao.trim() === "") {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo 'Descrição' é obrigatório"
        })
        return false;
      }


      const config = {
        ...action.configuration,  // pega todas as configs existentes
        privacy: action.configuration?.privacy ?? "N",
        responsible: action.configuration?.responsible ?? "U",  // garante que privacy esteja definido
      };

      console.log('Config action ' + JSON.stringify(config));
      console.log('Dias antes e depois ' + action.daysbeforeandafter);


      const actionPayload = {
        workflowactionId: action.workflowactionId ?? 0,
        companyId,
        workflowtriggerId: trigger.workflowTriggerId,
        actiontype: "criarcompromisso",
        daysbeforeandafter:
          action.configuration?.when === "antes"
            ? -Math.abs(action.daysbeforeandafter ?? 1)
            : Math.abs(action.daysbeforeandafter ?? 1),
        configDescription: action.configuration ? JSON.stringify(config) : "{}",
        token,
        apiKey,
      };


      await api.put('/workflow/salvaracao', actionPayload);

      return true;
      /*
      addToast({
        type: "success",
        title: "Compromisso salvo",
        description: workflow.workflowId ? "As alterações feitas no compromisso foram salvas" : "compromisso adicionado"
      })
      */

    } catch (err: any) {
      const status = err.response?.data?.statusCode;  // protegemos com ?.
      const message = err.response?.data?.Message || err.message || "Erro desconhecido";

      // eslint-disable-next-line no-alert
      if (status !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: message
        })
      }

      return false;

    }
  };



  const handleSalvarCompromisso = async (triggerId: number, actionId: number) => {
    try {

      const trigger = workflowTrigger.find(
        (trigger) => trigger.configuration?.label?.trim() === nameTrigger
      );
      if (!trigger) {
        alert("Trigger não encontrada");
        return;
      }

      console.log(trigger);
      // encontra a action específica
      const action = trigger.actions?.find(a => a.workflowactionId === actionId);
      if (!action) {
        alert("Action não encontrada");
        return;
      }

      if (!action.configuration?.subject) {
         addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo 'Assunto' é obrigatório"
        })
        return false;
      }

      if (!action.daysbeforeandafter || action.daysbeforeandafter == 0) {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo de dias antes/depois deve ser diferente que zero"
        })
        return false;
      }

      const hora = action.configuration?.starttime;

      if (!hora || hora.trim() === "") {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo de hora é obrigatório"
        })
        return false;
      }


      const lembretes = action.configuration?.reminders;

      if (!Array.isArray(lembretes) || lembretes.length === 0) {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "Selecione pelo menos um lembrete"
        })
        return false;
      }

      const descricao = action.configuration?.description;

      if (!descricao || descricao.trim() === "") {
        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: "O campo 'Descrição' é obrigatório"
        })
        return false;
      }



      const config = {
        ...action.configuration,  // pega todas as configs existentes
        privacy: action.configuration?.privacy ?? "N",
        responsible: action.configuration?.responsible ?? "U",  // garante que privacy esteja definido
      };

      console.log('Config action ' + JSON.stringify(config));
      console.log('Dias antes e depois ' + action.daysbeforeandafter);


      const actionPayload = {
        workflowactionId: action.workflowactionId ?? 0,
        companyId,
        workflowtriggerId: trigger.workflowTriggerId,
        actiontype: "criarcompromisso",
        daysbeforeandafter:
          action.configuration?.when === "antes"
            ? -Math.abs(action.daysbeforeandafter ?? 1)
            : Math.abs(action.daysbeforeandafter ?? 1),
        configDescription: action.configuration ? JSON.stringify(config) : "{}",
        token,
        apiKey,
      };


      await api.put('/workflow/salvaracao', actionPayload);

      addToast({
        type: "success",
        title: "Compromisso salvo",
        description: workflow.workflowId ? "As alterações feitas no compromisso foram salvas" : "compromisso adicionado"
      })


      await reloadWorkflow(workflowId);
      setPainelAberto(triggerId);
      fetchTriggerActions(triggerId);
      handleNewAction(triggerId);

    } catch (err: any) {
      const status = err.response?.data?.statusCode;  // protegemos com ?.
      const message = err.response?.data?.Message || err.message || "Erro desconhecido";

      // eslint-disable-next-line no-alert
      if (status !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar compromisso",
          description: message
        })
      }

    }
  };

  const handleRemoveAction = (TriggerId: number, ActionId: number) => {
    //alert('triggerid: ' + TriggerId + ' actionid: ' + ActionId);
    handleDeleteAction(TriggerId, ActionId);
    //setPainelAberto(TriggerId);
    setConfigureEvent(false);

  };

  return (
    <Container>

      <Content onScroll={handleScroolSeeMore} ref={scrollRef}>

        <Tabs>

          <div>

            <button
              type='button'
              onClick={() => history.push('/workflow/list')}
            >
              <RiCloseLine />
              Fechar
            </button>

          </div>

          {/* CUSTOMER TAB */}
          <Tab active={tabsControl.tab1}>

            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitWorkflow)}>
              <h2>Workflow</h2>
              <section id="dados">

                <label htmlFor="name" className="required">
                  Nome
                  <input
                    type="text"
                    value={workflowName}
                    autoComplete="off"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkflowName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </label>

              </section>

              <br /><br /><br /> <br />

              <label htmlFor="endereco" style={{ marginTop: '-55px' }}>
                <p>Informe abaixo as datas que serão gatilhos para iniciar o workflow</p>
                {workflowTrigger.map(trigger => (

                  <section id="endereco" key={trigger.workflowTriggerId}>

                    <label>
                      Tipo gatilho
                      <Select
                        isSearchable
                        id="triggerSelect"
                        styles={selectStyles}
                        value={workflowTriggerTypes.filter(options => options.id === trigger.triggerType)}
                        onChange={(item) => handleChangeTriggerType(item?.id, trigger.workflowTriggerId)}
                        options={workflowTriggerTypes}
                        isDisabled={true}
                        placeholder="Selecione"
                      />
                    </label>

                    <label>
                      Informe o "label" para data
                      <input
                        id="triggerDescription"
                        type="text"
                        autoComplete="off"
                        value={trigger.configuration?.label || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTrigger(e.target.value, trigger.workflowTriggerId)}
                        maxLength={30}
                        style={{ width: "400px" }}
                      />
                    </label>

                    <label htmlFor="telefone" id="trigger">

                      <button type="button" className='buttonLinkClick' onClick={() =>
                        handleCheckBoxDeleteTrigger(trigger.workflowTriggerId)} style={{ width: "200px" }}>
                        <FiTrash />
                        Apagar este gatilho
                      </button>

                      <button
                        type="button"
                        className='buttonLinkClick'
                        onClick={() => handleConfigurarCompromisso(trigger.workflowTriggerId!)}
                        style={{ width: "200px" }}
                      >

                        {painelAberto === trigger.workflowTriggerId || trigger.workflowId === 0 ? (
                          <>
                            <FiXCircle />
                            Configurar compromisso
                          </>
                        ) : (
                          <>
                            <FiPlusCircle />
                            Ver compromisso
                          </>
                        )}

                      </button>

                    </label>
                    <label htmlFor="telefone" id="trigger">


                    </label>




                    {painelAberto === trigger.workflowTriggerId && (
                      <>

                        {trigger.actions?.map(action => (
                          <>

                            <label
                              htmlFor="telefone2"
                              id="trigger"
                              style={{
                                gridColumn: "2 / span 3", // começa na 2ª coluna e ocupa 2 colunas
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              Informe os dias para criação do compromisso
                              <FcAbout
                                style={{ height: "15px", width: "15px", marginRight: "85px" }}
                                title="Você deve Informar a regra para criação do compromisso a partir a da data do gatilho, informar se deve ser criado antes ou depois e quantos dias considerar."
                              />

                              <label style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "20px" }}>
                                <input
                                  type="radio"
                                  name={`quando-${trigger.workflowTriggerId}-${action.workflowactionId}`} // único por trigger+ação
                                  value="antes"
                                  checked={action.configuration?.when === "antes"}
                                  onChange={() =>
                                    handleWhenChange("antes", trigger.workflowTriggerId, action.workflowactionId)
                                  }
                                />
                                Antes
                              </label>

                              <label style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "20px" }}>
                                <input
                                  type="radio"
                                  name={`quando-${trigger.workflowTriggerId}-${action.workflowactionId}`} // mesmo name do par
                                  value="depois"
                                  checked={action.configuration?.when === "depois"}
                                  onChange={() =>
                                    handleWhenChange("depois", trigger.workflowTriggerId, action.workflowactionId)
                                  }
                                />
                                Depois
                              </label>

                              <label style={{ display: "flex", alignItems: "center", gap: "5px", marginRight: "15px" }}>

                                Qtd. de dias
                                <input
                                  type="number"
                                  min={1}
                                  value={Math.abs(action.daysbeforeandafter ?? 1)}
                                  onChange={(e) =>
                                    handleChangeDays(
                                      e.target.value,
                                      trigger.workflowTriggerId,
                                      action.workflowactionId
                                    )
                                  }
                                  style={{ width: "50px" }}
                                />

                              </label>
                            </label>



                            <label htmlFor="telefone" id="trigger" style={{
                              gridColumn: "2 / span 1", // ocupa 2 colunas a partir da coluna 1
                              display: "flex",
                              //flexDirection: "column",
                            }}>

                              <div id="triggerDados">
                                Assunto
                                <Select
                                  isSearchable
                                  isClearable
                                  id="triggerSubject"
                                  placeholder='Selecione o Assunto'
                                  onChange={(item) => handleSubjectChange(item, trigger.workflowTriggerId, action.workflowactionId)}
                                  onInputChange={(term) => setAppointmentSubject(term)}
                                  value={optionsSubject.filter((opt) => opt.id === action.configuration?.subject)}
                                  options={optionsSubject}
                                  loadingMessage={loadingMessage}
                                  noOptionsMessage={noOptionsMessage}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      minWidth: "400px", left: "-7px"
                                    })
                                  }}
                                />

                              </div>

                            </label>


                            <label htmlFor="telefone2" id="trigger" >


                              <div id="triggerDados">

                                Hora Inicio


                                <TimePicker
                                  name={`timepicker-${action.workflowactionId}`}
                                  id={`timepicker-${action.workflowactionId}`}
                                  value={toHHmm(action.configuration?.starttime)}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const time = e.target.value; // <-- pega a hora do input
                                    handleNewHourBeggin(time, trigger.workflowTriggerId, action.workflowactionId);
                                  }}
                                  disabled={appointmentBlockUpdate}
                                  style={{
                                    width: "100px",
                                    maxWidth: "100px",
                                    display: "inline-block",
                                  }}
                                />

                              </div>
                            </label>
                            <label htmlFor="telefone" id="trigger" style={{
                              gridColumn: "2 / span 1", // ocupa 2 colunas a partir da coluna 1
                              display: "flex",
                              //flexDirection: "column",
                            }}>
                              <div id="triggerDados">

                                Privacidade
                                <select
                                  name="privacidade"
                                  id={`privacidade-${action.workflowactionId}`}
                                  value={action.configuration?.privacy ?? "N"}
                                  onChange={(e) =>
                                    handlePrivacyChange(e.target.value, trigger.workflowTriggerId, action.workflowactionId)
                                  }
                                  disabled={appointmentBlockUpdate}
                                  style={{ width: "400px" }}
                                >
                                  <option value="N">Público</option>
                                  <option value="S">Privado</option>
                                </select>
                              </div>

                            </label>
                            <label htmlFor="telefone2" id="trigger" >

                              <div id="triggerDados">
                                Responsável

                                <select
                                  name="responsavel"
                                  id={`responsavel-${action.workflowactionId}`}
                                  value={action.configuration?.responsible ?? "U"}
                                  onChange={(e) =>
                                    handleResponsibleChange(e.target.value, trigger.workflowTriggerId, action.workflowactionId)
                                  }
                                  disabled={appointmentBlockUpdate}
                                  style={{ width: "300px" }}
                                >
                                  <option value="U">Usuário</option>
                                  <option value="R">Resp.Processo</option>
                                  <option value="A">Atribuir</option>
                                </select>

                              </div>

                            </label>


                            <label
                              htmlFor="obs"
                              style={{
                                gridColumn: "2 / span 2", // ocupa 2 colunas a partir da coluna 1
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div id="triggerDados">
                                Lembretes
                                <Select
                                  isMulti
                                  name="lembretes"
                                  id={`lembretes-${action.workflowactionId}`}
                                  placeholder="Selecione."
                                  value={
                                    (action.configuration?.reminders ?? []).map(reminder =>
                                      optionsLembrete
                                        .filter(opt => opt.key !== "00") 
                                        .map(opt => ({ value: opt.key, label: opt.value }))
                                        .find(opt => opt.value === reminder)
                                    ).filter(Boolean)
                                  }
                                  onChange={(selected) => {
                                    const values = selected.map(opt => opt.value);
                                    handleSelectLembretes(values, trigger.workflowTriggerId, action.workflowactionId);
                                  }}
                                  options={optionsLembrete
                                     .filter(opt => opt.key !== "00") 
                                    .map(opt => ({
                                    value: opt.key,
                                    label: opt.value
                                  }))}
                                  isDisabled={appointmentBlockUpdate}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      width: "725px",
                                      minWidth: "160px",
                                    })
                                  }}
                                />

                              </div>

                            </label>


                            <label
                              htmlFor="obs"
                              style={{
                                gridColumn: "2 / span 2", // ocupa 2 colunas a partir da coluna 1
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div id="triggerDados">
                                <span>Descrição</span>

                                <textarea
                                  value={action.configuration?.description ?? ""}
                                  onChange={(e) =>
                                    handleDescriptionChange(
                                      e.target.value,
                                      trigger.workflowTriggerId,
                                      action.workflowactionId
                                    )
                                  }
                                  style={{
                                    width: "725px",
                                    minHeight: "150px",
                                    resize: "vertical",
                                    background: "white",
                                    color: "black",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    padding: "8px",
                                    fontSize: "14px",
                                  }}
                                />

                              </div>
                            </label>

                            <label
                              htmlFor="obs"
                              style={{
                                gridColumn: "2 / span 2", // ocupa 2 colunas a partir da coluna 1
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div style={{ width: "725px", display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px", }}>
                                <button type="button" className='buttonLinkClick' onClick={() => handleNewAction(trigger.workflowTriggerId!)}>
                                  <FiPlus />
                                  Incluir novo compromisso
                                </button>

                                <button type="button" className='buttonLinkClick' onClick={() => handleSalvarCompromisso(trigger.workflowTriggerId, action.workflowactionId)}>
                                  <FiSave />
                                  Salvar
                                </button>


                                <button type="button" className='buttonLinkClick' onClick={() =>
                                  handleDeleteWorkflowAcao(trigger.workflowTriggerId, action.workflowactionId)} >
                                  <FiTrash />
                                  Excluir
                                </button>

                                <button type="button" className='buttonLinkClick' onClick={() => handleRemoveAction(trigger.workflowTriggerId, action.workflowactionId)}>
                                  <FiX />
                                  Fechar
                                </button>

                              </div>
                            </label>
                          </>


                        ))}

                      </>

                    )}


                  </section>


                ))}

              </label>


              <br />
              <button type="button" className='buttonLinkClick' id="addEnd" onClick={handleNewTrigger}>
                <FiPlus />
                Incluir outro gatilho
              </button>


              <footer>

                <div>

                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>


                  <button className="buttonClick" type="button" onClick={() => history.push('/workflow/list')}>
                    <MdBlock />
                    Fechar
                  </button>

                </div>

              </footer>

            </Form>

          </Tab>


        </Tabs>


      </Content>


      {isDeleting && (

        <ConfirmBoxModal
          title="Excluir Registro"
          caller="WorkflowList"
          message="Confirma a exclusão deste workflow ?"
        />



      )}


    </Container>
  );


};

