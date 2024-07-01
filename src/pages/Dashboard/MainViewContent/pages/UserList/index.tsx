/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, {useState,useEffect,UIEvent,useRef,} from 'react';
  import { useHistory } from 'react-router-dom';
  import { HeaderPage } from 'components/HeaderPage';
  import { useCustomer } from 'context/customer';
  import Modal from 'react-modal';
  import api from 'services/api';
  import Loader from 'react-spinners/PulseLoader';
  import { useToast } from 'context/toast';
  import { Overlay } from 'Shared/styles/GlobalStyle';
  import { AiFillIdcard } from 'react-icons/ai';
  import { FaEdit, FaFileAlt } from 'react-icons/fa';
  import { useDefaultSettings } from 'context/defaultSettings';
  import UserPermissionModal from './UserPermissionModal';
  import { Container, Content, ListUser, UserCard } from './styles';
  import { CustomerData, DefaultsProps } from '../User/Interfaces/UserList';
  
  Modal.setAppElement('#root');
  
  const UserList: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const history = useHistory();
    const { addToast } = useToast();
    const { handleUserPermission } = useDefaultSettings();
    const { handleLoadSearchCustomerList, customerSearchList } = useCustomer();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isEndPage, setIsEndPage] = useState(false);
    const [isPagination, setIsPagination] = useState(false);
    const [page, setPage] = useState(1);
    const [customerList, setCustomerList] = useState<CustomerData[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [token] = useState(localStorage.getItem('@GoJur:token'));
    const accessCode = localStorage.getItem('@GoJur:accessCode')

    const [showUserPermissionModal, setShowUserPermissionModal] = useState<boolean>(false);
  
    //* *****************   LOAD FUNCTIONS API REQUEST  *******************/
    // Load user list
    const LoadCustomer =  async()  => {

      if (accessCode != "adm")
        return
      
      try {
        const response = await api.post<CustomerData[]>('/Usuario/ListarUsuariosPorEmpresa', {
          page,
          rows: 50,
          token,
          companyId: localStorage.getItem('@GoJur:companyId'),
          apiKey: localStorage.getItem('@GoJur:apiKey')
        });
  
        const newData = response.data.map(item  =>  {
          return {
            ...item
          }
        })
  
        // first page 1
        if (!isPagination)
        {
          const userId = localStorage.getItem('@GoJur:NU');
          if (userId)
          {
            const userSaved = await GetUserUpdated(userId)
            if (userSaved){
              const customerListRefresh = newData.filter(cust => cust.cod_SistemaUsuarioEmpresa !== userSaved.cod_SistemaUsuarioEmpresa);
              const customerUpdatedList :CustomerData[] = [];
              customerUpdatedList.push(userSaved);

              // append user saved first of all
              setCustomerList([...customerUpdatedList, ...customerListRefresh])
            }
          }else{
            setCustomerList(newData);
          }
        }
        else{
          
          // pagination page++
          if (newData.length == 0){
            setIsEndPage(true)
            setIsLoadingData(false)
            setIsPagination(false)
          }
  
          const nData = [...customerList, ...response.data]
          setCustomerList(nData)
        }
  
        setIsLoadingData(false)
        setIsPagination(false)

        localStorage.removeItem('@GoJur:CustomerFilter')  
        localStorage.removeItem('@GoJur:NU')               
  
      } catch (err: any) {
        addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
      }
    }

    const GetUserUpdated = async (id: string) => {
  
      const response = await api.post<CustomerData>('/Usuario/Editar', {
        id:Number(id),
        token,
      })
  
      return response.data;
    }
    
  
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
  
    // ******************  EFFECTS  *******************/
    // First initialization
    useEffect(() => {
      handleLoadSearchCustomerList([])
      LoadCustomer()
    },[])
      
    // When is pagination increments page number 
    useEffect(() => {
      if (isLoadingData && isPagination){
        setPage(page + 1)
      }
    }, [isPagination])
  
    // when page number is than 1 load user as pagination
    useEffect(() => {
      if (page > 1){
        LoadCustomer();
      }
    }, [page])
    
    // Call default parameters by company 
    useEffect(() => {
      
      LoadDefaultProps();
      
    }, [handleUserPermission]); 
  
    // Pagination handler
    const handleLoadMoreCustomer = (e: UIEvent<HTMLDivElement>) => {
      const element = e.target as HTMLTextAreaElement;
  
      if (isEndPage || customerList.length == 0) return;
  
      const isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight
     
      // calculate if achieve end of scrool page
      if (isEndScrool && !isLoadingData) {
        setIsLoadingData(true);
        setIsPagination(true)        
      }
    }

    const CloseUserPermissionModal = async () => {
      setShowUserPermissionModal(false)
    }
  
    return (
      <>   
        <Container>
  
          <HeaderPage />

          {(showUserPermissionModal) && <Overlay /> }
          {(showUserPermissionModal) && <UserPermissionModal callbackFunction={{ setShowUserPermissionModal, CloseUserPermissionModal }} /> }

          <div style={{display: "flex", justifyContent: "flex-end", marginRight:"2%"}}>
            {accessCode == "adm" && (
              <div style={{marginRight:"15px"}}>
                <button
                  className="buttonLinkClick"
                  onClick={() => history.push('/user/0')}
                  title="Clique para incluir um novo usuário"
                  type="submit"
                >
                  <FaFileAlt />
                  Incluir novo usuário
                </button>
                <br />
              </div>
            )}

            {accessCode == "adm" && (
              <div>
                <button
                  className="buttonLinkClick"
                  onClick={() => setShowUserPermissionModal(true)}
                  title="Clique para alterar as permissões"
                  type="submit"
                >
                  <AiFillIdcard />
                  Copiar Permissões
                </button>
                <br />
              </div>
             )}
          </div>
           
    
  
          <Content onScroll={handleLoadMoreCustomer} ref={scrollRef}>
            
            <ListUser onClick={() => setIsOpenMenu(false)}>

              {customerList.map(customer => (
                <UserCard key={customer.cod_Cliente}>
                  <header>
                    {accessCode == "adm" && (
                      <button
                        type="button"
                        title="Editar"
                        onClick={() =>
                            history.push(
                              `/user/${customer.cod_SistemaUsuarioEmpresa}`,
                            )
                          }
                      >
                        <FaEdit />
                      </button>
                    )}
                  </header>
                  
                  {customer.flg_Ativo === true && (
                    <div>
                      <section>
                        <article>
                          <b>{customer.nom_Pessoa}</b>
                        </article>
                      </section>
                      <section>
                        <article>
                          <p style={{ display: 'flex' }}>
                            <b>Tipo Usuário:</b>
                            {customer.tpo_Usuario === 'S' ? 'SISTEMA' : 'ADMINISTRADOR'}
                          </p>
                        </article>
                      </section>
                      <section>
                        <article>
                          <p id="mail">{customer.des_Email}</p>
                        </article>
                      </section>
                      <section>
                        <article>
                          <p style={{ display: 'flex' }}>
                            <b>Status:</b>
                            {customer.flg_Ativo === true ? 'ATIVO' : 'INATIVO'}
                          </p>
                        </article>
                      </section>
                    </div>
                  )}

                  {customer.flg_Ativo === false && (
                    <div style={{ opacity: '0.3' }}>
                      <section>
                        <article>
                          <b>{customer.nom_Pessoa}</b>
                        </article>
                      </section>
                      <section>
                        <article>
                          <p style={{ display: 'flex' }}>
                            <b>Tipo Usuário:</b>
                            {customer.tpo_Usuario === 'S' ? 'SISTEMA' : 'ADMINISTRADOR'}
                          </p>
                        </article>
                      </section>
                      <section>
                        <article>
                          <p id="mail">{customer.des_Email}</p>
                        </article>
                      </section>
                      <section>
                        <article>
                          <p style={{ display: 'flex' }}>
                            <b>Status:</b>
                            INATIVO
                          </p>
                        </article>
                      </section>
                    </div>
                  )}
                  
                </UserCard>
              ))}

            </ListUser>
  
            { (customerList.length == 0) && (
              <p style={{marginTop:'20%', textAlign:'center'}}>
                <Loader size={12} color="var(--blue-twitter)" />            
              </p>   
            )}
  
            { (isPagination) && (
              <p style={{fontSize:'0.675rem', marginLeft:'33vw', color: '#f19000'}}>
                Aguarde - carregando mais usuários
                <Loader size={6} color="#f19000" />                      
              </p>   
            )}
          </Content>
  
        </Container>
      </>
    );
  }
  
  export default UserList;
  