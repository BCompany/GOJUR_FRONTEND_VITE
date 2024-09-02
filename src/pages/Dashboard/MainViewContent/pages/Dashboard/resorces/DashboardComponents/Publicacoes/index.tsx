/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useCallback, AreaHTMLAttributes } from 'react';
import HeaderComponent from 'components/HeaderComponent';
import api from 'services/api';
import { FaSearchPlus } from 'react-icons/fa';
import { useModal } from 'context/modal';
import { usePublication } from 'context/publication';
import { format } from 'date-fns';
import { useIndicators } from 'context/indicators';
import { FiBell } from 'react-icons/fi';
import { AlertsData, AlertsDataDTO, PublicacaoProps, PublicationData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IPublication';
import {Container, PublicationContent,AlertBox,AlertCard,PublicationBox,PublicationCard, ContainerHeader } from './styles';
import { useHeader } from 'context/headerContext';

import { FaEye } from "react-icons/fa";
import {  FiX } from 'react-icons/fi';

const Publicacoes: React.FC<PublicacaoProps> = ({ title, idElement, visible, activePropagation, stopPropagation, xClick, handleClose, cursor, ...rest }) => {
  const { isOpenModal } = useModal();
  const { handleDetails, reloadTrigger, handleReload } = usePublication();
  const { handleTotalPublition } = useIndicators();
  const [publication, setPublication] = useState<PublicationData[]>([]);
  const [alerts, setAlerts] = useState<AlertsDataDTO[]>([]);
  const [morePublication, setMorePublication] = useState(2);
  const [isHover, setIsHover] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const token = localStorage.getItem('@GoJur:token');
  const [haveAction, setHaveAction] = useState(false);
  const {dragOn} = useHeader();
  
  useEffect(() => {
    async function handlePublications() {
      try {
        const userToken = localStorage.getItem('@GoJur:token');

        const response = await api.post<PublicationData[]>(`/Publicacao/ListarDashboard`,
          {page: 1, rows: 10, filters: '1d', token: userToken},
        );

        const { data } = response;
        const total = data.length > 0? data[0].totalRows: 0;
        setPublication(data);
        handleTotalPublition(total);
      } catch (err) {
        console.log(err);
      }
    }

    handlePublications();
  }, []);


  useEffect(() => {
    async function handleAlerts() {
      try {

        const response = await api.post<AlertsData[]>(`/Compromisso/ListarAlertasDia`,{
            token
          },
        );

        const { data } = response;

        const newData = data.map(item => {
          const newarr = {
            AllowEdit: item.AllowEdit,
            eventId: item.eventId,
            description: item.description,
            recurrent: item.recurrent,
            startDate: item.startDate,
            status: item.status,
            subject: item.subject,
            alertDescription: item.alertDescription,
            alertTitle: item.alertTitle,
            hover: isHover,
          };

          return newarr;
        });

        setAlerts(newData);
      } catch (err) {
        console.log(err);
      }
    }

    handleAlerts();

    if (reloadTrigger === true) {
      handleAlerts();
      handleReload(false);
    }
  }, [reloadTrigger, handleReload]);


  const handleMore = useCallback(async () => {
    try {

      const userToken = localStorage.getItem('@GoJur:token');

      const response = await api.post<PublicationData[]>(`/Publicacao/ListarDashboard`, {
        page: morePublication,
        rows: 10,
        filters: '1d',
        token: userToken,
      });

      const publi = publication;
      for (let i = 0; i < response.data.length; i++) {
        publi.push(response.data[i]);
        setPublication(publi);
      }
    } catch (err) {
      console.log(err);
    }
    setMorePublication(morePublication + 1);
  }, [morePublication, publication]);


  const handleDetailModal = useCallback(
    id => {
      const index = publication.findIndex(i => i.id === id);
      const newdata: PublicationData = publication[index];
      handleDetails(newdata);
      setShowModalDetail(!showModalDetail);
    },
    [handleDetails, publication, showModalDetail],
  );


  return (
    <>
      {dragOn ? (
        <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
          <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} onMouseOut={activePropagation} onMouseOver={stopPropagation} handleClose={haveAction}>
            <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}} onMouseOut={activePropagation} onMouseOver={stopPropagation} >
              <p>{title}</p>
            </div>
            <div style={{display:'inline-block', width: "10%", height:"10%", cursor:"pointer"}} onMouseOut={activePropagation} onMouseOver={stopPropagation}>                       
              {visible == 'N' ? (
                <>
                  <button onClick={() => { handleClose("S", idElement)}} style={{display:'inline-block'}}>
                    <FaEye title='Ativar gráfico' />
                  </button>
                </>
                ) : (
                <button onClick={() => { handleClose("N", idElement)}} style={{display:'inline-block'}}>
                    <FiX title='Desativar gráfico' />
                </button>  
              )}              
            </div>
          </ContainerHeader> 
          <PublicationContent>
            {/* RENDERIZAÇÃO DOS CARDS DE COMPROMISSO */}

            <AlertBox>
              <header>Alertas</header>

              <div>
                {alerts.length === 0 && (
                  <p
                    style={{
                      fontSize: 14,
                      color: '#202327',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    Não há alertas para o dia de hoje
                  </p>
                )}
                {alerts.map(alert => (
                  <AlertCard
                    key={alert.eventId}
                    onHover={isHover}
                    onClick={() => isOpenModal(alert.eventId.toString())}
                  >
                    <h4>Ver Detalhes</h4>
                    <>
                      {/* <img
                        src="https://homo.gojur.com.br///Resources/Company/Id_33/User/bcompany-logo.jpg"
                        alt="avatar"
                      /> */}
                      <div>
                        <h5>
                          {alert.alertDescription}
                          <FiBell title={alert.alertTitle} />
                        </h5>

                        <section>
                          <p id="description">{alert.description}</p>
                        </section>
                      </div>
                    </>
                  </AlertCard>
                ))}
              </div>
            </AlertBox>

            <PublicationBox>
              <header>Publicações</header>

              <div>
                {publication.length === 0 && (
                  <p
                    style={{
                      fontSize: 14,
                      color: '#202327',
                      textAlign: 'center',
                      flex: 1,
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 16,
                    }}
                  >
                    Não há publicações para o dia de hoje
                  </p>
                )}
                {publication.map(item => (
                  <PublicationCard
                    key={item.id}
                    visible={item.read}
                    styles={item.withMatter}
                    onClick={() => {
                      handleDetailModal(item.id);
                    }}
                  >
                    <>
                      <div>
                        <article>
                          <p>
                            <b>Processo</b>
                            :&nbsp;
                            {item.matterNumber}
                          </p>
                          {/* <FiMoreVertical /> */}
                        </article>
                        <div>
                          <p>
                            <b>Publicação</b>: &nbsp;
                            {format(new Date(item.publicationDate), 'dd/MM/yyyy')}
                          </p>
                          <p>
                            <b>Divulgação</b>
                            :&nbsp;
                            {format(new Date(item.releaseDate), 'dd/MM/yyyy')}
                          </p>
                        </div>

                        <section>
                          <article>
                            <p>{item.description}</p>
                          </article>
                        </section>
                      </div>
                    </>
                  </PublicationCard>
                ))}
              </div>
              {/* <button type="button" className="buttonLinkClick" onClick={handleMore}>
                Mais publicações
              </button> */}

              <button type="button" className='buttonLinkClick' onClick={() => handleMore()}>
                <FaSearchPlus />
                Mais publicações
              </button>
                          
            </PublicationBox>
          </PublicationContent>
        </Container>
      ) : (
        <Container {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
          <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} handleClose={haveAction}>
            <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}}>
              <p style={{width:"100%", height:"100%"}}>{title}</p>
            </div>
          </ContainerHeader> 
          <PublicationContent>
            {/* RENDERIZAÇÃO DOS CARDS DE COMPROMISSO */}

            <AlertBox>
              <header>Alertas</header>

              <div>
                {alerts.length === 0 && (
                  <p
                    style={{
                      fontSize: 14,
                      color: '#202327',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    Não há alertas para o dia de hoje
                  </p>
                )}
                {alerts.map(alert => (
                  <AlertCard
                    key={alert.eventId}
                    onHover={isHover}
                    onClick={() => isOpenModal(alert.eventId.toString())}
                  >
                    <h4>Ver Detalhes</h4>
                    <>
                      {/* <img
                        src="https://homo.gojur.com.br///Resources/Company/Id_33/User/bcompany-logo.jpg"
                        alt="avatar"
                      /> */}
                      <div>
                        <h5>
                          {alert.alertDescription}
                          <FiBell title={alert.alertTitle} />
                        </h5>

                        <section>
                          <p id="description">{alert.description}</p>
                        </section>
                      </div>
                    </>
                  </AlertCard>
                ))}
              </div>
            </AlertBox>

            <PublicationBox>
              <header>Publicações</header>

              <div>
                {publication.length === 0 && (
                  <p
                    style={{
                      fontSize: 14,
                      color: '#202327',
                      textAlign: 'center',
                      flex: 1,
                      fontWeight: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 16,
                    }}
                  >
                    Não há publicações para o dia de hoje
                  </p>
                )}
                {publication.map(item => (
                  <PublicationCard
                    key={item.id}
                    visible={item.read}
                    styles={item.withMatter}
                    onClick={() => {
                      handleDetailModal(item.id);
                    }}
                  >
                    <>
                      <div>
                        <article>
                          <p>
                            <b>Processo</b>
                            :&nbsp;
                            {item.matterNumber}
                          </p>
                          {/* <FiMoreVertical /> */}
                        </article>
                        <div>
                          <p>
                            <b>Publicação</b>: &nbsp;
                            {format(new Date(item.publicationDate), 'dd/MM/yyyy')}
                          </p>
                          <p>
                            <b>Divulgação</b>
                            :&nbsp;
                            {format(new Date(item.releaseDate), 'dd/MM/yyyy')}
                          </p>
                        </div>

                        <section>
                          <article>
                            <p>{item.description}</p>
                          </article>
                        </section>
                      </div>
                    </>
                  </PublicationCard>
                ))}
              </div>
              {/* <button type="button" className="buttonLinkClick" onClick={handleMore}>
                Mais publicações
              </button> */}

              <button type="button" className='buttonLinkClick' onClick={() => handleMore()}>
                <FaSearchPlus />
                Mais publicações
              </button>
                          
            </PublicationBox>
          </PublicationContent>
        </Container>
      )}
    </>
  );
};

export default Publicacoes;
