/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa'
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalPaymentForm, ModalPaymentFormMobile } from './styles';

export interface IPaymentFormData {
    paymentFormId: string;
    paymentFormDescription: string;
    paymentFormType: string;
    count: string;
}

const PaymentFormEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [paymentFormDescription, setPaymentFormDescription] = useState<string>("");
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [paymentFormType, setPaymentFormType] = useState<string>('B');
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectPaymentForm(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectPaymentForm = useCallback(async(id: number) => {

    const response = await api.post<IPaymentFormData>('/FormaDePagamento/Editar', {
      id,
      token
    })

    setPaymentFormDescription(response.data.paymentFormDescription)
    setPaymentFormType(response.data.paymentFormType)


    // Open modal after load data
    handleModalActive(true)

  },[paymentFormDescription,paymentFormType]);


  const savePaymentForm = useCallback(async() => {
    try {

      if (paymentFormDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Favor informar o campo Descrição`
        })
  
        return;
      }
      
      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: "Já existe uma operação em andamento"
        })
  
        return;
      }

      if (paymentFormDescription === "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo Forma de Pagamento deve ser preenchido`
        })
  
        return;
      }

      setisSaving(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.post('/FormaDePagamento/Salvar', {
  
        paymentFormId: modalActiveId,
        paymentFormName: paymentFormDescription,
        paymentFormType,
        token
      })
      
      addToast({
        type: "success",
        title: "Forma de pagamento salva",
        description: "A forma de pagamento foi adicionada no sistema."
      })
      setisSaving(false)

      handlePaymentFormModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar forma de pagamento.",
      })
    }
  },[isSaving,paymentFormDescription,paymentFormType]);

  const handlePaymentFormModalClose = () => { 
    setPaymentFormDescription("")
    setPaymentFormType("B")
    handleCaller("")
    handleModalActive(false)
  }

  const handlePaymentFormModalCloseAfterSave = () => { 
    setPaymentFormDescription("")
    setPaymentFormType("B")
    handleCaller("paymentFormModal")
    handleModalActive(false)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalPaymentForm show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Forma de Pagamento

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input
                required
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={paymentFormDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentFormDescription(e.target.value)}
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
                value={paymentFormType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPaymentFormType(e.target.value)}
              >
                <option value="B">Boleto</option>
                <option value="C">Cartão de Crédito</option>
                <option value="H">Cheque</option>
                <option value="D">Dinheiro</option>
                <option value="P">PIX</option>
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
                  onClick={()=> savePaymentForm()}
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
                  onClick={() => handlePaymentFormModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalPaymentForm>
      )}

      {isMOBILE &&(
        <ModalPaymentFormMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Forma de Pagamento

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input 
                required
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={paymentFormDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentFormDescription(e.target.value)}
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
                value={paymentFormType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPaymentFormType(e.target.value)}
              >
                <option value="B">Boleto</option>
                <option value="C">Cartão de Crédito</option>
                <option value="H">Cheque</option>
                <option value="D">Dinheiro</option>
                <option value="P">PIX</option>
              </select>
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> savePaymentForm()}
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
                  onClick={() => handlePaymentFormModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalPaymentFormMobile>
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
export default PaymentFormEdit;
