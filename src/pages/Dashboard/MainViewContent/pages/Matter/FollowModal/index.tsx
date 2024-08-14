import React, { ChangeEvent, useState, useEffect } from 'react';
import Modal from 'react-modal';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import Select from 'react-select';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { MdBlock } from 'react-icons/md';
import { useToast } from 'context/toast';
import { ModalFollow, Overlay } from './styles';
import { FaFileAlt, FaIdCard, FaRegTimesCircle } from 'react-icons/fa';
import { FcKey, FcSearch } from 'react-icons/fc';
import { SiSonarsource } from 'react-icons/si';

export interface ICredentials {
  Id_Credential: string;
  Des_Credential: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export default function FollowModal(props) {
  const {
    handleCloseFollowModal,
    matterSelectedId,
    matterSelectedNumber,
    handleSecretJusticeChange,
    isSecretJustice,
    handleFollowButton,
  } = props.callbackFunction;
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const { addToast } = useToast();
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [credentialTerm, setCredentialTerm] = useState('');
  const [credentialId, setCredentialId] = useState<string>('');
  const [credentialValue, setCredentialValue] = useState<string>('');
  const [credentialsList, setCredentialsList] = useState<ISelectData[]>([]);

  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    LoadCredentials();
  }, []);

  const handleCredentialSelected = (item) => {
    if (item) {
      setCredentialValue(item.label);
      setCredentialId(item.id);
    } else {
      setCredentialValue('');
      LoadCredentials();
      setCredentialId('');
      setCredentialTerm('');
    }
  };

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
          id: item.Id_Credential,
          label: item.Des_Credential,
        });
      });

      setCredentialsList(listCredentials);

      setIsLoadingComboData(false);
    } catch (err) {
      console.log(err);
    }
  };

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

      <ModalFollow show>
        <div className="header" style={{ flex: '0 0 auto', padding: '2px 5px' }}>
          <p className="headerLabel">Seguir Processo</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "40px" }}>
          <label style={{ marginRight: '20px' }}>
            <input
              className="inputField"
              type="text"
              value={matterSelectedNumber}
              style={{ fontWeight: '800px', fontSize: '20px' }}
              disabled
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
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
                  styles={selectStyles}
                  options={credentialsList}
                />
              </AutoCompleteSelect>

              <button
                className="buttonLinkClick buttonInclude"
                title="Clique para incluir uma nova credencial"
                type="submit"
                style={{ marginLeft: '10px', marginTop: "1.5rem" }}
              >
                <FcKey />
                <span>Criar Credencial</span>
              </button>
            </div>
          </>
        )}

        <div style={{ flex: '0 0 auto', padding: '10px', position: 'fixed', bottom: '10px', width: '100%' }}>
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
              onClick={handleFollowButton}
            >
              <SiSonarsource />
              Confirmar
            </button>
          </div>
        </div>

      </ModalFollow>
    </>
  );
}