/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line jsx-a11y/label-has-associated-control
// eslint-disable-next-line jsx-a11y/interactive-supports-focus
// eslint-disable-next-line jsx-a11y/no-static-element-interactions

import React, { useState, useCallback, useEffect} from 'react';
import { HeaderPage } from 'components/HeaderPage';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import { FaUserCog } from 'react-icons/fa';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from 'services/api';
import { Container, Content } from './styles';

export interface IAccountInformation{
  companyId: string;
  accessCodes: string;
  des_PlanoComercial: string;
  des_RecursoSistema: string;
  tpo_Recurso?:string;
  qtd_RecursoIncluso?: number;
  qtd_RecursoEmUso: string;
}

export interface IAccountPlan{
  value: string;
}

Modal.setAppElement('#root');

const AccountInformationList: React.FC = () => {
  const token = localStorage.getItem('@GoJur:token');
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [accountInformation, setAccountInformation] = useState<IAccountInformation[]>([]);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [accountPlan, setAccountPlan] = useState<string>("")
  const accessCode = localStorage.getItem('@GoJur:accessCode')

  useEffect(() => {
    LoadAccountInformation();
    AccountPlan();
  }, [])


  useEffect(() => {
    setIsLoading(true);
  }, [])


  const LoadAccountInformation = async () => {
    if (isLoadingComboData){
      return false;
    }

    try {
      const response = await api.get<IAccountInformation[]>('/Conta/InformacoesDaConta', {
        params:{
        token,
        }
      });

      response.data.map(item => {
        if(item.tpo_Recurso == 'RP'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'RU'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'CP'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'CB'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'FP'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'ED'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'CR'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      response.data.map(item => {
        if(item.tpo_Recurso == 'NW'){
          setAccountInformation(previousValues => [...previousValues, item])
        }   
        return
      })

      setIsLoading(false)
    }
    catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  const AccountPlan = useCallback(async() => {
    const response = await api.get<IAccountPlan>('/Conta/PlanoDaConta', {
      params:{
        token,
      }  
    })

    setAccountPlan(response.data.value)
  }, [accountPlan]);


  const handleAddResource = () => {
    localStorage.setItem('@GoJur:addResource', "true" )
    history.push('/changeplan') 
  }


  if(isLoading)
  {
    return (
      <Container>
        <HeaderPage />

        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp; Aguarde...
        </div>

      </Container>

    )
  }


  return (
    <>
      <Container> 
        <HeaderPage />

        {accessCode == "adm" && (
          <div style={{marginLeft:"3%"}}>
            <div>
              <button
                className="buttonLinkClick buttonInclude"
                type="submit"
                onClick={() => history.push('/companyinformation')}
              >
                <FaUserCog style={{width:"20px", height:"20px", marginBottom:"-2px"}} />
                <span style={{fontSize:"15px"}}>Alterar Informações da Empresa</span>

              </button>
            </div>

          </div>
        )}

        <Content>
          <div>
            <div className='accountInformation'>
              <div className='preview'>
                <h6>Plano Contratado</h6>
                <h2>{accountPlan}</h2>
                {accessCode == "adm" && (
                  <>
                    <div className="btn"><button type='button' onClick={() => history.push('/changeplan')}>Alterar Plano</button></div>
                    <div className="btn2"><button type='button' onClick={handleAddResource}>Adicionar Recursos</button></div>
                  </>
                )}
              </div>

              <div className='infoDescriptionPlan'>
                <h2>Recursos</h2>

                {accountInformation.map(i => (
                  <>
                    {i.des_RecursoSistema.length > 65 && (
                      <p title={i.des_RecursoSistema}>
                        {i.des_RecursoSistema.substring(0,70)}
                        ...
                      </p>
                    )}

                    {i.des_RecursoSistema.length <= 65 && (
                      <p>{i.des_RecursoSistema}</p>
                    )}
                    <br />
                  </>
                ))}
              </div>

              <div className='infoTotalPlan'>
                <h2>Total Plano</h2>

                {accountInformation.map(i => (
                  <>
                    {i.qtd_RecursoIncluso == 0 && (
                      <p>ilimitado</p>
                    )}
                    {i.qtd_RecursoIncluso != 0 && (
                      <p>{i.qtd_RecursoIncluso}</p>
                    )}                 
                    <br />
                  </>
                ))}
              </div>

              <div className='infoResourcesUtilized'>
                <h2>Em Uso</h2>

                {accountInformation.map(i => (
                  <>
                    {i.qtd_RecursoEmUso == null && (
                      <span className="list-name" style={{fontSize:"24px", display: "block"}}>&nbsp;</span>
                    )}
                    {i.qtd_RecursoEmUso != null && (
                      <p>{i.qtd_RecursoEmUso}</p>
                    )}               
                    <br />
                  </>
                ))}
              </div>
            </div> 
          </div>
        </Content>
      </Container>
    </>
  );
}

export default AccountInformationList;
