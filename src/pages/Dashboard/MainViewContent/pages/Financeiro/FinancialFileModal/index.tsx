/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useState, ChangeEvent, useEffect, useRef } from 'react';
import api from 'services/api';
import Select from 'react-select';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { BsImage } from 'react-icons/bs';
import { FaRegTimesCircle, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import { FiTrash, FiDownloadCloud } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useDevice } from "react-use-device";
import { format } from 'date-fns';
import { useToast } from 'context/toast';
import { useDelay, currencyConfig, selectStyles, FormatCurrency, FormatFileName, AmazonPost } from 'Shared/utils/commonFunctions';
import { languageGridEmpty} from 'Shared/utils/commonConfig';
import { languageGridPagination } from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { IMovementUploadFile } from '../Interfaces/IFinancial';
import { FileModal, FileModalMobile, GridSubContainer, OverlayFinancial } from './styles';

interface SelectData {
  id: string;
  label: string;
}

const FinancialFileModal =  (props) => {
  const {handleCloseMatterFileModal, dealDetailId, parcelaAtual} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm');
  const DateTypeProvider = props => (<DataTypeProvider formatterComponent={DateFormatter} {...props} />)
  const { addToast } = useToast();
  const [open, setOpen] = useState<boolean>(true)
  const { isMOBILE } = useDevice();
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [documentList, setDocumentList] = useState<IMovementUploadFile[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [dateColumns] = useState(['dateUpload']);
  const [tokenContinuation, setTokenContinuation] = useState<string | null>('');
  const [uploadingStatus, setUploadingStatus] = useState<string>('none');
  const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movementId, setMovementId] = useState('');
  const [installmentId, setInstallmentId] = useState('');
  const [isLoadInstallment, setIsLoadInstallment] = useState<boolean>(false);
  const [parcelas , setParcelas] = useState<SelectData[]>([]); // grupo de clientes
  const [installmentLabel, setInstallmentLabel] = useState('');
  const ref = useRef<any>(null);
  

  const columns = [
    { name: '',                 title: ''  },
    { name: 'fileName',         title: 'Arquivo' },
    { name: 'installmentIdNum', title: 'Parcela' },
    { name: 'dateUpload',       title: 'Data' },
    { name: 'download',         title: 'Download'  },
    { name: 'delete',           title: 'Excluir' }
  ]

  const [tableColumnExtensions] = useState([
    { columnName: '',                 width: '8%' },
    { columnName: 'fileName',         width: '30%' },
    { columnName: 'installmentIdNum', width: '10%' },
    { columnName: 'dateUpload',       width: '20%' },
    { columnName: 'btnDownload',      width: '8%' },
    { columnName: 'btnDelete',        width: '8%' }
  ])


  useEffect(() => {
    setIsLoading(true)
    setInstallmentLabel(parcelaAtual)
    LoadInstallments(dealDetailId);
    LoadMovementId(dealDetailId, parcelaAtual);
    LoadDocuments()
  }, [])


  useEffect(() => {
    if (uploadingStatus  === 'conclude') {
      handleValidateFiles();
    }
  }, [uploadingStatus])


  const LoadMovementId = async(dealDetailId:string, installmentId:string) => {
    try
    {
      const response = await api.get('/Financeiro/ListarMovimentoPorAcordoDetalheParcela', {
        params:{ token, dealDetailId, installmentId }
      })
  
      setInstallmentLabel(installmentId)
      setMovementId(response.data);
      LoadInstallments(dealDetailId);
    }
    catch(ex:any){
      console.log(ex);
    }
  }


  const LoadInstallments = async(dealDetailId: string) => {
    try
    {
      const response = await api.get('/Financeiro/ListarParcelasPorAcordoDetalhe', {
        params:{ token, dealDetailId }
      })

      const parcelas: SelectData[] = [];

      response.data.map(item => {
        parcelas.push({ label: item, id: item })

        return parcelas;
      })

      setParcelas(parcelas)
      setIsLoadInstallment(true);
    }
    catch(ex:any){
      console.log(ex);
    }
  }


  const handleValidateFiles = async () => {
    try
    {
      const request: any[] = [];

      filesUploadIds.map((item) => {
        return request.push({ id: item, token  })
      })

      await ValidateFileUpload(request)

      addToast({ type: "success", title: "Upload efetuado com sucesso", description: `Upload de ${ filesUploadIds.length } arquivos efetuados com sucesso` })

      LoadDocuments()
      setUploadingStatus('none')
      setFilesUploadIds([])
    }
    catch(e){
      console.log(e)
      setIsLoading(false)
    }
  }


  const ValidateFileUpload = async(request: any) => {
    const response = api.post<IMovementUploadFile[]>('/MovimentoArquivos/ValidarArquivo', request);
    return response;
  }


  const LoadDocuments = useCallback(async (reloadList = false) => {
    try
    {
      const response = await ListMovementFiles(Number(dealDetailId), reloadList ? 10: pageSize, reloadList ? null: tokenContinuation)
      setDocumentList(response.data)

      if (response.data.length > 0)
      {
        setTotalRows(response.data[0].Count)
        setTokenContinuation(response.data[0].tokenPagination)
      }
      else
      {
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
  },[dealDetailId, movementId, pageSize, tokenContinuation])


  const ListMovementFiles = async(dealDetailId: number, rows:number, tokenPaginationAmazon: string|null) => {
    const response = await api.post<IMovementUploadFile[]>('/MovimentoArquivos/ListarArquivosPorAcordo', {
      dealDetailId, rows, tokenPaginationAmazon, token
    })

    return response;
  }


  const CustomCell = (props) => {
    const { column } = props;

    console.log(props.row)

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

    if (column.title === 'Excluir') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiTrash title="Clique para remover o arquivo" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }


  const handleClick = (props: any) => {
    if (props.column.name === 'download' || props.column.name === '')
      handleDownloadFile(props.row.movementIdNum, props.row.fileName)

    if (props.column.name === 'delete')
      handleDeleteFile(props.row.movementIdNum, props.row.fileName)
  }


  const handleDownloadFile = async (movementIdNum:string, fileName: any) => {
    setIsLoading(true)
    const document = documentList.find(doc => doc.fileName === fileName);
    if (document)
    {
      const response = await DownloadFile({
        referenceId: movementIdNum,
        fileName:document.fileName,
        fileNameAmazon:  document.fileNameAmazon,
        token
      })

      window.open(response.data, 'blank')
      await LoadDocuments()

      return false;
    }
  }


  const DownloadFile = async(request: any) => {
    const response =  api.post('/MovimentoArquivos/DownloadFile', request)
    return response;
  }


  const handleDeleteFile = async (movementIdNum:string, fileName: string) => {
    try{
      setIsLoading(true)
      setIsDeletingFile(true)

      const response = await DeleteFile({
        movementId: movementIdNum,
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
      }else{
        setIsDeletingFile(false)
      }
    }
    catch(ex:any){
      addToast({ type: "info", title: "Operação NÃO realizada", description: ex.response.data.Message })
      setIsDeletingFile(false)
    }
  }


  const DeleteFile = async(request: any) => {
    const token = localStorage.getItem('@GoJur:token');

    const response = api.delete('/MovimentoArquivos/Deletar', {
      params:{ referenceId: request.movementId, fileName: request.fileName.toLowerCase(), token }
    })
    return response;
  }


  const handleSaveFile = (event: any) => {
    setIsLoading(true)
    const {files} = event.target;
    UploadFiles(files)
  }


  const UploadFiles = useCallback(async (files: any[]) => {
    try
    {
      const request:any[] = []

      if (movementId == '0') {
        addToast({ type: "info", title: "Operação NÃO realizada", description: `É necessário salvar o movimento antes de gravar o documento` })
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
            referenceId: movementId,
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
                promisses.push(AmazonPost(Number(movementId), files[index],"/Movimentos/Movimento_"))
              }

              // when conclude set upload status as 'conclude' so now whe can, by use effect call endpoint to validate all files
              Promise.all(promisses).then(() => {
                setUploadingStatus('conclude')
              })
            }
        }
        catch(err:any)
        {
          setUploadingStatus('none')
          setIsLoading(false)
          addToast({type: "info", title: "Operação não realizada", description: err.response.data})
        }
      }
      else{
        setUploadingStatus('none')
        setIsLoading(false)
        addToast({type: "info", title: "Operação não realizada", description: `O(s) arquivo(s) ${ errorList } excedem o tamanho máximo de 10MB, remova-os e tente novamente`})
      }

      ref.current.value = "";
    }
    catch(e){
      console.log(e)
      setUploadingStatus('none')
    }
  }, [addToast, movementId, token])


  const CraeteFileUpload = async(request: any) => {
    const response = api.post<IMovementUploadFile[]>('/MovimentoArquivos/CriarArquivoPendente', request)
    return response;
  }


  return (
    <>    
      {!isMOBILE && ( 
      <FileModal show>    
        <div className='header'>
          <p className='headerLabel'>Documentos</p>
        </div>
        <br />

        {isLoadInstallment && (
          <div style={{width:'30%', float:'left', marginLeft:'5%'}}>
            <label htmlFor="parcela">
              Parcela que deseja anexar o arquivo
              <Select
                autoComplete="off"
                styles={selectStyles}
                value={{ id: installmentLabel, label: installmentLabel }}
                onChange={(item) => LoadMovementId(dealDetailId, item ? item.id : '')}
                options={parcelas}
              />
            </label>
          </div>
        )}

        <div style={{float:'right', marginRight:'5%', marginTop:'25px'}}>
          <label htmlFor='file' className="buttonLinkClick" style={{position: "relative"}} title="Clique para selecionar arquivos em seu computador">
            <FaFileAlt />
            Anexar Arquivo
            <input
              ref={ref}
              type="file"
              multiple
              style={{opacity: '0', position: "absolute", marginLeft: "-100%", width:"100%", height:"35px", cursor:"pointer"}}
              onChange={(e) => handleSaveFile(e)}
            />
          </label>
        </div>
        <br /><br /><br />

        <GridSubContainer id='GRID' style={{pointerEvents:(isDeletingFile?'none':'all')}}>
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
        <br /><br /><br /><br />
      
        <div className='footer'>
          <br /><br />
          <div style={{marginTop:"1%", float:"right", marginRight:"3%"}}>            
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleCloseMatterFileModal()}
                style={{width:'100px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
              <br /><br />
            </div>
          </div>
        </div>
      </FileModal>      
      )}

      {isMOBILE && ( 
      <FileModalMobile show>    
        <div className='header'>
          <p className='headerLabel'>Documentos</p>
        </div>

        {isLoadInstallment && (
          <div style={{marginRight:"2%", marginLeft:"2%", marginTop:"2%"}}>
            <label htmlFor="parcela">
              Parcela que deseja anexar o arquivo
              <Select
                autoComplete="off"
                styles={selectStyles}
                value={{ id: installmentLabel, label: installmentLabel }}
                onChange={(item) => LoadMovementId(dealDetailId, item ? item.id : '')}
                options={parcelas}
              />
            </label>
          </div>
        )}

        <div style={{float:'right', marginRight:'5%', marginTop:'25px'}}>
          <label htmlFor='file' className="buttonLinkClick" style={{position: "relative"}} title="Clique para selecionar arquivos em seu computador">
            <FaFileAlt />
            Anexar Arquivo
            <input
              ref={ref}
              type="file"
              multiple
              style={{opacity: '0', position: "absolute", marginLeft: "-100%", width:"100%", height:"35px", cursor:"pointer"}}
              onChange={(e) => handleSaveFile(e)}
            />
          </label>
        </div>
        <br /><br /><br />

        <GridSubContainer id='GRID' style={{pointerEvents:(isDeletingFile?'none':'all')}}>
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
        <br /><br /><br /><br />
   
        <div className='footer'>
          <div style={{marginTop:"1%", float:"right", marginRight:"3%"}}>            
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleCloseMatterFileModal()}
                style={{width:'100px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>
      </FileModalMobile>      
      )}

      {isLoading && (
        <>
          <OverlayFinancial />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            Aguarde...
          </div>
        </>
      )}

    </>
    
  )
  
}
export default FinancialFileModal;
