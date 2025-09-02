/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useCallback, useEffect, useState } from 'react';
import { FaTools, FaUsersCog, FaUser, FaPlus }from 'react-icons/fa';
import { BiHelpCircle } from 'react-icons/bi';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { envProvider } from 'services/hooks/useEnv';
import { useHistory } from 'react-router-dom';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { HeaderPageCustom } from './HeaderPageCustom';
import { ServiceTypeCustom } from './ServiceTypeCustom';
import { MenuHamburger } from './styles';

const HeaderPageOptionsMenu = () => {
  
  const { handleIsOpenMenuConfig, handleIsMenuOpen, handleCaller } = useMenuHamburguer();
  const history = useHistory();
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showSuport, setShowSuport] = useState<boolean>(false);
  const [showConfigPeople, setShowConfigPeople] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showConfigOthers, setShowConfigOthers] = useState<boolean>(false);
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const token = localStorage.getItem('@GoJur:token');
  const baseUrl = envProvider.redirectUrl;

  const [production, setProduction] = useState<boolean>(false);
  
  // Call security permission - passing module
  useEffect(() => {
    handleValidateSecurity(SecurityModule.configuration)
  }, [])


  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);


  // PEOPLE
  const handlePeople = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    handleIsMenuOpen(false)
    handleRedirect(`/People/List`)
  }, []);


  const handleThirdPartyGroup = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigPeople(false)
    handleIsMenuOpen(false)
    handleRedirect(`/ThirdPartyGroup`)
  }, []);


  // OTHERS
  const handleCities = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigOthers(false)
    handleIsMenuOpen(false)
    handleRedirect(`/Cities`)
  }, []);

  
  const handleHoliday = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigOthers(false)
    handleIsMenuOpen(false)
    handleRedirect(`/Holiday`)
  }, []);


  const handleEconomicIndexes = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigOthers(false)
    handleIsMenuOpen(false)
    handleRedirect(`/EconomicIndexes/List`)
  }, []);


  const handleReportParameters = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigOthers(false)
    handleIsMenuOpen(false)
    handleRedirect(`/ReportParameters`)
  }, []);

  const handleWorkflow = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigOthers(false)
    handleIsMenuOpen(false)
    handleRedirect(`/Workflow/List`)
  }, []);


  const handleProfile = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    setShowConfigOthers(false)
    handleIsMenuOpen(false)
    history.push(`/usuario`)
  }, []);

  
  // PERMISSION PEOPLE
  const checkPeople = permissionsSecurity.find(item => item.name === "CFGLAW" || item.name === "CFGEMP" || item.name === "CFGOPP" || item.name === "CFGTHIRD" || item.name === "CFGGRTHD");
  const checkThirdPartyGroup = permissionsSecurity.find(item => item.name === "CFGGRTHD");

  // PERMISSION OTHERS
  const checkCities = permissionsSecurity.find(item => item.name === "CFGSTATE");
  const checkHoliday = permissionsSecurity.find(item => item.name === "CFGHOLID");
  const checkEconomicIndexes = permissionsSecurity.find(item => item.name === "CFGINDEC");
  const checkReportParameters = permissionsSecurity.find(item => item.name === "CACRPT");
  const checkWorkflow = permissionsSecurity.find(item => item.name === "CFGWKF");

  // SUPORT LINKS
  const acessoRemotoST = `${envProvider.mainUrl}resources/bcompanyremotost.exe`;
  const acessoRemotoAD = `${envProvider.mainUrl}resources/BcompanyRemotoAD.exe`;
  const acessoRemotoMAC = `${envProvider.mainUrl}resources/BcompanyRemotoSTMAC.dmg`;
  const acessoRemotoADMAC = `${envProvider.mainUrl}resources/BcompanyRemotoADMAC.dmg`;

  const companyId = localStorage.getItem('@GoJur:companyId');

  return (
    <>
      <MenuHamburger>
        <div className="menuSection" onClick={() => handleProfile()}>
          <FaUser />
          &nbsp;Perfil
        </div>

        <hr />
        <div className="menuSection" onClick={() => setShowConfig(!showConfig)}>
          <FaTools />
          &nbsp;Configurações
        </div>

        {checkCities &&(
          <>
            <div style={{display:(showConfig?'grid':'none')}}>
              <hr />
              <button type="button" className="menuLink" onClick={() => {handleCities();}}>
                Cidade
              </button>
            </div>
          </>
        )}

        {checkEconomicIndexes &&(
          <>
            <div style={{display:(showConfig?'grid':'none')}}>
              <hr />
              <button type="button" className="menuLink" onClick={() => {handleEconomicIndexes();}}>
                Índices Econômicos
              </button>
            </div>
          </>
        )}

        {checkHoliday &&(
          <>
            <div style={{display:(showConfig?'grid':'none')}}>
              <hr />
              <button type="button" className="menuLink" onClick={() => {handleHoliday();}}>
                Feriados
              </button>
            </div>
          </>
        )}

        {checkReportParameters &&(
          <>
            <div style={{display:(showConfig?'grid':'none')}}>
              <hr />
              <button type="button" className="menuLink" onClick={() => {handleReportParameters();}}>
                Parâmetros de Relatório
              </button>
            </div>
          </>
        )}
        
        {(checkWorkflow && production == true) &&(
          <>
            <div style={{display:(showConfig?'grid':'none')}}>
              <hr />
              <button type="button" className="menuLink" onClick={() => {handleWorkflow();}}>
                Workflow
              </button>
            </div>
          </>
        )}


        <hr />
        <div className="menuSection" onClick={() => setShowConfigPeople(!showConfigPeople)}>
          <FaUsersCog />
          &nbsp;Pessoas
        </div>

        {checkPeople &&(
          <>
            <div style={{display:(showConfigPeople?'grid':'none')}}>
              <hr />
              <button title='Contrários, Advogados, Funcionários e Terceiros' type="button" className="menuLink" onClick={() => {handlePeople();}}>
                Contrários, Advogados...
              </button>
            </div>
          </>
        )}

        {checkThirdPartyGroup &&(
          <>
            <div style={{display:(showConfigPeople?'grid':'none')}}>
              <hr />
              <button type="button" className="menuLink" onClick={() => {handleThirdPartyGroup();}}>
                Grupo de Terceiro
              </button>
            </div>
          </>
        )}

        {/* S U P O R T E */}
        <hr />
        <div className="menuSection" onClick={() => setShowSuport(!showSuport)}>
          <BiHelpCircle />
          &nbsp;Suporte
        </div>

        <div style={{display:(showSuport?'grid':'none')}}>
          <hr />
          <button type="button" className="menuLink">
            <a style={{color:'inherit', textDecoration:'none'}} href={acessoRemotoST} download>Acesso Remoto - ST</a>
          </button>
        </div>

        <div style={{display:(showSuport?'grid':'none')}}>
          <hr />
          <button type="button" className="menuLink">
            <a style={{color:'inherit', textDecoration:'none'}} href={acessoRemotoMAC} download>Acesso Remoto - MAC</a>
          </button>
        </div>

        <div style={{display:(showSuport?'grid':'none')}}>
          <hr />
          <button type="button" className="menuLink">
            <a style={{color:'inherit', textDecoration:'none'}} href={acessoRemotoAD} download>Acesso Remoto 1- (AD)</a>
          </button>
        </div>

        <div style={{display:(showSuport?'grid':'none')}}>
          <hr />
          <button type="button" className="menuLink">
            <a style={{color:'inherit', textDecoration:'none'}} href={acessoRemotoADMAC} download>Acesso Remoto 1- (AD) MAC</a>
          </button>
        </div>

        <div style={{display:(showSuport?'grid':'none')}}>
          <hr />
          <button type="button" className="menuLink">
            <a style={{color:'inherit', textDecoration:'none'}} href="https://www.brasilbandalarga.com.br/bbl/" target="blank">Velocidade da internet</a>
          </button>
        </div>

        <div style={{display:(showSuport?'grid':'none')}}>
          <hr />
          <button type="button" className="menuLink">
            <a style={{color:'inherit', textDecoration:'none'}} href="https://gojur.tawk.help/" target="blank">Ajuda GOJUR</a>
          </button>
        </div>
      </MenuHamburger>
    </>
  )
}

export default HeaderPageOptionsMenu