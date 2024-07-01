/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalFinancialStatus, Flags, ModalFinancialStatusMobile } from './styles';

export interface IFinancialStatusData {
    financialStatusId: string;
    financialStatusDescription: string;
    financialStatusType: string;
    flgDefaultStatus: boolean;
    count: number;
}

const FinancialStatusEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [financialStatusDescription, setFinancialStatusDescription] = useState<string>("");
  const [financialStatusType, setFinancialStatusType] = useState<string>("A");
  const [flgDefaultStatus, setFlgDefaultStatus] = useState<boolean>(false);
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectFinancialStatus(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectFinancialStatus = useCallback(async(id: number) => {

    const response = await api.post<IFinancialStatusData>('/StatusFinanceiro/Editar', {
      id,
      token
    })

    setFinancialStatusDescription(response.data.financialStatusDescription)
    setFinancialStatusType(response.data.financialStatusType)
    setFlgDefaultStatus(response.data.flgDefaultStatus)


    // Open modal after load data
    handleModalActive(true)

  },[financialStatusDescription,financialStatusType,flgDefaultStatus]);

  const saveFinancialStatus = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (financialStatusDescription === "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo Descrição deve ser preenchido`
        })
  
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      await api.post('/StatusFinanceiro/Salvar', {
  
        financialStatusId: modalActiveId,
        financialStatusDescription,
        financialStatusType,
        flgDefaultStatus,
        token
      })
      
      addToast({
        type: "success",
        title: "Status financeiro salvo",
        description: "O status financeiro foi adicionado no sistema."
      })
      setisSaving(false)

      handleFinancialStatusModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar status financeiro.",
      })
    }
  },[isSaving,financialStatusDescription,flgDefaultStatus,financialStatusType]);

  const handleFinancialStatusModalClose = () => { 
    setFinancialStatusDescription("")
    setFinancialStatusType("A")
    setFlgDefaultStatus(false)
    handleCaller("")
    handleModalActive(false)
  }

  const handleFinancialStatusModalCloseAfterSave = () => { 
    setFinancialStatusDescription("")
    setFinancialStatusType("A")
    setFlgDefaultStatus(false)
    handleCaller("financialStatusModal")
    handleModalActive(false)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalFinancialStatus show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Status Financeiro

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={financialStatusDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFinancialStatusDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <label htmlFor="type">
              Tipo
              <br />
              <select 
                name="Type"
                value={financialStatusType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFinancialStatusType(e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="C">Cancelado</option>
                <option value="S">Suspenso</option>
              </select>
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'left', marginLeft: '0px', width: '92px'}}>
              <Flags>
                Status Padrão 
              </Flags>
            </div>
            
            <div style={{float:'left', margin:'2px 36px', width: '20px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgDefaultStatus}
                onChange={() => setFlgDefaultStatus(!flgDefaultStatus)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveFinancialStatus()}
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
                  onClick={() => handleFinancialStatusModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalFinancialStatus>
      )}

      {isMOBILE &&(
        <ModalFinancialStatusMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Status Financeiro

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={financialStatusDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFinancialStatusDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <label htmlFor="type" style={{fontSize:'10px'}}>
              Tipo
              <br />
              <select 
                name="Type"
                value={financialStatusType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFinancialStatusType(e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="C">Cancelado</option>
                <option value="S">Suspenso</option>
              </select>
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'left', marginLeft: '0px', width: '92px'}}>
              <Flags>
                Status Padrão 
              </Flags>
            </div>
            
            <div style={{float:'left', margin:'2px 36px', width: '20px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgDefaultStatus}
                onChange={() => setFlgDefaultStatus(!flgDefaultStatus)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveFinancialStatus()}
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
                  onClick={() => handleFinancialStatusModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalFinancialStatusMobile>
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
export default FinancialStatusEdit;