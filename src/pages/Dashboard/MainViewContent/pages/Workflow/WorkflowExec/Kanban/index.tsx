import React, { ChangeEvent, useCallback, useEffect, useRef, useState, UIEvent } from 'react'
import { Container, Header, Grid, Sidebar, Main, Card, CardHeader, KanbanCard, BusinessCard, Process, Content } from './styles';
import { AppointmentPropsSave, AppointmentPropsDelete, SelectValues, Data, dataProps, LembretesData, MatterData, ModalProps, ResponsibleDTO, Settings, ShareListDTO, userListData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import api from 'services/api';
import Select from 'react-select'
import { ISelectData } from '../../../Interfaces/IMatter';
import { RiFolder2Fill, RiEraserLine, RiCalendarCheckFill } from 'react-icons/ri';
import { useModal } from 'context/modal';
import GridSelectProcess from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { IMatterData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { HeaderPage } from 'components/HeaderPage';
import { format, parseISO } from "date-fns";
import { useToast } from 'context/toast';


export interface IWorkflowData {
  workflowId: number;
  name: string;
  workflowexecId: number;
  startDate: string;
  endDate: string;
  statusType: string;
  matterId: number;
  matter: string;   
  customerId: number;
  customer: string;  
  count: number;
}

export default function PainelWorkflows() {

  const { addToast } = useToast();
  const userToken = localStorage.getItem('@GoJur:token');
  const [userList, setUserList] = useState<userListData[]>([]);
  const [customerList, setCustomerList] = useState<ISelectData[]>([])
  const [customer, setCustomer] = useState(null);
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const { matterSelected, dateEnd, selectProcess, openSelectProcess, handleSelectProcess, jsonModalObjectResult, handleJsonModalObjectResult, deadLineText, publicationText, modalActiveId } = useModal();
  const [completeLink, setCompleteLink] = useState<boolean>(false);
  const [redirectLink, setRedirectLink] = useState('/####');
  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData);
  const [selected, setSelected] = useState("Todos");
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [workflowList, setWorkflowList] = useState<IWorkflowData[]>([]);
  const [isPagination, setIsPagination] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    LoadPerson();
    LoadUserList();

  }, [])


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


  const LoadPerson = async () => {
    setCustomerList(await ListCustomerData(""))
  }


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


    const RefreshPersonList = useCallback(async (inputValue: string) => {
      const list = await ListCustomerData(inputValue ?? "");
      setCustomerList(list);
    }, []);


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


const selectStyles = {
  control: (base) => ({
    ...base,
    width: "215px",
    minWidth: "160px",
    fontSize: "0.7rem",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "0.7rem",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "0.7rem",
  }),
  option: (base) => ({
    ...base,
    fontSize: "0.7rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: "0.7rem",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

  const handleGridSelectProcess = useCallback(() => {
    if (processTitle === 'Associar Processo') {
      handleSelectProcess('Open');
      //setTriggerActionsMap({});
    }
  }, [handleSelectProcess, processTitle]);


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
            //const url = `/matter/edit/${matterType}/${matterSelected.matterId}`
            const url = `###`
            setRedirectLink(url)
            setCompleteLink(true)
          })
      }
      else {
        setProcessTitle('Associar Processo');
      }
    }, [matterSelected, dateEnd]);


  const statuses = [
    { label: "Todos", color: "#fff", border: "#d1d5db" },
    { label: "Em andamento", color: "#fef3c7", border: "#fde68a" },
    { label: "Atrasado", color: "#ffe4e6", border: "#fecdd3" },
    { label: "Concluído", color: "#d1fae5", border: "#a7f3d0" },
  ];


useEffect(() => {
  const setup = async () => {
    await LoadWorkflow('initialize');

  };

  setup(); 

}, []);
 
    
  const LoadWorkflow = useCallback(
  async (state = '') => {
    
    try {

      const token = localStorage.getItem('@GoJur:token');
      //const page = state == 'initialize' ? 1 : pageNumber;
      const page = 1;

      const filters: string[] = [];

      /*  
      if (captureText) {
        filters.push(`searchBox=${captureText}`);
      }

      if (captureType) {
        filters.push(`status=${captureType}`);
      }
      */
     
      const filterClause = filters.join(", "); 


      const response = await api.get<IWorkflowData[]>('/WorkflowExec/ListarExec', {
        params: {
          page,
          rows: 200,
          filterClause,
          token
        }
      })

      const statusMap: Record<string, string> = {
        emandamento: "Em andamento",
        atraso:"Atraso",
        concluido: "Concluído",
      };


      const formattedData = response.data.map(item => ({
        ...item,
        startDate: item.startDate ? format(new Date(item.startDate), "dd/MM/yyyy") : "",
        endDate: item.endDate ? format(new Date(item.endDate), "dd/MM/yyyy") : "",
       statusType: statusMap[item.statusType?.toLowerCase()] || item.statusType, 
      }));

      console.log(formattedData);


        
      if(response.data.length > 0 && state == 'initialize')
        setTotalPageCount(response.data[0].count)


      if (response.data.length == 0 || state === 'initialize') {
     

        if (state != 'initialize') return;
      }

      if (!isPagination || state === 'initialize') {
        setWorkflowList(formattedData);
      }
      else {
        response.data.map(item =>
          workflowList.push({
            ...item,
            startDate: item.startDate
              ? format(new Date(item.startDate), "dd/MM/yyyy")
              : "",
            endDate: item.endDate
              ? format(new Date(item.endDate), "dd/MM/yyyy")
              : "",
            statusType: statusMap[item.statusType?.toLowerCase()] || item.statusType,
          })
        );

        setWorkflowList(workflowList)
      }

    } catch (err: any) {
      console.log(err)
      if (err.response?.data?.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
      }
    }
  }, [])

  const handleScroolSeeMore = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    const isEndScrool = ((element.scrollHeight - element.scrollTop) - 50) <= element.clientHeight

    if (isEndScrool && !isLoading) {
      setIsPagination(true)
    }
  }


  return (
    <Container onScroll={handleScroolSeeMore} ref={scrollRef}>
   
       <HeaderPage />

      <Content>
   

      <Header>
        <div>
          <h1>Painel de Workflows</h1>
        </div>
        <div className="right">
          <input type="search" placeholder="Pesquisar workflow, cliente, tag..." />
          
           <button type="button" className='buttonClick'>
           Alternar: Kanban / Lista
           </button>

        </div>
      </Header>

      <Grid>
        <Sidebar>
          <h5>Filtros rápidos</h5>

         <div className="section">
          <label>Status</label>
          <div className="chips">
            {statuses.map((status) => (
              <button
                key={status.label}
                className={`chip ${selected === status.label ? "active" : ""}`}
                style={{
                  background: status.color,
                  borderColor: status.border,
                }}
                onClick={() => setSelected(status.label)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

          <div className="section">
            <label>Responsável</label>

            <Select
              isClearable
              isSearchable
              name="responsavel1"
              placeholder="Selecione"
              options={userList.map((user) => ({
                value: user.id,
                label: user.value,
              }))}
              styles={selectStyles}
              menuPortalTarget={document.body}
            />

          </div>

          <div className="section">
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
              styles={selectStyles}
              menuPortalTarget={document.body}
            />  

          </div>

          <div className="section">
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
                          //setTriggerActionsMap({});
                        }}
                      >
                        {<RiEraserLine />}
                      </button>
                    )}
                  </Process>

          </div>


        </Sidebar>

        <Main>
          <div className="columns">


<section>
  <KanbanCard onDragOverCapture={(e) => e.preventDefault()}>
    <header>
      Em andamento &nbsp;&nbsp;
    </header>

    {workflowList
      .filter((item) => item.statusType === "Em andamento")
      .map((item) => (
        <>
        <div className="totalHeader">
              {item.name}
        </div>

        <BusinessCard key={item.workflowexecId}>
            
          <p>
            <label>Processo:</label> {item.matter}
          </p>
          <p>
            <label>Cliente:</label> {item.customer}
          </p>
          <p>
            <label>Início:</label> {item.startDate}
          </p>
        </BusinessCard>
        </>
      ))}
  </KanbanCard>
</section>


<section>
  <KanbanCard onDragOverCapture={(e) => e.preventDefault()}>
    <header>
      Atraso &nbsp;&nbsp;
    </header>

    {workflowList
      .filter((item) => item.statusType === "Atraso")
      .map((item) => (
        <>
        <div className="totalHeader">
              {item.name}
        </div>

        <BusinessCard key={item.workflowexecId}>
            
          <p>
            <label>Processo:</label> {item.matter}
          </p>
          <p>
            <label>Cliente:</label> {item.customer}
          </p>
          <p>
            <label>Início:</label> {item.startDate}
          </p>
        </BusinessCard>
        </>
      ))}
  </KanbanCard>
</section>
         

<section>
  <KanbanCard onDragOverCapture={(e) => e.preventDefault()}>
    <header>
      Concluído &nbsp;&nbsp;
    </header>

    {workflowList
      .filter((item) => item.statusType === "Concluído")
      .map((item) => (
        <>
        <div className="totalHeader">
              {item.name}
        </div>

        <BusinessCard key={item.workflowexecId}>
            
          <p>
            <label>Processo:</label> {item.matter}
          </p>
          <p>
            <label>Cliente:</label> {item.customer}
          </p>
          <p>
            <label>Início:</label> {item.startDate}
          </p>
        </BusinessCard>
        </>
      ))}
  </KanbanCard>
</section>


          </div>
        </Main>
      </Grid>

     {openSelectProcess === 'Open' ? <GridSelectProcess /> : null}  
  </Content>


    </Container>
  );
};
