/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { FiSave, FiRefreshCcw, FiPrinter } from 'react-icons/fi';
import { MdBlock, MdHelp } from 'react-icons/md';
import { ImCopy, ImUsers }  from 'react-icons/im';
import { FaCalculator } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { BsPersonLinesFill, BsFolderSymlink } from 'react-icons/bs'
import GridSelectProcess from 'pages/Dashboard/MainViewContent/pages/Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useModal } from 'context/modal';
import { currencyConfig, FormatDate, selectStyles, useDelay, VerifyCompanyPlanAccess } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { useHistory } from 'react-router-dom';
import IntlCurrencyInput from "react-intl-currency-input"
import Select from 'react-select'
import { useDevice } from "react-use-device";
import Loader from 'react-spinners/ClipLoader';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useToast } from 'context/toast';
import { useParams } from 'react-router-dom';
import { matterCalcType, matterSecurityList } from 'Shared/utils/commonListValues';
import { Container} from './styles';
import { IMarkerList, IMatterData, ValuesDTO, IMatterValuesData, ISelectData, IMatterCalculationData, IKeyValueDTO } from '../../../../Interfaces/IMatter';
import { CalculateMatterValue, ComboSelectType, DeleteMatterEvents, DeleteMatter, GetLegalNature, GetMatterValuesJSON, ListJudicialAction, ListJudicialDecision, ListMatterStatus, ListProbablySuccess, ListProcessualStage, ListRito, SaveMatter, SaveMatterAttach, SaveMatterMarkers, SelectFolderCode, SelectMatter } from '../../Services/MatterData';
import MatterUsers from '../Users';
import MatterResponsible from '../Responsible';
import MatterValues from '../Values';
import MatterValuesReport from '../Report';
import MatterAttach from '../../Attach/Index';
import UnfoldingModal from '../../../Unfolding';

const Matter = (props) => {

  const { handleLoadingPage, handleMatterNumberCallback } = props.callbackList;
  const { addToast } = useToast();
  const { handleCaller, handleConfirmMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const useModalContext = useModal();
  const history = useHistory();
  const { isMOBILE } = useDevice();
  const [matterDataValues, setMatterDataValues] = useState<IMatterValuesData[]>([])
  const [jsonCalculator, setJsonCalculator] = useState<IMatterCalculationData | null>({} as IMatterCalculationData)
  const [markerList, setMarkerList] = useState<IMarkerList[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingCombo, setLoadingCombo] = useState<boolean>(false)
  const [statusPage, setStatusPage] = useState<string>('')
  const [showUsers, setShowUsers] = useState<boolean>(false)
  const [calculateRiskValue, setCalculateRiskValue] = useState<boolean>(false)
  const [showResponsible, setShowResponsible] = useState<boolean>(false)
  const [showValues, setShowValues] = useState<boolean>(false)
  const [showPrintValues, setShowPrintValues] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [loadAttachList, setLoadAttachList] = useState<boolean>(false)
  const [showMessageDeleting, setShowMessageDeleting] = useState<boolean>(false)
  const [showMessageDeletingEvent, setShowMessageDeletingEvent] = useState<boolean>(false)
  const [isMatterValue, setIsMatterValue] = useState<boolean>(false)
  const [legalNatureDescription, setLegalNatureDescription] = useState<string>('')
  const [responsibleList, setResponsibleList] = useState<ValuesDTO[]>([])
  const [currentListData, setCurrentListData] = useState<ComboSelectType>({} as ComboSelectType)
  const [selectFilterTerm, setSelectFilterTerm] = useState<string>('')
  const [matterValueCurrentEditId, setMatterValueCurrentEditId] = useState<number>()
  const [matterId, setMatterId] = useState<number>(0)
  const [matterSequence, setMatterSequence] = useState<number>(0)
  const [matterAmazonS3Type, setAmazonS3Type] = useState<string>('')
  const [matterFolder, setMatterFolder] = useState<string>('')
  const [matterNumber, setMatterNumber] = useState<string>('')
  const [matterNumberCNJ, setMatterNumberCNJ] = useState<string>('')
  const [matterTitle, setMatterTitle] = useState<string>('')
  const [matterOrder, setMatterOrder] = useState<string>('')
  const [matterJudicialActionId, setMatterJudicialActionId] = useState<number>()
  const [matterRitoId, setMatterRitoId] = useState<number>()
  const [matterProbablySuccessId, setMatterProbablySuccessId] = useState<number>()
  const [matterDecisionId, setMatterDecisionId] = useState<number>()
  const [matterProcessualStageId, setMatterProcessualStageId] = useState<number>()
  const [matterStatusId, setMatterStatusId] = useState<number>()
  const [matterSecurity, setMatterSecurity] = useState<string>('U')
  const [matterFlagRobot, setMatterFlagRobot] = useState<string>('N')
  const [matterLoadId, setMatterLoadId] = useState<number>()
  const [matterFollowWebDate, setMatterFollowWebDate] = useState<Date>()
  const [matterLink, setMatterLink] = useState<string>('')
  const [matterDateRelease, setMatterDateRelease] = useState<string>('')
  const [natterDateFinalization, setMatterDateFinalization] = useState<string>('')
  const [matterDateEntrance, setMatterDateEntrance] = useState<string>('')
  const [matterUserCourt, setMatterUserCourt] = useState<string>('')
  const [matterObjectDescription, setMatterObjectDescription] = useState<string>('')
  const [matterUserCourtPsw, setMatterUserCourtPsw] = useState<string>('')
  const [matterResponsibleDescription, setMatterResponsibleDescription] = useState<string> ('')
  const [judicialActionList, setJudicialActionList] = useState<ISelectData[]>([])
  const [probablySuccessList, setProbablySuccessList] = useState<ISelectData[]>([])
  const [ritoList, setRitoList] = useState<ISelectData[]>([])
  const [decisionList, setDecisionList] = useState<ISelectData[]>([])
  const [processualStageList, setProcessualStageList] = useState<ISelectData[]>([])
  const [matterStatusList, setMatterStatusList] = useState<ISelectData[]>([])
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const showButtonDelete = (accessCode??"").includes('MATLDE') || (accessCode??"") == 'adm'
  let { id } = useParams() as { id: string; }
  const [showUnfoldingModal, setShowUnfoldingModal] = useState<boolean>(false);
  const [isFollowedMatterNumberChanged, setIsFollowedMatterNumberChanged] = useState<boolean>(false)
  const [confirmFollowedMatterNumberChanged, setConfirmFollowedMatterNumberChanged] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [doubleCheck, setDoubleCheck] = useState<boolean>(false)

  const [isMatterAwarenessError, setMatterAwarenessError] = useState<boolean>(false)



  useEffect(() => {

    LoadMatter();

  }, [])

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'followedMatterNumberChanged')
      {
        setIsFollowedMatterNumberChanged(false)
        setErrorMessage("")
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'followedMatterNumberChanged')
      {
        setConfirmFollowedMatterNumberChanged(true)
        setDoubleCheck(true)
      }
    }
  },[isConfirmMessage, caller]);

 useEffect(() => {

  if(confirmFollowedMatterNumberChanged)
    {     
      setConfirmFollowedMatterNumberChanged(false)
      setIsFollowedMatterNumberChanged(false)
      setErrorMessage("")
      handleCaller("")
      handleConfirmMessage(false)
      handleSaveMatter();
    }
  },[confirmFollowedMatterNumberChanged]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'matterAwarenesError')
      {
        setMatterAwarenessError(false)
        setErrorMessage("")
        handleCaller("")
      }
    }
  },[isConfirmMessage, caller]);

  const LoadMatter = async () => {

    try
    {
        if (Number(id) > 0)
          EditMatter()
        else
          AddMatter();

    }
    catch(err:any){
      handleLoadingPage()
      setIsLoading(false)
    }
  }

  const AddMatter = async () => {

    LoadComboData()

    const newMatterValues: IMatterValuesData[] = []

    // add cause value default for new matters
    newMatterValues.push({
      id:0,
      calculationId: 0,
      isMatterValue: true,
      isRiskValue: false,
      blockValue: true,
      newItem: true,
      matterId: Number(id),
      name: 'Valor da Causa'
    })

    // add risk value default for new matters
    newMatterValues.push({
      id:1,
      calculationId: 0,
      isRiskValue: true,
      isMatterValue: false,
      blockValue: true,
      newItem: true,
      matterId: Number(id),
      name: 'Valor do Risco'
    })

    // add default user current
    const newResponsibleData: ValuesDTO[] =[];
    newResponsibleData.push({
      id: localStorage.getItem('@GoJur:userCompanyId')??'',
      value: localStorage.getItem('@GoJur:name')??'',
    })

    setMatterDateEntrance(FormatDate(new Date(), 'yyyy-MM-dd'))
    setResponsibleList(newResponsibleData)
    setMatterResponsibleDescription(newResponsibleData[0].value??'')
    setMatterDataValues(newMatterValues)
    handleLoadingPage()
    setIsLoading(false)
  }

  const EditMatter = async () => {

    const matter = await SelectMatter(id);

    await GetMatterValues();
    LoadComboDataSelected(matter)

    setResponsibleList(matter.matterResponsibleList)
    setMatterId(matter.matterId)
    setMatterNumber(matter.matterNumber)
    setMatterNumberCNJ(matter.matterNumberCNJ)
    setMatterFolder(matter.matterFolder)
    setMatterSecurity(matter.privacity === 'Privado'? 'R': 'U')
    setMatterFlagRobot(matter.flg_Robot)
    setMatterLoadId(matter.matterIdLoad)
    setMatterFollowWebDate(matter.dtaWebFollow)
    setMatterLink(matter.courtLink)
    setLegalNatureDescription(matter.judicialNature)
    setMatterJudicialActionId(matter.judicialActionId)
    setMatterRitoId(matter.ritoId)
    setMatterProbablySuccessId(matter.probabilyExitoId)
    setMatterDecisionId(matter.decisionId)
    setMatterObjectDescription(matter.description)
    setMatterProcessualStageId(matter.processualStageId)
    setMatterStatusId(matter.statusId)
    setMatterTitle(matter.title)
    setMatterOrder(matter.orderNumber)
    setAmazonS3Type(matter.amazonS3Type)
    setMatterUserCourt(matter.userCourt)
    setMatterUserCourtPsw(matter.passwordCourt)
    setMatterSequence(matter.sequence??0)
    setMarkerList(matter.markersList)

    if (matter.dateRelease)
      setMatterDateRelease(FormatDate(new Date(matter.dateRelease), 'yyyy-MM-dd'))

    if (matter.dateFinalization)
      setMatterDateFinalization(FormatDate(new Date(matter.dateFinalization), 'yyyy-MM-dd'))

    if (matter.dateInsert)
      setMatterDateEntrance(FormatDate(new Date(matter.dateInsert), 'yyyy-MM-dd'))

    setMatterResponsibleDescription(matter.matterResponsibleAll)

    handleLoadingPage()
    setIsLoading(false)

    await LoadComboData(matter)
  }

  const handleNextFolderName = async () => {

    const number = await SelectFolderCode(id)
    setMatterFolder(number)
  }

  // When user set value auto-complete, only append new data on combo without go to api
  const LoadComboDataSelected = (matter: IMatterData) => {

    if (matter.judicialActionId > 0) {
      judicialActionList.push({
        id:matter.judicialActionId.toString(),
        label:matter.judicialAction
      })
      setJudicialActionList(judicialActionList)
    }

    if (matter.probabilyExitoId > 0) {
      probablySuccessList.push({
        id:matter.probabilyExitoId.toString(),
        label:matter.probabilyExito
      })
      setProbablySuccessList(probablySuccessList)
    }

    if (matter.ritoId > 0) {
      ritoList.push({
        id:matter.ritoId.toString(),
        label:matter.rito
      })
      setRitoList(ritoList)
    }

    if (matter.decisionId > 0) {
      decisionList.push({
        id:matter.decisionId.toString(),
        label:matter.decision
      })
      setDecisionList(decisionList)
    }

    if (matter.processualStageId > 0) {
      processualStageList.push({
        id:matter.processualStageId.toString(),
        label:matter.processualStage
      })
      setProcessualStageList(processualStageList)
    }

    if (matter.statusId > 0) {
      matterStatusList.push({
        id:matter.statusId.toString(),
        label:matter.status
      })
      setMatterStatusList(matterStatusList)
    }
  }

  // When user doesn't defined combo data value, go to api to get first 50 register at the first time
  const LoadComboData = async (matter: IMatterData = {} as IMatterData) => {

    if (!matter.statusId) {
      const response = await ListMatterStatus(0, 50, '')
      setMatterStatusList(response);

      if (!matterStatusId){
          const item = response.find(item => item.label == 'ATIVO');
          if (item){
            setMatterStatusId(Number(item.id))
          }
      }
    }

    if (!matter.judicialActionId) {
      setJudicialActionList(await ListJudicialAction(0, 50,''))
    }

    if (!matter.probabilyExitoId) {
      setProbablySuccessList(await ListProbablySuccess(0, 50,''))
    }

    if (!matter.ritoId) {
      setRitoList(await ListRito(0, 50,''))
    }

    if (!matter.decisionId) {
      setDecisionList(await ListJudicialDecision(0, 50,''))
    }

    if (!matter.processualStageId) {
      setProcessualStageList(await ListProcessualStage(0, 50,''))
    }
  }

  const GetMatterValues = async() => {

    const valuesList = await GetMatterValuesJSON(id)
    setMatterDataValues(valuesList)

  }

  const SaveMarkers = async (markersList: IMarkerList[]) => {

    try
    {
      setMarkerList(markersList)

      // transform marker list in unique string
      let marker = '';
      markersList.map((item) => {
        marker += `${item.text  },`
      })

      // save matter endpoint call
      await SaveMatterMarkers(Number(id), marker, 'matterLegal')
    }
    catch(err:any){

      setMarkerList(markersList)

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Houve uma falha na gravação deste marcador, verifique se o processo possui alguma pendência de cadastro e tente novamente"
      });
    }
  }

  useEffect(() => {

    if (isConfirmMessage && caller === 'matterEdit'){

      if (isDeleting){
        handleDeleteMatter()
      }

      handleConfirmMessage(false)
      setIsDeleting(false)
    }

  },[caller, isConfirmMessage, isDeleting])

  useEffect(() => {

    if (isCancelMessage && caller === 'matterEdit'){
      setIsDeleting(false)
    }

  },[caller, isCancelMessage])

  const handleDeleteMarker = (i) => {

    const newListMatter = markerList.filter((tag, index) => index !== i);

    SaveMarkers(newListMatter)
  };

  const handleAddition = (tag) => {

    if (markerList.length >= 5) return;

    if (matterId == 0){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: 'É necessário salvar o processo antes de inserir um marcador'
      });
      return
    }

    markerList.push(tag)

    SaveMarkers(markerList)
  };

  const handleResponsibleListSave = (userList: ISelectData[]) => {

    const newResponsibleData: ValuesDTO[] =[];
    userList.map(item => {
      newResponsibleData.push({
        id: item.id,
        value: item.label,
      })
    })

    setResponsibleList(newResponsibleData)

    let respDescription = ''
    let count = 0;
    userList.map((user) => {
      if (count > 2) return;

      if (count == 2){
        // remove last special character
        respDescription = respDescription.substring(0, respDescription.length - 3);
        respDescription += ` + ${(userList.length - count)} `;
        count++;
        return
      }

      respDescription += `${user.label}  - `;
      count++;
      return;
    })

    // remove last special character
    if (count <= 2) respDescription = respDescription.substring(0, respDescription.length - 3);

    setMatterResponsibleDescription(respDescription)
  }

  const handleDrag = (tag, currPos, newPos) => {
    const newMarkerList = markerList.slice();

    newMarkerList.splice(currPos, 1);
    newMarkerList.splice(newPos, 0, tag);

    SaveMarkers(newMarkerList)
  };

  const handleReactSelectChange = async (identity: ComboSelectType, select) => {

    setCurrentListData(identity)

    if (select){
      setLoadingCombo(true)

      // If is select a juditial action - get legal nature
      if (identity == ComboSelectType.judicialAction){
        setMatterJudicialActionId(select.id)
        const legalNature = await GetLegalNature(select.id)
        setLegalNatureDescription(legalNature.value)
      }

      if (identity == ComboSelectType.probablySuccess){
        setMatterProbablySuccessId(select.id)
      }

      if (identity == ComboSelectType.matterDecision){
        setMatterDecisionId(select.id)
      }

      if (identity == ComboSelectType.matterStatus){
        setMatterStatusId(select.id)
      }

      if (identity == ComboSelectType.rito){
        setMatterRitoId(select.id)
      }

      if (identity == ComboSelectType.processualStage){
        setMatterProcessualStageId(select.id)
      }

      setLoadingCombo(false)
    }
    else{
      // Reload filter with all first 50 itens - by combo selected
      await RefreshComboSelect(identity, '');
    }
  }

  const handleReactInputText = useCallback((identity: ComboSelectType, term: string) => {

    setSelectFilterTerm(term)
    setCurrentListData(identity)

  }, [])

  useDelay(() => {

    if (selectFilterTerm.length > 0){
      LoadSelectLists()
    }

  }, [selectFilterTerm], 1000)

  const LoadSelectLists = useCallback(async() => {

    await RefreshComboSelect(currentListData, selectFilterTerm)

  },[selectFilterTerm, currentListData])

  const RefreshComboSelect = async (identity: ComboSelectType, filterTerm: string) => {

    setLoadingCombo(true)

    if (identity === ComboSelectType.judicialAction){
      setMatterJudicialActionId(0)
      const response = await ListJudicialAction(0, 50, filterTerm);
      setJudicialActionList(response)

      if (filterTerm == '') {
        setLegalNatureDescription('')
      }
    }

    if (identity === ComboSelectType.probablySuccess){
      setMatterProbablySuccessId(0)
      const response = await ListProbablySuccess(0, 50, filterTerm);
      setProbablySuccessList(response)
    }

    if (identity === ComboSelectType.rito){
      setMatterRitoId(0)
      const response = await ListRito(0, 50, filterTerm);
      setRitoList(response)
    }

    if (identity === ComboSelectType.processualStage){
      setMatterProcessualStageId(0)
      const response = await ListProcessualStage(0, 50, filterTerm);
      setProcessualStageList(response)
    }

    if (identity === ComboSelectType.matterStatus){
      setMatterStatusId(0)
      const response = await ListMatterStatus(0, 50, filterTerm);
      setMatterStatusList(response)
    }

    if (identity === ComboSelectType.matterDecision){
      setMatterDecisionId(0)
      const response = await ListJudicialDecision(0, 50, filterTerm);
      setDecisionList(response)
    }

    setLoadingCombo(false)
  }

  const handleNewValuesLine = () => {

    const newLineValues = {
      id:matterDataValues.length,
      newItem: true,
      matterId:Number(id),
      name: ''
    }

    setMatterDataValues(previousValues => [...previousValues, newLineValues]);
  }

  const handleDeleteValuesLine = (matterValue: IMatterValuesData) => {

    if (matterValue.blockValue) return false;

    if (matterValue.id <= 1){
      return;
    }

    const newDataValues = matterDataValues.filter(value => value.id !== matterValue.id);
     setMatterDataValues(newDataValues)
  }

  const handleCloseUsersModal = useCallback(() => {
    setShowUsers(false)
  },[])

  const handleCloseResponsibleModal = () => {
    setShowResponsible(false)
  }

  const handleShowUsersModal = () => {

    if (matterId == 0){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: 'É necessário salvar o processo antes de inserir usuários ao processo'
      });
      return
    }

    setShowUsers(true)
  }

  const handleOpenShowValues = useCallback((item: IMatterValuesData) => {

    const calculatorObject = GetCalculationDetails(item.id)

    if (calculatorObject){
      // if has date defined in matter value set for modal start date if not was set yet
      if (!calculatorObject?.startDate){
        calculatorObject.startDate = item.startDate??""
      }
      setJsonCalculator(calculatorObject)
    }

    setMatterValueCurrentEditId(item.id)
    setIsMatterValue(item.isMatterValue == null? false: item.isMatterValue)
    setShowValues(true)

  },[GetCalculationDetails])


  const handleOpenPrintValuesModal = async (item: IMatterValuesData) => {

      // deny if plan is free and more than 30 days use
      const permissionAccessPlan = await VerifyCompanyPlanAccess()
      if (permissionAccessPlan === 'blocked'){
        addToast({
          type: 'info',
          title: 'Funcionalidade exclusiva para assinantes',
          description: "A impressão dos valores não esta disponível em seu plano vigente, entre em contato e faça o upgrade agora mesmo"
        });

        return;
      }

    if (item.jsonCalculator == null){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: 'Este valor não possui calculo jurídico aplicado'
      });
      return
    }

    const calculatorObject = GetCalculationDetails(item.id)
    if (calculatorObject){
      if (item.startDate){ calculatorObject.startDate = item.startDate }
      setJsonCalculator(calculatorObject)
    }

    setShowPrintValues(true)
  }

  const handleClosePrintValuesModal = () => {
    setShowPrintValues(false)
  }

  const handleCloseValuesModal = () => {
    setMatterValueCurrentEditId(0)
    setShowValues(false)
  }

  // update values when click on refresh buttion icon
  const handleRefreshCalculation = async (matterValueId: number) => {

    // deny if plan is free and more than 30 days use
    const permissionAccessPlan = await VerifyCompanyPlanAccess()
    if (permissionAccessPlan === 'blocked'){
      addToast({
        type: 'info',
        title: 'Funcionalidade exclusiva para assinantes',
        description: "O recalculo do valor não esta disponível em seu plano vigente, entre em contato e faça o upgrade agora mesmo"
      });

      return;
    }

    const matterValue = matterDataValues.find(item => item.id === matterValueId)
    if (!matterValue) return;

    handleCalculateValues(matterValue.calculatorObject as IMatterCalculationData, matterValueId, false)
  }

  // Effect to update risk value when was clicked on apply to risk value on matter value cause
  useEffect(() => {

      if (calculateRiskValue){

        const matterRiskValue = matterDataValues.find(item => item.isRiskValue);
        const matterCausaValue =  matterDataValues.find(item => item.isMatterValue);

        // create new clone object for risk value with same configuration
        if (matterCausaValue && matterRiskValue){
          if (matterCausaValue.calculatorObject && matterRiskValue)
          {
            // clone matter value to risk value
            const riskValueCalculationObject = {...matterCausaValue.calculatorObject }
            // riskValueCalculationObject.startDate = matterRiskValue.startDate??"";

            if (!matterRiskValue.startDate) matterRiskValue.startDate = matterCausaValue.startDate
            if ((matterRiskValue.originalValue??0) > 0) matterRiskValue.startDate = matterCausaValue.startDate

            if (matterRiskValue.calculatorObject)
              riskValueCalculationObject.id = matterRiskValue.calculatorObject?.id;

            handleCalculateValues(riskValueCalculationObject, matterRiskValue.id, false)
          }
        }

        setCalculateRiskValue(false)
      }

  }, [calculateRiskValue])

  // update values after call save on modal calculation
  const handleCalculateValues = async (data: IMatterCalculationData, matterValueId = 0, updateCallbackValues = true, showMessage = true) => {

    try
    {
      setStatusPage(showMessage? 'calc': '')
      handleCloseValuesModal()

      // get id by parameter or state when cames from callback on modal
      const calculationId = matterValueId || matterValueCurrentEditId;

      // when is remove a calculation exists set a null value
      if (!data){

        const newListValues = matterDataValues.map(item =>
          item.id === calculationId
          ?{
              ...item,
              updateValue: matterValueId > 0? item.updateValue: 0,
              originalValue: matterValueId > 0? item.originalValue: 0,
              updateDate: matterValueId > 0? item.updateDate: "",
              lastIndexDate: matterValueId > 0? item.lastIndexDate: "",
              calculatorObject: undefined
            }
          : item
        );

        setMatterDataValues(newListValues)
        setStatusPage('')

        return
      }

      // get matter value
      const matterValue = matterDataValues.find(item => item.id === calculationId)
      if (!matterValue) {
        setStatusPage('')
        return;
      }

      // when is update a calculation value, first of all define flags by the combodata values
      if (updateCallbackValues)
      {
        data.indexId = data.economicIndex? data.economicIndex.id: '';
        data.tpo_Moratory = data.moratoryType? data.moratoryType.id: '';
        data.tpo_MoratoryDate = data.moratoryDate? data.moratoryDate.id: '';
        data.tpo_Compensatory = data.compensatoryType? data.compensatoryType.id: '';
        data.tpo_CompensatoryDate = data.compensatoryDate? data.compensatoryDate.id: '';
        data.tpo_Punishment = data.punishmentType? data.punishmentType.id: '';
        data.lastIndexDate = data.lastIndexDate? data.lastIndexDate:''
      }

      data.originalValue = matterValue.originalValue??0;
      if (!matterValue.startDate) matterValue.startDate = data.startDate;

      await handleExecuteCalculation(data, calculationId)

      if ((matterValue.isMatterValue??false) && data.applyToRiskValue){
        setCalculateRiskValue(true)
      }

      setStatusPage('')
    }
    catch(err: any){

      setStatusPage('')

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message
      });

    }
  }

  const handleExecuteCalculation = async (data: IMatterCalculationData, calculationId: number | undefined) => {

      const resultCalculation = await CalculateMatterValue(JSON.stringify(data))

      const newListValues = matterDataValues.map(item =>
        item.id === calculationId
        ?{
            ...item,
            updateDate: resultCalculation.updateDate,
            updateValue: resultCalculation.updateValue,
            lastIndexDate: resultCalculation.dateLastIndex,
            calculatorObject: data,
            jsonCalculator: JSON.stringify(data)
          }
        : item
      );

      setMatterDataValues(newListValues)
  }

  function GetCalculationDetails(itemId:number){

    const itemSelected = matterDataValues.find(item => item.id === itemId)

    if (itemSelected){
      // verify if exists object calculation, if not create a default values to open new modal
      if (!itemSelected.calculatorObject){

        itemSelected.calculatorObject = {
          moratoryType: {id:'S', label: 'Juros Simples' },
          compensatoryType: { id:'S', label: 'Juros Simples' },
          tpo_MoratoryDate: 'V',
          tpo_CompensatoryDate: 'V',
          tpo_Punishment: 'P'
        } as IMatterCalculationData

      }

      return itemSelected.calculatorObject
    }
  }

  const handleDeleteMatter = async() => {

    try
    {
      setShowMessageDeletingEvent(true)

      await DeleteMatterEvents(id);
      
      setShowMessageDeletingEvent(false)
      setShowMessageDeleting(true)

      const response = await DeleteMatter(id);

      console.log(response)

      addToast({
        type: 'success',
        title: 'Operação realizada com sucesso',
        description: `O processo foi removido com sucesso`
      });

      setIsDeleting(false)
      setShowMessageDeleting(false)
      handleCaller('');

      history.push('/matter/list')
    }
    catch(err:any){
      setIsDeleting(false)
      setShowMessageDeletingEvent(false)
      setShowMessageDeleting(false)
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message
      });
    }
  }

  // Change value name identification
  const handleChangeValueName = (event) => {

    const newListValues = matterDataValues.map(item =>

      item.id === Number(event.target.id)
        ?{
            ...item,
            name: event.target.value,
          }
        : item
    );

    setMatterDataValues(newListValues)
  };

  // Change value type
  const handleChangeValueType = (event) => {

    const newListValues = matterDataValues.map(item =>

      item.id === Number(event.target.id)
        ?{
            ...item,
            typeValue: event.target.value,
          }
        : item
    );

    setMatterDataValues(newListValues)
  };

  // Change value start date
  const handleChangeValueStartDate = (event) => {

    const newListValues = matterDataValues.map(item =>

      item.id === Number(event.target.id)
        ?{
            ...item,
            startDate: event.target.value,
          }
        : item
    );

    setMatterDataValues(newListValues)
  };

  // Change value original
  const handleChangeValueOriginal = (event, value) => {

    event.preventDefault();

    const newListValues = matterDataValues.map(item =>

      item.id === Number(event.target.id)
        ?{
            ...item,
            originalValue: value,
          }
        : item
    );

    setMatterDataValues(newListValues)
  };

  const handleSaveMatter = useCallback(async() => {

    try
    {
      setStatusPage('save')

      let errorMatterValues = false;
      matterDataValues.map(item => {
        if (!item.isMatterValue && !item.isRiskValue && (item.name??"").length == 0)
          errorMatterValues =true;

        return;
      })

      // thown error values
      if (errorMatterValues){

        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: "Os valores incluidos de forma avulsa no processo devem conter um nome de identificação"
        });

        setStatusPage('')
        return;
      }

      if (responsibleList.length === 0) {

        addToast({
          type: 'info',
          title: 'Operação não realizada',
          description: 'O processo deve ter ao menos um responsável.',
        });

        setStatusPage('')
        return;
      }

      // build responsible list users
      const responsibleListData: IKeyValueDTO[] = []
      responsibleList.map(item => {
        responsibleListData.push({
          id: item.id,
          name: item.value,
        })
      })

      // create json objects for responsible and values
      const responsibleValuesJSON = JSON.stringify(responsibleListData)
      const matterValuesJSON = JSON.stringify(matterDataValues)

      // build marker description
      let matterMarkers = ''
      markerList.map(item => {
        matterMarkers += item.text
        matterMarkers += ","

        return;
      })

      // flag if is a new matter or e
      const newMatter = id == '0';

      const data = {
        cod_Processo:id,
        des_Marcador: matterMarkers == ''? null: matterMarkers,
        cod_Pasta: matterFolder,
        num_Processo: matterNumber.trim(),
        num_ProcessoCNJ: matterNumberCNJ,
        tpo_Seguranca: matterSecurity,
        des_Titulo: matterTitle,
        num_OrdemProcesso: matterOrder,
        cod_AcaoJudicial: matterJudicialActionId,
        cod_Rito: matterRitoId,
        cod_ProbabilidadeProcesso: matterProbablySuccessId,
        cod_SolucaoProcesso: matterDecisionId,
        cod_FaseProcessual: matterProcessualStageId,
        cod_StatusProcesso: matterStatusId,
        dta_Protocolo:matterDateRelease,
        dta_Entrada: matterDateEntrance,
        dta_Encerramento: natterDateFinalization,
        nom_UsuarioTribunal: matterUserCourt,
        des_SenhaTribunal: matterUserCourtPsw,
        des_Objeto: matterObjectDescription,
        num_Sequencia: matterSequence,
        tpo_ArmazenamentoArquivo: matterAmazonS3Type,
        des_Caminho: matterLink,
        responsibleValuesJSON,
        matterValuesJSON,
        flg_TribunalRobo: matterFlagRobot,
        dta_AcompanhamentoWEB: matterFollowWebDate,
        cod_ProcessoCargaTribunal: matterLoadId,
        matterType: 'matterLegal',
        token: localStorage.getItem('@GoJur:token'),
        doubleCheck
      }

      const matterIdSaved = await SaveMatter(data)      // save matter

      // refresh url with new item saved
      if (matterIdSaved && newMatter){
        id = matterIdSaved;
        setMatterId(Number(id))
        history.push(`/matter/edit/legal/${  matterIdSaved}`)
        EditMatter()
      }

      addToast({
        type: 'success',
        title: 'Operação realizada com sucesso',
        description: 'Os dados do processo foram salvos com sucesso',
      });

      setStatusPage('')
      await GetMatterValues();    // reload values

      handleMatterNumberCallback(matterNumber)
      
    }
    catch(err: any){

      setStatusPage('')

      if (!err.response.data.typeError.warning){
        addToast({
          type: 'error',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }
      
      else if (err.response.data.typeError.warning == "confirmation"){
        setErrorMessage(err.response.data.Message)
        setIsFollowedMatterNumberChanged(true)
      }

      else if (err.response.data.typeError.warning == "awareness"){
        setErrorMessage(err.response.data.Message)
        setMatterAwarenessError(true)
        EditMatter()
      }

    }

  },[matterFolder, responsibleList, matterNumberCNJ, matterNumber, matterSecurity, matterTitle, matterOrder, matterJudicialActionId, matterRitoId, matterProbablySuccessId, matterDecisionId, matterProcessualStageId, matterStatusId,matterDateRelease, matterDateEntrance, natterDateFinalization, matterUserCourt, matterUserCourtPsw, matterObjectDescription, matterSequence, matterAmazonS3Type, matterDataValues,markerList,matterFlagRobot, matterLoadId, matterFollowWebDate, errorMessage, isFollowedMatterNumberChanged, doubleCheck, isMatterAwarenessError])

  useEffect(() => {

    if (matterId != 0)
      SaveAttachMatter(useModalContext.matterSelected)

  },[useModalContext.matterSelected])

  const handleAttachMatter = useCallback(() => {

    if (matterId == 0){
     addToast({
       type: 'info',
       title: 'Operação NÃO realizada',
       description: 'É necessário salvar o processo antes de apensar um processo'
     });
     return
   }
   useModalContext.handleCaller('matterAttach')
   useModalContext.handleSelectProcess('Open');

}, [matterId, useModalContext.handleSelectProcess]);

  const SaveAttachMatter = async (matterSelected: any)=> {

    try
    {
      if (!matterSelected) return;
      if (useModalContext.caller != 'matterAttach') return;

      setStatusPage('attach')
      await SaveMatterAttach(matterSelected?.matterId.toString(), Number(id))

      addToast({
        type: 'success',
        title: 'Operação realizada com sucesso',
        description: `O processo selecionado foi anexado com sucesso`,
      });

      setLoadAttachList(!loadAttachList)
      useModalContext.handleCaller('')
      setStatusPage('')
    }
    catch(err: any){
      addToast({
        type: 'info',
        title: 'Operação realizada com sucesso',
        description: err.response.data.Message
      });

      setStatusPage('')
    }
  }

  // While is loading component, show loader and waiting message
  if (isLoading) {

    return (
      <Container>
        <div className="waiting">
          <Loader size={30} color="var(--blue-twitter)" />
        </div>
      </Container>
    )
  }


  const OpenUnfoldingModal = async () => {
    if(matterId == 0)
    {
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'É necessário salvar o processo antes de realizar o desdobramento'
      });
    }
    else{
      setShowUnfoldingModal(true)
    }
  }

  
  const CloseUnfoldingModal = async () => {
    setShowUnfoldingModal(false)
  }



  // Matter legal details screeen
  return (

    <>

      <Container>

      {(showUnfoldingModal) && <Overlay /> }
      {(showUnfoldingModal) && <UnfoldingModal callbackFunction={{ CloseUnfoldingModal, matterId }} /> }

      {isFollowedMatterNumberChanged && (
        <ConfirmBoxModal
          title="Processo - Acompanhamento"
          caller="followedMatterNumberChanged"
          useCheckBoxConfirm
          message={errorMessage}
        />
      )}

      {isMatterAwarenessError && (
        <ConfirmBoxModal
          title="Processo - Acompanhamento"
          caller="matterAwarenesError"
          checkMessage="Estou ciente sobre a operação realizada."
          buttonOkText="Estou ciente"
          useCheckBoxConfirm
          message={errorMessage}
          showMainButtonCancel={false}
        />
      )}

        {useModalContext.openSelectProcess === 'Open' && (
          <GridSelectProcess />
        )}

        <div className='markers'>
          <ReactTags
            handleDelete={(i) => handleDeleteMarker(i)}
            handleAddition={(i) => handleAddition(i)}
            handleDrag={(tag, currPos, newPos) => handleDrag(tag, currPos, newPos)}
            tags={markerList}
            autofocus={false}
            readOnly={false}
            minQueryLength={5}
            maxLength={30}
            allowDeleteFromEmptyInput
            allowUnique
            allowDragDrop
            allowAdditionFromPaste
            placeholder={(markerList.length == 0? 'Inserir Marcador': '')}
          />
        </div>

        <div className='content'>

          <section>

            <label>
              Código
              <input
                className='inputField'
                type="text"
                disabled
                value={matterId}
              />
            </label>

            <label>
              Pasta
              <input
                className='inputField'
                type="text"
                onChange={(e) => setMatterFolder(e.target.value)}
                value={matterFolder}
              />
              <FiRefreshCcw className='infoMessage' title="Obtém o número de sequencia para a pasta" onClick={() => handleNextFolderName()} />
            </label>

            <label style={{flex:'17.1%'}}>
              Nº do Processo
              <input
                className='inputField'
                type="text"
                onChange={(e) => setMatterNumber(e.target.value)}
                value={matterNumber}
              />
                <BsFolderSymlink className='infoMessage' title="Desdobramento do Processo" onClick={() => OpenUnfoldingModal()} />
            </label>

            <label style={{flex:'17%'}}>
              Nº Único (CNJ)
              <input
                className='inputField'
                type="text"
                onChange={(e) => setMatterNumberCNJ(e.target.value)}
                value={matterNumberCNJ}
              />
              <MdHelp className='infoMessage' title="Preencher o numero completo do processo para o recebimento automático de publicação" />
            </label>

          </section>

          <section>

            <label>
              Segurança
              <Select
                value={matterSecurityList.find(item => item.id === matterSecurity)}
                onChange={(e) => setMatterSecurity(e === null? 'U': e.id)}
                options={matterSecurityList}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
              />
              {matterSecurity === 'R' && <ImUsers onClick={() => handleShowUsersModal()} /> }
            </label>

            <label>
              Ação Judicial
              <Select
                isSearchable
                isClearable
                isLoading={currentListData === ComboSelectType.judicialAction && isLoadingCombo}
                options={judicialActionList}
                value={judicialActionList.find(item => Number(item.id) === matterJudicialActionId)}
                onInputChange={(term) => handleReactInputText(ComboSelectType.judicialAction, term)}
                onChange={(item) => handleReactSelectChange(ComboSelectType.judicialAction, item)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                placeholder="Selecione"
              />
            </label>

            <label>
              Natureza Jurídica
              <input
                className='inputField'
                type="text"
                disabled
                value={legalNatureDescription}
              />
            </label>

          </section>

          <section>

            <label>
              Título:
              <input
                className='inputField'
                name='matterTitle'
                onChange={(e) => setMatterTitle(e.target.value)}
                value={matterTitle}
              />
              <MdHelp className='infoMessage' title="Informe uma especificação da ação (Apelido)" />
            </label>

            <label>
              Nº Ordem / Controle
              <input
                className='inputField'
                name='matterOrder'
                onChange={(e) => setMatterOrder(e.target.value)}
                value={matterOrder}
              />
            </label>

            <label>
              Rito:
              <Select
                isSearchable
                isClearable
                isLoading={currentListData === ComboSelectType.rito && isLoadingCombo}
                options={ritoList}
                value={ritoList.find(item => Number(item.id) === matterRitoId)}
                onInputChange={(term) => handleReactInputText(ComboSelectType.rito, term)}
                onChange={(item) => handleReactSelectChange(ComboSelectType.rito, item)}
                placeholder="Selecione"
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
              />
            </label>

          </section>

          <section>

            <label style={{flex:'17.1%'}}>
              Probab. de Êxito
              <Select
                isSearchable
                isClearable
                isLoading={currentListData === ComboSelectType.probablySuccess && isLoadingCombo}
                options={probablySuccessList}
                value={probablySuccessList.find(item => Number(item.id) === matterProbablySuccessId)}
                onInputChange={(term) => handleReactInputText(ComboSelectType.probablySuccess, term)}
                onChange={(item) => handleReactSelectChange(ComboSelectType.probablySuccess, item)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                placeholder="Selecione"
              />
            </label>

            <label style={{flex:'17.1%'}}>
              Decisão
              <Select
                isSearchable
                isClearable
                isLoading={currentListData === ComboSelectType.matterDecision && isLoadingCombo}
                options={decisionList}
                value={decisionList.find(item => Number(item.id) === matterDecisionId)}
                onInputChange={(term) => handleReactInputText(ComboSelectType.matterDecision, term)}
                onChange={(item) => handleReactSelectChange(ComboSelectType.matterDecision, item)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                placeholder="Selecione"
              />
            </label>

            <label>
              Fase Processual
              <Select
                isSearchable
                isClearable
                isLoading={currentListData === ComboSelectType.processualStage && isLoadingCombo}
                options={processualStageList}
                value={processualStageList.find(item => Number(item.id) === matterProcessualStageId)}
                onInputChange={(term) => handleReactInputText(ComboSelectType.processualStage, term)}
                onChange={(item) => handleReactSelectChange(ComboSelectType.processualStage, item)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                placeholder="Selecione"
              />
            </label>

            <label>
              Status do Processo
              <Select
                isSearchable
                isClearable
                isLoading={currentListData === ComboSelectType.matterStatus && isLoadingCombo}
                options={matterStatusList}
                value={matterStatusList.find(item => Number(item.id) === matterStatusId)}
                onInputChange={(term) => handleReactInputText(ComboSelectType.matterStatus, term)}
                onChange={(item) => handleReactSelectChange(ComboSelectType.matterStatus, item)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                placeholder="Selecione"
              />
            </label>

          </section>

          <section>

            <label>
              Distribuição
              <input
                type="date"
                className='inputField'
                onChange={(e) => setMatterDateRelease(e.target.value)}
                value={matterDateRelease}
              />
            </label>

            <label>
              Data de Entrada
              <input
                type="date"
                className='inputField'
                onChange={(e) => setMatterDateEntrance(e.target.value)}
                value={matterDateEntrance}
              />
              <MdHelp className='infoMessage' title="Informe a data de entrada do processo" />
            </label>

            <label>
              Encerramento
              <input
                type="date"
                className='inputField'
                onChange={(e) => setMatterDateFinalization(e.target.value)}
                value={natterDateFinalization}
              />
              <MdHelp className='infoMessage' title="Informe a data de encerramento do processo" />
            </label>

          </section>

          <section>

            {/* <label>
              Usuário Tribunal
              <input
                className='inputField'
                type="text"
                autoComplete="off"
                readOnly
                onFocus={(event) => event.target.removeAttribute('readOnly')}
                onChange={(e) => setMatterUserCourt(e.target.value)}
                value={matterUserCourt}
              />
              <MdHelp className='infoMessage' title="Preencha se o processo for segredo de justiça e desejar habilitar a busca automática nos tribunais" />
            </label> */}

            {/* <label>
              Senha :
              <input
                className='inputField'
                type="password"
                readOnly
                onFocus={(event) => event.target.removeAttribute('readOnly')}
                onChange={(e) => setMatterUserCourtPsw(e.target.value)}
                value={matterUserCourtPsw}
              />
            </label> */}

            <label className="inputLabel">
              <p>Responsável</p>
              <div className="inputContainer">
                <input
                  className='inputField'
                  type="text"
                  title={matterResponsibleDescription}
                  value={(matterResponsibleDescription ?? "").length <= 50 ? matterResponsibleDescription : `${matterResponsibleDescription.substring(0, 50)} ...`}
                  style={{ cursor: 'pointer', opacity: '0.5', width: '31.5%' }}
                />
                <BsPersonLinesFill className='personIcon' onClick={() => setShowResponsible(true)} style={{ marginLeft: '8px', cursor: 'pointer'}} />
              </div>
            </label>

          </section>

          <div className='valores'>

            <header> Valores </header>

            {!isMOBILE && (
              <div>
                <label>Identificação</label>
                <label>Tipo</label>
                <label>Valor</label>
                <label>Data</label>
                <label style={{marginLeft:'65px'}}>Valor Atual</label>
                <label>Data Correção</label>
                <label>Data últ. indice</label>
              </div>
            )}

            {matterDataValues.map(item => {

              return (

                <div key={item.id}>

                  {/* risk value and cause value doesn't allow edit name */}
                  <input
                    id={item.id.toString()}
                    type='text'
                    placeholder='Identificação do Valor'
                    value={item.name}
                    onChange={handleChangeValueName}
                    disabled={item.blockValue}
                  />

                  {/* risk value and cause value doesn't allow edit name */}
                  <select
                    id={item.id.toString()}
                    value={item.typeValue}
                    onChange={handleChangeValueType}
                    disabled={item.blockValue}
                    style={{opacity: (item.blockValue)?'0':'1'}}
                  >
                    {matterCalcType.map(item => {
                      return <option value={item.id}>{item.label}</option>
                    })}
                  </select>

                  <IntlCurrencyInput
                    id={item.id.toString()}
                    currency="BRL"
                    config={currencyConfig}
                    onBlur={() => handleRefreshCalculation(item.id)}
                    onChange={handleChangeValueOriginal}
                    value={item.originalValue}
                  />

                  <input
                    id={item.id.toString()}
                    type='date'
                    placeholder='Data'
                    onChange={handleChangeValueStartDate}
                    value={item.startDate}
                  />

                  {!isMOBILE && (
                    <>
                      <FaCalculator title="Clique para definir as opções de correção monetária" onClick={() => handleOpenShowValues(item)} />
                      <FiRefreshCcw title="Clique para recalcular" onClick={() => handleRefreshCalculation(item.id)} />
                      <FiPrinter title="Clique para imprimir a memória de cálculo ou o resumo dos débitos judiciais" onClick={() => handleOpenPrintValuesModal(item)} />
                    </>
                  )}

                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={item.updateValue}
                    disabled
                  />

                  <input
                    type='date'
                    disabled
                    placeholder='Data da Correção'
                    value={item.updateDate}
                  />

                  <input
                    type='date'
                    disabled
                    placeholder='Data último indice'
                    value={item.lastIndexDate}
                  />

                  <FiTrash
                    onClick={() => handleDeleteValuesLine(item)}
                    style={{opacity: (item.blockValue)?'0':'1'}}
                  />

                </div>
              )
            })}

            <br />

          </div>

          <div className='buttonAddNewValue'>
            <button
              type='button'
              className='buttonLinkClick'
              onClick={handleNewValuesLine}
            >
                <GoPlus />
                Adicionar novo
            </button>
          </div>

          <div className='objectResume'>

            <header>Objeto / Resumo</header>

            <textarea
              value={matterObjectDescription}
              placeholder="Descrição do objeto"
              onChange={(e) => setMatterObjectDescription(e.target.value)}
            />

          </div>

        </div>

        {/* render append matter if exists */}
        {Number(id) > 0 && <MatterAttach matterId={id} refresh={loadAttachList} /> }

        <footer>

          {(accessCode?.includes('MATLEGAL') || accessCode === 'adm') && (
            <button
              type='submit'
              className='buttonLinkClick'
              onClick={() => handleSaveMatter()}
            >
              <FiSave />
              <span>Salvar</span>
            </button>
          )}

          {showButtonDelete && (
            <button
              type='button'
              className='buttonLinkClick'
              onClick={() => setIsDeleting(true)}
            >
              <MdBlock />
              Excluir
            </button>
          )}

          {(accessCode?.includes('MATLEGAL') || accessCode === 'adm') && (
            <button
              type='button'
              className='buttonLinkClick'
              onClick={() => handleAttachMatter()}
            >
              <ImCopy />
              Apensar
            </button>
          )}

        </footer>

        {/* Users modal */}
        {showUsers && (
          <MatterUsers
            callbackFunction={{
              handleCloseUsersModal,
              matterId
            }}
          />
        )}

        {/* Responsible modal */}
        {showResponsible && (
          <MatterResponsible
            callbackFunction={{
              handleCloseResponsibleModal,
              handleResponsibleListSave,
              responsibleList
            }}
          />
        )}

        {/* Values lines */}
        {showValues && (
          <MatterValues
            callbackFunction={{
              handleCloseValuesModal,
              handleCalculateValues,
              jsonCalculator,
              isMatterValue
            }}
          />
        )}

        {/* Print values modal */}
        {showPrintValues && (
          <MatterValuesReport
            callbackFunction={{
              id,
              matterDataValues,
              jsonCalculator,
              handleClosePrintValuesModal
            }}
          />
        )}

      {isDeleting && (
        <ConfirmBoxModal
          title="Exclusão de Processos"
          useCheckBoxConfirm
          caller="matterEdit"
          message="ATENÇÃO: Confirmando a exclusão, todos os dados associados ao processo, inclusive acompanhamentos e publicações, serão excluídos(as).
          Movimentos financeiros, faturas e compromissos associados a este processo serão desassociados e mantidos. ?"
        />
      )}

      </Container>

      {showMessageDeletingEvent && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <Loader size={15} color="var(--blue-twitter)" />
            {' '}
            Excluindo andamentos...
          </div>
        </>
      )} 
      
      {showMessageDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <Loader size={15} color="var(--blue-twitter)" />
            {' '}
            Excluindo processo...
          </div>
        </>
      )} 

      {statusPage != '' && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <Loader size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            {statusPage === 'calc' &&  <span>Atualizando valores...</span> }
            {statusPage === 'save' &&  <span>Salvando...</span> }
            {statusPage === 'attach' &&  <span>Anexando processo...</span> }
          </div>
        </>
      )}

    </>
  )
}

export default Matter
