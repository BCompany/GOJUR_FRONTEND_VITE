/* eslint-disable no-restricted-globals */
import React, { AreaHTMLAttributes, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
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

const GraphicsProcessosPorNaturezaJuridica: React.FC<GraphicProps> = ({
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
  const [metterNature, setMetterNature] = useState<string[]>([]);
  const [metterValues, setMetterValues] = useState<number[]>([]);

  const [labelSettings, setLabelSettings] = useState(false);
  const [labelOptions, setLabelOptions] = useState(false);
  const [screenWitdh, setScreenWitdh] = useState(screen.width);
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
          `/BIProcesso/ListarQuantidadeProcessosPorNaturezaJuridica`,
          {
            token: userToken,
          },
        );

        setMetterNature(
          response.data.resultValue.map(m => m.m_Item1.substring(0, 10)),
        );
        setMetterValues(response.data.resultValue.map(i => i.m_Item2));
      } catch (err:any) {
        console.log(err);
      }
    }
    handleData();
  }, [screenWitdh]);

  const data = {
    labels: metterNature,
    datasets: [
      {
        data: metterValues,
        backgroundColor: graphicsColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const option = {
    responsive: true,
    // maintainAspectRatio: labelSettings,
    maintainAspectRatio: false,

    plugins:{
      legend: {
        display: labelOptions,
        position: 'right',
      }
    },
  };
  return (
    <>
      {dragOn ? (
          <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
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
                <Doughnut
                  type='doughnut'
                  data={data} 
                  options={option}
                />
              )}
            </Content>
          </Container>
      ) : (
        <Container id='Container' {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
           <ContainerHeader id='ContainerHeader' style={{display:'flex', zIndex:99999}} cursorMouse={cursor} handleClose={handleClose}>
              <div style= {{ display:'flex', width:"100%", height:"100%", alignItems: "center", justifyContent: "center", textAlign: "center",...rest}} >
                <p style={{ margin: 0}}>{title}</p>
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
              <Doughnut
                type='doughnut'
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

export default GraphicsProcessosPorNaturezaJuridica;
