import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from 'services/api';
import HeaderComponent from '../../HeaderComponent';

import { Container, Content, ContainerHeader } from './styles';
import { useHeader } from 'context/headerContext';

import { FaEye } from "react-icons/fa";
import { FiX } from 'react-icons/fi';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Center } from 'pages/Coverages/styles';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface Data {
  resultName: string;
  resultValue: [
    {
      m_Item1: string; 
      m_Item2: number; 
      m_Item3: number; 
    },
  ];
}

interface GraphicProps {
  title: string;
  idElement: string;
  visible: string;
  activePropagation: any;
  stopPropagation: any;
  xClick: any;
  handleClose: any;
  cursor: boolean;
}

const GraphicsTempoMedioDeDistribuicao: React.FC<GraphicProps> = ({
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
  const [monthlyAverages, setMonthlyAverages] = useState<number[]>([]);
  const [annualAverage, setAnnualAverage] = useState<number | null>(null);
  const [metterMessage, setMetterMessage] = useState<string>('');
  const token = localStorage.getItem('@GoJur:token');
  const { dragOn } = useHeader();
  const [screenWitdh, setScreenWitdh] = useState(screen.width);
  const [labelOptions, setLabelOptions] = useState(false);
  const [labelSettings, setLabelSettings] = useState(false);

  useEffect(() => {
    if (screenWitdh >= 1366) {
      setLabelOptions(true);
    }

    if (screenWitdh <= 1366) {
      setLabelSettings(false);
    } else {
      setLabelSettings(true);
    }

    async function handleData() {
      try {
        const userToken = localStorage.getItem('@GoJur:token');

        const response = await api.post<Data>(
          `/BIProcesso/ListarTempoDeDistribuicaoMedia`,
          {
            token: userToken,
          },
        );

        const labels = response.data.resultValue.map(m => m.m_Item1); 
        const monthlyData = response.data.resultValue.map(m => m.m_Item2); 
        const average = response.data.resultValue[0]?.m_Item3 ?? null; 

        setMonthValues(labels);
        setMonthlyAverages(monthlyData);
        setAnnualAverage(average);
      } catch (err: any) {
        setMetterMessage(err.message);
      }
    }
    
    handleData();
  }, [token, screenWitdh]);

  const data = {
    labels: monthValues,
    datasets: [
      {
        label: 'Média do Mês(Dias)',
        data: monthlyAverages,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.4)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Meses',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Média(Dias)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      {dragOn ? (
        <Container id='Container' {...rest} style={{ opacity: visible === 'N' ? '0.5' : '1' }}>
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
            {monthlyAverages.length === 0 ? (
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
                <div style={{ marginBottom: '30px' }} />
                <Line
                    data={data}
                    options={options} type={undefined}                
                />
                {annualAverage !== null && (
                  <p style={{ fontSize: '14px', color: '#000', fontWeight: 500, textAlign: 'center' }}>
                    Tempo Médio de Distribuição (12 meses): {annualAverage}
                  </p>
                )}
              </>
            )}
          </Content>
        </Container>
      ) : (
        <Container {...rest} style={{ opacity: visible === 'N' ? '0.5' : '1' }}>
          <ContainerHeader id='ContainerHeader' style={{display:'flex', zIndex:99999}} cursorMouse={cursor} handleClose={handleClose}>
              <div style= {{ display:'flex', width:"100%", height:"100%", alignItems: "center", justifyContent: "center", textAlign: "center",...rest}} >
                <p style={{ margin: 0}}>{title}</p>
              </div>
          </ContainerHeader> 
          <Content>
            {monthlyAverages.length === 0 ? (
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
                <div style={{ marginBottom: '30px' }} />
                <Line
                      data={data}
                      options={options} type={undefined}                />
                {annualAverage !== null && (
                  <p style={{ fontSize: '14px', color: '#000', fontWeight: 500, textAlign: 'center' }}>
                    Tempo Médio de Distribuição (12 meses): {annualAverage}
                  </p>
                )}
              </>
            )}
          </Content>
        </Container>
      )}
    </>
  );
};

export default GraphicsTempoMedioDeDistribuicao;
