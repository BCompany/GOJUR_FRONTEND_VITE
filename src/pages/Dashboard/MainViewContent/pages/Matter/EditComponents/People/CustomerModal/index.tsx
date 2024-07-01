import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { useDefaultSettings } from 'context/defaultSettings';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { selectStyles, formatField, useDelay} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { phoneTypes} from 'Shared/utils/commonListValues';
import InputMask from 'components/InputMask';
import { DefaultsProps, ICepProps, ICustomerAddress, ICustomerData, ICustomerGroupData, ISelectData, ICustomerMatterData } from 'context/Interfaces/ICustomer';
import Select from 'react-select'
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { FaRegTimesCircle } from 'react-icons/fa';
import { ModalCustomer, ModalCustomerMobile } from './styles';

const CustomerModalEdit = (props) => {

  const { handleUpdateNewCustomer, customerId } = props.callbackFunction

  const { addToast } = useToast();
  const { handleShowCustomerModal } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const { isMOBILE } = useDevice();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isLoading , setIsLoading] = useState(true);
  const { handleUserPermission } = useDefaultSettings();
  const [isSaving , setisSaving] = useState<boolean>();
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail , setCustomerEmail] = useState('');

  const [customerGroup, setCustomerGroup] = useState<ISelectData[]>([]);
  const [customerGroupId, setCustomerGroupId] = useState('');
  const [customerGroupValue, setCustomerGroupValue] = useState('');
  const [customerGroupTerm, setCustomerGroupTerm] = useState('');

  const [customerType , setCustomerType] = useState<string>('F');
  const [customerECivil , setCustomerECivil] = useState('I');
  const [customerNumDoc , setCustomerNumDoc] = useState('');
  const [customerAddress , setCustomerAddress] = useState<ICustomerAddress[]>([]);
  const [customerCityValue , setCustomerCityValue] = useState('');
  const [customerCitys , setCustomerCitys] = useState<ISelectData[]>([]);
  const [customerCitysDefault , setCustomerCitysDefault] = useState<ISelectData[]>([]);

  const [phoneType1, setPhoneType1] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [phoneType2, setPhoneType2] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [addressId, setAddressId] = useState(0);
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [municipioId, setMunicipioId] = useState('');
  const [municipioDesc, setMunicipioDesc] = useState('');
  const [personId, setPersonId] = useState(0);

  const [ufId, setUfId] = useState(0);
  const [phisicPersonId, setPhisicPersonId] = useState(0);
  const [legalPersonId, setLegalPersonId] = useState(0);
  const [nacionalidade, setNacionalidade] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [password, setPassword] = useState('');
  const [observation, setObservation] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [fantasyName, setfantasyName] = useState('');
  const [whatsAppNum, setWhatsAppNum] = useState('');
  const [captureDate, setCaptureDate] = useState('');
  const [salesChanel, setSalesChanel] = useState(0);
  const [systemUserId, setSystemUserId] = useState(0);
  const [changeCEP, setChangeCEP] = useState<boolean>(false)

  useEffect(() => {
    LoadCustomerGroup();
  },[customerGroupId, customerGroupValue])

  // Call default parameters by company
  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission]);

  useEffect(() => {
    if (customerId > 0)
    {
      LoadCustomerInformations()
    }
  },[])

  const LoadCustomerInformations = async () => {

    try {
      const response = await api.post<ICustomerMatterData>('/Clientes/Editar', {
        id: Number(customerId),
        token
      })

      console.log(response.data)

      setPersonId(response.data.cod_Pessoa)
      setCustomerName(response.data.nom_Pessoa)
      setCustomerEmail(response.data.des_Email)
      setCustomerGroupId(response.data.cod_GrupoCliente)
      setCustomerGroupValue(response.data.des_GrupoCliente)
      setCustomerType(response.data.tpo_Pessoa)
      setCustomerECivil(response.data.tpo_EstadoCivil)
      setCustomerNumDoc(response.data.num_CPFCNPJ)

      setPhisicPersonId(response.data.cod_PessoaFisica)
      setLegalPersonId(response.data.cod_PessoaJuridica)
      setNacionalidade(response.data.des_Nacionalidade)
      setResponsibleName(response.data.nom_Responsavel)
      setPassword(response.data.cod_Senha)
      setObservation(response.data.des_Observacao)
      setReferenceId(response.data.cod_Referencia)
      setBillingEmail(response.data.des_EmailFaturamento)
      setfantasyName(response.data.nom_PessoaFantasia)
      setWhatsAppNum(response.data.num_WhatsApp)
      setCaptureDate(response.data.dta_Captacao)
      setSalesChanel(response.data.cod_CanalDeVendas)
      setSystemUserId(response.data.cod_SistemaUsuarioEmpresa)

      if(response.data.enderecolist.length > 0) {

        const count = (response.data.enderecolist.length - 1)

        setAddressId(response.data.enderecolist[count].cod_Endereco)
        setPhoneType1(response.data.enderecolist[count].tpo_Telefone01)
        setPhoneNumber1(response.data.enderecolist[count].num_Telefone01)
        setPhoneType2(response.data.enderecolist[count].tpo_Telefone02)
        setPhoneNumber2(response.data.enderecolist[count].num_Telefone02)
        setCep(response.data.enderecolist[count].num_CEP)
        setBairro(response.data.enderecolist[count].des_Bairro)
        setEndereco(response.data.enderecolist[count].des_Endereco)
        setMunicipioId(response.data.enderecolist[count].cod_Municipio)
        setMunicipioDesc(response.data.enderecolist[count].nom_Municipio)
        setUfId(response.data.enderecolist[count].cod_UnidadeFederal)
      }

    } catch (err) {
      console.log(err);
    }
  }


  const handleSave = useCallback(async()  => {

    try
    {
      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })

        return;
      }

      if (customerName === '') {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo Nome deve ser preenchido`
        })

        return;
      }

      if (customerGroupValue === '') {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo grupo do cliente deve ser preenchido`
        })

        return;
      }

      setisSaving(true)

      const response = await api.post<ICustomerData>('/Clientes/SalvarPorProcesso', {
        cod_Cliente: customerId,
        cod_pessoa: personId,
        nom_Pessoa: customerName,
        des_Email: customerEmail,
        cod_GrupoCliente: customerGroupId,
        des_GrupoCliente: customerGroupValue,
        tpo_Telefone01: phoneType1,
        num_Telefone01: phoneNumber1,
        tpo_Telefone02: phoneType2,
        num_Telefone02: phoneNumber2,
        tpo_Pessoa: customerType,
        tpo_EstadoCivil: customerECivil,
        num_CPFCNPJ: customerNumDoc,
        cod_PessoaFisica: phisicPersonId,
        cod_PessoaJuridica: legalPersonId,
        des_Nacionalidade: nacionalidade,
        nom_Responsavel: responsibleName,
        cod_Senha: password,
        des_Observacao: observation,
        cod_Referencia: referenceId,
        des_EmailFaturamento: billingEmail,
        nom_PessoaFantasia: fantasyName,
        num_WhatsApp: whatsAppNum,
        dta_Captacao: captureDate,
        cod_CanalDeVendas: salesChanel,
        cod_SistemaUsuarioEmpresa: systemUserId,
        cod_Endereco: addressId,
        des_Endereco: endereco,
        des_Bairro: bairro,
        cod_Municipio: municipioId,
        nom_Municipio: municipioDesc,
        num_CEP: cep,
        token
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `O cliente foi salvo com sucesso`
      })

      handleUpdateNewCustomer(response.data)
      handleCustomerModalClose();
    }
    catch(err: any){
      setisSaving(false)
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: err.response.data.Message
      })
      console.log(err)
    }

  },[isSaving, personId, customerId, customerName, customerEmail, customerGroupId, customerGroupValue, phoneType1, phoneNumber1, phoneType2, phoneNumber2, customerType, customerECivil, customerNumDoc, addressId, cep, bairro, endereco, municipioId, municipioDesc, phisicPersonId, legalPersonId, nacionalidade, responsibleName, password, observation, referenceId, billingEmail, fantasyName, whatsAppNum, captureDate, salesChanel, systemUserId ])

  // REPORT FIELDS - GET API DATA
  const LoadCustomerGroup = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? customerGroupValue:customerGroupTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ICustomerGroupData[]>('/Clientes/ListarGrupoClientes', {
          page: 1,
          rows: 50,
          filterClause: filter,
          token
      });

      const listCustomerGroup: ISelectData[] = []

      response.data.map(item => {
        return listCustomerGroup.push({
          id: item.id,
          label: item.value
        })
      })

      setCustomerGroup(listCustomerGroup)

      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const handleCustomerModalClose = () => {
    setCustomerName("")
    setCustomerEmail("")
    setCustomerGroupId("")
    setCustomerGroupValue("")
    setCustomerType("")
    setCustomerECivil("I")
    setCustomerNumDoc("")
    setCustomerAddress([])
    handleShowCustomerModal(false)

  }

   const handleCusomerGroupSelected = (item) => {

    if (item){
      setCustomerGroupValue(item.value)
      setCustomerGroupId(item.id)
    }else{
      setCustomerGroupValue('')
      LoadCustomerGroup('reset')
      setCustomerGroupId('')
    }
  }

  const handleLoadAddressFromCep = useCallback(async(cepNumber, type: 'c') => {

    try {

      if (changeCEP == false)
      {
        return
      }

      const token = localStorage.getItem('@GoJur:token');

      const response = await api.post<ICepProps>('/Cidades/ListarPorCep', {
        cep: cepNumber,
        token,
      });

      if(response.data.Status !== 'OK') {
        addToast({
          type: "info",
          title: "Cep invalido",
          description: "O CEP digitado não foi encontrado , tente novamente com outro cep"
        })

        return;
      }

      setBairro(response.data.Bairro)
      setEndereco(response.data.Logradouro)
      setMunicipioId(response.data.Localidade_Cod)
      setMunicipioDesc(response.data.Localidade)
      setChangeCEP(false)

    } catch (err) {
      console.log(err);
    }

    },[addToast, customerAddress, changeCEP]);

  const handleCityChangeAddress = (item: any) => {
    if(item)
    {
      setMunicipioId(item.id)
      setMunicipioDesc(item.label)
    }
    else{
      setMunicipioId('')
      setMunicipioDesc('')
    }
  }

  const handlePhone1Select = (item) => {
    if (item){
      setPhoneType1(item.id)
    }
  }

  const handlePhone2Select = (item) => {
    if (item){
      setPhoneType2(item.id)
    }
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

  useDelay(() => {

    async function LoadCities() {

      if (customerCityValue.length == 0 && !isLoading) {
        setCustomerCitys(customerCitysDefault)
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


  const handleChangeCep = (item) => {
    setCep(item)
    setChangeCEP(true)
  }


  // HTML
  return (
    <>
      <div>
        {!isMOBILE &&(
          <Modal
            isOpen
            overlayClassName="react-modal-overlay"
            className="react-modal-customerModal"
          >

            <ModalCustomer>

              <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px',fontSize:"13px"}}>
                <p style={{fontSize:"13.5px"}}>Cliente</p>
                <br />

                <p style={{display: "inline-block"}}>Nome</p>
                <label htmlFor="descricao" style={{fontSize:'13px'}}>
                  <input
                    maxLength={50}
                    type="text"
                    style={{backgroundColor: 'white', width: "81%", display: "inline-block", marginLeft:"7%"}}
                    name="descricao"
                    value={customerName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </label>
                <br />

                <p style={{display: "inline-block"}}>Grupo</p>
                <AutoCompleteSelect className="selectCustumerGroup" style={{width: "82%", display: "inline-block", marginTop:"2%", marginLeft:"6%"}}>
                  <Select
                    isSearchable
                    value={customerGroup.filter(options => options.id == customerGroupId)}
                    onChange={handleCusomerGroupSelected}
                    onInputChange={(term) => setCustomerGroupTerm(term)}
                    isClearable
                    placeholder=""
                    isLoading={isLoadingComboData}
                    loadingMessage={loadingMessage}
                    noOptionsMessage={noOptionsMessage}
                    styles={selectStyles}
                    options={customerGroup}
                  />
                </AutoCompleteSelect>

                <br />
                {customerType === "F" ?(
                  <label htmlFor="type" style={{fontSize:'12px', display: "flex", width:"81%", marginTop:"1%"}}>
                    <p style={{marginTop:"auto", marginBottom:"auto"}}>CPF/CNPJ</p>

                    <select
                      style={{marginLeft: '4%', backgroundColor: 'white', marginTop:"1%"}}
                      name="a"
                      value={customerType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setCustomerType(e.target.value)}
                    >
                      <option value="F">Física</option>
                      <option value="J">Jurídica</option>
                    </select>
                    <InputMask
                      style={{marginLeft: "13%" , width:"126%", marginTop:"2.7%", backgroundColor: 'white'}}
                      mask="cpf"
                      value={customerNumDoc}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNumDoc(e.target.value)}
                    />

                  </label>
                ) : (
                  <>
                    <label htmlFor="type" style={{fontSize:'12px', display: "flex", width:"81%", marginTop:"1%"}}>
                      <p style={{marginTop:"auto", marginBottom:"auto"}}>CPF/CNPJ</p>

                      <select
                        style={{marginLeft: '4%', backgroundColor: 'white', marginTop:"1%"}}
                        name="a"
                        value={customerType}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCustomerType(e.target.value)}
                      >
                        <option value="F">Física</option>
                        <option value="J">Jurídica</option>
                      </select>
                      <InputMask
                        style={{marginLeft: "13%" , width:"126%", marginTop:"2.7%", backgroundColor: 'white'}}
                        mask="cnpj"
                        value={customerNumDoc}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNumDoc(e.target.value)}
                      />

                    </label>
                  </>
                )}

                <label htmlFor="email" style={{fontSize:'12px'}}>
                  Email
                  <input
                    maxLength={50}
                    type="text"
                    style={{backgroundColor: 'white', width: '81%', marginLeft: '8%',marginTop:"2%"}}
                    name="email"
                    value={customerEmail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </label>

                <br />

                <label htmlFor="endereco">

                  <section id="endereco" style={{marginTop:"1%"}}>

                    <p style={{display: "inline-block"}}>Telefone</p>
                    <div style={{display: "inline-block", width: "80%", marginLeft:"2%"}}>
                      <AutoCompleteSelect id="contact" style={{marginInline: "10px", width: "40%", display: "inline-block"}}>

                        <Select
                          isSearchable
                          styles={selectStyles}
                          value={phoneTypes.filter(options => options.id === phoneType1)}
                          onChange={handlePhone1Select}
                          options={phoneTypes}
                          placeholder="Selecione"
                        />

                      </AutoCompleteSelect>
                    </div>
                    <input
                      style={{marginLeft: "-42%",backgroundColor: 'white', width:"45%"}}
                      type="text"
                      autoComplete="off"
                      value={phoneNumber1}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber1(e.target.value)}
                    />

                    <br />

                    <p style={{display: "inline-block"}}>Telefone</p>
                    <div style={{display: "inline-block", width: "80%", marginLeft:"2%"}}>
                      <AutoCompleteSelect id="contact" style={{marginInline: "10px", width: "40%", display: "inline-block"}}>
                        <Select
                          isSearchable
                          styles={selectStyles}
                          value={phoneTypes.filter(options => options.id === phoneType2)}
                          onChange={handlePhone2Select}
                          options={phoneTypes}
                          placeholder="Selecione"
                        />

                      </AutoCompleteSelect>
                    </div>
                    <input
                      style={{marginLeft: "-42%",backgroundColor: 'white', width:"45%"}}
                      type="text"
                      autoComplete="off"
                      value={phoneNumber2}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber2(e.target.value)}
                    />

                    <br />

                    <label htmlFor="cep">
                      Cep
                      <input
                        style={{width: "31.5%" , marginLeft: "9%", marginRight: "4%", marginTop:"1%",backgroundColor: 'white'}}
                        type="text"
                        autoComplete="off"
                        value={cep}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeCep(e.target.value)}
                        onBlur={() => handleLoadAddressFromCep(cep ,'c')}
                      />
                    </label>

                    <label htmlFor="bairro">
                      Bairro
                      <input
                        style={{width: "35.5%" , marginLeft: "3%",backgroundColor: 'white'}}
                        type="text"
                        autoComplete="off"
                        value={bairro}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setBairro(e.target.value)}
                      />
                    </label>

                    <br />

                    <label htmlFor="end">
                      Endereço
                      <input
                        style={{width: "81%" , marginLeft: "2.5%", marginTop:"2%",backgroundColor: 'white'}}
                        type="text"
                        autoComplete="off"
                        value={endereco}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco(e.target.value)}
                      />
                    </label>

                    <p style={{display: "inline-block"}}>Município</p>
                    <section style={{marginTop: "2%", width: "40%", display: "inline-block", marginLeft:"2%"}}>
                      <Select
                        isSearchable
                        isClearable
                        value={{ id: municipioId, label: municipioDesc }}
                        // value={customerCitys.filter(options => options.id == municipioId)}
                        onInputChange={(term) => setCustomerCityValue(term)}
                        onChange={(item) => handleCityChangeAddress(item)}
                        loadingMessage={loadingMessage}
                        noOptionsMessage={noOptionsMessage}
                        isLoading={isLoadingComboData}
                        styles={selectStyles}
                        options={customerCitys}
                      />
                    </section>
                  </section>
                </label>

                <div style={{float:'right', marginRight:'12px', marginTop: "2%"}}>
                  <div style={{float:'left'}}>
                    <button
                      className="buttonClick"
                      type='button'
                      onClick={()=> handleSave()}
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
                      onClick={() => handleCustomerModalClose()}
                      style={{width:'100px'}}
                    >
                      <FaRegTimesCircle />
                      Fechar
                    </button>
                  </div>
                </div>

              </div>
            </ModalCustomer>
          </Modal>

        )}
      </div>

      {/* {isMOBILE &&(
        <Modal
          isOpen
          overlayClassName="react-modal-overlay"
          className="react-modal-customerModalMobile"

        >

          <ModalCustomerMobile>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px',fontSize:"10px"}}>
              <p style={{fontSize:"13.5px"}}>Cliente</p>

              <br />

              <p style={{display: "inline-block"}}>Nome</p>
              <label htmlFor="descricao" style={{fontSize:'13px'}}>
                <input
                  maxLength={50}
                  type="text"
                  style={{backgroundColor: 'white', width: "76%", display: "inline-block", marginLeft:"9%"}}
                  name="descricao"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerDescription(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <br />

              <p style={{display: "inline-block"}}>Grupo</p>
              <AutoCompleteSelect className="selectCustumerGroup" style={{width: "79%", display: "inline-block", marginTop:"2%", marginLeft:"6%"}}>

                <Select
                  isSearchable
                  value={customerGroup.filter(options => options.id == customerGroupId)}
                  onChange={handleCusomerGroupSelected}
                  onInputChange={(term) => setCustomerGroupTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={customerGroup}
                />
              </AutoCompleteSelect>

              <br />
              {customerType === "F" ?(
                <label htmlFor="type" style={{fontSize:'10px', display: "flex", width:"76%", marginTop:"1%"}}>
                  <p style={{marginTop:"auto", marginBottom:"auto"}}>CPF/CNPJ</p>

                  <select
                    style={{marginLeft: '4%', backgroundColor: 'white', marginTop:"1%"}}
                    name="a"
                    value={customerType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCustomerType(e.target.value)}
                  >
                    <option value="F">Física</option>
                    <option value="J">Jurídica</option>
                  </select>
                  <InputMask
                    style={{marginLeft: "13%" , width:"140%", marginTop:"2.7%", backgroundColor: 'white'}}
                    mask="cpf"
                    value={customerNumDoc}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNumDoc(e.target.value)}
                  />

                </label>
              ) : (
                <>
                  <label htmlFor="type" style={{fontSize:'10px', display: "flex", width:"76%", marginTop:"1%"}}>
                    <p style={{marginTop:"auto", marginBottom:"auto"}}>CPF/CNPJ</p>

                    <select
                      style={{marginLeft: '4%', backgroundColor: 'white', marginTop:"1%"}}
                      name="a"
                      value={customerType}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setCustomerType(e.target.value)}
                    >
                      <option value="F">Física</option>
                      <option value="J">Jurídica</option>
                    </select>
                    <InputMask
                      style={{marginLeft: "13%" , width:"140%", marginTop:"2.7%", backgroundColor: 'white'}}
                      mask="cnpj"
                      value={customerNumDoc}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNumDoc(e.target.value)}
                    />

                  </label>
                </>
              )}



              <label htmlFor="email" style={{fontSize:'10px'}}>
                Email
                <input
                  maxLength={50}
                  type="text"
                  style={{backgroundColor: 'white', width: '76%', marginLeft: '10%',marginTop:"2%"}}
                  name="email"
                  value={customerEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>

              <br />

              <label htmlFor="endereco">
                <section id="endereco" style={{marginTop:"1%"}}>

                  <p style={{display: "inline-block"}}>Telefone</p>
                  <div style={{display: "inline-block", width: "80%", marginLeft:"2%"}}>
                    <AutoCompleteSelect id="contact" style={{marginInline: "10px", width: "35%", display: "inline-block"}}>

                      <Select
                        isSearchable
                        styles={selectStyles}
                        value={phoneTypes.filter(options => options.id === address.tpo_Telefone01)}
                        onChange={(item) => handleChangeTypePhone1(item?.id, address.cod_Endereco)}
                        options={phoneTypes}
                      />

                    </AutoCompleteSelect>
                  </div>
                  <input
                    style={{marginLeft: "-42%",backgroundColor: 'white', width:"41%"}}
                    type="text"
                    autoComplete="off"
                    value={address.num_Telefone01}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone1(e.target.value, address.cod_Endereco)}
                  />

                  <br />

                  <p style={{display: "inline-block"}}>Telefone</p>
                  <div style={{display: "inline-block", width: "80%", marginLeft:"2%"}}>
                    <AutoCompleteSelect id="contact" style={{marginInline: "10px", width: "35%", display: "inline-block"}}>
                      <Select
                        isSearchable
                        styles={selectStyles}
                        value={phoneTypes.filter(options => options.id === address.tpo_Telefone02)}
                        onChange={(item) => handleChangeTypePhone2(item?.id, address.cod_Endereco)}
                        options={phoneTypes}
                      />

                    </AutoCompleteSelect>
                  </div>
                  <input
                    style={{marginLeft: "-42%",backgroundColor: 'white', width:"41%"}}
                    type="text"
                    autoComplete="off"
                    value={address.num_Telefone02}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangePhone2(e.target.value, address.cod_Endereco)}
                  />

                  <br />

                  <label htmlFor="cep">
                    Cep
                    <input
                      style={{width: "27%" , marginLeft: "13%", marginRight: "4%", marginTop:"1%",backgroundColor: 'white'}}
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
                      style={{width: "32%" , marginLeft: "3%",backgroundColor: 'white'}}
                      type="text"
                      autoComplete="off"
                      value={address.des_Bairro}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDistrict(e.target.value, address.cod_Endereco)}
                    />
                  </label>

                  <br />

                  <label htmlFor="end">
                    Endereço
                    <input
                      style={{width: "75%" , marginLeft: "5%", marginTop:"2%",backgroundColor: 'white'}}
                      type="text"
                      autoComplete="off"
                      value={address.des_Endereco}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeAddress(e.target.value, address.cod_Endereco)}
                    />
                  </label>

                  <p style={{display: "inline-block"}}>Município</p>
                  <section style={{marginTop: "2%", width: "35%", display: "inline-block", marginLeft:"2%"}}>
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
                  </section>



                </section>
              </label>

              <br />

              <div style={{float:'right', marginRight:'12px', marginTop: "2%"}}>
                <div style={{float:'left'}}>
                  <button
                    className="buttonClick"
                    type='button'
                    onClick={()=> handleSave()}
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
                    onClick={() => handleCustomerModalClose()}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalCustomerMobile>
        </Modal>
      )} */}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Salvando cliente ...
          </div>
        </>
      )}

    </>
  )

}

export default CustomerModalEdit;
