/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */

import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal';
import api from 'services/api';
import {useConfirmBox } from 'context/confirmBox';
import {MdBlock} from 'react-icons/md';
import {BiSave} from 'react-icons/bi';
import {FiTrash } from 'react-icons/fi';
import {CgArrowsExchange} from 'react-icons/cg';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/PulseLoader';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import {Box, Container, Content, ItemBox } from './styles'
import { IMatterPartData } from '../Interfaces/IMatter';

export default function InvertParts () {

  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token')
  const matterId = localStorage.getItem('@GoJur:matterId');
  const [personPartId, setPersonPartId] = useState<number>(0)
  const [dragOverArea, setDragOverArea] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showMessageWaiting, setShowMessageWaiting] = useState<boolean>(false)
  const [checkBoxAllCustomer, setCheckBoxAllCustomer] = useState<boolean>(false)
  const [checkBoxAllOpossing, setCheckBoxAllOpossing] = useState<boolean>(false)
  const [customerList, setCustomerList] = useState<IMatterPartData[]>([]);
  const [opossingList, setOpossingList] = useState<IMatterPartData[]>([]);
  const [removeCustomerList, setRemoveCustomerList] = useState<IMatterPartData[]>([]);
  const [removeOpossingList, setRemoveOpossingList] = useState<IMatterPartData[]>([]);
  const { handleCancelMessage,handleCaller, handleConfirmMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();

  // Initialize
  useEffect(() => {
    
    LoadParts()

  },[])

  const LoadParts = async () => {

    const response = await api.get('/Processo/ListarPartes', {
      params:{
        token,
        matterId
      }
    })

    setCustomerList(response.data.filter(item => item.isCustomer))
    setOpossingList(response.data.filter(item => !item.isCustomer))
    handleConfirmMessage(false)
    handleCancelMessage(false)
    setIsLoading(false)
  }
  
  useEffect(() => {

    if (isCancelMessage && caller === 'invertParts'){

      setIsSaving(false)
      handleCancelMessage(false)
      handleCaller('')
    }

  },[caller, handleCaller, handleCancelMessage, isCancelMessage])
  
  useEffect(() => {

    if (isConfirmMessage && caller == 'invertParts'){

      setIsSaving(false)
      handleConfirmMessage(false)
      handleSave()
      handleCaller('')
    }

  },[caller, handleCaller, handleConfirmMessage, isConfirmMessage])

  const handleSave = useCallback(async () => {

    try
    {
      if (showMessageWaiting) return ;

      setShowMessageWaiting(true)

      // build customer list parts
      const newCustomerList = customerList.filter(item => item.isMoved && item.isCustomer)
      const customerPart: string[] = []
      newCustomerList.map(item => {
        return customerPart.push(item.partName)
      })

      // build opossing list parts
      const newOpossingList = opossingList.filter(item => item.isMoved && !item.isCustomer)
      const opossingPart: string[] = [];
      newOpossingList.map(item => {
        return opossingPart.push(item.partName)
      })
      
      const response = await api.post('/Processo/SalvarInverterPartes', {
          token,
          matterId,
          customerPart: JSON.stringify(customerPart),
          opossingPart:JSON.stringify(opossingPart),
          removeCustomerList: JSON.stringify(removeCustomerList),
          removeOpposingList: JSON.stringify(removeOpossingList)
      })

      handleCloseModal();

      if (response.data){
        addToast({
          type: "success",
          title: "Operação realizada com sucesso",
          description: `As partes foram alteradas com sucesso`
        })
      }
    }
    
    catch(err){
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: "Houve uma falha na inversão as partes do processo, verifique os dados do processo e tente novamente"
      })
      setIsSaving(false)
    }

  },[addToast, customerList, matterId, opossingList, removeCustomerList, removeOpossingList, token])

  const handleInvert = useCallback(async () => {

    if (showMessageWaiting) return ;
    
    customerList.map((item) => {
      item.isMoved = true;
      item.isCustomer = false;
    })
    setOpossingList(customerList)
    setRemoveCustomerList(customerList)

    opossingList.map((item) => {
      item.isMoved = true;
      item.isCustomer = true;
    })
    setCustomerList(opossingList)
    setRemoveOpossingList(opossingList)
    

  }, [customerList, opossingList])

  const handleDeleteSelected = () => {

    setOpossingList(opossingList.filter(opossing => !opossing.isSelected))
    setRemoveOpossingList(opossingList.filter(customer => customer.isSelected))
    
    setCustomerList(customerList.filter(customer => !customer.isSelected))
    setRemoveCustomerList(customerList.filter(customer => customer.isSelected))


    // // Delete selectd customer
    // const newDataCustomer = customerList.filter(item => !item.isSelected);
    // setCustomerList(newDataCustomer)
    // // add to list remove 
    // const newDataCustomerRemove: IMatterPartDataRemove[] = [];
    // customerList.map((item) => {
    //   if(item.isSelected){
    //     return newDataCustomerRemove.push({
    //       partName: item.matterCustomerDesc,
    //       partId: item.matterPartId
    //     })
    //   }
    //   return null;
    // })
    // setRemoveCustomerList([...removeCustomerList, ...newDataCustomerRemove])

    // // delete selected opossing
    // const newDataOpossing  = opossingList.filter(item => !item.isSelected);
    // setOpossingList(newDataOpossing)
    
    // // add to list remove 
    // const newDataOpossingRemove: IMatterPartDataRemove[] = [];
    // opossingList.map((item) =>{
    //   if(item.isSelected){
    //     return newDataOpossingRemove.push({
    //       partName: item.matterCustomerDesc,
    //       partId: item.matterPartId
    //     })
    //   }
    //   return null;
    // })
    // setRemoveOpossingList([...removeOpossingList, ...newDataOpossingRemove])
  }

  const handleDelete = (personId: number, origin: string) => {

    // if (hasInverted){
    //   setRemoveCustomerList([])
    //   setRemoveOpossingList([])
    // }

    const newDataOposing = opossingList.filter(opossing => opossing.personId != personId)
    setOpossingList(newDataOposing)

    const newDataCustomer = customerList.filter(customer => customer.personId != personId)
    setCustomerList(newDataCustomer)

    if (origin == 'customerBox'){

      const person = customerList.find(item => item.personId == personId)
      if (person) {
        removeCustomerList.push(person)
        setRemoveCustomerList(removeCustomerList)
      }

    }

    if (origin == 'opossingBox'){

      const person = opossingList.find(item => item.personId == personId)
      if (person) {
        removeOpossingList.push(person)
        setRemoveOpossingList(removeOpossingList)
      }

    }
  }
  
  const handleCloseModal = () => {

    // is is saving return
    if (showMessageWaiting) return ;
    
    handleCaller('matterInvertParts')
    handleCancelMessage(true)
    setIsSaving(false)
    setShowMessageWaiting(false)
  }
  
  const handleSelectAllCustomer = useCallback(async() => {

    const newData = customerList.map(item => ({
      ...item,
      isSelected:!checkBoxAllCustomer
    }))

    setCustomerList(newData)
    setCheckBoxAllCustomer(!checkBoxAllCustomer)
  
  },[checkBoxAllCustomer, customerList])
    
  const handleSelectAllOpossing = useCallback(async() => {

    const newData = opossingList.map(item => ({
      ...item,
      isSelected:!checkBoxAllOpossing
    }))

    setOpossingList(newData)
    setCheckBoxAllOpossing(!checkBoxAllOpossing)

    },[checkBoxAllOpossing, opossingList])

  const handleSelectCustomer = async (personId: number) => {

    const newData = customerList.map(item => 
      item.personId === personId
      ? {
        ...item,
        isSelected:!item.isSelected 
      }:
      item
    )

    setCustomerList(newData)
    setCheckBoxAllCustomer(false)
  }

  const handleSelectOpossing = async (personId: number) => {

    const newData = opossingList.map(item => 
      item.personId === personId
      ? {
        ...item,
        isSelected:!item.isSelected
      }:
      item
    )
    
    setOpossingList(newData)
    setCheckBoxAllOpossing(false)
  }

  const handleDragStart = (e: any, personId: number) => {

    setPersonPartId(personId)
    e.stopPropagation()
  }
 
  const handleDragOver = (e:any) =>{
    setDragOverArea(e.currentTarget.id)
  }

  const handleDragDrop = useCallback(e  => {

    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.id == undefined || e.currentTarget.id == ''){
      e.preventDefault();
      return false;
    }
    
    if (dragOverArea === 'opossingBox'){

      const person = customerList.find(item => item.personId === personPartId)     
      if (person)
      {
        const newCustomerList = customerList.filter(item => item.personId != personPartId)
        setCustomerList(newCustomerList)

        person.isCustomer = false;
        person.isMoved = true;        
        // New item to append to opossing list current
        const newOpossingData: IMatterPartData[] = [];
        newOpossingData.push(person)
        setOpossingList([...newOpossingData, ...opossingList])
 
        removeCustomerList.push(person)
        setRemoveCustomerList(removeCustomerList)
      }

      return false; 
    }
    
    if (dragOverArea === 'customerBox'){
      
      const person = opossingList.find(item => item.personId === personPartId)
      if (person) 
      {
        const newOpossingList = opossingList.filter(item => item.personId != personPartId)
        setOpossingList(newOpossingList);

        person.isCustomer = true;
        person.isMoved = true;

        // New item to append to customer list current
        const newCustomerData: IMatterPartData[] = [];
        newCustomerData.push(person)
        setCustomerList([...newCustomerData, ...customerList])

        removeOpossingList.push(person)
        setRemoveOpossingList(removeOpossingList)
      }

      return false;
    }
  
  },[customerList, dragOverArea, opossingList, personPartId, removeCustomerList, removeOpossingList])

  function handleDropBoxes(ev) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  return (

    <>
      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content-large"
      >
        
        <Container>

          <header>
            <h1>Alteração das partes do processo</h1>
            <h5>Clique e arraste a parte desejada para a sua parte de destino.</h5>
          </header>

          <Content>

            <Box 
              id="customerBox"
              onDragOver={handleDropBoxes}
              onDragEnter={(e) => handleDragOver(e)}
              onDrop={(ev) => handleDragDrop(ev)}
            >

              <header>              
                <input type='checkbox' checked={checkBoxAllCustomer} onClick={() => handleSelectAllCustomer()} />
                &nbsp;&nbsp;Clientes
              </header>            
  
              {customerList.map((customer) => (
                <ItemBox
                  key={customer.personId.toString()}
                  onDragStart={(e) => handleDragStart(e, customer.personId)}
                  draggable
                >
                  <FiTrash 
                    title='Clique para excluir este cliente'
                    onClick={(e) => handleDelete(customer.personId, 'customerBox')}
                  />
                  <input type='checkbox' checked={customer.isSelected} onClick={() => handleSelectCustomer(customer.personId)} />
                  <span>{customer.partName}</span>

                </ItemBox>
              ))}

              {(customerList.length == 0 && !isLoading) && (
                <div className='messageEmpty'>
                  Nenhum contrário foi definido
                </div>
              )}

               
            </Box>
          
            <Box 
              id="opossingBox"
              onDragOver={handleDropBoxes}
              onDragEnter={(e) => handleDragOver(e)}
              onDrop={(ev) => handleDragDrop(ev)}
            >
              <header>              
                <input type='checkbox' checked={checkBoxAllOpossing} onClick={() => handleSelectAllOpossing()} />
                &nbsp;&nbsp;Contrários
              </header>

              {opossingList.map((opossing) => (
                <ItemBox          
                  key={opossing.personId.toString()}      
                  onDragStart={(e) => handleDragStart(e, opossing.personId)}
                  draggable
                >
                  <FiTrash 
                    onClick={(e) => handleDelete(opossing.personId, 'opossingBox')} 
                    title='Clique para excluir esta parte contrária'
                  />
                  <input type='checkbox' checked={opossing.isSelected} onClick={()=> handleSelectOpossing(opossing.personId)} />
                  {opossing.partName}
                </ItemBox>
              ))}

              {(opossingList.length == 0 && !isLoading) && (
                <div className='messageEmpty'> 
                  Nenhum cliente foi definido
                </div>
              )}

            </Box>

          </Content>

          <footer>

            <button 
              className="buttonLinkClick" 
              type="button"
              onClick={handleInvert}
              title="Clique para salvar o parâmetro"
            >
              <CgArrowsExchange />
              Inverter Lados            
            </button>  

            <button 
              className="buttonLinkClick" 
              type="button"
              onClick={handleDeleteSelected}
              title="Clique para salvar o parâmetro"
            >
              <FiTrash />
              Remover Selecionados
            </button>   
          
            <button 
              className="buttonLinkClick" 
              type="button"
              onClick={() => setIsSaving(true)}
              title="Clique para salvar o parâmetro"
            >
              <BiSave />
              Salvar            
            </button>   

            <button 
              className="buttonLinkClick" 
              type="button"
              onClick={handleCloseModal}
              title="Clique para retornar a listagem de processos"
            >
              <MdBlock />
              Fechar            
            </button>  
          
            {showMessageWaiting && (
              <div>
                Aguarde...
                <Loader size={6} color="var(--blue-twitter)" /> 
              </div>
            )}

          </footer>
        </Container>

      </Modal>

      {isSaving && (
        <ConfirmBoxModal
          title="AVISO"
          caller="invertParts"
          message="Confirma a alteração das partes deste processo  ?"
        />
      )}

    </>
  )
}