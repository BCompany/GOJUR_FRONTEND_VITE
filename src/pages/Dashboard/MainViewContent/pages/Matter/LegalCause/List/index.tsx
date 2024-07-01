/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { useToast } from 'context/toast';
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom';
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useAuth } from 'context/AuthContext';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useDevice } from "react-use-device";
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { useModal } from 'context/modal';
import { FaFileAlt } from 'react-icons/fa'
import { useHeader } from 'context/headerContext'
import { HeaderPage } from 'components/HeaderPage';
import { useDefaultSettings } from 'context/defaultSettings';
import api from 'services/api';
import { GridContainer, GridContainerMobile } from 'Shared/styles/GlobalStyle';
import LegalCauseEdit from '../Modal';
import { IDefaultsProps} from '../../../Interfaces/ICalendar';
import { Container, Content, ContentMobile } from './styles';

export interface ILegalCauseData{
    legalCauseId: string;
    legalCauseDescription: string;
    legalNatureId: string;
    legalNatureDescription: string;
    count: number;
}

const LegalCauseList = () => {
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const { handleUserPermission } = useDefaultSettings();
  const [isDeleting, setIsDeleting] = useState(false);
  const [legalCauseList, setLegalCauseList] = useState<ILegalCauseData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const {captureText, handleLoadingData} = useHeader();
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { isMOBILE } = useDevice();

  const columns = [
    { name: 'legalCauseDescription', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'legalCauseDescription', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'legalCauseDescription', width: '55%' },
    { columnName: 'btnEditar', width: '3%' },
    { columnName: 'btnRemover',width: '3%' },
  ]);


  useEffect(() => {
    LoadDefaultProps()
  }, [])


  useEffect(() => {
    if (!modalActive && caller == 'legalCauseModal'){
        LoadLegalCause('initialize')
    }
  }, [modalActive])

  
  useEffect(() => {
    if (caller == 'legalCauseModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])


  useEffect(() => {
    setLegalCauseList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadLegalCause('initialize')

  },[captureText])


  useEffect(() => {
    LoadLegalCause();
  },[pageNumber])


  const LoadLegalCause = useCallback(async(state = '') => {
    
    if (isEndPage && state != 'initialize'){
      return;
    }

    const token = localStorage.getItem('@GoJur:token');
    const page = state == 'initialize'? 1: pageNumber;

    try {

      const response = await api.get<ILegalCauseData[]>('/AcaoJudicial/Listar', { 
        params:{  
          page,
          rows:10,
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
        setLegalCauseList(response.data)    
      }
      else{
        response.data.map((item)=> legalCauseList.push(item))
        setLegalCauseList(legalCauseList)    
      }
  
      handleLoadingData(false)
      setIsLoadingSearch(false)
      setIsLoading(false)
      handleCaller('')
      handleModalActiveId(0)
    }
    catch (err: any) {
      console.log(err)
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

    if (column.name === 'legalCauseDescription') {
      return (
        <Table.Cell {...props}>
          <span style={{color:'black', fontSize:'0.875rem', fontFamily:'Arial'}}>{props.row.legalCauseDescription}</span>
          <br />
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Natureza Jurídica:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.legalNatureDescription}</span>
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

    if (column.name === 'legalCauseDescription') {
      return (
        <Table.Cell {...props} style={{paddingLeft:'10px'}}>
          <span style={{color:'black', fontSize:'0.67rem', fontFamily:'Arial'}}>{props.row.legalCauseDescription}</span>
          <br />
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Natureza Jurídica:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.legalNatureDescription}</span>
        </Table.Cell>
      );
    }

    if (column.name === 'edit') {
      return (
        <div style={{width:'46px', float:'left'}}>
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            &nbsp;&nbsp;
            <FiEdit title="Clique para editar " />
          </Table.Cell>
        </div>
      );
    }

    if (column.name === 'remove') {
      return (
        <div style={{width:'30px', float:'left'}}>
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
      handleEdit(props.row.legalCauseId)
    }

    if (props.column.name === 'remove'){
      deleteLegalCause(props.row.legalCauseId)
    }
  }


  // EDIT
  const handleEdit = async(id: number) => {
    handleModalActiveId(id)
    handleCaller('legalCauseModal')
    handleModalActive(true)
  };

  
  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('legalCauseModal')
    handleModalActive(true)
  }


  // DELETE
  const deleteLegalCause = async(id: number) => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      setIsDeleting(true)
      await api.delete('/AcaoJudicial/Deletar', {
        params:{
          id,
          token
        }
      })
      
      addToast({
        type: "success",
        title: "Ação judícial excluída",
        description: "A ação judícial foi excluída no sistema."
      })

      LoadLegalCause('initialize')
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir ação judícial.",
        description:  err.response.data.Message
      })
    }
  };


  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || legalCauseList.length == 0) return;

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

  return (
    <>
      
      <Container>

        <HeaderPage />

        {modalActive && (
          <>
            <Overlay />
          </>
        )} 
       
        {showModal &&  <LegalCauseEdit /> }

        {!isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de ações judíciais:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'170px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma ação judícial"
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
              Número de ações judíciais:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'25px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma ação judícial"
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
              rows={legalCauseList}
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
              rows={legalCauseList}
              columns={columns}
            >
              <Table
                cellComponent={CustomCellMobile}
                columnExtensions={tableColumnExtensionsMobile}
                messages={languageGridEmpty}
              />
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

export default LegalCauseList;