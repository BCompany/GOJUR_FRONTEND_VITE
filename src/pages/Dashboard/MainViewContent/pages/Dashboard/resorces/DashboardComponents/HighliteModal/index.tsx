/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useCallback, useEffect } from 'react';
import { useAlert } from 'context/alert';
import api from 'services/api';
import Loader from 'react-spinners/ClipLoader';
import { Container, Content, Message, Shadow } from './styles';

interface HighliteProps {
  isOpen(): void;
}

interface mensagensProps {
  cod_Mensagem: number;
  cod_Processo: number;
  dta_Mensagem: string;
  des_Mensagem: string;
  messageType: string | null;
  warningMessage: boolean;
  num_Ano: string;
}

const HighliteModal: React.FC<HighliteProps> = ({ isOpen }) => {
  const { handleReloadMessages } = useAlert();
  const [warnMessage, setWarnMessage] = useState<mensagensProps[]>([]);
  const [autoClose, setAutoClose] = useState<number>(3);
  const [disable, setDisable] = useState<boolean>(true);
  
  
  useEffect(() => {
    setInterval(() => {setDisable(false)}, 7000);
  }, []);


  useEffect(() => {
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

        const warn = response.data
          .filter(
            i =>
              (i.messageType === 'VM' || i.messageType === null) &&
              i.warningMessage === true,
          )
          .map(i => i);

          setWarnMessage(warn);
      } catch (err) {
        console.log(err);
      }
    }

    handleEnvelopeNotification();
  }, []);


  useEffect(() => {
    if (warnMessage.length === 0) {
      setTimeout(() => {
        setAutoClose(autoClose - 1);
      }, 1000);
    }

    if (autoClose == 0) {
      handleReloadMessages(true);
      isOpen();
    }
  }, [autoClose, handleReloadMessages, isOpen, warnMessage.length]);


  const handleCheck = useCallback((item) => {
    const newWarn = warnMessage.filter(i => i.cod_Mensagem !== item.cod_Mensagem);
    setWarnMessage(newWarn);

    try {
      const tokenapi = localStorage.getItem('@GoJur:token');
      api.post('/Dashboard/SalvarLogMensagens', {
        messageId: item.cod_Mensagem,
        messageType: 'LM',
        year: item.num_Ano,
        token: tokenapi,
      });
    } catch (err) {
      console.log(err);
    }
  }, [warnMessage]);


  return (
    <Shadow id='Shadow'>
      <Container id='Container'>
        <Content id='Content'>
          {warnMessage.map(item => (
            <Message id='Message' key={item.cod_Mensagem}>
              <div id="messageContent" dangerouslySetInnerHTML={{ __html: item.des_Mensagem }} />
              <section>
                <button
                  type="button"
                  disabled={disable}
                  onClick={() => handleCheck(item)}
                >
                  {disable == true ? (
                    <>
                      Aguarde para fechar
                      &nbsp;
                      <Loader size={12} color="white" />
                    </>
                  ) : (
                    <>Não ver este aviso novamente - Fechar</>
                  )}
                </button>
              </section>
            </Message>
          ))}
          <br />
        </Content>
      </Container>
    </Shadow>
  );
};

export default HighliteModal;
