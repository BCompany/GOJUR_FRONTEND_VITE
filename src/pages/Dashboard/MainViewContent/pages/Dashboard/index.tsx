/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
import React, {useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ModalProvider, useModal } from 'context/modal';
import { useAlert } from 'context/alert';
import { useAuth } from 'context/AuthContext';
import { useToast } from 'context/toast';
import { useDefaultSettings } from 'context/defaultSettings';
import { useHeader} from 'context/headerContext';
import { Overlay } from 'Shared/styles/GlobalStyle';
import GraphicsProcessosPorAcao from 'components/InfoGraphics/GraphicsProcessosPorAcao';
import GraphicsNovosCasosPorMes from 'components/InfoGraphics/GraphicsNovosCasosPorMes';
import GraphicsReceitasEDespesas from 'components/InfoGraphics/GraphicsReceitasEDespesas';
import GraphicsProcessosPorNaturezaJuridica from 'components/InfoGraphics/GraphicsProcessosPorNaturezaJuridica';
import GraphicsProcessosDecisaoJudicial from 'components/InfoGraphics/GraphicsProcessosDecisaoJudicial';
import api from 'services/api';
import ProcessModal from 'components/HeaderPage/TopNavBar/EnvelopeNotificationList/ProcessModal';
import { HeaderPage } from 'components/HeaderPage';
import GridLayout from 'react-grid-layout';
import Publicacoes from './resorces/DashboardComponents/Publicacoes';
import Appointment from './resorces/DashboardComponents/Appointments';
import Indicators from './resorces/DashboardComponents/Indicators';
import HighliteModal from './resorces/DashboardComponents/HighliteModal';
import FirstAccessModal from '../Cadastro/FirstAccessModal';
import {Container, Wrapper, Content, OverlayDashboard } from './styles';
import { ChangeElementsVisibleProps, dataProps, DefaultsProps, keyProps } from '../Interfaces/IGraphics';
import zIndex from '@material-ui/core/styles/zIndex';
import { FaEye } from "react-icons/fa";
import { ModalChangeVisibility } from 'components/Modals/DashboardModal';

const Dashboard: React.FC = () => {
  const ref = useRef(null);

  const { addToast } = useToast();
  const { handleShowVideoTrainning } = useModal();
  const {  handleShowListSearch, dragOn, handleDragOn, handleLoadingData, handleCaptureText } = useHeader();
  const { alertData, openProcessModal } = useAlert();
  const history = useHistory();
  const { tpoUser } = useAuth();
  const { handleUserPermission, handleBlockMenu, handleUnlockMenu} = useDefaultSettings();
  const [openHighlite, setOpenHighlite] = useState(false);
  const [screenWitdh, setScreenWitdh] = useState(screen.width);
  const [layoutKey, setLayoutKey] = useState<keyProps[]>([]);
  const [layoutComp, setLayoutComp] = useState<dataProps[]>([]);
  const [abortAccess, setAbortAccess] = useState(false);
  const token = localStorage.getItem('@GoJur:token');
  const firstAcces = localStorage.getItem('@GoJur:firstAccess');
  const [firstAccessModal, setFirstAccessModal] = useState<boolean>(false);
  const [releaseDrag, setReleaseDrag] = useState<boolean>(false);
  const [CloseVisibilityModal, setChangeVisibilityModal] = useState<boolean>(false);

  useEffect(() => {
    if (tpoUser === 'C') {
      history.push('/clientRedirect');
    }
  }, [history, tpoUser]);

  
  useEffect(() => {

    const response = api.post('/Usuario/SalvarLogNavegacaoUsuario', {
        token,
        module: 'MEN_DASHBOARD'
    });

    async function handleGraphics() {
      const response = await api.post<dataProps[]>(
        '/Dashboard/ListarPosicionamentos',
        {
          token,
          type: 'homeDashBoard',
          visible: 'S'
        },
        { headers: { 'Access-Control-Max-Age': 600 } },
      );

      setLayoutComp(response.data);
      setLayoutKey(response.data.map(m => m.positions));

      localStorage.removeItem('@GoJur:PublicationFilter')
      localStorage.removeItem('@GoJur:CustomerFilter')
      localStorage.removeItem('@GoJur:matterCoverId');
    }
    handleGraphics();

    // Verify first Access, new account
    if(firstAcces == 'true')
      setFirstAccessModal(true);

  }, [dragOn]);

  useEffect(() => {

    if(dragOn)
    {
      let element = document.getElementById("divButtonChangeVisibility");
      element.style.visibility = "visible";
    }
    else{
      let element = document.getElementById("divButtonChangeVisibility");
      element.style.visibility = "hidden";
    }

  }, [dragOn]);


  // If user was blocked or company has flag as suspense or canceled, remove store from current user and block his access
  useEffect(() => {
    if (abortAccess){
      localStorage.clear();
      history.push('/AbortAccess');
    }
  }, [abortAccess])


  useEffect(() => {
    handleCaptureText('')
    handleLoadingData(false)
  },[])


  useEffect(() => {
    async function handleDefaultProps() {
      try {
        type NewType = DefaultsProps;

        const response = await api.post<NewType[]>('/Defaults/Listar', { token });

        // verify if exists authorization access for user and company
        // if some of them is not valid, redirect to login
        const userAuthorization = response.data.find(auth => auth.id == "defaultUserAuthorization");

        if (userAuthorization?.value == "N"){
            setAbortAccess(true);
        }

        // verify if user need to see a video trainning at the first time access
        handleShowVideoTrainning(false)

        const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
        const permissiosnModule = userPermissions[0].value.split('|')
        if (permissiosnModule)
          handleUserPermission(permissiosnModule);

      } catch (err) {
        console.log(err);
        setAbortAccess(true);
      }
    }

    handleDefaultProps();
  }, [handleUserPermission]);


  useEffect(() => {
    if (
      alertData.filter(
        i =>
          (i.messageType === 'VM' || i.messageType === null) &&
          i.warningMessage === true,
      ).length > 0
    ) {
      handleBlockMenu();
      setOpenHighlite(true);
    }
  }, [alertData, handleBlockMenu]);
  

  const handleNewPosition = useCallback((e: GridLayout.Layout[]) => {

    const key = e.map(e => {const data = {i: e.i, x: e.x, y: e.y, h: e.h, w: e.w };
        return data;
    });

    try {
      const tokenApi = localStorage.getItem('@GoJur:token');
      api.put('/Dashboard/SalvarPosicionamentos', {
        token: tokenApi,
        type: 'homeDashBoard',
        positions: key,
      });
      addToast({
        type: 'success',
        title: 'Dashboard Alterada',
        description: 'Dashboard Alterada com sucesso',
      });
    } catch (error:any) {
      addToast({
        type: 'error',
        title: 'Falha na alteração da Dashboard',
        description: error.mesage,
      });
    }
  }, [addToast],);


  const handleCloseHighlite = useCallback(() => {
    handleUnlockMenu();
    setOpenHighlite(false);
  }, [handleUnlockMenu]);


  const layout = [
    {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
    {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
    {i: 'c', x: 4, y: 0, w: 1, h: 2}
  ];


  const CloseFirstAccess = () => {
    localStorage.removeItem('@GoJur:firstAccess');
    setFirstAccessModal(false);
  }


  const handleClose = useCallback(async (visible: string, idElement: string) => {
 
    const response = await api.post<ChangeElementsVisibleProps[]>(
      '/Dashboard/AlterarElemento',
      {
        token,
        type: 'homeDashBoard',
        idElement: idElement,
        visible: visible
      },
      { headers: { 'Access-Control-Max-Age': 600 } },
    );

    async function handleGraphics() {
      const response = await api.post<dataProps[]>(
        '/Dashboard/ListarPosicionamentos',
        {
          token,
          type: 'homeDashBoard',
          visible: "S"
        },
        { headers: { 'Access-Control-Max-Age': 600 } },
      );

      setLayoutComp(response.data);
      setLayoutKey(response.data.map(m => m.positions));

      localStorage.removeItem('@GoJur:PublicationFilter')
      localStorage.removeItem('@GoJur:CustomerFilter')
      localStorage.removeItem('@GoJur:matterCoverId');
    }
    
    handleGraphics();

    // Verify first Access, new account
    if(firstAcces == 'true')
      setFirstAccessModal(true);

  },[dragOn]);


  const handleActivePropagation = (event) => {
    setReleaseDrag(true)
  };


  const handleStopPropagation = (event) => {
    setReleaseDrag(false)
  };


  const ClickButton = (event) => {
    alert("CLICK")
  };


  const openModalChangeVisibility = () => {
    setChangeVisibilityModal(true);
  };


  const closeModalChangeVisibility = () => {
    setChangeVisibilityModal(false);

    async function handleGraphics() {
      const response = await api.post<dataProps[]>(
        '/Dashboard/ListarPosicionamentos',
        {
          token,
          type: 'homeDashBoard',
          visible: 'S'
        },
        { headers: { 'Access-Control-Max-Age': 600 } },
      );

      setLayoutComp(response.data);
      setLayoutKey(response.data.map(m => m.positions));

      localStorage.removeItem('@GoJur:PublicationFilter')
      localStorage.removeItem('@GoJur:CustomerFilter')
      localStorage.removeItem('@GoJur:matterCoverId');
    }
    handleGraphics();
  };


  return (
    <Container>
      <ModalProvider>
        {firstAccessModal && <FirstAccessModal callbackFunction={{CloseFirstAccess}} />}
        {firstAccessModal && <OverlayDashboard />}

        {CloseVisibilityModal && <ModalChangeVisibility callbackFunction={{ closeModalChangeVisibility }}/>}

        <HeaderPage />

        {openHighlite ? <HighliteModal isOpen={handleCloseHighlite} /> : null}
        {openProcessModal ? <ProcessModal /> : null}

        <Wrapper className="wrapper" onClick={() => handleShowListSearch(false)}>
          <Indicators />

          <div id='divButtonChangeVisibility' style={{display: "flex", alignItems: "center", justifyContent:"center", visibility: "hidden"}}>
            <button type="button" className='selectedButton' onClick={() => { openModalChangeVisibility() }} style={{display:'inline', zIndex: 9999}}>
              <FaEye title='Alterar Visiblidade dos Gráficos'/>
              <span>Alterar Visiblidade dos Gráficos</span>
            </button>
          </div>

          <GridLayout
            // className="layout"
            layout={layoutKey}
            cols={13}
            containerPadding={[64, 16]}
            rowHeight={30}
            width={screenWitdh}
            onDragStop={handleNewPosition}
            // onResizeStop={handleNewPosition}
            preventCollision={false}
            isDraggable={releaseDrag}
            isResizable={false}
          >
            {layoutComp?.map(item => (
              
              <Content key={item.positions.i} ref={ref} isDraggable={releaseDrag}>

                {item.type === 'homeDashBoard_procAcao' && <GraphicsProcessosPorAcao title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/> }
                {item.type === 'homeDashBoard_procMesAno' && <GraphicsNovosCasosPorMes title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/> }
                {item.type === 'homeDashBoard_procPubAlerta' && <Publicacoes title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/>}
                {item.type === 'homeDashBoard_compromissos' && <Appointment title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/>}
                {item.type === 'homeDashBoard_contasPorMes'  && <GraphicsReceitasEDespesas title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/> }
                {item.type === 'homeDashBoard_procNatureza' && <GraphicsProcessosPorNaturezaJuridica title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/> }
                {item.type === 'homeDashBoard_procDecisao'  && <GraphicsProcessosDecisaoJudicial title={item.name} idElement={item.idElement} visible={item.visible} activePropagation={handleActivePropagation} stopPropagation={handleStopPropagation} xClick={ClickButton} handleClose={handleClose} cursor/> }

              </Content>
            ))}

          </GridLayout>

        </Wrapper>

      </ModalProvider>
    </Container>
  );
};

export default Dashboard;
