/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import Select from 'react-select'
import { useModal } from 'context/modal'
import { selectStyles} from 'Shared/utils/commonFunctions';
import { useDevice } from "react-use-device";
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { ModalAccount,ItemList,ItemListMobile, Flags, ModalAccountMobile } from './styles';

export interface IAccountData {
  accountId: string;
  accountDescription: string;
  flgDefaultAccount: boolean;
  acessType: string;
  userListDTO;
  count: string;
}

export interface IUsers {
  id: string;
  value: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export interface IComboData {
  value: string;
  label: string;
}

const AccountEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [accountDescription, setAccountDescription] = useState<string>("");
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [acessType, setAcessType] = useState<string>("U");
  const [flgDefaultAccount , setFlgDefaultAccount] = useState(false);
  const [users, setUsers] = useState<ISelectData[]>([]);
  const [usersId, setUsersId] = useState('');
  const [usersValue, setUsersValue] = useState('');
  const [usersTerm, setUsersTerm] = useState(''); 
  const [userList, setUserList] = useState<ISelectData[]>([]);

  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectAccount(modalActiveId)
    }

  },[modalActiveId, caller])

  useEffect(() => {
    LoadUsers('reset')
    setUserList([])
    },[])

  const SelectAccount = useCallback(async(id: number) => {

    const response = await api.post<IAccountData>('/ContasBancarias/Editar', {
      id,
      flgDefaultAccount,
      acessType,
      userList,
      token
    })

    console.log(response.data)

    setAccountDescription(response.data.accountDescription)
    setFlgDefaultAccount(response.data.flgDefaultAccount)
    setAcessType(response.data.acessType)

    if (response.data.userListDTO != null)
      {
        const newData: ISelectData[] = []
        response.data.userListDTO.map(item => {
          return newData.push({
            id: item.id,
            label: item.value
          })
        })
        
        setUserList(newData)
      }
    
    // Open modal after load data
    handleModalActive(true)

  },[accountDescription,flgDefaultAccount,acessType,userList]);

  // REPORT FIELDS - GET API DATA
  const LoadUsers = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? usersValue:usersTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<IUsers[]>('/Usuario/ListarUsuarios', {
        userName: filter,
        removeCurrentUser: false,
        token,
      });

      const listUsers: ISelectData[] = []

      response.data.map(item => {
        return listUsers.push({
          id: item.id,
          label: item.value
        })
      })
      
      setUsers(listUsers)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }


  const saveAccount = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (accountDescription === "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo Descrição deve ser preenchido`
        })
  
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      
      await api.post('/ContasBancarias/Salvar', {
        accountId: modalActiveId,
        accountDescription,
        flgDefaultAccount,
        acessType,
        userListDTO: userList,
        token,
      })
      
      addToast({
        type: "success",
        title: "Conta salva",
        description: "A conta foi adicionada no sistema."
      })
      setisSaving(false)

      handleAccountModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar conta.",
      })
    }
  },[isSaving,accountDescription,flgDefaultAccount,acessType,userList]);

  const handleAccountModalClose = () => { 
    setAccountDescription("")
    setAcessType("U")
    setUserList([])
    setFlgDefaultAccount(false)
    setUsersId("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleAccountModalCloseAfterSave = () => { 
    setAccountDescription("")
    setAcessType("U")
    setUserList([])
    setFlgDefaultAccount(false)
    setUsersId("")
    handleCaller("accountModal")
    handleModalActive(false)
  }

  // REPORT FIELDS - CHANGE
  const handleUsersSelected = (item) => { 
      
    if (item){
      setUsersValue(item.label)
      setUsersId(item.id)
      handleListItemUsers(item)
    }else{
      setUsersValue('')
      LoadUsers('reset')
      setUsersId('')
    }
  }

  const handleListItemUsers = (subject) => {

    // if is already add on list return false
    const existItem = userList.filter(item => item.id === subject.id);
    if (existItem.length > 0){
      return;
    }

    userList.push(subject)
    setUserList(userList)
  }

  const handleRemoveItemUsers = (subject) => {

    const subjectListUpdate = userList.filter(item => item.id != subject.id);
    setUserList(subjectListUpdate)
  }

    
  return (
    <>
      {!isMOBILE &&(
        <ModalAccount show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Conta

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input
                required
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={accountDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <div style={{float:'left', marginLeft: '0px', width: '91px'}}>
              <Flags style={{width: "91px"}}>
                Conta Padrão
              </Flags>
            </div>
            
            <div style={{float:'left', margin:'2px 36px', width: '20px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgDefaultAccount}
                onChange={() => setFlgDefaultAccount(!flgDefaultAccount)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
            <br />
            <br />
            <br />
            <label htmlFor="type">
              Privacidade
              <br />
              <select
                style={{width: '40%'}} 
                name="Type"
                value={acessType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setAcessType(e.target.value)}
              >
                <option value="U">Público</option>
                <option value="R">Privado</option>
              </select>
            </label>
            <br />
            <br />
            {acessType === "R" &&(
            <div style={{float:'left', width:'100%'}}>
          
              <AutoCompleteSelect className="selectSubject">
                <p>Usuários</p>  
                <Select
                  isSearchable   
                  value={users.filter(options => options.id == usersId)}
                  onChange={handleUsersSelected}
                  onInputChange={(term) => setUsersTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={users}
                />
              </AutoCompleteSelect>
                
              <ItemList>

                {userList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemUsers(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>
            </div>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px', marginBottom:'15px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveAccount()}
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
                  onClick={() => handleAccountModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalAccount>
      )}

      {isMOBILE &&(
        <ModalAccountMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Conta

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input
                required
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={accountDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <div style={{float:'left', marginLeft: '0px', width: '91px'}}>
              <Flags style={{width: "91px"}}>
                Conta Padrão
              </Flags>
            </div>
            
            <div style={{float:'left', margin:'2px 36px', width: '20px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgDefaultAccount}
                onChange={() => setFlgDefaultAccount(!flgDefaultAccount)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
            <br />
            <label htmlFor="type"> 
              <div style={{fontSize:'08px'}}>Privacidade</div>
              <select
                style={{width: '40%' }} 
                name="Type"
                value={acessType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setAcessType(e.target.value)}
              >
                <option value="U">Público</option>
                <option value="R">Privado</option>
              </select>
            </label>
            <br />
            <br />
            {acessType === "R" &&(
            <div style={{float:'left', width:'100%'}}>
          
              <AutoCompleteSelect className="selectSubject">
                <p>Usuários</p>  
                <Select
                  isSearchable   
                  value={users.filter(options => options.id == usersId)}
                  onChange={handleUsersSelected}
                  onInputChange={(term) => setUsersTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={users}
                />
              </AutoCompleteSelect>
                
              <ItemListMobile>

                {userList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemUsers(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemListMobile>
            </div>
            )}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveAccount()}
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
                  onClick={() => handleAccountModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalAccountMobile>
      )}

      {isSaving && (
      <>
        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp;
          Salvando ...
        </div>
      </>
  )}  
    </>
  )

}
export default AccountEdit;
