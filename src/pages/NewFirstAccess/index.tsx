/* eslint-disable new-cap */
import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import api from 'services/api';
import { Container } from './styles';

const NewFirstAccess: React.FC = () => {
  const token = useParams<string>();
  const history = useHistory();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    localStorage.clear();

    const params = location.search;
    const secret = params.substring(7);

    async function handleRedirectNewUser() {
      try {
        const response = await api.post('/Usuario/DescriptografarToken', {
          token: secret,
        });

        const newData = response.data.split('|');
        const emailR = newData[0];
        const passwordR = newData[1];

        // When is used a plugin login the localstorage is always cleaned
        // So is necessary now, save again the user token
        await signIn({
          email: emailR,
          password: passwordR,
        });

        localStorage.setItem('@GoJur:token', secret);
        localStorage.setItem('@GoJur:firstAccess', 'true');

        history.push('/dashboard');

      } catch (err) {
        history.push('/');
      }
    }

    handleRedirectNewUser();
  }, [history, location.search, signIn, token]);

  return (
    <Container>
      <h1>Aguarde um momento</h1>
    </Container>
  );
};

export default NewFirstAccess;
