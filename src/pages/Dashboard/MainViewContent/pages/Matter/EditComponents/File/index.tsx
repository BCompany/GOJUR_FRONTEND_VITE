/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { format } from 'date-fns'
import { FaFileAlt } from 'react-icons/fa';
import { FiTrash, FiDownloadCloud } from 'react-icons/fi';
import { ImCloudUpload } from 'react-icons/im';
import { FaFilePdf } from 'react-icons/fa';
import { SiMicrosoftexcel } from 'react-icons/si';
import { BsImage } from 'react-icons/bs';
import { GiShare } from 'react-icons/gi';
import { HiDocumentText } from 'react-icons/hi'
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { AmazonPost, FormatFileName } from 'Shared/utils/commonFunctions';
import { Grid, Table, TableHeaderRow, PagingPanel,  } from '@devexpress/dx-react-grid-material-ui';
import { CustomPaging, DataTypeProvider, IntegratedPaging, IntegratedSorting, PagingState, SortingState } from '@devexpress/dx-react-grid';
import { GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { languageGridPagination, languageGridEmpty } from 'Shared/utils/commonConfig';
import { useLocation } from 'react-router-dom';
import { Container, DropArea, TaskBar, TotalRegisters } from './styles';
import { IMatterUploadFile } from '../../Interfaces/IMatter';
import { CreateFileUpload, DeleteFile, DownloadFile, ListMatterFiles, ShareFile, ValidateFileUpload } from '../Services/MatterUploadData';

interface FileProps {
  matterId: number;
  sharedFile: boolean,
  load: boolean
  fromModal: string;
}

export default function File({matterId, load, sharedFile, fromModal}: FileProps) {

  const { addToast } = useToast();
  const [uploadingStatus, setUploadingStatus] = useState<string>('none');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { pathname } = useLocation();
  const dropFilesAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
  const [documentList, setDocumentList] = useState<IMatterUploadFile[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([10, 50, 100, 0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [tokenContinuation, setTokenContinuation] = useState<string | null>('');
  const token = localStorage.getItem('@GoJur:token');
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const userType = localStorage.getItem('@GoJur:tpoUser')
  const isLawyerView = pathname == "/customerLawyer"
  const locationType = pathname.substr(13).split('/')[0]
  const ref = useRef<any>(null);


  // first initialization
  useEffect(() => {
    if (load && isLoading){
      LoadDocuments();
    }
  }, [load, isLoading])


  const LoadDocuments = useCallback(async (reloadList = false) => {
    try
    {
      const response = await ListMatterFiles(
        matterId,
        reloadList ? 10: pageSize,
        sharedFile,
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
  }, [matterId, pageSize, tokenContinuation])


  useLayoutEffect(() => {
    if (!isLoading)
      DragDropEvents()
  }, [isLoading])


  const DragDropEvents = () => {
    if (dropFilesAreaRef.current) {
      dropFilesAreaRef.current.addEventListener('dragover',   handleDragOver);
      dropFilesAreaRef.current.addEventListener('drop',       handleDrop);
      dropFilesAreaRef.current.addEventListener('dragenter',  handleDragEnter);
      dropFilesAreaRef.current.addEventListener('dragleave',  handleDragLeave);
    }
  }


  // DRAG EVENTS
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };


  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    if (e.type === 'drop') {
      const {files} = e.dataTransfer
      UploadFiles(files)
    }
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


  const UploadFiles = useCallback(async (files: any[]) => {
    try
    {
      const request:any[] = []

      if ((matterId??0) == 0){
        addToast({type: "info", title: "Operação NÃO realizada", description:  'É necessário salvar o processo antes de gravar o pedido'})

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
            referenceId: matterId,
            fileName,
            fileSize: files[index].size,
            sharedFile,
            originFile: sharedFile? "C": "E",
            token
          });
        }
      }

      const hasError = errorList.length > 0;

      if (!hasError) {
        try
        {
          // save all files as pending in lot mode
          const response = await CreateFileUpload(request)

          // get document ids for all pending files to verify after and save
          const documentIds: number[] = [];
          response.data.map((item) => { return documentIds.push(item.id) })
          setFilesUploadIds(documentIds)
          setIsDragging(false);

          // if everythings ok with pending save files save now each file in amazon
          const promisses: any[] = [];
          if (response.status == 200){

            for (let index = 0; index < files.length; index++) {
              promisses.push(AmazonPost(matterId, files[index],"/Proc_"))
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
          setIsLoading(true)
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
      setUploadingStatus('none')
      setIsDragging(false)
    }
  }, [addToast, matterId, token])


  const handleValidateFiles = async () => {
    try
    {
      const request: any[] = [];

      filesUploadIds.map((item) => {
        return request.push({ id: item, token  })
      })

      await ValidateFileUpload(request)

      addToast({type: "success", title: "Upload efetuado com sucesso", description: `Upload de ${ filesUploadIds.length } arquivos efetuados com sucesso`})

      await LoadDocuments()
      setUploadingStatus('none')
      setFilesUploadIds([])
    }
    catch(e){
      setIsLoading(true)
      setIsDragging(false)
    }
  }


  const handleDownloadFile = async (fileId: any) => {
    const document = documentList.find(doc => doc.id === fileId);

    if (document)
    {
      const response = await DownloadFile({
        referenceId:matterId,
        fileName:document.fileName,
        fileNameAmazon:  document.fileNameAmazon,
        token
      })

      window.open(response.data, '_blank')
      return false;
    }
  }


  const handleShareFile = async(fileId: number) => {
    try
    {
      await ShareFile(fileId);

      addToast({type: "success", title: "Operação realizada com sucesso", description:  'As definições de compartilhamento do arquivo com o cliente foram executadas com sucesso'})
      await LoadDocuments(true);
    }
    catch(ex){
      console.log(ex)
    }
  }


  const handleDeleteFile = async (fileName: string) => {
    try{
      setIsDeletingFile(true)

      const response = await DeleteFile({
        matterId,
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
    catch(ex:any){
      addToast({type: "info", title: "Operação NÃO realizada", description:  ex.response.data.Message})
      setIsDeletingFile(false)
    }
  }


  const handleClick = (props: any) => {
    // call download function
    if (props.column.name === 'download' || props.column.name === ''){
      handleDownloadFile(props.row.id)
    }

    // call delete function
    if (props.column.name === 'delete'){
      handleDeleteFile(props.row.fileName)
    }

    if (props.column.name === 'share'){
      handleShareFile(props.row.id)
    }
  }


  const [dateColumns] = useState(['dateUpload']);
  const columns = [
    { name: '',               title: ''  },
    { name: 'fileName',       title: 'Arquivo' },
    { name: 'dateUpload',     title: 'Data' },
    { name: 'fileSize',       title: 'Tamanho KB' },
    { name: 'userIncludeName',title: 'Incluído por' },
    { name: 'userUpdateName', title: 'Alterado por' },
    { name: 'download',       title: 'Download'  },
    { name: 'share',          title: 'Compartilhar'  },
    { name: 'delete',         title: 'Deletar' }
  ];


  const columnsLawyerView = [
    { name: '',               title: ''  },
    { name: 'fileName',       title: 'Arquivo' },
    { name: 'dateUpload',     title: 'Data' },
    { name: 'fileSize',       title: 'Tamanho KB' },
    { name: 'userIncludeName',title: 'Incluído por' },
    { name: 'userUpdateName', title: 'Alterado por' },
    { name: 'download',       title: 'Download'  }
  ];


  const [tableColumnExtensions] = useState([
    { columnName: '',               width: '5%' },
    { columnName: 'fileName',       width: '20%' },
    { columnName: 'dateUpload',     width: '10%' },
    { columnName: 'fileSize',       width: '10%' },
    { columnName: 'userIncludeName',width: '10%' },
    { columnName: 'userUpdateName', width: '10%' },
    { columnName: 'btnDownload',    width: '12%' },
    { columnName: 'btnShare',       width: '12%' },
    { columnName: 'btnDelete',      width: '12%' }
  ]);


  const [tableColumnExtensionsLawyerView] = useState([
    { columnName: '',               width: '5%' },
    { columnName: 'fileName',       width: '30%' },
    { columnName: 'dateUpload',     width: '10%' },
    { columnName: 'fileSize',       width: '10%' },
    { columnName: 'userIncludeName',width: '15%' },
    { columnName: 'userUpdateName', width: '15%' },
    { columnName: 'btnDownload',    width: '10%' }
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

    if (column.title === 'Compartilhar') {
      if (isLawyerView) return null;    // when is lawyer customer view don't show delete button

      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          {props.row.sharedFile == "N" && <GiShare title="Clique para fazer compartilhar este arquivo com o cliente" /> }
          {props.row.sharedFile == "S" && <GiShare style={{color:'green'}} title="Clique para desfazer o compartilhamento com  o cliente" /> }
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

    // For LegalFollowGrid
    // if (column.title === 'Deletar' && locationType == 'legal' && accessCode?.includes('MATLEVDE') || accessCode === 'adm') {
      if (column.title === 'Deletar') {
        if (accessCode === 'adm' || (locationType == 'legal' && accessCode?.includes('MATLEVDE')) || (fromModal == 'legal' && accessCode?.includes('MATLEVDE')))
        {
          if (isLawyerView) return null;    // when is lawyer customer view don't show delete button

          return (
            <Table.Cell onClick={(e) => handleClick(props)} {...props}>
              <FiTrash title="Clique para remover o arquivo" />
            </Table.Cell>
          );
        }
    }

    // For AdvisoryFollowGrid
    // if (column.title === 'Deletar' && locationType == 'advisory' && accessCode?.includes('MATCEVDE') || accessCode === 'adm') {
    if (column.title === 'Deletar') {
      if (accessCode === 'adm' || (locationType == 'advisory' && accessCode?.includes('MATCEVDE')) || (fromModal == 'advisory' && accessCode?.includes('MATCEVDE'))) {
        if (isLawyerView) return null;    // when is lawyer customer view don't show delete button

        return (
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            <FiTrash title="Clique para remover o arquivo" />
          </Table.Cell>
        );
      }
    }

    return <Table.Cell {...props} />;
  };


  if (isLoading) {
    return (
      <Container>
        <div className="waiting">
          <LoaderWaiting size={30} color="var(--blue-twitter)" />
        </div>
      </Container>
    )
  }


  return (
    <>
      &nbsp;
      {' '}
      {/* Verify if user has permission for upload files or is a customer of laywer */}
      {(accessCode?.includes('MATCONS') || accessCode?.includes('MATLEGAL') || accessCode === 'adm' || userType == 'C') && (
        <>
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
        </>
      )}


      {/* drop area drag in drop files */}
      {(accessCode?.includes('MATCONS') || accessCode?.includes('MATLEGAL') || accessCode === 'adm' || userType == 'C') && (
        <DropArea
          style={{backgroundColor: ((isDragging)?'var(--gray-outline)':'')}}
          ref={dropFilesAreaRef}
        >
          <ImCloudUpload />
          <span>ARRASTE AQUI OS SEUS ARQUIVOS</span>
        </DropArea>
      )}

      <GridSubContainer style={{pointerEvents:(isDeletingFile?'none':'all')}}>

        <Grid
          rows={documentList}
          columns={(isLawyerView? columnsLawyerView: columns)}
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
            columnExtensions={(isLawyerView? tableColumnExtensionsLawyerView: tableColumnExtensions)}
            messages={languageGridEmpty}
          />
          <TableHeaderRow showSortingControls />
          <PagingPanel
            messages={languageGridPagination}
            pageSizes={pageSizes}
          />
        </Grid>

      </GridSubContainer>

      <br />

      {/* warning uploading file */}
      {(uploadingStatus != 'none') && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Aguarde...
          </div>
        </>
      )}

      {/* warning uploading file */}
      {(isDeletingFile) && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Aguarde...
          </div>
        </>
      )}


    </>
  )
}
