/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */

import React, { useCallback, useState, useEffect } from 'react';
import api from 'services/api';
import { useToast } from 'context/toast';
import ChangePlanCustomerModal from '../Dashboard/MainViewContent/pages/AccountInformation/ChangePlan/CustomerModal'
import {ICustomerPlanData } from '../Dashboard/MainViewContent/pages/Interfaces/IAccountInformation';
import { Container, Center, OverlayModal } from './styles';
import {  useHistory} from 'react-router-dom';
import { FaPowerOff } from 'react-icons/fa';
import { useAuth } from 'context/AuthContext';
import { GrUndo } from 'react-icons/gr';

const TestPeriod: React.FC = () => {
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const token = localStorage.getItem('@GoJur:token');
  const accessCode = localStorage.getItem('@GoJur:accessCode');
  const [showChangePlanCustomerModal, setChangePlanCustomerModal] = useState<boolean>(false);
  const [planInformationList, setPlanInformationList] = useState<ICustomerPlanData[]>([]);
  const [selectPlanId, setSelectPlanId] = useState("0")
  const [haveResources, setHaveResources] = useState<boolean>(false);
  const companyId = localStorage.getItem('@GoJur:companyId');
  const history = useHistory();


    useEffect(() => {
        LoadAccountInformation();
    }, []);

  const LoadAccountInformation = useCallback(async() => {
    try {
      const response = await api.get<ICustomerPlanData[]>('/CustomBCO_ID1/ConfiguracaoCliente/ListarInformacoesConta', {
        params:{
        companyId,
        token,
        }
      });

      setPlanInformationList(response.data);

      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].cod_PlanoComercial > 0) {
          setSelectPlanId(response.data[i].cod_PlanoComercial.toString())

        }
      }
      
    }
    catch (err) {
        addToast({
            type: 'error',
            title: 'Erro ao carregar informações da conta',
            description: 'Não foi possível carregar as informações da conta, tente novamente.',
        });
    }
  }, [planInformationList, companyId]);

  const handleCloseCustomerModal = () => {
    setChangePlanCustomerModal(false)
  }

  const handleOpenCustomerModal = () => {
    setChangePlanCustomerModal(true)
  }

  const handleSignOut = useCallback(async () => {
  
      const tokenapi = localStorage.getItem('@GoJur:token');
      // handleRedirect(`${baseUrl}ReactRequest/Redirect?token=${tokenapi}&route=login/LogOff`)
  
      signOut();
  
      addToast({
        type: 'success',
        title: 'Logout Concluida',
        description: 'Até Logo!',
      });
  
      history.push('/');
    }, [addToast, history, signOut]);

  return (
    <>   
      <Container>

      {(showChangePlanCustomerModal) && <OverlayModal /> }
      {(showChangePlanCustomerModal) && <ChangePlanCustomerModal callbackFunction={{haveResources, planInformationList, handleCloseCustomerModal, selectPlanId}} /> }
    
        <Center>
          <div className="flex-box container-box">
            <div className="content-box">
              <img src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png" alt="logo" />
            </div>
          </div>

          <br /><br />  

          <div id="message">
            <span>Seu período de teste expirou, para continuar utilizando nossos serviços, é necessario realizar a assinatura do plano.</span>

                    <br /><br />  

                    <span>Clique no botão abaixo para realizar a assinatura do plano.</span>

                    <br /><br />  
 
                    <button
                    className="buttonLinkClick"
                    type='button'
                    title="Clique para prosseguir a assinatura do plano"
                    onClick={handleOpenCustomerModal}
                    >
                    Assinar Plano
                    </button>


                    <button
                        type="button"
                        id="logout"
                        onClick={handleSignOut}
                        title="Sair do Sistema"
                        >
                        <FaPowerOff />
                    </button>
        

          </div>

          <br /><br />
    

        </Center>

      </Container>
    </>
  );
}
  
export default TestPeriod;
  