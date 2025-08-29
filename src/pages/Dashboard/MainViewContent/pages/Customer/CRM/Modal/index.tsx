/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import api from 'services/api';
import { FaRegTimesCircle } from 'react-icons/fa';
import BussinessList from '../../Business/List';
import { MatterCRMModalStyle, ListCards, Card } from './styles';


export interface IBusinessData {
  id: number;
  customerId: number;
  companyId: number;
  salesFunnelId: number;
  responsibleUserId: number;
  description: number;
  startDate: number;
  finishDate: number;
  status: number;
  totalLines: number;
}

const MatterCRMModal = (props) => {
  const {CloseMatterCRMModal, matterSelectedId} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const [businessList , setBusinessList] = useState<IBusinessData[]>([]);


  useEffect(() => {
    if (matterSelectedId != 0){
      LoadCRMByMatter(matterSelectedId)
    }
  }, [])


  const HandleCloseMatterCRMModal = async () => {
    localStorage.removeItem('@Gojur:matterRedirect')
    CloseMatterCRMModal()
  }


  const LoadCRMByMatter = async (matterSelectedId) => {
    localStorage.setItem('@Gojur:matterRedirect', 'S')
    const response = await api.get<IBusinessData[]>('/NegocioCliente/ListarPorProcesso', {
      params: { matterId: matterSelectedId, token }
    })

    setBusinessList(response.data)

    console.log(response.data)

  }


  return (
    <MatterCRMModalStyle show>
      <div className='header'>
        <p className='headerLabel'>CRM Processo</p>
      </div>

      {matterSelectedId != 0 && (
        <>
          <ListCards id='ListCards'>
            {businessList.map(business => (
              <Card id='Card'>
                <BussinessList item={business} />
              </Card>
            ))}
          </ListCards>
        </>  
      )}

      {matterSelectedId == 0 && (
        <div id='Centered' className='centered'>
          Você ainda não tem um registro de CRM associado a este processo / cliente. <br /><br />
          Para criar um registro do CRM acesse o modulo de cliente e clique no ícone Negócios. <br /><br />
          Você pode gerenciar todo a jornada de negociação com seu cliente até o fechamento através do nosso CRM.
        </div>
      )}

      <div id='Footer' className='footer'>
        <div style={{marginTop:"1%", float:"right", marginRight:"3%"}}>            
          <div style={{float:'left', width:'100px'}}>
            <button type='button' className="buttonClick" style={{width:'100px'}} onClick={() => HandleCloseMatterCRMModal()}>
              <FaRegTimesCircle />
              Fechar
            </button>
          </div>
        </div>
      </div>

    </MatterCRMModalStyle>
  )
}

export default MatterCRMModal;