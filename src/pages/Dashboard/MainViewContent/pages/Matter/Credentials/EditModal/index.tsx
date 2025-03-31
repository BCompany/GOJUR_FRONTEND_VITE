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
import { FaSave, FaIdCard, FaRegTimesCircle } from 'react-icons/fa';


export interface ISelectData {
  id: string;
  label: string;
  flg_QrCode: string;
}

export interface IDataSource {
  id_Court: string;
  courtName: string;
  flg_QrCode: string;
}

export interface ICredential {
  IdCredential: string;
  des_Username: string;
  UserPassword: string;
  des_Credential: string;
  id_Court: string;
  qrCode: string;
  courtName: string;
  nom_CertificateFile: string;
  certificatePassword: string;
}

export default function CredentialsDataSourceModal(props) {
  const token = localStorage.getItem('@GoJur:token')
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
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [flgQrCode, setFlgQrCode] = useState(false);
  const [certificateFileName, setCertificateFileName] = useState<string>('');
  const [passwordCredential, setPasswordCredential] = useState<string>('');
  const [isSP, setIsSP] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    LoadAllCredentialList()
  }, [])


  useEffect(() => {
    if(id_Court == "1")
      setIsSP(true)
    else
      setIsSP(false)
  }, [id_Court])


  useEffect(() => {
    if(credentialId > 0){
      GetCredential(credentialId)
    }
  }, [credentialId])


  useEffect(() => {
    if (!flgQrCode) {
      setQrCode('');
    }
  }, [flgQrCode]);


  const LoadAllCredentialList = async () => {
    try {
      const response = await api.get<IDataSource[]>('/Credenciais/ListarTodasFontes', { params: {token} })

      const listCourts: ISelectData[] = []

      response.data.map(item => {
        return listCourts.push({
          id: item.id_Court,
          label: item.courtName,
          flg_QrCode: item.flg_QrCode,
        });
      });
     
      setListCourt(listCourts)
      setIsLoadingComboData(false)
    }
    catch (err: any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const handleSaveCredentials = async () => {
    
    if(isSP == false){
      if (des_user == '' || password == ''){
        addToast({type: "info", title: "Operação não realizada", description: "Usuário e senha são obrigatórios."})
        return;
      }
    }
    else{
      if (passwordCredential == ''){
        addToast({type: "info", title: "Operação não realizada", description: "Senha da credencial é obrigatória."})
        return;
      }
    }

    if (description == ''){
      addToast({type: "info", title: "Operação não realizada", description: "A Descrição é obrigatória."})
      return;
    }

    if (id_Court == ''){
      addToast({type: "info", title: "Operação não realizada", description: "Selecione um tribunal."})
      return;
    }
    
    try {

      const payload = {
        IdCredential: credentialId,
        UserName: des_user,
        UserPassword: password,
        Description: description,
        id_Court: id_Court,
        qrCode : qrCode,
        token: token,
        certificatePassword: passwordCredential
      }

      const credential = new FormData()
        
      credential.append('file', file)
      credential.append('payload', JSON.stringify(payload))  

      const response = await api.post('/Credenciais/Salvar', credential)

      // const response = await api.post<ICredential>('/Credenciais/Salvar',
      //   {
      //     IdCredential: credentialId,
      //     UserName: des_user,
      //     UserPassword: password,
      //     Description: description,
      //     id_Court: id_Court,
      //     qrCode : qrCode,
      //     token,
      //   },
      // );

      addToast({type: "success", title: "Operação realizada", description: "Credencial criada com sucesso."})
      setIsChanging(false)
      handleCloseEditModal()
      handleIsNewCredential(response.data.IdCredential, description)
    }
    catch (err: any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const GetCredential = async (id: number) => {
    try {
      const response = await api.get<ICredential>('/Credenciais/Editar', { params: {id_Credential: id, token} });

      console.log(response.data)

      setDes_user(response.data.des_Username);
      setDescription(response.data.des_Credential);
      setCourtId(response.data.id_Court);
      setDes_Court(response.data.courtName);
      setPasswordCredential(response.data.certificatePassword)
      setCertificateFileName(response.data.nom_CertificateFile)

      if (response.data.qrCode) {
        setTwoFactorAuth(true);
        setFlgQrCode(true);
        setQrCode(response.data.qrCode);
      }
      else {
        setTwoFactorAuth(false);
        setQrCode('');
        setFlgQrCode(true);
      }
    }
    catch (err: any) {
      addToast({type: "info", title: "Operação não realizada", description: err.response.data.Message});
    }
  };


  const handleCourtSelected = (item) => { 
    if (item){
      setDes_Court(item.label)
      setCourtId(item.id)
      setFlgQrCode(item.flg_QrCode === 'S');

      if(item.id == "1")
        setIsSP(true)
      else
        setIsSP(false)
    }
    else{
      setDes_Court('')
      setCourtId('')
      setCourtTerm("")
      setFlgQrCode(false)
    }
  }


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setCertificateFileName(event.target.files[0].name)
  };


  return (
    <>
      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content-medium"
        style={{overlay:{zIndex: 99999}}}
      >
        <Container id='Container'>
          <header>
            <h1>Tribunais</h1>
            <h5>Selecione um tribunal onde será utilizada a credencial.</h5>
          </header>

          <div id='Tribunais' style={{ display: 'flex', marginLeft: '1%' }}>
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

          {flgQrCode && (
            <div style={{ marginLeft: '2.5%', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
                <span style={{ marginLeft: '8px' }}>Autenticação de Dois Fatores</span>
                <a href="https://gojur.tawk.help/article/configurar-credenciais-eproc" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px' }}>
                  Guia para o código QRCode
                </a>
              </label>
            </div>
          )}

          {flgQrCode && twoFactorAuth && (
            <div style={{ marginLeft: '2.5%', marginTop: '10px' }}>
              <label htmlFor="qrcode" style={{ marginBottom: '8px', display: 'block' }}>
                Código QRCode
                <input
                  maxLength={100}
                  type="text"
                  name="qrcode"
                  value={qrCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQrCode(e.target.value)}
                  required
                  style={{ display: 'block', width: '97%', backgroundColor: 'white', height: '30px' }}
                />
              </label>
            </div>
          )}

          <br />

          <div id='Descricao' style={{ marginLeft: '2.5%' }}>
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
                style={{ display: 'block', width: '97%', backgroundColor: 'white', height: '30px' }}
              />
            </label>
          </div>

          <br />

          {isSP == true ? (
            <>
              {/* <div id='1' style={{float:'left'}}>
                <div id='2'>
                  <input type="file" onChange={handleFileChange} />
                </div>
              </div> */}

              <div className="file-upload">
                <label className="custom-file-upload">
                <input type="file" onChange={handleFileChange} />
                  <FaIdCard />
                  &nbsp;&nbsp; Escolher Arquivo
                </label>
                <br /><br />
                <div>{certificateFileName}</div>
              </div>

              <div id='SenhaCredencial' style={{float:'right', marginRight:'250px', marginTop:'-55px'}}>
                <label htmlFor="password" style={{ marginBottom: '8px', display: 'white' }}>
                  Senha Certificado
                  <input
                    maxLength={50}
                    type="password"
                    name="txt"
                    value={passwordCredential}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordCredential(e.target.value)}
                    readOnly={readOnly}
                    onFocus={() => setReadOnly(false)}
                    required
                    style={{display:'block', width:'94%', backgroundColor:'white', height:'30px' }}
                  />
                </label>
              </div>

              <br /><br />
            </>
          ) : (
            <div id='UsuarioSenha' style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <div id='Usuario' style={{ flex: 1 }}>
                <label htmlFor="txt" style={{ marginBottom: '8px', display: 'block', marginLeft: '5%' }}>
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

              <div id='Senha' style={{ flex: 1 }}>
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
                    style={{ display: 'block', width: '94%', backgroundColor: 'white', height: '30px' }}
                  />
                </label>
              </div>
            </div>  
          )}

          <br />

          <div id='Buttons' style={{ flex: '0 0 auto', padding: '5px', width: '100%', textAlign: 'center', marginTop: "2%" }}>
            <div style={{ display: 'inline-block', marginRight: '10px' }}>
              <button
                type='button'
                className="buttonClick"
                onClick={handleSaveCredentials}
                style={{ width: '100px' }}
              >
                <FaSave />
                Salvar
              </button>
            </div>

            <div style={{ display: 'inline-block', marginRight: '10px' }}>
              <button
                className="buttonClick"
                title="Clique para incluir uma ação judícial"
                type="submit"
                onClick={handleCloseEditModal}
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