/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {  useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2'
import api from 'services/api';
import {borderColors, graphicsColors } from 'Shared/dataComponents/graphicsColors';
import chartLabels from "chartjs-plugin-datalabels";
import { FcAbout } from 'react-icons/fc';
import { ChartContainer } from '../../styles';

const ChartCustomerStatus = () => {
      
  const [values, setValues] = useState<number[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
    const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    LoadChart();

  }, [])

  const LoadChart = async() => {
    const response = await api.get('NegocioDashboard/GraficoClientesPorStatus', {
      params:{
        token
      }
    })    

    setNames(response.data.resultValue.map(m => m.m_Item1.substring(0, 10)));
    setValues(response.data.resultValue.map(m => m.m_Item2));
    setTitle(response.data.resultName);
  }    

  const data = {
    labels: names,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: graphicsColors,
        borderColor: borderColors,
        borderWidth: 1,
      }
    ]
  }

  const options =  {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        font: {
          // weight: 'bold',
          size: 14,
        }
      }
    }
  }
  
  return (

    <ChartContainer>

      <div>
        {title}
        { ' ' }
        <FcAbout title="Este gráfico representa a totalização dos clientes com base no status definido em seu cadastro (Ativo ou Inativo).  " />
      </div>
      
      {values.length > 0 && (
        <Doughnut   
          type='doughnut'
          data={data}
          plugins={[chartLabels]}
          options={options}
        />
      )}

    </ChartContainer>

  )
}

 export default ChartCustomerStatus