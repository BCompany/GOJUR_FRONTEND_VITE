import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import Select from 'react-select';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { customStyles } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { MdBlock } from 'react-icons/md';
import { useToast } from 'context/toast';
import { FModal, Overlay } from './styles';
import { FaFileAlt, FaIdCard, FaRegTimesCircle } from 'react-icons/fa';
import { FcKey, FcSearch } from 'react-icons/fc';
import { SiSonarsource } from 'react-icons/si';
import CredentialModal from '../../Credentials';
import CredentialsDataSourceModal from '../../Credentials/EditModal';

export interface ICredentials {
  id_Credential: string;
  des_Credential: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export default function FollowModal(props) {
  const {
    handleCloseFollowModal,
    matterSelectedNumber,
    handleSecretJusticeChange,
    isSecretJustice,
    handleFollowMatter,
    handleSelectCredentialId
  } = props.callbackFunction;
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const { addToast } = useToast();
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [credentialTerm, setCredentialTerm] = useState('');
  const [credentialId, setCredentialId] = useState<string>('');
  const [credentialValue, setCredentialValue] = useState<string>('');
  const [credentialsList, setCredentialsList] = useState<ISelectData[]>([]);
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false)
  const [isNewCredential, setIsNewCredential] = useState<boolean>(false);

  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    LoadCredentials();
  }, []);

  const handleCredentialSelected = (item) => {
    if (item) {
      setCredentialValue(item.label);
      setCredentialId(item.id);
      handleSelectCredentialId(item.id);
    } else {
      setCredentialValue('');
      LoadCredentials();
      setCredentialId('');
      setCredentialTerm('');
    }
  };

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
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseEditModal = async () => {
    setShowNewCredentials(false)
  };

  const openNewCredentialModal = useCallback(() => {
    setShowNewCredentials(true)
  }, [showNewCredentials]);

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
  
      {showNewCredentials && <CredentialsDataSourceModal callbackFunction={{ handleCloseEditModal, handleIsNewCredential }} />}
  
      <FModal show>
        <div className="header" style={{ flex: '0 0 auto', padding: '2px 5px' }}>
          <p className="headerLabel">Seguir Processo</p>
        </div>
  
        <h5>Caso o processo seja segredo de justiça, marque e informe a credencial.</h5>
  
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
            Segredo de Justiça
          </label>
        </div>
  
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
            <button 
              className="buttonClick" 
              title="Clique para incluir uma ação judícial"
              type="submit"
              onClick={handleFollowMatter}
            >
              <SiSonarsource />
              Confirmar
            </button>
          </div>
        </div>
  
      </FModal>
    </>
  );
}