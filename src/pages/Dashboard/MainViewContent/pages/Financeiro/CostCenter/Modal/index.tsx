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
import { useHistory } from 'react-router-dom';
import InputMask from 'components/InputMask';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { MdHelp } from 'react-icons/md';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalCostCenter, ModalCostCenterMobile, Flags, OverlayModal} from './styles';

export interface ICostCenterData {
  costCenterId: string;
  costCenterDescription: string;
  costCenterNumber: string;
}

const CostCenterModal = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const { handleModalActive, caller, modalActive, modalActiveId, handleModalActiveId, handleCaller } = useModal();

  const [costCenterDescription, setCostCenterDescription] = useState<string>("");
  const [costCenterNumber, setCostCenterNumber] = useState<string>("")
  const { isMOBILE } = useDevice();

  

  useEffect(() => {
    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectCostCenter(modalActiveId,caller)
    }

  },[modalActiveId, caller])



  const saveCostCenter = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (costCenterDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo descrição deve ser preenchido`
        })
  
        return;
      }

      if (costCenterNumber == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo referência deve ser preenchido`
        })
  
        return;
      }

      if (costCenterNumber.length != 6) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O numero de digitos e/ou formato do código de referência é invalido`
        })
  
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      
      setisSaving(true)

      const response = await api.post('/CentroDeCusto/Salvar', {
        costCenterId: modalActiveId,
        costCenterDescription,
        costCenterNumber,
        token
      })

      setisSaving(false)
      
      addToast({
        type: "success",
        title: "Centro de custo salvo",
        description: "O centro de custo foi adicionado no sistema."
      })
      handleCostCenterModalCloseAfterSave()
    } catch (err: any) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar centro de custo.",
        description:  err.response.data.Message
      })
    }
  },[isSaving, costCenterDescription, costCenterDescription, costCenterNumber, modalActiveId]);


  const SelectCostCenter = useCallback(async(id: number, caller: string) => {

    const response = await api.post<ICostCenterData>('/CentroDeCusto/Editar', {
      id,
      token
    })

    if(caller == "costCenterMenu"){
      setCostCenterNumber(response.data.costCenterNumber.substring(0,3))
      handleModalActiveId(0)
    }
    else{
      setCostCenterNumber(response.data.costCenterNumber)
      setCostCenterDescription(response.data.costCenterDescription)
    }


    // Open modal after load data
    handleModalActive(true)

  },[costCenterDescription,costCenterNumber]);
  
  const handleCostCenterModalClose = () => { 
    setCostCenterDescription("")
    setCostCenterNumber("")
    handleModalActiveId(0)
    handleModalActive(false)
    handleCaller("")
  }

  const handleCostCenterModalCloseAfterSave = () => { 
    setCostCenterDescription("")
    setCostCenterNumber("")
    handleModalActiveId(0)
    handleModalActive(false)
    handleCaller("costCenterValueModal")
  }

  return (
    <>
      {!isMOBILE &&(
        <ModalCostCenter show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Centro de Custo
            <br />
            <br />
            <div>
              <label htmlFor="descricao" style={{fontSize:'12px', marginRight:"-22%", marginTop:"auto"}}>
                Descrição
                <br />
                <input
                  type="text"
                  style={{backgroundColor:"white", width:"94%"}}
                  name="descricao"
                  value={costCenterDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCostCenterDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <br />
              <br />

         
              <div style={{display:"flex"}}>
                <div style={{width:"100%"}}>
                  Referência
                  <InputMask
                    placeholder='00.000'
                    style={{width:"100%"}}
                    mask="costCenter"
                    value={costCenterNumber}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCostCenterNumber(e.target.value)}
                  />
                </div>

                <div style={{marginTop:"auto", marginBottom:"auto", marginLeft:"3px"}}>
                  <MdHelp style={{minWidth: '20px', minHeight: '20px', marginTop:"70%"}} className='infoMessage' title="Formato de 5 digitos separados por ponto, os dois primeiros definem o grupo principal e os três ultimos o seus subgrupos." />
                </div>
              </div>

            </div>

            <br />

            
            <div style={{float:'right', marginRight:'12px', marginTop:"5%"}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveCostCenter()}
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
                  onClick={() => handleCostCenterModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalCostCenter>
      )}

      {isMOBILE &&(
        <ModalCostCenterMobile show={modalActive}>
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Centro de Custo
            <br />
            <br />
            <div>
              <label htmlFor="descricao" style={{fontSize:'12px', width:"90%", marginRight:"-22%", marginTop:"auto"}}>
                Descrição
                <br />
                <input
                  type="text"
                  name="descricao"
                  value={costCenterDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCostCenterDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>
                         

            </div>
        
            <div style={{float:'right', marginRight:'5px', marginTop:"4%"}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveCostCenter()}
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
                  onClick={() => handleCostCenterModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalCostCenterMobile>
      )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
      )}

      {(modalActive) && <OverlayModal /> }
    </>
  )
}

export default CostCenterModal;
