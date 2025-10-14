/* eslint-disable new-cap */
import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import api from 'services/api';

import { Container } from './styles';

const NewUser: React.FC = () => {
  const token = useParams<string>();
  const history = useHistory();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    localStorage.clear();

    const params = location.search;
    let secret = params.substring(7);
    let publicationId = '';

    // get param publication from URL
    const hasPublicationId = params.includes('publicationId');
    if (hasPublicationId){

      // split all parameters by & character concatenation
      const paramsList = params.split('&');

      // take value secret token from first paramster
      secret = paramsList[0].substring(7).toString();

      // take value of second parameters afeter signal =
      publicationId = paramsList[1].split('=')[1].toString();
    }

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

        // if exists publicationId passed in query string, create a object JSON to build filter in Publication page
        // This way was implemented because is the same handle when user clique in "abrir processo" to redirect to old Gojur page
        // In this case is storage in local browser a filter used to apply again when redirect back
        if (publicationId != ''){
          const filtersJSON = {
            period: '',
            name: 'filterNameFalse',
            matter: [],
            term: '',
            publicationId
          };

          localStorage.setItem('@GoJur:PublicationFilter', JSON.stringify(filtersJSON));
          history.push('/publication');
        }
        else {
          history.push('/clientRedirect');
        }
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

export default NewUser;
