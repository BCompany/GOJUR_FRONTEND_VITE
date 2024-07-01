/* eslint-disable no-restricted-globals */
import React, {  useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useCustomer } from 'context/customer';
import api from 'services/api';
import chartLabels from "chartjs-plugin-datalabels";
import {borderColors, graphicsColors } from 'Shared/dataComponents/graphicsColors';
import { FcAbout } from 'react-icons/fc';
import { ChartContainer } from '../../styles';

const ChartCustomerChannel = () => {
  const [values, setValues] = useState<number[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const { objectJSON } = useCustomer()
  const token = localStorage.getItem('@GoJur:token');


  useEffect(() => {
    if ((objectJSON??"").length > 0){
      const json = JSON.parse(objectJSON);
      LoadChart(json.startDate, json.endDate)
    }
  }, [objectJSON])


  const LoadChart = async(sDate: string, eDate: string) => {
    const response = await api.get('NegocioDashboard/GraficoClientesPorCanalVendas', {
      params:{token, startDate: sDate, endDate: eDate}
    })

    setNames(response.data.resultValue.map(m => m.m_Item1));
    setValues(response.data.resultValue.map(m => m.m_Item2));
    setTitle(response.data.resultName);
  }


  const data = {
    labels: names,
    datasets: [{
      label: title,
      data: values,
      backgroundColor: graphicsColors,
      borderColor: borderColors,
      borderWidth: 1,
    }]
  }


  const options =  {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      datalabels: {
        font: {
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
        <FcAbout title="Este gráfico representa a totalização dos canais de venda com base na definição feita em seu cadastro, os que não possuirem esta informação não serão contabilizados." />
      </div>

      {values.length === 0 && <p>Não existem dados o suficiente para esse indicador</p>}
      {values.length > 0 && (
        <Doughnut
          type='pie'
          data={data}
          plugins={[chartLabels]}
          options={options}
        />
      )}
    </ChartContainer>
  )
}

export default ChartCustomerChannel