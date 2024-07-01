/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalAdvisoryType, ModalAdvisoryTypeMobile } from './styles';

export interface IAdvisoryTypeData {
  id: string;
  value: string;
  count: string;
}

const AdvisoryTypeEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setAdvisoryTypeDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectAdvisoryType(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectAdvisoryType = useCallback(async(id: number) => {

    const response = await api.post<IAdvisoryTypeData>('/TipoConsultivo/Editar', {
      id,
      token
    })

    setAdvisoryTypeDescription(response.data.value)


    // Open modal after load data
    handleModalActive(true)

  },[value]);

  const saveAdvisoryType = useCallback(async() => {
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
      await api.post('/TipoConsultivo/Salvar', {

        id: modalActiveId,
        advisoryTypeDescription: value,
        token
      })
      
      addToast({
        type: "success",
        title: "Assunto salvo",
        description: "O assunto foi adicionado no sistema."
      })

      handleAdvisoryTypeModalCloseAfterSave()
      setisSaving(false)
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar assunto.",
      })
    }
  },[isSaving,value]);

  const handleAdvisoryTypeModalClose = () => { 
    setAdvisoryTypeDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleAdvisoryTypeModalCloseAfterSave = () => { 
    setAdvisoryTypeDescription("")
    handleCaller("advisoryTypeModal")
    handleModalActive(false)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalAdvisoryType show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Assunto

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAdvisoryTypeDescription(e.target.value)}
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
                  onClick={()=> saveAdvisoryType()}
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
                  onClick={() => handleAdvisoryTypeModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalAdvisoryType>
      )}

      {isMOBILE &&(
        <ModalAdvisoryTypeMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Assunto

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAdvisoryTypeDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveAdvisoryType()}
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
                  onClick={() => handleAdvisoryTypeModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
          
          
        </ModalAdvisoryTypeMobile>
        
      )}
      {isSaving && (
        <>
          <Overlay />
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
export default AdvisoryTypeEdit;
