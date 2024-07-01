import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiSave } from 'react-icons/fi';
import Select from 'react-select'
import { selectStyles} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import api from 'services/api';
import { ISelectData} from '../../../Interfaces/ICalendar';
import { ModalCourt, ModalCourtMobile } from './styles';

export interface ICourtData{
    forumId: string;
    forumName: string;
    forumTypeId: string;
    forumClass: string;
    federalUnitId: string;
    federalUnitName: string;
    forumPathDescription: string;
}

export interface IFederalUnitData{
  federalUnitId: string;
  federalUnitName: string;
}

const CourtEdit = (props) => {

  const { addToast } = useToast();
    const { callerOrigin } = props;
    const token = localStorage.getItem('@GoJur:token');
    const { handleModalActive, handleCaller,caller, modalActive, modalActiveId } = useModal();
    const [forumName, setForumName] = useState<string>("");
    const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
    const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
    const [federalUnit, setFederalUnit] = useState<ISelectData[]>([]);
    const [federalUnitId, setFederalUnitId] = useState('');
    const [federalUnitValue, setFederalUnitValue] = useState('');
    const [federalUnitTerm, setFederalUnitTerm] = useState('');
    const [classType, setClassType] = useState<string>('E');
    const [forumTypeId, setForumTypeId] = useState("")
    const { isMOBILE } = useDevice();

    useEffect(() => {

      if (caller === ''){
        return
      }

      if (modalActiveId > 0){
        SelectCourt(modalActiveId)
      }

    },[modalActiveId, caller])

    useEffect(() => {

      LoadFederalUnit();

    },[federalUnitId, federalUnitValue])


    const SelectCourt = useCallback(async(id: number) => {

      const response = await api.post<ICourtData>('/Forum/Editar', {
        id,
        token
      })

      setForumName(response.data.forumName)
      setFederalUnitId(response.data.federalUnitId)
      setClassType(response.data.forumClass)
      setForumTypeId(response.data.forumTypeId)

      // Open modal after load data
      handleModalActive(true)

    },[forumName,federalUnitId,classType,forumTypeId]);

    const saveCourt = useCallback(async() => {
      try {

        if (isSaving) {
          addToast({
            type: "info",
            title: "Operação NÃO realizada",
            description: `Já existe uma operação em andamento`
          })

          return;
        }

        if (forumName == "") {
          addToast({
            type: "info",
            title: "Operação NÃO realizada",
            description: `Preencha o campo descrição antes de salvar.`
          })
    
          return;
        }

        if (federalUnitValue === ""){
          addToast({
            type: "info",
            title: "Escolher estado",
            description: "Favor selecionar um Estado."
          })

          return;
        }

        if (callerOrigin != 'matterCourt') setisSaving(true)

        const token = localStorage.getItem('@GoJur:token');
        const response = await api.post('/Forum/Salvar', {

          forumId: modalActiveId,
          forumName,
          federalUnitId,
          forumClass: classType,
          forumTypeId,
          token
        })


        addToast({
          type: "success",
          title: "Fórum salvo",
          description: "O fórum foi adicionada no sistema."
        })
        setisSaving(false)

      // calls callback from submodal on matter order list
        if (callerOrigin === 'matterCourt'){
          await props.callbackFunction.handleMatterCourtCallBack(response.data)
        }

        handleCourtModalCloseAfterSave()
        setisSaving(false)

      } catch (err) {
        setisSaving(false)
        addToast({
          type: "error",
          title: "Falha ao salvar fórum.",
        })
      }
    },[isSaving,forumName,federalUnitId,classType,forumTypeId]);

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
      const response = await api.get<IFederalUnitData[]>('/Forum/ListarEstados', {
        params:{
          token
        }
      });

      const listFederalUnit: ISelectData[] = []

      response.data.map(item => {
        return listFederalUnit.push({
          id: item.federalUnitId,
          label: item.federalUnitName
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

    const handleCourtModalClose = () => {
      setForumName('')
      setFederalUnitId('')
      setClassType('E')
      setForumTypeId('0')
      handleCaller("")
      handleModalActive(false)
    }

    const handleCourtModalCloseAfterSave = () => {
      setForumName('')
      setFederalUnitId('')
      setClassType('E')
      setForumTypeId('0')
      handleCaller("courtModal")
      handleModalActive(false)
    }

    return (
      <>
        {!isMOBILE &&(
          <ModalCourt show={modalActive && caller=='courtModal'}>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Fórum
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
                  value={forumName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForumName(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <br />
              <br />
              <AutoCompleteSelect className="selectFederalUnit">
                <p>Estado</p>
                <Select
                  isSearchable
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
              <label htmlFor="type">
                Tipo
                <br />
                <select
                  name="classType"
                  value={classType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setClassType(e.target.value)}
                >
                  <option value="E">ESTADUAL</option>
                  <option value="T">TRABALHISTA</option>
                  <option value="F">FEDERAL</option>
                  <option value="S">ESPECIALIZADO</option>
                  <option value="X">EXTRAJUDICIAL</option>
                </select>
              </label>
              <br />
              <br />
              <br />
              <br />
              <div style={{float:'right', marginRight:'12px'}}>
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> saveCourt()}
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
                    onClick={() => handleCourtModalClose()}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalCourt>
        )}

        {isMOBILE &&(
          <ModalCourtMobile show={modalActive}>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Fórum
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
                  value={forumName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForumName(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <br />
              <br />
              <AutoCompleteSelect className="selectFederalUnit">
                <p style={{fontSize:'10px'}}>Estado</p>
                <Select
                  isSearchable
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
              <label htmlFor="type" style={{fontSize:'10px'}}>
                Tipo
                <br />
                <select
                  name="classType"
                  value={classType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setClassType(e.target.value)}
                >
                  <option value="E">ESTADUAL</option>
                  <option value="T">TRABALHISTA</option>
                  <option value="F">FEDERAL</option>
                  <option value="S">ESPECIALIZADO</option>
                  <option value="X">EXTRAJUDICIAL</option>
                </select>
              </label>
              <br />
              <br />
              <br />
              <br />
              <div style={{float:'right', marginRight:'-5px'}}>
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> saveCourt()}
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
                    onClick={() => handleCourtModalClose()}
                    style={{width:'90px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalCourtMobile>
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
  export default CourtEdit;
