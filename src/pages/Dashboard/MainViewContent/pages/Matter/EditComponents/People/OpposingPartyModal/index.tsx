import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import { useModal } from 'context/modal';
import LoaderWaiting from 'react-spinners/ClipLoader';
import {FiSave } from 'react-icons/fi';
import { OpposingPartyData } from 'context/Interfaces/PeoplesModal';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { FaRegTimesCircle } from 'react-icons/fa';
import { ModalOpposingParty, ModalOpposingPartyMobile } from './styles';

const OpposingPartyEdit = (props) => {

  const { handleUpdateNewOpossing } = props.callbackFunction

  const { addToast } = useToast();
  const { handleShowOpposingPartyModal } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [value, setOpposingDescription] = useState<string>("");
  const { isMOBILE } = useDevice();


  const handleSave = useCallback(async()  => {

    try
    {
      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })

        return;
      }

      if (value === '') {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo nome deve ser preenchido`
        })

        return;
      }

      setisSaving(true)
      const response = await api.post<OpposingPartyData>('/ParteContraria/Salvar', {
        id: 0,
        nom_Pessoa: value,
        token
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `A parte contrária foi salva com sucesso`
      })

      handleUpdateNewOpossing(response.data)
      handleOpposingPartyModalClose();

    }
    catch(err){
      setisSaving(false)
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: `Houve uma falha ao salvar a parte contrária`
      })
      console.log(err)
    }

  },[isSaving,value])

  const handleOpposingPartyModalClose = () => {
    setOpposingDescription("")
    handleShowOpposingPartyModal(false)

  }

  return (
    <>

      <div>
        {!isMOBILE &&(
        <Modal
          isOpen
          overlayClassName="react-modal-overlay"
          className="react-modal-peoplesModal"

        >
          <ModalOpposingParty>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Contrário

              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Nome
                <br />
                <input
                  maxLength={50}
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOpposingDescription(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <br />
              <br />
              <br />
              <div style={{float:'right', marginRight:'12px'}}>
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> handleSave()}
                    style={{width:'100px'}}
                  >
                    <FiSave />
                    Salvar
                  </button>
                </div>

                <div style={{float:'left', width:'100px'}}>
                  <button
                    type='button'
                    className="buttonClick"
                    onClick={() => handleOpposingPartyModalClose()}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalOpposingParty>
        </Modal>

        )}
      </div>

      {isMOBILE &&(
        <Modal
          isOpen
          overlayClassName="react-modal-overlay"
          className="react-modal-peoplesModalMobile"

        >
          <ModalOpposingPartyMobile>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Contrário

              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'10px'}}>
                Nome
                <br />
                <input
                  maxLength={50}
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOpposingDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <br />
              <br />
              <br />
              <div style={{float:'right', marginRight:'5px'}}>
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> handleSave()}
                    style={{width:'90px'}}
                  >
                    <FiSave />
                    Salvar
                  </button>
                </div>

                <div style={{float:'left', width:'100px'}}>
                  <button
                    type='button'
                    className="buttonClick"
                    onClick={handleOpposingPartyModalClose}
                    style={{width:'90px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalOpposingPartyMobile>
        </Modal>
      )}
      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Salvando cliente ...
          </div>
        </>
      )}
    </>
  )

}

export default OpposingPartyEdit;
