/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import Modal from 'react-modal';
import Loader from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useParams } from 'react-router-dom';
import api from 'services/api';
import { FiSave, FiTrash } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { RiTeamLine } from 'react-icons/ri'
import { BiUser } from 'react-icons/bi';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { ISelectUserData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container } from './styles';
import { ListMatterUsers } from '../../Services/MatterData';

const MatterUsers = (props) => {

  const { addToast } = useToast();
  const [userList, setUserList] = useState<ISelectUserData[]>([])
  const [userListCombo, setUserListCombo] = useState<ISelectUserData[]>([])
  const [componentStatus, setComponentStatus] = useState<string>('initialize')
  const [userSelect, setUserSelect] = useState<ISelectUserData | null>()
  const { handleCloseUsersModal, matterId } = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { id } = useParams() as { id: string; }

  useEffect(() => {
    
    Initialize();
    
  },[])

  const Initialize = async () => {

    const listUsers = await ListMatterUsers(Number(matterId));

    setUserListCombo(listUsers);

    setUserList(listUsers.filter(item => item.isInProcess));

    setComponentStatus('')
  }

  const handleAddUser = (item: any) => {
    
    const itemExists = userList.find(user => user.id == item.id);
    if (itemExists){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Este responsável já foi adicionado anteriormente',
      });
      
      setUserSelect(item)
      return;
    }

    // eslint-disable-next-line no-param-reassign
    item.isInProcess = true;
    setUserList(previousValues => [...previousValues, item])    
    setUserSelect(null)
  }

  const handleRemoveUser = (id:string) => { 
    
    const newComboData = userListCombo.map(userCombo =>
      userCombo.id === id
        ? {
            ...userCombo,
            isInProcess: false,
          }
        : userCombo,
    );
    
    setUserListCombo(newComboData)

    const newList = userList.filter(user => user.id != id);
    setUserList(newList)

    setUserSelect(null)
  }

  const handleSave = async() => {

    try
    {      
      if (componentStatus === 'saving') return ;
      
      setComponentStatus('saving')

      const response = await api.post('/MatterUsers/SaveUsers', {
        token,
        userValues: JSON.stringify(userList),
        matterId: id
      })

      if (response.data){
        addToast({
          type: 'success',
          title: 'Operação realizada com sucesso',
          description: 'Os usuários selecionados foram adicionados ao processo',
        });

        setComponentStatus('')
        handleCloseUsersModal()
      }      
      
    } 
    catch (err) {
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Houve uma falha na gravação dos usuários selecionados,',
      });
      setComponentStatus('')
      console.log(err)
    }
  }
  
  // Message when is loading or saving data
  const messageWaiting = componentStatus === 'saving'? "Salvando usuários": "Aguarde"
  if (componentStatus.length > 0){

    return (      
      <>
        <Overlay />
        <div className='waitingMessage'>   
          <Loader size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; 
          {' '}
          {messageWaiting}
        </div>
      </>
      )
  }

  return (  

    <Modal
      isOpen    
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
              
      <Container>
        
        <header>Usuários</header>

        <label>
          Usuário:
          <Select
            isSearchable
            value={userSelect}
            options={userListCombo}
            onChange={(item) => handleAddUser(item)}
            placeholder="Selecione um Usuário"
            loadingMessage={loadingMessage}
            noOptionsMessage={noOptionsMessage}
            styles={selectStyles}
          />  
        </label>

        <div>

          {userList.filter(item => item.isInProcess).map((user) => {
            return (
              <p>
                {user.accessType === 'U' && <BiUser title='Usuário' />}
                {user.accessType === 'T' && <RiTeamLine title='Equipe' />}
                &nbsp;&nbsp;
                {user.label}
                <FiTrash onClick={()=>handleRemoveUser(user.id)} />
              </p>
            )
          })}

        </div>

        <footer>

          <button type='button' className='buttonClick' onClick={handleSave}>
            <FiSave />
            Salvar
          </button>

          <button type='button' className='buttonClick' onClick={handleCloseUsersModal}>
            <FaRegTimesCircle />
            Fechar
          </button>

        </footer>


      </Container>

    </Modal>
    
  )

}

export default MatterUsers;