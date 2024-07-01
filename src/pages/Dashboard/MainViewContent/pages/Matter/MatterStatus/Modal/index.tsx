import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { FiSave } from 'react-icons/fi';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { ModalMatterStatus, ModalMatterStatusMobile } from './styles';

export interface IMatterStatusData {
  id: string;
  value: string;
  type: string;
}

const MatterStatusEdit = () => {

  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setMatterStatusDescription] = useState<string>("");
  const [type, setMatterStatusType] = useState<string>('A');
  const { isMOBILE } = useDevice();
    
  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectMatterStatus(modalActiveId)
    }


  },[modalActiveId, caller])

  const SelectMatterStatus = useCallback(async(id: number) => {

    const response = await api.post<IMatterStatusData>('/StatusProcesso/Editar', {
      id,
      token
    })

    setMatterStatusDescription(response.data.value)
    setMatterStatusType(response.data.type)

    // Open modal after load data
    handleModalActive(true)

  },[value, type,]);

  const saveMatterStatus = useCallback(async() => {
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
      await api.post('/StatusProcesso/Salvar', {
  
        id: modalActiveId,
        value,
        type,
        token
      })
      
      addToast({
        type: "success",
        title: "Status do processo salvo",
        description: "O status do processo foi adicionado no sistema."
      })

      handleMatterStatusModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar status do processo.",
      })
    }
  },[isSaving,value, type,]);

  const handleMatterStatusModalClose = () => { 
    setMatterStatusType("A")
    setMatterStatusDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleMatterStatusModalCloseAfterSave = () => { 
    setMatterStatusType("A")
    setMatterStatusDescription("")
    handleCaller("matterStatusModal")
    handleModalActive(false)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalMatterStatus show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Status do Processo

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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterStatusDescription(e.target.value)}
                autoComplete="off"
              />
            </label>

            <br />
            <br />

            <label htmlFor="type">
              Tipo
              <br />
              <select 
                name="userType"
                value={type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatterStatusType(e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="R">Arquivado</option>
              </select>
            </label>

            <br />
            <br />      
            <br />

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveMatterStatus()}
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
                  onClick={() => handleMatterStatusModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalMatterStatus>
      )}

      {isMOBILE &&(
        <ModalMatterStatusMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Status do Processo

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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterStatusDescription(e.target.value)}
                autoComplete="off"
              />
            </label>

            <br />
            <br />

            <label htmlFor="type" style={{fontSize:'10px'}}>
              Tipo
              <br />
              <select 
                name="userType"
                value={type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatterStatusType(e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="R">Arquivado</option>
              </select>
            </label>

            <br />
            <br />      
            <br />

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveMatterStatus()}
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
                  onClick={() => handleMatterStatusModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalMatterStatusMobile>
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
export default MatterStatusEdit;
  