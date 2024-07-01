/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle, FaUserSlash } from 'react-icons/fa';
import { GridSubContainer } from 'Shared/styles/GlobalStyle';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { languageGridEmpty, languageGridLoading } from 'Shared/utils/commonConfig';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import { ICoveragesData } from '../../../../../Interfaces/IPublicationNames';
import { ModalCoverage } from './styles';

const CoverageListModal = (props) => {
  const { CloseCoverageModal } = props.callbackFunction
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const token = localStorage.getItem('@GoJur:token');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [journalFilterType, setJournalFilterType] = useState<string>("journal")
  const [coverageList, setCoverageList] = useState<ICoveragesData[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);

  useEffect(() => {
    ListAllCoverages()

  },[journalFilterType])

  // CustomerPlans columns
  const columns = [
    { name: 'cod_SiglaUF',                    title: 'Estado' },
    { name: 'nom_Diario',                     title: 'Diário' },
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'cod_SiglaUF',              width: '30%' },
    { columnName: 'nom_Diario',               width: '60%' },
  ]);
  
  const ListAllCoverages = async () => {
    try {
      setIsLoading(true)
      const response = await api.get<ICoveragesData[]>('/PublicacaoNomes/ListarAbrangencias', {
        params:{
        journalFilterType,
        token,
        }
      });

      setCoverageList(response.data)
      setIsLoading(false)
      
    } catch (err:any) {
      setIsLoading(false)
      console.log(err);
    }
  }

  return (
    <>
      
      <ModalCoverage show>

        <div className='header'>
          <p className='headerLabel'>Lista de Abrangências</p>
        </div>

        <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>

          <div style={{display: "flex", marginBottom:"10px"}}>
            <span className='journalTypeFilterLabel'>Filtrar Por:</span> 
            <label htmlFor="type">            
              <select 
                className='journalTypeFilterSelect'
                name="type"
                value={journalFilterType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setJournalFilterType(e.target.value)}
              >
                <option value="journal">Diario de Justiça Eletrônico</option>
                <option value="journalEletronic">Sistema Intimação Eletrônica</option>

              </select>
            </label>            
          </div>

          <div style={{height:"73%", overflow:"auto", position:"absolute"}}>
            <GridSubContainer>
              <Grid
                rows={coverageList}
                columns={columns}
              >
                <PagingState
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onCurrentPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
                <CustomPaging totalCount={totalRows} />
                <Table
                  columnExtensions={tableColumnExtensions}
                  messages={isLoading? languageGridLoading: languageGridEmpty}
                />
                <TableHeaderRow />
              </Grid>
            </GridSubContainer>
          </div>       

        </div>

        <div style={{position:"absolute", width:"100%", top:"89%", borderTop:"1px solid black"}}>&nbsp;</div>
        <div style={{position:"absolute", top:"90.5%", right:"2%"}}>
          <button 
            type='button'
            className="buttonClick"
            style={{width:'145px'}}
            onClick={CloseCoverageModal}
          >
            <FaRegTimesCircle />
            Fechar
          </button>
        </div>

      </ModalCoverage>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}  
     
    </>
    
  )
  
}
export default CoverageListModal;
