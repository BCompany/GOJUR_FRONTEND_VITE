/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useCallback, useEffect, useState } from 'react';
import { FaTools }from 'react-icons/fa';
import { AiOutlinePrinter } from 'react-icons/ai';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useHistory } from 'react-router-dom';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { VerifyCompanyPlanAccess } from 'Shared/utils/commonFunctions';
import CompanyAccessDenied from 'components/CompanyAccessDenied';
import { MenuHamburger, MenuHamburgerMobile } from './styles';

const CalendarListOptionsMenu = () => {

  const { handleIsOpenMenuReport, handleIsOpenMenuConfig, handleIsMenuOpen, handleCaller, isOpenMenuConfig, isOpenMenuReport, handleOpenOldVersion, isOpenOldVersion } = useMenuHamburguer();
  const { handleShowVideoTrainning } = useModal();
  const history = useHistory();
  const [showReportMenu, setShowReportMenu] = useState<boolean>(false);
  const [showReportConfig, setShowReportConfig] = useState<boolean>(false);
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const { isMOBILE } = useDevice();
  const [blockAccess, setBlockAccess] = useState(false)
  const [checkSubject, setCheckSubject] = useState<boolean>(false);
  const [checkReport, setCheckReport] = useState<boolean>(false);

  // Call security permission - passing module
  useEffect(() => {
    handlePermission()
  }, [])

  // Calendar export Feature will always block if user is a Free plan
  // As decided by Marcelo 01/08/2022
  const handlePlan = async () =>
  {
    const forceBlockFreePlan = true;
    const permissionAccessPlan = await VerifyCompanyPlanAccess(forceBlockFreePlan)

    if (permissionAccessPlan === 'blocked')
    {
      setBlockAccess(true)  // when true show modal warning fir free plan
      return;
    }

    handleIsOpenMenuConfig(true)
    handleCaller("exportConfig")
    setShowReportConfig(false)
    handleIsMenuOpen(false)
  }

  const handlePermission = async () => {
    await handleValidateSecurity(SecurityModule.calendar)

    const checkSubjectPermission = permissionsSecurity.find(item => item.name === "CLDISSUE");
    if(checkSubjectPermission)
    {
      setCheckSubject(true)
    }

    const checkReportPermission = permissionsSecurity.find(item => item.name === "CLDRPT");
    if(checkReportPermission)
    {
      setCheckReport(true)
    }
  }

  const handleParameterModal = useCallback(() => {
    handleIsOpenMenuConfig(true)
    handleCaller("parameterCalendarModal")
    setShowReportConfig(false)
    handleIsMenuOpen(false)
  }, []);

  const handleExportConfig = useCallback(() => {
    handlePlan()
  }, []);

  const handleSujectModal = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowReportConfig(false)
    handleIsMenuOpen(false)
    history.push(`/Subject`)
  }, []);

  const handleCalendarReportModal = useCallback(() => {
    handleIsOpenMenuReport(true)
    handleCaller('calendarReportModal')
    setShowReportMenu(false)
    handleIsMenuOpen(false)
  }, []);

  const handleCloseModalPlan = () => {
    setBlockAccess(false)
  }

  if (blockAccess){

    return (
      <CompanyAccessDenied
        description="Com esta nova funcionalidade é possível integrar automaticamente a sua agenda do GOJUR em diversos gerenciadores de email do mercado, como o Google Calendar, Outlook, Apple, dentre outros"
        gojurMessage="Esta função não está disponível para o plano FREE,  caso deseje utilizar o faça o upgrade e libere todas as funções do GOJUR."
        handleCloseModal={handleCloseModalPlan}
      />
    )

  }

  return (
    <>
      {!isMOBILE && (
        <MenuHamburger>

          <div
            className="menuSection"
            onClick={() => setShowReportConfig(!showReportConfig)}
          >
            <FaTools />
            &nbsp;Configurações
          </div>

          <div style={{display:(showReportConfig?'grid':'none')}}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleParameterModal();
              }}
            >
              Parâmetros
            </button>
          </div>

          <div style={{display:(showReportConfig?'grid':'none')}}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleExportConfig();
              }}
            >
              <p>Exportar Agenda</p> 
              <p style={{width:"225px"}}>(Google Agenda, Outlook, Iphone)</p>
            </button>
          </div>

          {checkSubject &&(
            <>
              <div style={{display:(showReportConfig?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleSujectModal();
                  }}
                >
                  Assunto Agenda
                </button>
              </div>
            </>
          )}

          {checkReport && (
            <>
              <hr />
              <div
                className="menuSection"
                onClick={() => { handleCalendarReportModal() }}
              >
                <AiOutlinePrinter />
                &nbsp;Relatório de Compromissos
              </div>
            </>
          )}

          <hr />
          <div
            className="menuSection"
            onClick={() => { handleIsMenuOpen(false); handleShowVideoTrainning(true) }}
          >
            <BsFillCameraVideoFill />
            &nbsp;Video de Treinamento
          </div>
        </MenuHamburger>
      )}

      {isMOBILE && (
        <MenuHamburgerMobile>

          <div
            className="menuSection"
            onClick={() => setShowReportConfig(!showReportConfig)}
          >
            <FaTools />
            &nbsp;Configurações
          </div>

          <div style={{display:(showReportConfig?'grid':'none')}}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleParameterModal();
              }}
            >
              Parâmetros
            </button>
          </div>

          <div style={{display:(showReportConfig?'grid':'none')}}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleExportConfig();
              }}
            >
              <p>Exportar Agenda</p> 
              <p style={{width:"145px"}}>(Google Agenda, Outlook, Iphone)</p>
            </button>
          </div>

          {checkSubject &&(
            <>
              <div style={{display:(showReportConfig?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleSujectModal();
                  }}
                >
                  Assunto Agenda
                </button>
              </div>
            </>
          )}

          {checkReport && (
            <>
              <hr />
              <div
                className="menuSection"
                onClick={() => { handleCalendarReportModal() }}
              >
                <AiOutlinePrinter />
                &nbsp;Relatório de Compromissos
              </div>
            </>
          )}

          <hr />
          <div
            className="menuSection"
            onClick={() => { handleIsMenuOpen(false); handleShowVideoTrainning(true) }}
          >
            <BsFillCameraVideoFill />
            &nbsp;Video de Treinamento
          </div>
        </MenuHamburgerMobile>
      )}

    </>
  )
}

export default CalendarListOptionsMenu
