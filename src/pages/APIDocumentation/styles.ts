import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 12px;
  background-color: #EDF0F7;
`;


export const Center = styled.div`
  width: 70%;
  align-self: center;

  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-box {
    background-color: #EDF0F7;
  }

  .content-box {
    text-align: center;
    width: 60%;
  }

  .swagger-ui .info {
    text-align: center;
  }

  /* Oculta a seção de Schemes */
  .swagger-ui .scheme-container {
    display: none;
  }

  /* Oculta a seção de Models */
  .swagger-ui .model-box {
    display: none;
  }

  /* Oculta a seção de Definitions */
  .swagger-ui .opblock .opblock-section-header [data-name="definitions"] {
    display: none;
  }

  /* Oculta a seção de versão */
  .swagger-ui .info__title .version {
    display: none;
  }

  /* Oculta a section de version-stamp */
  .swagger-ui .topbar .version-stamp {
    display: none;
  }

  .swagger-ui .info .title small {
    display: none;
  }

  .swagger-ui .info .base-url {
    display: none;
  }

  .swagger-ui section.models {
    display: none;
  }

`;

