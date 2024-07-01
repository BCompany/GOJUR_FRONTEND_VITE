/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from 'react';
import HeaderComponent from 'components/HeaderComponent';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal';
import Loader from 'react-spinners/ClipLoader';
import api from 'services/api';

import { Container, Content, Footer } from './styles';

interface AppointmentPropsDelete {
  eventId: any;
  token: any;
  dateRecurrence: any;
  serieRecurrenceChange?: any;
}

interface ModalProps {
  close(): void;
  closeModal(): void;
  data: AppointmentPropsDelete;
}

const DeleteModal: React.FC<ModalProps> = ({
  close,
  closeModal,
  data,
  ...rest
}) => {
  const { addToast } = useToast();
  const [isSaveThis, setisSaveThis] = useState(false);
  const [isSaveNext, setisSaveNext] = useState(false);
  const [isSaveAll, setisSaveAll] = useState(false);
  const { handleModalActiveId } = useModal();

  const handleSaveThis = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');

      data.eventId;
      data.serieRecurrenceChange = 'one';
      data.token = userToken;
      data.dateRecurrence = localStorage.getItem('@GoJur:RecurrenceDate');
      setisSaveThis(true)
      
      await api.post(`/Compromisso/Deletar`, data);

      addToast({
        type: 'success',
        title: 'Compromisso Apagado',
        description: 'Seu compromisso foi apagado com sucesso',
      });
      close();
      closeModal();
      handleModalActiveId(0)
      setisSaveThis(false)

    } catch (err) {

      handleModalActiveId(0)
      setisSaveThis(false)
      addToast({
        type: 'error',
        title: 'Falha ao salvar o compromisso',
        description: 'Não foi possível apagar o compromisso',
      });
    }
  }, [addToast, close, closeModal, data]); // Salva apenas o compromisso de hoje


  const handleSaveAll = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');

      data.eventId;
      data.serieRecurrenceChange = 'all';
      data.token = userToken;
      data.dateRecurrence = localStorage.getItem('@GoJur:RecurrenceDate');
      setisSaveAll(true)

      await api.post(`/Compromisso/Deletar`, data);

      addToast({
        type: 'success',
        title: 'Compromisso Apagado',
        description: 'Seu compromisso foi apagado com sucesso',
      });

      close();
      closeModal();
      setisSaveAll(false)
      handleModalActiveId(0)
      
    } catch (err) {

      handleModalActiveId(0)
      setisSaveAll(false)
      addToast({
        type: 'error',
        title: 'Falha ao apagar o compromisso',
        description: 'Não foi possível apagar o compromisso',
      });
    }
  }, [addToast, close, closeModal, data]); // Salva todo o compromisso usando a recorrencia


  const handleSaveThisAndOthers = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');

      data.eventId;
      data.serieRecurrenceChange = 'next';
      data.token = userToken;
      data.dateRecurrence = localStorage.getItem('@GoJur:RecurrenceDate');
      setisSaveNext(true)
      
      await api.post(`/Compromisso/Deletar`, data);

      addToast({
        type: 'success',
        title: 'Compromisso Apagado',
        description: 'Seu compromisso foi apagado com sucesso',
      });

      close();
      closeModal();
      setisSaveNext(false)
      handleModalActiveId(0)

    } catch (err) {
      setisSaveNext(false)
      handleModalActiveId(0)
      addToast({
        type: 'error',
        title: 'Falha ao apagar o compromisso',
        description: 'Não foi possível apagar o compromisso',
      });
    }
  }, [addToast, close, closeModal, data]); // Apaga o compromisso recorrente de hoje em diante

  return (
    <Container {...rest}>
      <HeaderComponent title="Apagar" cursor action={close} />
      <Content>
        <p>Este compromisso foi gerado através de uma recorrência.</p>
        <p>Escolha abaixo para quais compromissos a alteração será aplicada:</p>
      </Content>
      <Footer>
        <button type="button" onClick={handleSaveThis}>
          Somente este
          {isSaveThis ? <Loader size={20} color="#f19000" /> : null}
        </button>
        <button type="button" onClick={handleSaveAll}>
          Todos
          {isSaveAll ? <Loader size={20} color="#f19000" /> : null}
        </button>
        <button type="button" onClick={handleSaveThisAndOthers}>
          Este e os seguintes
          {isSaveNext ? <Loader size={20} color="#f19000" /> : null}
        </button>
        <button type="button" onClick={close}>
          Cancelar
        </button>
      </Footer>
    </Container>
  );
};

export default DeleteModal;
