/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useEffect, useState, useCallback } from 'react';
import { BsFillPeopleFill }from 'react-icons/bs';
import { AiOutlinePrinter } from 'react-icons/ai';
import { FaBusinessTime, FaTools } from 'react-icons/fa';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useCustomer } from 'context/customer'
import { envProvider } from 'services/hooks/useEnv';
import { useHistory } from 'react-router-dom';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { MenuHamburger } from './styles';

const CustomerListOptionsMenu = () => {
  
  const history = useHistory();  
  const { handleIsOpenMenuReport,handleIsOpenMenuConfig, handleIsMenuOpen, isOpenMenuConfig, isOpenMenuReport } = useMenuHamburguer();
  const { handleOpenBirthdayModal, handleOpenCustomerListModal, handleOpenCustomerMergeModal } = useCustomer();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const [showConfigMenu, setShowConfigMenu] = useState<boolean>(false)  // Permission
  const token = localStorage.getItem('@GoJur:token');
  
  // Call security permission - passing module
  useEffect(() => {

    handleValidateSecurity(SecurityModule.customer)
    
  }, [])
    

  const handleCustomerGroup = useCallback(() => {
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    history.push(`/CustomerGroup`)
  }, []);

  
  // accessCodes Permissions
  const showSalesFunnelMenu = permissionsSecurity.find(item => item.name === "CFGSFUNI");
  const showBusinessDashboard = permissionsSecurity.find(item => item.name === "CFGSDASH");
  const showSalesChannelMenu = permissionsSecurity.find(item => item.name === "CFGCHANE");
  const showCustomerMergeMenu = permissionsSecurity.find(item => item.name === "CSTMRG");
  const checkCustomerGroup = permissionsSecurity.find(item => item.name === "CFGGRCST");
  
  return (

    <MenuHamburger>

      {checkCustomerGroup &&(
        <>
          <div className="menuSection" onClick={() => setShowConfigMenu(!showConfigMenu)}>
            <FaTools />
            &nbsp;&nbsp;Configurações
          </div>
                    
          <div style={{display:(showConfigMenu?'grid':'none')}}>
            <hr />
            <button
              type="button"
              className="menuLink"
              onClick={() => {
                handleCustomerGroup()
              }}
            >
              Grupo de Clientes
            </button>
          </div>

          {showSalesChannelMenu && (
            <div style={{display:(showConfigMenu?'grid':'none')}}>
              <hr />
              <button
                type="button"
                className="menuLink"
                onClick={() => {
                  handleIsMenuOpen(false)
                  history.push(`/CRM/configuration/salesChannel`)
                }}
              >
                Canal de vendas
              </button>
            </div>
          )}
          <hr />
        </>
      )}
      
      <div 
        className="menuSection"
        onClick={() => handleIsOpenMenuReport(!isOpenMenuReport)}
      >
        <AiOutlinePrinter />
        &nbsp;Relatórios
      </div>
              
      <div style={{display:(isOpenMenuReport?'grid':'none')}}>
        <hr />
        <button
          type="button"
          className="menuLink"
          onClick={() => {
            handleIsOpenMenuReport(!isOpenMenuReport)
            handleIsMenuOpen(false)
            handleOpenCustomerListModal()
          }}
        >
          Listagem de clientes
        </button>

        <button
          type="button"
          className="menuLink"
          onClick={() => {
            handleIsOpenMenuReport(!isOpenMenuReport)
            handleIsMenuOpen(false)
            history.push(`/customer/printer/label`)
          }}
        >
          Etiquetas de clientes
        </button>

        <button
          type="button"
          className="menuLink"
          onClick={() => {
            handleIsOpenMenuReport(!isOpenMenuReport)
            handleIsMenuOpen(false)
            handleOpenBirthdayModal()          
          }}
        >
          Listagem de aniversariantes
        </button>
      </div>
      <hr />
      <div 
        className="menuSection"
        onClick={() => handleIsOpenMenuConfig(!isOpenMenuConfig)}
      >
        <FaBusinessTime />
        &nbsp;Negócios
      </div>

      <div style={{display:(isOpenMenuConfig?'grid':'none')}}>
        <hr />
          
        {showSalesFunnelMenu && (
          <button
            type="button"
            className="menuLink"
            onClick={() => {
              handleIsOpenMenuConfig(!isOpenMenuConfig)
              handleIsMenuOpen(false)
              history.push(`/CRM/salesFunnel`)
            }}
          >
            Funil de Vendas
          </button>
        )}
        <hr />
        {' '}
        {showBusinessDashboard && (
          <button
            type="button"
            className="menuLink"
            onClick={() => {
              handleIsOpenMenuConfig(!isOpenMenuConfig)
              handleIsMenuOpen(false)
              history.push(`/CRM/Dashboard`)
            }}
          >
            Dashboard
          </button>
        )}
      </div>     

      <hr />

      {showCustomerMergeMenu &&(
        <button
          type="button"
          className="menuSection"
          onClick={() => {
            handleIsMenuOpen(false)
            handleOpenCustomerMergeModal()
          }}
        >
          <BsFillPeopleFill />
          &nbsp;Mesclar clientes
        </button>
      )}

    </MenuHamburger>

  )
}

export default CustomerListOptionsMenu