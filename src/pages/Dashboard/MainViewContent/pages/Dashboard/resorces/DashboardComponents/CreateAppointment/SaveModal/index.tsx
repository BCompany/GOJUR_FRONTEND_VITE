/* eslint-disable no-param-reassign */
import React, { useCallback, useState } from 'react';
import HeaderComponent from 'components/HeaderComponent';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/ClipLoader';
import api from 'services/api';

import { Container, Content, Footer } from './styles';

interface MatterProps {
  matterId: any;
}

interface AppointmentPropsSave {
  eventId: any;
  startDate: any;
  endDate: any;
  description: any;
  eventNote?: any;
  subjectId: any;
  subject?: any;
  userCreator?: any;
  allDay?: any;
  token: any;
  subjectColor?: any;
  status?: any;
  AllowEdit?: any;
  privateEvent?: any;
  recurrent?: any;
  remindersList?: any[];
  responsibleList?: any[];
  sharedList?: any[];
  matter?: MatterProps|null;
  dateRecurrence: any;
  recurrenceRuleJSON:any;
  serieRecurrenceChange?: any;
  isConfirmSave:any;
}

interface ModalProps {
  close(): void;
  closeModal(): void;
  data: AppointmentPropsSave;
}

const SaveModal: React.FC<ModalProps> = ({
  close,
  closeModal,
  data,
  ...rest
}) => {
  const { addToast } = useToast();
  const [isSaveThis, setisSaveThis] = useState(false);
  const [isSaveNext, setisSaveNext] = useState(false);
  const [isSaveAll, setisSaveAll] = useState(false);


  const handleSaveThis = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');

      data.serieRecurrenceChange = 'one';
      data.token = userToken;
      data.matter = {matterId: localStorage.getItem('@GoJur:MatterId')};
      data.dateRecurrence = localStorage.getItem('@GoJur:RecurrenceDate');
      setisSaveThis(true)
      
      await api.put(`/Compromisso/Salvar`, data);

      addToast({
        type: 'success',
        title: 'Compromisso Salvo',
        description: 'Seu compromisso foi salvo com sucesso',
      });
      close();
      closeModal();
      setisSaveThis(false)
      localStorage.removeItem('@GoJur:MatterId');

    } catch (err:any) {
      setisSaveThis(false)
      addToast({
        type: 'error',
        title: 'Falha ao salvar o compromisso',
        description: err.response.data.Message,
      });
    }
  }, [addToast, close, closeModal, data]); // Salva apenas o compromisso de hoje


  const handleSaveAll = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');

      data.serieRecurrenceChange = 'all';
      data.token = userToken;
      setisSaveAll(true)

      await api.put(`/Compromisso/Salvar`, data);

      addToast({
        type: 'success',
        title: 'Compromisso Salvo',
        description: 'Seu compromisso foi salvo com sucesso',
      });

      close();
      closeModal();
      setisSaveAll(false)
      
    } catch (err:any) {
      setisSaveAll(false)
      addToast({
        type: 'error',
        title: 'Falha ao salvar o compromisso',
        description: err.response.data.Message,
      });
    }
  }, [addToast, close, closeModal, data]); // Salva todo o compromisso usando a recorrencia


  const handleSaveThisAndOthers = useCallback(async () => {
    try {
      data.serieRecurrenceChange = 'next';
      setisSaveNext(true)
      
      await api.put(`/Compromisso/Salvar`, data);

      addToast({
        type: 'success',
        title: 'Compromisso Salvo',
        description: 'Seu compromisso foi salvo com sucesso',
      });

      close();
      closeModal();
      setisSaveNext(false)
    } catch (err:any) {
      setisSaveNext(false)
      addToast({
        type: 'error',
        title: 'Falha ao salvar o compromisso',
        description: err.response.data.Message,
      });
    }
  }, [addToast, close, closeModal, data]); // Salva o compromisso recorrente de hoje em diante


  return (
    <Container {...rest}>
      <HeaderComponent title="Salvar" cursor action={close} />
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

export default SaveModal;
