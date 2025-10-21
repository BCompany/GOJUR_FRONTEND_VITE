import React, { useState, useEffect } from "react";
import { Container, Header, Grid, Sidebar, Main, Card, CardHeader, KanbanCard, BusinessCard } from './styles';

const PainelWorkflows: React.FC = () => {
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
            <select>
              <option>Todos</option>
              <option>Mariana</option>
              <option>Rafael</option>
              <option>Luiza</option>
            </select>
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

          <div className="section">
            <label>Prioridade</label>
            <div className="chips">
              <button className="chip">Todas</button>
              <button className="chip">Alta</button>
              <button className="chip">Média</button>
              <button className="chip">Baixa</button>
            </div>
          </div>

          <div className="text-note">
            Dica: clique em múltiplos chips para combinar filtros.
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
                      <label>Inclusão:</label>
                      
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
                      <label>Inclusão:</label>
                      
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
                      <label>Inclusão:</label>
                      
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

export default PainelWorkflows;