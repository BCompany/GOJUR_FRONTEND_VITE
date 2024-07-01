import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { ModalRite, ModalRiteMobile } from './styles';

export interface IRiteData {
  id: string;
  value: string;
  count: string;
}

const RiteEdit = () => {
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setRiteDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectRite(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectRite = useCallback(async(id: number) => {

    const response = await api.post<IRiteData>('/Rito/Editar', {
      id,
      token
    })

    setRiteDescription(response.data.value)


    // Open modal after load data
    handleModalActive(true)

  },[value]);

  const saveRite = useCallback(async() => {
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
      await api.post('/Rito/Salvar', {
  
        id: modalActiveId,
        value,
        token
      })
      
      addToast({
        type: "success",
        title: "Rito salvo",
        description: "O rito foi adicionado no sistema."
      })

      handleRiteModalCloseAfterSave()
      setisSaving(false)
      
    } catch (err) {
      setisSaving(false)
      
      addToast({
        type: "error",
        title: "Falha ao salvar rito.",
      })
    }
  },[isSaving,value]);

  const handleRiteModalClose = () => { 
    setRiteDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleRiteModalCloseAfterSave = () => { 
    setRiteDescription("")
    handleCaller("riteModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalRite show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Rito
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRiteDescription(e.target.value)}
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
                  onClick={()=> saveRite()}
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
                  onClick={() => handleRiteModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalRite>
      )}

      {isMOBILE &&(
        <ModalRiteMobile show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Rito
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRiteDescription(e.target.value)}
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
                  onClick={()=> saveRite()}
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
                  onClick={() => handleRiteModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalRiteMobile>
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
export default RiteEdit;