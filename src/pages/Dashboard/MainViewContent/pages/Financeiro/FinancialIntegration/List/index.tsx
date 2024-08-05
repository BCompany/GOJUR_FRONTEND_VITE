/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import api from 'services/api';
import { FaFileAlt } from 'react-icons/fa'
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import { useAuth } from 'context/AuthContext';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { GridContainer } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { useDefaultSettings } from 'context/defaultSettings';
import { HeaderPage } from 'components/HeaderPage';
import { IDefaultsProps} from '../../../Interfaces/ICalendar';
import { Container, Content } from './styles';

export interface IFinancialIntegrationData{
  id: number
  name: string
  count: number
}

const FinancialIntegrationList = () => {
  const { addToast } = useToast()
  const history = useHistory()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { handleUserPermission } = useDefaultSettings()
  const {captureText, handleLoadingData} = useHeader()
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal()
  const [financialIntegrationList, setFinancialIntegrationList] = useState<IFinancialIntegrationData[]>([])
  const [totalPageCount, setTotalPageCount] = useState<number>(0)
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false)
  const [isLoading, setIsLoading]= useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [isEndPage, setIsEndPage] = useState(false)
  const [isPagination, setIsPagination] = useState(false)
  const [isDeleting , setIsDeleting] = useState<boolean>()
  const { signOut } = useAuth()
  const token = localStorage.getItem('@GoJur:token')

  const columns = [
    { name: 'name', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ]

  const [tableColumnExtensions] = useState([
    { columnName: 'name', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ])


  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])


  useEffect(() => {
    setFinancialIntegrationList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadFinancialIntegration('initialize')
  }, [captureText])


  useEffect(() => {
    LoadFinancialIntegration();
  },[pageNumber])


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


  const LoadFinancialIntegration = useCallback(async(state = '') => {
    try {
      if (isEndPage && state != 'initialize')
        return;

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.get<IFinancialIntegrationData[]>('/IntegracaoFinanceira/ListarPainel', { 
        params:{ page, rows:20, filterClause: captureText, token }
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
        setFinancialIntegrationList(response.data)    
      }
      else{
        response.data.map((item)=> financialIntegrationList.push(item))
        setFinancialIntegrationList(financialIntegrationList)    
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
  }


  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.id)
    }

    if (props.column.name === 'remove'){
      Delete(props.row.id)
    }
  }


  const Delete = async(id: number) => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)
      
      await api.delete('/IntegracaoFinanceira/Apagar', {
        params:{ id, token }
      })
      
      addToast({type: "success", title: "Carteira de cobrança consultivo excluída", description: "A carteira de cobrança foi excluído no sistema."})
      LoadFinancialIntegration('initialize')
      setIsDeleting(false)
    }
    catch (err: any) {
      setIsDeleting(false)
      addToast({type: "error", title: "Falha ao excluir carteira de cobrança.", description:  err.response.data.Message})
    }
  };


  // EDIT
  const handleEdit = async(id: number) => {
    history.push(`/FinancialIntegration/Edit/${id}`)
  };


  // NEW
  const handleOpenEdit = () => {    
    history.push(`/FinancialIntegration/Edit/0`)
  }


  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || financialIntegrationList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-20) <= element.clientHeight
    
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
    <Container>
      <HeaderPage />

      <div style={{width:'100%', marginTop:'20px'}}>
        <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
          Número de integradores financeiros:&nbsp;
          {totalPageCount}
        </div>

        <div style={{float:'right', marginRight:'170px'}}>
          <div style={{float:'left'}}>
            <button className="buttonClick" title="Clique para incluir uma carteira de cobrança" type="submit" onClick={handleOpenEdit}>
              <FaFileAlt />
              Adicionar
            </button>
          </div>

          <div style={{float:'left'}}>
            <button className="buttonClick" title="Clique para retornar ao financeiro" type="submit" onClick={() => history.push(`/financeiro`)}>
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
            rows={financialIntegrationList}
            columns={columns}
          >
            <Table
              cellComponent={CustomCell}
              columnExtensions={tableColumnExtensions}            
              messages={languageGridEmpty}
            />
          </Grid>
        </GridContainer>
      </Content>

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
  )
}

export default FinancialIntegrationList;