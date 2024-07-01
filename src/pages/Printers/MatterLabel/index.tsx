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
import { AiOutlinePrinter } from 'react-icons/ai'
import { MdHelp } from 'react-icons/md';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { useDevice } from "react-use-device";
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from "services/api";
import Loader from 'react-spinners/PulseLoader';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { VscTag } from 'react-icons/vsc';
import { TiEdit } from "react-icons/ti";
import MatterLabelEdit from './Modal';
import { Container, OverlayMatterLabel, ContainerMobile } from "./styles"


export interface IAutoCompleteData {
  id: string;
  label: string;
  type: string;
}

export interface IMatterLabelData{
  matterId: number;
  labelId: string;
  content:string;
  acessCodes: string;
  contentLabel: string;
  qtd_EtiquetaPagina
}

export default function PrinterLabel() {
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
  const [htmlContentLabel , setHtmlContentLabel] = useState<string>('')
  const [labelId, setLabelId] = useState<string>("0")
  const [labels, setLabels] = useState<IAutoCompleteData[]>([]);
  const [allBorder, setAllBorder] = useState<boolean>(false)

  const [labelValue, setLabelValue] = useState<string>("")
  const [htmlLabel, setHtmlLabel] = useState<string>("")

  const [labelDivId, setLabelDivId] = useState<string>("")
  const [labelDivList, setLabelDivList] = useState<number[]>([1]);
  const [labelDivString, setLabelDivString] = useState<string>("")
  const [labelValueId, setLabelValueId] = useState<string>("")

  const [qtd_EtiquetaPagina, setQtd_EtiquetaPagina] = useState<number>(0)
  const [qtd_EtiquetaPaginaList, setQtd_EtiquetaPaginaList] = useState<number[]>([]);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [isLoading , setIsLoading] = useState<boolean>(true)
  const { isMOBILE } = useDevice();

  // When exists report id verify if is avaiable every 5 seconds
useEffect(() => {

  if (idReportGenerate > 0){
    const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 7000);
  }

},[idReportGenerate])

useEffect(() => {
  setQtd_EtiquetaPaginaList([])
  setLabelDivList([1])
  setAllBorder(false)
  LoadReport('initialize');
  LoadLabels();
},[])

// If change MatterLabel in Select
useEffect(() => {
  if (caller == "change"){  
    setQtd_EtiquetaPaginaList([])
    setLabelDivList([1])
    setAllBorder(false)
    LoadReport();
    LoadLabels();
  }
  
},[caller, labelId])

// If save new MatterLabel
useEffect(() => {
  
  if(caller == "save"){
  setQtd_EtiquetaPaginaList([])
  setLabelDivList([1])
  setAllBorder(false)
  LoadReport();
  LoadLabels();
  }
  
},[labelId])

// If edit MatterLabel
useEffect(() => {
  
  if(caller == "reload"){
  setQtd_EtiquetaPaginaList([])
  setLabelDivList([1])
  setAllBorder(false)
  LoadReport();
  LoadLabels();
  }
  
},[caller])

// For change css border in checkbox
useEffect(() => {
  if(allBorder == true){
    const border = document.querySelectorAll<HTMLElement>('.matter-label-container');
    border.forEach((e) => {
      e.style.border = '1px solid black';
    });
  }
  else{
    const border = document.querySelectorAll<HTMLElement>('.matter-label-container');
    border.forEach((e) => {
      e.style.border = '1px dashed gray';
    });
  }
},[allBorder])

useEffect(() => {
  // Get Id name of Div and get number in name of Div for add in List of Hide Numbers
  if(htmlLabel != ""){
    setLabelValue(htmlLabel.substring(8,17).split('"').slice(1,2)[0])
    setLabelDivId(htmlLabel.substring(14,17).split('"').slice(0,4)[0])
  }

},[htmlLabel])

useEffect(() => {
  // Get Ids of Div
  if(labelDivString != ""){
    setLabelValueId(labelDivString.substring(14,17).split('"').slice(0,4)[0])
  }

},[labelDivString])

useEffect(() => {
  // Add Ids of Div in List
  if(labelValueId != ""){
    handleListItemLabelId(labelValueId)
  }

},[labelValueId])

// Remove Ids of Div from list
useEffect(() => {

if(labelValue != ""){
  
  const myNode = document.getElementById(labelValue)!;
  if(myNode == null){
    return
  }

    handleRemoveItemLabelId(labelDivId)
    myNode.innerHTML = '';
    setLabelValue("")
    setHtmlLabel("")
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
  const response = await api.get<IMatterLabelData>('/Processo/EtiquetaDoProcesso', {
    params:{
      token,
      matterId,
      matterLabel: labelId,
    }
  })

  if(state == "initialize"){
    setLabelId(response.data.labelId)
  }
  setHtml(response.data.content)
  setHtmlContentLabel(response.data.contentLabel)
  SelectNumberOfDivs(response.data.labelId)
}

const LoadLabels = async () => {

  try {
    const response = await api.get('/Processo/ListarTipoImpressao', {
      params:{
        token
      }
      
    });

    const listLabels: IAutoCompleteData[] = []

    response.data.map(item => {
      if(item.tpo_Etiqueta == "P"){
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

const SelectNumberOfDivs = useCallback(async(id: string) => {

  const response = await api.get<IMatterLabelData>('/Processo/EtiquetaDoProcessoEditar', {
    params:{
    id,
    token
    }
    
  })

  setQtd_EtiquetaPagina(response.data.qtd_EtiquetaPagina)
  setIsLoading(false)


},[labelId, qtd_EtiquetaPagina]);

   // GENERATE REPORT
 const handleGenerateReport = useCallback(async() => {

  if (isGeneratingReport){
    return;
  }

  try {

    // Get number of Divs in label and create list
    let number = 1
    for( number = 1 ; number <= qtd_EtiquetaPagina; number++){
      qtd_EtiquetaPaginaList.push(number)
      }

    // Receber as duas listas e remover os numeros iguais
    const hideList = qtd_EtiquetaPaginaList.filter(x => labelDivList.every(x2 => x2 != x)).join(",")

    const token = localStorage.getItem('@GoJur:token');

    setIsGeneratingReport(true)

    const response = await api.post('/Processo/GerarRelatorioEtiqueta', {
      labelModal: labelId,
      matterId,
      labelBorder: allBorder,
      hide: hideList,
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
},[addToast, labelId, matterId, labelDivList, allBorder, qtd_EtiquetaPagina]); 

// OPEN MODAL
const handleOpenModal = () => {    
  setShowLabelModal(true)
  setCaller("")
}

const editModal = () => {    
  setShowLabelModal(true)
  setCaller("edit")
}

const CloseMatterLabelModal = () => {
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
  }
  
  const handleRemoveItemLabelId = (labelid) => {
  
    const labelIdListUpdate = labelDivList.filter(item => item != labelid);
    setLabelDivList(labelIdListUpdate)
  }

    // Get id of Main Div
  function getParent (ele, parentClass="matter-label-container"){
    let e = ele;

    if(!e.classList.contains('matter-label-main')){
      while(!e.classList.contains(parentClass)){
        e=e.parentElement;
     }
 
     if(e.innerHTML == "") {
       
        // Add Label Value in Empty Div
       e.insertAdjacentHTML("afterbegin", htmlContentLabel);

       setLabelDivString(e.outerHTML)
       return
     }
 
     // For remove label Value
     if(e.innerHTML != ""){
       setHtmlLabel(e.outerHTML)
     }
     return e;
    }
    
 }

  const handleDivClick = (e) => {
    getParent(e) 
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
        {(showLabelModal) && <MatterLabelEdit callbackFunction={{ CloseMatterLabelModal , setLabelId,setCaller,  caller, labelId}} /> }

        <br />

        <div className="divTop">

          <br />

          <div id="buttonPrint" className="selectLabelBox">Selecione a Etiqueta:</div>

          <div className="selectInput">
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

          <div className="edit">
            <button 
              type="submit"
              className="buttonLinkClick"
              onClick={editModal}
            >
              <TiEdit />
              <p>Ajustar Etiqueta</p> 
            </button>
          </div>

          <div className="edit">
            <button 
              type="submit"
              className="buttonLinkClick"
              onClick={handleOpenModal}
            >
              <VscTag />
              <p>Criar Etiqueta</p> 
            </button>
          </div>

          <div className="checkBox">
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

          <div className="printDiv">
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
