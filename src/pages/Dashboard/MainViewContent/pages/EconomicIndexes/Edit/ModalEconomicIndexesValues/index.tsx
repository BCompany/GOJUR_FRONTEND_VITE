/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { useLocation } from 'react-router-dom'
import IntlCurrencyInput from "react-intl-currency-input"
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FormatDate} from 'Shared/utils/commonFunctions';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalAddEconomicIndexes, ModalAddEconomicIndexesMobile, OverlayModal } from './styles';

export interface IEconomicIndexesValuesData {
  economicIndexesValuesId: number;
  economicIndexesId: string;
  date: string;
  dateToString: string;
  value: string;
  companyId: string;
}

export interface IEconomicIndexesData{
	economicIndexesId: number;
	economicIndexesDescription: string;
	flg_Public: boolean;
	allowDelete: boolean;
	flg_TypeValue: string;
	convertCoin: boolean;
	decimais: string;
	startDate: string;
	accessCodes: string;
  companyId: number;
	count: number;
}

const EconomicIndexesValuesEdit = (props) => {
  const { addToast } = useToast();
  const { pathname } = useLocation();
  const { decimals,economicIndexesStartDate } = props;
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [economicIndexesValuesId, setEconomicIndexesValuesId] = useState<number>(0)
  const { handleModalActive, handleModalActiveId, caller, modalActive, modalActiveId } = useModal();
  const [value, setValue] = useState<string>("");
  const [date, setDate] = useState<string>("")
  const { isMOBILE } = useDevice();

  useEffect(() => {
    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      LoadPaymentSlipContract(modalActiveId)
    }
  },[modalActiveId, caller])

  useEffect (() => { 
    if (date === ""){
      LoadNewData()
    }
  },[date])   
  
  const handleValue = (event, value, maskedValue) => {
    event.preventDefault();
    setValue(value)
  };

  const changeDecimals = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          // style: "currency",   // remove to now show R$
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: decimals,
        },
      },
    },
  };

  const saveEconomicIndexesValues = useCallback(async() => {
    try {

      if (date === ""){
        addToast({
          type: "info",
          title: "Informe uma data",
          description: `A data de referência não foi informada`
        })

        return;
      }

      const id = pathname.substr(22)

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })

        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)

      const response = await api.post('/IndicesEconomicosValores/Salvar', {
        id: modalActiveId,
        indexId: id,
        date,
        value,
        token
      })

      localStorage.setItem('@GoJur:IndiceEconomico', response.data.economicIndexesId)
      setisSaving(false)
      
      addToast({
        type: "success",
        title: "Índice econômico salvo",
        description: "O valor do índice econômico foi adicionado no sistema."
      })

      handleClose();

    } catch (err) {
      setisSaving(false)
      localStorage.removeItem('@GoJur:IndiceEconomico')
      addToast({
        type: "error",
        title: "Falha ao índice econômico.",
      })
    }
  },[isSaving, date, value]);


  const LoadPaymentSlipContract  = useCallback(async(id: number) => {
    setDate("1")

    const response = await api.post<IEconomicIndexesValuesData>('/IndicesEconomicosValores/Editar', { 
      id,
      token
    });
    
    setEconomicIndexesValuesId(response.data.economicIndexesValuesId)
    setDate(FormatDate(new Date(response.data.date), 'yyyy-MM-dd'))
    setValue(response.data.value)


  },[date, value, economicIndexesValuesId]);


  const LoadNewData = async() => {
    try {
      const id = pathname.substr(22)

      const response = await api.post<IEconomicIndexesValuesData>('/IndicesEconomicosValores/NovaData', { 
        id,
        token
      });
    
      setDate(FormatDate(new Date(response.data.date), 'yyyy-MM-dd'))

    } catch (err) {
      console.log(err);
    }
  }

  const handleClose = () => { 
    handleModalActive(false)
    handleResetStates()
  }

  const handleResetStates = () => { 
    setDate("")
    setEconomicIndexesValuesId(0)
    setValue("")
    handleModalActiveId(0)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalAddEconomicIndexes show={modalActive}>
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Novo Indicador
            <br />
            <br />
            <div style={{display:"flex"}}>
              <label htmlFor="comecaEm" style={{width:"45%", marginTop:"auto", marginBottom:"auto"}}>
                Data:
                <input 
                  type="date"
                  autoComplete="off"
                  value={date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                />
              </label>

              <div style={{marginLeft:"3%", marginTop:"auto"}}>
                <p style={{marginLeft:"5%"}}>Valor</p>
                <section style={{marginTop:"auto", marginLeft:"5%", width:"100%"}}>
                  <IntlCurrencyInput
                    currency="BRL"
                    config={changeDecimals}
                    value={value}
                    onChange={handleValue}
                  />
                </section>
              </div>
            </div>

            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  style={{width:'100px'}}
                  onClick={()=> saveEconomicIndexesValues()}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalAddEconomicIndexes>
      )}

      {isMOBILE &&(
        <ModalAddEconomicIndexesMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Novo Indicador
            <br />
            <br />
            <div style={{display:"flex"}}>
              <label htmlFor="comecaEm" style={{width:"45%", marginTop:"auto", marginBottom:"auto"}}>
                Data:
                <input 
                  type="date"
                  autoComplete="off"
                  value={date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                />
              </label>

              <div style={{marginLeft:"3%", marginTop:"auto"}}>
                <p style={{marginLeft:"5%"}}>Valor</p>
                <section style={{marginTop:"auto", marginLeft:"5%", width:"100%"}}>
                  <IntlCurrencyInput
                    currency="BRL"
                    config={changeDecimals}
                    value={value}
                    onChange={handleValue}
                  />
                </section>
              </div>
            </div>

            <br />
            <div style={{float:'right', marginRight:'7px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
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
                  onClick={() => handleClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalAddEconomicIndexesMobile>
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

      {(modalActive) && <OverlayModal /> }
    </>
  )
}

export default EconomicIndexesValuesEdit;
