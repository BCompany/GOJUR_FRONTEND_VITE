import React, { useEffect, useState } from 'react';
import {useHistory  } from 'react-router-dom'
import { FiEdit,FiTrash } from 'react-icons/fi';
import { format } from 'date-fns';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import api from 'services/api';
import { useToast } from 'context/toast';
import { useCustomer } from 'context/customer';
import { FormatCurrency } from 'Shared/utils/commonFunctions';
import { Container } from './styles';

export default function BussinessList( props ) {
  const history = useHistory();
  const { addToast } = useToast();
  const {isConfirmMessage,handleCaller, caller, isCancelMessage, handleCancelMessage,handleConfirmMessage } = useConfirmBox();
  const [checkMessage, setCheckMessage] = useState(false)
  const [businessDataCurrentId, setBusinessDataCurrentId] = useState('')
  const { handleReloadBusinesCard } = useCustomer(); 
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
  
    if (isCancelMessage){  
      setCheckMessage(false)
      handleCancelMessage(false)
      setBusinessDataCurrentId('')
    }  
  }, [isCancelMessage])   
  
  useEffect(() => {
    
    if (isConfirmMessage && caller == 'CRM'){
      handleDelete(businessDataCurrentId)
      setCheckMessage(false)
      handleConfirmMessage(false)
      handleCaller('')
    }
  }, [isConfirmMessage, businessDataCurrentId])   

  const handleEdit = (id:string, customerId: string) =>{

    localStorage.setItem('@GoJur:businessCustomerId', customerId)
    history.push(`/customer/business/edit/${id}`)
  }

  const handleDeleteCheck  = async (id:string) =>{
    setCheckMessage(true)
    setBusinessDataCurrentId(id)
  }  

  const handleDelete  = async (id:string) =>{
    try {

      if (id == ""){
        return false
      }
      
      await api.delete('/NegocioCliente/Deletar', {
        params:{
          id,
          token
        }
      })

      addToast({
        type: "success",
        title: "Negócio Deletado",
        description: "O negócio vinculado ao cliente foi deletado do catálogo"
      })
      
      handleReloadBusinesCard(true)

    } catch (err) {
      addToast({
        type: "info",
        title: "Falha ao deletar o registro",
        description:  "Houve uma falha ao deletar este registro"
      })
    }
  };
  
  return (

    <Container>
      
      { checkMessage && (
        <ConfirmBoxModal
          buttonCancelText="Cancelar"
          buttonOkText="Confirmar"
          caller="CRM"
          useCheckBoxConfirm
          message="Confirma a exclusão desta oportunidade de negocio ?"
        />
      )}

      {/* <header style={{backgroundColor:headerColor}}> */}
      <header>
        <button 
          title='Clique para editar o negócio' 
          type='button' 
          onClick={() => handleEdit(props.item.id, props.item.customerId)} 
        >
          <FiEdit />                      
        </button>                    

        <button 
          title='Clique para excluir o negócio' 
          type='button'
          onClick={()=> handleDeleteCheck(props.item.id)}
        >
          <FiTrash />                      
        </button>                    
      </header>   

      <div>

        <section>

          <article>
            <p>
              <b>Descrição:</b>
              {props.item.description} 
            </p>
          </article>

        </section>

        <section>

          <article>
            <p>
              <b>Posição:</b>
              {props.item.nomSalesFunnel} 
              {' - '}
              <span>
                {props.item.nomSalesFunnelStep}
                {' '}
              </span>
            </p>
          </article>

        </section>

        <section>

          <article>
            <p>
              <b>Valor:</b>
              {FormatCurrency.format(props.item.businessValue)} 
            </p>
          </article>

        </section>

        <section>

          <article>
            <p>
              <b>Início:</b>
              {format(new Date(props.item.startDate), 'dd/MM/yyyy')}
            </p>
          </article>

        </section>

        <section>

          <article>
            <p>
              <b>Encerramento:</b>
              {props.item.finishDate != undefined && format(new Date(props.item.finishDate), 'dd/MM/yyyy')}
            </p>
          </article>

        </section>

        <section>

          <article>
            <p>
              <b>Responsável:</b>
              {props.item.nomUserResponsible} 
            </p>
          </article>

        </section>

        <section>

          <article>
            <p>
              <b>Status:</b>
              <span style={{color:props.item.statusColor}}>{props.item.statusComplete}</span>
            </p>
          </article>

        </section>
       
      </div>

    </Container>
  )

}
