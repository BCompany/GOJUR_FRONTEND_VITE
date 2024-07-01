/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import api from 'services/api';

import {
  borderColors,
  graphicsColors,
} from 'Shared/dataComponents/graphicsColors';
import HeaderComponent from '../../HeaderComponent';

import { Container, Content } from './styles';

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
}

const GraphicsProcessosPorNaturezaJuridica: React.FC<GraphicProps> = ({
  title,
  ...rest
}) => {
  const [metterNature, setMetterNature] = useState<string[]>([]);
  const [metterValues, setMetterValues] = useState<number[]>([]);

  const [labelSettings, setLabelSettings] = useState(false);
  const [labelOptions, setLabelOptions] = useState(false);
  const [screenWitdh, setScreenWitdh] = useState(screen.width);

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
    <Container {...rest}>
      <HeaderComponent title={title} cursor />
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
  );
};

export default GraphicsProcessosPorNaturezaJuridica;
