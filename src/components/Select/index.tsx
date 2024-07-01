import React from 'react';

import { Container } from './styles';

const Select: React.FC = ({ ...rest }) => {
  return (
    <Container>
      <select {...rest} />
    </Container>
  );
};

export default Select;
