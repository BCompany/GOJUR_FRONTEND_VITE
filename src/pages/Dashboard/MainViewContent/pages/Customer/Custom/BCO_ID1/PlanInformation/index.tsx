/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React from 'react';
import { format } from 'date-fns';
import { FiFileText } from 'react-icons/fi';
import { BsGear } from 'react-icons/bs';
import { envProvider } from 'services/hooks/useEnv';
import { useHistory } from 'react-router-dom';
import { ICustomerData, ICustomInfos } from '../../../Interfaces/ICustomerList';
import { Container } from './styles';

const PlanInformation = ( props ) => {
  
  const custom = props.customItem as ICustomInfos
  const headerButtons = props.headerButtons as boolean
  const customer = props.customer as ICustomerData
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();

  if (custom == undefined) {
    return null
  }

  // render only buttons on header of each card customer
  if (headerButtons === true) {
    return (
      <>
        <button
          type="button"
          title='Publicações x Nomes'
          onClick={() => window.open(`/custom/BCO01PublicationNames/${customer.cod_Cliente}`)} 
        >
          <FiFileText />
        </button>

        <button
          type="button"
          title='Configurações do cliente'
          onClick={() => window.open(`/customer/configuration/${customer.cod_Cliente}`)}          
        >
          <BsGear />
        </button>
      </>      
    )
  }
  
  return (
    
    <Container>
                      
      <section>
        <article>
          <b>Status:</b>
          <span style={{ color: `${custom.status}`.includes('CANC') ? '#f44336': "#131513"}}>{custom.status}</span> 
        </article>        

        <article>
          <b>Plano:</b> 
          {custom.customerPlan}
        </article>        
      </section>  

      <section>
        <article>
          <b>Processos:</b>
          {custom.matterQtty}
          /
          {custom.matterCourtImportQtty}
        </article> 

        <article>
          <b>Monitor (Plano / Em Uso):</b>
          {custom.robotInPlan}
          /
          {custom.robotInUse}
        </article> 
      </section>   

      <section>
        <article>
          <b>Ultima Operação:</b>
          {custom.lastAccessDate != null && format(new Date(custom.lastAccessDate??""), 'dd/MM/yyyy HH:mm')}
        </article> 
      </section>
                                
    </Container>
  )
}

export default PlanInformation;