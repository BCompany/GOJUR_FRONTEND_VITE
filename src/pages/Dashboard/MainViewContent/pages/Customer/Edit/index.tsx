/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
import React, {ChangeEvent, useCallback, useEffect , useRef, useState, UIEvent} from 'react'
import {useHistory, useLocation  } from 'react-router-dom'
import { format } from 'date-fns'
import { FiSearch, FiFile } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { FiLock, FiPlus, FiSave, FiTrash } from 'react-icons/fi';
import { FaFileAlt } from 'react-icons/fa';
import { FaWhatsapp, FaUserCircle, FaFolderOpen, FaFilePdf } from 'react-icons/fa';
import { RiCloseLine, RiNewspaperFill } from 'react-icons/ri';
import { GiReceiveMoney } from 'react-icons/gi';
import { MdBlock } from 'react-icons/md';
import { formatField, selectStyles, useDelay, currencyConfig} from 'Shared/utils/commonFunctions';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import IntlCurrencyInput from "react-intl-currency-input";
import Loader from 'react-spinners/PulseLoader';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Clear, Tab, Tabs } from 'Shared/styles/Tabs';
import api from 'services/api';
import { useMatter } from 'context/matter';
import Select from 'react-select'
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { legalPersonType, personSitu, personTypes, phoneTypes, sexo } from 'Shared/utils/commonListValues';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import InputMask from 'components/InputMask';
import Search from 'components/Search';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useModal } from 'context/modal';
import { useDocument } from 'context/document';
import DocumentModal from 'components/Modals/CustomerModal/DocumentModal';
import { useCustomer } from 'context/customer';
import DatePicker from 'components/DatePicker';
import UploadList from '../Upload';
import { Card, Container, Content, Form, ListCards, CardMatter, MatterListCards} from './styles';
import { ICustomerAddress, ICustomerGroup, ICustomerData, ICustomerLegalPerson,ITabsControl, IDefaultsProps, IBusinessData, ICepProps, ISelectData } from '../Interfaces/ICustomerEdit';
import MatterCard from '../Matter';
import BussinessList from '../Business/List';
import SalesChannelEdit from '../CRM/Configuration/SalesChannel/Modal';
import { IMatterData } from '../Interfaces/IMatterList';

export default function Customer() {

  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { handleUserPermission, permission} = useDefaultSettings();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const { addToast } = useToast();
  const { pathname  } = useLocation();
  const { handleSubmit} = useForm<ICustomerData>();
  const { handleReloadBusinesCard, reloadBusinessCard } = useCustomer();
  const {isConfirmMessage, isCancelMessage, caller, handleCancelMessage,handleConfirmMessage } = useConfirmBox();
  const [showSalesFunnelMenu, setShowSalesFunnelMenu] = useState<boolean>(true)
  const { showSalesChannelModal } = useModal();
  const [isLoading , setIsLoading] = useState(true); // objecto todo de do cliente
  const [isPagination , setIsPagination] = useState(false); // objecto todo de do cliente
  const [customer , setCustomer] = useState({} as ICustomerData); // objecto todo de do cliente
  const [customerAddress , setCustomerAddress] = useState<ICustomerAddress[]>([]); // objeto de endereço que compoe o cliente
  const [customerLegalPerson , setCustomerLegalPerson] = useState<ICustomerLegalPerson[]>([]); // objeto de representante que compoe o cliente
  const [customerCitysDefault , setCustomerCitysDefault] = useState<ISelectData[]>([]); // count field for address block
  const [customerCitys , setCustomerCitys] = useState<ISelectData[]>([]); // count field for address block
  const [customerCitysLP , setCustomerCitysLP] = useState<ISelectData[]>([]); // count field for address block
  const [customerGroup , setCustomerGroup] = useState<ISelectData[]>([]); // count field for address block
  const [salesChannelList , setSalesChannelList] = useState<ISelectData[]>([]); // count field for address block
  const [customerName , setCustomerName] = useState(''); // field nome
  const [customerFantasia , setCustomerFantasia] = useState(''); // field nome fantasia
  const [customerEmail , setCustomerEmail] = useState(''); // field e-mail
  const [customerSenha , setCustomerSenha] = useState(''); // field senha
  const [customerRef , setCustomerRef] = useState(''); // field Referencia
  const [customerWhatsapp , setCustomerWhatsapp] = useState(''); // field whatsapp
  const [customerGroupValue , setCustomerGroupValue] = useState(''); // group field value
  const [customerGroupId , setCustomerGroupId] = useState(''); // group field id
  const [customerSalesChannelId , setCustomerSalesChannelId] = useState(''); // group field id
  const [customerType , setCustomerType] = useState('F'); //  field type
  const [customerRepresent , setCustomerRepresent] = useState(''); //  field Representado
  const [customerNumDoc , setCustomerNumDoc] = useState(''); //  field num doc
  const [customerSex , setCustomerSex] = useState('F'); //  field Sexo
  const [customerNacionalidade , setCustomerNacionalidade] = useState(''); //  field nacionalidade
  const [customerNasc , setCustomerNasc] = useState(''); //  field Nascimento
  const [customerAbertura , setCustomerAbertura] = useState(''); //  field Abertura
  const [customerRg , setCustomerRg] = useState(''); //  field Rg
  const [customerPis , setCustomerPis] = useState(''); //  field Pis
  const [customerECivil , setCustomerECivil] = useState('I'); //  field estado civil
  const [customerMae , setCustomerMae] = useState(''); //  field mae
  const [customerProf , setCustomerProf] = useState(''); //  field profissao
  const [customerPai , setCustomerPai] = useState(''); //  field pai
  const [customerInss , setCustomerInss] = useState(''); //  field Inss
  const [customerCtps , setCustomerCtps] = useState(''); //  field Ctps
  const [customerSCtps , setCustomerSCtps] = useState(''); //  field Serie Ctps
  const [customerSalary , setCustomerSalary] = useState<number>(); //  field Salário
  const [customerIE , setCustomerIE] = useState(''); //  field numero insc estadual
  const [groupSearchTerm , setGroupSearchTerm] = useState('');
  const [salesChannelSearchTerm , setSalesChannelSearchTerm] = useState('');
  const [customerObs , setCustomerObs] = useState(''); //  field observação
  const [customerStatus , setCustomerStatus] = useState('A'); //  field customerStatus
  const [customerEmailFinanAdd , setCustomerEmailFinanAdd] = useState<string>(''); //  field email de faturamento add
  const [customerCityValue , setCustomerCityValue] = useState(''); //  field city
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isDeleting , setIsDeleting] = useState<boolean>(); // set trigger for show loader
  const [customerActivePassword , setCustomerActivePassword] = useState(false); //  field email de faturamento
  const [customerActiveModalDoubleCheck , setCustomerActiveModalDoubleCheck] = useState(false); //  modal double check
  const [matterList , setMatterList] = useState<IMatterData[]>([]);
  const [businessList , setBusinessList] = useState<IBusinessData[]>([]);
  const {isOpenCardBox, matterReferenceId } = useMatter();
  const [hasMatter, setHasMatter] = useState<boolean>(false);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isInitialize, setIsInitialize] = useState<boolean>(true);
  const [searchTermBusinnes, setSearchTermBusiness] = useState<string>('');
  const [isLoadingSearchTerm, setIsLoadingSearchTerm] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [customerStartDate, setCustomerStartDate] = useState<string>('')
  const [currentCustomerId, setCurrentCustomerId] = useState<number>(0);
  const [permissionCRM, setPermissionCRM] = useState<boolean>(false)
  const [businessTotal, setBusinessTotal] = useState<number>(0)
  const [tabsControl, setTabsControl] = useState<ITabsControl>({tab1: true, tab2: false, tab3: false, tab4: false, activeTab: 'customer'});
  const [changeCEPCustomer, setChangeCEPCustomer] = useState<boolean>(false)
  const [changeCEPLP, setChangeCEPLP] = useState<boolean>(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const {handleLoadInitialPropsFromDocument } = useDocument();
  const {handleOpenCustomerDocumentModal, handleOpenReportModal, handleCloseReportModal, isReportModalOpen} = useCustomer();
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');
  const checkpermissionDocument = permissionsSecurity.find(item => item.name === "CFGDCMEM");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);

  // Initialization
  useEffect (() => {
    handleValidateSecurity(SecurityModule.configuration)
    
    handleDefaultProps()
    LoadGroups()
    LoadSalesChannel()
    LoadCustomer()
  },[])

  useEffect (() => {
    const id = pathname.substr(15)
    if (isInitialize){
      LoadGroups((id == '0'? 'reset': 'initialize'))
    }
  },[customerGroupValue, customerGroupId])

  // Insert new sales chanel and update combo
  useEffect(() => {
    if (reloadBusinessCard)
    {
      handleDefaultProps()
      ListBusinessCustomer(customer.cod_Cliente, 'initialize')
      handleReloadBusinesCard(false)
    }
  },[reloadBusinessCard])


  const LoadCustomer = async () => {

    let customerId = pathname.substr(15)
    let hasFilterSaved = false;
    const filterStorage = localStorage.getItem('@GoJur:CustomerFilter')

    // verify if exists filter saved
    if (Number.isNaN(Number(customerId))){
      if (filterStorage == null) {
        return false;
      }
      // if exists filter exists associate to specific variables and rebuild page
      const filterJSON = JSON.parse(filterStorage)
      customerId = filterJSON.customerId;
      hasFilterSaved = true;
    }

    // when is id
    if (Number(customerId) === 0){
      handleNewAddress();
      return;
    }

    const businessCustomerId = localStorage.getItem('@GoJur:businessCustomerId')
    if (businessCustomerId){
      handleTabs('business', Number(businessCustomerId))
      localStorage.removeItem('@GoJur:businessCustomerId')
    }

    const matterCustomerId = localStorage.getItem('@GoJur:matterCustomerId')
    if (matterCustomerId){
      handleTabs('matterList', Number(matterCustomerId))
      localStorage.removeItem('@GoJur:matterCustomerId')
    }

    const documentCustomerId = localStorage.getItem('@GoJur:documentCustomerId')
    if (documentCustomerId){
      handleTabs('documentList', Number(documentCustomerId))
      localStorage.removeItem('@GoJur:documentCustomerId')
    }

    try {
      const response = await api.post<ICustomerData>('/Clientes/Editar', {
        id: Number(customerId),
        token
      })

      setCustomer(response.data)
      setCustomerName(response.data.nom_Pessoa)
      setCustomerFantasia(response.data.nom_PessoaFantasia)
      setCustomerEmail(response.data.des_Email)
      setCustomerSenha(response.data.cod_Senha)
      setCustomerRef(response.data.cod_Referencia)
      setCustomerWhatsapp(response.data.num_WhatsApp)

      if(response.data.enderecolist.length < 1) {
        const id = Math.random()

        const newAddress: ICustomerAddress = {
          cod_Endereco: id,
          cod_PessoaEndereco: undefined,
          des_Endereco: '',
          des_Bairro: '',
          cod_Municipio: undefined,
          nom_Municipio: undefined,
          num_CEP: undefined,
          tpo_Telefone01: '',
          num_Telefone01: '',
          tpo_Telefone02: '',
          num_Telefone02: '',
          flg_Correspondencia: false,
          cod_MunicipioIBGE: '',
        }

        setCustomerAddress(oldState => [...oldState, newAddress])

      }
      else{
        setCustomerAddress(response.data.enderecolist)
      }

      setCustomerGroupValue(response.data.des_GrupoCliente)
      setCustomerGroupId(response.data.cod_GrupoCliente)
      setCustomerType(response.data.tpo_Pessoa != null? response.data.tpo_Pessoa: 'F')
      setCustomerRepresent(response.data.nom_Responsavel)
      setCustomerNumDoc(response.data.num_CPFCNPJ)
      setCustomerSex(response.data.tpo_Sexo)
      setCustomerNacionalidade(response.data.des_Nacionalidade)

      if (response.data.dta_Nascimento != null){
        setCustomerNasc(format(new Date(response.data.dta_Nascimento), 'yyyy-MM-dd'))
      }

      if (response.data.dta_Captacao != null){
        setCustomerStartDate(format(new Date(response.data.dta_Captacao), 'yyyy-MM-dd'))
      }

      setCustomerRg(response.data.num_RG)
      setCustomerPis(response.data.num_PIS)
      setCustomerECivil(response.data.tpo_EstadoCivil)
      setCustomerMae(response.data.nom_Mae)
      setCustomerProf(response.data.des_Profissao)
      setCustomerPai(response.data.nom_Pai)
      setCustomerInss(response.data.num_BeneficioINSS)
      setCustomerCtps(response.data.num_CTPS)
      setCustomerSCtps(response.data.num_SerieCTPS)
      setCustomerSalary(response.data.vlr_UltimoSalario)
      setCustomerStatus(response.data.flg_Status)

      if (response.data.dta_Abertura != null){
        setCustomerAbertura(format(new Date(response.data.dta_Abertura), 'yyyy-MM-dd'))
      }

      setCustomerIE(response.data.num_IE)

      const legalPerson = response.data.legalPerson.map(person => person && {
        ...person,
        action: 'update'
      })

      setCustomerLegalPerson(legalPerson)
      setCustomerObs(response.data.des_Observacao)
      setCustomerEmailFinanAdd(response.data.des_EmailFaturamento)
      setCustomerSalesChannelId(response.data.cod_CanalDeVendas)
      setIsLoading(false)
      setIsInitialize(false)

      if (hasFilterSaved){
        handleTabs('matterList', Number(customerId))
      }

      } catch (err) {
        setIsLoading(false)
        history.push('/customer/list')
        console.log(err)
      }
  }

  const ListMatterCustomer = async (customerId: Number, tabState: String  = '') => {

    const currentPage = tabState === 'initialize'? 1: page;

    if (tabState === 'initialize'){
      setIsLoading(true)
      setIsPagination(false)
    }

    try
    {
      const response = await api.post<IMatterData[]>('/Processo/Listar', {
        filterClause: `#CID${customerId.toString()}`, // use key #CID to filter by customerId
        page:currentPage,
        rows: 10,
        token,
        companyId,
        apiKey
      });

      // verify if exists matter in
      const hasMatterList = response.data.find(item => item.followList.length > 0);
      if (hasMatterList && !hasMatter){
        setHasMatter(true);
      }

      if (!isPagination || tabState === 'initialize'){
        setMatterList(response.data)
      }
      else{

        if (response.data.length === 0){
          setIsLoading(false)
        }

        const matterData = [...matterList, ...response.data]
        setMatterList(matterData)
      }

      setPage(currentPage+1)
      setIsLoading(false)

    } catch (ex){
      setIsLoading(false);
      console.log(ex)
    }
  }

  const ListBusinessCustomer = async (customerId: Number, tabState: String  = '') => {

    const currentPage = tabState === 'initialize'? 1: page;

    if (customerId == 0){
      return false;
    }

    if (tabState === 'initialize'){
      setIsLoading(true)
      setIsLoadingSearchTerm(false)
      setIsPagination(false)
    }

    try
    {
      const response = await api.post<IBusinessData[]>('/NegocioCliente/ListarPorCliente', {
        customerId,
        page:currentPage,
        rows: 50,
        filterClause: searchTermBusinnes,
        token
      });

      if (!isPagination || tabState === 'initialize'){
        setBusinessList(response.data)
      }
      else{
        if (response.data.length === 0){
          setIsLoading(false)
        }

        const businessData = [...businessList, ...response.data]
        setBusinessList(businessData)
      }

      setPage(currentPage+1)
      setIsLoading(false)
      setIsLoadingSearchTerm(false)
      localStorage.removeItem('@GoJur:businessCustomerId')

    } catch (ex){
      setIsLoading(false);
      console.log(ex)
    }
  }

  const LoadSalesChannel = async () => {

    try {

      const response = await api.get<ISelectData[]>('CanalDeVendas/Listar', {
        params:{
          token,
          filterTerm: salesChannelSearchTerm
        }
      })

      setSalesChannelList(response.data)

    } catch (err) {
      console.log(err);
    }
  }

  const handleDefaultProps = async() => {
    try {

      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token });
      const CRMPermission = response.data.filter(item => item.id === 'defaultPlanPermissionCRM')
      const businessCount = response.data.filter(item => item.id === 'defaultCRMBusinessTotal')

      if (CRMPermission){
        // eslint-disable-next-line radix
        setPermissionCRM(CRMPermission[0].value == "S")
      }

      // get total business count
      if (businessCount){
        // eslint-disable-next-line radix
        // eslint-disable-next-line no-alert
        setBusinessTotal(parseInt(businessCount[0].value))
      }

      const userprops = response.data[4].value.split('|');
      handleUserPermission(userprops);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isPagination) {
      if (tabsControl.activeTab == 'matterList'){
        ListMatterCustomer(customer.cod_Cliente, '')
      }

      if (tabsControl.activeTab == "business"){
        ListBusinessCustomer(customer.cod_Cliente, '')
      }

    }
  },[isPagination])


  const LoadGroups = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? customerGroupValue:groupSearchTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ICustomerGroup[]>('/Clientes/ListarGrupoClientes', {
        filterClause: filter,
        token,
      });

      const listSelectGrup: ISelectData[] = []

      response.data.map(item => {
        listSelectGrup.push({
          id: item.id,
          label: item.value
        })
      })

      setCustomerGroup(listSelectGrup)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }


  useDelay(() => {
    if (groupSearchTerm.length > 0){
      LoadGroups()
    }
  }, [groupSearchTerm], 1000)


  useDelay(() => {
    if (salesChannelSearchTerm.length > 0){
      LoadSalesChannel()
    }
  }, [salesChannelSearchTerm], 1000)


  useDelay(() => {
    async function LoadCities() {

      if (customerCityValue.length == 0 && !isLoading) {
        setCustomerCitys(customerCitysDefault)
        setCustomerCitysLP(customerCitysDefault)
        return;
      }

      setIsLoadingComboData(true)

      try {

        const response = await api.post('/Cidades/ListarCidades', {
          filterClause: customerCityValue,
          token,
        });

        const listCities: ISelectData[] = [];

        response.data.map((item) => {

          // fill object to match with react-select
          listCities.push({ id: item.id, label: item.value })

          return listCities;
        })

        setCustomerCitys(listCities)
        setCustomerCitysLP(listCities)
        setIsLoadingComboData(false)

        if (customerCityValue.length == 0) {
          setCustomerCitysDefault(listCities)
        }

      } catch (err) {
        console.log(err);
      }
    }

    LoadCities()

  }, [customerCityValue], 1000)


  // Get permission to see or not menu sales funnel on customer list
  useEffect(() => {
    try{
        const showFunnelMenu = permission.filter(item => (item == "salesFunnel" || item == "adm")).length > 0

        setShowSalesFunnelMenu(showFunnelMenu)
    }
    catch(err) {
      console.log(err)
    }

  },[permission])


  const handleSubmitCustomer = useCallback(async() => {
    const abertura = `${customerAbertura}T00:00:00`;
    const nascimento = `${customerNasc}T00:00:00`;
    const token = localStorage.getItem('@GoJur:token');

    setisSaving(true)

    let emailValidation = true;

    // email financial validation
    emailValidation = handleValidateEmail(customerEmailFinanAdd, 'financeiro');
    if (!emailValidation){
      setisSaving(false)
      return;
    }

    if (customerGroupId === ''){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "Grupo do cliente não informado"
      })

      setisSaving(false)
      return;
    }

    if (Number(customerSalary) < 0){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "O campo Último Salário não aceita valor negativo"
      })

      setisSaving(false)
      return;
    }

    const addresList = customerAddress.map(i => {
      const list = {
        ...i,
        // cod_Endereco: 0
      }
      return list;
    })

    const legalPersonList = customerLegalPerson.map(i => {
      const list = {
        ...i,
      cod_PessoaRepresentanteLegal: i.cod_PessoaRepresentanteLegal ? i.cod_PessoaRepresentanteLegal : 0,
      cod_Empresa: customer.cod_Empresa
      }
      return list;
    })

    try {
      const response = await api.post('/Clientes/Salvar', {
        token,
        cod_pessoa: customer.cod_Pessoa ? customer.cod_Pessoa : 0, // cod cliente
        nom_Pessoa: customerName, // nome cliente
        nom_PessoaFantasia: customerFantasia, // nome fantasia
        des_Email: customerEmail, // email cliente
        cod_Senha: customerSenha,  // senha
        cod_GrupoCliente: customerGroupId, // id grupo
        des_GrupoCliente: customerGroupValue, // nome grupo
        tpo_Telefone01: customer.tpo_Telefone01,
        num_Telefone01: customer.num_Telefone01,
        tpo_Telefone02: customer.tpo_Telefone02,
        num_Telefone02: customer.num_Telefone02,
        des_Nacionalidade: customerNacionalidade, // nacionalidade
        tpo_Pessoa: customerType, // tipo pessoal fisica ou juridica
        num_CPFCNPJ: customerNumDoc, // num documento
        num_WhatsApp: customerWhatsapp, // whatsapp
        addressDTOList: addresList, // listagem de endereço
        CheckEndereco: customerAddress.length,
        cod_PessoaFisica: customer.cod_PessoaFisica,
        num_RG: customerRg, // rg
        tpo_Sexo: customerSex, // sexo
        tpo_EstadoCivil: customerECivil, // estado civil
        dta_Nascimento: nascimento, // nascimento
        des_Profissao: customerProf, // profissão
        num_CTPS: customerCtps,
        num_SerieCTPS: customerSCtps,
        vlr_UltimoSalario: customerSalary,
        num_BeneficioINSS: customerInss,
        num_PIS: customerPis,
        nom_Pai: customerPai,
        nom_Mae: customerMae,
        cod_Cliente: customer.cod_Cliente,
        nom_Responsavel: customerRepresent,
        des_Observacao: customerObs,
        cod_PessoaJuridica: customer.cod_PessoaJuridica,
        num_IE: customerIE,
        dta_Abertura:  abertura,
        cod_SistemaUsuarioEmpresa: customer.cod_SistemaUsuarioEmpresa,
        doubleCheck: customer.doubleCheck,
        des_EmailFaturamento: (customerEmailFinanAdd??"").replaceAll(' ', ''),
        cod_Referencia: customerRef,
        legalPersonDTOList: legalPersonList,
        CheckLegalPerson: customerLegalPerson.length,
        cod_canalDeVendas: customerSalesChannelId,
        dta_Captacao: customerStartDate,
        flg_Status: customerStatus
      })

      addToast({
        type: "success",
        title: "Cliente salvo",
        description: customer.cod_Pessoa ? "As alterações feitas no cliente foram salvas" : "Cliente adicionado ao catálogo"
      })

      // response.data = cod_Pessoa
      localStorage.setItem('@GoJur:NC', response.data.cod_Pessoa)

      setisSaving(false)
      setisSaving(false)

      history.push('/customer/list')

    } catch (err: any) {

      // eslint-disable-next-line no-alert
      if(err.response.data.statusCode !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar cliente",
          description:  err.response.data.Message
        })
      }

      if(err.response.data.statusCode === 1011) {
       setCustomerActiveModalDoubleCheck(true)
      }

      setisSaving(false)
      localStorage.removeItem('@GoJur:businessCustomerId')
    }

  },[customerAbertura, customerNasc, customerAddress, customerLegalPerson, customer.cod_Pessoa, customer.tpo_Telefone01, customer.num_Telefone01, customer.tpo_Telefone02, customer.num_Telefone02, customer.cod_PessoaFisica, customer.cod_Cliente, customer.cod_PessoaJuridica, customer.cod_SistemaUsuarioEmpresa, customer.doubleCheck, customer.cod_Empresa, customerName, customerFantasia, customerEmail, customerSenha, customerGroupId, customerGroupValue, customerNacionalidade, customerType, customerNumDoc, customerWhatsapp, customerRg, customerSex, customerECivil, customerProf, customerCtps, customerSCtps, customerInss, customerPis, customerPai, customerMae, customerRepresent, customerObs, customerIE, customerEmailFinanAdd, customerRef, customerSalesChannelId, customerStatus, customerStartDate, customerSalary, addToast, history]);


  const handleSaveWithDoubleCheck = useCallback(async() => {
    const abertura = `${customerAbertura}T00:00:00`;
    const nascimento = `${customerNasc}T00:00:00`;
    const token = localStorage.getItem('@GoJur:token');

    try {

      const response = await api.post('/Clientes/Salvar', {
        token,
        cod_pessoa: customer.cod_Pessoa ? customer.cod_Pessoa : 0, // cod cliente
        nom_Pessoa: customerName, // nome cliente
        nom_PessoaFantasia: customerFantasia, // nome fantasia
        des_Email: customerEmail, // email cliente
        cod_Senha: customerSenha,  // senha
        cod_GrupoCliente: customerGroupId, // id grupo
        des_GrupoCliente: customerGroupValue, // nome grupo
        tpo_Telefone01: customer.tpo_Telefone01,
        num_Telefone01: customer.num_Telefone01,
        tpo_Telefone02: customer.tpo_Telefone02,
        num_Telefone02: customer.num_Telefone02,
        des_Nacionalidade: customerNacionalidade, // nacionalidade
        tpo_Pessoa: customerType, // tipo pessoal fisica ou juridica
        num_CPFCNPJ: customerNumDoc, // num documento
        num_WhatsApp: customerWhatsapp, // whatsapp
        addressDTOList: customerAddress, // listagem de endereço
        CheckEndereco: customerAddress.length,
        cod_PessoaFisica: customer.cod_PessoaFisica,
        num_RG: customerRg, // rg
        tpo_Sexo: customerSex, // sexo
        tpo_EstadoCivil: customerECivil, // estado civil
        dta_Nascimento: nascimento, // nascimento
        des_Profissao: customerProf, // profissão
        num_CTPS: customerCtps,
        num_SerieCTPS: customerSCtps,
        vlr_UltimoSalario: customerSalary,
        num_BeneficioINSS: customerInss,
        num_PIS: customerPis,
        nom_Pai: customerPai,
        nom_Mae: customerMae,
        cod_Cliente: customer.cod_Cliente,
        nom_Responsavel: customerRepresent,
        des_Observacao: customerObs,
        cod_PessoaJuridica: customer.cod_PessoaJuridica,
        num_IE: customerIE,
        dta_Abertura:  abertura,
        cod_SistemaUsuarioEmpresa: customer.cod_SistemaUsuarioEmpresa,
        doubleCheck: true,
        des_EmailFaturamento: (customerEmailFinanAdd??"").replaceAll(' ', ''),
        cod_Referencia: customerRef,
        legalPersonDTOList: customerLegalPerson,
        CheckLegalPerson: customerLegalPerson.length,
      })

      addToast({
        type: "success",
        title: "Cliente salvo",
        description: customer.cod_Pessoa ? "As alterações feitas no cliente foram salvas" : "Cliente adicionado ao catálogo"
      })

      localStorage.setItem('@GoJur:NC', response.data)

      history.push('/customer/list')

    } catch (err: any) {
      addToast({
        type: "error",
        title: "Falha ao cadastrar cliente",
        description:  err.response.data.Message
      })

      if(err.response.data.customerStatusCode === 1011) {
       setCustomerActiveModalDoubleCheck(true)
      }
    }

  },[addToast, customer.cod_Cliente, customer.cod_Pessoa, customer.cod_PessoaFisica, customer.cod_PessoaJuridica, customer.cod_SistemaUsuarioEmpresa, customer.num_Telefone01, customer.num_Telefone02, customer.tpo_Telefone01, customer.tpo_Telefone02, customerAbertura, customerAddress, customerCtps, customerECivil, customerEmail, customerEmailFinanAdd, customerFantasia, customerGroupId, customerGroupValue, customerIE, customerInss, customerLegalPerson, customerMae, customerNacionalidade, customerName, customerNasc, customerNumDoc, customerObs, customerPai, customerPis, customerProf, customerRef, customerRepresent, customerRg, customerSCtps, customerSalary, customerSenha, customerSex, customerType, customerWhatsapp, history]);


  const handleDeletePassword = () => {
    setCustomerActivePassword(false);
    setCustomerSenha('')
  }


  const handleSearchCitiesByTermLP  = (item, personId)  => {

    if (item)
    {
      const id = customerCitysLP.filter(i => i.id === item.id).map(i => i.id).toString()

      const updateCity = customerLegalPerson.map(city => city.cod_PessoaRepresentanteLegal === personId ? {
        ...city,
        nom_MunicipioLegalPerson: item.label,
        cod_MunicipioLegalPerson: Number(id)
      }: city)

      setCustomerLegalPerson(updateCity)
    }
    else{

      // clean item when was clear from select
      const updateCity = customerLegalPerson.map(city => city.cod_PessoaRepresentanteLegal === personId ? {
        ...city,
        nom_MunicipioLegalPerson: '',
        cod_MunicipioLegalPerson: 0
      }: city)

      // setCustomerCityValue('')
      setCustomerLegalPerson(updateCity)
    }
  }


  const handleCityChangeAddress = (item: any, addressId: number | undefined) => {

    if (item){
      // update item selected
      const updateCity = customerAddress.map(city => city.cod_Endereco === addressId ? {
        ...city,
        nom_Municipio: item.label,
        cod_Municipio: Number(item.id)
      }: city)

      setCustomerAddress(updateCity)
    }
    else{
      // clean item when was clear from select
      const updateCity = customerAddress.map(city => city.cod_Endereco === addressId ? {
        ...city,
        nom_Municipio: '',
        cod_Municipio: 0
      }: city)

      setCustomerAddress(updateCity)
    }
  }


  const handleNewAddress = useCallback(() => {
    const id = Math.random()
    const newAddress: ICustomerAddress = {
      cod_Endereco: id,
      cod_PessoaEndereco: undefined,
      des_Endereco: '',
      des_Bairro: '',
      cod_Municipio: undefined,
      nom_Municipio: undefined,
      num_CEP: undefined,
      tpo_Telefone01: 'C',
      num_Telefone01: '',
      tpo_Telefone02: 'C',
      num_Telefone02: '',
      flg_Correspondencia: false,
      cod_MunicipioIBGE: '',
    }

    setCustomerAddress(oldAddress => [...oldAddress, newAddress])
  },[]); // adiciona um novo endereço na interface


  const handleNewLegalPerson = useCallback(() => {
    const id = Math.random()
    const newLegalPerson: ICustomerLegalPerson = {
      action: 'update',
      cod_Empresa: customer.cod_Empresa,
      cod_EnderecoLegalPerson: 0,
      cod_MunicipioLegalPerson: 0,
      cod_PessoaEnderecoLegalPerson: 0,
      cod_PessoaFisicaRepresentanteLegal: 0,
      cod_PessoaRepresentado: 0,
      cod_PessoaRepresentanteLegal: id,
      cod_RepresentanteLegal: 0,
      des_BairroLegalPerson: '',
      des_EnderecoLegalPerson: '',
      des_ProfissaoRepresentante: '',
      des_Qualificacao: 'Administrador',
      flg_EnderecoRepresentado: true,
      nom_MunicipioLegalPerson: '',
      nom_RepresentanteLegal: '',
      num_CEPLegalPerson: '',
      num_CpfRepresentante: '',
      num_RGRepresentante: '',
      tpo_EstadoCivilRepresentante: 'I',
    }

    setCustomerLegalPerson(oldLegalPerson => [...oldLegalPerson, newLegalPerson])
  },[customer]); // adiciona um novo representante legal na interface


  const handleDeleteLegalPerson = useCallback((personId) => {
      const person = customerLegalPerson.map(i => i.cod_PessoaRepresentanteLegal === personId ? {
        ...i,
        action: 'DELETE'
      }: i);
      setCustomerLegalPerson(person)

  },[customerLegalPerson]); // remove um representante legal da interface


  const handleDeleteAddress = useCallback((addressId) => {
      const address = customerAddress.filter(item => item.cod_Endereco !== addressId);
      if(address.length >=1) {
        setCustomerAddress(address)
      }else{
        addToast({
          type:"info",
          title: "Operação invalida",
          description: "Só é possivel excluir quando há mais de um endereço cadastrado"
        })
      }
  },[addToast, customerAddress]); // remove um endereço da interface


  const handleChangeCep = useCallback((value, addressId) => {
      const formatedValue = formatField(value, 'cep')
      const cep = customerAddress.map(address => address.cod_Endereco === addressId ? {
        ...address,
        num_CEP: formatedValue
      }: address)

      setCustomerAddress(cep)
      setChangeCEPCustomer(true)
  },[customerAddress]); // atualiza o cep


  const handleLoadAddressFromCep = useCallback(async(addressId , type: 'c' | 'lp') => {

    if(type === 'c' && changeCEPCustomer == false)
    {
      return;
    }

    if(type === 'lp' && changeCEPLP == false)
    {
      return;
    }

    const cepC = customerAddress.filter(address => address.cod_Endereco === addressId).map(i => i.num_CEP).toString()
    const cepLp = customerLegalPerson.filter(address => address.cod_PessoaRepresentanteLegal === addressId).map(i => i.num_CEPLegalPerson).toString()
    try {
      const token = localStorage.getItem('@GoJur:token');

      const response = await api.post<ICepProps>('/Cidades/ListarPorCep', {
        cep: type === 'c' ? cepC : cepLp ,
        token,
      });

      const customerStatus = response.data.Status;

      if(customerStatus !== 'OK') {
        addToast({
          type: "info",
          title: "Cep invalido",
          description: "O CEP digitado não foi encontrado , tente novamente com outro cep"
        })
        return;
      }

      if(type === 'c') {
        const addressLoad = customerAddress.map(address => address.cod_Endereco === addressId ? {
          ...address,
          des_Bairro: response.data.Bairro,
          des_Endereco: response.data.Logradouro,
          cod_Municipio: Number(response.data.Localidade_Cod),
          nom_Municipio: response.data.Localidade,
          cod_MunicipioIBGE: response.data.IBGE,
        } : address)

        setCustomerAddress(addressLoad)
      }else {
        const addressLoad = customerLegalPerson.map(address => address.cod_PessoaRepresentanteLegal === addressId ? {
          ...address,
          des_BairroLegalPerson: response.data.Bairro,
          des_EnderecoLegalPerson: response.data.Logradouro,
          cod_MunicipioLegalPerson: Number(response.data.Localidade_Cod),
          nom_MunicipioLegalPerson: response.data.Localidade,
        } : address)

        setCustomerLegalPerson(addressLoad)
      }

      setChangeCEPCustomer(false)
      setChangeCEPLP(false)

    } catch (err) {
      console.log(err);
    }

  },[addToast, customerAddress, customerLegalPerson, changeCEPCustomer, changeCEPLP]);


  const handleChangeLPCep = useCallback((value, personId) => {
      const formatedValue = formatField(value, 'cep')
      if(formatedValue === undefined) return;
      const cep = customerLegalPerson.map(address => address.cod_PessoaRepresentanteLegal === personId ? {
        ...address,
        num_CEPLegalPerson: formatedValue
      }: address)

      setCustomerLegalPerson(cep)
      setChangeCEPLP(true)
  },[customerLegalPerson]); // atualiza o cep do representante legal


  const handleChangeDistrict = useCallback((value, addressId) => {
      const district = customerAddress.map(address => address.cod_Endereco === addressId ? {
        ...address,
        des_Bairro: value
      }: address)

      setCustomerAddress(district)
  },[customerAddress]); // atualiza o bairro


  const handleChangeLPDistrict = useCallback((value, personId) => {
      const district = customerLegalPerson.map(address => address.cod_PessoaRepresentanteLegal === personId ? {
        ...address,
        des_BairroLegalPerson: value
      }: address)

      setCustomerLegalPerson(district)
  },[customerLegalPerson]); // atualiza o bairro do representante legal


  const handleChangeAddress = useCallback((value, addressId) => {
      const newAddress = customerAddress.map(address => address.cod_Endereco === addressId ? {
        ...address,
        des_Endereco: value
      }: address)

      setCustomerAddress(newAddress)
  },[customerAddress]); // atualiza o endereço


  const handleChangeLPAddress = useCallback((value, personId) => {
      const newAddress = customerLegalPerson.map(address => address.cod_PessoaRepresentanteLegal === personId ? {
        ...address,
        des_EnderecoLegalPerson: value
      }: address)

      setCustomerLegalPerson(newAddress)
  },[customerLegalPerson]); // atualiza o endereço do representante legal


  const handleChangeTypePhone1 = useCallback((value, addressId) => {

    const newTypePhone = customerAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      tpo_Telefone01: value
    }: address)

    setCustomerAddress(newTypePhone)

  },[customerAddress]); // atualiza o tipo de telefone 1


  const handleChangeTypePhone2 = useCallback((value, addressId) => {
    const newTypePhone = customerAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      tpo_Telefone02: value
    }: address)

    setCustomerAddress(newTypePhone)

  },[customerAddress]); // atualiza o tipo de telefone 2


  const handleChangePhone1 = useCallback((value, addressId) => {

    console.log(value)
    const newPhone = customerAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_Telefone01: value
    }: address)

    setCustomerAddress(newPhone)

  },[customerAddress]); // atualiza o  telefone 1


  const handleChangePhone2 = useCallback((value, addressId) => {
    const newPhone = customerAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_Telefone02: value
    }: address)

    setCustomerAddress(newPhone)

  },[customerAddress]); // atualiza o  telefone 2

  
  const handleChangeLegalPersonName = useCallback((value, personId) => {
    const newName = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      nom_RepresentanteLegal: value
    }: person)

    setCustomerLegalPerson(newName)

  },[customerLegalPerson]); // atualiza o  Nome do representante legal


  const handleChangeLegalPersonCpf = useCallback((value, personId) => {
    const formatedValue = formatField(value, 'cpf')

    if(formatedValue === undefined) return;
    const newCpf = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      num_CpfRepresentante: formatedValue
    }: person)

  setCustomerLegalPerson(newCpf)

  },[customerLegalPerson]); // atualiza o  cpf do representante legal


  const handleChangeLegalPersonRg = useCallback((value, personId) => {

    const newRg = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      num_RGRepresentante: value
    }: person)

    setCustomerLegalPerson(newRg)

  },[customerLegalPerson]); // atualiza o  Rg do representante legal


  const handleChangeLegalPersonProf = useCallback((value, personId) => {
    const newProf = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      des_ProfissaoRepresentante: value
    }: person)

    setCustomerLegalPerson(newProf)

  },[customerLegalPerson]); // atualiza o  Profissão do representante legal


  const handleEndDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCustomerStartDate(event.target.value)
  },[]);


  const handleChangeLegalPersonECivil = useCallback((value, personId) => {

    const newECivil = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      tpo_EstadoCivilRepresentante: value
    }: person)

    setCustomerLegalPerson(newECivil)
  }, [customerLegalPerson]) // muda o estado civil do representante


  const handleChangeLegalPersonType = useCallback((value, personId) => {
    const newType = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      des_Qualificacao: value
    }: person)

    setCustomerLegalPerson(newType)
  }, [customerLegalPerson]) //  muda o tipo do representante


  const handleChangeLegalPersonEndCheck = useCallback((value, personId) => {
    const addressCheck = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
    ...person,
      flg_EnderecoRepresentado: !person.flg_EnderecoRepresentado
    }: person)

    setCustomerLegalPerson(addressCheck)
  }, [customerLegalPerson]) // marca a flag relacionada ao endereço do representante


  const handleOpenWhatsApp = useCallback((number) => {
    if (number === null) return;
    const message = 'Olá,'
    window.open(`https://web.whatsapp.com/send?phone=+55${number}&text=${message}`, '_blank')
  },[]); // inicia a conversa no whatsapp


  const handleValidateEmail = useCallback((email: string, typeEmail:string) => {
    if(email === '' || email === null) return true;
    let isEmailValid = true;

    if(email.includes(',')) {
      addToast({
        type: "info",
        title: "Não foi possível completar a operação",
        description: `Não é permitido usar virgula como separador de emails do ${typeEmail}, utilize como opção o ponto e virgula (;) \n`
      })

      isEmailValid = false;
    }

    if (isEmailValid)
    {
      const emailList = email.split(';');
      emailList.map((e: string) => {
        if(!e.includes('@') || !e.includes('.') || e === '') {
          addToast({
            type: "info",
            title: "Não foi possível completar a operação",
            description: `O formatado do endereço de email do ${typeEmail} digitado é invalido`
          })
          isEmailValid = false;
      }})
    }
    return isEmailValid;

  },[addToast]);


  const handleDeleteCustomer  = useCallback(async(customerId:number, confirmDelete:boolean) => {
    try {
      if(confirmDelete == false)
      {
        setCurrentCustomerId(customerId)
        setConfirmDeleteModal(true)
        return;
      }
      
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)

      await api.post('/Clientes/Apagar', {
        id: customerId,
        token
      })

      addToast({
        type: "success",
        title: "Cliente Deletado",
        description: "O cliente selecionado foi deletado do catálogo"
      })

      setIsDeleting(false)
      history.push('/customer/list')

      setCurrentCustomerId(0)
      setConfirmDeleteModal(false)
    }
    catch (err:any) {
      setIsDeleting(false)
      setConfirmDeleteModal(false)
      addToast({
        type: "info",
        title: "Falha ao apagar cliente",
        description:  err.response.data.Message
      })
    }
  },[addToast, history]);


  // handle changes in tabs
  const handleTabs = (tabActive: string, customerId: number) => {
    if (customerId === 0 || customerId == undefined){
      return;
    }

    setTabsControl({
      tab1: tabActive == 'customer',
      tab2: tabActive == 'matterList',
      tab3: tabActive == 'business',
      tab4: tabActive == 'documentList',
      activeTab: tabActive
    })

    if(tabActive == 'matterList'){
      ListMatterCustomer(customerId, 'initialize')
    }

    if(tabActive == 'documentList'){
      setIsLoading(true)
    }

    if(tabActive == 'business'){
      ListBusinessCustomer(customerId, 'initialize')
    }
  }

  // return tab active to realce color on tab
  const tabActive = (tab: string) => {

    if (tabsControl.activeTab === tab){
      return "buttonTabActive"
    }

    return "buttonTabInactive"
  }

  // pagination for load more customer
  const handleScroolSeeMore = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight

    if (isEndScrool && !isLoading) {
      setIsPagination(true)
    }
  }

  const handleGroupSelected = (item) => {

    if (item){
      setCustomerGroupValue(item.label)
      setCustomerGroupId(item.id)
    }else{
      setCustomerGroupValue('')
      LoadGroups('reset')
      setCustomerGroupId('')
    }
  }

  const handleSalesChannelSelected = (item) => {

    if (item){
      setCustomerSalesChannelId(item.id)
    }else{
      setCustomerSalesChannelId('')
      LoadSalesChannel()
    }
  }

  const handleCustomerStatus = (item) => {
    if (item){
      setCustomerStatus(item.id)
    }else{
      setCustomerStatus('')
    }
  }


  useEffect(() => {
    if (isCancelMessage && caller != "customerDelete"){
      setCustomerActiveModalDoubleCheck(false)
      handleCancelMessage(false)
    }
    
    if (isCancelMessage && caller == "customerDelete"){
      setConfirmDeleteModal(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage, caller])


  useEffect(() => {
    if (isConfirmMessage && customerActiveModalDoubleCheck && caller != "customerDelete"){
      handleSaveWithDoubleCheck()
      handleConfirmMessage(false)
    }

    if(isConfirmMessage && caller == "customerDelete")
    {
      handleDeleteCustomer(currentCustomerId, true)
      handleConfirmMessage(false)
    }
  }, [isConfirmMessage, caller])


  const handleNewBusiness = useCallback(async () => {

    if (!permissionCRM){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: `O seu plano atual permite a inclusão de apenas ${ businessTotal } negócios, faça um upgrade para obter acesso ilimitado a este serviço`,
      });

      return false;
    }

    const customerId = pathname.substr(15)

    if (customerId == undefined || customerId == null){

      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: "É necessário salvar o novo cliente para inserir um negócio vinculado a ele"
      });

      return;

    }
    try{
      localStorage.setItem('@GoJur:businessCustomerId', customerId.toString())
      history.push('../business/edit/0')
    }
    catch(ex){
      console.log(ex)
    }

  },[permissionCRM, pathname, addToast, businessTotal, history])

  const customerStatusList = [
    {
      id:'A',
      label: 'Ativo'
    },
    {
      id:'I',
      label: 'Inativo'
    }
  ]

  const handleDetailsCustomer = useCallback(async customerId => {
    try {

      setIsGeneratingReport(true)

      const token = localStorage.getItem('@GoJur:token');
      const response = await api.post('/Clientes/FichaDetalhada', {
        id: customerId,
        token,
      });
      setIdReportGenerate(response.data)

    } catch (err) {
      setIsGeneratingReport(false)
      console.log(err);
    }
  }, []);

  // when exists report id verify if is avalaliable every 2 seconds
  useEffect(() => {
    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval)
      }, 2000);
    }
  },[idReportGenerate])


  // Check is report is already
  const CheckReportPending = useCallback(async (checkInterval) => {
    if (isGeneratingReport){

      const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
        id: idReportGenerate,
        token: localStorage.getItem('@GoJur:token')
      })

      if (response.data == "F" && isGeneratingReport){

        clearInterval(checkInterval);
        setIsGeneratingReport(false)
        OpenReportAmazon()
      }
    }
  },[isGeneratingReport, idReportGenerate])


  // Open link with report
  const OpenReportAmazon = async() => {

    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    });

    setIdReportGenerate(0)
    window.open(`${response.data.des_Parametro}`, '_blank');
    setIsGeneratingReport(false)
    // handleCloseReportModal()
  }

  const handleValue = (event, value) => {
    event.preventDefault();
    setCustomerSalary(value)
  };

  return (
    <Container>

      {showSalesChannelModal && <SalesChannelEdit id={0} />}

      <Content onScroll={handleScroolSeeMore} ref={scrollRef}>

        <Tabs>

          {/* TABS - Customer | Matter List | Negocios | Upload Files */}
          <div>
            <button
              type='button'
              className={tabActive('customer')}
              onClick={() => handleTabs('customer', customer.cod_Cliente)}
            >
              <FaUserCircle />
              Cliente
            </button>

            <button
              type='button'
              style={{opacity:(customer.cod_Cliente == undefined? '0.5': '1')}}
              className={tabActive('matterList')}
              onClick={() => handleTabs('matterList', customer.cod_Cliente)}
            >
              <FaFolderOpen />
              Processos
            </button>

            {showSalesFunnelMenu && (
              <button
                type='button'
                style={{opacity:(customer.cod_Cliente == undefined? '0.5': '1')}}
                className={tabActive('business')}
                onClick={() => handleTabs('business', customer.cod_Cliente)}
              >
                <GiReceiveMoney />
                Negócios
              </button>
            )}

            <button
              type='button'
              className={tabActive('documentList')}
              style={{opacity:(customer.cod_Cliente == undefined? '0.5': '1')}}
              onClick={() => handleTabs('documentList', customer.cod_Cliente)}
            >
              <FaFilePdf />
              Anexar Documentos
            </button>

            <button
              type='button'
              style={{opacity:(customer.cod_Cliente == undefined? '0.5': '1'), border:'none'}}
              onClick={() => handleDetailsCustomer(customer.cod_Cliente)}
            >
              <FiFile />
              Ficha Detalhada
            </button>

            {checkpermissionDocument && (
              <button
                type='button'
                style={{opacity:(customer.cod_Cliente == undefined? '0.5': '1'), border:'none'}}
                onClick={() => {
                  handleOpenCustomerDocumentModal();
                  handleLoadInitialPropsFromDocument(customer.cod_Pessoa);
                }}
              >
                <RiNewspaperFill />
                Emitir Documento
              </button>
            )}

            <button
              type='button'
              style={{opacity:(customer.cod_Cliente == undefined? '0.5': '1'), border:'none'}}
              onClick={() => handleDeleteCustomer(customer.cod_Cliente, false)}
            >
              <FiTrash />
              Excluir
            </button>
            
            <button
              type='button'
              onClick={() => history.push('/customer/list')}
            >
              <RiCloseLine />
              Fechar
            </button>

          </div>

          {/* CUSTOMER TAB */}
          <Tab active={tabsControl.tab1}>

            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitCustomer)}>

              <section id="dados">

                <label htmlFor="name" className="required">
                  Nome *
                  <input
                    type="text"
                    value={customerName}
                    autoComplete="off"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </label>

                <label htmlFor="fantasia">
                  Nome fantasia
                  <input
                    type="text"
                    autoComplete="off"
                    value={customerFantasia}
                    name="nomeFantasia"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerFantasia(e.target.value)}
                    maxLength={100}
                  />
                </label>

                <label htmlFor="email">
                  Email
                  <input
                    type="text"
                    name="email"
                    autoComplete="off"
                    value={customerEmail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                    maxLength={500}
                  />
                </label>

                {customerSenha !== '' || customerActivePassword ? (
                  <>
                    <label htmlFor="senha">
                      Senha cliente
                      <input
                        type="text"
                        name="senha"
                        autoComplete="off"
                        value={customerSenha}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerSenha(e.target.value)}
                      />
                      <button className='removePassword' type="button" onClick={() => handleDeletePassword()}>
                        <FiTrash />
                        Apagar Senha
                      </button>
                    </label>
                  </>
              ) : (
                <label
                  htmlFor="senha"
                  style={{ display: 'flex', flexDirection: 'row' , alignItems: 'center', fontSize: '0.625rem'}}
                >
                  {/* <p id="password" onClick={() => setCustomerActivePassword(true)} style={{cursor:'pointer'}}> */}
                  <p className="buttonLinkClick" onClick={() => setCustomerActivePassword(true)}>
                    <FiLock />
                    Incluir senha para uso do cliente
                  </p>

                </label>
              )}

                <AutoCompleteSelect className="selectGroup">
                  <p>Grupo *</p>
                  <Select
                    isSearchable
                    value={customerGroup.filter(options => options.id == customerGroupId)}
                    onChange={handleGroupSelected}
                    onInputChange={(term) => setGroupSearchTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={customerGroup}
                  />
                </AutoCompleteSelect>

                <label htmlFor="referencia">
                  Referência
                  <input
                    type="text"
                    value={customerRef}
                    autoComplete="off"
                    name="referencia"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerRef(e.target.value)}
                    maxLength={100}
                  />
                </label>

                <AutoCompleteSelect className="selectStatus">
                  <p>Status</p>
                  <Select
                    isSearchable
                    value={customerStatusList.filter(options => options.id == customerStatus)}
                    onChange={handleCustomerStatus}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={customerStatusList}
                  />
                </AutoCompleteSelect>

                <AutoCompleteSelect className="selectSalesChannel">
                  <p>Canal de Vendas</p>
                  <Select
                    isSearchable
                    isClearable
                    value={salesChannelList.filter(options => options.id == customerSalesChannelId)}
                    onChange={handleSalesChannelSelected}
                    onInputChange={(term) => setSalesChannelSearchTerm(term)}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={salesChannelList}
                  />
                  {/* <FcAddDatabase title="Atalho para inclusão de um novo canal de vendas" onClick={handleIncludeSalesChannel} /> */}
                </AutoCompleteSelect>

                <label htmlFor="whats" id="whats">
                  <p>
                    WhatsApp
                    <FaWhatsapp
                      onClick={() => handleOpenWhatsApp(customerWhatsapp)}
                      style={{cursor:'pointer'}}
                    />
                    {customerWhatsapp !== '' && <p style={{ fontSize: '0.575rem', marginLeft: 8, color: 'grey'}}>Informe o número com DDD – Exemplo 11 99999-9999</p>}
                  </p>
                  <InputMask
                    type="text"
                    autoComplete="off"
                    name="whats"
                    placeholder="Sempre utilize DDD"
                    title="Formato esperado  11 99999-9999"
                    mask="tel"
                    value={customerWhatsapp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerWhatsapp(e.target.value)}
                  />
                </label>

                <label style={{marginLeft:'10px'}}>
                  <DatePicker
                    title="Data de Captação"
                    onChange={handleEndDate}
                    value={customerStartDate}
                  />
                </label>

              </section>

              <br />

              <label htmlFor="endereco" style={{marginTop:'-55px'}}>
                <p>Endereço(s)</p>
                {customerAddress.map(address => (

                  <section id="endereco" key={address.cod_Endereco}>

                    <label htmlFor="cep">
                      Cep
                      <input
                        type="text"
                        autoComplete="off"
                        value={address.num_CEP}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeCep(e.target.value,address.cod_Endereco)}
                        onBlur={() => handleLoadAddressFromCep(address.cod_Endereco ,'c')}
                      />
                    </label>

                    <label htmlFor="bairro">
                      Bairro
                      <input
                        type="text"
                        autoComplete="off"
                        value={address.des_Bairro}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDistrict(e.target.value, address.cod_Endereco)}
                        maxLength={50}
                      />
                    </label>

                    <label htmlFor="end">
                      Endereço
                      <input
                        type="text"
                        autoComplete="off"
                        value={address.des_Endereco}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddress(e.target.value, address.cod_Endereco)}
                        maxLength={50}
                      />
                    </label>

                    <label htmlFor="city">
                      Município
                      <Select
                        isSearchable
                        isClearable
                        value={{ id: address.cod_Municipio?.toString(), label: address.nom_Municipio }}
                        onInputChange={(term) => setCustomerCityValue(term)}
                        onChange={(item) => handleCityChangeAddress(item, address.cod_Endereco)}
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}
                        isLoading={isLoadingComboData}
                        styles={selectStyles}
                        options={customerCitys}
                      />
                    </label>

                    <label htmlFor="telefone" id="contact">
                      Telefone
                      <Select
                        isSearchable
                        id="contactSelect"
                        styles={selectStyles}
                        value={phoneTypes.filter(options => options.id === address.tpo_Telefone01)}
                        onChange={(item) => handleChangeTypePhone1(item?.id, address.cod_Endereco)}
                        options={phoneTypes}
                        placeholder="Selecione"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        value={address.num_Telefone01}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone1(e.target.value, address.cod_Endereco)}
                        maxLength={30}
                      />
                    </label>

                    <label htmlFor="telefone" id="contact">
                      Telefone
                      <Select
                        isSearchable
                        id="contactSelect"
                        styles={selectStyles}
                        value={phoneTypes.filter(options => options.id === address.tpo_Telefone02)}
                        onChange={(item) => handleChangeTypePhone2(item?.id, address.cod_Endereco)}
                        options={phoneTypes}
                        placeholder="Selecione"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        value={address.num_Telefone02}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone2(e.target.value, address.cod_Endereco)}
                        maxLength={30}
                      />
                    </label>


                    <div>
                      <button type="button" className='buttonLinkClick' onClick={() => handleDeleteAddress(address.cod_Endereco)}>
                        <FiTrash />
                        Apagar este endereço
                      </button>
                    </div>

                  </section>

                 ))}

              </label>

              <button type="button" className='buttonLinkClick' id="addEnd" onClick={handleNewAddress}>
                <FiPlus />
                Incluir outro endereço
              </button>

              <label htmlFor="qualify">
                <p>Qualificação</p>
                <section id="qualify">

                  {customerType === 'F' ? (
                    <>
                      <label htmlFor="cpf">
                        CPF/CNPJ
                        <Select
                          autoComplete="off"
                          value={personTypes.filter(options => options.id === customerType)}
                          onChange={(item) => setCustomerType(item? item.id: '')}
                          styles={selectStyles}
                          options={personTypes}
                        />
                      </label>

                      <label htmlFor="repre">
                        Representado
                        <input
                          type="text"
                          autoComplete="off"
                          value={customerRepresent}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerRepresent(e.target.value)}
                          maxLength={50}
                        />
                      </label>

                      <label htmlFor="doc">
                        N° Documento
                        <InputMask
                          mask="cpf"
                          value={customerNumDoc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNumDoc(e.target.value)}
                        />
                      </label>

                      <label htmlFor="sexo">
                        sexo
                        <Select
                          autoComplete="off"
                          isClearable
                          styles={selectStyles}
                          value={sexo.filter(options => options.id === customerSex)}
                          onChange={(item) => setCustomerSex(item? item.id: '')}
                          options={sexo}
                          placeholder="Selecione"
                        />
                      </label>

                      <label htmlFor="country">
                        Nacionalidade
                        <input
                          type="text"
                          autoComplete="off"
                          value={customerNacionalidade}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNacionalidade(e.target.value)}
                          maxLength={30}
                        />
                      </label>

                      <label htmlFor="nascimento">
                        Nascimento
                        <input
                          type="date"
                          autoComplete="off"
                          value={customerNasc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNasc(e.target.value)}
                        />
                      </label>

                      <label htmlFor="rg">
                        Rg
                        <input
                          type="text"
                          value={customerRg}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {setCustomerRg(e.target.value)}}
                        />
                      </label>

                      <label htmlFor="pis">
                        Pis
                        <input
                          type="text"
                          autoComplete="off"
                          value={customerPis}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerPis(e.target.value)}
                          maxLength={15}
                        />
                      </label>

                      <label htmlFor="civil">
                        Estado civil
                        <Select
                          autoComplete="off"
                          styles={selectStyles}
                          value={personSitu.filter(options => options.id === customerECivil)}
                          onChange={(item) => setCustomerECivil(item? item.id: '')}
                          options={personSitu}
                          placeholder="Selecione"
                        />
                      </label>

                      <label htmlFor="mae">
                        Mãe
                        <input
                          type="text"
                          value={customerMae}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerMae(e.target.value)}
                          maxLength={50}
                        />
                      </label>

                      <label htmlFor="profissao">
                        Profissão
                        <input
                          type="text"
                          value={customerProf}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerProf(e.target.value)}
                          maxLength={50}
                        />
                      </label>

                      <label htmlFor="pai">
                        Pai
                        <input
                          type="text"
                          value={customerPai}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerPai(e.target.value)}
                          maxLength={50}
                        />
                      </label>

                      <label htmlFor="inss">
                        Benefício INSS
                        <input
                          type="text"
                          autoComplete="off"
                          value={customerInss}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerInss(e.target.value)}
                          maxLength={15}
                        />
                      </label>

                      <label htmlFor="ctps">
                        CTPS
                        <input
                          type="text"
                          value={customerCtps}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerCtps(e.target.value)}
                          maxLength={50}
                        />
                      </label>

                      <label htmlFor="sctps">
                        Serie
                        <input
                          type="text"
                          value={customerSCtps}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerSCtps(e.target.value)}
                          maxLength={10}
                        />
                      </label>

                      <label htmlFor="sctps">
                        Último Salário
                        <IntlCurrencyInput
                          currency="BRL"
                          config={currencyConfig}
                          value={customerSalary}
                          className='inputField'
                          onChange={handleValue}
                        />
                      </label>
                    </>
                ) : (

                  <>
                    <label htmlFor="CNPJ">
                      CPF/CNPJ
                      <Select
                        autoComplete="off"
                        value={personTypes.filter(options => options.id === customerType)}
                        onChange={(item) => setCustomerType(item? item.id: '')}
                        styles={selectStyles}
                        options={personTypes}
                      />
                    </label>

                    <label htmlFor="repre">
                      Representado
                      <input
                        type="text"
                        value={customerRepresent}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerRepresent(e.target.value)}
                        maxLength={50}
                      />
                    </label>

                    {/* there is a bug who avoid put inputMask in this field
                    because there is two fields with the same type and state CPF and CNPJ */}
                    <label htmlFor="doc">
                      N° Documento
                      <input
                        type="text"
                        value={customerNumDoc}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = formatField(e.target.value, 'cnpj')
                          if(value !== undefined) {
                            setCustomerNumDoc(value)
                          }
                          }
                        }
                        maxLength={18}
                      />
                    </label>

                    <label htmlFor="nascimento">
                      Abertura
                      <input
                        type="date"
                        value={customerAbertura}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerAbertura(e.target.value)}
                      />
                    </label>

                    <label htmlFor="ie">
                      Insc. Estadual
                      <input
                        type="text"
                        value={customerIE}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerIE(e.target.value)}
                        maxLength={15}
                      />
                    </label>
                  </>
                )}

                </section>

              </label>

              <label htmlFor="representante">
                <p>Representante</p>

                {customerLegalPerson.map(legalPerson => (
                  <>
                    {legalPerson.action === 'update' && (
                    <section id="representante" key={legalPerson.cod_RepresentanteLegal}>
                      <label htmlFor="Nome">
                        Nome
                        <input
                          type="text"
                          value={legalPerson.nom_RepresentanteLegal}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLegalPersonName(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                          maxLength={50}
                          required
                        />
                      </label>

                      <label htmlFor="cpf">
                        Cpf
                        <input
                          type="text"
                          value={legalPerson.num_CpfRepresentante}
                          maxLength={14}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLegalPersonCpf(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                        />
                      </label>

                      <label htmlFor="rg">
                        RG
                        <input
                          type="text"
                          // maxLength={10}
                          value={legalPerson.num_RGRepresentante}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLegalPersonRg(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                        />
                      </label>

                      <label htmlFor="profissao">
                        Profissão
                        <input
                          type="text"
                          value={legalPerson.des_ProfissaoRepresentante}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLegalPersonProf(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                          maxLength={50}
                        />
                      </label>

                      <label htmlFor="civil">
                        Estado civil
                        <Select
                          autoComplete="off"
                          styles={selectStyles}
                          isClearable
                          value={personSitu.filter(options => options.id === legalPerson.tpo_EstadoCivilRepresentante)}
                          onChange={(item) => handleChangeLegalPersonECivil((item? item.id: ''), legalPerson.cod_PessoaRepresentanteLegal)}
                          options={personSitu}
                        />
                      </label>

                      <label htmlFor="civil">
                        Tipo
                        <Select
                          autoComplete="off"
                          isClearable
                          styles={selectStyles}
                          value={legalPersonType.filter(options => options.id === legalPerson.des_Qualificacao)}
                          onChange={(item) => handleChangeLegalPersonType((item? item.id: ''), legalPerson.cod_PessoaRepresentanteLegal)}
                          options={legalPersonType}
                        />
                      </label>

                      <div id="repre">
                        <label htmlFor="check">
                          {legalPerson.flg_EnderecoRepresentado ? (
                            <input
                              type="checkbox"
                              checked
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLegalPersonEndCheck(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                            />
                        ) : (
                          <input
                            type="checkbox"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLegalPersonEndCheck(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                          />
                      )}
                          O endereço do representante é o mesmo do cliente
                        </label>

                        {legalPerson.flg_EnderecoRepresentado ? (
                          <div>
                            <button className="buttonLinkClick" type="button" onClick={() => handleDeleteLegalPerson(legalPerson.cod_PessoaRepresentanteLegal)}>
                              <FiTrash />
                              Excluir representante
                            </button>
                          </div>
                    ): null}

                      </div>

                      {!legalPerson.flg_EnderecoRepresentado ? (
                        <>
                          <label htmlFor="cep">
                            Cep
                            <InputMask
                              mask="cep"
                              placeholder=""
                              value={legalPerson.num_CEPLegalPerson}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLPCep(e.target.value,legalPerson.cod_PessoaRepresentanteLegal)}
                              onBlur={() => handleLoadAddressFromCep(legalPerson.cod_PessoaRepresentanteLegal ,'lp')}
                            />
                          </label>

                          <label htmlFor="end">
                            Endereço
                            <input
                              type="text"
                              value={legalPerson.des_EnderecoLegalPerson}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLPAddress(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                              maxLength={50}
                            />
                          </label>

                          <label htmlFor="bairro">
                            Bairro
                            <input
                              type="text"
                              value={legalPerson.des_BairroLegalPerson}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLPDistrict(e.target.value, legalPerson.cod_PessoaRepresentanteLegal)}
                              maxLength={50}
                            />
                          </label>

                          <label htmlFor="city">
                            Município
                            <Select
                              isSearchable
                              isClearable
                              value={{ id: legalPerson.cod_MunicipioLegalPerson?.toString(), label: legalPerson.nom_MunicipioLegalPerson }}
                              onInputChange={(term) => setCustomerCityValue(term)}
                              onChange={(item) => handleSearchCitiesByTermLP(item, legalPerson.cod_PessoaRepresentanteLegal)}
                              placeholder="Selecione um município"
                              loadingMessage={loadingMessage}
                              noOptionsMessage={noOptionsMessage}
                              isLoading={isLoadingComboData}
                              styles={selectStyles}
                              options={customerCitysLP}
                              required
                            />
                          </label>

                          <div>
                            <button style={{float:'right', marginRight:'30px', marginTop:'35px'}} className="buttonLinkClick" type="button" onClick={() => handleDeleteLegalPerson(legalPerson.cod_PessoaRepresentanteLegal)}>
                              <FiTrash />
                              Excluir representante
                            </button>
                          </div>
                        </>

                  ): null}
                    </section>
                  )}
                  </>
                ))}
              </label>

              <button
                className="buttonLinkClick"
                onClick={handleNewLegalPerson}
                title="Adicionar um representante legal"
                type='button'
              >
                <FiPlus />
                Adicionar um representante legal
              </button>

              <label htmlFor="obs">
                <p>Observação/Entrevista</p>
                <section id="obs">
                  <textarea
                    value={customerObs}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCustomerObs(e.target.value)}
                  />

                </section>

              </label>

              <footer>

                <label htmlFor="mail">
                  <p>Faturamento por E-mail</p>

                  <input
                    type="text"
                    id="mail"
                    name="email"
                    value={customerEmailFinanAdd}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmailFinanAdd(e.target.value)}
                  />
                </label>

                {customerEmailFinanAdd !== '' ? (
                  <p style={{ textAlign: 'center' }}> Para inserir multiplos emails, separe-os por ";"</p>
                ): null}

                <div>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>

                  { pathname.substr(15) != '0' && (
                    <button className="buttonClick" type="button" onClick={() => handleDeleteCustomer(customer.cod_Cliente, false)}>
                      <FiTrash />
                      Excluir
                    </button>
                  )}

                  <button className="buttonClick" type="button" onClick={() => history.push('/customer/list')}>
                    <MdBlock />
                    Fechar
                  </button>

                </div>

              </footer>

            </Form>

          </Tab>

          {/* MATTER LIST TAB */}
          <Tab active={tabsControl.tab2}>

            <MatterListCards>

              {matterList.map(matter => (

                <CardMatter autoSizeCard={(isOpenCardBox && matterReferenceId === matter.matterId)}>

                  <MatterCard matterItem={matter} />

                </CardMatter>

              ))}

            </MatterListCards>

          </Tab>

          {/* BUSSINESS LIST TAB */}
          <Tab active={tabsControl.tab3}>

            <Search
              style={{width:'10rem', marginLeft:'1rem'}}
              icon={FiSearch}
              onChange={(e) => setSearchTermBusiness(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) {
                  e.preventDefault();
                }
                if (e.key == 'Enter'){
                  ListBusinessCustomer(customer.cod_Cliente, 'initialize')
                }
              }}
              handleRequest={() =>  ListBusinessCustomer(customer.cod_Cliente, 'initialize')}
              placeholder='Pesquisar oportunidades de negócio'
              name='search'
            >
              {isLoadingSearchTerm ? <Loader color="#f19000" size={8} /> : null}
            </Search>

            <div style={{float:'right', marginRight:'10px'}}>
              <button
                type="button"
                className="buttonLinkClick"
                title="Clique para incluir um novo negócio"
                onClick={() => handleNewBusiness()}
              >
                <FaFileAlt />
                Incluir novo Negócio
              </button>

            </div>

            <Clear />

            <ListCards>

              {businessList.map(business => (

                <Card>

                  <BussinessList item={business} />

                </Card>

              ))}
            </ListCards>

          </Tab>

          {/* UPLOAD FILE LIST TAB */}
          <Tab active={tabsControl.tab4}>

            <UploadList />

          </Tab>

        </Tabs>

        {/* message when there is no matter for current customer */}
        {(matterList.length == 0 && !isLoading && tabsControl.activeTab == "matterList") && (
          <div className='infoMessage'>
            <FaFolderOpen />
            {' '}
            Não existem processos para este cliente
          </div>
        )}

        {/* load progress when is open page */}
        {(matterList.length == 0 && isLoading && tabsControl.activeTab == "matterList") && (
          <div className='infoMessage'>
            <Loader size="0.5rem" color="var(--blue-twitter)" />
          </div>
        )}

        {/* message when there is no business for current customer */}
        {(businessList.length == 0 && !isLoading && tabsControl.activeTab == "business") && (
          <div className='infoMessage'>
            <GiReceiveMoney />
            {' '}
            {searchTermBusinnes.length == 0 && <span>Não existem negócios para este cliente</span> }
            {searchTermBusinnes.length > 0 && (
            <span>
              Nenhuma oportunidade de negócio foi encontrada com o termo
              {' '}
              {searchTermBusinnes}
            </span>
)}
          </div>
        )}

        {/* load progress when is open page */}
        {(businessList.length == 0 && isLoading && tabsControl.activeTab == "business") && (
          <div className='infoMessage'>
            <Loader size="0.5rem" color="var(--blue-twitter)" />
          </div>
        )}

      </Content>

      {confirmDeleteModal && (
        <ConfirmBoxModal
          title="Excluir Registro"
          caller="customerDelete"
          message="Confirma a exclusão deste cliente ?"
        />
      )}

      { customerActiveModalDoubleCheck && (
        <ConfirmBoxModal
          title="AVISO"
          message="Já existe um cliente com este NOME cadastrado no sistema. Está ciente disto ? ?"
        />
      )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Salvando...
          </div>
        </>
      )}

      {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Excluindo Cliente...
          </div>
        </>
      )}

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Gerando Ficha...
          </div>
        </>
      )}

      <DocumentModal />

    </Container>
  );
};

