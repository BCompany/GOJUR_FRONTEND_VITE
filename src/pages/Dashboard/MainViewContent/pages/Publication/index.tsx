import React, {useEffect,useState,useCallback,ChangeEvent,UIEvent } from 'react';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { usePublication } from 'context/publication';
import { useModal } from 'context/modal';
import { useConfirmBox } from 'context/confirmBox';
import { useHeader } from 'context/headerContext';
import { useToast } from 'context/toast';
import LabelTooggle from 'components/LabelTooggle'
import { isMobile } from 'react-device-detect'
import api from 'services/api';
import { FcAbout } from 'react-icons/fc';
import { FiCheckSquare,FiMenu } from 'react-icons/fi';
import { useAuth } from 'context/AuthContext';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { FaCalculator , FaRegEdit } from 'react-icons/fa';
import { RiCalendarCheckFill, RiDeleteBinLine, RiNewspaperFill } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import { VscFolderOpened, VscFolder } from 'react-icons/vsc';
import Loader from 'react-spinners/PulseLoader';
import { BiMenuAltLeft } from 'react-icons/bi';
import { ImHammer2 } from "react-icons/im";
import { CgDetailsMore } from 'react-icons/cg'
import { format } from 'date-fns';
import { Container, Filter, Wrapper, PublicationItem, MatterEventItem, ContentItem, MenuItem, Multi, Menu, EventList, ContentItemMatterEvent } from './styles';
import { HeaderPage } from 'components/HeaderPage';
import VideoTrainningModal from 'components/Modals/VideoTrainning/Index';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { CompromissosData, DefaultsProps, filterProps, PrintData, ProcessData, PublicationData, PublicationDto, usernameListProps } from './Interfaces/IPublication';
import ReportModal from 'components/Modals/PublicationModal/ReportModal';
import ReportModalPopUp from 'components/Modals/Report';
import Coverages from '../../../../Coverages';
import DateModal from './DateModal';
import { FormatDate } from 'Shared/utils/commonFunctions';
import { Overlay } from 'Shared/styles/GlobalStyle';
import PublicationOptionsMenu from 'components/MenuHamburguer/publicationOptions';
import { useHistory } from 'react-router-dom';
import LogModal from 'components/LogModal';

const Publication: React.FC = () => {
  const { signOut } = useAuth();
  const { handlePublicationModal, handleSetFilterName, handleSetFilterChanged, filterName, isReportModalOpen, filterChanged, handleDetailsAnyType, handleOpenReportModal, handleCloseReportModal, handleReload, reloadTrigger } = usePublication();
  const { handleShowListSearch, handleLoadingData } = useHeader()
  const { isOpenModal, handleModalActiveId, selectProcess,modalActive,handleCaptureTextPublication,handleMatterAssociated, handleDeadLineCalculatorText,handleModalActive,handleShowVideoTrainning} = useModal();
  const { captureText,handleCaptureText, handleDispathCallback,dispathCallback } = useHeader();
  const { isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage } = useConfirmBox();
  const [ showLog, setShowLog] = useState(false); // Controla a abertura do modal de Log de publicação
  const [ showMatterEventLog, setShowMatterEventLog] = useState(false); // Controla a abertura do modal de Log de acompanhamentos
  const { addToast } = useToast();
  const history = useHistory();
  const [ loadingData, setLoadingData] = useState(true) //trigger to reload page
  const [ isPagination, setIsPagination] = useState(false) //trigger to reload page when achieve end of scrolling pagination
  const [ isEndPage, setIsEndPage] = useState(false) //trigguer to avoid fetch more data once there is no more register anymore
  const [ isInitialized, setIsInitialized] = useState(false)
  const [ isFirstLoad, setIsFirstLoad] = useState(true)
  const [ actionType, setActionType] = useState('none')
  const [ isOpenMenu, setIsOpenMenu] = useState(false)
  const [ filterPeriod, setFilterPeriod] = useState('1d')
  const [ filterPublicationId, setFilterPublicationId] = useState(0)
  const [ filterTerm, setFilterTerm] = useState('')
  const [ pageNumber, setPageNumber] = useState(1)
  const [ publication, setPublication] = useState<PublicationDto[]>([]) // dados da punlicação
  const [ profileFilterList, setProfileFilterList] = useState<usernameListProps[]>([])
  const [ totalPublications, setTotalPublications] = useState(0)
  const [ nameFilterValue, setNameFilterValue] = useState('filterNameFalse') // valor do filtro por nome
  const [ multiFilter, setMultiFilter] = useState<filterProps[]>([]) // valor do multi filter
  const [ hasItemCheckBoxSelected, setHasItemCheckBoxSelected] = useState(false) // caso clique no botão selecionar todos mudar para desmarcar todos
  const [ currentPublicationId, setCurrentPublicationId] = useState<number>(0)
  const [ checkMessage, setCheckMessage] = useState(false)
  const [ isDeleting, setIsDeleting] = useState(false)
  const [ isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [ idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [ printData, setPrintData] = useState<PrintData[]>([])
  const [ copyData, setCopyData] = useState<PrintData[]>([])
  const [ itemType, setItemType] = useState<string>("")
  const token = localStorage.getItem('@GoJur:token')
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  
  const [showDateModal, setShowDateModal] = useState<boolean>(false);
  const [changeDates, setChangeDates] = useState<boolean>(false);
  const [dtaCustomStart, setDtaCustomStart] = useState<string>("")
  const [dtaCustomEnd, setDtaCustomEnd] = useState<string>("")
  const [showCustomDates, setShowCustomDates] = useState<boolean>(false);
  const [showReportOpenFileModal, setShowReportOpenFileModal] = useState<boolean>(false);
  const [reportLink, setReportLink] = useState<string>('');

  const options = [
    { value: 'itemSearch_withMatter', label: 'Com Processo' },
    { value: 'itemSearch_withoutMatter', label: 'Sem Processo' },
    { value: 'itemSearch_read', label: 'Lidas' },
    { value: 'itemSearch_unread', label: 'Não Lidas' },
  ];


  // Custom Dates
  useEffect(() => {
    if (changeDates) {
      setPageNumber(1)
      setLoadingData(true)
      setFilterPeriod('')
    }
  }, [changeDates])


  // Load names publication when start page for first time
  useEffect(() => {
    Initialize();
  }, [])


  // Load publication always when set setLoadingData(true)
  useEffect(() => {
    //if loadingData is true reload screem publication
    if (loadingData) {
      LoadPublication(isFirstLoad)
    }
  }, [loadingData])


  // Initialize function for first time
  const Initialize = useCallback(async () => {
    try {
      // Request list publication names
      const response = await api.post<usernameListProps[]>(`/Publicacao/ListarNomesPublicacao`,  { 
        token: token, 
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey') 
      });

      // Save names to appear in dropdownlist
      handleCaptureText('')
      handleLoadingData(false)
      setProfileFilterList(response.data)
      handleModalActive(false)
      setIsInitialized(true)
      setCurrentPublicationId(0)
      setIsFirstLoad(false)
    }
    catch (err:any) {
      setLoadingData(false)
      console.log(err.message)
    }
  }, [])


  // ******************* LOAD FUNCTIONS API REQUEST *******************/
  const LoadPublication = useCallback(async (firstLoad = false) => {
    // Load publication list using all filters in a unique request
    try {
      let filterDatesCustom = "";
      let nameFilterSearch = nameFilterValue;

      if (firstLoad) {
        const response = await VerifyParameterFilterName();
        if (response){
          nameFilterSearch = response;
        }
      }

      // build multfilter string
      let filterOptions = "";
      multiFilter.map((item) => filterOptions += item.value + ",");

      if (filterOptions.length > 0) {
        handleLoadingData(true)
      }

      // filters variables
      let period = filterPeriod;
      let filterMulti = filterOptions;
      let term = filterTerm;
      let search = nameFilterSearch;

      // verify if exists filter saved on redirect operations
      const filterStorage = localStorage.getItem('@GoJur:PublicationFilter')
      if (filterStorage){
        const filterJSON = JSON.parse(filterStorage);

        if (filterJSON.period) period = filterJSON.period // set period from saved filter

        let filterString = '';

        if (filterJSON.matter)
        {
          filterJSON.matter.map(item => {
            filterString += item.value + ',';
          })
            
          filterMulti = filterString;
        }

        if (filterJSON.term) term = filterJSON.term // set name from saved filter

        if (filterJSON.name) search = filterJSON.name // set term from saved filter

        if(filterJSON.dtaStart)
        {
          setDtaCustomStart(filterJSON.dtaStart)
          setDtaCustomEnd(filterJSON.dtaEnd)
          filterDatesCustom = `${filterJSON.dtaStart}|${filterJSON.dtaEnd}`
          setShowCustomDates(true)
        }
        
        // set filters control
        setFilterPeriod(filterJSON.period)
        setFilterTerm(filterJSON.term)
        setNameFilterValue(filterJSON.name)
        setMultiFilter(filterJSON.matter)
        setFilterPublicationId(filterJSON.publicationId)

        // remove storage to filter saved to avoid apply again
        localStorage.removeItem('@GoJur:PublicationFilter')
      }
      
      if(changeDates)
      {
        filterDatesCustom = `${dtaCustomStart}|${dtaCustomEnd}`
      }

      const filters =  `${period},${filterMulti},term_${term},${search},`

      //request load publication
      const response = await api.post<PublicationData[]>(`/Publicacao/Listar`, {
        page: pageNumber,
        rows: 20,
        caller: 'webApplication',
        filters: filters,
        publicationId: filterPublicationId,
        filterDateCustom: filterDatesCustom,
        token: localStorage.getItem('@GoJur:token'),
        companyId: localStorage.getItem('@GoJur:companyId'),
        apiKey: localStorage.getItem('@GoJur:apiKey')
      })

      //if there is no data set loading handle as false and return
      if (response.data.length === 0) {
        setLoadingData(false);
        handleLoadingData(false)
      }

      // fill data values
      const newData = response.data.map(
        publications =>
          publications && {
            ...publications,
            openMenu: false,
            publicationSelected: 0,
          },
      );

      if (!isPagination){
        //if is NOT a pagination set newData values to array list publication
        setPublication(newData)
        setIsEndPage(false)
        setTotalPublications(newData.length === 0? 0: newData[0].totalRows)
      }
      else
      {
        if (newData.length == 0){
          setIsEndPage(true);     //if there is no more data, define as endpage
        }
        //If is a pagination, append new data to publication list already existent
        newData.map((pub) => { publication.push(pub) })

        setPublication(publication);
      }

      setLoadingData(false)
      handleLoadingData(false)
      setIsPagination(false)
      handleSetFilterChanged(false)
      handleDispathCallback(false)
      setFilterPublicationId(0)
      setPrintData([])

      if(isFirstLoad)
      {
        const responseLog = api.post('/Usuario/SalvarLogNavegacaoUsuario', {token, module: 'MEN_PUBLICACAO'});
      }

    } catch (err:any) {
      setIsPagination(false)
      setLoadingData(false)
      handleLoadingData(false)
      console.log(err)
      if (err.response.data.statusCode == 1002){
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }
    }

  }, [loadingData, changeDates, dtaCustomStart, dtaCustomEnd, pageNumber, nameFilterValue])


  async function VerifyParameterFilterName() {
    try {
      //get filter name default when open screen
      const filterName = localStorage.getItem('@GoJur:PublicationFilterName');

      const filterNameCurrent = filterName == "filterNameFalse" ? "filterNameFalse" : "pubNameAll";

      // save state for context
      handleSetFilterName(filterNameCurrent)

      // save state for show im select box
      setNameFilterValue(filterNameCurrent)

      return filterNameCurrent
    }
    catch (err) {
      return null;
      console.log(err);
    }
  }


  // Reload list events by publication id
  const RefreshEventList = async () => {
    try {
      if (currentPublicationId == 0) return;

      // Get list events
      const response = await api.post<CompromissosData[]>('/Publicacao/ListarCompromissos', {
        publicationId: currentPublicationId,
        token: localStorage.getItem('@GoJur:token'),
      });

      const pub1 = publication.find(publi => publi.id === currentPublicationId)
      const pub2 = publication.find(publi => publi.meCod_ProcessoAcompanhamento === currentPublicationId)

      if(pub1)
      {
        // refresh list of events relashion to current publication id
        const pub = publication.map(publi =>
          publi.id === currentPublicationId
            ? {
                ...publi,
                eventList: response.data,
              }
            : publi,
        );
        
        setPublication(pub)
      }
      
      if(pub2)
      {
        // refresh list of events relashion to current publication id
        const pub = publication.map(publi =>
          publi.meCod_ProcessoAcompanhamento === currentPublicationId
            ? {
                ...publi,
                eventList: response.data,
              }
            : publi,
        );
        
        setPublication(pub)
      }

      setCurrentPublicationId(0)
      handleModalActive(false)

      localStorage.removeItem('@GoJur:PublicationId')
      localStorage.removeItem('@GoJur:AppointmentId');
      localStorage.removeItem('@GoJur:MatterEventId')
    }
    catch (err) {
      console.log(err);
    }
  }


  // Set header callback when customer set some value on search text
  useEffect(() => {
    if (dispathCallback){
      handleLoadingData(true)
      setLoadingData(true)
    }
  },[dispathCallback])


  // Save capture text from header component
  useEffect(() => {
    setFilterTerm(captureText)
    handleLoadingData(false)
  },[captureText])


  // Refresh event list publication when modal is closed
  useEffect(() => {
    let publicationId = currentPublicationId;

    if (currentPublicationId == 0 && localStorage.getItem('@GoJur:PublicationId') !== ''){
      publicationId = Number(localStorage.getItem('@GoJur:PublicationId'));
      setCurrentPublicationId(publicationId)
    }

    if (!modalActive && publicationId > 0){
        RefreshEventList()
    }
  }, [modalActive])


  // When change some filter reset some states
  useEffect(() => {
    if (!filterChanged) return;

    setNameFilterValue(filterName)
    setIsOpenMenu(false)
    setLoadingData(true)
  }, [filterChanged])


  // When change some filter reset some states
  useEffect(() => {
    if (reloadTrigger){
      RefreshCard();
    }
  }, [reloadTrigger])


  const RefreshCard = async() => {
      const publicationId = Number(localStorage.getItem('@GoJur:PublicationId'))
      if (publicationId == 0) return;

      const response = await api.get<PublicationData>(`/Publicacao/GetPublicationById`, {
        params:{
          publicationId,
          token: token
        }
      })

      let newPublicationList = publication.map(publi =>
        publi.id === Number(publicationId)
          ? {
              ...publi,
              matterId: response.data.matterId,
              matterNumber: response.data.matterNumber,
              judicialAction: response.data.judicialAction,
              withMatter: true,
              matterResponsibleFirst: response.data.matterResponsibleFirst,
              matterResponsibleAll: response.data.matterResponsibleAll,
              matterParts: response.data.matterParts,
            }
          : publi,
      )

      let hasFilterWithoutMatter = multiFilter.filter(filter => filter.value == 'itemSearch_withoutMatter').length > 0;
      let hasFilterWithMatter = multiFilter.filter(filter => filter.value == 'itemSearch_withMatter').length > 0;

      // if was filtered by withoutmatter and there is no filter with matter, remove current publication from list updated
      if (hasFilterWithoutMatter && !hasFilterWithMatter){
        newPublicationList = newPublicationList.filter(filter => filter.id != publicationId);
      }

      // update list and total
      setPublication(newPublicationList)
      setTotalPublications(newPublicationList.length)
      
      localStorage.removeItem('@GoJur:PublicationId');

      // set handleReload as false, this context is responsible for re-render the publication card
      handleReload(false)
  }


  // When appear confirm box to delete and is clicked on cancel
  useEffect(() => {
    if (isCancelMessage){
      setCheckMessage(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])


   // When appear confirm box to delete and is clicked on confirm
   useEffect(() => {
    if (isConfirmMessage && isDeleting && itemType == 'A'){
      handleDeleteMatterEvent()
    }
    
    if (isConfirmMessage && isDeleting && itemType == 'P'){
      handleDeletePublication()
    }
  }, [isConfirmMessage])


  // When exists report id verify if is available every 5 seconds
  useEffect(() => {
    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 5000);
    }
  },[idReportGenerate])


  // Check is report is already
  const CheckReportPending = useCallback(async (checkInterval) => {
    if (isGeneratingReport){
        let response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
          id: idReportGenerate,
          token: token
        })

        if (response.data == "F" && isGeneratingReport){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
          OpenReportAmazon()
        }

        if (response.data == "E"){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
  
          addToast({type: "error", title: "Operação não realizada", description: "Não foi possível gerar o relatório."})
        }
    }
  },[isGeneratingReport, idReportGenerate])


  // Open link with report
  const OpenReportAmazon = async() => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: token
    });

    setReportLink(response.data.des_Parametro)
    setIdReportGenerate(0)
    const newWin = window.open(`${response.data.des_Parametro}`, '_blank');

    if(!newWin || newWin.closed || typeof newWin.closed=='undefined') 
    { 
      handleCloseReportModal()
      setShowReportOpenFileModal(true)
    }
    else
    {
      handleCloseReportModal()
    }
  }


  const CloseReportModal = async () => {
    setShowReportOpenFileModal(false)
    setReportLink('')
    handleCloseReportModal()
  }


  // Save state filter period
  const handleChangeFilterDate = (period: string) =>  {
    setDtaCustomStart('')
    setDtaCustomEnd('')
    setChangeDates(false)
    setShowCustomDates(false)

    setHasItemCheckBoxSelected(false)
    setPageNumber(1)
    setIsOpenMenu(false)
    setLoadingData(true)
    setFilterPeriod(period);
  }


  const handleModalPublicationName = () => {
    setIsOpenMenu(false)
    handlePublicationModal('Name')
  }


  const handleModalPublicationEmail= () => {
    setIsOpenMenu(false)
    handlePublicationModal('Email')
  }


  // Save state multi filter
  const handleMultiFilter = (values: Array<filterProps>) => {
    setLoadingData(true)
    setIsOpenMenu(false)
    setPageNumber(1)
    setMultiFilter(values)
  }


  const handleChangeFilterName = useCallback(
    async (event: ChangeEvent<HTMLSelectElement>) => {
      const filterNameChanged = event.target.value;
      setLoadingData(true)
      setPageNumber(1)
      setNameFilterValue(filterNameChanged)
    },
    [filterPeriod, multiFilter],
  );


  const handleOpenMenu = useCallback(() => {
    setIsOpenMenu(!isOpenMenu);
  }, [isOpenMenu]); // Abre e fecha o menu dos filtros


  const handleOpenPublicationMenu = useCallback(
    id => {
      const menu = publication.map(publi =>
        publi.id === id
          ? {
              ...publi,
              openMenu: !publi.openMenu,
            }
          : publi,
      );

      setPublication(menu);
    },
    [publication],
  ); // Abre e fecha o menu da publicação item


  const PublicationReadOrNot = useCallback(async id => {
      try {
        setActionType('readUnread')

        await api.post('/Publicacao/LidoNaoLido', {publicationId: id, token });

        const read = publication.map(publi =>
          publi.id === id
            ? {
                ...publi,
                read: !publi.read,
                hasLog: true
              }
            : publi,
        );

        setPublication(read);
        setActionType('none')

      } catch (err) {
        console.log(err);
        setActionType('none')
      }
    },
    [publication],
  ); // Marca Publicação como lido ou não lido


  const handleDeletePublication = async () =>
  {
    try {

      setActionType('delete')

      await api.post('/Publicacao/Apagar', {
        publicationId: currentPublicationId,
        token,
      });

      setCheckMessage(false)
      handleConfirmMessage(false)
      handleCancelMessage(true)
      setCurrentPublicationId(0)
      setIsDeleting(false)

      // after delete from backend delte in current list
      const deletePublication = publication.filter(publi => publi.id !== currentPublicationId);
      setPublication(deletePublication);

      // update total number
      let total = totalPublications - 1;
      if (total < 0) { total = 0}
      setTotalPublications(total);
      setActionType('none')
      setItemType('')
    } catch (err) {
      console.log(err);
      setActionType('none')
    }
  }


  const handleDelete = useCallback(
    id => {
      setItemType('P')
      setIsDeleting(true)
      setCheckMessage(true);
      setCurrentPublicationId(id)
    }, [publication])


  const handleRedirectToProcess = useCallback(async id =>
    {
      const responseLog = api.post('/Usuario/SalvarLogNavegacaoUsuario', {
        token,
        module: 'MEN_PROCESSO'
      });
      
      // Validar se usuário tem acesso ao módulo de processos
      const tokenapi = localStorage.getItem('@GoJur:token');

      const response = await api.post<boolean>('Processo/PermissaoAcesso', {
        id: id,
        token: tokenapi
       })

      if (response.data)
      {
        const filtersJSON = {
          period: filterPeriod,
          name: nameFilterValue,
          matter: multiFilter,
          term: filterTerm,
          dtaStart: dtaCustomStart,
          dtaEnd: dtaCustomEnd,
          changeDate: changeDates,
        };

        //Save object JSON with all filters
        localStorage.setItem('@GoJur:PublicationFilter', JSON.stringify(filtersJSON));
        const url = `/matter/edit/legal/${id}`
        history.push(url)
        localStorage.setItem('@GoJur:redirectFromPublication', 'S')
      }
      else
      {
        addToast({type: 'info', title: 'Operação não realizada', description: 'Acesso Não Autorizado - O usuário não tem acesso ao módulo de processos ou a este processo.'});
      }
    },
    [filterPeriod, filterTerm, multiFilter, nameFilterValue, dtaCustomStart, dtaCustomEnd],
  ); // Redireciona para a publicação


  const handleAssociatedAllProcess = useCallback(async () => {
    setIsOpenMenu(false);

    try {
      const token = localStorage.getItem('@GoJur:token');

      await api.post(`/Publicacao/AssociarTodasPublicacoesProcesso`, {
        token: token,
      });

      setLoadingData(true)

    }
    catch (err) {
      addToast({type: 'error', title: 'Falha ao associar todos os processos', description: 'Não foi possivel realizar a operação desejada, tente novamente!'});
    }
  }, [addToast, filterPeriod]); // Associa todas as publicações sem processo


  const handleAppointmentModalEdit = async (publicationId: number, hasMatter: boolean, eventItem: any) => {
    isOpenModal(eventItem.eventId)

    localStorage.setItem('@GoJur:RecurrenceDate', FormatDate(new Date(eventItem.startDate),'yyyy-MM-dd'))
    localStorage.setItem('@GoJur:AppointmentId', eventItem.eventId);
    localStorage.setItem('@GoJur:PublicationHasMatter', (hasMatter?'S':'N'))

    setCurrentPublicationId(publicationId)
  }


  const handleAppointmentModalInclude = async (matterId: number, publicationId: number, hasMatter: boolean) => {
    try {
      handleModalActiveId(0)
      isOpenModal('0')

      handleDeadLineCalculatorText(null)

      // set current publication edit to refresh only this
      setCurrentPublicationId(publicationId)

      // keep saved publication id to send id to API make the relashionship between both
      localStorage.setItem('@GoJur:PublicationId', publicationId.toString())
      localStorage.setItem('@GoJur:PublicationHasMatter', (hasMatter?'S':'N'))
      localStorage.removeItem('@GoJur:RecurrenceDate');

      selectProcess(null)

      if (matterId > 0)
      {
        const response = await api.post<ProcessData>('/Processo/SelecionarProcesso',{
            matterId: matterId,
            token: localStorage.getItem('@GoJur:token'),
            companyId: localStorage.getItem('@GoJur:companyId'),
            apiKey: localStorage.getItem('@GoJur:apiKey')
          }
        );

        let courtDesc = "";
        let courtDeptDesc = "";

        if(response.data.instanceList.length > 0){
          const court = response.data.instanceList[0];

          courtDesc = `${court.forumDesc.toString()} - ${court.instance.toString()} Instância`;
          courtDeptDesc = `${court.varaNumber.toString()}ª ${court.varaDesc.toString()}`;
        }

        var matter = response.data;

        selectProcess({
          matterId: matterId,
          matterCustomerDesc: matter.matterCustomerDesc,
          matterOppossingDesc: matter.matterOppossingDesc,
          matterFolder: matter.matterFolder,
          matterNumber: matter.matterNumber,
        })

        let matterText = `Pasta: ${matter.matterFolder} - Proc: ${matter.matterNumber}`

        if (matter.matterCustomerDesc){
          matterText += `\n${matter.matterCustomerDesc}`
        }

        if (matter.matterOppossingDesc){
          matterText += ` X ${matter.matterOppossingDesc}`
        }

        if (courtDesc){
          matterText += `\n${courtDesc}`
        }

        if (courtDeptDesc){
          matterText += `\n${courtDeptDesc}`
        }

        const publi = publication.filter(item => item.id === publicationId);

        const publicationText = publi.map(i => i.description);

        handleMatterAssociated(hasMatter? true:false);

        handleCaptureTextPublication(`${matterText}\n\n${publicationText}`);
      }
      else{
        const publi = publication.filter(item => item.id === publicationId);
        const publicationText = publi.map(i => i.description);

        localStorage.setItem('@GoJur:PublicationHasMatter', 'N')
        handleCaptureTextPublication(`${publicationText}`);
      }

    } catch (err) {
      console.log('Error in create a new calendar by publication view')
    }
  }

  
  const PublicationSelectToReport = useCallback(id => {
    const select = publication.map(item =>
      item.id === id ? {
        ...item,
        publicationSelected: id,
      } : item)

    setPublication(select);
  }, [publication])


  const PublicationUnselectToReport = useCallback(id => {
    const unselect = publication.map(item =>
      item.id === id ? {
        ...item,
        publicationSelected: 0,
      } : item)

    setPublication(unselect);
  }, [publication])


  const handleSelectAllPublication = useCallback(() => {
    setHasItemCheckBoxSelected(true);
    setIsOpenMenu(false)

    const selectAll = publication.map(
      publi =>
        publi && {
          ...publi,
          publicationSelected: publi.TIPO == 'P' ?  publi.id : publi.meCod_ProcessoAcompanhamento,
        },
    );

    setPublication(selectAll);
  }, [publication]); // Selecionar todas as publicações


  const handleUnSelectAllPublication = useCallback(() => {
    setHasItemCheckBoxSelected(false);
    setIsOpenMenu(false)

    publication.map( (pub) => {
        pub.publicationSelected = 0;
    })

    setHasItemCheckBoxSelected(false)
    setPublication(publication);
  }, [publication]); // Selecionar todas as publicações


  const PrintPublications = useCallback(async (id: number) => {
    const publicationSelected = publication.find(item => item.id === id)

    if (!publicationSelected) {
      addToast({type: 'info', title: 'Operação NÃO realizada', description:'Não foi possível imprimir esta publicação'});
      return;
    }

    try {
      const response = await api.post(`/Publicacao/Relatorio`, {
        publicationIds: publicationSelected.id.toString(),
        token: token
      })

      setIsGeneratingReport(true)
      setIdReportGenerate(response.data)

      handleOpenReportModal()
    }
    catch (err) {
      console.log(err);
    }
  }, [publication]);


  const handlePrintSelectPublications = useCallback(async () => {
    const existsSelectedPublication = publication.find(item => item.publicationSelected > 0);

    if (!existsSelectedPublication){
      addToast({type: 'info', title: 'Nenhuma publicação foi selecionada para impressão', description: 'Selecione ao menos uma publicação para realizar a operação'})
      setIsOpenMenu(false)
      return
    }

    const printDataList: PrintData[] = []

    publication.map(item => {
      if(item.publicationSelected > 0)
      {
        return printDataList.push({
          id: item.publicationSelected, type: item.TIPO
        })
      }
    })

    setPrintData(printDataList)

    try {
      const response = await api.post(`/CentralNotificacoes/Relatorio`, { printDataList: printDataList, token: token })

      setIsGeneratingReport(true)
      setIdReportGenerate(response.data)
      handleOpenReportModal()
      setPrintData([])
    }
    catch (err) {
      console.log(err);
    }
  }, [publication]);


  const handleCopyClipBoard = async() => {
     // verify if exists some publication selected
     const existsSelectedPublication = publication.find(item => item.publicationSelected > 0);

     // if not exists show message
     if (!existsSelectedPublication){
       addToast({type: 'info', title: 'Nenhuma publicação foi selecionada para cópia', description: 'Selecione ao menos uma publicação para realizar a operação'});
       setIsOpenMenu(false)

       return;
     }

     addToast({type: 'info', title: 'Aguarde...', description: 'Gerando cópia de dados para a área de transferência...'});
     setIsOpenMenu(false)

     const copyDataList: PrintData[] = []

      publication.map(item => {
        if(item.publicationSelected > 0)
        {
          return copyDataList.push({
            id: item.publicationSelected, type: item.TIPO
          })
        }
      })

      setCopyData(copyDataList)

     try {
       const response = await api.post(`/CentralNotificacoes/CopiarSelecionadosClipBoard`, { printDataList: copyDataList, token: token });

      // Create an iframe (isolated container) for the HTML
      var container = document.createElement('div')
      container.innerHTML = response.data;

      // Hide element
      container.style.position = 'fixed'
      container.style.pointerEvents = 'none'

      // Detect all style sheets of the page
      var activeSheets = Array.prototype.slice.call(document.styleSheets)
        .filter(function (sheet) {
          return !sheet.disabled
      })

      // Mount the iframe to the DOM to make `contentWindow` available
      document.body.appendChild(container)

      // Copy to clipboard
      window.getSelection()?.removeAllRanges()

      var range = document.createRange()
      range.selectNode(container)
      window.getSelection()?.addRange(range)

      document.execCommand('copy')
      for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true
      document.execCommand('copy')
      for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = false

      // Remove the iframe
      document.body.removeChild(container)

      addToast({type: 'success', title: 'Operação executada com sucesso', description: 'Os dados relacionados as publicações selecionadas estão disponíveis para colagem (Ctrl + V)'});
     }
     catch (err) {
       console.log(err);
     }
  }

  // Trigguer event when achieve end of scrool and active pagination for publication list
  function handleScroll(e: UIEvent<HTMLDivElement>){
    var element =  e.target as HTMLTextAreaElement;

    if (isEndPage || publication.length == 0) return;

    var isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight

    //calculate if achieve end of scrool page
    if (isEndScrool) {

        //if is not loading increment for next page
        if (!loadingData) {
          setPageNumber(pageNumber + 1)
        }

        //active scrooling and pagination
        setIsPagination(true)
        setLoadingData(true)
    }
  }


  const handleDeadLineCalculator = (idPublication: number, hasMatter: boolean) => {
    // set current publication edit to refresh only this
    setCurrentPublicationId(idPublication)

    // keep saved publication id to send id to API make the relashionship between both
    localStorage.setItem('@GoJur:PublicationId', idPublication.toString())
    localStorage.setItem('@GoJur:PublicationHasMatter', (hasMatter?'S':'N'))

    const publicationData = publication.find(item => item.id == idPublication);

    if (publicationData){
      handleDetailsAnyType(publicationData)
    }

    handlePublicationModal('Calc')
  }


  const handleCoveragesList = () => {
    const page = Coverages;
    window.open("/publication/coverages", "_blank")
  }


  const handleCloseLog= () => {
    setShowLog(false)
    setShowMatterEventLog(false)
  }


  const handleLog = async (id: number) => {
    setCurrentPublicationId(id)
    setShowLog(true)
  }

  
  const OpenDateModal = async () => {
    setChangeDates(false)
    setShowDateModal(true)
  }

  
  const CloseDateModal = async () => {
    setShowDateModal(false)
  }


  // MATTER EVENTS
  const handleOpenMatterEventMenu = useCallback(
    id => {
      const menu = publication.map(publi =>
        publi.meCod_ProcessoAcompanhamento === id
          ? {
              ...publi,
              openMenu: !publi.openMenu,
            }
          : publi,
      );

      setPublication(menu);
    },
    [publication],
  )


  const MatterEventReadOrNot = useCallback(async id => {
    try {
      setActionType('readUnread')

      await api.post('/ProcessoAcompanhamentos/LidoNaoLido', {matterEventId: id, token });

      const read = publication.map(publi =>
        publi.TIPO == 'A' && publi.meCod_ProcessoAcompanhamento === id ? 
        {
          ...publi,
          readMatterEvent: !publi.readMatterEvent,
          hasMatterEventLog: true
        } : publi,
      );

      setPublication(read);
      setActionType('none')
    } catch (err) {
      console.log(err);
      setActionType('none')
    }
  }, [publication])


  const PrintMatterEvent = useCallback(async (id: number) => {

    try {
      const response = await api.get(`/ProcessoAcompanhamentos/Relatorio`, {
        params:{
          matterEventIds: id.toString(),
          token: token
        }
      })

      setIsGeneratingReport(true)
      setIdReportGenerate(response.data)
      handleOpenReportModal()
    }
    catch (err) {
      console.log(err);
    }
  }, [publication])


  const MatterSelectToReport = useCallback(id => {
    const select = publication.map(item =>
      item.meCod_ProcessoAcompanhamento === id ? {
        ...item,
        publicationSelected: id,
      } : item)

    setPublication(select);
  }, [publication])


  const MatterUnselectToReport = useCallback(id => {
    const unselect = publication.map(item =>
      item.meCod_ProcessoAcompanhamento === id ? {
        ...item,
        publicationSelected: 0,
      } : item)

    setPublication(unselect);
  }, [publication])


  const MatterEventCreateCalendarEvent = async (matterId: number, matterEventIdId: number) => {
    try {
      handleModalActiveId(0)
      isOpenModal('0')

      handleDeadLineCalculatorText(null)

      // set current publication edit to refresh only this
      setCurrentPublicationId(matterEventIdId)

      // keep saved publication id to send id to API make the relashionship between both
      localStorage.setItem('@GoJur:MatterEventId', matterEventIdId.toString())
      localStorage.setItem('@GoJur:PublicationHasMatter', 'S')
      localStorage.removeItem('@GoJur:RecurrenceDate');

      selectProcess(null)

      if (matterId > 0)
      {
        const response = await api.post<ProcessData>('/Processo/SelecionarProcesso',{
            matterId: matterId,
            token: localStorage.getItem('@GoJur:token'),
            companyId: localStorage.getItem('@GoJur:companyId'),
            apiKey: localStorage.getItem('@GoJur:apiKey')
          }
        );

        let courtDesc = "";
        let courtDeptDesc = "";

        if(response.data.instanceList.length > 0){
          const court = response.data.instanceList[0];

          courtDesc = `${court.forumDesc.toString()} - ${court.instance.toString()} Instância`;
          courtDeptDesc = `${court.varaNumber.toString()}ª ${court.varaDesc.toString()}`;
        }

        var matter = response.data;

        selectProcess({
          matterId: matterId,
          matterCustomerDesc: matter.matterCustomerDesc,
          matterOppossingDesc: matter.matterOppossingDesc,
          matterFolder: matter.matterFolder,
          matterNumber: matter.matterNumber,
        })

        let matterText = `Pasta: ${matter.matterFolder} - Proc: ${matter.matterNumber}`

        if (matter.matterCustomerDesc){
          matterText += `\n${matter.matterCustomerDesc}`
        }

        if (matter.matterOppossingDesc){
          matterText += ` X ${matter.matterOppossingDesc}`
        }

        if (courtDesc){
          matterText += `\n${courtDesc}`
        }

        if (courtDeptDesc){
          matterText += `\n${courtDeptDesc}`
        }

        const publi = publication.filter(item => item.meCod_ProcessoAcompanhamento === matterEventIdId);

        const publicationText = publi.map(i => i.meDes_Acompanhamento);

        handleMatterAssociated(true);

        handleCaptureTextPublication(`${matterText}\n\n${publicationText}`);
      }
      else{
        const publi = publication.filter(item => item.meCod_ProcessoAcompanhamento === matterEventIdId);
        const publicationText = publi.map(i => i.meDes_Acompanhamento);

        localStorage.setItem('@GoJur:PublicationHasMatter', 'N')
        handleCaptureTextPublication(`${publicationText}`);
      }

    } catch (err) {
      console.log('Error in create a new calendar by publication view')
    }
  }


  const MatterEventDelete = useCallback(id => {
    setItemType('A')
    setIsDeleting(true)
    setCheckMessage(true);
    setCurrentPublicationId(id)
    
  }, [publication])


  const handleDeleteMatterEvent = async () =>
  {
    try {

      setActionType('delete')

      await api.delete('/ProcessoAcompanhamentos/ExcluirPelaPublicacao', {
        params:{id: currentPublicationId, token}
      });

      setCheckMessage(false)
      handleConfirmMessage(false)
      handleCancelMessage(true)
      setCurrentPublicationId(0)
      setIsDeleting(false)

      // after delete from backend delete in current list
      const deletePublication = publication.filter(publi => publi.meCod_ProcessoAcompanhamento !== currentPublicationId);
      setPublication(deletePublication);

      // update total number
      let total = totalPublications - 1;
      if (total < 0) { total = 0}
      setTotalPublications(total);
      setActionType('none')
      setItemType('')
    } catch (err) {
      console.log(err);
      setActionType('none')
    }
  }


  const MatterEventLog = async (id: number) => {
    setCurrentPublicationId(id)
    setShowMatterEventLog(true)
  }


  const MatterDeadLineCalculator = (matterEventId: number, hasMatter: boolean) => {
    // set current publication edit to refresh only this
    setCurrentPublicationId(matterEventId)

    // keep saved publication id to send id to API make the relashionship between both
    localStorage.setItem('@GoJur:MatterEventId', matterEventId.toString())
    localStorage.setItem('@GoJur:PublicationHasMatter', (hasMatter?'S':'N'))

    const publicationData = publication.find(item => item.meCod_ProcessoAcompanhamento == matterEventId);

    if (publicationData){
      handleDetailsAnyType(publicationData)
    }

    handlePublicationModal('Calc')
  }


  return (
    <Container style={{pointerEvents:(loadingData?'none':'all'),opacity:(isMobile && isPagination?'0.3':'1')}} onScrollCapture={handleScroll}>
      <HeaderPage />

      {(showReportOpenFileModal) && <Overlay /> }
      {(showReportOpenFileModal) && <ReportModalPopUp callbackFunction={{CloseReportModal, reportLink}} /> }

      {showLog && (
        <LogModal
          idRecord={currentPublicationId}
          handleCloseModalLog={handleCloseLog}
          logType="publicationLog"
        />
      )}

      {showMatterEventLog && (
        <LogModal
          idRecord={currentPublicationId}
          handleCloseModalLog={handleCloseLog}
          logType="matterEventLog"
        />
      )}

      {checkMessage && (
        <ConfirmBoxModal
          useCheckBoxConfirm
          title="Exclusão da publicação"
          message="A publicação será excluida.
                   Caso ela esteja associada a um processo ele também será excluída da pasta.
                   Confirma a operação ?"
        />
      )}

      {isReportModalOpen && <ReportModal>{publication}</ReportModal>}

      <Filter>
        <div>
          <section id="week">
            <button
                  type="button"
                  onClick={() => handleChangeFilterDate('1d')}
                  style={{
                    backgroundColor:
                      `${filterPeriod}` === '1d' ? '#2C8ED6' : '#f7f7f8',
                  }}
              >Hoje
              </button>

            <button
                type="button"
                onClick={() => handleChangeFilterDate('7d')}
                style={{
                      backgroundColor:
                        `${filterPeriod}` === '7d' ? '#2C8ED6' : '#f7f7f8',
                    }}
              >7 Dias
            </button>

            <button
              type="button"
              onClick={() => handleChangeFilterDate('30d')}
              style={{
                    backgroundColor:
                      `${filterPeriod}` === '30d' ? '#2C8ED6' : '#f7f7f8',
                  }}
              >30 Dias
            </button>

            <button
              type="button"
              onClick={() => handleChangeFilterDate('90d')}
              style={{
                    backgroundColor:
                      `${filterPeriod}` === '90d' ? '#2C8ED6' : '#f7f7f8',
                  }}
              > 90 Dias
          </button>

          <button
              type="button"
              onClick={() => handleChangeFilterDate('year')}
              style={{
                backgroundColor:
                  `${filterPeriod}` === 'year' ? '#2C8ED6' : '#f7f7f8',
              }}
            >1 Ano
          </button>

          <button
            type="button"
            onClick={() => handleChangeFilterDate('all')}
            style={{
                  backgroundColor:
                    `${filterPeriod}` === 'all' ? '#2C8ED6' : '#f7f7f8',
                }}
            >Todas
          </button>

        </section>

        {(filterPeriod === 'all' && !loadingData && isInitialized) && <FcAbout className="tipMesssage" title={"Até 5 anos"} />}

        &nbsp;&nbsp;
        <section id="dateSelect">
          <button
            className="buttonClick"
            type='button'
            onClick={()=> OpenDateModal()}
            style={{width:'140px', height:'28px', marginTop:'5px'}}
          >
            Selecionar Período
          </button>
        </section>

        {(showDateModal) && <Overlay /> }
        {(showDateModal) && <DateModal callbackFunction={{CloseDateModal, dtaCustomStart, setDtaCustomStart, dtaCustomEnd, setDtaCustomEnd, changeDates, setChangeDates, showCustomDates, setShowCustomDates }} /> }

          <section id="filters">
            <Multi
              options={options}
              value={multiFilter}
              onChange={(values: []) => handleMultiFilter(values)}
              labelledBy="Selecione"
              selectAllLabel="Selecione"
              hasSelectAll={false}
              disableSearch
              ClearIcon
              overrideStrings={{
                selectSomeItems: 'Filtragem Rápida',
              }}
            />

            <select
              name="name-filter"
              id="name-filter"
              placeholder="Filtro por nome"
              value={nameFilterValue}
              onChange={handleChangeFilterName}
            >

            <option value="filterNameFalse">Todos - geral</option>
            <option value="pubNameResponsible">Processo responsável</option>

            {filterName === "pubNameAll" ? (
              <option value="pubNameAll">
                Todos - filtro por nome ativo
              </option>
                ) : null}

            {profileFilterList.map(item => (
              <option value={`pubName_${item.id}`} key={item.id}>
                {item.value}
              </option>
            ))}
          </select>

          {!hasItemCheckBoxSelected ? (
            <button className="buttonCheckBox" type="button" onClick={handleSelectAllPublication}>
              <FiCheckSquare />
              Selecionar Todas
            </button>
          ) :
            <button className="buttonCheckBox" type="button" onClick={handleUnSelectAllPublication}>
                <FiCheckSquare />
                Desmarcar Todas
            </button>
          }

            <button type="button" onClick={handleOpenMenu}>
              {isOpenMenu ? <ImMenu4 /> : <ImMenu3 />}
            </button>

            {isOpenMenu ? (

              <PublicationOptionsMenu callbackList={{
                handleCopyClipBoard,
                handlePrintSelectPublications,
                handleCoveragesList,
                handleAssociatedAllProcess,
                handleModalPublicationName,
                handleModalPublicationEmail
              }} />

            ) : null}

          </section>
        </div>

        <article>
          {showCustomDates && (
            <h1>
              Período aplicado: &nbsp;
              {format(new Date(`${dtaCustomStart}T00:00:00`), 'dd/MM/yyyy')}
              &nbsp;à&nbsp;
              {format(new Date(`${dtaCustomEnd}T00:00:00`), 'dd/MM/yyyy')}
              <br />
            </h1>
          )}
          
          {publication.length > 0 && !loadingData && (
            <h1>
              Total: &nbsp;
              <b>{totalPublications}</b>
            </h1>
          )}

          {(filterName === 'pubNameAll' && !loadingData && isInitialized) && (
            <>
              <p style={{color: '#13513', fontSize: (!isMobile? '0.7rem': '0.5rem'), zIndex:0}}>
                Exibindo as publicações filtradas conforme configuração feitas em Filtro por Nome
              </p>
            </>
          )}
        </article>
      </Filter>

      <Wrapper onClick={() => {
        setIsOpenMenu(false)
        handleShowListSearch(false)
        }}
      >
        {publication.length === 0 && !loadingData && isInitialized && (
          <h6
            style={{
              flex: 1,
              marginTop:'10rem',
              fontFamily: 'Montserrat',
              fontWeight: 200,
              textAlign: 'center',
            }}
          >
            Não foram localizadas publicações com os critérios selecionados. Tente reduzir os filtros e pesquisar novamente.
          </h6>
        )}

        {publication.map(item => (

          item.TIPO === 'P' ? (
            <PublicationItem id='PublicationItem' key={item.id}>
              <header style={{backgroundColor: `${item.matterId}` === '0' ? '#fafa86' : 'rgba(0, 0, 0, 0.1)'}}>
                {item.publicationSelected === 0 ? (
                  <input type="checkbox" name="select" id="select" onChange={() => PublicationSelectToReport(item.id)} style={{marginLeft:'5px'}} />
                ) : (
                  <input type="checkbox" name="select" id="select" checked onChange={() => PublicationUnselectToReport(item.id)} style={{marginLeft:'5px'}} />
                )}
                <article>
                  <RiNewspaperFill title='Publicação capturada no diário oficial' />
                  <p>
                    Publicação: &nbsp;
                    {format(new Date(item.publicationDate), 'dd/MM/yyyy')}
                  </p>

                  <p>
                    Divulgação: &nbsp;
                    {format(new Date(item.releaseDate), 'dd/MM/yyyy')}
                  </p>
                </article>

                <p>
                  Nome: &nbsp;
                  {item.customerName}
                </p>
              </header>
              <div>
                <ContentItem isRead={item.read}>
                  <div>
                    <div style={{float:'left', width:'40%'}}>
                      <p className='titleResponsible' id="title">Processo:&nbsp;</p>
                      <p className='contentResponsible'>{item.matterNumber}</p>
                    </div>

                    <div style={{float:'left', width:'40%'}}>
                      <p className='titleResponsible' id="title">Responsável:&nbsp;</p>
                      <p className='contentResponsible' title={item.matterResponsibleAll}>{item.matterResponsibleFirst}</p>
                    </div>
                  </div>

                  <div>
                    <p id="title">Partes:</p>
                    <p>{item.matterParts}</p>
                  </div>
                  <div style={{marginBottom:'10px'}}>
                    <p id="title">Ação:</p>
                    <p>{item.judicialAction}</p>
                  </div>

                  <LabelTooggle
                    description={item.description}
                    limitCharacters={1000}
                    searchTerm={item.searchTerm}
                  ></LabelTooggle>
                </ContentItem>

                <MenuItem open={item.openMenu}>
                  {item.openMenu ? (
                    <div>
                      <section>
                        <button type="button" onClick={() => handleOpenPublicationMenu(item.id)}>
                          <BiMenuAltLeft />
                        </button>

                        <p onClick={() => handleDeadLineCalculator(item.id, item.withMatter)} title="Clique para abrir a calculadora de prazos">
                          <FaCalculator />
                          Calculadora de Prazos
                        </p>

                        <p onClick={() => handleAppointmentModalInclude(item.matterId, item.id, item.withMatter)} title="Clique para agendar um prazo">
                          <RiCalendarCheckFill />
                          Agendar Prazo
                        </p>

                        {item.matterId === 0 && (
                          <p
                            onClick={() => {
                              localStorage.setItem('@GoJur:PublicationId',item.id.toString());
                              handlePublicationModal('Associated');
                            }}
                            title="Clique para associar um processo a publicação"
                          >
                            <FaRegEdit />
                            Associar Processo
                          </p>
                        )}

                        <p onClick={() => PublicationReadOrNot(item.id)} title={item.read? 'Clique para marcar a publicação como não lida': 'Clique para marcar a publicação como lida'}>
                          {item.read? <VscFolderOpened /> : <VscFolder />}
                          {item.read? 'Marcar como não lido': 'Marcar como lido'}
                        </p>

                        <p onClick={() => PrintPublications(item.id)} title="Clique para imprimir esta publicação">
                          <AiOutlinePrinter />
                          Imprimir
                        </p>

                        {item.matterId > 0 &&
                          <p onClick={() => handleRedirectToProcess(item.matterId)} title="Clique para abrir o processo associado a esta publicação">
                            <FaRegEdit />
                            Abrir Processo
                          </p>
                        }

                        <p onClick={() => handleDelete(item.id)} title="Clique para excluir esta publicação">
                          <RiDeleteBinLine />
                          Excluir
                        </p>

                        <p onClick={() => handleLog(item.id)} title="Clique para visualizar os logs de alteração desta publicação">
                          <CgDetailsMore />
                          Visualizar Log
                        </p>
                      </section>

                      <EventList>
                        {item.eventList.length > 0 && item.eventList.map((appointment) => {
                            return <p style={{ textDecoration: (appointment.status === 'P'? 'none':'line-through')}}><a title={appointment.description}
                            onClick={() => handleAppointmentModalEdit(item.id, item.withMatter, appointment)}>
                                { format(new Date(appointment.startDate), 'dd/MM/yyyy HH:mm') + " - " + appointment.subject}
                            </a></p>
                          })
                        }

                        { item.eventList.length == 0 &&
                          <p className="emptyMessage">Nenhum compromisso encontrado.</p>
                        }
                      </EventList>

                    </div>
                  ) : (
                    <button type="button" onClick={() => handleOpenPublicationMenu(item.id)}>
                      <FiMenu />
                    </button>
                  )}
                </MenuItem>
              </div>
            </PublicationItem>

            ) : (
            
            <MatterEventItem id='MatterEventItem' key={item.meCod_ProcessoAcompanhamento}>
              <header style={{backgroundColor: '#991909'}}>
                {item.publicationSelected === 0 ? (
                  <input type="checkbox" name="select" id="select" onChange={() => MatterSelectToReport(item.meCod_ProcessoAcompanhamento)} style={{marginLeft:'5px'}} />
                ) : (
                  <input type="checkbox" name="select" id="select" checked onChange={() => MatterUnselectToReport(item.meCod_ProcessoAcompanhamento)} style={{marginLeft:'5px'}} />
                )}
                <article>
                  <ImHammer2 title='Andamento capturado no site do tribunal' />
                  <p>
                    Acompanhamento: &nbsp;
                    {format(new Date(item.meDta_Acompanhamento), 'dd/MM/yyyy')}
                  </p>

                  <p>
                    Captura: &nbsp;
                    {format(new Date(item.meDta_Inclusao), 'dd/MM/yyyy')}
                  </p>

                  <p>
                    Carga Inicial ? &nbsp;
                    {item.meFlg_PrimeiraCargaTribunal == 'S' ? 'Sim' : 'Não'}
                  </p>

                  <p style={{marginLeft:'-10px', marginTop:'3px'}}>
                    <FcAbout style={{height:'15px', width:'15px'}} title="Indica se o acompanhamento foi capturado na primeira carga do monitor de processos GOJUR." />
                  </p>

                </article>
              </header>
              <div>
                <ContentItemMatterEvent isRead={item.readMatterEvent}>
                  <div>
                    <div style={{float:'left', width:'40%'}}>
                      <p className='titleResponsible' id="title">Processo:&nbsp;</p>
                      <p className='contentResponsible'>{item.meNum_Processo}</p>
                    </div>

                    <div style={{float:'left', width:'40%'}}>
                      <p className='titleResponsible' id="title">Responsável:&nbsp;</p>
                      <p className='contentResponsible' title={item.matterResponsibleAll}>{item.matterResponsibleFirst}</p>
                    </div>
                  </div>

                  <div>
                    <p id="title">Partes:</p>
                    <p>{item.meMatterParts}</p>
                  </div>
                  <div style={{marginBottom:'10px'}}>
                    <p id="title">Ação:</p>
                    <p>{item.meDes_AcaoJudicial}</p>
                  </div>

                  <LabelTooggle
                    description={item.meDes_Acompanhamento}
                    limitCharacters={1000}
                    searchTerm={item.searchTerm}
                  ></LabelTooggle>
                </ContentItemMatterEvent>

                <MenuItem open={item.openMenu}>
                  {item.openMenu ? (
                    <div>
                      <section>
                        <button type="button" onClick={() => handleOpenMatterEventMenu(item.meCod_ProcessoAcompanhamento)}>
                          <BiMenuAltLeft />
                        </button>

                        <p onClick={() => MatterDeadLineCalculator(item.meCod_ProcessoAcompanhamento, true)} title="Clique para abrir a calculadora de prazos">
                          <FaCalculator />
                          Calculadora de Prazos
                        </p>

                        <p onClick={() => MatterEventCreateCalendarEvent(item.meCod_Processo, item.meCod_ProcessoAcompanhamento)} title="Clique para agendar um prazo">
                          <RiCalendarCheckFill />
                          Agendar Prazo
                        </p>

                        <p onClick={() => MatterEventReadOrNot(item.meCod_ProcessoAcompanhamento)} title={item.readMatterEvent? 'Clique para marcar o acompanhamento como não lido': 'Clique para marcar o acompanhamento como não lido'}>
                          {item.readMatterEvent? <VscFolderOpened /> : <VscFolder />}
                          {item.readMatterEvent? 'Marcar como não lido': 'Marcar como lido'}
                        </p>

                        <p onClick={() => PrintMatterEvent(item.meCod_ProcessoAcompanhamento)} title="Clique para imprimir este acompanhamento">
                          <AiOutlinePrinter />
                          Imprimir
                        </p>

                        <p onClick={() => handleRedirectToProcess(item.meCod_Processo)} title="Clique para abrir o processo deste acompanhamento">
                          <FaRegEdit />
                          Abrir Processo
                        </p>

                        {(accessCode?.includes('MATLEVDE') || accessCode === 'adm') && (
                          <p onClick={() => MatterEventDelete(item.meCod_ProcessoAcompanhamento)} title="Clique para excluir este acompanhamento">
                            <RiDeleteBinLine />
                            Excluir
                          </p>
                        )}

                        <p onClick={() => MatterEventLog(item.meCod_ProcessoAcompanhamento)} title="Clique para visualizar os logs de alteração deste acompanhamento">
                          <CgDetailsMore />
                          Visualizar Log
                        </p>
                      </section>

                      <EventList>
                        {item.eventList.length > 0 && item.eventList.map((appointment) => {
                            return <p style={{ textDecoration: (appointment.status === 'P'? 'none':'line-through')}}><a title={appointment.description}
                            onClick={() => handleAppointmentModalEdit(item.meCod_ProcessoAcompanhamento, true, appointment)}>
                                { format(new Date(appointment.startDate), 'dd/MM/yyyy HH:mm') + " - " + appointment.subject}
                            </a></p>
                          })
                        }

                        { item.eventList.length == 0 &&
                          <p className="emptyMessage">Nenhum compromisso encontrado.</p>
                        }
                      </EventList>
                    </div>
                  ) : (
                    <button type="button" onClick={() => handleOpenMatterEventMenu(item.meCod_ProcessoAcompanhamento)}>
                      <FiMenu />
                    </button>
                  )}
                </MenuItem>
              </div>
            </MatterEventItem>
          )
        ))}

        <div id="footer">

          { (isPagination) && (
            <p style={{ fontSize:14, marginLeft:'4%', color: '#f19000' }}>
                Aguarde - carregando mais publicações  ... <span></span><span></span>
                <Loader size={6} color="#f19000" />
            </p>
          )}

        </div>

      </Wrapper>

      <VideoTrainningModal />

      {(loadingData && !isPagination) && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

      {actionType != 'none' && (
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

export default Publication;
