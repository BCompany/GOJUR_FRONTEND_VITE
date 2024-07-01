/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import Loader from 'react-spinners/ClipLoader';
import { GoLinkExternal } from 'react-icons/go';
import { BiSearch } from 'react-icons/bi'
import { FaRegTimesCircle } from 'react-icons/fa';
import { IMatterCourtLink } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { useToast } from 'context/toast';
import { Container } from './styles';
import { ListarCourtLinks } from '../../Services/MatterFollowData';

export const ModalCourtLinks = (props) => {

  const { matterId, handleShowModalLink, handleAssociateLink } = props.values;
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filterClause, setFilterClause] = useState<string>('')
  const [courtLink, setCourtLink] = useState<IMatterCourtLink[]>([])

  useEffect(() => {

    if (isLoading) {
      ListCourtLinks();
    }

  }, [isLoading])

  const ListCourtLinks = useCallback(async () => {

    const term = filterClause.length == 0? `cod_Processo=${  matterId}`: filterClause;
    const response = await ListarCourtLinks(1, 50, term)

    console.clear()
    console.log(response.data)
    setCourtLink(response.data)
    setIsLoading(false)

  }, [filterClause])

  const handleChangeTermSearch = (e) => {
    setFilterClause(e.target.value)
  }

  const handleAssociate = (forumLinkId: number) => {

    const court = courtLink.find(item => item.forumLinkCourtId == forumLinkId)
    if (court){
      handleAssociateLink(court.url)
      handleShowModalLink()
    }

  }

  if (isLoading){

    return (
      <>
        <div className='waitingMessage'>
          <Loader size={15} color="var(--blue-twitter)" />
        </div>
      </>
      )
  }

  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content-medium"
    >

      <Container>

        <header>
          Links dos tribunais

          <label>
          &nbsp;
            <input
              type='text'
              placeholder="Procurar Link de Fórum"
              onChange={handleChangeTermSearch}
            />
            <BiSearch style={{marginLeft:'96%'}} onClick={() => ListCourtLinks()} />
          </label>

        </header>

        <div>

          {courtLink.map((link) => {
            return (
              <div style={{borderBottom: '1px solid var(--blue-soft', padding:'10px', marginBottom: '10px'}}>
                <p style={{fontWeight: 500}}>{`${link.uf  } ${  link.forumLinkCourtLink}`}</p>
                <p
                  title={link.url}
                >
                  {`${link.url.substring(0,70)  } ...`}

                  <button
                    type='button'
                    className='buttonLinkClick'
                    onClick={() => handleAssociate(link.forumLinkCourtId)}
                  >
                    &nbsp;&nbsp;Associar
                    &nbsp;
                    <GoLinkExternal />
                  </button>
                </p>
              </div>
            )
          })}

        </div>

      </Container>

      <br />

      <footer style={{marginLeft:'16rem'}}>
        <button
          type='button'
          onClick={handleShowModalLink}
          className='buttonClick'
        >
          <FaRegTimesCircle />
          Fechar
        </button>

      </footer>

    </Modal>

  )

}
