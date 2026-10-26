import React from 'react';
import { useLocation } from 'react-router-dom';
import LogoGoJur from '../../assets/logo-gojur.png';

import { Container, Card } from './styles';

const McpAuthorize: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const clientId = params.get('client_id');

  const handleAuthorize = () => {
    // TODO
  };

  const handleDeny = () => {
    // TODO
  };

  return (
    <Container>
      <Card>
        <img src={LogoGoJur} alt="GoJur" />
        <h1>Autorizar acesso MCP</h1>
        <p>
          O aplicativo <strong>{clientId}</strong> está solicitando acesso à sua conta GOJUR.
        </p>
        <div className="actions">
          <button type="button" className="buttonLinkClick" onClick={handleDeny}>
            Negar
          </button>
          <button type="button" className="buttonClick" onClick={handleAuthorize}>
            Autorizar
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default McpAuthorize;
