import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { envProvider } from 'services/hooks/useEnv';
import LogoGoJur from '../../assets/logo-gojur.png';

import { Container } from './styles';

const ClientRedirect: React.FC = () => {
  const { tpoUser } = useAuth();
  const history = useHistory();
  const token = localStorage.getItem('@GoJur:token');

  const ts = localStorage.getItem('@GoJur:LoginType');

  useEffect(() => {
    // const baseUrl = envProvider.redirectUrl;

    if (ts === 'P') {
      localStorage.removeItem('@GoJur:name');
    }

    if (tpoUser !== 'C') {
      history.push('/dashboard');
    } else {
      history.push('/customerLawyer');
      // window.location.href = `${baseUrl}ReactRequest/RedirectCustomerUser?token=${token}`;
    }
  }, [history, token, tpoUser, ts]);

  return (
    <Container>
      <img src={LogoGoJur} alt="redirect" />
      <h1>Aguarde um momento</h1>
    </Container>
  );
};

export default ClientRedirect;
