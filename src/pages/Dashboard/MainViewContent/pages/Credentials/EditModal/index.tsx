/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */

import React, { ChangeEvent, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { customStyles, selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import api from 'services/api';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { FiTrash } from 'react-icons/fi';
import Select from 'react-select'
import LoaderWaiting from 'react-spinners/ClipLoader';
import { MdBlock } from 'react-icons/md';
import { useToast } from 'context/toast';
import { Box, Container, Content, OverlayPermission, ItemBox } from './styles';
import { set } from 'date-fns';
import { FaIdCard, FaRegTimesCircle } from 'react-icons/fa';


export interface ISelectData {
  id: string;
  label: string;
}

export interface IDataSource {
  id_Court: string;
  courtName: string;
}

export interface ICredential {
  IdCredential: string;
  des_Username: string;
  UserPassword: string;
  des_Credential: string;
  id_Court: string;
  courtName: string;
}

export default function CredentialsDataSourceModal(props) {
  const { handleCloseEditModal, credentialId, handleIsNewCredential } = props.callbackFunction;
  const { addToast } = useToast();
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [des_user, setDes_user] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [description, setDescription ] = useState<string>('');
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [listCourt, setListCourt] = useState<ISelectData[]>([]);
  const [readOnly , setReadOnly] = useState<boolean>(true);
  const [id_Court, setCourtId] = useState<string>('');
  const [des_Court, setDes_Court] = useState<string>('');
  const [courtTerm, setCourtTerm] = useState<string>('');

  const token = localStorage.getItem('@GoJur:token')

  useEffect(() => {
    LoadAllCredentialList()
    },[])

    useEffect(() => {
      if(credentialId > 0){   

        GetCredential(credentialId)

      }
    },[credentialId])

  const LoadAllCredentialList = async () => {
    try {

      const response = await api.get<IDataSource[]>(
        '/Credenciais/ListarTodasFontes',
        {
          params: {
            token,
          },
        },
      );

      const listCourts: ISelectData[] = []

      response.data.map(item => {
        return listCourts.push({
          id: item.id_Court,
          label: item.courtName,
        })
      })
      
      setListCourt(listCourts)

      setIsLoadingComboData(false)

      
    } catch (err: any) {
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data.Message
      })

    }
  }

  const handleSaveCredentials = async () => {
    
    if (des_user == '' || password == ''){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "Usuário e senha são obrigatórios."
      })
      return;
    }

    if (listCourt.length == 0){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "Selecione ao menos um tribunal."
      })
      return;
    }
    
    try {
      const response = await api.post<ICredential>(
        '/Credenciais/Salvar',
        {
          IdCredential: credentialId,
          UserName: des_user,
          UserPassword: password,
          Description: description,
          id_Court: id_Court,
          token,
        },
      );

      addToast({
        type: "success",
        title: "Operação realizada",
        description: "Credencial criada com sucesso."
      })
      setIsChanging(false)

      handleCloseEditModal()

      handleIsNewCredential(response.data.IdCredential, description)

    } catch (err: any) {
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data.Message
      })

    }
}

const GetCredential = async (id: number) => {
  try {
    const response = await api.get<ICredential>(
      '/Credenciais/Editar',
      {
        params: {
          id_Credential: id,
          token,
        },
      },
    );

    setDes_user(response.data.des_Username)
    setDescription(response.data.des_Credential)
    setCourtId(response.data.id_Court)
    setDes_Court(response.data.courtName)

  } catch (err: any) {
    addToast({
      type: "info",
      title: "Operação não realizada",
      description: err.response.data.Message
    })
  }
}

const handleCourtSelected = (item) => { 
      
  if (item){
    setDes_Court(item.label)
    setCourtId(item.id)
  }else{
    setDes_Court('')
    setCourtId('')
    setCourtTerm("")
  }
}

  return (
    <>
      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content-medium"
        style={{ overlay: { zIndex: 99999 } }}
      >
        <Container>
          <header>
            <h1>Tribunais</h1>
            <h5>Selecione um tribunal onde será utilizada a credencial.</h5>
          </header>
  
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="txt" style={{ marginBottom: '8px', display: 'block', marginLeft : '5%' }}>
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
                  style={{ display: 'block', width: '94%', backgroundColor: 'white', height: '30px' }}
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
                  style={{ display: 'block', width: '94%', backgroundColor: 'white',  height: '30px' }}
                />
              </label>
            </div>
          </div>
  
          <div style={{ marginLeft: '2.5%'}}>
            <label htmlFor="text" style={{ marginBottom: '8px', display: 'white' }}>
              Descrição
              <input
                maxLength={100}
                type="text"
                name="txt"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                required
                style={{ display: 'block', width: '97%', backgroundColor: 'white',  height: '30px' }}
              />
            </label>
          </div>
  
          <div style={{ display: 'flex', marginLeft: '1%' }}>
            <AutoCompleteSelect className="selectDestinationUsers" style={{ width: '96.5%' }}>
              Tribunais
              <Select
                isSearchable   
                value={{ id: id_Court, label: des_Court }}
                onChange={handleCourtSelected}
                onInputChange={(term) => setCourtTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}           
                options={listCourt}
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
              />
            </AutoCompleteSelect>
          </div>
  
          <br />

          <div style={{ flex: '0 0 auto', padding: '5px', width: '100%', textAlign: 'center', marginTop: "2%" }}>
            <div style={{ display: 'inline-block', marginRight: '10px' }}>
              <button
                type='button'
                className="buttonClick"
                onClick={() => handleSaveCredentials()}
                style={{ width: '100px' }}
              >
                <FaIdCard  />
                Salvar
              </button>
            </div>
  
            <div style={{ display: 'inline-block', marginRight: '10px' }}>
              <button 
                className="buttonClick" 
                title="Clique para incluir uma ação judícial"
                type="submit"
                onClick={() => handleCloseEditModal()}
              >
                <FaRegTimesCircle />
                Cancelar
              </button>
            </div>
          </div>
        </Container>
      </Modal>
    </>
  );
}