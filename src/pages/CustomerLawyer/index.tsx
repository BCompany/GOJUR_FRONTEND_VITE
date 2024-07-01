/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
import '@fullcalendar/react/dist/vdom';
import React, {
  useCallback,
  UIEvent,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
} from 'react';
import { Tab, Tabs } from 'Shared/styles/Tabs';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import {
  FaFolderOpen,
  FaCalendarAlt,
  FaPowerOff,
  FaRegTimesCircle,
} from 'react-icons/fa';
import { FiSearch, FiX } from 'react-icons/fi';
import api from 'services/api';
import FullCalendar from '@fullcalendar/react';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { IMatterLawyerData } from 'pages/Dashboard/MainViewContent/pages/Customer/Interfaces/iICustomerLawyer';
import { IFullCalendar } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { Overlay } from 'Shared/styles/GlobalStyle';
import interactionPlugin from '@fullcalendar/interaction';
import { FormatDate } from 'Shared/utils/commonFunctions';
import { IMatterFollowData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import FileComponent from 'pages/Dashboard/MainViewContent/pages/Matter/EditComponents/File';
import ptbr from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useDefaultSettings } from 'context/defaultSettings';
import { format } from 'date-fns';
import Search from 'components/Search';
import TopNavBar from 'components/HeaderPage/TopNavBar';
import {
  Container,
  Content,
  MatterCard,
  DropArea,
  Divisor,
  ModalDateSelect,
} from './styles';

const CustomerLawyer = () => {
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const history = useHistory();
  const { handleUserPermission, permission } = useDefaultSettings();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPagination, setIsPagination] = useState<boolean>(false);
  const [isEndPage, setIsEndPage] = useState<boolean>(false);
  const [term, setTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [calendarList, setCalendarList] = useState<IFullCalendar[]>([]);
  const [showMatterTab, setShowMatterTab] = useState<boolean>(true);
  const [showEventTab, setShowEventTab] = useState<boolean>(false);
  const [matterList, setMatterList] = useState<IMatterLawyerData[]>([]);

  // DATE SELECT
  const [openModalDateSelect, setOpenModalDateSelect] =
    useState<boolean>(false);
  const [selectDateStart, setSelectDateStart] = useState<string>('');
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    LoadMatter();
  }, []);

  useEffect(() => {
    if (page > 1 && isPagination) {
      LoadMatter();
    }
  }, [isPagination, page]);

  const LoadMatter = async (state = '') => {
    try {
      const pageNumber = state === 'initialize' ? 1 : page;

      setIsLoading(true);

      const response = await api.get<IMatterLawyerData[]>(
        'ProcessoCliente/Listar',
        {
          params: {
            page: pageNumber,
            rows: 10,
            filterClause: term,
            token,
          },
        },
      );

      console.clear();
      console.log(response.data);

      if (!isPagination) {
        setMatterList(response.data);
      } else {
        setMatterList([...matterList, ...response.data]);
        if (response.data.length == 0) {
          setIsEndPage(true);
        }
      }

      setPage(pageNumber);
      setIsPagination(false);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setIsPagination(false);

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message,
      });
    }
  };

  const LoadEvents = useCallback(async () => {
    try {
      const response = await api.get<IFullCalendar[]>(
        'CompromissoCliente/Listar',
        {
          params: {
            start: startDate,
            end: endDate,
            token,
          },
        },
      );

      setCalendarList(response.data);

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setShowEventTab(false);

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message,
      });
    }
  }, [startDate, endDate]);

  const LoadFollowsList = async (matter: IMatterLawyerData) => {
    try {
      if (!matter) {
        return;
      }

      setIsLoading(true);

      const response = await api.get<IMatterFollowData[]>(
        '/ProcessoAcompanhamento/ListarAcompanhamentos',
        {
          params: {
            matterId: matter.cod_Processo,
            count: matter.followList.length,
            filter: 'public',
            token,
          },
        },
      );

      if (response.data.length == 0) {
        setIsLoading(false);

        addToast({
          type: 'info',
          title: 'Não há registros',
          description: `Não foram encontrados novos andamentos para exibição`,
        });

        return;
      }

      const newData = matterList.map(item =>
        item.cod_Processo === matter.cod_Processo
          ? {
              ...item,
              followList: [...item.followList, ...response.data],
            }
          : item,
      );

      setMatterList(newData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: 'Nao foi possível carregar os andamentos deste processso',
      });
    }
  };

  const handleTabs = async (tabActive: string) => {
    setIsLoading(true);

    if (tabActive == 'matter') {
      setShowMatterTab(true);
      setShowEventTab(false);
      setIsLoading(false);
    }

    if (tabActive == 'events') {
      LoadEvents();

      setShowMatterTab(false);
      setShowEventTab(true);
    }

    if (tabActive == 'logout') {
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    signOut();

    addToast({
      type: 'success',
      title: 'Sessão encerrada',
      description: 'Sua sessão foi encerrada com sucesso',
    });

    history.push('/');

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) LoadEvents();
  }, [startDate, endDate, isLoading, LoadEvents]);

  const buttonsCalendarLabel = {
    dayGridMonth: 'Mês',
    timeGridWeek: 'Semana',
    dayGridWeek: 'Lista Sem',
    timeGridDay: 'Dia',
    listDay: 'Lista Dia',
    today: 'Hoje',
  };

  const handleDatesChange = (e: any) => {
    const sDate = format(e.start, 'yyyy-MM-dd');
    const eDate = format(e.end, 'yyyy-MM-dd');

    setStartDate(sDate);
    setEndDate(eDate);
  };

  const handleDescription = useCallback(
    (follow, matterId, showAll: boolean) => {
      const matter = matterList.find(item => item.cod_Processo == matterId);
      if (matter) {
        // updates follow list
        const newFollowData = matter.followList.map(item =>
          item.id === follow.id
            ? {
                ...item,
                showAll,
              }
            : item,
        );

        // update folow list correspondend your matter
        const newData = matterList.map(item =>
          item.cod_Processo === matterId
            ? {
                ...item,
                followList: newFollowData,
              }
            : item,
        );

        setMatterList(newData);
      }
    },
    [matterList],
  );

  const handleScrool = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || matterList.length == 0) return;

    const isEndScrool =
      element.scrollHeight - element.scrollTop - 50 <= element.clientHeight;

    if (isEndScrool && !isLoading) {
      setIsLoading(true);
      setIsPagination(true);
      setPage(page + 1);
    }
  };

  const handleReloadPage = () => {
    setIsLoading(true);
    setMatterList([]);
    LoadMatter('initialize');
  };

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
  };

  const selectDate = () => {
    setSelectDateStart('');
    setOpenModalDateSelect(true);
  };

  const CloseDateSelect = () => {
    setOpenModalDateSelect(false);
    setSelectDateStart('');
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

  const ApplyDateSelect = (e: any) => {
    setOpenModalDateSelect(false);
    setSelectDateStart('');
    calendarRef.current._calendarApi.gotoDate(e);
  };

  return (
    <Container>
      <Content onScroll={handleScrool} ref={scrollRef}>
        <div className="header">
          <div className="userName">
            <button
              type="button"
              title="Sair"
              className="buttonTabInactive"
              onClick={() => handleSignOut()}
            >
              {/* <FaPowerOff /> */}
            </button>
            {localStorage.getItem('@GoJur:companyId')}
            {' - '}
            {localStorage.getItem('@GoJur:name')}
          </div>

          {!showEventTab && (
            <div className="search">
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
                    handleReloadPage();
                  }
                }}
                onChange={e => {
                  setTerm(e.target.value);
                }}
                handleRequest={handleReloadPage}
                icon={FiSearch}
                placeholder="Procurar processos"
                name="search"
                style={{ marginTop: '-3px' }}
              />
            </div>
          )}
        </div>

        <Tabs>
          <div>
            <button
              type="button"
              title="Visualizar processos"
              className={
                showMatterTab ? 'buttonTabActive' : 'buttonTabInactive'
              }
              onClick={() => handleTabs('matter')}
            >
              <FaFolderOpen />
              Processos
            </button>

            <button
              type="button"
              title="Visualizar agenda"
              className={showEventTab ? 'buttonTabActive' : 'buttonTabInactive'}
              onClick={() => handleTabs('events')}
            >
              <FaCalendarAlt />
              Compromissos
            </button>

            <button
              type="button"
              title="Sair"
              className="buttonTabInactive"
              onClick={() => handleTabs('logout')}
            >
              <FaPowerOff />
              Sair
            </button>
          </div>

          <Tab active={showMatterTab}>
            {matterList.map(matter => {
              return (
                <>
                  <MatterCard key={`matterId_${matter.cod_Processo}`}>
                    <header>
                      <FaFolderOpen />
                      <span>Pasta:</span>
                      {matter.cod_Pasta}
                    </header>

                    <div>
                      <section>
                        <span>Processo:</span>
                        {matter.num_Processo}
                      </section>

                      <section>
                        <span>Partes:</span>
                        {`${matter.nomeClientePrincipal} X ${matter.nomeContrarioPrincipal}`}
                      </section>

                      <section>
                        {matter.isMatterLegal && <span>Ação Judicial:</span>}
                        {!matter.isMatterLegal && <span>Assunto:</span>}
                        {matter.des_AcaoJudicial}
                      </section>
                    </div>

                    <div className="followList">
                      <header>
                        {matter.followList.length > 0 && (
                          <span>Andamentos</span>
                        )}
                      </header>

                      {matter.followList.map(follow => (
                        <section>
                          <span>Data:</span>
                          {!(follow.showAll ?? false) &&
                            `${FormatDate(
                              new Date(follow.date),
                              'dd/MM/yyyy',
                            )} - ${
                              follow.description.length > 1000
                                ? follow.description.substring(0, 1000)
                                : follow.description
                            }`}
                          {(follow.showAll ?? false) &&
                            `${FormatDate(
                              new Date(follow.date),
                              'dd/MM/yyyy',
                            )} - ${follow.description}`}

                          {!follow.showAll &&
                            follow.description.length > 1000 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDescription(
                                    follow,
                                    matter.cod_Processo,
                                    true,
                                  )
                                }
                              >
                                Ver Mais
                              </button>
                            )}

                          {follow.showAll &&
                            follow.description.length > 1000 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDescription(
                                    follow,
                                    matter.cod_Processo,
                                    false,
                                  )
                                }
                              >
                                Ver Menos
                              </button>
                            )}
                        </section>
                      ))}

                      {matter.followList.length > 0 && (
                        <footer>
                          <FaFolderOpen
                            onClick={() => LoadFollowsList(matter)}
                          />
                          &nbsp;
                          <button
                            type="button"
                            className="buttonLinkClick"
                            onClick={() => LoadFollowsList(matter)}
                          >
                            Ver mais Andamentos
                          </button>
                        </footer>
                      )}
                    </div>
                  </MatterCard>

                  <DropArea>
                    <FileComponent
                      matterId={matter.cod_Processo}
                      load
                      sharedFile
                      fromModal=""
                    />
                  </DropArea>

                  <Divisor />
                </>
              );
            })}

            {matterList.length == 0 && !isLoading && (
              <div className="messageEmpty">
                <FaFolderOpen />
                Nenhum processo foi encontrado
              </div>
            )}
          </Tab>

          <Tab active={showEventTab}>
            <FullCalendar
              ref={calendarRef}
              locale={ptbr}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              events={calendarList}
              buttonText={buttonsCalendarLabel}
              datesSet={e => handleDatesChange(e)}
              showNonCurrentDates
              eventContent={renderAppointmentCell}
              displayEventTime={false}
              views={{ dayGridMonth: { dayMaxEventRows: 7 } }}
              height="90vh"
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
          </Tab>
        </Tabs>

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

            <div style={{ marginLeft: '35%', width: '150px', float: 'left' }}>
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

            <div style={{ float: 'left', width: '150px', marginLeft: '70px' }}>
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
      </Content>

      {isLoading && (
        <>
          <Overlay />
          <div className="waitingMessage">
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}
    </Container>
  );
};

export default CustomerLawyer;
