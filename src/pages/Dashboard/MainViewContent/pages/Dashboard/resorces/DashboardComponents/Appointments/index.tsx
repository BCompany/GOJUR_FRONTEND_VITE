// ESLINT PAGES RULES
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-return */
/* eslint-disable no-restricted-globals */

// IMPORTAÇÕES
import React, { AreaHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FiClock, FiPlus } from 'react-icons/fi';
import { BsBookmark, BsBookmarkCheck } from 'react-icons/bs';
import { ModalProvider, useModal } from 'context/modal';
import { useToast } from 'context/toast';
import { useDefaultSettings } from 'context/defaultSettings';
import HeaderComponent from 'components/HeaderComponent';
import { useFetch } from 'services/hooks/useFetch';
import { FormatDate } from 'Shared/utils/commonFunctions';
import {
  Container,
  AppointmentContent,
  AppointmentItens,
  AppointmentHeader,
  AppointmentDescription,
  ContainerHeader
} from './styles';
import { useHeader } from 'context/headerContext';
import { FaEye } from "react-icons/fa";
import {  FiX } from 'react-icons/fi';
// DECLARAÇÃO DE TIPOS
interface CompromissosData {
  eventId: string;
  startDate: Date;
  subject: string;
  subjectColor: string;
  description: string;
  status: string;
}

interface AppointmentProps {
  title: string;
  idElement: string;
  visible: string;
  activePropagation: any;
  stopPropagation: any;
  xClick:any;
  handleClose: any;
  cursor: boolean;
}

interface HeaderProps extends AreaHTMLAttributes<HTMLAreaElement> {
  title: string;
  cursor: boolean;
  action?: any;
}

// DECLARAÇÃO DO COMPONENTE
const Appointments: React.FC<AppointmentProps> = ({ title, idElement, visible, activePropagation, stopPropagation, xClick, handleClose, cursor, ...rest }) => {
  // STATES & HOOKS
  const [activeReload, setActiveReload] = useState(false);
  const { isOpenModal, handleReload, reload } = useModal();
  const { permissionData } = useDefaultSettings();
  const { addToast } = useToast();
  const [haveAction, setHaveAction] = useState(false);
  const {dragOn} = useHeader();

  const userToken = localStorage.getItem('@GoJur:token');
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  const { data, mutate } = useFetch<CompromissosData[]>(
    '/Compromisso/ListarDia',
    {
      date: currentDate, // '2020-09-25'
      token: userToken,
    },
  );

  // useEffect(() => {
    
  //   isOpenModal('');
  //   handleReload('');
  // }, [handleReload, isOpenModal]);

  const handleNewAppointment = useCallback(() => {
    
    isOpenModal('0');
    handleReload('Create');

  }, [handleReload, isOpenModal]);

  const handleNotPermission = useCallback(() => {
    addToast({
      type: 'info',
      title: 'Permissão negada',
      description:
        'Seu usuário não tem permissão para acessar esse módulo, fala com o administrador do sistema',
    });
  }, [addToast]);

  // CARREGA OS DADOS DA API QUANDO O COMPONENTE É MONTADO EM TELA

      // Click edit appointment
  const handleClickEdit = (item) => {
      
    localStorage.setItem('@GoJur:RecurrenceDate', FormatDate(new Date(item.startDate),'yyyy-MM-dd'))
    isOpenModal(item.eventId)
  }
  
  if (!data) {
    return (
      <div>
        <h5
          style={{
          backgroundColor: 'transparent',
          textAlign: 'center',
          color: '#f19000',
        }}
        >
          ...Carregando
        </h5>
      </div>
    );
  }

  if (reload === 'Save') {
    mutate(data, true);
  }
  return (
    <>
      {dragOn ? (
        <ModalProvider>
          <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
          <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} onMouseOut={activePropagation} onMouseOver={stopPropagation} handleClose={haveAction}>
                <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}} onMouseOut={activePropagation} onMouseOver={stopPropagation} >
                  <p>{title}</p>
                </div>
                <div style={{display:'inline-block', width: "10%", height:"10%", cursor:"pointer"}} onMouseOut={activePropagation} onMouseOver={stopPropagation}>                       
                  {visible == 'N' ? (
                      <button onClick={() => { handleClose("S", idElement)}} style={{display:'inline-block'}}>
                        <FaEye title='Ativar gráfico' />
                      </button>
                      ) : (
                      <button onClick={() => { handleClose("N", idElement)}} style={{display:'inline-block'}}>
                          <FiX title='Desativar gráfico' />
                      </button>  
                  )}              
                </div>
          </ContainerHeader> 
          <AppointmentContent>
            <div>
              <h2>
                Horários agendados
                {permissionData.calendar === 'S' || permissionData.adm === 'S' ? (
                  <button type="button" onClick={handleNewAppointment}>
                    <FiPlus />
                    <p>Agendamento</p>
                  </button>
                ) : (
                  <button type="button" onClick={handleNotPermission}>
                    <FiPlus />
                    <p>Agendamento</p>
                  </button>
                )}
              </h2>
            </div>

            {/* RENDERIZAÇÃO DOS CARDS DE COMPROMISSO */}

            {data.length === 0 && (
              <p
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                }}
              >
                Não há compromissos cadastrados para o dia de hoje
              </p>
            )}

            {data.map(compromisso => (
              <AppointmentItens
                key={compromisso.eventId}
                style={{
                  borderLeft: `3px solid ${compromisso.subjectColor}`,
                }}
                done={compromisso.status}
                onClick={() => handleClickEdit(compromisso)}
                initial={{ opacity: 0, y: -100 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <AppointmentHeader>
                  <div>
                    <FiClock />
                    <p>{format(new Date(compromisso.startDate), 'HH:mm')}</p>
                  </div>

                  <strong>{compromisso.subject}</strong>

                  {compromisso.status !== 'P' && (
                    <BsBookmarkCheck title="Compromisso Concluido" />
                  )}
                  {compromisso.status === 'P' && (
                    <BsBookmark title="Compromisso Pendente" />
                  )}
                </AppointmentHeader>
                <AppointmentDescription>
                  <p>{compromisso.description}</p>
                </AppointmentDescription>
              </AppointmentItens>
            ))}
          </AppointmentContent>
          </Container>
        </ModalProvider>
      ) : (
        <ModalProvider>
          <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
          <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} handleClose={haveAction}>
                <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}}>
                  <p>{title}</p>
                </div>
          </ContainerHeader> 
          <AppointmentContent>
            <div>
              <h2>
                Horários agendados
                {permissionData.calendar === 'S' || permissionData.adm === 'S' ? (
                  <button type="button" onClick={handleNewAppointment}>
                    <FiPlus />
                    <p>Agendamento</p>
                  </button>
                ) : (
                  <button type="button" onClick={handleNotPermission}>
                    <FiPlus />
                    <p>Agendamento</p>
                  </button>
                )}
              </h2>
            </div>

            {/* RENDERIZAÇÃO DOS CARDS DE COMPROMISSO */}

            {data.length === 0 && (
              <p
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                }}
              >
                Não há compromissos cadastrados para o dia de hoje
              </p>
            )}

            {data.map(compromisso => (
              <AppointmentItens
                key={compromisso.eventId}
                style={{
                  borderLeft: `3px solid ${compromisso.subjectColor}`,
                }}
                done={compromisso.status}
                onClick={() => handleClickEdit(compromisso)}
                initial={{ opacity: 0, y: -100 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <AppointmentHeader>
                  <div>
                    <FiClock />
                    <p>{format(new Date(compromisso.startDate), 'HH:mm')}</p>
                  </div>

                  <strong>{compromisso.subject}</strong>

                  {compromisso.status !== 'P' && (
                    <BsBookmarkCheck title="Compromisso Concluido" />
                  )}
                  {compromisso.status === 'P' && (
                    <BsBookmark title="Compromisso Pendente" />
                  )}
                </AppointmentHeader>
                <AppointmentDescription>
                  <p>{compromisso.description}</p>
                </AppointmentDescription>
              </AppointmentItens>
            ))}
          </AppointmentContent>
          </Container>
      </ModalProvider>
    )}
  </>
  );
};

export default Appointments;
