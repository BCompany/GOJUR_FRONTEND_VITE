/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle, FaUserSlash } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import { ModalCancelPlan } from './styles';


const CustomerCancelPlanModalEdit = (props) => {
  const { CloseCancelPlanModal, companyId, pathname, handleClickCloseModal} = props.callbackFunction
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [cancelPlanDta, setCancelPlanDta] = useState<string>("");


  const CancelPlan = useCallback(async() => {
    try {
      const customerId = pathname.substr(24)
      setIsLoading(true)
      await api.post('/CustomBCO_ID1/ConfiguracaoCliente/ClienteCancelarPlano', {
        companyId,
        customerId,
        cancelDate: cancelPlanDta,
        token,

      })

      addToast({
        type: "success",
        title: "Operação Concluída",
        description: "O plano do cliente foi cancelado ou agendado com sucesso."
      })

      CloseCancelPlanModal();
      setIsLoading(false)
      
    } catch (err:any) {
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha no cancelamento ou no agendamento no plano do cliente.",
        description:  err.response.data.Message
      })
    }
  },[cancelPlanDta]);


  return (
    <>
      
      <ModalCancelPlan show>

        <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
          Cancelar Plano

          <br />
          <br />

          <div>
            <label htmlFor="dataCancelamento">
              Data de Cancelamento
              <input 
                type="date"
                style={{backgroundColor:"white"}}
                value={cancelPlanDta}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCancelPlanDta(e.target.value)}
              />
            </label>
          </div>

          <br />

          <p>*Ao deixar a data em branco o cancelamento ocorre imediatamente.</p>
          
          <br />
          <br />

          <div style={{float:'left', marginRight:'12px'}}>

            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> CancelPlan()}
                style={{width:'145x'}}
              >
                <FaUserSlash />
                Cancelar Plano
              </button>
            </div>
           
               
            <div style={{float:'left', width:'100px', marginLeft:"60px"}}>
              <button 
                type='button'
                className="buttonClick"
                style={{width:'145px'}}
                onClick={handleClickCloseModal}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
    
        </div>
      </ModalCancelPlan>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}  
     
    </>
    
  )
  

}
export default CustomerCancelPlanModalEdit;
