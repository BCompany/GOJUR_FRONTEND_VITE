/* eslint-disable no-restricted-globals */
import React, { useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
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

const GraphicsProcessosDecisaoJudicial: React.FC<GraphicProps> = ({
  title,
  ...rest
}) => {
  const [metterValues, setMetterValues] = useState<number[]>([]);
  const [metter, setMetter] = useState<string[]>([]);
  const [screenWitdh, setScreenWitdh] = useState(screen.width);
  const [labelOptions, setLabelOptions] = useState(false);
  const [labelSettings, setLabelSettings] = useState(false);
  const [metterName, setMetterName] = useState<string>(title);
  const [metterMessage, setMetterMessage] = useState<string>('');

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
          `/BIProcesso/ListarQuantidadeProcessosPorDecisaoJudicial`,
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
    <Container {...rest}>
      <HeaderComponent title={metterName} cursor />

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
  );
};

export default GraphicsProcessosDecisaoJudicial;
