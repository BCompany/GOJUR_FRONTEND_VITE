/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useCallback, useEffect, useState } from 'react';
import { FaTools }from 'react-icons/fa';
import { AiOutlinePrinter, AiOutlineEnter } from 'react-icons/ai';
import { HiOutlineSearch } from 'react-icons/hi'
import { BsFillCameraVideoFill }from 'react-icons/bs';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useConfirmBox } from 'context/confirmBox';
import { envProvider } from 'services/hooks/useEnv';
import { CustomerCustomMatter } from 'pages/Dashboard/MainViewContent/pages/Customer/Matter/CustomerCustom';
import { IDefaultsProps } from 'pages/Printers/Interfaces/Common/ICommon';
import api from 'services/api';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { FcBadDecision, FcApproval} from 'react-icons/fc'
import { MenuHamburger, Container, WarningModal } from './styles';
import CredentialModal from 'pages/Dashboard/MainViewContent/pages/Matter/Credentials';
import { Overlay } from 'Shared/styles/GlobalStyle';

const MatterListOptionsMenu = () => {

  const [showConfigMenu, setShowConfigMenu] = useState<boolean>(false)
  const [showCredentials, setShowCredentials] = useState<boolean>(false)
  const [showReportMenu, setShowReportMenu] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [redirectToOldVersion, setRedirectToOldVersion] = useState<boolean>(false)
  const [searchMenu, setSearchMenu] = useState<boolean>(false)
  const { handleCancelMessage,handleCaller, handleConfirmMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const { 
          handleIsOpenMenuConfig, 
          handleOpenOldVersion, 
          handleIsOpenMenuSearch, 
          handleIsMenuOpen, 
          handleIsOpenMenuHelp, 
          isOpenMenuConfig, 
          isOpenMenuSearch } = useMenuHamburguer();
  const [hasMatterReport, setHasMatterReport] = useState<boolean>(false)
  const { pathname } = useLocation();
  const history = useHistory();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    if (redirectToOldVersion){
      setShowWarning(false)
      handleMatterDetailsOld();
    }

  }, [redirectToOldVersion])

  // Call security permission - passing module
  useEffect(() => {
    handleValidateSecurity(SecurityModule.matter)
  }, [])

  useEffect(() => {
    LoadDefaultProps();
  },[])

  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      // get values from permission by user and set as true or false
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      const permissiosnModule = userPermissions[0].value.split('|')
      const matterReportButton = permissiosnModule.find(item => item === 'matterReport' || item === 'adm')

      if(matterReportButton)
        setHasMatterReport(true)

    } catch (err) {
      console.log(err);
    }
  }

  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);

  const handleRedirectOldVersion = () => {
    const token = localStorage.getItem('@GoJur:token');
    const baseUrl = envProvider.redirectUrl;

    handleRedirect(`${baseUrl}ReactRequest/Redirect?token=${token}&route=main/globalWs&module=Matter`)
  }

  useEffect(() => {

    if (isCancelMessage && caller === 'matterListOldVersion'){
      handleCancelMessage(false)
      handleOpenOldVersion(false)
      handleCaller('')
    }

  },[isCancelMessage])

  useEffect(() => {

    if (isConfirmMessage && caller == 'matterListOldVersion'){
      handleRedirectOldVersion()
      handleConfirmMessage(false)
      handleCaller('')
    }

  },[isConfirmMessage])


  const handleLegalNatureList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/LegalNature`)
  }, []);

  const handleRiteList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/Rite`)
  }, []);

  const handleMatterPhaseList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/MatterPhase`)
  }, []);

  const handleMatterStatusList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/MatterStatus`)
  }, []);

  const handleMatterProbabilityList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/MatterProbability`)
  }, []);

  const handleMatterSolutionList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/MatterSolution`)
  }, []);

  const handleCourtDeptList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/CourtDept`)
  }, []);

  const handleMatterEventTypeList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/MatterEventType`)
  }, []);

  const handleLegalCauseList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/LegalCause`)
  }, []);

  const handleAdvisoryTypeList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/AdvisoryType`)
  }, []);

  const handleMatterDemandTypeList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/MatterDemandType`)
  }, []);

  const handleCourtList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/Court`)
  }, []);

  const handlePositionList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/Position`)
  }, []);

  const handleDocumentTypeList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/DocumentType`)
  }, []);

  const handleMatterReportSimpleList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/Matter/report/simple`)
  }, []);

  const handleMatterDemandReportList = useCallback(() => {
    handleIsOpenMenuConfig(!isOpenMenuConfig)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/Matter/report/MatterDemand`)
  }, []);

  const checkLegalCause = permissionsSecurity.find(item => item.name === "CFGLGCAU");
  const checkMatterPhase = permissionsSecurity.find(item => item.name === "CFGMATPH");
  const checkLegalNature = permissionsSecurity.find(item => item.name === "CFGLGNAT");
  const checkMatterProbability = permissionsSecurity.find(item => item.name === "CFGMATPB");
  const checkRite = permissionsSecurity.find(item => item.name === "CFGRIT");
  const checkMatterSolution = permissionsSecurity.find(item => item.name === "CFGMATSL");
  const checkMatterStatus = permissionsSecurity.find(item => item.name === "CFGMATST");
  const checkMatterEventType = permissionsSecurity.find(item => item.name === "CFGMEVTP");
  const checkMatterDemandType = permissionsSecurity.find(item => item.name === "CFGMDETP");
  const checkCourtDept = permissionsSecurity.find(item => item.name === "CFGCRDEP");
  const checkAdvisoryType = permissionsSecurity.find(item => item.name === "CFGCONTP");
  const checkCourt = permissionsSecurity.find(item => item.name === "CFGCOURT");
  const checkPosition = permissionsSecurity.find(item => item.name === "CFGPOSIT");
  const checkDocumentType = permissionsSecurity.find(item => item.name === "CFGTPDOC");


  const { id } = useParams() as { id: string; }



  const handleMatterDetailsOld = () => {

    const urlRedirect = `${envProvider.redirectUrl}main/globalWs?module=Matter&parameters=caller=matter%2C%26matterId=${id}&token=${token}`;
    window.location.href = urlRedirect;
  }

  const handleCloseCredentialModal = async () => {
    setShowCredentials(false)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
  };

  const openCredentialModal = useCallback(() => {
    setShowCredentials(true)
  }, [showCredentials]);

  return (
    <Container>
      
      {showCredentials && <CredentialModal callbackFunction={{ handleCloseCredentialModal }} />}
  
      {!showCredentials && (
        <MenuHamburger>
          <div className="menuSection" onClick={() => setShowConfigMenu(!showConfigMenu)}>
            <FaTools />
            &nbsp;&nbsp;Configurações
          </div>
  
          <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleIsOpenMenuConfig(!isOpenMenuConfig);
                setShowConfigMenu(false);
              }}
            >
              Parâmetros do Processo
            </button>
          </div>
  
          <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                openCredentialModal();
              }}
            >
              Credenciais
            </button>
          </div>
  
          {checkLegalCause && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleLegalCauseList();
                  }}
                >
                  Ação Judicial
                </button>
              </div>
            </>
          )}
  
          {checkAdvisoryType && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleAdvisoryTypeList();
                  }}
                >
                  Assunto Consultivo
                </button>
              </div>
            </>
          )}
  
          {checkMatterPhase && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterPhaseList();
                  }}
                >
                  Fase Processual
                </button>
              </div>
            </>
          )}
  
          {checkCourt && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleCourtList();
                  }}
                >
                  Fórum
                </button>
              </div>
            </>
          )}
  
          {checkLegalNature && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleLegalNatureList();
                  }}
                >
                  Natureza Jurídica
                </button>
              </div>
            </>
          )}
  
          {checkPosition && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handlePositionList();
                  }}
                >
                  Posição no Processo
                </button>
              </div>
            </>
          )}
  
          {checkMatterProbability && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterProbabilityList();
                  }}
                >
                  Probabilidade do Processo
                </button>
              </div>
            </>
          )}
  
          {checkRite && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleRiteList();
                  }}
                >
                  Rito
                </button>
              </div>
            </>
          )}
  
          {checkMatterSolution && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterSolutionList();
                  }}
                >
                  Solução do Processo
                </button>
              </div>
            </>
          )}
  
          {checkMatterStatus && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterStatusList();
                  }}
                >
                  Status do Processo
                </button>
              </div>
            </>
          )}
  
          {checkMatterEventType && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterEventTypeList();
                  }}
                >
                  Tipo de Acompanhamento
                </button>
              </div>
            </>
          )}
  
          {checkDocumentType && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleDocumentTypeList();
                  }}
                >
                  Tipo de Documento
                </button>
              </div>
            </>
          )}
  
          {checkMatterDemandType && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterDemandTypeList();
                  }}
                >
                  Tipo de Pedido do Processo
                </button>
              </div>
            </>
          )}
  
          {checkCourtDept && (
            <>
              <div style={{ display: showConfigMenu ? 'grid' : 'none' }}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleCourtDeptList();
                  }}
                >
                  Vara
                </button>
              </div>
            </>
          )}
  
          <hr />
  
          <div className="menuSection" onClick={() => setShowReportMenu(!showReportMenu)}>
            <AiOutlinePrinter />
            &nbsp;Relatórios
          </div>
  
          <div style={{ display: showReportMenu ? 'grid' : 'none' }}>
            <hr />
            {hasMatterReport && (
              <>
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterReportSimpleList();
                  }}
                >
                  Relatório de Processos
                </button>
  
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleMatterDemandReportList();
                  }}
                >
                  Relatório - Proc x Pedidos
                </button>
              </>
            )}
  
            <CustomerCustomMatter />
          </div>
  
          <hr />
  
          <div className="menuSection" onClick={() => setSearchMenu(!searchMenu)}>
            <HiOutlineSearch />
            &nbsp;Buscas
          </div>
  
          <div style={{ display: searchMenu ? 'grid' : 'none' }}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleIsOpenMenuSearch(!isOpenMenuSearch);
                handleIsMenuOpen(false);
              }}
            >
              Criar nova busca por OAB
            </button>
          </div>
  
          {pathname.includes('/matter/list') && (
            <>
              <hr />
              <div
                className="menuSection"
                onClick={() => {
                  handleIsOpenMenuHelp(true);
                  handleIsMenuOpen(false);
                }}
              >
                <BsFillCameraVideoFill />
                &nbsp;&nbsp;Video de Treinamento
              </div>
            </>
          )}
        </MenuHamburger>
      )}
  
      {showWarning && (
        <WarningModal>
          <div>
            <h2>Aviso</h2>
          </div>
  
          <hr />
  
          <div>
            Recomendamos utilizar a versão nova, a versão antiga será desativada em <b>15/06</b>
          </div>
  
          <footer>
            <div>
              <button
                className="buttonLinkClick"
                title="Clique para acessar a versão anterior"
                type="submit"
                onClick={() => setRedirectToOldVersion(true)}
              >
                <FcApproval />
                Acessar
              </button>
            </div>
  
            <div>
              <button
                className="buttonLinkClick"
                title="Clique para fechar a janela e cancelar o acesso a versão anterior"
                type="submit"
                onClick={() => setShowWarning(false)}
              >
                <FcBadDecision />
                Cancelar
              </button>
              <br />
            </div>
            <br />
          </footer>
        </WarningModal>
      )}
    </Container>
  );
}

export default MatterListOptionsMenu
