/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import {useHistory, useLocation  } from 'react-router-dom'
import { currencyConfig, selectStyles, useDelay, FormatDate } from 'Shared/utils/commonFunctions';
import { FiSave, FiTrash } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { RiFolder2Fill, RiEraserLine } from 'react-icons/ri';
import { useModal } from 'context/modal';

import api from 'services/api';
import DatePicker from 'components/DatePicker';
import { useToast } from 'context/toast';
import { useTrigger } from 'context/trigger';
import { useForm } from 'react-hook-form';
import Loader from 'react-spinners/PulseLoader';
import { useDefaultSettings } from 'context/defaultSettings';
import { format } from 'date-fns'
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import IntlCurrencyInput from "react-intl-currency-input"
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import GridSelectProcess from '../../../Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { Container, Content, Form, Process } from './styles';
import { IBusinessData, ICustomerListData, IDefaultsProps, ISalesFunnelData, IUserResponsibleData } from '../../Interfaces/IBusiness';
import BusinessActivity from '../Activity';
import BusinessDocument from '../Documents';
import BusinessEvents from '../Events';


export interface MatterData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
  matterForumName:string;
  matterVaraName: string;
  matterVaraNum: string;
  num_WhatsApp: string;
  typeAdvisorId?: number;
}

export default function BusinessCardEdit( ) {
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const { pathname } = useLocation();
  const { addToast} = useToast();
  const { handleTriggerCaller, triggerCaller } = useTrigger();
  const {isConfirmMessage, isCancelMessage, handleCancelMessage,handleConfirmMessage,handleCheckConfirm, handleCaller, caller } = useConfirmBox();
  const { handleSubmit} = useForm() 
  const { handleUserPermission } = useDefaultSettings(); 
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [businessId, setBusinessId] = useState<number>(0)
  const [salesFunnelId, setSalesFunnelId] = useState<number>(0)
  const [salesFunnelStepId, setSalesFunnelStepId] = useState<number>(0)
  const [userResponsibleId, setUserResponsibleId] = useState<number>(0)
  const [customerId, setCustomerid] = useState<number>(0)
  const [salesFunnelList, setSalesFunnelList] = useState<ISalesFunnelData[]>([])
  const [customerList, setCustomerList] = useState<ICustomerListData[]>([])
  const [salesFunnelStepsList, setSalesFunnelStepsList] = useState<ISalesFunnelData[]>([])
  const [userResponsibleList, setUserResponsibleList] = useState<IUserResponsibleData[]>([])
  const [status, setStatus] = useState<string>('EA')
  const [userNameTerm, setUserNameTerm] = useState<string>('')
  const [userSalesFunnelTerm, setSalesFunnelTerm] = useState<string>('')
  const [userSalesFunnelStepTerm, setSalesFunnelStepTerm] = useState<string>('')
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [customerWhatsApp, setCustomerWhatsApp] = useState<string>('')
  const [customerPhone1, setCustomerPhone1] = useState<string>('')
  const [customerPhone2, setCustomerPhone2] = useState<string>('')
  const [businessDescription, setBusinessDescription] = useState<string>('')
  const [businessValue, setBusinessValue] = useState<number>()
  const [businessOrder, setBusinessOrder] = useState<number>()
  const [businessObservation, setBusinessObservation] = useState<string>('')
  const [businessStartDate, setBusinessStartDate] = useState<string>(FormatDate(new Date(new Date().setFullYear(new Date().getFullYear())), 'yyyy-MM-dd'))
  const [businessEndDate, setBusinessEndDate] = useState<string>('')
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false)
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isDeleting , setIsDeleting] = useState<boolean>(); // set trigger for show loader
  const [funnelRedirect, setFunnelRedirect] = useState<boolean>(false)
  const [showCustomerSelect, setShowCustomerSelect] = useState<boolean>(false)

  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData);
  const [processTitle, setProcessTitle] = useState('Associar Processo')
  const [matterId, setMatterId] = useState('')
  const [matterAttachedModal, setMatterAttachedModal] = useState(false)
  const {handleSelectProcess, selectProcess, matterSelected, openSelectProcess } = useModal();

  const [matterRedirect, setMatterRedirect] = useState<boolean>(false)

  // first initialization
  useEffect(() => {    
    Initialize();
  }, [])


  useEffect(() => {
    if(matterSelected)
    {
      setMatterId(matterSelected.matterId.toString())
      setProcessTitle(`${matterSelected.matterNumber} - ${matterSelected.matterCustomerDesc} x ${matterSelected.matterOppossingDesc}`)
      selectProcess(null)
    }

    setMatterAttachedModal(false)
  }, [matterSelected])


  useEffect(() => {
    if(openSelectProcess == "Close")
    {
      setMatterAttachedModal(false)
    }
  }, [openSelectProcess])


  const Initialize = () => {
    // set business id
    setBusinessId(Number(pathname.substr(24)))

    // Get customer id
    const businessCustomerId = Number(localStorage.getItem('@GoJur:businessCustomerId'))
    setCustomerid(businessCustomerId)

    // Load funnel
    LoadSalesFunnel()
    
    // Load users
    LoadResponsibleUsers();  

    // When is edit by sales funnel redirect
    const redirectByFunnel = localStorage.getItem('@Gojur:funnelRedirect')
    if (redirectByFunnel == "S"){
      setFunnelRedirect(true)      
      localStorage.removeItem('@Gojur:funnelRedirect')
    }    

    // When is edit by sales funnel redirect
    const redirectBySearchFunnel = localStorage.getItem('@Gojur:funnelRedirectSearch')
    if (redirectBySearchFunnel){
      setFunnelRedirect(true)      
    }    

    // When is edit by sales funnel redirect
    const redirectByMatter = localStorage.getItem('@Gojur:matterRedirect')
    if (redirectByMatter == "S"){
      setMatterRedirect(true)      
      localStorage.removeItem('@Gojur:matterRedirect')
    }    
  }


  useEffect(() => {
    LoadSalesFunnelSteps()
  }, [salesFunnelId])


  useEffect(() => {
    if (businessId > 0 && isLoading){
      BusinessEdit()
    }
    else{
      // setBusinessStartDate(format(new Date(), 'yyyy-MM-dd'))

      // When is new include by sales funnel redirect
      // defines funnel and step by default and show select customer
      const createByFunnelJSON = localStorage.getItem('@Gojur:funnelStep')

      if (createByFunnelJSON != undefined && createByFunnelJSON != null && salesFunnelList.length > 0){
        const salesFunnelStep = JSON.parse(createByFunnelJSON)
        setSalesFunnelId(salesFunnelStep.salesFunnelId)
        setSalesFunnelStepId(salesFunnelStep.id)
        setFunnelRedirect(true)         // when save or cancel redirect to funnel step
        setShowCustomerSelect(true)     // when include by funnel step return to list funnel
        LoadCustomers()                 // Load customers
        localStorage.removeItem('@Gojur:funnelStep')
      }

      GetCustomerName()
    }
    
  }, [businessId, salesFunnelList, salesFunnelStepsList ])


  const GetCustomerName = async()=> {
    const businessCustomerId = localStorage.getItem('@GoJur:businessCustomerId')

    if (businessCustomerId){
      const response = await api.get<IBusinessData>('Clientes/SelecionarNome', {
        params:{
          token,
          id: businessCustomerId
        }
      })

      setCustomerName(response.data.nomCustomer)
      setCustomerWhatsApp(response.data.customerWhatsApp)
      setCustomerPhone1(response.data.customerPhone1)
      setCustomerPhone2(response.data.customerPhone2)
    }
  }


  // Call default parameters by company 
  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission]); 


  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')

      handleUserPermission(userPermissions[0].value.split('|'));
    }
    catch (err:any) {
      console.log(err);
    }
  }
  

  useEffect(() => {
    if (isCancelMessage){
      handleCancelMessage(false)
      setIsDeleting(false)
    }
  }, [isCancelMessage])   


  useEffect(() => {
    if (!isDeleting){
      handleConfirmMessage(false)
      handleCaller('')
      handleCheckConfirm(false)
    }
  }, [isDeleting]) 

  
  useEffect(() => {
    if (isConfirmMessage && caller=="businessList"){
      handleDelete();
    }
  }, [isConfirmMessage])   


  const BusinessEdit = async () => {
    const response = await api.get<IBusinessData>('NegocioCliente/Selecionar', {
      params:{
        token,
        id: businessId
      }
    })

    setBusinessId(response.data.id)
    setSalesFunnelId(response.data.salesFunnelId)
    setSalesFunnelStepId(response.data.salesFunnelStepId)
    setUserResponsibleId(response.data.responsibleUserId)
    setCustomerid(response.data.customerId)
    setBusinessDescription(response.data.description)
    setBusinessValue(response.data.businessValue)
    setStatus(response.data.status)
    setCustomerName(response.data.nomCustomer)
    setCustomerWhatsApp(response.data.customerWhatsApp)
    setCustomerPhone1(response.data.customerPhone1)
    setCustomerPhone2(response.data.customerPhone2)
    setBusinessOrder(response.data.numOrder)

    if (response.data.startDate != null){
      setBusinessStartDate(format(new Date(response.data.startDate), 'yyyy-MM-dd'))
    }

    if (response.data.finishDate != null){
      setBusinessEndDate(format(new Date(response.data.finishDate), 'yyyy-MM-dd'))
    }

    console.log(response.data)

    if(response.data.matterId != '0')
      {
        setMatterId(response.data.matterId)
        setProcessTitle(`${response.data.matterNumber} - ${response.data.matterCustomerDesc} x ${response.data.matterOpposingDesc}`)
      }

    setBusinessObservation(response.data.observation)

    setIsLoading(false)
  }

  
  // delay load combo user responsible
  useDelay(() => {        
    if (userNameTerm.length > 0){
      LoadResponsibleUsers()
    }
  }, [userNameTerm], 1000)


  // delay load combo funnel responsible
  useDelay(() => {        
    if (userSalesFunnelTerm.length > 0){
      LoadSalesFunnel()
    }
  }, [userSalesFunnelTerm], 1000)


  // delay load combo funnel step responsible
  useDelay(() => {        
    if (userSalesFunnelStepTerm.length > 0){
      LoadSalesFunnelSteps()
    }
  }, [userSalesFunnelStepTerm], 1000)


  // delay load combo funnel step responsible
  useDelay(() => {    
    if (customerSearchTerm.length > 0){
      LoadCustomers()
    }
  }, [customerSearchTerm], 1000)
  

  const LoadCustomers = async () => {
    setIsLoadingComboData(true)
      
    const userCustomerList: ICustomerListData[] =[]
    await api.post('Clientes/ListarComboBox', {
      token,
      page:0,
      rows:50,
      filterClause:customerSearchTerm
    })
    .then(response => {
      response.data.map((item) => {
        userCustomerList.push({
          id:item.id,
          label:item.value
        })
  
        return userCustomerList;
      })
    })
  
    setIsLoadingComboData(false)
    setCustomerList(userCustomerList)
  }


  const LoadResponsibleUsers = async () => {
    setIsLoadingComboData(true)

    const userListResponsible: IUserResponsibleData[] =[]

    await api.post('Usuario/ListarUsuarios', {
      token,
      userName:userNameTerm,
      removeCurrentUser:false
    })
    .then(response => {
      response.data.map((item) => {
        userListResponsible.push({
          id:item.id,
          label:item.value
        })

        return userListResponsible;
      })
    })

    setIsLoadingComboData(false)
    setUserResponsibleList(userListResponsible)
  }
  

  const LoadSalesFunnel = async () => {
    setIsLoadingComboData(true)

    const response = await api.get<ISalesFunnelData[]>('FunilVendas/Listar', {
      params:{
        token,
        filterClause: userSalesFunnelTerm
      }
    })

    setIsLoadingComboData(false)
    setSalesFunnelList(response.data)
  }


  const LoadSalesFunnelSteps = async () => {
    setIsLoadingComboData(true)

    const response = await api.get<ISalesFunnelData[]>('FunilVendasEtapas/Listar', {
      params:{
        token,
        salesFunnelId,
        filterClause: userSalesFunnelStepTerm
      }
    })

    setIsLoadingComboData(false)
    setSalesFunnelStepsList(response.data)
  }


  const handleSave = useCallback(async () => {
    handleTriggerCaller('saveActivities')
  }, [triggerCaller])


  useEffect(() => {
    if (triggerCaller == 'saveBusiness'){
      handleSaveBusiness();
    }
  }, [triggerCaller])


  const handleSaveBusiness = async () => {
    const validationResult = ValidateSave();

    if (!validationResult){ 
      return false ; 
    }

    setisSaving(true)

    const data = {
      "id": businessId ,
      "customerId": customerId,
      "salesFunnelId": salesFunnelId,
      "salesFunnelStepId": salesFunnelStepId,
      "responsibleUserId": userResponsibleId,
      "description": businessDescription,
      "observation": businessObservation,
      "businessValue": businessValue,
      "startDate": businessStartDate,
      "finishDate": businessEndDate,
      "numOrder":businessOrder,
      "status": status,
      "matterId": matterId,
      "token": token
    }

    await api.put('NegocioCliente/Salvar', data)

    addToast({
      type: 'success',
      title: "Operação realizada com sucesso",
      description: `O Negócio foi salvo com sucesso`
    });
    
    handleCancel();
    handleTriggerCaller('')
    setisSaving(false);
  }


  const handleDelete  = useCallback(async() => {
    try {
      const token = localStorage.getItem('@GoJur:token');

      await api.delete('/NegocioCliente/Deletar', {
        params:{
          id:businessId,
          token
        }
      })

      addToast({
        type: "success",
        title: "Negócio Deletado",
        description: "O negócio vinculado ao cliente foi deletado do catálogo"
      })
       
      setIsDeleting(false)
      handleCancel();   

    }
    catch (err) {
      setIsDeleting(false)
      addToast({
        type: "info",
        title: "Falha ao apagar o negocio",
        description:  "Não foi possível deletar este registro"
      })
    }
  }, [addToast, history,businessId]);


  const handleCancel = () => {
    
    console.log('MatterRedirect: ', matterRedirect)
    
    if (matterRedirect){
      history.push('../../../matter/list')
    }
    else if (!funnelRedirect){
      const businessCustomerId = localStorage.getItem('@GoJur:businessCustomerId')
      if (businessCustomerId != null){
        history.push(`/customer/edit/${ businessCustomerId}` )
      }
      else{
        history.push(`../../../CRM/salesFunnel/`)
      }
    }
    else{
      history.push(`../../../CRM/salesFunnel/`)
    }
  }


  const ValidateSave = () => {
    let errorList = '';

    if (businessDescription === ''){
      errorList += 'Descrição do negócio | '
    }

    if (salesFunnelId === 0){
      errorList += 'Funil de vendas | '
    }

    if (salesFunnelStepId === 0){
      errorList += 'Etapa do funil de vendas | '
    }

    if (businessStartDate === ''){
      errorList += 'Data de início | '
    }

    if (funnelRedirect && customerId === 0){
      errorList += 'Cliente | '
    }

    if (errorList.length > 0){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: `${errorList.substring(0, errorList.length - 3)} não informado`
      });
    }

    if ((businessEndDate??"").length > 0 && status === 'EA'){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: `Ao informar uma data de encerramento é necessário alterar o status Em Andamento `
      });

      return false;
    }
    
    if ((businessEndDate??"").length === 0 && (status != 'EA' && status != 'AR')){
      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: `Informe uma data de encerramento para esta oportunidade de negócio `
      });

      return false;
    }

    return errorList.length == 0;
  }


  const statusList = [
    { id:'EA', label: 'Em Andamento' },
    { id:'FE', label: 'Fechado (Êxito)'},
    { id:'PE', label: 'Perdido'},
    { id:'AR', label: 'Arquivado'},
  ]


  const handleSalesFunell = (item) => { 
    if (item){
      setSalesFunnelId(item.id)
    }
    else{
      setSalesFunnelId(0)
      LoadSalesFunnel()
    }
  }


  const handleCustomerList = (item) => { 
    if (item){
      setCustomerid(item.id)
    }
    else{
      setCustomerid(0)
      LoadCustomers()
    }
  }


  const handleSalesFunellStep = (item) => { 
    if (item){
      setSalesFunnelStepId(item.id)
    }
    else{
      setSalesFunnelStepId(0)
      LoadSalesFunnelSteps()
    }
  }


  const handleUserResponsible = (item) => { 
    if (item){
      setUserResponsibleId(item.id)
    }
    else{
      setUserResponsibleId(0)
      LoadResponsibleUsers()
    }
  }


  const handleStatus = (item) => { 
    if (item){
      setStatus(item.id)
    }
    else{
      setStatus('AB')
    }
  }


  const handleStartDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBusinessStartDate(event.target.value)
  },[]);
  

  const handleEndDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBusinessEndDate(event.target.value)
  },[]); 


  const handleBusinessValue = (event, value, maskedValue) => {
    event.preventDefault();
    setBusinessValue(value)
  };


  const handleOpenWhatsApp = useCallback(number => {
    const message = 'Olá,';
    window.open(
      `https://web.whatsapp.com/send?phone=+55${number}&text=${message}`,
      '_blank',
    );
  }, []);


  const handleGridSelectProcess = useCallback(() => {
    if (processTitle === 'Associar Processo') {
      setMatterAttachedModal(true)
      handleSelectProcess("Open")
    }
  }, [handleSelectProcess, processTitle])


  return (
    <Container>
            
      {isDeleting && (
        <ConfirmBoxModal
          title="Excluir Registro"
          useCheckBoxConfirm
          caller="businessList"
          message="Confirma a exclusão desta oportunidade de negócio ?"
        />
      )}

      {matterAttachedModal &&(<GridSelectProcess />)}

      <Content>
        <Form ref={formRef} onSubmit={handleSubmit(handleSave)}> 
          {showCustomerSelect && (
            <section>
              <label className="textInputBig">
                Cliente * 
                <Select
                  isSearchable   
                  value={customerList.filter(options => options.id == (customerId? customerId.toString(): ''))}
                  onChange={handleCustomerList}
                  onInputChange={(term) => setCustomerSearchTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}              
                  options={customerList}
                />
              </label>
            </section>
          )}

          {(!showCustomerSelect) && (
            <section>
              <label className="textInputMedium">
                Cliente
                <input type="text" value={customerName} disabled style={{opacity:'0.7'}} />
              </label>

              <label>
                Whats App
                <div>
                  <input type="text" value={customerWhatsApp} disabled style={{opacity:'0.7', width:'95%', float:'left'}} />
                  <div className='whatsButtonDiv'>
                    <button
                      type="button"
                      className='whats'
                      style={{cursor: "pointer"}}
                      onClick={() => handleOpenWhatsApp(customerWhatsApp)}
                      title="Clique aqui para enviar mensagem para o WhatsApp do seu cliente"
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
              </label>

              <label className="textInputMedium">
                Telefone 1
                <input type="text" value={customerPhone1} disabled style={{opacity:'0.7'}} />
              </label>

              <label className="textInputMedium">
                Telefone 2
                <input type="text" value={customerPhone2} disabled style={{opacity:'0.7'}} />
              </label>
            </section>
          )}

          <section>
            <label htmlFor="description" className="textInputBig">
              Descrição *
              <input 
                type="text"
                value={businessDescription}
                name="description"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBusinessDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
          </section>

          <section>
            <label>
              Funil de Vendas * 
              <Select
                isSearchable   
                value={salesFunnelList.filter(options => options.id == (salesFunnelId? salesFunnelId.toString(): ''))}
                onChange={handleSalesFunell}
                onInputChange={(term) => setSalesFunnelTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={salesFunnelList}
              />
            </label>

            <label>
              Etapa *
              <Select
                isSearchable   
                value={salesFunnelStepsList.filter(options => options.id == (salesFunnelStepId? salesFunnelStepId.toString(): ''))}
                onChange={handleSalesFunellStep}
                onInputChange={(term) => setSalesFunnelStepTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={salesFunnelStepsList}
              />
            </label>
          </section>

          <section className="fourColumns">
            <label htmlFor="value" className="required">             
              Valor
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                value={businessValue}
                onChange={handleBusinessValue}
              />          
            </label>

            <label style={{width:'105%'}}>
              <DatePicker
                title="Início"
                onChange={handleStartDate}
                value={businessStartDate}
              />
            </label>          

            <label style={{width:'105%'}}>
              <DatePicker
                title="Encerramento"
                onChange={handleEndDate}
                value={businessEndDate}
              />
            </label>  

            <label>
              Status
              <Select
                isSearchable   
                value={statusList.filter(options => options.id == (status? status.toString(): ''))}
                onChange={handleStatus}
                placeholder=""
                options={statusList}
                styles={selectStyles}
              />
            </label>
          </section>

          <section>
            <Process id='Process'>
              {processTitle === 'Associar Processo' && (
                <button type="button" id="associar" onClick={handleGridSelectProcess}>
                  <p>{processTitle}</p>
                </button>
              )}
  
              {processTitle !== 'Associar Processo' && (
                <>
                  <span style={{fontSize:'0.625rem', fontWeight:500, fontFamily:'montserrat'}}>Processo:&nbsp;</span>
                  <span style={{fontSize:'0.625rem', fontWeight:500, fontFamily:'montserrat'}}>{processTitle}</span>
                </>
              )}
  
              {processTitle === 'Associar Processo' && (
                <button type="button" onClick={handleGridSelectProcess}>
                  <RiFolder2Fill />
                </button>
              )}
  
              {processTitle !== 'Associar Processo' && (
                <button type="button" onClick={() => {setProcessTitle('Associar Processo'); setAppointmentMatter(undefined); setMatterId('0'); }}>
                  &nbsp;&nbsp; <RiEraserLine />
                </button>
              )}
            </Process>
            
            <label>
              Responsável
              <Select
                isSearchable   
                value={userResponsibleList.filter(options => options.id == (userResponsibleId? userResponsibleId.toString(): ''))}
                onChange={handleUserResponsible}
                onInputChange={(term) => setUserNameTerm(term)}
                isClearable
                placeholder=""
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={userResponsibleList}
              />
            </label>
            
            <label htmlFor="obs">
              Observações
              <textarea 
                onChange={(e) => setBusinessObservation(e.target.value)}
                value={businessObservation}
                style={{minHeight: '7rem'}}
              />
            </label>
          </section>

          <div className='lineDivisor' />

          {/* DOCUMENT LIST */}
          <BusinessDocument /> 
          
          <div className='lineDivisor' />

          {/* ACTIVITY LIST */}
          <BusinessActivity />          
          
          <div className='lineDivisor' />

          {/* ACTIVITY EVENTS */}
          <BusinessEvents callbackFunction={{customerName}} />
                   
          <div className='lineDivisor' />

          <div style={{float: 'right'}}>
            <button className="buttonClick" type="submit">
              <FiSave />
              Salvar    
              {isSaving ? <Loader size={5} color="#f19000" /> : null}            
            </button>

            {businessId > 0  && (
              <button className="buttonClick" type="button" onClick={() => setIsDeleting(true)}>
                <FiTrash />
                Excluir     
                {isDeleting ? <Loader size={5} color="#f19000" /> : null}           
              </button>
            )}
            
            <button className="buttonClick" type="button" onClick={handleCancel}>
              <MdBlock />
              Fechar                
            </button>              
          </div>        
        </Form>
      
        <br />
        <br />
      </Content>
    </Container>
  )
}