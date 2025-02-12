/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiTrash, FiX } from 'react-icons/fi';
import { BiSave } from 'react-icons/bi';
import { IoIosPaper } from 'react-icons/io';
import api from 'services/api';
import { MdHelp } from 'react-icons/md';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import DatePicker from 'components/DatePicker';
import Select from 'react-select';
import { parcelas, parcelasDatas, financialReminders } from 'Shared/utils/commonListValues';
import { selectStyles, currencyConfig, useDelay } from 'Shared/utils/commonFunctions';
import IntlCurrencyInput from "react-intl-currency-input"
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { format } from 'date-fns';
import LogModal from 'components/LogModal';
import ModalOptions from 'components/ModalOptions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { ISelectData } from '../Interfaces/IFinancial';
import {  Content, Modal } from './styles';
import { GetDefaultAccount, ListAccount } from '../../Matter/EditComponents/Services/MatterFinanceData';

const FinancialModal = (props) => {
  const {movementId, typeMovement, matterId, handleCloseModalAndReload, handleCloseModal, handleIsSaving} = props.callbackFunction
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
  const { isMOBILE } = useDevice();
  const [movementDate, setMovementDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [movementValue, setMovementValue] = useState<number>();
  const [accountId, setAccountId] = useState<number>(0);
  const [movementType, setMovementType] = useState<string>('');
  const [taxInvoice, setTaxInvoice] = useState<string>('');
  const [actionSave, setActionSave] = useState<string>('');
  const [movementParcelas, setMovementParcelas] = useState('1');
  const [movementParcelasDatas, setMovementParcelasDatas] = useState('M');
  const [reminders, setReminders] = useState('00');
  const [movementDescription, setMovementDescription] = useState('');
  const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [categoryList, setCategoryList] = useState<ISelectData[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryTerm, setCategoryTerm] = useState('');
  const [centerCostList, setCenterCostList] = useState<ISelectData[]>([]);
  const [centerCostId, setCenterCostId] = useState('');
  const [centerCostTerm, setCenterCostTerm] = useState('');
  const [status, setStatus] = useState('');
  const [peopleList, setPeopleList] = useState<ISelectData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [ listAccount, setListAccount] = useState<ISelectData[]>([])
  const [ accountTerm, setAccountTerm] = useState<string>('')
  const [peopleTerm, setPeopleTerm] = useState('');
  const [flgReembolso, setFlgReembolso] = useState<boolean>(false);
  const [flgNotifyPeople, setFlgNotifyPeople] = useState<boolean>(false);
  const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
  const [showParcelasDatas, setShowParcelasDatas] = useState<boolean>(false);
  const [showNotifyPeople, setShowNotifyPeople] = useState<boolean>(false);
  const [checkPeopleList, setCheckPeopleList] = useState<boolean>(false);
  const [showLog, setShowLog] = useState(false);

  // initialization
  useEffect (() => {
    Initialize()
  },[])


  const Initialize = async () => {
    handleIsSaving(true)
    await LoadAccount();
    LoadPaymentForm()
    LoadCategory()
    LoadCenterCost()
    LoadPeople()
    OpenModal();
  }


  const OpenModal = async () => {
    if (movementId > 0){
      LoadMovement()
    }
    else{
      setMovementType(typeMovement)
      handleIsSaving(false);
      setIsLoading(false)
    }
  }


  const LoadMovement = async () => {
    try {

      const response = await api.get('/Financeiro/Editar', {
        params:{
          id: movementId,
          token
        }
      })

      setMovementDate(format(new Date(response.data.dta_Movimento), "yyyy-MM-dd"))
      setMovementValue(response.data.vlr_Movimento)
      setMovementType(typeMovement)
      setMovementParcelas(response.data.qtd_Parcelamento.toString())
      setMovementParcelasDatas(response.data.Periodicidade)
      setPaymentFormId(response.data.cod_FormaPagamento)
      setCategoryId(response.data.cod_Categoria)
      setCenterCostId(response.data.cod_CentroCusto)
      setTaxInvoice(response.data.num_NotaFiscal)
      setMovementDescription(response.data.des_Movimento)
      setSelectedPeopleList(response.data.UserList)
      setStatus(response.data.flg_Status)
      setFlgNotifyPeople(response.data.flg_NotificaPessoa)
      setReminders(response.data.Lembrete)
      setShowNotifyPeople(response.data.UserList.length > 0 && response.data.Lembrete != null)
      setFlgReembolso(response.data.flg_Reembolso)
      setShowParcelasDatas(response.data.qtd_Parcelamento != "1")
      setAccountId(response.data.cod_Conta)
      handleIsSaving(false);
      setIsLoading(false)
    } catch (err:any) {
      setIsLoading(false)
      handleIsSaving(false);
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data.Message
      })
    }
  }


  const handleAccountChange = async (item) => {

    if (item){
      setAccountId(item.id)
    }else{
      setAccountId(0)
      await ListAccount('')
    }
  }


  const LoadDefaultAccount = async() => {

    const response = await GetDefaultAccount()
    setAccountId(Number(response))

  }


  const LoadAccount = async() => {

    // list all accounts
    const response = await ListAccount(accountTerm)

    const listAccounts: ISelectData[] = [     ];
    response.data.map(item => {
      listAccounts.push({
        id: item.id,
        label: item.value
      })

      return listAccount
    })

    setListAccount(listAccounts)

    // load default account
    if (movementId === 0)
      await LoadDefaultAccount();
  }


  useDelay(() => {
    if (accountTerm.length > 0 && !isLoading){
      LoadAccount()
    }
  }, [accountTerm], 750)


  useDelay(() => {
    if (peopleTerm.length > 0 && !isLoading){
      LoadPeople()
    }
  }, [peopleTerm], 750)


  const LoadPaymentForm = async () => {
    try {
      const  response = await api.get<ISelectData[]>('FormaDePagamento/ListarPorFiltro', {
        params:{filterClause: paymentFormTerm, token}
      })

      setPaymentFormList(response.data)
    } catch (err:any) {
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data
      })
    }
  }


  const LoadCategory = async () => {
    try {

      const response = await api.get<ISelectData[]>('/Categoria/ListarPorDescrição', {
        params:{
          rows: 50,
          filterClause: categoryTerm,
          token
        }
      })

      setCategoryList(response.data)

    } catch (err:any) {

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data
      })

    }
  }


  const LoadCenterCost = async () => {

    try {

      const response = await api.get<ISelectData[]>('/CentroDeCusto/Listar', {
        params:{
          page: 0,
          rows: 0,
          filterClause: centerCostTerm,
          token
        }
      })

      setCenterCostList(response.data)

    } catch (err:any) {

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data
      })

    }
  }


  const LoadPeople = async () => {
    try {

      const response = await api.get<ISelectData[]>('/Pessoas/ListarPorEmpresa', {
        params:{
          filterClause: peopleTerm,
          peopleTypeSelected: 'CLTO',
          token
        }
            })

      setPeopleList(response.data)

    } catch (err:any) {

      addToast({
        type: "info",
        title: "Operação não realizada",
        description: err.response.data
      })
    }
  }


  const Validate =() => {

    let isValid = true;

    // avoid click many times 
    if (isSaving){
      return;
    }

    if (accountId == 0)
    {
      addToast({
        type: "info",
        title: "Preencher campo",
        description: "O campo conta bancária não foi preenchido"
      })
      isValid = false;
    }

    if (categoryId == '')
    {
      addToast({
        type: "info",
        title: "Preencher campo",
        description: "O campo categoria deve ser preenchido"
      })
      isValid = false;
    }


    if (!movementDate)
      {
      addToast({
        type: "info",
        title: "P    reencher campo",
        description: "O campo vencimento deve ser preenchido"
      })
      isValid = false;
    }

    if (movementValue == 0)
    {
      addToast({
        type: "info",
        title: "Preencher campo",
        description: "O campo valor deve ser preenchido"
      })
      isValid = false;
    }

    if (movementDescription == '')
    {
      addToast({
        type: "info",
        title: "Preencher campo",
        description: "O campo descrição deve ser preenchido"
      })
      isValid = false;
    }

    if (movementParcelas !=  '1' && actionSave.length == 0 && movementId != 0){
      setShowModalOptions(      true)

      isValid =false;
    }

    return isValid;
  }


  const handleSave = useCallback(async() => {
    try {

      if  (!Validate()) return;

      setIsSaving(true)
      setShowModalOptions(false)

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      handleIsSaving(true)

      await api.post('/Financeiro/Salvar', {
        cod_Movimento: movementId,
        dta_Movimento: movementDate,
        vlr_Movimento: movementValue,
        tpo_Movimento : movementType,
        qtd_Parcelamento: movementParcelas,
        Periodicidade: movementParcelasDatas,
        cod_FormaPagamento: paymentFormId,
        cod_Categoria: categoryId,
        cod_CentroCusto: centerCostId,
        num_NotaFiscal: taxInvoice,
        des_Movimento: movementDescription,
        peopleIds: peopleIdsItems,
        flg_NotificaPessoa: flgNotifyPeople,
        Lembrete: reminders,
        editChild: actionSave.length == 0? "justOne": actionSave,   // Action save is used to define if is save one, all or next, when is empty consider only one
        flg_Reembolso: flgReembolso,
        cod_Processo: matterId,
        cod_Conta: accountId,
        flg_Status: status,
        token
      })

      handleCloseModalAndReload()

      addToast({
        type: "success",
        title: "Movimento salvo",
        description: "O movimento foi salvo no sistema"
      })

    } catch (err:any) {

      setShowModalOptions(false)
      handleIsSaving(false)
      addToast({
        type: "info",
        title: "Falha ao salvar movimento.",
        description: err.response.data.Message
      })

      setIsSaving(false)
    }

  },[isSaving, selectedPeopleList, movementId, movementDate, movementValue, movementType, movementParcelas, movementParcelasDatas, paymentFormId, categoryId, centerCostId, taxInvoice, movementDescription, flgNotifyPeople, reminders, actionSave, flgReembolso, matterId, accountId, token]);


  const handleMovementDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setMovementDate(event.target.value)
  },[]);


  const handlePaymentFormSelected = (item) => {
    if (item){
      setPaymentFormId(item.id)
    }else{
      setPaymentFormId('')
      LoadPaymentForm()
    }
  }


  const handleCategorySelected = (item) => {
    if (item){
      setCategoryId(item.id)
    }else{
      setCategoryId('')
      LoadCategory()
    }
  }


  const handleCenterCostSelected = (item) => {
    if (item){
      setCenterCostId(item.id)
    }else{
      setCenterCostId('')
      LoadCenterCost()
    }
  }


  const handlePeopleSelected = (item) => {
    if (item){
      setPeopleId(item.id)
      setShowNotifyPeople(reminders != '00')
      handleListItemPeople(item)
    }else{
      setPeopleId('')
      LoadPeople()
    }
  }


  const handleListItemPeople = (people) => {
    const existItem = selectedPeopleList.filter(item => item.id === people.id);

    if (existItem.length > 0){
      return;
    }

    selectedPeopleList.push(people)
    setSelectedPeopleList(selectedPeopleList)
    setCheckPeopleList(!checkPeopleList)
  }


  const handleRemoveItemPeople = (people) => {
    const selectedPeopleUpdate = selectedPeopleList.filter(item => item.id != people.id);
    setSelectedPeopleList(selectedPeopleUpdate)
    setCheckPeopleList(!checkPeopleList)
    setShowNotifyPeople(selectedPeopleUpdate.length > 0 && reminders != '00')
  }


  const handleValue = (event, value, maskedValue) => {
    event.preventDefault();

    setMovementValue(value)
  };


  const handleCallback = (actionSave: string) => {
    setActionSave(actionSave)
  }


  const handleChangeParcelas = (id: string) => {

    setMovementParcelas(id)
    setShowParcelasDatas(id != '1')

  }


  const handleReminders = (item:any) => {
    const value =item? item.id: ''
    setReminders(value)

    const showNotifyPeople = (value != '00' && value != '') && selectedPeopleList.length > 0;
    setShowNotifyPeople(showNotifyPeople)
  }


  useEffect (() => {

    if (actionSave.length > 0){
      handleSave();
    }

  }, [actionSave])


  const handleLogOnDisplay = useCallback(async () => {
    setShowLog(true);
  }, []);


  const handleCloseLog = () => {
    setShowLog(false)
  }


  return (
    <>
      <Modal id="modalFinance" show>
        <div>
          <div className='menuTitle'>
            {typeMovement == "R" && <span>RECEITA</span> }
            {typeMovement == "D" && <span>DESPESA</span> }
          </div>

          <div className='menuSection'>
            <FiX onClick={(e) => handleCloseModal()} />
          </div>
        </div>

        <br /><br /><br />

        <Content id='Content'>

          <div id='account' style={{width:'92%', marginLeft:'10px'}}>

            <label className='comboData'>
              Conta
              <Select
                isSearchable
                isClearable
                value={accountId == 0? null: listAccount.find(item => item.id === accountId.toString())}
                onChange={handleAccountChange}
                onInputChange={(term) => setAccountTerm(term)}
                placeholder="Selecione uma conta bancária"
                loadingM
                essage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={listAccount}
              />
            </label>
          </div>

          <div id='FirstElements' style={{width:'95%', height:'80px', marginLeft:'-0.5%'}}>

            <div id='FL' style={{width:'100%'}}>

              <div id='FL1' style={{width:'22.5%', float:'left', marginTop:'-25px', marginLeft:'2%'}}>
                <label htmlFor='Data'>
                  <DatePicker
                    title="Vencimento"
                    onChange={handleMovementDate}
                    value={movementDate}
                  />
                </label>
              </div>

              <div id='FL2' style={{width:'22%', float:'left', marginTop:'11px', marginLeft:'1%'}}>
                <label htmlFor="valor">
                  Valor
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={movementValue}
                    onChange={handleValue}
                  />
                </label>
              </div>

            </div>

            <div id='FR' style={{width:'100%'}}>
              <div id='FR3' style={{width:'21%', float:'left', marginTop:'6px', marginLeft:'2.3%'}}>
                <label htmlFor="parcela">
                  Parcelas ?
                  <Select
                    autoComplete="off"
                    styles={selectStyles}
                    value={parcelas.filter(options => options.id === movementParcelas)}
                    onChange={(item) => handleChangeParcelas(item? item.id: '')}
                    options={parcelas}
                  />
                </label>
              </div>

              {showParcelasDatas && (
                <>
                  <MdHelp
                    className='help'
                    style={{marginTop: '35px', marginLeft: '5px'}}
                    title="Este lançamento já foi parcelado anteriormente, não pode ser alterado o parcelamento"
                  />
                  <div
                    id='FR4'
                    style={{
                    width:'24%',
                    float:'left',
                    marginTop:'6px',
                    marginLeft:'2%',
                    pointerEvents: ((movementParcelas != '1' && movementId != 0)? 'none': 'auto'),
                      opacity:((movementParcelas != ' 1' && movementId != 0)? '0.5': '1')
                  }}
                  >
                    <label htmlFor="parcelaData">
                      &nbsp;
                      <Select
                        autoComplete="off"
                        styles={selectStyles}
                        placeholder="Selecionar"
                        value={parcelasDatas. filter(options => options.id === movementParcelasDatas)}
                        onChange={(item) => setMovementParcelasDatas(item? item.id: '')}
                        options={parcelasDatas}
                      />
                    </label>
                  </div>
                </>
              )}
            </div>

          </div>

          <div id='SecondElements' style={{width:'100%', height:'80px'}}>

            <div id='SE' style={{width:'100%'}}>
              <div id='SE1' style={{width:'20.5%', float:'left', height:'80px', marginLeft:'1%'}}>

                <AutoCompleteSelect className="category">
                  <p>Categoria</p>
                  <Select
                    isSearchable
                    isClearable
                    value={categoryList.filter(options => options.id == categoryId)}
                    onChange={handleCategorySelected}
                    onInputChange={(term) => setCategoryTerm(term)}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={categoryList}
                  />
                </AutoCompleteSelect>

              </div>

              <div id='SE2' style={{width:'22%', float:'left', height:'80px', marginLeft:'1.6%'}}>

                <AutoCompleteSelect className="paymentForm">
                  <p>Forma Pagto.</p>
                  <Select
                    isSearchable
                    isClearable
                    value={paymentFormList.filter(options => options.id == paymentFormId)}
                    onChange={handlePaymentFormSelected}
                    onInputChange={(term) => setPaymentFormTerm(term)}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={paymentFormList}
                  />
                </AutoCompleteSelect>

              </div>
            </div>

            <div id='SD' style={{width:'100%'}}>
              <div id='SD3' style={{width:'21%', float:'left', height:'80px', marginLeft:'1.5%'}}>
                <AutoCompleteSelect className="centerCost">
                  <p>Centro de Custo</p>
                  <Select
                    isSearchable
                    isClearable
                    value={centerCostList.filter(options => options.id == centerCostId)}
                    onChange={handleCenterCostSelected}
                    onInputChange={(term) => setCenterCostTerm(term)}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={centerCostList}
                  />
                </AutoCompleteSelect>
              </div>

              <div id='SD4' style={{width:'22%', float:'left', height:'80px', marginLeft:'2%', marginTop:'11px',}}>
                <label htmlFor="valor">
                  Nota Fiscal
                  <input
                    type="text"
                    maxLength={20}
                    value={taxInvoice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTaxInvoice(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          <div id='ThirdElements' style={{width:'92%', height:'80px', marginTop:'-20px', marginLeft:'1.5%'}}>
            <label htmlFor="obs">
              <p>Descrição</p>
              <section id="obs">
                <textarea
                  maxLength={1000}
                  value={movementDescription}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMovementDescription(e.target.value)}
                />
              </section>
            </label>
          </div>

          <div id='FourthElements' style={{width:'100%', height:'80px'}}>

            <div id='FL' style={{width:'100%'}}>

              <div id='FL1' style={{width:'44%', float:'left', marginTop:'25px', marginLeft:'1%'}}>
                <AutoCompleteSelect className="people">
                  <p>Pessoas</p>
                  <Select
                    isSearchable
                    isClearable
                    value={peopleList.filter(options => options.id == peopleId)}
                    onChange={handlePeopleSelected}
                    onInputChange={(term) => setPeopleTerm(term)}
                    required
                    placeholder="Selecione "
                    styles={selectStyles}
                    options={peopleList}
                  />
                </AutoCompleteSelect>

                <div className="personList">
                  {selectedPeopleList.map(item => {
                    return (
                      <p>
                        {item.label}
                        <FiTrash onClick={() => handleRemoveItemPeople(item)} />
                      </p>
                    )
                  })}
                </div>

              </div>

              <div id='FR' style={{width:'100%'}}>
                <div id='FR3' style={{width:'20%', float:'left', marginTop:'28px', marginLeft: '1.5rem'}}>
                  <label htmlFor="lembretes">
                    Lembrete &nbsp;
                    <MdHelp
                      className='help'
                      title="Escolhendo o lembrete, todos os usuários que tem acesso ao financeiro recebem uma notificação de movimento de acordo com o lembrete escolhido"
                    />
                    <Select
                      autoComplete="off"
                      placeholder="Selecione"
                      styles={selectStyles}
                      value={financialReminders.filter(options => options.id === reminders)}
                      onChange={(item) => handleReminders(item)}
                      options={financialReminders}
                    />
                  </label>
                </div>

                <div id='FL2' style={{float:'left', position:'absolute', marginTop:'5rem', marginLeft:'32vw'}}>
                  {showNotifyPeople && (
                  <div>
                    <label htmlFor="notify">
                      &nbsp;
                      Notificar pessoas
                    </label>
                    &nbsp;
                    <div style={{marginTop:'-17px', width:'100px', marginLeft:'7rem'}}>
                      <input
                        type="checkbox"
                        name="select"
                        checked={flgNotifyPeople}
                        onChange={() => setFlgNotifyPeople(!flgNotifyPeople)}
                        style={{width:'10px'}}
                      />
                      <MdHelp
                        className='help'
                        style={{float: 'left', marginLeft:'0.5rem', position:'absolute'}}
                        title="Escolhendo o lembrete, todos os usuários que tem acesso ao financeiro recebem uma notificação de movimento de acordo com o lembrete escolhido"
                      />
                    </div>
                  </div>
                )}
                </div>

              </div>

              <div id='FR4' style={{float:'right', marginRight:'7.5rem', marginTop: '3rem', width: '145px'}}>
                <label htmlFor="reembolso">
                  Reembolso ?
                </label>
                <div style={{marginTop:'-17px', width:'100px', marginLeft:'60px'}}>
                  <input
                    type="checkbox"
                    name="select"
                    checked={flgReembolso}
                    onChange={() => setFlgReembolso(!flgReembolso)}
                    style={{minWidth:'15px', minHeight:'15px'}}
                  />
                </div>
              </div>

            </div>

          </div>

        </Content>

        <div>
          <div className='log'>
            {movementId != "0" && (
              <button type="button" id="log" onClick={handleLogOnDisplay}>
                <div style={{float:'left'}}><IoIosPaper title="Ver Historico" /></div>
                <div style={{float:'left'}}>&nbsp;Ver Histórico</div>
              </button>
            )}
          </div>
        </div>

        <footer style={{marginTop:'5.5rem',marginLeft:'42%', opacity:(isSaving ?'0.5':'1')}}>

          <button
            className="buttonClick"
            type='button'
            onClick={()=> handleSave()}
          >
            <BiSave />
            Salvar
          </button>

          <button
            type='button'
            className="buttonClick"
            onClick={() => handleCloseModal()}
          >
            <FaRegTimesCircle />
            Fechar
          </button>

        </footer>

      </Modal>

      {showModalOptions && (
        <ModalOptions
          description="Este movimento está parcelado, deseja atualizar também as outras parcelas ?"
          close={() => setShowModalOptions(false)}
          callback={handleCallback}
        />
      )}

      {showLog && (
        <LogModal
          idRecord={Number(movementId)}
          handleCloseModalLog={handleCloseLog}
          logType="movementLog"
        />
      )}

    </>
  )

}

export default FinancialModal;
