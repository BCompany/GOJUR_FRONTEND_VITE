/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useEffect, useRef, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { MdAttachFile } from 'react-icons/md';
import { FiTrash, FiDownloadCloud } from 'react-icons/fi';
import { format } from 'date-fns'
import { ImCloudUpload } from 'react-icons/im';
import { useToast } from 'context/toast';
import { useLocation } from 'react-router-dom'
import Loader from 'react-spinners/PulseLoader'
import api from 'services/api';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AmazonPost, FormatFileName } from 'Shared/utils/commonFunctions';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container, DocumentItem, DropArea } from './styles';
import { DocumentBusinessData } from '../../Interfaces/IDocument';

const BusinessDocument = () => {
  const { addToast } = useToast();
  const { pathname  } = useLocation();
  const [uploadingStatus, setUploadingStatus] = useState<string>('none');
  const [isDragging, setIsDragging] = useState<boolean>();
  const dropFilesAreaRef = useRef<HTMLDivElement>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
  const [documentList, setDocumentList] = useState<DocumentBusinessData[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [businessId, setBusinessId] = useState<number>(0)
  const tokenapi = localStorage.getItem('@GoJur:token');
  const ref = useRef<any>(null);


  useEffect(() => {
    const businessId = Number(pathname.substr(24))
    setBusinessId(businessId)
  }, [])


  // first initialization
  useEffect(() => {
    if (businessId > 0) {
      LoadDocuments()
      DragDropEvents()
    }
   }, [businessId])


   const LoadDocuments = async () => {
     const response = await api.post<DocumentBusinessData[]>('/NegocioDocumento/ListarArquivos', {
        referenceId: businessId,
       token: tokenapi
     })

     setDocumentList(response.data)
     if (response.data.length > 0) {
       // setTokenPaginationAmazon(response.data[0].tokenPagination)
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


  const UploadFiles = async (files: any[]) => {
    try
    {
      const request:any[] = []

      if (businessId == 0 || businessId == undefined || Number.isNaN(businessId)) {
        addToast({type: "info", title: "Operação não realizada", description: `É necessário que o negóico seja salvo no Gojur antes de vincular novos documentos a ele`})
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
            referenceId: businessId,
            fileName,
            fileSize: files[index].size,
            token: tokenapi
          });
        }
      }

      const hasError = errorList.length > 0;

      if (!hasError) {
        try{
          // save all files as pending in lot mode
          const response = await api.post<DocumentBusinessData[]>('/NegocioDocumento/CriarArquivoPendente', request);

          // get document ids for all pending files to verify after and save
          const documentIds: number[] = [];
          response.data.map((item) => { return documentIds.push(item.id) })
          setFilesUploadIds(documentIds)
          setIsDragging(false);

          // if everythings ok with pending save files save now each file in amazon
          const promisses: any[] = [];

          if (response.status == 200){
            for (let index = 0; index < files.length; index++) {
              promisses.push(AmazonPost(businessId, files[index], "/CRM/Negocio_"))
            }

            // when conclude set upload status as 'conclude' so now whe can, by use effect call endpoint to validate all files
            Promise.all(promisses).then(() => {
              setUploadingStatus('conclude')
            })
          }
        }
        catch(err:any){
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
      const response = await api.post<DocumentBusinessData[]>('/NegocioDocumento/ValidarArquivo', request);

      addToast({type: "success", title: "Upload efetuado com sucesso", description: `Upload de ${ filesUploadIds.length } arquivos efetuados com sucesso`})

      const documentListData: DocumentBusinessData[] = [];

      response.data.map((item) => {

        const existsFileName = documentList.find(doc => doc.fileName.toLowerCase() == item.fileName.toLowerCase())

        if (existsFileName == undefined){
          documentListData.push({
            id: 0,
            businessId,
            fileName: item.fileName.toLowerCase(),
            dateUpload: item.dateUpload,
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
    const response = await api.post('/NegocioDocumento/DownloadFile', {
      referenceId:businessId,
      fileName: fileName.toLowerCase(),
      token: tokenapi
    })

    window.open(response.data, '_blank')
  }


  const handleDeleteFile = async (fileName: string) => {
    try
    {
      setIsDeletingFile(true)
      setCurrentFileName(fileName)
      setUploadingStatus('executing')

      const response = await api.delete('/NegocioDocumento/Deletar', {
        params:{referenceId:businessId, fileName: fileName.toLowerCase(), token: tokenapi}
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


  return (
    <Container>

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
      <MdAttachFile size={15} />
        &nbsp;Documentos

      <section>
        <DropArea
          style={{backgroundColor: ((isDragging)?'var(--gray-outline)':'')}}
          ref={dropFilesAreaRef}
        >
          <ImCloudUpload />
          <span>ARRASTE AQUI OS SEUS ARQUIVOS</span>
        </DropArea>
        <br />

        <div className="uploadButton">
          <label
            className="buttonLinkClick"
            title="Clique para selecionar arquivos em seu computador"
          >
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
        </div>
        <br />

        <DocumentItem>
          {documentList.length > 0 && (
            <div>
              <section className="grid-header">
                <div>Arquivo</div>
                <div>Data do Upload</div>
                <div>Download</div>
                <div>Deletar</div>
              </section>
            </div>
          )}

          {documentList.map(item => {
            return (
              <>
                <div>
                  <section className="grid-row">
                    <div>{item.fileName}</div>
                    <div>
                      {format(new Date(item.dateUpload), 'dd/MM/yyyy HH:mm')}
                    </div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <FiDownloadCloud
                        title="Clique para fazer o download do arquivo"
                        onClick={() => handleDownloadFile(item.fileName)}
                      />
                    </div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <FiTrash
                        title="Clique para remover o arquivo"
                        onClick={() => handleDeleteFile(item.fileName)}
                      />
                    </div>
                  </section>
                </div>
              </>
            )
          })}

          {documentList.length == 0 && uploadingStatus == 'none' && (
            <div className="messageEmpty">
              Nenhum arquivo disponível para download
            </div>
          )}
        </DocumentItem>
      </section>
    </Container>
  )
}

export default BusinessDocument;
