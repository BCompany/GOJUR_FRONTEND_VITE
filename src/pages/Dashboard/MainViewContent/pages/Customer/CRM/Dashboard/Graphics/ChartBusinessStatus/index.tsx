/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable object-shorthand */

import { useCustomer } from 'context/customer';
import React, {  useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2'
import api from 'services/api';
import { FcAbout } from 'react-icons/fc';
import { borderColors, graphicsColors } from 'Shared/dataComponents/graphicsColors';
import { useHistory } from 'react-router-dom';
import { ChartContainer } from '../../styles';

const ChartBusinessStatus = () => {
  const [values, setValues] = useState<number[]>([])
  const [names, setNames] = useState<string[]>([])
  const [title, setTitle] = useState<string>('')
  const [totalOption, setTotalOptions] = useState<string>('quantity')
  const chartRef = useRef(null)
  const history = useHistory()
  const { objectJSON } = useCustomer()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const token = localStorage.getItem('@GoJur:token')


  useEffect(() => {
    if ((objectJSON??"").length > 0){
      const json = JSON.parse(objectJSON);
      LoadChart(json.startDate, json.endDate)
    }
  }, [objectJSON, totalOption])


  const LoadChart = async(sDate: string, eDate: string) => {
    const response = await api.get('NegocioDashboard/GraficoNegociosPorStatus', {
      params:{token, startDate: sDate, endDate: eDate, totalOption}
    })

    console.log(response.data.resultValue)

    setStartDate(sDate)
    setEndDate(eDate)

    setNames(response.data.resultValue.map(m => m.m_Item1.substring(0, 21)));
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
      borderWidth: 1
    }]
  }


  const options = {
    onHover: (event, chartElement) => {
      if(chartElement.length == 1)
        event.native.target.style.cursor = 'pointer'
      else
        event.native.target.style.cursor = 'default'
    },
    responsive: true,
    maintainAspectRatio: false,
    maxBarThickness: 80,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title(t) {
            const item = t.length > 0 ? t[0] : null;
            return item ? `${item.label} ${ item.formattedValue}` : ""
          },
          label(t) {
            if (t.label === 'Em Andamento'){
              return "Considera os negócios em andamento no periodo."
            }
            if (t.label === 'Total em Andamento'){
              return "Considera TODOS os negócios em andamento."
            }
            return "";
          }
        },
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
      }] ,
      xAxes: [{
        ticks: {
          fontSize:12,
        },
      }]
    }
  };


  const handleOptionButtion = (e, option) => {
    setTotalOptions(option)
  }


  const ClickElement = (name) => {

    if(name.includes('Total em Andamento')){
      localStorage.setItem('@GoJur:SalesFunnelStatus', 'TO')
      localStorage.setItem('@GoJur:SalesFunnelDateType', 'A')
    }
    else if(name.includes('Em Andamento')){
      localStorage.setItem('@GoJur:SalesFunnelStatus', 'EA')
      localStorage.setItem('@GoJur:SalesFunnelDateType', 'S')
    }
    else if(name.includes('Perdido')){
      localStorage.setItem('@GoJur:SalesFunnelStatus', 'PE')
      localStorage.setItem('@GoJur:SalesFunnelDateType', 'E')
    }
    else if(name.includes('Fechado')){
      localStorage.setItem('@GoJur:SalesFunnelStatus', 'FE')
      localStorage.setItem('@GoJur:SalesFunnelDateType', 'E')
    }
    
    localStorage.setItem('@GoJur:SalesFunnelStartDate', startDate)
    localStorage.setItem('@GoJur:SalesFunnelEndDate', endDate)
    history.push(`../../CRM/salesFunnel`)
  }


  return (
    <ChartContainer>
      <div>
        {title}
        {' '}
        <FcAbout title="Este gráfico representa todas as oportunidades de negócio por status  (andamento/fechado/perdido). A primeira barra sempre irá representar a totalização geral dos negócios em andamento, independente do periodo pesquisado. Para os negócios em andamento é utilizada como critério a data de início, paras os negocios fechados com êxito ou perdidos é utilizada a data de fechamento como critério, sempre em relação ao período escolhido no topo do dashboard." />
      </div>

      <div className="chartToolBar">
        <input type="radio" checked={totalOption === 'quantity'} onClick={(e) => handleOptionButtion(e,'quantity')}  />
        {' '}
        Por Total
        &nbsp;&nbsp;
        <input type="radio" checked={totalOption === 'money'} onClick={(e) => handleOptionButtion(e,'money')}  />
        {' '}
        Por Valor
      </div>

      {values.length === 0 && <p>Não existem dados o suficiente para esse indicador</p>}
      {values.length > 0 && (
        <Bar
          ref={chartRef}
          type='doughnut'
          data={data}
          options={options}
          getElementAtEvent={(elements:any, event) => {
            if (event.type === 'click' && elements.length) {
              const elementIndex = elements[0].index;
              ClickElement(data.labels[elementIndex])
            }
            if (event.type === 'mousemove' && elements.length) {
              const elementIndex = elements[0].index;
              console.log(data.labels[elementIndex])
            }
          }}
        />
      )}
    </ChartContainer>
  )
}

export default ChartBusinessStatus