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
import { MdHelp } from 'react-icons/md';
import { AutoCompleteSelect} from 'Shared/styles/GlobalStyle';
import { useHistory } from 'react-router-dom';
import Select from 'react-select'
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { HeaderPage } from 'components/HeaderPage';
import ReportModal from 'components/Modals/Report';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay, FormatDate} from 'Shared/utils/commonFunctions';
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


const CashFlowList: React.FC = () => {
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

  const [people, setPeople] = useState<IAutoCompleteData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleTerm, setPeopleTerm] = useState('');
  const [peopleValue, setPeopleValue] = useState('');

  const [situation, setSituation] = useState<string>("both")
  const [startYear, setStartYear] = useState<string>(FormatDate(new Date(), 'yyyy'))
  const [endYear, setEndYear] = useState<string>("")
  const [startMonth, setStartMonth] = useState<string>(FormatDate(new Date(), 'MM'))
  const [endMonth, setEndMonth] = useState<string>("")

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [showReportOpenFileModal, setShowReportOpenFileModal] = useState<boolean>(false);
  const [reportLink, setReportLink] = useState<string>('');


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
  LoadCostCenter()
}, [])


useEffect(() => {
  const newEndYear = Number(startYear) + 1;
  setEndYear(newEndYear.toString())

  const newEndMonth = Number(startMonth) - 1;

  if(newEndMonth == 10 || newEndMonth == 11 || newEndMonth == 12){
    setEndMonth(newEndMonth.toString())
  }

  if(newEndMonth == 0){
    setEndMonth("12")
  }
  else {
    let value = '0';
      value += newEndMonth.toString()
      setEndMonth(value)
  }
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
  if (costCenterTerm.length > 0){
    LoadCostCenter()
  }
}, [costCenterTerm], 750)


const [buttonText, setButtonText] = useState("Gerar Relatório");
const changeText = (text) => setButtonText(text);


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
      setButtonText("Gerar Relatório")
      OpenReportAmazon()
    }

    if (response.data == "W")
    {
      setButtonText("Gerar Relatório");
      clearInterval(checkInterval);
      setIsGeneratingReport(false)
      setIdReportGenerate(0)

      addToast({type: "info", title: "Verificar filtros", description: "Não foram encontrados dados financeiros, verifique os filtros aplicados."})
    }

    if (response.data == "E"){
      clearInterval(checkInterval);
      setIsGeneratingReport(false)
      setButtonText("Gerar Relatório");
      
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
  setButtonText("Gerar Relatório");

  const newWin = window.open(`${response.data.des_Parametro}`, '_blank');
  
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

  if (startYear == endYear && Number(startMonth) - Number(endMonth) > 0){
    addToast({type: "info", title: "Operação NÃO realizada", description: `A data final da pesquisa deve ser maior que a data inicial. Verifique o ano e o mês escolhido para prosseguir.`})

    return;
  }

  if (Number(startYear) - Number(endYear) == -1 && Number(startMonth) - Number(endMonth) <= 0){
    changeText
    addToast({type: "info", title: "Operação NÃO realizada", description: `O periodo de pesquisa do fluxo de caixa não pode ultrapasar 12 meses.`})

    return;
  }

  if (Number(startYear) - Number(endYear) > 0){
    addToast({type: "info", title: "Operação NÃO realizada", description: `A data final da pesquisa deve ser maior que a data inicial. Verifique o ano e o mês escolhido para prosseguir.`})

    return;
  }

  if (Number(startYear) - Number(endYear) < -1){
    addToast({type: "info", title: "Operação NÃO realizada", description: `O periodo de pesquisa do fluxo de caixa não pode ultrapasar 12 meses.`})

    return;
  }

  if (accountId == ""){
    addToast({type: "info", title: "Operação NÃO realizada", description: `Por favor, selecione uma conta`})

    return;
  }

  try {
    const token = localStorage.getItem('@GoJur:token');
  
    setIsGeneratingReport(true)

    let costCenterListItens = 'centrocusto=';
    costCenterReportList.map((costCenter) => {
      return costCenterListItens += `${costCenter.id}-`;
    })

    let costCenterListItensDesc = '';
    costCenterReportList.map((costCenter) => {
      return costCenterListItensDesc += `${costCenter.label} , `;
    })
    
    let categoryListItens = 'category=';
    categoryReportList.map((category) => {
      return categoryListItens += `${category.id}-`;
    })

    let categoryListItensDesc = '';
    categoryReportList.map((category) => {
      return categoryListItensDesc += `${category.label} , `;
    })

    const response = await api.post('/Financeiro/GerarRelatorioFluxoDeCaixa', {
      accountId,
      accountDesc: accountValue,
      peopleId,
      peopleDesc: peopleValue,
      costCenterId: costCenterListItens,
      costCenterDesc: costCenterListItensDesc,
      categoryId: categoryListItens,
      categoryDesc: categoryListItensDesc,
      situation,
      startYear,
      startMonth,
      endYear,
      endMonth,
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
}, [addToast, accountId, accountValue, peopleId, costCenterId, categoryId, situation, startYear, startMonth, endYear, endMonth]); 


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
  }
  else{
    setPeopleValue('')
    LoadPeople('reset')
    setPeopleId('')
  }
}


const handleCategorySelected = (item) => { 
  if (item){
    setCategoryValue(item.label)
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
    setCostCenterValue(item.label)
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
        <header style={{fontSize:"15px"}}>Selecione um ou mais filtros para relatório de fluxo de caixa</header>

        <Form>
          <section id="dados" style={{width:"100%"}}>
            <div>
              <AutoCompleteSelect className="selectAdvisoryType" style={{marginTop:"1.2%"}}>
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

              <AutoCompleteSelect className="selectAdvisoryType" style={{marginTop:"2%"}}>
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

              <AutoCompleteSelect className="selectAdvisoryType" style={{marginTop:"1%"}}>
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
              <AutoCompleteSelect className="selectAdvisoryType" style={{width:"96%"}}>
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

              <div style={{marginLeft:"1%", width:"96%", marginTop:"1%"}}>
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

              <div style={{marginLeft:"1%", width:"100%", marginTop:"2%", display:"grid"}}>
                <label htmlFor="type">
                  <p style={{display:"block"}}>Periodo</p>
                  <select
                    style={{width:"22.5%", backgroundColor:"white"}}
                    name="Type"
                    value={startYear}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setStartYear(e.target.value)}
                  >
                    <option value="2050">2050</option>
                    <option value="2049">2049</option>
                    <option value="2048">2048</option>
                    <option value="2047">2047</option>
                    <option value="2046">2046</option>
                    <option value="2045">2045</option>
                    <option value="2044">2044</option>
                    <option value="2043">2043</option>
                    <option value="2042">2042</option>
                    <option value="2041">2041</option>
                    <option value="2040">2040</option>
                    <option value="2039">2039</option>
                    <option value="2038">2038</option>
                    <option value="2037">2037</option>
                    <option value="2036">2036</option>
                    <option value="2035">2035</option>
                    <option value="2034">2034</option>
                    <option value="2033">2033</option>
                    <option value="2032">2032</option>
                    <option value="2031">2031</option>
                    <option value="2030">2030</option>
                    <option value="2029">2029</option>
                    <option value="2028">2028</option>
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                  </select>

                  <select
                    style={{width:"22.5%", backgroundColor:"white", marginLeft:"2%"}}
                    name="Type"
                    value={startMonth}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setStartMonth(e.target.value)}
                  >
                    <option value="01">Janeiro</option>
                    <option value="02">Fevereiro</option>
                    <option value="03">Março</option>
                    <option value="04">Abril</option>
                    <option value="05">Maio</option>
                    <option value="06">Junho</option>
                    <option value="07">Julho</option>
                    <option value="08">Agosto</option>
                    <option value="09">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                  </select>

                  <select
                    style={{width:"22.5%", backgroundColor:"white", marginLeft:"2%"}}
                    name="Type"
                    value={endYear}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setEndYear(e.target.value)}
                  >
                    <option value="2050">2050</option>
                    <option value="2049">2049</option>
                    <option value="2048">2048</option>
                    <option value="2047">2047</option>
                    <option value="2046">2046</option>
                    <option value="2045">2045</option>
                    <option value="2044">2044</option>
                    <option value="2043">2043</option>
                    <option value="2042">2042</option>
                    <option value="2041">2041</option>
                    <option value="2040">2040</option>
                    <option value="2039">2039</option>
                    <option value="2038">2038</option>
                    <option value="2037">2037</option>
                    <option value="2036">2036</option>
                    <option value="2035">2035</option>
                    <option value="2034">2034</option>
                    <option value="2033">2033</option>
                    <option value="2032">2032</option>
                    <option value="2031">2031</option>
                    <option value="2030">2030</option>
                    <option value="2029">2029</option>
                    <option value="2028">2028</option>
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                  </select>

                  <select
                    style={{width:"22.5%", backgroundColor:"white", marginLeft:"2%"}}
                    name="Type"
                    value={endMonth}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setEndMonth(e.target.value)}
                  >
                    <option value="01">Janeiro</option>
                    <option value="02">Fevereiro</option>
                    <option value="03">Março</option>
                    <option value="04">Abril</option>
                    <option value="05">Maio</option>
                    <option value="06">Junho</option>
                    <option value="07">Julho</option>
                    <option value="08">Agosto</option>
                    <option value="09">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                  </select>

                  <MdHelp 
                    className='icons' 
                    title='O periodo de pesquisa para a geração deste relatório devem ser de no máximo 12 meses.'
                    style={{minWidth: '20px', minHeight: '20px', marginLeft:"0.3%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
                  />
                </label>
              </div>
            </div>
          </section>

          <div style={{marginLeft:"80%", marginTop:"5%"}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=>{ handleGenerateReport()}}
              title="Clique para gerar o relatório financeiro"
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

export default CashFlowList;
