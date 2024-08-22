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
import { useAuth } from 'context/AuthContext';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { HeaderPage } from 'components/HeaderPage';
import { IDefaultsProps} from '../../../Interfaces/ICalendar';
import { Container, Content , ContentMobile } from './styles';

export interface IPaymentSlipContractData{
    paymentSlipContractId: string;
    paymentSlipContractDescription: string;
    bankId: string;
    bankName: string;
    agencyNumber: string;
    agencyDigitNumber: string;
    accountNumber: string;
    accountDigitNumber: string;
    assignorId: string;
    assignorDigitId: string;
    bankWalletId: string;
    transmissionId: string;
    invoiceName: string;
    remittanceFileName: string;
    beneficiaryCNPJNumber: string;
    beneficiaryName: string;
    beneficiaryAdress: string;
    befeniciaryCEP: string;
    seqDocumentNumber: string;
    seqRemitenceNumber: string;
    penaltyLevyDaysNumber: string;
    penaltyPackages: string;
    ratesPackage: string;
    shippingLevyDaysNumber: string;
    typeBankWalletShipping: string;
    typeBankWalletReturn: string;
    flg_Default: string;
    messageDescription1: string;
    messageDescription2: string;
    messageDescription3: string;
    messageDescription4: string;
    messageDescription5: string;
    count: number;
}

const PaymentSlipContractList = () => {
  // STATES
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const {captureText, handleLoadingData} = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const [paymentSlipContractList, setPaymentSlipContractList] = useState<IPaymentSlipContractData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [showModal, setShowModal] = useState(false);
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const [isDeleting , setIsDeleting] = useState<boolean>(); // set trigger for show loader
  const { signOut } = useAuth();
  const { isMOBILE } = useDevice();
  
  const columns = [
    { name: 'paymentSlipContractDescription', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'paymentSlipContractDescription', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'paymentSlipContractDescription', width: '50%' },
    { columnName: 'btnEditar', width: '3%' },
    { columnName: 'btnRemover',width: '3%' },
  ]);


  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])


  useEffect(() => {
    setPaymentSlipContractList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadPaymentSlipContract('initialize')

  },[captureText])


  useEffect(() => {
    LoadPaymentSlipContract();
  },[pageNumber])


  // METHODS
  const LoadPaymentSlipContract = useCallback(async(state = '') => {
    try {
      if (isEndPage && state != 'initialize')
        return;

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.get<IPaymentSlipContractData[]>('/CarteiraDeCobrança/ListarPainel', { 
        params:{page, rows:20, filterClause: captureText, token}
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
        setPaymentSlipContractList(response.data)    
      }
      else{
        response.data.map((item)=> paymentSlipContractList.push(item))
        setPaymentSlipContractList(paymentSlipContractList)    
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
      handleEdit(props.row.paymentSlipContractId)
    }

    if (props.column.name === 'remove'){
      deletePaymentSlipContract(props.row.paymentSlipContractId)
    }
  }


  // EDIT
  const handleEdit = async(id: number) => {
    history.push(`/PaymentSlipContract/Edit/${id}`)
  };


  // NEW
  const handleOpenEdit = () => {    
    history.push(`/PaymentSlipContract/Edit/0`)
  }


  // DELETE
  const deletePaymentSlipContract = async(id: number) => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)
      
      await api.delete('/CarteiraDeCobrança/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Carteira de cobrança consultivo excluída",
        description: "A carteira de cobrança foi excluído no sistema."
      })

      LoadPaymentSlipContract('initialize')
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir carteira de cobrança.",
        description:  err.response.data.Message
      })
    }
  };


  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || paymentSlipContractList.length == 0) return;

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
       
        {!isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de integradores financeiros:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'170px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma carteira de cobrança"
                  type="submit"
                  onClick={handleOpenEdit}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>

              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar ao financeiro"
                  type="submit"
                  onClick={() => history.push(`/financeiro`)}
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
              Número de carteiras de cobrança:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'25px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma carteira de cobrança"
                  type="submit"
                  onClick={handleOpenEdit}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>

              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar ao financeiro"
                  type="submit"
                  onClick={() => history.push(`/financeiro`)}
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
                rows={paymentSlipContractList}
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
                rows={paymentSlipContractList}
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
export default PaymentSlipContractList;