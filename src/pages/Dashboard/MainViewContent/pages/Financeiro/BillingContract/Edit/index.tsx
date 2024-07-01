/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useLocation, useHistory } from 'react-router-dom'
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AutoCompleteSelect, GridSubContainer } from 'Shared/styles/GlobalStyle';
import { FcAbout } from 'react-icons/fc';
import { languageGridEmpty, languageGridLoading, loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { CgAdd } from 'react-icons/cg';
import IntlCurrencyInput from "react-intl-currency-input"
import { BiSearchAlt } from 'react-icons/bi';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { AiOutlinePrinter } from 'react-icons/ai';
import { FaFileContract, FaFileInvoiceDollar, FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { FiEdit, FiHelpCircle, FiSave, FiTrash } from 'react-icons/fi';
import { currencyConfig } from 'Shared/utils/commonFunctions';
import { parcelas } from 'Shared/utils/commonListValues';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import api from 'services/api';
import Select from 'react-select'
import { selectStyles, useDelay, FormatDate, FormatCurrency} from 'Shared/utils/commonFunctions';
import BillingContractDocumentModal from '../BIllingContractDocumentModal';
import { Container, Content, Form, ItemList, ModalCategory} from './styles';
import { ISelectData, IServiceTypeSelectData, IPaymentFormSelectData, IPeopleData, ICategoryData, IFinancialStatusData, IServiceTypeData, IBillingContractServiceData, IPaymentFormData, ICostCenterData, IPaymentSlipContractData, IBillingContractData } from '../../../Interfaces/IBIllingContract'

const BillingContractEdit: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const { pathname } = useLocation();
  const billingContractId = pathname.substr(33)
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isSaving, setIsSaving]= useState<boolean>(false);
  const [isDeleting, setIsDeleting]= useState<boolean>(false);
  const [peopleType, setPeopleType] = useState<string>("C")
  const [numSequencial, setNumSequencial] = useState<string>("Novo")
  const [dtaStart, setDtaStart] = useState<string>("")
  const [dtaEnd, setDtaEnd] = useState<string>("")
  const [objectDescription, setObjectDescription] = useState<string>('');
  const [paymentType, setPaymentType] = useState<string>("U")
  const [paymentParcelas, setPaymentParcelas] = useState<string>("1");
  const [tpo_Parcelamento, setTpo_Parcelamento] = useState<string>("M")
  const [tpo_Recorrencia, setTpo_Recorrencia] = useState<string>("M")
  const [qtd_Recorrencia, setQtdRecorrencia] = useState<string>("1")
  const [contractType, setContractType] = useState<string>("A")
  const [flg_FaturaEmail, setFlg_FaturaEmail] = useState<boolean>(false)
  const [qtd_DiasFaturamento, setQtd_DiasFaturamento] = useState<string>("1")
  const [email, setEmail] = useState<string>("")
  const [emailAccountPeopleList, setEmailAccountPeoppleList] = useState<string[]>([]);
  const [emailFaturamentoList, setEmailFaturamentoList] = useState<string[]>([]);
  const [totalValueGrid, setTotalValueGrid] = useState<string>("")
  const [flgExpiration, setFlgExpiration] = useState<string>("")
  const [dtaExpiration, setDtaExpiration] = useState<string>("")
  const [billingContractServiceId, setBillingContractServiceId] = useState <string>("")
  const [gridValueUpdate, setGridValueUpdate] = useState<boolean>(false)
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [modalDeleting, setModalDeleting] = useState<boolean>(false)
  const [confirmDeleting, setConfirmDeleting] = useState<boolean>(false)
  const [modalConfirmInvoicing, setModalConfirmInvoicing] = useState<boolean>(false)
  const [confirmInvoicing, setConfirmInvoicing] = useState<boolean>(false)
  const [showModalCategory, setShowModalCategory] = useState<boolean>(false);
  const [showBillingContractDocumentModal, setShowBillingContractDocumentModal] = useState<boolean>(false);
  const [addSequencial, setAddSequencial] = useState<boolean>(false)
  const [cod_Fatura, setCod_Fatura] = useState<string>("0")
  const [numSequenciaFatura, setNumSequenciaFatura] = useState<string>("0")
  const [qtd_DiasFaturamentoFiscal, setQtd_DiasFaturamentoFiscal] = useState<string>("8")
  const [tpo_FluxoFaturamentoFiscal, setTpo_FluxoFaturamentoFiscal] = useState<string>("I") // "I" == Indefinido, "P" == Posterior, "A" == Antecipado
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);

  const [people, setPeople] = useState<ISelectData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleValue, setPeopleValue] = useState('');
  const [peopleTerm, setPeopleTerm] = useState('');

  const [financialStatus, setFinancialStatus] = useState<ISelectData[]>([]);
  const [financialStatusId, setFinancialStatusId] = useState('');
  const [financialStatusType, setFinancialStatusType] = useState<string>("")
  const [financialStatusValue, setFinancialStatusValue] = useState('');
  const [financialStatusTerm, setFinancialStatusTerm] = useState('');

  const [serviceType, setServiceType] = useState<IServiceTypeSelectData[]>([]);
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [serviceTypeValue, setServiceTypeValue] = useState('');
  const [serviceTypeTerm, setServiceTypeTerm] = useState('');
  const [calculationType, setCalculationType] = useState<string>("")
  const [flgMultipleUnit, setFlgMultipleUnit] = useState<string>("N")

  const [serviceValue, setServiceValue] = useState<string>("0")
  const [serviceQtd, setServiceQtd] = useState<string>("1")
  const [serviceDescount, setServiceDescount] = useState<string>("0")
  const [serviceDescription, setServiceDescription] = useState<string>("")

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalRowsServiceTypeList, setTotalRowsServiceTypeList] = useState(0);
  const [billingContractServiceGridList, setBillingContractServiceGridList] = useState<IBillingContractServiceData[]>([]);

  const [paymentForm, setPaymentForm] = useState<IPaymentFormSelectData[]>([]);
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormValue, setPaymentFormValue] = useState('');
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [paymentFormType, setPaymentFormType] = useState<string>("")

  const [dtaVencimento, setDtaVencimento] = useState("");

  const [costCenter, setCostCenter] = useState<ISelectData[]>([]);
  const [costCenterId, setCostCenterId] = useState('');
  const [costCenterValue, setCostCenterValue] = useState('');
  const [costCenterTerm, setCostCenterTerm] = useState('');

  const [paymentSlipContract, setPaymentSlipContract] = useState<ISelectData[]>([]);
  const [paymentSlipContractId, setPaymentSlipContractId] = useState('');
  const [paymentSlipContractValue, setPaymentSlipContractValue] = useState('');
  const [paymentSlipContractTerm, setPaymentSlipContractTerm] = useState('');

  const [category, setCategory] = useState<ISelectData[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('');

  useEffect(() => {
    LoadFinancialStatus();
    LoadServiceType();
    LoadPaymentForm();
    LoadCostCenter();
    LoadPaymentSlipContract();  
  },[])

  useEffect(() => {  
    if (billingContractId != "0"){
      LoadBillingContractGridList();
      SelectBillingContract();
    }

  },[billingContractId])

  useEffect(() => {  
    if (billingContractId == "0"){
      GetDefaultFinancialStatus();
    }

  },[billingContractId])


  useEffect(() => {  
    if (addSequencial == true){
      saveBillingContract()
    }

  },[addSequencial])

  useEffect(() => {  
    LoadPeople();

  },[peopleType])

  useEffect(() => {  
    if (showModalCategory == true){
      LoadCategory()
    }
  },[showModalCategory])

  useDelay(() => {
    if (peopleTerm.length > 0){
      LoadPeople()
    }
  }, [peopleTerm], 500)

  useDelay(() => {
    if (financialStatusTerm.length > 0){
      LoadFinancialStatus()
    }
  }, [financialStatusTerm], 500)

  useDelay(() => {
    if (serviceTypeTerm.length > 0){
      LoadServiceType()
    }
  }, [serviceTypeTerm], 500)

  useDelay(() => {
    if (paymentFormTerm.length > 0){
      LoadPaymentForm()
    }
  }, [paymentFormTerm], 500)

  useDelay(() => {
    if (paymentSlipContractTerm.length > 0){
      LoadPaymentSlipContract()
    }
  }, [paymentSlipContractTerm], 500)

  useDelay(() => {
    if (categoryTerm.length > 0){
      LoadCategory()
    }
  }, [categoryTerm], 500)

  useDelay(() => {
    if (costCenterTerm.length > 0){
      LoadCostCenter()
    }
  }, [costCenterTerm], 500)

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmDeleting')
      {
        setModalDeleting(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmDeleting')
      {
        setConfirmDeleting(true)
      }
    }
  },[isConfirmMessage, caller]);

 useEffect(() => {
  if(confirmDeleting)
    {  
      setConfirmDeleting(false)
      setModalDeleting(false)
      handleCaller("")
      handleConfirmMessage(false)
      deleteBillingContract()
    }
  },[confirmDeleting]);

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmInvoicing')
      {
        setModalConfirmInvoicing(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmInvoicing')
      {
        setConfirmInvoicing(true)
        saveBillingContract()
      }
    }
  },[isConfirmMessage, caller]);

 useEffect(() => {
  if(confirmInvoicing)
    {  
      setConfirmInvoicing(false)
      setModalConfirmInvoicing(false)
      handleCaller("")
      handleConfirmMessage(false)
      setShowModalCategory(true)
    }
  },[confirmInvoicing]);

  // ServiceType columns
  const columnsServiceType = [
    { name: 'des_TipoServicoView',            title: 'Descrição' },
    { name: 'vlr_Servico',                    title: 'Valor' },
    { name: 'pct_Desconto',                   title: 'Desconto %' },
    { name: "vlr_Liquido",                    title: 'Líquido' },
    { name: "editar",                         title: ' ' },
    { name: "excluir",                        title: ' ' }
  ];

  const [tableColumnExtensionsServiceType] = useState([
    { columnName: 'des_TipoServicoView',       width: '50%' },
    { columnName: 'vlr_Servico',               width: '15%' },
    { columnName: 'pct_Desconto',              width: '15%' },
    { columnName: 'vlr_Liquido',               width: '10%' },
    { columnName: 'editar',                    width: '5%'  },
    { columnName: 'excluir',                   width: '5%'  }
  ]);


  const CustomCellUserList = (props) => {

    const { column } = props;

    if (column.name === 'editar') {
      return (
        <Table.Cell onClick={(e) => handleEditService(props)} {...props}>
          <FiEdit title="Clique para editar" />

        </Table.Cell>
      );
    }

    if (column.name === 'des_TipoServicoView' && props.row.tpo_Calculo == "DP" || column.name === 'des_TipoServicoView' && props.row.tpo_Calculo == "DV") {
      return (
        <Table.Cell {...props}>

          <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial', fontWeight:600,}}>{props.row.des_TipoServicoView}</span>
  
        </Table.Cell>
      );
    }

    if (column.name === 'excluir') {
      return (
        <Table.Cell onClick={(e) => handleRemoveService(props)} {...props}>
          <FiTrash title="Clique para editar" />

        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Servico') {
      return (
        <Table.Cell {...props}>

          {props.row.tpo_Calculo != "DP" && props.row.tpo_Calculo != "DV" && (
            <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Servico)}</span>
          )}

          {props.row.tpo_Calculo == "DP" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Servico)}</span>
          )}

          {props.row.tpo_Calculo == "DV" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Servico)}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'pct_Desconto') {
      return (
        <Table.Cell {...props}>

          {props.row.tpo_Calculo != "DP" && props.row.tpo_Calculo != "DV" && (
            <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{Number(props.row.pct_Desconto).toFixed(2)}</span>
          )}

          {props.row.tpo_Calculo == "DP" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{Number(props.row.pct_Desconto).toFixed(2)}</span>
          )}

          {props.row.tpo_Calculo == "DV" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{Number(props.row.pct_Desconto).toFixed(2)}</span>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'vlr_Liquido') {
      return (
        <Table.Cell {...props}>

          {props.row.tpo_Calculo != "DP" && props.row.tpo_Calculo != "DV" && (
            <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Liquido)}</span>
          )}

          {props.row.tpo_Calculo == "DP" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Liquido)}</span>
          )}

          {props.row.tpo_Calculo == "DV" && (
            <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>{FormatCurrency.format(props.row.vlr_Liquido)}</span>
          )}

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  const saveBillingContract = useCallback(async() => {
    try {

      if (Number(qtd_Recorrencia) < 1){

        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo 'A cada' não pode ser inferior a 1."
        })
        return
      }

      if(Number(qtd_DiasFaturamento) < 1){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo 'Dias para faturar' não pode ser inferior a 1."
        })
        return
      }

      if(peopleId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo tipo de pessoa deve ser preenchido."
        })
        return
      }

      if(financialStatusId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo status deve ser preenchido."
        })
        return
      }

      if(paymentFormType == "B" && paymentSlipContractId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Ao selecionar uma forma de pagamento do tipo 'Boleto', tambem é necessario escolher um item na Carteira de Cobrança."
        })
        return
      }

      if(Number(qtd_DiasFaturamentoFiscal) < 1){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "O campo 'Dias Fat. Fiscal' não pode ser inferior a 1."
        })
        return
      }

      setIsSaving(true)

      if (numSequencial == "Novo"){
        await GetNextSequence()
        setAddSequencial(true)
        return
      }

      let emailList = '';
        emailFaturamentoList.map((email) => {
          return emailList += `${email},`;
        })
      
      const response = await api.post('/Financeiro/Contratos/Salvar', {
        cod_ContratoFinanceiro: billingContractId,
        num_Sequencia: numSequencial,
        cod_Pessoa: peopleId,
        nom_Pessoa: peopleValue,
        cod_CarteiraCobranca: paymentSlipContractId,
        des_CarteiraCobranca: paymentSlipContractValue,
        cod_CentroCusto: costCenterId,
        des_CentroCusto: costCenterValue,
        cod_FormaPagamento: paymentFormId,
        tpo_FormaPagamento: paymentFormType,
        cod_StatusFinanceiro: financialStatusId,
        tpo_StatusFinanceiro: financialStatusType,
        qtd_Recorrencia,
        tpo_Recorrencia,
        qtd_Parcela: paymentParcelas,
        qtd_DiasFaturamento,
        des_EmailFaturamento: emailList,
        des_Objeto: objectDescription,
        dta_Encerramento: dtaEnd,
        dta_Inicio: dtaStart,
        dta_PrimeiroVencimento: dtaVencimento,
        tpo_ClassePessoa: peopleType,
        tpo_Contrato: contractType,
        tpo_Pagamento: paymentType,
        flg_FaturaEmail,
        tpo_Parcelamento,
        tpo_FluxoFaturamentoFiscal, // "I" == Indefinido, "P" == Posterior, "A" == Antecipado
        qtd_DiasFaturamentoFiscal,
        billingContractServiceDTOList: billingContractServiceGridList,
        token
      })
 
      addToast({
        type: "success",
        title: "Contrato Salvo",
        description: "O contrato foi salvo no sistema."
      })

      history.push(`/financeiro/billingcontract/edit/${response.data}`)
      setIsSaving(false)
      setAddSequencial(false)
      
    } catch (err: any) {
      setIsSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar contrato.",
        description:  err.response.data.Message
      })
    }
  },[peopleId, tpo_FluxoFaturamentoFiscal, qtd_DiasFaturamentoFiscal, addSequencial, peopleValue, paymentSlipContractId, paymentSlipContractValue, costCenterId, costCenterValue, paymentFormId, paymentFormType, financialStatusId, financialStatusType, qtd_Recorrencia, tpo_Recorrencia, paymentParcelas, qtd_DiasFaturamento, email, objectDescription, dtaEnd, dtaStart, dtaVencimento, peopleType, contractType, paymentType, tpo_Parcelamento, flg_FaturaEmail, numSequencial, billingContractServiceGridList, emailFaturamentoList]);
    

  const SelectBillingContract = useCallback(async() => {
    const billingContractId = pathname.substr(33)
    setIsLoading(true)

    const response = await api.get<IBillingContractData>('/Financeiro/Contratos/Editar', {
      params:{
        billingContractId,
        token
      }
    })

    setPeopleType(response.data.tpo_ClassePessoa)
    setPeopleId(response.data.cod_Pessoa)
    setPeopleTerm(response.data.nom_Pessoa)
    setPeopleValue(response.data.nom_Pessoa)
    setNumSequencial(response.data.num_Sequencia)
    setFinancialStatusId(response.data.cod_StatusFinanceiro)
    setFinancialStatusValue(response.data.des_StatusFinanceiro)
    setFinancialStatusTerm(response.data.des_StatusFinanceiro)
    setContractType(response.data.tpo_Contrato)

    if(response.data.dta_Inicio != null){
      setDtaStart(FormatDate(new Date(response.data.dta_Inicio), 'yyyy-MM-dd'))
    }
    if(response.data.dta_Encerramento != null) {
      setDtaEnd(FormatDate(new Date(response.data.dta_Encerramento), 'yyyy-MM-dd'))
    }

    setObjectDescription(response.data.des_Objeto)
    setPaymentType(response.data.tpo_Pagamento)
    setQtdRecorrencia(response.data.qtd_Recorrencia)
    setTpo_Recorrencia(response.data.tpo_Recorrencia)
    setPaymentFormId(response.data.cod_FormaPagamento)
    setCostCenterId(response.data.cod_CentroCusto)
    setPaymentFormType(response.data.tpo_FormaPagamento)
    setPaymentSlipContractId(response.data.cod_CarteiraCobranca)
    setPaymentSlipContractValue(response.data.des_CarteiraCobranca)
    
    if(response.data.dta_PrimeiroVencimento != null){
      setDtaVencimento(FormatDate(new Date(response.data.dta_PrimeiroVencimento), 'yyyy-MM-dd'))
    }

    setQtd_DiasFaturamento(response.data.qtd_DiasFaturamento)
    setPaymentParcelas(response.data.qtd_Parcela.toString())
    setTpo_Parcelamento(response.data.tpo_Parcelamento)
    setFlg_FaturaEmail(response.data.flg_FaturaEmail)

    if(response.data.des_EmailFaturamentoPessoa != null){
      setEmailAccountPeoppleList(response.data.des_EmailFaturamentoPessoa.split(';'))
    }

    if(response.data.des_EmailFaturamento != null){
      setEmailFaturamentoList(response.data.des_EmailFaturamento.split(','))
    }
     
    setFinancialStatusType(response.data.tpo_StatusFinanceiro)
    setCod_Fatura(response.data.cod_Fatura)
    setNumSequenciaFatura(response.data.num_SequenciaFatura)
    setTpo_FluxoFaturamentoFiscal(response.data.tpo_FluxoFaturamentoFiscal) // "I" == indefinido, "P" == Posterior, "A" == Antecipado
    setQtd_DiasFaturamentoFiscal(response.data.qtd_DiasFaturamentoFiscal)
    setIsLoading(false)

  },[peopleType, qtd_DiasFaturamentoFiscal, tpo_FluxoFaturamentoFiscal, numSequenciaFatura, cod_Fatura, peopleId, peopleValue, peopleTerm, numSequencial, financialStatusId, financialStatusTerm, financialStatusValue, contractType, dtaStart, dtaEnd, objectDescription, paymentType, qtd_Recorrencia, tpo_Recorrencia, paymentFormId, costCenterId, paymentFormType, paymentSlipContractId, dtaVencimento, qtd_DiasFaturamento, paymentParcelas, tpo_Parcelamento, flg_FaturaEmail, emailAccountPeopleList, emailFaturamentoList, financialStatusType, billingContractId]);

  const GetNextSequence = useCallback(async() => {

    const response = await api.get<IBillingContractData>('/Financeiro/Contratos/ObterProximoNumeroSequencia', {
      params:{
        token
      }
    })

    setNumSequencial(response.data.num_Sequencia)
  
  },[numSequencial]);


  const deleteBillingContract = async() => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)
      
      await api.delete('/Financeiro/Contratos/Deletar', {
        params:{
        billingContractId,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Contrato excluído",
        description: "O contrato foi excluído no sistema."
      })

      history.push(`/financeiro/billingcontract/list`)
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)
      console.log(err)
      addToast({
        type: "error",
        title: "Falha ao excluir contrato.",
        description:  err.response.data.Message
      })
    }
  };

  const GenerateInvoicingByBillingContract = async() => {
   
    try {
      setIsLoading(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.post('/Financeiro/Contratos/Faturar', {
        contractId: billingContractId,
        categoryId,
        token

      })
      
      addToast({
        type: "success",
        title: "Faturamento",
        description: "A fatura foi adicionada no sistema."
      })

      handleCloseAndResetModalCategory()
      SelectBillingContract()
      setIsLoading(false)

    } catch (err: any) {
      setIsLoading(false)
      console.log(err)
      addToast({
        type: "error",
        title: "Falha ao faturar.",
        description:  err.response.data.Message
      })
    }
  };

  const LoadPeople = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? peopleValue:peopleTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPeopleData[]>('/Pessoas/ListarPorTipo', {
        params:{
          filterClause: filter,
          peopleType,
          token
        }    
      });

      const listPeople: ISelectData[] = []

      response.data.map(item => {
        return listPeople.push({
          id: item.id,
          label: item.value
        })
      })

      setPeople(listPeople)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const LoadFinancialStatus = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? financialStatusValue:financialStatusTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IFinancialStatusData[]>('/StatusFinanceiro/Listar', {
        params:{rows: 20, filterClause: filter, token}
      });

      const listFinancialStatus: ISelectData[] = []

      response.data.map(item => { 
        return listFinancialStatus.push({
          id: item.financialStatusId,
          label: item.financialStatusDescription
        })
      })

      setFinancialStatus(listFinancialStatus)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadServiceType = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? serviceTypeValue:serviceTypeTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IServiceTypeData[]>('/TipoServico/Listar', {
          params:{rows: 20, filterClause: filter, token}
      });

      const listServiceType: IServiceTypeSelectData[] = []

      response.data.map(item => {
        if(item.calculationType != "RP"){
          return listServiceType.push({
            id: item.serviceTypeId,
            label: item.serviceTypeDescription,
            calculationType: item.calculationType,
            flgMultipleUnit: item.flgMultipleUnit,
            standardValue: item.standardValue,
            flgExpire: item.flgExpire,
          })
        }    
      })

      setServiceType(listServiceType)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadBillingContractGridList = async () => {
    try {
      
      const response = await api.get<IBillingContractServiceData[]>('/Financeiro/Contratos/ListarServicosGrid', {
        params:{
        billingContractId,
        token,
        }
      });

      setBillingContractServiceGridList(response.data)
      setIsLoading(false)
      setGridValueUpdate(true)
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (gridValueUpdate == true){

      let totalContract = 0;
      let totalDiscount = 0;
  
      billingContractServiceGridList.map( (item) => {

        const dtaExpiration = new Date(item.dta_Expiracao)
        const dateNow = new Date(Date.now())

        if (item.dta_Expiracao == "" || item.dta_Expiracao == null || (item.dta_Expiracao != "" && dtaExpiration > dateNow )) {
  
          if (item.tpo_Calculo == "RV") {
              totalContract += Number(item.vlr_Liquido);
          }
          else if (item.tpo_Calculo == "DV") {
              totalContract -= Number(item.vlr_Liquido);
          }
          else if (item.tpo_Calculo == "DP") {
              totalDiscount += Number(item.vlr_Servico);
          }
      }
      })
  
      setTotalValueGrid(FormatCurrency.format(totalContract - (totalContract * totalDiscount / 100)))
      setGridValueUpdate(false)
          
    } 

  },[gridValueUpdate, billingContractServiceGridList])


  const handleNewDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const description = event.target.value;

      setObjectDescription(description);
    },
    [],
  ); // salva o valor da descrição


  const LoadPaymentForm = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? paymentFormValue:paymentFormTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPaymentFormData[]>('/FormaDePagamento/ListarPorFiltro', {
          params:{filterClause: filter, token}
      });

      const listPaymentForm: IPaymentFormSelectData[] = []

      response.data.map(item => {
        return listPaymentForm.push({
          id: item.paymentFormId,
          label: item.paymentFormDescription,
          paymentFormType: item.paymentFormType
        })
      })

      setPaymentForm(listPaymentForm)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadCostCenter = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? costCenterValue:costCenterTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ICostCenterData[]>('/CentroDeCusto/Listar', {
          params:{
          page: 0,
          rows: 20,
          filterClause: filter,
          token
          }
      });

      const listCostCenter: ISelectData[] = []

      response.data.map(item => {
        return listCostCenter.push({
          id: item.id,
          label: item.label,
        })
      })

      setCostCenter(listCostCenter)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadPaymentSlipContract = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? paymentSlipContractValue:paymentSlipContractTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPaymentSlipContractData[]>('/CarteiraDeCobrança/Listar', {
          params:{page: 0, rows: 20, filterClause: filter, token}
      });

      const listPaymentSlipContract: ISelectData[] = []

      response.data.map(item => {
        return listPaymentSlipContract.push({
          id: item.paymentSlipContractId,
          label: item.paymentSlipContractDescription,
        })
      })

      setPaymentSlipContract(listPaymentSlipContract)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  const LoadCategory = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? categoryValue:categoryTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ICategoryData[]>('/Categoria/ListarPorDescrição', {
        params:{
          rows: 20,
          filterClause: filter,
          token
        }    
      });

      const listCategory: ISelectData[] = []

      response.data.map(item => {
        return listCategory.push({
          id: item.id,
          label: item.label
        })
      })

      setCategory(listCategory)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const GetDefaultFinancialStatus = useCallback(async() => {

    const response = await api.get<IFinancialStatusData>('/StatusFinanceiro/ObterStatusPadrao', {
      params:{
      token
      }
    })

    setFinancialStatusId(response.data.financialStatusId)
    setFinancialStatusValue(response.data.financialStatusDescription)
    setFinancialStatusTerm(response.data.financialStatusDescription)
    setFinancialStatusType(response.data.financialStatusType)


  },[financialStatusId, financialStatusValue, financialStatusTerm, financialStatusType]);


  const handleChangeParcelas = (id: string) => {
    setPaymentParcelas(id)
  }

  const handlePeopleSelected = (item) => { 
    
    if (item){
      setPeopleId(item.id)
      setPeopleValue(item.label)
    }else{
      setPeopleId('')
      LoadPeople('reset')
      setPeopleValue('')
    }
  }

  const handleServiceTypeSelected = (item) => { 
    
    if (item){
      handleResetServicesStates()
      setServiceTypeValue(item.label)
      setServiceTypeId(item.id)
      setCalculationType(item.calculationType)
      setFlgMultipleUnit(item.flgMultipleUnit)
      setServiceValue(item.standardValue)
      
      setFlgExpiration(item.flgExpire)
    }else{
      setServiceTypeValue('')
      LoadServiceType('reset')
      setServiceTypeId('')
      setCalculationType("")
      setFlgMultipleUnit("")
    }
  }

  const handleFinancialStatusSelected = (item) => { 
    
    if (item){
      setFinancialStatusValue(item.label)
      setFinancialStatusId(item.id)
      setFinancialStatusType(item.financialStatusType)
    }else{
      setFinancialStatusValue('')
      setFinancialStatusType("")
      LoadFinancialStatus('reset')
      setFinancialStatusId('')
    }
  }

  const handlePaymentFormSelected = (item) => { 
    
    if (item){
      setPaymentFormValue(item.label)
      setPaymentFormId(item.id)
      setPaymentFormType(item.paymentFormType)
    }else{
      setPaymentFormValue('')
      LoadPaymentForm('reset')
      setPaymentFormId('')
      setPaymentFormType("")
    }
  }

  const handleCostCenterSelected = (item) => { 
    
    if (item){
      setCostCenterValue(item.label)
      setCostCenterId(item.id)
    }else{
      setCostCenterValue('')
      LoadCostCenter('reset')
      setCostCenterId('')
    }
  }

  const handlePaymentSlipContractSelected = (item) => { 
    
    if (item){
      setPaymentSlipContractValue(item.label)
      setPaymentSlipContractId(item.id)
    }else{
      setPaymentSlipContractValue('')
      LoadPaymentSlipContract('reset')
      setPaymentSlipContractId("")
    }
  }

  const handleCategorySelected = (item) => { 
    
    if (item){
      setCategoryValue(item.label)
      setCategoryId(item.id)
    }else{
      setCategoryValue('')
      LoadCategory('reset')
      setCategoryId('')
    }
  }

  const handleClickInvoicing = () => { 

    if (dtaVencimento == "" || dtaVencimento == null){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "O campo primeiro vencimento deve ser preenchido."
      })

      return
    }

    if (billingContractServiceGridList.length == 0){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "Adicione ao menos um serviço para a cobrança desta fatura."
      })
      
      return
    }

    setModalConfirmInvoicing(true)
  }

  const handleRemoveItemEmail = (faturamentoEmail) => {
    const faturamentoEmailListUpdate = emailFaturamentoList.filter(item => item != faturamentoEmail);
    setEmailFaturamentoList(faturamentoEmailListUpdate)

  }

  function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleListItemEmail = (event) => { 
    
    if (event.charCode == 13){

      if (validateEmail(event.target.value) == false){

        addToast({
          type: "info",
          title: "Faturamento - Contrato",
          description: "Endereço de e-mail inválido."
        })
  
        return;
      }
  
       const existItem = emailFaturamentoList.filter(item => item === event.target.value);
  
       if (existItem.length > 0){
        return;
    }
    
      if(event.target.value == ""){
        return
      }
  
       emailFaturamentoList.push(event.target.value)
       setEmail("")
     
    }
  }


  const addService = useCallback(() => {

    if(flgExpiration == "S" && dtaExpiration == ""){
      addToast({
        type: "info",
        title: "Faturamento - Contrato",
        description: "Preencha o campo 'Válido até' com uma data."
      })

      return;
    }

    if(serviceQtd < "1"){
      addToast({
        type: "info",
        title: "Faturamento - Contrato",
        description: "A quantidade de serviços não pode ser menor que 1."
      })

      return;
    }
    const idItem = billingContractServiceId;
    const itemValue = Number(serviceValue).toFixed(2);
    const itemQtty = Number(serviceQtd);
    const itemDiscount = Number(serviceDescount).toFixed(2);
    const itemExpirationDate = dtaExpiration;
    const itemNetValue = Number(itemValue) - (Number(itemValue) * (Number(itemDiscount) / 100));
    const itemTotalValue = (itemNetValue * itemQtty)
    let serviceDesc = serviceTypeValue;
    if (serviceQtd != "1"){
      serviceDesc += ` - Quantidade: ${itemQtty}`;
    }
    if (itemExpirationDate != null && itemExpirationDate != "" && itemExpirationDate != "null"){
      serviceDesc += ` - Expira em: ${itemExpirationDate.split('-').reverse().join('/')}`;
    }

    
    // add new Service
    if(idItem == ""){
      const serviceObject = {
        cod_ContratoFinanceiroServico: (`N,${new Date().getTime().toString()}`),
        cod_TipoServico: serviceTypeId,
        cod_ContratoFinanceiro: billingContractId,
        des_TipoServico: serviceTypeValue,
        des_TipoServicoView: serviceDesc,
        qtd_Servico: String(serviceQtd),
        pct_Desconto: String(serviceDescount),
        vlr_Liquido: String(itemTotalValue),
        vlr_Servico: String(itemValue),
        dta_Expiracao: String(itemExpirationDate),
        tpo_Calculo: calculationType,
        des_Observacao: serviceDescription,
        flg_Expira: flgExpiration,
        flgMultipleUnit,

    }
      setBillingContractServiceGridList(previousValues => [...previousValues, serviceObject])
    }

    // update record
    else{

      const newList = billingContractServiceGridList.map(item => 
        item.cod_ContratoFinanceiroServico == idItem
        ?
        {
            ...item,
            cod_TipoServico: serviceTypeId,
            des_TipoServico: serviceTypeValue,
            des_TipoServicoView: serviceDesc,
            qtd_Servico: String(serviceQtd),
            pct_Desconto: String(itemDiscount),
            vlr_Liquido: String(itemTotalValue),
            vlr_Servico: String(itemValue),
            dta_Expiracao: String(itemExpirationDate),
            tpo_Calculo: calculationType,
            des_Observacao: serviceDescription,
            flg_Expira: flgExpiration,
            flgMultipleUnit,
        }
        :item      
      );
  
      setBillingContractServiceGridList(newList)
    }

    handleResetServicesStates()
    setGridValueUpdate(true)

  }, 
  [serviceTypeId, serviceTypeValue, serviceTypeValue, serviceQtd, serviceDescount, serviceValue, dtaExpiration, calculationType, serviceDescription, billingContractServiceGridList, flgExpiration, flgMultipleUnit, billingContractServiceId],
);

const handleRemoveService = (service) => {
  const billingConctractListUpdate = billingContractServiceGridList.filter(item => item.cod_ContratoFinanceiroServico != service.row.cod_ContratoFinanceiroServico);
  setBillingContractServiceGridList(billingConctractListUpdate)
  setGridValueUpdate(true)
}

const handleEditService = (service) => {
  setBillingContractServiceId(service.row.cod_ContratoFinanceiroServico)
  setServiceTypeId(service.row.cod_TipoServico)
  setServiceDescription(service.row.des_Observacao)
  setServiceTypeValue(service.row.des_TipoServico)

  if(String(service.row.cod_ContratoFinanceiroServico).includes('N')){
    setDtaExpiration(service.row.dta_Expiracao)
  }
  else{
    setDtaExpiration(String(service.row.dta_Expiracao).substring(0,10))
  }
  setServiceDescount(service.row.pct_Desconto)
  setServiceQtd(service.row.qtd_Servico)
  setCalculationType(service.row.tpo_Calculo)
  setServiceValue(service.row.vlr_Servico)
  setFlgExpiration(service.row.flg_Expira)
  setFlgMultipleUnit(service.row.flgMultipleUnit)
}

const handleResetServicesStates = () => {
  setServiceValue("0")
  setServiceQtd("1")
  setServiceDescount("0")
  setDtaExpiration("")
  setCalculationType("")
  setServiceDescription("")
  setServiceTypeId("")
  setServiceTypeValue("")
  setFlgMultipleUnit("")
  setFlgExpiration("")
  setBillingContractServiceId("")  
}

const handleCloseAndResetModalCategory = () => {
 setCategoryId("")
 setCategoryValue("")
 setShowModalCategory(false)
}

const handleServiceValue = (event, value) => {
  event.preventDefault();
  setServiceValue(value)
}

const handleDescountValue = (event, value) => {
  event.preventDefault();
  setServiceDescount(value)
}

const CloseBillingContractDocumentModal = () => {
  setShowBillingContractDocumentModal(false)
}

const handleClickDocument = () => {
  saveBillingContract()
  setShowBillingContractDocumentModal(true)
  localStorage.setItem('@GoJur:documentLocation', 'billingContractEdit');
}

  return (

    <Container>

      {(showBillingContractDocumentModal) && <Overlay /> }
      {(showBillingContractDocumentModal) && <BillingContractDocumentModal callbackFunction={{billingContractId, CloseBillingContractDocumentModal}} /> }

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
    )}

      {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Excluindo...
          </div>
        </>
      )}

      {modalDeleting && (
        <ConfirmBoxModal
          useCheckBoxConfirm
          title="Aviso Exclusão do Contrato"
          caller="confirmDeleting"
          message="Deseja realmente excluir este contrato financeiro ?.Clique em Confirmar para seguir com a exclusão ou Cancelar para fechar a janela."
        />
      )}

      {modalConfirmInvoicing && (
        <ConfirmBoxModal
          title="Faturamento Contrato"
          caller="confirmInvoicing"
          message="Confirma a geração da fatura para este contrato ?."
        />
      )}

      

      <div style={{marginLeft:"-2%"}}>
        <HeaderPage />
      </div>

      <Content>
        {(showModalCategory) && <Overlay /> }
        {showModalCategory && (
          <ModalCategory show>

            <div id='Header' style={{height:'30px'}}>

              <div className='menuTitle'>
                Categoria
              </div>
          
            </div>

            <div style={{fontSize:"12px", margin:"15px"}}>
              Os campos categoria e conta bancária são necessários para a geração de um faturamento. Escolha um padrão em ambos os casos para que o GOJUR torne o processo automático da próxima vez.
            </div>

            <div>

              <div className='selectCategory'>
                <AutoCompleteSelect>
                  <p>Categoria</p> 
                  <Select
                    isSearchable
                    value={category.filter(options => options.id == categoryId)}
                    onChange={handleCategorySelected}
                    onInputChange={(term) => setCategoryTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={category}
                  />
                </AutoCompleteSelect>
              </div>
            </div>
            
            <br />
            <br />

            <div id='Buttons' style={{float:'right', marginRight:'5%', height:'60px'}}>
              <div style={{float:'left'}}>
                <button
                  className="buttonClick"
                  type='button'
                  onClick={()=> GenerateInvoicingByBillingContract()}
                  style={{width:'100px'}}
                >
                  <FaFileInvoiceDollar />
                  Faturar
                </button>
              </div>

              <div style={{float:'left', width:'100px'}}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={handleCloseAndResetModalCategory}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Cancelar
                </button>
              </div>
            </div>

          </ModalCategory>
        )}

        <header>

          <div style={{display:"flex"}}>

            <div>      
              <button
                type='button'
                onClick={console.log}
              >
                <div className='Active' style={{display:"flex"}}>
                  <FaFileContract style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Contratos</p> 
                </div>
                
                
              </button>

            </div>
            
            <div style={{marginLeft:"1%"}}>
              
              <button
                type='button'
                onClick={() => history.push(`/financeiro/billinginvoice/list`)}  
              >  

                <div className='Desactive' style={{display:"flex"}}>
                  <FaFileInvoiceDollar style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Faturamento</p> 
                </div> 

                
              </button>
            </div>
            
          </div>
          

        </header>

        <Form>

          <section>

            <div style={{display:"flex"}}>
              
              <h3 style={{fontFamily:"montserrat"}}>Contrato Financeiro</h3>

              {cod_Fatura != "0" && (
                <>
                  <span className='invoicing'>
                    Este contrato gerou automaticamente a Fatura nº 
                    {" "}
                    {numSequenciaFatura}
                  </span>

                  <FiHelpCircle className='infoMessage' title="Este contrato gerou uma fatura automaticamente. Qualquer alteração pode causar divergências entre os dois registros." />
                  <BiSearchAlt className='infoMessage' title="Vizualizar Fatura." onClick={() => history.push(`/financeiro/billinginvoice/edit/${cod_Fatura}`)} />
                </>
              )}

            </div>
            

            <div>
              <div style={{display:"flex", marginTop:"1%"}}>
                <div className='selectPeople'>
                  <label htmlFor="type">   
                    <p>Tipo Pessoa</p> 
                    <select
                      name="peopleType"
                      value={peopleType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeopleType(e.target.value)}
                    >
                      <option value="C">Cliente</option>
                      <option value="A">Advogado</option>
                      <option value="T">Terceiro</option>
                      <option value="F">Funcionário</option>
                    </select>
                  </label>
                </div>

                
                <div className='selectPeople' style={{marginLeft:"1%"}}>
                  <AutoCompleteSelect>
                    {peopleType == "C" && (
                    <p>Cliente</p>
                    )}
                    {peopleType == "F" && (
                    <p>Funcionário</p>
                    )}
                    {peopleType == "T" && (
                    <p>Terceiro</p>
                    )}
                    {peopleType == "A" && (
                    <p>Advogado</p>
                    )}
                    <Select
                      isSearchable
                      value={people.filter(options => options.id == peopleId)}
                      onChange={handlePeopleSelected}
                      onInputChange={(term) => setPeopleTerm(term)}
                      isClearable
                      placeholder=""
                      isLoading={isLoadingComboData}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      styles={selectStyles}
                      options={people}
                    />
                  </AutoCompleteSelect>
                </div>
                

                <div className='numSequencial'>
                  <label htmlFor="descricao">
                    <p>Nº Contrato</p>
                    <input
                      placeholder='Novo'
                      maxLength={50}
                      type="text"
                      name="descricao"
                      value={numSequencial}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNumSequencial(e.target.value)}
                      autoComplete="off"
                      disabled
                    />
                  </label>
                </div>
          
              </div>


              <div style={{display:"flex",marginTop:"1%"}}>

                <div className='selectDta'>
                  <label htmlFor="data">
                    <p>Início</p> 
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaStart(e.target.value)}
                    />
                  </label>
                </div>

                <div className='selectDta' style={{marginLeft:"1%"}}>
                  <label htmlFor="data">
                    <p>Encerramento</p> 
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEnd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEnd(e.target.value)}
                    />
                  </label>
                </div>

              
                <div className='selectPeople' style={{marginLeft:"1%"}}> 
                  <AutoCompleteSelect>
                    <p>Status</p> 
                    <Select
                      isSearchable
                      value={financialStatus.filter(options => options.id == financialStatusId)}
                      onChange={handleFinancialStatusSelected}
                      onInputChange={(term) => setFinancialStatusTerm(term)}
                      isClearable
                      placeholder=""
                      isLoading={isLoadingComboData}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      styles={selectStyles}
                      options={financialStatus}
                    />
                  </AutoCompleteSelect>
                </div>

                <div className='contractType'>
                  <label htmlFor="type">   
                    <p>Tipo Contrato</p> 
                    <select
                      name="peopleType"
                      value={contractType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setContractType(e.target.value)}
                    >
                      <option value="A">Por Ato</option>
                      <option value="H">Por Hora</option>
                      <option value="P">Partido</option>
                      <option value="E">Êxito</option>
                    </select>
                  </label>
                </div>
                
              </div>
       
            </div>
            
            <div className='border'>&nbsp;</div>

            <h3 style={{fontFamily:"montserrat"}}>Serviços</h3>

            <div style={{display:"flex", marginTop:"1%"}}>
              <div className='selectDescription'>
                <AutoCompleteSelect>
                  <p>Descrição</p> 
                  <Select
                    isSearchable
                    value={serviceType.filter(options => options.id == serviceTypeId)}
                    onChange={handleServiceTypeSelected}
                    onInputChange={(term) => setServiceTypeTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={serviceType}
                  />
                </AutoCompleteSelect>
              </div>

              {calculationType != "" && (
                <div className='serviceValue'>
                  <label htmlFor="descricao">

                    {calculationType == "RV" && (
                      <p>Valor R$:</p>
                    )}

                    {calculationType == "DV" && (
                      <p>Valor R$:</p>
                    )}

                    {calculationType == "DP" && (
                      <p>Valor %:</p>
                    )}

                    {calculationType == "RP" && (
                      <p>Valor %:</p>
                    )}
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      name="descricao"
                      value={serviceValue}
                      onChange={handleServiceValue}
                    />
                  </label>
                </div>
              )}

              {flgMultipleUnit == "S" && (
                <div className='serviceQtd'>
                  <label htmlFor="descricao">
                    <p>Quantidade:</p>
                    <input
                      required
                      maxLength={50}
                      type="number"
                      name="descricao"
                      value={serviceQtd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceQtd(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                </div>
              )}

              {calculationType == "RV" && (
                <div className='serviceDescount'>
                  <label htmlFor="descricao">
                    <p>Desconto %:</p>
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      name="descricao"
                      value={serviceDescount}
                      onChange={handleDescountValue}
                    />
                  </label>
                </div>
              )}

              {flgExpiration == "S" && (
                <div className='selectDtaExpires'>
                  <label htmlFor="data">
                    <p>Válido até:</p> 
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaExpiration}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaExpiration(e.target.value)}
                    />
                  </label>

                </div>
              )}
              
            </div>

            {calculationType != "" && (
            <>
              <div style={{display:"flex"}}>
                <div className='serviceDescription'>
                  <label htmlFor="descricao">
                    <p>Observação:</p>
                    <input
                      maxLength={100}
                      type="text"
                      name="descricao"
                      value={serviceDescription}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceDescription(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <div className='divAddButon'>

                  <div style={{float:'left'}}>
                    <button 
                      className="buttonClick"
                      type='button'
                      onClick={()=> addService()}
                      style={{width:'80px'}}
                    >
                      <CgAdd />
                      {billingContractServiceId == "" && (
                        <span>Adicionar</span>
                      )}

                      {billingContractServiceId != "" && (
                        <span>Atualizar</span> 
                      )}
                    </button>
                  </div>

                  {billingContractServiceId != "" && (
                    <div style={{float:'right'}}>
                      <button 
                        className="buttonClick"
                        type='button'
                        onClick={()=> handleResetServicesStates()}
                        style={{width:'80px'}}
                      >
                        <FaRegTimesCircle />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}

                </div>
                
              </div>
            </>
            )}

            <div>
              <GridSubContainer>
                <Grid
                  rows={billingContractServiceGridList}
                  columns={columnsServiceType}
                >
                  <PagingState
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onCurrentPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                  <CustomPaging totalCount={totalRowsServiceTypeList} />
                  <Table
                    cellComponent={CustomCellUserList}
                    columnExtensions={tableColumnExtensionsServiceType}
                    messages={isLoading? languageGridLoading: languageGridEmpty}
                  />
                  <TableHeaderRow />
                </Grid>
              </GridSubContainer>

              <div style={{marginTop:"1%"}}>
                
                <b style={{fontFamily:"Montserrat"}}>
                  Valor Total Serviço - &nbsp;
                  {totalValueGrid}
                </b>
    
              </div>
              
            </div>

            <div className='border'>&nbsp;</div>

            <div>
              <p>Objeto:</p>
              <textarea
                name=""
                value={objectDescription}
                onChange={handleNewDescription}
              />
            </div>
            
            <div className='border'>&nbsp;</div>

            <h3 style={{fontFamily:"montserrat"}}>Pagamento</h3>

            <div style={{display:"flex", marginTop:"1%"}}>
              <div className='paymentType'>
                <label htmlFor="type">   
                  <p>Tipo Pagamento</p>
                  <select
                    name="paymentType"
                    value={paymentType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPaymentType(e.target.value)}
                  >
                    <option value="U">Único</option>
                    <option value="P">Parcelado</option>
                    <option value="R">Recorrente</option>
                  </select>
                </label>
              </div>

              {paymentType == "P" && (
                <>
                  <div className='qtdRecorrencia'>
                    <label htmlFor="parcela">
                      Parcelas
                      <Select
                        autoComplete="off"
                        styles={selectStyles}
                        value={parcelas.filter(options => options.id === paymentParcelas)}
                        onChange={(item) => handleChangeParcelas(item? item.id: '')}
                        options={parcelas}
                      />
                    </label>
                  </div>

                  <div className='recorrenciaType'>
                    <label htmlFor="type">   
                      <p>&nbsp;</p>
                      <select
                        name="tpoParcelamento"
                        value={tpo_Parcelamento}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTpo_Parcelamento(e.target.value)}
                      >
                        <option value="M">Mensal</option>
                        <option value="A">Anual</option>
                        <option value="S">Semanal</option>
                        <option value="Q">Quinzenal</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {paymentType == "R" && (
                <>
                  <div className='qtdRecorrencia'>
                    <label htmlFor="descricao">
                      <p>A cada</p>
                      <input
                        type="number"
                        name="descricao"
                        value={qtd_Recorrencia}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setQtdRecorrencia(e.target.value)}
                        autoComplete="off"
                      />
                    </label>
                  </div>

                  <div className='recorrenciaType'>
                    <label htmlFor="type">   
                      <p>&nbsp;</p>
                      <select
                        name="tpoRecorrencia"
                        value={tpo_Recorrencia}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTpo_Recorrencia(e.target.value)}
                      >
                        <option value="M">Mês(es)</option>
                        <option value="A">Ano(s)</option>
                        <option value="S">Semana(s)</option>
                        <option value="Q">Quinzena(s)</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              <div className='selectDtaVencimento'>
                <label htmlFor="data">
                  <p>1º Vencimento</p> 
                  <input 
                    style={{backgroundColor:"white"}}
                    type="date"
                    value={dtaVencimento}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaVencimento(e.target.value)}
                  />
                </label>

              </div>
        
            </div>

            <div style={{display:"flex", marginTop:"1.5%"}}>
              
              <div className='selectCostCenter'>
                <AutoCompleteSelect>
                  <p>Centro de Custo</p> 
                  <Select
                    isSearchable
                    value={costCenter.filter(options => options.id == costCenterId)}
                    onChange={handleCostCenterSelected}
                    onInputChange={(term) => setCostCenterTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={costCenter}
                  />
                </AutoCompleteSelect>
              </div>

              <div className='selectPaymentForm'>
                <AutoCompleteSelect>
                  <p>Forma Pagamento</p> 
                  <Select
                    isSearchable
                    value={paymentForm.filter(options => options.id == paymentFormId)}
                    onChange={handlePaymentFormSelected}
                    onInputChange={(term) => setPaymentFormTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={paymentForm}
                  />
                </AutoCompleteSelect>
              </div>

              {paymentFormType == "B" && (
                <div className='selectPaymentSlip'>
                  <AutoCompleteSelect>
                    <p>Carteira Cobrança</p> 
                    <Select
                      isSearchable
                      value={paymentSlipContract.filter(options => options.id == paymentSlipContractId)}
                      onChange={handlePaymentSlipContractSelected}
                      onInputChange={(term) => setPaymentSlipContractTerm(term)}
                      isClearable
                      placeholder=""
                      isLoading={isLoadingComboData}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      styles={selectStyles}
                      options={paymentSlipContract}
                    />
                  </AutoCompleteSelect>
                </div>
              )}

            </div>

            <div className='border'>&nbsp;</div>

            <h3 style={{fontFamily:"montserrat"}}>Faturamento (regras p/ faturamento automático)</h3>

            <div style={{display:'flex', marginTop: "2%"}}>

              <div style={{width:"30%"}}>
                <label htmlFor="data"> 
                  <p>Dias p/ Faturar:</p>
                  <input 
                    style={{backgroundColor:"white"}}
                    type="number"
                    value={qtd_DiasFaturamento}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQtd_DiasFaturamento(e.target.value)}
                  />
                </label>
              </div>
              
              <FcAbout
                style={{marginTop:"22px", marginBottom:"auto", width:"20px", height:"20px", marginLeft:"5px"}}
                className='icons'
                title='dias de antecedência p/ faturamento.'
              />

              <div className='fluxoFicalType'>
                <label htmlFor="type">   
                  <p>Fluxo Fiscal</p>
                  <select
                    name="tpoRecorrencia"
                    value={tpo_FluxoFaturamentoFiscal}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setTpo_FluxoFaturamentoFiscal(e.target.value)}
                  >
                    <option selected value="I">Indefinido</option>
                    <option value="A">Antecipado</option>
                    <option value="P">Posterior</option>
                  </select>
                </label>
              </div>

              <div className='qtd_FaturamentoFiscal'>
                <p>Dias Faturamento Fiscal:</p>
                <label htmlFor="descricao">           
                  <input
                    type="number"
                    name="descricao"
                    value={qtd_DiasFaturamentoFiscal}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQtd_DiasFaturamentoFiscal(e.target.value)}
                    autoComplete="off"
                  />
                </label>
              </div>
            </div>

    
            <div className='divEmailInvoicing'>
              
              <span className='spanEmailInvoicing'>Fatura p/ Email:</span>

              <div className='flgDiv'>
                <input
                  type="checkbox"
                  name="select"
                  checked={flg_FaturaEmail}
                  onChange={() => setFlg_FaturaEmail(!flg_FaturaEmail)}
                />
              </div>

              {flg_FaturaEmail && (
                <>
                  <div className='flgInputEmail'>
                    <label htmlFor="e-mail">
                      <input 
                        placeholder='Digite o e-mail, pressione Enter para confirmar'
                        style={{backgroundColor:"white"}}
                        type="text"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        onKeyPress={(e) => handleListItemEmail(e)}
                      />
                    </label>             

                    <div>

                      <ItemList>
                        {emailAccountPeopleList.map(item => {
                          return (
                            <li style={{marginTop:"2%"}}>
                              {item}
                              &nbsp;(origem: cadastro pessoa)
                            </li>
                          )
                        })} 
                      </ItemList>

                      <ItemList>
                        {emailFaturamentoList.map(item => {
                          return (
                            <li style={{marginTop:"2%"}}>
                              {item}
                              <label style={{marginLeft:"3%"}} className="buttonLinkClick" onClick={() => handleRemoveItemEmail(item)}> 
                                Excluir
                              </label> 
                            </li>
                          )
                        })} 
                      </ItemList>

                    </div>

                  </div>
               
                </>
              )}

            </div>

  
            <div className='border'>&nbsp;</div>

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveBillingContract()}
                  style={{width:'90px'}}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>

              {billingContractId != "0" && (
                <>
                  <div style={{float:'left'}}>
                    <button 
                      className="buttonClick"
                      type='button'
                      onClick={handleClickInvoicing}
                      style={{width:'90px'}}
                    >
                      <FaFileInvoiceDollar />
                      Faturar 
                    </button>
                  </div>           

                  {billingContractServiceGridList.length > 0 && (
                    <div style={{float:'left'}}>
                      <button 
                        className="buttonClick"
                        type='button'
                        onClick={handleClickDocument}
                        style={{width:'150px'}}
                      >
                        <AiOutlinePrinter />
                        Emitir Contrato
                      </button>
                    </div> 
                  )}          
                    
                  <div style={{float:'left'}}>
                    <button 
                      type='button'
                      className="buttonClick"
                      onClick={() => setModalDeleting(true)}
                      style={{width:'90px'}}
                    >
                      <FiTrash />
                      Excluir
                    </button>
                  </div>
                </>
              )}
                           
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => history.push(`/financeiro/billingcontract/list`)}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </section>

        </Form>

      </Content>
      
        
    </Container>
    
  
  );
};

export default BillingContractEdit;
