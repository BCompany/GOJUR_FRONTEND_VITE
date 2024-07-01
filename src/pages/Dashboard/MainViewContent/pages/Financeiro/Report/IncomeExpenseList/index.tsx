/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import api from 'services/api';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { FaFileAlt } from 'react-icons/fa';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Loader from 'react-spinners/PulseLoader';
import { AutoCompleteSelect} from 'Shared/styles/GlobalStyle';
import { useHistory } from 'react-router-dom';
import Select from 'react-select'
import ReportModal from 'components/Modals/Report';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import { useForm } from 'react-hook-form';
import { Container, Content, Form, ItemList, TollBar } from './styles';

export interface IAutoCompleteData {
  id: string;
  label: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export interface IAccount {
  id: string;
  value: string;
  cod_Conta: string;
  des_Conta: string;
}

export interface IPeoplesData{
  cod_Pessoa: string;
  nom_Pessoa: string;
}

export interface IPaymentFormData{
  paymentFormId: string;
  paymentFormDescription: string;
}

export interface ICategoryData {
  id: string;
  label: string;
  flgHonorary: boolean;
}

export interface ICostCenterData {
  costCenterId: string;
  costCenterDescription: string;
  costCenterNumber: string;
}

const FinancialIncomeExpenseList: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const { handleUserPermission } = useDefaultSettings();
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const lastAccount = localStorage.getItem('@GoJur:financialAccount');
  const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);

  const [account, setAccount] = useState<IAutoCompleteData[]>([]);
  const [accountId, setAccountId] = useState('');
  const [accountTerm, setAccountTerm] = useState('');
  const [accountValue, setAccountValue] = useState('');

  const [category, setCategory] = useState<IAutoCompleteData[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [categoryReportList, setCategoryReportList] = useState<ISelectData[]>([]);

  const [costCenter, setCostCenter] = useState<IAutoCompleteData[]>([]);
  const [costCenterId, setCostCenterId] = useState('');
  const [costCenterTerm, setCostCenterTerm] = useState('');
  const [costCenterValue, setCostCenterValue] = useState('');
  const [costCenterReportList, setCostCenterReportList] = useState<ISelectData[]>([]);

  const [paymentForm, setPaymentForm] = useState<IAutoCompleteData[]>([]);
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [paymentFormValue, setPaymentFormValue] = useState('');

  const [people, setPeople] = useState<IAutoCompleteData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleTerm, setPeopleTerm] = useState('');
  const [peopleValue, setPeopleValue] = useState('');

  const [matter, setMatter] = useState<IAutoCompleteData[]>([]);
  const [matterId, setMatterId] = useState('');
  const [matterTerm, setMatterTerm] = useState('');
  const [matterValue, setMatterValue] = useState('');

  const [movimentType, setMovimentType] = useState<string>("all")
  const [movimentBy, setMovimentBy] = useState<string>("venc")
  const [period, setPeriod] = useState<string>("current")
  const [situation, setSituation] = useState<string>("both")
  const [layout, setLayout] = useState<string>("pdf")

  const [dtaCustomStart, setDtaCustomStart] = useState<string>("")
  const [dtaCustomEnd, setDtaCustomEnd] = useState<string>("")

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [showReportOpenFileModal, setShowReportOpenFileModal] = useState<boolean>(false)
  const [reportLink, setReportLink] = useState<string>('')


// When exists report id verify if is avaiable every 5 seconds
useEffect(() => {
  if (idReportGenerate > 0){
    const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 7000);
  }
}, [idReportGenerate])


useEffect(() => {
  LoadAccount()
  LoadPeople()
  LoadCategory()
  LoadDefaultAccount()
  LoadMatter()
  LoadCostCenter()
  LoadPaymentForm()
}, [])


useDelay(() => {
  if (accountTerm.length > 0){
    LoadAccount()
  }
}, [accountTerm], 750)


useDelay(() => {
  if (peopleTerm.length > 0){
    LoadPeople()
  }
}, [peopleTerm], 750)


useDelay(() => {
  if (categoryTerm.length > 0){
    LoadCategory()
  }
}, [categoryTerm], 750)


useDelay(() => {
  if (matterTerm.length > 0){
    LoadMatter()
  }
}, [matterTerm], 750)


useDelay(() => {
  if (costCenterTerm.length > 0){
    LoadCostCenter()
  }
}, [costCenterTerm], 750)


useDelay(() => {
  if (paymentFormTerm.length > 0){
    LoadPaymentForm()
  }
}, [paymentFormTerm], 750)


const [buttonText, setButtonText] = useState("Gerar Relatório");


  // Check is report is already 
const CheckReportPending = useCallback(async (checkInterval) => {
  if (isGeneratingReport){
    const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    })

    if (response.data == "F" && isGeneratingReport){
      clearInterval(checkInterval);
      setIsGeneratingReport(false)
      OpenReportAmazon()
    }

    if (response.data == "W")
    {
      clearInterval(checkInterval);
      setIsGeneratingReport(false)
      setIdReportGenerate(0)
      setButtonText("Gerar Relatório")

      addToast({type: "info", title: "Verificar filtros", description: "Não foram encontrados dados financeiros, verifique os filtros aplicados."})
    }

    if (response.data == "E"){
      clearInterval(checkInterval);
      setIsGeneratingReport(false)
      setButtonText("Gerar Relatório")

      addToast({type: "error", title: "Operação não realizada", description: "Não foi possível gerar o relatório."})
    }
  }
}, [isGeneratingReport, idReportGenerate, buttonText])


// Open link with report
const OpenReportAmazon = async() => {
  const response = await api.post(`/ProcessosGOJUR/Editar`, {
    id: idReportGenerate,
    token: localStorage.getItem('@GoJur:token')
  });      

  setReportLink(response.data.des_Parametro)
  setIdReportGenerate(0)

  const newWin = window.open(`${response.data.des_Parametro}`, '_blank')
  
  if(!newWin || newWin.closed || typeof newWin.closed=='undefined')
    setShowReportOpenFileModal(true)
}


const CloseReportModal = async () => {
  setShowReportOpenFileModal(false)
  setReportLink('')
}


// REPORT FIELDS - GET API DATA
const LoadAccount = async (stateValue?: string) => {
  if (isLoadingComboData){
    return false;
  }

  // when is a first initialization get value from edit if not load from state as term typing
  let filter = stateValue == "initialize"? accountValue:accountTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<IAccount[]>('/ContasBancarias/Listar', {
      description: filter,
      token,
    });

    const listAccount: ISelectData[] = []

    response.data.map(item => {
      return listAccount.push({
        id: item.id,
        label: item.value
      })
    })
    
    setAccount(listAccount)
    setIsLoadingComboData(false)
  }
  catch (err) {
    console.log(err);
  }
}


const LoadMatter = async (stateValue?: string) => {
  if (isLoadingComboData){
    return false;
  }

  // when is a first initialization get value from edit if not load from state as term typing
  let filter = stateValue == "initialize"? matterValue:matterTerm
  if (stateValue == 'reset'){
    filter = ''
  }
  
  try {
    const response = await api.post<IAccount[]>('/Processo/ListarCombo', {
      filterClause: filter,
      page: 0,
      rows: 50,
      matterType: "",
      sortBy: "",
      orderBy: "",
      status: "",
      token,
    });

    const listMatter: ISelectData[] = []

    response.data.map(item => {
      return listMatter.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatter(listMatter)
    setIsLoadingComboData(false)
  }
  catch (err) {
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
    const response = await api.get<ISelectData[]>('/CentroDeCusto/Listar', {
      params:{
      page: 0,
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listCostCenter: ISelectData[] = []

    response.data.map(item => {
      return listCostCenter.push({
        id: item.id,
        label: item.label
      })
    })
    
    setCostCenter(listCostCenter)
    setIsLoadingComboData(false)
  }
  catch (err) {
    console.log(err);
  }
}


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

    const listPaymentForm: ISelectData[] = []

    response.data.map(item => {
      return listPaymentForm.push({
        id: item.paymentFormId,
        label: item.paymentFormDescription
      })
    })
    
    setPaymentForm(listPaymentForm)
    setIsLoadingComboData(false)
  }
  catch (err) {
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
        rows: 50,
        filterClause: filter,
        token
      }
    });

    const listCategory: ISelectData[] = []

    response.data.map(item => {
      return listCategory.push({
        id: item.id,
        label: item.label,
      })
    })
    
    setCategory(listCategory)
    setIsLoadingComboData(false)
  }
  catch (err) {
    console.log(err);
  }
}


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
    const response = await api.get<ISelectData[]>('/Pessoas/ListarPorEmpresa', {
      params:{
        filterClause: filter,
        peopleTypeSelected: 'CLT',
        token
      }    
    });

    const listPeople: ISelectData[] = []

    response.data.map(item => {
      return listPeople.push({
        id: item.id,
        label: item.label
      })
    })
    
    setPeople(listPeople)
    setIsLoadingComboData(false)
  }
  catch (err) {
    console.log(err);
  }
}


// GENERATE REPORT
const handleGenerateReport = useCallback(async() => {
  if (isGeneratingReport){
    return;
  }

  if (period == "custom" && dtaCustomStart == "" && dtaCustomEnd == ""){
    addToast({
      type: "info",
      title: "Operação NÃO realizada",
      description: `Por favor, indique a data de início e data de término`
    })

    return;
  }

  if (period == "all" && peopleValue == "" && matterValue == ""){
    addToast({
      type: "info",
      title: "Operação NÃO realizada",
      description: `Para listar todo o período selecione um item no filtro Pessoas ou Processos`
    })

    return;
  }

  try {
    const token = localStorage.getItem('@GoJur:token');
  
    setIsGeneratingReport(true) 
    
    let categoryListItens = 'category=';
    categoryReportList.map((category) => {
      return categoryListItens += `${category.id}-`;
    })

    let categoryListItensDesc = '';
    categoryReportList.map((category) => {
      return categoryListItensDesc += `${category.label} , `;
    })

    let costCenterListItens = 'centrocusto=';
    costCenterReportList.map((costCenter) => {
      return costCenterListItens += `${costCenter.id}-`;
    })

    let costCenterListItensDesc = '';
    costCenterReportList.map((costCenter) => {
      return costCenterListItensDesc += `${costCenter.label} , `;
    })

    const response = await api.post('/Financeiro/GerarRelatorioMovimentacaoFinanceira', {
      accountId,
      accountDesc: accountValue,
      categoryId: categoryListItens,
      categoryDesc: categoryListItensDesc,
      peopleId,
      peopleDesc: peopleValue,
      matterId,
      matterDesc: matterValue,
      costCenterId: costCenterListItens,
      costCenterDesc: costCenterListItensDesc,
      paymentFormId,
      paymentFormDesc: paymentFormValue,
      situation,
      period,
      movimentType,
      movimentBy,
      dtaCustomStart,
      dtaCustomEnd,
      layout,
      token,
    })

    setIdReportGenerate(response.data)
  }
  catch (err: any) {
    setIsGeneratingReport(false) 
    addToast({
      type: "info",
      title: "Falha ao gerar o relatório",
      description: err.response.data.Message
    })
  }
}, [addToast, accountId, accountValue, paymentFormValue, matterValue, peopleValue, peopleId, dtaCustomStart, dtaCustomEnd, layout, period, categoryId, matterId, costCenterId, paymentFormId, situation, movimentType, movimentBy]); 


const LoadDefaultAccount = async () => {
  try {
    const response = await api.get<IAccount>('/ContasBancarias/ListarPadrao', {
      params:{
        filterClause: 'default',
        token,
      }
    });

    if(lastAccount != null)
    {
      setAccountId(lastAccount)
      localStorage.removeItem('@GoJur:financialAccount');
    }
    else{
      setAccountId(response.data.cod_Conta)
      setAccountValue(response.data.des_Conta)
    }
  }
  catch (err) {
    console.log(err);
  }
}

 // REPORT FIELDS - CHANGE
 const handleAccountSelected = (item) => { 
  if (item){
    setAccountValue(item.label)
    setAccountId(item.id)
  }
  else{
    setAccountValue('')
    LoadAccount('reset')
    setAccountId('')
  }
}


// REPORT FIELDS - CHANGE
const handlePeopleSelected = (item) => { 
  if (item){
    setPeopleValue(item.label)
    setPeopleId(item.id)
    setAccountId("")
    setAccountValue("")
    setPeriod("all")
  }
  else{
    setPeopleValue('')
    LoadPeople('reset')
    setPeopleId('')
  }
}


const handleMatterSelected = (item) => { 
  if (item){
    setMatterValue(item.label)
    setMatterId(item.id)
    setAccountId("")
    setAccountValue("")
    setPeriod("all")
  }
  else{
    setMatterValue('')
    LoadMatter('reset')
    setMatterId('')
  }
}


const handlePaymentFormSelected = (item) => { 
  if (item){
    setPaymentFormValue(item.label)
    setPaymentFormId(item.id)
  }
  else{
    setPaymentFormValue('')
    LoadPaymentForm('reset')
    setPaymentFormId('')
  }
}


const handleCategorySelected = (item) => { 
  if (item){
    setCategoryValue(item.value)
    setCategoryId(item.id)
    handleListItemCategory(item)
  }
  else{
    setCategoryValue('')
    LoadCategory('reset')
    setCategoryId('')
  }
}


const handleListItemCategory = (category) => {
  // if is already add on list return false
  const existItem = categoryReportList.filter(item => item.id == category.id);
  if (existItem.length > 0){
    return;
  }

  setCategoryReportList(previousValues => [...previousValues, category])
}


const handleRemoveItemCategory = (category) => {
  const categoryListUpdate = categoryReportList.filter(item => item.id != category.id);
  setCategoryReportList(categoryListUpdate)
}


const handleCostCenterSelected = (item) => { 
  if (item){
    setCostCenterValue(item.value)
    setCostCenterId(item.id)
    handleListItemCostCenter(item)
  }
  else{
    setCostCenterValue('')
    LoadCostCenter('')
    setCostCenterId('')
  }
}


const handleListItemCostCenter = (costCenter) => {
  // if is already add on list return false
  const existItem = costCenterReportList.filter(item => item.id == costCenter.id);

  if (existItem.length > 0){
    return;
  }

  setCostCenterReportList(previousValues => [...previousValues, costCenter])
}

  
const handleRemoveItemCostCenter = (costCenter) => {
  const costCenterListUpdate = costCenterReportList.filter(item => item.id != costCenter.id);
  setCostCenterReportList(costCenterListUpdate)
}


  return (
    <Container>
      <HeaderPage />

      {(showReportOpenFileModal) && <Overlay /> }
      {(showReportOpenFileModal) && <ReportModal callbackFunction={{CloseReportModal, reportLink}} /> }

      <TollBar>
        <div className="buttonReturn">
          <button
            className="buttonLinkClick"
            title="Clique para retornar ao financeiro"
            onClick={() => history.push('/financeiro')}
            type="submit"
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>
        </div>

      </TollBar>
    
      <Content>
        <header style={{fontSize:"15px"}}>Selecione um ou mais filtros para relatório de movimento</header>

        <Form> 
          <section id="dados" style={{width:"100%"}}>
            <div>
              <div style={{marginLeft:"1%", marginTop:"1%"}}>
                <label htmlFor="type">
                  Movimento por
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={movimentBy}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMovimentBy(e.target.value)}
                  >
                    <option value="venc">Vencimento</option>
                    <option value="extract">Extrato (caixa)</option>

                  </select>
                </label>
              </div>

              <div style={{marginLeft:"1%", marginTop:"3%"}}>
                <label htmlFor="type">
                  Tipo Movimento
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={movimentType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMovimentType(e.target.value)}
                  >
                    <option value="all">Ambos</option>
                    <option value="rec">Receita</option>
                    <option value="des">Despesa</option>
 
                  </select>
                </label>

              </div>

              <AutoCompleteSelect className="selectAdvisoryType" style={{marginTop:"1%"}}>
                <p>Conta</p>  
                <Select
                  isSearchable   
                  value={account.filter(options => options.id == accountId)}
                  onChange={handleAccountSelected}
                  onInputChange={(term) => setAccountTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={account}
                />
              </AutoCompleteSelect>

              <AutoCompleteSelect className="selectAdvisoryType" style={{marginTop:"1%"}}>
                <p>Pessoas</p>  
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

              <AutoCompleteSelect className="selectAdvisoryType">
                <p>Processos</p>  
                <Select
                  isSearchable   
                  value={matter.filter(options => options.id == matterId)}
                  onChange={handleMatterSelected}
                  onInputChange={(term) => setMatterTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matter}
                />
              </AutoCompleteSelect>

              <AutoCompleteSelect className="selectAdvisoryType">
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

              <ItemList>
                {costCenterReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCostCenter(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 
              </ItemList>
            </div>

            <div>
              <AutoCompleteSelect className="selectAdvisoryType">
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

              <ItemList>
                {categoryReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCategory(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 
              </ItemList>

              <AutoCompleteSelect className="selectAdvisoryType">
                <p>Forma de Pagamento</p>  
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

              <div style={{marginLeft:"1%", width:"98%", marginTop:"1%"}}>
                <label htmlFor="type">
                  Situação
                  <select
                    style={{width:"100%", backgroundColor:"white"}}
                    name="Type"
                    value={situation}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setSituation(e.target.value)}
                  >
                    <option value="both">Ambos</option>
                    <option value="pending">à Pagar/Receber</option>
                    <option value="effected">Pago/Recebido</option>

                  </select>
                </label>
              </div>

              <div style={{marginLeft:"1%", width:"98%", marginTop:"2%"}}>
                <label htmlFor="type">
                  Periodo
                  <select
                    style={{width:"100%", backgroundColor:"white"}}
                    name="Type"
                    value={period}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeriod(e.target.value)}
                  >
                    <option value="current">Mês Atual</option>
                    <option value="before">Mês Anterior</option>
                    <option value="custom">Informar Datas</option>
                    <option value="all">Todo o Período</option>
                  </select>
                </label>
              </div>

              {period == "custom" &&(
                <div style={{display:"flex", marginLeft:"1%", width:"98%", marginTop:"2%"}}>
                  <div style={{width:"47%"}}>
                    <label htmlFor="data" style={{width:"20%"}}>
                      Data Periodo Inico
                      <input 
                        style={{backgroundColor:"white"}}
                        type="date"
                        value={dtaCustomStart}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaCustomStart(e.target.value)}
                      />
                    </label>
                  </div>

                  <div style={{ marginLeft:"5%"}}>
                    <label htmlFor="dataFinal" style={{width:"47%"}}>
                      Data Periodo Final
                      <input 
                        style={{backgroundColor:"white"}}
                        type="date"
                        value={dtaCustomEnd}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaCustomEnd(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div style={{marginLeft:"1%", marginTop:"2%"}}>
                <label htmlFor="type">
                  Layout
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={layout}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setLayout(e.target.value)}
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <div style={{marginLeft:"80%", marginTop:"5%"}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=>{ handleGenerateReport()}}
              title="Clique para gerar o relatório de financeiro"
            >
              <FaFileAlt />
              {buttonText}
              {isGeneratingReport && <Loader size={5} color="var(--orange)" /> }
            </button>
          </div>
        </Form>
      </Content>

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Gerando Relatório ...
          </div>
        </>
      )}
          
    </Container>
  );
};

export default FinancialIncomeExpenseList;
