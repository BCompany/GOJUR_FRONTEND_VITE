import React, { ChangeEvent, useCallback, useEffect, useRef, useState, UIEvent } from 'react'
import { Container, Header, Grid, Sidebar, Main, Card, CardHeader, KanbanCard, BusinessCard } from './styles';
import { AppointmentPropsSave, AppointmentPropsDelete, SelectValues, Data, dataProps, LembretesData, MatterData, ModalProps, ResponsibleDTO, Settings, ShareListDTO, userListData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import api from 'services/api';
import Select from 'react-select'


  
export default function PainelWorkflows() {
  
const userToken = localStorage.getItem('@GoJur:token');
const [userList, setUserList] = useState<userListData[]>([]);


  useEffect(() => {
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


  return (
    <Container>
      <Header>
        <div>
          <h1>Painel de Workflows</h1>
          <p>Visão rápida — filtros à esquerda, resultado à direita.</p>
        </div>
        <div className="right">
          <input type="search" placeholder="Pesquisar workflow, cliente, tag..." />
          <button>Alternar: Kanban / Lista</button>
        </div>
      </Header>

      <Grid>
        <Sidebar>
          <h5>Filtros rápidos</h5>

          <div className="section">
            <label>Status</label>
            <div className="chips">
              <span className="chip">Todos</span>
              <span className="chip" style={{ background: "#fef3c7", borderColor: "#fde68a" }}>
                Em andamento
              </span>
              <span className="chip" style={{ background: "#ffe4e6", borderColor: "#fecdd3" }}>
                Atrasado
              </span>
              <span className="chip" style={{ background: "#d1fae5", borderColor: "#a7f3d0" }}>
                Concluído
              </span>
            </div>
          </div>

          <div className="section">
            <label>Responsável</label>
            {/*}
            <select>
              <option>Todos</option>
              <option>Mariana</option>
              <option>Rafael</option>
              <option>Luiza</option>
            </select>
              */}

                                            <Select
                                              isMulti
                                              name={`responsavel1`}
                                              placeholder="Selecione"
                                              options={userList.map((user) => ({
                                                value: user.id,
                                                label: user.value,
                                              }))}
                                              
                                              styles={{
                                                control: (base) => ({
                                                  ...base,
                                                  width: "215px",
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

          </div>

          <div className="section">
            <label>Cliente</label>
            <select>
              <option>Todos</option>
              <option>Mariana</option>
              <option>Rafael</option>
              <option>Luiza</option>
            </select>
          </div>

       

        </Sidebar>

        <Main>
          <div className="columns">

        <section>
            <KanbanCard
              onDragOverCapture={(e) => e.preventDefault()}
            >

              <header>
                Em andamento
                &nbsp;&nbsp;
              </header>

              <div className="totalHeader">
                Data Sentença
              </div>

              <BusinessCard>
              
                    <p>
                      <label>Processo:</label>
                      
                    </p>
                 
                    <p>
                      <label>Cliente:</label>
                      
                    </p>

                    <p>
                      <label>Início:</label>
                      
                    </p>

              </BusinessCard>

            </KanbanCard>
        </section>

        <section>
       
            <KanbanCard
              onDragOverCapture={(e) => e.preventDefault()}
            >

              <header>
                Atraso
                &nbsp;&nbsp;
              </header>

               <div className="totalHeader">
                Prazo Judicial
              </div>

                 <BusinessCard>
              
                    <p>
                      <label>Processo:</label>
                      
                    </p>
                 
                    <p>
                      <label>Cliente:</label>
                      
                    </p>

                    <p>
                      <label>Início:</label>
                      
                    </p>

              </BusinessCard>

            </KanbanCard>
        </section>
          
        <section>
       
            <KanbanCard
              onDragOverCapture={(e) => e.preventDefault()}
            >

              <header>
                Concluído
                &nbsp;&nbsp;
              </header>

              <div className="totalHeader">
                Pós Prazo Judicial
              </div>

                <BusinessCard>
              
                    <p>
                      <label>Processo:</label>
                      
                    </p>
                 
                    <p>
                      <label>Cliente:</label>
                      
                    </p>

                    <p>
                      <label>Início:</label>
                      
                    </p>

              </BusinessCard>

            </KanbanCard>
        </section>
           


          

          </div>
        </Main>
      </Grid>
    </Container>
  );
};
