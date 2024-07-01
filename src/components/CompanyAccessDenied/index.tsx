/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import { envProvider } from 'services/hooks/useEnv';
import { Container } from './style';

interface AccessDeniedData
{
  title?:string;
  description?: string;
  removeFixedMessages?:boolean;
  gojurMessage?: string;
  handleCloseModal: () => void
}


const CompanyAccessDenied: React.FC<AccessDeniedData> = ({ description, title, handleCloseModal, gojurMessage = '', removeFixedMessages = false}) =>
{ 
  const history = useHistory();

    const handleRedirectPage = () => {
      history.push('/changeplan')
      handleCloseModal()
    }

    // if there is no text define default on title
    if (!title){
      title = "Faça o upgrade do plano FREE."
    }

    return (

      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content-medium"
      >
        <button
          type="button"
          className="react-modal-close"
          onClick={handleCloseModal}
        >
          <FiX size={20} />
        </button>

        <Container>

          <div>
            <img src={`${envProvider.mainUrl}/assets/logo-gojur2.png`} alt="logo" />
          </div>

          <div className='warning'>
            {title}
          </div>

          {!removeFixedMessages && (
            <div className='information'>
              {gojurMessage == ''?  'Esta função fica disponível no plano FREE apenas por alguns dias, se quiser continuar usando faça o upgrade e libere todas as funções do GOJUR.': gojurMessage }
            </div>
          )}

          <div className='information'>
            {description}
          </div>

          {!removeFixedMessages && (
            <div className='information'>             
              {' '}
              <span onClick={handleRedirectPage}>Clique aqui</span>
              {' '}
              para contratar um de nossos planos.
            </div>
          )}

        </Container>

      </Modal>
    )
}

export default CompanyAccessDenied
