import React, { useEffect } from 'react';
import LogoGoJur from '../../assets/logo-gojur.png';

import { Container } from './styles';

const AbortAccess: React.FC = () => {

  //  after two seconds abort access user redirect to login
  setTimeout(() => {

    window.location.href = "/";

  }, 2000)

  return (
    <Container>
      <img src={LogoGoJur} alt="redirect" />
      <h1>Acesso não autorizado</h1>
    </Container>
  );
};

export default AbortAccess;
