import React, { useState, useEffect, } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useHistory } from 'react-router-dom';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FcApproval, FcCancel } from "react-icons/fc";
import { MdWarning } from "react-icons/md";
import { Container, Table, Center, TollBar } from './styles';

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
  const [primaryInstanceList, setPrimaryInstanceList] = useState<StatusOperationDTO[]>([]);
  const [superiorInstanceList, setSuperiorInstanceList] = useState<StatusOperationDTO[]>([]);
  const token = localStorage.getItem("@GoJur:token");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {

    LoadStatusOperation()

  }, [])

  async function LoadStatusOperation() {

    const response = await api.get<StatusOperationDTO[]>('/LegalData/StatusOperacao', {
      params: {
        token
      }
    });

    // Get all 1º and 2º instance dataSources - remove all court that not correspond from 1º and 2º instance besidesa TJTO tha we do not covery
    setPrimaryInstanceList(response.data.filter(x => x.isRelevant == "S" 
                                                  && x.scrapperAlias != "TJTO"
                                                  && x.scrapperAlias != "STF"
                                                  && x.scrapperAlias != "STJ"
                                                  && x.scrapperAlias != "TST"
                                                ))

    // Get all superior dataSources (STF, STJ, TST)
    setSuperiorInstanceList(response.data.filter(x => x.scrapperAlias == "STF"  || x.scrapperAlias == "TST"))

    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <Container>
        <Overlay />
        <div className='waitingMessage'>
          <LoaderWaiting size={15} color="var(--blue-twitter)" />
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <HeaderPage />

        <TollBar>

          <div className="buttonReturn">
            <button
              className="buttonLinkClick"
              title="Clique para retornar a lista de processos"
              onClick={() => history.push('../../../publication')}
              type="submit"
            >
              <AiOutlineArrowLeft />
              Retornar
            </button>
          </div>

        </TollBar>

        <Center>

          <br />
          <br />

          <div className="flex-box container-box">
            <div className="content-box">
              <p>
                Lista de abrangências dos tribunais pesquisados pelo serviço de monitor GOJUR (botão seguir).
              </p>
            </div>
          </div>
          <br />

          <div className='title'>1º e 2º Instâncias</div>

          {/* FIRST / SECOND INSTANCE TABLE */}
          <div className="flex-box container-box">

            <div className="content-box">

              <Table>

                <table>
                  <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>Tribunal</th>
                    <th style={{ width: '10%' }}>UF</th>
                    <th style={{ width: '10%' }}>Instância</th>
                    <th style={{ width: '10%' }}>Segredo Justiça</th>
                    <th style={{ width: '10%' }}>Status</th>
                  </tr>

                  {primaryInstanceList.map(item => (
                    <tr>
                      <td style={{ width: '50%', textAlign: 'left' }}>{item.description}</td>
                      <td style={{ width: '10%' }}>{item.state}</td>
                      <td style={{ width: '10%' }}>{`${item.instance}º`}</td>
                      <td style={{ width: '10%' }}>{item.secretJustice}</td>
                      <td style={{ width: '10%' }}>{(item.statusOperation?.toUpperCase() == "A" ? <FcApproval title='Em Operação.' /> : <MdWarning style={{ color: "#ffff2e" }} title="Esta fonte de dados está inoperante. Em caso de dúvidas entre em contato como suporte técnico GOJUR." />)}</td>
                    </tr>
                  ))}
                </table>

              </Table>

            </div>

          </div>

          <br />

          <div className='title'>Tribunais Superiores</div>

          {/* THIRDY AND FORTHY INSTANCE TABLE */}
          <div className="flex-box container-box">

            <div className="content-box">

              <Table>

                <table>
                  <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>Tribunal</th>
                    <th style={{ width: '10%' }}>UF</th>
                    <th style={{ width: '10%' }}>Instância</th>
                    <th style={{ width: '10%' }}>Segredo Justiça</th>
                    <th style={{ width: '10%' }}>Status</th>
                  </tr>

                  {superiorInstanceList.map(item => (
                    <tr>
                      <td style={{ width: '50%', textAlign: 'left' }}>{item.description}</td>
                      <td style={{ width: '10%' }}>BR</td>
                      <td style={{ width: '10%' }}>{`${item.instance}º`}</td>
                      <td style={{ width: '10%' }}>{item.secretJustice}</td>
                      <td style={{ width: '10%' }}>{(item.statusOperation?.toUpperCase() == "A" ? <FcApproval title='Em Operação.' /> : <MdWarning style={{ color: "#ffff2e" }} title="Esta fonte de dados está inoperante. Em caso de dúvidas entre em contato como suporte técnico GOJUR." />)}</td>
                    </tr>
                  ))}
                </table>

              </Table>

            </div>

          </div>

          <br />

          <div style={{ color: "red" }} className='title'>Tribunais não Atendidos</div>

          
          {/* OS TRIBUNAIS ABAIXO FORAM COLOCADOS DE FORMA FIXA POIS NO MOMENTO NÃO SÃO ATENDIDOS PELO LEGAL DATA

          FOI SUGERIDO A CRIAÇÃO DE UM STATUS ESPECÍFICO PARA ESTES CASOS, MAS FOI DEFINIDO COLOCAR DE FORMA FIXA NO CÓDIGO MESMO
          
          CONFORME REUNIÃO REALIZADA EM 27/02/2024: MARCELO | MATHEUS | SIDNEY */}

          {/* INATIVE INSTANCES TABLE */}
          <div className="flex-box container-box">

            <div className="content-box">

              <Table>

                <table>
                  <tr>
                    <th style={{ width: '50%', textAlign: 'left' }}>Tribunal</th>
                    <th style={{ width: '10%' }}>UF</th>
                    <th style={{ width: '10%' }}>Instância</th>
                    <th style={{ width: '10%' }}>Segredo Justiça</th>
                    <th style={{ width: '10%' }}>Status</th>
                  </tr>


                  <tr>
                    <td style={{ width: '50%', textAlign: 'left' }}>Tribunal de Justiça TO - EProc</td> 
                    <td style={{ width: '10%' }}>TO</td>
                    <td style={{ width: '10%' }}>1 e 2º</td>
                    <td style={{ width: '10%' }}>N</td>
                    <td style={{ width: '10%' }}><FcCancel title="Esta fonte de dados não faz parte da cobertura de robôs do Gojur" /></td>
                  </tr>

                  <tr>
                    <td style={{ width: '50%', textAlign: 'left' }}>Superior Tribunal de Justiça - STJ</td>
                    <td style={{ width: '10%' }}>BR</td>
                    <td style={{ width: '10%' }}>3º</td>
                    <td style={{ width: '10%' }}>N</td>
                    <td style={{ width: '10%' }}><FcCancel title="Esta fonte de dados não faz parte da cobertura de robôs do Gojur" /></td>
                  </tr>
                </table>

              </Table>

            </div>

          </div>

        </Center>

      </Container>
    </>
  );
}

export default Monitoring;

