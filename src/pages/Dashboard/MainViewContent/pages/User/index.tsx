/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Tab, Tabs } from 'Shared/styles/Tabs';
import Modal from 'react-modal';
import api from 'services/api';
import Select from 'react-select';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { FiSave, FiTrash2 } from 'react-icons/fi';
import { FaEdit, FaFileAlt, FaUserCircle, FaUsers } from 'react-icons/fa';
import { useConfirmBox } from 'context/confirmBox';
import { RiCloseLine } from 'react-icons/ri';
import { MdBlock } from 'react-icons/md';
import {useHistory, useLocation  } from 'react-router-dom'
import WorkTeamModal from 'components/Modals/WorkTeam/index';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useModal } from 'context/modal';
import { useForm } from 'react-hook-form';
import TreeView from 'deni-react-treeview'
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { GridContainerSimple, TreeViewContainerSimple } from 'Shared/styles/GlobalStyle';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui'
import Loader from 'react-spinners/PulseLoader';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { Container, Content, ProfileTable, Center, CenterPai, EditUserForm, Flags } from './styles';
import { DefaultsProps, TabsControl, UserData, WorkTeamAutocompleteItem, WorkTeamGroup } from './Interfaces/UserEdit';

export interface ISelectData{
  id: string;
  label: string;
};

export interface IWorkTeamData{
  id: string;
  value: string;
};

Modal.setAppElement('#root');

const UserList: React.FC = () => {
  
  const formRef = useRef<HTMLFormElement>(null);
  const { handleUserPermission } = useDefaultSettings();
  const { addToast } = useToast();
  const { handleSubmit} = useForm<UserData>();
  const history = useHistory();
  const { handleWorkTeamModal,handleReferenceId, showWorkTeamModal} = useModal();
  const { pathname  } = useLocation();
  const [customer , setCustomer] = useState({} as UserData); // objecto todo de do cliente
  const [cod_Empresa , setCod_Empresa] = useState<number>(0);
  const [cod_Senha , setCod_Senha] = useState<string>('');
  const [cod_SistemaUsuarioEmpresa , setCod_SistemaUsuarioEmpresa] = useState<number>(0);
  const [cod_Pessoa , setCod_Pessoa] = useState<number>(0);
  const [des_Email , setDes_Email] = useState('');
  const [flg_Ativo , setFlg_Ativo] = useState<boolean>(true);
  const [modulesIds , setModuleIds] = useState('');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [nom_Pessoa , setNom_Pessoa] = useState<string>();
  const [userTpo_Usuario , setTpo_Usuario] = useState<string>('A');
  const [pushTokenNotification , setPushTokenNotification] = useState('');
  const [DeviceSO , setDeviceSO] = useState('');
  const [userTypeDescription , setUserTypeDescription] = useState('');
  const [logFirstAccess , setLogFirstAccess] = useState('');
  // const [workTeamList, setWorkTeamList] = useState<UserData[]>([]);
  // const [workTeamValue , setWorkteamValue] = useState('');
  const [token] = useState(localStorage.getItem('@GoJur:token'));
  const [workTeamGroup , setWorkTeamGroup] = useState<WorkTeamGroup[]>([]);
  const [countWorkTeamByUser , setCountWorkTeamByUser] = useState(0);  
  const [treeView , setTreeView] = useState([]);
  const treeViewRef = useRef<TreeView>(null);
  const [workTeamListGrid, setWorkTeamListGrid] = useState<WorkTeamAutocompleteItem[]>([]); 
  const [tabsControl, setTabsControl] = useState<TabsControl>({ tab1: true, tab2: false, tab3: false, activeTab: 'user' });
  const [readOnly , setReadOnly] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [openConfimationModal, setOpenConfirmationModal] = useState<boolean>(false)
  const { handleCaller, handleConfirmMessage, handleCancelMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [doubleCheck, setDoubleCheck] = useState<boolean>(false)
  const [confirmUserSave, setConfirmUserSave] = useState<boolean>(false)
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [workTeamList, setWorkTeamList] = useState<ISelectData[]>([]);
  const [workTeamId, setWorkTeamId] = useState('');
  const [workTeamValue, setWorkTeamValue] = useState('');
  const [workTeamTerm, setWorkTeamTerm] = useState('');

  const userSystemTypeList = [
    { id:'A', label: 'Administrador' },
    { id:'S', label: 'Sistema' }
  ];


  useDelay(() => {
    if (workTeamTerm.length > 0)
      LoadWorkTeam()
  }, [workTeamTerm], 500);


  // First initialization
  useEffect(() => { EditUser()}, [])

  
  // Call default parameters by company 
  useEffect(() => { LoadDefaultProps()}, [handleUserPermission]); 


  useEffect(() => {
    if (showWorkTeamModal == false)
    {
      LoadWorkTeam('reset')
    }    
  }, [showWorkTeamModal]); 


  useEffect(() => {
    async function LoadGroups() {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
  
        const response = await api.post<WorkTeamGroup[]>('/Usuario/EquipeTrabalhoListar', {
          token: tokenapi,
        });

        setWorkTeamGroup(response.data)
      } catch (err) {
        console.log(err);
      }
    }
    LoadGroups()
  },[]) // load groups on first render


  useEffect(() => {
    if (isCancelMessage){
      if (caller === 'userConfirmation')
      {
        setOpenConfirmationModal(false)
        handleCaller("")
        handleCancelMessage(false)
        setErrorMessage("")
      }
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if(isConfirmMessage)
    {
      if (caller === 'userConfirmation')
      {
        setConfirmUserSave(true)
        setDoubleCheck(true)
      }
    }
  }, [isConfirmMessage, caller]);


  useEffect(() => {
    if(confirmUserSave)
    {     
      setOpenConfirmationModal(false)
      setConfirmUserSave(false)
      setErrorMessage("")
      handleCaller("")
      handleConfirmMessage(false)
      saveUser();
    }
  }, [confirmUserSave]);


  // Load default parameters by user
  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<DefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const userprops = response.data[4].value.split('|');

      handleUserPermission(userprops);
    } catch (err) {
      console.log(err);
    }
  }


  const EditUser =  async()  => {
        
    const id = pathname.substr(6)

    try {
      const response = await api.post<UserData>('/Usuario/Editar', {
        id:Number(id),
        token,
      })

      setCustomer(response.data)
      setCod_Empresa(response.data.cod_Empresa)
      setCod_Senha(response.data.cod_Senha)
      setCod_SistemaUsuarioEmpresa(response.data.cod_SistemaUsuarioEmpresa)
      setCod_Pessoa(response.data.cod_Pessoa)
      setDes_Email(response.data.des_Email)
      setFlg_Ativo(response.data.flg_Ativo)
      setModuleIds(response.data.modulesIds)
      setNom_Pessoa(response.data.nom_Pessoa)
      setTpo_Usuario(response.data.tpo_Usuario)
      setPushTokenNotification(response.data.cod_TokenPushNotificacaoAPP)
      setDeviceSO(response.data.des_AplicativoAparelhoSO)
      setUserTypeDescription(response.data.userTypeDescription)
      setLogFirstAccess(response.data.des_LogPrimeiroAcesso)
      setWorkTeamListGrid(response.data.workTeamUserValues)
      setCountWorkTeamByUser(response.data.countWorkTeamByUser)

      LoadTreeView(response.data.cod_SistemaUsuarioEmpresa);

    } catch (err) {
      console.log(err);
    }
  }


  const LoadWorkTeam =  async(stateValue?: string)  => {
    if (isLoadingComboData)
      return false;

    let filter = stateValue == "initialize"? workTeamValue : workTeamTerm;
    if (stateValue == 'reset')
      filter = '';

    try {
      const response = await api.post<IWorkTeamData[]>('/Usuario/EquipeTrabalhoListar', {
        id:0,
        name:filter,
        token,
      });

      const listPeople: ISelectData[] = [];

      response.data.map(item => {
        return listPeople.push({
          id: item.id,
          label: item.value
        })
      })

      setWorkTeamList(listPeople)
      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  // handle changes in tabs
  const handleTabs = (tabActive: string) => {
    setTabsControl({
      tab1: tabActive == 'user',      // set tab1 as selected
      tab2: tabActive == 'equipe',    // set tab2 as selected
      tab3: tabActive == 'permission',
      activeTab: tabActive  // set active tab number
    })    

    if(tabActive == 'user'){
      // Editar usuário pelo cod_SistemaUsuarioEmpresa
      EditUser()
      LoadWorkTeam('reset')
    }

    if(tabActive == 'equipe'){
      // Carrega a lista de equipes por empresa
      LoadWorkTeam()
    }
  }


  const saveUser = async() => {
    try {

      let modulesIdsByUser = "";

      if(userTpo_Usuario === "S")
      {
        modulesIdsByUser = GetTreeViewIds();
      }

      if (userTpo_Usuario === "S" && (modulesIdsByUser == "" || modulesIdsByUser == null)){
        addToast({
          type: "info",
          title: "Operação não realizada.",
          description: "Designe acesso a pelo menos 1 módulo ao usuário."
        })

        return
      }

      const token = localStorage.getItem('@GoJur:token');
      const idsList: number[] = [];
      setisSaving(true)

      workTeamListGrid.map((item) => idsList.push(Number(item.workTeamAutocompleteItemId)));
    
      const response = await api.post('/Usuario/SalvarUsuario ', {
        cod_Pessoa,
        cod_Empresa,
        cod_SistemaUsuarioEmpresa,
        nom_Pessoa,
        cod_Senha,
        modulesIds: modulesIdsByUser,
        des_Email,
        cod_TokenPushNotificacaoAPP: pushTokenNotification,
        des_AplicativoAparelhoSO: DeviceSO,
        des_LogPrimeiroAcesso: logFirstAccess,
        flg_Ativo,
        tpo_Usuario: userTpo_Usuario,
        userTypeDescription,
        workTeamIds: idsList,
        doubleCheck,
        token
      })

      setisSaving(false)

      addToast({
        type: "success",
        title: "Usuário Salvo",
        description: "O usuário foi adicionado/atualizado no sistema."
      })

      localStorage.setItem('@GoJur:NU', response.data.toString())
      history.push('/userList')
      setDoubleCheck(false)

    } catch (err:any) {
      setisSaving(false)
      
      if (!err.response.data.typeError.warning){
        addToast({
          type: "error",
          title: "Falha ao salvar usuário",
          description: err.response.data.Message
        })
      }
      
      else if (err.response.data.typeError.warning == "awareness"){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }

      else if (err.response.data.typeError.warning == "confirmation"){
        setErrorMessage(err.response.data.Message)
        setOpenConfirmationModal(true)
      }
    }
  };


  const IncludeNewWorkTeam = async() => {
    try {
  
      handleWorkTeamModal(true)

    } catch (err: any) {
      addToast({
        type: "error",
        title: "Falha ao salvar equipe",
        description:  err.response.data.Message
      })
    }
  };


  const EditWorkTeamName = async(id) => {
    try {
  
      handleReferenceId(id)
      handleWorkTeamModal(true)
  
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Falha ao editar equipe",
        description:  err.response.data.Message
      })
    }
  };


  const DeleteWorkTeam = async(id) => {
    try {
      const token = localStorage.getItem('@GoJur:token');
  
      await api.post('/Usuario/EquipeTrabalhoDeletar ', {

        id,
        name: '',
        token
      })
  
      LoadWorkTeam()

      addToast({
        type: "success",
        title: "Equipe Excluída",
        description: "A equipe foi excluída no sistema."
      })
  
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Falha ao excluir equipe",
        description:  err.response.data.Message
      })
    }
  };


  const handleLoadWorkTeam = async () => {
    // const { value } = e.target; 

      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
  
        const response = await api.post<WorkTeamGroup[]>('/Usuario/EquipeTrabalhoListar', {
          token: tokenapi
        });

        setWorkTeamGroup(response.data)
      } catch (err) {
        console.log(err);
      }
  }


  const IncludeWorkTeamInGrid = async(event) => {
    
    setWorkTeamValue(event)
    // select list get item by desc value
    const itemSelected = workTeamGroup.find(item => item.value ===  event)

    const itemExists = workTeamListGrid.find(item => item.workTeamAutocompleteItemValue ===  event)

    if (itemExists){
      return;
    }

    if (itemSelected){
      const newItem: WorkTeamAutocompleteItem[] = [];

      newItem.push({
        workTeamAutocompleteItemValue: itemSelected.value,
        workTeamAutocompleteItemId: itemSelected.id
      })
      
      const nData = [...newItem, ...workTeamListGrid]
      setWorkTeamListGrid(nData);
      setCountWorkTeamByUser(1);

      setWorkTeamValue("");
    }

  };


  const workTeamUserColumns = [
    { name: 'workTeamAutocompleteItemValue', title: 'Equipe Nome', side: 'left'},
    { name: 'delete', title: 'Excluir', side: 'right' },
  ];


  const [tableColumnExtensions] = useState([
    { columnName: 'workTeamAutocompleteItemValue', width: '80%' },
    { columnName: 'delete', width: '20%' },
  ]);


  const handleClick = (props: any) => {
  
    if (props.column.title === 'Excluir'){
      console.log(props)
      const nData = workTeamListGrid.filter(item => item.workTeamAutocompleteItemId != props.row.workTeamAutocompleteItemId)  
      setWorkTeamListGrid(nData)
    }
  }


  const CustomCell = (props) => {
     
    const { column } = props;
    
    if (column.title === 'Excluir') {
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiTrash2 title="Clique para fazer excluir a equipe" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }
  

  const LoadTreeView = async (codUser: number) => {
    try {
      const response = await api.post('/Usuario/Permissoes', {
        token,
        id: codUser
      });
      
      setTreeView(response.data)
      
    } catch (err) {
      console.log(err);
    }
  }


  const GetTreeViewIds = () => {
    const listPermissions = treeViewRef.current.props.items;

    let permissions = " Permissões selecionados: ";
    let permissionsIds = "";

    listPermissions.map((item) => {
      
      // state = 2 or state = 2 is not selected
      if (item.state == 2 || item.state == 0) return;
      
      // state = 3 is partial selected
      if (item.state != 3){
        permissions += `${item.text} ,`
        permissionsIds += `${item.id},`
      }
      
      // foreach on children of parent
      item.children.map((children1) => {
        
        // state = 2 or state = 2 is not selected
        if (children1.state == 2 || children1.state == 0) return;

        // state = 3 is partial selected
        if (children1.state != 3){
          permissions += `${children1.text  } ,`
          permissionsIds += `${children1.id},`
        }

        // foreach on children of children of parent
        children1.children.map((children2) => {

          // state = 2 or state = 2 is not selected
          if (children1.state == 2 || children1.state == 0) return;

          // the last level considerer only selected cases
          if (children2.state == 1){   
            permissions += `${children2.text  },| `
            permissionsIds += `${children2.id},`
          }             
            // foreach on children of children of parent
            children2.children.map((children3) => {

              // state = 2 or state = 2 is not selected
              if (children3.state == 2 || children3.state == 0) return;

              // the last level considerer only selected cases
              if (children3.state == 1){   
                permissions += `${children3.text  },| `
                permissionsIds += `${children3.id},`
              }              
            })             

        })   
             
      })

    })

    return permissionsIds
  }


  const handleUserSystemType = (item) => {
    if (item)
      setTpo_Usuario(item.id)
    else
      setTpo_Usuario('')
  };


  const handleWorkTeamSelected = (item) => { 
    if (item)
    {
      setWorkTeamId(item.id);
      setWorkTeamValue(item.label);
      IncludeWorkTeamInGrid(item.label)
    }
    else
    {
      setWorkTeamId('');
      setWorkTeamValue('');
      LoadWorkTeam('reset');
    }
  };

 
  return (
    <>   
      <Container>
        {openConfimationModal && (
          <ConfirmBoxModal
            title="Usuário - Salvar"
            caller="userConfirmation"
            useCheckBoxConfirm
            message={errorMessage}
          />
        )}

        <Content>
          <Tabs>
            <div>
              <button 
                className={(tabsControl.activeTab == 'user'? 'buttonTabActive': 'buttonTabInactive')} 
                type='button' 
                onClick={() => handleTabs('user')}
              >
                <FaUserCircle />
                Usuário
              </button>

              {accessCode == "adm" && (
                <button 
                  className={(tabsControl.activeTab == 'equipe'? 'buttonTabActive': 'buttonTabInactive')} 
                  type='button' 
                  onClick={() => handleTabs('equipe')}
                >
                  <FaUsers />
                  Equipe              
                </button>
              )}

              <button 
                type='button' 
                onClick={() => history.push('/userlist')}
              >
                <RiCloseLine />
                Fechar              
              </button> 
            
            </div>
            
            <Tab active={tabsControl.tab1}>
              <CenterPai>
                <Center>
                  <EditUserForm ref={formRef} onSubmit={handleSubmit(saveUser)}>
                    <input type='hidden' value='brokeAround' />
                    <label htmlFor="nome" className="required">
                      Nome *
                      <br />
                      <input 
                        style={{backgroundColor:'#FFFFFF'}}
                        type="text"
                        value={nom_Pessoa}
                        name="nome"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNom_Pessoa(e.target.value)}
                        required
                        autoComplete="off"
                      />
                    </label>
                    <br />

                    <label htmlFor="email">
                      Email (login) *
                      <br />
                      <input 
                        style={{backgroundColor:'#FFFFFF'}}
                        type="search"
                        value={des_Email}
                        name="email"
                        readOnly={readOnly}
                        onFocus={() => setReadOnly(false)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setDes_Email(e.target.value)}
                        required
                        autoComplete="nope"
                      />
                    </label>
                    <br />

                    <label htmlFor="senha">
                      Senha *
                      <br />
                      <input
                        style={{backgroundColor:'#FFFFFF'}}
                        type="password"
                        value={cod_Senha}
                        name="senha"
                        readOnly={readOnly}
                        onFocus={() => setReadOnly(false)}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCod_Senha(e.target.value)}
                        required
                      />
                    </label>
                    <br />

                    {/* <label htmlFor="type">
                      Tipo 
                      <br />
                      <select 
                        name="userType"
                        value={userTpo_Usuario}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTpo_Usuario(e.target.value)}
                      >
                        <option value="A">Administrador</option>
                        <option value="S">Sistema</option>
                      </select>
                    </label>
                    <br /> */}

                    <div id='Tipo' style={{width:'94%', marginLeft:'3%'}}>
                      <AutoCompleteSelect>
                        <p>Tipo</p>
                        <Select
                          isSearchable
                          value={userSystemTypeList.filter(options => options.id == userTpo_Usuario)}
                          onChange={handleUserSystemType}
                          required
                          placeholder=""
                          styles={selectStyles}
                          options={userSystemTypeList}
                        />
                      </AutoCompleteSelect>
                    </div>
                    <br />
                    
                    <div style={{float:'left', marginLeft: '20px'}}>
                      <Flags>
                        Ativo 
                      </Flags>
                    </div>
                    <div style={{float:'left', marginTop:'-8px'}}>
                      <input
                        type="checkbox"
                        name="select"
                        checked={flg_Ativo}
                        onChange={() => setFlg_Ativo(!flg_Ativo)}
                        style={{minWidth:'15px', minHeight:'15px'}}
                      />
                    </div>
                    <br /><br />

                    {/* <label htmlFor="equipe" className="required">
                      Equipe (Selecione uma ou mais equipes para o usuário)
                      <input 
                        type="search"
                        onChange={(e) => IncludeWorkTeamInGrid(e)}
                        autoComplete="off"
                        value={workTeamValue}                
                        list="equipe"
                        name="equipe"
                      />

                      <datalist id="equipe">
                        {workTeamGroup.map(group => (
                          <option value={group.value} key={group.id}>{group.value}</option>
                      ))}
                      </datalist>
                    </label>
                    <br /> */}


                    <div id='SelectWorkTeam' style={{width:'94%', marginLeft:'3%'}}>
                      <AutoCompleteSelect>
                        <p>Equipe (Selecione uma ou mais equipes para o usuário)</p>
                        <Select
                          isSearchable
                          value={{ id: workTeamId, label: workTeamValue }}
                          onChange={handleWorkTeamSelected}
                          onInputChange={(term) => setWorkTeamTerm(term)}
                          isClearable
                          placeholder=""
                          isLoading={isLoadingComboData}
                          loadingMessage={loadingMessage}
                          noOptionsMessage={noOptionsMessage}
                          styles={selectStyles}
                          options={workTeamList}
                        />
                      </AutoCompleteSelect>
                    </div>
                    <br />

                    {countWorkTeamByUser !== 0 && (
                      <div>
                        <GridContainerSimple>
                          <Grid
                            rows={workTeamListGrid}
                            columns={workTeamUserColumns}
                          >
                            <Table
                              columnExtensions={tableColumnExtensions}
                              cellComponent={CustomCell}
                              messages={languageGridEmpty}
                            />
                            <TableHeaderRow />
                          </Grid>
                        </GridContainerSimple>
                        <br />
                      </div>
                    )}

                    { userTpo_Usuario === "S" && (
                      <div id='treeViewDiv' style={{borderColor:'var(--gray)'}}>
                        <label htmlFor="access">
                          Acessos
                        </label>

                        <TreeViewContainerSimple>
                          <TreeView 
                            style={{borderColor:'var(--gray)', heigth: '100%', width: '120%'}}
                            ref={treeViewRef} 
                            items={treeView}
                            showCheckbox 
                          />
                        </TreeViewContainerSimple>

                      </div>
                    )}
                    <br />

                    <div>
                      {accessCode == "adm" && (
                        <div style={{marginLeft:'10px', float:'left'}}>
                          <button className="buttonClick" type="submit">
                            <FiSave />
                            Salvar
                            {isSaving ? <Loader size={5} color="#f19000" /> : null}
                          </button>    
                        </div>
                      )}

                      <div>
                        <button className="buttonClick" type="button" onClick={() => history.push('/userlist')}>
                          <MdBlock />                          
                          Fechar
                        </button>  
                      </div>
                    </div>
                  </EditUserForm>
                </Center>
              </CenterPai>
            </Tab>

            <Tab active={tabsControl.tab2}>

              { showWorkTeamModal && <WorkTeamModal /> }
              
              <div style={{marginRight:'42px', float:'right', marginTop:'10px'}}>
                 
                <button 
                  type='submit'
                  className="buttonLinkClick"
                  onClick={() => IncludeNewWorkTeam()}
                  title="Clique para incluir uma nova equipe"
                >
                  <FaFileAlt />
                  Incluir nova equipe
                </button>

              </div>
                
              <br />
              <br />

              <ProfileTable>
                <table style={{marginLeft:'40px'}}>
                  {workTeamList.map(item =>(
                    <tr>
                      <td style={{width:'30%'}} />
                      <td style={{width:'30%'}}>{item.label}</td>
                      <td style={{width:'10%'}}>
                        <button
                          type="button"
                          title="Excluir"
                          onClick={() => DeleteWorkTeam(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          style={{marginRight:'10px'}}
                          type="button"
                          title="Editar"
                          onClick={() => EditWorkTeamName(item.id)}
                        >
                          <FaEdit />
                        </button>
                      </td>
                      <td style={{width:'30%'}} />
                    </tr>
                  ))}
                </table>
              </ProfileTable>
              <br />
              <br />
                  
            </Tab>

          </Tabs>
        </Content>

        {isSaving && (
          <>
            <Overlay />
            <div className='waitingMessage'>   
              <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
              &nbsp;&nbsp;
              Salvando...
            </div>
          </>
        )}

      </Container>
    </>
  );
}

export default UserList;
