/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { envProvider } from 'services/hooks/useEnv';
import { HiHome } from 'react-icons/hi';
import { FiX } from 'react-icons/fi';
import { ImUser } from "react-icons/im";
import { IoMdHelpCircle } from "react-icons/io";
import { MdLiveHelp } from "react-icons/md";
import { FaRegTimesCircle, FaTools } from 'react-icons/fa';
import { RiAlertFill } from 'react-icons/ri';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BsGearFill } from 'react-icons/bs';
import { RiFileTextFill } from 'react-icons/ri';
import { isMobile } from 'react-device-detect'
import api from 'services/api';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { RiFolder2Fill, RiNewspaperFill, RiUserAddFill, RiMoneyDollarBoxFill} from 'react-icons/ri';
import { FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { useDefaultSettings } from 'context/defaultSettings';
import { Overlay } from 'Shared/styles/GlobalStyle';
import ButtonMenu from '../Buttons/ButtonMenu';
import { Container, Content, ModalInformation, ModalImage } from './styles';

const Sidebar: React.FC = () => {
  const { addToast } = useToast();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const { permissionData, blockMenu } = useDefaultSettings();
  const history = useHistory();
  const tokenapi = localStorage.getItem('@GoJur:token');
  const baseUrl = envProvider.redirectUrl;
  const [openMenu, setOpenMenu] = useState(true);
  const [openInformationModal, setOpenInformationModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const token = localStorage.getItem('@GoJur:token');
  const { pathname, search } = useLocation();
  const checkpermissionDocument = permissionsSecurity.find(item => item.name === "CFGDCMIE");

  useEffect (() => {
    handleValidateSecurity(SecurityModule.configuration)
  },[])

  
  const handleOpenMenu = useCallback(() => {
    setOpenMenu(!openMenu);
  }, [openMenu]);


  const handleMesageNoPermission = useCallback(() => {
    addToast({
      type: 'info',
      title: 'Permissão negada',
      description:
        'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
    });
  }, [addToast]);


  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);


  const handleInformationModal = useCallback(() => {
    setOpenInformationModal(true)
  }, []);


  const CalendarRedirect = () => {
    // Save navigation log
    const response = api.post('/Usuario/SalvarLogNavegacaoUsuario', {
      token,
      module: 'MEN_AGENDA'
    });

    history.push('/calendar');
  };


  const MatterRedirect = () => {
    // Save navigation log
    const response = api.post('/Usuario/SalvarLogNavegacaoUsuario', {
      token,
      module: 'MEN_PROCESSO'
    });

    history.push('/matter/list');
  };


  const PublicationRedirect = () => {
    history.push('/publication');
  };


  const CustomerRedirect = () => {
    // Save navigation log
    if (!pathname.includes('customer'))
      api.post('/Usuario/SalvarLogNavegacaoUsuario', {token, module: 'MEN_CLIENTE'});

    history.push('/customer/list');
  };


  const FinancialRedirect = () => {
    history.push('/financeiro');
  };


  const DocumentRedirect = () => {
    // Save navigation log
    if (!pathname.includes('documentModel'))
      api.post('/Usuario/SalvarLogNavegacaoUsuario', {token, module: 'MEN_DOCUMENTOS'});

    history.push('/documentModel/list');
  };


  const Help = () => {
    window.open('https://gojur.tawk.help/', '_blank')
  };


  return (
    <Container isOpenMenu={openMenu} isBlock={blockMenu}>

      { !isMobile && <ButtonMenu onClickCapture={handleOpenMenu} title="Menu" /> }

      {permissionData.adm === 'S' ? (
        <Content isOpenMenu={openMenu} isBlock={blockMenu}>
          <Link to="/dashboard" title="Dashboard">
            <HiHome />
            <p>Home</p>
          </Link>

          <button
            type="button"
            title="Agenda"
            id="main"
            disabled={blockMenu}
            onClick={() => CalendarRedirect()}
          >
            <FaCalendarAlt />
            <p>Agenda</p>
          </button>

          <button
            type="button"
            title="Processos"
            id="main"
            disabled={blockMenu}
            onClick={() => MatterRedirect()}
          >
            <RiFolder2Fill />
            <p>Processos</p>
          </button>

          <button
            type="button"
            id="main"
            title="Central de Notificações"
            disabled={blockMenu}
            onClick={() => PublicationRedirect()}
          >
            <RiNewspaperFill />
            <p>Publicação</p>
          </button>

          <button
            type="button"
            id="main"
            title="Clientes"
            disabled={blockMenu}
            onClick={() => CustomerRedirect()}
          >
            <RiUserAddFill />
            <p>Clientes</p>
          </button>

          <button
            type="button"
            id="main"
            title="Financeiro"
            disabled={blockMenu}
            onClick={() => FinancialRedirect()}
          >
            <RiMoneyDollarBoxFill />
            <p>Financeiro</p>
          </button>

          <button
            type="button"
            id="main"
            title="Modelos de Documentos"
            disabled={blockMenu}
            onClick={() => DocumentRedirect()}
          >
            <RiFileTextFill />
            <p>Documentos</p>
          </button>

          <button
            type="button"
            id="main"
            title="Usuários"
            disabled={blockMenu}
            onClick={() => history.push('/userlist')}
          >
            <FaUsers />
            <p>Usuários</p>
          </button>
        </Content>
      ) : (
        <Content isOpenMenu={openMenu}>
          <Link to="/dashboard" title="Dashboard">
            <HiHome />
            <p>Home</p>
          </Link>
          {permissionData.calendar === 'S' ? (
            <button
              type="button"
              title="Agenda"
              id="main"
              disabled={blockMenu}
              onClick={() => CalendarRedirect()}
            >
              <FaCalendarAlt />
              <p>Agenda</p>
            </button>
          ) : (
            <button
              type="button"
              title="Agenda"
              onClick={handleMesageNoPermission}
            >
              <FaCalendarAlt />
              <p>Agenda</p>
            </button>
          )}
          {permissionData.matter === 'S' ? (
            <button
              type="button"
              title="Processos"
              disabled={blockMenu}
              id="main"
              onClick={() => MatterRedirect()}
            >
              <RiFolder2Fill />
              <p>Processos</p>
            </button>
          ) : (
            <button
              type="button"
              title="processos"
              onClick={handleMesageNoPermission}
            >
              <RiFolder2Fill />
              <p>Processos</p>
            </button>
          )}
          {permissionData.publication === 'S' ? (
            <button
              type="button"
              id="main"
              disabled={blockMenu}
              title="Central de Notificações"
              onClick={() => PublicationRedirect()}
            >
              <RiNewspaperFill />
              <p>Publicação</p>
            </button>
          ) : (
            <button
              type="button"
              title="Central de Notificações"
              onClick={handleMesageNoPermission}
            >
              <RiNewspaperFill />
              <p>Publicação</p>
            </button>
          )}
          {permissionData.customer === 'S' ? (
            <button
              type="button"
              id="main"
              title="Clientes"
              disabled={blockMenu}
              onClick={() => CustomerRedirect()}
            >
              <RiUserAddFill />
              <p>Clientes</p>
            </button>
          ) : (
            <button
              type="button"
              title="Clientes"
              onClick={handleMesageNoPermission}
            >
              <RiUserAddFill />
              <p>Clientes</p>
            </button>
          )}
          {permissionData.financial === 'S' ? (
            <button
              type="button"
              id="main"
              title="Financeiro"
              disabled={blockMenu}
              onClick={() => FinancialRedirect()}
            >
              <RiMoneyDollarBoxFill />
              <p>Financeiro</p>
            </button>
          ) : (
            <button
              type="button"
              title="Financeiro"
              onClick={handleMesageNoPermission}
            >
              <RiMoneyDollarBoxFill />
              <p>Financeiro</p>
            </button>
          )}
          {checkpermissionDocument ? (
            <button
              type="button"
              id="main"
              title="Modelos de Documentos"
              disabled={blockMenu}
              onClick={() => DocumentRedirect()}
            >
              <RiFileTextFill />
              <p>Documentos</p>
            </button>
          ) : (
            <button
              type="button"
              title="Modelos de Documentos"
              onClick={handleMesageNoPermission}
            >
              <RiFileTextFill />
              <p>Documentos</p>
            </button>
          )}
          {permissionData.user === 'S' ? (
            <button
              type="button"
              id="main"
              title="Usuários"
              disabled={blockMenu}
              onClick={() => history.push('/userlist')}
            >
              <FaUsers />
              <p>Usuários</p>
            </button>
          ) : (
            <button
              type="button"
              title="Personalize"
              onClick={handleMesageNoPermission}
            >
              <FaUsers />

              <p>Usuários</p>
            </button>
          )}
        </Content>
      )}

      <button type="button" title="Perfil" id="perfil" disabled={blockMenu} onClick={() => handleRedirect(`/usuario`,)}>
        <ImUser />
        <p>Perfil</p>
      </button>

      <button type="button" title="Ajuda GOJUR" id="perfil" disabled={blockMenu} onClick={() => Help()}>
        <MdLiveHelp />
        <p>Ajuda</p>
      </button>
      <br />

      <img src={`${envProvider.mainUrl}/assets/logo-gojur2.png`} alt="logo" />

      <ModalInformation show={openInformationModal}>
        <>
          <div className='menuSection'>
            <FiX onClick={(e) => setOpenInformationModal(false)} />
          </div>

          <div style={{margin:'-10px 15px 15px 20px'}}>
            <br />

            <div style={{float:'left'}}>
              <RiAlertFill style={{color:'#CED108', height:'25px', width:'25px'}} />
            </div>
            <div style={{float:'left', marginTop:'5px', marginLeft:'5px'}}>
              <b>ATENÇÃO - O ACESSO AOS CADASTROS DESTE MÓDULO MUDOU.</b>
            </div>

            <br />
            <br />
            Os cadastros referentes ao processo e agenda estão no menu&nbsp;
            <b>Hamburguer</b>
            &nbsp;
            <GiHamburgerMenu style={{color:'#277bf1'}} />
            &nbsp;nos respectivos módulos.
            <br />
            <br />
            Os demais cadastros estão na página inicial do GOJUR, para acessar basta clicar do botão&nbsp;
            <b>Engrenagem</b>
            &nbsp;
            <BsGearFill style={{color:'#6299e7'}} />
            &nbsp;(topo superior direito)
            &nbsp;e depois em&nbsp;
            <b>Configurações</b>
            &nbsp;
            <FaTools style={{color:'#6299e7'}} />
            &nbsp;conforme figura abaixo:
            <br />
            <br />

            <div style={{marginLeft:'9%'}}>
              <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/gojur.gif' style={{height:'300px'}} />
            </div>

            <div style={{float:'right', marginRight:'-40px'}}>
              <div style={{float:'left', width:'150px'}}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => setOpenInformationModal(false)}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </>
      </ModalInformation>

      {(openInformationModal) && <Overlay /> }

      <ModalImage show={openImageModal}>
        <>
          <header>
            <p>Novo acesso as configurações</p>
            <button type="button" onClick={() => setOpenImageModal(false)}>
              <FiX />
            </button>
          </header>

          <div>
            TESTE
          </div>
        </>
      </ModalImage>

    </Container>
  );
};

export default Sidebar;
