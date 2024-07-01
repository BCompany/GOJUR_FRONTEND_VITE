/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiSave } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { ModalMatterDemandType, ModalMatterDemandTypeMobile } from './styles';

export interface IMatterDemandTypeData {
  id: string;
  value: string;
  count: string;
}

const MatterDemandTypeEdit = (props) => {
  const { callerOrigin } = props;
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [value, setMatterDemandTypeDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectMatterDemandType(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectMatterDemandType = useCallback(async(id: number) => {

    const response = await api.post<IMatterDemandTypeData>('/TipoPedidoProcesso/Editar', {
      id,
      token
    })

    setMatterDemandTypeDescription(response.data.value)

    // Open modal after load data
    handleModalActive(true)

  },[value]);

  const saveMatterDemandType = useCallback(async() => {
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
      const response = await api.post('/TipoPedidoProcesso/Salvar', {

        id: modalActiveId,
        value,
        token
      })

      addToast({
        type: "success",
        title: "Tipo de pedido do processo salvo",
        description: "O tipo de pedido do processo foi adicionado no sistema."
      })

      // calls callback from submodal on matter order list
      if (callerOrigin === 'matterOrder'){
        await props.callbackFunction.handleMatterOrderTypeCallBack(response.data)
      }

      handleMatterDemandTypeModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar tipo pedido do processo.",
      })
    }
  },[isSaving,value]);

  const handleMatterDemandTypeModalClose = () => {
    setMatterDemandTypeDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleMatterDemandTypeModalCloseAfterSave = () => {
    setMatterDemandTypeDescription("")
    handleCaller("matterDemandTypeModal")
    handleModalActive(false)
  }

  return (
    <>
      {!isMOBILE &&(
        <ModalMatterDemandType show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Pedido do Processo

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterDemandTypeDescription(e.target.value)}
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
                  onClick={()=> saveMatterDemandType()}
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
                  onClick={() => handleMatterDemandTypeModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalMatterDemandType>
      )}

      {isMOBILE &&(
        <ModalMatterDemandTypeMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Pedido do Processo

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterDemandTypeDescription(e.target.value)}
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
                  onClick={()=> saveMatterDemandType()}
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
                  onClick={() => handleMatterDemandTypeModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalMatterDemandTypeMobile>
      )}


      {isSaving && (
        <>
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
export default MatterDemandTypeEdit;
