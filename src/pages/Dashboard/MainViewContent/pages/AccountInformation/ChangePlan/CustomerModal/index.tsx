/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */

import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import api from 'services/api';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { selectStyles, useDelay, isValidCPF, isValidCNPJ} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Select from 'react-select'
import InputMask from 'components/InputMask';
import { FiCheckSquare, FiHelpCircle } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { ModalCustomerInformation, OverlayModal2} from './styles';

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

export interface ISelectData{
  id: string;
  label: string;
}

export interface ICustomerPlanData{
  cod_RecursoSistema: string;
  des_RecursoSistema: string;
  tpo_ItemList: string;
  qtd_RecursoIncluso: string;
  tpo_Recurso: string;
  cod_ResourceReference: string;
  cod_PlanReference: string;
}

const ChangePlanCustomerModal = (props) => {
  const {haveResources, planInformationList, handleCloseCustomerModal, selectPlanId} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId')
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const history = useHistory();
  const { addToast } = useToast();
  const [customerNumDoc, setCustomerNumDoc] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")

  const [cep, setCep] = useState('');
  const [changeCEP, setChangeCEP] = useState<boolean>(false)
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [municipioId, setMunicipioId] = useState('');
  const [municipioDesc, setMunicipioDesc] = useState('');
  const [customerCityValue , setCustomerCityValue] = useState('');
  const [customerCitys , setCustomerCitys] = useState<ISelectData[]>([]);
  const [customerCitysDefault , setCustomerCitysDefault] = useState<ISelectData[]>([]);
  const [isLoading , setIsLoading] = useState(true);
  const [daysListNumbers, setDaysListNumbers] = useState<ISelectData[]>([])
  const [selectedDay, setSelectedDay] = useState("")

  const [isSaving , setisSaving] = useState<boolean>();

  useEffect(() => {
    calculateDays()
  },[])


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


  const savePlan = useCallback(async() => {

    if(customerNumDoc == ""){

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo N.° CPF/CNPJ.'
      })

      return
    }

    if(customerEmail == ""){

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo E-mail.'
      })

      return
    }

    if(cep == ""){

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo CEP.'
      })

      return
    }

    if(bairro == ""){

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo Bairro.'
      })

      return
    }

    if(endereco == ""){

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo Endereço.'
      })
  
      return
    }

    if(municipioId == ""){

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo Município.'
      })

      return
    }

    if(selectedDay == ""){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'É necessário preencher o campo Dia 1° Vencimento.'
      })
  
      return
    }

    if(customerNumDoc.length != 14 && customerNumDoc.length != 18){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'Por favor , informe um número de CPF ou CNJP valido.'
      })
 
      return
    }
  
    if(customerNumDoc.length == 14 && isValidCPF(customerNumDoc) == false){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'O CPF informado é inválido.'
      })
 
      return
    }

    if(customerNumDoc.length == 18 && isValidCNPJ(customerNumDoc) == false){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: 'O CNPJ informado é inválido.'
      })

      return
    }
    

    try {
    
      setisSaving(true)
      const reponse = await api.post('/Conta/SalvarPlanoeRecursos', {
        newPlanList: planInformationList,
        companyId,
        numDocument: customerNumDoc,
        emailFaturamento: customerEmail,
        cep,
        bairro,
        address: endereco,
        municipio: municipioDesc,
        firstDueDate: selectedDay,
        fromFree: true,
        hasResource: haveResources,
        planId: selectPlanId,
        token
      })

      addToast({
        type: "success",
        title: "Plano Salvo",
        description: "O plano foi alterado com sucesso."
      })
      setisSaving(false)

      history.push('/AccountInformation');

    } catch (err: any) {

      if (err.response.data.Message == "insufficientResources"){
        setisSaving(false)
        addToast({
          type: "error",
          title: "Falha ao alterar plano.",
          description:  `Você selecionou um plano que possui recursos inferiores aos que estão em uso no momento, por favor, verifique novamente ou se desejar entre em contato conosco via
          chat.`
        })
      }
      
      if (err.response.data.Message != "insufficientResources" !){
        setisSaving(false)
        addToast({
          type: "error",
          title: "Falha ao alterar plano.",
          description:  err.response.data.Message
        })
      }  
    }
  },[planInformationList, companyId, customerNumDoc, customerEmail, cep, bairro, endereco, municipioDesc, selectedDay]);


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

    },[addToast, changeCEP]);


  const handleChangeCep = (item) => {
    setCep(item)
    setChangeCEP(true)
  }


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
  

  const calculateDays = () => {
    
    const dias = 15;
    const hoje = new Date();
    const primeiroDia = hoje.getDate();
    const array: number[] = [];
    for (let i = 0; i < dias; i++) {
      hoje.setDate(primeiroDia + i)
      array.push(hoje.getDate());
    }

    const listSelectData: ISelectData[] = []; //

    array.map(item => {
      if (Number.isInteger(item / 5) == true){
        listSelectData.push({
          id: item.toString(), 
          label:item.toString()
        })

        return listSelectData   
      }  

      setDaysListNumbers(listSelectData)
      return
    }) 
  }

  const handleChangeDay = (label: string) => {
    setSelectedDay(label)
  }


  return (
    <>

      {isSaving && (
        <>
          <OverlayModal2 />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Salvando Plano...
          </div>
        </>
        )}
        
      <ModalCustomerInformation show>

        <div className='header'>
          <p className='headerLabel'>Dados</p>
        </div>

        <div className='mainDiv' style={{padding:"10px"}}>
          
          <div style={{display:"flex"}}>
                 
            <div style={{width:"49%"}}>
              <p>CPF/CNPJ</p>
              <InputMask
                style={{backgroundColor:"white"}}
                mask="cpfcnpj"
                value={customerNumDoc}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerNumDoc(e.target.value)}
              />
            </div>

            <div style={{width:"49%", marginLeft:"2%"}}>
              <label htmlFor="email">
                Email
                <input
                  maxLength={50}
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="email"
                  value={customerEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
            </div>
 
          </div>

          <label htmlFor="endereco">

            <section id="endereco">

              <div style={{display:"flex", marginTop:"2%"}}>

                <div style={{width:"49%"}}>
                  <label htmlFor="cep">
                    Cep
                    <input
                      style={{backgroundColor: 'white'}}
                      type="text"
                      autoComplete="off"
                      value={cep}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeCep(e.target.value)}
                      onBlur={() => handleLoadAddressFromCep(cep ,'c')}
                    />
                  </label>
                </div>

                <div style={{marginLeft: "2%", width:"49%"}}>
                  <label htmlFor="bairro">
                    Bairro
                    <input
                      style={{backgroundColor: 'white'}}
                      type="text"
                      autoComplete="off"
                      value={bairro}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setBairro(e.target.value)}
                      maxLength={100}
                    />
                  </label>
                </div>
                          
              </div>

              <div style={{marginTop:"2%", display:"flex"}}>

                <div style={{width:"49%", marginTop:"3px"}}>
                  <label htmlFor="end">
                    Endereço
                    <input
                      style={{backgroundColor: 'white'}}
                      type="text"
                      autoComplete="off"
                      value={endereco}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco(e.target.value)}
                      maxLength={100}
                    />
                  </label>
                </div>

                <div style={{width:"48.5%", marginLeft:"2%"}}>
                  <p>Município</p>
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
                </div>

              </div>

              <div style={{display:"flex", marginTop:"2%"}}>
                <div id='day' style={{width:"49%"}}>
                  <div>
                    Dia 1° Vencimento
                    <Select
                      id='day'
                      className='day'
                      placeholder="Selecione"
                      autoComplete="off"
                      styles={selectStyles}
                      value={daysListNumbers.filter(options => options.label === selectedDay)}
                      onChange={(item) => handleChangeDay(item? item.label: '')}
                      options={daysListNumbers}
                    />
                  </div>
                </div>

                <FiHelpCircle style={{marginLeft:"2%"}} className='infoMessages' title="Seleciona um dia para o Vencimento da 1° Fatura." />

              </div>
            
            </section>
          </label>

        </div>
        
        <div className='footer'>
          <div style={{float:'right', marginRight:'20px', marginTop:"15px"}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> savePlan()}
                style={{width:'140px'}}
              >
                <FiCheckSquare />
                Contratar Plano
              </button>
            </div>

            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleCloseCustomerModal()}
                style={{width:'90px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>

      </ModalCustomerInformation>

    </>
    
  )
  
}

export default ChangePlanCustomerModal;
