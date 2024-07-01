/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import { MdEventAvailable } from 'react-icons/md';
import { FaTasks } from 'react-icons/fa';
import api from 'services/api';
import { useModal } from 'context/modal';
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { FormatDate } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useLocation } from 'react-router-dom';
import { IBusinessEventsData } from '../../Interfaces/IBusiness';
import { EventsItem, Container, Content } from './styles';

const BusinessEvents = (props) => {
  const { customerName } = props.callbackFunction
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [listEvents, setListEvents] = useState<IBusinessEventsData[]>([])
  const { isOpenModal, handleJsonModalObjectResult, handleModalActive, modalActive, handleCaptureTextPublication } = useModal();
  const { addToast } = useToast();
  const [ currentId, setCurrentId] = useState<number>(0)
  const { isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [checkMessage, setCheckMessage] = useState(false)
  const [businessId, setBusinessId] = useState<number>(0)
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {    
    
    const businessId = Number(pathname.substr(24))
    setBusinessId(businessId)   

  },[isLoading])


  useEffect(() => {    

    if (!modalActive && !isLoading) {
      LoadEvents();
    }  

  },[modalActive])

  useEffect(() => {    

    if (isLoading && businessId > 0) {
      LoadEvents();
    }  

  },[businessId, isLoading])

  const LoadEvents = useCallback(async () => {

      const response = await api.get<IBusinessEventsData[]>('NegocioAtividade/ListarEventos', { 
        params: {
          businessId,
          filterClause:"",
          token
        }
      })
      
      setListEvents(response.data)
      
      setIsLoading(false)

  },[isLoading, businessId])
  
  const handleOpenAppointment = async (appointmentId:string) => {

    try {               
      
        if (businessId === 0){

          addToast({
            type: "info",
            title: "Operação não realizada",
            description: "É necessário salvar esta nova oportunidade de negócio antes de incluir um compromisso"
          })
          
          return false;
        }        

        handleJsonModalObjectResult(JSON.stringify({businessId}));

        isOpenModal(appointmentId)

        handleCaptureTextPublication(customerName)

        // handleModalActive(true)

        // handleJsonModalObjectResult(JSON.stringify({businessId}));

    }
    catch (err) {
      console.log('Houve um erro ao abrir o cadastro de compromisso, tente novamente') 
    }
  }

  // when appear confirm box to delete and is clicked on cancel
  useEffect(() => {
  
    if (isCancelMessage){
      handleCancelMessage(false)
      setCheckMessage(false)
    }

  }, [isCancelMessage])   
  
    // when appear confirm box to delete and is clicked on confirm
    useEffect(() => {
    
    if (isConfirmMessage && caller === 'businessAppointment'){
      DeleteAppointment(currentId)
      setCheckMessage(false)
      handleConfirmMessage(false)
      handleCaller('')
    }

  }, [isConfirmMessage, currentId])   
  
  const handleDeleteAppointment = (appointmentId: number, blockDelete:boolean) => {
    
    if (blockDelete) {

      addToast({
        type: 'info',
        title: 'Operação Não realizada',
        description:'O seu usuário não possuí permissão necessária para efetuar esta exclusão',
      });

      return false;
    }

    setCheckMessage(true)
    setCurrentId(appointmentId)
  }

  const DeleteAppointment = async (appointmentId: number) => {
    try {

      await api.post(`/Compromisso/Deletar`, {
        eventId: appointmentId,
        token
      });
      
      LoadEvents();
      setCurrentId(0)      

      addToast({
        type: 'success',
        title: 'Operação realizada com sucesso',
        description:'O Compromisso foi removido com sucesso da oportunidade de negócio',
      });

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Falha ao deletar o compromisso',
        description:'Não foi possivel deletar seu comprimisso, tente novamente!',
      });
    }
  }
  
  return (
    
    <Container>
      
      { checkMessage && (
        <ConfirmBoxModal
          title="Exclusão do compromisso"
          caller="businessAppointment"
          message="O compromisso relacionado a esta oportunidade será removido, deseja continuar ?"
        />
      )}

      &nbsp;
      <FaTasks size={15} />
        &nbsp;Compromissos
      <section>           
      
        <div>
          <button               
            type='button' 
            onClick={() => handleOpenAppointment('0')}
            className="buttonLinkClick" 
            title='Incluir novo compromisso'
          >
            <MdEventAvailable />
            Adicionar novo
          </button> 
          
        </div>
                  
        <br />     

        <Content>

          {listEvents.map(item => {
              
              return (
                
                <EventsItem 
                  color={item.subjectColor}                   
                  status={item.status}
                >

                  <p>
                    <label>Assunto:</label>
                    { item.subjectDescription }
                  </p>
                  <p>
                    <label>Periodo de:</label>
                    {`${  FormatDate(new Date(item.startDate), 'dd/MM/yyyy HH:mm') } a ${  FormatDate(new Date(item.endDate), 'dd/MM/yyyy HH:mm')}`}
                  </p>
                  <p>
                    <label>Descrição:</label>
                    {item.description}
                  </p>
                  
                  <div className='buttons'>

                    <button               
                      type='button' 
                      className="buttonLinkClick buttonRight" 
                      onClick={() => handleOpenAppointment(item.id.toString())}
                      title='Editar Compromisso'
                    >
                      <BiEditAlt />
                      Editar
                    </button>   

                    
                    <button               
                      type='button' 
                      className="buttonLinkClick buttonRight" 
                      onClick={() => handleDeleteAppointment(item.id, item.blockDelete)}
                      title='Excluir Compromisso'
                    >
                      <BiTrash />
                      Excluir
                    </button>   
                    

                  </div>

                </EventsItem>
              )
              
          })}

          {listEvents.length == 0  && (
            <div className="messageEmpty">
              Nenhum compromisso foi criado para este negócio
            </div>
          )}

        </Content>

      </section>
    
    </Container>

  )
}
 
export default BusinessEvents;
