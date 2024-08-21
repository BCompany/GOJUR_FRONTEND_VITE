/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, UIEvent, useRef, useCallback, ChangeEvent, useLayoutEffect } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useDefaultSettings } from 'context/defaultSettings';
import { RiCalendarCheckFill } from 'react-icons/ri';
import { useAlert } from 'context/alert';
import Loader from 'react-spinners/PulseLoader';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FaRegEdit, FaExchangeAlt, FaPlus, FaFileAlt } from 'react-icons/fa';
import { FiDatabase, FiKey, FiPaperclip, FiPlus } from 'react-icons/fi';
import { AiOutlinePrinter, AiFillFolderOpen, AiOutlineFile } from 'react-icons/ai'
import { useAuth } from 'context/AuthContext';
import { VscTag } from 'react-icons/vsc';
import { useHistory } from 'react-router-dom'
import { FcAbout, FcSearch } from 'react-icons/fc';
import { RiDeleteBinLine } from 'react-icons/ri';
import { SiSonarsource } from 'react-icons/si';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { BiUpArrowAlt, BiDownArrowAlt, BiEditAlt, BiSave, BiLoader } from 'react-icons/bi';
import { GiNewspaper } from 'react-icons/gi';
import { MdBlock } from 'react-icons/md';
import { format } from 'date-fns';
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { useToast } from 'context/toast';
import api from 'services/api';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useDocument } from 'context/document'
import { FormatDate, selectStyles } from 'Shared/utils/commonFunctions';
import { matterFilteOrderBy, matterFilterOptions } from 'Shared/utils/commonListValues';
import { Tab, Tabs } from 'Shared/styles/Tabs';
import MenuHamburguer from 'components/MenuHamburguer';
import Switch from "react-switch";
import { useLocation } from 'react-router-dom';
import { useDevice } from "react-use-device";
import DatePicker from 'components/DatePicker';
import { WithContext as ReactTags } from 'react-tag-input';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useHeader } from 'context/headerContext';
import { useModal } from 'context/modal';
import VideoTrainningModal from 'components/Modals/VideoTrainning/Index';
import { Overlay } from 'Shared/styles/GlobalStyle';
import ProcessModal from 'components/HeaderPage/TopNavBar/EnvelopeNotificationList/ProcessModal';
import CustomerInfo from '../CustomerInfo';
import { ICustomerContactInfo, IMatterFollowRobotLog, IDefaultsProps, IMarkerList, IMatterData, IMatterEventData, IMatterFollowData, ISelectData, ITabsControl, ProcessData, ValuesDTO } from '../Interfaces/IMatter';
import { Container, Filter, MatterItem, MatterList } from './styles';
import RobotLogs from '../RobotLogs/Index';
import MatterParameters from '../Parameters/Index';
import DocumentModal from '../DocumentModal';
import SearchOAB from '../SearchOAB/Index';
import InvertParts from '../InvertParts/Index';
import SearchCNJ from '../SearchCNJ/Index';
import MatterFileModal from '../MatterFileModal/index';
import CredentialModal from '../../Credentials/index';
import FollowModal from '../FollowModal';

const Matter: React.FC = () => {
  const { signOut } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openProcessModal } = useAlert();
  const { addToast } = useToast();
  const history = useHistory();
  const { handleUserPermission } = useDefaultSettings();
  const { isOpenModal, selectProcess, modalActive, handleCaptureTextPublication, handleMatterAssociated, handleModalActive, handleModalActiveId } = useModal();
  const { isMenuOpen, isOpenMenuConfig, isOpenMenuSearch, isOpenMenuHelp, isOpenOldVersion, handleIsOpenMenuSearch, handleIsMenuOpen, handleIsOpenMenuConfig, handleIsOpenMenuHelp } = useMenuHamburguer();
  const { handleOpenDocumentModal, isOpenDocumentModal } = useDocument();
  const { pathname } = useLocation();
  const { isMOBILE } = useDevice();
  const { captureText, handleCaptureText, handleLoadingData } = useHeader()
  const [matterList, setMatterList] = useState<IMatterData[]>([])
  const [matterEventsTypeList, setMatterEventsTypeList] = useState<ISelectData[]>([])
  const [sortBy, setSortBy] = useState('dta_UltimoMovimento')
  const [status, setStatus] = useState('')
  const [orderBy, setOrderBy] = useState<string>('desc')
  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [isSavingNewFollow, setIsSavingNewFollow] = useState(false);
  const [hasCurrentSearch, setHasCurrentSearch] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOverlayDelete, setShowOverlayDelete] = useState(false);
  const [showOverlayDeleteEvent, setShowOverlayDeleteEvent] = useState(false);
  const [isDeletingTemp, setIsDeletingTemp] = useState(false);
  const [isPagination, setIsPagination] = useState<boolean>(false)
  const [isEndPage, setIsEndPage] = useState<boolean>(false)
  const [showInvertParts, setShowInvertParts] = useState<boolean>(false)
  const [showSearchCNJ, setShowSearchCNJ] = useState<boolean>(false)
  const [showRobotLogs, setShowRobotLogs] = useState<boolean>(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [customerInfoId, setCustomerInfoId] = useState<number>(0)
  const [customerInfo, setCustomerInfo] = useState<ICustomerContactInfo>()
  const [robotInfoLogs, setRobotInfoLogs] = useState<IMatterFollowRobotLog[]>()
  const [matterLines, setMatterLines] = useState<number>(0)
  const [tempLines, setTempLines] = useState<number>(0)
  const [currentMatterId, setCurrentMatterId] = useState(0)
  const [isSavingMatterEvent, setIsSavingMatterEvent] = useState<boolean>(false)
  const { handleCancelMessage, handleCaller, handleConfirmMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [matterType, setMatterType] = useState<string>('')
  const [tabsControl, setTabsControl] = useState<ITabsControl>({ tab1: true, tab2: false, activeTab: '' });
  const { handleShowVideoTrainning } = useModal();
  const [hasmatterAdvisory, setHasmatterAdvisory] = useState<boolean>(false)
  const [hasMatterLegal, setHasMatterLegal] = useState<boolean>(false)
  const [hasButtonIncludeMatterLegal, setHasButtonIncludeMatterLegal] = useState<boolean>(false)
  const [hasButtonIncludeMatterAdvisory, setHasButtonIncludeMatterAdvisory] = useState<boolean>(false)
  const [hasButtonDeleteMatterLegal, setHasButtonDeleteMatterLegal] = useState<boolean>(false)
  const [hasButtonDeletematterAdvisory, setHasButtonDeleteMatterAdvisory] = useState<boolean>(false)
  const [hasButtonFollow, setHasButtonFollow] = useState<boolean>(false)
  const [hasButtonGenerateDocument, setHasButtonGenerateDocument] = useState<boolean>(false)
  const [openMatterMonitorResourceModal, setOpenMatterMonitorResourceModal] = useState<boolean>(false)
  const [confirmMatterMonitorResourceModal, setConfirmMatterMonitorResourceModalFree] = useState<boolean>(false)
  const [openMatterMonitorResourceModalFree, setOpenMatterMonitorResourceModalFree] = useState<boolean>(false)
  const [confirmMatterMonitorResourceModalFree, setConfirmMatterMonitorResourceModal] = useState<boolean>(false)
  const [matterMonitorResourceMessage, setMatterMonitorResourceMessage] = useState<string>("")
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId')
  const apiKey = localStorage.getItem('@GoJur:apiKey')
  const companyPlan = localStorage.getItem('@GoJur:companyPlan')
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const [showMatterFileModal, setShowMatterFileModal] = useState<boolean>(false)
  const [matterFileId, setMatterFileId] = useState<number>(0)
  const [matterFilePlace, setMatterFilePlace] = useState<string>("")
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [showFollowModal, setShowFollowModal] = useState<boolean>(false)
  const [matterSelectedId, setMatterSelectedId] = useState<number>(0)
  const [matterSelectedNumber, setMatterSelectedNumber] = useState<string>("")
  const [isSecretJustice, setIsSecretJustice] = useState<boolean>(false);
  const [selectedCredentialid, setSelectedCredentialid] = useState<number>(0);

  const [isChanging, setIsChanging] = useState<boolean>(false);


  useEffect(() => {
    handleIsOpenMenuConfig(false)
    handleCaptureText('')
    VerifyCurrentSearch()
  }, [])


  useEffect(() => {

    if (isCancelMessage) {

      if (caller === 'confirmOpenMatterMonitorResourceModal') {
        setOpenMatterMonitorResourceModal(false)
        handleCancelMessage(false)
        setMatterMonitorResourceMessage("")
      }
    }

  }, [isCancelMessage, caller]);


  useEffect(() => {

    if (isConfirmMessage) {
      if (caller === 'confirmOpenMatterMonitorResourceModal') {
        localStorage.setItem('@GoJur:addMonitor', 'true');
        setConfirmMatterMonitorResourceModal(true)
      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {

    if (confirmMatterMonitorResourceModal) {
      setOpenMatterMonitorResourceModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      history.push('/changeplan')
    }
  }, [confirmMatterMonitorResourceModal]);


  useEffect(() => {

    if (isCancelMessage) {

      if (caller === 'confirmOpenMatterMonitorResourceModalFree') {
        setOpenMatterMonitorResourceModalFree(false)
        handleCancelMessage(false)
        setMatterMonitorResourceMessage("")
      }
    }

  }, [isCancelMessage, caller]);


  useEffect(() => {

    if (isConfirmMessage) {
      if (caller === 'confirmOpenMatterMonitorResourceModalFree') {
        setConfirmMatterMonitorResourceModalFree(true)
      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {

    if (confirmMatterMonitorResourceModalFree) {
      setOpenMatterMonitorResourceModalFree(false)
      handleCaller("")
      handleConfirmMessage(false)
      history.push('/changeplan')
    }
  }, [confirmMatterMonitorResourceModalFree]);


  const ValidateRequest = () => {

    // if there is no matter type defined
    if (matterType === '') {
      handleLoadingData(false)
      return false;
    }

    return true;
  }


  const LoadMatter = useCallback(async (state = '') => {
    try {

      if (!ValidateRequest()) return;

      const pageNumber = state === 'initialize' ? 1 : page;

      // validations to avoid unnecessary renders
      if (status === '') { return; }
      if (state != 'initialize') {
        if (page > 1 && (page === lastPage)) {
          handleLoadingData(false)
          return;
        } // if lastPage = currentPage return false
      }

      // Filter page
      let filter = {
        token,
        page: pageNumber,
        rows: 10,
        sortBy,
        orderBy,
        status,
        filterClause: captureText,
        matterType,
        companyId,
        apiKey
      }
      // Verify if exists filter saved on localstorage to apply
      const filterSaved = localStorage.getItem('@GoJur:matterFIlterJSON')

      if (filterSaved) {

        // rebuild filter with JSON saved before redirect
        const filterSavedJSON = JSON.parse(filterSaved)
        filter = filterSavedJSON

        setMatterType(filter.matterType)

        handleCaptureText(filter.filterClause)

        // define as initialize to build without append and page 1
        state = 'initialize'
      }

      // request list matter
      const response = await api.post<IMatterData[]>('Processo/Listar', filter);

      // first page result - when change betwwen matter types pass initialize params to reset pagination, filter etc
      if (!isPagination || state === 'initialize') {
        setMatterList(response.data)
        setMatterLines(0)
        setTempLines(0)
        if (response.data.length == 0) {
          localStorage.removeItem('@GoJur:matterFIlterJSON')
        }

        if (response.data.length > 0)
          setMatterLines(response.data[0].matterLines)
        setTempLines(response.data[0].tempLines)

      }
      else {

        setMatterList([...matterList, ...response.data])      // second or > page result -> append old results with new

        if (response.data.length == 0) {

          setIsEndPage(true)
        }
      }

      handleLoadingData(false)
      setLastPage(pageNumber)
      setIsLoadingPage(false)
      setIsLoading(false)
      setIsPagination(false)



      if (filterSaved) {

        // rebuild filter with JSON saved before redirect
        const filterSavedJSON = JSON.parse(filterSaved)

        // define default tab select
        setTabsControl({
          tab1: filterSavedJSON.matterType === 'matterLegal',
          tab2: filterSavedJSON.matterType === 'matterAdvisory',
          activeTab: filterSavedJSON.matterType
        });

        // remove local storage with filter
        localStorage.removeItem('@GoJur:matterFIlterJSON')
        localStorage.removeItem('@GoJur:allowMatterDelete')
      }
    }

    catch (err: any) {
      setIsLoadingPage(false)
      setIsLoading(false)
      setIsPagination(false)
      handleLoadingData(false)

      console.log(err);
    }

  }, [page, status, token, sortBy, orderBy, captureText, matterType, isPagination, lastPage, matterList])


  const LoadMatterTypeSelectOptions = async (filter = '', loadDefaults = false) => {

    const response = await api.post<ValuesDTO[]>('/TipoAcompanhamento/ListarCombo', {
      token,
      matterType,
      page: 0,
      rows: 50,
      filterClause: filter
    });

    const listSelectGrup: ISelectData[] = []

    response.data.map((item) => {

      return listSelectGrup.push({
        id: item.id,
        label: item.value
      })
    })

    if (loadDefaults) {
      setMatterEventsTypeList(listSelectGrup)
      return []
    }

    return listSelectGrup
  }


  const SaveMarkers = async (matterId: number, markersList: IMarkerList[]) => {

    try {
      // transform marker list in unique string
      let marker = '';
      markersList.map((item) => {
        marker += `${item.text},`
      })

      // save marker
      await api.post('/Processo/SalvarMarcadores', {
        token,
        matterId,
        matterType,
        markers: marker
      })
    }
    catch (err: any) {

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Houve uma falha na gravação deste marcador, verifique se o processo possui alguma pendência de cadastro e tente novamente"
      });
    }
  }


  const handleChangeStatus = async (status) => {

    // m -> Monitorado
    // In this case we do not save as default parameter, because M type is considerer a filter not a default behavior
    if (status != 'M' && status != 'P') {
      await api.post('/Parametro/Salvar', {
        parametersName: '#MTRSTTFILTER',
        parameterType: 'P',
        parameterValue: status,
        token
      })
    }

    setStatus(status);
  }


  // Reload list events by matter id
  const LoadEventList = async () => {

    try {

      // Get list events
      const response = await api.get<IMatterEventData[]>('/Compromisso/ListarCompromissosPorProcesso', {
        params: {
          matterId: currentMatterId,
          token
        }
      });

      // refresh list of events relashion to current matter
      const newList = matterList.map(matter =>
        matter.matterId === currentMatterId
          ? {
            ...matter,
            eventList: response.data,
          }
          : matter,
      );

      setMatterList(newList)
      setCurrentMatterId(0)
      // handleModalActive(false)
      // handleModalActiveId(0)

      // localStorage.removeItem('@GoJur:AppointmentId');

    } catch (err) {
      console.log(err);
    }
  }


  const handleShowMore = (matterid: number) => {
    LoadFollowsList(matterid)
  }


  // Reload list events by matter id
  const LoadFollowsList = async (matterId: number) => {

    setCurrentMatterId(matterId)

    try {
      const matter = matterList.find(item => item.matterId === matterId);

      if (!matter) {
        return
      }

      const rows = matter.followRows === 0 ? 1 : matter.followList.length;

      const response = await api.get<IMatterFollowData[]>('/ProcessoAcompanhamento/ListarAcompanhamentos', {
        params:{ matterId, count: rows, filter: 'all', token }
      });

      if (response.data.length == 0) {

        addToast({ type: 'info', title: 'Não há registros', description: `Não foram encontrados novos andamentos para exibição` });

        return;
      }

      const newList = matterList.map(matter =>
        matter.matterId === matterId
          ? {
            ...matter,
            followRows: rows,
            followList: [...matter.followList, ...response.data],
          }
          : matter,
      );

      setMatterList(newList)
    }
    catch (err) {
      console.log(err);
    }
  }


  const LoadCustomerInformation = async (peopleId: number, matterId: number) => {
    try {

      const response = await api.get<ICustomerContactInfo>('/Clientes/SelecionarContatos', {
        params: {
          token,
          peopleId
        }
      });

      setCustomerInfoId(peopleId)
      setCurrentMatterId(matterId)
      setCustomerInfo(response.data)

    } catch (err: any) {
      console.log(err)
    }
  }


  const LoadDefaultProps = async () => {
    try {

      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const permissionAccessCode = response.data.find(item => item.id === 'accessCode')
      if (permissionAccessCode) {
        localStorage.setItem('@GoJur:accessCode', permissionAccessCode.value)
      }

      // get values from permission by user and set as true or false
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      const permissiosnModule = userPermissions[0].value.split('|')
      const buttonIncludeMatterLegal = permissiosnModule.find(item => item === 'buttonIncludeMatterLegal' || item === 'adm')
      const buttonIncludematterAdvisory = permissiosnModule.find(item => item === 'buttonIncludeMatterAdvisory' || item === 'adm')
      const buttonDeleteMaterLegal = permissiosnModule.find(item => item === 'buttonDeleteMatterLegal' || item === 'adm')
      const buttonDeleteMattterAdivisory = permissiosnModule.find(item => item === 'buttonDeleteMatterAdvisory' || item === 'adm')
      const buttonFollow = permissiosnModule.find(item => item === 'buttonFollowMatter' || item === 'adm')
      const matterStatusDefault = response.data.find(item => item.id === 'defaultMatterStatusParameter' || item.id === 'adm')
      const buttonDocumentGenerate = permissiosnModule.find(item => item === 'matterDocumentGeneration' || item === 'adm')
      const videoTrainningConfig = response.data.find(item => item.id === 'defaultUserLogFirstAccess')
      if (videoTrainningConfig) {
        const seeTrainningVideo = !(videoTrainningConfig.value ?? "").includes('matter') && pathname === '/matter/list'
        handleShowVideoTrainning(seeTrainningVideo)
      }

      if (buttonIncludeMatterLegal) {
        setHasButtonIncludeMatterLegal(true)
      }

      if (buttonIncludematterAdvisory)
        setHasButtonIncludeMatterAdvisory(true)

      if (buttonDeleteMaterLegal)
        setHasButtonDeleteMatterLegal(true)

      if (buttonDeleteMattterAdivisory)
        setHasButtonDeleteMatterAdvisory(true)

      if (buttonFollow)
        setHasButtonFollow(true)

      if (buttonDocumentGenerate)
        setHasButtonGenerateDocument(true)

      // // default status filter
      if (matterStatusDefault) {
        setStatus(matterStatusDefault.value)
      } else {
        setStatus('T')
      }

      // default permissions
      if (permissiosnModule[0] == "adm") {
        setMatterType("matterLegal")
        setTabsControl({ tab1: true, tab2: false, activeTab: 'matterLegal' });
        setHasMatterLegal(true)
        setHasmatterAdvisory(true)
      }
      else {

        // verify if have matter adivisory permission
        const hasMatterAdvisory = permissiosnModule.find(item => item === 'matterAdvisory')
        const hasMatterLegal = permissiosnModule.find(item => item === 'matterLegal')
        setMatterType(hasMatterLegal ? "matterLegal" : "matterAdvisory")

        // if has matter legal set tab default
        if (hasMatterAdvisory) {
          setHasmatterAdvisory(true)
          setTabsControl({ tab1: false, tab2: true, activeTab: 'matterAdvisory' });
        }

        // if has matter adivisory set tab default
        if (hasMatterLegal) {
          setHasMatterLegal(true)
          setTabsControl({ tab1: true, tab2: false, activeTab: 'matterLegal' });
        }
      }

      handleUserPermission(permissiosnModule);

      // reset public values to avoid side effects
      // handleCaptureText('')
      setCurrentMatterId(0)
      handleIsMenuOpen(false)
      LoadMatterTypeSelectOptions('', true)
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {

    setMatterList([])
    LoadMatter('initialize');


  }, [matterType, captureText, sortBy, status, orderBy]);


  const handleTabs = (tabActive: string) => {
    if (tabsControl.activeTab === tabActive) { return; }

    setTabsControl({
      tab1: tabActive == 'matterLegal',
      tab2: tabActive == 'matterAdvisory',
      activeTab: tabActive
    })

    setIsLoading(true)
    setPage(1)
    handleCaptureText('')
    setMatterType(tabActive)
  }


  // return tab active to realce color on tab
  const tabActive = (tab: string) => {

    if (tabsControl.activeTab === tab) {
      return "buttonTabActive"
    }

    return "buttonTabInactive"
  }


  const handleFollowRobotLog = async (matterId: number) => {

    setIsLoading(true)

    try {
      const response = await api.get<IMatterFollowRobotLog[]>('/Processo/LogBotaoSeguir', {
        params: {
          token,
          matterId
        }
      });

      setRobotInfoLogs(response.data)
      setShowRobotLogs(true)
      setCurrentMatterId(matterId)
      setIsLoading(false)
    }
    catch (ex: any) {
      setIsLoading(false)
    }
  }


  const VerifyCurrentSearch = async () => {

    try {
      const response = await api.get<boolean>('/Processo/VerificarPesquisaEmExecucao', {
        params: {
          token
        }
      });

      setHasCurrentSearch(response.data)
    }
    catch (err: any) {
      console.log(err)
      if (err.response.data.statusCode == 1002) {
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }
    }
  }


  // When is pagination increments page number
  useEffect(() => {

    if (isLoadingPage && isPagination) {
      setPage(page + 1)
    }

  }, [isPagination, isLoadingPage])


  useEffect(() => {

    if (page > 1 && isPagination) {
      LoadMatter();
    }

  }, [isPagination, page])


  useLayoutEffect(() => {

    LoadDefaultProps();

  }, [handleUserPermission]);


  // clear customer info when click on close
  useEffect(() => {

    if (customerInfoId === 0) {
      setCustomerInfo(undefined)
    }

  }, [customerInfoId])


  const handleScrool = (e: UIEvent<HTMLDivElement>) => {

    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || matterList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop) - 50) <= element.clientHeight

    if (isEndScrool && !isLoadingPage) {
      setIsLoadingPage(true)
      setIsPagination(true)
    }
  }


  const handleEventSelectChange = (item, matterId) => {

    try {
      // refresh with data choose
      const newData = matterList.map(matter =>
        matter.matterId === matterId ?
          {
            ...matter,
            matterEventTypeId: item.id,
            matterEventTypeDesc: item.label
          } :
          matter
      )

      setMatterList(newData)
    }
    catch {

      // refresh after click in clearall
      const newData = matterList.map(matter =>
        matter.matterId === matterId ?
          {
            ...matter,
            matterEventTypeId: '',
            matterEventTypeDesc: ''
          } :
          matter
      )

      setMatterList(newData)
    }
  }

//
  const handleFollowButton = async (matterId: number) => {

    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind) {
      return
    }


    if (isSecretJustice && selectedCredentialid === 0) {
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Para um processo em segredo de justiça, selecione uma credencial para prosseguir."
      });
      return;
    }

    const action = !matterFind.isFollowing;

    try {

      setIsLoading(true)

      let newData = matterList.map(matter =>
        matter.matterId === matterId ?
          {
            ...matter,
            isFollowing: !matterFind.isFollowing
          } :
          matter
      )

      setMatterList(newData)

      await api.get<IMatterFollowData>('/Processo/BotaoSeguir', {
        params: {
          token,
          matterId,
          enable: action,
          credentialId: selectedCredentialid
        }
      });


      // when is filterd by monitoring remove from view
      if (status == 'M' && matterFind.isFollowing) {
        newData = matterList.filter(item => item.matterId != matterFind.matterId);
        setMatterList(newData)
      }
      setIsChanging(false)
      handleCloseFollowModal()

      setIsLoading(false)

      if (action) {       // message when turn enable
        addToast({
          type: 'success',
          title: 'Operação realizada com sucesso',
          description: `A partir de agora atualizaremos sempre seu processo com informações do tribunal. Em geral os primeiros dados são carregados em apenas alguns instantes (pode demorar um pouco se o tribunal estiver indisponível) - Avisaremos você via mensagem após a primeira captura (envelope no topo da tela).`
        });
      }
      else {              // message when turn disabled
        addToast({
          type: 'success',
          title: 'Operação realizada com sucesso',
          description: `O robô foi desabilitado com sucesso.`
        });
      }
    }
    catch (err: any) {

      handleCloseFollowModal()

      setIsLoading(false)
      setIsChanging(false)

      // disable follow button if something wrong going on
      const newData = matterList.map(matter =>
        matter.matterId === matterId ? {
          ...matter,
          isFollowing: matter.isFollowing
        } :
          matter
      )
      setMatterList(newData)

      if (err.response.data.typeError.warning == "confirmation" && (companyPlan != 'GOJURCM' && companyPlan != 'GOJURFR') && accessCode == 'adm') {
        setMatterMonitorResourceMessage(String(err.response.data.Message).split(".")[0])
        setOpenMatterMonitorResourceModal(true)
      }

      if (err.response.data.typeError.warning == "confirmation" && (companyPlan == 'GOJURFR' && accessCode == 'adm')) {
        setMatterMonitorResourceMessage(String(err.response.data.Message).split(".")[0])
        setOpenMatterMonitorResourceModalFree(true)
      }

      if (err.response.data.typeError.warning == "confirmation" && (companyPlan == 'GOJURCM' || accessCode != 'adm')) {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }

      if (!err.response.data.typeError.warning) {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }
    }
  }


  const handleFollowButtonLegalDataAPI = async (matterId: number) => {

    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind) {
      return
    }

    const action = !matterFind.isFollowingLegalData;

    try {

      setIsLoading(true)

      let newData = matterList.map(matter =>
        matter.matterId === matterId ?
          {
            ...matter,
            isFollowingLegalData: !matterFind.isFollowingLegalData
          } :
          matter
      )

      setMatterList(newData)

      await api.get<IMatterFollowData>('/Processo/BotaoSeguirLegalData', {
        params: {
          token,
          matterId,
          enable: action
        }
      });

      // when is filterd by monitoring remove from view
      if (status == 'M' && matterFind.isFollowingLegalData) {
        newData = matterList.filter(item => item.matterId != matterFind.matterId);
        setMatterList(newData)
      }

      setIsLoading(false)

      if (action) {       // message when turn enable
        addToast({
          type: 'success',
          title: 'Operação realizada com sucesso',
          description: `A partir de agora atualizaremos sempre seu processo com informações do tribunal. Em geral os primeiros dados são carregados em apenas alguns instantes (pode demorar um pouco se o tribunal estiver indisponível) - Avisaremos você via mensagem após a primeira captura (envelope no topo da tela).`
        });
      }
      else {              // message when turn disabled
        addToast({
          type: 'success',
          title: 'Operação realizada com sucesso',
          description: `O robô foi desabilitado com sucesso.`
        });
      }
    }
    catch (err: any) {
      setIsLoading(false)

      // disable follow button if something wrong going on
      const newData = matterList.map(matter =>
        matter.matterId === matterId ? {
          ...matter,
          isFollowing: matter.isFollowing
        } :
          matter
      )
      setMatterList(newData)

      if (err.response.data.typeError.warning == "confirmation" && (companyPlan != 'GOJURCM' && companyPlan != 'GOJURFR') && accessCode == 'adm') {
        setMatterMonitorResourceMessage(String(err.response.data.Message).split(".")[0])
        setOpenMatterMonitorResourceModal(true)
      }

      if (err.response.data.typeError.warning == "confirmation" && companyPlan == 'GOJURFR' && accessCode == 'adm') {
        setMatterMonitorResourceMessage(String(err.response.data.Message).split(".")[0])
        setOpenMatterMonitorResourceModalFree(true)
      }

      if (err.response.data.typeError.warning == "confirmation" && (companyPlan == 'GOJURCM' || accessCode != 'adm')) {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }

      if (!err.response.data.typeError.warning) {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }
    }
  }


  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleContextIncludeMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleCloseMenuCard = () => {
    setAnchorEl(null)
  };


  useEffect(() => {
    if (isOpenMenuConfig) {
      handleIsMenuOpen(false)
    }
  }, [isOpenMenuConfig])


  useEffect(() => {

    if (isOpenMenuHelp) {
      handleShowVideoTrainning(true)
      handleIsOpenMenuHelp(false)
    }
  }, [handleIsOpenMenuHelp, handleShowVideoTrainning, isOpenMenuHelp])


  useEffect(() => {

    if (isCancelMessage && caller === 'matterCustomerInfo') {
      handleCancelMessage(false)
      handleCaller('')
      setCustomerInfoId(0)
      setCurrentMatterId(0)
    }

    if (isCancelMessage && caller === 'matterList') {
      handleCancelMessage(false)
      setIsDeleting(false)
      setIsDeletingTemp(false)
      handleCaller('')
    }

    if (isCancelMessage && caller === 'matterRobotLogs') {
      setCurrentMatterId(0)
      setRobotInfoLogs([])
      setShowRobotLogs(false)
      handleCaller('')
    }

    if (isCancelMessage && caller === 'matterParameters') {
      handleIsOpenMenuConfig(false)
      handleCaller('')
    }

    if (isCancelMessage && caller === 'matterSearchOAB') {
      handleIsOpenMenuSearch(false)
      VerifyCurrentSearch()
      handleCaller('')
    }

    if (isCancelMessage && caller === 'matterAddAutomatic') {
      setShowSearchCNJ(false)
      handleCaller('')
      VerifyCurrentSearch()
      // LoadMatter('initialize')
    }

    if (isCancelMessage && caller === 'matterInvertParts') {
      setShowInvertParts(false)
      handleCaller('')
      UpdateMatterItem();
    }

  }, [isCancelMessage, caller, handleCancelMessage, handleCaller])


  const UpdateMatterItem = async () => {

    const matterId = localStorage.getItem('@GoJur:matterId');

    const response = await api.post<IMatterData>('/Processo/SelecionarProcesso', {
      matterId,
      token,
      companyId: localStorage.getItem('@GoJur:companyId'),
      apiKey: localStorage.getItem('@GoJur:apiKey')
    })

    const newData = matterList.map(item => (
      item.matterId === Number(matterId) ?
        {
          ...item,
          matterCustomerDesc: response.data.matterCustomerDesc,
          matterOppossingDesc: response.data.matterOppossingDesc
        } :
        item
    ))

    setMatterList(newData)
  }


  const handleDeleteMatter = (matterId: number, temp = false) => {

    if (!temp)
      setIsDeleting(true)
    else
      setIsDeletingTemp(true)

    setCurrentMatterId(matterId)
  }


  useEffect(() => {

    if (isConfirmMessage && caller === 'matterList' && (isDeleting || isDeletingTemp)) {


      if (isDeleting) {
        DeleteMatter()
      }

      if (isDeletingTemp) {
        DeleteTempMatter();
      }

      handleConfirmMessage(false)
      handleCaller('')
      setCurrentMatterId(0)
      setIsDeletingTemp(false)
      setIsLoading(false)
      setIsDeleting(false)
    }

  }, [caller, isConfirmMessage, isDeleting, isDeletingTemp])


  const DeleteMatter = async () => {

    try {
      setShowOverlayDeleteEvent(true)

      const responseEvents = await api.delete<boolean>('/ProcessoAcompanhamentos/DeletarPorProcesso', {
        params: {
          matterId: currentMatterId,
          token
        }
      })

      if (responseEvents.data) {
        setShowOverlayDeleteEvent(false)

        setShowOverlayDelete(true)

        const response = await api.delete<boolean>('/Processo/Deletar', {
          params: {
            matterId: currentMatterId,
            token
          }
        })

        if (response.data) {
          const updateMatterList = matterList.filter(item => item.matterId != currentMatterId)
          setMatterList(updateMatterList)
        }
        else {
          addToast({
            type: 'info',
            title: 'Operação NÃO realizada',
            description: "Não foi possível efetivar a exclusão deste processo"
          });
        }

        setShowOverlayDelete(false)

      }
      else {
        setShowOverlayDeleteEvent(false)
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: "Não foi possível efetivar a exclusão deste processo"
        });
      }

    }
    catch (err: any) {
      setShowOverlayDelete(false)
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message
      });
    }
  }


  const DeleteTempMatter = async () => {

    setShowOverlayDelete(true)

    try {
      const response = await api.delete<boolean>('/Processo/DeletarCarga', {
        params: {
          matterId: currentMatterId,
          token
        }
      })

      if (response.data) {
        const updateMatterList = matterList.filter(item => item.matterId != currentMatterId)
        setMatterList(updateMatterList)
      }
      else {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: "Houve uma falha na exclusão deste registro"
        });
      }

      setIsLoading(false)
      setShowOverlayDelete(false)
    }
    catch (err: any) {

      setShowOverlayDelete(false)

      console.log(err)

      setIsLoading(false)
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Houve uma falha na exclusão deste registro"
      });
    }
  }


  const handleDeleteMarker = (i, item: IMatterData) => {
    const markerDelete = item.markersList[i];
    item.markersList = item.markersList.filter(item => item.id != markerDelete.id)

    const updateMatterList = matterList.map(matter =>

      matter.matterId === item.matterId ?
        {
          ...matter,
          markersList: item.markersList
        } :
        matter
    );

    setMatterList(updateMatterList)
    SaveMarkers(item.matterId, item.markersList)
  };


  const handleAddition = (tag, item: IMatterData) => {

    // allow only 5 markers by folder
    if (item.markersList.length < 5) {

      item.markersList.push(tag)
      const updateMatterList = matterList.map(matter =>

        matter.matterId === item.matterId ?
          {
            ...matter,
            markersList: item.markersList
          } :
          matter
      );

      setMatterList(updateMatterList)
      SaveMarkers(item.matterId, item.markersList)
    }
  };


  const handleDrag = (tag, currPos, newPos, item: IMatterData) => {

    item.markersList = item.markersList.slice();

    item.markersList.splice(currPos, 1);
    item.markersList.splice(newPos, 0, tag);

    const updateMatterList = matterList.map(matter =>

      matter.matterId === item.matterId ?
        {
          ...matter,
          markersList: item.markersList
        } :
        matter
    );

    setMatterList(updateMatterList)
    SaveMarkers(item.matterId, item.markersList)
  };


  const handleShowMoreText = (itemFollow: IMatterFollowData, matterId: number) => {

    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind) { return }

    const updateFollowList = matterFind.followList.map(follow =>

      follow.description === itemFollow.description && follow.date === itemFollow.date ?
        {
          ...follow,
          seeMore: !follow.seeMore
        } :
        follow
    )

    const updateMatterList = matterList.map(matter =>
      matter.matterId === matterId ?
        {
          ...matter,
          followList: updateFollowList
        } :
        matter
    )

    setMatterList(updateMatterList)
  }


  const handleNewDescription = useCallback((event: ChangeEvent<HTMLTextAreaElement>, matterId: number) => {

    const newData = matterList.map(matter =>
      matter.matterId === matterId ?
        {
          ...matter,
          matterEventDescription: event.target.value
        } :
        matter
    );

    setMatterList(newData)

  }, [matterList])


  const handleFollowDate = useCallback((event: ChangeEvent<HTMLInputElement>, matterId: number) => {

    const newData = matterList.map(matter =>
      matter.matterId === matterId ?
        {
          ...matter,
          matterEventDate: event.target.value
        } :
        matter
    );

    setMatterList(newData)

  }, [matterList])


  const handleOpenAppointmentModal = (event: IMatterEventData, matterId: number) => {
    isOpenModal(event.eventId.toString())
    setCurrentMatterId(matterId)
    // handleModalActive(true)

    // localStorage.setItem('@GoJur:AppointmentId', event.eventId.toString());
    localStorage.setItem('@GoJur:RecurrenceDate', FormatDate(new Date(event.startDate), 'yyyy-MM-dd'))
  }


  const handleAppointmentModalInclude = async (matterId: number) => {

    try {

      isOpenModal('0')

      // handleModalActive(true)

      setCurrentMatterId(matterId)

      if (matterId > 0) {
        const response = await api.post<ProcessData>('/Processo/SelecionarProcesso', {
          matterId,
          token,
          companyId: localStorage.getItem('@GoJur:companyId'),
          apiKey: localStorage.getItem('@GoJur:apiKey')
        }
        );

        let courtDesc = "";
        let courtDeptDesc = "";

        if (response.data.instanceList.length > 0) {
          const court = response.data.instanceList[0];

          courtDesc = `${court.forumDesc.toString()} - ${court.instance.toString()} Instância`;
          courtDeptDesc = `${court.varaNumber.toString()}ª ${court.varaDesc.toString()}`;
        }

        const matter = response.data;

        selectProcess({
          matterId,
          matterCustomerDesc: matter.matterCustomerDesc,
          matterOppossingDesc: matter.matterOppossingDesc,
          matterFolder: matter.matterFolder,
          matterNumber: matter.matterNumber,
        })

        let matterText = `Pasta: ${matter.matterFolder} - Proc: ${matter.matterNumber}`

        if (matter.matterCustomerDesc) {
          matterText += `\n${matter.matterCustomerDesc}`
        }

        if (matter.matterOppossingDesc) {
          matterText += ` X ${matter.matterOppossingDesc}`
        }

        if (courtDesc) {
          matterText += `\n${courtDesc}`
        }

        if (courtDeptDesc) {
          matterText += `\n${courtDeptDesc}`
        }

        handleMatterAssociated(true)

        handleCaptureTextPublication(matterText)

        localStorage.setItem('@GoJur:PublicationHasMatter', 'S')
      }

    } catch (err) {
      console.log('Error in create a new calendar by matter view')
    }
  }


  useEffect(() => {

    if (!modalActive && currentMatterId > 0) {
      LoadEventList();
    }

  }, [modalActive])


  const handleEditFollowText = useCallback((follow: IMatterFollowData, matterId: number, matterEventDesc: string) => {
    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind) {
      return
    }
    // default text edition
    const currentFollow = matterFind.followList.find(item => item.id === follow.id);
    if (currentFollow) {
      if (!currentFollow.editEvent) {
        matterEventDesc = follow.description
      }
    }

    // set follow selected as edit
    const newFollowList = matterFind.followList.map(item => (
      item.id === follow.id ?
        {
          ...item,
          description: matterEventDesc,
        } :
        item
    ))

    // update follow inside matter
    const newList = matterList.map(matter => (
      matter.matterId === matterId ?
        {
          ...matter,
          followList: newFollowList
        } :
        matter
    ))

    setMatterList(newList)

  }, [matterList])


  const handleEditFollowType = useCallback((follow: IMatterFollowData, matterId: number, matterEventType: ISelectData | null) => {
    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind || !matterEventType) {
      return
    }

    // set follow selected as edit
    const newFollowList = matterFind.followList.map(item => (
      item.id === follow.id ?
        {
          ...item,
          typeFollowId: matterEventType.id,
          typeFollowDescription: matterEventType.label
        } :
        item
    ))

    // update follow inside matter
    const newList = matterList.map(matter => (
      matter.matterId === matterId ?
        {
          ...matter,
          followList: newFollowList
        } :
        matter
    ))

    setMatterList(newList)

  }, [matterList])


  const handleEditFollowDate = useCallback((follow: IMatterFollowData, matterId: number, matterEventDate: string | null) => {
    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind || !matterEventDate) {
      return
    }

    // set follow selected as edit
    const newFollowList = matterFind.followList.map(item => (
      item.id === follow.id ?
        {
          ...item,
          date: new Date(`${matterEventDate}T00:00:00`)
        } :
        item
    ))

    // update follow inside matter
    const newList = matterList.map(matter => (
      matter.matterId === matterId ?
        {
          ...matter,
          followList: newFollowList
        } :
        matter
    ))

    setMatterList(newList)

  }, [matterList])


  const handleCancelFollow = (follow: IMatterFollowData, matterId: number) => {
    setCurrentMatterId(0)
    const matterFind = matterList.find(item => item.matterId === matterId);

    if (!matterFind) {
      return
    }

    // set follow selected as edit
    const newFollowList = matterFind.followList.map(item => (
      item.id === follow.id ?
        {
          ...item,
          editEvent: false
        } :
        item
    ))

    // update follow inside matter
    const newList = matterList.map(matter => (
      matter.matterId === matterId ?
        {
          ...matter,
          followList: newFollowList
        } :
        matter
    ))

    setMatterList(newList)
  }


  const handleDocumentModal = (matterId: number, customerId: number) => {

    localStorage.setItem('@GoJur:matterId', matterId.toString())
    localStorage.setItem('@GoJur:customerId', customerId.toString())
    handleOpenDocumentModal(true)
  }


  const ValidateSaveFollow = useCallback((matter: IMatterData, isEdit: boolean) => {

    if ((matter.forumName ?? "").length === 0 && matterType === 'matterLegal') {

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Processo não tem fórum cadastrado - Inclua um fórum/instância antes de utilizar o cadastro rápido de andamentos! Para incluir um fórum clique em \"Ver Detalhes\" nas opções ao lado direito"
      })

      return false;
    }

    if ((matter.matterEventDescription ?? "").length === 0 && !isEdit) {

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "O campo Descrição não pode ser nulo."
      })

      return false;
    }

    return true

  }, [addToast, matterType])


  // SAVE MATTER EVENT
  const handleSaveNewFollow = useCallback(async (matter: IMatterData) => {
    try {
      // Call validation
      if (!ValidateSaveFollow(matter, false)) {
        return
      }

      setCurrentMatterId(matter.matterId)
      setIsSavingNewFollow(true)

      const response = await api.post<IMatterFollowData>('/ProcessoAcompanhamento/CriarAcompanhamentoWall', {
        token,
        matterId: matter.matterId,
        matterEventText: encodeURIComponent(matter.matterEventDescription),
        matterEventDate: matter.matterEventDate,
        matterEventTypeId: matter.matterEventTypeId,
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey')
      });

      if (!matter) {
        setIsSavingNewFollow(false)
        return;
      }

      const newArray = [response.data].concat(matter.followList.slice(1))
      const newList = matterList.map(item =>
        item.matterId === matter.matterId
          ? {
            ...item,
            followList: newArray,
            matterEventDescription: ''
          }
          : item,
      );

      setMatterList(newList)
      setIsSavingNewFollow(false)
      setCurrentMatterId(0)
    }
    catch (err: any) {
      setIsSavingNewFollow(false)
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data ? err.response.data.replace('#', '') : 'Não foi possível executar esta operação'
      });
    }

  }, [token, matterList])


  // EDIT MATTER EVENT
  const handleEditFollow = useCallback((state: string, follow: IMatterFollowData, matterId: number) => {
    try {
      console.log(follow)
      if (follow.typeFollow == 'T' || follow.typeFollow == 'W')
        setIsEdit(true)
      else
        setIsEdit(false)

      setCurrentMatterId(matterId)

      if (isSavingMatterEvent) {
        addToast({ type: 'info', title: 'Aguarde um instante', description: `Existe um andamento sendo salvo no momento, aguarde um instante` });
        return false;
      }

      if (follow.description.length === 0 && state === 'save') {
        addToast({ type: 'info', title: 'Operação NÃO realizada', description: `É necessário informar uma descrição para este andamento.` });
        setIsSavingMatterEvent(false)
        return
      }

      const matterFind = matterList.find(item => item.matterId === matterId);

      if (!matterFind) {
        return
      }

      // Call validation
      if (!ValidateSaveFollow(matterFind, true)) {
        return
      }
      // set follow selected as edit
      const editFollowList = matterFind.followList.map(item => (
        item.id === follow.id ?
          {
            ...item,
            editEvent: true,
            isSaving: state == 'save',
            description: follow.description,
            typeFollowDescription: item.typeFollowDescription,
            typeFollowId: item.typeFollowId,
            date: item.date
          } :
          item
      ))

      // update follow inside matter
      const newList = matterList.map(matter => (
        matter.matterId === matterId ?
          {
            ...matter,
            followList: editFollowList
          } :
          matter
      ))

      setMatterList(newList)

      const SaveEditFollow = async (follow) => {

        try {
          setIsSavingMatterEvent(true)

          const response = await api.post<IMatterFollowData>('/ProcessoAcompanhamento/SalvarEdicaoAcompanhamentoWall', {
            token,
            matterEventId: follow.id,
            matterEventTypeId: follow.typeFollowId,
            matterEventDate: follow.date,
            matterEventText: encodeURIComponent(follow.description),
          });

          const editFollowList = matterFind.followList.map(item => (
            item.id === follow.id ?
              {
                ...item,
                editEvent: false,
                imageUserEdit: response.data.imageUserEdit,
                userEditName: response.data.userEditName
              } :
              item
          ))

          // update follow inside matter
          const newList = matterList.map(matter => (
            matter.matterId === matterId ?
              {
                ...matter,
                followList: editFollowList
              } :
              matter
          ))

          setMatterList(newList)

          setIsSavingMatterEvent(false)

          setIsEdit(false)

          addToast({ type: 'success', title: 'Operação realizada com sucesso', description: `O andamento foi atualizado com sucesso.` });
        }
        catch (err: any) {
          setIsSavingMatterEvent(false)
          setIsEdit(false)

          const editFollowList = matterFind.followList.map(item => (item.id === follow.id ? { ...item, editEvent: false } : item))
          const newList = matterList.map(matter => (
            matter.matterId === matterId ?
              {
                ...matter,
                followList: editFollowList
              } :
              matter
          ))

          setMatterList(newList)

          addToast({ type: 'error', title: 'Operação NÃO realizada', description: `Houve uma falha na gravação do acompanhamento.` });
        }
      }

      if (state == 'save') {
        SaveEditFollow(follow)
      }
      else {
        setMatterList(newList)
      }
    }
    catch (e: any) {
      setIsEdit(false)

      addToast({ type: 'info', title: 'Operação NÃO realizada', description: `Houve uma falha na atualização deste andamento.` });
    }
  }, [addToast, isSavingMatterEvent, matterList, token])


  const handleRedirectToProcess = (id) => {

    const pageType = matterType === 'matterLegal' ? 'legal' : 'advisory'
    const url = `/matter/edit/${pageType}/${id}`

    history.push(url)

    const filterJSON = {
      token,
      page: 1,
      rows: 10,
      sortBy,
      orderBy,
      status,
      filterClause: captureText,
      matterType,
      companyId: localStorage.getItem('@GoJur:companyId'),
      apiKey: localStorage.getItem('@GoJur:apiKey')
    };

    localStorage.setItem('@GoJur:matterFIlterJSON', JSON.stringify(filterJSON));
    // localStorage.setItem('@GoJur:allowMatterDelete', hasButtonDeleteMatterLegal? "S": "N");
  }


  const handleRedirectToTagPrinter = async (matterId) => {
    // const urlRedirect = `${envProvider.redirectUrl}reports/matter/label?matterId=${id}&token=${token}`;
    localStorage.setItem('@GoJur:matterCoverId', matterId.toString());
    history.push("/matter/printer/label", '_blank');
  }


  const handleOpenMatterCover = async (matterId) => {
    localStorage.setItem('@GoJur:matterCoverId', matterId.toString());
    window.open('/matter/printer/cover', '_blank');
  }


  const handleOpenInvertParts = async (matterId) => {
    localStorage.setItem('@GoJur:matterId', matterId.toString());
    setShowInvertParts(true);
  }


  const handleOpenMatterDataReport = useCallback(async (matterId) => {

    if (isGeneratingReport) {
      return;
    }

    setIsGeneratingReport(true)

    try {
      // matter legal filter
      let filter = `matterType=legal,privateEvent=Y,matterEventQty=T,reportLayout=detailedRecord,calendarEventQty=00,matterId=${matterId}`;

      // matter advisory filter
      if (matterType != "matterLegal")
        filter = `matterType=advisory,privateEvent=Y,matterEventQty=T,reportLayout=detailedRecord,calendarEventQty=00,matterId=${matterId}`;

      const response = await api.get('/Processo/FichaDoProcesso', {
        params: {
          filter,
          filterDescription: `Tipo Processo: ${matterType == "matterLegal" ? "Jurídico" : "Consultivo"}`,
          token
        }
      })

      setIdReportGenerate(response.data)
    }
    catch {
      setIsGeneratingReport(false)
    }

  }, [matterType, token])


  // when exists report id verify if is avaiable every 2 seconds
  useEffect(() => {
    if (idReportGenerate > 0) {
      const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 2000);
    }
  }, [idReportGenerate])


  // Check is report is already
  const CheckReportPending = useCallback(async (checkInterval) => {
    if (isGeneratingReport) {
      const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
        id: idReportGenerate,
        token
      })

      if (response.data == "F" && isGeneratingReport) {
        clearInterval(checkInterval);
        setIsGeneratingReport(false)
        OpenReportAmazon()
      }

      if (response.data == "E") {
        clearInterval(checkInterval);
        setIsGeneratingReport(false)

        addToast({
          type: "error",
          title: "Operação não realizada",
          description: "Não foi possível gerar o relatório."
        })
      }
    }
  }, [isGeneratingReport, idReportGenerate])


  // Open link with report
  const OpenReportAmazon = async () => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token
    });

    setIdReportGenerate(0)
    window.open(`${response.data.des_Parametro}`, '_blank');
  }


  const handleNewMatter = () => {

    if ((!hasButtonIncludeMatterLegal && matterType == 'matterLegal') || (!hasButtonIncludeMatterAdvisory && matterType == 'matterAdvisory')) {
      addToast({
        type: 'info',
        title: 'Acesso Negado',
        description: "O seu usuário não possuí permissão para inclusão de processos"
      });

      return false;
    }

    setAnchorEl(null)
    handleRedirectToProcess(0);
  }


  const handleNewMatterAutomatic = () => {

    if ((!hasButtonIncludeMatterLegal && matterType == 'matterLegal') || (!hasButtonIncludeMatterAdvisory && matterType == 'matterAdvisory')) {
      addToast({
        type: 'info',
        title: 'Acesso Negado',
        description: "O seu usuário não possuí permissão para inclusão de processos"
      });

      return false;
    }

    setAnchorEl(null)
    setShowSearchCNJ(true)
  }


  const handleNewMatterAutomaticBatch = () => {

    if ((!hasButtonIncludeMatterLegal && matterType == 'matterLegal') || (!hasButtonIncludeMatterAdvisory && matterType == 'matterAdvisory')) {
      addToast({
        type: 'info',
        title: 'Acesso Negado',
        description: "O seu usuário não possuí permissão para inclusão de processos"
      });

      return false;
    }

    setAnchorEl(null)
    history.push(`/matter/searchcnj`)
  }


  const RenderPendingLoadMessage = (status: string, statusCreation: string, error: string) => {

    // MESSAGE WHEN THERE IS A ERROR IMPORT
    if (status === 'N') {
      return (
        <>
          <span
            style={{ color: 'var(--red)' }}
            className="waitingImport"
          >
            Não Importado
          </span>
          &nbsp;&nbsp;
          <FcAbout className='aboutMessage' title={error} style={{ cursor: 'pointer' }} />
        </>
      )
    }

    // MESSAGE WHEN IS NOT APPROVED FOR IMPORT
    if (statusCreation === 'A' && status != 'N') {
      return (
        <>
          <span className="waitingImport">
            Limite Atingido
          </span>
          &nbsp;&nbsp;
          <FcAbout className='aboutMessage' title="O Plano Free permite o cadastro/importação de até 30 processos – para importar os demais entre em contato conosco (www.bcompany.com.br / (11) 2626-0385) e migre o seu plano." style={{ cursor: 'pointer' }} />
        </>
      )
    }

    // MESSAGE WHEN IS WAITING FOR IMPORT
    if (statusCreation === 'L' && (status === 'R' || status === 'P')) {
      return (
        <>
          <span className="waitingImport">
            Importando...
          </span>
          &nbsp;&nbsp;
          <FcAbout className='aboutMessage' title="Nossos robôs estão trabalhando para encontrar mais informações referente a este processo, dentro de instantes ele poderá ser visualizado no painel de processos do GOJUR." style={{ cursor: 'pointer' }} />
        </>
      )
    }

    // MESSAGE DEFAULT
    return (
      <>
        <span className="waitingImport">
          Aguardando...
        </span>
        &nbsp;&nbsp;
        <FcAbout className='aboutMessage' title="Estamos trabalhando para completar o cadastro deste processo no GOJUR." />
      </>
    )
  }


  const handleOpenMatterFileModal = async (matterId, matteFilePlace) => {
    setShowMatterFileModal(true)
    setMatterFileId(matterId)
    setMatterFilePlace(matteFilePlace)
  }


  const handleCloseMatterFileModal = async () => {
    setShowMatterFileModal(false)
    setMatterFileId(0)
    setMatterFilePlace("")
  }

  const handleOpenFollowModal = async (matter) => {
    setMatterSelectedId(matter.matterId)
    setMatterSelectedNumber(matter.matterNumber)
    setShowFollowModal(true)
  };

  const handleCloseFollowModal = async () => {
    setShowFollowModal(false)
    setIsSecretJustice(false)
    setMatterSelectedId(0)
    setMatterSelectedNumber('')
    setSelectedCredentialid(0)
  };

  const handleSecretJusticeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSecretJustice(event.target.checked);
  }

  const handleFollowMatter = async () => {
    setIsChanging(true)
    handleFollowButton(matterSelectedId)
  }

  const handleSelectCredentialId = (id) => {
    setSelectedCredentialid(id)
  }

  return (

    <Container onScroll={handleScrool} ref={scrollRef}>

      <HeaderPage />

      {(showFollowModal) && <Overlay />}
      {showFollowModal && <FollowModal callbackFunction={{ handleCloseFollowModal, matterSelectedNumber, handleSecretJusticeChange, isSecretJustice, handleFollowMatter, handleSelectCredentialId, isChanging }} />}

      {/* MATTER FILTER AND INCLUDE */}
      <Filter>

        <button
          className="buttonLinkClick buttonInclude"
          title="Clique para incluir um novo processo"
          type="submit"
          onClick={handleContextIncludeMenu}
        >
          <FaFileAlt />
          {!isMOBILE && <span> Incluir Processo</span>}
          {isMOBILE && <span>Incluir</span>}
        </button>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          style={{ marginTop: '37px' }}
          onClose={handleCloseMenuCard}
        >

          <MenuItem
            onClick={() => handleNewMatter()}
            style={{ fontSize: '0.75rem', color: 'var(--blue-twitter' }}
          >
            <FaPlus />
            &nbsp;&nbsp; Manual
          </MenuItem>

          {matterType === "matterLegal" && (
            <MenuItem
              onClick={() => handleNewMatterAutomatic()}
              style={{ fontSize: '0.75rem', color: 'var(--blue-twitter' }}
            >
              <FaPlus />
              {'  '}
              &nbsp;&nbsp; Automático
            </MenuItem>
          )}

          {matterType === "matterLegal" && (
            <MenuItem
              onClick={() => handleNewMatterAutomaticBatch()}
              style={{ fontSize: '0.75rem', color: 'var(--blue-twitter' }}
            >
              <FaPlus />
              {'  '}
              &nbsp;&nbsp; Automático (em lote)
            </MenuItem>
          )}

        </Menu>

        {!isMOBILE && (

          <>
            <div className='filterSelect'>
              <>
                <label htmlFor="matterStatus">

                  Filtrar Por:
                  <Select
                    autoComplete="off"
                    styles={selectStyles}
                    value={matterFilterOptions.filter(options => options.id === status)}
                    onChange={(item) => handleChangeStatus(item ? item.id : '')}
                    options={matterFilterOptions}
                  />
                </label>
              </>
            </div>

            <div className='filterSelect'>
              <>
                <label htmlFor="matterOrder">
                  Organizar Por:
                  <Select
                    autoComplete="off"
                    styles={selectStyles}
                    value={matterFilteOrderBy.filter(options => options.id === sortBy)}
                    onChange={(item) => setSortBy(item ? item.id : '')}
                    options={matterFilteOrderBy}
                  />
                </label>
              </>
            </div>

            <div className='arrowOrderBy'>
              {orderBy === 'desc' && <BiDownArrowAlt title='Ordem descrecente' onClick={() => setOrderBy('asc')} />}
              {orderBy === 'asc' && <BiUpArrowAlt title='Ordem crescente' onClick={() => setOrderBy('desc')} />}
            </div>

          </>

        )}

        {!isMOBILE && (
          <>
            {status != "P" && (
              <div className='total'>
                {!isMOBILE && <span>Nº de Processos:</span>}
                {isMOBILE && <span>Total</span>}
                {' '}
                {matterLines}
              </div>
            )}

            {status == "P" && (
              <div className='total'>
                {!isMOBILE && <span>Nº de Processos em Pesquisa:</span>}
                {isMOBILE && <span>Total</span>}
                {' '}
                {tempLines}
              </div>
            )}
          </>
        )}

        <button id="options" type="button" onClick={() => handleIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <ImMenu4 /> : <ImMenu3 />}
        </button>

        {/* When is open hanburguer menu */}
        {isMenuOpen ? (
          <MenuHamburguer name='matterOptions' />
        ) : null}

      </Filter>

      <Tabs>

        {/* MATTER TABS NAMES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px', marginTop: '5px', marginBottom: '-10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {hasMatterLegal && (
              <button
                type='button'
                className={tabActive('matterLegal')}
                onClick={() => handleTabs('matterLegal')}
                style={{ marginLeft: '20px' }} // Ajuste o valor conforme necessário
              >
                <FiDatabase />
                <span style={{ marginLeft: '5px' }}>
                  Jurídico
                </span>
              </button>
            )}

            {hasmatterAdvisory && (
              <button
                type='button'
                className={tabActive('matterAdvisory')}
                onClick={() => handleTabs('matterAdvisory')}
                style={{ marginLeft: '10px' }} // Ajuste o valor conforme necessário
              >
                <FiDatabase />
                <span style={{ marginLeft: '5px' }}>Consultivo</span>
              </button>
            )}
          </div>

          {/* {isLoading && (
            <div className="loadingMessage">
              <Loader size={6} color="var(--blue-twitter)" />
            </div>
          )} */}
        </div>

        {openMatterMonitorResourceModal && (
          <ConfirmBoxModal
            caller="confirmOpenMatterMonitorResourceModal"
            title="Plano - Adicionais"
            buttonOkText="Adicionar Recurso"
            message={`${matterMonitorResourceMessage}.  Desabilite a função seguir de um processo ou clique em 'Adicionar Recurso' para contratar o recurso adicinal de monitoramento de processos.`}
          />
        )}

        {openMatterMonitorResourceModalFree && (
          <ConfirmBoxModal
            caller="confirmOpenMatterMonitorResourceModalFree"
            title="Plano - Recursos"
            buttonOkText="Trocar Plano"
            message={`${matterMonitorResourceMessage}.  Desabilite a função seguir de um processo ou clique em 'Trocar Plano' para contratar um plano com mais recursos.`}
          />
        )}

        {isDeleting && (

          // CONFIRM MODAL DELETE
          <ConfirmBoxModal
            title="Exclusão de Processos"
            useCheckBoxConfirm
            caller="matterList"
            message="ATENÇÃO: Confirmando a exclusão, todos os dados associados ao processo, inclusive acompanhamentos e publicações, serão excluídos(as).
            Movimentos financeiros, faturas e compromissos associados a este processo serão desassociados e mantidos. ?"
          />

        )}

        {isDeletingTemp && (

          // CONFIRM MODAL DELETE
          <ConfirmBoxModal
            title="Exclusão de Processos"
            useCheckBoxConfirm
            caller="matterList"
            message="Confirma a exclusão / cancelamento deste processo de importação ?"
          />

        )}

        {/* MATTER ADVISORY MATTER */}
        {hasMatterLegal && (

          <Tab active={tabsControl.tab1}>

            <MatterList>

              {matterList.map((item) => {

                // if is a OAB search show interface for temp matter
                if (item.isTempMatter) {
                  return (
                    <MatterItem style={{ opacity: (item.statusCreation == 'A' ? '0.65' : '1') }}>
                      <header>
                        &nbsp;
                        {' '}
                        <AiFillFolderOpen title='Número de identificação da pasta do processo' />
                        &nbsp; Pasta:
                        {' '}
                        {item.matterFolder}
                      </header>

                      <br />
                      <br />

                      <div>

                        <div className='matterDetails'>

                          <div>
                            Processo:
                            {' '}
                            <span>
                              {' '}
                              {item.matterNumber}
                            </span>
                          </div>

                          <div>
                            Data da pesquisa:
                            {' '}
                            <span>
                              {' '}
                              {item.includeDate}
                            </span>
                          </div>

                          <br />

                          <div>
                            Pesquisa automática de processo
                          </div>

                        </div>

                        <div className="matterEvents">
                          <header>
                            {RenderPendingLoadMessage(item.status, item.statusCreation, item.error)}
                          </header>

                        </div>

                        <div className="matterMenu">

                          <div className="menu">

                            <div>

                              <section>

                                <p>
                                  <RiDeleteBinLine />
                                  <span onClick={() => handleDeleteMatter(item.matterId, true)}>Excluir</span>
                                </p>

                              </section>

                            </div>

                          </div>

                        </div>

                      </div>

                      <br />
                      <br />

                    </MatterItem>

                  )
                }

                return (

                  <MatterItem>
                    <header>
                      {/* <input
                        type="checkbox"
                        name="select"
                      /> */}
                      &nbsp;
                      {' '}
                      <AiFillFolderOpen title='Número de identificação da pasta do processo' />
                      &nbsp; Pasta:
                      {' '}
                      {item.matterFolder}
                    </header>

                    <ReactTags
                      handleDelete={(i) => handleDeleteMarker(i, item)}
                      handleAddition={(i) => handleAddition(i, item)}
                      handleDrag={(tag, currPos, newPos) => handleDrag(tag, currPos, newPos, item)}
                      tags={item.markersList}
                      autofocus={false}
                      readOnly={false}
                      minQueryLength={5}
                      maxLength={30}
                      allowDeleteFromEmptyInput
                      allowUnique
                      allowDragDrop
                      allowAdditionFromPaste
                      placeholder={(item.markersList.length == 0 ? 'Inserir Marcador' : '')}
                    />

                    <div>

                      <div className='matterDetails'>
                        <div>
                          Processo:
                          {' '}
                          <span>
                            {' '}
                            {item.matterNumber}
                          </span>
                        </div>

                        <div style={{ width: '50%' }}>
                          Partes:
                          {' '}
                          <span
                            onClick={() => LoadCustomerInformation(item.personId, item.matterId)}
                            className='linkInfo'
                            title={item.matterCustomerDesc}
                          >
                            {item.matterCustomerDesc}
                            {/* {(item.matterCustomerDesc??"").length > 30? `${item.matterCustomerDesc.substring(0,30)  }...`: item.matterCustomerDesc} */}
                          </span>
                          <span>&nbsp; X &nbsp;</span>
                          <span>{item.matterOppossingDesc}</span>
                        </div>

                        {(customerInfoId === item.personId && currentMatterId === item.matterId) && customerInfo && (
                          <CustomerInfo matter={item} customerInfo={customerInfo} />
                        )}

                        <div>
                          Ação:
                          {' '}
                          <span>
                            {' '}
                            {item.judicialAction}
                          </span>
                        </div>

                        <div>
                          Forúm:
                          {' '}
                          <span>
                            {' '}
                            {item.forumName}
                            {item.forumName.length > 0 ? ' (' : ''}
                            {(item.currentInstance ?? "").length > 20 ? `${item.currentInstance.substring(0, 20)}...` : item.currentInstance}
                            {' '}
                            {(item.currentCourt ?? "").length > 20 ? `${item.currentCourt.substring(0, 20)}...` : item.currentCourt}
                            {item.forumName.length > 0 ? ' )' : ''}
                          </span>
                        </div>

                        {isMOBILE && (
                          <>
                            <div className='matterEventsMobile'>
                              <header>
                                <RiCalendarCheckFill />
                                Compromissos
                                &nbsp;&nbsp;
                                <FcAbout className='aboutMessage' title="Nesta seção são exibidos até 3 compromissos atrelados ao processo em ordem decrescente de data - Compromissos recorrentes são exibidos desde que o evento recorrente esteja no período de + ou - 30 dias a partir da data atual." />
                              </header>

                              <div>
                                {item.eventList.map(appointment => {
                                  return (
                                    <div
                                      style={{ textDecoration: (appointment.status === 'P' ? 'none' : 'line-through') }}
                                      title={appointment.description}
                                      onClick={() => handleOpenAppointmentModal(appointment, item.matterId)}
                                    >
                                      {`${FormatDate(new Date(appointment.startDate), "dd/MM/yyyy HH:mm")} ${(appointment.subject.length > 25 ? `${appointment.subject.substring(0, 25)}...` : appointment.subject)}`}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        )}


                        <div className='andamentosList'>

                          {item.followList.map((follow, index) => {
                            return (
                              <>
                                <p className='andamentoItem'>

                                  {!follow.editEvent && (
                                    <>
                                      {index === 0 && <span className='title'>Último Andamento</span>}
                                      {index > 0 && <span className='title'>Data</span>}
                                      {`${FormatDate(new Date(follow.date))} - (${follow.typeFollowDescription})`}

                                      <br />

                                      {(follow.description ?? "").length <= 500 && (
                                        <span className='followDescription'>{follow.description}</span>
                                      )}

                                      {/* Show part of description when is more than 500 characteres and add plus button */}
                                      {(follow.description ?? "").length > 500 && <span title={follow.description}>{(!follow.seeMore ? `${(follow.description ?? "").substring(0, 500)} ...` : follow.description)}</span>}
                                    </>
                                  )}

                                  {/* Show include buttons only if has permission for it  */}
                                  {(hasButtonIncludeMatterLegal && matterType == 'matterLegal') && (
                                    follow.editEvent && (
                                      <div className="editItem">
                                        <AsyncSelect
                                          isDisabled={isEdit}
                                          className='andamentoType'
                                          styles={selectStyles}
                                          loadingMessage={loadingMessage}
                                          cacheOptions
                                          isSearchable
                                          placeholder="Tipo do Andamento"
                                          loadOptions={(term) => LoadMatterTypeSelectOptions(term)}
                                          value={matterEventsTypeList.filter(options => options.id == (follow.typeFollowId ? follow.typeFollowId : item.matterEventTypeId))}
                                          onChange={(select) => handleEditFollowType(follow, item.matterId, select)}
                                          defaultOptions={matterEventsTypeList}
                                        />

                                        <textarea
                                          className='andamentoText'
                                          onChange={(e) => handleEditFollowText(follow, item.matterId, e.target.value)}
                                          value={follow.description}
                                        />

                                        <br />

                                        <div className='andamentoDate'>
                                          <DatePicker
                                            title=""
                                            onChange={(e) => handleEditFollowDate(follow, item.matterId, e.target.value)}
                                            value={format(new Date(follow.date), 'yyyy-MM-dd')}
                                          />

                                          <button
                                            type="submit"
                                            className="buttonLinkClick"
                                            onClick={() => handleEditFollow('save', follow, item.matterId)}
                                          >

                                            {!follow.isSaving && <BiSave />}
                                            {follow.isSaving && <BiLoader />}

                                            {!follow.isSaving && <span>Salvar</span>}
                                            {follow.isSaving && <span>Salvando...</span>}

                                          </button>

                                          {!follow.isSaving && (
                                            <button
                                              type="submit"
                                              className="buttonLinkClick buttonCancel"
                                              onClick={() => handleCancelFollow(follow, item.matterId)}
                                            >
                                              <MdBlock />
                                              Cancelar
                                            </button>
                                          )}

                                        </div>

                                      </div>
                                    )

                                  )}

                                  <button className="buttonLinkClick" type="submit">
                                    {(follow.seeMore && (follow.description ?? "").length > 500) && <span onClick={() => handleShowMoreText(follow, item.matterId)}>&nbsp; Ver Menos</span>}
                                    {(!follow.seeMore && (follow.description ?? "").length > 500) && <span title={follow.description} onClick={() => handleShowMoreText(follow, item.matterId)}>&nbsp; Ver Mais</span>}
                                  </button>

                                  {!follow.editEvent && (

                                    <div className="userPhotos">

                                      {(follow.imageUserInclude ?? "").length > 0 && (
                                        <img
                                          className='avatar'
                                          title={`Andamento : ${(follow.userIncludeName ?? "") === "" ? "SISTEMA" : follow.userIncludeName}`}   // If there is no user create is created by default by SYSTEM
                                          alt=''
                                          src={follow.imageUserInclude}
                                        />
                                      )}

                                      {(follow.imageUserEdit ?? "").length > 0 && (
                                        <img
                                          className='avatar'
                                          title={`Andamento alterado por: ${follow.userEditName}`}
                                          alt=''
                                          src={follow.imageUserEdit}
                                        />
                                      )}

                                      {(hasButtonIncludeMatterLegal && matterType == 'matterLegal') && (
                                        <button
                                          type="submit"
                                          className="buttonLinkClick"
                                          onClick={() => handleEditFollow('edit', follow, item.matterId)}
                                        >
                                          <BiEditAlt />
                                          Editar
                                        </button>
                                      )}

                                    </div>
                                  )}

                                </p>
                              </>
                            )
                          })}

                          {item.followList.length > 0 && (
                            <>
                              <button
                                className="buttonLinkClick"
                                onClick={() => handleShowMore(item.matterId)}
                                title="Clique para visualizar mais andamentos"
                                type="submit"
                              >
                                <FiPlus />
                                Exibir Mais
                              </button>
                            </>
                          )}

                          {/* Show include buttons only if has permission for it  */}
                          {(hasButtonIncludeMatterLegal && matterType == 'matterLegal') && (
                            <>
                              <div style={{ marginTop: '10px' }}>
                                <AsyncSelect
                                  className='andamentoType'
                                  styles={selectStyles}
                                  loadingMessage={loadingMessage}
                                  cacheOptions
                                  isSearchable
                                  placeholder="Tipo do Andamento"
                                  isClearable
                                  maxMenuHeight={200}
                                  loadOptions={(term) => LoadMatterTypeSelectOptions(term)}
                                  value={matterEventsTypeList.filter(options => options.id == item.matterEventTypeId)}
                                  onChange={(e) => handleEventSelectChange(e, item.matterId)}
                                  defaultOptions={matterEventsTypeList}
                                />
                              </div>

                              <div>
                                <label htmlFor="obs">
                                  <textarea
                                    className='andamentoText'
                                    placeholder="Inserir um andamento..."
                                    value={item.matterEventDescription}
                                    onChange={(e) => handleNewDescription(e, item.matterId)}
                                  />
                                </label>
                              </div>

                              <br />

                              <div className='andamentoDate'>
                                <DatePicker
                                  title=""
                                  onChange={(e) => handleFollowDate(e, item.matterId)}
                                  value={item.matterEventDate}
                                />
                                <button
                                  type="submit"
                                  className="buttonLinkClick"
                                  onClick={() => handleSaveNewFollow(item)}
                                >
                                  <BiSave />
                                  {!isSavingNewFollow && <span>Salvar</span>}
                                  {(isSavingNewFollow && currentMatterId === item.matterId) && <span>Salvando...</span>}
                                  {(isSavingNewFollow && currentMatterId != item.matterId) && <span>Salvar</span>}
                                </button>
                              </div>

                            </>
                          )}

                          <br />

                        </div>

                      </div>

                      {/* Show events by matter - Web View */}
                      {!isMOBILE && (

                        <div className="matterEvents">
                          <header>
                            <RiCalendarCheckFill />
                            Compromissos
                            &nbsp;&nbsp;
                            <FcAbout className='aboutMessage' title="Nesta seção são exibidos até 3 compromissos atrelados ao processo em ordem decrescente de data - Compromissos recorrentes são exibidos desde que o evento recorrente esteja no período de + ou - 30 dias a partir da data atual." />
                          </header>

                          <div>
                            {item.eventList.map(appointment => {

                              return (
                                <div
                                  style={{ textDecoration: (appointment.status === 'P' ? 'none' : 'line-through') }}
                                  title={appointment.description}
                                  onClick={() => handleOpenAppointmentModal(appointment, item.matterId)}
                                >
                                  {`${FormatDate(new Date(appointment.startDate), "dd/MM/yyyy HH:mm")} ${(appointment.subject.length > 25 ? `${appointment.subject.substring(0, 25)}...` : appointment.subject)}`}
                                </div>
                              )

                            })}
                          </div>
                        </div>
                      )}

                      <div className="matterMenu">

                        <div className="menu">

                          <div>

                            {/* When is mobile visualization hide text and shows only icons */}
                            <section>

                              <p
                                onClick={() => handleRedirectToProcess(item.matterId)}
                                title="Clique para abrir a pasta do processo"
                              >
                                <FaRegEdit />
                                {!isMOBILE && <span> Ver Detalhes</span>}
                              </p>

                              {item.isImportByGOJUR && (
                                <p
                                  onClick={() => handleOpenInvertParts(item.matterId)}
                                  title="Clique para abrir a ferramenta de inversão de partes para processos importados"
                                >
                                  <FaExchangeAlt />
                                  {!isMOBILE && <span> Inverter Partes</span>}
                                </p>
                              )}

                              <p
                                onClick={() => handleOpenMatterDataReport(item.matterId)}
                                title="Clique para gerar a ficha do processo"
                              >
                                {/* button when is not  generating */}
                                <FiPaperclip />
                                {!isMOBILE && <span> Ficha do Processo</span>}
                              </p>

                              <p
                                onClick={() => handleOpenMatterCover(item.matterId)}
                                title="Clique para gerar a capa do processo"
                              >
                                <GiNewspaper />
                                {!isMOBILE && <span>Capa do Processo</span>}
                              </p>

                              {/* If is necessary, uncomment and deploy -> backend is already ok */}
                              <p
                                onClick={() => handleRedirectToTagPrinter(item.matterId)}
                                title="Clique para gerar a etiqueta do processo"
                              >
                                <VscTag />
                                {!isMOBILE && <span> Etiqueta</span>}
                              </p>

                              <p
                                onClick={() => handleAppointmentModalInclude(item.matterId)}
                                title="Clique para agendar um compromisso relacionado ao processo"
                              >
                                <RiCalendarCheckFill />
                                {!isMOBILE && <span>Agendar Compromisso</span>}
                              </p>

                              {hasButtonGenerateDocument && (
                                <p
                                  onClick={() => handleDocumentModal(item.matterId, item.personId)}
                                  title="Clique para abrir as opções de impressão de documentos"
                                >
                                  <AiOutlinePrinter />
                                  {!isMOBILE && <span>Emitir Documentos</span>}
                                </p>
                              )}

                              <p onClick={() => handleOpenMatterFileModal(item.matterId, "legal")}>
                                <AiOutlineFile />
                                {!isMOBILE && <span>Anexar Documentos</span>}
                              </p>

                              {hasButtonDeleteMatterLegal && (
                                <p
                                  onClick={() => handleDeleteMatter(item.matterId)}
                                  title="Clique para excluir este processo e todos seus registros vinculados"
                                >
                                  <RiDeleteBinLine />
                                  {!isMOBILE && <span>Excluir</span>}
                                </p>
                              )}

                              {hasButtonFollow && (
                                <>
                                  <p title="Acionando o botão seguir o processo passa a ser acompanhado nos tribunais e alimentado automaticamente. O botão seguir (on-off) está disponível para administradores e/ou para usuários do tipo sistema que tenham recebido acesso">
                                    {!isMOBILE && (
                                      <>
                                        {/* show when is a normal visualization - browser first */}
                                        <SiSonarsource />
                                        <span>Seguir&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <Switch
                                          onChange={() => {
                                            if (item.isFollowing) {
                                              handleFollowButton(item.matterId);                                            
                                            } else {
                                              handleOpenFollowModal(item);
                                            }
                                          }}
                                          checked={item.isFollowing}
                                          onColor="#86d3ff"
                                          onHandleColor="#2693e6"
                                          handleDiameter={15}
                                          uncheckedIcon={false}
                                          checkedIcon={false}
                                          height={14}
                                          width={38}
                                        />
                                        {item.des_StatusUltimaAtualizacaoTribunal != null ? (
                                          <FcAbout style={{ marginLeft: '0.5rem' }} title={item.messageButton} />
                                        ) : (
                                          <FcAbout style={{ marginLeft: '0.5rem' }} title="Estamos trabalhando para realizar a primeira captura dos andamentos do processo, por favor, aguarde" />
                                        )}

                                        <FcSearch onClick={() => handleFollowRobotLog(item.matterId)} />
                                      </>
                                    )}

                                    {isMOBILE && (
                                      <>
                                        {/* // show when is a mobile visualization */}
                                        <Switch
                                          onChange={() => console.log()}
                                          checked={item.isFollowing}
                                          onColor="#86d3ff"
                                          onHandleColor="#2693e6"
                                          handleDiameter={15}
                                          uncheckedIcon={false}
                                          checkedIcon={false}
                                          height={14}
                                          width={38}
                                        />
                                      </>
                                    )}
                                  </p>

                                </>
                              )}


                            </section>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* ROBOT COURT ROBS LOG */}
                    {(currentMatterId === item.matterId && showRobotLogs && robotInfoLogs) && (
                      <RobotLogs matter={item} robotLogs={robotInfoLogs} />
                    )}

                  </MatterItem>
                )
              })}

              {isLoadingPage && (
                <div className="loadingMessage">
                  <Loader size={8} color="var(--blue-twitter)" />
                </div>
              )}

            </MatterList>

          </Tab>

        )}

        {/* MATTER ADVISORY MATTER */}
        {hasmatterAdvisory && (

          <Tab active={tabsControl.tab2}>

            <MatterList>

              {matterList.map((item) => {

                // if is a OAB search show interface for temp matter
                if (item.isTempMatter) {
                  return (
                    <MatterItem>
                      <header>
                        {/* <input
                            type="checkbox"
                            name="select"
                          /> */}
                        &nbsp;
                        {' '}
                        <AiFillFolderOpen title='Número de identificação da pasta do processo' />
                        &nbsp; Pasta:
                        {' '}
                        {item.matterFolder}
                      </header>

                      <br />
                      <br />

                      <div>

                        <div className='matterDetails'>

                          <div>
                            Processo:
                            {' '}
                            <span>
                              {' '}
                              {item.matterNumber}
                            </span>
                          </div>

                          <br />

                          <div>
                            <b>Pesquisa automática de processo</b>
                          </div>

                        </div>

                        <div className="matterEvents">
                          <header>
                            {RenderPendingLoadMessage(item.status, item.statusCreation, item.error)}
                          </header>

                        </div>

                        <div className="matterMenu">

                          <div className="menu">

                            <div>

                              <section>

                                <p>
                                  <RiDeleteBinLine />
                                  <span onClick={() => handleRedirectToProcess(item.matterId)}>Excluir</span>
                                </p>

                              </section>

                            </div>

                          </div>

                        </div>

                      </div>

                      <br />
                      <br />

                    </MatterItem>

                  )
                }

                return (

                  <MatterItem>
                    <header>
                      &nbsp;
                      {' '}
                      <AiFillFolderOpen title='Número de identificação da pasta do processo' />
                      &nbsp; Pasta:
                      {' '}
                      {item.matterFolder}
                    </header>

                    {/* <FcAbout className='iconMarkersInfo' title='Adicione marcadores de fácil identificação para cada pasta do processo' /> */}

                    <ReactTags
                      handleDelete={(i) => handleDeleteMarker(i, item)}
                      handleAddition={(i) => handleAddition(i, item)}
                      handleDrag={(tag, currPos, newPos) => handleDrag(tag, currPos, newPos, item)}
                      tags={item.markersList}
                      autofocus={false}
                      readOnly={false}
                      minQueryLength={5}
                      maxLength={30}
                      allowDeleteFromEmptyInput
                      allowUnique
                      allowDragDrop
                      allowAdditionFromPaste
                      placeholder={(item.markersList.length == 0 ? 'Inserir Marcador' : '')}
                    />

                    <div>

                      <div className='matterDetails'>
                        <div>
                          Controle:
                          {' '}
                          <span>
                            {' '}
                            {item.matterNumber}
                          </span>
                        </div>

                        <div style={{ width: '50%' }}>
                          Partes:
                          {' '}
                          <span
                            onClick={() => LoadCustomerInformation(item.personId, item.matterId)}
                            className='linkInfo'
                            title={item.matterCustomerDesc}
                          >
                            {item.matterCustomerDesc}
                          </span>
                          <span>&nbsp; X &nbsp;</span>
                          <span>{item.matterOppossingDesc}</span>
                          {/* <span>{`${ item.matterCustomerDesc  } X ${  item.matterOppossingDesc}`}</span> */}
                        </div>

                        {(customerInfoId === item.personId && currentMatterId === item.matterId) && customerInfo && (
                          <CustomerInfo matter={item} customerInfo={customerInfo} />
                        )}

                        <div style={{ height: '2.5rem' }}>
                          Assunto:
                          {' '}
                          <span>
                            {' '}
                            {item.advisoryDescription}
                          </span>
                        </div>

                        {isMOBILE && (
                          <>
                            <div className='matterEventsMobile'>
                              <header>
                                <RiCalendarCheckFill />
                                Compromissos
                                &nbsp;&nbsp;
                                <FcAbout className='aboutMessage' title="Nesta seção são exibidos até 3 compromissos atrelados ao processo em ordem decrescente de data - Compromissos recorrentes são exibidos desde que o evento recorrente esteja no período de + ou - 30 dias a partir da data atual." />
                              </header>

                              <div>
                                {item.eventList.map(appointment => {
                                  return (
                                    <div
                                      style={{ textDecoration: (appointment.status === 'P' ? 'none' : 'line-through') }}
                                      title={appointment.description}
                                      onClick={() => handleOpenAppointmentModal(appointment, item.matterId)}
                                    >
                                      {`${FormatDate(new Date(appointment.startDate), "dd/MM/yyyy HH:mm")} ${(appointment.subject.length > 25 ? `${appointment.subject.substring(0, 25)}...` : appointment.subject)}`}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </>
                        )}


                        <div className='andamentosList'>

                          {item.followList.map((follow, index) => {
                            return (
                              <>
                                <p className='andamentoItem'>

                                  {!follow.editEvent && (
                                    <>
                                      {index === 0 && <span className='title'>Último Andamento</span>}
                                      {index > 0 && <span className='title'>Data</span>}
                                      {`${FormatDate(new Date(follow.date))} - (${follow.typeFollowDescription})`}

                                      <br />

                                      {(follow.description ?? "").length <= 500 && (
                                        <span className='followDescription'>{follow.description}</span>
                                      )}

                                      {/* Show part of description when is more than 500 characteres and add plus button */}
                                      {(follow.description ?? "").length > 500 && <span title={follow.description}>{(!follow.seeMore ? `${(follow.description ?? "").substring(0, 500)} ...` : follow.description)}</span>}

                                    </>
                                  )}

                                  {(hasButtonIncludeMatterAdvisory && matterType == 'matterAdvisory') && (
                                    follow.editEvent && (
                                      <div className="editItem">

                                        <Select
                                          isSearchable
                                          value={matterEventsTypeList.filter(options => options.id == (follow.typeFollowId ? follow.typeFollowId : item.matterEventTypeId))}
                                          styles={selectStyles}
                                          options={matterEventsTypeList}
                                          onChange={(select) => handleEditFollowType(follow, item.matterId, select)}
                                          placeholder="Tipo do Acompanhamento"
                                          className='andamentoType'
                                          loadingMessage={loadingMessage}
                                          noOptionsMessage={noOptionsMessage}
                                        />

                                        <textarea
                                          className='andamentoText'
                                          onChange={(e) => handleEditFollowText(follow, item.matterId, e.target.value)}
                                          value={follow.description}
                                        />

                                        <br />

                                        <div className='andamentoDate'>
                                          <DatePicker
                                            title=""
                                            onChange={(e) => handleEditFollowDate(follow, item.matterId, e.target.value)}
                                            value={format(new Date(follow.date), 'yyyy-MM-dd')}
                                          />

                                          <button
                                            type="submit"
                                            className="buttonLinkClick"
                                            onClick={() => handleEditFollow('save', follow, item.matterId)}
                                          >
                                            {!follow.isSaving && <BiSave />}
                                            {follow.isSaving && <BiLoader />}

                                            {!follow.isSaving && <span>Salvar</span>}
                                            {follow.isSaving && <span>Salvando..</span>}
                                          </button>

                                          {!follow.isSaving && (
                                            <button
                                              type="submit"
                                              className="buttonLinkClick buttonCancel"
                                              onClick={() => handleCancelFollow(follow, item.matterId)}
                                            >
                                              <MdBlock />
                                              Cancelar
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}

                                  <button className="buttonLinkClick" type="submit">
                                    {(follow.seeMore && (follow.description ?? "").length > 500) && <span onClick={() => handleShowMoreText(follow, item.matterId)}>&nbsp; Ver Menos</span>}
                                    {(!follow.seeMore && (follow.description ?? "").length > 500) && <span title={follow.description} onClick={() => handleShowMoreText(follow, item.matterId)}>&nbsp; Ver Mais</span>}
                                  </button>

                                  {!follow.editEvent && (

                                    <div className="userPhotos">

                                      {(follow.imageUserInclude ?? "").length > 0 && (
                                        <img
                                          className='avatar'
                                          title={`Andamento criado por: ${follow.userIncludeName}`}
                                          alt=''
                                          src={follow.imageUserInclude}
                                        />
                                      )}

                                      {(follow.imageUserEdit ?? "").length > 0 && (
                                        <img
                                          className='avatar'
                                          title={`Andamento alterado por: ${follow.userEditName}`}
                                          alt=''
                                          src={follow.imageUserEdit}
                                        />
                                      )}

                                      {(hasButtonIncludeMatterAdvisory && matterType == 'matterAdvisory') && (
                                        <button
                                          type="submit"
                                          className="buttonLinkClick"
                                          onClick={() => handleEditFollow('edit', follow, item.matterId)}
                                        >
                                          <BiEditAlt />
                                          Editar
                                        </button>
                                      )}

                                    </div>
                                  )}

                                </p>
                              </>
                            )
                          })}

                          {item.followList.length > 0 && (
                            <>
                              <button
                                className="buttonLinkClick"
                                onClick={() => handleShowMore(item.matterId)}
                                title="Clique para visualizar mais andamentos"
                                type="submit"
                              >
                                <FiPlus />
                                Exibir Mais
                              </button>
                            </>
                          )}

                          {(hasButtonIncludeMatterAdvisory && matterType == 'matterAdvisory') && (

                            <>
                              <div style={{ marginTop: '10px' }}>
                                <AsyncSelect
                                  className='andamentoType'
                                  styles={selectStyles}
                                  loadingMessage={loadingMessage}
                                  cacheOptions
                                  isSearchable
                                  isClearable
                                  placeholder="Tipo do Andamento"
                                  maxMenuHeight={200}
                                  loadOptions={(term) => LoadMatterTypeSelectOptions(term)}
                                  value={matterEventsTypeList.filter(options => options.id == item.matterEventTypeId)}
                                  onChange={(e) => handleEventSelectChange(e, item.matterId)}
                                  defaultOptions={matterEventsTypeList}
                                />
                              </div>

                              <div>
                                <label htmlFor="obs">
                                  <textarea
                                    className='andamentoText'
                                    placeholder="Inserir um andamento..."
                                    value={item.matterEventDescription}
                                    onChange={(e) => handleNewDescription(e, item.matterId)}
                                  />
                                </label>
                              </div>

                              <br />

                              <div className='andamentoDate'>
                                <DatePicker
                                  title=""
                                  onChange={(e) => handleFollowDate(e, item.matterId)}
                                  value={item.matterEventDate}
                                />
                                <button
                                  type="submit"
                                  className="buttonLinkClick"
                                  onClick={() => handleSaveNewFollow(item)}
                                >
                                  <BiSave />
                                  {!isSavingNewFollow && <span>Salvar</span>}
                                  {(isSavingNewFollow && currentMatterId === item.matterId) && <span>Salvando...</span>}
                                  {(isSavingNewFollow && currentMatterId != item.matterId) && <span>Salvar</span>}
                                </button>
                              </div>

                              <br />
                            </>

                          )}

                        </div>


                      </div>

                      {/* Show events by matter - Web View */}
                      {!isMOBILE && (

                        <div className="matterEvents">
                          <header>
                            <RiCalendarCheckFill />
                            Compromissos
                            &nbsp;&nbsp;
                            <FcAbout className='aboutMessage' title="Nesta seção são exibidos até 3 compromissos atrelados ao processo em ordem decrescente de data - Compromissos recorrentes são exibidos desde que o evento recorrente esteja no período de + ou - 30 dias a partir da data atual." />
                          </header>

                          <div>
                            {item.eventList.map(appointment => {

                              return (
                                <div
                                  style={{ textDecoration: (appointment.status === 'P' ? 'none' : 'line-through') }}
                                  title={appointment.description}
                                  onClick={() => handleOpenAppointmentModal(appointment, item.matterId)}
                                >
                                  {`${FormatDate(new Date(appointment.startDate), "dd/MM/yyyy HH:mm")} ${(appointment.subject.length > 25 ? `${appointment.subject.substring(0, 25)}...` : appointment.subject)}`}
                                </div>
                              )

                            })}
                          </div>

                        </div>
                      )}

                      <div className="matterMenu">

                        <div className="menu">

                          <div>

                            {/* When is mobile visualization hide text and shows only icons */}
                            <section>

                              <p onClick={() => handleRedirectToProcess(item.matterId)}>
                                <FaRegEdit />
                                {!isMOBILE && <span> Ver Detalhes</span>}
                              </p>

                              <p onClick={() => handleOpenMatterDataReport(item.matterId)}>
                                {/* button when is not  generating */}
                                <FiPaperclip />
                                {!isMOBILE && <span> Ficha do Processo</span>}
                              </p>

                              <p onClick={() => handleOpenMatterCover(item.matterId)}>
                                <GiNewspaper />
                                {!isMOBILE && <span>Capa do Processo</span>}
                              </p>

                              {/* If is necessary, uncomment and deploy -> backend is already ok */}
                              <p onClick={() => handleRedirectToTagPrinter(item.matterId)}>
                                <VscTag />
                                {!isMOBILE && <span> Etiqueta</span>}
                              </p>

                              <p onClick={() => handleAppointmentModalInclude(item.matterId)}>
                                <RiCalendarCheckFill />
                                {!isMOBILE && <span>Agendar Compromisso</span>}
                              </p>

                              {hasButtonGenerateDocument && (
                                <p onClick={() => handleDocumentModal(item.matterId, item.personId)}>
                                  <AiOutlinePrinter />
                                  {!isMOBILE && <span>Emitir Documentos</span>}
                                </p>
                              )}

                              <p onClick={() => handleOpenMatterFileModal(item.matterId, "advisory")}>
                                <AiOutlineFile />
                                {!isMOBILE && <span>Anexar Documentos</span>}
                              </p>

                              {hasButtonDeletematterAdvisory && (
                                <p onClick={() => handleDeleteMatter(item.matterId)}>
                                  <RiDeleteBinLine />
                                  {!isMOBILE && <span>Excluir</span>}
                                </p>
                              )}

                            </section>

                          </div>

                        </div>

                      </div>

                    </div>

                  </MatterItem>
                )

              })}

              {isLoadingPage && (
                <div className="loadingMessage">
                  <Loader size={8} color="var(--blue-twitter)" />
                </div>
              )}

            </MatterList>

          </Tab>

        )}

      </Tabs>

      {(matterLines + tempLines == 0 && !isLoading) && (
        <div className='messageEmpty'>
          <AiFillFolderOpen title='Nenhum processo foi encontrado com o filtro aplicado' />
          <span>Nenhum registro foi encontrado</span>
        </div>
      )}

      {(isGeneratingReport) && (
        <div className='waitingMessage'>
          <LoaderWaiting size={15} color="var(--blue-twitter)" />
          {' '}
          Aguarde... Gerando Relatório
        </div>
      )}

      {(hasCurrentSearch && (!isGeneratingReport && !modalActive)) && (
        <div className='waitingMessage'>
          <LoaderWaiting size={15} color="var(--blue-twitter)" />
          {' '}
          Busca automática em execução...
        </div>
      )}

      {/* PARAMETERS MATTER */}
      {isOpenMenuConfig && <MatterParameters />}

      {/* DOCUMENT MODAL  */}
      {isOpenDocumentModal && <DocumentModal />}

      {/* INVERT PARTS MODAL */}
      {showInvertParts && <InvertParts />}

      {/* SEARCH OAB MODAL */}
      {isOpenMenuSearch && <SearchOAB />}

      {/* SEARCH CNJ MODAL */}
      {showSearchCNJ && <SearchCNJ />}

      {/* SEARCH MATTERFILE MODAL */}
      {(showMatterFileModal) && <Overlay />}
      {(showMatterFileModal) && <MatterFileModal callbackFunction={{ handleCloseMatterFileModal, matterFileId, matterFilePlace }} />}

      <VideoTrainningModal />

      {isOpenOldVersion && (
        <ConfirmBoxModal
          title="AVISO"
          caller="matterListOldVersion"
          message="A versão anterior ficará disponível para acesso até o dia 20/03/2022 Deseja continuar ?"
        />
      )}


      {showOverlayDeleteEvent && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            {' '}
            Excluindo andamentos...
          </div>
        </>
      )}


      {showOverlayDelete && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            {' '}
            Excluindo processo...
          </div>
        </>
      )}

      {openProcessModal ? <ProcessModal /> : null}

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </Container>
  );
};

export default Matter;
