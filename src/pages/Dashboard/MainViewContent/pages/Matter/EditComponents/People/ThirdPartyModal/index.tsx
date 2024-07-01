import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import { useModal } from 'context/modal';
import { FiSave } from 'react-icons/fi';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { selectStyles} from 'Shared/utils/commonFunctions';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { IThirdPartyData, IThirdPartyGroupData, ISelectData } from 'context/Interfaces/PeoplesModal';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import Select from 'react-select'
import api from 'services/api';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { FaRegTimesCircle } from 'react-icons/fa';
import { ModalThirdParty, ModalThirdPartyMobile } from './styles';

const ThirdPartyEdit = (props) => {

  const { handleUpdateNewThirdy } = props.callbackFunction

  const { addToast } = useToast();
  const { handleShowThirdPartyModal } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [value, setThirdPartyDescription] = useState<string>("");
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [thirdPartyGroup, setThirdPartyGroup] = useState<ISelectData[]>([]);
  const [thirdPartyGroupId, setThirdPartyGroupId] = useState('');
  const [thirdPartyGroupValue, setThirdPartyGroupValue] = useState('');
  const [thirdPartyGroupTerm, setThirdPartyGroupTerm] = useState(''); 
  const { isMOBILE } = useDevice();

  useEffect(() => {

    LoadThirdPartyGroup();
    
  },[thirdPartyGroupId, thirdPartyGroupValue])

  

  const handleSave = useCallback(async()  => {

    try
    {
      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (value === '') {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo nome deve ser preenchido`
        })
  
        return;
      }
  
      if (thirdPartyGroupValue === '') {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo grupo de terceiro deve ser preenchido`
        })
  
        return;
      }

      setisSaving(true)

      const response = await api.post<IThirdPartyData>('/Terceiros/Salvar', { 
        cod_Terceiro: 0,
        nom_Pessoa: value,
        cod_GrupoTerceiro: thirdPartyGroupId,
        des_GrupoTerceiro: thirdPartyGroupValue,
        token  
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `O terceiro foi salvo com sucesso`
      })

      handleUpdateNewThirdy(response.data)
      handleThirdPartyModalClose();

    }
    catch(err){
      setisSaving(false)
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: `Houve uma falha ao salvar o terceiro`
      })
      console.log(err)
    }

  },[isSaving,value, thirdPartyGroupId])

  // REPORT FIELDS - GET API DATA
  const LoadThirdPartyGroup = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? thirdPartyGroupValue:thirdPartyGroupTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IThirdPartyGroupData[]>('/GrupoTerceiros/ListarPorDescrição', {
        params:{
          rows: 50,
          filterClause: filter,  
          token,
        }
      });

      const listThirdPartyGroup: ISelectData[] = []

      response.data.map(item => {
        return listThirdPartyGroup.push({
          id: item.id,
          label: item.value
        })
      })
      
      setThirdPartyGroup(listThirdPartyGroup)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }

  const handleThirdPartyModalClose = () => { 
    setThirdPartyDescription("")
    setThirdPartyGroupValue("")
    setThirdPartyGroupId("")
    handleShowThirdPartyModal(false)
  }

  // REPORT FIELDS - CHANGE
  const handleThirdPartyGroupSelected = (item) => { 
      
    if (item){
      setThirdPartyGroupValue(item.value)
      setThirdPartyGroupId(item.id)
    }else{
      setThirdPartyGroupValue('')
      LoadThirdPartyGroup('reset')
      setThirdPartyGroupId('')
    }
  }

  return (
    <>
      
      <div>
        {!isMOBILE &&(
        <Modal
          isOpen   
          overlayClassName="react-modal-overlay"
          className="react-modal-peoplesModal"
        
        >
          <ModalThirdParty>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Terceiro

              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Nome
                <br />
                <input
                  maxLength={50} 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setThirdPartyDescription(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <br />
              <br />

              <AutoCompleteSelect className="selectLegalNature">
                <p>Grupo</p>  
                <Select
                  isSearchable   
                  value={thirdPartyGroup.filter(options => options.id == thirdPartyGroupId)}
                  onChange={handleThirdPartyGroupSelected}
                  onInputChange={(term) => setThirdPartyGroupTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={thirdPartyGroup}
                />
              </AutoCompleteSelect>

              <br />
              <br />
              <div style={{float:'right', marginRight:'12px'}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> handleSave()}
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
                    onClick={() => handleThirdPartyModalClose()}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalThirdParty>
        </Modal>
          
          )}
      </div>
          
      {isMOBILE &&(
      <Modal
        isOpen   
        overlayClassName="react-modal-overlay"
        className="react-modal-peoplesModalMobile"
      
      >   
        <ModalThirdPartyMobile>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Terceiro

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Nome
              <br />
              <input
                maxLength={50} 
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setThirdPartyDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <AutoCompleteSelect className="selectLegalNature">
              <p>Grupo</p>  
              <Select
                isSearchable   
                value={thirdPartyGroup.filter(options => options.id == thirdPartyGroupId)}
                onChange={handleThirdPartyGroupSelected}
                onInputChange={(term) => setThirdPartyGroupTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={thirdPartyGroup}
              />
            </AutoCompleteSelect>
            <br />
            <br />
            <div style={{float:'right', marginRight:'5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> handleSave()}
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
                  onClick={handleThirdPartyModalClose}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalThirdPartyMobile>
      </Modal>
      )}
      {isSaving && (
      <>
        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp;
          Salvando cliente ...
        </div>
      </>
      )}   
      
    </>
  )

}

export default ThirdPartyEdit;
