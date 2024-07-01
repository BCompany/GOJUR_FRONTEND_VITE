/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { useToast } from 'context/toast';
import { FiSave } from 'react-icons/fi';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useModal } from 'context/modal'
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { ModalCustomerGroup } from './styles';


export interface ICustomerGroupData {
    customerGroupId: string;
    customerGroupDescription: string;
    count: string;
}

const CustomerGroupEdit = () => {
    const { addToast } = useToast();
    const token = localStorage.getItem('@GoJur:token');
    const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
    const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
    const [customerGroupDescription, setCustomerGroupDescription] = useState<string>("");
  
    useEffect(() => {
  
      if (caller === ''){
        return
      }
  
      if (modalActiveId > 0){
        SelectCustomerGroup(modalActiveId)
      }
  
    },[modalActiveId, caller])
  
    const SelectCustomerGroup = useCallback(async(id: number) => {
  
      const response = await api.post<ICustomerGroupData>('/GrupoCliente/Editar', {
        id,
        token
      })
  
      setCustomerGroupDescription(response.data.customerGroupDescription)
  
  
      // Open modal after load data
      handleModalActive(true)
  
    },[customerGroupDescription]);
  
    const saveCustomerGroup = useCallback(async() => {
      try {

        setisSaving(true)

        if (isSaving) {
          addToast({
            type: "info",
            title: "Operação NÃO realizada",
            description: `Já existe uma operação em andamento`
          })
    
          return;
        }
        const token = localStorage.getItem('@GoJur:token');
        
        await api.post('/GrupoCliente/Salvar', {
    
          customerGroupId: modalActiveId,
          customerGroupDescription,
          token
        })
        
        addToast({
          type: "success",
          title: "Grupo de clientes salvo",
          description: "O grupo de clientes foi adicionado no sistema."
        })
  
        handleCustomerGroupModalCloseAfterSave()
        setisSaving(false)
        
      } catch (err) {
        setisSaving(false)
        addToast({
          type: "error",
          title: "Falha ao salvar grupo de clientes.",
        })
      }
    },[customerGroupDescription]);
  
    const handleCustomerGroupModalClose = () => { 
      setCustomerGroupDescription("")
      handleCaller("")
      handleModalActive(false)
    }

    const handleCustomerGroupModalCloseAfterSave = () => { 
      setCustomerGroupDescription("")
      handleCaller("customerGroupModal")
      handleModalActive(false)
    }
    
    return (
      <>
        <ModalCustomerGroup show={modalActive}>
    
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Grupo de Cliente
    
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
                value={customerGroupDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerGroupDescription(e.target.value)}
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
                  onClick={()=> saveCustomerGroup()}
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
                  onClick={() => handleCustomerGroupModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
    
          </div>
        </ModalCustomerGroup>

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
  export default CustomerGroupEdit;