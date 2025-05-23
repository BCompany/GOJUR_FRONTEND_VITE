/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AiOutlineFileSearch } from 'react-icons/ai';
import api from 'services/api';
import { ModalCustomerRobot, ModalCustomerRobotResult } from './styles';
import { JobSearchDTO } from 'context/Interfaces/IJobSearch';
import { IMatterFollowData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';

const CustomerRobotModalEdit = (props) => {
  const { CloseRobotModal, companyId } = props.callbackFunction;
  const [showRobotResultModal, setShowRobotResultModal] = useState<boolean>(false);
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving, setisSaving] = useState<boolean>(false); // set trigger for show loader

  const [matterNumber, setMatterNumber] = useState<string>("");
  const [robotTypeSearch, setRobotTypeSearch] = useState<string>("0")
  const [jobData, setJobData] = useState<JobSearchDTO | null>(null);
  const [followsList, setFollowsList] = useState<IMatterFollowData[]>([]);
  const [followsRows, setFollowsRows] = useState<number>(0);
  const [isLoadingFollows, setIsLoadingFollows] = useState<boolean>(false);

  useEffect(() => {
    if (showRobotResultModal && jobData?.matterGojur?.matterId) {
      (async () => {
        setIsLoadingFollows(true);
        try {
          const response = await api.get<IMatterFollowData[]>('/ProcessoAcompanhamento/ListarAcompanhamentos', {
            params: {
              matterId: jobData.matterGojur.matterId,
              count: followsRows,
              filter: 'eventType=W|T',
              token,
              companyID: companyId,
            },
          });

          setFollowsList((prev) => {
            const ids = new Set(prev.map(f => f.id));
            const newFollows = response.data.filter(f => !ids.has(f.id));
            return [...prev, ...newFollows];
          });
        } catch {
          setFollowsList([]);
        }
        setIsLoadingFollows(false);
      })();
    }
  }, [showRobotResultModal, jobData?.matterGojur?.matterId, followsRows]);

  // OPEN LINK BIP BOP
  const OpenDocument = useCallback(async () => {
    try {
      if (matterNumber === '') {
        addToast({
          type: 'info',
          title: 'Falha na consulta.',
          description: 'Por Favor preencha o número do processo',
        });
        return;
      }

      setisSaving(true);

      const response = await api.get<JobSearchDTO>(
        '/CustomBCO_ID1/ConfiguracaoCliente/ConsultaPushBipBop',
        {
          params: {
              companyId,
              matterTypeSearch: robotTypeSearch,
              matterNumber,
              token,
            },
        }
      );

      const data: JobSearchDTO = typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;

      setJobData(data);
      handleOpenRobotResultModal();
      setisSaving(false);
    } catch (err: any) {
      setisSaving(false);
      console.error('Erro na consulta:', err);

      if (err.response && err.response.data) {
        const { typeError, Message } = err.response.data;

        if (typeError?.warning === 'awareness') {
          addToast({
            type: 'info',
            title: 'Falha na consulta.',
            description: Message || 'Erro desconhecido.',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Falha na consulta.',
            description: Message || 'Erro desconhecido.',
          });
        }
      } else {
        addToast({
          type: 'error',
          title: 'Erro inesperado.',
          description: 'Não foi possível processar a solicitação.',
        });
      }
    }
  }, [robotTypeSearch, matterNumber]);


  const handleOpenRobotResultModal = () => {
    setShowRobotResultModal(true);
    setFollowsList([]); 
    setisSaving(false);
  };

  const CloseRobotResultModal = () => {
    setShowRobotResultModal(false)
    CloseRobotModal()
    setJobData(null)
    setisSaving(false)
  }

  const handleShowMoreFollows = () => {
    setFollowsRows(followsRows + 3); 
  };

  return (
    <>
      {!jobData || jobData.matterGojur.matterFolder ? (
        <ModalCustomerRobot show>
          <div style={{ marginLeft: '15px', marginTop: '10px', marginRight: '10px' }}>
            Consulta de Job por Monitor
  
            <br />
            <br />
  
            <div>
              <label htmlFor="type">
                Tipo de Consulta
                <br />
                <select
                  style={{ backgroundColor: 'white' }}
                  name="type"
                  value={robotTypeSearch}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setRobotTypeSearch(e.target.value)}
                >
                  <option value="0">Por importação</option>
                  <option value="1">Por monitor</option>
                </select>
              </label>
            </div>
  
            <br />
  
            <label htmlFor="matterNumber">
              Número do Processo
              <br />
              <input
                type="text"
                style={{ backgroundColor: 'white' }}
                name="matterNumber"
                placeholder="Digite um n° de processo"
                value={matterNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterNumber(e.target.value)}
                autoComplete="off"
              />
            </label>
  
            <br />
            <br />
            <br />
  
            <div style={{ float: 'left', marginRight: '12px' }}>
              <div style={{ float: 'left' }}>
                <button
                  className="buttonClick"
                  type="button"
                  onClick={() => OpenDocument()}
                  style={{ width: '145px' }}
                >
                  <AiOutlineFileSearch />
                  Consultar Push
                </button>
              </div>
  
              <div style={{ float: 'left', width: '100px', marginLeft: '60px' }}>
                <button
                  type="button"
                  className="buttonClick"
                  style={{ width: '145px' }}
                  onClick={CloseRobotModal}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalCustomerRobot>
      ) : null}
  
      {showRobotResultModal && (
        jobData.matterGojur.matterFolder ? (
          <ModalCustomerRobotResult show>
            <div style={{ margin: '15px' }}>
              <h3>Detalhes do Processo</h3>
  
              <br />
  
              <p><strong>Pasta:</strong> {jobData.matterGojur.matterFolder}</p>
              <p><strong>Número do Processo:</strong> {jobData.matterGojur.matterNumber}</p>
              <p><strong>Cliente:</strong> {jobData.matterGojur.matterCustomerDesc}</p>
              <p><strong>Parte Contrária:</strong> {jobData.matterGojur.matterOppossingDesc}</p>
  
              <br />
  
             <h4>Andamentos</h4>
             <div>
               {followsList.map((follow, idx) => (
                 <div
                   key={follow.id || idx}
                   style={{
                     marginBottom: 10,
                     background: idx % 2 === 0 ? '#e6f2f0' : '#f8f8f8', 
                     padding: '10px',
                     borderRadius: '6px',
                   }}
                 >
                   <p>
                     <strong>Data do Andamento:</strong> {new Date(follow.date).toLocaleDateString('pt-BR')} - {follow.typeFollowDescription}
                   </p>
                   <p>
                     <strong>Descrição:</strong> {follow.description}
                   </p>
                 </div>
               ))}
               {isLoadingFollows && <div>Carregando...</div>}
               {followsList.length > 0 && (
                 <button
                   className="buttonClick"
                   type="button"
                   onClick={handleShowMoreFollows}
                   disabled={isLoadingFollows}
                 >
                   + Exibir Mais
                 </button>
               )}
             </div>
  
              {jobData.matterGojur.messageButton && (
                <div>
                  <br />
                  <h4>Processo Carga Tribunal</h4>
                  <p>{jobData.matterGojur.messageButton}</p>
                </div>
              )}
  
              <br />
  
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  className="buttonClick"
                  type="button"
                  onClick={() => window.open(jobData.url, '_blank')}
                >
                  Resultado do LegalData
                </button>
  
                <button
                  type="button"
                  className="buttonClick"
                  onClick={CloseRobotResultModal}
                >
                  <FaRegTimesCircle style={{ marginRight: '5px' }} />
                  Fechar
                </button>
              </div>
            </div>
          </ModalCustomerRobotResult>
        ) : (
          <ModalCustomerRobotResult show>
            <div style={{ margin: '15px' }}>
              <h3>Processo não localizado</h3>

              {jobData.matterGojur.messageButton && (
                <div>
                  <br />
                  <h4>Processo Carga Tribunal</h4>
                  <p>{jobData.matterGojur.messageButton}</p>
                </div>
              )}

              <br/>
  
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  className="buttonClick"
                  type="button"
                  onClick={() => window.open(jobData.url, '_blank')}
                >
                  Resultado do LegalData
                </button>
  
                <button
                  type="button"
                  className="buttonClick"
                  onClick={CloseRobotResultModal}
                >
                  <FaRegTimesCircle style={{ marginRight: '5px' }} />
                  Fechar
                </button>
              </div>
            </div>
          </ModalCustomerRobotResult>
        )
      )}
  
      {isSaving && (
        <>
          <Overlay />
          <div className="waitingMessage">
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Consultando ...
          </div>
        </>
      )}
    </>
  )};

export default CustomerRobotModalEdit;
