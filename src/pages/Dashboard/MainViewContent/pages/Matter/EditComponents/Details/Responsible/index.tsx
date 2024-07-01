/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import Modal from 'react-modal';
import { useToast } from 'context/toast';
import { FiTrash } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { ISelectData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { Container } from './styles';
import { ListResponsible } from '../../Services/MatterData';

const MatterResponsible = (props) => {

  const { addToast } = useToast();
  const [componentStatus, setComponentStatus] = useState<string>('initialize')
  const [userList, setUserList] = useState<ISelectData[]>([])
  const [userListCombo, setUserListCombo] = useState<ISelectData[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [userSelect, setUserSelect] = useState<ISelectData | null>()
  const { handleCloseResponsibleModal, handleResponsibleListSave, responsibleList } = props.callbackFunction

  useEffect(() => {

    Initialize()

  },[])

  const Initialize = async () => {

    setUserListCombo(await ListResponsible(''))

    const usersList: ISelectData[] = []
    responsibleList.map((user) => {
      usersList.push({
        id: user.id,
        label: user.value,
      })

      return;
    })

    setUserList(usersList)
    setComponentStatus('')
  }

  const handleAddUser = async(item: any) => {

    if (item == null){
      setUserListCombo(await ListResponsible(''))
      return;
    }

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

    setUserList(previousValues => [...previousValues, item])

    setUserSelect(null)
  }

  const handleRemoveUser = (id:string) => {
    const newList = userList.filter(user => user.id != id);
    setUserList(newList)

    setUserSelect(null)
  }

  const handleSave = () => {

    if (componentStatus === 'saving') return ;
    setComponentStatus('saving')

    if (userList.length === 0){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'O processo deve ter ao menos um responsável.',
      });

      setComponentStatus('')
      return;
    }
    handleResponsibleListSave(userList)
    handleCloseResponsibleModal()
    // responsibles is saved when save all matter
    // here only associate list values to callback responsible after 1.5 seconds
    // setTimeout(() => {

    //   handleResponsibleListSave(userList)
    //   handleCloseResponsibleModal()

    // }, 1500);

  }

  useDelay(() => {

    if (searchTerm.length > 0){
      handleLoadUserCombo(searchTerm)
    }

  }, [searchTerm], 1000)

  const handleLoadUserCombo = async (term) => {
    setUserListCombo(await ListResponsible(term))
  }

  // Message when is loading or saving data
  // const messageWaiting = componentStatus === 'saving'? "Associando responsáveis": "Aguarde"
  // if (componentStatus.length > 0){

  //   return (
  //     <>
  //       <Overlay />
  //       <div className='waitingMessage'>
  //         <Loader size={15} color="var(--blue-twitter)" />
  //           &nbsp;&nbsp;
  //         {' '}
  //         {messageWaiting}
  //       </div>
  //     </>
  //     )
  // }

  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >

      <Container>

        <header>Responsáveis</header>

        <label>
          Responsável:
          <Select
            isSearchable
            options={userListCombo}
            value={userSelect}
            isClearable
            onInputChange={(term) => setSearchTerm(term)}
            onChange={(item) => handleAddUser(item)}
            placeholder="Selecione o Responsável"
            loadingMessage={loadingMessage}
            noOptionsMessage={noOptionsMessage}
            styles={selectStyles}
          />
        </label>

        <div>

          {userList.map((user) => {
            return (
              <p>
                {user.label}
                <FiTrash onClick={()=>handleRemoveUser(user.id)} />
              </p>
            )
          })}

        </div>

        <footer>

          <button type='button' className='buttonClick' onClick={handleSave}>
            <FaRegTimesCircle />
            Fechar
          </button>

        </footer>


      </Container>

    </Modal>

  )

}

export default MatterResponsible;
