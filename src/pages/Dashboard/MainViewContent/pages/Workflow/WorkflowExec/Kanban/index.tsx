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
import { useHistory, useLocation } from 'react-router-dom'
import DatePicker from 'components/DatePicker';
import { FormatCurrency, selectStyles, useDelay, FormatDate } from 'Shared/utils/commonFunctions';
import { FcEditImage, FcSearch, FcAbout, FcCancel, FcPlus, FcDeleteDatabase } from 'react-icons/fc';
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { FaFileAlt, FaAngleLeft  } from 'react-icons/fa'

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

  const history = useHistory();
  const { addToast } = useToast();
  const [userList, setUserList] = useState<userListData[]>([]);
  const [customerList, setCustomerList] = useState<ISelectData[]>([])
  const [customer, setCustomer] = useState(null);
  const [processTitle, setProcessTitle] = useState('Filtrar Processo');
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
  const [workflowExecStartDate, setWorkflowExecStartDate] = useState<string>(FormatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd'))
  //const [workflowExecStartDate, setWorkflowExecStartDate] = useState<Date | null>(null);
  const [matterRedirect, setMatterRedirect] = useState<boolean>(false)
  const [customerRedirect, setCustomerRedirect] = useState<boolean>(false)
  const [publicationRedirect, setPublicationRedirect] = useState<boolean>(false)
  const [workflowExecKanbanRedirectRedirect, setWorkflowExecKanbanRedirectRedirect] = useState<boolean>(false)
  const [calendarRedirect, setCalendarRedirect] = useState<boolean>(false)
  const token = localStorage.getItem('@GoJur:token');
 const [matterFileId, setMatterFileId] = useState('');
  const [customerFileId, setCustomerFileId] = useState('');


  const [filters, setFilters] = useState({
    status: 'Todos',
    responsavel: '',
    cliente: '',
    processo: '',
    inicio: '',
  });


  useEffect(() => {
    LoadPerson();
    LoadUserList();

  }, [])


  const Initialize = async () => {

    //if(localStorage.getItem('@Gojur:matterRedirect') == null && localStorage.getItem('@Gojur:customerRedirect') == null && localStorage.getItem('@Gojur:calendarRedirect') == null ) return;

    const redirectByMatter = localStorage.getItem('@Gojur:matterRedirect')
    if (redirectByMatter == "S") {
      setMatterRedirect(true)
      setMatterFileId(localStorage.getItem('@Gojur:matterId'))  
      //localStorage.removeItem('@Gojur:matterId')
      localStorage.removeItem('@Gojur:matterRedirect')

    }

    const redirectByCustomer = localStorage.getItem('@Gojur:customerRedirect')
    if (redirectByCustomer == "S") {
      setCustomerRedirect(true)
      setCustomerFileId(localStorage.getItem('@Gojur:customerId'))  
      //localStorage.removeItem('@Gojur:customerId')  
      localStorage.removeItem('@Gojur:customerRedirect')
    }

    const redirectByPublication = localStorage.getItem('@Gojur:publicationRedirect')
    if (redirectByPublication == "S") {
      setPublicationRedirect(true)
      localStorage.removeItem('@Gojur:publicationRedirect')
    }

    const redirectByWorkflowExecKanban = localStorage.getItem('@Gojur:workflowExecKanbanRedirect')
    if (redirectByWorkflowExecKanban == "S") {
      setWorkflowExecKanbanRedirectRedirect(true)
      localStorage.removeItem('@Gojur:workflowExecKanbanRedirect')
    }

    //const redirectByCalendar = localStorage.getItem('@Gojur:calendarRedirect') 
    const redirectByCalendar = "S"
    if (redirectByCalendar == "S") {
      setCalendarRedirect(true);
      //localStorage.removeItem('@Gojur:calendarRedirect')
    }

  }

  const LoadUserList = useCallback(async () => {
    try {
      const response = await api.post<userListData[]>(
        `/Compromisso/ListarUsuariosETimes`,
        {
          userName: '',
          token,
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
    if (processTitle === 'Filtrar Processo') {
      handleSelectProcess('Open');
      //setTriggerActionsMap({});
    }
  }, [handleSelectProcess, processTitle]);


  const handleSelectWorkflow = useCallback((workflowExecId: Number, customer: String) => {
    localStorage.setItem('@Gojur:customer', customer);
    history.push('../workflowexec/edit/' + workflowExecId);

  }, []);

  useEffect(() => {
    if (matterSelected !== null && processTitle === 'Filtrar Processo') {

      setProcessTitle(`${matterSelected.matterNumber} - ${(matterSelected.matterFolder != null ? "-" : "")} ${matterSelected.matterCustomerDesc} - ${matterSelected.matterOppossingDesc}`,);

      api.post<IMatterData>('/Processo/SelecionarProcesso', {
        matterId: matterSelected.matterId,
        token,
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey')
      })
        .then(response => {
          const matterType = response.data.typeAdvisorId == null ? 'legal' : 'advisory'
          //const url = `/matter/edit/${matterType}/${matterSelected.matterId}`
          const url = `###`
          setRedirectLink(url)
          setCompleteLink(true)


          const newFilters = { ...filters, processo: matterSelected.matterId };
          setFilters(newFilters);
          LoadWorkflow('initialize', newFilters);


        })
    }
    else {
      setProcessTitle('Filtrar Processo');

    }
  }, [matterSelected, dateEnd]);


  const statuses = [
    { label: "Todos", color: "#fff", border: "#d1d5db" },
    { label: "Em andamento", color: "#fef3c7", border: "#fde68a" },
    { label: "Atrasado", color: "#ffe4e6", border: "#fecdd3" },
    { label: "Concluído", color: "#d1fae5", border: "#a7f3d0" },
  ];


/*
  useEffect(() => {
    const setup = async () => {
      await LoadWorkflow('initialize');

    };

    setup();

  }, []);
*/


  const LoadWorkflow = useCallback(
    async (state = '', customFilters = filters) => {
      try {
        const token = localStorage.getItem('@GoJur:token');

        const page = 1;

        const filterParams: string[] = [];

        // Monta os filtros dinamicamente
        if (customFilters.status && customFilters.status !== 'Todos')
          filterParams.push(`status=${customFilters.status}`);

        if (customFilters.responsavel)
          filterParams.push(`userAssigned=${customFilters.responsavel}`);

        if (customFilters.cliente)
          filterParams.push(`customer=${customFilters.cliente}`);

        if (customFilters.processo)
          filterParams.push(`matter=${customFilters.processo}`);

        console.log(customFilters.inicio);
        if (customFilters.inicio)
          filterParams.push(`startDate=${customFilters.inicio}`);

        const filterClause = filterParams.join(', ');

        const response = await api.get<IWorkflowData[]>('/WorkflowExec/ListarExec', {
          params: {
            page,
            rows: 9999,
            filterClause,
            token,
          },
        });

        const statusMap: Record<string, string> = {
          emandamento: 'Em andamento',
          atraso: 'Atraso',
          concluido: 'Concluído',
        };

        const formattedData = response.data.map((item) => ({
          ...item,
          startDate: item.startDate
            ? format(new Date(item.startDate), 'dd/MM/yyyy')
            : '',
          endDate: item.endDate
            ? format(new Date(item.endDate), 'dd/MM/yyyy')
            : '',
          statusType: statusMap[item.statusType?.toLowerCase()] || item.statusType,
        }));

        if (!isPagination || state === 'initialize') {
          setWorkflowList(formattedData);
        } else {
          setWorkflowList((prev) => [...prev, ...formattedData]);
        }
      } catch (err: any) {
        console.log(err);
        if (err.response?.data?.statusCode === 1002) {
          addToast({
            type: 'info',
            title: 'Permissão negada',
            description:
              'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
          });
        }
      }
    },
    [isPagination, filters]
  );



  const handleScroolSeeMore = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    const isEndScrool = ((element.scrollHeight - element.scrollTop) - 50) <= element.clientHeight

    if (isEndScrool && !isLoading) {
      setIsPagination(true)
    }
  }


  const handleStatusClick = (status: string) => {
    // Mapeia o label do botão para o valor que o backend espera
    const statusMap: Record<string, string> = {
      'Em andamento': 'EMANDAMENTO',
      'Atrasado': 'ATRASO',
      'Concluído': 'CONCLUIDO',
      'Todos': '', // opcional: vazio para pegar todos
    };

    const backendStatus = statusMap[status] || '';

    const newFilters = { ...filters, status: backendStatus };
    setFilters(newFilters);

    console.log('Filtros atualizados:', newFilters);

    LoadWorkflow('initialize', newFilters);
  };


  const handleList = async () => {
    try {
      await api.post('/Parametro/Salvar', {
        parametersName: '#WORKFLOWVIEW',
        parameterType: 'P',
        parameterValue: 'LISTA',
        token,
      });

      selectProcess(null)

      if (matterRedirect == true) {
        localStorage.setItem('@Gojur:matterRedirect', "S")
      }
      if (customerRedirect == true) {
        localStorage.setItem('@Gojur:customerRedirect', "S")
      }
      if (publicationRedirect == true) {
        localStorage.setItem('@Gojur:publicationRedirect', "S")
      }

      history.push('/workflowexec/list')

    } catch (error) {
      console.error('Erro ao salvar parâmetro:', error);
    }

  };

  const handleWorkflowExecStartDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setWorkflowExecStartDate(event.target.value)
  }, [workflowExecStartDate])


  useEffect(() => {
    const setup = async () => {

      const newFilters = { ...filters, inicio: workflowExecStartDate };

      setFilters(newFilters);

      console.log('Filtros atualizados:', newFilters);

      await Initialize();

      await LoadWorkflow('initialize', newFilters);

    };

    setup();

  }, [workflowExecStartDate]);



  const handleCancel = () => {
    console.log('MatterRedirect: ', matterRedirect)

    if (matterRedirect) {
      history.push('../../../matter/list')
    }
    else if (customerRedirect) {
      history.push('../customer/list')
    } else if (publicationRedirect) {
      history.push('../publication')
    }
    //else if (workflowExecKanbanRedirectRedirect){ 
    //  history.push('../workflowexec/kanban')
    //}
    else if (calendarRedirect) {
      history.push('../calendar')
    }

  }

  const handleWorkflow = () => {

    localStorage.setItem('@Gojur:matterId', matterFileId ); 
    localStorage.setItem('@Gojur:customerId', customerFileId ); 

    history.push('/WorkflowExec/edit/0')

  };

  return (
    <Container onScroll={handleScroolSeeMore} ref={scrollRef}>

      <HeaderPage />

      <Content>


        <Header>
          <div>
            <h1>Painel de Workflows</h1>
          </div>
          <div className="right">


            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
              <DatePicker
                title=""
                onChange={(date: Date | null) => {

                  handleWorkflowExecStartDate(date);

                  const newFilters = { ...filters, inicio: date.target.value };

                  setFilters(newFilters);

                  console.log('Filtros atualizados:', newFilters);

                  LoadWorkflow('initialize', newFilters);
                }}
                value={workflowExecStartDate}
                style={{ width: '170px' }}
              />

              <FcSearch
                className='infoButton'
                title='Altere o calendário para recarregar a página com base na nova data de início informada'
                // onClick={() => LoadPage()}
                style={{ cursor: 'pointer', fontSize: '20px' }}
              />
            </div>

            <button type="button" className='buttonClick' onClick={() => handleList()}>
              Alternar: Kanban / Lista
            </button>

            <button
              className="buttonClick"
              title="Clique para incluir um Workflow"
              type="submit"
              onClick={() =>handleWorkflow()}
            >
              <FaFileAlt />
              Iniciar Novo Workflow
            </button>

            <button
              className="buttonClick"
              title="Clique para retornar"
              type="submit"
              onClick={handleCancel}
            >
              <FiArrowLeft />
              Retornar
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
                    onClick={() => { setSelected(status.label); handleStatusClick(status.label); }}
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
                value={
                  userList
                    .map((user) => ({ value: user.id, label: user.value }))
                    .find((u) => u.value === filters.responsavel) || null
                }
                onChange={(option) => {
                  const newFilters = { ...filters, responsavel: option?.value || '' };
                  setFilters(newFilters);
                  LoadWorkflow('initialize', newFilters);
                }}
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
                placeholder="&nbsp;&nbsp;Selecione"
                options={customerList}
                getOptionValue={(option) => option.id}
                getOptionLabel={(option) => option.label}
                value={customer}
                onChange={(option) => {
                  setCustomer(option);

                  const newFilters = { ...filters, cliente: option?.id || '' };
                  setFilters(newFilters);
                  LoadWorkflow('initialize', newFilters);
                }}
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

                {processTitle === 'Filtrar Processo' && (
                  <button
                    type="button"
                    id="associar"
                    onClick={handleGridSelectProcess}
                  >
                    <p>{processTitle}</p>
                  </button>
                )}
                {processTitle !== 'Filtrar Processo' && (
                  <>
                    {completeLink && (
                      <a href={redirectLink}>
                        <p>{processTitle}</p>
                      </a>
                    )}
                  </>
                )}
                {processTitle === 'Filtrar Processo' && (
                  <button
                    type="button"
                    onClick={handleGridSelectProcess}
                  >
                    <RiFolder2Fill />
                  </button>
                )}

                {processTitle !== 'Filtrar Processo' && (
                  <button
                    type="button"
                    onClick={() => {
                      setProcessTitle('Filtrar Processo');
                      const newFilters = { ...filters, processo: null };
                      setFilters(newFilters);
                      LoadWorkflow('initialize', newFilters);
                      selectProcess(null)
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

                        <BusinessCard key={item.workflowexecId} onClick={() => handleSelectWorkflow(item.workflowexecId, item.customer )}>

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

                        <BusinessCard key={item.workflowexecId} onClick={() => handleSelectWorkflow(item.workflowexecId, item.customer)}>

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

                        <BusinessCard key={item.workflowexecId} onClick={() => handleSelectWorkflow(item.workflowexecId, item.customer)}>

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
