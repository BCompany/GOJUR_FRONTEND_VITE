/* eslint-disable new-cap */
import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import api from 'services/api';

import { Container } from './styles';

const Validate: React.FC = () => {
  const token = useParams<string>();
  const history = useHistory();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    const secret = location.search.substring(7);

    async function handleRedirectNewUser() {
      try {
        const response = await api.post('/Usuario/DescriptografarToken', { token: secret, });

        const newData = response.data.split('|');
        const emailR = newData[0];
        const passwordR = newData[1];

        await signIn({email: emailR, password: passwordR });

        localStorage.setItem('@GoJur:LoginType', 'P');

        history.push('/clientRedirect');

      } catch (err) {
        history.push('/');
      }
    }

    handleRedirectNewUser();

  }, [history, location, signIn, token]);

  return (
    <Container>
      <h1>Aguarde um momento</h1>
    </Container>
  );
};

export default Validate;
