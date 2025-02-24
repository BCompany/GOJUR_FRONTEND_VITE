/* eslint-disable-next-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-return-assign */
/* eslint no-unneeded-ternary: "error" */
/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import api from 'services/api';
import Select from 'react-select';
import IntlCurrencyInput from "react-intl-currency-input";
import DatePicker from 'components/DatePicker';
import ModalOptions from 'components/ModalOptions';
import ModalDealOptions from 'components/ModalDealOptions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { BiSave } from 'react-icons/bi';
import { useDevice } from "react-use-device";
import { FaRegTimesCircle, FaCheck, FaFileAlt, FaWhatsapp } from 'react-icons/fa';
import { FiTrash, FiX, FiMail } from 'react-icons/fi';
import { IoIosPaper } from 'react-icons/io';
import { MdHelp } from 'react-icons/md';
import { RiFolder2Fill, RiEraserLine, RiMoneyDollarBoxFill } from 'react-icons/ri';
import { format } from 'date-fns';
import { HeaderPage } from 'components/HeaderPage';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal';
import LogModal from 'components/LogModal';
import { selectStyles, useDelay, currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import { useStateContext } from 'context/statesContext';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { parcelas, financialReminders } from 'Shared/utils/commonListValues';
import { MatterData } from '../Interfaces/IFinancial';
import GridSelectProcess from '../../Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { Container, Content, Process, OverlayFinancial, ModalInformation, ContentMobile, ModalInformationMobile } from './styles';
import FileModal from '../FinancialFileModal/index';

interface DealDetail {
  cod_Acordo: string;
  cod_AcordoDetalhe: string;
  tpo_AcordoDetalhe: string;
  dta_AcordoDetalhe: string;
  vlr_AcordoDetalhe: number|undefined;
  des_AcordoDetalhe: string;
  cod_Categoria: string;
  cod_FormaPagamento: string;
  cod_CentroCusto: string;
};

interface MovementDetail {
  cod_Acordo: string;
  cod_AcordoDetalhe: string;
  tpo_AcordoDetalhe: string;
  dta_AcordoDetalhe: string;
  vlr_AcordoDetalhe: number|undefined;
  des_AcordoDetalhe: string;
  cod_Categoria: string;
  cod_FormaPagamento: string;
  cod_CentroCusto: string;
  cod_Movimento: string;
};

export interface ISelectData{
  id: string;
  label: string;
};

export interface IPeopleData{
  id: string;
  value: string;
};

const FinancialDeal: React.FC = () => {
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller} = useConfirmBox();
  const { handleStateType }  = useStateContext();
  const { addToast } = useToast();
  const { handleSelectProcess, selectProcess, matterSelected, openSelectProcess } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const { pathname } = useLocation();
  const [accountId, setAccountId] = useState('');
  const [parcelaAtual, setParcelaAtual] = useState('');
  const [dealId, setDealId] = useState('');
  const [dealDetailId, setDealDetailId] = useState('');
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const [matterId, setMatterId] = useState('');
  const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData);
  const [blockAssociateMatter, setBlockAssociateMatter] = useState(false);
  const [matterAttachedModal, setMatterAttachedModal] = useState(false);
  const [dealValue, setDealValue] = useState<number>(0);
  const [lawyerValue, setLawyerValue] = useState<number>(0);
  const [customerValue, setCustomerValue] = useState<number>(100);
  const [dealParcelas, setDealParcelas] = useState('1');
  const [dealParcelasFirst, setDealParcelasFirst] = useState('1');
  const [changeInstallments, setChangeInstallments] = useState<boolean>(false);
  const [actionSave, setActionSave] = useState<string>('');
  const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
  const [dealDate, setDealDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [prorating, setProrating] = useState('P');
  const [period, setPeriod] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState<boolean>(false);
  const [showLog, setShowLog] = useState<boolean>(false);
  const [confirmSave, setConfirmSave] = useState<boolean>(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [checkValueModal, setCheckValueModal] = useState<boolean>(false);
  const [showMovementModalOptions, setShowMovementModalOptions] = useState<boolean>(false);
  const [movementActionSave, setMovementActionSave] = useState<string>('');
  const [reminders, setReminders] = useState('00');
  const [flgNotifyPeople, setFlgNotifyPeople] = useState<boolean>(false);
  const [flgNotifyEmail, setFlgNotifyEmail] = useState<boolean>(true);
  const [flgNotifyWhatsApp, setFlgNotifyWhatsApp] = useState<boolean>(false);
  const [showFileModal , setShowFileModal] = useState<boolean>(false)

  const [peopleList, setPeopleList] = useState<ISelectData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleValue, setPeopleValue] = useState('');
  const [peopleTerm, setPeopleTerm] = useState('');
  const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
  const [checkPeopleList, setCheckPeopleList] = useState<boolean>(false);
  const [showNotifyPeople, setShowNotifyPeople] = useState<boolean>(false);
  const [peopleDescription, setPeopleDescription] = useState<string>('');

  const [categoryList, setCategoryList] = useState<ISelectData[]>([]);
  const [categoryId1, setCategoryId1] = useState('');
  const [categoryDescription1, setCategoryDescription1] = useState('');
  const [categoryTerm1, setCategoryTerm1] = useState('');
  const [categoryId2, setCategoryId2] = useState('');
  const [categoryDescription2, setCategoryDescription2] = useState('');
  const [categoryTerm2, setCategoryTerm2] = useState('');
  const [categoryId3, setCategoryId3] = useState('');
  const [categoryDescription3, setCategoryDescription3] = useState('');
  const [categoryTerm3, setCategoryTerm3] = useState('');

  const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
  const [paymentFormId1, setPaymentFormId1] = useState('');
  const [paymentFormDescription1, setPaymentFormDescription1] = useState<string>("")
  const [paymentFormTerm1, setPaymentFormTerm1] = useState('');
  const [paymentFormId2, setPaymentFormId2] = useState('');
  const [paymentFormDescription2, setPaymentFormDescription2] = useState<string>("")
  const [paymentFormTerm2, setPaymentFormTerm2] = useState('');
  const [paymentFormId3, setPaymentFormId3] = useState('');
  const [paymentFormDescription3, setPaymentFormDescription3] = useState<string>("")
  const [paymentFormTerm3, setPaymentFormTerm3] = useState('');

  const [centerCostList, setCenterCostList] = useState<ISelectData[]>([]);
  const [centerCostId1, setCenterCostId1] = useState('');
  const [centerCostDescription1, setCenterCostDescription1] = useState<string>('')
  const [centerCostTerm1, setCenterCostTerm1] = useState('');
  const [centerCostId2, setCenterCostId2] = useState('');
  const [centerCostDescription2, setCenterCostDescription2] = useState<string>('')
  const [centerCostTerm2, setCenterCostTerm2] = useState('');
  const [centerCostId3, setCenterCostId3] = useState('');
  const [centerCostDescription3, setCenterCostDescription3] = useState<string>('')
  const [centerCostTerm3, setCenterCostTerm3] = useState('');

  const [movement1Id, setMovement1Id] = useState('');
  const [movement2Id, setMovement2Id] = useState('');
  const [movement3Id, setMovement3Id] = useState('');

  const [deal1Id, setDeal1Id] = useState('');
  const [deal2Id, setDeal2Id] = useState('');
  const [deal3Id, setDeal3Id] = useState('');

  const [dealDate1, setDealDate1] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [dealDate2, setDealDate2] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [dealDate3, setDealDate3] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const [dealValue1, setDealValue1] = useState<number>();
  const [dealValue2, setDealValue2] = useState<number>();
  const [dealValue3, setDealValue3] = useState<number>();

  const [description1, setDescription1] = useState<string>('');
  const [description2, setDescription2] = useState<string>('');
  const [description3, setDescription3] = useState<string>('');
  const { isMOBILE } = useDevice();

  const proratingList = [
    { id:'P', label: 'Percentual' },
    { id:'V', label: 'Valor' }
  ];


  useEffect(() => {
    Initialize();
  }, []);


  useEffect(() => {
    if(dealId != '' && dealId != '0')
    {
      LoadDeal(dealId);
      setIsEditModal(true);
    }
    else
    {
      LoadDefaultCategory();
      setIsEditModal(false);
    }
  }, [dealId]);


  useEffect(() => {
    if(caller == 'changeDeal' && isCancelMessage)
    {
      setConfirmSave(false);
      handleCancelMessage(false);
    }

    if(caller == 'changeValue' && isCancelMessage)
    {
      setCheckValueModal(false);
      handleCancelMessage(false);
    }
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if(caller == 'changeDeal' && isConfirmMessage)
    {
      Save();
      setConfirmSave(false);
      handleConfirmMessage(false);
    }

    if(caller == 'changeValue' && isConfirmMessage)
    {
      SaveMovement(false);
      setCheckValueModal(false);
      handleConfirmMessage(false);
    }
  }, [isConfirmMessage, caller]);


  useEffect (() => {
    if (actionSave.length > 0){
      HandleSave();
    }
  }, [actionSave]);


  useEffect (() => {
    if (movementActionSave.length > 0){
      SaveMovement(true);
    }
  }, [movementActionSave])


  useEffect(() => {
    if(openSelectProcess == "Close")
      setMatterAttachedModal(false)
  }, [openSelectProcess]);


  useEffect(() => {
    if(matterSelected)
    {
      setMatterId(matterSelected.matterId.toString())
      setProcessTitle(`${matterSelected.matterNumber} - ${matterSelected.matterCustomerDesc} x ${matterSelected.matterOppossingDesc}`)
      selectProcess(null)
    }

    setMatterAttachedModal(false)
  }, [matterSelected]);


  useDelay(() => {
    if (peopleTerm.length > 0)
      LoadPeople()
  }, [peopleTerm], 500);


  useDelay(() => {
    if (categoryTerm1.length && !isLoading)
      LoadCategory('', '1')
    if (categoryTerm2.length && !isLoading)
      LoadCategory('', '2')
    if (categoryTerm3.length && !isLoading)
      LoadCategory('', '3')
  }, [categoryTerm1, categoryTerm2, categoryTerm3], 750);


  useDelay(() => {
    if (paymentFormTerm1.length > 0 && !isLoading)
      LoadPaymentForm('', '1');
    if (paymentFormTerm2.length > 0 && !isLoading)
      LoadPaymentForm('', '2');
    if (paymentFormTerm3.length > 0 && !isLoading)
      LoadPaymentForm('', '3');
  }, [paymentFormTerm1, paymentFormTerm2, paymentFormTerm3], 750);


  useDelay(() => {
    if (centerCostTerm1.length > 0 && !isLoading)
      LoadCenterCost('', '1');
    if (centerCostTerm2.length > 0 && !isLoading)
      LoadCenterCost('', '2');
    if (centerCostTerm3.length > 0 && !isLoading)
      LoadCenterCost('', '3');
  }, [centerCostTerm1, centerCostTerm2, centerCostTerm3], 750);


  const Initialize = async () => {
    setIsLoading(true);
    await LoadStates()
    LoadPeople('reset');
    LoadCategory();
    LoadPaymentForm();
    LoadCenterCost();
  };


  const LoadStates = async() => {
    const indexAccount1 = pathname.indexOf('account=');
    const indexAccount2 = pathname.indexOf('/', indexAccount1);
    const account = pathname.slice(indexAccount1 + 8, indexAccount2);
    setAccountId(account);

    const indexParcela1 = pathname.indexOf('installment=')
    const indexParcela2 = pathname.indexOf('/', indexParcela1)
    const parcela = pathname.slice(indexParcela1 + 12, indexParcela2)
    setParcelaAtual(parcela)

    const index = pathname.indexOf('id=');
    const id = pathname.substring(index + 3);

    setDealDetailId(id);

    const response = await api.get('/Acordo/ListarPorDetalhe', { params:{ dealDetailId: Number(id), token }});

    setDealId(response.data);
  };


  const LoadDeal = async (dealId) => {
    try
    {
      setIsLoading(true);

      const response = await api.get('/Acordo/Editar', { params:{ dealId: Number(dealId), token }});

      setPeopleId(response.data.cod_Pessoa);
      setPeopleValue(response.data.nom_Pessoa);
      setDealValue(response.data.vlr_Acordo);
      setDealParcelas(response.data.num_Parcelas.toString());
      setDealParcelasFirst(response.data.num_Parcelas.toString());
      setDealDate(format(new Date(response.data.dta_Acordo), "yyyy-MM-dd"));
      setPeriod(response.data.num_Dias);
      setProrating(response.data.tpo_Rateio);
      setLawyerValue(response.data.vlr_Escritorio);
      setCustomerValue(response.data.vlr_Cliente);
      setReminders(response.data.qtd_Lembrete);
      setFlgNotifyPeople(response.data.flg_NotificaPessoa);
      setFlgNotifyEmail(response.data.flg_NotificaEmail);
      setFlgNotifyWhatsApp(response.data.flg_NotificaWhatsApp);
      setSelectedPeopleList(response.data.UserList)
      setShowNotifyPeople(response.data.UserList.length > 0 && response.data.Lembrete != null)

      if(response.data.cod_Processo != 0 && response.data.cod_Processo != null )
      {
        setMatterId(response.data.cod_Processo)
        setProcessTitle(`${response.data.num_Processo} - ${response.data.matterCustomerDesc} x ${response.data.matterOpposingDesc}`)
      }

      response.data.financialDealDetailDTOList.map((item) => {
        if(item.tpo_AcordoDetalhe == "VE")
        {
          setDeal1Id(item.cod_AcordoDetalhe);
          setDealDate1(format(new Date(item.dta_AcordoDetalhe), "yyyy-MM-dd"));
          setDealValue1(item.vlr_AcordoDetalhe);
          setDescription1(item.des_AcordoDetalhe);
          setCategoryId1(item.cod_Categoria);
          setCategoryDescription1(item.nom_Categoria);
          setPaymentFormId1(item.cod_FormaPagamento);
          setPaymentFormDescription1(item.des_FormaPagamento);
          setCenterCostId1(item.cod_CentroCusto);
          setCenterCostDescription1(item.des_CentroCusto);
        }

        if(item.tpo_AcordoDetalhe == "RC")
        {
          setDeal2Id(item.cod_AcordoDetalhe);
          setDealDate2(format(new Date(item.dta_AcordoDetalhe), "yyyy-MM-dd"));
          setDealValue2(item.vlr_AcordoDetalhe);
          setDescription2(item.des_AcordoDetalhe);
          setCategoryId2(item.cod_Categoria);
          setCategoryDescription2(item.nom_Categoria);
          setPaymentFormId2(item.cod_FormaPagamento);
          setPaymentFormDescription2(item.des_FormaPagamento);
          setCenterCostId2(item.cod_CentroCusto);
          setCenterCostDescription2(item.des_CentroCusto);
        }

        if(item.tpo_AcordoDetalhe == "PC")
        {
          setDeal3Id(item.cod_AcordoDetalhe);
          setDealDate3(format(new Date(item.dta_AcordoDetalhe), "yyyy-MM-dd"));
          setDealValue3(item.vlr_AcordoDetalhe);
          setDescription3(item.des_AcordoDetalhe);
          setCategoryId3(item.cod_Categoria);
          setCategoryDescription3(item.nom_Categoria);
          setPaymentFormId3(item.cod_FormaPagamento);
          setPaymentFormDescription3(item.des_FormaPagamento);
          setCenterCostId3(item.cod_CentroCusto);
          setCenterCostDescription3(item.des_CentroCusto);
        }

        return;
      });

      setIsLoading(false);
    }
    catch (err:any) {
      setIsLoading(false);
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data.Message });
    }
  };


  const LoadDefaultCategory = async () => {
    try
    {
      const response = await api.get('/Categoria/ListarPadraoAcordo', { params:{ token }});

      response.data.map((item) => {
        if (item.label == "VE")
        {
          setCategoryId1(item.categoryId);
          setCategoryDescription1(item.categoryDescription);
        }
        if (item.label == "RC")
        {
          setCategoryId2(item.categoryId);
          setCategoryDescription2(item.categoryDescription);
        }
        if (item.label == "PC")
        {
          setCategoryId3(item.categoryId);
          setCategoryDescription3(item.categoryDescription);
        }
        return;
      });

      setIsLoading(false);
    }
    catch (err:any) {
      setIsLoading(false);
    }
  };


  const LoadPeople = async (stateValue?: string) => {
    if (isLoadingComboData)
      return false;

    let filter = stateValue == "initialize"? peopleValue : peopleTerm;
    if (stateValue == 'reset')
      filter = '';

    try {
      const response = await api.get<ISelectData[]>('/Pessoas/ListarPorEmpresa', { params:{ filterClause: filter, peopleTypeSelected: "CLTO", token}});

      const listPeople: ISelectData[] = [];

      response.data.map(item => {
        return listPeople.push({
          id: item.id,
          label: item.label
        })
      })

      setPeopleList(listPeople)
      setIsLoadingComboData(false)
    }
    catch (err:any) {
      console.log(err.response.data.Message);
    }
  };


  const LoadCategory =  async (stateValue?: string, caller?: string) => {
    let filter = '';

    if(caller == "1")
      filter = categoryTerm1;
    if(caller == "2")
      filter = categoryTerm2;
    if(caller == "3")
      filter = categoryTerm3;

    if (stateValue == 'reset')
      filter = '';

    try {
      const response = await api.get<ISelectData[]>('/Categoria/ListarPorDescrição', { params:{ rows: 50, filterClause: filter, token }})
      setCategoryList(response.data)
    }
    catch (err:any) {
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data });
    }
  };


  const LoadPaymentForm = async (stateValue?: string, caller?: string) => {
    let filter = '';

    if(caller == "1")
      filter = paymentFormTerm1;
    if(caller == "2")
      filter = paymentFormTerm2;
    if(caller == "3")
      filter = paymentFormTerm3;

    if (stateValue == 'reset')
      filter = ''
    
    try {
      const response = await api.get<ISelectData[]>('FormaDePagamento/ListarPorFiltro', { params:{ filterClause: filter, token }})
      setPaymentFormList(response.data)
    }
    catch (err:any) {
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data });
    }
  };


  const LoadCenterCost = async (stateValue?: string, caller?: string) => {
    let filter = '';

    if(caller == "1")
      filter = centerCostTerm1;
    if(caller == "2")
      filter = centerCostTerm2;
    if(caller == "3")
      filter = centerCostTerm3;

    if (stateValue == 'reset')
      filter = ''

    try {
      const response = await api.get<ISelectData[]>('/CentroDeCusto/Listar', { params:{ page: 0, rows: 0, filterClause: filter, token}})
      setCenterCostList(response.data);
    }
    catch (err:any) {
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data });
    }
  };


  const handlePeopleSelected = (item) => {
    if (item){
      setPeopleId(item.id)
      setPeopleDescription(item.label)
      setShowNotifyPeople(reminders != '00' && reminders != null)
      handleListItemPeople(item)
    }else{
      setPeopleId('')
      setPeopleDescription('')
      LoadPeople()
    }
  }


  const handleCategorySelected1 = (item) => {
    if (item){
      setCategoryId1(item.id);
      setCategoryDescription1(item.label);
    }
    else{
      setCategoryId1('');
      setCategoryDescription1('');
      LoadCategory('reset');
    }
  };


  const handleCategorySelected2 = (item) => {
    if (item){
      setCategoryId2(item.id);
      setCategoryDescription2(item.label);
    }
    else{
      setCategoryId2('');
      setCategoryDescription2('');
      LoadCategory('reset');
    }
  };


  const handleCategorySelected3 = (item) => {
    if (item){
      setCategoryId3(item.id);
      setCategoryDescription3(item.label);
    }
    else{
      setCategoryId3('');
      setCategoryDescription3('');
      LoadCategory('reset');
    }
  };


  const handlePaymentFormSelected1 = (item) => {
    if (item){
      setPaymentFormId1(item.id);
      setPaymentFormDescription1(item.label);
      setPaymentFormId2(item.id);
      setPaymentFormDescription2(item.label);
    }
    else{
      setPaymentFormId1('');
      setPaymentFormDescription1('');
      setPaymentFormId2('');
      setPaymentFormDescription2('');
      LoadPaymentForm();
    }
  };


  const handlePaymentFormSelected2 = (item) => {
    if (item){
      setPaymentFormId2(item.id);
      setPaymentFormDescription2(item.label);
    }
    else{
      setPaymentFormId2('');
      setPaymentFormDescription2('');
      LoadPaymentForm();
    }
  };


  const handlePaymentFormSelected3 = (item) => {
    if (item){
      setPaymentFormId3(item.id);
      setPaymentFormDescription3(item.label);
    }
    else{
      setPaymentFormId3('');
      setPaymentFormDescription3('');
      LoadPaymentForm();
    }
  };


  const handleCenterCostSelected1 = (item) => {
    if (item){
      setCenterCostId1(item.id);
      setCenterCostDescription1(item.label);
    }
    else{
      setCenterCostId1('');
      setCenterCostDescription1('');
      LoadCenterCost();
    }
  };


  const handleCenterCostSelected2 = (item) => {
    if (item){
      setCenterCostId2(item.id);
      setCenterCostDescription2(item.label);
    }
    else{
      setCenterCostId2('');
      setCenterCostDescription2('');
      LoadCenterCost();
    }
  };


  const handleCenterCostSelected3 = (item) => {
    if (item){
      setCenterCostId3(item.id);
      setCenterCostDescription3(item.label);
    }
    else{
      setCenterCostId3('');
      setCenterCostDescription3('');
      LoadCenterCost();
    }
  };


  const handleGridSelectProcess = useCallback(() => {
    if (processTitle === 'Associar Processo') {
      setMatterAttachedModal(true)
      handleSelectProcess("Open")
    }
  }, [handleSelectProcess, processTitle]);


  const Delete = useCallback(async() => {
    try {
      setIsLoading(true);
      const response = await api.delete('/Acordo/ApagarAcordo', { params:{ dealId, token }});

      handleStateType('Inactive');
      setShowConfirmDelete(false);
      setIsLoading(false);
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Acordo apagado" });
      history.push(`/financeiro`);
    }
    catch (err:any) {
      setIsLoading(false);
      addToast({ type: "info", title: "Falha ao apagar acordo.", description: err.response.data.Message });
    }
  }, [dealId]);


  const DeleteOneInstallment = useCallback(async() => {
    try {
      setIsLoading(true);
      const response = await api.delete('/Acordo/ApagarParcelaAcordo', { params:{ dealId, parcelaAtual, token }});

      setShowConfirmDelete(false);
      setIsLoading(false);
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Acordo apagado" });
      handleStateType('Inactive');
      history.push(`/financeiro`);
    }
    catch (err:any) {
      setIsLoading(false);
      addToast({ type: "info", title: "Falha ao apagar acordo.", description: err.response.data.Message });
    }
  }, [dealId, parcelaAtual]);


  const handleValue = (event, value) => {
    event.preventDefault();
    setDealValue(value)
  };


  const handleLawyerValue = (event, value) => {
    event.preventDefault();
    setLawyerValue(value)
  };


  const handleValueBlur = async() => {
    if(dealValue == 0)
      return;

    if(prorating == "V" && lawyerValue > dealValue)
    {
      addToast({ type: "info", title: "Alerta", description: "O valor do campo Escritório não pode ser maior que o valor do acordo" });
      setLawyerValue(0);
      setCustomerValue(0);
      return;
    }  
    
    if(prorating == "V")
    {
      setCustomerValue(dealValue - lawyerValue);
      UpdateDealBlur(dealValue - lawyerValue);
    }
    else
    {
      setCustomerValue(100 - lawyerValue);
      UpdateDealBlur((dealValue / 100) * (100 - lawyerValue));
    }
  };


  const handleLawyerBlur = async() => {
    if(dealValue == 0)
      return;

    if(prorating == "P" && lawyerValue > 100)
    {
      addToast({ type: "info", title: "Alerta", description: "O percentual do campo Escritório não pode ser maior que 100%" });
      setLawyerValue(0);
      setCustomerValue(0);
      return;
    }

    if(prorating == "V" && lawyerValue > dealValue)
    {
      addToast({ type: "info", title: "Alerta", description: "O valor do campo Escritório não pode ser maior que o valor do acordo" });
      setLawyerValue(0);
      setCustomerValue(0);
      return;
    }  
    
    if(prorating == "V")
    {
      setCustomerValue(dealValue - lawyerValue);
      UpdateDealBlur(dealValue - lawyerValue);
    }
    else
    {
      setCustomerValue(100 - lawyerValue);
      UpdateDealBlur((dealValue / 100) * (100 - lawyerValue));
    }
  };


  const handlePeriodBlur = async(value) => {
    const result = new Date(dealDate);
    
    result.setHours(result.getHours() + 4);
    result.setDate(result.getDate() + Number(value));
    (FormatDate(new Date(result.toString()), 'yyyy-MM-dd'))

    setDealDate3((FormatDate(new Date(result.toString()), 'yyyy-MM-dd')));
  };


  const handleChangeParcelas = (id: string) => {
    setDealParcelas(id);

    if(dealId != '0' && id != dealParcelasFirst)
    {
      setChangeInstallments(true)
    }
    else{
      setChangeInstallments(false)
    }
  };


  const handleProratingStatus = (item) => {
    if (item){
      setProrating(item.id)
    }
    else{
      setProrating('')
    }
  };


  const UpdateDealBlur = async(value) => {
    if(prorating == "V")
    {
      setDealValue1(lawyerValue);
      setDealValue2(value);
      setDealValue3(value);
    }
    else
    {
      const lawyerDealValue = (dealValue / 100) * lawyerValue
      const customerDealvalue = (dealValue - lawyerDealValue).toFixed(2)
      const totalLawyerDealValue = ((dealValue / 100) * lawyerValue).toFixed(2)

      setDealValue1(Number(totalLawyerDealValue));
      setDealValue2(Number(customerDealvalue));
      setDealValue3(Number(customerDealvalue));
    }

    setDescription1(`ACORDO CLIENTE ${peopleValue} - Receita do escritório do acordo`);
    setDescription2(`ACORDO CLIENTE ${peopleValue} - Créditos transitórios para repasse ao cliente`);
    setDescription3(`ACORDO CLIENTE ${peopleValue} - Repasse de valores de acordo`);
  };


  const HandleSave = async() => {
    if(dealId != '' && dealId != '0')
      setConfirmSave(true);
    else
      Save();
  };


  const Save = useCallback(async() => {
    try {
      if (!Validate()) return;
      setIsSaving(true);
      setShowModalOptions(false);
      setConfirmSave(false);

      const financialDealDetailFilterList: DealDetail[] = [];
      financialDealDetailFilterList.push({cod_Acordo: dealId, cod_AcordoDetalhe: deal1Id, tpo_AcordoDetalhe: "VE", dta_AcordoDetalhe: dealDate1, vlr_AcordoDetalhe: dealValue1, des_AcordoDetalhe: description1, cod_Categoria: categoryId1, cod_FormaPagamento: paymentFormId1, cod_CentroCusto: centerCostId1});
      financialDealDetailFilterList.push({cod_Acordo: dealId, cod_AcordoDetalhe: deal2Id, tpo_AcordoDetalhe: "RC", dta_AcordoDetalhe: dealDate2, vlr_AcordoDetalhe: dealValue2, des_AcordoDetalhe: description2, cod_Categoria: categoryId2, cod_FormaPagamento: paymentFormId2, cod_CentroCusto: centerCostId2});
      financialDealDetailFilterList.push({cod_Acordo: dealId, cod_AcordoDetalhe: deal3Id, tpo_AcordoDetalhe: "PC", dta_AcordoDetalhe: dealDate3, vlr_AcordoDetalhe: dealValue3, des_AcordoDetalhe: description3, cod_Categoria: categoryId3, cod_FormaPagamento: paymentFormId3, cod_CentroCusto: centerCostId3});

      let peopleIdsItems = '';
      selectedPeopleList.map((people) => {
        return peopleIdsItems += `${people.id},`
      })

      const response = await api.post('/Acordo/Salvar', {
        cod_Acordo: dealId,
        peopleIds: peopleIdsItems,
        cod_Conta: accountId,
        cod_Processo: matterId,
        vlr_Acordo: dealValue,
        num_Parcelas: dealParcelas,
        dta_Acordo: dealDate,
        num_Dias: period,
        tpo_Rateio: prorating,
        vlr_Escritorio: lawyerValue,
        vlr_Cliente: customerValue,
        editChild: actionSave.length == 0? "all": actionSave,
        qtd_Lembrete: reminders,
        flg_NotificaPessoa: flgNotifyPeople,
        flg_NotificaEmail: flgNotifyEmail,
        flg_NotificaWhatsApp: flgNotifyWhatsApp,
        parcelaAtual,
        financialDealDetailFilterList,
        changeInstallments,
        token
      })

      handleStateType('Inactive');
      setIsSaving(false);
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Acordo salvo" });
      history.push(`/financeiro`);
    }
    catch (err:any) {
      setIsSaving(false);
      addToast({ type: "info", title: "Falha ao salvar acordo.", description: err.response.data.Message });
    }
  }, [dealId, peopleId, matterId, dealValue, dealParcelas, dealDate, period, prorating, lawyerValue, customerValue, deal1Id, deal2Id, deal3Id, dealDate1, dealDate2, dealDate3, dealValue1, dealValue2, dealValue3, description1, description2, description3, categoryId1, categoryId2, categoryId3, paymentFormId1, paymentFormId2, paymentFormId3, centerCostId1, centerCostId2, centerCostId3, actionSave, parcelaAtual, changeInstallments, reminders, flgNotifyPeople, flgNotifyEmail, flgNotifyWhatsApp, selectedPeopleList]);


  const Validate =() => {
    let isValid = true;

    // Avoid click many times
    if (isSaving){
      return;
    }

    // if(peopleId == "")
    // {
      // addToast({ type: "info", title: "Alerta", description: "O campo Cliente deve ser preenchido" });
      // isValid = false;
    // }
    if(dealValue == 0)
    {
      addToast({ type: "info", title: "Alerta", description: "O campo Valor deve ser preenchido" });
      isValid = false;
    }
    if(lawyerValue == 0)
    {
      addToast({ type: "info", title: "Alerta", description: "O valor do campo Escritório deve ser maior que 0" });
      isValid = false;
    }
    if(period === '')
    {
      addToast({ type: "info", title: "Alerta", description: "O campo Dias para Repasse não pode ser vazio" });
      isValid = false;
    }
    if(categoryId1 == '' || categoryId2 == '' || categoryId3 == '')
    {
      addToast({ type: "info", title: "Alerta", description: "Todos os campos Categoria devem ser preenchidos" });
      isValid = false;
    }
    if(description1 == '' || description2 == '' || description3 == '')
    {
      addToast({ type: "info", title: "Alerta", description: "Todos os campos Descrição devem ser preenchidos" });
      isValid = false;
    }
    if(prorating == "P" && lawyerValue > 100)
    {
      addToast({ type: "info", title: "Alerta", description: "O percentual do campo Escritório não pode ser maior que 100%" });
      isValid = false;
    }
    if(prorating == "V" && lawyerValue > dealValue)
    {
      addToast({ type: "info", title: "Alerta", description: "O valor do campo Escritório não pode ser maior que o valor do acordo" });
      isValid = false;
    }

    return isValid;
  };


  const handleCallback = (actionSave: string) => {
    setActionSave(actionSave)
  };


  const handleMovementCallback = (actionSave: string) => {
    setMovementActionSave(actionSave)
  };


  const handleLogOnDisplay = useCallback(async () => {
    setShowLog(true);
  }, []);


  const handleCloseLog = () => {
    setShowLog(false);
  };


  const handleDelete = useCallback(async () => {
    if(Number(dealParcelasFirst) > 1)
      setShowDeleteOptions(true);
    else
      setShowConfirmDelete(true);
  }, [dealParcelasFirst]);


  const handleValue1 = (event, value, maskedValue) => {
    event.preventDefault();
    setDealValue1(value)
  };


  const handleValue2 = (event, value, maskedValue) => {
    event.preventDefault();
    setDealValue2(value)
  };


  const handleValue3 = (event, value, maskedValue) => {
    event.preventDefault();
    setDealValue3(value)
  };


  const EditDeal = () => {
    setIsEditModal(false);
    setIsEdit(false);
  };


  const EditMovement = () => {
    LoadMovement();
    setIsEditModal(false);
    setIsEdit(true);
  };


  const LoadMovement = async () => {
    try
    {
      setIsLoading(true);

      const response = await api.get('/Acordo/EditarMovimentos', { params:{ dealId, parcelaAtual, token }});

      response.data.financialDealDetailDTOList.map((item) => {
        if(item.tpo_AcordoDetalhe == "VE")
        {
          setMovement1Id(item.cod_Movimento);
          setDeal1Id(item.cod_AcordoDetalhe);
          setDealDate1(format(new Date(item.dta_AcordoDetalhe), "yyyy-MM-dd"));
          setDealValue1(item.vlr_AcordoDetalhe);
          setDescription1(item.des_AcordoDetalhe);
          setCategoryId1(item.cod_Categoria);
          setCategoryDescription1(item.nom_Categoria);
          setPaymentFormId1(item.cod_FormaPagamento);
          setPaymentFormDescription1(item.des_FormaPagamento);
          setCenterCostId1(item.cod_CentroCusto);
          setCenterCostDescription1(item.des_CentroCusto);
        }

        if(item.tpo_AcordoDetalhe == "RC")
        {
          setMovement2Id(item.cod_Movimento);
          setDeal2Id(item.cod_AcordoDetalhe);
          setDealDate2(format(new Date(item.dta_AcordoDetalhe), "yyyy-MM-dd"));
          setDealValue2(item.vlr_AcordoDetalhe);
          setDescription2(item.des_AcordoDetalhe);
          setCategoryId2(item.cod_Categoria);
          setCategoryDescription2(item.nom_Categoria);
          setPaymentFormId2(item.cod_FormaPagamento);
          setPaymentFormDescription2(item.des_FormaPagamento);
          setCenterCostId2(item.cod_CentroCusto);
          setCenterCostDescription2(item.des_CentroCusto);
        }

        if(item.tpo_AcordoDetalhe == "PC")
        {
          setMovement3Id(item.cod_Movimento);
          setDeal3Id(item.cod_AcordoDetalhe);
          setDealDate3(format(new Date(item.dta_AcordoDetalhe), "yyyy-MM-dd"));
          setDealValue3(item.vlr_AcordoDetalhe);
          setDescription3(item.des_AcordoDetalhe);
          setCategoryId3(item.cod_Categoria);
          setCategoryDescription3(item.nom_Categoria);
          setPaymentFormId3(item.cod_FormaPagamento);
          setPaymentFormDescription3(item.des_FormaPagamento);
          setCenterCostId3(item.cod_CentroCusto);
          setCenterCostDescription3(item.des_CentroCusto);
        }

        return;
      });

      setIsLoading(false);
    }
    catch (err:any) {
      setIsLoading(false);
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data.Message });
    }
  };


  const SaveMovement = useCallback(async(checkValue) => {
    try {
      setIsSaving(true);
      setShowMovementModalOptions(false);

      if (dealParcelas != '1' && movementActionSave.length == 0 && dealId != '0')
      {
        setShowMovementModalOptions(true);
        setIsSaving(false);
        return;
      }

      if(checkValue)
      {
        if(Number(dealValue1) + Number(dealValue2) != dealValue || Number(dealValue1) + Number(dealValue3) != dealValue || Number(dealValue2) != Number(dealValue3))
        {
          setCheckValueModal(true);
          setIsSaving(false);
          return;
        }
      }

      if(description1 == '' || description2 == '' || description3 == '')
      {
        addToast({ type: "info", title: "Alerta", description: "Todos os campos Descrição devem ser preenchidos" });
        setIsSaving(false);
        return;
      }

      const financialDealDetailFilterList: MovementDetail[] = [];
      financialDealDetailFilterList.push({cod_Acordo: dealId, cod_AcordoDetalhe: deal1Id, tpo_AcordoDetalhe: "VE", dta_AcordoDetalhe: dealDate1, vlr_AcordoDetalhe: dealValue1, des_AcordoDetalhe: description1, cod_Categoria: categoryId1, cod_FormaPagamento: paymentFormId1, cod_CentroCusto: centerCostId1, cod_Movimento: movement1Id});
      financialDealDetailFilterList.push({cod_Acordo: dealId, cod_AcordoDetalhe: deal2Id, tpo_AcordoDetalhe: "RC", dta_AcordoDetalhe: dealDate2, vlr_AcordoDetalhe: dealValue2, des_AcordoDetalhe: description2, cod_Categoria: categoryId2, cod_FormaPagamento: paymentFormId2, cod_CentroCusto: centerCostId2, cod_Movimento: movement2Id});
      financialDealDetailFilterList.push({cod_Acordo: dealId, cod_AcordoDetalhe: deal3Id, tpo_AcordoDetalhe: "PC", dta_AcordoDetalhe: dealDate3, vlr_AcordoDetalhe: dealValue3, des_AcordoDetalhe: description3, cod_Categoria: categoryId3, cod_FormaPagamento: paymentFormId3, cod_CentroCusto: centerCostId3, cod_Movimento: movement3Id});

      const response = await api.post('/Acordo/SalvarMovimentos', {
        editChild: movementActionSave.length == 0? "justOne": movementActionSave,
        num_Parcelas: dealParcelas,
        parcelaAtual,
        financialDealDetailFilterList,
        token
      })

      handleStateType('Inactive');
      setIsSaving(false);
      setCheckValueModal(false);
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Acordo salvo" });
      history.push(`/financeiro`);
    }
    catch (err:any) {
      setIsSaving(false);
      setCheckValueModal(false);
      addToast({ type: "info", title: "Falha ao salvar acordo.", description: err.response.data.Message });
    }
  }, [dealId, dealParcelas, deal1Id, deal2Id, deal3Id, dealDate1, dealDate2, dealDate3, dealValue1, dealValue2, dealValue3, description1, description2, description3, categoryId1, categoryId2, categoryId3, paymentFormId1, paymentFormId2, paymentFormId3, centerCostId1, centerCostId2, centerCostId3, movementActionSave, parcelaAtual, movement1Id, movement2Id, movement3Id]);


  const handleReminders = (item:any) => {
    const value =item? item.id: ''
    setReminders(value)

    const showNotifyPeople = (value != '00' && value != '') && selectedPeopleList.length > 0;
    setShowNotifyPeople(showNotifyPeople)
  };


  const handleOpenMatterFileModal = async () => {
    setShowFileModal(true)
  };


  const handleCloseMatterFileModal = async () => {
    setShowFileModal(false)
  };


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


  return(
    <>
      <Container id='Container'>
        <HeaderPage />

        {matterAttachedModal &&(<OverlayFinancial />)}
        {matterAttachedModal &&(<GridSelectProcess />)}

        {showFileModal &&(<OverlayFinancial />)}
        {(showFileModal) && <FileModal callbackFunction={{handleCloseMatterFileModal, dealDetailId, parcelaAtual}} /> }

        {isSaving && (
          <>
            <OverlayFinancial />
            <div className='waitingMessage'>
              <LoaderWaiting size={15} color="var(--blue-twitter)" />
              Salvando...
            </div>
          </>
        )}

        {isLoading && (
          <>
            <OverlayFinancial />
            <div className='waitingMessage'>
              <LoaderWaiting size={15} color="var(--blue-twitter)" />
              Aguarde...
            </div>
          </>
        )}
        
        {!isMOBILE && (
          <Content id='Content'>

            <div id="SelectPeople" className="selectPeople">
              <AutoCompleteSelect>
                <p>Pessoas</p>
                <Select
                  isSearchable
                  value={{ id: peopleId, label: peopleDescription }}
                  onChange={handlePeopleSelected}
                  onInputChange={(term) => setPeopleTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={peopleList}
                  isDisabled={isEdit}
                />
              </AutoCompleteSelect>

              <div className="selected-people-inline">
                {selectedPeopleList.map((item) => (
                  <span key={item.id} className="selected-person-chip" title={item.label}>
                    {item.label.substring(0,20)}
                    {!isEdit && (
                      <button
                        className="remove-person-btn"
                        onClick={() => handleRemoveItemPeople(item)}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>


            <div id='AttachMatter' className='attachMatter'>
              <Process>
                {processTitle === 'Associar Processo' && (
                  <button
                    type="button"
                    id="associar"
                    onClick={handleGridSelectProcess}
                    disabled={isEdit}
                  >
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
                  <button
                    type="button"
                    onClick={handleGridSelectProcess}
                    disabled={isEdit}
                  >
                    <RiFolder2Fill />
                  </button>
                )}

                {processTitle !== 'Associar Processo' && (
                  <button
                    type="button"
                    onClick={() => {
                      setProcessTitle('Associar Processo');
                      setAppointmentMatter(undefined);
                      setMatterId('0');
                    }}
                    disabled={isEdit}
                  >
                    &nbsp;&nbsp;
                    {!blockAssociateMatter && <RiEraserLine /> }
                  </button>
                )}
              </Process>
            </div>

            <br/><br/><br/>           
                  
            <br/>

            <div id='Valor' className='valorAcordo'>
              <label htmlFor="valor">
                Valor
                <IntlCurrencyInput
                  currency="BRL"
                  config={currencyConfig}
                  value={dealValue}
                  className='inputField'
                  onChange={handleValue}
                  onBlur={handleValueBlur}
                  disabled={isEdit}
                />
              </label>
            </div>

            <div id='DataAcordo' className='dataAcordo'>
              <label htmlFor='Data'>
                <DatePicker
                  title="Data"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate(e.target.value)}
                  onBlur={(e: ChangeEvent<HTMLInputElement>) => { setDealDate1(e.target.value); setDealDate2(e.target.value); setDealDate3(e.target.value) }}
                  value={dealDate}
                  disabled={isEdit}
                />
              </label>
            </div>
            
            <div id='Parcelas' className='parcelasAcordo'>
              <div style={{width:'47%', float:'left'}}>
                <label htmlFor="parcela">
                  Parcelas
                  <Select
                    autoComplete="off"
                    styles={selectStyles}
                    value={parcelas.filter(options => options.id === dealParcelas)}
                    onChange={(item) => handleChangeParcelas(item? item.id: '')}
                    options={parcelas}
                    isDisabled={isEdit}
                  />
                </label>
              </div>
              <div style={{width:'47%', float:'left', marginLeft:'5%'}}>
                <label htmlFor="valor">
                  {/* Dias Para Repasse Valor Acordo */}
                  Dias Repasse
                  <div style={{marginTop: '-22px', marginLeft:'95px'}}>
                    <MdHelp style={{color:'#2C8ED6'}} className='help' title="Informe neste campo a quantidade de dias para repasse dos valores recebidos ao cliente" />
                  </div>
                  <input
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    type="text"
                    className='inputField'
                    maxLength={20}
                    value={period}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPeriod(e.target.value)}
                    onBlur={(e: ChangeEvent<HTMLInputElement>) => handlePeriodBlur(e.target.value)}
                    disabled={isEdit}
                  />
                </label>
              </div>
            </div>

            <div id='Reminder' className='reminder'>
              <label htmlFor="lembretes">
                Lembrete &nbsp;
                <Select
                  autoComplete="off"
                  placeholder="Selecione"
                  styles={selectStyles}
                  value={financialReminders.filter(options => options.id === reminders)}
                  onChange={(item) => handleReminders(item)}
                  options={financialReminders}
                  isDisabled={isEdit}
                />
              </label>
              <div id='NotifyPeople' className='notifyPeople'>
                {flgNotifyPeople ? (
                  <>
                    {flgNotifyEmail == true ? (
                      <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyEmail(false)}} title='O lembrete será enviado para o e-mail do cliente'>
                        <FiMail className='notificationEmailActive' />
                      </button>
                    ) : (
                      <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyEmail(true)}} title='O lembrete não será enviado para o e-mail do cliente'>
                        <FiMail className='notificationEmailInactive' />
                      </button>
                    )}
                    &nbsp;&nbsp;
                    {flgNotifyWhatsApp == true ? (
                      <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyWhatsApp(false)}} title='O lembrete será enviado para o WhatsApp do cliente'>
                        <FaWhatsapp className='notificationWhatsAppActive' />
                      </button>
                    ) : (
                      <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyWhatsApp(true)}} title='O lembrete não será enviado para o WhatsApp do cliente'>
                        <FaWhatsapp className='notificationWhatsAppInactive' />
                      </button>
                    )}
                    &nbsp;&nbsp;
                    <button type="button" onClick={() => {setFlgNotifyPeople(false); setFlgNotifyEmail(false); setFlgNotifyWhatsApp(false)}}>
                      <FiTrash className='trash' title="Excluir" />
                    </button>
                  </>
                ) : (
                  <button type="button" id="NotificationCustomerButton" onClick={() => {setFlgNotifyPeople(true)}} style={{color:'blue'}} title='Após clicar no botão selecione as opções de notificação por E-Mail ou WhatsApp'>
                    <p>Notificar Cliente</p>
                  </button>  
                )}
              </div>
            </div>
            <br /><br /><br /><br />

            <div id='Values' style={{marginTop:'-30px'}}>
              <div id='Prorating' className='proratingDeal'>
                <AutoCompleteSelect>
                  <p>Rateio</p>
                  <Select
                    isSearchable
                    value={proratingList.filter(options => options.id == prorating)}
                    onChange={handleProratingStatus}
                    required
                    placeholder=""
                    styles={selectStyles}
                    options={proratingList}
                    isDisabled={isEdit}
                  />
                </AutoCompleteSelect>
              </div>

              <div id='Company' className='companyDeal'>
                <label htmlFor="valor">
                  Escritório
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={lawyerValue}
                    className='inputField'
                    onChange={handleLawyerValue}
                    onBlur={handleLawyerBlur}
                    disabled={isEdit}
                  />
                </label>
              </div>

              <div id='Customer' className='customerDeal'>
                <label htmlFor="valor">
                  Cliente
                  <IntlCurrencyInput
                    currency="BRL"
                    config={currencyConfig}
                    value={customerValue}
                    className='inputField'
                    disabled
                  />
                </label>
              </div>

              {(dealId != '' && dealId != '0') && (
                <div id='UpdateDeal' className='updateDeal'>
                  <button type="button" id="updateDeal" disabled={isEdit} onClick={(e) => handleOpenMatterFileModal()}>
                    <div title="Anexar Arquivo" style={{float:'left', color:'var(--blue-twitter)', fontWeight:400}}><FaFileAlt />&nbsp;Anexar Arquivo</div>
                  </button>
                </div>
              )}
              
            </div>
            <br /><br /><br />

            <div id='ParcelaAtualDeal' className='parcelaAtualDeal2'>
              <span>Parcela {parcelaAtual} de {dealParcelasFirst}</span>
            </div>

            {/* DETALHES ACORDO */}
            {!isEdit && (  
              <div id='ResumoAcordo' className='resumo'>
                <span style={{marginLeft:'45%', fontSize:'18px', fontWeight:600}}>Resumo Acordo</span>
                <br />
                
                {/* LINHA 1 */}
                <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                  <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                </div>

                <div id='DataAcordoResumo' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate1(e.target.value)}
                      value={dealDate1}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorAcordoResumo' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Escritório
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue1}
                      className='inputField'
                      disabled
                    />
                  </label>
                </div>

                <div id='CategoriaResumo' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId1, label: categoryDescription1 }}
                      onChange={handleCategorySelected1}
                      onInputChange={(term) => setCategoryTerm1(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='FormaPagamentoResumo' className='formaPagamentoResumo'>
                  <label>
                    Forma Pagto.
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: paymentFormId1, label: paymentFormDescription1 }}
                      onChange={handlePaymentFormSelected1}
                      onInputChange={(term) => setPaymentFormTerm1(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={paymentFormList}
                    />
                  </label>
                </div>

                <div id='CentroCustoResumo' className='centroCustoResumo'>
                  <label>
                    Centro de Custo
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: centerCostId1, label: centerCostDescription1 }}
                      onChange={handleCenterCostSelected1}
                      onInputChange={(term) => setCenterCostTerm1(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={centerCostList}
                    />
                  </label>
                </div>
                <br />

                <div id='DescricaoResumo' className='descricaoResumo'>
                  <input
                    style={{width:'100%'}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription1(e.target.value)}
                  />
                </div>
                <br /><br /><br />

                {/* LINHA 2 */}
                <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                  <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                </div>

                <div id='DataAcordoResumo' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate2(e.target.value)}
                      value={dealDate2}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorAcordoResumo' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Receita P/ Repasse Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue2}
                      className='inputField'
                      disabled
                    />
                  </label>
                </div>

                <div id='CategoriaResumo' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId2, label: categoryDescription2 }}
                      onChange={handleCategorySelected2}
                      onInputChange={(term) => setCategoryTerm2(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='FormaPagamentoResumo' className='formaPagamentoResumo'>
                  <label>
                    Forma Pagto.
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: paymentFormId2, label: paymentFormDescription2 }}
                      onChange={handlePaymentFormSelected2}
                      onInputChange={(term) => setPaymentFormTerm2(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={paymentFormList}
                    />
                  </label>
                </div>

                <div id='CentroCustoResumo' className='centroCustoResumo'>
                  <label>
                    Centro de Custo
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: centerCostId2, label: centerCostDescription2 }}
                      onChange={handleCenterCostSelected2}
                      onInputChange={(term) => setCenterCostTerm2(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={centerCostList}
                    />
                  </label>
                </div>
                <br />

                <div id='DescricaoResumo' className='descricaoResumo'>
                  <input
                    style={{width:'100%'}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription2(e.target.value)}
                  />
                </div>
                <br /><br /><br />

                {/* LINHA 3 */}
                <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                  <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'red'}} />
                </div>

                <div id='DataAcordoResumo' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate3(e.target.value)}
                      value={dealDate3}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorAcordoResumo' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Pagamento Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue3}
                      className='inputField'
                      disabled
                    />
                  </label>
                </div>

                <div id='CategoriaResumo' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId3, label: categoryDescription3 }}
                      onChange={handleCategorySelected3}
                      onInputChange={(term) => setCategoryTerm3(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='FormaPagamentoResumo' className='formaPagamentoResumo'>
                  <label>
                    Forma Pagto.
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: paymentFormId3, label: paymentFormDescription3 }}
                      onChange={handlePaymentFormSelected3}
                      onInputChange={(term) => setPaymentFormTerm3(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={paymentFormList}
                    />
                  </label>
                </div>

                <div id='CentroCustoResumo' className='centroCustoResumo'>
                  <label>
                    Centro de Custo
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: centerCostId3, label: centerCostDescription3 }}
                      onChange={handleCenterCostSelected3}
                      onInputChange={(term) => setCenterCostTerm3(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={centerCostList}
                    />
                  </label>
                </div>
                <br />

                <div id='DescricaoResumo' className='descricaoResumo'>
                  <input
                    style={{width:'100%'}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription3(e.target.value)}
                  />
                </div>
                <br /><br /><br />
              </div>
            )}

            {/* MOVIMENTOS */}
            {isEdit && (  
              <div id='ResumoAcordo' className='resumo'>
                <span style={{marginLeft:'45%', fontSize:'18px', fontWeight:600}}>Editar Parcelas</span>
                <br />
                
                {/* LINHA 1 */}
                <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                  <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                </div>

                <div id='DataMovimento' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {setDealDate1(e.target.value); setDealDate2(e.target.value)}}
                      value={dealDate1}
                    />
                  </label>
                </div>

                <div id='ValorMovimento' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Escritório
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue1}
                      className='inputField'
                      onChange={handleValue1}
                    />
                  </label>
                </div>

                <div id='CategoriaMovimento' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId1, label: categoryDescription1 }}
                      onChange={handleCategorySelected1}
                      onInputChange={(term) => setCategoryTerm1(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='FormaPagamentoMovimento' className='formaPagamentoResumo'>
                  <label>
                    Forma Pagto.
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: paymentFormId1, label: paymentFormDescription1 }}
                      onChange={handlePaymentFormSelected1}
                      onInputChange={(term) => setPaymentFormTerm1(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={paymentFormList}
                    />
                  </label>
                </div>

                <div id='CentroCustoMovimento' className='centroCustoResumo'>
                  <label>
                    Centro de Custo
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: centerCostId1, label: centerCostDescription1 }}
                      onChange={handleCenterCostSelected1}
                      onInputChange={(term) => setCenterCostTerm1(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={centerCostList}
                    />
                  </label>
                </div>
                <br />

                <div id='DescricaoMovimento' className='descricaoResumo'>
                  <input
                    style={{width:'100%'}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription1(e.target.value)}
                  />
                </div>
                <br /><br /><br />

                {/* LINHA 2 */}
                <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                  <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                </div>

                <div id='DataMovimento' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate2(e.target.value)}
                      value={dealDate2}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorMovimento' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Receita P/ Repasse Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue2}
                      className='inputField'
                      onChange={handleValue2}
                    />
                  </label>
                </div>

                <div id='CategoriaMovimento' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId2, label: categoryDescription2 }}
                      onChange={handleCategorySelected2}
                      onInputChange={(term) => setCategoryTerm2(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='FormaPagamentoMovimento' className='formaPagamentoResumo'>
                  <label>
                    Forma Pagto.
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: paymentFormId2, label: paymentFormDescription2 }}
                      onChange={handlePaymentFormSelected2}
                      onInputChange={(term) => setPaymentFormTerm2(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={paymentFormList}
                    />
                  </label>
                </div>

                <div id='CentroCustoMovimento' className='centroCustoResumo'>
                  <label>
                    Centro de Custo
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: centerCostId2, label: centerCostDescription2 }}
                      onChange={handleCenterCostSelected2}
                      onInputChange={(term) => setCenterCostTerm2(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={centerCostList}
                    />
                  </label>
                </div>
                <br />

                <div id='DescricaoMovimento' className='descricaoResumo'>
                  <input
                    style={{width:'100%'}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription2(e.target.value)}
                  />
                </div>
                <br /><br /><br />

                {/* LINHA 3 */}
                <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                  <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'red'}} />
                </div>

                <div id='DataMovimento' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate3(e.target.value)}
                      value={dealDate3}
                    />
                  </label>
                </div>

                <div id='ValorMovimento' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Pagamento Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue3}
                      className='inputField'
                      onChange={handleValue3}
                    />
                  </label>
                </div>

                <div id='CategoriaMovimento' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId3, label: categoryDescription3 }}
                      onChange={handleCategorySelected3}
                      onInputChange={(term) => setCategoryTerm3(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='FormaPagamentoMovimento' className='formaPagamentoResumo'>
                  <label>
                    Forma Pagto.
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: paymentFormId3, label: paymentFormDescription3 }}
                      onChange={handlePaymentFormSelected3}
                      onInputChange={(term) => setPaymentFormTerm3(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={paymentFormList}
                    />
                  </label>
                </div>

                <div id='CentroCustoMovimento' className='centroCustoResumo'>
                  <label>
                    Centro de Custo
                    <Select
                      isSearchable
                      isClearable
                      value={{ id: centerCostId3, label: centerCostDescription3 }}
                      onChange={handleCenterCostSelected3}
                      onInputChange={(term) => setCenterCostTerm3(term)}
                      required
                      placeholder=""
                      styles={selectStyles}
                      options={centerCostList}
                    />
                  </label>
                </div>
                <br />

                <div id='DescricaoMovimento' className='descricaoResumo'>
                  <input
                    style={{width:'100%'}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription3(e.target.value)}
                  />
                </div>
                <br /><br /><br />
              </div>
            )}

            <br />

            <div id='Buttons'>
              <div className='log'>
                {dealId != "0" && (
                  <button type="button" id="log" onClick={handleLogOnDisplay}>
                    <div style={{float:'left'}}><IoIosPaper title="Ver Historico" /></div>
                    <div style={{float:'left'}}>&nbsp;Ver Histórico</div>
                  </button>
                )}
              </div>
              <div style={{float:'right', marginRight:'-1%'}}>
                
                {!isEdit && (
                  <button className="buttonClick" type='button' onClick={(e) => HandleSave()}>
                    <BiSave />
                    Salvar
                  </button>
                )}

                {isEdit && (
                  <button className="buttonClick" type='button' onClick={(e) => SaveMovement(true)}>
                    <BiSave />
                    Salvar Parcela
                  </button>
                )}

                {(dealId != '0' && !isEdit) && (
                  <button className="buttonClick" type='button' onClick={()=> handleDelete()}>
                    <FiTrash />
                    Excluir
                  </button>
                )}

                {(dealId != '0' && isEdit) && (
                  <button className="buttonClick" type='button' onClick={()=> handleDelete()}>
                    <FiTrash />
                    Excluir Parcela
                  </button>
                )}

                <button type='button' className="buttonClick" onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`)}}>
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
            <br /><br />
          </Content>
        )}

        {isMOBILE && (
          <ContentMobile>
            <div id='SelectPeople' className='selectPeople'>
            <AutoCompleteSelect>
                <p>Pessoas</p>
                    <Select
                      isSearchable
                      value={{ id: peopleId, label: peopleDescription }}
                      onChange={handlePeopleSelected}
                      onInputChange={(term) => setPeopleTerm(term)}
                      isClearable
                      placeholder=""
                      isLoading={isLoadingComboData}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      styles={selectStyles}
                      options={peopleList}
                      isDisabled={isEdit}
                    />
                </AutoCompleteSelect>       
            </div>

            <div className="personList">              
                {isMOBILE && (
                  <>
                    <br />
                    <br />
                    <br />
                  </>
                )}
        
                {selectedPeopleList.map(item => {
                  return (
                    <p>
                      {item.label}
                      {!isEdit && ( 
                         <FiTrash onClick={() => handleRemoveItemPeople(item)} />
                      )}                  
                    </p>
                  )
                })}
            </div>

            <div id='AttachMatter' className='attachMatter'>
              <Process>
                {processTitle === 'Associar Processo' && (
                  <button
                    type="button"
                    id="associar"
                    onClick={handleGridSelectProcess}
                    disabled={isEdit}
                  >
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
                  <button
                    type="button"
                    onClick={handleGridSelectProcess}
                    disabled={isEdit}
                  >
                    <RiFolder2Fill />
                  </button>
                )}

                {processTitle !== 'Associar Processo' && (
                  <button
                    type="button"
                    onClick={() => {
                      setProcessTitle('Associar Processo');
                      setAppointmentMatter(undefined);
                      setMatterId('0');
                    }}
                    disabled={isEdit}
                  >
                    &nbsp;&nbsp;
                    {!blockAssociateMatter && <RiEraserLine /> }
                  </button>
                )}
              </Process>
            </div>

            <div id='Valor' className='valorAcordo'>
              <label htmlFor="valor">
                Valor
                <IntlCurrencyInput
                  currency="BRL"
                  config={currencyConfig}
                  value={dealValue}
                  className='inputField'
                  onChange={handleValue}
                  onBlur={handleValueBlur}
                  disabled={isEdit}
                />
              </label>
            </div>

            <div id='DataAcordo' className='dataAcordo'>
              <label htmlFor='Data'>
                <DatePicker
                  title="Data"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate(e.target.value)}
                  onBlur={(e: ChangeEvent<HTMLInputElement>) => { setDealDate1(e.target.value); setDealDate2(e.target.value); setDealDate3(e.target.value) }}
                  value={dealDate}
                  disabled={isEdit}
                />
              </label>
            </div>
            
            <div id='Parcelas' className='parcelasAcordo'>
              <div>
                <label htmlFor="parcela">
                  Parcelas
                  <Select
                    autoComplete="off"
                    styles={selectStyles}
                    value={parcelas.filter(options => options.id === dealParcelas)}
                    onChange={(item) => handleChangeParcelas(item? item.id: '')}
                    options={parcelas}
                    isDisabled={isEdit}
                  />
                </label>
              </div>          
            </div>

            <div style={{marginTop:"3%"}}>
              <label htmlFor="valor">
                {/* Dias Para Repasse Valor Acordo */}
                Dias Repasse               
                <input
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  type="text"
                  className='inputField'
                  maxLength={20}
                  value={period}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPeriod(e.target.value)}
                  onBlur={(e: ChangeEvent<HTMLInputElement>) => handlePeriodBlur(e.target.value)}
                  disabled={isEdit}
                />
              </label>       
            </div>

            <div id='Reminder' className='reminder'>
              <label htmlFor="lembretes">
                Lembrete &nbsp;
                <Select
                  autoComplete="off"
                  placeholder="Selecione"
                  styles={selectStyles}
                  value={financialReminders.filter(options => options.id === reminders)}
                  onChange={(item) => handleReminders(item)}
                  options={financialReminders}
                  isDisabled={isEdit}
                />
              </label>       
            </div>

            <div id='NotifyPeople' className='notifyPeople'>
              {flgNotifyPeople ? (
                <>
                  {flgNotifyEmail == true ? (
                    <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyEmail(false)}} title='O lembrete será enviado para o e-mail do cliente'>
                      <FiMail className='notificationEmailActive' />
                    </button>
                  ) : (
                    <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyEmail(true)}} title='O lembrete não será enviado para o e-mail do cliente'>
                      <FiMail className='notificationEmailInactive' />
                    </button>
                  )}
                  &nbsp;&nbsp;
                  {flgNotifyWhatsApp == true ? (
                    <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyWhatsApp(false)}} title='O lembrete será enviado para o WhatsApp do cliente'>
                      <FaWhatsapp className='notificationWhatsAppActive' />
                    </button>
                  ) : (
                    <button type="button" disabled={isEdit} onClick={() => {setFlgNotifyWhatsApp(true)}} title='O lembrete não será enviado para o WhatsApp do cliente'>
                      <FaWhatsapp className='notificationWhatsAppInactive' />
                    </button>
                  )}
                </>
              ) : (
                <button type="button" id="NotificationCustomerButton" onClick={() => {setFlgNotifyPeople(true)}} style={{color:'blue'}} title='Após clicar no botão selecione as opções de notificação por E-Mail ou WhatsApp'>
                  <p>Notificar Cliente</p>
                </button>  
              )}
            </div>
            <br />

            <div id='Prorating' className='proratingDeal'>
              <AutoCompleteSelect style={{margin:0}}>
                <p>Rateio</p>
                <Select
                  isSearchable
                  value={proratingList.filter(options => options.id == prorating)}
                  onChange={handleProratingStatus}
                  required
                  placeholder=""
                  styles={selectStyles}
                  options={proratingList}
                  isDisabled={isEdit}
                />
              </AutoCompleteSelect>
            </div>

            <div id='Company' className='companyDeal'>
              <label htmlFor="valor">
                Escritório
                <IntlCurrencyInput
                  currency="BRL"
                  config={currencyConfig}
                  value={lawyerValue}
                  className='inputField'
                  onChange={handleLawyerValue}
                  onBlur={handleLawyerBlur}
                  disabled={isEdit}
                />
              </label>
            </div>

            <div id='Customer' className='customerDeal'>
              <label htmlFor="valor">
                Cliente
                <IntlCurrencyInput
                  currency="BRL"
                  config={currencyConfig}
                  value={customerValue}
                  className='inputField'
                  disabled
                />
              </label>
            </div>

            {(dealId != '' && dealId != '0') && (
              <div id='UpdateDeal' className='updateDeal'>
                <button type="button" id="updateDeal" disabled={isEdit} onClick={(e) => handleOpenMatterFileModal()}>
                  <div title="Anexar Arquivo" style={{float:'left', color:'var(--blue-twitter)', fontWeight:400}}><FaFileAlt />&nbsp;Anexar Arquivo</div>
                </button>
              </div>
            )}

            <div id='ParcelaAtualDeal' className='parcelaAtualDeal'>
              <span>Parcela {parcelaAtual} de {dealParcelasFirst}</span>
            </div>

            {/* DETALHES ACORDO */}
            {!isEdit && (  
              <div id='ResumoAcordo' className='resumo'>
                <div className='label-resum'>
                  <span style={{fontSize: '12px', fontWeight: 600 }}>Resumo Acordo</span>
                </div>
            
                {/* LINHA 1 */}
                <div style={{display:"flex"}}>
                  <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                    <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                  </div>

                  <span style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: '12px', fontWeight: 600 }}>Escritório</span>
                </div>

                <div id='DataAcordoResumo' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate1(e.target.value)}
                      value={dealDate1}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorAcordoResumo' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Escritório
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue1}
                      className='inputField'
                      disabled
                    />
                  </label>
                </div>

                <div id='CategoriaResumo' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId1, label: categoryDescription1 }}
                      onChange={handleCategorySelected1}
                      onInputChange={(term) => setCategoryTerm1(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='DescricaoResumo' className='descricaoResumo'>
                  <input
                    style={{width:'100%', fontSize:"9px"}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription1(e.target.value)}
                  />
                </div>

                <div style={{borderBottom:"1px solid #cacaca", marginTop:"10%"}}>
                  {" "}
                </div>

                {/* LINHA 2 */}
                <div style={{display:"flex"}}>
                  <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                    <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                  </div>

                  <span style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: '12px', fontWeight: 600 }}>Escritório - Repasse</span>
                </div>

                <div id='DataAcordoResumo' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate2(e.target.value)}
                      value={dealDate2}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorAcordoResumo' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Receita P/ Repasse Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue2}
                      className='inputField'
                      disabled
                    />
                  </label>
                </div>

                <div id='CategoriaResumo' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId2, label: categoryDescription2 }}
                      onChange={handleCategorySelected2}
                      onInputChange={(term) => setCategoryTerm2(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='DescricaoResumo' className='descricaoResumo'>
                  <input
                    style={{width:'100%', fontSize:"9px"}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription2(e.target.value)}
                  />
                </div>

                <div style={{borderBottom:"1px solid #cacaca", marginTop:"10%"}}>
                  {" "}
                </div>

                {/* LINHA 3 */}
                <div style={{display:"flex"}}>
                  <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                    <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'red'}} />
                  </div>

                  <span style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: '12px', fontWeight: 600 }}>Cliente</span>
                </div>

                <div id='DataAcordoResumo' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate3(e.target.value)}
                      value={dealDate3}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorAcordoResumo' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Pagamento Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue3}
                      className='inputField'
                      disabled
                    />
                  </label>
                </div>

                <div id='CategoriaResumo' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId3, label: categoryDescription3 }}
                      onChange={handleCategorySelected3}
                      onInputChange={(term) => setCategoryTerm3(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='DescricaoResumo' className='descricaoResumo'>
                  <input
                    style={{width:'100%', fontSize:"9px"}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription3(e.target.value)}
                  />
                </div>

                <br />
              </div>
              
            )}

            {/* MOVIMENTOS */}
            {isEdit && (  
              <div id='ResumoAcordo' className='resumo'>
                <div className='label-resum'>
                  <span style={{fontSize: '12px', fontWeight: 600 }}>Editar Parcelas</span>
                </div>
                
                {/* LINHA 1 */}
                <div style={{display:"flex"}}>
                  <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                    <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                  </div>

                  <span style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: '12px', fontWeight: 600 }}>Escritório</span>
                </div>

                <div id='DataMovimento' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {setDealDate1(e.target.value); setDealDate2(e.target.value)}}
                      value={dealDate1}
                    />
                  </label>
                </div>

                <div id='ValorMovimento' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Escritório
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue1}
                      className='inputField'
                      onChange={handleValue1}
                    />
                  </label>
                </div>

                <div id='CategoriaMovimento' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId1, label: categoryDescription1 }}
                      onChange={handleCategorySelected1}
                      onInputChange={(term) => setCategoryTerm1(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='DescricaoMovimento' className='descricaoResumo'>
                  <input
                    style={{width:'100%', fontSize:"9px"}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description1}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription1(e.target.value)}
                  />
                </div>

                <div style={{borderBottom:"1px solid #cacaca", marginTop:"10%"}}>
                  {" "}
                </div>

                {/* LINHA 2 */}
                <div style={{display:"flex"}}>
                  <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                    <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'green'}} />
                  </div>

                  <span style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: '12px', fontWeight: 600 }}>Escritório - Repasse</span>
                </div>

                <div id='DataMovimento' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate2(e.target.value)}
                      value={dealDate2}
                      disabled
                    />
                  </label>
                </div>

                <div id='ValorMovimento' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Receita P/ Repasse Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue2}
                      className='inputField'
                      onChange={handleValue2}
                    />
                  </label>
                </div>

                <div id='CategoriaMovimento' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId2, label: categoryDescription2 }}
                      onChange={handleCategorySelected2}
                      onInputChange={(term) => setCategoryTerm2(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='DescricaoMovimento' className='descricaoResumo'>
                  <input
                    style={{width:'100%', fontSize:"9px"}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description2}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription2(e.target.value)}
                  />
                </div>

                <div style={{borderBottom:"1px solid #cacaca", marginTop:"10%"}}>
                  {" "}
                </div>

                {/* LINHA 3 */}
                <div style={{display:"flex"}}>
                  <div id='TipoAcordoResumo' className='tipoAcordoResumo'>
                    <RiMoneyDollarBoxFill style={{height:'30px', width:'25px', color:'red'}} />
                  </div>

                  <span style={{ marginBottom: 'auto', marginTop: 'auto', fontSize: '12px', fontWeight: 600 }}>Cliente</span>
                </div>

                <div id='DataMovimento' className='dataAcordoResumo'>
                  <label htmlFor='Data'>
                    <DatePicker
                      title="Data"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDealDate3(e.target.value)}
                      value={dealDate3}
                    />
                  </label>
                </div>

                <div id='ValorMovimento' className='valorAcordoResumo'>
                  <label htmlFor="valor">
                    Valor Pagamento Cliente
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      value={dealValue3}
                      className='inputField'
                      onChange={handleValue3}
                    />
                  </label>
                </div>

                <div id='CategoriaMovimento' className='categoriaResumo'>
                  <label>
                    Categoria
                    <Select
                      isSearchable
                      value={{ id: categoryId3, label: categoryDescription3 }}
                      onChange={handleCategorySelected3}
                      onInputChange={(term) => setCategoryTerm3(term)}
                      isClearable
                      placeholder=""
                      styles={selectStyles}
                      options={categoryList}
                      required
                    />
                  </label>
                </div>

                <div id='DescricaoMovimento' className='descricaoResumo'>
                  <input
                    style={{width:'100%', fontSize:"9px"}}
                    type="text"
                    className='inputField'
                    maxLength={1000}
                    value={description3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription3(e.target.value)}
                  />
                </div>
                <br />
              </div>
            )}
            <br />

            <div id='Buttons'>
              <div className='log'>
                {dealId != "0" && (
                  <button type="button" id="log" onClick={handleLogOnDisplay}>
                    <div style={{float:'left'}}><IoIosPaper title="Ver Historico" /></div>
                    <div style={{float:'left', fontSize:"10px"}}>&nbsp;Ver Histórico</div>
                  </button>
                )}
              </div>
              
              {isEdit && (
                <>
                  <br />
                  <br />
                  <br />
                </>
              )}

              {!isMOBILE && (
                <div style={{float:'right', marginRight:'-1%'}}>
                  
                  {!isEdit && (
                    <button className="buttonClick" type='button' onClick={(e) => HandleSave()}>
                      <BiSave />
                      Salvar
                    </button>
                  )}

                  {isEdit && (
                    <button className="buttonClick" type='button' onClick={(e) => SaveMovement(true)}>
                      <BiSave />
                      Salvar Parcela
                    </button>
                  )}

                  {(dealId != '0' && !isEdit) && (
                    <button className="buttonClick" type='button' onClick={()=> handleDelete()}>
                      <FiTrash />
                      Excluir
                    </button>
                  )}

                  {(dealId != '0' && isEdit) && (
                    <button className="buttonClick" type='button' onClick={()=> handleDelete()}>
                      <FiTrash />
                      Excluir Parcela
                    </button>
                  )}

                  <button type='button' className="buttonClick" onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`)}}>
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              )}

              {isMOBILE && (
                <div style={{ display: 'flex', flexWrap: 'nowrap' , float:"right", marginBottom:"125%"}}>
                  {!isEdit && (
                    <button className="buttonClick" type='button' onClick={(e) => HandleSave()}>
                      <BiSave />
                      Salvar
                    </button>
                  )}
                
                  {isEdit && (
                    <button className="buttonClick" type='button' onClick={(e) => SaveMovement(true)}>
                      <BiSave />
                      Salvar Parcela
                    </button>
                  )}
                
                  {(dealId !== '0' && !isEdit) && (
                    <button className="buttonClick" type='button' onClick={() => handleDelete()}>
                      <FiTrash />
                      Excluir
                    </button>
                  )}
                
                  {(dealId !== '0' && isEdit) && (
                    <button className="buttonClick" type='button' onClick={() => handleDelete()}>
                      <FiTrash />
                      Excluir Parcela
                    </button>
                  )}
                
                  <button type='button' className="buttonClick" onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`)}}>
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              )}

            </div>
          </ContentMobile>
        )}

        {confirmSave && (
          <ConfirmBoxModal
            title="Alteração do acordo"
            caller="changeDeal"
            useCheckBoxConfirm
            message="Você está alterando os termos do acordo e TODAS as parcelas serão reprocessadas considerando as novas informações."
          />
        )}

        {checkValueModal && (
          <ConfirmBoxModal
            title="Alterar valores do acordo"
            caller="changeValue"
            useCheckBoxConfirm
            message="O cálculo dos valores dos movimentos está diferente do valor total do acordo. Deseja salvar mesmo assim ?"
          />
        )}

        {(showModalOptions) && <OverlayFinancial /> }
        {showModalOptions && (
          <ModalOptions
            description="Este acordo está parcelado, deseja atualizar também as outras parcelas ?"
            close={() => setShowModalOptions(false)}
            callback={handleCallback}
          />
        )}

        {(showMovementModalOptions) && <OverlayFinancial /> }
        {showMovementModalOptions && (
          <ModalDealOptions
            description="Estes movimentos estão parcelados, deseja atualizar também as outras parcelas ?"
            close={() => setShowMovementModalOptions(false)}
            callback={handleMovementCallback}
          />
        )}

        {(showConfirmDelete) && <OverlayFinancial /> }
        {!isMOBILE && (
          <>
            {showConfirmDelete && (
              <ModalInformation className='information'>
                <div className='menuSection'>
                  <FiX onClick={(e) => {setShowConfirmDelete(false)}} />
                </div>
                <div style={{marginLeft:'5%'}}>
                  Confirma a Exclusão ?
                  <br />
                  <br />
                  <div style={{float:'right', marginRight:'32%', bottom:0}}>
                    <div style={{float:'left'}}>
                      <button
                        className="buttonClick"
                        type='button'
                        onClick={()=> Delete()}
                        style={{width:'100px'}}
                      >
                        <FaCheck />
                        Sim
                      </button>
                    </div>

                    <div style={{float:'left', width:'100px'}}>
                      <button
                        type='button'
                        className="buttonClick"
                        onClick={() => {setShowConfirmDelete(false)}}
                        style={{width:'100px'}}
                      >
                        <FaRegTimesCircle />
                        Não
                      </button>
                    </div>
                  </div>
                </div>

              </ModalInformation>
            )}
          </>
        )}

        {isMOBILE && (
          <>
            {showConfirmDelete && (
              <ModalInformationMobile className='information'>
                <div className='menuSection'>
                  <FiX onClick={(e) => {setShowConfirmDelete(false)}} />
                </div>
                <div style={{marginLeft:'5%'}}>
                  Confirma a Exclusão ?
                  <br />
                  <br />
                  <div style={{display:"flex"}}>
                    <div style={{width:"100%"}}>
                      <button
                        className="buttonClick"
                        type='button'
                        onClick={()=> Delete()}
                        style={{width:'90%'}}
                      >
                        <FaCheck />
                        Sim
                      </button>
                    </div>

                    <div style={{width:"100%"}}>
                      <button
                        type='button'
                        className="buttonClick"
                        onClick={() => {setShowConfirmDelete(false)}}
                        style={{width:'90%'}}
                      >
                        <FaRegTimesCircle />
                        Não
                      </button>
                    </div>
                  </div>
                  <br />
                </div>

              </ModalInformationMobile>
            )}
          </>
        )}

        {(showDeleteOptions) && <OverlayFinancial /> }
        {!isMOBILE && (
          <>
            {showDeleteOptions && (
              <ModalInformation className='information'>
                <div className='menuSection'>
                  <FiX onClick={(e) => {setShowDeleteOptions(false)}} />
                </div>
                <div style={{marginLeft:'5%'}}>
                  O acordo foi parcelado, selecione uma das opções abaixo para excluir apenas esta parcela ou todas referente ao acordo.
                  <br />
                  <br />
                  <br />
                  <div style={{float:'right', marginRight:'20%', bottom:0, marginTop:'-15px'}}>
                    <div style={{float:'left'}}>
                      <button
                        className="buttonClick"
                        type='button'
                        onClick={()=> DeleteOneInstallment()}
                        style={{width:'120px'}}
                      >
                        Excluir este
                      </button>
                    </div>

                    <div style={{float:'left'}}>
                      <button
                        className="buttonClick"
                        type='button'
                        onClick={()=> Delete()}
                        style={{width:'120px'}}
                      >
                        Excluir todos
                      </button>
                    </div>

                    <div style={{float:'left', width:'100px'}}>
                      <button
                        type='button'
                        className="buttonClick"
                        onClick={() => {setShowDeleteOptions(false)}}
                        style={{width:'100px'}}
                      >
                        <FaRegTimesCircle />
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>

              </ModalInformation>       
            )}
          </>
        )}

        {isMOBILE && (
          <>
            {showDeleteOptions && (
              <ModalInformationMobile className='information'>
                <div className='menuSection'>
                  <FiX onClick={(e) => {setShowDeleteOptions(false)}} />
                </div>
                <div style={{marginLeft:'5%'}}>
                  O acordo foi parcelado, selecione uma das opções abaixo para excluir apenas esta parcela ou todas referente ao acordo.
                  <br />
                  <br />
                  <br />
                  <div style={{display:"flex"}}>
                    <div style={{width:"100%"}}>
                      <button
                        className="buttonClick"
                        type='button'
                        onClick={()=> DeleteOneInstallment()}
                        style={{width:'90%'}}
                      >
                        Excluir este
                      </button>
                    </div>

                    <div style={{width:"100%"}}>
                      <button
                        className="buttonClick"
                        type='button'
                        onClick={()=> Delete()}
                        style={{width:'90%'}}
                      >
                        Excluir todos
                      </button>
                    </div>                  
                  </div>

                  <br />
                  <br />

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                      type='button'
                      className="buttonClick"
                      onClick={() => {setShowDeleteOptions(false)}}
                      style={{width:'100px'}}
                    >
                      <FaRegTimesCircle />
                      Cancelar
                    </button>
                  </div>
                  <br />                 
                </div>

              </ModalInformationMobile>       
            )}
          </>
        )}

        {(isEditModal) && <OverlayFinancial /> }
        {!isMOBILE && (
          <>
            {isEditModal && (
              <ModalInformation className='information'>
                <div style={{marginLeft:'5%'}}>
                  <br />
                  Você está alterando um acordo. Você pretende alterar todos os termos do acordo e suas respectivas parcelas ou apenas esta parcela ?
                  <br /><br /><br />
                  <div style={{float:'right', marginRight:'13%', marginTop:'-15px', bottom:0}}>
                    <div style={{float:'left'}}>
                      <button className="buttonClick" type='button' style={{width:'140px'}} onClick={()=> EditDeal()}>
                        Editar todo acordo
                      </button>
                    </div>

                    <div style={{float:'left'}}>
                      <button className="buttonClick" type='button' style={{width:'140px'}} onClick={()=> EditMovement()}>
                        Editar parcela
                      </button>
                    </div>

                    <div style={{float:'left'}}>
                      <button className="buttonClick" type='button' style={{width:'130px'}} onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`)}}>
                        <FaRegTimesCircle />
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>

              </ModalInformation>
            )}
          </>
        )}

        {isMOBILE && (
          <>
            {isEditModal && (
              <ModalInformationMobile className='information'>
                <div style={{marginLeft:'5%', marginRight:"3%"}}>
                  <br />
                  Você está alterando um acordo. Você pretende alterar todos os termos do acordo e suas respectivas parcelas ou apenas esta parcela ?
                  <br /><br /><br />
                  <div>

                    <div style={{display:"flex"}}>

                      <div style={{width:"100%"}}>
                        <button className="buttonClick" style={{width:"90%"}} type='button' onClick={()=> EditDeal()}>
                          Editar todo acordo
                        </button>
                      </div>

                      <div style={{width:"100%"}}>
                        <button className="buttonClick" style={{width:"90%"}} type='button' onClick={()=> EditMovement()}>
                          Editar parcela
                        </button>
                      </div>

                    </div>
                   
                    <br />
                    <br />

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <button className="buttonClick" type='button' style={{ width: '50%' }} onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`)}}>
                        <FaRegTimesCircle />
                        Fechar
                      </button>
                    </div>
                  </div>
                  <br />
                </div>

              </ModalInformationMobile>
            )}
          </>
        )}

        {showLog && (
          <LogModal
            idRecord={Number(dealId)}
            handleCloseModalLog={handleCloseLog}
            logType="dealLog"
          />
        )}

      </Container>   
    </>   
  );
};

export default FinancialDeal;
