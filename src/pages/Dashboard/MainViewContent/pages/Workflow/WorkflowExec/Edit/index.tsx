import React, { ChangeEvent, useCallback, useEffect, useRef, useState, UIEvent } from 'react'
import Select from 'react-select'
import { formatField, selectStyles, useDelay, currencyConfig } from 'Shared/utils/commonFunctions';
import { RiFolder2Fill, RiEraserLine } from 'react-icons/ri';
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

/*
export interface IWorkflowData{
    workflowId: number;
    name: string;
    //totalRows: number;
}
*/


interface IOption {
  value: number;
  label: string;
}


export default function WorkflowPage() {

  const [isPagination, setIsPagination] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [customerList, setCustomerList] = useState<ISelectData[]>([])
  const [customer, setCustomer] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [personSearch, setPersonSearch] = useState<string | null>('')
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const { matterSelected, dateEnd, handleModalActiveId, selectProcess, handleModalActive, openSelectProcess, handleSelectProcess, jsonModalObjectResult, handleJsonModalObjectResult, deadLineText, publicationText, modalActiveId, caller } = useModal();
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
  const [ triggerActionsMap, setTriggerActionsMap] = useState<Record<number, ITriggerAction[]>>({});
  const [userList, setUserList] = useState<userListData[]>([]);
  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData); // processo associado


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
      console.error(err);
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

      const response = await api.post(`/Workflow/ListarAcoesSimulacao`, {
        workflowTriggerId: triggerId,
        value: selectedDate,
        triggerType: "data",
        matterId,
        token
      });

      console.log("Retorno API:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar ações do compromisso.", error);
      return [];
    }
  };



  const handleSimularWorkflow = async () => {
    setTriggerActionsMap({});

    Object.keys(triggerDates).forEach(async (triggerIdStr) => {
      const triggerId = Number(triggerIdStr);
      const actions = await fetchTriggerActions(triggerId);


      setTriggerActionsMap(prev => ({ ...prev, [triggerId]: actions }));
    });
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


  const getSubjectLabel = (id?: number | string) => {
    if (!id) return "";
    console.log(optionsSubject);
    const subject = optionsSubject.find(s => String(s.id) === String(id));
    return subject ? subject.label : `ID ${id} não encontrado`;
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
  // Monta o JSON das triggers
  const jsonTriggers = workflowTrigger
    .filter(trigger => trigger.triggerType === "data")
    .map(trigger => ({
      label: trigger.configuration?.label || "Trigger sem nome",
      value: triggerDates[trigger.workflowTriggerId] || ""
    }));

  let matterId;
  if (processTitle !== 'Associar Processo')
    matterId = matterSelected?.matterId ?? null;

  // Todas as ações
  const allActions = Object.values(triggerActionsMap).flat();

  // Data de hoje no formato ISO
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  // WorkflowActionsExecDTO com des_ExecParameters filtrado
  const workflowActionsExec: IWorkflowActionsExecDTO[] = allActions.map((action, index) => {
    const execParams = {
      startDate: action.startDate,
      endDate: action.endDate,
      status: action.status,
      description: action.description,
      subjectId: action.subjectId,
      privateEvent: action.privateEvent,
      remindersList: action.remindersList,
      responsibleList: action.responsibleList
    };

    return {
      workflowactionsexecId: 0,
      companyId,
      workflowexecId: 0,
      actionType: "criarcompromisso",
      des_ExecParameters: JSON.stringify(execParams),
      //sequence: index + 1,
      //relatedactionId: action.relatedactionId ?? null,
      statusType: "Pendente"
    };
  });

  // Payload final
  const payload = {
    workflowexecId: 0,
    companyId,
    workflowId: workflow?.value ?? 0,
    matterId,
    customerId: customer?.id ?? null,
    des_ExecParameters: JSON.stringify(jsonTriggers),
    startDate: todayISO,
    endDate: null,
    statusType: "emandamento",
    count: null,
    eventDTO: allActions,
    actionsExecDTO: workflowActionsExec,
    token,
    apiKey
  };

  console.log("Payload enviado:", payload);

  const response = await api.put(`/WorkflowExec/Salvar`, payload);
};


{/*
  const handleExecutarWorkflow = async () => {
    const jsonTriggers = workflowTrigger
      .filter(trigger => trigger.triggerType === "data")
      .map(trigger => ({
        label: trigger.configuration?.label || "Trigger sem nome",
        value: triggerDates[trigger.workflowTriggerId] || ""
      }));

    let matterId;

    if (processTitle !== 'Associar Processo')
      matterId = matterSelected?.matterId ?? null;

    const allActions = Object.values(triggerActionsMap).flat();

    const today = new Date(); // data de hoje
    const todayISO = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const workflowActionsExec: IWorkflowActionsExecDTO[] = allActions.map((action, index) => ({
      workflowactionsexecId: 0,       
      companyId,
      workflowexecId: 0,              
      actionType: "criarcompromisso",  
      //daysbeforeandafter: action.daysbeforeandafter ?? 0,
      des_ExecParameters: JSON.stringify(action.des_ExecParameters || {}),
      //sequence: index + 1,
      //relatedactionId: action.relatedactionId ?? null,
      statusType: "Pendente"
    }));


    const payload = {
      workflowexecId: 0,
      companyId,
      workflowId: workflow?.value ?? 0,
      matterId,
      customerId: customer?.id ?? null,
      des_ExecParameters: JSON.stringify(jsonTriggers),
      startDate: todayISO,
      endDate: null,
      statusType: "emandamento",
      count: null,
      eventDTO: allActions,
      actionsExecDTO: workflowActionsExec, 
      token,
      apiKey
    };

    console.log("Payload enviado:", payload);

    const response = await api.put(`/WorkflowExec/Salvar`, payload);

  };
*/}


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
                      >
                        <RiFolder2Fill />
                      </button>
                    )}

                    {processTitle !== 'Associar Processo' && (
                      <button
                        type="button"
                        onClick={() => {
                          setProcessTitle('Associar Processo');
                          setAppointmentMatter(undefined);
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
                  />

                </div>

                {workflowTrigger.map((trigger) => (
                  trigger.triggerType === "data" && (
                    <div key={trigger.workflowTriggerId}>
                      <label>{trigger.configuration?.label}</label>
                      <Input
                        type="date"
                        value={triggerDates[trigger.workflowTriggerId] || ""}
                        onChange={(e) =>
                          setTriggerDates((prev) => ({
                            ...prev,
                            [trigger.workflowTriggerId]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )
                ))}

              </div>

              <div style={{ marginTop: "1rem", marginBottom: "3rem" }}>

                <button type="button" className='buttonClick' onClick={handleSimularWorkflow}>
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

                      <Step style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "0.675rem", marginBottom: "0.25rem" }}>
                          {trigger.configuration?.label ?? "Trigger sem nome"}
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
                        <Circle>1</Circle>
                      </Step>

                      {actions.length > 0 && (
                        <div
                          style={{
                            height: "2px",
                            width: "64px",
                            background: "#cbd5e1",
                            alignSelf: "center",
                            marginTop: "70px",
                          }}
                        />
                      )}


                      {actions.map((action, index) => (
                        <React.Fragment key={action.eventId}>
                          <Step style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                            <span style={{ fontSize: "0.675rem", marginBottom: "0.25rem", fontWeight: 500 }}>
                              {getSubjectLabel(action.subjectId)}
                            </span>


                            <span style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "0.25rem" }}>
                              {`${new Date(action.startDate).getDate().toString().padStart(2, "0")}/${new Date(action.startDate)
                                .toLocaleDateString("pt-BR", { month: "short" })
                                .toUpperCase()
                                .replace(".", "")}`}
                            </span>


                            <Circle>{index + 2}</Circle>
                          </Step>

                          {index < actions.length - 1 && (
                            <div
                              style={{
                                height: "2px",
                                width: "64px",
                                background: "#cbd5e1",
                                alignSelf: "center",
                                marginTop: "70px",
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
                              <h3 style={{ fontSize: "0.675rem", fontWeight: 500 }}>{getSubjectLabel(action.subjectId)}</h3>
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
                                defaultValue={action.responsibleList?.map((resp) => {
                                  const user = userList.find((u) => String(u.id) === String(resp.userCompanyId));
                                  return user ? { value: user.id, label: user.value } : null;
                                }).filter(Boolean)}
                                onChange={(selectedOptions) => {

                                  console.log("Usuários selecionados:", selectedOptions);

                                }}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    width: "350px",
                                    minWidth: "160px",
                                  })
                                }}
                              />


                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "0px",
                                  background: "#fef3c7",
                                  color: "#b45309",
                                }}
                              >
                                {action.status ?? "Pendente"}
                              </span>
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

              <button type="button" className='buttonClick' onClick={handleExecutarWorkflow}>
                <FiSave />
                Executar Workflow
              </button>
              <button type="button" className='buttonClick'>
                <FiTrash />
                Excluir
              </button>

              {/*<Button variant="outline">Status: Em andamento</Button>*/}
            </footer>

          </Form>

        </div>


        {openSelectProcess === 'Open' ? <GridSelectProcess /> : null}



      </Content>

    </Container>
  );
}