import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { FiSave } from 'react-icons/fi';
import Select from 'react-select'
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import api from 'services/api';
import { ISelectData} from '../../../Interfaces/ICalendar';
import { ModalLegalCause, ModalLegalCauseMobile } from './styles';

export interface ILegalCauseData {
    legalCauseId: string;
    legalCauseDescription: string;
    legalNatureId: string;
    legalNatureDescription: string;
    count: string;
}

export interface ILegalNatureData{
  id: string;
  value: string;
}

const LegalCauseEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, handleModalActiveId, caller, modalActive, modalActiveId } = useModal();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [legalCauseDescription, setLegalCauseDescription] = useState<string>("");
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [legalNature, setLegalNature] = useState<ISelectData[]>([]);
  const [legalNatureId, setLegalNatureId] = useState('');
  const [legalNatureValue, setLegalNatureValue] = useState('');
  const [legalNatureTerm, setLegalNatureTerm] = useState(''); 
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectLegalCause(modalActiveId)
    }

  },[modalActiveId, caller])

  useEffect(() => {

    LoadLegalNature();
  },[caller])

  useDelay(() => {
    if (legalNatureTerm.length > 0){
      LoadLegalNature()
    }
  }, [legalNatureTerm], 3000)

  const SelectLegalCause = useCallback(async(id: number) => {

    const response = await api.post<ILegalCauseData>('/AcaoJudicial/Editar', {
      id,
      token
    })

    setLegalCauseDescription(response.data.legalCauseDescription)
    setLegalNatureId(response.data.legalNatureId)
    setLegalNatureValue(response.data.legalNatureDescription)


    // Open modal after load data
    handleModalActive(true)

  },[legalCauseDescription,legalNatureId]);

  const saveLegalCause = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (legalCauseDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
  
        return;
      }

      if (legalNatureValue === ""){
        addToast({
          type: "info",
          title: "Escolher Natureza Jurídica",
          description: "Favor selecionar uma Natureza Jurídica."
        })

        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      await api.post('/AcaoJudicial/Salvar', {
  
        legalCauseId: modalActiveId,
        legalCauseDescription,
        legalNatureId,
        token
      })
      
      addToast({
        type: "success",
        title: "Ação judícial salva",
        description: "A ação judícial foi adicionada no sistema."
      })
      setisSaving(false)
      handleLegalCauseModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar ação judícial.",
      })
    }
  },[isSaving,legalCauseDescription, legalNatureId]);

  // REPORT FIELDS - GET API DATA
  const LoadLegalNature = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? legalNatureValue:legalNatureTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ILegalNatureData[]>('/NaturezaJuridica/ListarNaturezaJuridica', {
        params:{
          filterClause: filter,
          rows: 50,
          token,
        }
      });

      const listLegalNature: ISelectData[] = []

      response.data.map(item => {
        return listLegalNature.push({
          id: item.id,
          label: item.value
        })
      })
      
      setLegalNature(listLegalNature)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }

  // REPORT FIELDS - CHANGE
  const handleLegalNatureSelected = (item) => { 
      
    if (item){
      setLegalNatureValue(item.label)
      setLegalNatureId(item.id)
    }else{
      setLegalNatureValue('')
      LoadLegalNature('reset')
      setLegalNatureId('')
      setLegalNatureTerm("")
    }
  }
  
  const handleLegalCauseModalClose = () => { 
    setLegalCauseDescription("")
    setLegalNatureId("")
    setLegalNatureTerm("")
    setLegalNatureValue("")
    handleCaller("")
    handleModalActiveId(0)
    handleModalActive(false)
  }

  const handleLegalCauseModalCloseAfterSave = () => { 
    setLegalCauseDescription("")
    setLegalNatureId("")
    setLegalNatureValue("")
    setLegalNatureTerm("")
    handleCaller("legalCauseModal")
    handleModalActiveId(0)
    handleModalActive(false)
  }
    
  return (
    <>
      {!isMOBILE &&(
        <ModalLegalCause show={modalActive}>
    
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Ação Judícial
    
            <br />
            <br />
    
            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={legalCauseDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLegalCauseDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <AutoCompleteSelect className="selectLegalNature">
              <p>Natureza Jurídica</p>  
              <Select
                isSearchable   
                value={{ id: legalNatureId, label: legalNatureValue }}
                onChange={handleLegalNatureSelected}
                onInputChange={(term) => setLegalNatureTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={legalNature}
              />
            </AutoCompleteSelect>
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveLegalCause()}
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
                  onClick={() => handleLegalCauseModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
    
          </div>
        </ModalLegalCause>
      )}

      {isMOBILE &&(
        <ModalLegalCauseMobile show={modalActive}>
    
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Ação Judícial
    
            <br />
            <br />
    
            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={legalCauseDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLegalCauseDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <AutoCompleteSelect className="selectLegalNature">
              <p style={{fontSize:'10px'}}>Natureza Jurídica</p>  
              <Select
                isSearchable   
                value={{ id: legalNatureId, label: legalNatureValue }}
                onChange={handleLegalNatureSelected}
                onInputChange={(term) => setLegalNatureTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={legalNature}
              />
            </AutoCompleteSelect>
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveLegalCause()}
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
                  onClick={() => handleLegalCauseModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
    
          </div>
        </ModalLegalCauseMobile>
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
export default LegalCauseEdit;