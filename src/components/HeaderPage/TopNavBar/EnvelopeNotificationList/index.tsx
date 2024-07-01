/* eslint-disable no-constant-condition */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
/* eslint-disable no-useless-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useCallback, useState, useEffect } from 'react';
import { useAlert } from 'context/alert';
import { BiHide } from 'react-icons/bi';
import { BsBookmarkCheck, BsBookmarkDash } from 'react-icons/bs';
import api from 'services/api';
import { format } from 'date-fns';
import { ScaleLoader } from 'react-spinners';
import { useToast } from 'context/toast';
import { Container, ListItem } from './styles';

interface mensagensProps {
  cod_Mensagem: number;
  cod_Processo: number;
  dta_Mensagem: string;
  des_Mensagem: string;
  messageType: string;
  warningMessage: boolean;
}

const EnvelopeNotificationList: React.FC = () => {
  const { alertData, handleProcessModal, handleCloseListMessages } = useAlert();
  const [data, setData] = useState<mensagensProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [notNewMessage, setNotNewMessage] = useState(false);
  const { addToast } = useToast();
  const firstAcces = localStorage.getItem('@GoJur:firstAccess');


  useEffect(() => {
    setLoading(true);
    async function handleEnvelopeNotification() {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');

        const response = await api.post<mensagensProps[]>(
          '/Dashboard/ListarMensagens',
          {
            messageType: 'AL',
            messageFilter: 'unreadOrRecent',
            token: tokenapi,
          },
        );

        setData(response.data);
        setLoading(false);

        if (response.data.length === 0) {
          setNotNewMessage(true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if(firstAcces == null)
      handleEnvelopeNotification();
  }, []);


  const handleHide = useCallback(async item => {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      await api.post<mensagensProps[]>('/Dashboard/SalvarLogMensagens', {
        messageId: item.cod_Mensagem,
        messageType: 'OM',
        year: item.num_Ano,
        token: tokenapi,
      });

      const response = await api.post<mensagensProps[]>(
        '/Dashboard/ListarMensagens',
        {
          messageType: 'AL',
          messageFilter: 'unreadOrRecent',
          token: tokenapi,
        },
      );

      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);


  const handleCheckRead = useCallback(async item => {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      await api.post('/Dashboard/SalvarLogMensagens', {
        messageId: item.cod_Mensagem,
        messageType: 'LM',
        year: item.num_Ano,
        token: tokenapi,
      });

      const response = await api.post<mensagensProps[]>(
        '/Dashboard/ListarMensagens',
        {
          messageType: 'AL',
          messageFilter: 'unreadOrRecent',
          token: tokenapi,
        },
      );

      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);


  const handleCheck = useCallback(
    id => {
      const newData = Array.from(data);
      const key = newData.findIndex(i => i.cod_Mensagem === id);

      newData[key].messageType = 'LM';
      setData(newData);
    },
    [data],
  );


  const handleCheckNot = useCallback(
    id => {
      const newData = Array.from(data);
      const key = newData.findIndex(i => i.cod_Mensagem === id);

      newData[key].messageType = 'NL';
      setData(newData);
    },
    [data],
  );


  const handleCheckHide = useCallback(
    id => {
      const newData = Array.from(data);
      const key = newData.findIndex(i => i.cod_Mensagem === id);

      newData.splice(key, 1);
      setData(newData);
    },
    [data],
  );


  const handleCheckNotRead = useCallback(async item => {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      await api.post('/Dashboard/SalvarLogMensagens', {
        messageId: item.cod_Mensagem,
        messageType: 'NL',
        year: item.num_Ano,
        token: tokenapi,
      });

      const response = await api.post<mensagensProps[]>(
        '/Dashboard/ListarMensagens',
        {
          messageType: 'AL',
          messageFilter: 'unreadOrRecent',
          token: tokenapi,
        },
      );

      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);


  const handleModalProcess = async (item: mensagensProps) => {
    
    // Validar se usuário tem acesso ao módulo de processos
    const tokenapi = localStorage.getItem('@GoJur:token');
   
    const response = await api.post<boolean>('Processo/PermissaoAcesso', {
      id: item.cod_Processo,
      token: tokenapi
     })
    
    if (response.data)
    {
      localStorage.setItem('@GoJur:ProcessId',item.cod_Processo.toString());
      handleProcessModal();
    }
    else
    {
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Acesso Não Autorizado - O usuário não tem acesso ao módulo de processos ou a este processo.',
      });
      
      handleCloseListMessages()
    }
  }


  return (
    <Container
      initial={{ opacity: 0, y: -20 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {loading ? (
        <ScaleLoader color="#0077c0" width={16} height={8} margin={8} />
      ) : null}
      {notNewMessage ? <p style={{ fontSize: 12 }}>Não há mensagens</p> : null}
      {data.map(item => (
        <ListItem
          initial={{ opacity: 0, y: -40 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          key={item.cod_Mensagem}
          read={item.messageType}
        >
          <header
            onClick={() => {
              if (item.cod_Processo > 0) {
                handleModalProcess(item)
              }
            }}
          >
            <p>{format(new Date(item.dta_Mensagem), 'dd/MM/yyyy')}</p>
            <div dangerouslySetInnerHTML={{ __html: item.des_Mensagem }} />
          </header>
          <div>
            <button
              type="button"
              onClick={() => {
                handleCheckHide(item.cod_Mensagem);
                handleHide(item);
              }}
            >
              <BiHide />
              Ocultar
            </button>
            {item.messageType === 'LM' ? (
              <button
                type="button"
                onClick={() => {
                  handleCheckNot(item.cod_Mensagem);
                  handleCheckNotRead(item);
                }}
              >
                <BsBookmarkCheck />
                Marcar como não lido
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleCheck(item.cod_Mensagem);
                  handleCheckRead(item);
                }}
              >
                <BsBookmarkDash />
                Marcar como lido
              </button>
            )}
          </div>
        </ListItem>
      ))}
    </Container>
  );
};

export default EnvelopeNotificationList;
