/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
import React, {ChangeEvent, useCallback, useEffect , useRef, useState, UIEvent} from 'react'
import {useHistory, useLocation  } from 'react-router-dom'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form';
import { FiArrowLeft,  FiLock,  FiPlus, FiSave, FiTrash } from 'react-icons/fi';
import { FaWhatsapp,FaUserCircle, FaFilePdf, FaFolderOpen, FaWindowClose, FaSearchPlus } from 'react-icons/fa';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { BsCheckBox } from 'react-icons/bs';
import { TiCancel } from 'react-icons/ti';
import { Tab, Tabs } from 'Shared/styles/Tabs';
import api from 'services/api';
import { Container, Content, Form, CheckModal, ListMatter, MatterCard } from './styles';

interface CustomerAddress {
  cod_Endereco: number | undefined;
  cod_PessoaEndereco: number | undefined;
  des_Endereco: string;
  des_Bairro: string
  cod_Municipio: number | undefined;
  nom_Municipio: string | undefined;
  num_CEP: string | undefined;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  flg_Correspondencia: boolean;
  cod_MunicipioIBGE: string;
}

interface CustomerLegalPerson {
  action: any;
  cod_Empresa: number;
  cod_EnderecoLegalPerson: number;
  cod_MunicipioLegalPerson: number;
  cod_PessoaEnderecoLegalPerson: number;
  cod_PessoaFisicaRepresentanteLegal: number;
  cod_PessoaRepresentado: any;
  cod_PessoaRepresentanteLegal: number;
  cod_RepresentanteLegal: number;
  des_BairroLegalPerson: string;
  des_EnderecoLegalPerson: string;
  des_ProfissaoRepresentante: string;
  des_Qualificacao: string;
  flg_EnderecoRepresentado: boolean;
  nom_MunicipioLegalPerson: string;
  nom_RepresentanteLegal: string;
  num_CEPLegalPerson: string;
  num_CpfRepresentante: string;
  num_RGRepresentante: string;
  tpo_EstadoCivilRepresentante: string;
}

interface DocumentListData {
  description: string;
}

interface MatterData {
  page: number|0;
  autoSizeCard: boolean|false;
  courtFollow: null;
  currentCourt: string;
  currentCourtDept: string;
  currentInstance: string;
  customerList: any;
  dateFinalization: string;
  dateInsert: string;
  dateLastUpdate: Date;
  dateRelease: string;
  decision: string;
  desLastFollow: null;
  forumName: null;
  hasEvent: boolean;
  instanceList: any;
  judicialAction: string;
  judicialNature: string;
  lawyerList: any;
  markers: string;
  matterCustomerDesc: string;
  matterFolder: string;
  matterId: number;
  matterNumber: string;
  matterNumberCNJ: null;
  matterOppossingDesc: string;
  opossingList: any;
  orderList: any;
  privacity: string;
  probabilyExito: string;
  processualStage: string;
  rito: string;
  status: string;
  thirdyList: any;
  title: null;
  userIncludeUpdate: null;
  followList:FollowsData[]
}

interface FollowsData {
  date: string;
  description: string;
  forumName: string;
  id: string;
  numIntance: number;
  typeFollow: string;
  typeFollowDescription: string;
  userEditName: string;
  userIncludeName: string;
}

interface CustomerGroup {
  id: string;
  value: string;
}
interface CustomerData {
  cod_Empresa: number;
  cod_Pessoa: number;
  nom_Pessoa: string;
  nom_PessoaFantasia: string;
  des_Email: string;
  cod_Senha: string;
  cod_GrupoCliente: string;
  des_GrupoCliente: string;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  des_Nacionalidade: string;
  tpo_Pessoa: string;
  num_CPFCNPJ: string;
  num_WhatsApp: string;
  enderecolist: CustomerAddress[];
  CheckEndereco: number;
  cod_PessoaFisica: number;
  num_RG: string;
  tpo_Sexo: string;
  tpo_EstadoCivil: string;
  dta_Nascimento: string;
  des_Profissao: string;
  num_CTPS: string;
  num_SerieCTPS: string;
  num_BeneficioINSS: string;
  num_PIS: string;
  nom_Pai: string;
  nom_Mae: string;
  cod_Cliente: number;
  nom_Responsavel: string;
  des_Observacao: string;
  cod_PessoaJuridica: number;
  num_IE: string;
  dta_Abertura: string | Date;
  cod_SistemaUsuarioEmpresa: number;
  doubleCheck: boolean;
  des_EmailFaturamento: string;
  cod_Referencia: string;
  legalPerson: CustomerLegalPerson[];
  CheckLegalPerson: number;
}
interface DefaultsProps {
  id: string;
  value: string;
}

interface cepProps {
CEP: string;
Logradouro: string;
Bairro: string;
Localidade: string;
UF: string;
Complemento: string;
IBGE: string;
Localidade_Cod: string;
UF_Cod: string;
Status: string;
}

interface TabsControl{
  tab1: boolean;
  tab2: boolean;
  activeTab: string;
}

export default function User() {
 
  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { handleUserPermission } = useDefaultSettings();
  const { addToast } = useToast();
  const { pathname  } = useLocation();
  const { handleSubmit} = useForm<CustomerData>();
  const [isLoading , setIsLoading] = useState(true); // objecto todo de do cliente
  const [isPagination , setIsPagination] = useState(false); // objecto todo de do cliente
  const [isEndPage, setIsEndPage] = useState(false);
  const [customer , setCustomer] = useState({} as CustomerData); // objecto todo de do cliente
  const [customerAddress , setCustomerAddress] = useState<CustomerAddress[]>([]); // objeto de endereço que compoe o cliente
  const [customerLegalPerson , setCustomerLegalPerson] = useState<CustomerLegalPerson[]>([]); // objeto de representante que compoe o cliente
  const [customerName , setCustomerName] = useState(''); // field nome
  const [customerFantasia , setCustomerFantasia] = useState(''); // field nome fantasia
  const [customerEmail , setCustomerEmail] = useState(''); // field e-mail
  const [customerSenha , setCustomerSenha] = useState(''); // field senha
  const [customerRef , setCustomerRef] = useState(''); // field Referencia
  const [customerWhatsapp , setCustomerWhatsapp] = useState(''); // field whatsapp
  const [customerGroupValue , setCustomerGroupValue] = useState(''); // group field value
  const [customerGroupId , setCustomerGroupId] = useState(''); // group field id
  const [customerType , setCustomerType] = useState('F'); //  field type
  const [customerRepresent , setCustomerRepresent] = useState(''); //  field Representado
  const [customerNumDoc , setCustomerNumDoc] = useState(''); //  field num doc
  const [customerSex , setCustomerSex] = useState('F'); //  field Sexo
  const [customerNacionalidade , setCustomerNacionalidade] = useState(''); //  field nacionalidade
  const [customerNasc , setCustomerNasc] = useState(''); //  field Nascimento
  const [customerAbertura , setCustomerAbertura] = useState(''); //  field Abertura
  const [customerRg , setCustomerRg] = useState(''); //  field Rg
  const [customerPis , setCustomerPis] = useState(''); //  field Pis
  const [customerECivil , setCustomerECivil] = useState('C'); //  field estado civil
  const [customerMae , setCustomerMae] = useState(''); //  field mae
  const [customerProf , setCustomerProf] = useState(''); //  field profissao
  const [customerPai , setCustomerPai] = useState(''); //  field pai
  const [customerInss , setCustomerInss] = useState(''); //  field Inss
  const [customerCtps , setCustomerCtps] = useState(''); //  field Ctps
  const [customerSCtps , setCustomerSCtps] = useState(''); //  field Serie Ctps
  const [customerIE , setCustomerIE] = useState(''); //  field numero insc estadual
  const [customerObs , setCustomerObs] = useState(''); //  field observação
  const [customerEmailFinanAdd , setCustomerEmailFinanAdd] = useState<string>(''); //  field email de faturamento add
  const [customerCityValue , setCustomerCityValue] = useState(''); //  field city
  const [customerActiveModalDoubleCheck , setCustomerActiveModalDoubleCheck] = useState(false); //  modal double check
  const [matterList , setMatterList] = useState<MatterData[]>([]); 
  const [hasMatter, setHasMatter] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  
  const [tabsControl, setTabsControl] = useState<TabsControl>({
    tab1: true, 
    tab2: false,     
    activeTab: 'user'
  });
  
  const tokenapi = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');

  useEffect(() => {
    async function handleDefaultProps() {
      try {
  
        const response = await api.post<DefaultsProps[]>('/Defaults/Listar', {
          token: tokenapi,
        });
        
        const userprops = response.data[4].value.split('|');
  
        handleUserPermission(userprops);

      } catch (err) {
        console.log(err);
      }
    }

    handleDefaultProps()
  
  },[handleUserPermission]) // render default props 
  
  useEffect(() => {
    if (isPagination) {
      ListMatterByCustomer(customer.cod_Cliente, '')
    }
  },[isPagination])

  useEffect(() => {
    async function SelectedCustomerById() {
    
      let id = pathname.substr(10)
      let hasFilterSaved = false;
      const filterStorage = localStorage.getItem('@GoJur:CustomerFilter')

      // verify if exists filter saved
      if (id == ''){ 
        if (filterStorage == null) { 
          return false;
        }
        // if exists filter exists associate to specific variables and rebuild page
        const filterJSON = JSON.parse(filterStorage)
        id = filterJSON.customerId;   
        hasFilterSaved = true;
      }

      try {
        const usertoken = localStorage.getItem('@GoJur:token');

        const response = await api.post<CustomerData>('/Usuario/Editar', {
          id: Number(id),
          token: usertoken
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
          const newAddress: CustomerAddress = {
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

        }else{
          setCustomerAddress(response.data.enderecolist)
        }

        setCustomerGroupValue(response.data.des_GrupoCliente)
        setCustomerGroupId(response.data.cod_GrupoCliente)
        setCustomerType(response.data.tpo_Pessoa)
        setCustomerRepresent(response.data.nom_Responsavel)
        setCustomerNumDoc(response.data.num_CPFCNPJ)
        setCustomerSex(response.data.tpo_Sexo)
        setCustomerNacionalidade(response.data.des_Nacionalidade)
        setCustomerNasc(format(new Date(response.data.dta_Nascimento), 'yyyy-MM-dd'))
        setCustomerRg(response.data.num_RG)
        setCustomerPis(response.data.num_PIS)
        setCustomerECivil(response.data.tpo_EstadoCivil)
        setCustomerMae(response.data.nom_Mae)
        setCustomerProf(response.data.des_Profissao)
        setCustomerPai(response.data.nom_Pai)
        setCustomerInss(response.data.num_BeneficioINSS)
        setCustomerCtps(response.data.num_CTPS)
        setCustomerSCtps(response.data.num_SerieCTPS)
        setCustomerAbertura(format(new Date(response.data.dta_Abertura), 'yyyy-MM-dd'))
        setCustomerIE(response.data.num_IE)
        const legalPerson = response.data.legalPerson.map(person => person && {
          ...person,
          action: 'update'
        })
        setCustomerLegalPerson(legalPerson)
        setCustomerObs(response.data.des_Observacao)
        setCustomerEmailFinanAdd(response.data.des_EmailFaturamento)
        setIsLoading(false)

        if (hasFilterSaved){
          handleTabs('matterList', Number(id))
        }
          
        } catch (err) {
          setIsLoading(false)
          history.push('/customerList')
          console.log(err)
        } 
    }

    // if has id on parameter string or filter saved on locastorage try to load select customer
    const filterJSON = localStorage.getItem('@GoJur:CustomerFilter');
    if(pathname.length > 10 || filterJSON != null) {
      SelectedCustomerById()
    }else
    {
      const id = Math.random()
      const newAddress: CustomerAddress = {
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
  
      setCustomerAddress(oldAddress => [...oldAddress, newAddress])
    }
  },[pathname]) // carrega os dados do cliente

  useEffect(() => {
    
    async function LoadGroups() {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
  
        const response = await api.post<CustomerGroup[]>('/Clientes/ListarGrupoClientes', {
          filterClause: '',
          token: tokenapi,
        });

      } catch (err) {
        console.log(err);
      }
    }
    LoadGroups()
  },[]) // load groups on first render

  useEffect(() => {
    async function LoadCitys() {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
  
        const response = await api.post('/Cidades/ListarCidades', {
          filterClause: customerCityValue,
          token: tokenapi,
        });
      } catch (err) {
        console.log(err);
      }
    }
    LoadCitys()
  },[customerCityValue]) // load default citys on first render

  const handleSubmitCustomer = useCallback(async() => {
    const abertura = `${customerAbertura}T00:00:00`;
    const nascimento = `${customerNasc}T00:00:00`;
    const token = localStorage.getItem('@GoJur:token');

    let emailValidation = true;

    // email customer validation
    emailValidation = handleValidateEmail(customerEmail, 'cliente');
    if (!emailValidation){
      return;
    }
    
    // email financial validation
    emailValidation = handleValidateEmail(customerEmailFinanAdd, 'financeiro');
    if (!emailValidation){
      return;
    }

    const addresList = customerAddress.map(i => {
      const list = {
        ...i,
      cod_Endereco: 0
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
      
      await api.post('/Clientes/Salvar', {
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
        des_EmailFaturamento: customerEmailFinanAdd,  
        cod_Referencia: customerRef,
        legalPersonDTOList: legalPersonList,
        CheckLegalPerson: customerLegalPerson.length,
      })

      addToast({
        type: "success",
        title: "Cliente salvo",
        description: customer.cod_Pessoa ? "As alterações feitas no cliente foram salvas" : "Cliente adicionado ao catálogo"
      })

      const codCli = customer.cod_Pessoa ? customer.cod_Pessoa : 0;
      if(codCli === 0) {
        localStorage.setItem('@GoJur:NC', customerName)
      }

      history.push('/customerList')
      
    } catch (err: any) {
      if(err.response.data.statusCode !== 1011) {
        addToast({
          type: "error",
          title: "Falha ao cadastrar cliente",
          description:  err.response.data.Message
        })
      }
      
      if(err.response.data.statusCode === 1011) {
       setCustomerActiveModalDoubleCheck(true)
      }
    }

    },[customerAbertura, customerNasc, customerAddress, customerLegalPerson, customer.cod_Pessoa, customer.tpo_Telefone01, customer.num_Telefone01, customer.tpo_Telefone02, customer.num_Telefone02, customer.cod_PessoaFisica, customer.cod_Cliente, customer.cod_PessoaJuridica, customer.cod_SistemaUsuarioEmpresa, customer.doubleCheck, customer.cod_Empresa, customerName, customerFantasia, customerEmail, customerSenha, customerGroupId, customerGroupValue, customerNacionalidade, customerType, customerNumDoc, customerWhatsapp, customerRg, customerSex, customerECivil, customerProf, customerCtps, customerSCtps, customerInss, customerPis, customerPai, customerMae, customerRepresent, customerObs, customerIE, customerEmailFinanAdd, customerRef, addToast, history]);

  
  const handleSaveWithDoubleCheck = useCallback(async() => {
    const abertura = `${customerAbertura}T00:00:00`;
    const nascimento = `${customerNasc}T00:00:00`;
    const token = localStorage.getItem('@GoJur:token');


    try {
      
      await api.post('/Clientes/Salvar', {
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
        des_EmailFaturamento: customerEmailFinanAdd,  
        cod_Referencia: customerRef,
        legalPersonDTOList: customerLegalPerson,  
        CheckLegalPerson: customerLegalPerson.length,
      })

      addToast({
        type: "success",
        title: "Cliente salvo",
        description: customer.cod_Pessoa ? "As alterações feitas no cliente foram salvas" : "Cliente adicionado ao catálogo"
      })

      const codCli = customer.cod_Pessoa ? customer.cod_Pessoa : 0;
      if(codCli === 0) {
        localStorage.setItem('@GoJur:NC', customerName)
      }

      history.push('/customerList')
      
    } catch (err: any) {
      addToast({
        type: "error",
        title: "Falha ao cadastrar cliente",
        description: err.response.data.Message
      })

      if(err.response.data.statusCode === 1011) {
       setCustomerActiveModalDoubleCheck(true)
      }
    }

    },[addToast, customer.cod_Cliente, customer.cod_Pessoa, customer.cod_PessoaFisica, customer.cod_PessoaJuridica, customer.cod_SistemaUsuarioEmpresa, customer.num_Telefone01, customer.num_Telefone02, customer.tpo_Telefone01, customer.tpo_Telefone02, customerAbertura, customerAddress, customerCtps, customerECivil, customerEmail, customerEmailFinanAdd, customerFantasia, customerGroupId, customerGroupValue, customerIE, customerInss, customerLegalPerson, customerMae, customerNacionalidade, customerName, customerNasc, customerNumDoc, customerObs, customerPai, customerPis, customerProf, customerRef, customerRepresent, customerRg, customerSCtps, customerSenha, customerSex, customerType, customerWhatsapp, history]);

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

        // handle changes in tabs
        const handleTabs = (tabActive: string, customerId: number) => {
          setTabsControl({
            tab1: tabActive == 'user',      // set tab1 as selected
            tab2: tabActive == 'time',    // set tab2 as selected
            activeTab: tabActive  // set active tab number
          })    

          if(tabActive == 'time'){
            // carregar os dados do time
            // alert('carrgar o time')
            setMatterList([])
            setIsPagination(false)
            ListMatterByCustomer(customerId, 'initialize')
          }
        }

      const ListMatterByCustomer = async (customerId: Number, tabState: String  = '') => {

        setIsLoading(true)
        const currentPage = tabState === 'initialize'? 1: page;

        try   
        {
          const response = await api.post<MatterData[]>('/Processo/Listar', {
            filterClause: `#CID${customerId.toString()}`, // use key #CID to filter by customerId
            page:currentPage,
            rows: 10,
            token: tokenapi,
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
              setIsEndPage(true)
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

  return (
    <Container>
      
      <Content>

        <header>
          <button type="button" onClick={() => history.push('/customerList')}>
            <FiArrowLeft />
          </button>
        </header>

        <Tabs>

          {/* BUTTONS */}
          <div>
            <button 
              className={(tabsControl.activeTab == 'customer'? 'buttonTabActive': 'buttonTabInactive')} 
              type='button' 
              onClick={() => handleTabs('user', customer.cod_Cliente)}
            >
              <FaUserCircle />
              Usuários
            </button>

            <button 
              className={(tabsControl.activeTab == 'matterList'? 'buttonTabActive': 'buttonTabInactive')} 
              type='button' 
              onClick={() => handleTabs('time', customer.cod_Cliente)}
            >
              <FaFolderOpen />
              Equipe              
            </button>
              
          </div>

          <Tab active={tabsControl.tab1}>

            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitCustomer)}> 
              <section id="dados">
                <label htmlFor="name" className="required">
                  Nome
                  <input 
                    type="text" 
                    value={customerName}  
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)} 
                    required
                  />
                </label>
                <br />

                <label htmlFor="email">
                  Email (login)
                  <input 
                    type="text"
                    name="email"
                    value={customerEmail}
                    // onBlur={() => handleValidateEmail(customerEmail)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                  />
                </label>
                <br />

                <label htmlFor="senha">
                  Senha
                  <input 
                    type="text"
                    name="senha"
                    value={customerSenha}
                  // onBlur={() => handleValidateEmail(customerEmail)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerSenha(e.target.value)}
                  />
                </label>
                <br />            

                <label htmlFor="type" id="contact">
                  Tipo
                  <select 
                    name="typeTel" 
                    id="typeTel" 
                  >
                    <option value="A">Administrador</option>
                    <option value="S">Sistema</option>
                  </select>
                </label>
                <br />            

                <label htmlFor="type" id="contact">
                  Ativo
                </label>
                <br />            
                <br />            
                <label htmlFor="type" id="contact">
                  Árvore...
                </label>
                <br />            
                <br />            
                <br />            
                <br />            
              </section>
            </Form>

          </Tab>

          <Tab active={tabsControl.tab2}>

            <div>
              <button
                type="button"
                className="ButtonLinkClick"
                id="include"
                onClick={() => history.push('/user')}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;Incluir nova equipe
              </button>
            </div>

            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitCustomer)}> 
              <section id="dados">
                <label htmlFor="name" className="required">
                  Equipes
                  <br />            
                  <br />            
                  <input 
                    type="text" 
                    value="Equipe 1"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)} 
                    required
                  />
                  <br />            
                  <input 
                    type="text" 
                    value="Equipe 2"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)} 
                    required
                  />
                  <br />            
                  <input 
                    type="text" 
                    value="Equipe 3"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)} 
                    required
                  />
                  <br />            
                  <br />            
                  <br />            
                </label>
              </section>
            </Form>
            
          </Tab>
          
        </Tabs>
     
      </Content>

    </Container>
  );
};