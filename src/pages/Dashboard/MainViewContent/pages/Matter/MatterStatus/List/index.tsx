/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useAuth } from 'context/AuthContext';
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import api from 'services/api';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { useDefaultSettings } from 'context/defaultSettings';
import { GridContainer,GridContainerMobile } from 'Shared/styles/GlobalStyle';
import { useModal } from 'context/modal';
import { useHistory } from 'react-router-dom';
import { useHeader } from 'context/headerContext';
import { FaFileAlt } from 'react-icons/fa'
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { IDefaultsProps} from '../../../Interfaces/ICalendar';
import MatterStatusEdit from '../Modal';
import { Container, Content,ContentMobile } from './styles';

  export interface IMatterStatusData{
    id: string;
    value: string;
    count: number;
  }

  const MatterStatusList = () => {
    // STATES
  const { addToast } = useToast();
  const history = useHistory();
  const {captureText, handleLoadingData} = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('@GoJur:token');
  const [matterStatusList, setMatterStatusList] = useState<IMatterStatusData[]>([]);
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isEndPage, setIsEndPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1)
  const [isPagination, setIsPagination] = useState(false);
  const { signOut } = useAuth();
  const { isMOBILE } = useDevice();

  const columns = [
    { name: 'value', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];
    
  const [tableColumnExtensions] = useState([
    { columnName: 'value', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'value', width: '50%' },
    { columnName: 'btnEditar', width: '3%' },
    { columnName: 'btnRemover',width: '3%' },
  ]);

  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])

  useEffect(() => {
    setMatterStatusList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadMatterStatus('initialize')

  },[captureText])

  useEffect(() => {
    LoadMatterStatus();
  },[pageNumber])

  useEffect(() => {
    if (!modalActive && caller == 'matterStatusModal'){
        LoadMatterStatus('initialize')
    }
  }, [modalActive])
  
  useEffect(() => {
    if (caller == 'matterStatusModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  // METHODS
  const LoadMatterStatus = useCallback(async(state = '') => {
    try {
      if (isEndPage && state != 'initialize'){
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.get<IMatterStatusData[]>('/StatusProcesso/Listar', { 
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
        setMatterStatusList(response.data)    
      }
      else{
        response.data.map((item)=> matterStatusList.push(item))
        setMatterStatusList(matterStatusList)    
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
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
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
      handleEdit(props.row.id)
    }

    if (props.column.name === 'remove'){
      deleteMatterStatus(props.row.id)
    }
  }

  // EDIT
  const handleEdit = async(id: number) => {
    handleModalActiveId(id)
    handleCaller('matterStatusModal')
    handleModalActive(true)
  };

  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('matterStatusModal')
    handleModalActive(true)
  }

  // DELETE
  const deleteMatterStatus = async(id: number) => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      setIsDeleting(true)
      await api.delete('/StatusProcesso/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Fase processual excluída",
        description: "O status do processo foi excluído no sistema."
      })

      LoadMatterStatus('initialize')
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir status do processo.",
        description:  err.response.data.Message
      })
    }
  };

  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || matterStatusList.length == 0) return;

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
          
          {showModal &&  <MatterStatusEdit /> }

          {!isMOBILE &&(
            <div style={{width:'100%', marginTop:'20px'}}>

              <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
                Número de status do processo:&nbsp;
                {totalPageCount}
              </div>

              <div style={{float:'right', marginRight:'170px'}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick" 
                    title="Clique para incluir um status do processo"
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
                    title="Clique para retornar a lista de processos"
                    type="submit"
                    onClick={() => history.push(`/matter/list`)}
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
                Número de status do processo:&nbsp;
                {totalPageCount}
              </div>

              <div style={{float:'right', marginRight:'25px'}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick" 
                    title="Clique para incluir um status do processo"
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
                    title="Clique para retornar a lista de processos"
                    type="submit"
                    onClick={() => history.push(`/matter/list`)}
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
                  rows={matterStatusList}
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
                  rows={matterStatusList}
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
export default MatterStatusList;