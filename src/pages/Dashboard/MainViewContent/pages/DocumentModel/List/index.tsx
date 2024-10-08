/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, useRef } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi'
import { FaFileAlt } from 'react-icons/fa'
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import { GridContainer } from 'Shared/styles/GlobalStyle';
import { useDevice } from "react-use-device";
import { useAuth } from 'context/AuthContext';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container, Content , ContainerMobile } from './styles';

export interface IDefaultsProps {
  id: string;
  value: string;
}

export interface IDocumentModelData{
    cod_DocumentoModelo: string;
    des_TituloWithType: string;
    totalRows: number;
}

const DocumentModelList = () => {
  // STATES
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const {captureText, handleLoadingData} = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const [documentModelList, setDocumentModelList] = useState<IDocumentModelData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const { isMOBILE } = useDevice();
  const [hasAccess, setHasAccess] = useState(true);
  
  const columns = [
    { name: 'des_TituloWithType', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'des_TituloWithType', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  useEffect(() => {
    setDocumentModelList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadDocumentModel('initialize')

  },[captureText])

  useEffect(() => {
    LoadDocumentModel();
  },[pageNumber])


  // METHODS
  const LoadDocumentModel = useCallback(async(state = '') => {
    try
    {
      if (isEndPage && state != 'initialize')
        return;
  
      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.post<IDocumentModelData[]>('/DocumentosModelo/Listar', { 
        page,
        rows:20,
        filterDesc: captureText,
        token
      })
  
      if(response.data.length > 0 && state == 'initialize')
        setTotalPageCount(response.data[0].totalRows)

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
        setDocumentModelList(response.data)    
      }
      else{
        response.data.map((item)=> documentModelList.push(item))
        setDocumentModelList(documentModelList)    
      }

      handleLoadingData(false)
      setIsLoadingSearch(false)
      setIsLoading(false)
      handleCaller('')
      handleModalActiveId(0)

    } catch (err: any) {
      setHasAccess(false)
      setIsLoading(false)
      handleLoadingData(false)
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

  
  const CustomCell = (props) => { 

    const { column } = props;

    if (column.name === 'des_TituloWithType') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={props.row.des_TituloWithType} style={{textOverflow:'ellipsis', overflow:'hidden'}}>
            {props.row.des_TituloWithType}
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

  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.cod_DocumentoModelo)
    }

    if (props.column.name === 'remove'){
      deleteDocumentModel(props.row.cod_DocumentoModelo)
    }
  }

  // EDIT
  const handleEdit = async(id: number) => {
    history.push(`/documentmodel/edit/${id}`)
  };

  // OPEN MODAL
  const handleOpenModal = () => {    
    history.push(`/documentmodel/edit/0`)
  }

  // DELETE
  const deleteDocumentModel = async(id: number) => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      await api.post('/DocumentosModelo/Apagar', {
        documentModelId: id,
        token
      })
      
      addToast({
        type: "success",
        title: "Modelo de Documento excluído",
        description: "O modelo de documento foi excluído no sistema."
      })

      LoadDocumentModel('initialize')

    } catch (err:any) {

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir o modelo de documento.",
        description: err.response.data.Message
      })
    }
  };

  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || documentModelList.length == 0) return;

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
      {!isMOBILE &&(
        <Container>

          <HeaderPage />
        
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de documentos:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'185px'}}>
              <div style={{float:'left', marginRight:'10px'}}>
                {hasAccess && (
                  <button 
                    className="buttonLinkClick" 
                    title="Clique para incluir um modelo de documento"
                    type="submit"
                    onClick={handleOpenModal}
                  >
                    <FaFileAlt />
                    Incluir novo Modelo
                  </button>
                )}
              </div>
            </div>  
          </div>

          <div style={{width:'100%', height:'25px'}}><></></div> 

          <Content onScroll={handleScroll} ref={scrollRef}>

            <GridContainer>
              <Grid
                rows={documentModelList}
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

        </Container>
      )}

      {isMOBILE &&(
        <ContainerMobile>
          <div id='information' style={{marginTop:'30%', border:'solid 1px', backgroundColor:'white', height:'78px', borderRadius:'10px', color:'#2c8ed6'}}>
            <div style={{marginLeft:'8%'}}>
              <br />
              Este módulo não esta disponível na versão mobile.
              <br />
              <br />
              Para utilizar é necessário estar em um computador ou notebook.
            </div>
          </div>
        </ContainerMobile>
      )}

    </>
  )

}
export default DocumentModelList;