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
import { FaFileAlt } from 'react-icons/fa';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { MdHelp } from 'react-icons/md';
import Loader from 'react-spinners/PulseLoader';
import { AutoCompleteSelect} from 'Shared/styles/GlobalStyle';
import { useHistory } from 'react-router-dom';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import ReportModal from 'components/Modals/Report';
import Select from 'react-select'
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { HeaderPage } from 'components/HeaderPage';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useForm } from 'react-hook-form';
import { Container, Content, Form, ItemList, TollBar } from './styles';
import { ISelectData, IDefaultsProps, IMatterReportData, ISubject, ICustomerGroup, ICustomerPosition, IAutoCompleteData, IAutoCompleteCourtData, IOpposing, ILawyer, ILegalCause, IMatterStatus, IMatterSolution, IMatterProbability, ICourt, IMatterPhase, ILegalNature, IMatterEventType, IMatterDemandType, IResponsible, IAdvisoryType } from '../../../Interfaces/IMatter';



const MatterReportSimple: React.FC = () => {

const history = useHistory();
const formRef = useRef<HTMLFormElement>(null);
const { handleUserPermission } = useDefaultSettings();
const { addToast } = useToast();
const token = localStorage.getItem('@GoJur:token');
const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
const [hudeDataWarning, setHudeDataWarning] = useState<boolean>(false)
const [reportType, setReportType] = useState<string>("simple")
const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller, handleCheckConfirm } = useConfirmBox();
const { handleSubmit} = useForm<IMatterReportData>();

const [customer, setCustomer] = useState<IAutoCompleteData[]>([]);
const [customerId, setCustomerId] = useState('');
const [customerTerm, setCustomerTerm] = useState('');
const [customerValue, setCustomerValue] = useState('');
const [customerDesc, setCustomerDesc] = useState('');
const [customerReportList, setCustomerReportList] = useState<ISelectData[]>([]);

const [customerGroup, setCustomerGroup] = useState<IAutoCompleteData[]>([]);
const [customerGroupId, setCustomerGroupId] = useState('');
const [customerGroupTerm, setCustomerGroupTerm] = useState('');
const [customerGroupValue, setCustomerGroupValue] = useState('');
const [customerGroupDesc, setCustomerGroupDesc] = useState('');
const [customerGroupReportList, setCustomerGroupReportList] = useState<ISelectData[]>([]);

const [customerPosition, setCustomerPosition] = useState<IAutoCompleteData[]>([]);
const [customerPositionId, setCustomerPositionId] = useState('');
const [customerPositionTerm, setCustomerPositionTerm] = useState('');
const [customerPositionValue, setCustomerPositionValue] = useState('');
const [customerPositionDesc, setCustomerPositionDesc] = useState('');
const [customerPositionReportList, setCustomerPositionReportList] = useState<ISelectData[]>([]);

const [opposing, setOpposing] = useState<IAutoCompleteData[]>([]);
const [opposingId, setOpposingId] = useState('');
const [opposingTerm, setOpposingTerm] = useState('');
const [opposingValue, setOpposingValue] = useState('');
const [opposingDesc, setOpposingDesc] = useState('');
const [opposingReportList, setOpposingReportList] = useState<ISelectData[]>([]);

const [lawyer, setLawyer] = useState<IAutoCompleteData[]>([]);
const [lawyerId, setLawyerId] = useState('');
const [lawyerTerm, setLawyerTerm] = useState('');
const [lawyerValue, setLawyerValue] = useState('');
const [lawyerDesc, setLawyerDesc] = useState('');
const [lawyerReportList, setLawyerReportList] = useState<ISelectData[]>([]);

const [legalCause, setLegalCause] = useState<IAutoCompleteData[]>([]);
const [legalCauseId, setLegalCauseId] = useState('');
const [legalCauseTerm, setLegalCauseTerm] = useState('');
const [legalCauseValue, setLegalCauseValue] = useState('');
const [legalCauseDesc, setLegalCauseDesc] = useState('');
const [legalCauseReportList, setLegalCauseReportList] = useState<ISelectData[]>([]);

const [matterStatus, setMatterStatus] = useState<IAutoCompleteData[]>([]);
const [matterStatusId, setMatterStatusId] = useState('');
const [matterStatusTerm, setMatterStatusTerm] = useState('');
const [matterStatusValue, setMatterStatusValue] = useState('');
const [matterStatusDesc, setMatterStatusDesc] = useState('');
const [matterStatusReportList, setMatterStatusReportList] = useState<ISelectData[]>([]);

const [matterSolution, setMatterSolution] = useState<IAutoCompleteData[]>([]);
const [matterSolutionId, setMatterSolutionId] = useState('');
const [matterSolutionTerm, setMatterSolutionTerm] = useState('');
const [matterSolutionValue, setMatterSolutionValue] = useState('');
const [matterSolutionDesc, setMatterSolutionDesc] = useState('');
const [matterSolutionReportList, setMatterSolutionReportList] = useState<ISelectData[]>([]);

const [matterProbability, setMatterProbability] = useState<IAutoCompleteData[]>([]);
const [matterProbabilityId, setMatterProbabilityId] = useState('');
const [matterProbabilityTerm, setMatterProbabilityTerm] = useState('');
const [matterProbabilityValue, setMatterProbabilityValue] = useState('');
const [matterProbabilityDesc, setMatterProbabilityDesc] = useState('');
const [matterProbabilityReportList, setMatterProbabilityReportList] = useState<ISelectData[]>([]);

const [court, setCourt] = useState<IAutoCompleteCourtData[]>([]);
const [courtId, setCourtId] = useState('');
const [courtTerm, setCourtTerm] = useState('');
const [courtValue, setCourtValue] = useState('');
const [courtDesc, setCourtDesc] = useState('');
const [federalUnitName, setFederalUnitName] = useState("");
const [courtReportList, setCourtReportList] = useState<IAutoCompleteCourtData[]>([]);

const [matterPhase, setMatterPhase] = useState<IAutoCompleteData[]>([]);
const [matterPhaseId, setMatterPhaseId] = useState('');
const [matterPhaseTerm, setMatterPhaseTerm] = useState('');
const [matterPhaseValue, setMatterPhaseValue] = useState('');
const [matterPhaseDesc, setMatterPhaseDesc] = useState('');
const [matterPhaseReportList, setMatterPhaseReportList] = useState<ISelectData[]>([]);

const [legalNature, setLegalNature] = useState<IAutoCompleteData[]>([]);
const [legalNatureId, setLegalNatureId] = useState('');
const [legalNatureTerm, setLegalNatureTerm] = useState('');
const [legalNatureValue, setLegalNatureValue] = useState('');
const [legalNatureDesc, setLegalNatureDesc] = useState('');
const [legalNatureReportList, setLegalNatureReportList] = useState<ISelectData[]>([]);

const [matterAdvisoryType, setMatterAdvisoryType] = useState<IAutoCompleteData[]>([]);
const [matterAdvisoryTypeId, setMatterAdvisoryTypeId] = useState('');
const [matterAdvisoryTypeTerm, setMatterAdvisoryTypeTerm] = useState('');
const [matterAdvisoryTypeValue, setMatterAdvisoryValue] = useState('');
const [matterAdvisoryTypeDesc, setMatterAdvisoryDesc] = useState('');
const [matterAdvisoryTypeReportList, setMatterAdvisoryTypeReportList] = useState<ISelectData[]>([])

const [stateReportList, setStateReportList] = useState<ISelectData[]>([]);
const [states, setStates] = useState<IAutoCompleteData[]>([]);
const [stateId, setReportStateId] = useState<string>('');
const [stateValue, setReportStateValue] = useState<string>('');
const [stateDesc, setReportStateDesc] = useState<string>('');

const [matterEventType, setMatterEventType] = useState<IAutoCompleteData[]>([]);
const [matterEventTypeId, setMatterEventTypeId] = useState('');
const [matterEventTypeTerm, setMatterEventTypeTerm] = useState('');
const [matterEventTypeValue, setMatterEventTypeValue] = useState('');
const [matterEventTypeDesc, setMatterEventTypeDesc] = useState('');
const [matterEventTypeReportList, setMatterEventTypeReportList] = useState<ISelectData[]>([]);

const [matterDemandType, setMatterDemandType] = useState<IAutoCompleteData[]>([]);
const [matterDemandTypeId, setMatterDemandTypeId] = useState('');
const [matterDemandTypeTerm, setMatterDemandTypeTerm] = useState('');
const [matterDemandTypeValue, setMatterDemandTypeValue] = useState('');
const [matterDemandTypeDesc, setMatterDemandTypeDesc] = useState('');
const [matterDemandTypeReportList, setMatterDemandTypeReportList] = useState<ISelectData[]>([]);

const [responsible, setResponsible] = useState<IAutoCompleteData[]>([]);
const [responsibleId, setResponsibleId] = useState('');
const [responsibleTerm, setResponsibleTerm] = useState('');
const [responsibleValue, setResponsibleValue] = useState('');
const [responsibleDesc, setResponsibleDesc] = useState('');
const [responsibleReportList, setResponsibleReportList] = useState<ISelectData[]>([]);

const [markers, setMarkers] = useState<string>("");
const [matterTitle, setMatterTitle] = useState<string>("");
const [markersReportList, setMarkersReportList] = useState<ISelectData[]>([]);

const [matterEventQty, setMatterEventQty] = useState<string>('01');
const [calendarEventQty, setCalendarEventQty] = useState<string>('00');
const [daysWithoutQty, setDaysWithoutQty] = useState<string>("")
const [daysWithQty, setDaysWithQty] = useState<string>("")
const [matterType, setMatterType] = useState<string>("legal")
const [privateEvent, setPrivateEvent] = useState<string>("Y")
const [orderBy, setOrderBy] = useState<string>("nom_ClientePrincipal")
const [reportLayout, setReportLayout] = useState<string>("simple")

const [dtaEventStart, setDtaEventStart] = useState<string>("")
const [dtaEventEnd, setDtaEventEnd] = useState<string>("")

const [dtaDistributionStart, setDtaDistributionStart] = useState<string>("")
const [dtaDistributionEnd, setDtaDistributionEnd] = useState<string>("")

const [dtaEntradaStart, setDtaEntradaStart] = useState<string>("")
const [dtaEntradaEnd, setDtaEntradaEnd] = useState<string>("")

const [dtaEncerramentoStart, setDtaEncerramentoStart] = useState<string>("")
const [dtaEncerramentoEnd, setDtaEncerramentoEnd] = useState<string>("")

const [isGeneratingReport, setIsGeneratingReport] = useState(false)
const [idReportGenerate, setIdReportGenerate] = useState<number>(0)

const [printHudeData, setPrintHudeData] = useState<boolean>(false);
const [showReportOpenFileModal, setShowReportOpenFileModal] = useState<boolean>(false);
const [reportLink, setReportLink] = useState<string>('');


// When exists report id verify if is avaiable every 5 seconds
useEffect(() => {

  if (idReportGenerate > 0){
    const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 7000);
  }

},[idReportGenerate])

useEffect(() => {

  if (isCancelMessage){

    if (caller === 'dataWarning')
    {
      setHudeDataWarning(false)
      setIdReportGenerate(0)
      setPrintHudeData(false)
      setButtonText("Gerar Relatório");
      handleCancelMessage(false)
    }
  }

},[isCancelMessage, caller]);


useEffect(() => {

  if(isConfirmMessage)
  {
    if (caller === 'dataWarning')
    {
      // setHudeDataWarning(false)
      setPrintHudeData(true)
      setIdReportGenerate(0)
      // handleCaller("")
      // handleGenerateReport()
  
    }

    // handleConfirmMessage(false)
  }
},[isConfirmMessage, caller]);

useEffect(() => {

  if(printHudeData)
  {
    
      setHudeDataWarning(false)
      // setPrintHudeData(true)
      handleCaller("")
      handleGenerateReport()

    handleConfirmMessage(false)
  }
},[printHudeData]);


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
        setButtonText("Gerar Relatório");
        clearInterval(checkInterval);
        setIsGeneratingReport(false)

        addToast({
          type: "info",
          title: "Verificar filtros",
          description: "Não foram encontrados dados de processo, verifique os filtros aplicados."
        })
      }

      if (response.data == "E"){
        clearInterval(checkInterval);
        setIsGeneratingReport(false)
        setButtonText("Gerar Relatório");

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

  setReportLink(response.data.des_Parametro)
  setIdReportGenerate(0)
  setPrintHudeData(false)
  setButtonText("Gerar Relatório");

  const newWin = window.open(`${response.data.des_Parametro}`, '_blank');
  
  if(!newWin || newWin.closed || typeof newWin.closed=='undefined')
    setShowReportOpenFileModal(true)
}


const CloseReportModal = async () => {
  setShowReportOpenFileModal(false)
  setReportLink('')
}


useDelay(() => {
  if (customerTerm.length > 0){
    LoadCustomer()
  }
}, [customerTerm], 1000)

useDelay(() => {
  if (customerGroupTerm.length > 0){
    LoadCustomerGroup()
  }
}, [customerGroupTerm], 1000)

useDelay(() => {
  if (customerPositionTerm.length > 0){
    LoadCustomerPosition()
  }
}, [customerPositionTerm], 1000)

useDelay(() => {
  if (opposingTerm.length > 0){
    LoadOpposing()
  }
}, [opposingTerm], 1000)

useDelay(() => {
  if (lawyerTerm.length > 0){
    LoadLawyer()
  }
}, [lawyerTerm], 1000)

useDelay(() => {
  if (legalCauseTerm.length > 0){
    LoadLegalCause()
  }
}, [legalCauseTerm], 1000)

useDelay(() => {
  if (matterStatusTerm.length > 0){
    LoadMatterStatus()
  }
}, [matterStatusTerm], 1000)

useDelay(() => {
  if (matterSolutionTerm.length > 0){
    LoadMatterSolution()
  }
}, [matterSolutionTerm], 1000)

useDelay(() => {
  if (matterProbabilityTerm.length > 0){
    LoadMatterProbability()
  }
}, [matterProbabilityTerm], 1000)

useDelay(() => {
  if (courtTerm.length > 0){
    LoadCourt()
  }
}, [courtTerm], 1000)

useDelay(() => {
  if (matterPhaseTerm.length > 0){
    LoadMatterPhase()
  }
}, [matterPhaseTerm], 1000)

useDelay(() => {
  if (legalNatureTerm.length > 0){
    LoadLegalNature()
  }
}, [legalNatureTerm], 1000)

useDelay(() => {
  if (matterAdvisoryTypeTerm.length > 0){
    LoadAdvisoryType()
  }
}, [legalNatureTerm], 1000)

useDelay(() => {
  if (matterEventTypeTerm.length > 0){
    LoadMatterEventType()
  }
}, [matterEventTypeTerm], 1000)

useDelay(() => {
  if (matterDemandTypeTerm.length > 0){
    LoadMatterDemandType()
  }
}, [matterDemandTypeTerm], 1000)

useDelay(() => {
  if (responsibleTerm.length > 0){
    LoadResponsible()
  }
}, [responsibleTerm], 1000)


useEffect(() => {
  LoadCustomer()
  LoadCustomerGroup()
  LoadCustomerPosition()
  LoadOpposing()
  LoadLawyer()
  LoadLegalCause()
  LoadMatterStatus()
  LoadMatterSolution()
  LoadMatterProbability()
  LoadCourt()
  LoadMatterPhase()
  LoadLegalNature()
  LoadStates()
  LoadMatterEventType()
  LoadMatterDemandType()
  LoadResponsible()
  LoadAdvisoryType()
},[])


const LoadCustomer = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? customerValue:customerTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<ISubject[]>('/Clientes/ListarPorNome', {
      filterClause: filter,
      rows: 50,
      token,
    });

    const listCustomer: IAutoCompleteData[] = []

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


const LoadCustomerGroup = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? customerGroupValue:customerGroupTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ICustomerGroup[]>('/GrupoCliente/ListarGrupoClientes', {
      params:{
      filterClause: filter,
      rows: 50,
      token,
      }
    });

    const listCustomerGroup: IAutoCompleteData[] = []

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


const LoadCustomerPosition = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? customerPositionValue:customerPositionTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ICustomerPosition[]>('/Parte/ListarPorNome', {
      params:{
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listCustomerPosition: IAutoCompleteData[] = []

    response.data.map(item => {
      return listCustomerPosition.push({
        id: item.positionId,
        label: item.positionName
      })
    })
    
    setCustomerPosition(listCustomerPosition)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadOpposing = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? opposingValue:opposingTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<IOpposing[]>('/Contrario/ListarPorNome', {
      filterDesc: filter,
      token,
    });

    const listOpposing: IAutoCompleteData[] = []

    response.data.map(item => {
      return listOpposing.push({
        id: item.id,
        label: item.value
      })
    })
    
    setOpposing(listOpposing)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadLawyer = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? lawyerValue:lawyerTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ILawyer[]>('/Advogados/ListarPorNome', {
      params:{
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listLawyer: IAutoCompleteData[] = []

    response.data.map(item => {
      return listLawyer.push({
        id: item.id,
        label: item.value
      })
    })
    
    setLawyer(listLawyer)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadLegalCause = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? legalCauseValue:legalCauseTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ILegalCause[]>('/AcaoJudicial/ListarAcaojudicial', {
      params:{
      filterClause: filter,
      page: 50,
      token,
      }
    });

    const listLegalCause: IAutoCompleteData[] = []

    response.data.map(item => {
      return listLegalCause.push({
        id: item.id,
        label: item.value
      })
    })
    
    setLegalCause(listLegalCause)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadMatterStatus = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterStatusValue:matterStatusTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IMatterStatus[]>('/StatusProcesso/ListarStatusProcesso', {
      params:{
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listMatterStatus: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterStatus.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterStatus(listMatterStatus)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadMatterSolution = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterSolutionValue:matterSolutionTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IMatterSolution[]>('/SolucaoProcesso/ListarSoluçãoProcesso', {
      params:{
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listMatterSolution: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterSolution.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterSolution(listMatterSolution)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadMatterProbability = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterProbabilityValue:matterProbabilityTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IMatterProbability[]>('/ProbabilidadeProcesso/ListarProbabilidadeProcesso', {
      params:{
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listMatterProbability: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterProbability.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterProbability(listMatterProbability)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadCourt = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? courtValue:courtTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ICourt[]>('/Forum/ListarCombo', {
      params:{rows: 50, filterClause: filter, token}
    });

    const listCourt: IAutoCompleteCourtData[] = []

    response.data.map(item => {
      return listCourt.push({
        id: item.forumId,
        label: item.forumName,
        federalUnitName: item.federalUnitName
      })
    })
    
    setCourt(listCourt)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadMatterPhase = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterPhaseValue:matterPhaseTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IMatterPhase[]>('/FaseProcessual/ListarFaseProcessual', {
      params:{
      rows: 50,
      filterClause: filter,
      token,
      }
    });

    const listMatterPhase: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterPhase.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterPhase(listMatterPhase)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadLegalNature = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? legalNatureValue:legalNatureTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ILegalNature[]>('/NaturezaJuridica/ListarNaturezaJuridica', {
      params:{
      filterClause: filter,
      rows: 50,
      token,
      }
    });

    const listLegalNature: IAutoCompleteData[] = []

    response.data.map(item => {
      return listLegalNature.push({
        id: item.id,
        label: item.value
      })
    })
    
    setLegalNature(listLegalNature)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}

const LoadAdvisoryType = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterAdvisoryTypeValue:matterAdvisoryTypeTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IAdvisoryType[]>('/TipoConsultivo/ListarCombo', {
      params:{
      filterClause: filter,
      rows: 50,
      token,
      }
    });

    const listMatterAdvisoryType: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterAdvisoryType.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterAdvisoryType(listMatterAdvisoryType)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadStates = async () => {

  try {
    const response = await api.post('/Estados/Listar', {
      token
    });

    const listStates: IAutoCompleteData[] = []

    response.data.map(item => {
      return listStates.push({
        id: item.id,
        label: item.value
      })
    })
    
    setStates(listStates)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadMatterEventType = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterEventTypeValue:matterEventTypeTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<IMatterEventType[]>('/TipoAcompanhamento/ListarCombo', {
      page: 0,
      rows: 50,
      filterClause: filter,
      token,
    });

    const listMatterEventType: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterEventType.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterEventType(listMatterEventType)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadMatterDemandType = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? matterDemandTypeValue:matterDemandTypeTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IMatterDemandType[]>('/TipoPedidoProcesso/ListarCombo', {
      params:{rows: 50, filterClause: filter, token}
    });

    const listMatterDemandType: IAutoCompleteData[] = []

    response.data.map(item => {
      return listMatterDemandType.push({
        id: item.id,
        label: item.value
      })
    })
    
    setMatterDemandType(listMatterDemandType)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadResponsible = async (userName?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? responsibleValue:responsibleTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<IResponsible[]>('/Usuario/ListarUsuarios', {
      token,
      userName: filter,
      removeCurrentUser: false
    });

    const listResponsible: IAutoCompleteData[] = []

    response.data.map(item => {
      return listResponsible.push({
        id: item.id,
        label: item.value
      })
    })
    
    setResponsible(listResponsible)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}



 const [buttonText, setButtonText] = useState("Gerar Relatório");
 const changeText = (text) => setButtonText(text);

 // GENERATE REPORT
 const handleGenerateReport = useCallback(async() => {

  if (isGeneratingReport){
    return;
  }

  try {
    const token = localStorage.getItem('@GoJur:token');
  
    setIsGeneratingReport(true)   

    let customerListItens = 'customer=';
    customerReportList.map((customer) => {
      return customerListItens += `${customer.id};`;
    })

    let customerListItensDesc = '';
    customerReportList.map((customer) => {
      return customerListItensDesc += `${customer.label} , `;
    })


    let markersListItens = 'matterMarking=';
    markersReportList.map((markers) => {
      return markersListItens += `${markers};`;
    })

    let markersListItensDesc = '';
    markersReportList.map((markers) => {
      return markersListItensDesc += `${markers} ,`;
    })


    let customerGroupListItens = 'customerGroup=';
    customerGroupReportList.map((customerGroup) => {
      return customerGroupListItens += `${customerGroup.id};`
    })

    let customerGroupListItensDesc = '';
    customerGroupReportList.map((customerGroup) => {
      return customerGroupListItensDesc += `${customerGroup.label} ,`
    })


    let customerPositionListItens = 'customerPosition=';
    customerPositionReportList.map((customerPosition) => {
      return customerPositionListItens += `${customerPosition.id};`
    })

    let customerPositionListItensDesc = '';
    customerPositionReportList.map((customerPosition) => {
      return customerPositionListItensDesc += `${customerPosition.label} ,`
    })


    let opposingListItens = 'opposing=';
    opposingReportList.map((opposing) => {
      return opposingListItens += `${opposing.id};`
    })

    let opposingListItensDesc = '';
    opposingReportList.map((opposing) => {
      return opposingListItensDesc += `${opposing.label} ,`
    })


    let lawyerListItens = 'lawyer=';
    lawyerReportList.map((lawyer) => {
      return lawyerListItens += `${lawyer.id};`
    })

    let lawyerListItensDesc = '';
    lawyerReportList.map((lawyer) => {
      return lawyerListItensDesc += `${lawyer.label} ,`
    })


    let legalCauseListItens = 'legalCause=';
    legalCauseReportList.map((legalCause) => {
      return legalCauseListItens += `${legalCause.id};`
    })

    let legalCauseListItensDesc = '';
    legalCauseReportList.map((legalCause) => {
      return legalCauseListItensDesc += `${legalCause.label} ,`
    })


    let advisoryTypeListItens = 'advisoryType=';
    matterAdvisoryTypeReportList.map((advisoryType) => {
      return advisoryTypeListItens += `${advisoryType.id};`
    })


    let advisoryTypeListItensDesc = '';
    matterAdvisoryTypeReportList.map((advisoryType) => {
      return advisoryTypeListItensDesc += `${advisoryType.label} ,`
    })


    let matterStatusListItens = 'matterStatus=';
    matterStatusReportList.map((matterStatus) => {
      return matterStatusListItens += `${matterStatus.id};`
    })


    let matterStatusListItensDesc = '';
    matterStatusReportList.map((matterStatus) => {
      return matterStatusListItensDesc += `${matterStatus.label} ,`
    })


    let matterSolutionListItens = 'matterDecision=';
    matterSolutionReportList.map((matterSolution) => {
      return matterSolutionListItens += `${matterSolution.id};`
    })

    let matterSolutionListItensDesc = '';
    matterSolutionReportList.map((matterSolution) => {
      return matterSolutionListItensDesc += `${matterSolution.label} ,`
    })


    let matterProbabilityListItens = 'matterProbab=';
    matterProbabilityReportList.map((matterProbability) => {
      return matterProbabilityListItens += `${matterProbability.id};`
    })

    let matterProbabilityListItensDesc = '';
    matterProbabilityReportList.map((matterProbability) => {
      return matterProbabilityListItensDesc += `${matterProbability.label} ,`
    })


    let courtListItens = 'court=';
    courtReportList.map((court) => {
      return courtListItens += `${court.id};`
    })

    let courtListItensDesc = '';
    courtReportList.map((court) => {
      return courtListItensDesc += `${court.label} ,`
    })

    let courtListItensFederalUnitName = '';
    courtReportList.map((court) => {
      return courtListItensFederalUnitName += `${court.federalUnitName},`
    })


    let matterPhaseListItens = 'matterPhase=';
    matterPhaseReportList.map((matterPhase) => {
      return matterPhaseListItens += `${matterPhase.id};`
    })

    let matterPhaseListItensDesc = '';
    matterPhaseReportList.map((matterPhase) => {
      return matterPhaseListItensDesc += `${matterPhase.label} ,`
    })


    let legalNatureListItens = 'legalNature=';
    legalNatureReportList.map((legalNature) => {
      return legalNatureListItens += `${legalNature.id};`
    })

    let legalNatureListItensDesc = '';
    legalNatureReportList.map((legalNature) => {
      return legalNatureListItensDesc += `${legalNature.label} ,`
    })


    let matterEventTypeListItens = 'matterEventType=';
    matterEventTypeReportList.map((matterEventType) => {
      return matterEventTypeListItens += `${matterEventType.id};`
    })

    let matterEventTypeListItensDesc = '';
    matterEventTypeReportList.map((matterEventType) => {
      return matterEventTypeListItensDesc += `${matterEventType.label} ,`
    })


    let matterDemandTypeListItens = 'matterDemand=';
    matterDemandTypeReportList.map((matterDemandType) => {
      return matterDemandTypeListItens += `${matterDemandType.id};`
    })

    let matterDemandTypeListItensDesc = '';
    matterDemandTypeReportList.map((matterDemandType) => {
      return matterDemandTypeListItensDesc += `${matterDemandType.label} ,`
    })


    let responsibleListItens = 'matterResponsible=';
    responsibleReportList.map((responsible) => {
      return responsibleListItens += `${responsible.id};`
    })

    let responsibleListItensDesc = '';
    responsibleReportList.map((responsible) => {
      return responsibleListItensDesc += `${responsible.label} ,`
    })


    let stateListItens = 'state=';
    stateReportList.map((state) => {
      return stateListItens += `${state.id}-`
    })

    let stateListItensDesc = '';
    stateReportList.map((state) => {
      return stateListItensDesc += `${state.label}-`
    })

    const response = await api.post('/Processo/GerarRelatorioSimple', {
      customerId: customerListItens,
      customerDesc: customerListItensDesc,
      customerGroupId: customerGroupListItens,
      customerGroupDesc: customerGroupListItensDesc,
      customerPositionId: customerPositionListItens,
      customerPositionDesc: customerPositionListItensDesc,
      opposingId: opposingListItens,
      opposingDesc: opposingListItensDesc,
      lawyerId: lawyerListItens,
      lawyerDesc: lawyerListItensDesc,
      legalCauseId: legalCauseListItens,
      legalCauseDesc: legalCauseListItensDesc,
      matterAdvisoryTypeId: advisoryTypeListItens,
      matterAdvisoryTypeDesc: advisoryTypeListItensDesc,
      matterStatusId: matterStatusListItens,
      matterStatusDesc: matterStatusListItensDesc,
      matterSolutionId: matterSolutionListItens,
      matterSolutionDesc: matterSolutionListItensDesc,
      matterProbabilityId: matterProbabilityListItens,
      matterProbabilityDesc: matterProbabilityListItensDesc,
      courtId: courtListItens,
      federalUnitName: courtListItensFederalUnitName,
      courtDesc: courtListItensDesc,
      matterPhaseId: matterPhaseListItens,
      matterPhaseDesc: matterPhaseListItensDesc,
      legalNatureId: legalNatureListItens,
      legalNatureDesc: legalNatureListItensDesc,
      matterEventTypeId: matterEventTypeListItens,
      matterEventTypeDesc: matterEventTypeListItensDesc,
      matterDemandTypeId: matterDemandTypeListItens,
      matterDemandTypeDesc: matterDemandTypeListItensDesc,
      responsibleId: responsibleListItens,
      responsibleDesc: responsibleListItensDesc,
      matterMarkers: markersListItens,
      matterMarkersDesc: markersListItensDesc,
      matterTitle,
      calendarEventQty,
      matterEventQty,
      dtaEventStart,
      dtaEventEnd,
      daysWithoutQty,
      daysWithQty,
      dtaDistributionStart,
      dtaDistributionEnd,
      dtaEntradaStart,
      dtaEntradaEnd,
      dtaEncerramentoStart,
      dtaEncerramentoEnd,
      matterType,
      stateId: stateListItens,
      stateDesc: stateListItensDesc,
      privateEvent,
      orderBy,
      reportLayout,
      printHudeData,
      token,

    })

    
    if ( response.data == "code:HugeData"){
      setHudeDataWarning(true)
      setIsGeneratingReport(false)
      return
    }

    setIdReportGenerate(response.data)

  } catch (err: any) {
    setIsGeneratingReport(false)   
    setPrintHudeData(false) 
    addToast({
      type: "info",
      title: "Falha ao gerar o relatório",
      description: err.response.data.Message
    })
  }
},[addToast, customerReportList, customerGroupReportList, customerPositionReportList, opposingReportList, lawyerReportList, legalCauseReportList, matterStatusReportList, matterSolutionReportList, matterProbabilityReportList, courtReportList, matterPhaseReportList, legalNatureReportList, stateReportList, matterEventTypeReportList, matterDemandTypeReportList, responsibleReportList, markersReportList, reportType, hudeDataWarning, printHudeData, customerId, customerDesc, customerGroupId, customerGroupDesc, customerPositionId, customerPositionDesc, opposingId, opposingDesc, lawyerId, lawyerDesc, legalCauseId, legalCauseDesc, matterStatusId, matterStatusDesc, matterSolutionId, matterSolutionDesc, matterProbabilityId, matterProbabilityDesc, courtId, courtDesc, federalUnitName, matterPhaseId, matterPhaseDesc, legalNatureId, legalNatureDesc, matterAdvisoryTypeId, matterAdvisoryTypeDesc, matterEventTypeId, matterEventTypeDesc, matterDemandTypeId, matterDemandTypeDesc, responsibleId, responsibleDesc, matterTitle, calendarEventQty, matterEventQty, dtaEventStart, dtaEventEnd, daysWithoutQty, daysWithQty, dtaDistributionStart, dtaDistributionEnd, dtaEntradaStart, dtaEntradaEnd, dtaEncerramentoStart, dtaEncerramentoEnd, matterType, stateId, stateDesc, privateEvent, orderBy, reportLayout]); 



const handleCustomerSelected = (item) => { 
    
  if (item){
    setCustomerValue(item.label)
    setCustomerDesc(item.label)
    handleListItemCustomer(item)
  }else{
    setCustomerValue('')
    LoadCustomer()
    setCustomerId('')
  }
}

const handleListItemCustomer = (customer) => {

  // if is already add on list return false
  const existItem = customerReportList.filter(item => item.id == customer.id);
  if (existItem.length > 0){
    return;
  }

  setCustomerReportList(previousValues => [...previousValues, customer])
}

const handleRemoveItemCustomer = (customer) => {

  const customerListUpdate = customerReportList.filter(item => item.id != customer.id);
  setCustomerReportList(customerListUpdate)
}


const handleCustomerGroupSelected = (item) => { 
    
  if (item){
    setCustomerGroupValue(item.label)
    setCustomerGroupDesc(item.label)
    handleListItemCustomerGroup(item)
  }else{
    setCustomerGroupValue('')
    LoadCustomerGroup('reset')
    setCustomerGroupId('')
  }
}

const handleListItemCustomerGroup = (customerGroup) => {

  // if is already add on list return false
  const existItem = customerGroupReportList.filter(item => item.id === customerGroup.id);
  if (existItem.length > 0){
    return;
  }

  setCustomerGroupReportList(previousValues => [...previousValues, customerGroup])
}

const handleRemoveItemCustomerGroup = (customerGroup) => {

  const customerGroupListUpdate = customerGroupReportList.filter(item => item.id != customerGroup.id);
  setCustomerGroupReportList(customerGroupListUpdate)
}



const handleCustomerPositionSelected = (item) => { 
    
  if (item){
    setCustomerPositionValue(item.label)
    setCustomerPositionDesc(item.label)
    handleListItemCustomerPosition(item)
  }else{
    setCustomerPositionValue('')
    LoadCustomerPosition('reset')
    setCustomerPositionId('')
  }
}

const handleListItemCustomerPosition = (customerPosition) => {

  // if is already add on list return false
  const existItem = customerPositionReportList.filter(item => item.id === customerPosition.id);
  if (existItem.length > 0){
    return;
  }

  setCustomerPositionReportList(previousValues => [...previousValues, customerPosition])
}

const handleRemoveItemCustomerPosition = (customerPosition) => {

  const customerPositionListUpdate = customerPositionReportList.filter(item => item.id != customerPosition.id);
  setCustomerPositionReportList(customerPositionListUpdate)
}


const handleOpposingSelected = (item) => { 
    
  if (item){
    setOpposingValue(item.label)
    setOpposingDesc(item.label)
    handleListItemOpposing(item)
  }else{
    setOpposingValue('')
    LoadOpposing('reset')
    setOpposingId('')
  }
}

const handleListItemOpposing = (opposing) => {

  // if is already add on list return false
  const existItem = opposingReportList.filter(item => item.id === opposing.id);
  if (existItem.length > 0){
    return;
  }

  setOpposingReportList(previousValues => [...previousValues, opposing])
}

const handleRemoveItemOpposing = (opposing) => {

  const opposingListUpdate = opposingReportList.filter(item => item.id != opposing.id);
  setOpposingReportList(opposingListUpdate)
}


const handleLawyerSelected = (item) => { 
    
  if (item){
    setLawyerValue(item.label)
    setLawyerDesc(item.label)
    handleListItemLawyer(item)
  }else{
    setLawyerValue('')
    LoadLawyer('reset')
    setLawyerId('')
  }
}

const handleListItemLawyer = (lawyer) => {

  // if is already add on list return false
  const existItem = lawyerReportList.filter(item => item.id === lawyer.id);
  if (existItem.length > 0){
    return;
  }

  setLawyerReportList(previousValues => [...previousValues, lawyer])
}

const handleRemoveItemLawyer = (lawyer) => {

  const lawyerListUpdate = lawyerReportList.filter(item => item.id != lawyer.id);
  setLawyerReportList(lawyerListUpdate)
}


const handleLegalCauseSelected = (item) => { 
    
  if (item){
    setLegalCauseValue(item.label)
    setLegalCauseDesc(item.label)
    handleListItemLegalCause(item)
  }else{
    setLegalCauseValue('')
    LoadLegalCause('reset')
    setLegalCauseId('')
  }
}

const handleListItemLegalCause = (legalCause) => {

  // if is already add on list return false
  const existItem = legalCauseReportList.filter(item => item.id === legalCause.id);
  if (existItem.length > 0){
    return;
  }

  setLegalCauseReportList(previousValues => [...previousValues, legalCause])
}

const handleRemoveItemLegalCause = (legalCause) => {

  const legalCauseListUpdate = legalCauseReportList.filter(item => item.id != legalCause.id);
  setLegalCauseReportList(legalCauseListUpdate)
}


const handleMatterStatusSelected = (item) => { 
    
  if (item){
    setMatterStatusValue(item.label)
    setMatterStatusDesc(item.label)
    handleListItemMatterStatus(item)
  }else{
    setMatterStatusValue('')
    LoadMatterStatus('reset')
    setMatterStatusId('')
  }
}

const handleListItemMatterStatus = (matterStatus) => {

  // if is already add on list return false
  const existItem = matterStatusReportList.filter(item => item.id === matterStatus.id);
  if (existItem.length > 0){
    return;
  }

  setMatterStatusReportList(previousValues => [...previousValues, matterStatus])
}

const handleRemoveItemMatterStatus = (matterStatus) => {

  const matterStatusListUpdate = matterStatusReportList.filter(item => item.id != matterStatus.id);
  setMatterStatusReportList(matterStatusListUpdate)
}


const handleMatterSolutionSelected = (item) => { 
    
  if (item){
    setMatterSolutionValue(item.label)
    setMatterSolutionDesc(item.label)
    handleListItemMatterSolution(item)
  }else{
    setMatterSolutionValue('')
    LoadMatterSolution('reset')
    setMatterSolutionId('')
  }
}

const handleListItemMatterSolution = (matterSolution) => {

  // if is already add on list return false
  const existItem = matterSolutionReportList.filter(item => item.id === matterSolution.id);
  if (existItem.length > 0){
    return;
  }

  setMatterSolutionReportList(previousValues => [...previousValues, matterSolution])
}

const handleRemoveItemMatterSolution = (matterSolution) => {

  const matterSolutionListUpdate = matterSolutionReportList.filter(item => item.id != matterSolution.id);
  setMatterSolutionReportList(matterSolutionListUpdate)
}


const handleMatterProbabilitySelected = (item) => { 
    
  if (item){
    setMatterProbabilityValue(item.label)
    setMatterProbabilityDesc(item.label)
    handleListItemMatterProbability(item)
  }else{
    setMatterProbabilityValue('')
    LoadMatterProbability('reset')
    setMatterProbabilityId('')
  }
}


const handleListItemMatterProbability = (matterProbability) => {

  // if is already add on list return false
  const existItem = matterProbabilityReportList.filter(item => item.id === matterProbability.id);
  if (existItem.length > 0){
    return;
  }

  setMatterProbabilityReportList(previousValues => [...previousValues, matterProbability])
}

const handleRemoveItemMatterProbability = (matterProbability) => {

  const matterProbabilityListUpdate = matterProbabilityReportList.filter(item => item.id != matterProbability.id);
  setMatterProbabilityReportList(matterProbabilityListUpdate)
}



const handleCourtSelected = (item) => { 
    
  if (item){
    setCourtValue(item.label)
    setCourtDesc(item.label)
    setFederalUnitName(item.federalUnitName)
    handleListItemCourt(item)
  }else{
    setCourtValue('')
    LoadCourt('reset')
    setCourtId('')
  }
}

const handleListItemCourt = (court) => {

  // if is already add on list return false
  const existItem = courtReportList.filter(item => item.id === court.id);
  if (existItem.length > 0){
    return;
  }

  setCourtReportList(previousValues => [...previousValues, court])
}

const handleRemoveItemCourt = (court) => {

  const courtListUpdate = courtReportList.filter(item => item.id != court.id);
  setCourtReportList(courtListUpdate)
}


const handleMatterPhaseSelected = (item) => { 
    
  if (item){
    setMatterPhaseValue(item.label)
    setMatterPhaseDesc(item.label)
    handleListItemMatterPhase(item)
  }else{
    setMatterPhaseValue('')
    LoadMatterPhase('reset')
    setMatterPhaseId('')
  }
}

const handleListItemMatterPhase = (matterPhase) => {

  // if is already add on list return false
  const existItem = matterPhaseReportList.filter(item => item.id === matterPhase.id);
  if (existItem.length > 0){
    return;
  }

  setMatterPhaseReportList(previousValues => [...previousValues, matterPhase])
}

const handleRemoveItemMatterPhase = (matterPhase) => {

  const matterPhaseListUpdate = matterPhaseReportList.filter(item => item.id != matterPhase.id);
  setMatterPhaseReportList(matterPhaseListUpdate)
}


const handleLegalNatureSelected = (item) => { 
    
  if (item){
    setLegalNatureValue(item.label)
    setLegalNatureDesc(item.label)
    handleListItemLegalNature(item)
  }else{
    setLegalNatureValue('')
    LoadLegalNature('reset')
    setLegalNatureId('')
  }
}

const handleListItemLegalNature = (legalNature) => {

  // if is already add on list return false
  const existItem = legalNatureReportList.filter(item => item.id === legalNature.id);
  if (existItem.length > 0){
    return;
  }

  setLegalNatureReportList(previousValues => [...previousValues, legalNature])
}

const handleRemoveItemLegalNature = (legalNature) => {

  const legalNatureListUpdate = legalNatureReportList.filter(item => item.id != legalNature.id);
  setLegalNatureReportList(legalNatureListUpdate)
}


const handleAdvisoryTypeSelected = (item) => { 
    
  if (item){
    setMatterAdvisoryValue(item.label)
    setMatterAdvisoryDesc(item.label)
    handleListAdvisoryType(item)

    setMatterType("advisory")
  }else{
    setMatterAdvisoryValue('')
    LoadAdvisoryType('reset')
    setMatterAdvisoryTypeId('')
  }
}

const handleListAdvisoryType = (AdvisoryType) => {

  // if is already add on list return false
  const existItem = matterAdvisoryTypeReportList.filter(item => item.id === AdvisoryType.id);
  if (existItem.length > 0){
    return;
  }

  setMatterAdvisoryTypeReportList(previousValues => [...previousValues, AdvisoryType])
}

const handleRemoveItemAdvisoryType = (AdvisoryType) => {

  const matterAdvisoryTypeListUpdate = matterAdvisoryTypeReportList.filter(item => item.id != AdvisoryType.id);
  setMatterAdvisoryTypeReportList(matterAdvisoryTypeListUpdate)

  if(matterAdvisoryTypeListUpdate.length == 0){
    setMatterType("legal")
  }
}

const handleStateSelected = (item) => { 
  setReportStateValue(item.target.children[item.target.selectedIndex].label)
  handleListItemState(item)
}

const handleListItemState = (state) => {

  // if is already add on list return false
  const existItem = stateReportList.filter(item => item.id === state.target.value);
  if (existItem.length > 0){
    return;
  }

  const stateObject = {
    label:state.target.children[state.target.selectedIndex].label,
    id: state.target.value
  }

  setStateReportList((previousValues => [...previousValues, stateObject]))
}

const handleRemoveItemState = (state) => {

  const stateListUpdate = stateReportList.filter(item => item.id != state.id);
  setStateReportList(stateListUpdate)
}


const handleMatterEventTypeSelected = (item) => { 
    
  if (item){
    setMatterEventTypeValue(item.label)
    setMatterEventTypeDesc(item.label)
    handleListItemMatterEventType(item)
  }else{
    setMatterEventTypeValue('')
    LoadMatterEventType('reset')
    setMatterEventTypeId('')
  }
}

const handleListItemMatterEventType = (matterEventType) => {

  // if is already add on list return false
  const existItem = matterEventTypeReportList.filter(item => item.id === matterEventType.id);
  if (existItem.length > 0){
    return;
  }

  setMatterEventTypeReportList(previousValues => [...previousValues, matterEventType])
}

const handleRemoveItemMatterEventType = (matterEventType) => {

  const matterEventTypeListUpdate = matterEventTypeReportList.filter(item => item.id != matterEventType.id);
  setMatterEventTypeReportList(matterEventTypeListUpdate)
}


const handleMatterDemandTypeSelected = (item) => { 
    
  if (item){
    setMatterDemandTypeValue(item.label)
    setMatterDemandTypeDesc(item.label)
    handleListItemMatterDemandType(item)
  }else{
    setMatterDemandTypeValue('')
    LoadMatterDemandType('reset')
    setMatterDemandTypeId('')
  }
}

const handleListItemMatterDemandType = (matterDemandType) => {

  // if is already add on list return false
  const existItem = matterDemandTypeReportList.filter(item => item.id === matterDemandType.id);
  if (existItem.length > 0){
    return;
  }

  setMatterDemandTypeReportList(previousValues => [...previousValues, matterDemandType])
}

const handleRemoveItemMatterDemandType = (matterDemandType) => {

  const matterDemandTypeListUpdate = matterDemandTypeReportList.filter(item => item.id != matterDemandType.id);
  setMatterDemandTypeReportList(matterDemandTypeListUpdate)
}


const handleResponsibleSelected = (item) => { 
    
  if (item){
    setResponsibleValue(item.label)
    setResponsibleDesc(item.label)
    handleListItemResponsible(item)
  }else{
    setResponsibleValue('')
    LoadResponsible('')
    setResponsibleId('')
  }
}

const handleListItemResponsible = (responsible) => {

  // if is already add on list return false
  const existItem = responsibleReportList.filter(item => item.id === responsible.id);
  if (existItem.length > 0){
    return;
  }

  setResponsibleReportList(previousValues => [...previousValues, responsible])
}

const handleRemoveItemResponsible = (responsible) => {

  const responsibleListUpdate = responsibleReportList.filter(item => item.id != responsible.id);
  setResponsibleReportList(responsibleListUpdate)
}


const handleListIteMarkers = (event) => {

  if (event.charCode == 13){

     const existItem = markersReportList.filter(item => item === event.target.value);

     if (existItem.length > 0){
      return;
  }
  
    if(event.target.value == ""){
      return
    }

     markersReportList.push(event.target.value)
     setMarkers("")
   
  }
}


const handleRemoveItemMarkers = (markers) => {

  const markersListUpdate = markersReportList.filter(item => item != markers);
  setMarkersReportList(markersListUpdate)
}


  return (

    <Container>

      {(showReportOpenFileModal) && <Overlay /> }
      {(showReportOpenFileModal) && <ReportModal callbackFunction={{CloseReportModal, reportLink}} /> }

      {hudeDataWarning && (
        <ConfirmBoxModal
          title="Relatório Processo"
          caller="dataWarning"
          message="O relatório solicitado retornará mais de 500 processos e pode demorar alguns minutos. Clique em Confirmar para confirmar a geração ou Cancelar para acrescentar mais filtros."
        />
      )}

      <HeaderPage />

      <TollBar>


  
        <div className="buttonReturn">
          <button
            className="buttonLinkClick"
            title="Clique para retornar a lista de processos"
            onClick={() => history.push('../../../matter/list')}
            type="submit"
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>
        </div>

      </TollBar>
    
      <Content>

        <header style={{fontSize:"15px"}}>Selecione um ou mais filtros para relatório de processos</header>
        <Form ref={formRef} onSubmit={handleSubmit(console.log)}> 

          
            
          <section id="dados">

            <div style={{ width:"99%", display:"inline-block"}}>
              <AutoCompleteSelect className="selectCustomer">
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

              <ItemList>

                {customerReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCustomer(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


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

              <ItemList>

                {customerGroupReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCustomerGroup(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <div style={{display:"flex", width:"104%"}}>
                <AutoCompleteSelect className="selectCustomerPosition" style={{width:"94.4%"}}>
                  Posição do Cliente 
                  <Select
                    isSearchable   
                    value={customerPosition.filter(options => options.id == customerPositionId)}
                    onChange={handleCustomerPositionSelected}
                    onInputChange={(term) => setCustomerPositionTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={customerPosition}
                  />
                </AutoCompleteSelect>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Posição do cliente no processo - Autor, Réu" />
                </div>
              </div>

              <ItemList>

                {customerPositionReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCustomerPosition(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectOpposing">
                <p>Contrário</p>  
                <Select
                  isSearchable   
                  value={opposing.filter(options => options.id == opposingId)}
                  onChange={handleOpposingSelected}
                  onInputChange={(term) => setOpposingTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={opposing}
                />
              </AutoCompleteSelect>

              <ItemList>

                {opposingReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemOpposing(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectLawyer">
                <p>Advogado</p>  
                <Select
                  isSearchable   
                  value={lawyer.filter(options => options.id == lawyerId)}
                  onChange={handleLawyerSelected}
                  onInputChange={(term) => setLawyerTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={lawyer}
                />
              </AutoCompleteSelect>

              <ItemList>

                {lawyerReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemLawyer(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectLegalCause">
                <p>Ação Judicial</p>  
                <Select
                  isSearchable   
                  value={legalCause.filter(options => options.id == legalCauseId)}
                  onChange={handleLegalCauseSelected}
                  onInputChange={(term) => setLegalCauseTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={legalCause}
                />
              </AutoCompleteSelect>

              <ItemList>

                {legalCauseReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemLegalCause(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>

              <AutoCompleteSelect className="selectAdvisoryType">
                <p>Assunto</p>
                <Select
                   isSearchable   
                   value={matterAdvisoryType.filter(options => options.id == matterAdvisoryTypeId)}
                   onChange={handleAdvisoryTypeSelected}
                   onInputChange={(term) => setMatterAdvisoryTypeTerm(term)}
                   isClearable
                   placeholder=""
                   isLoading={isLoadingComboData}
                   loadingMessage={loadingMessage}
                   noOptionsMessage={noOptionsMessage}
                   styles={selectStyles}              
                   options={matterAdvisoryType}
                />
              </AutoCompleteSelect>

              <ItemList>
                {matterAdvisoryTypeReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemAdvisoryType(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 
              </ItemList>


              <AutoCompleteSelect className="selectMatterStatus">
                Status Processo
                <Select
                  isSearchable   
                  value={matterStatus.filter(options => options.id == matterStatusId)}
                  onChange={handleMatterStatusSelected}
                  onInputChange={(term) => setMatterStatusTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matterStatus}
                />
              </AutoCompleteSelect>

              <ItemList>

                {matterStatusReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMatterStatus(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectMatterSolution">
                Decisão 
                <Select
                  isSearchable   
                  value={matterSolution.filter(options => options.id == matterSolutionId)}
                  onChange={handleMatterSolutionSelected}
                  onInputChange={(term) => setMatterSolutionTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matterSolution}
                />
              </AutoCompleteSelect>

              <ItemList>

                {matterSolutionReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMatterSolution(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectMatterProbability">
                Probabibidade de Êxito 
                <Select
                  isSearchable   
                  value={matterProbability.filter(options => options.id == matterProbabilityId)}
                  onChange={handleMatterProbabilitySelected}
                  onInputChange={(term) => setMatterProbabilityTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matterProbability}
                />
              </AutoCompleteSelect>

              <ItemList>

                {matterProbabilityReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMatterProbability(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectCourt">
                Fórum
                <Select
                  isSearchable   
                  value={court.filter(options => options.id == courtId)}
                  onChange={handleCourtSelected}
                  onInputChange={(term) => setCourtTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={court}
                />
              </AutoCompleteSelect>

              <ItemList>

                {courtReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCourt(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectOpposing">
                Fase Processual 
                <Select
                  isSearchable   
                  value={matterPhase.filter(options => options.id == matterPhaseId)}
                  onChange={handleMatterPhaseSelected}
                  onInputChange={(term) => setMatterPhaseTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matterPhase}
                />
              </AutoCompleteSelect>

              <ItemList>

                {matterPhaseReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMatterPhase(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectOpposing">
                Natureza Jurídica 
                <Select
                  isSearchable   
                  value={legalNature.filter(options => options.id == legalNatureId)}
                  onChange={handleLegalNatureSelected}
                  onInputChange={(term) => setLegalNatureTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={legalNature}
                />
              </AutoCompleteSelect>

              <ItemList>

                {legalNatureReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemLegalNature(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectCustomerPosition">
                Tipo de Acompanhamento
                <Select
                  isSearchable   
                  value={matterEventType.filter(options => options.id == matterEventTypeId)}
                  onChange={handleMatterEventTypeSelected}
                  onInputChange={(term) => setMatterEventTypeTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matterEventType}
                />
              </AutoCompleteSelect>

              <ItemList>

                {matterEventTypeReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMatterEventType(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectOpposing">
                Pedido Processo
                <Select
                  isSearchable   
                  value={matterDemandType.filter(options => options.id == matterDemandTypeId)}
                  onChange={handleMatterDemandTypeSelected}
                  onInputChange={(term) => setMatterDemandTypeTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={matterDemandType}
                />
              </AutoCompleteSelect>

              <ItemList>

                {matterDemandTypeReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMatterDemandType(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectOpposing">
                Responsável
                <Select
                  isSearchable   
                  value={responsible.filter(options => options.id == responsibleId)}
                  onChange={handleResponsibleSelected}
                  onInputChange={(term) => setResponsibleTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={responsible}
                />
              </AutoCompleteSelect>

              <ItemList>

                {responsibleReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemResponsible(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


            </div>


            <div style={{ width:"99%", display:"inline-block", marginLeft:"1%"}}>
              <div style={{display:"flex", marginLeft:"1%", marginTop:"1%"}}>
                <label htmlFor="descricao" style={{width:"100%"}}>
                  Marcadores
                  <input
                    id='teste'
                    style={{ width:"99%", backgroundColor:"white"}}
                    placeholder='Digite o marcador, press. enter...'
                    maxLength={50}
                    type="text"
                    name="marcadores"
                    value={markers}
                    // onKeyPress={(e: ChangeEvent<HTMLInputElement>) => handleListIteMarkers(e, e.target.value)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMarkers(e.target.value)}
                    onKeyPress={(e) => handleListIteMarkers(e)}
                    autoComplete="off"
                  />
                </label>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Após digitar o marcador aperte Enter para utilizá-lo no filtro. É possível utilizar mais de um marcador." />
                </div>
              </div>

              <ItemList>

                {markersReportList.map(item => {
                  return (
                    <span>
                      {item}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemMarkers(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <div style={{display:"flex", marginLeft:"1%", marginTop:"3%"}}>
                <label htmlFor="descricao" style={{width:"100%"}}>
                  Titulo
                  <input
                    maxLength={50}
                    type="text"
                    style={{ width:"99%", backgroundColor:"white"}}
                    name="marcadores"
                    value={matterTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterTitle(e.target.value)}
                    autoComplete="off"
                  />
                </label>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Informe ou título ou parte dele para filtrar." />
                </div>
              </div>


              <div style={{display:"flex", marginLeft:"1%", marginTop:"3.5%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Últimos Compromissos
                  <br />
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={calendarEventQty}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCalendarEventQty(e.target.value)}
                  >
                    <option value="00">Nenhum</option>
                    <option value="01">1</option>
                    <option value="02">2</option>
                    <option value="03">3</option>
                    <option value="04">4</option>
                    <option value="05">5</option>
                    <option value="06">6</option>
                    <option value="07">7</option>
                    <option value="08">8</option>
                    <option value="09">9</option>
                    <option value="10">10</option>
                    <option value="TT">Todos</option>

                  </select>
                </label>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Indique quantos compromissos do processo deseja imprimir - Opção válida somente no layout Ficha Detalhada." />
                </div>
              </div>


              <div style={{marginLeft:"1%", width:"95%", marginTop:"3.5%"}}>
                <label htmlFor="type">
                  Últimos Acompanhamentos
                  <select
                    style={{width:"100%", backgroundColor:"white"}}
                    name="Type"
                    value={matterEventQty}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatterEventQty(e.target.value)}
                  >
                    <option value="01">1</option>
                    <option value="02">2</option>
                    <option value="03">3</option>
                    <option value="04">4</option>
                    <option value="05">5</option>
                    <option value="06">6</option>
                    <option value="07">7</option>
                    <option value="08">8</option>
                    <option value="09">9</option>
                    <option value="10">10</option>
                    <option value="00">Nenhum</option>
                    <option value="TT">Todos</option>

                  </select>
                </label>

              </div>


              <div style={{display:"flex", marginLeft:"1%", width:"95%", marginTop:"3%"}}>
                <div style={{width:"100%"}}>
                  <label htmlFor="data" style={{width:"20%"}}>
                    Data Acomp. Inico
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEventStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEventStart(e.target.value)}
                    />
                  </label>
                </div>

                <div style={{width:"100%", marginLeft:"5%"}}>
                  <label htmlFor="dataFinal" style={{width:"45%"}}>
                    Data Acomp. Final
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEventEnd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEventEnd(e.target.value)}
                    />
                  </label>
                </div>
              </div>


              <div style={{display:"flex", marginLeft:"1%", marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Sem Movimentação
                  <input
                    maxLength={50}
                    type="number"
                    style={{width:"99%", backgroundColor:"white"}}
                    name="marcadores"
                    value={daysWithoutQty}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDaysWithoutQty(e.target.value)}
                    autoComplete="off"
                  />
                </label>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Filtra processos sem movimentação nos últimos X dias - informar número de dias." />
                </div>
              </div>


              <div style={{display:"flex", marginLeft:"1%", marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Movimentado
                  <input
                    maxLength={50}
                    type="number"
                    style={{width:"99%", backgroundColor:"white"}}
                    name="marcadores"
                    value={daysWithQty}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDaysWithQty(e.target.value)}
                    autoComplete="off"
                  />
                </label>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Filtra processos com movimentação nos últimos X número de dias - informar número de dias." />
                </div>
              </div>


              <div style={{display:"flex", marginLeft:"1%", width:"95%", marginTop:"3%"}}>
                <div style={{width:"100%"}}>
                  <label htmlFor="data" style={{width:"20%"}}>
                    Data Distribuição Inicio
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaDistributionStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaDistributionStart(e.target.value)}
                    />
                  </label>
                </div>

                <div style={{width:"100%", marginLeft:"5%"}}>
                  <label htmlFor="dataFinal" style={{width:"45%"}}>
                    Data Distribuição Final
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaDistributionEnd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaDistributionEnd(e.target.value)}
                    />
                  </label>
                </div>
              </div>


              <div style={{display:"flex", marginLeft:"1%", width:"95%", marginTop:"3%"}}>
                <div style={{width:"100%"}}>
                  <label htmlFor="data" style={{width:"20%"}}>
                    Data Entrada Inicio
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEntradaStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEntradaStart(e.target.value)}
                    />
                  </label>
                </div>

                <div style={{width:"100%", marginLeft:"5%"}}>
                  <label htmlFor="dataFinal" style={{width:"45%"}}>
                    Data Entrada Final
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEntradaEnd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEntradaEnd(e.target.value)}
                    />
                  </label>
                </div>
              </div>


              <div style={{display:"flex", marginLeft:"1%", width:"95%", marginTop:"3%"}}>
                <div style={{width:"100%"}}>
                  <label htmlFor="data" style={{width:"20%"}}>
                    Data Encerramento Inicio
                    <input 
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEncerramentoStart}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEncerramentoStart(e.target.value)}
                    />
                  </label>
                </div>

                <div style={{width:"100%", marginLeft:"5%"}}>
                  <label htmlFor="dataFinal" style={{width:"45%"}}>
                    Data Encerramento Final
                    <input
                      style={{backgroundColor:"white"}}
                      type="date"
                      value={dtaEncerramentoEnd}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEncerramentoEnd(e.target.value)}
                    />
                  </label>
                </div>
              </div>


              <div style={{marginLeft:"1%", width:"95.5%", marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"99%"}}>
                  Tipo Processo
                  <br />
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={matterType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatterType(e.target.value)}
                  >
                    <option value="legal">Jurídico</option>
                    <option value="advisory">Consultivo</option>

                  </select>
                </label>

              </div>


              <div style={{marginLeft:"1%", width:"94.5%", marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Estado
                  <br />
                  <select
                    style={{backgroundColor:"white"}}
                    name="userType"
                    value={stateId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleStateSelected(e)}
                  >
                    <option value="0">Selecione</option>

                    {states.map((option, i) => (
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

              <ItemList>

                {stateReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemState(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <div style={{display:"flex", marginLeft:"1%", marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Imprime Privado ?
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={privateEvent}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPrivateEvent(e.target.value)}
                  >
                    <option value="Y">Sim</option>
                    <option value="N">Não</option>

                  </select>
                </label>

                <div style={{marginTop:"auto", marginBottom:"auto"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"60%"}} className='infoMessage' title="Determina se imprime ou não os acompanhamentos marcados para não compartilhar com o cliente." />
                </div>
              </div>


              <div style={{marginLeft:"1%", width:"95.5%" , marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Ordenar por
                  <br />
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={orderBy}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrderBy(e.target.value)}
                  >
                    <option value="nom_ClientePrincipal">Cliente</option>
                    <option value="nom_ContrarioPrincipal">Contrário</option>
                    <option value="dta_Acompanhamento desc">Acompanhamento mais recente</option>
                    <option value="cod_PastaFmt">Pasta</option>
                    <option value="nom_Forum">Fórum / Vara</option>

                  </select>
                </label>

              </div>


              <div style={{marginLeft:"1%", width:"95.5%", marginTop:"3%"}}>
                <label htmlFor="type" style={{width:"100%"}}>
                  Layout
                  <br />
                  <select
                    style={{width:"99%", backgroundColor:"white"}}
                    name="Type"
                    value={reportLayout}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setReportLayout(e.target.value)}
                  >
                    <option value="simple">Lista Simples</option>
                    <option value="shortRecord">Lista - Ficha Resumida</option>
                    <option value="detailedRecord">Ficha Detalhada</option>
                    <option value="excel">Excel</option>

                  </select>
                </label>

              </div>
              
            </div>

                                                                                                                              
          </section>

          <div style={{float:"right", marginTop:"5%", marginLeft:"80%"}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=>{ handleGenerateReport(); changeText("Gerando Relatório ") }}
              title="Clique para gerar o relatório de processos"
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

  )
};

export default MatterReportSimple;
