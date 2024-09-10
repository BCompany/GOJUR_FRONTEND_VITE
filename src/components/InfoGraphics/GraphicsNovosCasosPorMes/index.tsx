/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, AreaHTMLAttributes } from 'react';
import { Line } from 'react-chartjs-2';
import api from 'services/api';
import HeaderComponent from '../../HeaderComponent';

import {
  borderColors,
  graphicsColors,
} from '../../../Shared/dataComponents/graphicsColors';

import { Container, Content, ContainerHeader } from './styles';
import { useHeader } from 'context/headerContext';

import { FaEye } from "react-icons/fa";
import {  FiX } from 'react-icons/fi';

interface Data {
  resultName: string;
  resultValue: [
    {
      m_Item1: string;
      m_Item2: number;
      m_Item3: number;
      m_Item4: number;
    },
  ];
}
interface GraphicProps {
  title: string;
  idElement: string;
  visible: string;
  activePropagation: any;
  stopPropagation: any;
  xClick:any;
  handleClose: any;
  cursor: boolean;
}

interface HeaderProps extends AreaHTMLAttributes<HTMLAreaElement> {
  title: string;
  cursor: boolean;
  action?: any;
}

const GraphicsNovosCasosPorMes: React.FC<GraphicProps> = ({
  title,
  idElement,
  visible,
  activePropagation,
  stopPropagation,
  xClick,
  handleClose,
  cursor,
  ...rest
}) => {
  const [monthValues, setMonthValues] = useState<string[]>([]);
  const [incomeMetters, setIncomeMetters] = useState<number[]>([]);
  const [distributedMetters, setDistributedMetters] = useState<number[]>([]);
  const [endMetters, setEndMetters] = useState<number[]>([]);
  const [graphicsData, setGraphicsData] = useState({});
  const [metterName, setMetterName] = useState<string>(title);
  const [metterMessage, setMetterMessage] = useState<string>('');
  const token = localStorage.getItem('@GoJur:token');
  const [haveAction, setHaveAction] = useState(false);
  const {dragOn} = useHeader();

  useEffect(() => {
    async function handleData() {
      try {

        const response = await api.post<Data>(
          `/BIProcesso/ListarQuantidadeProcessosDataEntrada`,{
            token
          },
        );

        setMonthValues(response.data.resultValue.map(m => m.m_Item1));
        setIncomeMetters(response.data.resultValue.map(m => m.m_Item2));
        setDistributedMetters(response.data.resultValue.map(m => m.m_Item3));
        setEndMetters(response.data.resultValue.map(m => m.m_Item4));
        setGraphicsData(response.data);
      } catch (err:any) {
        setMetterMessage(err.message);
      }
    }
    handleData();
  }, []);

  const data = {
    labels: monthValues,
    datasets: [
      {
        label: 'Distribuidos',
        data: distributedMetters,
        fill: false,
        backgroundColor: 'rgb(20, 99, 132)',
        borderColor: 'rgba(20, 99, 132, 0.4)',
        tension: 0.1,
      },
      {
        label: 'Entraram',
        data: incomeMetters,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.4)',
        tension: 0.1,
      },
      {
        label: 'Finalizados',
        data: endMetters,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(75, 180, 132, 0.4)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins:{
      legend: {
        display: true,
        position: 'top',
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
    {dragOn ? (
      <Container id='Container' {...rest} {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
         <ContainerHeader id='ContainerHeader' style={{display:'block', zIndex:99999}} cursorMouse={cursor} handleClose={handleClose}  onMouseOut={activePropagation} onMouseOver={stopPropagation}>
              <div style= {{ float:"left", display: "-webkit-box", width:"90%", height:"100%", alignItems: "center", justifyContent: "center", textAlign: "center",...rest}} >
                <p style={{ margin: 0, width:"110%"}}>{title}</p>
              </div>
              <div style={{float:"left", display:'inline-block', width: "10%", height:"10%", cursor:"pointer"}} onMouseOut={activePropagation} onMouseOver={stopPropagation}>                       
                {visible == 'S' && (
                  <button onClick={() => { handleClose("N", idElement)}} style={{display:'inline-block'}}>
                    <FiX title='Desativar gráfico' />
                  </button>
                )}              
              </div>
          </ContainerHeader> 
        <Content>
          {endMetters.length === 0 ? (
            <p
              style={{
                fontSize: 14,
                color: '#7d7d7d',
                textAlign: 'center',
                flex: 1,
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              Não existem dados o suficiente para esse indicador
            </p>
          ) : (
            <>
              <div style={{marginBottom:'30px'}} />
              <Line 
                type='line' 
                data={data} 
                options={options}
              />
            </>
          )}
        </Content>
      </Container>
    ) : (
          <Container {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
            <ContainerHeader id='ContainerHeader' style={{display:'flex', zIndex:99999}} cursorMouse={cursor} handleClose={handleClose}>
              <div style= {{ display:'flex', width:"100%", height:"100%", alignItems: "center", justifyContent: "center", textAlign: "center",...rest}} >
                <p style={{ margin: 0}}>{title}</p>
              </div>
            </ContainerHeader> 
            <Content>
              {endMetters.length === 0 ? (
                <p
                  style={{
                    fontSize: 14,
                    color: '#7d7d7d',
                    textAlign: 'center',
                    flex: 1,
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                  }}
                >
                  Não existem dados o suficiente para esse indicador
                </p>
              ) : (
                <>
                  <div style={{marginBottom:'30px'}} />
                  <Line 
                    type='line' 
                    data={data} 
                    options={options}
                  />
                </>
              )}
            </Content>
          </Container>
      )}
    </>
  );
};

export default GraphicsNovosCasosPorMes;
