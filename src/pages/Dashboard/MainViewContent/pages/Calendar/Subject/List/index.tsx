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
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { GridContainer } from 'Shared/styles/GlobalStyle';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { HeaderPage } from 'components/HeaderPage';
import { IDefaultsProps} from '../../../Interfaces/ICalendar';
import SubjectEdit from '../Modal';
import { Container, Content, ContentMobile } from './styles';

export interface ISubjectData {
  subjectId: string;
  subjectDescription: string;
  labelColor:string;
  totalCount:number;
}

const SubjectList = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const { handleUserPermission } = useDefaultSettings();
  const [isDeleting, setIsDeleting] = useState(false);
  const [subjectList, setSubjectList] = useState<ISubjectData[]>([]);
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
    { name: 'color', title: ' '},
    { name: 'subjectDescription', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'color',     width: '10%' },
    { columnName: 'subjectDescription', width: '65%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'color',     width: '10%' },
    { columnName: 'subjectDescription', width: '30%' },
    { columnName: 'btnEditar', width: '3%' },
    { columnName: 'btnRemover',width: '3%' },
  ]);


  useEffect(() => {
    LoadDefaultProps()
  }, [])


  useEffect(() => {
    if (!modalActive && caller == 'subjectModal'){
        LoadSubject('initialize')
    }
  }, [modalActive])

  
  useEffect(() => {
    if (caller == 'subjectModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])


  useEffect(() => {
    setSubjectList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadSubject('initialize')

  },[captureText])


  useEffect(() => {
    LoadSubject();
  },[pageNumber])


  const LoadSubject = useCallback(async(state = '') => {
    
    if (isEndPage && state != 'initialize'){
      return;
    }

    const token = localStorage.getItem('@GoJur:token');
    const page = state == 'initialize'? 1: pageNumber;

    const response = await api.get<ISubjectData[]>('/Assunto/ListarPorFiltro', { 
        params:{
        page,
        rows:20,
        filterClause: captureText,
        token
        }
    })

    if(response.data.length > 0 && state == 'initialize')
    {
      setTotalPageCount(response.data[0].totalCount)
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
      setSubjectList(response.data)    
    }
    else{
      response.data.map((item)=> subjectList.push(item))
      setSubjectList(subjectList)    
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
    
    if (column.name === 'color') {
        return (
          <Table.Cell onClick={(e) => console.log(e)} {...props}>
            <div style={{backgroundColor:`${props.row.labelColor}`, height:'25px', width:'25px'}}>
              <></>
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
    
    if (column.name === 'color') {
        return (
          <Table.Cell onClick={(e) => console.log(e)} {...props}>
            <div style={{backgroundColor:`${props.row.labelColor}`, height:'25px', width:'25px'}}>
              <></>
            </div>
          </Table.Cell>
        );
      }

      if (column.name === 'edit') {
        return (
          <div style={{width:'40px', float:'left'}}>
            {/* <Table.Cell onClick={(e) => handleClick(props)} {...props}> */}
            <Table.Cell {...props}>
              &nbsp;&nbsp;
              <FiEdit title="Clique para editar " onClick={(e) => handleClick(props)} {...props} />
            </Table.Cell>
          </div>
        );
      }
  
      if (column.name === 'remove') {
        return (
          <div style={{width:'40px', float:'left'}}>
            {/* <Table.Cell onClick={(e) => handleClick(props)} {...props}> */}
            <Table.Cell {...props}>
              &nbsp;&nbsp;
              <FiTrash title="Clique para remover" onClick={(e) => handleClick(props)} {...props} />
            </Table.Cell>
          </div>
        );
      }

    return <Table.Cell {...props} />;
  };

  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.subjectId)
    }

    if (props.column.name === 'remove'){
      deleteSubject(props.row.subjectId)
    }
  }


  // EDIT
  const handleEdit = async(id: number) => {
    handleModalActiveId(id)
    handleCaller('subjectModal')
    handleModalActive(true)
  };

  
  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('subjectModal')
    handleModalActive(true)
  }


  // DELETE
  const deleteSubject = async(id: number) => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      setIsDeleting(true)
      await api.delete('/Assunto/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Assunto excluído",
        description: "O assunto foi excluído no sistema."
      })

      LoadSubject('initialize')
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir assunto.",
        description:  err.response.data.Message
      })
    }
  };


  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || subjectList.length == 0) return;

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
       
        {showModal &&  <SubjectEdit /> }

        {!isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de assuntos:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'170px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar a lista de clientes"
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
                  title="Clique para retornar a lista de clientes"
                  type="submit"
                  onClick={() => history.push(`/calendar`)}
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
              Número de assuntos:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'25px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar a lista de clientes"
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
                  title="Clique para retornar a lista de clientes"
                  type="submit"
                  onClick={() => history.push(`/calendar`)}
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
                rows={subjectList}
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

            <GridContainer>
              <Grid
                rows={subjectList}
                columns={columns}
              >
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableColumnExtensionsMobile}            
                  messages={languageGridEmpty}
                />
                {/* <TableHeaderRow /> */}
              </Grid>
            </GridContainer>
          
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

export default SubjectList;