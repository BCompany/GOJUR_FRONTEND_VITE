/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, ChangeEvent, useCallback, AreaHTMLAttributes } from 'react';
import { Line } from 'react-chartjs-2';
import api from 'services/api';
import HeaderComponent from '../../HeaderComponent';

import { Container, ContainerHeader } from './styles';
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
      m_Item4: string;
    },
  ];
}

interface Conta {
  contaId: number;
  description: string;
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

interface DefaultsListData {
  id: string;
  value: string;
}
interface AccountsData {
  id: string;
  value: string;
}

// const optionsGraphic = [
//   {
//     id: 1,
//     description: 'Previsto',
//     endPoint: '/BIFinanceiro/ListarReceitasDespesasPrevistas',
//   },
//   {
//     id: 2,
//     description: 'Realizado',
//     endPoint: '/BIFinanceiro/ListarReceitasDespesasRealizadas',
//   },
// ];

const optionsGraphic = [
  {id: 0, description: 'Previsto' },
  {id: 1, description: 'Realizado' }
];

const GraphicsReceitasEDespesas: React.FC<GraphicProps> = ({title, idElement, visible, activePropagation, stopPropagation, xClick, handleClose, cursor, ...rest }) => {
  const [monthValues, setMonthValues] = useState<string[]>([]);
  const [incomes, setIncomes] = useState<number[]>([]);
  const [outcomes, setOutcomes] = useState<number[]>([]);
  const [chartType, setChartType] = useState<string>('0');
  const [metterName, setMetterName] = useState<string>(title);
  const [metterMessage, setMetterMessage] = useState<string>('');
  const [selectedCarteira, setSelectedCarteira] = useState('');
  const [carteira, setCarteira] = useState<AccountsData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [haveAction, setHaveAction] = useState(false);
  const {dragOn} = useHeader();

  useEffect(() => {

    async function handleDefaultAccont() {
      try {
        const response = await api.post<DefaultsListData[]>(`/Defaults/Listar`,{
            token
        });

        const account = response.data
          .filter(item => item.id === 'defaultAccount')
          .map(i => i.value)
          .toString();

        setSelectedCarteira(account);
      } catch (err:any) {
        console.log(err);
      }
    }

    handleDefaultAccont();

  }, []); // Seleciona conta padrão

  useEffect(() => {

    async function handleAccounts() {
      try {
        const response = await api.post<AccountsData[]>(`/ContasBancarias/Listar`,{
            token,
            term: '',
        });

        setCarteira(response.data);
      } catch (err:any) {
        console.log(err);
      }
    }
    handleAccounts();
  }, []); // Carrega as contas bancarias

  const LoadGraphic = async() => {    

    try {
      const response = await api.post<Data>('/BIFinanceiro/ListarReceitasDespesas', {
        token,
        accountId: selectedCarteira,
        IsForeseen: chartType === '0',
        dateComplete: true,
      });

      setMonthValues(response.data.resultValue.filter(v => v.m_Item4 === "R").map(m => m.m_Item1));
      setIncomes(response.data.resultValue.filter(v => v.m_Item4 === "R").map(m => m.m_Item2));
      setOutcomes(response.data.resultValue.filter(v => v.m_Item4 === "D").map(m => m.m_Item3));
      
    } catch (err: any) {
      setMetterMessage(err.message);
    }
  }

  useEffect(() => {
    
    if (selectedCarteira != ''){
      LoadGraphic()
    }
   
  }, [chartType]); 

  useEffect(() => {
    
    if (selectedCarteira != ''){
      LoadGraphic()
    }
   
  }, [selectedCarteira]); 

  const handleSelectedCarteira = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedCarteira(event.target.value);    
  },[]);

  const data = {
    labels: monthValues,
    datasets: [
      {
        label: 'Despesas',
        data: outcomes,
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgb(20, 99, 132)',
        borderColor: 'rgba(20, 99, 132, 0.4)',
      },
      {
        label: 'Receita',
        data: incomes,
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.4)',
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
          <Container {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
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
            <div>
              <label htmlFor="carteira" />
              <select
                name="carteira"
                id="carteira"
                value={selectedCarteira}
                onChange={handleSelectedCarteira}
              >
                {carteira.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.value}
                  </option>
                ))}
              </select>

              <label htmlFor="endpoint" />

              <select
                name="EndPoint"
                id="endpoint"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                {optionsGraphic.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.description}
                  </option>
                  ))}
              </select>

            </div>

            <Line
              type='line'
              data={data} 
              options={options}
            />
          </Container>
      ) : (
        <Container {...rest} style={{opacity:(visible === 'N' ? '0.5' : '1')}}>
          <ContainerHeader id='ContainerHeader' style={{display:'inline-block', zIndex:99999}} cursorMouse={cursor} handleClose={haveAction}>
            <div style= {{ display:'inline-block', width:"90%", height:"90%",...rest}} >
              <p style={{width:"100%", height:"100%"}}>{title}</p>
            </div>
          </ContainerHeader>    
        <div>
          <label htmlFor="carteira" />
          <select
            name="carteira"
            id="carteira"
            value={selectedCarteira}
            onChange={handleSelectedCarteira}
          >
            {carteira.map(c => (
              <option key={c.id} value={c.id}>
                {c.value}
              </option>
            ))}
          </select>

          <label htmlFor="endpoint" />

          <select
            name="EndPoint"
            id="endpoint"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {optionsGraphic.map(c => (
              <option key={c.id} value={c.id}>
                {c.description}
              </option>
              ))}
          </select>

        </div>

        <Line
          type='line'
          data={data} 
          options={options}
        />
        </Container>
      )}
    </>    
  );
};

export default GraphicsReceitasEDespesas;
