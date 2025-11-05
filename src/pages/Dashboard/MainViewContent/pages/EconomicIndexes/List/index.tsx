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
import { useAuth } from 'context/AuthContext';
import { FcAbout} from 'react-icons/fc';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useDevice } from "react-use-device";
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { HeaderPage } from 'components/HeaderPage';
import EconomicIndexesEdit from '../Modal';
import { Container, Content , ContentMobile } from './styles';

export interface IEconomicIndexesData{
  economicIndexesId: string;
  economicIndexesDescription: string;
  flg_Public: string;
  allowDelete: boolean;
  flg_TypeValue: string;
  convertCoin: boolean;
  decimais: string;
  startDate: string;
  accessCodes: string;
  publicDescription: string;
  count: number;
}

export interface IDefaultsProps {
  id: string;
  value: string;
}
      
const EconomicIndexesList = () => {
  // STATES
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const {captureText, handleLoadingData} = useHeader();
  const [isDeleting, setIsDeleting] = useState(false);
  const { handleUserPermission } = useDefaultSettings();
  const [economicIndexesList, setEconomicIndexesList] = useState<IEconomicIndexesData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [showModal, setShowModal] = useState(false);
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const { signOut } = useAuth();
  const { isMOBILE } = useDevice();
  
  const columns = [
    { name: 'economicIndexesDescription', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'economicIndexesDescription', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'economicIndexesDescription', width: '50%' },
    { columnName: 'btnEditar', width: '3%' },
    { columnName: 'btnRemover',width: '3%' },
  ]);

  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])

  useEffect(() => {
    if (!modalActive && caller == 'economicIndexesModal'){
        LoadEconomicIndexes('initialize')
    }
  }, [modalActive])
  
  useEffect(() => {
    if (caller == 'economicIndexesModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  useEffect(() => {
    setEconomicIndexesList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadEconomicIndexes('initialize')

  },[captureText])

  useEffect(() => {
    LoadEconomicIndexes();
  },[pageNumber])


  // METHODS
  const LoadEconomicIndexes = useCallback(async(state = '') => {
    try {
      if (isEndPage && state != 'initialize'){
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.get<IEconomicIndexesData[]>('/IndicesEconomicos/Listar', { 
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
        setEconomicIndexesList(response.data)    
      }
      else{
        response.data.map((item)=> economicIndexesList.push(item))
        setEconomicIndexesList(economicIndexesList)    
      }

      handleLoadingData(false)
      setIsLoadingSearch(false)
      setIsLoading(false)
      handleCaller('')
      handleModalActiveId(0)
    }
    catch (err:any)
    {
      if (err.response.data.statusCode == 1002){
        addToast({type: 'info', title: 'Permissão negada', description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema'});
        signOut()
      }
    }
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

    if (column.name === 'economicIndexesDescription') {
      return (
        
        <Table.Cell {...props}>
          <div style={{display:"flex"}}>
            <span style={{color:'black', fontSize:'0.8rem', fontFamily:'Arial', marginTop:"auto"}}>{props.row.economicIndexesDescription}</span>
            <span style={{fontSize:'11px', marginTop:"auto", marginLeft:"1%"}}>
              {props.row.publicDescription && (
                <div style={{marginLeft:"3%%", width:"110%", marginTop:"-2%"}}>
                  - (Indice gerenciado pela BCompany)
                  <FcAbout 
                    className='icons' 
                    title='Este indicador economico é cadastrado e atualizado automaticamente pela BCompany e disponibilizado para todos os clientes.'
                    style={{minWidth: '7px', minHeight: '7px', marginLeft:"2%"}}
                  /> 
                </div>
              )}
            </span>
          </div>
        </Table.Cell>
        );
      }

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar " />
        </Table.Cell>
      );
    }

    if (column.name === 'remove' && props.row.allowDelete == true){
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

    if (column.name === 'economicIndexesDescription') {
      return (
        <Table.Cell {...props}>
          <div style={{display:"flex"}}>
            <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', marginTop:"auto"}}>{props.row.economicIndexesDescription}</span>
            <span style={{fontSize:'11px', marginTop:"auto", marginLeft:"1%"}}>
              {props.row.publicDescription && (
                <div style={{marginLeft:"3%%", width:"110%", marginTop:"-2%", fontSize:"6.5px"}}>
                  - (Indice gerenciado pela BCompany)
                </div>
              )}
            </span>
          </div>
        </Table.Cell>
      );
    }

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

    if (column.name === 'remove' && props.row.allowDelete == true){
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
      handleEdit(props.row.economicIndexesId)
    }

    if (props.column.name === 'remove'){
      deleteEconomicIndexes(props.row.economicIndexesId)
    }
  }

  // EDIT
  const handleEdit = async(id: number) => {
    history.push(`/EconomicIndexes/Edit/${id}`)
  };

  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('economicIndexesModal')
    handleModalActive(true)
  }

  // DELETE
  const deleteEconomicIndexes = async(id: number) => {
    try {
      setIsDeleting(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.delete('/IndicesEconomicos/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Índice Econômico excluído",
        description: "O índice econômico foi excluído no sistema."
      })

      LoadEconomicIndexes('initialize')
      setIsDeleting(false)

    } catch (err:any) {
      setIsDeleting(false)
      addToast({
        type: "error",
        title: "Falha ao excluir índice econômico.",
        description:  err.response.data.Message
      })
    }
  };

  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || economicIndexesList.length == 0) return;

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

        {showModal &&  <EconomicIndexesEdit /> }
    
        {!isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de indicadores:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'170px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir um índice econômico"
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
          <div style={{width:'110%', marginTop:'2%px'}}>

            <div style={{float:'left', marginLeft:'15px', marginTop:'-7px', fontSize:'10px'}}>
              Número de indicadores:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'25px', marginTop:"2%"}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir um índice econômico"
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
                rows={economicIndexesList}
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
                rows={economicIndexesList}
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

      </Container>

      {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Deletando ...
          </div>
        </>
      )}
    </>
  )
}

export default EconomicIndexesList;
