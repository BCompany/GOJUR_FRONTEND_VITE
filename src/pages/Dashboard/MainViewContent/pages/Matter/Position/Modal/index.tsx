import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { FiSave } from 'react-icons/fi';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import Select from 'react-select'
import { useToast } from 'context/toast';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { ISelectData} from '../../../Interfaces/ICalendar';
import { ModalPosition, ModalPositionMobile } from './styles';

export interface IPositionData {
  positionId: string;
  positionDescription: string;
  positionName: string;
  positionType: string;
  opposingId: string;
  opposingDescription: string;
}

const PositionEdit = () => {
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, handleModalActiveId, caller, modalActive, modalActiveId } = useModal();
  const [positionDescription, setPositionDescription] = useState<string>("");
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [opposing, setOpposing] = useState<ISelectData[]>([]);
  const [opposingId, setOpposingId] = useState('');
  const [opposingValue, setOpposingValue] = useState('');
  const [opposingTerm, setOpposingTerm] = useState('');
  const [type, setType] = useState<string>('D');
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectPosition(modalActiveId)
    }

  },[modalActiveId, caller])

  useEffect(() => {
    LoadOpposing();
    
  },[caller])

  useDelay(() => {
    if (opposingTerm.length > 0){
      LoadOpposing()
    }
  }, [opposingTerm], 3000)


  const SelectPosition = useCallback(async(id: number) => {

    const response = await api.post<IPositionData>('/Parte/Editar', {
      id,
      token
    })

    setPositionDescription(response.data.positionDescription)
    setOpposingId(response.data.opposingId)
    setOpposingValue(response.data.opposingDescription)
    setType(response.data.positionType)
    
    // Open modal after load data
    handleModalActive(true)

  },[positionDescription,opposingId,type, opposingValue, opposingId]);

  const savePosition = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }
      
      if (positionDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
  
        return;
      }
      
      const token = localStorage.getItem('@GoJur:token');
      
      setisSaving(true)
      await api.post('/Parte/Salvar', {
  
        positionId: modalActiveId,
        positionDescription,
        opposingId,
        positionType: type,
        token
      })
      
      
      addToast({
        type: "success",
        title: "Parte salva",
        description: "A parte foi adicionada no sistema."
      })

      handlePositionCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar parte.",
      })
    }
  },[isSaving,positionDescription,opposingId,type]);

  // REPORT FIELDS - GET API DATA
const LoadOpposing = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  // when is a first initialization get value from edit if not load from state as term typing
  let filter = stateValue == "initialize"? opposingValue:opposingTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<IPositionData[]>('Parte/ListarPorNome', {
      params:{
      page: 1,
      rows: 50,
      filterClause:filter,
      token,
      }
    });

    const listOpposing: ISelectData[] = []

    response.data.map(item => {
      return listOpposing.push({
        id: item.positionId,
        label: item.positionName
      })
    })
    
    setOpposing(listOpposing)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}

  // REPORT FIELDS - CHANGE
const handleOpposingSelected = (item) => { 
    
  if (item){
    setOpposingValue(item.label)
    setOpposingId(item.id)
  }else{
    setOpposingValue('')
    LoadOpposing('reset')
    setOpposingId('')
  }
}

  const handlePositionClose = () => { 
    setPositionDescription('')
    setOpposingId('')
    setOpposingTerm('')
    setOpposingValue("")
    handleModalActiveId(0)
    setType('D')
    handleCaller("")
    handleModalActive(false)
  }

  const handlePositionCloseAfterSave = () => { 
    setPositionDescription('')
    setOpposingValue("")
    setOpposingTerm('')
    setOpposingId('')
    handleModalActiveId(0)
    setType('D')
    handleCaller("positionModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalPosition show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Parte
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
                value={positionDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPositionDescription(e.target.value)}
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
                value={type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
              >
                <option value="D">Demandado</option>
                <option value="M">Demandante</option>
                <option value="T">Terceiro</option>

              </select>
            </label>

            <br />
            <br />

            <AutoCompleteSelect className="selectOpposing">
              <p>Parte Contrária</p>  
              <Select
                isSearchable   
                value={{ id: opposingId, label: opposingValue }}
                onChange={handleOpposingSelected}
                onInputChange={(term) => setOpposingTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={opposing}
              />
            </AutoCompleteSelect>
            
            <br />
            <br />

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> savePosition()}
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
                  onClick={() => handlePositionClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalPosition>
      )}

      {isMOBILE &&(
        <ModalPositionMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Posição no processo
            <br />
            <br />
            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input 
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={positionDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPositionDescription(e.target.value)}
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
                value={type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
              >
                <option value="D">Demandado</option>
                <option value="M">Demandante</option>
                <option value="T">Terceiro</option>

              </select>
            </label>

            <br />
            <br />

            <AutoCompleteSelect className="selectOpposing">
              <p style={{fontSize:'10px'}}>Parte Contrária</p>  
              <Select
                isSearchable   
                value={{ id: opposingId, label: opposingValue }}
                onChange={handleOpposingSelected}
                onInputChange={(term) => setOpposingTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={opposing}
              />
            </AutoCompleteSelect>
            
            <br />
            <br />

            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> savePosition()}
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
                  onClick={() => handlePositionClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalPositionMobile>
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
export default PositionEdit;