/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useEffect, useState, useCallback } from 'react';
import api from 'services/api';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { envProvider } from 'services/hooks/useEnv';

export const CustomerCustomMatter = ( ) => {
  
  const [hasCustomizationReport, setHasCustomizationReport] = useState<boolean>(false)
  const { handleIsOpenMenuReport,handleIsOpenMenuConfig, handleOpenOldVersion, handleIsOpenMenuSearch, handleIsMenuOpen, handleIsOpenMenuHelp, isOpenMenuConfig, isOpenMenuReport, isOpenMenuSearch } = useMenuHamburguer();
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const [showConfigMenu, setShowConfigMenu] = useState<boolean>(false)
  const companyId = localStorage.getItem('@GoJur:companyId');

  useEffect(() => {
    VerifyCustomizationCompany();
  },[])

  // Verify if exists customization report 'PETROBRAS' 
  const VerifyCustomizationCompany = async () => {
  try {

    const response = await api.post<boolean>('/Customizacoes/Listar', {
      module: 'MATTERREPORTLIST',
      token
    });

    setHasCustomizationReport(response.data)
          
    return response.data;
    
  } catch (err) {
    console.log(err);
    return false;
  }
}

const handleMatterReportBCO_ID4817List = useCallback(() => {
  handleIsOpenMenuConfig(!isOpenMenuConfig)
  setShowConfigMenu(false)
  handleIsMenuOpen(false)
  history.push(`/Matter/report/BCO_ID4817`)
}, []);



  // Only companie 4817 has custom report, and for test I add 33 as well
  if (hasCustomizationReport && (companyId === "4817" || companyId === "33" || companyId === "6291")){
    return (
      <button
        type="button"
        className="menuLink"
        // onClick={() => {window.open(`${envProvider.redirectUrl}Custom/BCO_ID4817MatterReport/MatterReportList?token=${token}`)}}
        onClick={() => {
          handleMatterReportBCO_ID4817List()
        }}
      >
        Rel. de Processos Petrobras
      </button>
    )
  }
  
  return null;
}