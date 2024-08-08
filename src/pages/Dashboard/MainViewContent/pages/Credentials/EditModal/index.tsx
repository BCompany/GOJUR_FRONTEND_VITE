/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */

import React, { ChangeEvent, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import api from 'services/api';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { FiTrash } from 'react-icons/fi';
import Select from 'react-select'
import LoaderWaiting from 'react-spinners/ClipLoader';
import { MdBlock } from 'react-icons/md';
import { useToast } from 'context/toast';
import { Box, Container, Content, OverlayPermission, ItemBox } from './styles';


export interface ISelectData {
  id: string;
  label: string;
}

export interface ICredentialDataSource {
  id_CourDataSource: string;
  description: string;
}

export default function CredentialsDataSourceModal(props) {
  const { handleCloseEditModal } = props.callbackFunction;
  const { addToast } = useToast();
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [des_user, setDes_user] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [allCredentialsDataSourceListCombo, setAllCredentialsDataSourceList] = useState<ISelectData[]>([]);
  const [credentialsDataSourceList, setCredentialsDataSourceList] = useState<ISelectData[]>([]);
  const [allCredentialsDataSourceUserTerm, setAllCredentialsDataSourceUserTerm] = useState<string>("")
  const [readOnly , setReadOnly] = useState<boolean>(true);

  const token = localStorage.getItem('@GoJur:token')

  useEffect(() => {
    LoadAllCredentialList()
    },[])

  const LoadAllCredentialList = async () => {
    try {
      const response = await api.get<ICredentialDataSource[]>(
        '/Credenciais/ListarTodasFontes',
        {
          params: {
            token,
          },
        },
      );

      console.log(response.data)

      const listAllCredentialsDataSource: ISelectData[] = []

      response.data.map(item => {
        return listAllCredentialsDataSource.push({
          id: item.id_CourDataSource,
          label: item.description
        })
      })
      
      setAllCredentialsDataSourceList(listAllCredentialsDataSource)

      setIsLoadingComboData(false)
      
    } catch (err: any) {
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data.Message
      })
    }
  }

  const handleAllCredentialsDataSourceSelected = (item) => { 
      
    if (item){
      console.log(item)
      handleListItemDestinationUser(item)
    }
    else {
      setAllCredentialsDataSourceUserTerm("")
      LoadAllCredentialList()
    }
  }

  const handleListItemDestinationUser = (credentialDataSource) => {

    // if is already add on list return false
    const existItem = credentialsDataSourceList.filter(item => item.id == credentialDataSource.id);
    if (existItem.length > 0){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "Tribunal já esta presente na lista."
      })
      return;
    }
  
    setCredentialsDataSourceList(previousValues => [...previousValues, credentialDataSource])
  }

  const handleRemoveItemCredentialDataSource = (credentialDataSource) => {

    const credentialDataSourceListUpdate = credentialsDataSourceList.filter(item => item.id != credentialDataSource.id);
    setCredentialsDataSourceList(credentialDataSourceListUpdate)
  }

  return (
    <>
      {isChanging && (
        <>
          <OverlayPermission />
          <div className='waitingMessage' style={{ zIndex: 999999999 }}>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Alterando Permissões...
          </div>
        </>
      )}
      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content-large"
      >
        <Container>
          <header>
            <h1>Tribunais</h1>
            <h5>Selecione os tribunais aonde será utilizada a credencial.</h5>
          </header>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="txt" style={{ marginBottom: '8px', display: 'block', marginLeft : '16%' }}>
                Usuário
                <input
                  maxLength={50}
                  type="text"
                  name="txt"
                  value={des_user}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDes_user(e.target.value)}
                  readOnly={readOnly}
                  onFocus={() => setReadOnly(false)}
                  required
                  style={{ display: 'block', width: '80%', backgroundColor: 'white', height: '30px' }}
                />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="password" style={{ marginBottom: '8px', display: 'white' }}>
                Senha
                <input
                  maxLength={50}
                  type="password"
                  name="txt"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  readOnly={readOnly}
                  onFocus={() => setReadOnly(false)}
                  required
                  style={{ display: 'block', width: '80%', backgroundColor: 'white',  height: '30px' }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', marginLeft: '7%' }}>
            <AutoCompleteSelect className="selectDestinationUsers" style={{ width: '89%' }}>
              Tribunais
              <Select
                isSearchable
                onChange={handleAllCredentialsDataSourceSelected}
                value={null}
                isClearable
                placeholder=""
                onInputChange={(term) => setAllCredentialsDataSourceUserTerm(term)}
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={allCredentialsDataSourceListCombo}         
              />
            </AutoCompleteSelect>
          </div>

          <Content style={{ marginTop: '15px', marginLeft: '8%' }}>
            <Box>
              <header>                          
                &nbsp;&nbsp;Tribunais Selecionados
              </header>
        
              {credentialsDataSourceList.map((user) => (
                <ItemBox>
                  <FiTrash 
                    onClick={(e) => handleRemoveItemCredentialDataSource(user)} 
                    title='Clique para excluir esta usuário'
                  />
                  {user.label}
                </ItemBox>
              ))}

              {(credentialsDataSourceList.length == 0) && (
                <div className='messageEmpty'> 
                  Nenhum Tribunal selecionado
                </div>
              )}

            </Box>
          </Content>

          <footer>
            <button
              className="buttonLinkClick"
              type="button"
              onClick={() => handleCloseEditModal()}
            >
              <MdBlock />
              Fechar
            </button>
          </footer>
        </Container>
      </Modal>
    </>
  );
}