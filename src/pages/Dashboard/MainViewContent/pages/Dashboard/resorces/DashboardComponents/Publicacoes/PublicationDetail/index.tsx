/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect } from 'react';
import { usePublication } from 'context/publication';
import { FiX } from 'react-icons/fi';
import { Container, ModalContent, Field, Date, Description } from './styles';

interface ModalProps {
  handleDetails?: boolean;
  handleCloseDetails?: any;
}

const PublicationDetail: React.FC<ModalProps> = ({ handleDetails, handleCloseDetails, children }) => {
  const { data } = usePublication();

  if (!data) {
    return <p>...careggando</p>;
  }

  const publication = data.publicationDate.substring(0, 10).split('-');
  const publicationDate = `${publication[2]}/${publication[1]}/${publication[0]}`;
  const release = data.releaseDate.substring(0, 10).split('-');
  const releaseDate = `${release[2]}/${release[1]}/${release[0]}`;

  const handleRedirectMatter = (matterId: number) => {
    const url = `/matter/edit/legal/${matterId}`;
    window.location.href = url;
  }

  return (
    <Container>
      <ModalContent
        styles={data.withMatter}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ opacity: 0.5, scale: 2, duration: 1.5 }}
      >
        <header>
          <FiX onClick={handleCloseDetails} style={{cursor:'pointer'}} />
        </header>
        <div>
          <Field>
            <h2>Processo:</h2>
            {data.matterId > 0 && (
              <span
                style={{fontSize:'0.85rem', color:'var(--blue-twitter)', cursor:'pointer'}}
                onClick={() => handleRedirectMatter(Number(data.matterId))}
              >
                &nbsp;&nbsp;&nbsp;{data.matterNumber}
              </span>
            )}

            {data.matterId == 0 &&
              <p>{data.matterNumber}</p>
            }

          </Field>
          <Date>
            <h2>Publicação:</h2>

            <p>{publicationDate}</p>
            <h2 id="release">Divulgação:</h2>
            <p>{releaseDate}</p>
          </Date>
          {data.judicialAction !== null && (
            <Field>
              <h2>Ação:</h2>
              <p>{data.judicialAction}</p>
            </Field>
          )}

          {data.matterParts !== null ? (
            <Field>
              <h2>Partes:</h2>
              <p>{data.matterParts}</p>
            </Field>
          ) : null}

          <Field>
            <h2>Nome:</h2>
            <p>{data.customerName}</p>
          </Field>
          <Description>
            <h2>Descrição:</h2>
            <p dangerouslySetInnerHTML={{ __html: data.description }} />
          </Description>
        </div>
      </ModalContent>
    </Container>
  );
};

export default PublicationDetail;
