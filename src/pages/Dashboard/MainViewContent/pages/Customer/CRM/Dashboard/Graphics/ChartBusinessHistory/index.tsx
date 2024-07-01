/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {  useState, useEffect  } from 'react';
import { Line } from 'react-chartjs-2'
import api from 'services/api';
import { FcAbout } from 'react-icons/fc';
import { ChartContainer } from '../../styles';

const ChartBusinessHistory = (props) => {
  const [valuesStatusFollowing, setValuesStatusFollowing] = useState<number[]>([]);
  const [valuesStatusConclude, setValuesStatusConclude] = useState<number[]>([]);
  const [valuesStatusFinished, setValuesStatusFinished] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const showChart = valuesStatusFollowing.length > 0 || valuesStatusConclude.length > 0 || valuesStatusFinished.length > 0;
  const {startDate, endDate} = props
  const token = localStorage.getItem('@GoJur:token');


  useEffect(() => {
    LoadChart();
  }, [])


  const LoadChart = async() => {
    if (startDate == '' || endDate == '')
      return false;

    const response = await api.get('NegocioDashboard/GraficoNegociosHistorico', {
      params:{
        token,
        startDate,
        endDate
      }
    })    

    // Line with status = EA - Em Andamento
    setValuesStatusFollowing(response.data.resultValue.filter(item => item.m_Item1 == 'NO').map(m => m.m_Item4))

    // Line with status = FE - Fechado
    setValuesStatusConclude(response.data.resultValue.filter(item => item.m_Item1 == 'FE').map(m => m.m_Item4))

    // Line with status = PE - Finalizado
    setValuesStatusFinished(response.data.resultValue.filter(item => item.m_Item1 == 'PE').map(m => m.m_Item4))
 
    // Line on X cordenate with month names
    setMonths(response.data.resultValue.filter(item => item.m_Item1 == 'NO').map(m => m.m_Item3))

    // set chart Name
    setTitle(response.data.resultName);
  }


  const labels = months
  const data = {
    labels,
    animation: false,
    datasets: [
      {
        label: "Novas Oportunidades",
        data:valuesStatusFollowing,
        fill: false,
        tension: 0.1,
        borderColor:  'rgba(127, 127, 127, 1)',
        backgroundColor: 'rgba(127, 127, 127, 1)'
      },
      {
        label: "Fechado (Êxito)",
        data:valuesStatusConclude,
        fill: false,
        tension: 0.1,
        borderColor: 'rgba(63, 127, 191, 1)',
        backgroundColor: 'rgba(63, 127, 191, 1)'
      },
      {
        label: "Perdido",
        data:valuesStatusFinished,
        fill: false,
        tension: 0.1,
        borderColor: 'rgba(191, 63, 63, 1)',
        backgroundColor: 'rgba(191, 63, 63, 1)'
      }
    ],
    
  };


  const options = {
    responsive: true ,
    animation: false,
    maintainAspectRatio: false
  };


  return (
    <ChartContainer>
      <div>
        {title}
        { ' ' }
        <FcAbout title="Este gráfico representa a visualização dos últimos 12 meses das oportunidades de negócio: Fechadas (Êxito), Perdidas e as Novas Oportunidades que irá indicar a total de todos os negócios independente do status definido.  " />
      </div>

      {!showChart && <p>Não existem dados o suficiente para esse indicador</p>}
      {showChart && (
        <Line   
          type='line'
          data={data}
          options={options}
        />
      )}
    </ChartContainer>
  )
}

export default ChartBusinessHistory