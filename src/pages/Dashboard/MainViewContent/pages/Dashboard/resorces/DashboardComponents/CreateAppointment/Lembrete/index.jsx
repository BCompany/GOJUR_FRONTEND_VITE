/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';

import { Container } from './styles';

const Lembrete = () => {
  const data = [
    { time: '5Minutos', id: 1 },
    { time: '10Minutos', id: 2 },
    { time: '15Minutos', id: 3 },
    { time: '30Minutos', id: 4 },
    { time: '1Hora', id: 5 },
    { time: '2Horas', id: 6 },
    { time: '4Horas', id: 7 },
    { time: '8horas', id: 8 },
    { time: 'Meio Dia', id: 9 },
    { time: '1 dia', id: 10 },
    { time: '2 dias', id: 11 },
    { time: '1 Semana', id: 12 },
    { time: '2 Semanas', id: 13 },
    { time: '1 Mẽs', id: 14 },
    { time: '2 Meses', id: 15 },
  ];

  const [options, setOptions] = useState(data);

  return (
    <Container>
      <Multiselect
        options={options} // Options to display in the dropdown
        displayValue="time"
        placeholder="Lembretes"
        closeIcon="cancel"
      />
      <input
        type="checkbox"
        name="Notification"
        id="Notification"
        title="Notificar Cliente do Processo"
      />
      {/* <label>Notificar Cliente</label> */}
    </Container>
  );
};

export default Lembrete;
