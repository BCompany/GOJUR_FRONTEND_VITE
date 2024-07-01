/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */

import React, { useCallback, useState, useEffect } from 'react';
import api from 'services/api';
import { useToast } from 'context/toast';
import { FiDownloadCloud } from 'react-icons/fi';
import { format } from 'date-fns';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FormatCurrency } from 'Shared/utils/commonFunctions';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { useLocation, useHistory } from 'react-router-dom'
import { Overlay } from 'Shared/styles/GlobalStyle';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { IFinancialInformationData, IValueData } from './IFinancialInformation';
import ValidModal from './ValidPaymentSlipModal';
import InvalidModal from './InvalidPaymentSlipModal';
import NewPaymentSlipModal from './NewPaymentSlip';
import { Container, Center, GridFinancialInformation, FinancialInformationOverlay } from './styles';

const FinancialInformation: React.FC = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const accessCode = localStorage.getItem('@GoJur:accessCode');
  const financialInformationCaller = localStorage.getItem('@GoJur:financialInformationCaller');
  const [financialInformationList, setFinancialInformationList] = useState<IFinancialInformationData[]>([]);
  const [loaderMessagem, setLoaderMessage] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [showValidModal, setShowValidModal] = useState<boolean>(false);
  const [showInvalidModal, setShowInvalidModal] = useState<boolean>(false);
  const [showNewPaymentSlipModal, setShowNewPaymentSlipModal] = useState<boolean>(false);
  const [billingInvoiceId, setBillingInvoiceId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [days, setDays] = useState('');
  const [link, setLink] = useState<string>("");
  const [fiCaller, setFiCaller] = useState('');
  const [fromEmail, setFromEmail] = useState<boolean>(false)
  const [customerName, setCustomerName] = useState<string>("")
  const [companyFromEmail, setCompanyFromEmail] = useState<string>("")
  const location = useLocation();

  const columns = [
    { name: 'dta_Vencimento',       title: 'Vencimento da Fatura'},
    { name: 'vlr_Parcela',          title: 'Valor Original'},
    { name: 'num_DiasVencimento',   title: 'Dias Vencido Original'},
    { name: 'tpo_StatusLiquidacao', title: 'Staus do Pagamento'},
    { name: 'paid',                 title: 'Fatura'},
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'dta_Vencimento',       width: '20%' },
    { columnName: 'tpo_StatusLiquidacao', width: '20%' },
    { columnName: 'vlr_Parcela',          width: '20%' },
    { columnName: 'num_DiasVencimento',   width: '20%' },
    { columnName: 'paid',                 width: '20%' },
  ]);

  useEffect(() => {
    if(location.search.includes('?token=')){
      const id = location.search.substring(7).split("-")[4].substring(0,6)
      setCompanyFromEmail(String(Number(id)))
      setFromEmail(true)
    }
  },[location])

  useEffect(() => {
    if(fromEmail == true){
      setFromEmail(false)
      setFiCaller('login')
      LoadFinancialInformations()
    }
  },[fromEmail])

  useEffect(() => {
    if((location.search.includes('?token=') == false)){
      if(financialInformationCaller == 'login')
    {
      setFiCaller('login')
      localStorage.removeItem('@GoJur:financialInformationCaller');
    }
    else
    {
      setFiCaller('userProfile')
      localStorage.removeItem('@GoJur:financialInformationCaller');
    }

    LoadFinancialInformations()
    } 
  },[])

  useEffect(() => {
    if(link != '')
      setShowNewPaymentSlipModal(true)
  },[link])


  const LoadFinancialInformations = useCallback(async() => {
    try {
      setIsLoader(true)
      setLoaderMessage('Carregando')

      const response = await api.post<IFinancialInformationData[]>('/InformacoesFinanceiras/Listar', {
        token,
        accessCode,
        companyId: companyFromEmail
      });

      GetCustomerName()
      setFinancialInformationList(response.data)
      setIsLoader(false)
      
    } catch (err) {
      setIsLoader(false)
      console.log(err);
    }
  },[token, accessCode, companyFromEmail]);

  const GetCustomerName = useCallback(async() => {
    try {
    const response = await api.post<IValueData>('/InformacoesFinanceiras/NomeCliente', {
      token,
      companyId: companyFromEmail
    })

    setCustomerName(response.data.value)

  } catch (err) {
    console.log(err);
  }
  },[customerName, token, companyFromEmail]);


  const CustomCell = (props) => {

    const { column } = props;

    if (column.name === 'dta_Vencimento') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div style={{fontSize:'14px'}}>
            {format(new Date(props.row.dta_Vencimento), 'dd/MM/yyyy')}
          </div>
        </Table.Cell>
      );
    }
    if (column.name === 'vlr_Parcela') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div style={{fontSize:'14px'}}>
            {FormatCurrency.format(Number(props.row.vlr_Fatura))}
          </div>
        </Table.Cell>
      );
    }
    if (column.name === 'num_DiasVencimento') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div style={{fontSize:'14px'}}>
            {(props.row.num_DiasVencimento < 0 || props.row.tpo_StatusLiquidacao != "P") ? 0 : props.row.num_DiasVencimento}
          </div>
        </Table.Cell>
      );
    }
    if (column.name === 'tpo_StatusLiquidacao') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div style={{fontSize:'14px'}}>
            {props.row.tpo_StatusLiquidacao == "P" ? "Pendente" : "Liquidado"}
          </div>
        </Table.Cell>
      );
    }
    if (column.name === 'paid') {
      let message = '';
      if (props.row.num_DiasVencimento > 28)
        message = `Seu boleto está vencido a ${props.row.num_DiasVencimento} dias. Clique aqui para gerar um novo boleto.`;
      else
        message = "Clique aqui para visualizar seu boleto.";

      if (props.row.tpo_StatusLiquidacao == "P")
      {
        return (
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            <div style={{cursor:'pointer'}}>
              <FiDownloadCloud style={{height:'20px', width:'20px', float:'left', color:'#383838'}} title={message} />
              <p style={{float:'left', fontSize:'14px'}}>&nbsp;Ver fatura</p>
            </div>
          </Table.Cell>
        );
      }
    }

    return <Table.Cell {...props} />;
  }


  const handleClick = (props: any) => {
    setBillingInvoiceId(props.row.cod_Fatura)
    setCompanyId(props.row.cod_Empresa)
    setDays(props.row.num_DiasVencimentoSlip)

    if (props.row.num_DiasVencimentoSlip <= 0)
      OpenPaymentSlip(props.row.cod_Fatura, props.row.cod_Empresa)
    else if (props.row.num_DiasVencimentoSlip > 28)
      setShowInvalidModal(true)
    else
      setShowValidModal(true)
  }


  const OpenPaymentSlip = async (billingInvoiceId, companyId) => {
    try {
      setIsLoader(true);

      const response = await api.post('/InformacoesFinanceiras/LinkBoleto', {
        billingInvoiceId,
        companyId,
        token: ''
      });

      window.open(response.data);
      setIsLoader(false);
      CloseModal();
    } catch (err: any) {
      setIsLoader(false);
      addToast({type: 'error', title: 'Não foi possível executar esta operação', description: err.response.data.Message});
    }
  };


  const CloseModal = async () => {
    setShowValidModal(false)
    setShowInvalidModal(false)
    setBillingInvoiceId('')
    setCompanyId('')
    setDays('')
    LoadFinancialInformations()
    GetCustomerName()
  }


  const CloseModalCancel = async () => {
    setShowValidModal(false)
    setShowInvalidModal(false)
    setBillingInvoiceId('')
    setCompanyId('')
    setDays('')
  }


  const CloseNewPaymentSlipModal = async () => {
    setShowNewPaymentSlipModal(false);
    setLink('');
  }
  

  return (
    <>   
      <Container>

        {(showValidModal) && <FinancialInformationOverlay /> }
        {(showValidModal) && <ValidModal callbackFunction={{CloseModal, CloseModalCancel, billingInvoiceId, companyId, days}} /> }

        {(showInvalidModal) && <FinancialInformationOverlay /> }
        {(showInvalidModal) && <InvalidModal callbackFunction={{CloseModal, CloseModalCancel, billingInvoiceId, companyId, setLink}} /> }

        {(showNewPaymentSlipModal) && <FinancialInformationOverlay /> }
        {(showNewPaymentSlipModal) && <NewPaymentSlipModal callbackFunction={{CloseNewPaymentSlipModal, link}} /> }

        <Center>
          <div className="flex-box container-box">
            <div className="content-box">
              <img src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png" alt="logo" />
            </div>
          </div>

          <br /><br />

          {fiCaller == 'login' && (
            <div className="flex-box container-box">
              <div className="content-box">
                <p>
                  <b>Aviso: </b>
                  Você possui pendencias financeiras com o GOJUR. Seu acesso está indisponível no momento.<br />
                  Para restabelecer o seu acesso é necessário regularizar as faturas pendentes abaixo, <b>priorize as faturas mais antigas.</b><br />
                  Após realizar o pagamento, se desejar, envie o comprovante para financeiro@bcompany.com.br para agilizar a reativação.<br /><br />
                  <b>IMPORTANTE</b> para reativar o acesso a fatura mais antiga deve ser regularizada.
                  <br /><br />
                </p>
              </div>
            </div>
          )}

          {fiCaller == 'userProfile' && (
            <div className="flex-box container-box">
              <div className="content-box">
                <p>
                  Segue abaixo seu histórico de pagamento e suas faturas dos últimos 12 meses.
                  <br /><br />
                </p>
              </div>
            </div>
          )}

          <div style={{textAlign:"center"}}>
            <b>{customerName}</b>  
          </div>
          
          <GridFinancialInformation>
            <Grid
              rows={financialInformationList}
              columns={columns}
            >
              <Table
                cellComponent={CustomCell}
                columnExtensions={tableColumnExtensions}            
                messages={languageGridEmpty}
              />
              <TableHeaderRow />
            </Grid>
          </GridFinancialInformation>

        </Center>

        {isLoader && (
          <>
            <Overlay />
            <div className='waitingMessage'>   
              <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
              &nbsp;&nbsp;
              {loaderMessagem}
              ...
            </div>
          </>
        )}

      </Container>
    </>
  );
}
  
export default FinancialInformation;
  