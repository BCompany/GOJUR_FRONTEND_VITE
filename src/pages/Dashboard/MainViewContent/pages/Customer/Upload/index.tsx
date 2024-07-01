/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns'
import { FaFileAlt } from 'react-icons/fa';
import { FiTrash, FiDownloadCloud } from 'react-icons/fi';
import { ImCloudUpload } from 'react-icons/im';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Loader from 'react-spinners/PulseLoader';
import api from 'services/api';
import { useToast } from 'context/toast';
import { useLocation } from 'react-router-dom';
import { AmazonPost, FormatFileName } from 'Shared/utils/commonFunctions';
import { Grid, Table, TableHeaderRow, PagingPanel,  } from '@devexpress/dx-react-grid-material-ui';
import { DataTypeProvider, IntegratedPaging, IntegratedSorting, PagingState, SortingState } from '@devexpress/dx-react-grid';
import { GridContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { languageGridPagination, languageGridEmpty } from 'Shared/utils/commonConfig';
import { DropArea, TaskBar, TotalRegisters } from './styles';
import { DocumentCustomerData } from '../Interfaces/IDocument';

export default function UploadList() {
  const { addToast } = useToast();
  const { pathname  } = useLocation();
  const [uploadingStatus, setUploadingStatus] = useState<string>('none');
  const [isDragging, setIsDragging] = useState<boolean>();
  const dropFilesAreaRef = useRef<HTMLDivElement>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
  const [documentList, setDocumentList] = useState<DocumentCustomerData[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([10, 50, 100, 0]);
  const tokenapi = localStorage.getItem('@GoJur:token');
  const ref = useRef<any>(null);
  let customerId = Number(pathname.substr(15))


  // first initialization
  useEffect(() => {
   LoadDocuments()
   DragDropEvents()
  }, [])


  const LoadDocuments = async () => {
   // when is a redirect route, get from localsotrage customer id because in query string url has writeen "redirect string" instead of customer id
    if (Number.isNaN(customerId)){
      customerId = GetCustomerIdByFilterStorage();
    }

    const parameters = {
      referenceId: customerId,
      token: tokenapi
    }

    const response = await api.post<DocumentCustomerData[]>('/Clientes/ListarArquivos', parameters)

    setDocumentList(response.data)

    if (response.data.length > 0) {
      setTotalRows(response.data[0].Count)
    }

    setIsDeletingFile(false)
    setUploadingStatus('none')
  }


  const DragDropEvents = () => {
    if (dropFilesAreaRef.current){
      dropFilesAreaRef.current.addEventListener('dragover', handleDragOver);
      dropFilesAreaRef.current.addEventListener('drop', handleDrop);
      dropFilesAreaRef.current.addEventListener('dragenter', handleDragEnter);
      dropFilesAreaRef.current.addEventListener('dragleave', handleDragLeave);
    }
  }


  // DRAG EVENTS
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const {files} = e.dataTransfer
    UploadFiles(files)
  }


  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };


  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };


  const handleSaveFile = (event: any) => {
    const {files} = event.target;
    UploadFiles(files)
  }


  // When just finish uploads call validation files
  useEffect(() => {
    if (uploadingStatus  === 'conclude') {
      handleValidateFiles(); 
    }
  }, [uploadingStatus])


  const GetCustomerIdByFilterStorage = () => {
    const filterStorage = localStorage.getItem('@GoJur:CustomerFilter')

    let customerId = 0;
    if (filterStorage){
      const filterJSON = JSON.parse(filterStorage)
      customerId = filterJSON.customerId;
    }

    return customerId;
  }


  const UploadFiles = async (files: any[]) => {
    try
    {
      const request:any[] = []

      // if doesn't exists customer id try to get from local stores
      // this case can be happen when user upload files by drag in drop and the react can't get values from state
      if (customerId == undefined) {
        customerId = Number(pathname.substr(10))
      }

      if (Number.isNaN(customerId)){
        customerId = GetCustomerIdByFilterStorage();
      }

      if (customerId == 0 || customerId == undefined || Number.isNaN(customerId)) {
        addToast({type: "info", title: "Operação não realizada", description: `É necessário que o cliente seja salvo no Gojur antes de vincular novos documentos a ele`})
        setIsDragging(false)
        return false;
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
            referenceId: customerId,
            fileName,
            fileSize: files[index].size,
            token: tokenapi
          });
        }
      }

      const hasError = errorList.length > 0;

      if (!hasError) {

        try
        {            
          // save all files as pending in lot mode
          const response = await api.post<DocumentCustomerData[]>('/Clientes/CriarArquivoPendente', request);

          // get document ids for all pending files to verify after and save
          const documentIds: number[] = [];
          response.data.map((item) => { return documentIds.push(item.id) })
          setFilesUploadIds(documentIds)
          setIsDragging(false);

          // if everythings ok with pending save files save now each file in amazon
          const promisses: any[] = [];
          if (response.status == 200){

            for (let index = 0; index < files.length; index++) {
              promisses.push(AmazonPost(customerId, files[index],"/Clientes/Cli_"))
            }

            // when conclude set upload status as 'conclude' so now whe can, by use effect call endpoint to validate all files
            Promise.all(promisses).then(() => {
              setUploadingStatus('conclude')
            })
          }
        }
        catch(err:any)
        {
          setIsDragging(false)
          setUploadingStatus('none')

          addToast({type: "info", title: "Operação não realizada", description: err.response.data})
        }
      }
      else{
        setIsDragging(false)
        setUploadingStatus('none')

        addToast({type: "info", title: "Operação não realizada", description: `O(s) arquivo(s) ${ errorList } excedem o tamanho máximo de 10MB, remova-os e tente novamente`})
      }

      ref.current.value = "";
    }
    catch(e){
      console.log(e)
      setUploadingStatus('none')
      setIsDragging(false)
    }
  }


  const handleValidateFiles = async () => {
    try
    {
      const request: any[] = [];

      filesUploadIds.map((item) => {
        return request.push({ id: item, token: tokenapi  })
      })

      // call validation files
      const response = await api.post<DocumentCustomerData[]>('/Clientes/ValidarArquivo', request);

      addToast({type: "success", title: "Upload efetuado com sucesso", description: `Upload de ${ filesUploadIds.length } arquivos efetuados com sucesso`})

      const documentListData: DocumentCustomerData[] = [];

      response.data.map((item) => {
        const existsFileName = documentList.find(doc => doc.fileName.toLowerCase() == item.fileName.toLowerCase())

        if (existsFileName == undefined){
          documentListData.push({
            id: 0,
            fileName: item.fileName.toLowerCase(),
            dateUpload: item.dateUpload,
            customerId,
            tokenPagination: "",
            Count: totalRows + 1
          })
        }

        return documentListData
      })

      const documentData = [...documentListData, ...documentList]
      setDocumentList(documentData)
      setTotalRows(totalRows+documentListData.length)
      setUploadingStatus('none')
      setFilesUploadIds([])
      LoadDocuments()
    }
    catch(e){
      console.log(e)
      setIsDragging(false)
    }
  }


  const handleDownloadFile = async (fileName: any) => {
    // when is a redirect route, get from localsotrage customer id because in query string url has writeen "redirect string" instead of customer id
    if (Number.isNaN(customerId)){
      customerId = GetCustomerIdByFilterStorage();
    }

    const response = await api.post('/Clientes/DownloadFile', {
      referenceId:customerId,
      fileName: fileName.toLowerCase(),
      token: tokenapi
    })

    window.open(response.data, '_blank')

    return false;
  }


  const handleDeleteFile = async (fileName: string) => {
    try
    {
      setIsDeletingFile(true)
      setCurrentFileName(fileName)
      setUploadingStatus('executing')

      // when is a redirect route, get from localsotrage customer id because in query string url has writeen "redirect string" instead of customer id
      if (Number.isNaN(customerId)){
        customerId = GetCustomerIdByFilterStorage();
      }

      const response = await api.delete('/Clientes/DeletarArquivo', {
        params:{referenceId:customerId, fileName: fileName.toLowerCase(), token: tokenapi}
      })

      // if something wront happen on server side response.data = false and we don't make anything on front end
      if (response.data)
      {
        const listDocumentRefresh = documentList.filter(doc => doc.fileName.toLowerCase() !== fileName.toLowerCase());
        setDocumentList(listDocumentRefresh)
        setIsDeletingFile(false)
        setCurrentFileName('')
        setTotalRows(totalRows-1)
        setUploadingStatus('none')
      }
      else{
        setIsDeletingFile(false)
        setUploadingStatus('none')
      }
    }
    catch(err:any)
    {
      setIsDeletingFile(false)
      setUploadingStatus('none')

      addToast({type: "info", title: "Operação NÃO realizada", description:"Houve uma falha na exclusão do documento"})
    }
  }


  const handleClick = (props: any) => {
  // call download function
    if (props.column.name === 'download'){
      handleDownloadFile(props.row.fileName)
    }

    // call delete function
    if (props.column.name === 'delete'){
      handleDeleteFile(props.row.fileName)
    }
  }


  const [dateColumns] = useState(['dateUpload']);
  const columns = [
    { name: 'fileName',     title: 'Arquivo' },
    { name: 'dateUpload',   title: 'Data do Upload' },
    { name: 'download',     title: 'Download'  },
    { name: 'delete',       title: 'Deletar' }
  ];


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

    if (column.title === 'Deletar') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiTrash title="Clique para remover o arquivo" /> 
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  const [tableColumnExtensions] = useState([
    { columnName: 'fileName',     width: '50%' },
    { columnName: 'dateUpload',   width: '20%' },
    { columnName: 'btnDownload',  width: '15%' },
    { columnName: 'btnDelete',    width: '15%' }
  ]);

  
  return (
    <>
      {/* warning uploading file */}
      {(uploadingStatus != 'none') && (
      <>
        <Overlay />
        <div className='waitingMessage'>
          <LoaderWaiting size={10} color="var(--blue-twitter)" />
          &nbsp;&nbsp;
          Aguarde...
        </div>
      </>
      )} 
      
      &nbsp;
      {' '}
      <TaskBar>
        <label className="buttonLinkClick" style={{ padding:"0.7rem"}} title="Clique para selecionar arquivos em seu computador">
          <FaFileAlt />
          Anexar Arquivo
          <input
            ref={ref}
            type="file"
            multiple
            style={{display: 'none'}}
            onChange={(e) => handleSaveFile(e)}
          />
        </label>
      </TaskBar>

      <TotalRegisters>
        Total de registros:
        {' '}
        {totalRows}
      </TotalRegisters>

      {/* drop area drag in drop files */}
      <DropArea style={{backgroundColor: ((isDragging)?'var(--gray-outline)':'')}} ref={dropFilesAreaRef}>
        <ImCloudUpload />
        <span>ARRASTE AQUI OS SEUS ARQUIVOS</span>
      </DropArea>

      <GridContainer style={{pointerEvents:(isDeletingFile?'none':'all')}}>
        <Grid
          rows={documentList}
          columns={columns}
        >
          <SortingState
            defaultSorting={[{ columnName: 'dateUpload', direction: 'desc' }]}
          />
          <IntegratedSorting />
          <PagingState
            defaultCurrentPage={0}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
          <IntegratedPaging />
          <DateTypeProvider for={dateColumns} />
          <Table
            cellComponent={CustomCell}
            columnExtensions={tableColumnExtensions}
            messages={languageGridEmpty}
          />
          <TableHeaderRow showSortingControls />
          <PagingPanel
            messages={languageGridPagination}
            pageSizes={pageSizes}
          />
        </Grid>
      </GridContainer>

      {uploadingStatus != 'none' && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <Loader size={8} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </>
  )
}
