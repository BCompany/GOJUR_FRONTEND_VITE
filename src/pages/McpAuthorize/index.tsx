import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import api from 'services/api';
import { envProvider } from 'services/hooks/useEnv';
import { useToast } from 'context/toast';
import LogoGoJur from '../../assets/logo-gojur.png';

import { Container, Card } from './styles';

interface DefaultsProps {
  id: string;
  value: string;
}

const McpAuthorize: React.FC = () => {
  const { search } = useLocation();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const params = new URLSearchParams(search);
  const clientId = params.get('client_id');
  const redirectUri = params.get('redirect_uri');
  const state = params.get('state');
  const codeChallenge = params.get('code_challenge');
  const codeChallengeMethod = params.get('code_challenge_method');

  const isValidRequest = !!(clientId && redirectUri && codeChallenge && codeChallengeMethod);

  const redirectToClient = (result: Record<string, string>) => {
    const url = new URL(redirectUri as string);
    Object.entries(result).forEach(([key, value]) => url.searchParams.set(key, value));
    if (state) url.searchParams.set('state', state);
    window.location.href = url.toString();
  };

  // apiKey is only cached by TopNavBar, which never mounts when the user lands here straight from login
  const getApiKey = async (token: string | null) => {
    const cached = localStorage.getItem('@GoJur:apiKey');
    if (cached) return cached;

    const response = await api.post<DefaultsProps[]>('/Defaults/Listar', { token });
    const apiKey = response.data.find(item => item.id === 'apiKey')?.value ?? '';
    if (apiKey) localStorage.setItem('@GoJur:apiKey', apiKey);
    return apiKey;
  };

  const handleAuthorize = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('@GoJur:token');
      const apiKey = await getApiKey(token);

      const response = await axios.post(`${envProvider.McpBaseUrl}/codigo`, {
        token,
        companyId: Number(localStorage.getItem('@GoJur:companyId')),
        apiKey,
        clientId,
        redirectUri,
        codeChallenge,
        codeChallengeMethod,
      });

      redirectToClient({ code: response.data.code });
    } catch (err: any) {
      setIsLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao autorizar',
        description: err.response?.data?.Message ?? 'Não foi possível gerar o código de autorização',
      });
    }
  };

  const handleDeny = () => {
    redirectToClient({ error: 'access_denied' });
  };

  return (
    <Container>
      <Card>
        <img src={LogoGoJur} alt="GoJur" />
        <h1>Autorizar acesso MCP</h1>
        {isValidRequest ? (
          <>
            <p>Um aplicativo externo está solicitando acesso à sua conta GOJUR.</p>
            <div className="actions">
              <button type="button" className="buttonLinkClick" onClick={handleDeny} disabled={isLoading}>
                Negar
              </button>
              <button type="button" className="buttonClick" onClick={handleAuthorize} disabled={isLoading}>
                {isLoading ? 'Autorizando...' : 'Autorizar'}
              </button>
            </div>
          </>
        ) : (
          <p>Solicitação de autorização inválida.</p>
        )}
      </Card>
    </Container>
  );
};

export default McpAuthorize;
