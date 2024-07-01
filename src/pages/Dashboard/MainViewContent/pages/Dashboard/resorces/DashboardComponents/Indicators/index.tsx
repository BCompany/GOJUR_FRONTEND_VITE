/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FiCalendar } from 'react-icons/fi';
import Loader from 'react-spinners/PulseLoader';
import { useModal } from 'context/modal';
import { useToast } from 'context/toast';
import { useDefaultSettings } from 'context/defaultSettings';
import { useTransition, useSpring, useChain, config } from 'react-spring';
import { envProvider } from 'services/hooks/useEnv';
import { Link, useHistory } from 'react-router-dom'

import api from 'services/api';
import { useFetch } from 'services/hooks/useFetch';
import { useIndicators } from 'context/indicators';
import { RiFolder2Fill } from 'react-icons/ri';
import { IMatterData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import CourtInfosList from '../CourtInfosList';

import { Container, Content, ListItem } from './styles';

interface IndicatorsData {
  id: string;
  value: number;
}

interface CourtListData {
  cod_Mensagem: number;
  des_Mensagem: string;
  dta_Mensagem: string;
  statusMessage: null;
  tpo_Mensagem: string;
  viewedMessage: boolean;
  cod_Processo: string;
}

const Indicators: React.FC = () => {
  const { permissionData } = useDefaultSettings();
  const {
    totalPublications,
    appointmentIPermission,
    publicationIPermission,
  } = useIndicators();
  const { addToast } = useToast();
  const { reload, handleReload } = useModal();
  const [indicators, setIndicators] = useState<IndicatorsData[]>([]);
  const [courtList, setCourtList] = useState<CourtListData[]>([]);
  const [openCourtList, setOpenCourtList] = useState(false);
  const [dataContent, setDataContent] = useState<string>('');
  const userToken = localStorage.getItem('@GoJur:token');
  const baseUrl = envProvider.redirectUrl;
  const history = useHistory();

  const tokenApi = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    handleReload('');
  }, []);

  const handleCalendarRedirect = () => {
    localStorage.setItem('@GoJur:CalendarRedirect', 'dayGridWeek')
    history.push('/calendar')
  }

  const { data, mutate } = useFetch<IndicatorsData[]>(
    '/Dashboard/ListarIndicadores',
    {
      token: tokenApi,
    },
  );

  const handleMattersInfos = useCallback(
    async key => {
      if (openCourtList === false && key != '0') {
        try {
          const response = await api.post('/Dashboard/ListarMensagens', {
            messageType: 'MT',
            messageFilter: 'messageFromToday',
            token: tokenApi,
          });

          if (!response.data) {
            return (
              <div>
                <h2>Carregando</h2>
                <Loader color="#f19000" />
              </div>
            );
          }

          setCourtList(response.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setDataContent(key);
      }
      setOpenCourtList(!openCourtList);
    },
    [openCourtList],
  );

  const handleNotPermission = useCallback(() => {
    addToast({
      type: 'info',
      title: 'Permissão negada',
      description:
        'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
    });
  }, [addToast]);

  const handleRedirectMatter = async (matterId: string) => {
    const tokenapi = localStorage.getItem('@GoJur:token');

    const response = await api.post<boolean>('Processo/PermissaoAcesso', {
      id: matterId,
      token: tokenapi
    })

    if (response.data){
      const response = await api.post<IMatterData>('/Processo/SelecionarProcesso', {
        matterId,
        token: tokenapi,
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey')
      })
      const matterType = response.data.typeAdvisorId == null? 'legal': 'advisory'
      const url = `/matter/edit/${matterType}/${matterId}`
      window.location.href = url;

        // const url = `${baseUrl}main/globalWs?module=Matter&parameters=caller=ReactAPP%2C%26matterId=${matterId}&token=${tokenApi}`
        // window.location.href = url;
    }
    else{
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Acesso Não Autorizado - O usuário não tem acesso ao módulo de processos ou a este processo.',
      });

      setOpenCourtList(false)
    }
  }

  if (!data) {
    return (
      <h5
        style={{
          backgroundColor: 'transparent',
          textAlign: 'center',
          color: '#f19000',
        }}
      >
        ...Carregando
      </h5>
    );
  }

  if (reload === 'Save') {
    mutate(data, true);
  }

  return (
    <Container>
      {data.map(item => (
        <Content key={item.id}>
          {item.id === 'eventWeek' && (
            <>
              {permissionData.adm === 'S' ? (
                <button type="button" onClick={handleCalendarRedirect}>
                  <p>Prazos e Audiências da Semana</p>
                  <h1>{item.value}</h1>
                </button>
              ) : permissionData.calendar === 'S' ? (
                <button type="button" onClick={handleCalendarRedirect}>
                  <p>Prazos e Audiências da Semana</p>
                  <h1>{item.value}</h1>
                </button>
              ) : (
                <button type="button" onClick={handleNotPermission}>
                  <p>Prazos e Audiências da Semana</p>
                  <h1>{item.value}</h1>
                </button>
              )}
            </>
          )}

          {item.id === 'publicationDay' && (
            <>
              {permissionData.adm === 'S' ? (
                <button type="button" onClick={() => history.push('/publication')}>
                  <p>Publicações de Hoje</p>
                  <h1>{totalPublications}</h1>
                </button>
              ) : permissionData.publication === 'S' ? (
                <button type="button" onClick={() => history.push('/publication')}>
                  <p>Publicações de Hoje</p>
                  <h1>{totalPublications}</h1>
                </button>
              ) : (
                <button type="button" onClick={handleNotPermission}>
                  <p>Publicações de Hoje</p>
                  <h1>{totalPublications}</h1>
                </button>
              )}
            </>
          )}

          {item.id === 'matterDay' && (
            <button
              type="button"
              onClick={() => {
                handleMattersInfos(item.value);
              }}
            >
              {openCourtList ? <p>Fechar</p> : <p>Informações Tribunal</p>}
              {openCourtList ? (
                <h1 style={{ fontSize: 32 }}>X</h1>
              ) : (
                <h1>{item.value}</h1>
              )}
            </button>
          )}
        </Content>
      ))}
      {openCourtList ? (
        <CourtInfosList>
          {dataContent == '0' && (
            <ListItem style={{ border: 'none' }}>
              <article>
                <p>Não há atualizações do tribunal no dia de hoje</p>
              </article>
            </ListItem>
          )}
          {courtList.map(i => (
            <ListItem
              key={i.cod_Mensagem}
              onClick={() => handleRedirectMatter(i.cod_Processo)}
            >
              <article>
                <p id="date">
                  <RiFolder2Fill />

                  {format(new Date(i.dta_Mensagem), 'dd/MM/yyyy')}
                </p>
                <p id="info">{i.des_Mensagem}</p>
              </article>
            </ListItem>
          ))}
        </CourtInfosList>
      ) : null}
    </Container>
  );
};

export default Indicators;
