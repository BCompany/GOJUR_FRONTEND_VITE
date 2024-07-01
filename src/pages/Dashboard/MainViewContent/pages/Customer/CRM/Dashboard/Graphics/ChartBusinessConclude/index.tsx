/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable object-shorthand */
/* eslint-disable no-param-reassign */

import { useCustomer } from 'context/customer';
import React, {  useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';
import api from 'services/api';
import { FcAbout } from 'react-icons/fc';
import { borderColors, graphicsColors } from 'Shared/dataComponents/graphicsColors';
import { ChartContainer } from '../../styles';

const ChartBusinessConclude = () => {
  const [stringValues, setStringValues] = useState<string[]>([])
  // const [values, setValues] = useState<number[]>([])
  const [names, setNames] = useState<string[]>([])
  const [title, setTitle] = useState<string>('')
  const [totalOption, setTotalOptions] = useState<string>('quantity')
  const {objectJSON} = useCustomer()
  const token = localStorage.getItem('@GoJur:token')
  const chartRef = useRef(null)
  const history = useHistory()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')


  useEffect(() => {
    if ((objectJSON??"").length > 0){
      const json = JSON.parse(objectJSON);
      LoadChart(json.startDate, json.endDate)
    }
  }, [objectJSON, totalOption])


  const LoadChart = async(sDate: string, eDate: string) => {
    const response = await api.get('NegocioDashboard/GraficoNegociosFechados', {
      params: {token, startDate: sDate, endDate: eDate, totalOption}
    })

    setStartDate(sDate)
    setEndDate(eDate)

    setTitle(response.data.resultName)
    setNames(response.data.resultValue.map(m => m.m_Item1.substring(0, 15)))
    setStringValues(response.data.resultValue.map(m => m.m_Item2.toFixed(2)))
  }


  const data = {
    labels: names,
    datasets: [{
      label: title,
      data: stringValues,
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
    legend: { display: false },
    maintainAspectRatio: false,
    maxBarThickness: 80,
    animation: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        usePointStyle: true,
        tooltip: {
          callbacks: {
            title(t) {
              const item = t.length > 0 ? t[0] : null;
              return item ? `${item.label} ${item.formattedValue}` : ""
            },
            label(t) {
              if (t.label === 'Em Andamento'){
                return "Considera TODOS os negócios em aberto no momento."
              }

              return "";
            }
          },
        }
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        },
      }],
      xAxes: [{
        ticks: {
          fontSize:12,
        }
      }]
    }
  }


  const handleOptionButtion = (e, option) => {
    setTotalOptions(option)
  }


  const ClickElement = (name) => {
    if(name != 'Total')
      localStorage.setItem('@GoJur:SalesFunnelFilter', name)

    localStorage.setItem('@GoJur:SalesFunnelDateType', 'E')
    localStorage.setItem('@GoJur:SalesFunnelStartDate', startDate)
    localStorage.setItem('@GoJur:SalesFunnelEndDate', endDate)

    history.push(`../../CRM/salesFunnel`)
  }


  return (
    <ChartContainer>
      <div>
        {title}
        {' '}
        <FcAbout title="Este gráfico representa todos os negócios fechados (com base no status definido). A primeira barra sempre irá representar o total dos negócios fechados, as barras seguintes irá totalizar por responsável, caso o mesmo tenha sido definido. A data de fechamento é utilizada como critério deste gráfisco sempre em relação ao período escolhido no topo do dashboard." />
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
      
      {stringValues.length === 0 && <p>Não existem dados o suficiente para esse indicador</p>}
      {stringValues.length > 0 && (
        <Bar
          ref={chartRef}
          type='bar'
          data={data}
          options={options}
          getElementAtEvent={(elements:any, event) => {
            if (event.type === 'click' && elements.length) {
              const elementIndex = elements[0].index;
              ClickElement(data.labels[elementIndex])
            }
            if (event.type === 'hover' && elements.length) {
              const elementIndex = elements[0].index;
              console.log('HOVER: ', data.labels[elementIndex])
            }
          }}
        />
      )}
    </ChartContainer>
  )
}

export default ChartBusinessConclude