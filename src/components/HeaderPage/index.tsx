/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdHelp } from 'react-icons/md';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/PulseLoader';
import api from 'services/api';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useHeader } from 'context/headerContext';
import { FcAbout } from 'react-icons/fc';
import { FaShoppingCart } from 'react-icons/fa';
import Select from 'react-select'
import { selectStyles } from 'Shared/utils/commonFunctions';
import { IComboData } from 'pages/Dashboard/MainViewContent/pages/Financeiro/Account/Modal';
import { useDevice } from "react-use-device";
import TopNavBar from './TopNavBar';
import Search from './Search';
import ListSearch from './ListSearch';
import { Container, User, Avatar, ContainerMobile } from './styles';

interface SearchData {
  id: string;
  result: string;
  type: string;
  complement: string;
}

export interface filterProps {
  value: string;
  label: string;
}

export function HeaderPage() {
  const { addToast } = useToast();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { name, companyId, signOut } = useAuth();
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [defaultImage, setDefaultImage] = useState<boolean>(false);
  const [imagePathDefault, setImagePathDefault] = useState<string>('');
  const [imagePath, setImagePath] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [toolTipSearch, setToolTipSearch] = useState<string>('');
  const [timerAutoComplete, setTimerAutoComplete] = useState<any>(null); // useState for keep timer delay	//HOOK QUE ARMAZENA O SETTIMEOUT
  const [hideSearchInput, setHideSearchInput] = useState<boolean>(false); // useState for keep timer delay	//HOOK QUE ARMAZENA O SETTIMEOUT
  const [loading, setLoading] = useState(false);
  const {listOpen,  imageT, captureText, LoadingData,captureType, handleCaptureText, handleDispathCallback, handleLoadingData, handleShowListSearch, handleCaptureType } = useHeader();
  const { isMOBILE } = useDevice();
  const [options, setOptions] = useState<IComboData[]>([]);
  const optionsList: IComboData[] = [];
  const companyPlan = localStorage.getItem('@GoJur:companyPlan')
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const [financeOptions, setFinanceOptions] = useState<IComboData[]>([]);
  const financeOptionsList: IComboData[] = [];
  const [defaultMonthValue, setDefaultMonthValue] = useState<string>('1');
  const [defaultMonthLabel, setDefaultMonthLabel] = useState<string>('Mês selecionado');
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (pathname === '/People/List'){
      const accessCode = localStorage.getItem('@GoJur:accessCode')

      if (accessCode == "adm")
      {
        optionsList.push({ value: '0', label: 'Todos' })
        optionsList.push({ value: 'L', label: 'Advogado' })
        optionsList.push({ value: 'O', label: 'Contrário' })
        optionsList.push({ value: 'E', label: 'Funcionário' })
        optionsList.push({ value: 'T', label: 'Terceiro' })
      }
      else
      {
        optionsList.push({ value: '0', label: 'Todos' })

        if (accessCode?.toString().includes("CFGLAW"))
          optionsList.push({ value: 'L', label: 'Advogado' })
        if (accessCode?.toString().includes("CFGOPP"))
          optionsList.push({ value: 'O', label: 'Contrário' })
        if (accessCode?.toString().includes("CFGEMP"))
          optionsList.push({ value: 'E', label: 'Funcionário' })
        if (accessCode?.toString().includes("CFGTHIRD"))
          optionsList.push({ value: 'T', label: 'Terceiro' })
      }

      setOptions(optionsList)
    }

    if (pathname === '/financeiro'){
      financeOptionsList.push({ value: '1', label: 'Mês selecionado' })
      financeOptionsList.push({ value: '12', label: 'Últimos 12 meses' })
      financeOptionsList.push({ value: '2', label: 'Acordos' })

      handleCaptureType('1')
      setFinanceOptions(financeOptionsList)
    }


  if (pathname === '/workflowexec/list'){
      optionsList.push({ value: 'todos', label: 'Todos' })
      optionsList.push({ value: 'emandamento', label: 'Em andamento' })
      optionsList.push({ value: 'concluido', label: 'Concluído' })

      const defaultOpt = optionsList.find(o => o.value === 'emandamento');
      setSelectedOption(defaultOpt);

      setOptions(optionsList)
    }


  }, [])


  const handleSelectFinancial = (item) => {
    handleCaptureType(item)

    if(item == '1')
    {
      setDefaultMonthValue('1')
      setDefaultMonthLabel('Mês selecionado')
    }
    else if(item == '2')
    {
      setDefaultMonthValue('2')
      setDefaultMonthLabel('Acordos')
    }
    else{
      setDefaultMonthValue('12')
      setDefaultMonthLabel('Últimos 12 meses')
    }
  }


  // reset values on first initialization
  useEffect(() => {
    if(captureType == '1')
    {
      setDefaultMonthValue('1')
      setDefaultMonthLabel('Mês selecionado')
    }
    else if(captureType == '2')
    {
      setDefaultMonthValue('2')
      setDefaultMonthLabel('Acordos')
    }
    else{
      setDefaultMonthValue('12')
      setDefaultMonthLabel('Últimos 12 meses')
    }
  }, [captureType])
  
  
  // reset values on first initialization
  useEffect(() => {
    handleCaptureText('')
    handleLoadingData(false)
  }, [])


  useEffect(() => {
    handleLoadingData(true)

    if (captureText.length === 0){
      setSearchTerm('')
    }
    else{
      setSearchTerm(captureText)
    }
  }, [captureText])


  useEffect(() => {
    const imageStorage = localStorage.getItem("@GoJur:Avatar")

    if(imageStorage != ''){
      const path = `${imageStorage}`
      setImagePath(path)
    }

    // default avatar
    // We've decided to use this default avatar when USERPHOTO2 doen't exists
    // For now we put here on the FrontEnd to handle on OnError from image handle inside a try catch
    const defaultImagePath = `https://ui-avatars.com/api/?background=2C8ED6&color=ccc&name=${localStorage.getItem('@GoJur:name')}`
    setImagePathDefault(defaultImagePath);
  }, [imagePath, signOut])


  useEffect(() => {
    // dashboard tooltip and placeholder
    
    if(pathname === '/dashboard'){
      setPlaceholder('Pesquise processos, agenda, clientes e documentos')
      setToolTipSearch("Pesquisa os resultados mais relevantes em Processos, Cliente, Agenda e Documentos anexos nos processos e clientes.")

    // publication tooltip and placeholder
    }else if (pathname === '/publication'){
      setPlaceholder('Pesquise publicações')
      setToolTipSearch("Pesquisa por advogado e texto da publicação")

    // customer/list tooltip and placeholder
    }else if (pathname === '/customer/list'){
      setPlaceholder('Pesquise clientes')
      setToolTipSearch("Pesquisa por nome, email, grupo ou documento (CPF e/ou CNPJ)")

      // customer/list tooltip and placeholder
    }else if (pathname === '/CRM/salesFunnel'){
      setPlaceholder('Pesquisar no funil de vendas')
      setToolTipSearch("Pesquisar oportunidades de negócio no funil de vendas")

    // userlist tooltip and placeholder
    }else if (pathname === '/userlist'){
      setPlaceholder('Pesquise usuários')
      setHideSearchInput(true)

    }else if (pathname === '/matter/list'){
      setPlaceholder('Pesquisar Processos')
      setToolTipSearch("Pesquisa em pasta, Nº do processo/Cnj, título, ação judicial, nome, CPF/CNPJ de clientes e contrário e também nos marcadores. Para pesquisa em campos específicos usar as palavras chaves: (#pst pasta / #pro processo /#tit titulo /#mrc marcadores) Ex. #pst 2572 (pesquisa pasta número 2572)")

    }else if (pathname === '/calendar'){
      setPlaceholder('Pesquise compromissos')
      setHideSearchInput(true)

    }else if (pathname === '/Subject'){
      setPlaceholder('Pesquise assuntos')

    }else if (pathname === '/LegalNature'){
      setPlaceholder('Procurar Natureza Jurídica')

    }else if (pathname === '/Rite'){
      setPlaceholder('Procurar Rito')

    }else if (pathname === '/MatterPhase'){
      setPlaceholder('Procurar Fase Processual')

    }else if (pathname === '/MatterStatus'){
      setPlaceholder('Procurar Status do Processo')

    }else if (pathname === '/MatterProbability'){
      setPlaceholder('Procurar Probabilidade do Processo')

    }else if (pathname === '/MatterSolution'){
      setPlaceholder('Procurar Solução do Processo')

    }else if (pathname === '/CourtDept'){
      setPlaceholder('Procurar Vara')

    }else if (pathname === '/CustomerGroup'){
      setPlaceholder('Procurar Grupo de Cliente')

    }else if (pathname === '/MatterEventType'){
      setPlaceholder('Procurar Tipo de Acompanhamento')

    }else if (pathname === '/MatterDemandType'){
      setPlaceholder('Procurar Tipo de Pedidos do Processo')

    }else if (pathname === '/LegalCause'){
      setPlaceholder('Procurar Ação Judícial')

    }else if (pathname === '/AdvisoryType'){
      setPlaceholder('Procurar Assunto')

    }else if (pathname === '/Court'){
      setPlaceholder('Procurar Fórum')

    }else if (pathname === '/ThirdPartyGroup'){
      setPlaceholder('Procurar Grupo de Terceiro')

    }else if (pathname === '/workflowexec/list'){
      setPlaceholder('Procurar Workflow')

    }else if (pathname === '/Position'){
      setPlaceholder('Procurar Posição no Processo')

    }else if (pathname === '/PaymentForm'){
      setPlaceholder('Procurar Forma de Pagamento')

    }else if (pathname === '/Category'){
      setPlaceholder('Procurar Categoria')

    }else if (pathname === '/FinancialStatus'){
      setPlaceholder('Procurar os Status Financeiros')

    }else if (pathname === '/documentModel/list'){
      setPlaceholder('Procurar Documentos')

    }else if (pathname === '/Account'){
      setPlaceholder('Procurar Conta')

    }else if (pathname === '/ServiceType'){
      setPlaceholder('Procurar Tipo de Serviço')

    }else if (pathname === '/Cities'){
      setPlaceholder('Procurar Cidade')

    }else if (pathname === '/PaymentSlipContract/List'){
      setPlaceholder('Procurar Carteira de Cobrança')

    }else if (pathname === '/People/List'){
      setPlaceholder('Procurar Pessoas')

    }else if (pathname === '/EconomicIndexes/List'){
      setPlaceholder('Procurar Indexador')

    }else if (pathname === '/EconomicIndexes/edit/:id'){
      setPlaceholder('Procurar Indexador')

    }else if (pathname === '/financeiro'){
      setPlaceholder('Procurar Movimentos')

    }else if (pathname === '/Holiday'){
      setPlaceholder('Procurar Feriado')

    }else if (pathname === '/DocumentType'){
      setPlaceholder('Procurar Tipo de Documento')

    }else if (pathname === '/financeiro/billingcontract/list'){
      setPlaceholder('Procurar Contrato')

    }else if (pathname === '/financeiro/billinginvoice/list'){
      setPlaceholder('Procurar Fatura')

    }else{
      setPlaceholder('Pesquise processos, compromissos, clientes e documentos')
      setHideSearchInput(true)
    }

    handleFilterSaved()
  }, [pathname, search])


  const handleFilterSaved = () => {
    // publication can save a filter when is redirect for another route, so here we get back this value for set in term
    if (pathname === '/publication'){

      const filterPublicationSaved = localStorage.getItem('@GoJur:PublicationFilter')
      if (filterPublicationSaved == null) {
         return false;
      }

      const filterJSON = JSON.parse(filterPublicationSaved);
      setSearchTerm(filterJSON.term)
    }
    else{
      // handle anothers filter save in localstorage
    }
  }


  const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (pathname === '/publication'){
      handleCaptureText(event.target.value) // handle capture is used when only term will be executed by caller view
    }
  }, []);


  const handleDashBoardList = useCallback(() => {
    if (timerAutoComplete != null) {
      // if exists timer delay remove from timer to avoid search request
      clearTimeout(timerAutoComplete);
    }

    const delay = 500; // 1 second delay

    // set timeout delay for request
    setTimerAutoComplete(
      setTimeout(() => {
        if (searchTerm.length >= 3) {
          setLoading(true)
          setSearchData([]);
          RequestDashBoardList(searchTerm);
        }

        if (searchTerm.length == 0){
          handleShowListSearch(false);
        }

      }, delay),
    );
  }, [timerAutoComplete, handleShowListSearch, addToast, searchTerm]); // pesquisa e lista processos, compromissos, clientes e documentos


  const onSubmit = useCallback(async () => {
    setTimeout(() => {
      if (searchTerm.length >= 3) {
        setSearchData([]);
        RequestDashBoardList(searchTerm);
      }

      if (searchTerm.length < 3){
        addToast({
          type: 'info',
          title: 'Pesquisa não realizada',
          description: 'Nenhum termo foi específicado para a busca, digite pelo menos 3 caracteres',
        });
      }
    })
  }, [addToast, searchTerm]); // submit do search padrão


  // Request data from dashboard
  const RequestDashBoardList = useCallback(async (searchTerm) => {
    if (searchTerm !== '') {
      try {
        const userToken = localStorage.getItem('@GoJur:token');

        const response = await api.post(`/Dashboard/BuscasProcesso`, { token: userToken, term: searchTerm });
        if(response.data.length > 0){
          setSearchData(response.data);
          handleShowListSearch(true)
        }

        const responseCustomer = await api.post(`/Dashboard/BuscasClientes`, { token: userToken, term: searchTerm });
        if(responseCustomer.data.length > 0){
          setSearchData(old => [...old, ...responseCustomer.data])
          handleShowListSearch(true)
        }

        const responseCalendar = await api.post(`/Dashboard/BuscasCompromissos`, { token: userToken, term: searchTerm });
        if(responseCalendar.data.length > 0){
          setSearchData(old => [...old, ...responseCalendar.data])
          handleShowListSearch(true)
        }

        const responseDocument = await api.post(`/Dashboard/BuscasDocumentos`, { token: userToken, term: searchTerm });
        if(responseDocument.data.length > 0){
          setSearchData(old => [...old, ...responseDocument.data])
          handleShowListSearch(true)
        }

        setLoading(false)
        handleLoadingData(false)

        if (response.data.length === 0 && responseCustomer.data.length === 0 && responseCalendar.data.length === 0 && responseDocument.data.length === 0) {
          addToast({
            type: 'info',
            title: 'Total de resultados',
            description: 'Não foi localizado nenhum resultado para essa busca.',
          });
          handleShowListSearch(false);
        }
      }
      catch (err:any) {
        setLoading(false)
        handleLoadingData(false)
        addToast({
          type: 'error',
          title: 'Falha no carregamento da pagina',
          description: err.message,
        });
      }
    }
    else {
      handleLoadingData(false)
      setLoading(false)
      addToast({
        type: 'info',
        title: '',
        description: 'Informe um termo para realizar a busca',
      });
    }
  }, [searchData, handleShowListSearch]);


  const handleChangeAvatar = useCallback(() => {
    setDefaultImage(false)
    setImagePathDefault('')
    history.push('/usuario');
  }, [history, defaultImage, imagePathDefault]);


  const LoadUserAvatar = useCallback(() => {
    // set default avatar by name user
    const hasError = () => {
      setDefaultImage(true)
    }

    // render default user photo avatar by your name
    const RenderImage = () => {
      if (defaultImage) {
        return (
          <Avatar
            onClick={handleChangeAvatar}
            src={imagePathDefault}
            alt="avatar"
          />
        )
      }
      // render user photo normal when is saved
      return (
        <>
          {imageT === null ? (
            <Avatar
              onError={() => hasError()}
              onClick={handleChangeAvatar}
              src={imagePath}
              alt="avatar"
            />
          ):(
            <Avatar
              onError={() => hasError()}
              onClick={handleChangeAvatar}
              src={imagePath}
              alt="avatar"
            />
          )}
        </>
      )
    }

    return RenderImage();
  }, [imagePathDefault, imagePath, defaultImage])


  const handleClearText= () => {
    setSearchTerm('');
    handleShowListSearch(false);
  }


  return (
    <>
      {!isMOBILE &&(
        <Container>
          <Search
            style={{opacity: (hideSearchInput? "0": "1")}}
            name="search"
            placeholder={placeholder}
            icon={FiSearch}
            handleClear={handleClearText}
            value={searchTerm}
            minLength={3}
            onChange={handleSearch}
            handleRequest={() => {
              if(pathname === '/dashboard') {
                onSubmit();
              }
              else if (pathname === '/customer/list' ||pathname === '/matter/list' || pathname === '/publication' || pathname == '/Subject' || pathname == '/LegalNature' || pathname == '/Rite' || pathname == '/MatterPhase' || pathname == '/MatterStatus' || pathname == 'MatterProbability' || pathname == '/MatterSolution' || pathname == '/CourtDept' || pathname == '/CustomerGroup' || pathname == '/MatterEventType' || pathname == '/MatterDemandType' || pathname == '/LegalCause' || pathname == '/AdvisoryType' || pathname == '/Court' || pathname == '/ThirdPartyGroup' || pathname == '/workflowexec/list' || pathname == '/Position' || pathname == '/PaymentForm' || pathname == '/Category' || pathname == '/FinancialStatus' || pathname == '/Account' || pathname == '/ServiceType' || pathname == '/Cities' || pathname == '/PaymentSlipContract/List' || pathname == '/People/List' || pathname == '/EconomicIndexes/List' || pathname == '/EconomicIndexes/edit/:id' || pathname == '/financeiro' || pathname == '/Holiday' || pathname == '/financeiro/billingcontract/list' || pathname == '/financeiro/billinginvoice/list' || pathname == '/usuario'){
                handleCaptureText(searchTerm) 
              }          
              else if (pathname === '/publication'){            
                handleDispathCallback(true);
              }
              else {
                handleDashBoardList();
              }
            }}
            onKeyUp={() => {
              if(pathname === '/dashboard') {
                handleDashBoardList();
              }
              else if(pathname === '/customer/list' || pathname === '/matter/list' || pathname === '/publication' || pathname == '/calendar' || pathname == '/Subject' || pathname == '/LegalNature' || pathname == '/Rite' || pathname == '/MatterPhase' || pathname == '/MatterStatus' || pathname == '/MatterProbability' || pathname == '/MatterSolution' || pathname == '/CourtDept' || pathname == '/CustomerGroup' || pathname == '/MatterEventType' || pathname == '/MatterDemandType' || pathname == '/LegalCause' || pathname == '/AdvisoryType' || pathname == '/Court' || pathname == '/ThirdPartyGroup' || pathname == '/workflowexec/list' || pathname == '/Position' || pathname == '/PaymentForm' || pathname == '/Category' || pathname == '/FinancialStatus' || pathname == '/Account' || pathname == '/ServiceType' || pathname == '/Cities' || pathname == '/PaymentSlipContract/List' || pathname == '/People/List' || pathname == '/EconomicIndexes/List' || pathname == '/EconomicIndexes/edit/:id' || pathname == '/documentModel/list' || pathname == '/Holiday' || pathname == '/DocumentType' || pathname == '/financeiro' || pathname == '/financeiro/billingcontract/list' || pathname == '/financeiro/billinginvoice/list' || pathname == '/usuario'){
                // nothing to do
              }
              else {
                handleDashBoardList();
              }
            }}
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) {
                e.preventDefault();
              }
              if (e.key == 'Enter' && pathname === '/publication'){
                  handleDispathCallback(true);
              }
              if (e.key == 'Enter' && pathname === '/customer/list'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/matter/list'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/CRM/salesFunnel'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/LegalNature'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Subject'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Rite'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/MatterPhase'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/MatterStatus'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/MatterProbability'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/MatterSolution'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/CourtDept'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/CustomerGroup'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/MatterEventType'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/MatterDemandType'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/LegalCause'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/AdvisoryType'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Court'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/ThirdPartyGroup'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/workflowexec/list'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Position'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/PaymentForm'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Category'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/FinancialStatus'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Account'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/ServiceType'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Cities'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/PaymentSlipContract/List'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/People/List'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/EconomicIndexes/List'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/documentModel/list'){
                handleCaptureText(searchTerm) 
              }
              if (e.key == 'Enter' && pathname === '/financeiro'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/Holiday'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/DocumentType'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/financeiro/billingcontract/list'){
                handleCaptureText(searchTerm)
              }
              if (e.key == 'Enter' && pathname === '/financeiro/billinginvoice/list'){
                handleCaptureText(searchTerm)
              }
            }}
          >
            {((LoadingData && pathname != '/dashboard') || loading)? <Loader color="#f19000" size={8} /> : null}
          </Search>

          {pathname === '/People/List' && (
            <div id='PEOPLE_SELECT' style={{marginLeft:'10px', marginTop:'0px', width:'600px', fontSize:'14px'}}>
              <Select
                autoComplete="off"
                isClearable
                styles={selectStyles}
                name="Type"
                onChange={(item) => handleCaptureType(item? item.value: '')}
                options={options}
              />
            </div>
          )}


          {pathname === '/workflowexec/list' && (
            <div id='WORKFLOW_SELECT' style={{marginLeft:'10px', marginTop:'0px', width:'600px', fontSize:'14px'}}>
              <Select
                autoComplete="off"
                isClearable
                styles={selectStyles}
                name="Type"
                 value={selectedOption} 
               onChange={(opt) => {
        setSelectedOption(opt);
        handleCaptureType(opt ? opt.value : null); // pass null se limpou
      }}
                options={options}
              />
            </div>
          )}


          {pathname === '/financeiro' && (
            <div id='FINANCE_SELECT' style={{marginLeft:'10px', marginTop:'0px', width:'700px', fontSize:'14px'}}>
              <div style={{float:'left', width:'180px'}}>
                <Select
                  value={{ value: defaultMonthValue, label: defaultMonthLabel }}
                  autoComplete="off"
                  isClearable
                  styles={selectStyles}
                  name="Type"
                  onChange={(item) => handleSelectFinancial(item? item.value: '')}
                  options={financeOptions}
                />
              </div>
              <div style={{float:'left', marginTop:'-25px', marginLeft:'181px', color:'#2c8ed6'}}>
                <MdHelp style={{height:'1rem', width:'1rem'}} title="Pesquisa realizada nos campos: descrição, pessoas, categoria e nº da nota fiscal." />
              </div>
            </div>
          )}

          {toolTipSearch != "" && <FcAbout id="tipMesssage" title={toolTipSearch} />}

          <User>
            {companyPlan == 'GOJURFR' && (
            <>
              {accessCode == "adm" && (
                <>
                  {pathname != '/financeiro' && (
                    <>
                      {pathname != '/People/List' && (
                        <>
                          {pathname != "/changeplan" && (
                            <div style={{marginRight:"10px", width:"100px"}}>
                              <div className="btn"><button type='button' onClick={() => history.push('/changeplan')}>Trocar Plano</button></div>
                              {/* <FaShoppingCart className='flash' title="Realize o Upgrade do seu Plano" style={{cursor:"pointer"}} onClick={() => history.push('/changeplan')} /> */}
                            </div>     
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
            )}

            {LoadUserAvatar()}

            {companyPlan != "GOJURFR" && (
            <>
              <p>{companyId}</p>
              <p> - </p>
              <p title={name}>
                {name}
              </p>
            </>          
            )}

            {companyPlan === "GOJURFR" && (
            <>
              <p>{companyId}</p>
              <p> - </p>
              
              <p title={name}>
                {name.split(" ")[0]}
                ...
              </p>

            </>
            
            )}
          </User>

          <TopNavBar />

          {searchData.length > 0 && listOpen && <ListSearch data={searchData} />}

        </Container>
      )}

      {isMOBILE &&(
      <div>
        <div style={{display:"flex"}}>
          {/* {toolTipSearch != "" && <FcAbout id="tipMesssage" title={toolTipSearch} />} */}

          <User style={{marginLeft: ((pathname.includes('/legal') || pathname.includes('advisory'))?'-8rem': '0')}}>
            {LoadUserAvatar()}
            <p>{companyId}</p>
            <p> - </p>
            <p>{name}</p>
          </User>

          <div style={{marginTop:"auto", marginBottom:"auto"}}>
            <TopNavBar />
          </div>
         
          {searchData.length > 0 && listOpen && <ListSearch data={searchData} />}
        </div>
        
        <ContainerMobile>
          <Search
            style={{opacity: (hideSearchInput? "0": "1")}}
            name="search"
            placeholder={placeholder}
            icon={FiSearch}
            handleClear={handleClearText}
            handleRequest={() => {
            if(pathname === '/dashboard') {
              onSubmit();
            }

            else if (pathname === '/customer/list' ||pathname === '/matter/list' || pathname === '/publication' || pathname == '/Subject' || pathname == '/LegalNature' || pathname == '/Rite' || pathname == '/MatterPhase' || pathname == '/MatterStatus' || pathname == 'MatterProbability' || pathname == '/MatterSolution' || pathname == '/CourtDept' || pathname == '/CustomerGroup' || pathname == '/MatterEventType' || pathname == '/MatterDemandType' || pathname == '/LegalCause' || pathname == '/AdvisoryType' || pathname == '/Court' || pathname == '/ThirdPartyGroup' || pathname == '/workflowexec/list' || pathname == '/Position' || pathname == '/PaymentForm' || pathname == '/Category' || pathname == '/FinancialStatus' || pathname == '/Account' || pathname == '/ServiceType' || pathname == '/Cities' || pathname == '/PaymentSlipContract/List' || pathname == '/People/List' || pathname == '/EconomicIndexes/List' || pathname == '/Holiday' || pathname == '/DocumentType' || pathname == '/financeiro/billingcontract/list' || pathname == '/financeiro/billinginvoice/list' || pathname == '/usuario'){
              handleCaptureText(searchTerm)
            }
            else if (pathname === '/publication'){
              handleDispathCallback(true);
            }else {
              handleDashBoardList();
            }
          }}
            onChange={handleSearch}
            onKeyUp={() => {
              if(pathname === '/dashboard') {
                handleDashBoardList();
              }
              else if(pathname === '/customer/list' || pathname === '/matter/list' || pathname === '/publication' || pathname == '/calendar' || pathname == '/Subject' || pathname == '/LegalNature' || pathname == '/Rite' || pathname == '/MatterPhase' || pathname == '/MatterStatus' || pathname == '/MatterProbability' || pathname == '/MatterSolution' || pathname == '/CourtDept' || pathname == '/CustomerGroup' || pathname == '/MatterEventType' || pathname == '/MatterDemandType' || pathname == '/LegalCause' || pathname == '/AdvisoryType' || pathname == '/Court' || pathname == '/ThirdPartyGroup' || pathname == '/workflowexec/list' || pathname == '/Position' || pathname == '/PaymentForm' || pathname == '/Category' || pathname == '/FinancialStatus' || pathname == '/Account' || pathname == '/ServiceType' || pathname == '/Cities' || pathname == '/PaymentSlipContract/List' || pathname == '/People/List' || pathname == '/EconomicIndexes/List' || pathname == '/Holiday' || pathname == '/DocumentType' || pathname == '/financeiro/billingcontract/list' || pathname == '/financeiro/billinginvoice/list' || pathname == '/usuario'){
                // nothing to do
              }else {
                handleDashBoardList();
              }
          }}
            onKeyPress={(e: React.KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) {
              e.preventDefault();
            }

            if (e.key == 'Enter' && pathname === '/publication'){
                handleDispathCallback(true);
            }

            if (e.key == 'Enter' && pathname === '/customer/list'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/matter/list'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/CRM/salesFunnel'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/LegalNature'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Subject'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Rite'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/MatterPhase'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/MatterStatus'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/MatterProbability'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/MatterSolution'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/CourtDept'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/CustomerGroup'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/MatterEventType'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/MatterDemandType'){
              handleCaptureText(searchTerm)
            }

              if (e.key == 'Enter' && pathname === '/LegalCause'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/AdvisoryType'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Court'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/ThirdPartyGroup'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/workflowexec/list'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Position'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/PaymentForm'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Category'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/FinancialStatus'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/documentModel/list'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Account'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/ServiceType'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Cities'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/PaymentSlipContract/List'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/People/List'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/EconomicIndexes/List'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/financeiro'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/Holiday'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/DocumentType'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/financeiro/billingcontract/list'){
              handleCaptureText(searchTerm)
            }

            if (e.key == 'Enter' && pathname === '/financeiro/billinginvoice/list'){
              handleCaptureText(searchTerm)
            }
          }}
            value={searchTerm}
            minLength={3}
          >
            {((LoadingData && pathname != '/dashboard') || loading)? <Loader color="#f19000" size={8} /> : null}
          </Search>

        </ContainerMobile>
      </div>

      )}

      {isMOBILE &&(
        <>
          <div>
            {pathname === '/People/List' && (
            <div id='PEOPLE_SELECT' style={{marginLeft:'3%', marginTop:'0px', width:'93%', fontSize:'14px'}}>
              <Select
                autoComplete="off"
                isClearable
                styles={selectStyles}
                name="Type"
                onChange={(item) => handleCaptureType(item? item.value: '')}
                options={options}
              />
            </div>
          )}

            {pathname === '/financeiro' && (
            <div id='PEOPLE_SELECT' style={{marginLeft:'3%', marginTop:'0px', width:'93%', fontSize:'14px'}}>
              <Select 
                autoComplete="off"
                isClearable
                styles={selectStyles}
                name="Type"
                onChange={(item) => handleCaptureType(item? item.value: '')}
                options={financeOptions}
              />
            </div>
          )}
          </div>
          <br />
        </>
      )}
    </>
  );
}
