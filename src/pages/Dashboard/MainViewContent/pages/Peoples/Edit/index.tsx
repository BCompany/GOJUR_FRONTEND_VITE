/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { format } from 'date-fns'
import { HeaderPage } from 'components/HeaderPage';
import { FiPlus, FiTrash, FiSave } from 'react-icons/fi';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { MdBlock } from 'react-icons/md';
import { Tabs } from 'Shared/styles/Tabs';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { personSitu, personTypes, phoneTypes, sexo } from 'Shared/utils/commonListValues';
import { formatField, selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import Select from 'react-select'
import InputMask from 'components/InputMask';
import {useHistory, useLocation  } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Container, Content, Form, Flags, FormMobile} from './styles';

  export interface IPeoplesAddress {
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

  export interface IThirdPartyGroupData{
    id: string;
    value: string;
  }

  export interface ISelectData {
    id: string;
    label: string;
  }

  export interface IFederalUnitData{
    federalUnitId: string;
    federalUnitName: string;
  }

  export interface ICepProps {
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

  export interface DefaultsProps {
    id: string;
    value: string;
  }

  export interface IPeoplesData{
    cod_Pessoa:string;
    nom_Pessoa: string;
    des_Email: string;
    num_Telefone01: string;
    tpo_Telefone01: string;
    num_Telefone02: string;
    tpo_Telefone02: string;
    des_GrupoTerceiro: string;
    cod_Advogado: number;
    cod_Terceiro: number;
    cod_Funcionario: number;
    cod_Contrario: number;
    num_OAB: string;
    cod_UnidadeFederal: string;
    flg_Escritorio: boolean;
    cod_GrupoTerceiro: string;
    enderecolist: IPeoplesAddress[];
    tpo_Pessoa: string;
    num_CPFCNPJ: string;
    tpo_Sexo: string;
    des_Nacionalidade: string;
    dta_Nascimento: string;
    dta_Captacao:string;
    num_RG: string;
    tpo_EstadoCivil: string;
    des_Profissao: string;
    dta_Abertura: string | Date;
    num_IE: string;
    cod_PessoaFisica: string;
    cod_PessoaJuridica: string;
    cod_SistemaUsuarioEmpresa: number;
    type: string;
    count: number;
    tpo_StatusValidacao: string;
    dta_Inclusao: string;
    tpo_Inscricao: string;
    flg_StatusPesquisaOAB: string;
  }

Modal.setAppElement('#root');

const PeopleEdit: React.FC = () => {
  
  const formRef = useRef<HTMLFormElement>(null);
  const { handleUserPermission } = useDefaultSettings();
  const { addToast } = useToast();
  const { handleSubmit} = useForm<IPeoplesData>();
  const { pathname } = useLocation();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const history = useHistory();
  const [token] = useState(localStorage.getItem('@GoJur:token'));
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isLoading , setIsLoading] = useState(true);
  const [people, setPeople] = useState({} as IPeoplesData); // objecto todo de do cliente
  const [peoplesCitys , setPeoplesCitys] = useState<ISelectData[]>([]); // count field for address block
  const [peoplesAddress , setPeoplesAddress] = useState<IPeoplesAddress[]>([]); // objeto de endereço que compoe a pessoa
  const [peoplesCityValue , setPeoplesCityValue] = useState(''); //  field city
  const [peopleId, setPeopleId] = useState(""); // cod_Pessoa
  const [peopleName, setPeopleName] = useState<string>("");
  const [peopleEmail, setPeopleEmail] = useState<string>("");
  const [peoplesType , setPeoplesType] = useState('F'); //  field type
  const [peoplesSex , setPeoplesSex] = useState('M'); //  field Sexo
  const [peoplesNacionalidade , setPeoplesNacionalidade] = useState(''); //  field nacionalidade
  const [peoplesNasc , setPeoplesNasc] = useState(''); //  field Nascimento
  const [peoplesRg , setPeoplesRg] = useState(''); //  field Rg
  const [peoplesECivil , setPeoplesECivil] = useState('C'); //  field estado civil
  const [peoplesProf , setPeoplesProf] = useState(''); //  field profissao
  const [peoplesNumDoc , setPeoplesNumDoc] = useState(''); //  field num doc
  const [peoplesAbertura , setPeoplesAbertura] = useState(''); //  field Abertura
  const [peoplesIE , setPeoplesIE] = useState(''); //  field numero insc estadual
  const [peoplesCitysDefault , setPeoplesCitysDefault] = useState<ISelectData[]>([]); // count field for address block
  const [peopleType, setPeopleType] = useState<string>('0'); // Type of people  - Lawyer, OpposingParty, ThirdParty or Employee
  const [thirdPartyGroup, setThirdParyGroup] = useState<ISelectData[]>([]); // If the person is ThirdParty
  const [thirdPartyGroupId, setThirdPartyGroupId] = useState(''); // If the person is ThirdParty
  const [thirdPartyGroupValue, setThirdPartyGroupValue] = useState(''); // If the person is ThirdParty
  const [thirdPartyGroupTerm, setThirdPartyGroupTerm] = useState('');  // If the person is ThirdParty
  const [federalUnit, setFederalUnit] = useState<ISelectData[]>([]); // if the person is Lawyer
  const [federalUnitId, setFederalUnitId] = useState(''); // if the person is Lawyer
  const [federalUnitValue, setFederalUnitValue] = useState(''); // if the person is Lawyer
  const [federalUnitTerm, setFederalUnitTerm] = useState(''); // if the person is Lawyer
  const [lawyerOAB, setLawyerOAB] = useState<string>(""); // if the person is Lawyer
  const [flgOffice , setFlgOffice] = useState(false); // if the person is Lawyer

  const [validacaoStatus, setValidacaoStatus] = useState<string>(""); // if the person is Lawyer
  const [includeDate, setIncludeDate] = useState<string>(""); // if the person is Lawyer
  const [lawyerType, setLawyerType] = useState<string>(""); // if the person is Lawyer
  const [searchStatus, setSearchStatus] = useState<string>(""); // if the person is Lawyer

  const [peoplesStartDate, setPeoplesStartDate] = useState<string>('')
  const [checkSelectPeopleType, setCheckSelectPeopleType] = useState<boolean>(false);
  const { isMOBILE } = useDevice();
  const [lawyer, setLawyer] = useState(false);
  const [opposing, setOpposing] = useState(false);
  const [employee, setEmployee] = useState(false);
  const [thirdParty, setThirdParty] = useState(false);
  const id = pathname.substr(15)
  const type = pathname.slice(13,14)


  useEffect(() => {
    const accessCode = localStorage.getItem('@GoJur:accessCode')

    if (accessCode == "adm")
    {
      setLawyer(true)
      setOpposing(true)
      setEmployee(true)
      setThirdParty(true)
    }
    else
    {
      if (accessCode?.toString().includes("CFGLAW"))
      {
        setLawyer(true)
      }
      if (accessCode?.toString().includes("CFGOPP"))
      {
        setOpposing(true)
      }
      if (accessCode?.toString().includes("CFGEMP"))
      {
        setEmployee(true)
      }
      if (accessCode?.toString().includes("CFGTHIRD"))
      {
        setThirdParty(true)
      }
    }
  },[])


  useEffect(() => {
    if (Number(id && type) === 0){
      handleNewAddress();
    }
  }, [])
  

  // Call default parameters by company 
  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission]); 


  useEffect(() => {
    LoadThirdPartyGroup();
    LoadFederalUnit();
  },[thirdPartyGroupId, thirdPartyGroupValue, federalUnitId, federalUnitValue])


  useEffect(() => {
    const id = pathname.substr(15)
    if ( id != '0'){
      LoadPeople()
    } 
  }, [])


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

  useDelay(() => {
    async function LoadCities() {

      if (peoplesCityValue.length == 0 && !isLoading) {
        setPeoplesCitys(peoplesCitysDefault)
        return;
      }

      setIsLoadingComboData(true)

      try {
        const response = await api.post('/Cidades/ListarCidades', {
          filterClause: peoplesCityValue,
          token,
        });

        const listCities: ISelectData[] = [];

        response.data.map((item) => {
          // fill object to match with react-select
          listCities.push({ id: item.id, label: item.value })

          return listCities;
        })

        setPeoplesCitys(listCities)
        setIsLoadingComboData(false)

        if (peoplesCityValue.length == 0) {
          setPeoplesCitysDefault(listCities)
        }
      } catch (err) {
        console.log(err);
      }
    }

    LoadCities()
  }, [peoplesCityValue], 1000)


  const handleChangeCep = useCallback((value, addressId) => {
    const formatedValue = formatField(value, 'cep')
    const cep = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_CEP: formatedValue
    }: address)

    setPeoplesAddress(cep)
  },[peoplesAddress]); // atualiza o cep


  const handleLoadAddressFromCep = useCallback(async(addressId , type: 'c') => {
    const cepC = peoplesAddress.filter(address => address.cod_Endereco === addressId).map(i => i.num_CEP).toString()
    try {
      const token = localStorage.getItem('@GoJur:token');

      const response = await api.post<ICepProps>('/Cidades/ListarPorCep', {
        cep:cepC,
        token,
      });

      const peoplesStatus = response.data.Status;

      if(peoplesStatus !== 'OK') {
        addToast({type: "info", title: "Cep invalido", description: "O CEP digitado não foi encontrado , tente novamente com outro cep"})
        return;
      }

      if(type === 'c') {
        const addressLoad = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
          ...address,
          des_Bairro: response.data.Bairro,
          des_Endereco: response.data.Logradouro,
          cod_Municipio: Number(response.data.Localidade_Cod),
          nom_Municipio: response.data.Localidade,
          cod_MunicipioIBGE: response.data.IBGE,       
        } : address)

        setPeoplesAddress(addressLoad)
      }
    } catch (err) {
      console.log(err);
    }
  },[addToast, peoplesAddress]);


  const handleChangeDistrict = useCallback((value, addressId) => {
    const district = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
        ...address,
        des_Bairro: value
    }: address)

    setPeoplesAddress(district)
  },[peoplesAddress]); // atualiza o bairro

    
  const handleChangeAddress = useCallback((value, addressId) => {
  const newAddress = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      des_Endereco: value
  }: address)

  setPeoplesAddress(newAddress)
  },[peoplesAddress]); // atualiza o endereço


  const handleCityChangeAddress = (item: any, addressId: number | undefined) => {
    if (item){
      // update item selected
      const updateCity = peoplesAddress.map(city => city.cod_Endereco === addressId ? {
        ...city,
        nom_Municipio: item.label,
        cod_Municipio: Number(item.id)
      }: city)
          
      setPeoplesAddress(updateCity)
    }
    else{
      // clean item when was clear from select 
      const updateCity = peoplesAddress.map(city => city.cod_Endereco === addressId ? {
        ...city,
        nom_Municipio: '',
        cod_Municipio: 0
      }: city)

      setPeoplesAddress(updateCity)
    }
  }


  const handleChangeTypePhone1 = useCallback((value, addressId) => {
    const newTypePhone = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
        ...address,
        tpo_Telefone01: value
    }: address)

    setPeoplesAddress(newTypePhone)
  },[peoplesAddress]); // atualiza o tipo de telefone 1


  const handleChangeTypePhone2 = useCallback((value, addressId) => {
    const newTypePhone = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      tpo_Telefone02: value
    }: address)

    setPeoplesAddress(newTypePhone)
  },[peoplesAddress]); // atualiza o tipo de telefone 2


  const handleChangePhone1 = useCallback((value, addressId) => {
    const newPhone = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_Telefone01: value
    }: address)

    setPeoplesAddress(newPhone)
  },[peoplesAddress]); // atualiza o  telefone 1


  const handleChangePhone2 = useCallback((value, addressId) => {
    const newPhone = peoplesAddress.map(address => address.cod_Endereco === addressId ? {
      ...address,
      num_Telefone02: value
    }: address)

    setPeoplesAddress(newPhone)
  },[peoplesAddress]); // atualiza o  telefone 2


  const handleDeleteAddress = useCallback((addressId) => {
    const address = peoplesAddress.filter(item => item.cod_Endereco !== addressId);
    if(address.length >=1)
      setPeoplesAddress(address)
    else
      addToast({type:"info", title: "Operação invalida", description: "Só é possivel excluir quando há mais de um endereço cadastrado"})
  },[addToast, peoplesAddress]); // remove um endereço da interface


  const handleNewAddress = useCallback(() => {
    const id = Math.random()
    const newAddress: IPeoplesAddress = {
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

    setPeoplesAddress(oldAddress => [...oldAddress, newAddress])
  },[]); // adiciona um novo endereço na interface


  const LoadThirdPartyGroup = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? thirdPartyGroupValue:thirdPartyGroupTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IThirdPartyGroupData[]>('/GrupoTerceiros/ListarPorDescrição', {
        params:{
          rows: 50,
          filterClause: filter, 
          token,
        }
      });

      const listThirdPartyGroup: ISelectData[] = []

      response.data.map(item => {
        return listThirdPartyGroup.push({
          id: item.id,
          label: item.value
        })
      })
      
      setThirdParyGroup(listThirdPartyGroup)
      setIsLoadingComboData(false)
    } catch (err) {
      console.log(err);
    }
  }

  // REPORT FIELDS - GET API DATA
  const LoadFederalUnit = async (stateValue?: string) => {
    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? federalUnitValue:federalUnitTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IFederalUnitData[]>('/Forum/ListarEstados', {
        params:{
          token
        }
      });

      const listFederalUnit: ISelectData[] = []

      response.data.map(item => {
        return listFederalUnit.push({
          id: item.federalUnitId,
          label: item.federalUnitName
        })
      })
      
      setFederalUnit(listFederalUnit)
      setIsLoadingComboData(false)
    } catch (err) {
      console.log(err);
    }
  }

  // REPORT FIELDS - CHANGE
  const handleFederalUnitSelected = (item) => { 
    if (item)
    {
      setFederalUnitValue(item.value)
      setFederalUnitId(item.id)
    }
    else
    {
      setFederalUnitValue('')
      LoadFederalUnit('reset')
      setFederalUnitId('')
    }
  }

  // REPORT FIELDS - CHANGE
  const handleThirdPartyGroupSelected = (item) => { 
    if (item)
    {
      setThirdPartyGroupValue(item.value)
      setThirdPartyGroupId(item.id)
    }
    else
    {
      setThirdPartyGroupValue('')
      LoadThirdPartyGroup('reset')
      setThirdPartyGroupId('')
    }
  }


  const LoadPeople = async() => {
    try {
      const id = pathname.substr(15)
      const type = pathname.slice(13,14)

      if (type == '0')
        return;

      const response = await api.post<IPeoplesData>('/Pessoas/Editar', { id, type, token });
      
      if (type != "")
        setCheckSelectPeopleType(true)

      setPeopleType(type)
      setFederalUnitValue(response.data.cod_UnidadeFederal)
      setThirdPartyGroupValue(response.data.nom_Pessoa)
      setPeopleId(response.data.cod_Pessoa)
      setPeopleName(response.data.nom_Pessoa)
      setPeopleEmail(response.data.des_Email)
      setFederalUnitId(response.data.cod_UnidadeFederal)
      setLawyerOAB(response.data.num_OAB)
      setFlgOffice(response.data.flg_Escritorio)
      setThirdPartyGroupId(response.data.cod_GrupoTerceiro)
      setValidacaoStatus(response.data.tpo_StatusValidacao)
      setIncludeDate(response.data.dta_Inclusao)
      setLawyerType(response.data.tpo_Inscricao)
      setSearchStatus(response.data.flg_StatusPesquisaOAB)

      if(response.data.enderecolist.length < 1)
      {
        const id = Math.random()
        const newAddress: IPeoplesAddress = {
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

        setPeoplesAddress(oldState => [...oldState, newAddress])
      }
      else
      {
        setPeoplesAddress(response.data.enderecolist)
      }

      setPeoplesType(response.data.tpo_Pessoa != null? response.data.tpo_Pessoa: 'F')
      setPeoplesNumDoc(response.data.num_CPFCNPJ)
      setPeoplesSex(response.data.tpo_Sexo != null ? response.data.tpo_Sexo : 'M' )
      setPeoplesNacionalidade(response.data.des_Nacionalidade)

      if (response.data.dta_Nascimento != null)
        setPeoplesNasc(format(new Date(response.data.dta_Nascimento), 'yyyy-MM-dd'))

      if (response.data.dta_Captacao != null)
        setPeoplesStartDate(format(new Date(response.data.dta_Captacao), 'yyyy-MM-dd'))

      setPeoplesRg(response.data.num_RG)
      setPeoplesECivil(response.data.tpo_EstadoCivil != null ? response.data.tpo_EstadoCivil : 'C')
      setPeoplesProf(response.data.des_Profissao)

      if (response.data.dta_Abertura != null)
        setPeoplesAbertura(format(new Date(response.data.dta_Abertura), 'yyyy-MM-dd'))

      setPeoplesIE(response.data.num_IE)
    } catch (err) {
      console.log(err);
    }
  }


  const handleResetStates = () => { 
    setCheckSelectPeopleType(true)
    setPeopleType("")
    setPeopleName("")
    setPeopleEmail("")
    setFederalUnitId("")
    setLawyerOAB("")
    setFlgOffice(false)
    setThirdPartyGroupId("")
    setPeoplesAddress([])
    setPeoplesNumDoc("")
    setPeoplesSex("")
    setPeoplesNacionalidade("")
    setPeoplesNasc("")
    setPeoplesRg("")
    setPeoplesStartDate("")
    setPeoplesECivil("")
    setPeoplesProf("")
    setPeoplesAbertura("")
    setPeoplesIE("")
    setPeoplesCitys([])
    setPeoplesAddress([])
    setPeoplesCityValue("")
    setPeoplesType("")
    setPeoplesCitysDefault([])
    setThirdParyGroup([])
    setThirdPartyGroupId("")
    setThirdPartyGroupValue("")
    setFederalUnit([])
    setFederalUnitId("")
    setFederalUnitValue("")
  }


  const handleClose = () => { 
    handleResetStates();
    history.push(`/People`)
  }


  const handleSubmitPeople = useCallback(async() => {
    try {
      if (isSaving) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Já existe uma operação em andamento`})
        return;
      }
      
      if (peopleType == '0')
      {
        addToast({type: "info", title: "Escolher tipo de pessoa", description: "É necessario escolher tipo de pessoa."})
        return;
      }

      if (peoplesType == "F" && (peoplesECivil == null || peoplesECivil == ""))
      {
        addToast({type: "info", title: "Escolher estado civil", description: "É necessario escolher o estado civil."})
        return;
      }

      if (peopleType === "A" && (federalUnitValue === "" || federalUnitValue === null || federalUnitValue == "0")){
        addToast({type: "info", title: "Escolher UF", description: "Favor selecionar uma Unidade Federativa."})
        return;
      }

      if (peopleType === "T" && thirdPartyGroupValue === ""){
        addToast({type: "info", title: "Escolher Grupo de Terceiro", description: "Favor selecionar um grupo de terceiro."})
        return;
      }
      
      const id = pathname.substr(15)
      const type = pathname.slice(13,14)
      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)

      const response = await api.post('/Pessoas/Salvar', {
        cod_Contrario: id,
        cod_Advogado: id,
        cod_Terceiro: id,
        cod_Funcionario: id,
        cod_Pessoa: peopleId,
        nom_Pessoa: peopleName, // nome cliente
        des_Email: peopleEmail, // email cliente
        cod_GrupoTerceiro: thirdPartyGroupId, // if a thirdParty
        des_GrupoCliente: thirdPartyGroupValue, // if a thirdParty
        num_OAB: lawyerOAB, // if a lawyer
        tpo_StatusValidacao:validacaoStatus, // if a lawyer
        dta_Inclusao:includeDate, // if a lawyer
        tpo_Inscricao:lawyerType, // if a lawyer
        flg_StatusPesquisaOAB: searchStatus, // if a lawyer
        flg_Escritorio: flgOffice, // if a lawyer
        cod_UnidadeFederal:  federalUnitId, // if a lawyer
        type: peopleType, // if a people is a lawyer, thirdparty , opposingparty or employee
        tpo_Telefone01: people.tpo_Telefone01,
        num_Telefone01: people.num_Telefone01,
        tpo_Telefone02: people.tpo_Telefone02,
        num_Telefone02: people.num_Telefone02,
        des_Nacionalidade: peoplesNacionalidade, // nacionalidade
        tpo_Pessoa: peoplesType, // tipo pessoal fisica ou juridica
        num_CPFCNPJ: peoplesNumDoc, // num documento
        enderecolist: peoplesAddress, // listagem de endereço
        CheckEndereco: peoplesAddress.length,
        cod_PessoaFisica: people.cod_PessoaFisica,
        num_RG: peoplesRg, // rg
        tpo_Sexo: peoplesSex, // sexo
        tpo_EstadoCivil: peoplesECivil, // estado civil
        dta_Nascimento: peoplesNasc, // nascimento
        des_Profissao: peoplesProf, // profissão          
        cod_PessoaJuridica: people.cod_PessoaJuridica,  
        num_IE: peoplesIE,
        dta_Abertura:  peoplesAbertura,        
        cod_SistemaUsuarioEmpresa: people.cod_SistemaUsuarioEmpresa,
        token,
      })

      localStorage.setItem('@GoJur:NP', response.data.cod_Pessoa)
 
      addToast({type: "success", title: "Pessoa salva", description: "A pessoa foi adicionada no sistema."})

      handleResetStates()
      handleClose()
    }
    catch (err:any)
    {
      setisSaving(false)
      addToast({type: "error", title: "Falha ao salvar pessoa.", description:  err.response.data.Message})
    }
  }, [people.cod_Advogado, people.cod_Contrario, people.cod_Funcionario, people.cod_Terceiro, people.cod_Pessoa, people.cod_PessoaJuridica, people.cod_PessoaJuridica, people.cod_SistemaUsuarioEmpresa, people.num_Telefone01, people.num_Telefone02, people.tpo_Telefone01, people.tpo_Telefone02, peopleName, peopleEmail, thirdPartyGroupId, thirdPartyGroupValue, lawyerOAB, flgOffice, federalUnitId, peopleType, peoplesNacionalidade, peoplesType, peoplesNumDoc, peoplesAddress, peoplesRg, peoplesSex, peoplesECivil, peoplesNasc, peoplesProf, peoplesIE, peoplesAbertura, peopleId, isSaving, validacaoStatus, includeDate, lawyerType, searchStatus]);
  

  return (
    <Container>
      <HeaderPage />

      <label htmlFor="type" style={{fontSize: '14px'}}>
        Tipo Pessoa:
        <select
          id='typePeople'
          required
          style={{marginLeft:'10px', marginTop:'0px', width:"15%"}}
          name="classType"
          value={peopleType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setPeopleType(e.target.value)}
          disabled={checkSelectPeopleType}
        >
          <option disabled selected value="0">Selecione...</option>
          {lawyer && (<option value="A">Advogado</option>)}
          {opposing && (<option value="C">Contrário</option>)}
          {employee && (<option value="F">Funcionário</option>)}
          {thirdParty && (<option value="T">Terceiro</option>)}
        </select>
      </label>
      <br /><br />
      
      <Content>
        <Tabs>
          {!isMOBILE &&(
            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitPeople)}> 
              <section id="dados">
                {peopleType === "A" && (
                  <>
                    <label htmlFor="nameC" className="required">
                      Nome 
                      <input
                        maxLength={50}
                        style={{width: "150%"}}  
                        type="text" 
                        value={peopleName}  
                        autoComplete="off"
                        name="NomeC"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPeopleName(e.target.value)} 
                        required
                      />
                    </label>

                    <div style={{marginTop: '25px'}}>
                      <div style={{float:'left', marginLeft: '51%', width: '90px'}}>
                        <Flags>
                          Escritório:
                        </Flags>
                      </div>

                      <div style={{float:'left', marginTop:'3px', width: '10px'}}>
                        <input
                          type="checkbox"
                          name="select"
                          checked={flgOffice}
                          onChange={() => setFlgOffice(!flgOffice)}
                          style={{minWidth:'15px', minHeight:'15px'}}
                        />
                      </div>
                    </div>
                  </>
                )}

                {peopleType != "A" && (
                  <>
                    <label htmlFor="nameC" className="required">
                      Nome 
                      <input
                        maxLength={100}
                        style={{width: "202%"}}  
                        type="text" 
                        value={peopleName}  
                        autoComplete="off"
                        name="NomeC"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPeopleName(e.target.value)} 
                        required
                      />
                    </label>
                    <br />
                  </>
                )}

                <label htmlFor="emailC">
                  Email
                  <input 
                    type="text"
                    maxLength={500}
                    name="EmailC"
                    autoComplete="off"
                    value={peopleEmail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPeopleEmail(e.target.value)}
                  />
                </label> 

                {peopleType === "A" && (
                  <>
                    <div style={{display:'flex'}}>
                      <label htmlFor="oabAdvo" style={{width:"52%"}}>
                        <p>OAB</p>
                        <input
                          style={{width:"100%",height:"69%"}}
                          type="text"
                          maxLength={30}
                          name="oabAdvogado"
                          autoComplete="off"
                          value={lawyerOAB}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setLawyerOAB(e.target.value)}
                        />
                      </label> 

                      <AutoCompleteSelect className="selectFederalUnit">
                        <p style={{marginTop:"-2%",fontSize:"13px"}}>UF</p>  
                        <Select        
                          isSearchable   
                          value={federalUnit.filter(options => options.id == federalUnitId)}
                          onChange={handleFederalUnitSelected}
                          onInputChange={(term) => setFederalUnitTerm(term)}
                          isClearable
                          placeholder=""
                          isLoading={isLoadingComboData}
                          loadingMessage={loadingMessage}
                          noOptionsMessage={noOptionsMessage}
                          styles={selectStyles}              
                          options={federalUnit}
                          required
                        />
                      </AutoCompleteSelect>

                    </div>              
                  </>
                )}

                {peopleType === "T" && (
                  <>
                    <AutoCompleteSelect className="selectThirdGroupParty">
                      <p>Grupo</p>  
                      <Select
                        isSearchable  
                        style={{width:'100px'}} 
                        value={thirdPartyGroup.filter(options => options.id == thirdPartyGroupId)}
                        onChange={handleThirdPartyGroupSelected}
                        onInputChange={(term) => setThirdPartyGroupTerm(term)}
                        isClearable
                        placeholder=""
                        isLoading={isLoadingComboData}
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}
                        styles={selectStyles}              
                        options={thirdPartyGroup}
                      />
                    </AutoCompleteSelect>
                  </>
                )}
              </section>
              <br />

              <label htmlFor="endereco">
                <p>Endereço(s)</p>
                {peoplesAddress.map(address => (
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
                        maxLength={50}
                        autoComplete="off"
                        value={address.des_Bairro}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDistrict(e.target.value, address.cod_Endereco)}
                      />
                    </label>

                    <label htmlFor="end">
                      Endereço
                      <input 
                        type="text"
                        maxLength={50}
                        autoComplete="off"
                        value={address.des_Endereco}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddress(e.target.value, address.cod_Endereco)}
                      />
                    </label>
                              
                    <label htmlFor="city">
                      Município
                      <Select
                        isSearchable   
                        isClearable                        
                        value={{ id: address.cod_Municipio?.toString(), label: address.nom_Municipio }}
                        onInputChange={(term) => setPeoplesCityValue(term)}
                        onChange={(item) => handleCityChangeAddress(item, address.cod_Endereco)}                                                  
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}      
                        isLoading={isLoadingComboData}
                        styles={selectStyles}          
                        options={peoplesCitys}
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
                      />
                      <input 
                        type="text"
                        maxLength={30}
                        autoComplete="off"
                        value={address.num_Telefone01}                        
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone1(e.target.value, address.cod_Endereco)}
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
                      />
                      <input 
                        type="text"
                        maxLength={30}
                        autoComplete="off"
                        value={address.num_Telefone02}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone2(e.target.value, address.cod_Endereco)}
                      />
                    </label> 

                    <div>&nbsp;</div>
              
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
              <br /><br />

              <label htmlFor="qualify">
                <p>Qualificação</p>
                <section id="qualify">
                  {peoplesType === 'F' ? (
                    <>
                      <label htmlFor="cpf">
                        CPF/CNPJ
                        <Select
                          autoComplete="off"
                          value={personTypes.filter(options => options.id === peoplesType)}
                          onChange={(item) => setPeoplesType(item? item.id: '')}
                          styles={selectStyles}
                          options={personTypes}
                        />
                      </label>

                      <label htmlFor="doc">
                        N° Documento
                        <InputMask
                          style={{height: '40px'}}
                          mask="cpf"
                          value={peoplesNumDoc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesNumDoc(e.target.value)}
                        />
                      </label> 

                      <label htmlFor="sexo">
                        Sexo
                        <Select
                          autoComplete="off"
                          isClearable
                          styles={selectStyles}
                          value={sexo.filter(options => options.id === peoplesSex)}
                          onChange={(item) => setPeoplesSex(item? item.id: '')}
                          options={sexo}
                        />
                      </label> 

                      <label htmlFor="country">
                        Nacionalidade
                        <input 
                          type="text"
                          maxLength={30}
                          autoComplete="off"
                          value={peoplesNacionalidade}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesNacionalidade(e.target.value)}
                        />
                      </label>

                      <label htmlFor="nascimento">
                        Nascimento
                        <input 
                          type="date"
                          autoComplete="off"
                          value={peoplesNasc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesNasc(e.target.value)}
                        />
                      </label>

                      <label htmlFor="rg">
                        Rg
                        <input 
                          type="text"
                          maxLength={50}
                          value={peoplesRg}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {setPeoplesRg(e.target.value)}}
                        />
                      </label>

                      <label htmlFor="civil">
                        Estado civil
                        <Select
                          autoComplete="off"
                          styles={selectStyles}
                          value={personSitu.filter(options => options.id === peoplesECivil)}
                          onChange={(item) => setPeoplesECivil(item? item.id: '')}
                          options={personSitu}
                        />
                      </label> 
                  
                      <label htmlFor="profissao">
                        Profissão
                        <input 
                          type="text"
                          maxLength={50}
                          value={peoplesProf}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesProf(e.target.value)}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="CNPJ">
                        CPF/CNPJ
                        <Select
                          autoComplete="off"
                          value={personTypes.filter(options => options.id === peoplesType)}
                          onChange={(item) => setPeoplesType(item? item.id: '')}
                          styles={selectStyles}
                          options={personTypes}
                        />
                      </label> 

                      {/* there is a bug who avoid put inputMask in this field
                      because there is two fields with the same type and state CPF and CNPJ */}
                      <label htmlFor="doc">
                        N° Documento
                        <input 
                          type="text"
                          value={peoplesNumDoc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = formatField(e.target.value, 'cnpj')
                            if(value !== undefined)
                            {
                              setPeoplesNumDoc(value)
                            }
                          }}
                          maxLength={18}
                        />
                      </label>

                      <label htmlFor="nascimento">
                        Abertura
                        <input 
                          type="date"
                          value={peoplesAbertura}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesAbertura(e.target.value)}
                        />
                      </label>

                      <label htmlFor="ie">
                        Insc. Estadual
                        <input 
                          type="text"
                          maxLength={15}
                          value={peoplesIE}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesIE(e.target.value)}
                        />
                      </label>
                    </>
                  )}
                </section>
              </label>

              <footer>              
                <div style={{marginLeft: '840px'}}>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>
                  <button className="buttonClick" type="button" onClick={() => handleClose()}>
                    <MdBlock />
                    Fechar
                  </button>
                </div>
              </footer>
            </Form>
          )}

          {isMOBILE &&(
            <FormMobile ref={formRef} onSubmit={handleSubmit(handleSubmitPeople)}> 
              <section id="dados">
                <label htmlFor="nameC" className="required">
                  Nome 
                  <input
                    maxLength={100}
                    style={{width: "150%"}}  
                    type="text" 
                    value={peopleName}  
                    autoComplete="off"
                    name="NomeC"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPeopleName(e.target.value)} 
                    required
                  />
                </label>
                <br />

                <label htmlFor="emailC">
                  Email
                  <input 
                    type="text"
                    maxLength={500}
                    name="EmailC"
                    autoComplete="off"
                    value={peopleEmail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPeopleEmail(e.target.value)}
                  />
                </label> 

                {peopleType === "A" && (
                  <>
                    <AutoCompleteSelect className="selectFederalUnit">
                      <p>UF</p>  
                      <Select
                        isSearchable   
                        value={federalUnit.filter(options => options.id == federalUnitId)}
                        onChange={handleFederalUnitSelected}
                        onInputChange={(term) => setFederalUnitTerm(term)}
                        isClearable
                        placeholder=""
                        isLoading={isLoadingComboData}
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}
                        styles={selectStyles}              
                        options={federalUnit}
                      />
                    </AutoCompleteSelect>

                    <label htmlFor="oabAdvo">
                      OAB
                      <input 
                        type="text"
                        maxLength={30}
                        name="oabAdvogado"
                        autoComplete="off"
                        value={lawyerOAB}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLawyerOAB(e.target.value)}
                      />
                    </label> 
                    
                    <div style={{marginTop: '25px'}}>
                      <div style={{float:'left', marginLeft: '0px', width: '90px'}}>
                        <Flags>
                          Escritório:
                        </Flags>
                      </div>

                      <div style={{float:'left', marginTop:'3px', width: '10px'}}>
                        <input
                          type="checkbox"
                          name="select"
                          checked={flgOffice}
                          onChange={() => setFlgOffice(!flgOffice)}
                          style={{minWidth:'15px', minHeight:'15px'}}
                        />
                      </div>
                    </div>
                  </>
                )}

                {peopleType === "T" && (
                  <>
                    <AutoCompleteSelect className="selectThirdGroupParty">
                      <p>Grupo</p>  
                      <Select
                        isSearchable  
                        style={{width:'100px'}} 
                        value={thirdPartyGroup.filter(options => options.id == thirdPartyGroupId)}
                        onChange={handleThirdPartyGroupSelected}
                        onInputChange={(term) => setThirdPartyGroupTerm(term)}
                        isClearable
                        placeholder=""
                        isLoading={isLoadingComboData}
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}
                        styles={selectStyles}              
                        options={thirdPartyGroup}
                      />
                    </AutoCompleteSelect>
                  </>
                )}
              </section>
              <br />  
                              
              <label htmlFor="endereco">
                <p>Endereço(s)</p>
                {peoplesAddress.map(address => (     
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
                        maxLength={50}
                        autoComplete="off"
                        value={address.des_Bairro}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDistrict(e.target.value, address.cod_Endereco)}
                      />
                    </label>

                    <label htmlFor="end">
                      Endereço
                      <input 
                        type="text"
                        maxLength={50}
                        autoComplete="off"
                        value={address.des_Endereco}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddress(e.target.value, address.cod_Endereco)}
                      />
                    </label>
                              
                    <label htmlFor="city">
                      Município
                      <Select
                        isSearchable   
                        isClearable                        
                        value={{ id: address.cod_Municipio?.toString(), label: address.nom_Municipio }}
                        onInputChange={(term) => setPeoplesCityValue(term)}
                        onChange={(item) => handleCityChangeAddress(item, address.cod_Endereco)}                                                  
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}      
                        isLoading={isLoadingComboData}
                        styles={selectStyles}          
                        options={peoplesCitys}
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
                      />
                      <input 
                        type="text"
                        maxLength={30}
                        autoComplete="off"
                        value={address.num_Telefone01}                        
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone1(e.target.value, address.cod_Endereco)}
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
                      />
                      <input 
                        type="text"
                        maxLength={30}
                        autoComplete="off"
                        value={address.num_Telefone02}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone2(e.target.value, address.cod_Endereco)}
                      />
                    </label> 

                    <div>&nbsp;</div>
              
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
              <br /><br />

              <label htmlFor="qualify">
                <p>Qualificação</p>
                <section id="qualify">
                  {peoplesType === 'F' ? (
                    <>
                      <label htmlFor="cpf">
                        CPF/CNPJ
                        <Select
                          autoComplete="off"
                          value={personTypes.filter(options => options.id === peoplesType)}
                          onChange={(item) => setPeoplesType(item? item.id: '')}
                          styles={selectStyles}
                          options={personTypes}
                        />
                      </label>

                      <label htmlFor="doc">
                        N° Documento
                        <InputMask
                          style={{height: '40px'}}
                          mask="cpf"
                          value={peoplesNumDoc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesNumDoc(e.target.value)}
                        />
                      </label> 

                      <label htmlFor="sexo">
                        Sexo
                        <Select
                          autoComplete="off"
                          isClearable
                          styles={selectStyles}
                          value={sexo.filter(options => options.id === peoplesSex)}
                          onChange={(item) => setPeoplesSex(item? item.id: '')}
                          options={sexo}
                        />
                      </label> 

                      <label htmlFor="country">
                        Nacionalidade
                        <input 
                          type="text"
                          maxLength={30}
                          autoComplete="off"
                          value={peoplesNacionalidade}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesNacionalidade(e.target.value)}
                        />
                      </label>

                      <label htmlFor="nascimento">
                        Nascimento
                        <input 
                          type="date"
                          autoComplete="off"
                          value={peoplesNasc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesNasc(e.target.value)}
                        />
                      </label>

                      <label htmlFor="rg">
                        Rg
                        <input 
                          type="text"
                          maxLength={50}
                          value={peoplesRg}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setPeoplesRg(e.target.value)
                          }}
                        />
                      </label>

                      <label htmlFor="civil">
                        Estado civil
                        <Select
                          autoComplete="off"
                          styles={selectStyles}
                          value={personSitu.filter(options => options.id === peoplesECivil)}
                          onChange={(item) => setPeoplesECivil(item? item.id: '')}
                          options={personSitu}
                        />
                      </label> 
                  
                      <label htmlFor="profissao">
                        Profissão
                        <input 
                          type="text"
                          maxLength={50}
                          value={peoplesProf}
                          autoComplete="off"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesProf(e.target.value)}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor="CNPJ">
                        CPF/CNPJ
                        <Select
                          autoComplete="off"
                          value={personTypes.filter(options => options.id === peoplesType)}
                          onChange={(item) => setPeoplesType(item? item.id: '')}
                          styles={selectStyles}
                          options={personTypes}
                        />
                      </label>

                      {/* there is a bug who avoid put inputMask in this field
                      because there is two fields with the same type and state CPF and CNPJ */}
                      <label htmlFor="doc">
                        N° Documento
                        <input 
                          type="text"
                          value={peoplesNumDoc}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = formatField(e.target.value, 'cnpj')
                            if(value !== undefined) {
                              setPeoplesNumDoc(value)
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
                          value={peoplesAbertura}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesAbertura(e.target.value)}
                        />
                      </label>

                      <label htmlFor="ie">
                        Insc. Estadual
                        <input 
                          type="text"
                          maxLength={15}
                          value={peoplesIE}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setPeoplesIE(e.target.value)}
                        />
                      </label>
                    </>
                  )}
                </section>
              </label>

              <footer>              
                <div style={{marginRight: '50%'}}>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>
                  <button className="buttonClick" type="button" onClick={() => handleClose()}>
                    <MdBlock />
                    Fechar
                  </button>
                </div>
              </footer>
            </FormMobile>
          )}
        </Tabs>
      </Content>   
     
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
    </Container>
  );

};

export default PeopleEdit;
