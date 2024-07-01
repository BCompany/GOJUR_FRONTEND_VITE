/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import {MdBlock} from 'react-icons/md';
import {BiSave} from 'react-icons/bi';
import { FcAbout } from 'react-icons/fc';
import { useConfirmBox } from 'context/confirmBox';
import api from 'services/api';
import Select from 'react-select'
import Modal from 'react-modal';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { IParameterData } from '../Interfaces/IMatter';
import { Container } from './styles';

const MatterParameters: React.FC = () => {

  const { handleCancelMessage, handleCaller } = useConfirmBox(); 
  const [parameterValue, setParameterValue] = useState<string>('R')
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    GetParameterValue();

  },[])

  const GetParameterValue = useCallback(async () => {
     
    try
    {
      const response = await api.post<IParameterData[]>('/Parametro/Selecionar', {
        token,
        parametersName: '#MTRPARAMETER',
        parameterValue
      })

      if (response.data.length > 0)
        setParameterValue(response.data[0].parameterValue)
    }
    catch{
      setParameterValue('T')
    }

  },[parameterValue, token])

  const handleSave = useCallback(async () => {
    
    await api.post('/Parametro/Salvar', {
      token,
      parametersName: '#MTRPARAMETER',
      parameterType: 'P',
      parameterValue
    })

    handleCloseModal();

  },[parameterValue])
  
  const handleCloseModal = () => {

    handleCaller('matterParameters')
    handleCancelMessage(true)
  }

  const optionsParameter = [
    {
      id: 'T',
      label: 'Todos',
    },
    {
      id: 'R',
      label: 'Responsável',
    },
  ];

  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
    
      <Container>

        <h1>Parâmetros do Processo</h1>

        <AutoCompleteSelect>
          <p>
            Receber alertas do processo ?
            {' '}
            <FcAbout title='Este parâmetro indica se você quer receber alertas de todos os processos ou somente dos processos que é responsável' />
          </p>
          <Select
            isSearchable   
            isClearable
            placeholder="Selecione um modelo de documento"
            value={optionsParameter.filter(item => item.id == parameterValue)}   
            onChange={(item) => setParameterValue(item? item.id: 'T')}
            loadingMessage={loadingMessage}
            noOptionsMessage={noOptionsMessage}
            styles={selectStyles}         
            options={optionsParameter}
          />
        </AutoCompleteSelect>
          
        <br />
          
        <footer>

          <button 
            className="buttonClick" 
            type="button"
            onClick={handleSave}
            title="Clique para salvar o parâmetro"
          >
            <BiSave />
            Salvar            
          </button>   

          <button 
            className="buttonClick" 
            type="button"
            onClick={handleCloseModal}
            title="Clique para retornar a listagem de processos"
          >
            <MdBlock />
            Fechar            
          </button>  
          
        </footer>

      </Container>
      
    </Modal>

  )
}

export default MatterParameters