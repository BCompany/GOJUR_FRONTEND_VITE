import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiSave } from 'react-icons/fi';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { ModalMatterSolution, ModalMatterSolutionMobile } from './styles';

export interface IMatterSolutionData {
  id: string;
  value: string;
}

const MatterSolutionEdit = () => {
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setMatterSolutionDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectMatterSolution(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectMatterSolution = useCallback(async(id: number) => {

    const response = await api.post<IMatterSolutionData>('/SolucaoProcesso/Editar', {
      id,
      token
    })

    setMatterSolutionDescription(response.data.value)


    // Open modal after load data
    handleModalActive(true)

  },[value]);

  const saveMatterSolution = useCallback(async() => {
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
      await api.post('/SolucaoProcesso/Salvar', {
  
        id: modalActiveId,
        value,
        token
      })
      
      addToast({
        type: "success",
        title: "Solução do processo salva",
        description: "A solução do processo foi adicionada no sistema."
      })

      handleMatterSolutionModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar solução do processo.",
      })
    }
  },[isSaving,value]);

  const handleMatterSolutionModalClose = () => { 
    setMatterSolutionDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleMatterSolutionModalCloseAfterSave = () => { 
    setMatterSolutionDescription("")
    handleCaller("matterSolutionModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalMatterSolution show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Solução do Processo
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterSolutionDescription(e.target.value)}
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
                  onClick={()=> saveMatterSolution()}
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
                  onClick={() => handleMatterSolutionModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalMatterSolution>
      )}

      {isMOBILE &&(
        <ModalMatterSolutionMobile show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Solução do Processo
        
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterSolutionDescription(e.target.value)}
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
                  onClick={()=> saveMatterSolution()}
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
                  onClick={() => handleMatterSolutionModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalMatterSolutionMobile>
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
export default MatterSolutionEdit;