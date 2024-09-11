import React, { useCallback, useEffect, useState } from 'react';
import {  useHistory, useLocation } from 'react-router-dom';
import { BsBellFill, BsGearFill,BsLockFill,BsFillUnlockFill,BsFillEnvelopeFill,BsFillEnvelopeOpenFill,BsFillCameraVideoFill } from 'react-icons/bs';
import { BiSupport }from 'react-icons/bi';
import { TiMessageTyping }from 'react-icons/ti';
import { FaPowerOff} from 'react-icons/fa';
import { useAuth } from 'context/AuthContext';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useAlert } from 'context/alert';
import { envProvider } from 'services/hooks/useEnv';
import MenuHamburguer from 'components/MenuHamburguer';
import { ValidateAuthenticationError } from 'Shared/utils/commonFunctions';
import api from 'services/api';
import VideoTrainningModal from 'components/Modals/VideoTrainning/Index';
import { useToast } from 'context/toast';
import { useDefaultSettings } from 'context/defaultSettings';
import HelpAssistent from './HelpAssistent';
import EnvelopeNotificationList from './EnvelopeNotificationList';
import { Container, IconNotification } from './styles';

interface NavigationProps {
  dashboardLayoutChange?(): void;
}

interface Props {
  id: string;
  value: string;
}

interface MessageIdList {
  id: number;
  value: number;
}

interface mensagensProps {
  cod_Mensagem: number;
  cod_Processo: number;
  dta_Mensagem: string;
  des_Mensagem: string;
  messageType: string;
  warningMessage: boolean;
  num_Ano: number;
}
const TopNavBar: React.FC<NavigationProps> = ({
  dashboardLayoutChange,
  ...rest
}) => {
  const [chat, setChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(false);
  const [isLayoutChange, setIsLayoutChange] = useState(false);
  const [newMessages, setNewMessages] = useState<number>(0);
  const [messageIdList, setMessageIdList] = useState<MessageIdList[]>([]);
  const { signOut } = useAuth();
  const {handleUserPermission} = useDefaultSettings();
  const { handleDragOn, handleReleaseDrag } = useHeader();
  const { addToast } = useToast();
  const history = useHistory();
  const { handleShowVideoTrainning } = useModal();
  const {handleCaptureData, handleOpenListMessages, handleCloseListMessages, openListMessages, reloadMessages, handleReloadMessages} = useAlert();
  const { pathname } = useLocation();
  const baseUrl = envProvider.redirectUrl;
  const token = localStorage.getItem('@GoJur:token');
  const firstAcces = localStorage.getItem('@GoJur:firstAccess');
  const [showHamburguer, setShowHamburguer] = useState(false);
  let interval;


  useEffect(() => {
    handleDefaults();
  }, []);

  
  const handleDefaults = async () => {

    try {
      const response = await api.post<Props[]>('/Defaults/Listar', { token });

      const permissionAccessCode = response.data.find(item => item.id === 'accessCode')
      if (permissionAccessCode){
        localStorage.setItem('@GoJur:accessCode', permissionAccessCode.value)
      }

      const permissionModuleCode = response.data.find(item => item.id === 'moduleCode')
      if (permissionModuleCode){
        localStorage.setItem('@GoJur:moduleCode', permissionModuleCode.value)
      }

      // verify if user need to see a video trainning at the first time access
      const videoTrainningConfig = response.data.find(item => item.id === 'defaultUserLogFirstAccess')
      if (videoTrainningConfig) {

        if (pathname.includes('/calendar') || pathname.includes('/matter/list') || pathname.includes('/publication')){
          const seeTrainningVideo = !(videoTrainningConfig.value??"").includes(pathname.replace('/', ''))
          handleShowVideoTrainning(seeTrainningVideo)
        }
      }

      // get permission user module
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      const permissionUser = userPermissions[0].value.split('|')
      handleUserPermission(permissionUser);

      const companyPlan = response.data.find(item => item.id === 'companyPlan')
      if (companyPlan){
        localStorage.setItem('@GoJur:companyPlan', companyPlan.value)
      }

      const defaultFilterNames = response.data.find(item => item.id === 'defaultFilterNames')
      if (defaultFilterNames){
        localStorage.setItem('@GoJur:PublicationFilterName', defaultFilterNames.value);
      }

      // show or not chat
      const settingsData = response.data;
      if (settingsData[3].value === 'enabled') {
        setChat(true);
      }
      else{
        setChat(false);
      }

      const codApiKey = response.data.find(item => item.id === 'apiKey')
      if (codApiKey){
        localStorage.setItem('@GoJur:apiKey', codApiKey.value)
      }

      setIsLoading(false)
    } catch (error) {
      setChat(chat);
      setIsLoading(false)
      // Token Invalid Error Validation
      ValidateAuthenticationError(error)
    }
  }

  useEffect(() => {
    if (isLoading) return;

    if (chat === false) {
      const script = document.getElementById('scriptChat');

      if (script) {
        document.head.removeChild(script);
        document.location.reload();
      }
    }

    if (chat === true) {
      const script = document.createElement('script');
      // script.src = '//code.jivosite.com/widget/KZVrmgUDPF';                      // official account - remove on 13/04/2022 because JivoChat maintence

      script.src = 'https://embed.tawk.to/6257202e7b967b11798a9c59/1g0i5bdqg'       // new chat tawk.to - sidney 13/04/2022
      script.async = true;
      script.id = 'scriptChat';

      document.head.appendChild(script);
    }
  }, [chat, isLoading]);


  useEffect(() => {
    async function handleEnvelopeNotification() {
      try {
        
        const tokenapi = localStorage.getItem('@GoJur:token');

        const response = await api.post<mensagensProps[]>('/Dashboard/ListarMensagens',
          {
            messageType: 'AL',
            messageFilter: 'unreadOrRecent',
            token: tokenapi,
          },
        );

        const nMessages = response.data.filter(i => i.messageType === null);

        const listMessages: MessageIdList[] = []

        response.data.map(item => {
          if(item.messageType === null){
            return listMessages.push({
              id: item.cod_Mensagem,
              value: item.num_Ano,
            })
          }     
          return listMessages
        })

        setMessageIdList(listMessages)

        setNewMessages(nMessages.length);
        handleCaptureData(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    if (reloadMessages)
      handleEnvelopeNotification();

    // When create a new customer base in GOJUR, do not show highlight messages on first access
    if(firstAcces == null)
      handleEnvelopeNotification();

    handleReloadMessages(false);
    
    const firstPage = localStorage.getItem('@GoJur:firstPage');

    if (firstPage == "S"){
      localStorage.removeItem('@GoJur:firstPage');
      interval = setInterval(() => {
        handleEnvelopeNotification();
      }, 1800000);
    }
    
  }, [handleCaptureData, handleReloadMessages, reloadMessages]);


  const handleSignOut = useCallback(async () => {

    const tokenapi = localStorage.getItem('@GoJur:token');
    // handleRedirect(`${baseUrl}ReactRequest/Redirect?token=${tokenapi}&route=login/LogOff`)

    signOut();

    addToast({
      type: 'success',
      title: 'Logout Concluida',
      description: 'Até Logo!',
    });

    history.push('/');
  }, [addToast, history, signOut]);


  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);


  const handlePublication = useCallback(() => {
    console.log('Publicações');
  }, []);


  const SaveChatParameterSupport = useCallback(async () => {
    if (isLoading) return

    await api.post<boolean>(
      "/Parametro/Salvar",
      {
        parametersName: '#HELPCHAT',
        parameterType: 'P',
        parameterValue: chat?"disabled": "enabled",
        token
      },
    );

    setChat(!chat);

  }, [chat, isLoading])


  const handleDefaultsSupport = useCallback(() => {

    SaveChatParameterSupport();

  }, [chat, isLoading]);


  const handleLayoutChange = useCallback(() => {
    setIsLayoutChange(!isLayoutChange);

    if(isLayoutChange) {
      handleDragOn(false)
      handleReleaseDrag(false)
    }else{
      handleDragOn(true)
      handleReleaseDrag(true)
    }
  }, [handleDragOn, isLayoutChange]);


  return (
    <Container changeOn={isLayoutChange} {...rest}>
      <button
        type="button"
        onClick={handlePublication}
        title="Notificações"
        style={{ display: 'none' }}
      >
        <BsBellFill />
      </button>

      {openListMessages ? (
        <button
          type="button"
          title="Notificações e andamentos"
          style={{ marginRight: 15 }}
          onClick={() => {
            handleOpenListMessages(messageIdList);
            setNewMessages(0);
          }}
        >
          <IconNotification>
            <BsFillEnvelopeFill />
            {newMessages > 0 ? (
              <p>
                <>+</>
                {newMessages}
              </p>
            ) : null}
          </IconNotification>
        </button>
      ) : (
        <button
          type="button"
          title="Notificações e andamentos"
          onClick={handleCloseListMessages}
        >
          <IconNotification>
            <BsFillEnvelopeOpenFill />
          </IconNotification>
        </button>
      )}

      {pathname === '/dashboard' || pathname === '/CRM/Dashboard'? (
        <button
          type="button"
          id="layoutChange"
          onClick={handleLayoutChange}
          title="Alterar Dashboard"
        >
          {isLayoutChange ? (
            <BsFillUnlockFill color="#f19000" />
          ) : (
            <BsLockFill />
          )}
        </button>
      ) : null}

      <button type="button" onClick={handleDefaultsSupport} title={(!chat? "Clique falar agora mesmo com a equipe de suporte do GOJUR": "Clique para fechar o chat do GOJUR")}>
        {chat ? <TiMessageTyping /> : <BiSupport />}
      </button>

      <div className='buttonHamburguer'>
        <button
          type="button"
          onClick={() => setShowHamburguer(!showHamburguer)}
        >
          {showHamburguer ? <BsGearFill className='iconMenu' /> : <BsGearFill className='iconMenu' />}
        </button>

        {showHamburguer ? (
          <MenuHamburguer name='headerPageOptions' />
        ) : null}
      </div>

      <button
        type="button"
        id="logout"
        onClick={handleSignOut}
        title="Sair do Sistema"
      >
        <FaPowerOff />
      </button>
      {settings ? <HelpAssistent /> : null}
      {openListMessages ? null : <EnvelopeNotificationList />}

      <VideoTrainningModal />

    </Container>
  );
};

export default TopNavBar;
