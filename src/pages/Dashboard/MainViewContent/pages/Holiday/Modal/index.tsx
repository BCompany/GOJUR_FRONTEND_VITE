/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, ChangeEvent, useRef } from 'react';
import { FaRegTimesCircle, FaFileAlt } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { useToast } from 'context/toast';
import { MdHelp } from 'react-icons/md';
import { SiMicrosoftexcel } from 'react-icons/si';
import { IoIosPaper } from 'react-icons/io';
import { FaFilePdf } from 'react-icons/fa';
import { FiSave, FiDownloadCloud, FiTrash} from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi'
import { AutoCompleteSelect, GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { DataTypeProvider, PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import TextArea from 'components/TextArea';
import Select from 'react-select'
import { selectStyles, useDelay, FormatDate, FormatFileName} from 'Shared/utils/commonFunctions';
import { format } from 'date-fns';
import { loadingMessage, noOptionsMessage, languageGridEmpty, languageGridPagination } from 'Shared/utils/commonConfig';
import { AmazonPost } from 'Shared/utils/commonFunctions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Loader from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import api from 'services/api';
import LogModal from './ModalLogHoliday';
import { ISelectData, IFederalUnitData, IAutoCompleteData, ICities, ICourtDeadLineData, IHolidayUploadFile, IHolidayData } from '../../Interfaces/IHoliday';
import { ModalHoliday, ModalHolidayMobile, Flags, TaskBar, OverlayModal, OverlayUpload } from './styles';

interface FileProps {
  holidayId: number;
  load: boolean
}

const HolidayEdit = () => {
  const { handleModalActive, handleModalActiveId, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const { isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage } = useConfirmBox();
  const { addToast } = useToast();
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');
  const modalCompanyId = localStorage.getItem('@GoJur:modalCompanyId');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const [isSaving , setisSaving] = useState<boolean>();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false)
  const [isPublic, setIsPublic] = useState<boolean>(false)
  const [holidayName, setHolidayName] = useState<string>("");
  const [typeMatter, setTypeMatter] = useState<string>("A")
  const [typeHoliday, setTypeHoliday] = useState<string>("N")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [typeLocal, setTypeLocal] = useState<string>("E")
  const [typeCalculator, setTypeCalculator] = useState<string>("0")
  const [federalUnit, setFederalUnit] = useState<ISelectData[]>([]);
  const [federalUnitId, setFederalUnitId] = useState('');
  const [federalUnitValue, setFederalUnitValue] = useState('');
  const [federalUnitTerm, setFederalUnitTerm] = useState('');
  const [holidayDescription, setHolidayDescription] = useState<string>('');
  const [isFixed, setIsFixed] = useState<boolean>(false)
  const [cities, setCities] = useState<ISelectData[]>([]);
  const [citiesId, setCitiesId] = useState('');
  const [citiesTerm, setCitiesTerm] = useState('');
  const [citiesValue, setCitiesValue] = useState('');
  const [deadLineValue, setDeadLineValue] = useState('');
  const [deadLineTerm, setDeadLineTerm] = useState('');
  const [deadLine, setDeadLine] = useState<IAutoCompleteData[]>([]);
  const [deadLineId, setDeadLineId] = useState('');
  const [citiesDesc, setCitiesDesc] = useState('');
  const [appointmentBlockUpdate, setAppointmentBlockUpdate] = useState(true);
  const [showLog, setShowLog] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [documentList, setDocumentList] = useState<IHolidayUploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([10, 50, 100, 0]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tokenContinuation, setTokenContinuation] = useState<string | null>('');
  const [uploadingStatus, setUploadingStatus] = useState<string>('none');
  const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [checkMessage, setCheckMessage] = useState(false)
  const ref = useRef<any>(null);


  useEffect(() => {
    if (modalCompanyId != "0" && modalCompanyId != null)
      LoadDocuments()
  }, [modalCompanyId])


  useEffect(() => {
    if (modalActiveId == 0)
      setIsLoading(false);
  }, [modalActiveId, isLoading])


  useEffect(() => {
    if (caller === '')
      return
    
    if (modalActiveId > 0)
      SelectHoliday(modalActiveId)
  }, [modalActiveId, caller])


  useDelay(() => {
    if (citiesTerm.length > 0)
      LoadCities()
  }, [citiesTerm], 5000)


  useEffect(() => {
    LoadFederalUnit()
    LoadCities()
    LoadDeadLine()
  }, [])


  useEffect(() => {
    if(modalActiveId == 0)
      setAllowDelete(true)
  }, [allowDelete, modalActiveId])


  useEffect(() => {
    if (isCancelMessage){
      setCheckMessage(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])


  useEffect(() => {
    if (isConfirmMessage){
      setCheckMessage(false)
      handleConfirmMessage(false)
      SaveHoliday(true)
    }
  }, [isConfirmMessage])


  const SelectHoliday = useCallback(async(id: number) => {
    setIsLoading(true)

    const response = await api.post<IHolidayData>('/Feriados/Editar', {id, token})

    setHolidayName(response.data.holidayName)
    setTypeMatter(response.data.typeMatter)
    setTypeHoliday(response.data.typeHoliday)
    setStartDate(FormatDate(new Date(response.data.startDate), 'yyyy-MM-dd'))
    setDeadLineId(response.data.idCourt)
    setTypeCalculator(response.data.typeCalculator)
    setTypeLocal(response.data.typeLocal)
    setFederalUnitId(response.data.idState)
    setCitiesId(response.data.idCity)
    setCitiesValue(response.data.nameCity)
    setCitiesDesc(response.data.nameCity)
    setHolidayDescription(response.data.description)
    setIsFixed(response.data.isFixed)
    setIsPublic(response.data.isPublic)
    setAllowDelete(response.data.allowDelete)

    if (response.data.endDate != null)
      setEndDate(format(new Date(response.data.endDate), 'yyyy-MM-dd'))

    if (response.data.isPublic != true)
      setAppointmentBlockUpdate(false)
    
    // Open modal after load data
    handleModalActive(true)
    setIsLoading(false)
  }, [holidayName, typeMatter, typeHoliday, isPublic, allowDelete, startDate, endDate, deadLineId, typeCalculator, typeLocal, federalUnitId, citiesId, holidayDescription, isFixed, isLoading, modalActiveId]);


  const SaveHoliday = useCallback(async(longDate: boolean) => {
    try {
      const isLongDate = longDate

      if (isSaving) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Já existe uma operação em andamento`})
        return;
      }

      if (holidayName == "") {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Nome identificador do feriado não informado`})
        return;
      }

      if (startDate == "") {
        addToast({type: "info", title: "Operação NÃO realizada", description: `A data relacionada ao feriado não foi informada`})
        return;
      }

      if (typeLocal == "E" && federalUnitId == "") {
        addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário informar o estado correspondente a este feriado estadual`})
        return;
      }

      if (typeLocal == "M" && citiesId == "") {
        addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário informar a cidade correspondente a este feriado municipal`})
        return;
      }

      if (typeHoliday == "J") {
        if (endDate == "") {
          addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário informar a data de término para um tipo judicial`})
          return;
        }

        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);
        const result = Math.ceil((newEndDate.getTime() - newStartDate.getTime()) / (1000*60*60*24))

        if (result > 2 && !isLongDate) {
          setCheckMessage(true)
          return;
        }
      }

      setisSaving(true)

      const response = await api.post('/Feriados/Salvar', {
        holidayId: modalActiveId,
        name: holidayName,
        startDate,
        endDate,
        typeLocal,
        typeHoliday,
        typeMatter,
        typeCalculator,
        isFixed,
        idCity: citiesId,
        idState: federalUnitId,
        idCourt: deadLineId,
        nameCity: citiesValue,
        nameState: federalUnitValue,
        nameCourt: deadLineValue,
        description: holidayDescription,
        isLongDate,
        token
      })

      setisSaving(false)
      handleModalActiveId(response.data)

      addToast({type: "success", title: "Assunto salvo", description: "O feriado foi adicionado no sistema."})
    }
    catch (err) {
      addToast({type: "error", title: "Falha ao salvar feriado."})
    }
  }, [isSaving, holidayName, startDate, endDate, typeLocal, typeHoliday, typeMatter, typeCalculator, citiesId, federalUnitId, deadLineId, citiesValue, federalUnitValue, deadLineValue, holidayDescription, isFixed, modalActiveId]);


  const handleHolidayModalClose = () => { 
    setHolidayName("")
    setTypeMatter("A")
    setTypeHoliday("N")
    setTypeLocal("E")
    setTypeCalculator("0")
    setStartDate("")
    setEndDate("")
    setDeadLineId("")
    setFederalUnitId("")
    setCitiesId("")
    setHolidayDescription("")
    setIsFixed(false)
    handleModalActiveId(0)
    handleModalActive(false)
    setAllowDelete(false)
    setAppointmentBlockUpdate(true)
    setIsPublic(false)
    setPageSize(10)
    setCurrentPage(0)
    setDocumentList([])
    setCitiesDesc("")
    handleCaller("holidayModal")
    localStorage.removeItem('@GoJur:modalCompanyId')
  }


  // REPORT FIELDS - CHANGE
  const handleFederalUnitSelected = (item) => { 
    if (item){
      setFederalUnitValue(item.value)
      setFederalUnitId(item.id)
    }
    else{
      setFederalUnitValue('')
      LoadFederalUnit('reset')
      setFederalUnitId('')
    }
  }


  // REPORT FIELDS - GET API DATA
  const LoadFederalUnit = async (stateValue?: string) => {
    if (isLoadingComboData)
      return false;

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? federalUnitValue:federalUnitTerm
    if (stateValue == 'reset')
      filter = ''

    try {
      const response = await api.get<IFederalUnitData[]>('/Estados/ListarGeral', {
        params:{filterClause: filter, token}
      });

      const listFederalUnit: ISelectData[] = []

      response.data.map(item => {
        return listFederalUnit.push({
          id: item.id,
          label: item.value
        })
      })
      
      setFederalUnit(listFederalUnit)
      setIsLoadingComboData(false)
    }
    catch (err) {
      console.log(err);
    }
  }


  const handleNewDescription = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const description = event.target.value;

      setHolidayDescription(description);
    },
    [],
  ); // salva o valor da descrição


  const handleCitiesSelected = (item) => {
    if (item){
      setCitiesValue(item.label)
      setCitiesId(item.id)
      setCitiesDesc(item.label)
    }
    else{
      setCitiesValue('')
      LoadCities('reset')
      setCitiesId('')
    }
  }


  const handleDeadLineSelected = (item) => { 
    if (item){
      setDeadLineValue(item.label)
      setDeadLineId(item.id)
      setFederalUnitId(item.idState)
    }
    else{
      setDeadLineValue('')
      LoadDeadLine('reset')
      setDeadLineId('')
    }
  }


  const handleLogOnDisplay = useCallback(async () => {
    setShowLog(true);
  }, []); 


  const handleCloseLog = () => {
    setShowLog(false)
  }


  const LoadCities = async (stateValue?: string) => {
    if (isLoadingComboData)
      return false;

    let filter = stateValue == "initialize"? citiesValue:citiesTerm
    if (stateValue == 'reset')
      filter = ''

    try {
      const response = await api.get<ICities[]>('/Cidades/ListarGeral', {
        params:{filterClause: filter, rows: 50, token}
      });

      const listCities: ISelectData[] = []

      response.data.map(item => {
        return listCities.push({
          id: item.citiesId,
          label: item.citiesDescription
        })
      })
      
      setCities(listCities)
      setIsLoadingComboData(false)
    }
    catch (err) {
      console.log(err);
    }
  }


  const LoadDeadLine = async (stateValue?: string) => {
    if (isLoadingComboData)
      return false;

    let filter = stateValue == "initialize"? deadLineValue:deadLineTerm
    if (stateValue == 'reset')
      filter = ''

    try {
      const response = await api.get<ICourtDeadLineData[]>('/Forum/ListarDeadLine', {
        params:{
        filterClause: filter,
        typeCalculator: 0,
        token,
        }
      });

      const listDeadLine: IAutoCompleteData[] = []

      response.data.map(item => {
        return listDeadLine.push({
          id: item.id,
          label: item.courtName,
          idState: item.idState
        })
      })
      
      setDeadLine(listDeadLine)
      setIsLoadingComboData(false)
    }
    catch (err) {
      console.log(err);
    }
  }


  const ListHolidayFiles = async(holidayId: number, rows:number, tokenPaginationAmazon: string|null) => {
    const response = await api.post<IHolidayUploadFile[]>('/FeriadoArquivos/ListarArquivos', {
      referenceId: modalActiveId,
      rows,
      tokenPaginationAmazon,
      companyId: modalCompanyId,
      token
    })

    return response;
  }


  const holidayId = modalActiveId;

  const LoadDocuments = useCallback(async (reloadList = false) => { 
    try
    {
      const response = await ListHolidayFiles(
        holidayId,
        reloadList ? 10: pageSize,
        reloadList ? null: tokenContinuation
      )

      setDocumentList(response.data)

      if (response.data.length > 0) {
        setTotalRows(response.data[0].Count)
        setTokenContinuation(response.data[0].tokenPagination)
      }
      else{
        setTotalRows(0)
        setTokenContinuation(null)
      }

      setIsDeletingFile(false)
      setUploadingStatus('none')
      setIsLoading(false)
    }
    catch(ex){
      setIsLoading(false)
    }
  }, [holidayId, pageSize, tokenContinuation])


  const CraeteFileUpload = async(request: any) => {
    const response = api.post<IHolidayUploadFile[]>('/FeriadoArquivos/CriarArquivoPendente', request)
    return response;
  }


  const handleSaveFile = (event: any) => {
    const {files} = event.target;
    UploadFiles(files)
  }


  // When just finish uploads call validation files
  useEffect(() => {
    if (uploadingStatus  === 'conclude') 
      handleValidateFiles();
  }, [uploadingStatus])


  const UploadFiles = useCallback(async (files: any[]) => {
    try
    {
      const request:any[] = []

      if (holidayId == 0) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário salvar o feriado antes de gravar o documento`})
        return;
      }

      // flag as executing to show progress bar
      setUploadingStatus('executing')

      let errorList = '';

      // save each file in a collection
      for (let index = 0; index < files.length; index++) {
        if (files[index].size > 11000000){
          errorList += `${files[index].name  } `;
        }
        else{
          // remove special characters from file name
          const fileName = FormatFileName(files[index].name, false);
          
          request.push({
            referenceId: holidayId,
            fileName,
            fileSize: files[index].size,
            token
          });
        }
      }

      const hasError = errorList.length > 0;

      if (!hasError) {
        try
        {
            // save all files as pending in lot mode
            const response = await CraeteFileUpload(request)

            // get document ids for all pending files to verify after and save
            const documentIds: number[] = [];
            response.data.map((item) => { return documentIds.push(item.id) })
            setFilesUploadIds(documentIds)

            // if everythings ok with pending save files save now each file in amazon
            const promisses: any[] = [];

            if (response.status == 200){

              for (let index = 0; index < files.length; index++) {
                promisses.push(AmazonPost(holidayId, files[index],"/Feriados/Feriado_"))
              }

              // when conclude set upload status as 'conclude' so now whe can, by use effect call endpoint to validate all files
              Promise.all(promisses).then(() => {
                setUploadingStatus('conclude')
              })
            }
        }
        catch(err:any){
          setUploadingStatus('none')
          addToast({type: "info", title: "Operação não realizada", description: err.response.data})
        }
      }
      else{
        setUploadingStatus('none')
        addToast({type: "info", title: "Operação não realizada", description: `O(s) arquivo(s) ${ errorList } excedem o tamanho máximo de 10MB, remova-os e tente novamente`})
      }

      ref.current.value = "";
    }
    catch(e){
      console.log(e)
      setUploadingStatus('none')
    }
  }, [addToast, holidayId, token])


  const ValidateFileUpload = async(request: any) => {
    const response = api.post<IHolidayUploadFile[]>('/FeriadoArquivos/ValidarArquivo', request);
    return response;
  }


  const handleValidateFiles = async () => {
    try
    {
        const request: any[] = [];

        filesUploadIds.map((item) => {
          return request.push({ id: item, token  })
        })

        await ValidateFileUpload(request)

        addToast({type: "success", title: "Upload efetuado com sucesso", description: `Upload de ${ filesUploadIds.length } arquivos efetuados com sucesso`})

        // setIsLoading(true)
        LoadDocuments()
        setUploadingStatus('none')
        setFilesUploadIds([])
    }
    catch(e){
      console.log(e)
      setIsLoading(true)
    }
  }


  const DownloadFile = async(referenceId: number, fileName: string, fileNameAmazon: string) => {
    const response =  api.post('/FeriadoArquivos/DownloadFile',{
      referenceId,
      fileName,
      fileNameAmazon,
      companyId: modalCompanyId,
      token,
    })

    return response;
  }


  const handleDownloadFile = async (fileName: any) => {
    const document = documentList.find(doc => doc.fileName === fileName);

    if (document){
      const response = await DownloadFile(
        holidayId,
        document.fileName,
        document.fileNameAmazon
      )

      window.open(response.data, 'blank')
      return false;
    }
  }


  const DeleteFile = async(request: any) => {
    const token = localStorage.getItem('@GoJur:token');
  
    const response = api.delete('/FeriadoArquivos/Deletar', {
      params:{referenceId: request.holidayId, fileName: request.fileName.toLowerCase(), token}
    })
     
    return response;
  }


  const handleDeleteFile = async (fileName: string) => {
    try{
      setIsDeletingFile(true)

      const response = await DeleteFile({
        holidayId: modalActiveId,
        fileName: fileName.toLowerCase(),
        token
      })

      // if something wront happen on server side response.data = false and we don't make anything on front end
      if (response.data)
      {
        const listDocumentRefresh = documentList.filter(doc => doc.fileName.toLowerCase() !== fileName.toLowerCase());

        if (listDocumentRefresh.length >= 1){
          setDocumentList(listDocumentRefresh)
          setIsDeletingFile(false)
          setTotalRows(totalRows-1)
        }
        else{
          await LoadDocuments(true)
        }
      }
      else{
        setIsDeletingFile(false)
      }
    }
    catch(ex){
      addToast({type: "info", title: "Operação NÃO realizada", description:"Houve uma falha na exclusão do documento"})
      setIsDeletingFile(false)
    }
  }


  const handleClick = (props: any) => {
    // call download function
    if (props.column.name === 'download' || props.column.name === '')
      handleDownloadFile(props.row.fileName)
  
    // call delete function
    if (props.column.name === 'delete')
      handleDeleteFile(props.row.fileName)
  }


  const [dateColumns] = useState(['dateUpload']);
  const columns = [
    { name: '',           title: ''  },
    { name: 'fileName',   title: 'Arquivo' },
    { name: 'dateUpload', title: 'Data' },
    { name: 'download',   title: 'Download'  },
    { name: 'delete',     title: 'Deletar' }
  ];


  const [tableColumnExtensions] = useState([
    { columnName: '',            width: '8%' },
    { columnName: 'fileName',    width: '30%' },
    { columnName: 'dateUpload',  width: '30%' },
    { columnName: 'btnDownload', width: '8%' },
    { columnName: 'btnDelete',   width: '8%' }
  ]);


  const [tableMobileColumnExtensions] = useState([
    { columnName: '',            width: '4%' },
    { columnName: 'fileName',    width: '22%' },
    { columnName: 'dateUpload',  width: '20%' },
    { columnName: 'btnDownload', width: '1%' },
    { columnName: 'btnDelete',   width: '1%' }
  ]);


  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );


  const CustomCell = (props) => {
    const { column } = props;

    if (column.title === 'Download') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiDownloadCloud title="Clique para fazer o download do arquivo" />
        </Table.Cell>
      );
    }

    if (column.title === '') {
      const imageExtensions = ['gif', 'png', 'svg', 'jpg', 'jpeg']
      const docExtension = ['pdf', 'doc', 'docx']
      const planExtensions = ['xlsx', 'xls']

      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          {/* image extensions image */}
          {(imageExtensions.includes(props.row.fileType) &&
            <BsImage title='Clique para fazer o download desta imagem' />
          )}
          {(planExtensions.includes(props.row.fileType) &&
            <SiMicrosoftexcel title='Clique para fazer o download desta planilha' />
          )}
          {(docExtension.includes(props.row.fileType) &&
            <FaFilePdf title='Clique para fazer o download deste documento' />
          )}
          {((!imageExtensions.includes(props.row.fileType)
            && !planExtensions.includes(props.row.fileType)
            && !docExtension.includes(props.row.fileType)) &&
            <HiDocumentText title='Clique para fazer o download deste documento' />
          )}
        </Table.Cell>
      );
    }

    if (column.title === 'Deletar' && allowDelete == true) {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiTrash title="Clique para remover o arquivo" />

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  if (isLoading){
    return (
      <>
        <Overlay />
        <div className='waitingMessage'>
          <Loader size={15} color="var(--blue-twitter)" />
          &nbsp;&nbsp;Aguarde...
        </div>
      </>
    )
  }


  return (
    <>
      {!isMOBILE && (
        <ModalHoliday show={modalActive}>
          {showLog && <LogModal idAppointment={modalActiveId} handleCloseModalLog={handleCloseLog} /> }

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Feriado/Recesso Judicial
            <br /><br />

            <div style={{display:'flex'}}>
              <label htmlFor="descricao" style={{width:"65%"}}>
                Nome
                <br />
                <input 
                  type="text"
                  name="descricao"
                  value={holidayName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setHolidayName(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <div style={{display:"flex", width:"35%", marginLeft:"2%"}}>
                <label htmlFor="type" style={{width:"95%"}}>
                  Meio de Trâmitação
                  <br />
                  <select
                    name="Type"
                    value={typeMatter}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeMatter(e.target.value)}
                  >
                    <option value="A">Ambos</option>
                    <option value="E">Eletrônico</option>
                    <option value="F">Fisico</option>
                    
                  </select>

                </label>

                <MdHelp 
                  className='icons' 
                  title='Informe se este feriado ou recesso judicial é trâmitado por meios físicos e/ou eletrônicos. Esta definição será considerada no calculo de prazos processuais.'
                  style={{minWidth: '20px', minHeight: '20px', marginLeft:"1%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
                />
              </div>
            </div>

            <div style={{display:"flex", marginTop:"1%"}}>
              <div style={{display:"flex", width:"63.5%"}}>
                <label htmlFor="type" style={{width:"50%"}}>
                  Tipo
                  <br />
                  <select
                    name="Type"
                    value={typeHoliday}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeHoliday(e.target.value)}
                  >
                    <option value="N">Normal</option>
                    <option value="J">Judicial</option>
                  </select>
                </label>

                <MdHelp
                  className='icons' 
                  title='O lançamento normal é indicado para o cadastro de feriados comuns, aqueles com data específica como Pascoa, Natal etc. O tipo judicial possui data de início e fim e podem se utilizado em casos como: recessos, emendas de feriados dentre outros provimentos.'
                  style={{minWidth: '20px', minHeight: '20px', marginLeft:"1%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
                />

                <label htmlFor="data" style={{marginLeft:"2%", width:"50%"}}>
                  {typeHoliday === "N" && (
                  <p>Data</p>
                  )}
                  {typeHoliday === "J" && (
                  <p>Data Inicial</p>
                  )}
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                  />
                </label>
              </div>

              {typeHoliday === "J" && (
                <label htmlFor="dataFinal" style={{marginLeft:"2%", width:"32%"}}>
                  Data Final
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                  />
                </label>
              )}
            </div>
            
            <div style={{display:"flex", marginTop:"1%"}}>
              {typeHoliday === "J" && (
                <AutoCompleteSelect className="selectDeadLine" style={{width:"29.5%"}}>
                  <p>Tribunal</p>  
                  <Select
                    isSearchable   
                    value={deadLine.filter(options => options.id == deadLineId)}
                    onChange={handleDeadLineSelected}
                    onInputChange={(term) => setDeadLineTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={deadLine}
                  />
                </AutoCompleteSelect>
              )}

              {typeHoliday === "J" && (
                <>
                  <label htmlFor="type" style={{width:"29.5%", marginLeft:"3%", marginTop:"auto", marginBottom:"auto"}}>
                    Código Processual
                    <select
                      name="Type"
                      value={typeCalculator}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeCalculator(e.target.value)}
                    >
                      <option value="0">Selecione...</option>
                      <option value="1">NOVO CPC</option>
                      <option value="2">CPP</option> 
                      <option value="3">CLT 2017</option>
                      <option value="4">CLT</option>
                      <option value="5">JEC - CÍVEL</option>
                      <option value="6">JEC - CRIMINAL</option>
                    </select> 
                  </label>

                  <MdHelp 
                    className='icons' 
                    title='Ao vincular um código processual a um recesso judicial somente os cálculos que irão utilizar este mesmo código será considerado para o calculo de dias.'
                    style={{minWidth: '20px', minHeight: '20px', marginLeft:"0.7%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
                  />
                </>
              )}
            </div>

            <div style={{display:"flex", marginTop:"1%"}}>
              <label htmlFor="type" style={{width:"29.5%"}}>
                Abrangência
                <select
                  name="Type"
                  value={typeLocal}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeLocal(e.target.value)}
                >
                  <option value="E">Estadual</option>
                  <option value="M">Municipal</option>
                  <option value="N">Nacional</option> 
                </select>
              </label>

              {typeLocal === "E" && (
                <AutoCompleteSelect className="selectFederalUnit" style={{width:"64%",marginLeft:"4.5%", marginTop:"auto", marginBottom:"auto"}}>
                  <p>Estado</p>  
                  <Select
                    isSearchable   
                    value={federalUnit.filter(options => options.id == federalUnitId)}
                    onChange={handleFederalUnitSelected}
                    onInputChange={(term) => setFederalUnitTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={federalUnit}
                  />
                </AutoCompleteSelect>
              )}

              {typeLocal === "M" && (
                <AutoCompleteSelect className="selectCities" style={{width:"64%",marginLeft:"4.5%", marginTop:"auto", marginBottom:"auto"}}>
                  <p>Cidade</p>  
                  <Select
                    isSearchable   
                    value={{ id: citiesId, label: citiesDesc }}  
                    // value={cities.filter(options => options.id == citiesId)}
                    onChange={handleCitiesSelected}
                    onInputChange={(term) => setCitiesTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={cities}
                  />
                </AutoCompleteSelect>
              )}

              {typeLocal === "N" &&(
                <div className='labelNacional' style={{marginTop:"3%", marginLeft:"5%"}}>Aplicável a todo território nacional</div>
              )}
            </div>

            <TextArea
              name=""
              value={holidayDescription}
              placeholder="Informações Complementares"
              onChange={handleNewDescription}
              style={{overflow:'auto'}}
            />

            <div style={{display:"flex", marginTop:"2%", marginLeft:"66%"}}>
              <div>
                <Flags style={{width:"100%"}}>
                  Registro com Data Fixa:
                </Flags>
              </div>

              <div>
                <input
                  type="checkbox"
                  name="select"
                  checked={isFixed}
                  onChange={() => setIsFixed(!isFixed)}
                  style={{minWidth:'15px', minHeight:'15px', marginLeft:"100%"}}
                />
              </div>

              <div style={{marginLeft:"8%", marginTop:"-1.1%"}}>
                <MdHelp 
                  className='icons' 
                  title='Os registros marcados como data fixa serão copiados automaticante para a mesma data do próximo ano.'
                  style={{minWidth: '20px', minHeight: '20px', color:"var(--blue-twitter)"}}
                />
              </div>
            </div>

            {allowDelete == true && (
              <TaskBar>
                <label htmlFor='file' className="buttonLinkClick" style={{position: "relative"}} title="Clique para selecionar arquivos em seu computador">
                  <FaFileAlt />
                  Anexar Arquivo
                  <input
                    ref={ref}
                    type="file"
                    multiple
                    style={{opacity: '0', position: "absolute", marginLeft: "-100%", width:"100%"}}
                    onChange={(e) => handleSaveFile(e)}
                  />
                </label>
              </TaskBar>
            )}
            
            <GridSubContainer style={{pointerEvents:(isDeletingFile?'none':'all')}}>
              <Grid
                rows={documentList}
                columns={columns}
              >
                <SortingState
                  defaultSorting={[{ columnName: 'dateUpload', direction: 'desc' }]}
                />
                <IntegratedSorting />
                <PagingState
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onCurrentPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
                <IntegratedPaging />
                <CustomPaging totalCount={totalRows} />
                <DateTypeProvider for={dateColumns} />
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableColumnExtensions}
                  messages={languageGridEmpty}
                />
                <TableHeaderRow showSortingControls />
                <PagingPanel
                  messages={languageGridPagination}
                />
              </Grid>
            </GridSubContainer>
            <br />

            {modalActiveId != 0 && (
              <section>
                <button disabled={appointmentBlockUpdate} type="button" id="log" onClick={handleLogOnDisplay}>
                  <IoIosPaper title="Ver Historico" />
                  <p>&nbsp;Ver Histórico</p>
                </button>
              </section>
            )}
            <br />

            <div style={{float:'right', marginRight:'12px', marginBottom:"5%"}}>
              {allowDelete == true && (
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> SaveHoliday(false)}
                    style={{width:'100px'}}
                  >
                    <FiSave />
                    Salvar 
                  </button>
                </div>
              )}
               
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleHolidayModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
            <br /><br />
          </div>
          <br /><br />
        </ModalHoliday>
      )}

      {isMOBILE && (
        <ModalHolidayMobile show={modalActive}>
          {showLog && <LogModal idAppointment={modalActiveId} handleCloseModalLog={handleCloseLog} /> }

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Feriado/Recesso Judicial
            <br /><br />
            
            <label htmlFor="descricao" style={{width:"65%"}}>
              Nome
              <br />
              <input 
                type="text"
                name="descricao"
                value={holidayName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setHolidayName(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />

            <div style={{display:"flex", width:"65%", marginTop:"4%"}}>
              <label htmlFor="type" style={{width:"95%"}}>
                Meio de Trâmitação
                <select
                  name="Type"
                  value={typeMatter}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeMatter(e.target.value)}
                >
                  <option value="A">Ambos</option>
                  <option value="E">Eletrônico</option>
                  <option value="F">Fisico</option>
                </select>
              </label>

              <MdHelp 
                className='icons' 
                title='Informe se este feriado ou recesso judicial é trâmitado por meios físicos e/ou eletrônicos. Esta definição será considerada no calculo de prazos processuais.'
                style={{minWidth: '20px', minHeight: '20px', marginLeft:"1%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
              />
            </div>

            <div style={{display:"flex", marginTop:"4%"}}>
              <div style={{display:"flex", width:"63.5%"}}>
                <label htmlFor="type" style={{width:"50%"}}>
                  Tipo
                  <br />
                  <select
                    name="Type"
                    value={typeHoliday}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeHoliday(e.target.value)}
                  >
                    <option value="N">Normal</option>
                    <option value="J">Judicial</option>
                  </select>
                </label>

                <MdHelp
                  className='icons' 
                  title='O lançamento normal é indicado para o cadastro de feriados comuns, aqueles com data específica como Pascoa, Natal etc. O tipo judicial possui data de início e fim e podem se utilizado em casos como: recessos, emendas de feriados dentre outros provimentos.'
                  style={{minWidth: '20px', minHeight: '20px', marginLeft:"1%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
                />

                <label htmlFor="data" style={{marginLeft:"2%", width:"50%"}}>
                  {typeHoliday === "N" && (
                    <p>Data</p>
                  )}
                  {typeHoliday === "J" && (
                    <p>Data Inicial</p>
                  )}
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                  />
                </label>
              </div>

              {typeHoliday === "J" && (
                <label htmlFor="dataFinal" style={{marginLeft:"2%", width:"32%"}}>
                  Data Final
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                  />
                </label>
              )}
            </div>
            
            <div style={{display:"flex", marginTop:"4%"}}>
              {typeHoliday === "J" && (
                <AutoCompleteSelect className="selectDeadLine" style={{width:"40%"}}>
                  <p>Tribunal</p>  
                  <Select
                    isSearchable   
                    value={deadLine.filter(options => options.id == deadLineId)}
                    onChange={handleDeadLineSelected}
                    onInputChange={(term) => setDeadLineTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={deadLine}
                  />
                </AutoCompleteSelect>
              )}

              {typeHoliday === "J" && (
                <>
                  <label htmlFor="type" style={{width:"40%", marginLeft:"3%", marginTop:"auto", marginBottom:"auto"}}>
                    Código Processual
                    <select
                      name="Type"
                      value={typeCalculator}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeCalculator(e.target.value)}
                    >
                      <option value="0">Selecione...</option>
                      <option value="1">NOVO CPC</option>
                      <option value="2">CPP</option> 
                      <option value="3">CLT 2017</option>
                      <option value="4">CLT</option>
                      <option value="5">JEC - CÍVEL</option>
                      <option value="6">JEC - CRIMINAL</option>
                    </select> 
                  </label>

                  <MdHelp 
                    className='icons' 
                    title='Ao vincular um código processual a um recesso judicial somente os cálculos que irão utilizar este mesmo código será considerado para o calculo de dias.'
                    style={{minWidth: '20px', minHeight: '20px', marginLeft:"0.7%", marginTop:"auto", marginBottom:"auto", color:"var(--blue-twitter)"}}
                  />
                </>
              )}
            </div>

            <div style={{display:"flex", marginTop:"4%"}}>
              <label htmlFor="type" style={{width:"29.5%"}}>
                Abrangência
                <select
                  name="Type"
                  value={typeLocal}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeLocal(e.target.value)}
                >
                  <option value="E">Estadual</option>
                  <option value="M">Municipal</option>
                  <option value="N">Nacional</option> 
                </select>
              </label>

              {typeLocal === "E" && (
                <AutoCompleteSelect className="selectFederalUnit" style={{width:"64%",marginLeft:"4.5%", marginTop:"auto", marginBottom:"auto"}}>
                  <p>Estado</p>  
                  <Select
                    isSearchable   
                    value={federalUnit.filter(options => options.id == federalUnitId)}
                    onChange={handleFederalUnitSelected}
                    onInputChange={(term) => setFederalUnitTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={federalUnit}
                  />
                </AutoCompleteSelect>
              )}

              {typeLocal === "M" && (
                <AutoCompleteSelect className="selectCities" style={{width:"64%",marginLeft:"4.5%", marginTop:"auto", marginBottom:"auto"}}>
                  <p>Cidade</p>  
                  <Select
                    isSearchable 
                    value={{ id: citiesId, label: citiesDesc }}  
                    // value={cities.filter(options => options.id == citiesId)}
                    onChange={handleCitiesSelected}
                    onInputChange={(term) => setCitiesTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}              
                    options={cities}
                  />
                </AutoCompleteSelect>
              )}

              {typeLocal === "N" && (
                <div className='labelNacional' style={{marginTop:"3%", marginLeft:"5%"}}>Aplicável a todo território nacional</div>
              )}
            </div>

            <TextArea
              name=""
              value={holidayDescription}
              placeholder="Informações Complementares"
              onChange={handleNewDescription}
              style={{overflow:'auto'}}
            />

            <div style={{display:"flex", marginTop:"4%", marginLeft:"40%"}}>
              <div>
                <Flags style={{width:"200%"}}>
                  Registro com Data Fixa:
                </Flags>
              </div>

              <div>
                <input
                  type="checkbox"
                  name="select"
                  checked={isFixed}
                  onChange={() => setIsFixed(!isFixed)}
                  style={{minWidth:'15px', minHeight:'15px', marginLeft:"40%"}}
                />
              </div>

              <div style={{marginLeft:"8%", marginTop:"-1.1%"}}>
                <MdHelp 
                  className='icons' 
                  title='Os registros marcados como data fixa serão copiados automaticante para a mesma data do próximo ano.'
                  style={{minWidth: '20px', minHeight: '20px', color:"var(--blue-twitter)"}}
                />
              </div>
            </div>

            {allowDelete == true && (
              <TaskBar>
                <label htmlFor='file' className="buttonLinkClick" style={{position: "relative", width:"40%"}} title="Clique para selecionar arquivos em seu computador">
                  <FaFileAlt />
                  Anexar Arquivo
                  <input
                    ref={ref}
                    type="file"
                    multiple
                    style={{opacity: '0', position: "absolute", marginLeft: "-100%", width:"100%"}}
                    onChange={(e) => handleSaveFile(e)}
                  />
                </label>
              </TaskBar>
            )}
            
            <GridSubContainer style={{pointerEvents:(isDeletingFile?'none':'all')}}>
              <Grid
                rows={documentList}
                columns={columns}
              >
                <SortingState
                  defaultSorting={[{ columnName: 'dateUpload', direction: 'desc' }]}
                />
                <IntegratedSorting />
                <PagingState
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onCurrentPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
                <IntegratedPaging />
                <CustomPaging totalCount={totalRows} />
                <DateTypeProvider for={dateColumns} />
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableMobileColumnExtensions}
                  messages={languageGridEmpty}
                />
                <TableHeaderRow showSortingControls />
                <PagingPanel
                  messages={languageGridPagination}
                />
              </Grid>
            </GridSubContainer>
            <br />

            {holidayId != 0 && (
              <section>
                <button disabled={appointmentBlockUpdate} type="button" id="log" onClick={handleLogOnDisplay}>
                  <IoIosPaper title="Ver Historico" />
                  <p>&nbsp;Ver Histórico</p>
                </button>
              </section>
            )}
            <br />

            <div style={{float:'right', marginRight:'12px', marginBottom:"5%"}}>
              {allowDelete == true && (
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> SaveHoliday(false)}
                    style={{width:'100px'}}
                  >
                    <FiSave />
                    Salvar 
                  </button>
                </div>
              )}
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleHolidayModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
            <br /><br />
          </div>

          <br /><br />
        </ModalHolidayMobile>
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

      {/* warning uploading file */}
      {(uploadingStatus != 'none') && (
        <>
          <OverlayUpload />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Carregando Arquivos...
          </div>
        </>
      )}

      {/* warning uploading file */}
      {(isDeletingFile) && (
        <>
          <OverlayUpload />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Deletando Arquivo...
          </div>
        </>
      )}

      {checkMessage && (
        <ConfirmBoxModal
          useCheckBoxConfirm
          buttonCancelText="Cancelar"
          buttonOkText="Confirmar"
          message="A diferença entre a Data Inicial e a Data Final é superior a 2 dias. <p>Deseja prosseguir com a criação do feriado ?</p>"
          haveLink
        />
      )}

      {(modalActive) && <OverlayModal /> }
    </>
  )
}

export default HolidayEdit;