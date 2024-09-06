/* eslint-disable no-restricted-globals */
import React, { AreaHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import api from 'services/api';

import {
  borderColors,
  graphicsColors,
} from 'Shared/dataComponents/graphicsColors';
import HeaderComponent from '../../HeaderComponent';

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

const GraphicsProcessosPorFase: React.FC<GraphicProps> = ({
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
  const [metterValues, setMetterValues] = useState<number[]>([]);
  const [metter, setMetter] = useState<string[]>([]);
  const [screenWitdh, setScreenWitdh] = useState(screen.width);
  const [labelOptions, setLabelOptions] = useState(false);
  const [labelSettings, setLabelSettings] = useState(false);
  const [metterName, setMetterName] = useState<string>(title);
  const [metterMessage, setMetterMessage] = useState<string>('');
  const [haveAction, setHaveAction] = useState(false);
  const {dragOn} = useHeader();

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
          `/BIProcesso/ListarQuantidadeProcessosPorFaseProcessual`,
          {
            token: userToken,
          },
        );

        setMetter(
          response.data.resultValue.map(m => m.m_Item1.substring(0, 10)),
        );
        setMetterValues(response.data.resultValue.map(m => m.m_Item2));
      } catch (err:any) {
        setMetterMessage(err.message);
      }
    }

    handleData();
  }, [metterName, screenWitdh]);

  const data = {
    labels: metter,
    datasets: [
      {
        label: metterName,
        data: metterValues,
        backgroundColor: graphicsColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const option = {
    responsive: true,
    maintainAspectRatio: false,
    // maintainAspectRatio: labelSettings,
    plugins:{
      legend: {
        display: labelOptions,
        position: 'right',
      }
    }
  };

  return (
    <>
      {dragOn ? (
        <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
          <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} onMouseOut={activePropagation} onMouseOver={stopPropagation} handleClose={haveAction}>
            <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}} onMouseOut={activePropagation} onMouseOver={stopPropagation} >
              <p>{title}</p>
            </div>
            <div style={{display:'inline-block', width: "10%", height:"10%", cursor:"pointer"}} onMouseOut={activePropagation} onMouseOver={stopPropagation}>                       
              {visible == 'N' ? (
                  <button onClick={() => { handleClose("S", idElement)}} style={{display:'inline-block'}}>
                    <FaEye title='Ativar gráfico' />
                  </button>
                  ) : (
                  <button onClick={() => { handleClose("N", idElement)}} style={{display:'inline-block'}}>
                      <FiX title='Desativar gráfico' />
                  </button>  
              )}              
            </div>
          </ContainerHeader> 
          <Content>
            {metterValues.length === 0 ? (
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
              <Pie 
                type='pie' 
                data={data} 
                options={option}
              />
            )}
          </Content>
        </Container>
      ) : (
        <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
           <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} handleClose={haveAction}>
            <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}} >
              <p style={{width:"100%", height:"100%"}}>{title}</p>
            </div>
          </ContainerHeader> 
          <Content>
            {metterValues.length === 0 ? (
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
              <Pie 
                type='pie' 
                data={data} 
                options={option}
              />
            )}
          </Content>
        </Container>
      )}
    </>  
  );
};

export default GraphicsProcessosPorFase;
