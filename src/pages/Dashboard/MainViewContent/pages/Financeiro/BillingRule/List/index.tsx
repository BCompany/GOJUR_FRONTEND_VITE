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
import { useSecurity } from 'context/securityContext';
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
import { ISelectData } from '../../../Interfaces/IMatter';
import { IBillingRuler, IBillingRulerWarning } from '../Interfaces/IBillingRuler';

export interface IDefaultsProps {
  id: string;
  value: string;
}

const BillingRuleList = () => {
  // STATES
  const { signOut } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { captureText, captureType, handleLoadingData } = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const [billingRulerList, setBillingRulerList] = useState<IBillingRuler[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const { isMOBILE } = useDevice();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentBillingRulerId, setCurrentBillingRulerId] = useState<number>(0);
  const { isConfirmMessage, isCancelMessage, caller, handleCancelMessage, handleConfirmMessage, handleCheckConfirm, handleCaller } = useConfirmBox();
  const [filterName, setFilterName] = useState('');
  
  const checkWorkflow = permissionsSecurity.find(item => item.name === "CFGWKFCD");

  const columns = [
    { name: 'descriptionBillingRuler', title: 'Descrição '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'descriptionBillingRuler', width: '70%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);
 

useEffect(() => {
  const setup = async () => {

    setBillingRulerList([]);
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1);
    setIsEndPage(false);

    LoadBillingRuler('initialize');

};

  setup(); 
}, [captureText]);
 


  useEffect(() => {

    if (isCancelMessage) {
      setIsDeleting(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])


  useEffect(() => {

    if (isConfirmMessage && caller == "WorkflowList") {
 
      if (!isDeleting) {
        window.open(`${envProvider.redirectUrl}ReactRequest/Redirect?token=${token}&route=workflow`)
      }
      else {
        handleDeleteBillingRuler(currentBillingRulerId)
      }

      setIsDeleting(false)
      handleConfirmMessage(false)
      handleCaller('')
      handleCheckConfirm(false)
    }

  }, [isConfirmMessage])



  const handleDeleteBillingRuler = async (billingRulerId: number) => {
    try {
     
      await api.delete('/Financeiro/ReguaCobranca/Deletar', {
        params: {
          id: billingRulerId,
          token
        }
      })


      const billingRuler = billingRulerList.find(wk => wk.billingRulerId === billingRulerId);
      if (billingRuler) {
        const billingRulerListRefresh = billingRulerList.filter(wk => wk.billingRulerId !== billingRulerId);
      
        setBillingRulerList(billingRulerListRefresh);   
      }

      addToast({ 
        type: 'success',
        title: 'Régua Deletada',
        description: 'A Régua selecionada foi deletada',
      });

      setIsDeleting(false)
 
      setCurrentBillingRulerId(0)

    } catch (err) {
      addToast({
        type: 'info',
        title: 'Falha ao apagar Régua',
        description: err.response.data.Message
      });

 
      setIsDeleting(false)
      setCurrentBillingRulerId(0)
    }
  }

 

 // METHODS
  const LoadBillingRuler = useCallback(async(state = '') => {
    try
    {
   
      if (isEndPage && state != 'initialize')
        return;
  
      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

     
       const response = await api.get<IBillingRuler[]>('/Financeiro/ReguaCobranca/Listar', { 
            params:{                            
              page,
              rows:20,
              filterClause:captureText,
              token
              }
          })
      
          
      if(response.data.length > 0 && state == 'initialize')
        setTotalPageCount(response.data.length)
        //setTotalPageCount(response.data[0].totalRows)

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
        setBillingRulerList(response.data)    
      }
      else{
        response.data.map((item)=> billingRulerList.push(item))
        setBillingRulerList(billingRulerList)    
      }

      handleLoadingData(false)
      setIsLoadingSearch(false)
      setIsLoading(false)
      handleCaller('')

    } catch (err: any) {

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



  const handleCheckBoxDeleteBillingRuler = (billingRulerId: number) => {
    setIsDeleting(true)
    setCurrentBillingRulerId(billingRulerId);
  }
  
 
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
          handleCheckBoxDeleteBillingRuler(row.billingRulerId)
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

    console.log(props.row);
   
    if (props.column.name === 'edit') {
       handleEdit(props.row.billingRulerId)
    }

  }

  // EDIT
  const handleEdit = async (id: number) => {
    history.push(`/financeiro/billingrule?billingRulerId=${id}`)
  };



 const handleCancel = () => {
    
    history.push('/financeiro')

  }


  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || billingRulerList.length == 0) return;

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


  const handleBillingRuler = () => {

    history.push('/financeiro/billingrule')

  };


  // HTML CODE
  return (
    <>
      {!isMOBILE && (
        <Container>

          <HeaderPage />



          <div style={{ width: '100%', marginTop: '20px' }}>

            <div style={{ float: 'left', marginLeft: '150px', marginTop: '12px', fontSize: '13px' }}>
              Número de Régua de Cobrança:&nbsp;
              {totalPageCount}
            </div>

            
            <div style={{ float: 'right', marginRight: '185px' }}>
 
              <div style={{ float: 'left', marginRight: '10px' }}>

                <button
                  className="buttonClick"
                  title="Clique para incluir um Workflow"
                  type="submit"
                  onClick={() =>handleBillingRuler()}
                >
                  <FaFileAlt />
                  Incluir Nova Régua
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
     
         
             <div style={{ float: 'left', marginLeft: '150px', marginTop: '12px', fontSize: '13px' }}>
             {filterName}
            </div>

          <div style={{ width: '100%', height: '25px' }}><></></div>

          <Content onScroll={handleScroll} ref={scrollRef}>

            <GridContainer>
              <Grid
                rows={billingRulerList}
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
            message="Confirma a exclusão dessa Régua de Cobrança ?"
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
export default BillingRuleList;