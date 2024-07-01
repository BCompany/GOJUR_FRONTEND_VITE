import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import { useDevice } from "react-use-device";
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import { useModal } from 'context/modal';
import { useToast } from 'context/toast';
import { ModalThirdPartyGroup, ModalThirdPartyGroupMobile } from './styles';

export interface IThirdPartyGroupData {
  id: string;
  value: string;
  count: string;
}

const ThirdPartyGroupEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [value, setThirdPartyGroupDescription] = useState<string>("");
  const { isMOBILE } = useDevice();
  
  useEffect(() => {
    if (caller === ''){
      return
    }
  
    if (modalActiveId > 0){
      SelectThirdPartyGroup(modalActiveId)
    }
  },[modalActiveId, caller])

  
  const SelectThirdPartyGroup = useCallback(async(id: number) => {
  
    const response = await api.post<IThirdPartyGroupData>('/GrupoTerceiros/Editar', {
      id,
      token
    })
  
    setThirdPartyGroupDescription(response.data.value)
  
    // Open modal after load data
    handleModalActive(true)
  
  },[value]);

  
  const saveThirdPartyGroup = useCallback(async() => {
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
          title: "Operação não realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
        return;
      }
      
      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      await api.post('/GrupoTerceiros/Salvar', {
        id: modalActiveId,
        name: value,
        token
      })
        
      addToast({
        type: "success",
        title: "Grupo de terceiro salvo",
        description: "O grupo de terceiro foi adicionado no sistema."
      })

      setisSaving(false)
      handleThirdPartyGroupModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar grupo de terceiro.",
      })
    }
  },[isSaving, value]);

    
  const handleThirdPartyGroupModalClose = () => { 
    setThirdPartyGroupDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleThirdPartyGroupModalCloseAfterSave = () => { 
    setThirdPartyGroupDescription("")
    handleCaller("thirdPartyGroupModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalThirdPartyGroup show={modalActive}>
      
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Grupo Terceiro
        
            <br />
            <br />
      
            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input
                required
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setThirdPartyGroupDescription(e.target.value)}
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
                  onClick={()=> saveThirdPartyGroup()}
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
                  onClick={() => handleThirdPartyGroupModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
      
          </div>
        </ModalThirdPartyGroup>
      )}

      {isMOBILE &&(
        <ModalThirdPartyGroupMobile show={modalActive}>
      
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Grupo Terceiro
      
            <br />
            <br />
      
            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input
                required
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setThirdPartyGroupDescription(e.target.value)}
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
                  onClick={()=> saveThirdPartyGroup()}
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
                  onClick={() => handleThirdPartyGroupModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
      
          </div>
        </ModalThirdPartyGroupMobile>
      )}
      
      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando Grupo Terceiro ...
          </div>
        </>
      )}  
    </>
  )
    
}
export default ThirdPartyGroupEdit;