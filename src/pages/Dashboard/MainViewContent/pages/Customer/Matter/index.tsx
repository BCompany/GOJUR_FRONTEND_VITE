/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useState, useEffect } from 'react';
import {useLocation  } from 'react-router-dom';
import { format } from 'date-fns';
import {  FaFolderOpen } from 'react-icons/fa';
import { AiOutlineAlignCenter, AiOutlineClose } from 'react-icons/ai';
import api from 'services/api';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/PulseLoader';
import { useMatter } from 'context/matter';
import { useHistory } from 'react-router-dom';
import { IFollowsData, IMatterData } from '../Interfaces/IMatterList';

const MatterCard: React.FC<any> = ( props: any ) => {

  const matter = props.matterItem as IMatterData;
  const { pathname  } = useLocation();
  const [followList , setFollowList] = useState<IFollowsData[]>([]);
  const [isLoading , setIsLoading] = useState<boolean>(false);
  const [page , setPage] = useState<number>(1);
  const { isOpenCardBox, handleOpenCardBox, handleMatterReferenceId, matterReferenceId } = useMatter();
  const tokenapi = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const { addToast } = useToast();

  const handleRedirectMatter = () => {
    // Advisory matter
    if (matter.judicialAction == null)
    {
      const url = `/matter/edit/advisory/${matter.matterId}`
      history.push(url)
    }
    // Legal matter
    else
    {
      const url = `/matter/edit/legal/${matter.matterId}`
      history.push(url)
    }
  }


  const handleMoreFollows = async () => {
    if (matter)
    {
      setIsLoading(true)
        
      try 
      {
        const rows = followList.length === 0? 1: followList.length + (matter.dateLastUpdate != null? 1:0);
           
        const response = await api.get<IFollowsData[]>('/ProcessoAcompanhamento/ListarAcompanhamentos', {
          params:{ matterId: matter.matterId, count: rows, filter: 'all', token: tokenapi }
        });

        handleOpenCardBox(true)
        handleMatterReferenceId(matter.matterId)

        // remove last follows to avoid uplication
        if (response.data.length > 0){          
          const matterListFollows = response.data.filter(item => (item.description??"").toLowerCase() != (matter.desLastFollow??"").toLowerCase())
          setFollowList([...followList, ...matterListFollows])
          
          setPage(page + 1)
        }
        else
        {
          addToast({ type: 'info', title: 'Não há registros', description: `Não foram encontrados novos andamentos para exibição` }); 
        }

        setIsLoading(false)
      } 
      catch (err) {
        setIsLoading(false)   
        console.log(err);
      }
    }
  }


  return (
    <>
      <header>

        {matter.matterNumber} 
        <button 
          title='Clique para abrir o processo'
          type='button'
          onClick={() => handleRedirectMatter()}
        >
          <FaFolderOpen />                      
        </button>                    
      </header>   

      <section>

        <label style={{fontSize:'13px'}} htmlFor="folder">
          <span>Nº Pasta:</span>
          <span>{matter.matterFolder}</span>
        </label>

        <label style={{fontSize:'13px'}} htmlFor="parts">
          <span>Partes:</span>
          <span>
            {matter.matterCustomerDesc}
            {' X '}
            {matter.matterOppossingDesc}
          </span>
        </label>

        <label style={{fontSize:'13px'}} htmlFor="action">
          <span>Ação Judicial:</span>
          <span>{matter.judicialAction}</span>
        </label>

        <label style={{fontSize:'13px'}} htmlFor="court">
          <span>Forum:</span>
          <span>{matter.forumName}</span>
        </label>

        {matter.followList.length > 0 && (
          <>
            <label className='matterFollowBox' htmlFor="court">
              
              <div className='matterFollowDiv'>

                <span style={{fontWeight:600}}>Último Andamento:&nbsp;</span>
                <span>{format(new Date(matter.followList[0].date), 'dd/MM/yyyy')}</span>

                <span style={{fontWeight:600}}> - Tipo: &nbsp;</span>
                <span>{matter.followList[0].typeFollowDescription}</span>

                <span style={{fontWeight:600}}> - Incluído por: &nbsp;</span>
                <span>{matter.followList[0].userIncludeName}</span>

                {matter.followList[0].userEditName != "" && (
                  <>
                    <span style={{fontWeight:600}}> - Alterado por: &nbsp;</span>
                    <span>{matter.followList[0].userEditName}</span>
                  </>
                )}

                <br />
                <span style={{fontWeight:600}}>Descrição: &nbsp;</span>
                <span>{matter.followList[0].description}</span>
              </div>
            </label>
            <br />
          </>
        )}
      
        
        {followList.length > 0 && (followList.map(follow => (
          <>
            <label className='matterFollowBox' htmlFor="action">
              <div className='matterFollowDiv'>
                <span style={{fontWeight:600}}>Data: &nbsp;</span>
                <span>{format(new Date(follow.date), 'dd/MM/yyyy')}</span>

                <span style={{fontWeight:600}}> - Tipo: &nbsp;</span>
                <span>{follow.typeFollowDescription}</span>

                <span style={{fontWeight:600}}> - Incluído por: &nbsp;</span>
                <span>{follow.userIncludeName}</span>

                {follow.userEditName != "" && (
                  <>
                    <span style={{fontWeight:600}}> - Alterado por: &nbsp;</span>
                    <span>{follow.userEditName}</span>
                  </>
                )}

                <br />
                <span style={{fontWeight:600}}>Descrição: &nbsp;</span>
                <span>{follow.description}</span>
              </div>
            </label>
            <br />
          </>
          ))
        )}
        
        {matter.followList.length > 0 && (
          <label>  
            <div className='footer'>
              <button               
                type='button' 
                className="buttonLinkClick" 
                onClick={() => handleMoreFollows()} 
                title='Ver mais acompanhamentos'
              >
                <AiOutlineAlignCenter />
                Ver Mais
              </button>

              {/* {(isOpenCardBox && matterReferenceId === matter.matterId) && (                                  
                <button 
                  type='button' 
                  className="buttonLinkClick" 
                  onClick={(e) => {handleOpenCardBox(false); e.preventDefault()}} 
                  title='Diminuir tamanho para o original'
                >                        
                  <AiOutlineClose />
                  Diminuir Tamanho
                </button>  
              )} */}
            </div>

            {isLoading && (
              <div className='progress'>
                <Loader size={5} color="var(--blue-twitter)" />
              </div>
            )}
          </label>
        )}
    
      </section>
    </>
   
  )
}

export default MatterCard;