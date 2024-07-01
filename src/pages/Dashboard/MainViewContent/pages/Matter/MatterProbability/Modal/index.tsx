import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { ModalMatterProbability, ModalMatterProbabilityMobile } from './styles';

export interface IMatterProbabilityData {
  id: string;
  value: string;
}

const MatterProbabilityEdit = () => {
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setMatterProbabilityDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectMatterProbability(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectMatterProbability = useCallback(async(id: number) => {

    const response = await api.post<IMatterProbabilityData>('/ProbabilidadeProcesso/Editar', {
      id,
      token
    })

    setMatterProbabilityDescription(response.data.value)


    // Open modal after load data
    handleModalActive(true)

  },[value]);

  const saveMatterProbability = useCallback(async() => {
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
      await api.post('/ProbabilidadeProcesso/Salvar', {
  
        id: modalActiveId,
        value,
        token
      })
      
      addToast({
        type: "success",
        title: "Probabilidade do processo salva",
        description: "A Probabilidade do processo foi adicionada no sistema."
      })

      handleMatterProbabilityModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar probabilidade do processo.",
      })
    }
  },[isSaving,value]);

  const handleMatterProbabilityModalClose = () => { 
    setMatterProbabilityDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleMatterProbabilityModalCloseAfterSave = () => { 
    setMatterProbabilityDescription("")
    handleCaller("matterProbabilityModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalMatterProbability show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Probabilidade do Processo
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterProbabilityDescription(e.target.value)}
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
                  onClick={()=> saveMatterProbability()}
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
                  onClick={() => handleMatterProbabilityModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalMatterProbability>
      )}

      {isMOBILE &&(
        <ModalMatterProbabilityMobile show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Probabilidade do Processo
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterProbabilityDescription(e.target.value)}
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
                  onClick={()=> saveMatterProbability()}
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
                  onClick={() => handleMatterProbabilityModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalMatterProbabilityMobile>
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
export default MatterProbabilityEdit;