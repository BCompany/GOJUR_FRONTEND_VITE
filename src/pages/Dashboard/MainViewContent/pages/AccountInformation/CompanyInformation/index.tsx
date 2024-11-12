/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useState, useEffect, useCallback, ChangeEvent  } from 'react';
import api from 'services/api';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Select from 'react-select'
import { selectStyles, useDelay, isValidCPF, isValidCNPJ} from 'Shared/utils/commonFunctions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import InputMask from 'components/InputMask';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import { ICepProps } from 'context/Interfaces/ICustomer';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container, Content, Form, TaskBar} from './styles';

export interface ISelectData{
  id: string;
  label: string;
}

export interface ICompanyData{
  companyId: number;
  companyName: string;
  companyType: string;
  des_Email: string;
  num_Telefone: string;
  num_CPF_CNJP: string;
  num_CEP: string;
  des_Endereco: string;
  des_Bairro: string;
  cod_Municipio: string;
  nom_Municipio: string;
}

const CompanyInformation: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isLoading , setIsLoading] = useState(true);
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [companyName, setCompanyName] = useState<string>("")
  const [numTelefone, setNumTelefone] = useState<string>("")
  const [desEmail, setDesEmail] = useState<string>("")
  const [companyType, setCompanyType] = useState<string>("F")
  const [documentNumber, setDocumentNumber] = useState<string>("")
  const [cep, setCep] = useState('');
  const [changeCEP, setChangeCEP] = useState<boolean>(false)
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [municipioId, setMunicipioId] = useState('');
  const [municipioDesc, setMunicipioDesc] = useState('');
  const [customerCityValue , setCustomerCityValue] = useState('');
  const [customerCitys , setCustomerCitys] = useState<ISelectData[]>([]);
  const [customerCitysDefault , setCustomerCitysDefault] = useState<ISelectData[]>([]);
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const token = localStorage.getItem('@GoJur:token');
  const caller = localStorage.getItem('@GoJur:ConfigureInvoice');


  useEffect(() => { 
    GetCompanyInformations();
  }, [])


  useDelay(() => {
    async function LoadCities() {

      if (customerCityValue.length == 0 && !isLoading) {
        setCustomerCitys(customerCitysDefault)
        return;
      }

      setIsLoadingComboData(true)
      const token = localStorage.getItem('@GoJur:token');

      try {
        const response = await api.post('/Cidades/ListarCidades', {filterClause: customerCityValue, token});

        const listCities: ISelectData[] = [];

        response.data.map((item) => {
          listCities.push({ id: item.id, label: item.value })
          return listCities;
        })

        setCustomerCitys(listCities)
        setIsLoadingComboData(false)

        if (customerCityValue.length == 0) {
          setCustomerCitysDefault(listCities)
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    LoadCities()
  }, [customerCityValue], 1000)


  const GetCompanyInformations = useCallback(async() => {
    try {

      const response = await api.get<ICompanyData>('/Empresa/InformacoesDaEmpresa', {params: {token}})

      setCompanyName(response.data.companyName)
      setDesEmail(response.data.des_Email)
      setNumTelefone(response.data.num_Telefone)
      setDocumentNumber(response.data.num_CPF_CNJP)
      setCep(response.data.num_CEP)
      setBairro(response.data.des_Bairro)
      setEndereco(response.data.des_Endereco)
      setMunicipioId(response.data.cod_Municipio)
      setMunicipioDesc(response.data.nom_Municipio)

      if(response.data.companyType != null){
        setCompanyType(response.data.companyType)
      }

      setIsLoading(false)
    }
    catch (err: any) {
      setIsLoading(false)
      addToast({type: "error", title: "Falha ao carregar informações da empresa.", description:  err.response.data.Message})
    }
  }, [companyName, desEmail, numTelefone, companyType, documentNumber, cep, bairro, endereco, municipioId, municipioDesc]);


  const saveCompanyInformation = useCallback(async() => {
    if (isSaving) {
      addToast({type: "info", title: "Operação NÃO realizada", description: `Já existe uma operação em andamento`})
      return;
    }

    if(documentNumber != null && documentNumber != ""){
      if (companyType == "J" && isValidCNPJ(documentNumber) == false){
        addToast({type: "info", title: "Operação NÃO realizada", description: `O número do CNPJ não é válido`})
        return;
      }

      if (companyType == "F" && isValidCPF(documentNumber) == false){
        addToast({type: "info", title: "Operação NÃO realizada", description: `O número do CPF não é válido`})
        return;
      }
    }
     
    if (companyName == ""){
      addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário que o campo Nome esteja preenchido para prosseguir`})
      return;
    }

    if (desEmail == ""){
      addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário que o campo E-mail esteja preenchido para prosseguir`})
      return;
    }

    if (numTelefone == ""){
      addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário que o campo Telefone esteja preenchido para prosseguir`})
      return;
    }

    try {
      setisSaving(true)
      
      await api.post('/Empresa/SalvarInformacoes', { 
        companyName,
        companyType,
        des_Email: desEmail,
        num_Telefone: numTelefone,
        num_CPF_CNJP: documentNumber,
        num_CEP: cep,
        des_Endereco: endereco,
        des_Bairro: bairro,
        cod_Municipio: municipioId,       
        token
      })
      
      addToast({type: "success", title: "Informações da Empresa Salva", description: "As informações da empresa foram salvas no sistema."})
      setisSaving(false)
    }
    catch (err: any) {
      setisSaving(false)
      addToast({type: "error", title: "Falha ao salvar informações da empresa.", description:  err.response.data.Message})
    }
  }, [isSaving, companyName, companyType, desEmail, numTelefone, documentNumber, cep, endereco, bairro, municipioId, token]);
  

  const handleLoadAddressFromCep = useCallback(async(cepNumber, type: 'c') => {
    try {
      if (changeCEP == false)
      {
        return
      }

      const response = await api.post<ICepProps>('/Cidades/ListarPorCep', {cep: cepNumber, token});

      if(response.data.Status !== 'OK') {
        addToast({type: "info", title: "Cep invalido", description: "O CEP digitado não foi encontrado , tente novamente com outro cep"})
        return;
      }

      setBairro(response.data.Bairro)
      setEndereco(response.data.Logradouro)
      setMunicipioId(response.data.Localidade_Cod)
      setMunicipioDesc(response.data.Localidade)
      setChangeCEP(false)
    }
    catch (err) {
      console.log(err);
    }
  },[addToast, changeCEP]);


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


  const handleChangeCep = (item) => {
    setCep(item)
    setChangeCEP(true)
  }


  const handleClickReturn = () => {
    if(caller == "configureInvoice"){
      localStorage.removeItem('@GoJur:ConfigureInvoice');
      history.push(`/ConfigureInvoice`)
    }
    else
      history.push(`/AccountInformation`)
  };


  return (
    <Container>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
      )}

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

      <div style={{marginLeft:"-2%"}}>
        <HeaderPage />
      </div>
      
      <TaskBar>
        <div>
          <div>
            <button
              className="buttonLinkClick buttonInclude"
              title="Clique para voltar as informações do plano"
              type="submit"
              onClick={handleClickReturn}
            >
              <AiOutlineArrowLeft />
              <span>Retornar</span>
            </button>
          </div>         
        </div>
      </TaskBar>
      
      <Content>
        <header>
          <div>
            Informações da Empresa
          </div>
        </header>

        <Form>
          <section>
            <div style={{display:"flex"}}>
              <div className='companyName'>
                <label htmlFor="companyName">
                  <p>Nome:</p>
                  <input
                    required
                    maxLength={100}
                    type="text"
                    name="companyName"
                    value={companyName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                    autoComplete="off"
                    style={{backgroundColor:"white"}}
                  />
                </label>
              </div>

              <div className='des_email'>
                <label htmlFor="des_email">
                  <p>E-mail:</p>
                  <input
                    required
                    maxLength={100}
                    type="text"
                    name="des_email"
                    value={desEmail}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDesEmail(e.target.value)}
                    autoComplete="off"
                    style={{backgroundColor:"white"}}
                  />
                </label>
              </div>

              <div className='num_telefone'>
                <label htmlFor="num_telefone">
                  <p>Telefone:</p>
                  <input
                    required
                    maxLength={30}
                    type="text"
                    name="num_telefone"
                    value={numTelefone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNumTelefone(e.target.value)}
                    autoComplete="off"
                    style={{backgroundColor:"white"}}
                  />
                </label>
              </div>

            </div>

            <div style={{display:"flex", marginTop:"2%"}}>
              <div className='companyType'>
                <label htmlFor="companyType">   
                  <p>CPF/CNPJ:</p> 
                  <select
                    name="companyType"
                    value={companyType}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCompanyType(e.target.value)}
                    style={{backgroundColor:"white"}}
                  >
                    <option value="F">Física</option>
                    <option value="J">Jurídica</option>
                  </select>
                </label>
              </div>

              {companyType == "F" && (
                <div className='documentNumber'>
                  <label htmlFor="documentNumber">
                    N° Documento:
                    <InputMask
                      maxLength={18}
                      mask="cpf"
                      value={documentNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentNumber(e.target.value)}
                      style={{backgroundColor:"white"}}
                    />
                  </label>
                </div>
              )}

              {companyType == "J" && (
                <div className='documentNumber'>
                  <label htmlFor="documentNumber">
                    N° Documento:
                    <InputMask
                      maxLength={18}
                      mask="cnpj"
                      value={documentNumber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentNumber(e.target.value)}
                      style={{backgroundColor:"white"}}
                    />
                  </label>
                </div>
              )}
            </div>

            <div style={{display:"flex", marginTop:"2%"}}>
              <label htmlFor="cep" className='cep'>
                Cep:
                <input
                  maxLength={9}
                  type="text"
                  autoComplete="off"
                  value={cep}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeCep(e.target.value)}
                  onBlur={() => handleLoadAddressFromCep(cep ,'c')}
                  style={{backgroundColor:"white"}}
                />
              </label>

              <label htmlFor="bairro" className='bairro'>
                Bairro:
                <input
                  maxLength={50}
                  type="text"
                  autoComplete="off"
                  value={bairro}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setBairro(e.target.value)}
                  style={{backgroundColor:"white"}}
                />
              </label>

              <label htmlFor="end" className='endereco'>
                Endereço:
                <input
                  maxLength={100}
                  type="text"
                  autoComplete="off"
                  value={endereco}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco(e.target.value)}
                  style={{backgroundColor:"white"}}
                />
              </label>
            </div>

            <div style={{display:"flex", marginTop:"2%"}}>
              <div className='municipio'>
                <p>Município:</p>
                <Select
                  isSearchable
                  isClearable
                  value={{ id: municipioId, label: municipioDesc }}
                  onInputChange={(term) => setCustomerCityValue(term)}
                  onChange={(item) => handleCityChangeAddress(item)}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  isLoading={isLoadingComboData}
                  styles={selectStyles}
                  options={customerCitys}
                />
              </div>
            </div>

            <div style={{float:'right', marginRight:'12px'}}>
              {accessCode == "adm" && (
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> saveCompanyInformation()}
                    style={{width:'100px'}}
                  >
                    <FiSave />
                    Salvar 
                  </button>
                </div>
              )}
                        
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleClickReturn()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
          </section>
        </Form>
      </Content>
    </Container>
  );
};

export default CompanyInformation;