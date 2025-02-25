import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useHistory } from 'react-router-dom';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { BsFunnel } from 'react-icons/bs';
import { FcApproval, FcCancel } from 'react-icons/fc';
import { MdWarning } from 'react-icons/md';
import { Container, Table, Center, TollBar } from './styles';
import { MultiSelect } from 'react-multi-select-component';
import { filterProps } from '../../Interfaces/ICalendar';

interface StatusOperationDTO {
  id: string;
  description: string;
  enabled: string;
  state: string;
  secretJustice: string;
  statusOperation: string;
  scrapperAlias: string;
  isRelevant: string;
  instance: string;
}

const Monitoring: React.FC = () => {
  const history = useHistory();
  const [primaryInstanceListBase, setPrimaryInstanceListBase] = useState<StatusOperationDTO[]>([]);
  const [primaryInstanceList, setPrimaryInstanceList] = useState<StatusOperationDTO[]>([]);
  
  const [superiorInstanceListbase, setSuperiorInstanceListBase] = useState<StatusOperationDTO[]>([]);
  const [superiorInstanceList, setSuperiorInstanceList] = useState<StatusOperationDTO[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [desUF, setDesUF] = useState<string>('00');
  const [secretJustice, setSecretJustice] = useState<string>('00');
  const [multiFilter, setMultiFilter] = useState<filterProps[]>([]);


  useEffect(() => {
    LoadStatusOperation();
  }, []);


  useEffect(() => {}, [multiFilter]);


  async function LoadStatusOperation() {
    const response = await api.get<StatusOperationDTO[]>(
      '/LegalData/StatusOperacao',
      {
        params: { token },
      },
    );

    // Get all 1º and 2º instance dataSources - remove all court that not correspond from 1º and 2º instance besidesa TJTO tha we do not covery
    setPrimaryInstanceListBase(
      response.data.filter(
        x =>
          x.isRelevant == 'S' &&
          x.scrapperAlias != 'TJTO' &&
          x.scrapperAlias != 'STF' &&
          x.scrapperAlias != 'STJ' &&
          x.scrapperAlias != 'TST',
      ),
    );
    setPrimaryInstanceList(
      response.data.filter(
        x =>
          x.isRelevant == 'S' &&
          x.scrapperAlias != 'TJTO' &&
          x.scrapperAlias != 'STF' &&
          x.scrapperAlias != 'STJ' &&
          x.scrapperAlias != 'TST',
      ),
    );

    // Get all superior dataSources (STF, STJ, TST)
    setSuperiorInstanceListBase(
      response.data.filter(
        x => x.scrapperAlias == 'STF' || x.scrapperAlias == 'TST',
      ),
    );

    setSuperiorInstanceList(
      response.data.filter(
        x => x.scrapperAlias == 'STF' || x.scrapperAlias == 'TST',
      ),
    );

    setIsLoading(false);
  }


  const Filter = useCallback(() => {
    const filterList1: StatusOperationDTO[] = [];
    const filterList2: StatusOperationDTO[] = [];

    multiFilter.map(itemMult => {
      if (desUF === '00' && itemMult.value === 'SJ') {
        primaryInstanceListBase.map(item => {
          if (item.secretJustice === 'S') {
            return filterList1.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });

        superiorInstanceListbase.map(item => {
          if (item.secretJustice === 'S') {
            return filterList2.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });
      } 
      else if (desUF !== '00' && itemMult.value === 'SJ') {
        primaryInstanceListBase.map(item => {
          if (item.state === desUF && item.secretJustice === 'S') {
            return filterList1.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });

        superiorInstanceListbase.map(item => {
          if (item.secretJustice === 'S') {
            return filterList2.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });
      } 
      else if (desUF === '00' && itemMult.value === 'TM') {
        primaryInstanceListBase.map(item => {
          if (item.statusOperation === 'I') {
            return filterList1.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });

        superiorInstanceListbase.map(item => {
          if (item.statusOperation === 'I') {
            return filterList2.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });
      } 
      else if (desUF !== '00' && itemMult.value === 'TM') {
        primaryInstanceListBase.map(item => {
          if (item.state === desUF && item.statusOperation === 'I') {
            return filterList1.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });

        superiorInstanceListbase.map(item => {
          if (item.statusOperation === 'I') {
            return filterList2.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });
      }
    });

    if (multiFilter.length == 0) {
      if (desUF !== '00') {
        primaryInstanceListBase.map(item => {
          if (item.state === desUF) {
            return filterList1.push({
              id: item.id,
              description: item.description,
              enabled: item.enabled,
              state: item.state,
              secretJustice: item.secretJustice,
              statusOperation: item.statusOperation,
              scrapperAlias: item.scrapperAlias,
              isRelevant: item.isRelevant,
              instance: item.instance,
            });
          }
        });

        superiorInstanceListbase.map(item => {
          return filterList2.push({
            id: item.id,
            description: item.description,
            enabled: item.enabled,
            state: item.state,
            secretJustice: item.secretJustice,
            statusOperation: item.statusOperation,
            scrapperAlias: item.scrapperAlias,
            isRelevant: item.isRelevant,
            instance: item.instance,
          });
        });
      } 
      else if (desUF === '00') {
        primaryInstanceListBase.map(item => {
          return filterList1.push({
            id: item.id,
            description: item.description,
            enabled: item.enabled,
            state: item.state,
            secretJustice: item.secretJustice,
            statusOperation: item.statusOperation,
            scrapperAlias: item.scrapperAlias,
            isRelevant: item.isRelevant,
            instance: item.instance,
          });
        });

        superiorInstanceListbase.map(item => {
          return filterList2.push({
            id: item.id,
            description: item.description,
            enabled: item.enabled,
            state: item.state,
            secretJustice: item.secretJustice,
            statusOperation: item.statusOperation,
            scrapperAlias: item.scrapperAlias,
            isRelevant: item.isRelevant,
            instance: item.instance,
          });
        });
      }
    }

    const uniqueFilterList1 = filterList1.filter(
      (item, index, self) => index === self.findIndex(t => t.id === item.id)
    );

    const uniqueFilterList2 = filterList2.filter(
      (item, index, self) => index === self.findIndex(t => t.id === item.id)
    );

    setPrimaryInstanceList(uniqueFilterList1);

    setSuperiorInstanceList(uniqueFilterList2);

  }, [desUF, secretJustice, multiFilter]);


  if (isLoading) {
    return (
      <Container>
        <Overlay />
        <div className="waitingMessage">
          <LoaderWaiting size={15} color="var(--blue-twitter)" />
        </div>
      </Container>
    );
  }


  const optionsMonitoringFilter = [
    //{ value: '00', label: 'todos' },
    { value: 'SJ', label: 'Segredo de Justiça' },
    { value: 'TM', label: 'Tribunais em Manutenção' },
  ];


  return (
    <>
      <Container id="Container">
        <HeaderPage />
        <br />

        <TollBar id="TollBar">
          <div className="buttonReturn">
            <br />
            <button
              type="submit"
              className="buttonLinkClick"
              title="Clique para retornar a lista de processos"
              onClick={() => history.push('../../../publication')}
            >
              <AiOutlineArrowLeft />
              Retornar
            </button>
          </div>

          <div className="filters">
            <div id="DivMulti" style={{ marginTop: '-5px' }}>
              <label
                htmlFor="type"
                style={{ float: 'left', width: '200px', marginTop: '-6px' }}
              >
                Status
                <MultiSelect
                  options={optionsMonitoringFilter}
                  value={multiFilter}
                  onChange={(values: []) => {
                    setMultiFilter(values);
                  }}
                  className="select"
                  placeholder="Selecione"
                  label="Selecione"
                  overrideStrings={{
                    selectSomeItems: 'Filtragem Rápida',
                  }}
                />
              </label>
            </div>

            <label
              htmlFor="type"
              style={{ float: 'left', width: '150px', marginLeft: '50px' }}
            >
              Estado
              <select
                className="desUFSelect"
                name="type"
                value={desUF}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setDesUF(e.target.value)
                }
                style={{ backgroundColor: 'white' }}
              >
                <option value="00">TODOS</option>
                <option value="AC">ACRE</option>
                <option value="AL">ALAGOAS</option>
                <option value="AP">AMAPA</option>
                <option value="AM">AMAZONAS</option>
                <option value="BA">BAHIA</option>
                <option value="CE">CEARÁ</option>
                <option value="DF">DISTRITO FEDERAL</option>
                <option value="ES">ESPÍRITO SANTO</option>
                <option value="GO">GOIÁS</option>
                <option value="MA">MARANHÃO</option>
                <option value="MT">MATO GROSSO</option>
                <option value="MS">MATO GROSSO DO SUL</option>
                <option value="MG">MINAS GERAIS</option>
                <option value="PA">PARÁ</option>
                <option value="PB">PARAÍBA</option>
                <option value="PR">PARANÁ</option>
                <option value="PE">PERNAMBUCO</option>
                <option value="PI">PIAUÍ</option>
                <option value="RR">RORAIMA</option>
                <option value="RO">RONDÔNIA</option>
                <option value="RJ">RIO DE JANEIRO</option>
                <option value="RN">RIO GRANDE DO NORTE</option>
                <option value="RS">RIO GRANDE DO SUL</option>
                <option value="SC">SANTA CATARINA</option>
                <option value="SP">SÃO PAULO</option>
                <option value="SE">SERGIPE</option>
                <option value="TO">TOCANTINS</option>
              </select>
            </label>

            <button
              className="buttonClick"
              type="button"
              onClick={() => Filter()}
              style={{ marginTop: '18px', marginLeft: '40px' }}
            >
              <BsFunnel />
              Filtrar
            </button>
          </div>
        </TollBar>

        <Center id="Center">
          <br />
          <br />
          <div className="flex-box container-box">
            <div className="content-box">
              <p>
                Lista de abrangências dos tribunais pesquisados pelo serviço de
                monitor GOJUR (botão seguir).
              </p>
            </div>
          </div>
          <br />

          <div className="title">1º e 2º Instâncias</div>

          {/* FIRST / SECOND INSTANCE TABLE */}
          <div className="flex-box container-box">
            <div className="content-box">
              <Table id="Table1">
                <table>
                  <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>
                      Tribunal
                    </th>
                    <th style={{ width: '10%' }}>UF</th>
                    <th style={{ width: '10%' }}>Instância</th>
                    <th style={{ width: '10%' }}>Segredo Justiça</th>
                    <th style={{ width: '10%' }}>Status</th>
                  </tr>

                  {primaryInstanceList.map(item => (
                    <tr>
                      <td style={{ width: '50%', textAlign: 'left' }}>
                        {item.description}
                      </td>
                      <td style={{ width: '10%' }}>{item.state}</td>
                      <td style={{ width: '10%' }}>{`${item.instance}º`}</td>
                      <td style={{ width: '10%' }}>{item.secretJustice}</td>
                      <td style={{ width: '10%' }}>
                        {item.statusOperation?.toUpperCase() == 'A' ? (
                          <FcApproval title="Em Operação." />
                        ) : (
                          <MdWarning
                            style={{ color: '#ffff2e' }}
                            title="Esta fonte de dados está inoperante. Em caso de dúvidas entre em contato como suporte técnico GOJUR."
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </table>
              </Table>
            </div>
          </div>

          <br />

          <div className="title">Tribunais Superiores</div>

          {/* THIRDY AND FORTHY INSTANCE TABLE */}
          <div className="flex-box container-box">
            <div className="content-box">
              <Table id="Table2">
                <table>
                  <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>
                      Tribunal
                    </th>
                    <th style={{ width: '10%' }}>UF</th>
                    <th style={{ width: '10%' }}>Instância</th>
                    <th style={{ width: '10%' }}>Segredo Justiça</th>
                    <th style={{ width: '10%' }}>Status</th>
                  </tr>

                  {superiorInstanceList.map(item => (
                    <tr>
                      <td style={{ width: '50%', textAlign: 'left' }}>
                        {item.description}
                      </td>
                      <td style={{ width: '10%' }}>BR</td>
                      <td style={{ width: '10%' }}>{`${item.instance}º`}</td>
                      <td style={{ width: '10%' }}>{item.secretJustice}</td>
                      <td style={{ width: '10%' }}>
                        {item.statusOperation?.toUpperCase() == 'A' ? (
                          <FcApproval title="Em Operação." />
                        ) : (
                          <MdWarning
                            style={{ color: '#ffff2e' }}
                            title="Esta fonte de dados está inoperante. Em caso de dúvidas entre em contato como suporte técnico GOJUR."
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </table>
              </Table>
            </div>
          </div>

          <br />

          <div style={{ color: 'red' }} className="title">
            Tribunais não Atendidos
          </div>

          {/* OS TRIBUNAIS ABAIXO FORAM COLOCADOS DE FORMA FIXA POIS NO MOMENTO NÃO SÃO ATENDIDOS PELO LEGAL DATA
          FOI SUGERIDO A CRIAÇÃO DE UM STATUS ESPECÍFICO PARA ESTES CASOS, MAS FOI DEFINIDO COLOCAR DE FORMA FIXA NO CÓDIGO MESMO
          CONFORME REUNIÃO REALIZADA EM 27/02/2024: MARCELO | MATHEUS | SIDNEY */}

          {/* INATIVE INSTANCES TABLE */}
          <div className="flex-box container-box">
            <div className="content-box">
              <Table id="Table3">
                <table>
                  <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>
                      Tribunal
                    </th>
                    <th style={{ width: '10%' }}>UF</th>
                    <th style={{ width: '10%' }}>Instância</th>
                    <th style={{ width: '10%' }}>Segredo Justiça</th>
                    <th style={{ width: '10%' }}>Status</th>
                  </tr>

                  <tr>
                    <td style={{ width: '50%', textAlign: 'left' }}>
                      Tribunal de Justiça TO - EProc
                    </td>
                    <td style={{ width: '10%' }}>TO</td>
                    <td style={{ width: '10%' }}>1 e 2º</td>
                    <td style={{ width: '10%' }}>N</td>
                    <td style={{ width: '10%' }}>
                      <FcCancel title="Esta fonte de dados não faz parte da cobertura de robôs do Gojur" />
                    </td>
                  </tr>

                  <tr>
                    <td style={{ width: '50%', textAlign: 'left' }}>
                      Superior Tribunal de Justiça - STJ
                    </td>
                    <td style={{ width: '10%' }}>BR</td>
                    <td style={{ width: '10%' }}>3º</td>
                    <td style={{ width: '10%' }}>N</td>
                    <td style={{ width: '10%' }}>
                      <FcCancel title="Esta fonte de dados não faz parte da cobertura de robôs do Gojur" />
                    </td>
                  </tr>
                </table>
              </Table>
            </div>
          </div>
        </Center>
      </Container>
    </>
  );
};

export default Monitoring;
