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
import { useHistory, useLocation } from 'react-router-dom';
import LoaderWaiting from 'react-spinners/ClipLoader';
import DatePicker from 'components/DatePicker';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalEconomicIndexes, ModalEconomicIndexesMobile, Flags, OverlayModal} from './styles';

export interface IEconomicIndexesData{
  economicIndexesId: string;
  economicIndexesDescription: string;
  flg_Public: string;
  allowDelete: boolean;
  flg_TypeValue: string;
  convertCoin: boolean;
  decimais: string;
  startDate: string;
  accessCodes: string;
  count: number;
}

const EconomicIndexesEdit = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const { handleModalActive, caller, modalActive, modalActiveId } = useModal();
  const [economicIndexesDescription, setEconomicIndexesDescription] = useState<string>("");
  const [economicIndexesStartDate, setEconomicIndexesStartDate] = useState<string>('')
  const [flg_TypeValue, setFlg_TypeValue] = useState<string>("P")
  const [decimais, setDecimais] = useState<string>("2")
  const [convertCoin, setConvertCoin] = useState<boolean>(true)
  const { isMOBILE } = useDevice();

  useEffect(() => {
    if (caller === ''){
      return
    }
  },[caller])

  const saveEconomicIndexes = useCallback(async() => {
    try {
      if (economicIndexesDescription === ""){
        addToast({
          type: "info",
          title: "Preencher o campo nome",
          description: `O nome do indicador não foi informado`
        })
        return;
      }

      if (economicIndexesStartDate === ""){
        addToast({
          type: "info",
          title: "Informe uma data inicial",
          description: `A data inicial do indicador não foi informada`
        })
        return;
      }

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

      const response = await api.post('/IndicesEconomicos/Salvar', {
        economicIndexesId: 0,
        economicIndexesDescription,
        flg_TypeValue,
        decimais,
        convertCoin,
        startDate: economicIndexesStartDate,
        token
      })

      localStorage.setItem('@GoJur:IndiceEconomico', response.data.economicIndexesId)
      setisSaving(false)
      
      addToast({
        type: "success",
        title: "Índice econômico salvo",
        description: "O índice econômico foi adicionado no sistema."
      })
      handleEconomicIndexesModalClose()
    } catch (err) {
      setisSaving(false)
      localStorage.removeItem('@GoJur:IndiceEconomico')
      addToast({
        type: "error",
        title: "Falha ao índice econômico.",
      })
    }
  },[isSaving, economicIndexesDescription, flg_TypeValue, decimais, convertCoin, economicIndexesStartDate]);
  
  const economicIndexes = localStorage.getItem('@GoJur:IndiceEconomico');

  if (economicIndexes)
  {
    history.push(`/EconomicIndexes/Edit/${economicIndexes}`)
  }

  const handleEconomicIndexesModalClose = () => { 
    setEconomicIndexesDescription("")
    setEconomicIndexesStartDate("")
    setFlg_TypeValue("P")
    setDecimais("2")
    setConvertCoin(true)
    handleModalActive(false)
  }

  return (
    <>
      {!isMOBILE &&(
        <ModalEconomicIndexes show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Indicador Econômico
            <br />
            <br />
            <div style={{display:"flex"}}>
              <label htmlFor="descricao" style={{fontSize:'12px', width:"90%", marginRight:"-22%", marginTop:"auto"}}>
                Nome
                <br />
                <input
                  type="text"
                  name="descricao"
                  value={economicIndexesDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <label htmlFor="comecaEm" style={{width:"35%", marginTop:"auto", marginBottom:"auto"}}>
                Começa em:
                <input 
                  type="date"
                  autoComplete="off"
                  value={economicIndexesStartDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesStartDate(e.target.value)}
                />
              </label>
            </div>

            <br />

            <div style={{display:"flex"}}>
              <label htmlFor="type">
                Tipo
                <br />
                <select
                  style={{width: '110%'}} 
                  name="Type"
                  value={flg_TypeValue}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlg_TypeValue(e.target.value)}
                >
                  <option value="P">Percentual</option>
                  <option value="V">Valor</option>
                  <option value="I">Valor / Indice Invertido</option>
                </select>
              </label>

              <label htmlFor="type" style={{width:"50%", marginLeft:"6%"}}>
                Decimais
                <br />
                <select
                  style={{width: '63%'}} 
                  name="Type"
                  value={decimais}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setDecimais(e.target.value)}
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </label>

              <div>
                <div style={{float:'left'}}>
                  <Flags>
                    <p style={{width:"245%", marginLeft:"-165%", marginBottom:"20%"}}>Converter Moeda:</p>
                  </Flags>
                </div>
              
                <div style={{float:'left', margin:'2px 36px', width: '20px'}}>
                  <input
                    type="checkbox"
                    name="select"
                    checked={convertCoin}
                    onChange={() => setConvertCoin(!convertCoin)}
                    style={{marginLeft:"-335%"}}
                  />
                </div>
              </div>
            </div>

            <br />
            <br />
            
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveEconomicIndexes()}
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
                  onClick={() => handleEconomicIndexesModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalEconomicIndexes>
      )}

      {isMOBILE &&(
        <ModalEconomicIndexesMobile show={modalActive}>
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Indicador Econômico
            <br />
            <br />
            <div>
              <label htmlFor="descricao" style={{fontSize:'12px', width:"90%", marginRight:"-22%", marginTop:"auto"}}>
                Nome
                <br />
                <input
                  type="text"
                  name="descricao"
                  value={economicIndexesDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesDescription(e.target.value)}
                  autoComplete="off"
                />
              </label>
            
              <br />              
              <label htmlFor="comecaEm">
                Começa em:
                <input 
                  type="date"
                  autoComplete="off"
                  value={economicIndexesStartDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesStartDate(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label htmlFor="type">
                Tipo
                <br />
                <select
                  style={{width: '100%'}} 
                  name="Type"
                  value={flg_TypeValue}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlg_TypeValue(e.target.value)}
                >
                  <option value="P">Percentual</option>
                  <option value="V">Valor</option>
                  <option value="I">Valor / Indice Invertido</option>
                </select>
              </label>

              <label htmlFor="type">
                Decimais
                <select
                  style={{width: '100%'}} 
                  name="Type"
                  value={decimais}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setDecimais(e.target.value)}
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </label>

              <br />

              <div style={{marginTop:"5%"}}>
                <div style={{float:'left'}}>
                  <Flags>
                    <p style={{width:"245%", fontSize:"11px"}}>Converter Moeda:</p>
                  </Flags>
                </div>
              
                <div style={{float:'left', margin:'2px 36px', width: '20px'}}>
                  <input
                    type="checkbox"
                    name="select"
                    checked={convertCoin}
                    onChange={() => setConvertCoin(!convertCoin)}
                    style={{marginLeft:"100%"}}

                  />
                </div>
              </div>
            </div>

            <br />
            <br />
            
            <div style={{float:'right', marginRight:'5px', marginTop:"4%"}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveEconomicIndexes()}
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
                  onClick={() => handleEconomicIndexesModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </ModalEconomicIndexesMobile>
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

export default EconomicIndexesEdit;
