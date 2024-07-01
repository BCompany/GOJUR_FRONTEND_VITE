/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { FiSave } from 'react-icons/fi';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { ModalMatterEventType, ModalMatterEventTypeMobile } from './styles';

export interface IMatterEventTypeData {
  id: string;
  value: string;
  count: string;
}

const MatterEventTypeEdit = (props) => {

  const {handleSaveCallback, handleCloseModalCallback}  = props.callbackFunctions

  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller ,caller, modalActiveId } = useModal();
  const [value, setMatterEventTypeDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectMatterEventType(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectMatterEventType = useCallback(async(id: number) => {

    const response = await api.post<IMatterEventTypeData>('/TipoAcompanhamento/Editar', {
      id,
      token
    })

    setMatterEventTypeDescription(response.data.value)


    // Open modal after load data
    handleModalActive(true)

  },[value]);

  const saveMatterEventType = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })

        return;
      }

      if (value == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
  
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      const response = await api.post('/TipoAcompanhamento/Salvar', {
        id: modalActiveId,
        value,
        token
      })

      addToast({
        type: "success",
        title: "Tipo de acompanhamento salvo",
        description: "O tipo de acompanhamento foi adicionado no sistema."
      })

      if (props.caller === 'followMatterList'){
        handleSaveCallback(response.data)
      }

      handleMatterEventTypeModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar tipo de acompanhamento.",
      })
    }
  },[isSaving,value]);

  const handleMatterEventTypeModalClose = () => {
    setMatterEventTypeDescription("")
    handleModalActive(false)
    handleCaller("")
    handleCloseModalCallback()
  }

  const handleMatterEventTypeModalCloseAfterSave = () => {
    setMatterEventTypeDescription("")
    handleModalActive(false)
    handleCaller("matterEventTypeModal")
    handleCloseModalCallback()
  }

  return (
    <>
      {!isMOBILE &&(
        <ModalMatterEventType show>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Acompanhamento

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterEventTypeDescription(e.target.value)}
                autoComplete="off"
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
                  onClick={()=> saveMatterEventType()}
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
                  onClick={() => handleMatterEventTypeModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalMatterEventType>
      )}

      {isMOBILE &&(
        <ModalMatterEventTypeMobile show>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Acompanhamento

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterEventTypeDescription(e.target.value)}
                autoComplete="off"
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
                  onClick={()=> saveMatterEventType()}
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
                  onClick={() => handleMatterEventTypeModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalMatterEventTypeMobile>
      )}
      {isSaving && (
        <>
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
  )}
    </>
  )

}
export default MatterEventTypeEdit
