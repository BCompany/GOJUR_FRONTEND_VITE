/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useCallback, useEffect, useState } from 'react';
import { FiMousePointer } from 'react-icons/fi';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { envProvider } from 'services/hooks/useEnv';
import { useDevice } from "react-use-device";
import { useModal } from 'context/modal';
import { useHistory } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';
import { MenuHamburger, MenuHamburgerMobile } from './styles';

const BillingInvoiceOptionsMenu = () => {
  const { handleIsOpenMenuConfig, handleIsMenuOpen, handleCaller} = useMenuHamburguer();
  const history = useHistory();
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showConfigBilling, setShowConfigBilling] = useState<boolean>(false);
  const [showConfigOldVersion, setShowConfigOldVersion] = useState<boolean>(false);
  const [showConfigConfiguration, setShowConfigConfiguration] = useState<boolean>(false);
  const token = localStorage.getItem('@GoJur:token');
  const { isMOBILE } = useDevice();
  const baseUrl = envProvider.redirectUrl;
  
  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);

  const handleBillingContractsMenuOptions = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfig(false)
    handleIsMenuOpen(false)
    window.open(`${baseUrl}ReactRequest/Redirect?token=${token}&route=Financial/FinancialPanel`)
  }, []);

  const handleBillinginvoiceParamterModal = useCallback(() => {
    handleIsOpenMenuConfig(true)
    handleCaller('billingInvoiceModal')
    handleIsMenuOpen(false)
  }, []);

  const handleShippingFileModal = useCallback(() => {
    handleIsOpenMenuConfig(true)
    handleCaller('shippingFileModal')
    handleIsMenuOpen(false)
  }, []);

  return (
    <>

      {!isMOBILE &&(
      <MenuHamburger>
        
        <div>         
          <button
            type="button"
            className="menuLink"
            onClick={() => { handleShippingFileModal ()}}
          >
            Banco Remessa / Retorno
          </button>
        </div>

        <hr style={{width:"200px"}} />

        <div>
          <button
            type="button"
            className="menuLink"
            onClick={() => { handleBillinginvoiceParamterModal ()}}
          >
            Parâmetros de Envio de Email
          </button>
        </div>
     
      </MenuHamburger>
    )}

      {isMOBILE &&(
      <MenuHamburgerMobile>
        <div 
          className="menuSection"
          onClick={() => {setShowConfig(!showConfigBilling); setShowConfigConfiguration(!showConfigBilling)}}
        >
          <FaTools />
          &nbsp;Configurações
        </div>

        <>
          <div style={{display:(showConfigConfiguration && showConfigBilling?'grid':'none')}}>
            <hr style={{width:"200px"}} />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
              handleBillingContractsMenuOptions();
              }}
            >
              Parâmetros de Envio de Email
            </button>
          </div>
        </>
    

      </MenuHamburgerMobile>
    )}
    </>
  )
}

export default BillingInvoiceOptionsMenu