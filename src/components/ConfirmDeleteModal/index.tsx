import React, { useState, useEffect, useCallback } from 'react';
import { BsCheckBox } from 'react-icons/bs';
import { TiCancel } from 'react-icons/ti';
import Loader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';
import { useToast } from 'context/toast';
import { FiPlus,FiX } from 'react-icons/fi';
import { FcViewDetails } from 'react-icons/fc';
import { MdBlock } from 'react-icons/md';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from 'services/api';
import { Container, ContainerDetails } from './styles';

export default function ConfirmDeleteModal (props) {
    const {handleCloseConfirmDelete, handleConfirmDelete} = props.callbackFunction
    const token = localStorage.getItem('@GoJur:token');
    const [checkConfirm, setCheckConfirm] = useState(false)
    const [confirmClick, setConfirmClick] = useState(false);
  
    const handleCheckConfirm = useCallback((value:boolean) => {
      setCheckConfirm(value)
    }, []);


    const handleConfirm = () => {

        handleConfirmDelete()
           
      // if check marcado
      // handleConfirmDelete

      // else
      // exibe a mensagem e return
    }    

  
    return (
     
        <Container>
          <ContainerDetails>
          <header>
            <h1>Deletar Compromisso</h1>
          </header>

          <div>
            <p>Deseja realmente apagar este compromisso ?</p>
          </div>

          {/* <div>
            <p>
              <input type='checkbox' onChange={()=>handleCheckConfirm(!checkConfirm)} />
              {' '}
              <span className='checkMessage'>
                Marque a confirmação da operação acima antes de prosseguir!
              </span>
            </p>
          </div> */}
  
          {/* <br /> */}

          <footer>
            <button
              className="accept"
              type="button"
              onClick={handleConfirm}
            >
              <BsCheckBox />
              Confirmar
            </button>

            <button
              className="cancel"
              type="button"
              onClick={handleCloseConfirmDelete}
            >
              <TiCancel />
              Cancelar
            </button>


          </footer>
  
          </ContainerDetails>
        </Container>
    )
  }