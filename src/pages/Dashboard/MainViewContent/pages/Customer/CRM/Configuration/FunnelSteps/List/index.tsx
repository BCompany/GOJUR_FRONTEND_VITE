/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/label-has-associated-control
import React, { useCallback, useEffect, useState } from 'react';
import api from 'services/api';
import { FaFileAlt } from 'react-icons/fa';
import { FiEdit, FiTrash } from 'react-icons/fi'
import { FcAbout } from 'react-icons/fc';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { VscAdd, VscEdit } from 'react-icons/vsc'
import { useToast } from 'context/toast';
import { useHistory } from 'react-router-dom';
import { useModal } from 'context/modal';
import Select from 'react-select';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { HeaderPage } from 'components/HeaderPage';
import { DragDropContext, Droppable, Draggable   } from 'react-beautiful-dnd';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { useDefaultSettings } from 'context/defaultSettings';
import { IDefaultsProps, ISalesFunnelData, ISalesFunnelDataSteps } from '../../../../Interfaces/IBusiness';
import { ISelectData } from '../../../../Interfaces/ICustomerEdit';
import { Container, ItemFunnelStep } from './styles';
import SalesFunnelEdit from '../Modal';
import SalesFunnelModal from '../../Funnel/Modal';

const SalesFunnelList = () => {

  const { addToast } = useToast();
  const history = useHistory();
  const [salesFunnelList, setSalesFunnelList] = useState<ISelectData[]>([]); 
  const [salesFunnelStepList, setSalesFunnelStepList] = useState<ISelectData[]>([]); 
  const {isConfirmMessage, isCancelMessage, handleCancelMessage,handleConfirmMessage } = useConfirmBox();
  const { handleShowSalesFunnelStepModal, showSalesFunnelStepModal, handleShowSalesFunnelModal, handleJsonModalObjectResult, showSalesFunnelModal, jsonModalObjectResult } = useModal();
  const [salesFunnelId, setSalesFunnelId] = useState<number>(0); 
  const [currentId, setCurrentId] = useState<number>(0); 
  const [salesFunnelEditId, setSalesFunnelEditId] = useState<number>(0); 
  const [isInitilize, setIsInitialize] = useState<boolean>(true); 
  const [checkMessage, setCheckMessage] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userSalesFunnelTerm, setSalesFunnelTerm] = useState<string>('')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const { handleUserPermission } = useDefaultSettings();

  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    if (isInitilize){
      LoadSalesFunnel();    
    }

  }, [isInitilize])

  useEffect(() => {

    console.log(isDragging)

  }, [isDragging])
  
  useEffect(() => {
    
    if (salesFunnelId > 0)
      LoadSalesFunnelSteps()    

  }, [salesFunnelId])

  
  useEffect(() => {

    if (!showSalesFunnelStepModal && !isInitilize){
      LoadSalesFunnelSteps()
    }

  },[showSalesFunnelStepModal])

  useEffect(() => {
  
    if (isCancelMessage){  
      setCheckMessage(false)
      handleCancelMessage(false)
      setCurrentId(0)
    }  
  }, [isCancelMessage])   
  
  useEffect(() => {
    
    if (isConfirmMessage){
      setCheckMessage(false)
      handleConfirmMessage(false)
      handleDelete(currentId)
    }

  }, [isConfirmMessage, currentId]) 

  useEffect(() => {

    if (jsonModalObjectResult != ''){
      LoadSalesFunnel()
      LoadSalesFunnelSteps()
    }

  },[jsonModalObjectResult])

  useDelay(() => {       

    if (userSalesFunnelTerm.length > 0){
      LoadSalesFunnel()
    }

  }, [userSalesFunnelTerm], 1000)
  
  const LoadSalesFunnelSteps = async() => {

    const response = await api.get<ISalesFunnelDataSteps[]>('FunilVendasEtapas/Listar', { 
      params: {
        token,
        salesFunnelId,
        filterClause: ""
      }
    })

    setSalesFunnelStepList(response.data)
    setIsLoading(false)
  }

  const LoadSalesFunnel = async () => {
   
    const response = await api.get<ISalesFunnelData[]>('FunilVendas/Listar', {
      params:{
        token,
        filterClause: ""
      }
    })

    setSalesFunnelList(response.data)

    // select from json just saved
    if (jsonModalObjectResult.length > 0) {

      // when is delete just call refresh list
      if (jsonModalObjectResult != 'delete'){
        const jsonSalesFunnelSaved = JSON.parse(jsonModalObjectResult);
        if (jsonSalesFunnelSaved){
          setSalesFunnelId(jsonSalesFunnelSaved.id)
          handleJsonModalObjectResult('')
        }
      }
    }

    // select first when doesnt exists anyone else selected
    if (jsonModalObjectResult.length == 0 || jsonModalObjectResult == 'delete')  {
      const salesFunnelDefault  = response.data.filter(row => row.isDefault == 'S')
      if (salesFunnelDefault.length > 0) {
        setSalesFunnelId(Number(salesFunnelDefault[0].id))
      }
    }
    
    setIsInitialize(false)
  }

  useEffect(() => {
   
    async function handleDefaultProps() {
      try {
  
        const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token })
        
        const userprops = response.data.find(item => item.id === "defaultModulePermissions");
        if (userprops)
          handleUserPermission(userprops.value.split('|'));

      } catch (err) {
        console.log(err);
      }
    }

    handleDefaultProps()
  
  },[handleUserPermission, token]) 

  const handleEdit = useCallback(async(id: number) => {
    
    setCurrentId(id);
    handleShowSalesFunnelStepModal(true)

  }, [salesFunnelId, showSalesFunnelStepModal])
  
  const handleDeleteCheck  = async (id:number) =>{

    setCheckMessage(true)
    setCurrentId(id)
  }  

  const handleAddNewItem = useCallback(async() => {
    
    if (salesFunnelId === 0){
      addToast({
        type: "info",
        title: "Selecione um funil de vendas",
        description: `Para adicionar uma nova etapa é necessário selecionar um funil de vendas`
      })
      return false;
    }

    setCurrentId(0)
    handleShowSalesFunnelStepModal(true)

  }, [salesFunnelId, showSalesFunnelStepModal])
  
  const handleDelete = async (id: number) => {
    try
    {    
      const response = await api.delete<ISalesFunnelData[]>('FunilVendasEtapas/Deletar', { 
        params:{
          id,
          salesFunnelId,
          token
        }
      })

      if (response.status == 200){
        addToast({
          type: "success",
          title: "Registro removido com sucesso",
          description: `A etapa do funil de vendas selecionado foi removido com sucesso`
        })

        LoadSalesFunnelSteps()
      }   
      
      setCurrentId(0)
    }
    catch(ex){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `Não foi possível excluir o registro selecionado, tente novamente`
      })
      console.log(ex)
    }
  }
    
  const handleSalesFunell = (item) => { 
      
    setIsLoading(true)

    if (item){
      setSalesFunnelId(item.id)
    }else{
      setSalesFunnelId(0)
      LoadSalesFunnel()
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleSave = useCallback(async(items: ISelectData[])  => {
    try
    {
      const request: any[] = [];
      items.map((item) => { 
        return request.push({ 
          id: item.id,
           label: item.label, 
           token, 
           salesFunnelId  
        })
      })

      await api.put<ISalesFunnelDataSteps[]>('FunilVendasEtapas/SalvarLista', request)

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `As etapas do funil de vendas foram salvas com sucesso`
      })
      
      LoadSalesFunnelSteps()
    }
    catch(err){
     
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: `Houve uma falha ao salvar o funil de vendas`
      })
     
      console.log(err)
    }

  },[salesFunnelStepList])

  
  function handleOnDragEnd(result) {
    try
    {
        setIsDragging(false)
        if (result.destination != null && result.source != null) {
          if (result.destination.index === result.source.index){
            return
          }
        }

        if (!result.destination) return

        const items = Array.from(salesFunnelStepList)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setSalesFunnelStepList(items)
        handleSave(items)
    }
    catch(err){
      console.log(err)
    }
  } 

  const openModalSalesFunnel = (action: string) => {
    if (action === 'edit'){
      setSalesFunnelEditId(salesFunnelId)
      handleShowSalesFunnelModal(true)
    }
    if (action === 'new'){
      setSalesFunnelEditId(0)
      handleShowSalesFunnelModal(true)
    }
  }

  return (

    <>

      <HeaderPage />

      { checkMessage && (
        <ConfirmBoxModal
          buttonCancelText="Cancelar"
          buttonOkText="Confirmar"
          message="Confirma a exclusão desta etapa do funil de vendas ?"
        />
      )}
      
      { showSalesFunnelModal && <SalesFunnelModal id={salesFunnelEditId} />}

      <Container>
      
        { showSalesFunnelStepModal && <SalesFunnelEdit id={currentId} salesFunnelId={salesFunnelId} />}

        <div className='buttonAdd'>
          <button 
            className="buttonClick" 
            title="Clique para incluir um novo item para o funíl de vendas"
            type="submit"
            onClick={() => handleAddNewItem()}
          >
            <FaFileAlt />
            Criar Etapa
          </button>

          <button 
            className="buttonClick" 
            title="Clique para retornar a lista de clientes"
            type="submit"
            onClick={() => history.goBack()}
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>

        </div>

        <br /> 

        <div className="selectFunnel">          
          Funil de Vendas 
          <Select
            isSearchable   
            value={salesFunnelList.filter(options => options.id == (salesFunnelId? salesFunnelId.toString(): ''))}
            onChange={handleSalesFunell}
            onInputChange={(term) => setSalesFunnelTerm(term)}
            placeholder="Selecione"
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            noOptionsMessage={noOptionsMessage}
            styles={selectStyles}              
            options={salesFunnelList}
          />
                
          <button 
            type="submit"
            className="buttonLinkClick" 
            onClick={() => openModalSalesFunnel("edit")}
            title="Clique para editar o funil de vendas"
          >
            <VscEdit title="Clique para editar o funil de vendas" />
          </button>

          <button 
            type="submit"
            style={{marginRight:'-3.2rem'}}
            className="buttonLinkClick" 
            onClick={() => openModalSalesFunnel("new")}
            title="Clique para incluir um novo funil de vendas"
          >
            <VscAdd title="Clique para incluir um novo funil de vendas" />
          </button>

        </div>        
          
        <div className="messageTip">
          <FcAbout />
          Arraste e solte para reordenar as etapas
        </div>

        <DragDropContext 
          onDragStart={() => setIsDragging(true)} 
          onDragEnd={handleOnDragEnd}
        >

          <Droppable droppableId="funnelSteps">
            {(provided) => (
              <ul style={{overflow:'scroll'}} className="funnelSteps" {...provided.droppableProps} ref={provided.innerRef}>
                                  
                {salesFunnelStepList.map(({id, label}, index) => {
                    return (
                      
                      <ItemFunnelStep 
                        isMoving={isDragging}
                        changeColor={(index%2)===0}
                      >
                        
                        <Draggable key={id} draggableId={id.toString()} index={index}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              {...provided.dragHandleProps}
                            >
                              
                              <span>{label}</span>

                              <button 
                                type="submit"                                
                                className="buttonLinkClick buttonEdit" 
                                title="Clique para editar esta etapa do funil de venda"
                                onClick={() => handleEdit(Number(id))}
                              >
                                <FiEdit title="Clique para editar " />
                              </button>

                              <button 
                                type="submit"
                                className="buttonLinkClick buttonDelete" 
                                title="Clique para deletar esta etapa do funil de vendas"
                                onClick={() => handleDeleteCheck(Number(id))}
                              >
                                <FiTrash title="Clique para remover" />
                              </button>

                            </div>

                          )}
                        </Draggable>

                      </ItemFunnelStep>

                    );
                  })}
              </ul>

            )}
          </Droppable>
          
        </DragDropContext>      
          
      </Container>
    
    </>
  )
}

export default SalesFunnelList;
