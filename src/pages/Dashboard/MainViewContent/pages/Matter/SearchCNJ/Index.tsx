/* eslint object-shorthand: "error" */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal';
import { FcAbout, FcKey } from 'react-icons/fc';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import InputMask from 'components/InputMask';
import api from 'services/api';
import Select from 'react-select';
import { useConfirmBox } from 'context/confirmBox';
import  {BiSave} from 'react-icons/bi';
import { useToast } from 'context/toast';
import { Container } from './styles'
import { ISearchCNJ } from '../Interfaces/IMatter';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles } from 'Shared/utils/commonFunctions';
import CredentialModal from '../../Credentials';
import CredentialsDataSourceModal from '../../Credentials/EditModal';

export interface ISelectData {
  id: string;
  label: string;
}

export interface ICredentials {
  id_Credential: string;
  des_Credential: string;
}

export default function SearchCNJ () {

  const { addToast } = useToast();
  const { handleCancelMessage, handleCaller } = useConfirmBox(); 
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isSecret, setIsSecret] = useState<boolean>(false)
  const [numberCNJ, setNumberCNJ] = useState<string>('')
  const [userCNJ, setUserCNJ] = useState<string>('')
  const [pswCNJ, setPswCNJ] = useState<string>('')
  const [listSearch, setlistSearch] = useState<ISearchCNJ[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [credentialsList, setCredentialsList] = useState<ISelectData[]>([]);
  const [credentialTerm, setCredentialTerm] = useState('');
  const [credentialId, setCredentialId] = useState<string>('');
  const [credentialValue, setCredentialValue] = useState<string>('');
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false)
  const tokenApi = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    if (!isSecret){
      setUserCNJ('')
      setPswCNJ('')
      setCredentialId('')
    }

  },[isSecret])

  useEffect(() => {
    LoadCredentials();
  },[])

  const Validate = () => {

    if (numberCNJ.length == 0){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Nenhum número de CNJ foi informado',
      });

      return false;
    }

    if (numberCNJ.replaceAll(',', '').replaceAll('.', '').length < 20){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'O número de CNJ á inválido ',
      });

      return false;
  }

    if (isSecret && credentialId.length == 0){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'É necessario informar uma credencial para realizar a busca em segredo de justiça',
      });

      return false;
    }

    const hasAdd = listSearch.find(item => item.matterNumberCNJ === numberCNJ);
    if (hasAdd){

      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Este número de CNJ já foi incluído anteriormente na lista de pesquisa',
      });

      return false;
    }

    return true;
  }

  const handleAddNumber = () => {
  
    if (!Validate()){
      return false;
    }

    const newData: ISearchCNJ[] = [];
    newData.push({
      index: listSearch.length+1,
      matterNumberCNJ: numberCNJ,
      id_Credential: credentialId,
      isSecret
    })

    setlistSearch([...listSearch, ...newData])
    setNumberCNJ('')
  }

  const handleDelete = (index: number) => {

    const newData = listSearch.filter(item => item.index != index)
    setlistSearch(newData)
  }

  const handleCloseModal = async () => {
    
    handleCaller('matterAddAutomatic')
    handleCancelMessage(true)
  }


  const handleSave = useCallback(async() => {
    
    if (isSaving){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'A requisição anterior ainda esta em andamento'
      });

      return ;
    }

    setIsSaving(true)
 
    if (listSearch.length == 0){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Nenhum número de CNJ foi informada para efetuar a busca',
      });
      
      setIsSaving(false)

      return false;
    }
     
    try
    {
      await api.post('/Processo/SalvarBuscaPorCNJ', {
        token: tokenApi,
        matterList: listSearch
      })

      handleCloseModal();
    }
    catch(err:any){
      setIsSaving(false)
      
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: err.response.data.Message,
      });
    }

  },[userCNJ, pswCNJ, numberCNJ, listSearch ])

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
          token: tokenApi,
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

  const handleIsNewCredential = (id, description) => {
    LoadCredentials();
    setCredentialId(id);
    setCredentialValue(description);
  }

  return (
    <>

   {showNewCredentials && <CredentialsDataSourceModal callbackFunction={{ handleCloseEditModal, handleIsNewCredential }} />}

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"      
      className="react-modal-content-medium"
    >
      <Container>
          
        <header>
          <h1>Cadastro automático de processos por CNJ</h1>
          <h5>Informe abaixo o(s) numero(s) do(s) processo(s) para efetuar a busca automática. Nº Unificado do Processo - CNJ</h5>
        </header>

        <div>

          <InputMask
            mask="cnj"
            autoComplete='off'
            value={numberCNJ}
            onChange={(e) => setNumberCNJ(e.target.value)}
            placeholder='Nº Unificado do Processo - CNJ' 
          />

          <div className='secret'>
            <input type='checkbox' autoComplete='off' checked={isSecret} onClick={() => setIsSecret(!isSecret)} />
            &nbsp;&nbsp;
            <span>&nbsp;Segredo de Justiça</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <FcAbout title='Informe um numero de CNJ válido (máximo 25 digitos) para efetuar a busca automática' />
          </div>

          {isSecret && (
            <>
              <br />

              <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', marginLeft: "5%" }}>
                <AutoCompleteSelect className="selectCredentials" style={{ width: '65%' }}>
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
                  onClick={openNewCredentialModal}
                >
                  <FcKey />
                  <span>Criar Credencial</span>
                </button>
              </div>
            </>
          )}

        </div>

        <button 
          className="buttonLinkClick buttonAddNew" 
          onClick={handleAddNumber}
          title="Clique para adicionar uma nova pesquisa por OAB"
          type="submit"
        >
          <FiPlus />
          Adicionar
            
        </button>

        <div className='listItem'>
          {listSearch.map(item => {
            return (
              <p key={item.index}>
                <FiTrash title='Clique para excluir este CNJ' onClick={() => handleDelete(item.index)} />
                {item.matterNumberCNJ}
                {(item.id_Credential) && (
                  <>
                    &nbsp;
                    <FcKey title='Este processo será procurado por nossos robôs na forma de segredo de justiça, com base no usuário e senha informados' />
                    <span className='password'>Segredo de Justiça</span>
                  </>
                )}

              </p>
            )
          })}

        </div>

        <footer>

          <button 
            className="buttonClick" 
            type="button"
            onClick={handleSave}
            title="Clique para salvar o parâmetro"
          >
            <BiSave />
            {!isSaving && <span> Salvar Busca</span> }
            {isSaving && <span>Salvando...</span> }
           
          </button>   

          <button 
            className="buttonClick" 
            type="button"
            onClick={handleCloseModal}
            title="Clique para retornar a listagem de processos"
          >
            <MdBlock />
            <span>Fechar</span>
          </button>  

        </footer>

      </Container>
      
    </Modal>
    </>

  )
}