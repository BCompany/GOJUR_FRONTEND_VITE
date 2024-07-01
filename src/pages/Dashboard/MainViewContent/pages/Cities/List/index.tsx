/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { FaFileAlt } from 'react-icons/fa'
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import { GridContainer , GridContainerMobile } from 'Shared/styles/GlobalStyle';
import { useDevice } from "react-use-device";
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { HeaderPage } from 'components/HeaderPage';
import { IDefaultsProps} from '../../Interfaces/ICalendar';
import CitiesEdit from '../Modal';
import { Container, Content , ContentMobile } from './styles';

export interface ICitiesData{
    citiesId: string;
    citiesDescription: string;
    federalUnitId: string;
    sigla: string;
    count: number;
}

const CitiesList = () => {
  // STATES
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const {captureText, handleLoadingData} = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const [citiesList, setCitiesList] = useState<ICitiesData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [showModal, setShowModal] = useState(false);
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const [isDeleting , setIsDeleting] = useState<boolean>(false); // set trigger for show loader
  const { isMOBILE } = useDevice();
  
  const columns = [
    { name: 'citiesDescription', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'citiesDescription', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'citiesDescription', width: '50%' },
    { columnName: 'btnEditar', width: '3%' },
    { columnName: 'btnRemover',width: '3%' },
  ]);

  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])

  useEffect(() => {
    if (!modalActive && caller == 'citiesModal'){
        LoadCities('initialize')
    }
  }, [modalActive])

  
  useEffect(() => {
    if (caller == 'citiesModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  useEffect(() => {
    setCitiesList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadCities('initialize')

  },[captureText])

  useEffect(() => {
    LoadCities();
  },[pageNumber])

  
  // METHODS
  const LoadCities = useCallback(async(state = '') => {
    
    if (isEndPage && state != 'initialize'){
      return;
    }

    const token = localStorage.getItem('@GoJur:token');
    const page = state == 'initialize'? 1: pageNumber;

    const response = await api.get<ICitiesData[]>('/Cidades/Listar', { 
      params:{
        page,
        rows:20,
        filterClause: captureText,
        token
        }
    })

    if(response.data.length > 0 && state == 'initialize')
    {
      setTotalPageCount(response.data[0].count)
    }

    if(response.data.length == 0 && state == 'initialize'){
      setTotalPageCount(0)
    }

    if (response.data.length == 0 || state === 'initialize'){
      setIsLoadingSearch(false)
      setIsEndPage(true)
      setIsLoading(false)
      setPageNumber(1)      
      handleLoadingData(false)
      if (state != 'initialize') return ;
    }

    if (!isPagination || state === 'initialize'){
      setIsEndPage(false)
      setCitiesList(response.data)    
    }
    else{
      response.data.map((item)=> citiesList.push(item))
      setCitiesList(citiesList)    
    }

    handleLoadingData(false)
    setIsLoadingSearch(false)
    setIsLoading(false)
    handleCaller('')
    handleModalActiveId(0)

  }, [pageNumber, captureText, isPagination, isEndPage])

  const LoadDefaultProps = async() => {

    try {

      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token });

      const permissionAccessCode = response.data.find(item => item.id === 'accessCode')
      if (permissionAccessCode)
        localStorage.setItem('@GoJur:accessCode', permissionAccessCode.value)
      
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      handleUserPermission(userPermissions[0].value.split('|'));

    } catch (err) {
      console.log(err);
    }
  }

  const CustomCell = (props) => { 

    const { column } = props;

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar " />
        </Table.Cell>
      );
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiTrash title="Clique para remover" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const CustomCellMobile = (props) => { 

    const { column } = props;

    if (column.name === 'edit') {
      return (
        <div style={{width:'56px', float:'left'}}>
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            &nbsp;&nbsp;
            <FiEdit title="Clique para editar " />
          </Table.Cell>
        </div>
      );
    }

    if (column.name === 'remove') {
      return (
        <div style={{width:'40px', float:'left'}}>
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            &nbsp;&nbsp;
            <FiTrash title="Clique para remover" />
          </Table.Cell>
        </div>
      );
    }

    return <Table.Cell {...props} />;
  };

  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.citiesId)
    }

    if (props.column.name === 'remove'){
      deleteCities(props.row.citiesId)
    }
  }

  // EDIT
  const handleEdit = async(id: number) => {
    handleModalActiveId(id)
    handleCaller('citiesModal')
    handleModalActive(true)
  };

  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('citiesModal')
    handleModalActive(true)
  }

  // DELETE
  const deleteCities = async(id: number) => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)
      
      await api.delete('/Cidades/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Cidade excluída",
        description: "A cidade foi excluída no sistema."
      })

      LoadCities('initialize')
      setIsDeleting(false)


    } catch (err: any) {

      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir cidade.",
        description:  err.response.data.Message
      })
    }
  };

  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || citiesList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-20) <= element.clientHeight
    
    // calculate if achieve end of scrool page
    if (isEndScrool) {

      if (!isLoadingSearch){
        setPageNumber(pageNumber + 1)
      }

      setIsLoadingSearch(true)
      setIsPagination(true)        
    }
  }

  if(isLoading)
  {
    return (
      <Container>
        <HeaderPage />
        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp; Aguarde...
        </div>
      </Container>
    )
  }

  // HTML CODE
  return (
    <>

      <Container>

        <HeaderPage />

        {modalActive && (
          <>
            <Overlay />
          </>
        )} 
       
        {showModal &&  <CitiesEdit /> }

        {!isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de cidades:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'170px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma cidade"
                  type="submit"
                  onClick={handleOpenModal}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>

              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar a dashboard"
                  type="submit"
                  onClick={() => history.push(`/dashboard`)}
                >
                  <FiArrowLeft />
                  Retornar
                </button>
              </div>
            </div>  
          </div>
        )}

        {isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'15px', marginTop:'-20px', fontSize:'10px'}}>
              Número de cidades:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'25px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma cidade"
                  type="submit"
                  onClick={handleOpenModal}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>

              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar a dashboard"
                  type="submit"
                  onClick={() => history.push(`/dashboard`)}
                >
                  <FiArrowLeft />
                  Retornar
                </button>
              </div>
            </div>  
          </div>
        )}

        <div style={{width:'100%', height:'25px'}}><></></div> 

        {!isMOBILE &&(
          <Content onScroll={handleScroll} ref={scrollRef}>

            <GridContainer>
              <Grid
                rows={citiesList}
                columns={columns}
              >
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableColumnExtensions}            
                  messages={languageGridEmpty}
                />
                {/* <TableHeaderRow /> */}
              </Grid>
            </GridContainer>
          
          </Content>
        )}

        {isMOBILE &&(
          <ContentMobile onScroll={handleScroll} ref={scrollRef}>

            <GridContainerMobile>
              <Grid
                rows={citiesList}
                columns={columns}
              >
                <Table
                  cellComponent={CustomCellMobile}
                  columnExtensions={tableColumnExtensionsMobile}
                  messages={languageGridEmpty}
                />
                {/* <TableHeaderRow /> */}
              </Grid>
            </GridContainerMobile>
          
          </ContentMobile>
        )}

        {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Deletando ...
          </div>
        </>
      )}

      </Container>

    </>
  )

}
export default CitiesList;