/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useState, useEffect } from 'react';
import { BsFillCameraVideoFill }from 'react-icons/bs';
import { FiPaperclip,FiCopy } from 'react-icons/fi';
import { FaTools, FaTabletAlt } from 'react-icons/fa';
import { SiMailDotRu } from 'react-icons/si';
import { FaUserEdit, FaWindowRestore } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useModal } from 'context/modal';
import { MenuHamburger } from './styles';

const PublicationOptionsMenu = (props) => {

  const {handleCopyClipBoard, handlePrintSelectPublications, handleCoveragesList, handleAssociatedAllProcess, handleModalPublicationName, handleModalPublicationEmail } = props.callbackList;
  const history = useHistory();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const { handleIsMenuOpen } = useMenuHamburguer();
  const { handleShowVideoTrainning } = useModal();
  const [checkEletronicIntimation, setCheckEletronicIntimation] = useState<boolean>(false);
  const companyId = localStorage.getItem('@GoJur:companyId');

  // Call security permission - passing module
  useEffect(() => {
    handlePermission()
  }, [])

  const handlePermission = async () => {
    await handleValidateSecurity(SecurityModule.publication)

    const checkPermission = permissionsSecurity.find(item => item.name === "PUBINTEL");
    if(checkPermission)
    {
      setCheckEletronicIntimation(true)
    }
  }

  const HandleEletronicIntimation = () => {
    history.push(`/EletronicIntimation`)
  }

  
  const handleMatterStatusOperation = () => {
    history.push(`/Matter/monitoring`)
  };


  const HandlePublicationConfiguration = () => {
    history.push(`/PublicationConfiguration`)
  }

  
  return (

    <MenuHamburger>

      <div className="menuSection" onClick={HandlePublicationConfiguration}>
        <FaTools /> 
        &nbsp;&nbsp;Configurações
        <hr />
      </div>
      
      {(checkEletronicIntimation && companyId == "6291") && (
        <div className="menuSection" onClick={HandleEletronicIntimation}>
          <FaTabletAlt /> 
          &nbsp;&nbsp;Intimação Eletrônica
          <hr />
        </div>
      )}

      {/* <div className="menuSection" onClick={handleModalPublicationEmail}>
        <SiMailDotRu /> 
        &nbsp;&nbsp;Perfil de Envio de e-mail
        <hr />
      </div>
      
      <div className="menuSection" onClick={handleModalPublicationName}>
        <FaUserEdit />
        &nbsp;&nbsp;Filtrar por nome
        <hr />
      </div> */}

      <div className="menuSection" onClick={handlePrintSelectPublications}>
        <FiPaperclip />
        &nbsp;&nbsp;Imprimir public./acomp. selecionados
        <hr />
      </div>

      <div className="menuSection" onClick={handleAssociatedAllProcess}>
        <FiCopy />  
        &nbsp;&nbsp;Associar todos os processos
        <hr />
      </div>

      <div className="menuSection" onClick={handleCopyClipBoard}>
        <FaWindowRestore />
        &nbsp;&nbsp;Copiar para área de transferência
        <hr />
      </div>

      <div className="menuSection" onClick={handleCoveragesList}>
        <FiPaperclip />
        &nbsp;&nbsp;Lista Abrangências Publicações
        <hr /> 
      </div>

      <div className="menuSection" onClick={handleMatterStatusOperation}>
        <FiPaperclip />
        &nbsp;&nbsp;Lista Abrangências Tribunal (Monitor)
        <hr /> 
      </div>

      <div 
        className="menuSection"
        onClick={() => { handleIsMenuOpen(false); handleShowVideoTrainning(true) }}
      >
        <BsFillCameraVideoFill />
        &nbsp;Video de Treinamento
      </div>

    </MenuHamburger>

  )
}

export default PublicationOptionsMenu