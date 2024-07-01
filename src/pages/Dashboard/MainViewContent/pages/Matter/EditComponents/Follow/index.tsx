/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
/* eslint-disable no-constant-condition */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */

import ConfirmBoxModal from 'components/ConfirmBoxModal';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { Grid, Table, TableHeaderRow, TableSelection, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { DataTypeProvider, SelectionState, IntegratedSelection, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import { FiEdit, FiTrash, FiSave } from 'react-icons/fi'
import { RiCalendarCheckFill } from 'react-icons/ri'
import { BiSearch } from 'react-icons/bi'
import { GoLinkExternal } from 'react-icons/go';
import { ImCheckmark2 } from 'react-icons/im';
import { GoPlus } from 'react-icons/go'
import { MdBlock } from 'react-icons/md'
import Loader from 'react-spinners/ClipLoader';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { languageGridPagination, languageGridEmpty, loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { FormatDate, selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { Container } from './styles';
import { IMatterFollowListData, ISelectData } from "../../../Interfaces/IMatter"
import { ListFollowType, ListFollowByMatter, ListMatterFollow, GetDefaults, DeleteFollow, SaveFollow, SelectFollow, SelecionarProcesso, SaveLink } from '../Services/MatterFollowData';
import MatterEventTypeEdit from '../../MatterEventType/Modal';
import { ModalCourtLinks } from './ModalCourtLinks';

const Follow = (props) => {

  const {matterId, numberOrigem } = props;
  const {addToast } = useToast();
  const { pathname } = useLocation();
  const {isOpenModal,handleCaptureTextPublication, modalActive, selectProcess } = useModal();
  const {register, handleSubmit, setValue, getValues, reset, control } = useForm()
  const {handleConfirmMessage, handleCancelMessage, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [disableGrid, setDisableGrid] = useState<boolean>(false)
  const [showForumModal, setShowForumModal] = useState<boolean>(false)
  const [showModalLink, setShowModalLink] = useState<boolean>(false)
  const [currentId, setCurrentId] = useState<number>(0)
  const [userIncludeId, setUserIncludeId] = useState<number>(0)
  const [statePage, setStatePage] = useState<string>('')
  const [termFollow, setTermFollow] = useState<string>('')
  const [selection, setSelection] = useState<Array<number | string>>([])
  const [listFollow, setListFollow] = useState<IMatterFollowListData[]>([])
  const [courtList, setCourtList] = useState<ISelectData[]>([])
  const [typeList, setTypeList] = useState<ISelectData[]>([])
  const [court, setCourt] = useState<ISelectData | undefined | null>()
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([10, 20, 50, 100]);
  const [currentPage, setCurrentPage] = useState(0);
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (numberOrigem.length > 0){
      setValue('numberOrigin', numberOrigem)
    }
  }, [numberOrigem])


  // first initialization
  useEffect(() => {
    LoadComboData();
  }, [])


  // load follows by default pagination
  useEffect(() => {
    setStatePage("pagination")
    LoadMatterFollow(currentPage + 1)
  }, [currentPage])


  useEffect(() => {
    if (pageSize && !isLoading) {
      setCurrentPage(0)
      setStatePage("pagination")
      LoadMatterFollow(0)
    }
  }, [pageSize])


  useEffect(() => {
    if (!modalActive && !isLoading){

      const reloadLists = async () => {
        setStatePage('')
        await LoadMatterFollow(0)
        await GetDefaultsFollow(0)
      }

      reloadLists();
    }
  },[isLoading, modalActive])


  useEffect(() => {
    if (court && statePage == 'changeDefault' && !disableGrid){
        GetDefaultsFollow(Number(court?.id))
    }
  },[court, statePage])


  const LoadComboData = async() => {
    await LoadMatterFollowType()
    await LoadMatterCourt()
  }


  const LoadMatterFollow = async (page:number) => {
    try
    {
      const response = await ListMatterFollow(matterId, page, pageSize)

      // calculate pagination total as made today
      const rowNumber = response.data.length >0? response.data[0].rowNumber: 0;
      const rowFactor = response.data.length >0? response.data[0].totalRowFactor: 0;

      // calculate lines
      const total = rowNumber + rowFactor - 1

      setTotalCount(total)

      setListFollow(response.data)
      setIsLoading(false)
      setStatePage('')
    }
    catch(ex: any){
      setIsLoading(false)
      setStatePage('')
    }
  }


  const LoadMatterCourt = async  () => {
    const response = await ListFollowByMatter(matterId)

    const listResult: ISelectData[] = [];
    response.data.map((item) => {
      listResult.push({ id: item.id.toString(), label: item.description })

      return listResult;
    })

    setCourtList(listResult)
    // set first item as default
    if (listResult.length > 0) setCourt(listResult[0])

    setIsLoading(false)
    setStatePage('')
    setValue('date', FormatDate(new Date(), 'yyyy-MM-dd'))
  }


  const LoadMatterFollowType = async () => {
    const response = await ListFollowType(termFollow)
    const listResult: ISelectData[] = [];

    response.data.map((item) => {
      listResult.push({ id: item.id.toString(), label: item.value })

      return listResult;
    })

    setTypeList(listResult)
  }


  const GetDefaultsFollow = async (instanceId: number) => {
    const response = await GetDefaults(matterId, instanceId)

    setValue("numberOrigin", response.data.originNumber)
    setValue("numberNew",  response.data.newNumber)
    setValue("type", { id: response.data.courtTypeId, label:response.data.courtTypeName })
    setCourt({ id: response.data.courtId.toString(), label: response.data.courtName })
    setValue("shareCustomer", { id: '0', label: "SIM" })
    setValue("courtLink", response.data.courtLink)
    // setUrlTribunal(response.data.courtLink)
    setValue("date", FormatDate(new Date(response.data.date), "yyyy-MM-dd"))
    setStatePage('')
  }


  useEffect(() => {
    if (isConfirmMessage){
      if (statePage === 'checkDeleting' || statePage === 'checkDeletingWithPublication'){
        handleDelete()
      }

      handleConfirmMessage(false)
    }
  },[isConfirmMessage])


  useEffect(() => {
    if (isCancelMessage){
      setStatePage('')
    }

    handleCancelMessage(false)
  },[isCancelMessage])


  const Validate = () => {
    if ((matterId??0) == 0){
      addToast({type: "info", title: "Operação NÃO realizada", description:  'É necessário salvar o processo antes de gravar o pedido'})
      return false;
    }

    if (!court && pathname.includes('legal')){
      addToast({type: "info", title: "Operação NÃO realizada", description:  'O fórum não foi informado'})
      return false;
    }

    if (pathname.includes('legal')){
      if (court?.id == '' || court?.label == null){
        addToast({type: "info", title: "Operação NÃO realizada", description:  'O fórum não foi informado'})
        return false;
      }
    }

    const type = getValues('type')
    if (!type){
      addToast({type: "info", title: "Operação NÃO realizada", description:  'O tipo não foi informado'})
      return false;
    }

    const shareCustomer = getValues('shareCustomer')
    if (!shareCustomer){
      addToast({type: "info", title: "Operação NÃO realizada", description:  'O campo compartilhar com o cliente não foi informado'})
      return false;
    }

    const date = getValues('date')
    if (!date){
      addToast({type: "info", title: "Operação NÃO realizada", description:  'O campo data não foi informado'})
      return false;
    }

    const description = getValues('description')
    if (description.length === 0){
      addToast({type: "info", title: "Operação NÃO realizada", description:  'O campo descrição não foi informado'})
      return false;
    }

    return true;
  }


  const handleSave = async (data) => {
    try
    {
      // validation
      if (!Validate()) return;

      setStatePage('saving')

      // build save object
      data.matterId = matterId
      data.id = currentId;
      data.court = court;
      data.userIncludeId = userIncludeId;

      // save follow
      await SaveFollow(data)

      // reload list
      await LoadMatterFollow(currentPage + 1)

      // clear fields
      ResetStates();

      // reaload defaults
      await GetDefaultsFollow(0);

      setStatePage('')
      setIsEdit(false)

      addToast({type: "success", title: "Operação realizada com sucesso", description:  'O acompanhamento foi salvo com sucesso'})
    }
    catch(e: any)
    {
      addToast({type: "info", title: "Operação NÃO realizada", description:  "Houve uma falha na gravação do andamento"})
      setStatePage('')
      return;
    }
  }


  const handleDelete = async() => {
    try {
      setStatePage('deleting')

      let followDeleteIds = "";
      selection.map(item => {
        const follow = listFollow[item]
        if (follow){
          followDeleteIds += `${follow.recordType}${follow.id},`
        }

        return;
      })

      // delete lot
      await DeleteFollow(followDeleteIds)

      // reload page
      await LoadMatterFollow(currentPage);

      setStatePage('')
      setSelection([])
      setIsEdit(false)
    } catch (err:any) {
      addToast({type: "error", title: "Falha ao excluir andamento.", description:  err.response.data.Message})
      setStatePage('')
    }
  };


  const handleCancel = () => {
    setIsEdit(false)
    ResetStates();
    setStatePage('');
  }


  const handleCheckDelete = () => {

    // validation
    if (selection.length == 0){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  "Não existem acompanhamentos selecionados para exclusão"
      })

      return;
    }

    let hasPublicationEvent = false;
    selection.map(item => {
       const follow = listFollow[item]
      if (follow){
        if (!hasPublicationEvent){
          hasPublicationEvent = follow.tpoFollowType == 'W'
        }
      }

      return;
    })

    setStatePage(!hasPublicationEvent? 'checkDeleting': 'checkDeletingWithPublication')
  }


  const handleEditFollow = async (id: number) => {

    if (statePage.length > 0) return;

    setStatePage('editing')

    const response = await SelectFollow(id)

    if (response){
      const follow = response.data;

      setUserIncludeId(follow.userIncludeId)
      setValue("shareCustomer", follow.shareCustomer)
      setValue("type", follow.type)
      setValue("date", FormatDate(new Date(follow.date), "yyyy-MM-dd"))
      setValue("description", follow.description)
      setCurrentId(follow.id)

      if(follow.matterEventType == 'T' || follow.matterEventType == 'W')
        setIsEdit(true)
      else
        setIsEdit(false)

      if (pathname.includes('legal') && follow.court)
        setCourt({ id: follow.court.id.toString(), label: follow.court.label })

      setStatePage('')
      setDisableGrid(true)
    }
  }


  const handleClick = (props: any, eventType: string) => {

    if (props.column.name === 'edit' && eventType === 'follow'){
      handleEditFollow(props.row.id)
    }

    if (props.column.name === 'edit' && eventType === 'event'){
      handleOpenAppointmentModal(props.row.id.toString())
    }
  }


  const handleOpenAppointmentModal = async (id: string) => {

    try {

      if ((matterId??0) == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'É necessário salvar o processo antes de gravar o pedido'
        })
        return false;
      }

      if (selection.length > 1){

        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'Selecione apenas um acompanhamento para gerar o compromisso'
        })

        return false;
      }

      if (matterId > 0)
      {
        const response = await SelecionarProcesso(matterId)

        let courtDesc = "";
        let courtDeptDesc = "";

        if(response.data.instanceList.length > 0){
          const court = response.data.instanceList[0];

          courtDesc = `${court.forumDesc.toString()} - ${court.instance.toString()} Instância`;
          courtDeptDesc = `${court.varaNumber.toString()}ª ${court.varaDesc.toString()}`;
        }

        const matter = response.data;

        selectProcess({
          matterId,
          matterCustomerDesc: matter.matterCustomerDesc,
          matterOppossingDesc: matter.matterOppossingDesc,
          matterFolder: matter.matterFolder,
          matterNumber: matter.matterNumber,
        })

        let matterText =  `Pasta: ${matter.matterFolder} - Proc: ${matter.matterNumber}`

        if (matter.matterCustomerDesc){
          matterText += `\n${matter.matterCustomerDesc}`
        }

        if (matter.matterOppossingDesc){
          matterText += ` X ${matter.matterOppossingDesc}`
        }

        if (courtDesc){
          matterText += `\n${courtDesc}`
        }

        if (courtDeptDesc){
          matterText += `\n${courtDeptDesc}`
        }

        localStorage.setItem('@GoJur.eventByFollow', "S")

        // if was selected one follow - replace text matter by text from follow selected
        if (selection.length === 1){
          const followItem = listFollow[selection[0]];
          if (followItem){
            if (followItem.recordType != 'ME') matterText =  followItem.eventDesc;
            if (followItem.recordType == 'ME') matterText =  `${followItem.eventDesc  } ${  matterText}`;
            // matterText = (followItem.recordType === 'ME'? matterText: '') + followItem.eventDesc;
          }
        }

        handleCaptureTextPublication(matterText)

        isOpenModal(id)
      }


    } catch (err) {
      console.log('Error in create a new calendar by matter follow')
    }
  }


  useDelay(() => {

    if (!isLoading)
      LoadMatterFollowType()

  }, [termFollow, isLoading], 750)

  
  const handleOpenModalType = () => {
    setShowForumModal(true)
  }


  const handleSaveCallback = (data: any) => {
    const newType = {id: data.id, label: data.matterType }
    typeList.push(newType)
    setValue('type', newType)
  }


  const handleCloseModalCallback = () => {
    setShowForumModal(false)
  }


  const handleShowModalLink = () => {
    setShowModalLink(!showModalLink)
  }


  const handleCopyClipBoard = (text) => {
    const ta = document.createElement("textarea");
    ta.innerText = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();

    addToast({
      type: 'success',
      title: 'Operação realizada com sucesso',
      description: `O conteúdo foi copiada para a área de transferência e já pode ser utilizado`,
    });
  }


  const handleOpenModalCourt = () => {
    let url = getValues('courtLink');

    if (url.length === 0){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  'Endereço de acesso ao tribunal não foi informado'
      })

      return false;
    }

    // if there is no http or https append on string
    if (!url.includes('http://') && !url.includes('https://')) {
      url = `http://${  url}`
    }

    const numberMatter = getValues('numberOrigin')
    handleCopyClipBoard(numberMatter)
    window.open(url, '_blank')
  }


  const handleAssociateLink = async (url: string) => {
    try
    {
      if ((matterId??0) == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'É necessário salvar o processo antes de gravar o pedido'
        })
        return false;
      }

      if (url.length === 0){
        url = getValues('courtLink')
      }

      if (url.length === 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'Endereço de acesso ao tribunal não foi informado'
        })

        return false;
      }

      setStatePage('openLink')

      setValue("courtLink", url)
      await SaveLink(matterId, url)

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description:  'O link de acesso ao tribunal foi associado com sucesso'
      })

      setStatePage('')
    }
    catch(ex){
      console.log(ex)
      setStatePage('')
    }
  }


  const ResetStates = () => {
    setSelection([])
    setCourt(null)
    setCurrentId(0)
    setIsLoading(false)
    setDisableGrid(false)
    reset()
  }


  const columns = [
    { name: 'eventDate',          title: ' Data ' },
    { name: 'eventDesc',          title: ' Descrição '},
    { name: 'courtDescription',   title: ' Tipo do Forum '},
    { name: 'nom_PersonInclude',  title: ' Incluído por '},
    { name: 'nom_PersonEdit',     title: ' Alterado por '},
    { name: 'edit',               title: ' Editar '}
  ];


  const [tableColumnExtensions] = useState([
    { columnName: 'eventDate',          width: '10%' },
    { columnName: 'eventDesc',          width: '35%' },
    { columnName: 'courtDescription',   width: '20%' },
    { columnName: 'nom_PersonInclude',  width: '10%' },
    { columnName: 'nom_PersonEdit',     width: '10%' },
    { columnName: 'edit',               width: '5%' },
  ]);


  const CustomCell = (props) => {
    const { column } = props;

    // rule to color red text
    let textColor = "var(--secondary)"
    if (props.row.tpoFollowType === 'W' && props.row.recordType === 'ME' && props.row.securityType === 'U') textColor = 'blue'
    if (props.row.tpoFollowType === 'T' && props.row.recordType === 'ME' && props.row.securityType === 'U') textColor = 'green'

    // rule to bold font
    const bold = ((props.row.securityType === 'R' && props.row.recordType === 'ME')? 600: 100)

    if (column.name === 'edit' && props.row.recordType === "ME") {

      return (
        <Table.Cell onClick={() => handleClick(props, "follow")} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar o acompanhamento " />
        </Table.Cell>
      );

    }

    if (column.name === 'edit' && props.row.recordType === "MC") {

      return (
        <Table.Cell onClick={() => handleClick(props, "event")} {...props}>
          &nbsp;&nbsp;
          <RiCalendarCheckFill title="Clique para editar o compromisso " />
        </Table.Cell>
      );
    }

    if (column.name === 'eventDesc'){
      if (props.row.recordType === "MC")
      {
        if(props.row.calendarEventStatus === "L")
        {
          return (
            <Table.Cell {...props}>
              <td style={{ color:textColor, fontWeight:bold, textDecoration:'underline line-through', opacity:0.6 }} title={props.row.eventDesc}>
                {props.row.subjectDesc}
                <br />
                {props.row.eventDesc.length > 520? `${props.row.eventDesc.substring(0, 520)   }...`: props.row.eventDesc}
              </td>
            </Table.Cell>
          );
        }

        return (
          <Table.Cell {...props}>
            <td style={{ color: textColor, fontWeight:bold }} title={props.row.eventDesc}>
              {props.row.subjectDesc}
              <br />
              {props.row.eventDesc.length > 520? `${props.row.eventDesc.substring(0, 520)   }...`: props.row.eventDesc}
            </td>
          </Table.Cell>
        );
      }

      return (
        <Table.Cell {...props}>
          <td style={{ color: textColor, fontWeight:bold }} title={props.row.eventDesc}>
            {props.row.eventDesc.length > 520? `${props.row.eventDesc.substring(0, 520)   }...`: props.row.eventDesc}
          </td>
        </Table.Cell>
      );
    }

    if (column.name === 'eventDate'){
      
      if(props.row.recordType === "MC" && props.row.calendarEventStatus === "L")
      {
        return (
          <Table.Cell {...props}>
            <td style={{ color:textColor, fontWeight:bold, textDecoration:'underline line-through', opacity:0.6 }}>
              {FormatDate(new Date(props.row.eventDate), "dd/MM/yyyy")}
            </td>
          </Table.Cell>
        );
      }
      
      return (
        <Table.Cell {...props}>
          <td style={{ color: textColor, fontWeight:bold }}>
            {FormatDate(new Date(props.row.eventDate), "dd/MM/yyyy")}
          </td>
        </Table.Cell>
      );
    }

    if (column.name === 'nom_PersonInclude'){
      return (
        <Table.Cell {...props}>
          <td style={{ color: textColor, fontWeight:bold }}>
            {props.row.nom_PersonInclude}
          </td>
        </Table.Cell>
      );
    }

    if (column.name === 'nom_PersonEdit'){
      return (
        <Table.Cell {...props}>
          <td style={{ color: textColor, fontWeight:bold }}>
            {props.row.nom_PersonEdit}
          </td>
        </Table.Cell>
      );
    }

    if (column.name === 'courtDescription'){
      return (
        <Table.Cell {...props}>

          {props.row.numInstance > 0 && (
            <td style={{ color: textColor, fontWeight:bold }}>
                {`${props.row.nomCourt}`}
            </td>
          )}

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };


  const [dateColumns] = useState(['eventDate']);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );


  const shareCustomerOptions = [
    {id: 0, label: 'SIM'},
    {id: 1, label: 'NÃO'}
  ]


  const handleChangeCourt = (item: any) => {
    setCourt(item)
    setStatePage('changeDefault')
  }


  if (isLoading) {
    return (
      <Container>
        <div className="waiting">
          <Loader size={30} color="var(--blue-twitter)" />
        </div>
      </Container>
    )
  }


  /* ******************************************************************************
     Componenet follow is diferente between legal and advisory, so here is returned two view
     It is the unique component form detail diferent in view details, so pay attention !
     Sidney 18/05/2022
   ****************************************************************************** */


  if (pathname.includes('legal')) {

    return (
      <>

        <Container>

          {showModalLink && <ModalCourtLinks values={{ matterId, handleShowModalLink, handleAssociateLink }} /> }
          {showForumModal && <MatterEventTypeEdit caller="followMatterList" callbackFunctions={{handleSaveCallback, handleCloseModalCallback}} /> }

          <form onSubmit={handleSubmit(handleSave)}>

            <section>

              <label className='comboData'>
                Fórum
                <Select
                  isClearable
                  defaultValue={court}
                  value={courtList.find(item => item.id === court?.id)}
                  placeholder="Selecione um fórum"
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={courtList}
                  onChange={(item) => handleChangeCourt(item)}
                />
              </label>

              <label className='comboData'>
                Tipo
                <Controller
                  as={Select}
                  isClearable
                  isDisabled={isEdit}
                  onInputChange={(term) => setTermFollow(term)}
                  placeholder="Selecione um fórum"
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={typeList}
                  control={control}
                  name="type"
                  ref={register}
                />
              {((accessCode??"").includes('CFGMEVTP') || (accessCode??"") == 'adm') && (
                <GoPlus onClick={handleOpenModalType} title='Clique para incluir um novo tipo' />
              )}
              </label>

              <label className='comboData'>
                Compartilhar com o cliente ?
                <Controller
                  as={Select}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={shareCustomerOptions}
                  control={control}
                  name="shareCustomer"
                  ref={register}
                />
              </label>

              <label style={{flex:'4%'}}>
                Data
                <input
                  type='date'
                  ref={register}
                  name="date"
                />
              </label>

            </section>

            <section>

            <label>
              Descrição
              <textarea
                rows={5}
                ref={register}
                name="description"
              />
            </label>

            </section>

            <section>

              <label style={{flex:'25%'}}>
                Número Origem
                <input
                  type='text'
                  readOnly
                  ref={register}
                  name="numberOrigin"
                />
              </label>

              <label style={{flex:'60%'}}>
                Link Tribunal
                <input
                  type='text'
                  ref={register}
                  name="courtLink"
                />
              </label>

              <div className='linkButtons'>
                <BiSearch onClick={handleShowModalLink} title='Clique para pesquisar links de tribunais e/ou inserir o um novo' style={{marginTop:'6px'}} />
                <GoLinkExternal onClick={handleOpenModalCourt} title='Clique para acessar o link do tribunal' style={{marginTop:'6px'}} />
                <ImCheckmark2 onClick={() => handleAssociateLink('')} title='Clique para salvar o link do tribunal' style={{marginTop:'6px'}} />
              </div>

            </section>

            <footer>

              {(accessCode?.includes('MATLEGAL') || accessCode === 'adm') && (
                <>
                  <button
                    type='submit'
                    className='buttonLinkClick'
                  >
                    <FiSave />
                    Salvar
                  </button>

                  {!disableGrid && (
                    <button
                      type='button'
                      onClick={() => handleOpenAppointmentModal("0")}
                      className='buttonLinkClick'
                    >
                      <RiCalendarCheckFill />
                      Agendar Compromisso
                    </button>
                  )}

                  {statePage == '' && (
                    <>
                      {(accessCode?.includes('MATLEVDE') || accessCode === 'adm') && (
                      <button
                        type='button'
                        onClick={handleCheckDelete}
                        className='buttonLinkClick'
                      >
                        <FiTrash />
                        Excluir
                      </button>
                    )}
                    </>
                  )}
                </>
              )}

              {disableGrid && (
                <button
                  type='button'
                  onClick={handleCancel}
                  className='buttonLinkClick'
                >
                  <MdBlock />
                  Cancelar
                </button>
              )}

            </footer>

          </form>

          <GridSubContainer style={{opacity:(disableGrid? '0.5': '1')}}>
            <Paper>
              <Grid
                rows={listFollow}
                columns={columns}
              >
                <SelectionState
                  selection={selection}
                  onSelectionChange={(e) => setSelection(e)}
                />
                <PagingState
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onCurrentPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
                <CustomPaging totalCount={totalCount} />
                <DateTypeProvider for={dateColumns} />
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableColumnExtensions}
                  messages={languageGridEmpty}
                />
                <TableHeaderRow />
                <IntegratedSelection />
                <TableSelection showSelectAll />
                <PagingPanel
                  messages={languageGridPagination}
                  pageSizes={pageSizes}
                />
              </Grid>
            </Paper>

          </GridSubContainer>

        </Container>


        {(statePage === 'deleting' || statePage === 'saving' || statePage == 'pagination' || statePage == 'editing') && (
          <>
            <Overlay />
            <div className='waitingMessage'>
              <LoaderWaiting size={15} color="var(--blue-twitter)" />
              &nbsp;&nbsp;
              {statePage === 'deleting' && <span>Excluindo...</span>}
              {statePage === 'saving' && <span>Salvando...</span>}
              {(statePage === 'pagination' || statePage === 'editing') && <span>Aguarde...</span>}
            </div>
          </>
        )}

        {/* if itens selected cames from publication integration show dialog with warning and checkconfirm option */}
        {statePage === 'checkDeletingWithPublication' && (
          <ConfirmBoxModal
            title="Exclusão de acompanhamentos do Processo"
            caller="matterFollows"
            useCheckBoxConfirm
            message="Você selecionou acompanhamentos para exclusão que são oriundos das publicações. Caso confirme a operação as publicações serão removidas/desassociadas definitivamente da pasta do processo. Deseja continuar mesmo assim  ?"
          />
        )}

        {/* if itens selected to delete there is no origin on publication shows normal dialog */}
        {statePage === 'checkDeleting' && (
          <ConfirmBoxModal
            title="Exclusão de acompanhamentos do Processo"
            caller="matterFollows"
            message="Confirma a exclusão de todos os itens selecionados ?"
          />
        )}

      </>
    )

  }
    return (

      <>

      <Container>

        {showForumModal && <MatterEventTypeEdit caller="followMatterList" callbackFunctions={{handleSaveCallback, handleCloseModalCallback}} /> }

        <form onSubmit={handleSubmit(handleSave)}>

          <section>

            <label className='comboData' style={{flex:'40%'}}>
              Tipo
              <Controller
                as={Select}
                isClearable
                onInputChange={(term) => setTermFollow(term)}
                placeholder="Selecione um fórum"
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={typeList}
                control={control}
                name="type"
                ref={register}
              />
              {((accessCode??"").includes('CFGMEVTP') || (accessCode??"") == 'adm') && (
                <GoPlus onClick={handleOpenModalType} title='Clique para incluir um novo tipo' />
              )}
            </label>

            <label style={{flex:'22%'}}>
              Data
              <input
                type='date'
                ref={register}
                name="date"
              />
            </label>

            <label className='comboData' style={{flex:'20%'}}>
              Compartilhar com o cliente ?
              <Controller
                as={Select}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={shareCustomerOptions}
                control={control}
                name="shareCustomer"
                ref={register}
              />
            </label>

          </section>

          <section>

            <label>
              Descrição
              <textarea
                rows={6}
                ref={register}
                name="description"
              />
            </label>

          </section>

          <footer>

            {(accessCode?.includes('MATCONS') || accessCode === 'adm') && (
                <>
                  <button
                    type='submit'
                    className='buttonLinkClick'
                  >
                    <FiSave />
                    Salvar
                  </button>

                  {!disableGrid && (
                    <button
                      type='button'
                      onClick={() => handleOpenAppointmentModal("0")}
                      className='buttonLinkClick'
                    >
                      <RiCalendarCheckFill />
                      Agendar Compromisso
                    </button>
                  )}

                  {statePage == '' && (
                    <>
                    {(accessCode?.includes('MATCEVDE') || accessCode === 'adm') && (
                      <button
                        type='button'
                        onClick={handleCheckDelete}
                        className='buttonLinkClick'
                      >
                        <FiTrash />
                        Excluir
                      </button>
                    )}
                    </>
                  )}
                </>
              )}

              {disableGrid && (
                <button
                  type='button'
                  onClick={handleCancel}
                  className='buttonLinkClick'
                >
                  <MdBlock />
                  Cancelar
                </button>
              )}

          </footer>

        </form>

        <GridSubContainer style={{opacity:(disableGrid? '0.5': '1')}}>
          <Paper>
            <Grid
              rows={listFollow}
              columns={columns}
            >
              <SelectionState
                selection={selection}
                onSelectionChange={(e) => setSelection(e)}
              />
              <PagingState
                currentPage={currentPage}
                pageSize={pageSize}
                onCurrentPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
              <CustomPaging totalCount={totalCount} />
              <DateTypeProvider for={dateColumns} />
              <Table
                cellComponent={CustomCell}
                columnExtensions={tableColumnExtensions}
                messages={languageGridEmpty}
              />
              <TableHeaderRow />
              <IntegratedSelection />
              <TableSelection showSelectAll />
              <PagingPanel
                messages={languageGridPagination}
                pageSizes={pageSizes}
              />
            </Grid>
          </Paper>

        </GridSubContainer>

      </Container>

      {statePage === 'checkDeleting' && (
        <ConfirmBoxModal
          title="Exclusão de acompanhemtnos do Processo"
          caller="matterFollows"
          message="Confirma a exclusão de todos os itens selecionados ?"
        />
      )}

      {(statePage === 'deleting' || statePage === 'saving' || statePage == 'pagination' || statePage == 'editing' || statePage == 'openLink') && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            {statePage === 'deleting' && <span>Deletando...</span>}
            {statePage === 'saving' && <span>Salvando...</span>}
            {statePage === 'openLink' && <span>Salvando Link...</span>}
            {(statePage === 'pagination' || statePage === 'editing') && <span>Aguarde...</span>}
          </div>
        </>
      )}

      </>
    )



}

export default Follow
