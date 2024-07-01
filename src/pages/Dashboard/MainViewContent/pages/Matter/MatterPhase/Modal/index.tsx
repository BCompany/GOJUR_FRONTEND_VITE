import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { FiSave } from 'react-icons/fi';
import { useModal } from 'context/modal';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { ModalMatterPhase, ModalMatterPhaseMobile } from './styles';

export interface IMatterPhaseData {
  id: string;
  value: string;
}

const MatterPhaseEdit = () => {
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setMatterPhaseDescription] = useState<string>("");
  const { isMOBILE } = useDevice();
  
  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectMatterPhase(modalActiveId)
    }

  },[modalActiveId, caller])
  
  const SelectMatterPhase = useCallback(async(id: number) => {

    const response = await api.post<IMatterPhaseData>('/FaseProcessual/Editar', {
      id,
      token
    })

    setMatterPhaseDescription(response.data.value)

    // Open modal after load data
    handleModalActive(true)

  },[value]);
  
  const saveMatterPhase = useCallback(async() => {
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
      await api.post('/FaseProcessual/Salvar', {
  
        id: modalActiveId,
        value,
        token
      })
      
      addToast({
        type: "success",
        title: "Fase processual salva",
        description: "a fase processual foi adicionada no sistema."
      })

      handleMatterPhaseModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar fase processual.",
      })
    }
  },[isSaving,value]);

  const handleMatterPhaseModalClose = () => { 
    setMatterPhaseDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleMatterPhaseModalCloseAfterSave = () => { 
    setMatterPhaseDescription("")
    handleCaller("matterPhaseModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalMatterPhase show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Fase Processual
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterPhaseDescription(e.target.value)}
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
                  onClick={()=> saveMatterPhase()}
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
                  onClick={() => handleMatterPhaseModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalMatterPhase>
      )}

      {isMOBILE &&(
        <ModalMatterPhaseMobile show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Fase Processual
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterPhaseDescription(e.target.value)}
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
                  onClick={()=> saveMatterPhase()}
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
                  onClick={() => handleMatterPhaseModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalMatterPhaseMobile>
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
export default MatterPhaseEdit;