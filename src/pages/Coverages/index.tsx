/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useState, useEffect, } from 'react';
import api from 'services/api';
import { Container, ProfileTable, Center } from './styles';
  
interface CoveragesDTO {
  name: string;
  uf: string;
  processingStatus: string;
}

const Coverages: React.FC = () => {
  const [coveragesList , setCoveragesList] = useState<CoveragesDTO[]>([]);


  useEffect(() => {
    async function LoadCoverages() {
      try {
        const response = await api.post<CoveragesDTO[]>('/Abrangencias/Listar', {
        });

        setCoveragesList(response.data)
      }
      catch (err) {
        console.log(err);
      }
    }

    LoadCoverages()
  }, [])
  

  return (
    <>   
      <Container>
        <Center>
          <div className="flex-box container-box">
            <div className="content-box">
              <img src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png" alt="logo" />
            </div>
          </div>

          <br />
          <br />

          <div className="flex-box container-box">
            <div className="content-box">
              <p>
                <b>Aviso: </b>
                A pesquisa de publicação no GOJUR é realizada de acordo com a abrangência contratada para cada termo/nome do cliente.
                A pesquisa de cada nome pode ser contratada para um ou mais estados ou ainda Brasil todo.
                Em caso de dúvidas sobre o seu perfil verifique com seu consultor sua abrangência.
                <br />
                <br />
                Abaixo segue lista com os diários contemplados em cada estado.
                <br />
                <br />
                <br />
              </p>
            </div>
          </div>

          <div className="flex-box container-box">
            <div className="content-box">
              <ProfileTable>
                <table>
                  <tr>
                    <th style={{width:'65%'}}>Diário</th>
                    <th style={{width:'10%'}}>Estado</th>
                    <th style={{width:'25%'}}>Status</th>
                  </tr>
                  {coveragesList.map(item =>(
                    <tr>
                      <td style={{width:'65%', textAlign:'left'}}>{item.name}</td>
                      <td style={{width:'10%'}}>{item.uf}</td>
                      <td style={{width:'25%'}}>{item.processingStatus}</td>
                    </tr>
                  ))}
                </table>
              </ProfileTable>
            </div>
          </div>
        </Center>

        <br />
        <br />
        <br />
      </Container>
    </>
  );
}

export default Coverages;