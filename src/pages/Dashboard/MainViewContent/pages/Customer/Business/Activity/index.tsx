import React, { useCallback, useEffect, useState } from 'react';
import { MdBlock } from 'react-icons/md';
import { AiOutlineAlignCenter, AiOutlineClose } from 'react-icons/ai'
import { BiEditAlt, BiTrash, BiSave, BiLoader } from 'react-icons/bi'
import { BsTextRight } from 'react-icons/bs'
import api from 'services/api';
import { useToast } from 'context/toast';
import { useTrigger } from 'context/trigger';
import { useLocation } from 'react-router-dom';
import { IBusinessActivityData } from '../../Interfaces/IBusiness';
import { ActivityItem, Avatar, Container } from './styles';

const BusinessActivity = () => {

  const { pathname } = useLocation();
  const { handleTriggerCaller, triggerCaller, triggerExecute } = useTrigger();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [description, setDescription] = useState<string>("")
  const [userCreateId, setUserCreateId] = useState<number>(0)
  const [id, setId] = useState<number>(0) 
  const [idsSaveLot, setIdsSaveLot] = useState<number[]>([]) 
  const [isSavingNewActivity, setIsSavingNewActivity] = useState<boolean>(false)
  const [listActivity, setListActivity] = useState<IBusinessActivityData[]>([])
  const [businessId, setBusinessId] = useState<number>(0)
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {    
    
    const businessId = Number(pathname.substr(24))
    setBusinessId(businessId)   

  },[isLoading])

  useEffect(() => {    

    if (isLoading && businessId > 0) {
      LoadActivity();
    }  

  },[businessId, isLoading])

  const LoadActivity = async () => {

    const response = await api.get<IBusinessActivityData[]>('NegocioAtividade/ListarAtividades', { 
      params: {
        businessId,
        filterClause:"",
        token
      }
    })

    setListActivity(response.data)
    
    setIsLoading(false)
  }
  
  const EditActivity = async (id: number) => {
    
    const response = await api.get<IBusinessActivityData>('NegocioAtividade/Selecionar', { 
      params: {
        id,
        token
      }
    })

    // setId(id)
    idsSaveLot.push(id)
    setIdsSaveLot(idsSaveLot)
    setUserCreateId(response.data.userCreateId)

    const listResult = listActivity.map(item => item.id === id ? {
        ...item,
        updating: !item.updating
      }
    : item,
    );

    setListActivity(listResult);    
  }

  const OpenTextArea = useCallback((id:number) => {
        
    const listResult = listActivity.map(item => item.id === id? {
          ...item,
          isOpen: !item.isOpen
        }
      : item,
    );

    setListActivity(listResult); 
  
  },[listActivity])

  useEffect(() => {

    if (triggerCaller == 'saveActivities'){
      SaveAllForm()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[handleTriggerCaller, triggerCaller, triggerExecute])

  const SaveAllForm = async () => {
    await SaveNewActivity(true)
    await SaveEditActivityList(null)
    handleTriggerCaller('saveBusiness')
  }

  const SaveNewActivity = useCallback(async (allForm:boolean|null) => {

    if (description == ""){
      if (triggerCaller == ''){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Informe um descritivo referente a atividade"
        })
      }
      return false;
    } 

    if (businessId  === 0){
      if (triggerCaller == ''){
        addToast({
          type: "info",
          title: "Operação não realizada",
          description: "Salve este novo negócio antes de incluir qualquer tipo de atividade"
        })
      }

      return false;
    }

    setIsSavingNewActivity(true)

    await api.put('NegocioAtividade/Salvar', { 
        businessId,
        id,
        description,
        userCreateId,
        token
    })

    addToast({
      type: "success",
      title: "Operação realizada com sucesso",
      description: "A atividade foi salva com sucesso"
    })

    if (!allForm){
      await LoadActivity(); 
    }

    ResetValues();

  },[LoadActivity, addToast, description, handleTriggerCaller, id, businessId, token, triggerCaller, userCreateId])
  
  const FlagItemAsDeleting = (id: number, status:boolean) => {

    const listItemSaving = listActivity.map(item => item.id === id ? { ...item, deleting: status}: item );
    
    setListActivity(listItemSaving);   
  }

  const SaveEditActivityList = useCallback(async (item:IBusinessActivityData | null) => {

    if (id != 0){
      return false;
    }
    // save one item by user interaction
    if (item != null){

      setId(item.id)

      await SaveEditActivity(item)

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: "A atividade foi salva com sucesso"
      })
      
      ResetValues() 
      setId(0)
      // FlagItemAsSaving(item.id, false) 
      return;
    }

    // save save lote by click in the main salvar
    const listActivities = listActivity.filter(item => item.updating);
    listActivities.map(item => {
      return SaveEditActivity(item)
    })

    ResetValues()  

  },[addToast, listActivity])

  const SaveEditActivity = useCallback(async (activity:IBusinessActivityData) => {
    
    if (!activity) {
      return;
    }

    if (activity.description == ""){
      return false;
    } 

    // mark item edit as flg editing to show loader on butotn
    const listItemSaving = listActivity.map(item => item.id === id ? {...item, saving: true } : item );
    setListActivity(listItemSaving);  

    const response = await api.put('NegocioAtividade/Salvar', { 
        businessId: activity.businessId,
        id:activity.id,
        date: activity.date,
        description: activity.description,
        userCreateId: activity.userCreateId,
        updated: true,
        token
    })

    const listResult = listActivity.map(item =>
      item.id === activity.id
        ? { ...item,
            updating: false,
            useDefaultImage: false,
            saving: false,
            dateDescription: response.data.dateDescription,
            userUpdate: response.data.userUpdate,
            userPhoto: response.data.userPhoto != null? response.data.userPhoto: response.data.userPhotoDefault,
            userPhotoDefault: response.data.userPhotoDefault            
          }
        : item,
    );

    setListActivity(listResult);  

  },[id, listActivity, token])

  const CancelEdit = async (id: number) => {
    
    const listResult = listActivity.map(item => item.id === id? {...item,updating: false,}: item );
    setListActivity(listResult);
  }

  const DeleteActivity = async (id: number) => {
  
    FlagItemAsDeleting(id, true)
    
    await api.delete('NegocioAtividade/Deletar', { 
      params: {
        id,
        token
      }
    })

    addToast({
      type: "success",
      title: "Atividade Deletada",
      description: "A atividade foi deletada com sucesso"
    })

    
    FlagItemAsDeleting(id, false);
    await LoadActivity();
  }
  
  const handleDescriptionEdit = useCallback((id: number, description:string, updating: boolean) => {
    
    if (!updating) return false;

    const listResult = listActivity.map(item =>
      item.id === id ? { 
          ...item,
            description,
          }
        : item
    );

    setListActivity(listResult)

  },[listActivity])
  
  const handleDefaultUserPhoto = useCallback((activity:IBusinessActivityData) => {
    
    const listResult = listActivity.map(item =>
      item.id === activity.id ? { 
          ...item,
            useDefaultImage: true,
            userPhoto: item.userPhotoDefault
          }
        : item,
    );

    setListActivity(listResult)   

  },[listActivity])

  const ResetValues = () => {
    setDescription("")
    setId(0)
    setUserCreateId(0)
    setIsSavingNewActivity(false)
  }
  
  return (
    
    <Container>
        
      <label htmlFor="item">
        &nbsp;
        <BsTextRight size={15} />
        &nbsp;Atividade
        <section>           
          <textarea 
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={3}
            placeholder="Inserir Comentário"
          />  
                
          <br />

          <div className='buttonsSaveActivity'>
            <button               
              type='button' 
              onClick={() => SaveNewActivity(false)}
              className="buttonLinkClick" 
              style={{float:'right', marginRight:'0px'}}
              title='Salvar Atividade'
            >

              {!isSavingNewActivity && <BiSave /> } 
              {isSavingNewActivity && <BiLoader /> }
              
              {!isSavingNewActivity && <span>Salvar</span>} 
              {isSavingNewActivity && <span>Salvando..</span>} 

            </button> 
          </div>
        
        </section> 
        
        <section>   

          <ActivityItem>

            {listActivity.map(item => {

              return (
                <>
                  <br />  
                  
                  {!item.useDefaultImage && (
                    <Avatar
                      onError={() => handleDefaultUserPhoto(item)}    
                      title={`${item.userUpdate} foi a última pessoa a interagir neste comentário `}
                      src={item.userPhoto} 
                    />
                  )}

                  {item.useDefaultImage && (

                    <Avatar
                      title={`${  item.userUpdate} foi a última pessoa a interagir neste comentário `}
                      src={item.userPhotoDefault}
                    />

                  )}

                  <p className="activityUserUpdate">                    
                    <span className="text">
                      {(item.userUpdate??"").length > 0? item.userUpdate: item.userInclude }
                    </span>
                    <span className="label">
                      &nbsp; - &nbsp;
                      {item.dateDescription} 
                    </span>
               
                  </p>

                  <textarea 
                    className="activityText"
                    onChange={(e) => handleDescriptionEdit(item.id, e.target.value, item.updating)}
                    value={item.description}
                    disabled={!item.updating}
                    style={{height:(item.isOpen?'20rem':'4rem')}}
                    placeholder="Inserir Comentário"
                  />  

                  <p className="activityUserCreate">
                    <span className="label">Criado por:&nbsp;</span>
                    <span className="text"> 
                      {item.userInclude}
                    </span>
                  </p>
                  
                  <br /> 

                  {item.updating && (
                    <button               
                      type='button' 
                      className="buttonLinkClick buttonRight" 
                      title="Clique para cancelar a edição"
                      onClick={() => CancelEdit(item.id)}
                    >
                      <MdBlock />
                      Cancelar
                    </button> 
                  )}

                  {!item.updating && (
                    <button               
                      type='button' 
                      className="buttonLinkClick buttonRight" 
                      onClick={() => DeleteActivity(item.id)}
                      title='Cancelar Atividade'
                    >
                      
                      {!item.deleting && <BiTrash /> } 
                      {!item.deleting && <span>Excluir</span>} 
                      
                      {item.deleting && <BiLoader /> }
                      {item.deleting && <span>Deletando..</span>} 

                    </button>   
                )}

                  {!item.updating && (
                    <>
                      <button               
                        type='button' 
                        className="buttonLinkClick buttonRight" 
                        title="Clique para editar esta atividade"
                        onClick={() => EditActivity(item.id)}
                      >
                        <BiEditAlt />
                        Editar
                      </button> 

                      <button               
                        type='button' 
                        className="buttonLinkClick buttonRight" 
                        title="Clique para editar esta atividade"
                        onClick={() => OpenTextArea(item.id)}
                      >
                        , 
                        {!item.isOpen && <AiOutlineAlignCenter /> } 
                        {!item.isOpen && <span>Ver mais...</span>} 

                        {item.isOpen && <AiOutlineClose /> }
                        {item.isOpen && <span>Ver menos...</span>}                         

                      </button> 
                    </>
                  )}

                  {item.updating && (
                    <>
                      <button               
                        type='button' 
                        className="buttonLinkClick buttonRight" 
                        title="Clique para salvar esta atividade"
                        onClick={() => SaveEditActivityList(item)}
                      >

                        {item.id != id && <BiSave /> } 
                        {item.id != id && <span>Salvar</span>} 
                        
                        {item.id === id && <BiLoader /> }
                        {item.id === id && <span>Salvando..</span>} 

                      </button> 
                      
                    </>
                  )}
                  
                  <br /> 
                </>
              )

            })}

          </ActivityItem>

        </section>

      </label>    
    
    </Container>

  )
}
 
export default BusinessActivity;
