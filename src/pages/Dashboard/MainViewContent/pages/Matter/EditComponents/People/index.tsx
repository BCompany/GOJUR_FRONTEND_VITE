/* eslint-disable no-alert */
/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select'
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiTrash, FiSave, FiEdit } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import { MdBlock } from 'react-icons/md'
import Loader from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { useToast } from 'context/toast';
import { useForm, Controller } from 'react-hook-form';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { useDelay } from 'Shared/utils/commonFunctions';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { Overlay } from 'Shared/styles/GlobalStyle';
import OpposingPartyEdit from './OpposingPartyModal';
import CustomerModalEdit from './CustomerModal';
import ThirdPartyEdit from './ThirdPartyModal';
import LawyerEdit from './LawyerModal';
import { IMatterParts, IPersonListData, ISelectData } from '../../Interfaces/IMatter';
import { ListCustomerData, ListLawyerData, ListMatterParts, ListOpossingData, ListPartsData, ListThirdyData, SaveParts } from '../Services/PeopleData';
import { Container, Content } from './styles';

const People = (props) => {

  // controls list came from edit legal
  const { load, matterId, customerList, lawyerList, opossingList, thirdyList, partsList  } = props;
  const {register, handleSubmit, getValues, setValue, control } = useForm()
  const { addToast } = useToast();
  const { handleCaller, handleConfirmMessage, handleCancelMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();

  // state control interactions without data
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [IsSaving, setIsSaving] = useState<boolean>(false)
  const [refreshForm, setRefreshForm] = useState<boolean>(false)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<string>('')
  const [cancelChanges, setCancelChanges] = useState<boolean>(false)
  const [personSearch, setPersonSearch] = useState<string | null>('')
  const [partSearch, setPartSearch] = useState<string | null>('')
  const [matterPartList, setMatterPartList] = useState<IMatterParts[]>([])
  const [currentPerson, setCurrentPerson] = useState<IPersonListData | null>()
  const [customerId, setCustomerId] = useState<number>(0)     // used by send id to modal for edit
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const [personListData, setPersonListData] = useState<IPersonListData[]>([])
  const { handleShowOpposingPartyModal, handleShowThirdPartyModal, handleShowLawyerModal, handleShowCustomerModal, showOpposingPartyModal, showThirdPartyModal, showLawyerModal, showCustomerModal } = useModal();

  useEffect(() => {

    // Load page at the first time when all list and controls is already been loaded async
    if (load
      && isLoading
      && customerList
      && thirdyList
      && opossingList
      && lawyerList
      && partsList){
        Initialize()
      }

  }, [customerList, isLoading, lawyerList, load, opossingList, partsList, thirdyList, load])

  const Initialize = async () => {

    const matterPartsList = await ListMatterParts(matterId)
    setMatterPartList(matterPartsList)

    if (matterPartsList.length >= 0){
      await LoadMatterParts(matterPartsList);   // build lines by repository results
    }else{
      await LoadDefaultLines()                  // build lines default
    }
  }

  useEffect(() => {

    if (refreshForm){
      UpdateReactHookForms()
    }

  }, [refreshForm])

  useEffect(() => {

    if (isConfirmMessage && caller === 'matterPeopleCancel'){

      setIsLoading(true)
      Initialize()
      setCancelChanges(false)
      handleConfirmMessage(false)
      setHasChanges(false)
      handleCaller('')
    }

  },[caller, isConfirmMessage, cancelChanges])

  useEffect(() => {

    if (isCancelMessage && caller === 'matterPeopleCancel'){
      setIsLoading(false)
      setCancelChanges(false)
      handleCancelMessage(false)
      handleCaller('')
    }

  },[caller, isCancelMessage, cancelChanges])

  useDelay(() => {

    if (personSearch??"".length > 0){
      RefreshPersonList()
    }

  }, [personSearch], 500)

  useDelay(() => {

    if (partSearch??"".length > 0){
      RefreshPartList()
    }

  }, [partSearch], 500)

  const LoadMatterParts = async (matterPartList: IMatterParts[]) => {

    const newMatterPerson: IPersonListData[] = []

    // create customer list
    const matterCustomer = matterPartList.filter(item => item.partType === 'customer')

    matterCustomer.map(item => {

      // include item from database on current list for the first 50 itens
      customerList.push({
        id: item.matterPartPersonId,
        label: item.matterPartPersonName
      })

      newMatterPerson.push({
        type:'customer',
        index: item.index,
        matterPartPersonName: item.matterPartPersonName,
        matterPartId: item.matterPartId,
        matterPartPersonId: item.matterPartPersonId,
        personListData: customerList,
        partsListData: partsList,
        deleteMarker: false,
        principal: item.principal??false,
        hasValue: true
      })

      return;
    })

    // if there is no customer add one line default
    if (matterCustomer.length == 0){
      newMatterPerson.push({
        type:'customer',
        index: 0,
        personListData: customerList,
        partsListData: partsList,
        principal: false,
        deleteMarker: false,
        disableCheck: true,
      })
    }

    // create customer lawyer list
    const matterCustomerLawyer = matterPartList.filter(item => item.partType === 'lawyer' && item.lawyerType === 'C')
    matterCustomerLawyer.map(item => {
      newMatterPerson.push({
        type:'lawyer',
        index: item.index,
        matterPartId: item.matterPartId,
        matterPartPersonId: item.matterPartPersonId,
        personListData: lawyerList,
        partsListData: partsList,
        deleteMarker: false,
        lawyerType: item.lawyerType,
        principal: item.principal??false
      })

      return;
    })

    // if there is no lawyer add one line default
    if (matterCustomerLawyer.length == 0) {
      newMatterPerson.push({
        type:'lawyer',
        index: 0,
        personListData: lawyerList,
        partsListData: partsList,
        principal: false,
        deleteMarker: false,
        lawyerType: 'C',
        disableCheck: true
      })
    }

    // create opossing lawyer list
    const matterOpossingLawyer = matterPartList.filter(item => item.partType === 'lawyer' && item.lawyerType === 'O')
    matterOpossingLawyer.map(item => {
      newMatterPerson.push({
        type:'lawyer',
        index: item.index,
        matterPartId: item.matterPartId,
        matterPartPersonId: item.matterPartPersonId,
        personListData: lawyerList,
        partsListData: partsList,
        deleteMarker: false,
        lawyerType: item.lawyerType,
        principal: item.principal??false
      })

      return;
    })

    // if there is no lawyer add one line default
    if (matterOpossingLawyer.length == 0){
        newMatterPerson.push({
          type:'lawyer',
          index: 0,
          personListData: lawyerList,
          partsListData: partsList,
          principal: false,
          deleteMarker: false,
          lawyerType: 'O',
          disableCheck: true
        })
    }

    // create opossing list
    const matterOppossing = matterPartList.filter(item => item.partType === 'opossing')
    matterOppossing.map(item => {
      newMatterPerson.push({
        type:'opossing',
        index: item.index,
        personListData: opossingList,
        partsListData: partsList,
        matterPartId: item.matterPartId,
        matterPartPersonId: item.matterPartPersonId,
        deleteMarker: false,
        principal: item.principal??false
      })

      return;
    })
    // if there is no customer add one line default
    if (matterOppossing.length == 0){
      newMatterPerson.push({
        type:'opossing',
        index: 0,
        personListData: opossingList,
        partsListData: partsList,
        principal: false,
        deleteMarker: false,
        disableCheck: true
      })
    }

    // create thirdy list
    const matterThirdy = matterPartList.filter(item => item.partType === 'thirdy')
    matterThirdy.map(item => {
      newMatterPerson.push({
        type:'thirdy',
        index: item.index,
        personListData: thirdyList,
        partsListData: partsList,
        deleteMarker: false,
        matterPartId: item.matterPartId,
        matterPartPersonId: item.matterPartPersonId,
        principal: item.principal??false
      })

      return;
    })

    setPersonListData(newMatterPerson);
    setIsSaving(false)
    setIsLoading(false)
    setRefreshForm(true)
  }

  const UpdateReactHookForms = useCallback(async () => {

      // update react-hook-form - customer section
      const matterCustomer = matterPartList.filter(item => item.partType === 'customer')
      matterCustomer.map(item => {
        setValue(`customer${item.index}`, {id: item.personId, label: item.matterPartPersonName})
        setValue(`customerType${item.index}`, {id: item.partId, label: item.matterPartName})
        setValue(`customerMain${item.index}`, item.principal)

        return;
      })

      // update react-hook-form - lawyer customer section
      const matterCustomerLawyer = matterPartList.filter(item => item.partType === 'lawyer' && item.lawyerType == 'C')
      matterCustomerLawyer.map(item => {
        setValue(`lawyerCustomer${item.index}`, {id: item.personId, label: item.matterPartPersonName})
        setValue(`lawyerCustomerType${item.index}`, {id: item.partId, label: item.matterPartName})
        setValue(`lawyerCustomerMain${item.index}`, item.principal)

        return;
      })

      // update react-hook-form - lawyer opossing section
      const matterOpossingLawyer = matterPartList.filter(item => item.partType === 'lawyer' && item.lawyerType == 'O')
      matterOpossingLawyer.map(item => {
        setValue(`lawyerOpossing${item.index}`, {id: item.personId, label: item.matterPartPersonName})
        setValue(`lawyerOpossingType${item.index}`, {id: item.partId, label: item.matterPartName})
        setValue(`lawyerOpossingMain${item.index}`, item.principal)

        return;
      })

      // update react-hook-form - opossing section
      const matterOpossing = matterPartList.filter(item => item.partType === 'opossing')
      matterOpossing.map(item => {
        setValue(`opossing${item.index}`, {id: item.personId, label: item.matterPartPersonName})
        setValue(`opossingType${item.index}`, {id: item.partId, label: item.matterPartName})
        setValue(`opossingMain${item.index}`, item.principal)

        return;
      })

      // update react-hook-form - thirdy section
      const matterThirdy = matterPartList.filter(item => item.partType === 'thirdy')
      matterThirdy.map(item => {
        setValue(`thirdy${item.index}`, {id: item.personId, label: item.matterPartPersonName})
        setValue(`thirdyType${item.index}`, {id: item.partId, label: item.matterPartName})
        setValue(`thirdyMain${item.index}`, item.principal)

        return;
      })

      setRefreshForm(false)

  },[matterPartList])

  const LoadDefaultLines = useCallback(async () => {

    const newMatterPerson: IPersonListData[] = []

    // create first line customer
    newMatterPerson.push({
      type:'customer',
      index: 0,
      personListData: customerList,
      partsListData: partsList,
      principal: false,
      deleteMarker: false,
      disableCheck: true
    })

    // create first line lawyer
    newMatterPerson.push({
      type:'lawyer',
      index: 0,
      personListData: lawyerList,
      partsListData: partsList,
      principal: false,
      deleteMarker: false,
      disableCheck: true
    })

    // create first line opossing
    newMatterPerson.push({
      type:'opossing',
      index: 0,
      personListData: opossingList,
      partsListData: partsList,
      principal: false,
      deleteMarker: false,
      disableCheck: true
    })

    setPersonListData(newMatterPerson);
    setIsLoading(false)

  }, [customerList, lawyerList, opossingList, partsList])

  const handleAddNewPerson = async (personType: string, lawyerType = '') => {

    const personItens = personListData.filter(item => item.type === personType);
    let newIndex = 0;
    let findIndex = false;

    // generate new index value to control specfic field
    for (let i = 0; i < personItens.length; i++) {
      if (findIndex) break;
      const hasIndex = personItens.find(item => item.index === i);
      if (hasIndex){
        newIndex ++;
      }
      else{
        findIndex = true;
      }
    }
    const newLinePerson: IPersonListData = {
      type: personType,
      partsListData: partsList,
      personListData: [],
      index: newIndex,
      personId: 0,
      matterPartId: 0,
      matterPartPersonId: 0,
      deleteMarker: false,
      principal: false,
    }

    if (personType === 'customer')
      newLinePerson.personListData = customerList

    if (personType === 'lawyer'){
      newLinePerson.personListData = lawyerList
      newLinePerson.lawyerType = lawyerType;
    }

    if (personType === 'opossing')
      newLinePerson.personListData = opossingList

    if (personType === 'thirdy')
      newLinePerson.personListData = thirdyList

    // Thirdy part there is no line default, so set new line with type, checked value principal and list
    if (personType === 'thirdy' && newIndex === 0)
    {
      newLinePerson.principal = true
      newLinePerson.disableCheck = true
    }

    // copy part of first opossing to next itens
    if (lawyerType === 'O'){
      const personOpossingList = personListData.filter(item => item.type === 'opossing' && !item.deleteMarker)
      if (personOpossingList.length > 0){
        const opossingPartDefinition = getValues(`opossingType${personOpossingList[0].index}`)
        if (opossingPartDefinition){
          newLinePerson.partId = opossingPartDefinition.id;
          setValue(`${personType}Type${newIndex}`, opossingPartDefinition)
        }
      }
    }
    // copy part of first customer to next itens
    else
    {
      const personCustomerList = personListData.filter(item => item.type === 'customer' && !item.deleteMarker)
      if (personCustomerList.length > 0){
        const customerPartDefinition = getValues(`customerType${personCustomerList[0].index}`)
        if (customerPartDefinition){
          newLinePerson.partId = customerPartDefinition.id;
          setValue(`${personType}Type${newIndex}`, customerPartDefinition)
        }
      }
    }

    // clone list and add new person
    const personListDataClone = [...personListData]
    personListDataClone.push(newLinePerson)

    setPersonListData(personListDataClone);
    setHasChanges(true)
  }

  // validate customer check principal flag
  function ValidateCustomerPrincipalCheck (data: any) {

    let totalPrincipal = 0;
    let hasNoPerson = true;

    // validate list customer
    const customerList = personListData.filter(item => item.type === 'customer' && !item.deleteMarker)
    customerList.map(item => {
      // get customer values
      const person = data[`customer${item.index}`]
      const personType = data[`customerType${item.index}`]
      const checkValue = data[`customerMain${item.index}`]

      // only if exists person line defined and check is true, count principal
      if (person && personType && checkValue != false){
        totalPrincipal++;
      }

      // if exists at least one person defined set as true
      if (person) hasNoPerson = false;

      return;
    })

    // if there is no person defined, doen't execute validation
    if (!hasNoPerson){

      // validate if exists 1 customer principal when has more than 1
      if (totalPrincipal === 0 && customerList.length > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `É necessário que ao menos 1 cliente seja definido como principal`,
        });

        return false;
      }

      // validate if exists more than 1 customer principal
      if (totalPrincipal > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: ` Somente 1 cliente deve ser definido como principal`,
        });

        return false;
      }
    }

    return true;
  }

  // validate customer lawyer check principal flag
  function ValidateLaywerCustomerPrincipalCheck (data: any) {
    let totalPrincipal = 0;
    let hasNoPerson = true;

    // validate list customer lawyer
    const lawyerCustomerList = personListData.filter(item => item.type === 'lawyer' && !item.deleteMarker && item.lawyerType === 'C')
    lawyerCustomerList.map(item => {

      // get customer values
      const person = data[`lawyerCustomer${item.index}`]
      const personType = data[`lawyerCustomerType${item.index}`]
      const checkValue = data[`lawyerCustomerMain${item.index}`]

      // only if exists person line defined and check is true, count principal
      if (person && personType && checkValue != false){
        totalPrincipal++;
      }

      // if exists at least one person defined set as true
      if (person) hasNoPerson = false;

      return;
    })

    // if there is no person defined, doen't execute validation
    if (!hasNoPerson) {

      // validate if exists 1 lawyer principal when has more than 1
      if (totalPrincipal === 0 && lawyerCustomerList.length > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `É necessário que ao menos 1 advogado do cliente seja definido como principal`,
        });

        return false;
      }

      // validate if exists more than 1 customer principal
      if (totalPrincipal > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: ` Somente 1 advogado do cliente deve ser definido como principal`,
        });

        return false;
      }
    }

    return true;
  }

  // validate opossing check principal flag
  function ValidateOpossingPrincipalCheck (data: any){
    let totalPrincipal = 0;
    let hasNoPerson = true;

    // validate list opossing
    const opossingList = personListData.filter(item => item.type === 'opossing' && !item.deleteMarker)
    opossingList.map(item => {

      // get customer values
      const person = data[`opossing${item.index}`]
      const personType = data[`opossingType${item.index}`]
      const checkValue = data[`opossingMain${item.index}`]

      // only if exists person line defined and check is true, count principal
      if (person && personType && checkValue != false){
        totalPrincipal++;
      }

      // if exists at least one person defined set as true
      if (person) hasNoPerson = false;

      return;
    })

    // if there is no person defined, doen't execute validation
    if (!hasNoPerson) {

      // validate if exists 1 contrário principal when has more than 1
      if (totalPrincipal === 0 && opossingList.length > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `É necessário que ao menos 1 contrário seja definido como principal`,
        });

        return false;
      }

      // validate if exists more than 1 customer principal
      if (totalPrincipal > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: ` Somente 1 contrário deve ser definido como principal`,
        });

        return false;
      }
    }

    return true;

  }

  // validate opossing lawyer check principal flag
  function ValidateLawyerOpossingCheck(data: any) {
    let totalPrincipal = 0;
    let hasNoPerson = true;

    // validate list opossing lawyer
    const lawyerOpossingList = personListData.filter(item => item.type === 'lawyer' && !item.deleteMarker && item.lawyerType === 'O')
    lawyerOpossingList.map(item => {

      // get customer values
      const person = data[`lawyerOpossing${item.index}`]
      const personType = data[`lawyerOpossingType${item.index}`]
      const checkValue = data[`lawyerOpossingMain${item.index}`]

      // only if exists person line defined and check is true, count principal
      if (person && personType && checkValue != false){
        totalPrincipal++;
      }

      // if exists at least one person defined set as true
      if (person) hasNoPerson = false;

      return;
    })

    // if there is no person defined, doen't execute validation
    if (!hasNoPerson) {

      // validate if exists 1 lawyer principal when has more than 1
      if (totalPrincipal === 0 && lawyerOpossingList.length > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `É necessário que ao menos 1 advogado do contrário seja definido como principal`,
        });

        return false;
      }

      // validate if exists more than 1 customer principal
      if (totalPrincipal > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: ` Somente 1 advogado do contrário deve ser definido como principal`,
        });

        return false;
      }
    }


    return true;
  }

  // validate thirdy check principal flag
  function ValidateThirdyPrincipalCheck(data: any) {
    let totalPrincipal = 0;
    let hasNoPerson = true;

    // validate list thirdy
    const thirdyList = personListData.filter(item => item.type === 'thirdy' && !item.deleteMarker)
    thirdyList.map(item => {

      // get customer values
      const person = data[`thirdy${item.index}`]
      const personType = data[`thirdyType${item.index}`]
      const checkValue = data[`thirdyMain${item.index}`]

      // only if exists person line defined and check is true, count principal
      if (person && personType && checkValue != false){
        totalPrincipal++;
      }

      // if exists at least one person defined set as true
      if (person) hasNoPerson = false;

      return
    })

    // if there is no person defined, doen't execute validation
    if (!hasNoPerson) {

      // validate if exists 1 lawyer principal when has more than 1
      if (totalPrincipal === 0 && thirdyList.length > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `É necessário que ao menos 1 terceiro seja definido como principal`,
        });
        return false;
      }

      // validate if exists more than 1 customer principal
      if (totalPrincipal > 1){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: ` Somente 1 terceiro deve ser definido como principal`,
        });

        return false;
      }
    }

    return true;
  }

  // validate customer list
  function ValidateCustomer () {
    let isValidated = true;
    let isExists = false;
    const listPersonIds: string[] = []

    // validate list customer
    const customerList = personListData.filter(item => item.type === 'customer' && !item.deleteMarker)

    customerList.map(item => {
      if (isExists) return;

      const person = getValues(`customer${item.index}`) as ISelectData
      const type = getValues(`customerType${item.index}`) as ISelectData

      // validate existent person if has name clear
      if (!person && (item.matterPartId??0) > 0){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `Um cliente existente foi removido, se deseja excluir este cliente, clique no icone de lixeira ao lado direito, ou clique em desfazer para reiniciar o processo`,
        });
      }

      // validate duplicate person
      if (person && isValidated){

        isExists = listPersonIds.filter(id => id.toString() === person.id.toString()).length > 0;
        if (isExists){
          isValidated = false
          addToast({
            type: 'info',
            title: 'Operação NÃO realizada',
            description: `O cliente ${person.label} ja foi definido anteriormente`,
          });
        }
      }

      // validate person without position define
      if (person && !type && isValidated){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `O cliente ${person.label} precisa ter uma posição definida`,
        });
      }

      // if exists person add on list person ids
      if (person) listPersonIds.push(person.id.toString())

      return;
    })

    return isValidated
  }

  // validate lawyer customer list
  function ValidateCustomerLaywer () {

    let isValidated = true;
    let isExists = false;
    const listPersonIds: string[] = []

    // validate list advogado
    const lawyerList = personListData.filter(item => item.type === 'lawyer' && item.lawyerType === 'C' && !item.deleteMarker)
    lawyerList.map(item => {
      if (isExists) return;

      const person = getValues(`lawyerCustomer${item.index}`) as ISelectData
      const type = getValues(`lawyerCustomerType${item.index}`) as ISelectData

      // validate existent person if has name clear
      if (!person && (item.matterPartId??0) > 0){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `Um advogado do cliente existente foi removido, se deseja exclui-lo, clique no icone de lixeira ao lado direito`,
        });
      }

      // validate duplicate person
      if (person && isValidated){

        isExists = listPersonIds.filter(id => id.toString() === person.id.toString()).length > 0;
        if (isExists){
          isValidated = false
          addToast({
            type: 'info',
            title: 'Operação NÃO realizada',
            description: `O advogado do cliente ${person.label} ja foi definido anteriormente`,
          });
        }
      }

      // validate person without position define
      if (person && !type && isValidated){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `O advogado do cliente ${person.label} precisa ter uma posição definida`,
        });
      }

      // if exists person add on list person ids
      if (person) listPersonIds.push(person.id.toString())

      return;
    })

    return isValidated;
  }

  // validate lawyer customer list
  function ValidateOpossingLaywer () {

    let isValidated = true;
    let isExists = false;
    const listPersonIds: string[] = []

    // validate list advogado
    const lawyerList = personListData.filter(item => item.type === 'lawyer' && item.lawyerType === 'O' && !item.deleteMarker)
    lawyerList.map(item => {
      if (isExists) return;

      const person = getValues(`lawyerOpossing${item.index}`) as ISelectData
      const type = getValues(`lawyerOpossingType${item.index}`) as ISelectData

      // validate existent person if has name clear
      if (!person && (item.matterPartId??0) > 0){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `Um advogado do contrário existente foi removido, se deseja exclui-lo, clique no icone de lixeira ao lado direito`,
        });
      }

      // validate duplicate person
      if (person && isValidated){

        isExists = listPersonIds.filter(id => id.toString() === person.id.toString()).length > 0;

        if (isExists){
          isValidated = false
          addToast({
            type: 'info',
            title: 'Operação NÃO realizada',
            description: `O advogado do contrário ${person.label} ja foi definido anteriormente`,
          });
        }
      }

      // validate person without position define
      if (person && !type && isValidated){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `O advogado do contrário ${person.label} precisa ter uma posição definida`,
        });
      }

      // if exists person add on list person ids
      if (person) listPersonIds.push(person.id.toString())

      return;
    })

    return isValidated;
  }

  // validate opossing list
  function ValidateOpossing () {

    let isValidated = true;
    let isExists = false;
    const listPersonIds: string[] = []

    // validate list opossing
    const opossingList = personListData.filter(item => item.type === 'opossing' && !item.deleteMarker)
    opossingList.map(item => {
      if (isExists) return;

      const person = getValues(`opossing${item.index}`) as ISelectData
      const type = getValues(`opossingType${item.index}`) as ISelectData

      // validate existent person if has name clear
      if (!person && (item.matterPartId??0) > 0){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `Um contrário existente foi removido, se deseja exclui-lo, clique no icone de lixeira ao lado direito`,
        });
      }

      // validate duplicate person
      if (person && isValidated)
      {
        isExists = listPersonIds.filter(id => id.toString() === person.id.toString()).length > 0;
        if (isExists){
          isValidated = false
          addToast({
            type: 'info',
            title: 'Operação NÃO realizada',
            description: `O contrário ${person.label} ja foi definido anteriormente`,
          });
        }
      }

      // validate person without position define
      if (person && !type && isValidated){

        isValidated = false

        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `O contrário ${person.label} precisa ter uma posição definida`,
        });
      }

      // if exists person add on list person ids
      if (person) listPersonIds.push(person.id.toString())

      return;
    })

    return isValidated
  }

  // validate thirdy list
  function ValidateThirdy () {

    let isValidated = true;
    let isExists = false;
    const listPersonIds: string[] = []

     const thirdyList = personListData.filter(item => item.type === 'thirdy' && !item.deleteMarker)
     thirdyList.map(item => {
       if (isExists) return;

       const person = getValues(`thirdy${item.index}`) as ISelectData
       const type = getValues(`thirdyType${item.index}`) as ISelectData

      // validate existent person if has name clear
       if (!person && (item.matterPartId??0) > 0){
        isValidated = false
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: `Um terceiro existente foi removido, se deseja exclui-lo, clique no icone de lixeira ao lado direito`,
        });
      }

      // validate duplicate person
      if (person && isValidated){
        isExists = listPersonIds.filter(id => id.toString() === person.id.toString()).length > 0;
        if (isExists){
          isValidated = false
          addToast({
            type: 'info',
            title: 'Operação NÃO realizada',
            description: `O terceiro ${person.label} ja foi definido anteriormente`,
          });
        }
      }

      // validate person without position define
      if (person && !type && isValidated){

         isValidated = false
         addToast({
           type: 'info',
           title: 'Operação NÃO realizada',
           description: `O terceiro ${person.label} precisa ter uma posição definida`,
         });
      }

      // if exists person add on list person ids
      if (person) listPersonIds.push(person.id.toString())

       return;
     })

     return isValidated
  }

  const ValidatePrincipalCheck = (data: any) => {

    // validate customer principal check
    if (!ValidateCustomerPrincipalCheck(data)) return;

    // validate laweyr customer principal check
    if (!ValidateLaywerCustomerPrincipalCheck(data)) return;

    // validate opossing principal check
    if (!ValidateOpossingPrincipalCheck(data)) return;

    // validate laywer opossing principal check
    if (!ValidateLawyerOpossingCheck(data)) return;

    // validate thirdy principal check
    if (!ValidateThirdyPrincipalCheck(data)) return;

    return true;
  }

  const ValidatePerson = () => {

    // validate customer list
    if (!ValidateCustomer()) return false;

    // validate lawyer customer list
    if (!ValidateCustomerLaywer()) return false;

    // validate lawyer customer list
    if (!ValidateOpossingLaywer()) return false;

    // validate opossing list
    if (!ValidateOpossing()) return false;

    // validate thirdy list
    if (!ValidateThirdy()) return false;

    return true;
  }

  const handleSave = async (data: any) => {

    if (matterId == 0){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: `É necessário salvar o processo antes de gravar as partes`,
      });

      return;
    }

    // validate person defined without part
    if (!ValidatePerson()) return;

    // validate principal person
    if (!ValidatePrincipalCheck(data)) return;

    // reload component
    setIsSaving(true)

    try
    {

      // build delete ids list and unregister fields that was deleted from form
      const personPartDelete = personListData.filter(item => item.deleteMarker)
      const matterPartIds: number[] = [];
      if (personPartDelete.length > 0){
        personPartDelete.map(item => {
           matterPartIds.push(item.matterPartId??0)
           return
        });
      }

      // save and delete partes
      const requestData = BuildDataJSON();
      await SaveParts(JSON.stringify(requestData), JSON.stringify(matterPartIds), matterId)

      // remove delete marker
      const newData = personListData.filter(item => !item.deleteMarker)
      setPersonListData(newData)

      // reload componenet values
      await Initialize()

      addToast({
        type: 'success',
        title: 'Operação realizada com sucesso',
        description: `As partes foram salvas com sucesso`,
      });

      setIsSaving(false)
      setHasChanges(false)
    }
    catch(err: any){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message
      });

      // reload componenet values
      await Initialize()

      setIsSaving(false)
      setHasChanges(false)
    }
  }

  const BuildDataJSON = () => {

    const requestData: IMatterParts[] = [];

    // get list without excluded itens
    const personSaveList = personListData.filter(item => !item.deleteMarker)

    // Build object customer data
    const customerList = personSaveList.filter(item => item.type === 'customer')
    customerList.map(item => {
      const customer = getValues(`customer${item.index}`)
      const customerType = getValues(`customerType${item.index}`)
      const customerMain = getValues(`customerMain${item.index}`)

      if (customer && customerType){
        requestData.push({
          partType: 'customer',
          matterId,
          matterPartId: item.matterPartId,
          matterPartPersonId: item.matterPartPersonId,
          personId: customer.id,
          partId: customerType.id,
          principal: customerMain != false || customerList.length == 1    // if there is some person check as principal or there is only one line
        })
      }

      return;
    })

    // Build object customer data
    const opossingList = personSaveList.filter(item => item.type === 'opossing')
    opossingList.map(item => {
      const opossing = getValues(`opossing${item.index}`)
      const opossingType = getValues(`opossingType${item.index}`)
      const opossingMain = getValues(`opossingMain${item.index}`)

      if (opossing && opossingType){
        requestData.push({
          partType: 'opossing',
          matterId,
          matterPartId: item.matterPartId,
          matterPartPersonId: item.matterPartPersonId,
          personId: opossing.id,
          partId: opossingType.id,
          principal: opossingMain != false || opossingList.length == 1    // if there is some person check as principal or there is only one line
        })
      }

      return;
    })

    // Build object lawyer customer data
    const lawyerCustomerList = personSaveList.filter(item => item.type === 'lawyer' && item.lawyerType === 'C')
    lawyerCustomerList.map(item => {
      const lawyer = getValues(`lawyerCustomer${item.index}`)
      const lawyerType = getValues(`lawyerCustomerType${item.index}`)
      const lawyerMain = getValues(`lawyerCustomerMain${item.index}`)

      if (lawyer && lawyerType){
        requestData.push({
          partType: 'lawyer',
          matterId,
          matterPartId: item.matterPartId,
          matterPartPersonId: item.matterPartPersonId,
          personId: lawyer.id,
          partId: lawyerType.id,
          lawyerType: 'C',
          principal: lawyerMain != false || lawyerCustomerList.length == 1    // if there is some person check as principal or there is only one line
        })
      }

      return;
    })

    // Build object opossing customer data
    const lawyerOpossingList = personSaveList.filter(item => item.type === 'lawyer' && item.lawyerType === 'O')
    lawyerOpossingList.map(item => {
      const lawyer = getValues(`lawyerOpossing${item.index}`)
      const lawyerType = getValues(`lawyerOpossingType${item.index}`)
      const lawyerMain = getValues(`lawyerOpossingMain${item.index}`)

      if (lawyer && lawyerType){
        requestData.push({
          partType: 'lawyer',
          matterId,
          matterPartId: item.matterPartId,
          matterPartPersonId: item.matterPartPersonId,
          personId: lawyer.id,
          partId: lawyerType.id,
          lawyerType: 'O',
          principal: lawyerMain != false || lawyerOpossingList.length == 1    // if there is some person check as principal or there is only one line
        })
      }

      return;
    })


    // Build object thirdy data
    const thirdyList = personSaveList.filter(item => item.type === 'thirdy')
    thirdyList.map(item => {
      const thirdy = getValues(`thirdy${item.index}`)
      const thirdyType = getValues(`thirdyType${item.index}`)
      const thirdyMain = getValues(`thirdyMain${item.index}`)

      if (thirdy && thirdyType){
        requestData.push({
          partType: 'thirdy',
          matterId,
          matterPartId: item.matterPartId,
          matterPartPersonId: item.matterPartPersonId,
          personId: thirdy.id,
          partId: thirdyType.id,
          principal: thirdyMain != false || thirdyList.length == 1    // if there is some person check as principal or there is only one line
        })
      }

      return;
    })

    return requestData;
  }

  const handleDeletePerson = useCallback(async (ev: any, personItem: IPersonListData) => {

    try {

      ev.preventDefault()

      if (personItem.deleteMarker) return

      const newPersonList = personListData.map(item => (

        JSON.stringify(item) === JSON.stringify(personItem)?
        {
          ...item,
          deleteMarker: true
        }:
        item
      ))

      setPersonListData(newPersonList)
      setHasChanges(true)
    }
    catch(err) {

      addToast({
        type: 'error',
        title: 'Operação NÃO realizada',
        description: `Houve uma falha na exclusão deste registro`
      });

      setIsDeleting('')
    }

  },[personListData])

  const RefreshPartList = useCallback(async () => {

    // Update part list in a specific combo data person
    if (currentPerson){
      const itemPerson = personListData.find(item => item.index === currentPerson?.index && item.type === currentPerson.type)
      if (itemPerson)
      {
          const response = await ListPartsData(1, 50, partSearch??"")
          const newData = personListData.map(item =>
            item.index === currentPerson.index  && item.type === currentPerson.type?
            {
              ...item,
              partsListData: response
            }:
          item)

          setPersonListData(newData)
      }
    }

  },[currentPerson, personListData, partSearch])

  const RefreshPersonList = useCallback(async () => {

    // Update person list in a specific combo data person
    if (currentPerson){
      const itemPerson = personListData.find(item => item.index === currentPerson?.index && item.type === currentPerson.type)
      if (itemPerson)
      {
          let personList: ISelectData[] = [];

          if (itemPerson.type == 'customer')
            personList = await ListCustomerData(personSearch??"")

          if (itemPerson.type == 'lawyer')
            personList = await ListLawyerData(personSearch??"")

          if (itemPerson.type == 'opossing')
            personList = await ListOpossingData(personSearch??"")

          if (itemPerson.type == 'thirdy')
            personList = await ListThirdyData(personSearch??"")

          const newData = personListData.map(item =>
            item.index === currentPerson.index  && item.type === currentPerson.type?
            {
              ...item,
              personListData: personList
            }:
          item)

          setPersonListData(newData)
      }
    }

  },[currentPerson, personListData, personSearch])

  const handleReactInputText = (term: string, person: IPersonListData, type: string) => {


    if (type === 'person')
      setPersonSearch(term)

    if (type === 'part')
      setPartSearch(term)

    setCurrentPerson(person)

    if (person.type === 'lawyer' && type === 'person'){

      let hasDefined = false;
      personListData.filter(item => item.type === 'customer').map(item => {

        if (hasDefined) return;

        // set part as the same of first customer from list
        if (person.lawyerType === 'C'){
          const customer = getValues(`customer${item.index}`)
          const customerPart = getValues(`customerType${item.index}`)

          if (customer && customerPart){
            setValue(`lawyerCustomerType${person.index}`, customerPart)
            hasDefined = true;
          }

          return;
        }

        // set part as the same of first opossing from list
        if (person.lawyerType === 'O'){
          const opossing = getValues(`opossing${item.index}`)
          const opossingPart = getValues(`opossingType${item.index}`)

          if (opossing && opossingPart){
            setValue(`lawyerOpossingType${person.index}`, opossingPart)
            hasDefined = true;
          }

          return;
        }

        return;
      })
    }

    // ***** RELOAD LISTS PERSON WHEN USER CLICKED ON CLEAR COMBOBOX NAME
    if (term.length === 0 && type === 'person'){
        ResetPersonList(person)
    }

    // ***** RELOAD LISTS PARTS WHEN USER CLICKED ON CLEAR COMBOBOX NAME
    if (term.length === 0 && type === 'part'){
      ResetPartList(person)
    }

    setHasChanges(true)
  }

  const ResetPersonList = (person: IPersonListData) => {

    if (person.type === 'customer'){
      // reload list customer and set default list
      const customerValue = getValues(`customer${person.index}`)

      // if there is NO a customer selected
      if (customerValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'customer'?{
            ...item,
            personListData: customerList,
            // hasValue:false,
            // isInitialized: true
          }:
          item
        )
        setPersonListData(newData)
        setCustomerId(0)
      }
    //   else
    //   {
    //     // change flag hasValue to true to change icon to edit customer
    //     const newData = personListData.map(item =>
    //       item.index === person.index && item.type === 'customer'?{
    //         ...item,
    //         isInitialized: false,
    //         hasValue:true
    //       }:
    //       item
    //     )
    //     setPersonListData(newData)
    //   }
    }

    // Update opossing list person with default 50 itens
    if (person.type === 'opossing'){
      const opossingValue = getValues(`opossing${person.index}`)
      if (opossingValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'opossing'?{
            ...item,
            personListData: opossingList
          }:
          item
        )
        setPersonListData(newData)
      }
    }

    // Update lawyer list person with default 50 itens
    if (person.type === 'lawyer'){
      const lawyerValue = getValues(`lawyer${person.index}`)
      if (lawyerValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'lawyer'?{
            ...item,
            personListData: lawyerList
          }:
          item
        )
        setPersonListData(newData)
      }
    }

    // Update thirdy list person with default 50 itens
    if (person.type === 'thirdy'){
      const thirdyValue = getValues(`thirdy${person.index}`)
      if (thirdyValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'thirdy'?{
            ...item,
            personListData: thirdyList
          }:
          item
        )
        setPersonListData(newData)
      }
    }
  }

  const ResetPartList = (person: IPersonListData) => {

    // Update customer part list person with default 50 itens
    if (person.type === 'customer'){
      const customerValue = getValues(`customerType${person.index}`)
      if (customerValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'customer'?{
            ...item,
            partsListData: partsList
          }:
          item
        )
        setPersonListData(newData)
      }
    }

    // Update opossing part list person with default 50 itens
    if (person.type === 'opossing'){
      const opossingValue = getValues(`opossing${person.index}`)
      if (opossingValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'opossing'?{
            ...item,
            partsListData: partsList
          }:
          item
        )

        setPersonListData(newData)
      }
    }

    // Update lawyer part list person with default 50 itens
    if (person.type === 'lawyer'){
      const lawyerValue = getValues(`lawyer${person.index}`)
      if (lawyerValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'lawyer'?{
            ...item,
            partsListData: partsList
          }:
          item
        )

        setPersonListData(newData)
      }
    }

    // Update thirdy part list person with default 50 itens
    if (person.type === 'thirdy'){
      const thirdyValue = getValues(`thirdy${person.index}`)
      if (thirdyValue == null) {
        const newData = personListData.map(item =>
          item.index === person.index && item.type === 'thirdy'?{
            ...item,
            partsListData: partsList
          }:
          item
        )

        setPersonListData(newData)
      }
    }
  }

  const handleCancel = () => {
    setCancelChanges(true)
    setHasChanges(false)
  }

  const openModalOpposingParty = (person: IPersonListData, action: string) => {
    if (person.deleteMarker) return
    setCurrentPerson(person)

    if (action === 'new'){
      handleShowOpposingPartyModal(true)
    }
  }

  const openModalThirdParty = (person: IPersonListData, action: string) => {
    if (person.deleteMarker) return
    setCurrentPerson(person)

    if (action === 'new'){
      handleShowThirdPartyModal(true)
    }
  }

  const openModalLawyer = (person: IPersonListData, action: string, lawyerType: string) => {
    if (person.deleteMarker) return

    person.lawyerType = lawyerType;
    setCurrentPerson(person)

    if (action === 'new'){
      handleShowLawyerModal(true)
    }
  }

  const openModalCustomer = (person: IPersonListData, action: string) => {

    if (person.deleteMarker) return

    setCurrentPerson(person)

    if (action === 'edit'){

      const customerValue = getValues(`customer${  person.index}`)

      if (customerValue)
        setCustomerId(customerValue.id)   // save on customerId (state) value for edit modal
    }

    if (action === 'new'){
      setCustomerId(0)                    // set zero because is a new customer
    }

    handleShowCustomerModal(true)
  }

  // update new customer on selected line
  const handleUpdateNewCustomer = useCallback(async (data: any) => {

    if (!currentPerson) return

    // add new customer updated to list
    customerList.push({
      id: currentPerson.matterPartPersonId,
      label: data.nom_Pessoa
    })

    // update list
    const newData = personListData.map(item =>
      item.index === currentPerson.index && item.type === 'customer'?{
        ...item,
        hasValue: true,
        isInitialized:false,
        matterPartPersonName: data.nom_Pessoa,
        personListData: customerList,
      }:
      item
    )

    setPersonListData(newData);
    // setCustomerId(Number(data.cod_Cliente))

    const nameField = `customer${currentPerson.index}`
    setValue(nameField, {id: data.cod_Cliente, label: data.nom_Pessoa}, { shouldDirty: true })


  },[currentPerson])


  // update new opossing on selected line
  const handleUpdateNewOpossing = useCallback((data: any) => {

    if (currentPerson){
      const personSelected = personListData.find(item => item.type === currentPerson?.type && item.index === currentPerson.index)
      if (personSelected){
        setValue(`opossing${personSelected.index}`, {id: data.cod_Contrario, label: data.nom_Pessoa})
      }

    }

  },[currentPerson])

  // update new lawyer on selected line
  const handleUpdateNewLawyer = useCallback((data: any) => {

    if (currentPerson){
        const lawyerType = currentPerson.lawyerType == 'C'? 'lawyerCustomer': 'lawyerOpossing'
        setValue(`${lawyerType}${currentPerson.index}`, {id: data.cod_Advogado, label: data.nom_Pessoa})
    }

  },[currentPerson])

  // update new thirdy on selected line
  const handleUpdateNewThirdy = useCallback((data: any) => {

    if (currentPerson){
      setValue(`thirdy${currentPerson.index}`, {id: data.cod_Terceiro, label: data.nom_Pessoa})
    }

  },[currentPerson])

  const handleChangeCustomer = (person, customer) => {

    const newData = personListData.map(item =>
      item.index === person.index && item.type === 'customer'?{
        ...item,
        isInitialized: customer == null,
        matterPartPersonName: customer? customer.label : null,
        hasValue: customer != null
      }:
      item
    )

    setHasChanges(customer != null)

    // update list to refresh icon edit or new
    setPersonListData(newData);

    // save new customer value
    setValue(`customer${person.index}`, customer)
  }

  if (isLoading || IsSaving) {

    return (
      <Container>
        <div className="waiting">
          <Loader size={30} color="var(--blue-twitter)" />
        </div>
      </Container>
    )
  }
  return (

    <Container>

       <form onSubmit={handleSubmit(handleSave)}>

        {/* Person Modals */}
       { showOpposingPartyModal && <OpposingPartyEdit callbackFunction={{handleUpdateNewOpossing}} />}
       { showThirdPartyModal && <ThirdPartyEdit callbackFunction={{handleUpdateNewThirdy}} />}
       { showLawyerModal && <LawyerEdit callbackFunction={{handleUpdateNewLawyer}} />}
       { showCustomerModal && <CustomerModalEdit callbackFunction={{handleUpdateNewCustomer, customerId}} />}

        {/* CUSTOMER SECTION */}
        <Content>

          <header>Clientes</header>

          {personListData.filter(item => item.type === 'customer').map((customer, index) => (

            <section style={{pointerEvents: (customer.deleteMarker? 'none': 'all')}}>

              <label className='comboPerson' style={{opacity: (customer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Cliente</span> }

                {/* customer select with onChange event - all combodata except customer has no onChange event */}
                <Controller
                  control={control}
                  name={`customer${customer.index}`}
                  ref={register}
                  render={({ name }) => (
                    <Select
                      isClearable
                      isSearchable
                      placeholder="Selecione"
                      options={customer.personListData}
                      onInputChange={(term: string) => handleReactInputText(term, customer, 'person')}
                      loadingMessage={loadingMessage}
                      noOptionsMessage={noOptionsMessage}
                      name={`customer${customer.index}`}
                      ref={register}
                      value={customer.isInitialized? null: customer.personListData.find(item => item.label === customer.matterPartPersonName)}
                      onChange={(e) => handleChangeCustomer(customer, e)}
                    />
                  )}
                />

                {/* button include new customer  */}
                {((accessCode??"").includes('CUSTOMER') || (accessCode??"") == 'adm') && customer.hasValue != true && (
                  <GoPlus title='Clique para efetuar a inclusão de um novo cliente' onClick={() => openModalCustomer(customer, "new")} />
                )}

                {/* button edit customer selected  */}
                {((accessCode??"").includes('CUSTOMER') || (accessCode??"") == 'adm') && customer.hasValue == true && (
                  <FiEdit title='Clique para visualizar as informações do cliente selecionado' onClick={() => openModalCustomer(customer, "edit")} />
                )}

              </label>

              <label className='comboType' style={{opacity: (customer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Posição</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={customer.partsListData}
                  defaultValue={customer.partsListData.find(item => Number(item.id) === Number(customer.partId??""))}
                  onInputChange={(term) => handleReactInputText(term, customer, 'part')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`customerType${customer.index}`}
                  ref={register}
                />
                <FiTrash title='Clique para marcar este cliente como excluído' onClick={(e) => handleDeletePerson(e, customer)} />
              </label>

              <label className='checkMain' style={{opacity: (customer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Principal</span> }
                <input
                  type='checkbox'
                  defaultChecked={customer.principal}
                  title='Marque esta opção caso queira definir este cliente como principal'
                  name={`customerMain${customer.index}`}
                  ref={register}
                />
              </label>

            </section>

          ))}

          <footer>

            <button
              type='button'
              className='buttonLinkClick'
              title='Clique para adicionar uma nova linha de cliente'
              onClick={() => handleAddNewPerson("customer")}
            >
              <GoPlus title='Clique para adicionar uma nova linha de cliente' />
              Adicionar cliente
            </button>

          </footer>

        </Content>

        {/* LAWYER CUSTOMER SECTION */}
        <Content>

          {personListData.filter(item => item.type === 'lawyer' && item.lawyerType === 'C').map((lawyer, index) => (

            <section style={{pointerEvents: (lawyer.deleteMarker? 'none': 'all')}}>

              <label className='comboPerson' style={{opacity: (lawyer.deleteMarker? '0.4': '1')}}>
              {index === 0 && <span>Advogado</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={lawyer.personListData}
                  onInputChange={(term) => handleReactInputText(term, lawyer, 'person')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`lawyerCustomer${lawyer.index}`}
                  ref={register}
                />

                {/* button include new lawyer  */}
                {((accessCode??"").includes('CFGLAW') || (accessCode??"") == 'adm') && (
                  <GoPlus title='Clique para efetuar a inclusão de um novo advogado do cliente' onClick={() => openModalLawyer(lawyer, "new", 'C')} />
                )}
              </label>

              <label className='comboType' style={{opacity: (lawyer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Posição</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={lawyer.partsListData}
                  defaultValue={lawyer.partsListData.find(item => Number(item.id) === Number(lawyer.partId))}
                  onInputChange={(term) => handleReactInputText(term, lawyer, 'part')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`lawyerCustomerType${lawyer.index}`}
                  ref={register}
                />
                <FiTrash title='Clique para marcar este advogado do cliente como excluído' onClick={(e) => handleDeletePerson(e, lawyer)} />
              </label>

              <label className='checkMain' style={{opacity: (lawyer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Principal</span> }
                <input
                  type='checkbox'
                  defaultChecked={lawyer.principal}
                  title='Marque esta opção caso queira definir este advogado como principal'
                  name={`lawyerCustomerMain${lawyer.index}`}
                  ref={register}
                />
              </label>

            </section>

          ))}

          <footer>

            <button
              type='button'
              className='buttonLinkClick'
              title='Clique para adicionar uma nova linha de advogado do cliente'
              onClick={() => handleAddNewPerson("lawyer", 'C')}
            >
              <GoPlus title='Clique para adicionar uma nova linha de advogado do cliente' />
              adicionar advogado do cliente
            </button>

          </footer>

        </Content>

        {/* OPOSSING SECTION */}
        <Content>

          <header>Contrários</header>

          {personListData.filter(item => item.type === 'opossing').map((opossing, index) => (

            <section style={{pointerEvents: (opossing.deleteMarker? 'none': 'all')}}>

              <label className='comboPerson' style={{opacity: (opossing.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Contrário</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={opossing.personListData}
                  onInputChange={(term) => handleReactInputText(term, opossing,'person')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`opossing${opossing.index}`}
                  ref={register}
                />

                {/* button include new lawyer  */}
                {((accessCode??"").includes('CFGOPP') || (accessCode??"") == 'adm') && (
                  <GoPlus title='Clique para efetuar a inclusão de um novo contrário' onClick={() => openModalOpposingParty(opossing, "new")} />
                )}

              </label>

              <label className='comboType' style={{opacity: (opossing.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Posição</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={opossing.partsListData}
                  onInputChange={(term) => handleReactInputText(term, opossing,'part')}
                  defaultValue={opossing.partsListData.find(item => Number(item.id) === Number(opossing.partId??""))}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`opossingType${opossing.index}`}
                  ref={register}
                />
                <FiTrash title='Clique para marcar este contrário como excluído' onClick={(e) => handleDeletePerson(e, opossing)} />
              </label>

              <label className='checkMain' style={{opacity: (opossing.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Principal</span> }
                <input
                  type='checkbox'
                  defaultChecked={opossing.principal}
                  title='Marque esta opção caso queira definir este contrário como principal'
                  name={`opossingMain${opossing.index}`}
                  ref={register}
                />
              </label>

            </section>

          ))}

          <footer>

            <button
              type='button'
              className='buttonLinkClick'
              title='Clique para adicionar uma nova linha de contrário'
              onClick={() => handleAddNewPerson("opossing")}
            >
              <GoPlus title='Clique para adicionar uma nova linha de contrário' />
              adicionar contrário
            </button>

          </footer>

        </Content>

        {/* LAWYER OPOSSING SECTION */}
        <Content>

          {personListData.filter(item => item.type === 'lawyer' && item.lawyerType === 'O').map((lawyer, index) => (

            <section style={{pointerEvents: (lawyer.deleteMarker? 'none': 'all')}}>

              <label className='comboPerson' style={{opacity: (lawyer.deleteMarker? '0.4': '1')}}>
              {index === 0 && <span>Advogado</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={lawyer.personListData}
                  onInputChange={(term) => handleReactInputText(term, lawyer, 'person')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`lawyerOpossing${lawyer.index}`}
                  ref={register}
                />

                {/* button include new lawyer  */}
                {((accessCode??"").includes('CFGLAW') || (accessCode??"") == 'adm') && (
                    <GoPlus title='Clique para efetuar a inclusão de um novo advogado do contrário' onClick={() => openModalLawyer(lawyer, "new", 'O')} />
                )}
              </label>

              <label className='comboType' style={{opacity: (lawyer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Posição</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={lawyer.partsListData}
                  defaultValue={lawyer.partsListData.find(item => Number(item.id) === Number(lawyer.partId))}
                  onInputChange={(term) => handleReactInputText(term, lawyer, 'part')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`lawyerOpossingType${lawyer.index}`}
                  ref={register}
                />
                <FiTrash title='Clique para marcar este advogado do contrário como excluído' onClick={(e) => handleDeletePerson(e, lawyer)} />
              </label>

              <label className='checkMain' style={{opacity: (lawyer.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Principal</span> }
                <input
                  type='checkbox'
                  defaultChecked={lawyer.principal}
                  title='Marque esta opção caso queira definir este advogado como principal'
                  name={`lawyerOpossingMain${lawyer.index}`}
                  ref={register}
                />
              </label>

            </section>

          ))}

          <footer>

            <button
              type='button'
              className='buttonLinkClick'
              title='Clique para adicionar uma nova linha de advogado do contrário'
              onClick={() => handleAddNewPerson("lawyer", 'O')}
            >
              <GoPlus title='Clique para adicionar uma nova linha de advogado do contrário' />
              adicionar advogado do contrário
            </button>

          </footer>

        </Content>

        {/* THIRDY SECTION */}
        <Content>

          <header>Terceiros</header>

          {personListData.filter(item => item.type === 'thirdy').map((thirdy, index) => (

            <section style={{pointerEvents: (thirdy.deleteMarker? 'none': 'all')}}>

              <label className='comboPerson' style={{opacity: (thirdy.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Terceiro</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={thirdy.personListData}
                  onInputChange={(term) => handleReactInputText(term, thirdy, 'person')}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`thirdy${thirdy.index}`}
                  ref={register}
                />

                {/* button include new thirdy  */}
                {((accessCode??"").includes('CFGTHIRD') || (accessCode??"") == 'adm') && (
                  <GoPlus title='Clique para efetuar a inclusão de um novo terceiro' onClick={() => openModalThirdParty(thirdy, "new")} />
                )}

              </label>

              <label className='comboType' style={{opacity: (thirdy.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Posição</span> }
                <Controller
                  as={Select}
                  isClearable
                  isSearchable
                  placeholder="Selecione"
                  control={control}
                  options={thirdy.partsListData}
                  onInputChange={(term) => handleReactInputText(term, thirdy,'part')}
                  defaultValue={thirdy.partsListData.find(item => Number(item.id) === Number(thirdy.partId??""))}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  name={`thirdyType${thirdy.index}`}
                  ref={register}
                />
                <FiTrash title='Clique para marcar este terceiro como excluído' onClick={(e) => handleDeletePerson(e, thirdy)} />
              </label>

              <label className='checkMain' style={{opacity: (thirdy.deleteMarker? '0.4': '1')}}>
                {index === 0 && <span>Principal</span> }
                <input
                  type='checkbox'
                  defaultChecked={thirdy.principal}
                  title='Marque esta opção caso queira definir este terceiro como principal'
                  name={`thirdyMain${thirdy.index}`}
                  ref={register}
                />
              </label>

            </section>

          ))}

          <footer>

            <button
              type='button'
              className='buttonLinkClick'
              title='Clique para adicionar uma nova linha de terceiro'
              onClick={() => handleAddNewPerson("thirdy")}
            >
              <GoPlus title='Clique para adicionar uma nova linha de terceiro' />
              adicionar terceiro
            </button>

            <br />
          </footer>

        </Content>

        <footer>

          {(accessCode?.includes('MATCONS') || accessCode?.includes('MATLEGAL') || accessCode === 'adm') && (
            <button
              type='submit'
              className='buttonLinkClick'
            >
              <FiSave />
              Salvar
            </button>
          )}

            {hasChanges && (
              <button
                type='button'
                onClick={handleCancel}
                className='buttonLinkClick'
              >
                <MdBlock />
                Desfazer Alterações
              </button>
            )}

        </footer>

       </form>

       {cancelChanges && (
        <ConfirmBoxModal
          title="Cancelar Operação"
          caller="matterPeopleCancel"
          message="Todas as informações de pessoas serão perdidas, deseja continuar ? "
        />
      )}

      {isDeleting != '' && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            <span>{`Deletando ${isDeleting}`}</span>
          </div>
        </>
      )}

      {IsSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Salvando...
          </div>
        </>
      )}

    </Container>
  )
}

export default People
