import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import Select from 'react-select';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { customStyles } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useToast } from 'context/toast';
import { FModal, Overlay } from './styles';
import { FaFileAlt, FaIdCard, FaRegTimesCircle } from 'react-icons/fa';
import { FcKey, FcSearch } from 'react-icons/fc';
import { SiSonarsource } from 'react-icons/si';
import CredentialModal from '../Credentials';
import CredentialsDataSourceModal from '../Credentials/EditModal';

export interface ICredentials {
  id_Credential: string;
  des_Credential: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export default function FollowModal(props) {
  const token = localStorage.getItem('@GoJur:token')
  const {handleCloseFollowModal, matterSelectedNumber, handleSecretJusticeChange, isSecretJustice, handleFollowMatter, handleSelectCredentialId, isChanging} = props.callbackFunction;
  const {isConfirmMessage,handleCaller, caller, isCancelMessage, handleCancelMessage,handleConfirmMessage } = useConfirmBox();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false)
  const { addToast } = useToast()
  const [credentialTerm, setCredentialTerm] = useState('')
  const [credentialId, setCredentialId] = useState<string>('')
  const [credentialValue, setCredentialValue] = useState<string>('')
  const [credentialsList, setCredentialsList] = useState<ISelectData[]>([])
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false)
  const [isTJES, setIsTJES] = useState<boolean>(false)
  const [isTJPI, setIsTJPI] = useState<boolean>(false)
  const hiddenButtonRef = useRef(null);
  const [checkMessage, setCheckMessage] = useState(false);

  useEffect(() => {
    let clearMatterNumber = matterSelectedNumber.replace(/[\/\.\-]/g, "");
    let courtNumber = clearMatterNumber.substring(13, 16)

    if(courtNumber == "808"){
      setIsTJES(true)
    }

    if(courtNumber == "818"){
      setIsTJPI(true)
    }

    LoadCredentials();
  }, [])


  useEffect(() => {
    if (isCancelMessage && caller == 'validateCourt'){
      setCheckMessage(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])   

  
  useEffect(() => {
    if (isConfirmMessage && caller == 'validateCourt'){
      setCheckMessage(false)
      handleConfirmMessage(false)
      handleCaller('')

      hiddenButtonRef.current.click();
    }
  }, [isConfirmMessage])


  const handleCredentialSelected = (item) => {
    if (item) {
      setCredentialValue(item.label);
      setCredentialId(item.id);
      handleSelectCredentialId(item.id);
    }
    else {
      setCredentialValue('');
      LoadCredentials();
      setCredentialId('');
      setCredentialTerm('');
    }
  }


  const handleIsNewCredential = (id, description) => {
    LoadCredentials();
    setCredentialId(id);
    setCredentialValue(description);
    handleSelectCredentialId(id);
  }


  const LoadCredentials = async () => {
    if (isLoadingComboData) {
      return false;
    }

    try {
      const response = await api.get<ICredentials[]>('/Credenciais/Listar', {
        params: {
          token,
        },
      });

      const listCredentials: ISelectData[] = [];

      response.data.map((item) => {
        return listCredentials.push({
          id: item.id_Credential,
          label: item.des_Credential,
        });
      });

      setCredentialsList(listCredentials);
      setIsLoadingComboData(false);
    }
    catch (err) {
      console.log(err);
    }
  }


  const handleCloseEditModal = async () => {
    setShowNewCredentials(false)
  }


  const openNewCredentialModal = useCallback(() => {
    setShowNewCredentials(true)
  }, [showNewCredentials])


  const Confirm = async () => {
    try {
      
      if(isTJES || isTJPI){
        const response = await api.get('/Credenciais/ValidarTribunal', {
          params: {
            token,
            id_Credential : Number(credentialId),
            matterNumber: matterSelectedNumber,
            doubleCheck: false
          },
        });

        if(response.data == true){
          hiddenButtonRef.current.click();
        }
      }
      else {
        hiddenButtonRef.current.click();
      }
    }
    catch (err:any) {
      if (err.response.data.typeError.warning == "awareness"){
        setCheckMessage(true)
      }
      else{
        addToast({type: 'error', title: 'Falha ao validar tribunal', description: err.response.data.Message});
      }
    }
  }


  return (
    <>
      {isChanging && (
        <>
          <Overlay />
          <div className="waitingMessage" style={{ zIndex: 999999999 }}>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}

      {checkMessage && (
        <ConfirmBoxModal
          buttonCancelText="Cancelar"
          buttonOkText="Confirmar"
          caller="validateCourt"
          useCheckBoxConfirm
          message="Não foram informadas as credenciais para a pesquisa, neste caso a pesquisa não será efetuada no TJES/PJE (sistema PJE)"
        />
      )}
  
      {showNewCredentials && <CredentialsDataSourceModal callbackFunction={{ handleCloseEditModal, handleIsNewCredential }} />}
  
      <FModal show>
        <div className="header" style={{ flex: '0 0 auto', padding: '2px 5px' }}>
          <p className="headerLabel">Seguir Processo</p>
        </div>
  
        <h5>Caso o processo necessite de credencial em virtude de segredo de justiça ou consulta logada, informe a credencial.</h5>
  
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "20px" }}>
          <label style={{ marginRight: '20px' }}>
            <input
              className="inputField"
              type="text"
              value={matterSelectedNumber}
              style={{ fontWeight: '800px', fontSize: '20px', width: '280px' }}
              disabled
            />
          </label>
          <label style={{ display: 'flex'}}>
            <input
              type="checkbox"
              style={{ marginRight: '5px' }}
              checked={isSecretJustice}
              onChange={handleSecretJusticeChange}
            />
            Usar Credencial
          </label>
        </div>

        {isTJES && (
          <>
          <br />
          <div id='TJSE' style={{ display:"flex", justifyContent:'center', alignItems:'center', color:'#FF0000', fontSize:'13px' }}>
            Para pesquisa no PJE/TJES é necessário que seja informado usuário e senha
          </div>
          </>
        )}
  
        {isSecretJustice && (
          <>
            <br />
  
            <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
              <AutoCompleteSelect className="selectCredentials" style={{ width: '50%' }}>
                <p>Credenciais:</p>
                <Select
                  isSearchable
                  value={{ id: credentialId, label: credentialValue }}
                  onChange={handleCredentialSelected}
                  onInputChange={(term) => setCredentialTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={customStyles}
                  options={credentialsList}
                  menuPortalTarget={document.body}
                  menuPosition={'fixed'}
                />
              </AutoCompleteSelect>
  
              <button
                className="buttonLinkClick buttonInclude"
                title="Clique para incluir uma nova credencial"
                type="submit"
                style={{ marginLeft: '10px', marginTop: "1.5rem" }}
                onClick={openNewCredentialModal}
              >
                <FcKey />
                <span>Criar Credencial</span>
              </button>
            </div>
          </>
        )}
  
        <div style={{ flex: '0 0 auto', padding: '10px', bottom: '10px', width: '100%', marginTop: "4%", marginBottom: "7%" }}>
          <div style={{ float: 'right', marginRight: '1%' }}>
            <button
              type='button'
              className="buttonClick"
              onClick={() => handleCloseFollowModal()}
              style={{ width: '100px' }}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
  
          <div style={{ float: 'right', marginRight: '10px' }}>
            <button className="buttonClick" title="Clique para monitorar o processo" type='button' onClick={()=> Confirm()}>
              <SiSonarsource />
              Confirmar
            </button>
          </div>

          <div style={{ float: 'right', marginRight: '10px' }}>
            <button ref={hiddenButtonRef} style={{ display: "none" }} title="Clique para monitorar o processo" type='submit' onClick={handleFollowMatter}>
              <SiSonarsource />
            </button>
          </div>

        </div>
  
      </FModal>
    </>
  );
}