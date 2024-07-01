/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import api from 'services/api';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { FaFileAlt } from 'react-icons/fa';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Loader from 'react-spinners/PulseLoader';
import { AutoCompleteSelect} from 'Shared/styles/GlobalStyle';
import { useHistory } from 'react-router-dom';
import Select from 'react-select'
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import { useForm } from 'react-hook-form';
import { Container, Content, Form, ItemList, TollBar } from './styles';
import { ISelectData, IMatterReportData, ICustomerGroup, IAutoCompleteData, IAdvisoryType } from '../../../../Interfaces/IMatter';

const MatterReportBCO_ID4817: React.FC = () => {

const history = useHistory();
const formRef = useRef<HTMLFormElement>(null);
const { handleUserPermission } = useDefaultSettings();
const { addToast } = useToast();
const token = localStorage.getItem('@GoJur:token');
const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
const { handleSubmit} = useForm<IMatterReportData>();

const [customer, setCustomer] = useState<IAutoCompleteData[]>([]);
const [customerId, setCustomerId] = useState('');
const [customerTerm, setCustomerTerm] = useState('');
const [customerValue, setCustomerValue] = useState('');
const [customerDesc, setCustomerDesc] = useState('');
const [customerReportList, setCustomerReportList] = useState<ISelectData[]>([]);

const [advisoryType, setAdvisoryType] = useState<IAutoCompleteData[]>([]);
const [advisoryTypeId, setAdvisoryTypeId] = useState('');
const [advisoryTypeTerm, setAdvisoryTypeTerm] = useState('');
const [advisoryTypeValue, setAdvisoryTypeValue] = useState('');
const [advisoryTypeDesc, setAdvisoryTypeDesc] = useState('');
const [advisoryTypeReportList, setAdvisoryTypeReportList] = useState<ISelectData[]>([]);

const [matterTitle, setMatterTitle] = useState<string>("");
const [matterEventQty, setMatterEventQty] = useState<string>('01');
const [matterType, setMatterType] = useState<string>("advisory")
const [privateEvent, setPrivateEvent] = useState<string>("Y")

const [isGeneratingReport, setIsGeneratingReport] = useState(false)
const [idReportGenerate, setIdReportGenerate] = useState<number>(0)

// When exists report id verify if is avaiable every 5 seconds
useEffect(() => {

  if (idReportGenerate > 0){
    const checkInterval = setInterval(() => { CheckReportPending(checkInterval) }, 7000);
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

      if (response.data == "W")
      {
        setButtonText("Gerar Relatório");
        clearInterval(checkInterval);
        setIsGeneratingReport(false)

        addToast({
          type: "info",
          title: "Verificar filtros",
          description: "Não foram encontrados dados de processo, verifique os filtros aplicados."
        })
      }

      if (response.data == "E"){
        clearInterval(checkInterval);
        setIsGeneratingReport(false)
        setButtonText("Gerar Relatório");

        addToast({
          type: "error",
          title: "Operação não realizada",
          description: "Não foi possível gerar o relatório."
        })

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
  setButtonText("Gerar Relatório");

  window.open(`${response.data.des_Parametro}`, '_blank');     
} 


useDelay(() => {
  if (customerTerm.length > 0){
    LoadCustomer()
  }
}, [customerTerm], 1000)

useDelay(() => {
  if (advisoryTypeTerm.length > 0){
    LoadAdvisoryType()
  }
}, [advisoryTypeTerm], 1000)


useEffect(() => {
  LoadCustomer()
  LoadAdvisoryType()
},[])


const LoadCustomer = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? customerValue:customerTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.post<IAdvisoryType[]>('/Clientes/ListarPorNome', {
      filterClause: filter,
      rows: 50,
      token,
    });

    const listCustomer: IAutoCompleteData[] = []

    response.data.map(item => {
      return listCustomer.push({
        id: item.id,
        label: item.value
      })
    })
    
    setCustomer(listCustomer)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


const LoadAdvisoryType = async (stateValue?: string) => {

  if (isLoadingComboData){
    return false;
  }

  let filter = stateValue == "initialize"? advisoryTypeValue:advisoryTypeTerm
  if (stateValue == 'reset'){
    filter = ''
  }

  try {
    const response = await api.get<ICustomerGroup[]>('/TipoConsultivo/ListarCombo', {
      params:{
      rows: 50, 
      filterClause: filter,
      token,
      }
    });

    const listAdvisoryType: IAutoCompleteData[] = []

    response.data.map(item => {
      return listAdvisoryType.push({
        id: item.id,
        label: item.value
      })
    })
    
    setAdvisoryType(listAdvisoryType)

    setIsLoadingComboData(false)
    
  } catch (err) {
    console.log(err);
  }
}


 const [buttonText, setButtonText] = useState("Gerar Relatório");
 const changeText = (text) => setButtonText(text);

 // GENERATE REPORT
 const handleGenerateReport = useCallback(async() => {

  if (isGeneratingReport){
    return;
  }

  try {
    const token = localStorage.getItem('@GoJur:token');
  
    setIsGeneratingReport(true)   

    let customerListItens = 'customer=';
    customerReportList.map((customer) => {
      return customerListItens += `${customer.id};`;
    })

    let customerListItensDesc = '';
    customerReportList.map((customer) => {
      return customerListItensDesc += `${customer.label} ,`;
    })


    let advisoryTypeListItens = 'advisoryType=';
    advisoryTypeReportList.map((advisoryType) => {
      return advisoryTypeListItens += `${advisoryType.id};`
    })

    let advisoryTypeListItensDesc = '';
    advisoryTypeReportList.map((advisoryType) => {
      return advisoryTypeListItensDesc += `${advisoryType.label} ,`
    })


    const response = await api.post('/Processo/GerarRelatorioCustomBCO_ID4817', {
      customerId: customerListItens,
      customerDesc: customerListItensDesc,
      advisoryTypeId: advisoryTypeListItens,
      advisoryTypeDesc: advisoryTypeListItensDesc,
      matterTitle,
      matterType,
      privateEvent,
      matterEventQty,
      token,

    })

    setIdReportGenerate(response.data)

  } catch (err: any) {
    setIsGeneratingReport(false)   
    addToast({
      type: "info",
      title: "Falha ao gerar o relatório",
      description: err.response.data.Message
    })
  }
},[addToast, customerReportList, advisoryTypeReportList, matterEventQty, customerId, customerDesc, advisoryTypeId, advisoryTypeDesc, matterTitle, matterType, privateEvent]); 



const handleCustomerSelected = (item) => { 
    
  if (item){
    setCustomerValue(item.label)
    setCustomerDesc(item.label)
    handleListItemCustomer(item)
  }else{
    setCustomerValue('')
    LoadCustomer('reset')
    setCustomerId('')
  }
}

const handleListItemCustomer = (customer) => {

  // if is already add on list return false
  const existItem = customerReportList.filter(item => item.id === customer.id);
  if (existItem.length > 0){
    return;
  }

  setCustomerReportList(previousValues => [...previousValues, customer])
}

const handleRemoveItemCustomer = (customer) => {

  const customerListUpdate = customerReportList.filter(item => item.id != customer.id);
  setCustomerReportList(customerListUpdate)
}


const handleAdvisoryTypeSelected = (item) => { 
    
  if (item){
    setAdvisoryTypeValue(item.label)
    setAdvisoryTypeDesc(item.label)
    handleListItemAdvisoryType(item)
  }else{
    setAdvisoryTypeValue('')
    LoadAdvisoryType('reset')
    setAdvisoryTypeId('')
  }
}

const handleListItemAdvisoryType = (advisoryType) => {

  // if is already add on list return false
  const existItem = advisoryTypeReportList.filter(item => item.id === advisoryType.id);
  if (existItem.length > 0){
    return;
  }

  setAdvisoryTypeReportList(previousValues => [...previousValues, advisoryType])
}

const handleRemoveItemAdvisoryType = (advisoryType) => {

  const advisoryTypeListUpdate = advisoryTypeReportList.filter(item => item.id != advisoryType.id);
  setAdvisoryTypeReportList(advisoryTypeListUpdate)
}



  return (

    <Container>

      <HeaderPage />

      <TollBar>

        <div className="buttonReturn">
          <button
            className="buttonLinkClick"
            title="Clique para retornar a lista de processos"
            onClick={() => history.push('../../../matter/list')}
            type="submit"
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>
        </div>

      </TollBar>
    
      <Content>

        <header style={{fontSize:"15px"}}>Selecione um ou mais filtros para relatório de processos</header>

        <Form ref={formRef} onSubmit={handleSubmit(console.log)}> 

          <section id="dados">

            <div style={{ width:"100%"}}>
              <AutoCompleteSelect className="selectCustomer">
                <p>Cliente</p>  
                <Select
                  isSearchable   
                  value={customer.filter(options => options.id == customerId)}
                  onChange={handleCustomerSelected}
                  onInputChange={(term) => setCustomerTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={customer}
                />
              </AutoCompleteSelect>

              <ItemList>

                {customerReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemCustomer(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>


              <AutoCompleteSelect className="selectAdvisoryType" style={{marginTop:"1%"}}>
                <p>Serviço</p>  
                <Select
                  isSearchable   
                  value={advisoryType.filter(options => options.id == advisoryTypeId)}
                  onChange={handleAdvisoryTypeSelected}
                  onInputChange={(term) => setAdvisoryTypeTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={advisoryType}
                />
              </AutoCompleteSelect>

              <ItemList>

                {advisoryTypeReportList.map(item => {
                  return (
                    <span>
                      {item.label}
                      <p className="buttonLinkClick" onClick={() => handleRemoveItemAdvisoryType(item)}> 
                        Excluir
                      </p> 
                    </span>
                  )
                })} 

              </ItemList>

              <div style={{marginTop:"1%", marginLeft:"1%", width:"98%"}}>
                <label htmlFor="descricao">
                  Navio
                  <input
                    style={{backgroundColor:"white"}}
                    maxLength={50}
                    type="text"
                    name="marcadores"
                    value={matterTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterTitle(e.target.value)}
                    autoComplete="off"
                  />
                </label>

              </div>

              <div style={{marginTop:"2%", marginLeft:"1%", width:"98%", marginBottom:"2%"}}>
                <label htmlFor="type">
                  Últimos Acompanhamentos
                  <select
                    style={{backgroundColor:"white"}}
                    name="Type"
                    value={matterEventQty}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatterEventQty(e.target.value)}
                  >
                    <option value="01">1</option>
                    <option value="02">2</option>
                    <option value="03">3</option>
                    <option value="04">4</option>
                    <option value="05">5</option>
                    <option value="06">6</option>
                    <option value="07">7</option>
                    <option value="08">8</option>
                    <option value="09">9</option>
                    <option value="10">10</option>
                    <option value="TT">Todos</option>
                  </select>
                </label>

              </div>


            </div>


                                                                                                                              
          </section>

          <div style={{float:"right", marginTop:"5%", marginBottom:"2%", marginLeft:"80%"}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=>{ handleGenerateReport(); changeText("Gerando Relatório ") }}
              title="Clique para gerar o relatório"
            >
              <FaFileAlt />
              {buttonText}
              {isGeneratingReport && <Loader size={5} color="var(--orange)" /> }
            </button>
          </div>
    
        </Form>

        

      </Content>

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Gerando Relatório ...
          </div>
        </>
      )}
        
          
    </Container>
  );
};

export default MatterReportBCO_ID4817;
