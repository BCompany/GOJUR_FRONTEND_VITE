import React, { useCallback, useEffect, useState } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { Container, Content, Editor } from './styles';


const LabEditor: React.FC = () => {

  return (
    <Container>
      <HeaderPage />
      <br />

      <Content>
        <h1>LAB EDITOR</h1>
      </Content>

    </Container>
  )
}

export default LabEditor