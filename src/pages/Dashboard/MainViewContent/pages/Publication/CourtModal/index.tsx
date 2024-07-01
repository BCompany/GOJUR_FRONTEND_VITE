/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import api from 'services/api';
import { FiX } from 'react-icons/fi';
import { ISelectData, ICourt } from '../Interfaces/IEletronicIntimation';
import { Modal, ProfileTable } from './styles';

interface CoveragesDTO {
  name: string;
  uf: string
}

const CourtModal = (props) => {
  const {CloseCourtModal} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const [coveragesList , setCoveragesList] = useState<CoveragesDTO[]>([]);

  useEffect(() => {
    async function LoadCoverages() {
      try {
        const response = await api.get<CoveragesDTO[]>('/Abrangencias/ListarIntimacoesEletronicaDisponiveis', {
          params:{
            token
          }
        });

        setCoveragesList(response.data)
      } catch (err) {
        console.log(err);
      }
    }
    LoadCoverages()
  },[])

  const CloseModal = () => {
    CloseCourtModal()
  }

  return(
    <>
      <Modal show>

        <div className='header'>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Tribunais disponíveis
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModal()} />
          </div>
        </div>

        <br />
        <br />

        <div style={{marginLeft:'3%'}}>
          <div className="flex-box container-box">
            <div className="content-box">
              <ProfileTable>
                <table>
                  <tr>
                    <th style={{width:'85%'}}>Diário</th>
                    <th style={{width:'15%'}}>Estado</th>
                  </tr>
                  {coveragesList.map(item =>(
                    <tr>
                      <td style={{width:'85%', textAlign:'left'}}>{item.name}</td>
                      <td style={{width:'15%'}}>{item.uf}</td>
                    </tr>
                  ))}
                </table>
              </ProfileTable>
            </div>
          </div>
        </div>

      </Modal>
    </>
  );


};
  
export default CourtModal;