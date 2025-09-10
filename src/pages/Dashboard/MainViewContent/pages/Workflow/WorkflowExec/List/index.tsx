/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, useRef } from 'react';
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { FaFileAlt, FaAngleLeft  } from 'react-icons/fa'
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
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
import { Container, Content, ContainerMobile } from './styles';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { format, parseISO } from "date-fns";


export interface IDefaultsProps {
  id: string;
  value: string;
}

export interface IWorkflowData {
  workflowId: number;
  name: string;
  startDate: string;
  endDate: string;
  statusType: string;
  matterId: number;
  matter: string;   
  customerId: number;
  customer: string;  
}

const WorkflowList = () => {
  // STATES
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { captureText, captureType, handleLoadingData } = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const [workflowList, setWorkflowList] = useState<IWorkflowData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  //const { isOpenModal, handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const { isMOBILE } = useDevice();
  const [hasAccess, setHasAccess] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<number>(0);
  const { isConfirmMessage, isCancelMessage, caller, handleCancelMessage, handleConfirmMessage, handleCheckConfirm, handleCaller } = useConfirmBox();
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
  const [matterFileId, setMatterFileId] = useState('');
  const [customerFileId, setCustomerFileId] = useState('');
  const [matterRedirect, setMatterRedirect] = useState<boolean>(false)
  const [customerRedirect, setCustomerRedirect] = useState<boolean>(false)
   const [calendarRedirect, setCalendarRedirect] = useState<boolean>(false) 


  const columns = [
    { name: 'name', title: 'Workflow' },
    { name: 'startDate', title: 'Início' },
    { name: 'endDate', title: 'Fim' },
    { name: 'statusType', title: 'Status' },
    { name: 'matter', title: 'Processo' },
    { name: 'customer', title: 'Cliente' },
    { name: 'edit', title: ' ' },
    { name: 'remove', title: ' ' }
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'name', width: '10%' },
    { columnName: 'startDate', width: '10%' }, 
    { columnName: 'endDate', width: '10%' },
    { columnName: 'statusType', width: '10%', wordWrapEnabled: true },
    { columnName: 'matter', width: '20%', wordWrapEnabled: true },
    { columnName: 'customer', width: '19%', wordWrapEnabled: true },
    { columnName: 'btnEditar', width: '2%' },
    { columnName: 'btnRemover', width: '2%' },
  ]);


   const Initialize = () => {
                                       
    const redirectByMatter = localStorage.getItem('@Gojur:matterRedirect') 


    if (redirectByMatter == "S"){
       setMatterRedirect(true)   
      setMatterFileId(localStorage.getItem('@Gojur:matterId'))  
      localStorage.removeItem('@Gojur:matterId')
      localStorage.removeItem('@Gojur:matterRedirect')
        
    }   
    
    const redirectByCustomer = localStorage.getItem('@Gojur:customerRedirect') 
    if (redirectByCustomer == "S"){
      setCustomerRedirect(true)   
      setCustomerFileId(localStorage.getItem('@Gojur:customerId'))  
      localStorage.removeItem('@Gojur:customerId')    
      localStorage.removeItem('@Gojur:customerRedirect')
    }

    const redirectByCalendar = localStorage.getItem('@Gojur:calendarRedirect') 
    if (redirectByCalendar == "S"){
      setCalendarRedirect(true);   
      localStorage.removeItem('@Gojur:calendarRedirect')
    }
    
  }


  useEffect(() => {
    Initialize();
    setWorkflowList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1);
    setIsEndPage(false);  
    LoadWorkflow('initialize');
   
  }, [captureText, captureType, matterFileId, customerFileId])


  useEffect(() => {
    LoadWorkflow();
  }, [pageNumber])


  useEffect(() => {

    if (isCancelMessage) {
      setIsDeleting(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])


  useEffect(() => {

    if (isConfirmMessage && caller == "WorkflowList") {

      if (!isDeleting) {
        window.open(`${envProvider.redirectUrl}ReactRequest/Redirect?token=${token}&route=workflow/list`)
      }
      else {
        handleDeleteWorkflow(currentWorkflowId)
      }

      setIsDeleting(false)
      handleConfirmMessage(false)
      handleCaller('')
      handleCheckConfirm(false)
    }

  }, [isConfirmMessage])



  const handleDeleteWorkflow = async (workflowId: number) => {
    try {
      setIsDeletingCustomer(true)

      await api.delete('/Workflow/Deletar33', {
        params: {
          id: workflowId,
          token
        }
      })


      const workflow = workflowList.find(wk => wk.workflowId === workflowId);
      if (workflow) {
        const workflowListRefresh = workflowList.filter(wk => wk.workflowId !== workflowId);
        // customerListRefresh = customerList.filter(cust => cust.nom_Pessoa.toLowerCase() !== customer.nom_Pessoa.toLowerCase());
        setWorkflowList(workflowListRefresh);
      }

      addToast({
        type: 'success',
        title: 'Workflow Deletado',
        description: 'O workflow selecionado foi deletado',
      });

      setIsDeleting(false)
      setIsDeletingCustomer(false)
      setCurrentWorkflowId(0)

    } catch (err) {
      addToast({
        type: 'info',
        title: 'Falha ao apagar workflow',
        description: err.response.data.Message
      });

      setIsDeletingCustomer(false)
      setIsDeleting(false)
      setCurrentWorkflowId(0)
    }
  }



  // METHODS
  const LoadWorkflow = useCallback(async (state = '') => {
    try {
      if (isEndPage && state != 'initialize')
        return;

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize' ? 1 : pageNumber;

      const filters: string[] = [];

      if (captureText) {
        filters.push(`wf.nom_Workflow like '%${captureText}%'`);
      }

      if (captureType) {
        filters.push(`wfe.tpo_Status like '%${captureType}%'`);
      }

      if (matterFileId) { 
        filters.push(`wfe.cod_Processo = ${matterFileId}`);
      }

      if (customerFileId) { 
        filters.push(`wfe.cod_Cliente = ${customerFileId}`);
      }

      const filterClause = filters.join(", "); 


      const response = await api.get<IWorkflowData[]>('/Workflow/ListarExec', {
        params: {
          page,
          rows: 20,
          filterClause,
          //filterClause: "wf.nom_Workflow like '%" + captureText + "%', wfe.tpo_Status like '%" + captureType + "%', wfe.cod_Processo = " + matterFileId,
          token
        }
      })

 

      const statusMap: Record<string, string> = {
        emandamento: "Em andamento",
        concluido: "Concluído",
      };


      const formattedData = response.data.map(item => ({
        ...item,
        startDate: item.startDate ? format(new Date(item.startDate), "dd/MM/yyyy") : "",
        endDate: item.endDate ? format(new Date(item.endDate), "dd/MM/yyyy") : "",
       statusType: statusMap[item.statusType?.toLowerCase()] || item.statusType, 
      }));

      if (response.data.length > 0 && state == 'initialize')
        setTotalPageCount(response.data.length)
      //setTotalPageCount(response.data[0].totalRows)

      if (response.data.length == 0 || state === 'initialize') {
        setIsLoadingSearch(false)
        setIsEndPage(true)
        setIsLoading(false)
        setPageNumber(1)
        handleLoadingData(false)
        if (state != 'initialize') return;
      }

      if (!isPagination || state === 'initialize') {
        setIsEndPage(false)
        setWorkflowList(formattedData);
      }
      else {
        //response.data.map((item) => workflowList.push(item))
        response.data.map(item =>
          workflowList.push({
            ...item,
            startDate: item.startDate
              ? format(new Date(item.startDate), "dd/MM/yyyy")
              : "",
            endDate: item.endDate
              ? format(new Date(item.endDate), "dd/MM/yyyy")
              : "",
            statusType: statusMap[item.statusType?.toLowerCase()] || item.statusType,
          })
        );

        setWorkflowList(workflowList)
      }

      handleLoadingData(false)
      setIsLoadingSearch(false)
      setIsLoading(false)
      handleCaller('')

    } catch (err: any) {
      setHasAccess(false)
      setIsLoading(false)
      handleLoadingData(false)
      console.log(err)
      if (err.response.data.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }
    }
  }, [pageNumber, captureText, captureType, matterFileId, customerFileId, isPagination, isEndPage])


  const handleCheckBoxDeleteWorkflow = (workflowId: number) => {
    setIsDeleting(true)
    setCurrentWorkflowId(workflowId);
  }
  
  /*
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

        <Table.Cell onClick={() => handleCheckBoxDeleteWorkflow(props.row.workflowId)}>

          &nbsp;&nbsp;
          <FiTrash title="Clique para remover" />
        </Table.Cell>

      );
    }

    return <Table.Cell {...props} />;
  };
*/

const CustomCell = (props) => {
  const { column, row } = props;

  if (column.name === "edit") {
    return (
      <Table.Cell onClick={(e) => handleClick(props)} {...props}>
        &nbsp;&nbsp;
        <FiEdit title="Clique para editar " />
      </Table.Cell>
    );
  }

  if (column.name === "remove") {
    return (
      <Table.Cell
        onClick={() =>
          handleCheckBoxDeleteWorkflow(row.workflowId)
        }
      >
        &nbsp;&nbsp;
        <FiTrash title="Clique para remover" />
      </Table.Cell>
    );
  }


  if (["matter", "customer"].includes(column.name)) {
    return (
      <Table.Cell
        {...props}
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />
    );
  }

  return <Table.Cell {...props} />;
};

  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit') {
      handleEdit(props.row.workflowId)
    }

    if (props.column.name === 'remove') {
      deleteWorkflow(props.row.workflowId)
    }
  }

  // EDIT
  const handleEdit = async (id: number) => {
    history.push(`/workflow/editx/${id}`)
  };

  // DELETE
  const deleteWorkflow = async (id: number) => {

    try {
      const token = localStorage.getItem('@GoJur:token');

      await api.delete('/Workflow/Deletar', {
        params: {
          id: id,
          token
        }
      })

      addToast({
        type: "success",
        title: "Workflow excluído",
        description: "O Workflow foi excluído no sistema."
      })

      LoadWorkflow('initialize')

    } catch (err: any) {

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir o Workflow.",
        description: err.response.data.Message
      })
    }
  };

  const handleCancel = () => {
    
    console.log('MatterRedirect: ', matterRedirect)
    
    if (matterRedirect){
      history.push('../../../matter/list')
    }
    else if (customerRedirect){
      history.push('../customer/list')
    }
    else if (calendarRedirect){ 
      history.push('../calendar')
    }

  }


  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || workflowList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop) - 20) <= element.clientHeight

    // calculate if achieve end of scrool page
    if (isEndScrool) {

      if (!isLoadingSearch) {
        setPageNumber(pageNumber + 1)
      }

      setIsLoadingSearch(true)
      setIsPagination(true)
    }
  }

  if (isLoading) {
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
      {!isMOBILE && (
        <Container>

          <HeaderPage />



          <div style={{ width: '100%', marginTop: '20px' }}>

            <div style={{ float: 'left', marginLeft: '150px', marginTop: '12px', fontSize: '13px' }}>
              Número de Workflow:&nbsp;
              {totalPageCount}
            </div>

            <div style={{ float: 'right', marginRight: '185px' }}>
              <div style={{ float: 'left', marginRight: '10px' }}>

                <button
                  className="buttonClick"
                  title="Clique para incluir um Workflow"
                  type="submit"
                  onClick={() => history.push('/Workflow/editx/0')}
                >
                  <FaFileAlt />
                  Iniciar Novo Workflow
                </button>
              </div>

              <div style={{ float: 'right'}}>
                 
                <button
                  className="buttonClick"
                  title="Clique para retornar"
                  type="submit"
                  onClick={handleCancel}
                >
                 <FiArrowLeft />
                  Retornar
                </button>


              </div>
            </div>
             
          </div>
          <div style={{ float: 'left', marginLeft: '150px', marginTop: '12px' }}>
            <h5>Workflows em Execução</h5>
          </div>
         

          <div style={{ width: '100%', height: '25px' }}><></></div>

          <Content onScroll={handleScroll} ref={scrollRef}>

            <GridContainer>
              <Grid
                rows={workflowList}
                columns={columns}
              >
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableColumnExtensions}
                  messages={languageGridEmpty}
                />
                <TableHeaderRow />
           
              </Grid>
            </GridContainer>

          </Content>

        </Container>


      )}




      {isDeleting && (

        <ConfirmBoxModal
          title="Excluir Registro"
          caller="WorkflowList"
          message="Confirma a exclusão deste workflow ?"
        />

      )}


      {isMOBILE && (
        <ContainerMobile>
          <div id='information' style={{ marginTop: '30%', border: 'solid 1px', backgroundColor: 'white', height: '78px', borderRadius: '10px', color: '#2c8ed6' }}>
            <div style={{ marginLeft: '8%' }}>
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
export default WorkflowList;