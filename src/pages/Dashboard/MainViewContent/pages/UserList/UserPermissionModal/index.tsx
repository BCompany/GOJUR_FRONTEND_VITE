/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */

import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal';
import api from 'services/api';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { FaIdCard } from 'react-icons/fa';
import Select from 'react-select'
import {MdBlock} from 'react-icons/md';
import {FiTrash } from 'react-icons/fi';
import { useToast } from 'context/toast';
import {Box, Container, Content, ItemBox, OverlayPermission } from './styles'

export interface ISelectData {
    id: string;
    label: string;
}

export interface IUsers {
    cod_SistemaUsuarioEmpresa: string;
    nom_Pessoa: string;
  }

export default function UserPermissionModal (props) {
  const {setShowUserPermissionModal, CloseUserPermissionModal} = props.callbackFunction
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token')
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [originUserId, setOriginUserId] = useState<string>("")
  const [originUserValue, setOriginUserValue] = useState<string>("")
  const [originUserTerm, setOriginUserTerm] = useState<string>("")
  const [originUserList, setOriginUserList] = useState<ISelectData[]>([]);
  const [destinationUserListCombo, setDestinationUserListCombo] = useState<ISelectData[]>([]);
  const [destinationUserList, setDestinationUserList] = useState<ISelectData[]>([]);
  const [destinationUserTerm, setDestinationUserTerm] = useState<string>("")
  const [isChanging, setIsChanging] = useState<boolean>(false)

  useEffect(() => {
    LoadOriginUsers('reset')
    LoadDestinationUsers('reset')
    setOriginUserList([])
    },[])


    useDelay(() => {
      if (originUserTerm.length > 0){
        LoadOriginUsers()
      }
    }, [originUserTerm], 1000)


    useDelay(() => {
      if (destinationUserTerm.length > 0){
        LoadDestinationUsers()
      }
    }, [destinationUserTerm], 1000)


    // REPORT FIELDS - GET API DATA
    const LoadOriginUsers = async (stateValue?: string) => {

        if (isLoadingComboData){
          return false;
        }
    
        // when is a first initialization get value from edit if not load from state as term typing
        let filter = stateValue == "initialize"? originUserValue:originUserTerm
        if (stateValue == 'reset'){
          filter = ''
        }
    
        try {
          const response = await api.post<IUsers[]>('Usuario/ListarUsuariosPorFiltro', {
            filterClause: filter,
            page: 1,
            rows: 50,
            token,
          });
    
          const listUsers: ISelectData[] = []
    
          response.data.map(item => {
            return listUsers.push({
              id: item.cod_SistemaUsuarioEmpresa,
              label: item.nom_Pessoa
            })
          })
          
          setOriginUserList(listUsers)
    
          setIsLoadingComboData(false)
          
        } catch (err: any) {
          addToast({
            type: "info",
            title: "Operação não realizada",
            description: err.response.data.Message
          })
        }
      }

      // REPORT FIELDS - GET API DATA
    const LoadDestinationUsers = async (stateValue?: string) => {
      if (isLoadingComboData){
        return false;
      }
  
      // when is a first initialization get value from edit if not load from state as term typing
      let filter = destinationUserTerm
      if (stateValue == 'reset'){
        filter = ''
      }
  
      try {
        const response = await api.post<IUsers[]>('Usuario/ListarUsuariosPorFiltro', {
          filterClause: filter,
          page: 1,
          rows: 50,
          token,
        });
  
        const listUsers: ISelectData[] = []
  
        response.data.map(item => {
          return listUsers.push({
            id: item.cod_SistemaUsuarioEmpresa,
            label: item.nom_Pessoa
          })
        })
        
        setDestinationUserListCombo(listUsers)
  
        setIsLoadingComboData(false)
        
      } catch (err: any) {
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: err.response.data.Message
        })
      }
    }

    const CopyPermissionFromOriginUser = useCallback(async() => {

      if (destinationUserList.length == 0){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Adicione pelo menos 1 usuário destino para prosseguir."
        })

        return
      }

      if (originUserId == ""){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Adicione pelo menos 1 usuário origem para prosseguir."
        })

        return
      }

      const destinationUserIds = destinationUserList.map(item => item.id);

      try {
        setIsChanging(true)
        
        await api.post('/Usuario/PermissoesUsuarioOrigem', {
    
          originUserId,
          destinationUserIds,
          token
        })
        
        addToast({
          type: "success",
          title: "Permissões dos Usuários Alteradas.",
          description: "As permissões dos usuários foram alteradas no sistema."
        })

        setIsChanging(false)
        CloseUserPermissionModal()

      } catch (err: any) {
        setIsChanging(false)
        if (err.response.data.typeError.warning == "awareness"){
          addToast({
            type: "info",
            title: "Aviso.",
            description: err.response.data.Message
          })
        }
        else{
          addToast({
            type: "error",
            title: "Falha ao alterar permissões dos usuários.",
            description: err.response.data.Message
          })
        }    
      }
    },[originUserId, destinationUserList]);

      const handleOriginUserSelected = (item) => { 
      
        if (item){
          
          const existItem = destinationUserList.filter(user => user.id == item.id);
          if (existItem.length > 0){
            addToast({
              type: "info",
              title: "Operação não realizada",
              description: "Usuário já esta presente na lista de destino."
            })
            return;
          }
          setOriginUserId(item.id)
          setOriginUserValue(item.label)
          
        }else{
          setOriginUserValue('')
          LoadOriginUsers('reset')
          setOriginUserId('')
          setOriginUserTerm("")
        }
      }

      const handleDestinationUserSelected = (item) => { 
      
        if (item){
          handleListItemDestinationUser(item)
        }
        else {
          setDestinationUserTerm("")
          LoadDestinationUsers('reset')
        }
      }

      const handleListItemDestinationUser = (destinationUser) => {

        // if is already add on list return false
        const existItem = destinationUserList.filter(item => item.id == destinationUser.id);
        if (existItem.length > 0){
          addToast({
            type: "info",
            title: "Operação não realizada",
            description: "Usuário já esta presente na lista de destino."
          })
          return;
        }

        if(destinationUser.id == originUserId){
          addToast({
            type: "info",
            title: "Operação não realizada",
            description: "Usuário já está selecionado como usuário origem."
          })
          return;
        }
      
        setDestinationUserList(previousValues => [...previousValues, destinationUser])
      }

      const handleRemoveItemDestinationUser = (destinationUser) => {

        const customerListUpdate = destinationUserList.filter(item => item.id != destinationUser.id);
        setDestinationUserList(customerListUpdate)
      }
  

  return (

    <>
      {isChanging && (
        <>
          <OverlayPermission />
          <div className='waitingMessage' style={{zIndex:999999999}}>
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
            <h1>Alteração das Permissões dos Usuários</h1>
            <h5>Selecione um usuário origem e adicione usuários destino na lista para utilizarem as mesmas permissões do usuário origem.</h5>
          </header>

          <div style={{display:"flex"}}>
            <div style={{width:"49%"}}>
              <AutoCompleteSelect className="selectOriginUser">
                <p>Usuário Origem</p>  
                <Select
                  isSearchable   
                  value={{ id: originUserId, label: originUserValue }}
                  onChange={handleOriginUserSelected}
                  onInputChange={(term) => setOriginUserTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={originUserList}
                />
              </AutoCompleteSelect>
            </div>

            <div style={{width:"49%"}}>
              <AutoCompleteSelect className="selectDestinationUsers">
                <p>Usuário Destino</p>  
                <Select
                  isSearchable
                  value={null}
                  onChange={handleDestinationUserSelected}
                  onInputChange={(term) => setDestinationUserTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={destinationUserListCombo}
                />
              </AutoCompleteSelect>
            </div>
          </div>
          
          
          <Content>
 
            <Box>
              <header>                          
                &nbsp;&nbsp;Usuários Destino
              </header>
        
              {destinationUserList.map((user) => (
                <ItemBox>
                  <FiTrash 
                    onClick={(e) => handleRemoveItemDestinationUser(user)} 
                    title='Clique para excluir esta usuário'
                  />
                  {user.label}
                </ItemBox>
              ))}

              {(destinationUserList.length == 0) && (
                <div className='messageEmpty'> 
                  Nenhum usuário destino selecionado
                </div>
              )}

            </Box>

          </Content>

          <footer>
         
            <button 
              className="buttonLinkClick" 
              type="button"
              onClick={() => CopyPermissionFromOriginUser()}
              title="Clique para alterar as permissões dos usuários destino"
            >
              <FaIdCard />
              Copiar            
            </button>   

            <button 
              className="buttonLinkClick" 
              type="button"  
              onClick={(e) => CloseUserPermissionModal()}    
            >
              <MdBlock />
              Fechar            
            </button>  
          
          </footer>
        </Container>

      </Modal>


    </>
  )
}