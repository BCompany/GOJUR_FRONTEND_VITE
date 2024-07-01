/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { currencyConfig } from 'Shared/utils/commonFunctions';
import IntlCurrencyInput from "react-intl-currency-input"
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalServiceType, ModalServiceTypeMobile } from './styles';

export interface IServiceTypeData {
  serviceTypeId: number;
  serviceTypeDescription: string;
  calculationType: string;
  flgMultipleUnit: string;
  flgExpire: string;
  referenceId: string;
  standardValue: number;
}

const ServiceTypeEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [serviceTypeId, setServiceTypeId] = useState<number>()
  const [serviceTypeDescription, setServiceTypeDescription] = useState<string>("");
  const [calculationType, setCalculationType] = useState<string>("RV")
  const [flgMultipleUnit, setFlgMultipleUnit] = useState<string>("N")
  const [standardValue, setStandardValue] = useState<number>(0)
  const [referenceId, setReferenceId] = useState<string>("")
  const [flgExpire, setFlgExpire] = useState<string>("N")
  const { isMOBILE } = useDevice();
  const [buttonText, setButtonText] = useState<string>("(+)Opções Avançadas");
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectServiceType(modalActiveId)
    }

  },[modalActiveId, caller])

  useEffect(() => {
    if (referenceId != "" || standardValue != 0 || calculationType != "RV" || flgMultipleUnit != "N"){
      setButtonText('(-)Opções Avançadas')
      setShow(true)
    }

},[referenceId, standardValue])

  const SelectServiceType = useCallback(async(id: number) => {

    const response = await api.post<IServiceTypeData>('/TipoServico/Editar', {
      id,
      calculationType,
      flgMultipleUnit,
      standardValue,
      flgExpire,
      token
    })

    setServiceTypeId(response.data.serviceTypeId)
    setServiceTypeDescription(response.data.serviceTypeDescription)
    setCalculationType(response.data.calculationType)
    setFlgMultipleUnit(response.data.flgMultipleUnit)
    setStandardValue(response.data.standardValue)
    setReferenceId(response.data.referenceId)
    setFlgExpire(response.data.flgExpire)

    // Open modal after load data
    handleModalActive(true)


  },[serviceTypeId,serviceTypeDescription,calculationType,flgMultipleUnit,standardValue,referenceId,flgExpire]);

  const saveServiceType = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (serviceTypeDescription === "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo Serviço deve ser preenchido`
        })
  
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      
      await api.post('/TipoServico/Salvar', {

        serviceTypeId: modalActiveId,
        serviceTypeDescription,
        calculationType,
        flgMultipleUnit,
        referenceId,
        standardValue,
        flgExpire,
        token
      })
      
      addToast({
        type: "success",
        title: "Tipo de serviço salvo",
        description: "O tipo de serviço foi adicionado no sistema."
      })
      setisSaving(false)

      handleServiceTypeModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar tipo de serviço.",
      })
    }
  },[isSaving,serviceTypeDescription,calculationType,flgMultipleUnit,referenceId,standardValue,flgExpire]);

  const handleServiceTypeModalClose = () => { 
    setServiceTypeDescription("")
    setCalculationType("RV")
    setFlgMultipleUnit("N")
    setStandardValue(0)
    setReferenceId("")
    setFlgExpire("N")
    handleModalActive(false)
    setButtonText('(+)Opções Avançadas')
    handleCaller("")
    setShow(false)
  }

  const handleServiceTypeModalCloseAfterSave = () => { 
    setServiceTypeDescription("")
    setCalculationType("RV")
    setFlgMultipleUnit("N")
    setStandardValue(0)
    setReferenceId("")
    setFlgExpire("N")
    handleModalActive(false)
    setButtonText('(+)Opções Avançadas')
    handleCaller("serviceTypeModal")
    setShow(false)
  }

  const handleChangeButton = () => { 
    if(buttonText == '(+)Opções Avançadas')
    {
      setButtonText('(-)Opções Avançadas')
      setShow(true)
    }
    else
    {
      setButtonText('(+)Opções Avançadas')
      setShow(false)
    }
  }

  const handleStandardValue = (event, value, maskedValue) => {
    event.preventDefault();

    setStandardValue(value)
  };
    
  return (
    <>
      {!isMOBILE &&(
        <ModalServiceType show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Serviço
            <br />
            <br />
            <label htmlFor="descricao" style={{fontSize:'13px'}}>
              Serviço 
              <input 
                type="text"
                style={{width: '80%',marginLeft:"5%"}}
                name="descricao"
                value={serviceTypeDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceTypeDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            
            <button 
              type='button'
              onClick={()=> handleChangeButton()}
            >
              {buttonText}
            </button>

            <br />
            <br />
            {show && (
              <div>
                <div style={{fontSize:'13px',marginLeft:"3%", display:"flex"}}>
                  <label htmlFor="type" style={{fontSize:'13px', marginTop:"auto", marginBottom:"auto", marginLeft:"-3%"}}>
                    Tipo de Cálculo 
                    <select 
                      style={{width: '55%',marginLeft:"9%"}}
                      name="Type"
                      value={calculationType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setCalculationType(e.target.value)}
                    >
                      <option value="RV">Valor R$</option>
                      <option value="RP">Porcentagem</option>
                      <option value="DV">Despesa Valor</option>
                      <option value="DP">Despesa Porcentagem</option>
                    </select>
                  </label>

                  <div style={{display:"flex", marginLeft:"2.5%", width:"41%"}}>
                    <p style={{marginTop:"auto", marginBottom:"auto"}}>Valor Padrão</p>
                    <section style={{width:"50%", marginLeft:"4%"}}>
                      <IntlCurrencyInput
                        currency="BRL"
                        config={currencyConfig}
                        value={standardValue}
                        onChange={handleStandardValue}
                      />
                    </section>
                  </div>       
                </div>

                <br />
                <label htmlFor="type" style={{fontSize:'13px'}}>
                  Unidade Multipla
                  <select 
                    style={{width: '29.5%', marginLeft:"3%"}}
                    name="Type"
                    value={flgMultipleUnit}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlgMultipleUnit(e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </label>
            
                <label htmlFor="type" style={{fontSize:'13px', marginLeft:"2.5%"}}>
                  Expira 
                  <select 
                    style={{width: '20%',marginLeft:"10%"}}
                    name="Type"
                    value={flgExpire}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlgExpire(e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </label>
                <br />
                <br />
                <label htmlFor="descricao" style={{fontSize:'13px'}}>
                  Referência
                  <input
                    maxLength={10}
                    type="text"
                    style={{ width: '70%',marginLeft:"10%"}}
                    name="descricao"
                    value={referenceId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setReferenceId(e.target.value)}
                    autoComplete="off"
                  />
                </label>
                <br />
                <br />
                <br />
              </div>
            )}
            <div style={{float:'right', marginRight:'12px', marginBottom:'20px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveServiceType()}
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
                  onClick={() => handleServiceTypeModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalServiceType>
      )}

      {isMOBILE &&(
        <ModalServiceTypeMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Serviço
            <br />
            <br />
            <label htmlFor="descricao" style={{fontSize:'13px'}}>
              Serviço 
              <input 
                type="text"
                style={{width: '80%',marginLeft:"5%"}}
                name="descricao"
                value={serviceTypeDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setServiceTypeDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            
            <button 
              type='button'
              onClick={()=> handleChangeButton()}
            >
              {buttonText}
            </button>

            <br />
            <br />
            {show && (
              <div>
                <label htmlFor="type" style={{fontSize:'13px'}}>
                  Tipo de Cálculo 
                  <select 
                    style={{width: '30%',marginLeft:"7.5%"}}
                    name="Type"
                    value={calculationType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCalculationType(e.target.value)}
                  >
                    <option value="RV">Valor R$</option>
                    <option value="RP">Porcentagem</option>
                    <option value="DV">Despesa Valor</option>
                    <option value="DP">Despesa Porcentagem</option>
                  </select>
                </label>

                <br />
                <br />
                
                <div style={{display:"flex", marginLeft:"2.5%", width:"41%"}}>
                  <p style={{marginTop:"auto", marginBottom:"auto"}}>Valor Padrão</p>
                  <section style={{width:"50%", marginLeft:"4%"}}>
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={standardValue}
                      onChange={handleStandardValue}
                    />
                  </section>
                </div>       
                <br />
                <br />
                <label htmlFor="type" style={{fontSize:'13px'}}>
                  Unidade Multipla
                  <select 
                    style={{width: '30%', marginLeft:"4%"}}
                    name="Type"
                    value={flgMultipleUnit}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlgMultipleUnit(e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </label>

                <br />
                <br />
            
                <label htmlFor="type" style={{fontSize:'13px'}}>
                  Expira 
                  <select 
                    style={{width: '30%',marginLeft:"28.5%"}}
                    name="Type"
                    value={flgExpire}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlgExpire(e.target.value)}
                  >
                    <option value="N">Não</option>
                    <option value="S">Sim</option>
                  </select>
                </label>
                <br />
                <br />
                <label htmlFor="descricao" style={{fontSize:'13px'}}>
                  Referência
                  <input
                    maxLength={10}
                    type="text"
                    style={{ width: '60%',marginLeft:"10%"}}
                    name="descricao"
                    value={referenceId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setReferenceId(e.target.value)}
                    autoComplete="off"
                  />
                </label>
                <br />
                <br />
                <br />
              </div>
            )}
            <div style={{float:'right', marginRight:'12px', marginBottom:'20px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveServiceType()}
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
                  onClick={() => handleServiceTypeModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalServiceTypeMobile>
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
export default ServiceTypeEdit;
