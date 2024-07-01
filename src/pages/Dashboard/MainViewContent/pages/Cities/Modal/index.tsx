/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Select from 'react-select'
import { selectStyles} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalCities, ModalCitiesMobile } from './styles';

export interface ICitiesData {
  citiesId: string;
  citiesDescription: string;
  federalUnitId: string;
  count: string;
}

export interface IFederalUnitData{
  id: string;
  value: string;
}

export interface ISelectData{
  id: string;
  label: string;
}

const CitiesEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [citiesDescription, setCitiesDescription] = useState<string>("");
  const [federalUnit, setFederalUnit] = useState<ISelectData[]>([]);
  const [federalUnitId, setFederalUnitId] = useState('');
  const [federalUnitValue, setFederalUnitValue] = useState('');
  const [federalUnitTerm, setFederalUnitTerm] = useState('');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectCities(modalActiveId)
    }

  },[modalActiveId, caller])

  useEffect(() => {

    LoadFederalUnit();
    
  },[federalUnitId, federalUnitValue])

  const SelectCities = useCallback(async(id: number) => {

    const response = await api.post<ICitiesData>('/Cidades/Editar', {
      id,
      federalUnitId,
      token
    })

    setCitiesDescription(response.data.citiesDescription)
    setFederalUnitId(response.data.federalUnitId)


    // Open modal after load data
    handleModalActive(true)

  },[citiesDescription,federalUnitId]);

  const saveCities = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (federalUnitId === ""){
        addToast({
          type: "info",
          title: "Escolher Unidade Federal",
          description: "Favor selecionar uma Unidade Federativa."
        })

        return;
      }

      if (citiesDescription === "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
  
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      
      await api.post('/Cidades/Salvar', {
  
        citiesId: modalActiveId,
        citiesDescription,
        federalUnitId,
        token
      })
      
      addToast({
        type: "success",
        title: "Cidade salva",
        description: "A cidade foi adicionada no sistema."
      })
      
      handleCitiesModalCloseAfterSave()
      setisSaving(false)
      
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar vara.",
      })
    }
  },[isSaving,citiesDescription, federalUnitId]);

  // REPORT FIELDS - GET API DATA
  const LoadFederalUnit = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? federalUnitValue:federalUnitTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<IFederalUnitData[]>('/Estados/Listar', {
          token    
      });

      const listFederalUnit: ISelectData[] = []

      response.data.map(item => {
        return listFederalUnit.push({
          id: item.id,
          label: item.value
        })
      })
      
      setFederalUnit(listFederalUnit)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }

  // REPORT FIELDS - CHANGE
  const handleFederalUnitSelected = (item) => { 
      
    if (item){
      setFederalUnitValue(item.value)
      setFederalUnitId(item.id)
    }else{
      setFederalUnitValue('')
      LoadFederalUnit('reset')
      setFederalUnitId('')
    }
  }

  const handleCitiesModalClose = () => { 
    setCitiesDescription('')
    setFederalUnitId('')
    handleCaller("")
    handleModalActive(false)
  }

  const handleCitiesModalCloseAfterSave = () => { 
    setCitiesDescription('')
    setFederalUnitId('')
    handleCaller("citiesModal")
    handleModalActive(false)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalCities show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Cidade

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
                value={citiesDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCitiesDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <AutoCompleteSelect className="selectFederalUnit">
              <p>Unidade Federal</p>  
              <Select
                sSearchable   
                value={federalUnit.filter(options => options.id == federalUnitId)}
                onChange={handleFederalUnitSelected}
                onInputChange={(term) => setFederalUnitTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={federalUnit}
              />
            </AutoCompleteSelect>
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveCities()}
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
                  onClick={() => handleCitiesModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalCities>
      )}

      {isMOBILE &&(
        <ModalCitiesMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Cidade

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
                value={citiesDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCitiesDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <AutoCompleteSelect className="selectFederalUnit">
              <p style={{fontSize:'10px'}}>Unidade Federal</p>  
              <Select
                sSearchable   
                value={federalUnit.filter(options => options.id == federalUnitId)}
                onChange={handleFederalUnitSelected}
                onInputChange={(term) => setFederalUnitTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={federalUnit}
              />
            </AutoCompleteSelect>
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveCities()}
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
                  onClick={() => handleCitiesModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalCitiesMobile>
      )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando cidade ...
          </div>
        </>
      )}  
    </>
  )
  
  }
  export default CitiesEdit;