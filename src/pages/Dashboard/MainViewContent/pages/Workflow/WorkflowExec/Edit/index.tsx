 import React, { ChangeEvent, useCallback, useEffect, useRef, useState, UIEvent } from 'react'
 import Select from 'react-select'
 import { formatField, selectStyles, useDelay, currencyConfig} from 'Shared/utils/commonFunctions';
 import { RiFolder2Fill, RiEraserLine } from 'react-icons/ri';
 import { useHistory, useLocation } from 'react-router-dom'
 import { useForm } from 'react-hook-form';
 import { FiDelete, FiLock, FiPlus, FiSave, FiTrash, FiX } from 'react-icons/fi';
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
 import { IWorkflowTriggers, IWorkflowActions, IWorkflowData, ISelectValues } from '../../Interfaces/IWorkflowEdit';
 import { workflowTriggerTypes } from 'Shared/utils/commonListValues';
 import ConfirmBoxModal from 'components/ConfirmBoxModal';
 import { useConfirmBox } from 'context/confirmBox';
 import { trigger } from 'swr';
 import { FcAbout } from 'react-icons/fc';
 import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
 import { AppointmentPropsSave, AppointmentPropsDelete, SelectValues, Data, dataProps, LembretesData, MatterData, ModalProps, ResponsibleDTO, Settings, ShareListDTO, userListData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
 import { dayRecurrence, optionsLembrete, weekRecurrence } from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment/ListValues/List'
 import TimePicker from 'components/TimePicker';
 import { Form, Container,Content, Section, Input, Button, Process, Timeline, Step, Circle, Card } from './styles';
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
const {matterSelected, dateEnd, handleModalActiveId, selectProcess,handleModalActive,openSelectProcess,handleSelectProcess,jsonModalObjectResult,handleJsonModalObjectResult,deadLineText,publicationText, modalActiveId, caller } = useModal();
const userToken = localStorage.getItem('@GoJur:token');
const [redirectLink, setRedirectLink] = useState('/####'); 
const [completeLink, setCompleteLink] = useState<boolean>(false);
const [workflowList, setWorkflowList] = useState<IOption[]>([]);
const token = localStorage.getItem('@GoJur:token');
const [workflowTrigger, setWorkflowTrigger] = useState<IWorkflowTriggers[]>([]);
//const [workflow, setWorkflow] = useState({} as IWorkflowData);
const [triggerDates, setTriggerDates] = useState<Record<number, string>>({});
const [optionsSubject, setOptionsSubject] = useState<ISelectValues[]>([]);

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


 const LoadPerson = async() => {
     setCustomerList(await ListCustomerData(""))
  }

useEffect(() => {
    LoadPerson()
    ListWorkflow("")
    LoadSubject();
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


    /*
    if (Number(workflowId) === 0) {
      handleNewTrigger();
      return;
    }
    */

    try {

      const response = await api.get<IWorkflowData[]>('/Workflow/Selecionar', {
        params: {
          id: Number(workflowId),
          token
        }
      })

      //setWorkflow(response.data)

      //setWorkflowName(response.data.name);


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


      if (data.length === 0) {
        data = [
          {
            workflowactionId: Math.random(),
            companyId,
            workflowTriggerId: triggerId,
            actionType: "criarcompromisso",
            daysbeforeandafter: 0,
            configuration: { when: "depois", starttime:"09:00",  reminders: [] }
          }
        ];
      }

      setWorkflowTrigger(prev =>
        prev.map(tr =>
          tr.workflowTriggerId === Number(triggerId) ? { ...tr, actions: data } : tr
        )
      );


    } catch (error) {
      //console.error(error);
      //alert("Erro ao carregar ações do compromisso.");
    }
  };


 const handleSimularWorkflow = async () => {
 
  console.log("Datas digitadas:", triggerDates);


  for (const triggerId of Object.keys(triggerDates)) {
    await fetchTriggerActions(triggerId);
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


const getSubjectLabel = (id?: number | string) => {
  if (!id) return "";
  console.log(optionsSubject);
  const subject = optionsSubject.find(s => String(s.id) === String(id));
  return subject ? subject.label : `ID ${id} não encontrado`;
};

return (
<Container onScroll={handleScroolSeeMore} ref={scrollRef}>



<HeaderPage />

<Content>
<div>
      <header>
        <h1 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem", marginLeft:"1.5rem" }}>
          Executar Workflow
        </h1>
        <p style={{ fontSize: "0.675rem", color: "#64748b", marginLeft:"1.5rem" }}>
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
                      }}
                    >
                      { <RiEraserLine /> }
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

        <div style={{ marginTop: "1rem", marginBottom: "3rem"  }}>
        
          <button type="button" className='buttonClick' onClick={handleSimularWorkflow}>
       
            Simular Workflow
          </button>

        </div>
      </Section>

     
      <Section>
        <h2 style={{ fontSize: "0.875rem", fontWeight: "500", paddingBottom: "1.0rem" }}>Ações Geradas</h2>
        {/*
        <Timeline>
          <Step>
            <Circle>1</Circle>
            <span style={{ fontSize: "0.675rem" }}>Análise (03/09)</span>
          </Step>
          <div style={{ height: "2px", width: "64px", background: "#cbd5e1" }} />
          <Step>
            <Circle>2</Circle>
            <span style={{ fontSize: "0.675rem" }}>Recurso Apelação (07/09)</span>
          </Step>
          <div style={{ height: "2px", width: "64px", background: "#cbd5e1" }} />
          <Step>
            <Circle>3</Circle>
            <span style={{ fontSize: "0.675rem" }}>Prazo Judicial (17/09)</span>
          </Step>
        </Timeline>
          */}

{workflowTrigger.map((trigger) => (
  <React.Fragment key={trigger.triggerId}>
    {/* Timeline */}
    <Timeline>
      {trigger.actions?.map((action, index) => (
        <React.Fragment key={action.workflowactionId}>
          <Step>
            <Circle>{index + 1}</Circle>
            <span style={{ fontSize: "0.675rem" }}>
              {getSubjectLabel(action.configuration?.subject)}
            </span>
          </Step>

          {index < (trigger.actions?.length ?? 0) - 1 && (
            <div style={{ height: "2px", width: "64px", background: "#cbd5e1" }} />
          )}
        </React.Fragment>
      ))}
    </Timeline>

    {/* Cards das ações do trigger */}
    <div style={{ display: "flex", flexDirection: "column", paddingTop: "1rem" }}>
      {trigger.actions?.map((action) => (
        <Card key={action.workflowactionId} style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "0.675rem", fontWeight: "500" }}>
                {/* Data + Assunto */}
                {action.configuration?.date
                  ? new Date(action.configuration.date).toLocaleDateString()
                  : "-"} - {getSubjectLabel(action.configuration?.subject)}
              </h3>
              <p style={{ fontSize: "0.55rem", color: "#64748b" }}>
                {action.configuration?.description || "Sem descrição"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <Select>
                <option>João</option>
                <option>Maria</option>
              </Select>
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "9999px",
                  background: "#fef3c7",
                  color: "#b45309",
                }}
              >
                {action.configuration?.status || "Pendente"}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </React.Fragment>
))}




       {/*
        <div style={{ display: "flex", flexDirection: "column",  paddingTop: "1.0rem" }}>
          <Card style={{ marginBottom: "1.0rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "0.675rem", fontWeight: "500" }}>03/09 - Análise</h3> 
                <p style={{ fontSize: "0.55rem", color: "#64748b" }}>
                  Parte da descrição do compromisso.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Select>
                  <option>João</option>
                  <option>Maria</option>
                </Select>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    background: "#fef3c7",
                    color: "#b45309",
                  }}
                >
                  Pendente
                </span>
              </div>
            </div>
          </Card>

        </div>

<div style={{ display: "flex", flexDirection: "column" }}>
          <Card style={{ marginBottom: "1.0rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "0.675rem", fontWeight: "500" }}>07/09 - Recurso apelação</h3> 
                <p style={{ fontSize: "0.55rem", color: "#64748b" }}>
                  Elaborar recurso de apelação.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Select>
                  <option>João</option>
                  <option>Maria</option>
                </Select>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    background: "#fef3c7",
                    color: "#b45309",
                  }}
                >
                  Pendente
                </span>
              </div>
            </div>
          </Card>

        </div>


<div style={{ display: "flex", flexDirection: "column" }}>
          <Card style={{ marginBottom: "1.0rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "0.675rem", fontWeight: "500" }}>17/09 - Prazo Judicial</h3> 
                <p style={{ fontSize: "0.55rem", color: "#64748b" }}>
                  Descrição da ação do prazo judicial
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Select>
                  <option>João</option>
                  <option>Maria</option>
                </Select>
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    background: "#fef3c7",
                    color: "#b45309",
                  }}
                >
                  Pendente
                </span>
              </div>
            </div>
          </Card>

        </div>
*/}
      </Section>

      {/* FOOTER */}
      <footer style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
        <Button variant="success">Executar Workflow</Button>
        <Button variant="danger">Excluir</Button>
        <Button variant="outline">Status: Em andamento</Button>
      </footer>

    </Form>

</div>


 {openSelectProcess === 'Open' ? <GridSelectProcess /> : null}



</Content>

    </Container>
  );
}