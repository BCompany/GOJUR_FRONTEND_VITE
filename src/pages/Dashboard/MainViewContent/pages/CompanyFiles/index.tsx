/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */


import React, { useState, useEffect, useCallback, ChangeEvent  } from 'react';
import api from 'services/api';
import { AiOutlineArrowLeft, AiOutlinePlayCircle } from 'react-icons/ai';
import { BsFillFolderFill } from 'react-icons/bs';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiDownload } from 'react-icons/fi';
import { HeaderPage } from 'components/HeaderPage';
import {FormatDate } from 'Shared/utils/commonFunctions';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { Container, Content, Form, TaskBar} from './styles';


export interface ISelectData {
  id: string;
  label: string;
}

export interface IBackupFilesData {
  cod_BackupArquivo: string;
  cod_UltimoProcesso: string;
  cod_UltimoCliente: string;
  cod_UltimoMovimento: string;
  cod_UltimoClienteNegocio: string;
  tpo_StatusBackup: string;
  tpo_BackupSelecionado: string;
  dta_BackupInicial: string;
  dta_UltimoBackup: string;
  backup: IBackupFilesData
}

export interface ICompanyFilesData {
  totalDownloaded : number;
  remainFiles : number;
}

const CompanyFiles: React.FC = () => {
  const token = localStorage.getItem('@GoJur:token');
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const { addToast } = useToast();
  const history = useHistory();
  const [module, setModule] = useState<string>('TD')
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [totalDownloaded, setTotalDownloaded] = useState<number>(0)
  const [doubleCheck, setDoubleCheck] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const { handleCancelMessage,handleCaller, handleConfirmMessage, handleCheckConfirm, isCheckConfirm ,caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [openSpaceDiskModal, setOpenSpaceDiskModal] = useState<boolean>(false)
  const [confirmSpaceDiskModal, setConfirmSpaceDiskModal] = useState<boolean>(false)
  const [openAwarenessModal, setOpenAwarenessModal] = useState<boolean>(false)
  const [newBackup, setNewBackup] = useState<boolean>(false)
  const [isContinue, setIsContinue] = useState<boolean>(false)
  const [firstBackupDate, setFirstBackupDate] = useState<string>("")
  const [lastBackupDate, setLastBackupDate] = useState<string>("")
  const [isFirstBackup, setIsFirstBackup] = useState<boolean>(false)
  const [isHandleContinueBackup, setIsHandleContinueBackup] = useState<boolean>(false)
  const [isConfirmHandleContinueBackup, setIsConfirmHandleContinueBackup] = useState<boolean>(false)
  const [isHandleNewBackup, setIsHandleNewBackup] = useState<boolean>(false)
  const [isConfirmHandleNewBackup, setIsConfirmHandleNewBackup] = useState<boolean>(false)
  const [notHaveBackup, setNotHaveBackup] = useState<boolean>(false)
  const [lastBackup, setLastBackup] = useState<IBackupFilesData>()

  useEffect(() => {
    GetLastBackup()
  },[]);

  useEffect(() => {
    if(isHandleContinueBackup){
      setDoubleCheck(true)
      setNewBackup(false)
      setIsHandleContinueBackup(false)
      setIsConfirmHandleContinueBackup(true)
    }
  },[isHandleContinueBackup]);

    useEffect(() => {
    if(isConfirmHandleContinueBackup){
      setIsHandleContinueBackup(false)
      setIsConfirmHandleContinueBackup(false)
      handleDownload()
    }
  },[isConfirmHandleContinueBackup]);

  useEffect(() => {
    if(isHandleNewBackup){    
      setNewBackup(true)
      setIsHandleNewBackup(false)
      setIsConfirmHandleNewBackup(true)
    }
  },[isHandleNewBackup]);

  useEffect(() => {
    if(isConfirmHandleNewBackup){
      setDoubleCheck(false)
      setIsConfirmHandleNewBackup(false)
      handleDownload()
    }
  },[isConfirmHandleNewBackup]);


  useEffect(() => {

    if (isCancelMessage){

      if (caller === 'confirmOpenDiskSpace')
      {
        setOpenSpaceDiskModal(false)
        handleCancelMessage(false)
        setErrorMessage("")
      }
    }

  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenDiskSpace')
      {
        handleCheckConfirm(true)
        setDoubleCheck(true)
        setConfirmSpaceDiskModal(true)
        handleCancelMessage(false)
        
      }
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmSpaceDiskModal)
    {
      setOpenSpaceDiskModal(false)
      handleCaller("")
      setConfirmSpaceDiskModal(false)
      handleConfirmMessage(false)
      handleDownload()
      setErrorMessage("")

      
    }
  },[confirmSpaceDiskModal]);


  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'awarenesError')
      {
        setOpenAwarenessModal(false)
        handleConfirmMessage(false)
        setErrorMessage("")
        handleCaller("")
      }
    }
  },[isConfirmMessage, caller]);


  const GetLastBackup = useCallback(async() => {
    try{
      const response = await api.get<IBackupFilesData>('EmpresaArquivos/UltimoBackup', {
        params:{
          token
        }    
      })

      setLastBackup(response.data.backup)

      if(response.data.tpo_StatusBackup != null){
        setFirstBackupDate(FormatDate(new Date(response.data.dta_BackupInicial), "dd/MM/yyyy HH:mm"))
        setLastBackupDate(FormatDate(new Date(response.data.dta_UltimoBackup), "dd/MM/yyyy HH:mm"))
        setNotHaveBackup(false)
      }   
      
      if (response.data.tpo_StatusBackup != "FIM" && response.data.tpo_StatusBackup != null){ 
        setNewBackup(false)    
        setIsContinue(true)
      }
      else if (response.data.tpo_StatusBackup == "FIM"){
        setIsFirstBackup(true)
        setNewBackup(true)
      }
      else if (response.data.tpo_StatusBackup == null){
        setIsFirstBackup(true)
        setNewBackup(true)
        setNotHaveBackup(true)
      }
      
    }
    catch (err: any) {

      if(!err.response.data.typeError.warning){
        addToast({
          type: "info",
          title: "Falha ao baixar arquivo",
          description: err.response.data.Message
        });
      }
    }

  },[firstBackupDate, lastBackupDate, newBackup, isContinue, isFirstBackup, lastBackup]);


  const SaveBackup = useCallback(async(backup: IBackupFilesData) => {

    try{
 
        const currentDate = new Date().toLocaleString(); // Obtém a data atual

        const response = await api.post<ICompanyFilesData>('EmpresaArquivos/SalvarBackup', {  
            backup,
            lastBackupDate: currentDate,
            token        
        })
    
        const files = {
          remainFiles: response.data.remainFiles,
          totalDownloaded: response.data.totalDownloaded
        }
    
        return files
    }
    catch (err: any) {

      setIsDownloading(false)
      
        addToast({
          type: "info",
          title: "Falha ao salvar Backup",
          description: err.response.data.Message
        });
      }

  },[]);


  const CheckPermissionToDownload = useCallback(async() => {

    try{    
      await api.post<ICompanyFilesData>('EmpresaArquivos/Checar', {  
        backup: lastBackup,
        token        
      })

    }
    catch (err: any){

      if (err.response.data.typeError.warning == "awareness"){
        setErrorMessage(err.response.data.Message)
        setOpenAwarenessModal(true)

        return false
      }
    }

      
  },[lastBackup, isContinue, isFirstBackup]);


const handleDownload = useCallback(async () => {
  try {
    
    setTotalDownloaded(0)
    const currentDate = new Date().toLocaleString(); // Obtém a data atual

    const pass = await CheckPermissionToDownload()

    if(pass == false){
      return
    }
    
    setIsDownloading(true)

    let remainingFiles = 2;
    let handleBackup = newBackup
    /* eslint-disable no-await-in-loop */
    while (remainingFiles > 0) {

      const response = await api.get('EmpresaArquivos/DownloadArquivos', {
        params:{
          token,
          typeBackup: module,
          newBackup: handleBackup,
          firstDate: currentDate,
          doubleCheck
        }
      });

      handleBackup = false
     
      const bytes = base64ToArrayBuffer(response.data.amazonFile)
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
    
      link.href = url;
      link.setAttribute('download', `${response.data.fileName}.zip`);
      document.body.appendChild(link);
      link.click();

      const backup = await SaveBackup(response.data.backup)
      remainingFiles = backup!.remainFiles

      setTotalDownloaded(ProgressBar(backup!.remainFiles, backup!.totalDownloaded))
      GetLastBackup()
  
      
      // await new Promise(resolve => setTimeout(resolve, 2000)); // Delay de 2 segundo entre as chamadas
    }
    /* eslint-disable no-await-in-loop */

    setIsDownloading(false)
    setTotalDownloaded(0)
    setIsContinue(false)
    setIsFirstBackup(true)
    setDoubleCheck(false)
    setModule("TD")
    setNotHaveBackup(false)

  } catch (err: any) {
    setIsDownloading(false)
    
    if(!err.response.data.typeError.warning){
      addToast({
        type: "info",
        title: "Falha ao baixar arquivo",
        description: err.response.data.Message
      });
    }

    else if (err.response.data.typeError.warning == "confirmation"){
      setErrorMessage(err.response.data.Message)
      setOpenSpaceDiskModal(true)
    }
  }
},[module, newBackup, doubleCheck, isContinue, isFirstBackup]);

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
  }
  return bytes;
}

  function ProgressBar(remainFiles , totalDownloaded) {

    const porcentagem = (totalDownloaded / (totalDownloaded + remainFiles)) * 100;

    return Math.round(porcentagem);
    
  }

  const handleNewBackup = useCallback(() => {
    setIsHandleNewBackup(true)

  }, [doubleCheck, newBackup]);

  const handleContinueBackup = useCallback(() => {
    setDoubleCheck(true)
    setIsHandleContinueBackup(true)

  }, [doubleCheck, newBackup, isHandleContinueBackup]);


  return (

    <Container>

      {isDownloading && (
        <>
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Baixando Arquivos ...
          </div>
        </>
      )}

      <div style={{marginLeft:"-2%"}}>
        <HeaderPage />
      </div>

      <TaskBar>


        <div>
          <div>
            <button
              className="buttonLinkClick buttonInclude"
              title="Clique para voltar as informações do plano"
              type="submit"
              onClick={() => history.push(`/dashboard`)}
            >
              <AiOutlineArrowLeft />
              <span>Retornar</span>

            </button>
          </div>
        </div>

      </TaskBar>

      {openSpaceDiskModal && (
        <ConfirmBoxModal
          caller="confirmOpenDiskSpace"
          title="Espço em Disco"
          useCheckBoxConfirm
          message={`${errorMessage}`}
          haveLink
        />
      )}

      {openAwarenessModal && (
        <ConfirmBoxModal
          caller="awarenesError"
          title="Baixar Arquivos - Aviso"
          checkMessage="Estou ciente sobre a operação realizada."
          buttonOkText="Estou ciente"
          useCheckBoxConfirm
          message={`${errorMessage}`}
          showMainButtonCancel={false}        
        />
      )}

      <Content>

        <header>

          <div>

            Backup Arquivos

          </div>

        </header>

        <Form>

          <section>

            <div id="message">
              
              Esta funcionalidade permite o que você baixe todos seus arquivos no sistema de acordo com os filtros dos módulos do sistema selecionados. Sendo eles:
              {' '}
              <span>Módulo de Processos</span>
              ,
              {' '}
              <span>Módulo de Clientes</span>
              {' '}
              ,
              {' '}
              <span>Módulo do Financeiro</span>
              {' '}
              e também
              {' '}
              <span>Módulo de CRM</span>
              .
              <br />

              <div>
                Selecione abaixo de quais módulos deseja obter os arquivos.
                {' '}            
              </div>

              <div id='selectModule'>
                <label htmlFor="type">
                  Módulos:
                  <br />
                  <select 
                    name="selectModule"
                    value={module}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setModule(e.target.value)}
                    style={{width: "100%"}}
                  >
                    <option value="TD">Todos</option>
                    <option value="PR">Processo</option>
                    <option value="CL">Cliente</option>
                    <option value="FI">Financeiro</option>
                    <option value="CR">CRM</option>
      
                  </select>
                </label>
              </div>
      
            </div>

            {accessCode == "adm" && (
              <>
                {isDownloading == false && (
                  <>
                    {isFirstBackup && (
                      <div id='downloadFiles'>
                        <footer>
                          <button
                            className="buttonClick"
                            type='button'
                            onClick={handleDownload}
                          >
                            <FiDownload />
                            Baixar Novo Backup
                          </button>

                        </footer>
                      </div>
                    )}
                  </>
                )}

                {isContinue == true && (
                  <>
                    {isDownloading == false && (
                      <>
                        <div id='downloadFiles'>
                          <footer>
                            <button
                              className="buttonClick"
                              type='button'
                              onClick={handleContinueBackup}
                            >
                              <AiOutlinePlayCircle />
                              Continuar Backup
                            </button>

                          </footer>
                        </div>

                        <div id='downloadFiles'>
                          <footer>
                            <button
                              className="buttonClick"
                              type='button'
                              onClick={handleNewBackup}
                            >
                              <BsFillFolderFill />
                              Baixar Novo Backup
                            </button>

                          </footer>
                        </div>
                      </>          
                    )}         
                  </>
                )}
              </>
            )}

            {isDownloading && (
              <p id='downloadPercentage'>
                Total Baixado:
                {" "}
                {totalDownloaded}
                %
                <LoaderWaiting size={15} color="var(--blue-twitter)" />
              </p>
            )}

            <br />

            {notHaveBackup == false && (
              <>
                <span className="lastUpdate">
                  {' '}
                  Data de Inicio:
                  {' '}
                  {firstBackupDate}
                </span>
                <span className="lastUpdate">
                  {' '}
                  Ultima Atividade:
                  {' '}
                  {lastBackupDate}
                </span>
                <span className="lastUpdate">
                  {' '}
                  Status:
                  {' '}
                  {(isContinue && isDownloading == false) && (
                    <div style={{marginLeft:"10px", color:"red"}}>Interrompido</div>
                  )}
                  {(isContinue == false && isDownloading == false) && (
                    <div style={{marginLeft:"10px", color:"green"}}>Backup Finalizado com Sucesso</div>
                  )}
                  {isDownloading == true && (
                    <div style={{marginLeft:"10px", color:"green"}}>Backup em Andamento</div>
                  )}
                </span>
              </>
              
            )}
            
        
          </section>

        </Form>

      </Content>


    </Container>


  );
};

export default CompanyFiles;
