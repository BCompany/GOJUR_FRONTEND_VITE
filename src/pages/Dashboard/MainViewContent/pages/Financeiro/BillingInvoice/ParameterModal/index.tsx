/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Select from 'react-select'
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { FiHelpCircle, FiSave } from 'react-icons/fi';
import { useMenuHamburguer } from 'context/menuHamburguer'
import api from 'services/api';
import {IAutoCompleteData, IParametersData, ISelectData } from '../../../Interfaces/IBIllingContract'
import { ModalParameter, OverlayModal, OverlayModal2} from './styles';

const BillingInvoiceParameterModal = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isSaving, setisSaving]= useState<boolean>(false);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const { isMenuOpen, handleIsMenuOpen, caller, isOpenMenuConfig, handleCaller, handleIsOpenMenuConfig } = useMenuHamburguer();
  const [openModalBillingInvoiceParameter, setOpenModalBillingInvoiceParameter]= useState<boolean>(false)

  const [documentModel, setDocumentModel] = useState<IAutoCompleteData[]>([]);
  const [documentModelId, setDocumentModelId] = useState<string>("0")
  const [documentModelValue, setDocumentModelValue] = useState('');
  const [documentModelTerm, setDocumentModelTerm] = useState('');

  const [documentBody, setDocumentBody] = useState<IAutoCompleteData[]>([]);
  const [documentBodyId, setDocumentBodyId] = useState<string>("0")
  const [documentBodyValue, setDocumentBodyValue] = useState('');
  const [documentBodyTerm, setDocumentBodyTerm] = useState('');

  const [subjectDescription, setSubjectDescription] = useState<string>("")
  const [emailCopyDescription, setEmailCopyDescription] = useState<string>("")
  const [senderName, setSenderName] = useState<string>("")
  const [answerEmail, serAnswerEmail] = useState<string>("")
  const [sendEmail, setSendEmail] = useState<string>("")
  const [outputHost, setOutputHost] = useState<string>("")
  const [user, setUser] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [port, setPort] = useState<string>("")
  const [flg_SSL, setFlg_SSL] = useState<boolean>(false)

  useEffect(() => {

    if(openModalBillingInvoiceParameter == true){
      LoadDocumentModel();
      LoadDocumentBody();
      LoadParameters()
    }
  },[openModalBillingInvoiceParameter])

  useDelay(() => {
    if (documentModelTerm.length > 0){

      LoadDocumentModel()
    }
  }, [documentModelTerm], 700)

  useEffect(() => {
   
    if (caller == "billingInvoiceModal" && isOpenMenuConfig)
    {     
      setOpenModalBillingInvoiceParameter(true)
    }
  },[caller, isMenuOpen])


  const LoadDocumentModel = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? documentModelValue:documentModelTerm
    if (stateValue == 'reset'){
      filter = ''
    }
    try {
      const response = await api.post<ISelectData[]>('/DocumentosModelo/ListarPorFiltro', {
        documentType: "'FF'",
        filterDesc: filter,
        token
      });

      setDocumentModel(response.data);

    } catch (err) {
      console.log(err);
    }
  }

  const LoadDocumentBody = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    let filter = stateValue == "initialize"? documentBodyValue:documentBodyTerm
    if (stateValue == 'reset'){
      filter = ''
    }
    try {
      const response = await api.post<ISelectData[]>('/DocumentosModelo/ListarPorFiltro', {
        documentType: "'FF'",
        filterDesc: filter,
        token
      });

      setDocumentBody(response.data);

    } catch (err) {
      console.log(err);
    }
  }

  const LoadParameters = useCallback(async () => {

    setIsLoading(true)

    try {
      const response = await api.get<IParametersData>('/Financeiro/Faturamento/ParametrosFatura', {
        params:{
          token,
        }
      });  
      
      setDocumentModelId(response.data.codEmailInvoiceModel)
      setDocumentModelValue(response.data.desEmailInvoiceModel)
      setDocumentBodyId(response.data.codEmailBodyHtml)
      setDocumentBodyValue(response.data.desEmailBodyHtml)
      setSubjectDescription(response.data.emailSubject)
      setEmailCopyDescription(response.data.emailCopy)
      setSenderName(response.data.emailSender)
      serAnswerEmail(response.data.emailReplyTo)
      setSendEmail(response.data.emailSMTP)
      setOutputHost(response.data.hostSMTP)
      setUser(response.data.userSMTP)
      setPassword(response.data.passwordSMTP)
      setPort(response.data.portSMTP)

      if(response.data.SSLSMTP == "false"){
        setFlg_SSL(false)
      }
      else{
        setFlg_SSL(true)
      }

      setIsLoading(false)

          
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }

  },[documentModelId, documentModelValue, documentBodyId, documentBodyValue, subjectDescription, emailCopyDescription, senderName, answerEmail, sendEmail, outputHost, user, password, port, flg_SSL])


  const saveParameters = useCallback(async() => {

    let ssL = ""

    if(flg_SSL == false){
      ssL = "false"
    }
    else{
      ssL = "true"
    }

    try {

      setisSaving(true)
      
      await api.post('/Financeiro/Faturamento/SalvarParametros', {
  
        emailSubject: subjectDescription,
        emailSender: senderName,
        emailCopy: emailCopyDescription,
        emailReplyTo: answerEmail,
        cod_EmailInvoiceModel: documentModelId,
        cod_EmailHtmlBody: documentBodyId,
        emailSMTP: sendEmail,
        userSMTP: user,
        passwordSMTP: password,
        hostSMTP: outputHost,
        portSMTP: port,
        SSLSMTP: ssL,
        token
      })
      
      addToast({
        type: "success",
        title: "Parâmetros Salvo",
        description: "Os parâmetros foi adicionada no sistema."
      })
      
      handleBillingInvoiceParameterModalClose()
      setisSaving(false)
      
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar parâmetros.",
      })
    }
  },[isSaving, subjectDescription, senderName, emailCopyDescription, answerEmail, documentModelId, documentBodyId, sendEmail, user, password, outputHost, port, flg_SSL]);


  const handleDocumentModelSelected = (item) => { 
      
    if (item){
      setDocumentModelValue(item.label)
      setDocumentModelId(item.id)
      
    }else{
      setDocumentModelValue('')
      LoadDocumentModel('reset')
      setDocumentModelId('')
    }
  }

  const handleDocumentBodySelected = (item) => { 
      
    if (item){
      setDocumentBodyValue(item.label)
      setDocumentBodyId(item.id)
      
    }else{
      setDocumentBodyValue('')
      LoadDocumentBody('reset')
      setDocumentBodyId('')
    }
  }

  const handleBillingInvoiceParameterModalClose = () => { 
    setOpenModalBillingInvoiceParameter(false)
    handleCaller("")
    handleIsMenuOpen(false)
    handleIsOpenMenuConfig(false)
  }

  return (
    <>

      {openModalBillingInvoiceParameter && (
        <>
          <OverlayModal2 />
        </>
      )}

      {isLoading && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}

      {isSaving && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}
       
      <ModalParameter show={openModalBillingInvoiceParameter}>

        <div className='header'>
          <p className='headerLabel'>Parâmetros da Fatura</p>
        </div>

        <div className='mainDiv'>

          <div style={{display:"flex"}}>

            <div style={{width:"47%"}}>
              <AutoCompleteSelect>
                <p>Modelo da Fatura:</p>
                <Select
                  isSearchable
                  isClearable
                  placeholder="Selecione"
                  value={documentModel.filter(item => item.id == documentModelId)}
                  onChange={(item) => handleDocumentModelSelected(item)}
                  onInputChange={(term) => setDocumentModelTerm(term)}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={documentModel}
                />
              </AutoCompleteSelect>
            </div>

            <FiHelpCircle className='infoMessages' title="Define qual o modelo de impressão de fatura que será enviado ao cliente." />

            <div style={{width:"47%", marginLeft:"1%"}}>
              <AutoCompleteSelect>
                <p>Corpo do Email:</p>
                <Select
                  isSearchable
                  isClearable
                  placeholder="Selecione"
                  value={documentBody.filter(item => item.id == documentBodyId)}
                  onChange={(item) => handleDocumentBodySelected(item)}
                  onInputChange={(term) => setDocumentBodyValue(term)}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={documentBody}
                />
              </AutoCompleteSelect>
            </div>

            <FiHelpCircle className='infoMessages' title="Define qual o texto no corpo do email que será enviado ao cliente." />
            
          </div>

          <div style={{display:"flex", marginTop:"10px", marginLeft:"1%"}}>

            <div style={{width:"46%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Assunto:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={subjectDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSubjectDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Define o assunto do email que será recebido pelo cliente." />

            <div style={{width:"46%", marginLeft:"2%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Email de Cópia:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={emailCopyDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailCopyDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Define qual o endereço de email que terá uma copia enviada automaticamente." />

          </div>

          <div style={{display:"flex", marginTop:"20px", marginLeft:"1%"}}>

            <div style={{width:"46%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Nome Remetente:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={senderName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSenderName(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Define o nome do rementente que será recebido pelo cliente." />

            <div style={{width:"46%", marginLeft:"2%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Responder para:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={answerEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => serAnswerEmail(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Define qual será o email para resposta do recebimento." />

          </div>

          <div className='border'>&nbsp;</div>

          <h3 style={{textAlign:"center", fontFamily:"montserrat"}}>Configurações de Envio ( SMTP )</h3>

          <div style={{display:"flex", marginTop:"20px", marginLeft:"1%"}}>

            <div style={{width:"46%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                E-mail de Envio:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={sendEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSendEmail(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Endereço de email responsável pelo envio das faturas. (Pode ser utilizado o mesmo email definido como: Email de Cópia)." />

            <div style={{width:"46%", marginLeft:"2%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Host de Saída:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={outputHost}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOutputHost(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Servidor de saída do email. (Verifique esta configuração com o seu provedor de email ou através de algum serviço de e-mail)." />

          </div>

          <div style={{display:"flex", marginTop:"20px", marginLeft:"1%"}}>

            <div style={{width:"46%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Usuário:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="abc"
                  value={user}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Usuário de autenticação do envio de email." />

            <div style={{width:"21%", marginLeft:"2%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Senha:
                <br />
                <input 
                  type="password"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Senha de autenticação do envio de email." />

            <div style={{width:"20.4%", marginLeft:"2%"}}>
              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Porta:
                <br />
                <input 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={port}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPort(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <FiHelpCircle className='infoMessages2' title="Porta de saida para a configuração do email de envio. (Na maioria das vezes será utilizadas as portas 587 ou 465)." />

          </div>

          <div style={{display:"flex", marginTop:"20px", marginLeft:"1%"}}>

            <span className='spanEmailInvoicing'>SSL:</span>

            <div className='flgDiv'>
              <input
                type="checkbox"
                name="select"
                checked={flg_SSL}
                onChange={() => setFlg_SSL(!flg_SSL)}
              />
            </div>

            <FiHelpCircle className='infoMessages3' title="Habilitar SSL (Verifique o seu serviço de email)." />

          </div>

          
        </div>
      
        <div className='footer'>
          <div style={{marginTop:"2%", float:"right", marginRight:"3%"}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> saveParameters()}
                style={{width:'100px'}}
              >
                <FiSave />
                Salvar 
              </button>
            </div>
                  
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleBillingInvoiceParameterModalClose()}
                style={{width:'100px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>

      </ModalParameter>

    </>
    
  )
  
}
export default BillingInvoiceParameterModal;
