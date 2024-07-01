/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-restricted-globals

import { HeaderPage } from 'components/HeaderPage';
import Select from 'react-select'
import GridLayout from 'react-grid-layout';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from 'context/toast';
import { useCustomer } from 'context/customer';
import { format } from 'date-fns'
import { BsFunnel } from 'react-icons/bs';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import DatePicker from 'components/DatePicker';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { useDefaultSettings } from 'context/defaultSettings';
import api from 'services/api';
import { useHistory } from 'react-router-dom';
import { FcSearch } from 'react-icons/fc';
import { AiOutlineUser } from 'react-icons/ai';
import { useHeader, } from 'context/headerContext';
import { Container, TaskBar, Content, Wrapper } from './styles';
import ChartCustomerStatus from './Graphics/ChartCustomerStatus';
import ChartCustomerChannel from './Graphics/ChartCustomerChannel';
import ChartBusinessStatus from './Graphics/ChartBusinessStatus';
import ChartBusinessConclude from './Graphics/ChartBusinessConclude';
import ChartBusinessHistory from './Graphics/ChartBusinessHistory';
import { IDefaultsProps } from '../../Interfaces/IBusiness';
import { dataProps, keyProps } from '../../../Interfaces/IGraphics';

const Dashboard = () => {
  const ref = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();
  const { handleObjectJSON } = useCustomer();
  const [period, setPeriod] = useState<string>('currentMonth')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const { dragOn,handleDragOn } = useHeader();  
  const [layoutKey, setLayoutKey] = useState<keyProps[]>([]);
  const [layoutComp, setLayoutComp] = useState<dataProps[]>([]);
  const { handleUserPermission, permission } = useDefaultSettings();
  const [screenWitdh, setScreenWitdh] = useState(screen.width);
  const token = localStorage.getItem('@GoJur:token');
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const showSalesFunnelMenu = permissionsSecurity.find(item => item.name === "CFGSFUNI");

  // Call default parameters by company 
  useEffect(() => {
    handleValidateSecurity(SecurityModule.customer)
    handleDatesInterval()
    handleGraphics()
  }, [])


  useEffect(() => {
    handleDatesInterval()
  }, [period])


  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission])


  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token });

      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      handleUserPermission(userPermissions[0].value.split('|'));
    }
    catch (err) {
      console.log(err);
    }
  }


  const handleGraphics = async() => {
    const response = await api.post<dataProps[]>('/Dashboard/ListarPosicionamentos', {
        token,
        type: "businessDashBoard"
      },
      { headers: { 'Access-Control-Max-Age': 600 } },
    );
    
    handleDragOn(false)
    setLayoutComp(response.data)
    setLayoutKey(response.data.map(m => m.positions))
  }


  const handleNewPosition = useCallback(async(e: GridLayout.Layout[]) => {
    const key = e.map(e => {
      return {i: e.i, x: e.x, y: e.y, h: e.h, w: e.w, };
    });

    try {                
      await api.put('/Dashboard/SalvarPosicionamentos', { token, positions: key, type: "businessDashBoard" })
      addToast({type: 'success', title: 'Dashboard Alterada', description: 'Dashboard Alterada com sucesso'})
    }
    catch (error:any) {
      addToast({type: 'error', title: 'Falha na alteração da Dashboard', description: error.mesage});
    }
  }, [addToast, token])


  const handleDatesInterval = () => {
    let date = new Date();

    if (period == "pastMonth"){
      date = new Date(date.getFullYear(), date.getMonth()-1, 1)
    }

    const sDate = new Date(date.getFullYear(), date.getMonth(), 1)
    const eDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    setStartDate(format(new Date(sDate), 'yyyy-MM-dd'))
    setEndDate(format(new Date(eDate), 'yyyy-MM-dd'))

    // build date JSON to reload component with dates
    handleObjectJSON(JSON.stringify({
      startDate:format(new Date(sDate), 'yyyy-MM-dd'),
      endDate:format(new Date(eDate), 'yyyy-MM-dd')
    }))
  }


  const handlePeriod = (item) => { 
    if (item)
      setPeriod(item.id)
    else
      setPeriod('currentMonth')
  }
  

  const periodDates = [
    { id:'currentMonth', label: 'Mês Atual' },
    { id:'pastMonth', label: 'Mês Anterior'},
    { id:'period', label: 'Informar Datas'},
  ]


  return (
    <Container>
      <HeaderPage />
      
      <TaskBar>
        <div>
          <label>
            &nbsp;&nbsp; Periodo:
          </label>

          <Select
            className="select"
            isSearchable   
            value={periodDates.filter(options => options.id == (period? period.toString(): ''))}
            onChange={handlePeriod}
            placeholder=""
            options={periodDates}
            styles={selectStyles}
          />

          {period === "period" && (
            <>
              <DatePicker
                title="Início"
                onChange={(event) => setStartDate(event.target.value)}
                value={startDate}
              />

              <DatePicker
                title="Fim"
                onChange={(event) => setEndDate(event.target.value)}
                value={endDate}
              />

              <FcSearch 
                title='Clique para recarregar a pagina com base na nova data de inicio informada'
                onClick={() => 
                  handleObjectJSON(JSON.stringify({
                    startDate,
                    endDate
                  }))
                }
              />
        
            </>
          )}

          <div className="buttonsHeader">
            {showSalesFunnelMenu && (
              <button 
                type="button"
                className="buttonLinkClick" 
                title="Clique para visualizar o funil de vendas"
                onClick={() => history.push(`../../CRM/salesFunnel`)}
              >
                <BsFunnel />
                Funil de Vendas
              </button>
            )}

            <button 
              type="button"
              className="buttonLinkClick" 
              title="Clique para visualizar clientes"
              onClick={() => history.push('../../customer/list')}
            >
              <AiOutlineUser />
              Clientes
            </button>
          </div>
        </div>
      </TaskBar>
      
      <Wrapper>
        <GridLayout
          className="layout"
          layout={layoutKey}
          cols={13}
          containerPadding={[64, 16]}
          rowHeight={30}
          width={screenWitdh}
          onDragStop={handleNewPosition}
          preventCollision={false}
          isDraggable={dragOn}
          isResizable={false}
        >

          {layoutComp?.map(item => (
            <Content key={item.positions.i} ref={ref} isDraggable={dragOn}>
              {item.type === 'CRMDashBoard_negociosPorStatus' && <ChartBusinessStatus /> }
              {item.type === 'CRMDashBoard_negociosFechados' && <ChartBusinessConclude />  }
              {item.type === 'CRMDashBoard_clientesStatus' && <ChartCustomerStatus />  }
              {item.type === 'CRMDashBoard_clientesCanal' && <ChartCustomerChannel /> }
              {item.type === 'CRMDashBoard_negociosHistorico' && <ChartBusinessHistory /> }
            </Content>
          ))}
        </GridLayout>
      </Wrapper>
    </Container>
  )
}

export default Dashboard