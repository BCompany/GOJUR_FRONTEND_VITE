/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */

import React, { useCallback, useState, useEffect } from 'react';
import api from 'services/api';
import { FaRegTimesCircle, FaFileAlt, FaRegEdit, FaAddressCard, FaSyncAlt, FaEye } from 'react-icons/fa';
import { FiTrash, FiX } from 'react-icons/fi';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { ChangeVisibilityModal, GridSubContainer } from './styles';
import { dataProps, keyProps } from 'pages/Dashboard/MainViewContent/pages/Interfaces/ICalendar';
import { useHeader } from 'context/headerContext';

export interface ChangeElementsVisibleProps {
    idElement: string;
    visible: string
}

const ModalChangeVisibility = (props) => {
  const { closeModalChangeVisibility } = props.callbackFunction;
  const [layoutComp, setLayoutComp] = useState<dataProps[]>([]);
  const { dragOn } = useHeader();

  const token = localStorage.getItem('@GoJur:token');

  const [tableColumnExtensionsUserLists] = useState([
    { columnName: 'name', width: '80%' },
    { columnName: 'btnVisible', width: '20%' },
  ]);


  const columnsUsrList = [
    { name: 'name', title: 'Nome' },
    { name: 'btnVisible', title: ' ' },
  ];

  
  useEffect(() => {

    async function handleGraphics() {
      const response = await api.post<dataProps[]>(
        '/Dashboard/ListarPosicionamentos',
        {
          token,
          type: 'homeDashBoard'
        },
        { headers: { 'Access-Control-Max-Age': 600 } },
      );

      setLayoutComp(response.data);

      localStorage.removeItem('@GoJur:PublicationFilter')
      localStorage.removeItem('@GoJur:CustomerFilter')
      localStorage.removeItem('@GoJur:matterCoverId');
    }
    handleGraphics();

  }, [dragOn]);

  const CustomCellUserList = (props) => {
    const { column, row } = props;

    if (column.name === 'btnVisible') {
      let icon;
      
        if(row.visible == 'N'){ 
          icon = (
            <div style={{ display: 'inline-block' }}>
                <button onClick={() => { handleClose("S", row.idElement)}} style={{display:'inline-block'}}>
                    <FaEye title="Habilitar Gráfico" />
                </button>
            </div>
          );
        }else{
          icon = (
            <div style={{ display: 'inline-block', alignItems: "center" }}>
                <button onClick={() => { handleClose("N", row.idElement)}} style={{display:'inline-block'}}>
                    <FiX title="Desabilitar Gráfico" />
                </button>
            </div>
          );
        }

        return (
            <Table.Cell {...props}>
              &nbsp;&nbsp;
              {icon}
            </Table.Cell>
        );
    }

    return <Table.Cell {...props} />;
  };


  const handleClose = useCallback(async (visible: string, idElement: string) => {
 
    const response = await api.post<ChangeElementsVisibleProps[]>(
      '/Dashboard/AlterarElemento',
      {
        token,
        type: 'homeDashBoard',
        idElement: idElement,
        visible: visible
      },
      { headers: { 'Access-Control-Max-Age': 600 } },
    );

    async function handleGraphics() {
      const response = await api.post<dataProps[]>(
        '/Dashboard/ListarPosicionamentos',
        {
          token,
          type: 'homeDashBoard'
        },
        { headers: { 'Access-Control-Max-Age': 600 } },
      );

      setLayoutComp(response.data);

      localStorage.removeItem('@GoJur:PublicationFilter')
      localStorage.removeItem('@GoJur:CustomerFilter')
      localStorage.removeItem('@GoJur:matterCoverId');
    }
    
    handleGraphics();

  },[dragOn]);

  return (
    <>
        <ChangeVisibilityModal show >
            <div className='header'>
                <p className='headerLabel'>Alterar Visiblidade dos Gráficos</p>
            </div>
            
            <GridSubContainer style={{ flex: '1 1 auto', overflowY: 'auto' }}>
                <Grid
                    rows={layoutComp}
                    columns={columnsUsrList}
                >
                    <SortingState
                    defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
                    />
                    <IntegratedSorting />

                    <Table
                    cellComponent={CustomCellUserList}
                    columnExtensions={tableColumnExtensionsUserLists}
                    messages={languageGridEmpty}
                    />
                    <TableHeaderRow showSortingControls />
                </Grid>
            </GridSubContainer>

            <div style={{ flex: 'auto', padding: '10px' }}>
                <div style={{ float: 'right', marginRight: '1%' }}>
                    <button
                    type='button'
                    className="buttonClick"
                    onClick={() => closeModalChangeVisibility()}
                    style={{ width: '100px' }}
                    >
                    <FaRegTimesCircle />
                    Fechar
                    </button>
                </div>
            </div>
        </ChangeVisibilityModal>
    </>
  )
}

export { ModalChangeVisibility };
