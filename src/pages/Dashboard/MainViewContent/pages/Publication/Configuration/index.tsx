/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import api from 'services/api';
import { selectStyles, useDelay, currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import Select from 'react-select';
import { BiSave } from 'react-icons/bi';
import { FiArrowLeft } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import PublicationNames from '../Name';
import PublicationEmail from '../Email';
import { Container, Content, OverlayPublicationConfiguration } from './styles';

export interface IParameterData {
  parameterId: number;
  parameterName: string;
  parameterValue: string;
  message: string;
}

const PublicationConfiguration = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visualizationType, setVisualizationType] = useState('CN');

  const visualizationTypeList = [
    { id:'CN', label: 'Central de Notificações' },
    { id:'PU', label: 'Publicações' },
    { id:'ME', label: 'Acompanhamentos Processuais' }
  ]


  useEffect(() => {
    GetParameterValue()
  }, [])


  const GetParameterValue = async () => {
    try
    {
      setIsLoading(true)
      const response = await api.post<IParameterData[]>('/Parametro/Selecionar', { token, parametersName: '#NOTIFCENTER' })

      setVisualizationType(response.data[0].parameterValue)
      setIsLoading(false)
    }
    catch(err:any){
      setIsLoading(false)
      console.log(err.response.data.Message)
    }
  }


  const ChangeVisualizationType = (item) => {
    if (item)
      setVisualizationType(item.id)
    else
      setVisualizationType('')
  }


  const SaveVisualizationType = useCallback(async () => {
    try
    {
      setIsLoading(true);
      await api.post<boolean>("/Parametro/Salvar", { parametersName: '#NOTIFCENTER', parameterType: 'P', parameterValue: visualizationType, token });
      setIsLoading(false);
    }
    catch (err:any)
    {
      setIsLoading(false);
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data.Message });
    }
  }, [visualizationType])


  return (
    <>
      <Container id='Container'>
        <HeaderPage />

        <div style={{width:'99%'}}>
          <div style={{float:'right', marginRight:'-10px'}}>
            <button type="submit" className="buttonClick" title="Clique para retornar a lista de publicações" onClick={() => history.push(`/publication`)}>
              <FiArrowLeft />
              Retornar
            </button>
          </div>
        </div>

        <Content id='Content'>
          <div className='headerText'>Configurações do Módulo</div>

          <div id='BoxConfiguration' className='box'>
            <div className='boxText'>Tipo de visualização</div>
            <div>
              O tipo selecionado define como o modulo será apresentado. <br />
              A opção <b>Central de Notificações</b> é a mais completa, serão exibidas as publicações dos diários oficiais e os andamentos processuais capturados no site dos tribunais. <br />
              A opção <b>Publicações</b> exibe apenas as publicações capturados nos diários oficiais dos tribunais. <br />
              A opção <b>Acompanhamentos Processuais</b> exibe apenas os andamentos processuais capturados no site dos tribunais. <br /><br />
            </div>

            <div style={{width:'30%', marginLeft:'35%'}}>
              <AutoCompleteSelect style={{margin:0}}>
                <p>Selecione o tipo de visualização padrão.</p>
                <Select
                  isSearchable
                  value={visualizationTypeList.filter(options => options.id == visualizationType)}
                  onChange={ChangeVisualizationType}
                  required
                  placeholder=""
                  styles={selectStyles}
                  options={visualizationTypeList}
                />
              </AutoCompleteSelect>
              <button type="submit" className="buttonClick" title="Clique para salvar o tipo de visualização" style={{marginLeft:'35%', marginTop:'10px'}} onClick={() => SaveVisualizationType()}>
                <BiSave />
                Salvar
              </button>
            </div>
            <br /><br />
          </div>

          <PublicationNames />
          <PublicationEmail />

          <br /><br /><br />
        </Content>

        {isLoading && (
          <>
            <OverlayPublicationConfiguration />
            <div className='waitingMessage'>
              <LoaderWaiting size={15} color="var(--blue-twitter)" />
              Aguarde...
            </div>
          </>
        )}

      </Container>
    </>
  )

}    

export default PublicationConfiguration;