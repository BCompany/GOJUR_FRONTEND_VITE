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
import { FaWhatsapp, FaUserCircle, FaFolderOpen, FaFilePdf } from 'react-icons/fa';
import { RiCloseLine, RiNewspaperFill } from 'react-icons/ri';
import { GiReceiveMoney } from 'react-icons/gi';
import { MdBlock } from 'react-icons/md';
import { formatField, selectStyles, useDelay, currencyConfig} from 'Shared/utils/commonFunctions';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import { Clear, Tab, Tabs } from 'Shared/styles/Tabs';
import api from 'services/api';
import { useMatter } from 'context/matter';
import Select from 'react-select'
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useModal } from 'context/modal';
import { useDocument } from 'context/document';
import DocumentModal from 'components/Modals/CustomerModal/DocumentModal';
import { useCustomer } from 'context/customer';
import { Card, Container, Content, Form, ListCards, CardMatter, MatterListCards} from './styles';
import { IWorkflowTriggers} from '../Interfaces/IWorkflowEdit';
import { workflowTriggerTypes } from 'Shared/utils/commonListValues';



export default function Workflow() {

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
  const [workflowTrigger , setWorkflowTrigger] = useState<IWorkflowTriggers[]>([]); // objeto de endereço que compoe o cliente
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
      //alert(response.data.enderecolist.length);
      setCustomer(response.data)
      setCustomerName(response.data.nom_Pessoa)
      setCustomerFantasia(response.data.nom_PessoaFantasia)
      setCustomerEmail(response.data.des_Email)
      setCustomerSenha(response.data.cod_Senha)
      setCustomerRef(response.data.cod_Referencia)
      setCustomerWhatsapp(response.data.num_WhatsApp)

      if(response.data.enderecolist.length < 1) {
        const id = Math.random()

        const newAddress: IWorkflowTriggers = {
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

        setWorkflowTrigger(oldState => [...oldState, newAddress])

      }
      else{
        setWorkflowTrigger(response.data.enderecolist)
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


  const handleSubmitWorkflow = useCallback(async() => {
    const abertura = `${customerAbertura}T00:00:00`;
    const nascimento = `${customerNasc}T00:00:00`;
    const token = localStorage.getItem('@GoJur:token');

    setisSaving(true)

    if (Number(customerSalary) < 0){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: "O campo Último Salário não aceita valor negativo"
      })

      setisSaving(false)
      return;
    }

    const triggerList = workflowTrigger.map(i => {
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
      const response = await api.put('/Workflow/Salvar', {
        token,
        apiKey,
        workflowId: customer.cod_Pessoa ? customer.cod_Pessoa : 0, // cod Workflow
        name: customerName, // nome do Workflow
        companyId, // Cod Empresa   
        triggers: triggerList // Listagem de gatilhos
      })

      addToast({
        type: "success",
        title: "Workflow salvo",
        description: customer.cod_Pessoa ? "As alterações feitas no workflow foram salvas" : "Workflow adicionado"
      })

      // response.data = cod_Pessoa
      localStorage.setItem('@GoJur:NC', response.data.cod_Pessoa)

      setisSaving(false)
      setisSaving(false)

      history.push('/workflow/list')

    } catch (err: any) {

      // eslint-disable-next-line no-alert
      if(err.response.data.statusCode !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar workflow",
          description:  err.response.data.Message
        })
      }

      if(err.response.data.statusCode === 1011) {
       setCustomerActiveModalDoubleCheck(true)
      }

      setisSaving(false)
      localStorage.removeItem('@GoJur:businessCustomerId')
    }

  },[customerAbertura, customerNasc, workflowTrigger, customerLegalPerson, customer.cod_Pessoa, customer.tpo_Telefone01, customer.num_Telefone01, customer.tpo_Telefone02, customer.num_Telefone02, customer.cod_PessoaFisica, customer.cod_Cliente, customer.cod_PessoaJuridica, customer.cod_SistemaUsuarioEmpresa, customer.doubleCheck, customer.cod_Empresa, customerName, customerFantasia, customerEmail, customerSenha, customerGroupId, customerGroupValue, customerNacionalidade, customerType, customerNumDoc, customerWhatsapp, customerRg, customerSex, customerECivil, customerProf, customerCtps, customerSCtps, customerInss, customerPis, customerPai, customerMae, customerRepresent, customerObs, customerIE, customerEmailFinanAdd, customerRef, customerSalesChannelId, customerStatus, customerStartDate, customerSalary, addToast, history]);


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
        addressDTOList: workflowTrigger, // listagem de endereço
        CheckEndereco: workflowTrigger.length,
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

  },[addToast, customer.cod_Cliente, customer.cod_Pessoa, customer.cod_PessoaFisica, customer.cod_PessoaJuridica, customer.cod_SistemaUsuarioEmpresa, customer.num_Telefone01, customer.num_Telefone02, customer.tpo_Telefone01, customer.tpo_Telefone02, customerAbertura, workflowTrigger, customerCtps, customerECivil, customerEmail, customerEmailFinanAdd, customerFantasia, customerGroupId, customerGroupValue, customerIE, customerInss, customerLegalPerson, customerMae, customerNacionalidade, customerName, customerNasc, customerNumDoc, customerObs, customerPai, customerPis, customerProf, customerRef, customerRepresent, customerRg, customerSCtps, customerSalary, customerSenha, customerSex, customerType, customerWhatsapp, history]);


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
      const updateCity = workflowTrigger.map(city => city.cod_Endereco === addressId ? {
        ...city,
        nom_Municipio: item.label,
        cod_Municipio: Number(item.id)
      }: city)

      setWorkflowTrigger(updateCity)
    }
    else{
      // clean item when was clear from select
      const updateCity = workflowTrigger.map(city => city.cod_Endereco === addressId ? {
        ...city,
        nom_Municipio: '',
        cod_Municipio: 0
      }: city)

      setWorkflowTrigger(updateCity)
    }
  }


  const handleNewAddress = useCallback(() => {
 
    const id = Math.random()
    const newAddress: IWorkflowTriggers = {
      workflowTriggerId: id,
      companyId,
      workflowId: 0,
      triggerType: '',
      configuration: { label: "" }
    }

    setWorkflowTrigger(oldAddress => [...oldAddress, newAddress])
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
      const address = workflowTrigger.filter(item => item.cod_Endereco !== addressId);
      if(address.length >=1) {
        setWorkflowTrigger(address)
      }else{
        addToast({
          type:"info",
          title: "Operação invalida",
          description: "Só é possivel excluir quando há mais de um gatilho cadastrado"
        })
      }
  },[addToast, workflowTrigger]); // remove um endereço da interface


  const handleChangeCep = useCallback((value, addressId) => {
      const formatedValue = formatField(value, 'cep')
      const cep = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
        ...address,
        num_CEP: formatedValue
      }: address)

      setWorkflowTrigger(cep)
      setChangeCEPCustomer(true)
  },[workflowTrigger]); // atualiza o cep


  const handleLoadAddressFromCep = useCallback(async(addressId , type: 'c' | 'lp') => {

    if(type === 'c' && changeCEPCustomer == false)
    {
      return;
    }

    if(type === 'lp' && changeCEPLP == false)
    {
      return;
    }
   
    const cepC = workflowTrigger.filter(address => address.cod_Endereco === addressId).map(i => i.num_CEP).toString()
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
        const addressLoad = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
          ...address,
          des_Bairro: response.data.Bairro,
          des_Endereco: response.data.Logradouro,
          cod_Municipio: Number(response.data.Localidade_Cod),
          nom_Municipio: response.data.Localidade,
          cod_MunicipioIBGE: response.data.IBGE,
        } : address)

        setWorkflowTrigger(addressLoad)
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

  },[addToast, workflowTrigger, customerLegalPerson, changeCEPCustomer, changeCEPLP]);


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
      const district = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
        ...address,
        des_Bairro: value
      }: address)

      setWorkflowTrigger(district)
  },[workflowTrigger]); // atualiza o bairro


  const handleChangeLPDistrict = useCallback((value, personId) => {
      const district = customerLegalPerson.map(address => address.cod_PessoaRepresentanteLegal === personId ? {
        ...address,
        des_BairroLegalPerson: value
      }: address)

      setCustomerLegalPerson(district)
  },[customerLegalPerson]); // atualiza o bairro do representante legal


  const handleChangeAddress = useCallback((value, addressId) => {
      const newAddress = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
        ...address,
        des_Endereco: value
      }: address)

      setWorkflowTrigger(newAddress)
  },[workflowTrigger]); // atualiza o endereço


  const handleChangeLPAddress = useCallback((value, personId) => {
      const newAddress = customerLegalPerson.map(address => address.cod_PessoaRepresentanteLegal === personId ? {
        ...address,
        des_EnderecoLegalPerson: value
      }: address)

      setCustomerLegalPerson(newAddress)
  },[customerLegalPerson]); // atualiza o endereço do representante legal


  const handleChangeTypePhone1 = useCallback((value, triggerId) => {

    const newTypePhone = workflowTrigger.map(trigger => trigger.workflowTriggerId=== triggerId ? {
      ...trigger,
      triggerType: value
    }: trigger)

    setWorkflowTrigger(newTypePhone)

  },[workflowTrigger]); // atualiza o tipo de telefone 1


  const handleChangeTypePhone2 = useCallback((value, addressId) => {
    const newTypePhone = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
      ...address,
      tpo_Telefone02: value
    }: address)

    setWorkflowTrigger(newTypePhone)

  },[workflowTrigger]); // atualiza o tipo de telefone 2


  const handleChangePhone1 = useCallback((value, addressId) => {

    console.log(value)
    const newPhone = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_Telefone01: value
    }: address)

    setWorkflowTrigger(newPhone)

  },[workflowTrigger]); // atualiza o  telefone 1


  const handleChangePhone2 = useCallback((value, addressId) => {
    const newPhone = workflowTrigger.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_Telefone02: value
    }: address)

    setWorkflowTrigger(newPhone)

  },[workflowTrigger]); // atualiza o  telefone 2

  
  const handleChangeLegalPersonName = useCallback((value, personId) => {
    const newName = customerLegalPerson.map(person => person.cod_PessoaRepresentanteLegal === personId ? {
      ...person,
      nom_RepresentanteLegal: value
    }: person)

    setCustomerLegalPerson(newName)

  },[customerLegalPerson]); // atualiza o  Nome do representante legal

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
              onClick={() => history.push('/workflow/list')}
            >
              <RiCloseLine />
              Fechar
            </button>

          </div>

          {/* CUSTOMER TAB */}
          <Tab active={tabsControl.tab1}>

            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitWorkflow)}>

              <section id="dados">

                <label htmlFor="name" className="required">
                  Nome Workflow*
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

              </section>

              <br /><br /><br /> <br />

              <label htmlFor="endereco" style={{marginTop:'-55px'}}>
                <p>Gatilho(s)</p>
                {workflowTrigger.map(trigger => (

                  <section id="endereco" key={trigger.workflowTriggerId}>

                   
                    <label htmlFor="telefone" id="contact">
                     
                      <Select
                        isSearchable
                        id="contactSelect"
                        styles={selectStyles}
                        //value={workflowTriggerTypes.filter(options => options.id === trigger.triggerType)}
                        onChange={(item) => handleChangeTypePhone1(item?.id, trigger.workflowTriggerId)}
                        options={workflowTriggerTypes}
                        placeholder="Selecione"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        value={trigger.configuration.label}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone1(e.target.value, trigger.workflowTriggerId)}
                        maxLength={30}
                      />
                    </label>

                    <div>
                      <button type="button" className='buttonLinkClick' onClick={() => handleDeleteAddress(trigger.workflowTriggerId)}>
                        <FiTrash />
                        Apagar este gatilho
                      </button>
                    </div>

                  </section>

                 ))}

              </label>

              <button type="button" className='buttonLinkClick' id="addEnd" onClick={handleNewAddress}>
                <FiPlus />
                Incluir outro gatilho
              </button>


              <footer>

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


        </Tabs>

   
      </Content>

        

    </Container>
  );
};

