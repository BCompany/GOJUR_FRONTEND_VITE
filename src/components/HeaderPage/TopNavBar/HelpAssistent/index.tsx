import React from 'react';
import { envProvider } from 'services/hooks/useEnv';

import { Container, MenuItem } from './styles';

const HelpAssistent: React.FC = () => {
  const acessoRemotoST = `${envProvider.mainUrl}resources/bcompanyremotost.exe`;
  const acessoRemotoMAC = `${envProvider.mainUrl}resources/BcompanyRemotoSTMAC.dmg`;
  const acessoRemotoAD = `${envProvider.mainUrl}resources/BcompanyRemotoAD.exe`;
  const acessoRemotoADMAC = `${envProvider.mainUrl}resources/BcompanyRemotoADMAC.exe`;
  return (
    <Container>
      <MenuItem
        initial={{ opacity: 0, y: -20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <a href={acessoRemotoST} download>
          Acesso Remoto - ST
        </a>
      </MenuItem>
      <MenuItem
        initial={{ opacity: 0, y: -40 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <a href={acessoRemotoMAC} download>
          Acesso Remoto - MAC
        </a>
      </MenuItem>
      <MenuItem
        initial={{ opacity: 0, y: -60 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <a href={acessoRemotoAD} download>
          Acesso Remoto 1- (AD)
        </a>
      </MenuItem>
      <MenuItem
        initial={{ opacity: 0, y: -80 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <a href={acessoRemotoADMAC} download>
          Acesso Remoto 1- (AD) MAC
        </a>
      </MenuItem>
      <MenuItem
        initial={{ opacity: 0, y: -100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <a href="https://www.brasilbandalarga.com.br/bbl/" target="blank">
          Velocidade da internet
        </a>
      </MenuItem>
      <MenuItem
        initial={{ opacity: 0, y: -100 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <a href="https://gojur.tawk.help/" target="blank">
          Ajuda GOJUR
        </a>
      </MenuItem>
    </Container>
  );
};

export default HelpAssistent;
