/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, useRef } from 'react';
import { FiEdit, FiTrash } from 'react-icons/fi'
import { FaFileAlt, FaUserCircle } from 'react-icons/fa'
import Loader from 'react-spinners/PulseLoader';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useDevice } from "react-use-device";
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory, useLocation } from 'react-router-dom';
import { useToast } from 'context/toast';
import { HeaderPage } from 'components/HeaderPage';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Container, Content , ListUser, UserCard } from './styles';

export interface IPeoplesData{
  cod_Pessoa:number;
  nom_Pessoa: string;
  des_EMail: string;
  num_Telefone01: string;
  tpo_Telefone01: string;
  num_Telefone02: string;
  tpo_Telefone02: string;
  des_GrupoTerceiro: string;
  cod_Advogado: number;
  cod_Terceiro: number;
  cod_Funcionario: number;
  cod_Contrario: number;
  type: string;
  typeDescription: string;
  peopleTypeAccess: string;
  count: number;
}

export interface IDefaultsProps {
    id: string;
    value: string;
  }

const PeopleList = () => {
  // STATES
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();
  const {captureText, handleLoadingData, handleCaptureType, captureType} = useHeader();
  const { handleUserPermission } = useDefaultSettings();
  const token = localStorage.getItem('@GoJur:token');
  const accessCode = localStorage.getItem('@GoJur:accessCode');
  const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [peopleList, setPeopleList] = useState<IPeoplesData[]>([]);
  const [peopleTypeAccess, setPeopleTypeAccess] = useState("")
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { isMOBILE } = useDevice();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isInitialize, setIsInitialize] = useState(false);
  
  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])

  useEffect(() => {
    setPeopleList([])
    setIsEndPage(false)
    setIsInitialize(true)
    LoadPeoples(true)
  },[captureText, captureType])

  // When is pagination increments page number 
  useEffect(() => {
    if (isLoadingData && isPagination){
      setPage(page + 1)
    }
  }, [isPagination])

  // when page number is than 1 load people as pagination
  useEffect(() => {

    if (page > 1 && !isInitialize){
      LoadPeoples();
    }
  }, [page])

  const LoadPeoples =  async(initialize = false)  => {

    let peopleAccess = ""

    if (accessCode == "adm")
    {
      peopleAccess = "OTLE"
    }
    else
    {
      if (accessCode?.toString().includes("CFGLAW"))
      {
        peopleAccess += "L"
      }
      if (accessCode?.toString().includes("CFGOPP"))
      {
        peopleAccess += "O"
      }
      if (accessCode?.toString().includes("CFGEMP"))
      {
        peopleAccess += "E"
      }
      if (accessCode?.toString().includes("CFGTHIRD"))
      {
        peopleAccess += "T"
      }

      if (peopleAccess == ""){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Sem permissões suficientes para acessar lista de pessoas`
        })
      history.push('/dashboard')
      }
    }
    
    try {     
      
      if (isLoadingData && captureText.length > 0){
        return;
      }

      // api request list people as Gpjweb does
      const response = await api.get<IPeoplesData[]>('/Pessoas/Listar', {
        params:{
          page: initialize? 1:page,
          rows: 20,
          filterClause: captureText,
          type: captureType,
          peopleTypeAccess: peopleAccess,
          token
        }
      });

      // when is initialize page force pagination = 1
      setPage(initialize? 1: page)

      // total page by main request
      if (!isPagination){
        setTotalPage(response.data.length > 0? response.data[0].count: 0)
      }

      // create new collection with no custom values defined
      const listPeople = response.data.map(item  =>  {
        return {
          ...item,
          hasCustomValues: false,
        }
      })

      if (!isPagination)
      {
        // verify if exists people just saved or include
        const peopleId = localStorage.getItem('@GoJur:NP');

        if (peopleId)
        {
          // remove people saved from list and append in front of all itens
          const peopleSaved = await GetPeopleById(peopleId)
          if (peopleSaved.length > 0){
            const peopleListRefresh = listPeople.filter(cust => cust.cod_Pessoa !== peopleSaved[0].cod_Pessoa);
            setPeopleList([...peopleSaved, ...peopleListRefresh])
          }
        }
        else{
          setPeopleList(listPeople);    // append first initialization list normally
        }
      }
      else
      {   
        // set people list paginate append on current list

        const nData = [...peopleList, ...response.data]
        setPeopleList(nData)

        // if is a pagination and there is no item finish 
        if (listPeople.length == 0){
          setIsEndPage(true)
          setIsLoadingData(false)
          setIsPagination(false)
        }
      }

      // reset constrols page
      handleLoadingData(false)
      setIsLoadingData(false)
      setIsPagination(false)      
      setIsInitialize(false)
      // handleIsMenuOpen(false) 

      // remove localstorage filtre and new people
      localStorage.removeItem('@GoJur:PeopleFilter')    
      localStorage.removeItem('@GoJur:NP')        
      
    } catch (err:any) {
      // remove localstorage filtre and new people
      localStorage.removeItem('@GoJur:PeopleFilter')
      localStorage.removeItem('@GoJur:NP')

      setIsLoadingData(false)
      setIsPagination(false)      
      setIsInitialize(false)
      handleLoadingData(false)
    }
  }


  const GetPeopleById = async (peopleId: string) => {
  
    const response = await api.get<IPeoplesData[]>('/Pessoas/ObterPorCodigoPessoa', {
      params:{
      id: peopleId,
      token,
      }
    });

    return response.data;
  }


  const LoadDefaultProps = async() => {

    try {

      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token });

      const permissionAccessCode = response.data.find(item => item.id === 'accessCode')
      if (permissionAccessCode)
        localStorage.setItem('@GoJur:accessCode', permissionAccessCode.value)
      
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      handleUserPermission(userPermissions[0].value.split('|'));

    
    // if (permissionAccessCode?.value == "adm")
    // {
    //   setPeopleTypeAccess("OTLE")
    // }
    // else
    // {
    //   if (permissionAccessCode?.id?.toString().includes("CFGLAW"))
    //   {
    //     setPeopleTypeAccess("L") + peopleTypeAccess
    //   }
    //   if (permissionAccessCode?.id?.toString().includes("CFGOPP"))
    //   {
    //     setPeopleTypeAccess("O") + peopleTypeAccess
    //   }
    //   if (permissionAccessCode?.id?.toString().includes("CFGEMP"))
    //   {
    //     setPeopleTypeAccess("E") + peopleTypeAccess
    //   }
    //   if (permissionAccessCode?.id?.toString().includes("CFGTHIRD"))
    //   {
    //     setPeopleTypeAccess("T") + peopleTypeAccess
    //   }
    // }

    } catch (err) {
      console.log(err);
    }
  }


  // PAGE SCROOL
  const handleScrool = (e: UIEvent<HTMLDivElement>) => {
    
    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || peopleList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight

    if (isEndScrool && !isLoadingData) {
      setIsLoadingData(true);
      setIsPagination(true)        
    }
  }

  const handleEditPeople = (people) => { 
    handleCaptureType("0")
    if (people.cod_Advogado > 0){
      history.push(
        `/People/Edit/${people.type}/${people.cod_Advogado}`)
    }

    else if (people.cod_Terceiro > 0){
      history.push(
        `/People/Edit/${people.type}/${people.cod_Terceiro}`)
    }

    else if (people.cod_Funcionario > 0){
      history.push(
        `/People/Edit/${people.type}/${people.cod_Funcionario}`)
    }

    else if (people.cod_Contrario > 0){
      history.push(
        `/People/Edit/${people.type}/${people.cod_Contrario}`)
    }
  }

  const handleDeletePeople = async(people) => { 
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      await api.delete('/Pessoas/Deletar', {
        params:{
        lawyerId: people.cod_Advogado,
        employeeId: people.cod_Funcionario,
        opposingId: people.cod_Contrario,
        thirdPartyId: people.cod_Terceiro,
        type: people.type,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Pessoa excluída",
        description: "A pessoa foi excluída no sistema."
      })

      LoadPeoples();

    } catch (err: any) {

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir pessoa.",
        description:  err.response.data.Message
      })
    }
  };

  // HTML CODE
  return (
    <>
      {!isMOBILE &&(

      <Container>
        
        <HeaderPage />

        <div style={{float:'right', width: '100%'}}>
          <div style={{float:'right', marginRight: '70px', display:"flex"}}>
            
            <button 
              className="buttonLinkClick" 
              onClick={() => {handleCaptureType("0") ; history.push('/People/Edit/0/0')}}
              title="Clique para incluir uma nova pessoa"
              type="submit"
            >
              <FaFileAlt />
              Incluir nova pessoa
            </button>
          </div>
         
        </div>

        <p style={{fontSize:"14px", marginLeft:"2%"}}>
          Total pessoas: &nbsp;
          <>{totalPage}</>
        </p>

        <Content onScroll={handleScrool} ref={scrollRef} id='peopleListList'>
          
          <ListUser onClick={() => setIsOpenMenu(false)}>

            {peopleList.map(people => (
              <UserCard key={people.cod_Pessoa}>
                <header>
                  <button
                    type="button"
                    title="Editar"
                    onClick={() =>
                      handleEditPeople(people)
                    }
                  >
                    <FiEdit />
                  </button>

                  <button
                    type="button"
                    title="Excluir"
                    onClick={() =>
                      handleDeletePeople(people)
                    }
                  >
                    <FiTrash />
                  </button>
                </header>
                
                <div>   
                                  
                  <section>

                    <article>
                      <>
                        <b>
                          {people.nom_Pessoa} 
                          {' '}
                        </b> 

                        <br />

                                             
                      </>                       
                    </article>

                    <article>
                      <p style={{ display: 'flex'}}>
                        <b>Telefone:</b>
                        {people.num_Telefone01}
                        <br />
                        {people.num_Telefone02}
                      </p>

                      <article>
                        <b id="type" style={{marginTop: '10%', marginLeft: '2%'}}> 
                          {people.typeDescription}
                        </b>
                      </article>     
                    </article>

                  </section>

                  <section>

                    <article>
                      <br />
                      {String(people.des_EMail).length >= 60 && (
                        <p style={{marginTop: '-5%'}} title={people.des_EMail} id="mail">
                          {String(people.des_EMail).substring(0,60)}
                          ...
                        </p>
                      )}
                      {String(people.des_EMail).length < 50 && (
                        <p style={{marginTop: '-5%'}} id="mail">{people.des_EMail}</p>
                      )}
                    </article>
                   
                  </section>

                </div>

              </UserCard>
            ))}

          </ListUser>

          {/* show message whem there is no people find */}
          { (peopleList.length == 0 && !isLoadingData && captureText.length > 0 && !isInitialize) && (
            <div className='messageEmpty'>
              <FaUserCircle />
              {' '}
              Nenhuma pessoa foi encontrado com o termo:
              {' '}
              <br />
              <b>{captureText}</b>
            </div>
          )}

          {/* show message when is loading more people by pagination */}
          { (isPagination) && (
            <div className='paginationPage'>
              {/* Aguarde - carregando mais clientes */}
              <Loader size="0.5rem" color="var(--blue-twitter)" />            
            </div>   
          )}
        </Content>

      </Container>
    )}

      {isMOBILE &&(

      <Container>
        
        <HeaderPage />

        <div style={{display:"flex"}}>
          <p style={{width:"50%", marginTop:"auto", marginBottom:"auto",marginLeft:"3%"}}>
            Total pessoas: &nbsp;
            <>{totalPage}</>
          </p>
          
        
          <button 
            className="buttonLinkClick" 
            onClick={() => {handleCaptureType("0") ; history.push('/People/Edit/0/0')}}
            title="Clique para incluir uma nova pessoa"
            type="submit"
          >
            <FaFileAlt />
            Incluir nova pessoa
          </button>

        </div>

        <Content onScroll={handleScrool} ref={scrollRef} id='peopleListList'>
          
          <ListUser onClick={() => setIsOpenMenu(false)}>

            {peopleList.map(people => (
              <UserCard key={people.cod_Pessoa}>
                <header>
                  <button
                    type="button"
                    title="Editar"
                    onClick={() =>
                      handleEditPeople(people)
                    }
                  >
                    <FiEdit />
                  </button>

                  <button
                    type="button"
                    title="Excluir"
                    onClick={() =>
                      handleDeletePeople(people)
                    }
                  >
                    <FiTrash />
                  </button>
                </header>
                
                <div>   
                                  
                  <section>

                    <article>
                      <>
                        <b>
                          {people.nom_Pessoa} 
                          {' '}
                        </b> 

                        <br />

                                             
                      </>                       
                    </article>

                    <article>
                      <p style={{ display: 'flex'}}>
                        <b>Telefone:</b>
                        {people.num_Telefone01}
                        <br />
                        {people.num_Telefone02}
                      </p>

                      <article>
                        <b id="type" style={{marginTop: '10%', marginLeft: '2%'}}> 
                          {people.typeDescription}
                        </b>
                      </article>     
                    </article>

                  </section>

                  <section>

                    <article>
                      <br />
                      <p style={{marginTop: '-5%'}} id="mail">{people.des_EMail}</p>
                    </article>
                   
                  </section>

                </div>

              </UserCard>
            ))}

          </ListUser>

          {/* show message whem there is no people find */}
          { (peopleList.length == 0 && !isLoadingData && captureText.length > 0 && !isInitialize) && (
            <div className='messageEmpty'>
              <FaUserCircle />
              {' '}
              Nenhuma pessoa foi encontrado com o termo:
              {' '}
              <br />
              <b>{captureText}</b>
            </div>
          )}

          {/* show message when is loading more people by pagination */}
          { (isPagination) && (
            <div className='paginationPage'>
              {/* Aguarde - carregando mais clientes */}
              <Loader size="0.5rem" color="var(--blue-twitter)" />            
            </div>   
          )}
        </Content>

      </Container>
    )}

      {(isLoadingData && !isPagination) && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </>
  )

}
export default PeopleList;