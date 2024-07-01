/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import { useDefaultSettings } from "context/defaultSettings"
import React, { ChangeEvent, useEffect, useState, useCallback, MouseEventHandler } from "react"
import { AiOutlinePrinter, AiOutlineReload } from 'react-icons/ai'
import { MdHelp } from 'react-icons/md';
import { useDevice } from "react-use-device";
import { useMenuHamburguer } from 'context/menuHamburguer'
import { AutoCompleteSelect} from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import api from "services/api";
import Loader from 'react-spinners/PulseLoader';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { VscTag } from 'react-icons/vsc';
import { TiEdit } from "react-icons/ti";
import CustomerLabelEdit from "./Modal/index"
import { Container, OverlayMatterLabel, ContainerMobile } from "./styles"


export interface IAutoCompleteData {
  id: string;
  label: string;
  type: string;
}

export interface IAutoCompleteData2 {
  id: string;
  label: string;
}

export interface ICustomerLabelData{
  customerId: number;
  labelId: string;
  content:string;
  acessCodes: string;
  contentLabel: string;
  qtd_EtiquetaPagina
}

export interface ISubject {
  id: string;
  value: string;
}

export default function CustomerLabel() {
  const { addToast } = useToast();
  const {handleUserPermission} = useDefaultSettings();  
  const token = localStorage.getItem('@GoJur:token');
  const matterId = localStorage.getItem('@GoJur:matterCoverId');
  const [caller, setCaller] = useState<string>("")
  const [saveId, setSaveId] = useState<string>("")
  const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
  
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [html , setHtml] = useState<string>('')
  const [labelId, setLabelId] = useState<string>("0")
  const [labels, setLabels] = useState<IAutoCompleteData[]>([]);
  const [allBorder, setAllBorder] = useState<boolean>(false)

  const [labelValue, setLabelValue] = useState<string>("")
  const [htmlLabel, setHtmlLabel] = useState<string>("")

  const [labelDivId, setLabelDivId] = useState<string>("")
  const [addItemList, setAddItemList] = useState<boolean>(false)
  const [removeItemList, setRemoveItemList] = useState<boolean>(false)
  const [labelDivList, setLabelDivList] = useState<number[]>([]);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [isLoading , setIsLoading] = useState<boolean>(true)

  const [customerGroup, setCustomerGroup] = useState<IAutoCompleteData2[]>([]);
  const [customerGroupId, setCustomerGroupId] = useState('');
  const [customerGroupTerm, setCustomerGroupTerm] = useState('');
  const [customerGroupValue, setCustomerGroupValue] = useState('');

  const [customerTerm, setCustomerTerm] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [customerDesc, setCustomerDesc] = useState('');
  const [customer, setCustomer] = useState<IAutoCompleteData2[]>([]);

  const [period, setPeriod] = useState<string>("none")
  const [periodCustomStart, setPeriodCustomStart] = useState<string>("01")
  const [periodCustomEnd, setPeriodCustomEnd] = useState<string>("01")

  const { isMOBILE } = useDevice();

  // When exists report id verify if is avaiable every 5 seconds
useEffect(() => {

  if (idReportGenerate > 0){
    const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 7000);
  }

},[idReportGenerate])

useEffect(() => {
  setLabelDivList([])
  setAllBorder(false)
  LoadReport('initialize');
  LoadLabels();
  LoadCustomerGroup()
  LoadCustomer()
},[])

// If change CustomerLabel in Select
useEffect(() => {
  if (caller == "change"){  

    setLabelDivList([])
    setAllBorder(false)
    LoadReport();
    LoadLabels();
  }
  
},[caller, labelId])

// If save new CustomerLabel
useEffect(() => {
  
  if(caller == "save"){

  setLabelDivList([])
  setAllBorder(false)
  LoadReport();
  LoadLabels();
  }
  
},[labelId])

// If edit CustomerLabel
useEffect(() => {
  
  if(caller == "reload"){

  setLabelDivList([])
  setAllBorder(false)
  LoadReport();
  LoadLabels();
  }
  
},[caller])

// For change css border in checkbox
useEffect(() => {
  if(allBorder == true){
    const border = document.querySelectorAll<HTMLElement>('.customer-label-container');
    border.forEach((e) => {
      e.style.border = '1px solid black';
    });
  }
  else{
    const border = document.querySelectorAll<HTMLElement>('.customer-label-container');
    border.forEach((e) => {
      e.style.border = '1px dashed gray';
    });
  }
},[allBorder])

useEffect(() => {
  // Get Id name of Div and get number in name of Div for add in List of Hide Numbers
  if(htmlLabel != ""){
    setLabelValue(htmlLabel.substring(8,17).split('"').slice(1,2)[0])
  }

},[htmlLabel])

useEffect(() => {
  // Add Ids of Div in List
  if(labelDivId != "" && addItemList == true){
    handleListItemLabelId(labelDivId)
  }

},[labelDivId, addItemList])

useEffect(() => {
  // Rmove Ids of Div from List
  if(labelDivId != "" && removeItemList == true){
    handleRemoveItemLabelId(labelDivId)
  }

},[labelDivId, removeItemList])

// Remove Ids of Div from list
useEffect(() => {

if(labelValue != ""){

  const myNode = document.getElementById(labelValue)!;
  if(myNode == null){
    return
  }

  setLabelDivId(htmlLabel.substring(14,17).split('"').slice(0,4)[0])

  if(myNode.innerHTML.includes(`class="customer-label-header"`)){  
    setAddItemList(true)
    myNode.innerHTML = myNode.innerHTML.replace(`class="customer-label-header"`,`class="customer-label-none"`);
    setLabelValue("")
    setHtmlLabel("")
  }

  else{
    setRemoveItemList(true)
    myNode.innerHTML = myNode.innerHTML.replace(`class="customer-label-none"`,`class="customer-label-header"`);
    setLabelValue("")
    setHtmlLabel("")
  }
    
}

}, [labelValue, htmlLabel]); 


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

        addToast({
          type: "info",
          title: "Falha",
          description: "Não foi possivel gerar a etiqueta."
        })
      }

      if (response.data == "E"){
        clearInterval(checkInterval);
        setIsGeneratingReport(false)

        addToast({
          type: "error",
          title: "Operação não realizada",
          description: "Não foi possível gerar o relatório."
        })

      }
  }
},[isGeneratingReport, idReportGenerate])


// Open link with report
const OpenReportAmazon = async() => { 
  const response = await api.post(`/ProcessosGOJUR/Editar`, {
    id: idReportGenerate,
    token: localStorage.getItem('@GoJur:token')
  });      

  setIdReportGenerate(0)

  window.open(`${response.data.des_Parametro}`, '_blank');     
} 
  
const LoadReport = async (state = '') => {
  
  setIsLoading(true)

  let filter = ""

  if(period != "custom"){
    filter += `period=${period},`
  }

  if(period == "custom"){
    filter += `period=${period}-${periodCustomStart}-${periodCustomEnd},`
  }
  
  if(customerGroupId != ""){
    filter += `customerGroup=${customerGroupId},`
  }

  if(customerId != ""){
    filter += `customer=${customerId},`
  }

  const response = await api.get<ICustomerLabelData>('/Clientes/EtiquetaDosClientes', {
    params:{
      filter,
      filterDescription: "",
      labelModel: labelId,
      token,
    }
  })

  if(state == "initialize"){
    setLabelId(response.data.labelId)
  }
  setHtml(response.data.content)
  setIsLoading(false)
}

const LoadLabels = async () => {

  try {
    const response = await api.get('/Clientes/ListarTipoImpressao', {
      params:{
        token
      }
      
    });

    const listLabels: IAutoCompleteData[] = []

    response.data.map(item => {
      if(item.tpo_Etiqueta == "C"){
      return listLabels.push({
          id: item.cod_Etiqueta,
          label: item.des_Etiqueta,
          type: item.tpo_Etiqueta,
        })
      }
      
        return;
  
    })
  
    setLabels(listLabels)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}

const LoadCustomerGroup = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? customerGroupValue:customerGroupTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<ISubject[]>('/Clientes/ListarGrupoClientes', {
      description: filter,
      token,
    });

    const listCustomerGroup: IAutoCompleteData2[] = []

    response.data.map(item => {
      return listCustomerGroup.push({
        id: item.id,
        label: item.value
      })
    })
    
    setCustomerGroup(listCustomerGroup)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}

const LoadCustomer = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? customerValue:customerTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<ISubject[]>('/Clientes/ListarComboBox', {
      filterClause: filter,
      rows: 50,
      token,
    });

    const listCustomer: IAutoCompleteData2[] = []

    response.data.map(item => {
      return listCustomer.push({
        id: item.id,
        label: item.value
      })
    })
    
    setCustomer(listCustomer)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}

   // GENERATE REPORT
 const handleGenerateReport = useCallback(async() => {

  if (isGeneratingReport){
    return;
  }

  let hideListItens = "";
    labelDivList.map((divId) => {
      return hideListItens += `${divId},`;
    })

  let filter = ""

  if(period != "custom"){
    filter += `period=${period},`
  }

  if(period == "custom"){
    filter += `period=${period}-${periodCustomStart}-${periodCustomEnd},`
  }
  
  if(customerGroupId != ""){
    filter += `customerGroup=${customerGroupId},`
  }

  if(customerId != ""){
    filter += `customer=${customerId},`
  }

  try {

    setIsGeneratingReport(true)

    const response = await api.post('/Clientes/GerarRelatorioEtiqueta', {
      labelModal: labelId,
      filter,
      filterDesc: "",
      labelBorder: allBorder,
      hide: hideListItens,
      token,

    })

    setIdReportGenerate(response.data)
    
  } catch (err: any) {
    setIsGeneratingReport(false)
    addToast({
      type: "info",
      title: "Falha ao gerar o relatório",
      description: err.response.data.Message
    })
  }
},[addToast, labelId, labelDivList, allBorder, period, periodCustomStart, periodCustomEnd, customerGroupId, customerId]); 

// OPEN MODAL
const handleOpenModal = () => {    
  setShowLabelModal(true)
  setCaller("")
}

const editModal = () => {    
  setShowLabelModal(true)
  setCaller("edit")
}

const CloseCustomerLabelModal = () => {
  setShowLabelModal(false)
}

function createMarkup() {
  return {__html: html};
}

  const handleLabelSelected = (item) => { 
    setCaller("change")
    setLabelValue(item.target.children[item.target.selectedIndex].label)
    setLabelId(item.target.value)
  }

  const handleListItemLabelId = (labelid) => { 
    // if is already add on list return false
    const existItem = labelDivList.filter(item => item === labelid);
    if (existItem.length > 0){
      return;
    }
  
    setLabelDivList(previousValues => [...previousValues, labelid])
    setAddItemList(false)
    setLabelDivId("")

  }
  
  const handleRemoveItemLabelId = (labelid) => {
  
    const labelIdListUpdate = labelDivList.filter(item => item != labelid);
    setLabelDivList(labelIdListUpdate)
    setRemoveItemList(false)
    setLabelDivId("")
  }

    // Get id of Main Div
  function getParent (ele, parentClass="customer-label-container"){
    let e = ele;

    if(!e.classList.contains('customer-label-page')){
      while(!e.classList.contains(parentClass)){
        e=e.parentElement;

     }
 
     if(e.innerHTML != ""){
       setHtmlLabel(e.outerHTML)
     }
     return e;
    }
 }

  const handleDivClick = (e) => {
    getParent(e) 
  }

  const handleCustomerGroupSelected = (item) => { 
      
    if (item){
      setCustomerGroupValue(item.label)
      setCustomerGroupId(item.id)
    }else{
      setCustomerGroupValue('')
      LoadCustomerGroup('reset')
      setCustomerGroupId('')
    }
  }

  const handleCustomerSelected = (item) => { 
      
    if (item){
      setCustomerValue(item.label)
      setCustomerId(item.id)
      setCustomerDesc(item.label)
    }else{
      setCustomerValue('')
      LoadCustomer('reset')
      setCustomerId('')
    }
  }

  const handleUpdateList = () => {
    LoadReport() 
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
    <>
      {!isMOBILE &&(
      <Container id="workSpaceContainer">

        <HeaderPage />

        {(showLabelModal) && <OverlayMatterLabel /> }
        {(showLabelModal) && <CustomerLabelEdit callbackFunction={{ CloseCustomerLabelModal , setLabelId,setCaller,  caller, labelId}} /> }

        <br />

        <div className="divTop">

          <br />

          <div style={{display:"flex", marginLeft:"1%"}}>
           
            <div style={{width:"15.3%"}}>
              <AutoCompleteSelect className="selectCustomerGroup" style={{marginTop:"1%"}}>
                <p>Grupo de Cliente</p>  
                <Select
                  isSearchable   
                  value={customerGroup.filter(options => options.id == customerGroupId)}
                  onChange={handleCustomerGroupSelected}
                  onInputChange={(term) => setCustomerGroupTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={customerGroup}
                />
              </AutoCompleteSelect>
            </div> 

            <div style={{width:"17.5%"}}>
              <AutoCompleteSelect className="selectCustomer" style={{marginTop:"1%"}}>
                <p>Cliente</p>  
                <Select
                  isSearchable   
                  value={customer.filter(options => options.id == customerId)}
                  onChange={handleCustomerSelected}
                  onInputChange={(term) => setCustomerTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={customer}
                />
              </AutoCompleteSelect>
            </div>

            <div style={{marginLeft:"1.5%", width:"11.5%", marginTop:"auto", marginBottom:"10px"}}>
              <label htmlFor="type">
                <div id="buttonPrint" className="labelSelect">Aniversário</div>
                <select
                  name="userType"
                  value={period}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeriod(e.target.value)}
                >
                  <option value="none">Nenhum</option>
                  <option value="currentMonth">Mês Atual</option>
                  <option value="nextMonth">Próximo Mês</option>
                  <option value="custom">Informar Datas</option>
                </select>
              </label>
            </div>

            {period == "custom" && (
              <>
                <div style={{marginLeft:"1%", width:"8%", marginTop:"auto", marginBottom:"10px"}}>
                  <label htmlFor="type">
                    <div id="buttonPrint" className="labelSelect" style={{fontSize:"13px"}}>Mês</div>
                    <select
                      name="userType"
                      value={periodCustomStart}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeriodCustomStart(e.target.value)}
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
                  </label>
                </div>

                <span style={{fontSize:"13px", marginLeft:"1%",marginTop:"30px", marginBottom:"auto"}}>a</span>

                <div style={{marginLeft:"1%", width:"8%", marginTop:"auto", marginBottom:"10px"}}>
                  <label htmlFor="type">
                    <div id="buttonPrint" className="labelSelect" style={{fontSize:"13px"}}>Mês</div>
                    <select
                      name="userType"
                      value={periodCustomEnd}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeriodCustomEnd(e.target.value)}
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
                  </label>
                </div>

              </>

            )}

          </div>

          <div style={{display:"flex", marginTop:"1%", marginLeft:"0.5%"}}>

            <div style={{marginLeft:"1%", width:"14%", marginBottom:"1%"}}>
              <div id="buttonPrint" className="labelSelect">Selecione a Etiqueta</div>
              <label htmlFor="type">
                <select
                  name="userType"
                  value={labelId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleLabelSelected(e)}
                >

                  {labels.map((option, i) => (
                    <option
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                    ))}
                </select>
              </label>
            </div>
            
            <div className="labelAdjust">
              <button 
                type="submit"
                className="buttonLinkClick"
                onClick={editModal}
              >
                <TiEdit />
                <p>Ajustar Etiqueta</p> 
              </button>
            </div>

            <div className="labelAdjust">
              <button 
                type="submit"
                className="buttonLinkClick"
                onClick={handleOpenModal}
              >
                <VscTag />
                <p>Criar Etiqueta</p> 
              </button>
            </div>

            <div className="labelAdjust">
              <input
                type="checkbox"
                name="select"
                id="borders"
                checked={allBorder}
                onChange={() => setAllBorder(!allBorder)}
              />
              <label htmlFor="borders" className="labelCalibrar">Calibrar Impressora</label>
            </div>

            <MdHelp className='infoMessage' title="Marque para calibrar apenas se desejar ajustar as margens da impressão. Neste caso as bordas das etiquetas serão impressas para auxiliar no ajuste. Clique em ajustar etiqueta para alterar os valores de ajuste." />

            <div className="labelAdjust">
              <button  
                type="submit"
                id="buttonPrint"
                className="buttonLinkClick"
                onClick={handleGenerateReport}
              >
                <AiOutlinePrinter />
                <p>Imprimir</p> 
              </button>
            </div>

            <div className="labelAdjust">
              <button 
                type="submit"
                className="buttonLinkClick"
                onClick={handleUpdateList}
              >
                <AiOutlineReload />
                <p>Aplicar Filtros</p> 
              </button>
            </div>
          </div>

        </div>      
              
        <div
          className="areaHTMLDIv"
          onClick={(e) => handleDivClick(e.target)}
          onKeyDown={() => console.log("")}
          aria-hidden="true"
        >
          <div className="areaHTML" dangerouslySetInnerHTML={createMarkup()} />
        </div>
        
    
        {isLoading && ( 
          <div className='waitingReport'>
            <Loader size={6} color="var(--blue-twitter)" /> 
          </div>
        )}

        {isGeneratingReport && (
          <>
            <OverlayMatterLabel />
            <div className='waitingMessage'>   
              <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
              &nbsp;&nbsp; Gerando Etiqueta ...
            </div>
          </>
        )}

      </Container>
    )}

      {isMOBILE &&(
        <ContainerMobile>
          <div id='information'>
            <div className="information">
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
