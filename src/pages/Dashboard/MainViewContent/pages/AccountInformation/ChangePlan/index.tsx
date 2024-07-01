/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import api from 'services/api';
import { useHistory } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FaFileContract, FaRegTimesCircle } from 'react-icons/fa';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles} from 'Shared/utils/commonFunctions';
import { GridSubContainer } from 'Shared/styles/GlobalStyle';
import { useConfirmBox } from 'context/confirmBox';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { useToast } from 'context/toast';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { languageGridEmpty, languageGridLoading } from 'Shared/utils/commonConfig';
import { MdNewReleases } from 'react-icons/md';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { BiTrash } from 'react-icons/bi';
import Select from 'react-select'
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FormatCurrency} from 'Shared/utils/commonFunctions';
import { HeaderPage } from 'components/HeaderPage';
import ChangePlanCustomerModal from './CustomerModal'
import { IPlanData, ISelectPlanData, ISelectResourcesData, IResourcesData, ISelectData, ICustomerPlanData } from '../../Interfaces/IAccountInformation'
import { Container, Content, TaskBar, OverlayModal, ResourceCard} from './styles';

const ChangePlan: React.FC = () => {
  
  // #region STATES
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const history = useHistory();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);

  const [planLightValue, setPlanLightValue] = useState('0');
  const [planLightId, setPlanLightId] = useState<string>("0");

  const [planSmartValue, setPlanSmartValue] = useState('0');
  const [planSmartId, setPlanSmartId] = useState<string>("0");

  const [planEssentialValue, setPlanEssentialValue] = useState('0');
  const [planEssentialId, setPlanEssentialId] = useState<string>("0");

  const [planTopValue, setPlanTopValue] = useState('0');
  const [planTopId, setPlanTopId] = useState<string>("0");

  const [planUserValue, setPlanUserValue] = useState("0");
  const [planUserId, setPlanUserId] = useState<string>("0");

  const [planLightAnualValue, setPlanLightAnualValue] = useState("0");
  const [planLightAnualId, setPlanLightAnualId] = useState<string>("0");

  const [planSmartAnualValue, setPlanSmartAnualValue] = useState("0");
  const [planSmartAnualId, setPlanSmartAnualId] = useState("0");

  const [planEssentialAnualValue, setPlanEssentialAnualValue] = useState("0");
  const [planEssentialAnualId, setPlanEssentialAnualId] = useState<string>("0");

  const [planTopAnualValue, setPlanTopAnualValue] = useState("0");
  const [planTopAnualId, setPlanTopAnualId] = useState<string>("0");

  const [planUserAnualValue, setPlanUserAnualValue] = useState("0")
  const [planUserAnualId, setPlanUserAnualId] = useState("0")

  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [month, setMonth] = useState<boolean>(true);
  const [change, setChange] = useState<boolean>(false);
  const companyPlan = localStorage.getItem('@GoJur:companyPlan')
  const [showChangePlanCustomerModal, setChangePlanCustomerModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("none")
  const [planQtd, setPlanQtd] = useState<string>("1")
  const [resourcesDescription, setResourcesDescription] = useState('');
  const [resourcesId, setResourcesId] = useState('');
  const [resourcesTerm, setResourcesTerm] = useState(''); 
  const [resourceTpo, setResourceTpo] = useState("");
  const [resourceValue, setResourceValue] = useState("")
  const [codReferenceResource, setCodReferenceResource] = useState("")
  const [resources, setResources] = useState<ISelectData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [additionalResourcesList, setAdditionalResourcesList] = useState<ICustomerPlanData[]>([]);
  const [planInformationList, setPlanInformationList] = useState<ICustomerPlanData[]>([]);
  const [defautPlanInformationList, setDefaultPlanInformationList] = useState<ICustomerPlanData[]>([]);
  const [codReferencePlan, setCodReferencePlan] = useState("")

  const [haveResources, setHaveResources] = useState<boolean>(false);
  const [haveChangeResources, setHaveChangesResources] = useState<boolean>(false)
  const [selectedPlanValue, setSelectedPlanValue] = useState("")
  const [selectePlanId, setSelectedPlanId] = useState("")
  const [totalResourcesValue, setTotalResourcesValue] = useState<number>(0)
  const [firstInitialization, setFirstInitialization] = useState<boolean>(false)
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [openInformationModal, setOpenInformationModal] = useState<boolean>(false)
  const [confirmChangePlan, setConfirmChangePlan] = useState<boolean>(false)
  const [selectedChangePlan, setSelectedChangePlan] = useState<string>("")

  const [openinsufficientResourcesModal, setOpenInsufficientResourcesModal] = useState<boolean>(false)
  const [changePlanInformation, setChangePlanInformation] = useState<boolean>(false)
  const [confirmChangePlanInformation, setConfirmChangePlanInformation] = useState<boolean>(false)
  const [confirmOpenChat, setConfirmOpenChat] = useState<boolean>(false)
  const [isSaving , setisSaving] = useState<boolean>();
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(true)
  const addMonitor = localStorage.getItem('@GoJur:addMonitor');
  const addResourceAditional = localStorage.getItem('@GoJur:addResource');
  const [allResources, setAllResources] = useState<ICustomerPlanData[]>([]);

  const [publPFQtd, setPublPFQtd] = useState<string>("0")
  const [publPFValue, setPublPFValue] = useState("")
  const [publPFDesc, setPublPFDesc] = useState("")

  const [publPJQtd, setPublPJQtd] = useState<string>("0")
  const [publPJValue, setPublPJValue] = useState("")
  const [publPJDesc, setPublPJDesc] = useState("")

  const [courtQtd, setCourtQtd] = useState<string>("0")
  const [courtValue, setCourtValue] = useState("")
  const [courtDesc, setCourtDesc] = useState("")

  const [userQtd, setUserQtd] = useState<string>("0")
  const [userValue, setUserValue] = useState("")
  const [userDesc, setUserDesc] = useState("")

  const [publBRQtd, setPublBRQtd] = useState<string>("0")
  const [publBRValue, setPublBRValue] = useState("")
  const [publBRDesc, setPublBRDesc] = useState("")

  const [whatsAppQtd, setWhatsAppQtd] = useState<string>("0")
  const [whatsAppValue, setWhatsAppValue] = useState("")
  const [whatsAppDesc, setWhatsAppDesc] = useState("")

  const [selectPlanId, setSelectPlanId] = useState("0")
  const [selectPlanType, setSelectPlanType] = useState("")

  const [publPFAnualQtd, setPublPFAnualQtd] = useState<string>("0")
  const [publPFAnualValue, setPublPFAnualValue] = useState("")
  const [publPFAnualDesc, setPublPFAnualDesc] = useState("")

  const [publPJAnualQtd, setPublPJAnualQtd] = useState<string>("0")
  const [publPJAnualValue, setPublPJAnualValue] = useState("")
  const [publPJAnualDesc, setPublPJAnualDesc] = useState("")

  const [courtAnualQtd, setCourtAnualQtd] = useState<string>("0")
  const [courtAnualValue, setCourtAnualValue] = useState("")
  const [courtAnualDesc, setCourtAnualDesc] = useState("")

  const [userAnualQtd, setUserAnualQtd] = useState<string>("0")
  const [userAnualValue, setUserAnualValue] = useState("")
  const [userAnualDesc, setUserAnualDesc] = useState("")

  const [publBRAnualQtd, setPublBRAnualQtd] = useState<string>("0")
  const [publBRAnualValue, setPublBRAnualValue] = useState("")
  const [publBRAnualDesc, setPublBRAnualDesc] = useState("")

  const [whatsAppAnualQtd, setWhatsAppAnualQtd] = useState<string>("0")
  const [whatsAppAnualValue, setWhatsAppAnualValue] = useState("")
  const [whatsAppAnualDesc, setWhatsAppAnualDesc] = useState("")
  // #endregion


  useEffect(() => {
    LoadPlans()
  }, [])


  useEffect(() => {
    if (isCancelMessage){
      if (caller === 'confirmOpenInformationModal')
      {
        setOpenInformationModal(false)
        handleCancelMessage(false)
        setSelectedChangePlan("")
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenInformationModal')
      {
        setConfirmChangePlan(true)
      }     
    }
  }, [isConfirmMessage, caller]);
  
  setChange


  useEffect(() => {
    if(confirmChangePlan)
    {  
      setSelectedPlan(selectedChangePlan)
      ModifyPlan(selectePlanId)
      setOpenInformationModal(false)
      setConfirmChangePlan(false)
      handleCaller("")
      handleConfirmMessage(false)
      LoadResources()
    }
  }, [confirmChangePlan]);


  useEffect(() => {
    if(firstInitialization && additionalResourcesList.length > 0){
      additionalResourcesList.map(item => {
        setPlanInformationList(previousValues => [...previousValues, item])
      })
  
      setHaveResources(true)
      setHaveChangesResources(true)
      setFirstInitialization(false)
    }
  }, [firstInitialization])


  useEffect(() => {
    if(haveResources == true){
      let total = 0
      additionalResourcesList.map(item => {
       total += (Number(item.resourceValue) * Number(item.qtd_RecursoIncluso))
      })

      setTotalResourcesValue(total)
    }
    else{
      setTotalResourcesValue(0)
    }
  }, [additionalResourcesList, haveResources])


  useEffect(() => {
    if(haveChangeResources == true){
      if(haveResources == true && document.getElementById('buttn-resources') != null){
        setHaveChangesResources(false)
        const toggleSwitch = document.getElementById('buttn-resources');
        toggleSwitch!.style.left = "0";
      }
      if(haveResources == false  && document.getElementById('buttn-resources') != null){
        setHaveChangesResources(false)
        const toggleSwitch = document.getElementById('buttn-resources');
        toggleSwitch!.style.left = "100px";
      }

      setIsLoadingPlan(true)
    }
  }, [haveChangeResources, haveResources, additionalResourcesList])


  useEffect(() => {
    if(change == true){
      if(month == true){
        setChange(false)
        const toggleSwitch = document.getElementById('buttn');
        toggleSwitch!.style.left = "0";
      }
      if(month == false){
        setChange(false)
        const toggleSwitch = document.getElementById('buttn');
        toggleSwitch!.style.left = "140px";
      }
    }
  }, [change])


  useEffect(() => {
    if (isCancelMessage){
      if (caller === 'confirmOpeninsufficientResourcesModal')
      {
        setOpenInsufficientResourcesModal(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if(isConfirmMessage)
    {
      if (caller === 'confirmOpeninsufficientResourcesModal')
      {
        setConfirmOpenChat(true)
      }     
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if(confirmOpenChat)
    {  
      window.open("https://tawk.to/chat/6257202e7b967b11798a9c59/1g0i5bdqg", '_blank');
      setOpenInsufficientResourcesModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      setConfirmOpenChat(false)
    }
  }, [confirmOpenChat]);


  useEffect(() => {
    if (isCancelMessage){
      if (caller === 'changePlanInformation')
      {
        setChangePlanInformation(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if(isConfirmMessage)
    {
      if (caller === 'changePlanInformation')
      {
        setConfirmChangePlanInformation(true)
      }     
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if(confirmChangePlanInformation)
    {  
      setChangePlanInformation(false)
      setConfirmChangePlanInformation(false)
      handleCaller("")
      handleConfirmMessage(false)
      SaveResources()
    }
  }, [confirmChangePlanInformation]);


  const LoadPlans = async () => {
    if (isLoadingComboData){
      return false;
    }
    
    try {
      const response = await api.get<IPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarBCPlanos', {
        params:{
          filter: "",
          token,
        }
      });

      response.data.map(item => {
        if(item.cod_PlanReference == "GOJURLT"){
          setPlanLightValue(item.planValue)
          setPlanLightId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURLT" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURLT")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURSM"){
          setPlanSmartValue(item.planValue)
          setPlanSmartId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURSM" && (addMonitor == 'true' || addResourceAditional == "true")){        
            setSelectedPlan("GOJURSM")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURES"){
          setPlanEssentialValue(item.planValue)
          setPlanEssentialId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURES" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURES")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURTP"){
          setPlanTopValue(item.planValue)
          setPlanTopId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURTP" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURTP")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURUS"){
          setPlanUserValue(item.planValue)
          setPlanUserId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURUS" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURUS")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURLTAN"){
          setPlanLightAnualValue(item.planValue)
          setPlanLightAnualId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURLTAN" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURLTAN")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }
        
        if(item.cod_PlanReference == "GOJURSMAN"){
          setPlanSmartAnualValue(item.planValue)
          setPlanSmartAnualId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURSMAN" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURSMAN")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURESAN"){
          setPlanEssentialAnualValue(item.planValue)
          setPlanEssentialAnualId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURESAN" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURESAN")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURTPAN"){
          setPlanTopAnualValue(item.planValue)
          setPlanTopAnualId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURTPAN" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURTPAN")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }

        if(item.cod_PlanReference == "GOJURUSAN"){
          setPlanUserAnualValue(item.planValue)
          setPlanUserAnualId(item.cod_PlanoComercial)

          if (companyPlan == "GOJURUSAN" && (addMonitor == 'true' || addResourceAditional == "true")){
            setSelectedPlan("GOJURUSAN")
            setSelectedPlanValue(item.planValue)
            setSelectedPlanId(item.cod_PlanoComercial)
            ModifyPlan(item.cod_PlanoComercial)
            LoadResources()
          }
        }
      })
   
      setIsLoadingComboData(false)
      setIsLoading(false)
    }
    catch (err) {
      setIsLoading(false)
    }
  }


  const LoadResources = async (stateValue?: string) => {
    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? resourcesDescription:resourcesTerm
    if (stateValue == 'reset'){
      filter = ''
      return
    }

    let isMonth = true
    
    if ((addMonitor == 'true' || addResourceAditional == "true") && companyPlan?.includes('AN')){
      isMonth = false    
    }
    else if ((addMonitor == 'true' || addResourceAditional == "true") && companyPlan?.includes('AN') == false){
      isMonth = true
    }
    else {
      isMonth = month
    }

    try {
      const response = await api.get<IResourcesData[]>('/Conta/ListarBRecursosComFiltro', {
        params:{
          filter,
          month: isMonth,
          token,
        }
      });

      console.log(response.data)

      const listResources: ISelectResourcesData[] = []

      response.data.map(item => {
        return listResources.push({
          id: item.cod_RecursoSistema,
          label: item.des_RecursoSistema,
          tpo_Recurso: item.tpo_Recurso,
          cod_ResourceReference: item.cod_ResourceReference,
          resourceValue: item.resourceValue
        })
      })

      response.data.map(item => {
        allResources.push({
          cod_RecursoSistema: item.cod_RecursoSistema,
          des_RecursoSistema: item.des_RecursoSistema,
          tpo_ItemList: item.tpo_Recurso,
          qtd_RecursoIncluso: '',
          tpo_Recurso: item.tpo_Recurso,
          cod_ResourceReference: item.cod_ResourceReference,
          cod_PlanReference: '',
          resourceValue: item.resourceValue
        })
      })

      response.data.map(item => {     
        if(item.cod_ResourceReference == "ADCPPF")
        {
          setPublPFValue(item.resourceValue)
          setPublPFDesc(item.des_RecursoSistema)
        }
        if(item.cod_ResourceReference == "ADCPPJ")
        {
          setPublPJValue(item.resourceValue)
          setPublPJDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADFPMON")
        {
          setCourtValue(item.resourceValue)
          setCourtDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADRUUSER")
        {
          setUserValue(item.resourceValue)
          setUserDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADCPBR")
        {
          setPublBRValue(item.resourceValue)
          setPublBRDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADNWNOTWA")
        {
          setWhatsAppValue(item.resourceValue)
          setWhatsAppDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADCPPFAN")
        {
          setPublPFAnualValue(item.resourceValue)
          setPublPFAnualDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADCPPJAN")
        {
          setPublPJAnualValue(item.resourceValue)
          setPublPJAnualDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADFPMONAN")
        {
          setCourtAnualValue(item.resourceValue)
          setCourtAnualDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADRUUSERAN")
        {
          setUserAnualValue(item.resourceValue)
          setUserAnualDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADCPBRAN")
        {
          setPublBRAnualValue(item.resourceValue)
          setPublBRAnualDesc(item.des_RecursoSistema)
        }
          
        if(item.cod_ResourceReference == "ADNWNTWAAN")
        {
          setWhatsAppAnualValue(item.resourceValue)
          setWhatsAppAnualDesc(item.des_RecursoSistema)
        }
      })

      if (companyPlan?.includes("AN") && addMonitor == "true"){
        response.data.map(item => {     
          if(item.cod_ResourceReference == "ADFPMONAN"){
            setResourcesDescription(item.des_RecursoSistema)
            setResourcesId(item.cod_RecursoSistema)
            setResourceTpo(item.tpo_Recurso)
            setCodReferenceResource(item.cod_ResourceReference)
            setResourceValue(item.resourceValue)
              
          }
        })
      }
      else if (companyPlan?.includes("AN") == false && (addMonitor == "true")){
        response.data.map(item => {
          if(item.cod_ResourceReference == "ADFPMON"){
            setResourcesDescription(item.des_RecursoSistema)
            setResourcesId(item.cod_RecursoSistema)
            setResourceTpo(item.tpo_Recurso)
            setCodReferenceResource(item.cod_ResourceReference)
            setResourceValue(item.resourceValue)    
              
          }
        })
      }
      
      setResources(listResources)

      if (addMonitor == "true" || addResourceAditional == "true"){
        handleClickYes()
      }
      
      localStorage.removeItem('@GoJur:addMonitor');
      localStorage.removeItem('@GoJur:addResource');

      setIsLoadingComboData(false)
      
    }
    catch (err:any) {
      addToast({type: "error", title: "Falha ao carregar recursos.", description: err.response.data.Message})
    }
  }


  const LoadAccountInformation = useCallback(async() => {
    try {
      const response = await api.get<ICustomerPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarInformacoesConta', {
        params:{
        companyId,
        token,
        }
      });

      response.data.map((item) => {
        if(item.tpo_ItemList == "RA") {
          setAdditionalResourcesList(previousValues => [...previousValues, item])         
        }
        if(item.cod_PlanReference == "GOJURLTAN" || item.cod_PlanReference == "GOJURSMAN" || item.cod_PlanReference == "GOJURESAN" || item.cod_PlanReference == "GOJURTPAN" || item.cod_PlanReference == "GOJURUSAN")
        {
          setSelectPlanType("A")
        }
        if(item.cod_PlanReference == "GOJURLT" || item.cod_PlanReference == "GOJURSM" || item.cod_PlanReference == "GOJURES" || item.cod_PlanReference == "GOJURTP" || item.cod_PlanReference == "GOJURUS")
        {
          setSelectPlanType("M")
        }
      })

      response.data.map(item => {
        if(item.cod_ResourceReference == "ADCPPF")
          setPublPFQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADCPPJ")
          setPublPJQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADFPMON")
          setCourtQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADRUUSER")
          setUserQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADCPBR")
          setPublBRQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADNWNOTWA")
          setWhatsAppQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADCPPFAN")
          setPublPFAnualQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADCPPJAN")
          setPublPJAnualQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADFPMONAN")
          setCourtAnualQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADRUUSERAN")
          setUserAnualQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADCPBRAN")
          setPublBRAnualQtd(item.qtd_RecursoIncluso)
        if(item.cod_ResourceReference == "ADNWNTWAAN")
          setWhatsAppAnualQtd(item.qtd_RecursoIncluso)
      })

      setFirstInitialization(true)   
      setIsLoading(false)
      setIsLoadingPlan(false)
    }
    catch (err) {
      setIsLoading(false)
    }
  }, [additionalResourcesList, firstInitialization, planInformationList]);
  

  const ModifyPlan = async (planId: string) => {
    try {
      setIsLoading(true)

      const response = await api.get<ICustomerPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarDadosPlano', {
        params:{
        planId,
        token,
        }
      });

      setPlanInformationList(response.data)
      setDefaultPlanInformationList(response.data)
      setIsLoading(false)
      LoadAccountInformation()
    }
    catch (err: any) {
      setIsLoading(false)
      addToast({type: "error", title: "Falha ao carregar o plano.", description:  err.response.data.Message})
    }
  }
  

  const savePlan = useCallback(async(planId) => {
    if (companyPlan == "GOJURFR"){
      setSelectPlanId(planId)
      handleOpenCustomerModal()
      return
    }

    try {
      setisSaving(true)
      const reponse = await api.post('/Conta/SalvarPlano', {
        companyId,
        fromFree: false,
        planId,
        hasResource: haveResources,
        token
      })
      
      addToast({type: "success", title: "Plano Salvo", description: "O plano foi alterado com sucesso."})
      setisSaving(false)
      history.push('/AccountInformation');
    }
    catch (err: any) {
      if (err.response.data.Message == "insufficientResources"){
        setOpenInsufficientResourcesModal(true)
        setisSaving(false)
        return
      }
      
      if (err.response.data.Message != "insufficientResources" !){
        setisSaving(false)
        addToast({type: "error", title: "Falha ao alterar plano.", description:  err.response.data.Message})
      }  
    }
  }, [planInformationList, companyId, haveResources, additionalResourcesList, defautPlanInformationList]);
  

  const handleClickMonth = () => {
    setMonth(true)
    setChange(true) 
  }


  const handleClickYear = () => {
    setMonth(false)
    setChange(true) 
  }


  const handleClickYes = () => {
    setHaveResources(true)
    setHaveChangesResources(true) 
  }


  const handleSelectPlan = (planReference, planValue, planId) => {
    savePlan(planId)
  }


  const handleOpenInformationModal = (planReference, planValue, planId) => {
    setSelectedChangePlan(planReference)
    setSelectedPlanValue(planValue)
    setSelectedPlanId(planId)
    setOpenInformationModal(true)
  }


  const handleCloseCustomerModal = () => {
    setChangePlanCustomerModal(false)
  }


  const handleOpenCustomerModal = () => {
    setChangePlanCustomerModal(true)
  }


  const handleClickCancel = () => {
    setSelectedPlan("none")
    setSelectedPlanValue("")
    setMonth(true)
    setHaveResources(false)
    setAdditionalResourcesList([])
    setPlanInformationList([])
    setResources([])
    setResourcesDescription("")
    setResourcesId("")
    setResourceTpo("")
    setCodReferenceResource("")
    setResourceValue("")
  }



  const SaveResources = useCallback(async() => {
    if (companyPlan == "GOJURFR"){
      handleOpenCustomerModal()
      return
    }

    const planList = allResources.map(item => 
      item.cod_ResourceReference == "ADCPPF" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(publPFQtd))} 
      : 
      item.cod_ResourceReference == "ADCPPFAN" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(publPFAnualQtd))} 
      : 
      item.cod_ResourceReference == "ADCPPJ" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(publPJQtd))} 
      : 
      item.cod_ResourceReference == "ADCPPJAN" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(publPJAnualQtd))} 
      : 
      item.cod_ResourceReference == "ADFPMON" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(courtQtd))} 
      : 
      item.cod_ResourceReference == "ADFPMONAN" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(courtAnualQtd))} 
      : 
      item.cod_ResourceReference == "ADRUUSER" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(userQtd == "ILIMITADO" ? 0 : userQtd))} 
      : 
      item.cod_ResourceReference == "ADRUUSERAN" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(userAnualQtd == "ILIMITADO" ? 0 : userAnualQtd))} 
      : 
      item.cod_ResourceReference == "ADCPBR" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(publBRQtd))} 
      : 
      item.cod_ResourceReference == "ADCPBRAN" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(publBRAnualQtd))} 
      : 
      item.cod_ResourceReference == "ADNWNOTWA" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(whatsAppQtd))}
      : 
      item.cod_ResourceReference == "ADNWNTWAAN" ? { ...item, qtd_RecursoIncluso: String(Number(item.qtd_RecursoIncluso) + Number(whatsAppAnualQtd))}
      : item
    );

    setAllResources(planList)

    try {
      setisSaving(true)
      const response = await api.post('/Conta/SalvarRecursos', {
        newPlanList: planList,
        token
      })
      
      addToast({type: "success", title: "Plano Salvo", description: "O plano foi alterado com sucesso."})
      setisSaving(false)
      history.push('/AccountInformation');
    }
    catch (err: any) {
      if (err.response.data.Message == "insufficientResources"){
        setOpenInsufficientResourcesModal(true)
        setisSaving(false)
        return
      }
      
      if (err.response.data.Message != "insufficientResources" !){
        setisSaving(false)
        addToast({type: "error", title: "Falha ao alterar plano.", description:  err.response.data.Message})
      }  
    }
  }, [publPFQtd, publPJQtd, courtQtd, userQtd, publBRQtd, whatsAppQtd, publPFAnualQtd, publPJAnualQtd, courtAnualQtd, userAnualQtd, publBRAnualQtd, whatsAppAnualQtd]);


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
    <Container>
      <HeaderPage />

      {(showChangePlanCustomerModal) && <OverlayModal /> }
      {(showChangePlanCustomerModal) && <ChangePlanCustomerModal callbackFunction={{haveResources, planInformationList, handleCloseCustomerModal, selectPlanId}} /> }

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Salvando Plano...
          </div>
        </>
      )}

      {openInformationModal && (
        <ConfirmBoxModal
          caller="confirmOpenInformationModal"
          title="Plano - Adicionais"
          message="O plano selecionado ja está ativo no momento, caso você queira recursos adicionais clique em 'Confirmar'."
        />
      )}

      {openinsufficientResourcesModal && (
        <ConfirmBoxModal
          caller="confirmOpeninsufficientResourcesModal"
          title="Troca de Plano"
          message={`Você selecionou um plano que possui recursos inferiores aos que estão em uso no momento, por favor, verifique novamente ou se desejar entre em contato conosco via
          chat, clicando no botão "Acessar Chat" abaixo.`}
          buttonOkText="Acessar Chat"
        />
      )}

      {changePlanInformation && (
        <ConfirmBoxModal
          caller="changePlanInformation"
          title="Troca de Plano"
          message="Ao contratar o novo plano, o plano e recursos adicionais contratados serão disponibilizados imediatamente, os valores de sua próxima fatura serão ajustados de acordo com o novo plano selecionado."
          useCheckBoxConfirm
        />
      )}
   
      <TaskBar>
        <div>
          <div>
            <button className="buttonLinkClick buttonInclude" title="Clique para voltar a Informações da conta" type="submit" onClick={() => history.push('/AccountInformation')}>
              <AiOutlineArrowLeft />
              <span>Retornar a Informações da Conta</span>
            </button>
          </div>
        </div>
      </TaskBar>

      {selectedPlan == "none" && (
      <>
        <div className='button-box'>
          <div className='buttn' id='buttn' />
          <button type='button' className='toggle-btn' onClick={handleClickMonth}>Mensal</button>
          <button type='button' className='toggle-btn' onClick={handleClickYear}>Anual</button>
        </div>
             
        <Content>
          <body>
            <div className="wrapper">

              {month == true && (
                <>
                  <div className="table light">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>
                        
                          <span className="price">
                            {Number(planLightValue).toFixed(2).replace(".",",")}              
                          </span>
                          <span className="text2">Por Mês</span>
                  
                        </div>
                      </div>
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>50</b> 
                          {"  "}
                          Processos
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>1 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>50</b>
                          {"  "}
                          Processos
                        </span>
                      </li>
                    
                      <li>
                        <span className="list-name">R$ 0,90/Mês Processo Adicional</span>
                      </li>        

                    </ul>

                    {companyPlan == "GOJURLT" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURLT", planLightValue, planLightId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURLT" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURLT", planLightValue, planLightId)}}>Contratar</button></div>
                    )}
                  </div>

                  <div className="table smart">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>
                                            
                          <span className="price">
                            {Number(planSmartValue).toFixed(2).replace(".",",")}
                          </span>
                          <span className="text2">Por Mês</span>
                              
                        </div>
                      </div>
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>
                            300
                          </b> 
                          {"  "} 
                          Processos
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>1 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>100</b>
                          {"  "}
                          Processos
                        </span>
                      </li>
              
                      <li>
                        <span className="list-name">R$ 0,75/Mês Processo Adicional</span>
                      </li>
                  
                    </ul>

                    {companyPlan == "GOJURSM" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURSM", planSmartValue, planSmartId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURSM" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURSM", planSmartValue, planSmartId)}}>Contratar</button></div>
                    )}

                  </div>

                  <div className="table essential">
                    <div className="ribbon"><span>Mais Vendido</span></div>
                    <div className="price-section">
                      <div className="price-area">

                        <div className="inner-area">
                          <span className="text">R$</span>
              
                          <span className="price">
                            {Number(planEssentialValue).toFixed(2).replace(".",",")} 
                          </span>
                          <span className="text2">Por Mês</span>

                        </div>
                      </div>
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>800</b>
                          {"  "}
                          Processos
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>2 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>200</b>
                          {"  "}
                          Processos
                        </span>
                      </li>
        
                      <li>
                        <span className="list-name">R$ 0,75/Mês Processo Adicional</span>
                      </li>
                  
                    </ul>

                    {companyPlan == "GOJURES" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURES", planEssentialValue, planEssentialId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURES" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURES", planEssentialValue, planEssentialId)}}>Contratar</button></div>
                    )}
                  </div>

                  <div className="table top">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>
                  
                          <span className="price">
                            {Number(planTopValue).toFixed(2).replace(".",",")} 
                          </span>
                          <span className="text2">Por Mês</span>
                        
                        </div>
                      </div>
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>Processos Ilimitados</b>
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>2 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>300</b> 
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name" style={{fontSize:"16.5px", display:"block"}}>&nbsp;</span>
                      </li>
                      
                    </ul>

                    {companyPlan == "GOJURTP" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURTP", planTopValue, planTopId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURTP" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURTP", planTopValue, planTopId)}}>Contratar</button></div>
                    )}
                  </div>

                  <div className="table user">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>
                  
                          <span className="price">
                            {Number(planUserValue).toFixed(2).replace(".",",")} 
                          </span>
                          <span className="text2">Por Mês</span>
                        
                        </div>
                      </div>
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>1</b>    
                          {"  "}  
                          Usuário         
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>Processos Ilimitados</b>
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>1 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">5GB de Espaço Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>100</b> 
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name">R$41,00/Mês Usuário Adicional</span>
                      </li>
                      
                    </ul>

                    {companyPlan == "GOJURUS" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURUS", planUserValue, planUserId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURUS" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURUS", planUserValue, planUserId)}}>Contratar</button></div>
                    )}

                  </div>
                </>
              )}

              {month == false && (
                <>
                  <div className="table light">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>
                    
                          <span className="price">
                            {Number(planLightAnualValue).toFixed(2).replace(".",",")}              
                          </span>
                          <span className="text2">Por Ano</span>
                        
                        </div>
                      </div>
                    </div>
            
                    <div style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                      Economize
                      {" "}
                      {FormatCurrency.format((Number(planLightValue) * 12) - Number(planLightAnualValue))}
                    </div>
                    
                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>50</b> 
                          {"  "}
                          Processos
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>1 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>50</b>
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name" style={{fontSize:"16.5px", display: "block"}}>&nbsp;</span>
                      </li>

                    </ul>

                    {companyPlan == "GOJURLTAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURLTAN", planLightAnualValue, planLightAnualId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURLTAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURLTAN", planLightAnualValue, planLightAnualId)}}>Contratar</button></div>
                    )}
                  </div>

                  <div className="table smart">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>                  
                  
                          <span className="price">
                            {Number(planSmartAnualValue).toFixed(2).replace(".",",")}
                          </span>
                          <span className="text2">Por Ano</span>
                                    
                        </div>
                      </div>
                    </div>
            
                    <div style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                      Economize
                      {" "}
                      {FormatCurrency.format((Number(planSmartValue) * 12) - Number(planSmartAnualValue))}
                    </div>
                    
                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>
                            300
                          </b> 
                          {"  "} 
                          Processos
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>1 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>100</b>
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name" style={{fontSize:"16.5px", display: "block"}}>&nbsp;</span>
                      </li>
              
                    </ul>

                    {companyPlan == "GOJURSMAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURSMAN", planSmartAnualValue, planSmartAnualId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURSMAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURSMAN", planSmartAnualValue, planSmartAnualId)}}>Contratar</button></div>
                    )}
                  </div>

                  <div className="table essential">
                    <div className="ribbon"><span>Mais Vendido</span></div>
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>
                  
                          <span className="price">
                            {Number(planEssentialAnualValue).toFixed(2).replace(".",",")} 
                          </span>
                          <span className="text2">Por Ano</span>
                    
                        </div>
                      </div>
                    </div>

                    <div style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                      Economize
                      {" "}
                      {FormatCurrency.format((Number(planEssentialValue) * 12) - Number(planEssentialAnualValue))}
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>800</b>
                          {"  "}
                          Processos
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>2 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>200</b>
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name" style={{fontSize:"16.5px", display: "block"}}>&nbsp;</span>
                      </li>
                      
                    </ul>

                    {companyPlan == "GOJURESAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURESAN", planEssentialAnualValue, planEssentialAnualId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURESAN" && (                
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURESAN", planEssentialAnualValue, planEssentialAnualId)}}>Contratar</button></div>            
                    )}
                  </div>

                  <div className="table top">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>

                          <span className="price">
                            {Number(planTopAnualValue).toFixed(2).replace(".",",")} 
                          </span>
                          <span className="text2">Por Ano</span>

                        </div>
                      </div>
                    </div>

                    <div className='descount' style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                      Economize
                      {" "}
                      {FormatCurrency.format((Number(planTopValue) * 12) - Number(planTopAnualValue))}
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>Usuários Ilimitados</b> 
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>Processos Ilimitados</b>
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>2 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">Espaço Ilimitado Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>300</b> 
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name" style={{fontSize:"16.5px", display: "block"}}>&nbsp;</span>
                      </li>

                    </ul>

                    {companyPlan == "GOJURTPAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURTPAN", planTopAnualValue, planTopAnualId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURTPAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURTPAN", planTopAnualValue, planTopAnualId)}}>Contratar</button></div>
                    )}
                  </div>

                  <div className="table user">
                    <div className="price-section">
                      <div className="price-area">
                        <div className="inner-area">
                          <span className="text">R$</span>

                          <span className="price">
                            {Number(planUserAnualValue).toFixed(2).replace(".",",")} 
                          </span>
                          <span className="text2">Por Ano</span>

                        </div>
                      </div>
                    </div>

                    <div className='descount' style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                      Economize
                      {" "}
                      {FormatCurrency.format((Number(planUserValue) * 12) - Number(planUserAnualValue))}
                    </div>

                    <div className="package-name">&nbsp;</div>
                    <ul className="features">
                      <li>
                        <span className="list-name">
                          <b>1</b>
                          {"  "} 
                          Usuário
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>Processos Ilimitados</b>
                        </span>
                      </li>
                      <li>
                        <span className="list-name">
                          <b>1 Critério</b>
                          {"  "}
                          P/ Busca de Publicações (Nome/Estado)
                        </span>
                      </li>
                      <li>
                        <span className="list-name">5GB de Espaço Para Documentos</span>
                      </li>
                      <li>
                        <span className="list-name">
                          Monitor Tribunal
                          {"  "}
                          <b>100</b> 
                          {"  "}
                          Processos
                        </span>
                      </li>

                      <li>
                        <span className="list-name">R$492,00/Ano Usuário Adicional</span>
                      </li>

                    </ul>

                    {companyPlan == "GOJURUSAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleOpenInformationModal("GOJURUSAN", planUserAnualValue, planUserAnualId)}}>Plano Ativo</button></div>
                    )}

                    {companyPlan != "GOJURUSAN" && (
                      <div className="btn"><button type='button' onClick={() => {handleSelectPlan("GOJURUSAN", planUserAnualValue, planUserAnualId)}}>Contratar</button></div>
                    )}
                  </div>
                </>
              )}
        
            </div>
          </body>

          <div className='message' id='message'>
            <MdNewReleases />
            Precisa de mais recursos?, escolha o seu plano base e adicione recursos na etapa posterior.
            <br />
            <BsFillChatDotsFill />
            <span>
              Não encontrou um plano adequado ou precisa de ajuda? Entre em contato conosco pelo
              {" "}
              {" "}
              <span>
                <button type='button' className="buttonLinkClick" style={{fontWeight:"bold", fontSize:"15px"}} onClick={() => window.open("https://tawk.to/chat/6257202e7b967b11798a9c59/1g0i5bdqg", '_blank')}>
                  chat
                </button>
              </span>
              para um atendimento personalizado -  
              {" "}
              <span>
                <button type='button' className="buttonLinkClick" style={{fontWeight:"bold", fontSize:"15px"}} onClick={() => window.open("https://tawk.to/chat/6257202e7b967b11798a9c59/1g0i5bdqg", '_blank')}>
                  Clique aqui para acessar o chat.
                </button>
              </span>
            </span>
          </div>
        </Content>
      </>
      )}

      {selectedPlan != "none" && (
        <Content>

          <div className='border2'>&nbsp;</div>

          <div className='headerLabel' id='headerLabel'>
            <div>
              Plano
            </div>
          </div>

          <body>
            <div className="wrapperSelected">

              {selectedPlan == "GOJURLT" && (
                <div className="table light">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>
                      
                        <span className="price">
                          {Number(planLightValue).toFixed(2).replace(".",",")}              
                        </span>
                        <span className="text2">Por Mês</span>
                
                      </div>
                    </div>
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>50</b> 
                        {"  "}
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>1 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>50</b>
                        {"  "}
                        Processos
                      </span>
                    </li>
                  
                    <li>
                      <span className="list-name">R$ 0,90/Mês Processo Adicional</span>
                    </li>        
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURSM" && (
                <div className="table smart">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>
                        <span className="price">
                          {Number(planSmartValue).toFixed(2).replace(".",",")}
                        </span>
                        <span className="text2">Por Mês</span>
                      </div>
                    </div>
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>
                          300
                        </b> 
                        {"  "} 
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>1 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>100</b>
                        {"  "}
                        Processos
                      </span>
                    </li>
            
                    <li>
                      <span className="list-name">R$ 0,75/Mês Processo Adicional</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURES" && (
                <div className="table essential">
                  <div className="ribbon"><span>Mais Vendido</span></div>
                  <div className="price-section">
                    <div className="price-area">

                      <div className="inner-area">
                        <span className="text">R$</span>
            
                        <span className="price">
                          {Number(planEssentialValue).toFixed(2).replace(".",",")} 
                        </span>
                        <span className="text2">Por Mês</span>

                      </div>
                    </div>
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>800</b>
                        {"  "}
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>2 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>200</b>
                        {"  "}
                        Processos
                      </span>
                    </li>
      
                    <li>
                      <span className="list-name">R$ 0,75/Mês Processo Adicional</span>
                    </li>
                  </ul>
                </div>
              )}
                
              {selectedPlan == "GOJURTP" && (
                <div className="table top">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>
                
                        <span className="price">
                          {Number(planTopValue).toFixed(2).replace(".",",")} 
                        </span>
                        <span className="text2">Por Mês</span>
                      
                      </div>
                    </div>
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>Processos Ilimitados</b>
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>2 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>300</b> 
                        {"  "}
                        Processos
                      </span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURUS" && (
                <div className="table user">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>
                
                        <span className="price">
                          {Number(planUserValue).toFixed(2).replace(".",",")} 
                        </span>
                        <span className="text2">Por Mês</span>
                      
                      </div>
                    </div>
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">
                        <b>1</b>
                        {"  "} 
                        Usuario
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>Processos Ilimitados</b>
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>1 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">5GB de Espaço Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>100</b> 
                        {"  "}
                        Processos
                      </span>
                    </li>

                    <li>
                      <span className="list-name">R$41,00/Mês Usuário Adicional</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURLTAN" && (
                <div className="table light">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>
                  
                        <span className="price">
                          {Number(planLightAnualValue).toFixed(2).replace(".",",")}              
                        </span>
                        <span className="text2">Por Ano</span>
                      
                      </div>
                    </div>
                  </div>
          
                  <div style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                    Economize
                    {" "}
                    {FormatCurrency.format((Number(planLightValue) * 12) - Number(planLightAnualValue))}
                  </div>
                  
                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>50</b> 
                        {"  "}
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>1 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>50</b>
                        {"  "}
                        Processos
                      </span>
                    </li>

                    <li>
                      <br />
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURSMAN" && (
                <div className="table smart">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>                  
                
                        <span className="price">
                          {Number(planSmartAnualValue).toFixed(2).replace(".",",")}
                        </span>
                        <span className="text2">Por Ano</span>
                                  
                      </div>
                    </div>
                  </div>
          
                  <div style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                    Economize
                    {" "}
                    {FormatCurrency.format((Number(planSmartValue) * 12) - Number(planSmartAnualValue))}
                  </div>
                  
                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>
                          300
                        </b> 
                        {"  "} 
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>1 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>100</b>
                        {"  "}
                        Processos
                      </span>
                    </li>
            
                    <li>
                      <br />
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURESAN" && (
                <div className="table essential">
                  <div className="ribbon"><span>Mais Vendido</span></div>
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>
                
                        <span className="price">
                          {Number(planEssentialAnualValue).toFixed(2).replace(".",",")} 
                        </span>
                        <span className="text2">Por Ano</span>
                  
                      </div>
                    </div>
                  </div>

                  <div style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                    Economize
                    {" "}
                    {FormatCurrency.format((Number(planEssentialValue) * 12) - Number(planEssentialAnualValue))}
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>800</b>
                        {"  "}
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>2 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>200</b>
                        {"  "}
                        Processos
                      </span>
                    </li>

                    <li>
                      <br />
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURTPAN" && (
                <div className="table top">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>

                        <span className="price">
                          {Number(planTopAnualValue).toFixed(2).replace(".",",")} 
                        </span>
                        <span className="text2">Por Ano</span>

                      </div>
                    </div>
                  </div>

                  <div className='descount' style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                    Economize
                    {" "}
                    {FormatCurrency.format((Number(planTopValue) * 12) - Number(planTopAnualValue))}
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">Usuarios Ilimitados</span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>Processos Ilimitados</b>
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>2 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">Espaço Ilimitado Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>300</b> 
                        {"  "}
                        Processos
                      </span>
                    </li>

                    <li>
                      <br />
                    </li>
                  </ul>
                </div>
              )}

              {selectedPlan == "GOJURUSAN" && (
                <div className="table user">
                  <div className="price-section">
                    <div className="price-area">
                      <div className="inner-area">
                        <span className="text">R$</span>

                        <span className="price">
                          {Number(planUserAnualValue).toFixed(2).replace(".",",")} 
                        </span>
                        <span className="text2">Por Ano</span>

                      </div>
                    </div>
                  </div>

                  <div className='descount' style={{fontSize:"13px", marginTop:"5px", textAlign:"center"}}>
                    Economize
                    {" "}
                    {FormatCurrency.format((Number(planUserValue) * 12) - Number(planUserAnualValue))}
                  </div>

                  <div className="package-name">&nbsp;</div>
                  <ul className="features">
                    <li>
                      <span className="list-name">
                        <b>1</b>
                        {"  "} 
                        Usuario
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>Processos Ilimitados</b>
                      </span>
                    </li>
                    <li>
                      <span className="list-name">
                        <b>1 Critério</b>
                        {"  "}
                        P/ Busca de Publicações (Nome/Estado)
                      </span>
                    </li>
                    <li>
                      <span className="list-name">5GB de Espaço Para Documentos</span>
                    </li>
                    <li>
                      <span className="list-name">
                        Monitor Tribunal
                        {"  "}
                        <b>100</b> 
                        {"  "}
                        Processos
                      </span>
                    </li>
                    <li>
                      <span className="list-name">R$492,00/Ano Usuário Adicional</span>
                    </li>
                  </ul>
                </div>
              )}

            </div>
          </body>

          {haveResources == true && (
            <>
              <div className='border'>&nbsp;</div>

              <div className='headerLabel' id='headerLabel'>
                <div>
                  Adicionar aplicativos
                </div>
              </div>
              <br />

              {selectPlanType != "A" ? (
                <>
                  <div id='Line1' style={{width:'99%', height:'375px'}}>
                    <div id='Line1Itens1' style={{width:'850px', height:'350px', margin:'0 auto'}}>
                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_PessoaFisica.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {publPFDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {publPFQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setPublPFQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={publPFQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setPublPFQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Publicações adicional pessoa física.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(publPFValue) * (Number(publPFQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_PessoaJuridica.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {publPFDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {publPJQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setPublPJQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={publPJQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setPublPJQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Publicações adicional pessoa jurídica.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(publPJValue) * (Number(publPJQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_Martelo.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {courtDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {courtQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setCourtQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={courtQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setCourtQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Monitor de processos adicional. Corresponde a 100 unidades.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(courtValue) * (Number(courtQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>
                    </div>
                  </div>

                  <div id='Line2' style={{width:'99%', height:'380px', marginTop:'10px'}}>
                    <div id='Line2Itens2' style={{width:'850px', height:'350px', margin:'0 auto'}}>
                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_Usuario.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {userDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {userQtd === 'ILIMITADO' ? (
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'25px'}}>
                                Ilimitado
                              </div>
                            </>
                          ) : (
                            <>
                              {userQtd === '0' ? (
                                <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setUserQtd('1')}>
                                  Adicionar
                                </button>
                              ) : (
                                <>
                                  <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                    Quantidade:
                                  </div>
                                  <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                    <input type="number" value={userQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setUserQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                                  </div>
                                </>   
                              )}
                            </> 
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Usuário adicional no sistema GOJUR.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            {userQtd == 'ILIMITADO' ? (
                              <input type="text" value={FormatCurrency.format(Number(userValue) * (Number(0)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                            ) : (
                              <input type="text" value={FormatCurrency.format(Number(userValue) * (Number(userQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                            )}
                            
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_Brasil.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {publBRDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {publBRQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setPublBRQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={publBRQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setPublBRQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Publicações adicional Brasil todo <br /> para pessoa física ou jurídica.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(publBRValue) * (Number(publBRQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_WhatsApp.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {whatsAppDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {whatsAppQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setWhatsAppQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={whatsAppQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setWhatsAppQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Envio de notificações do GOJUR para <br /> o WhatsApp do seu cliente.&nbsp;&nbsp;<a href='https://shorturl.at/dftQ8' target="blank">+ info.</a>
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(whatsAppValue) * (Number(whatsAppQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div id='Line1' style={{width:'99%', height:'375px'}}>
                    <div id='Line1Itens1' style={{width:'850px', height:'350px', margin:'0 auto'}}>
                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_PessoaFisica.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {publPFAnualDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {publPFAnualQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setPublPFAnualQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={publPFAnualQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setPublPFAnualQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Publicações adicional pessoa física.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(publPFAnualValue) * (Number(publPFAnualQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_PessoaJuridica.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {publPJAnualDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {publPJAnualQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setPublPJAnualQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={publPJAnualQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setPublPJAnualQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Publicações adicional pessoa jurídica.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(publPJAnualValue) * (Number(publPJAnualQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_Martelo.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {courtAnualDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {courtAnualQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setCourtAnualQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={courtAnualQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setCourtAnualQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Monitor de processos adicional. Corresponde a 100 unidades.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(courtAnualValue) * (Number(courtAnualQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>
                    </div>
                  </div>

                  <div id='Line2' style={{width:'99%', height:'380px', marginTop:'10px'}}>
                    <div id='Line2Itens2' style={{width:'850px', height:'350px', margin:'0 auto'}}>
                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_Usuario.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {userAnualDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {userAnualQtd === 'ILIMITADO' ? (
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'25px'}}>
                                Ilimitado
                              </div>
                            </>
                          ) : (
                            <>
                              {userAnualQtd === '0' ? (
                                <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setUserAnualQtd('1')}>
                                  Adicionar
                                </button>
                              ) : (
                                <>
                                  <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                    Quantidade:
                                  </div>
                                  <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                    <input type="number" value={userAnualQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setUserAnualQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                                  </div>
                                </>   
                              )}
                            </> 
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Usuário adicional no sistema GOJUR.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            {userQtd == 'ILIMITADO' ? (
                              <input type="text" value={FormatCurrency.format(Number(userAnualValue) * (Number(0)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                            ) : (
                              <input type="text" value={FormatCurrency.format(Number(userAnualValue) * (Number(userAnualQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                            )}
                            
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_Brasil.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {publBRAnualDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {publBRAnualQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setPublBRAnualQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={publBRAnualQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setPublBRAnualQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Publicações adicional Brasil todo <br /> para pessoa física ou jurídica.
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(publBRAnualValue) * (Number(publBRAnualQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>

                      <ResourceCard id='ResourceCard'>
                        <div id='Bloco1' className='bloco1'>
                          <img alt='logo' src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/store_WhatsApp.png" style={{marginTop:'5px'}} />
                        </div>

                        <div id='Bloco2' className='bloco2'>
                          <div style={{width:'100%', textAlign:'center', fontSize:'14px', fontWeight:600}}>
                            {whatsAppAnualDesc}
                          </div>
                        </div>

                        <div id='Bloco3' className='bloco3'>
                          {whatsAppAnualQtd === '0' ? (
                            <>
                              <button type="button" className="buttonLinkClick buttonInclude" style={{marginLeft:'25px', fontSize:'14px', color:'blue', fontWeight:500}} onClick={()=> setWhatsAppAnualQtd('1')}>
                                Adicionar
                              </button>
                            </>
                          ):(
                            <>
                              <div style={{float:'left', width:'100px', marginTop:'7px', marginLeft:'40px'}}>
                                Quantidade:
                              </div>
                              <div style={{float:'left', width:'60px', marginTop:'2px'}}>
                                <input type="number" value={whatsAppAnualQtd} onChange={(e: ChangeEvent<HTMLInputElement>) => setWhatsAppAnualQtd(e.target.value)} autoComplete="off" style={{backgroundColor:'#FFFFFF', height:'28px'}} />
                              </div>
                            </>
                          )}
                        </div>

                        <div id='Bloco4' className='bloco4'>
                          <div style={{width:'100%', textAlign:'center'}}>
                            Envio de notificações do GOJUR para <br /> o WhatsApp do seu cliente.&nbsp;&nbsp;<a href='https://shorturl.at/dftQ8' target="blank">+ info.</a>
                          </div>
                        </div>

                        <div id='Bloco5' className='bloco5'>
                          <div style={{float:'left', width:'85px', marginTop:'7px', marginLeft:'43px'}}>
                            Valor:
                          </div>
                          <div style={{float:'left', width:'75px', marginTop:'2px'}}>
                            <input type="text" value={FormatCurrency.format(Number(whatsAppAnualValue) * (Number(whatsAppAnualQtd)))} autoComplete="off" disabled style={{backgroundColor:'#FFFFFF'}} />
                          </div>
                        </div>
                      </ResourceCard>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div style={{float:'right', marginRight:'40px', marginTop:"15px"}}>
            <div style={{float:'left'}}>
              <button type='button' className="buttonClick" style={{width:'150px'}} onClick={()=> setChangePlanInformation(true)}>
                <FaFileContract />
                Salvar Aplicativos
              </button>
            </div>
             
            <div style={{float:'left', width:'100px'}}>
              <button type='button' className="buttonClick" style={{width:'90px'}} onClick={() => handleClickCancel()}>
                <FaRegTimesCircle />
                Cancelar
              </button>
            </div>
          </div>

          <div className='borderBottom'>&nbsp;</div>
        </Content>
      )}
        
    </Container>
  );
};

export default ChangePlan;
