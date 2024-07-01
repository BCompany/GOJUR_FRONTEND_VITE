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
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useAuth } from 'context/AuthContext';
import { FaFileAlt } from 'react-icons/fa'
import { GridContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { HeaderPage } from 'components/HeaderPage';
import { useDefaultSettings } from 'context/defaultSettings';
import { useHeader } from 'context/headerContext'
import { useModal } from 'context/modal';
import api from 'services/api';
import CustomerGroupEdit from '../Modal';
import { IDefaultsProps} from '../../../Interfaces/ICalendar';
import { Container, Content } from './styles';


export interface ICustomerGroupData{
    customerGroupId: string;
    customerGroupDescription: string;
    count: number;
}

const CustomerGroupList = () => {
    // STATES
    const { addToast } = useToast();
    const history = useHistory();
    const { handleUserPermission } = useDefaultSettings();
    const [totalPageCount, setTotalPageCount] = useState<number>(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const {captureText, handleLoadingData} = useHeader();
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [customerGroupList, setCustomerGroupList] = useState<ICustomerGroupData[]>([]);
    const token = localStorage.getItem('@GoJur:token');
    const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
    const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
    const [isLoading, setIsLoading]= useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState(1)
    const [isEndPage, setIsEndPage] = useState(false);
    const [isPagination, setIsPagination] = useState(false);
    const { signOut } = useAuth();
    
  const columns = [
    { name: 'customerGroupDescription', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];
    
  const [tableColumnExtensions] = useState([
    { columnName: 'customerGroupDescription', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  // USE EFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])

  useEffect(() => {
    if (!modalActive && caller == 'customerGroupModal'){
        LoadCustomerGroup('initialize')
    }
  }, [modalActive])

  
  useEffect(() => {
    if (caller == 'customerGroupModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  useEffect(() => {
    setCustomerGroupList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadCustomerGroup('initialize')

  },[captureText])


  useEffect(() => {
    LoadCustomerGroup();
  },[pageNumber])


  // METHODS
  const LoadCustomerGroup = useCallback(async(state = '') => {
    try {
      if (isEndPage && state != 'initialize')
        return;

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.get<ICustomerGroupData[]>('/GrupoCliente/Listar', { 
          params:{
          page,
          rows:20,
          filterClause: captureText,
          token
          }
      })

      if(response.data.length > 0 && state == 'initialize')
        setTotalPageCount(response.data[0].count)

      if(response.data.length == 0 && state == 'initialize')
        setTotalPageCount(0)

      if (response.data.length == 0 || state === 'initialize')
      {
        setIsLoadingSearch(false)
        setIsEndPage(true)
        setIsLoading(false)
        setPageNumber(1)      
        handleLoadingData(false)
        if (state != 'initialize') return ;
      }

      if (!isPagination || state === 'initialize'){
        setIsEndPage(false)
        setCustomerGroupList(response.data)    
      }
      else{
        response.data.map((item)=> customerGroupList.push(item))
        setCustomerGroupList(customerGroupList)    
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
      
    console.log(props)

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

  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.customerGroupId)
    }

    if (props.column.name === 'remove'){
      deleteCustomerGroup(props.row.customerGroupId)
    }
  }
  // EDIT
  const handleEdit = async(id: number) => {
    handleModalActiveId(id)
    handleCaller('customerGroupModal')
    handleModalActive(true)
  };

  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('customerGroupModal')
    handleModalActive(true)
  }

  // DELETE
  const deleteCustomerGroup = async(id: number) => {
   
    try {

      setIsDeleting(true)

      const token = localStorage.getItem('@GoJur:token');
      
      await api.delete('/GrupoCliente/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Grupo de clientes excluído",
        description: "O grupo de clientes foi excluído no sistema."
      })

      LoadCustomerGroup('initialize')
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir grupo de clientes.",
        description:  err.response.data.Message
      })
    }
  };
  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || customerGroupList.length == 0) return;

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

        {showModal &&  <CustomerGroupEdit /> }

        <div style={{width:'100%', marginTop:'20px'}}>

          <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
            Número de grupos de cliente:&nbsp;
            {totalPageCount}
          </div>

          <div style={{float:'right', marginRight:'170px'}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick" 
                title="Clique para incluir um grupo de cliente"
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
                onClick={() => history.push(`/customer/list`)}
              >
                <FiArrowLeft />
                Retornar
              </button>
            </div>
          </div>  
        </div>

        <div style={{width:'100%', height:'25px'}}><></></div> 

        <Content onScroll={handleScroll} ref={scrollRef}>

          <GridContainer>
            <Grid
              rows={customerGroupList}
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
export default CustomerGroupList