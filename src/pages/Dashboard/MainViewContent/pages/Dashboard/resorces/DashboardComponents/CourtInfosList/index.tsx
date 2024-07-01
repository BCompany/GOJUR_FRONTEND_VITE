import React from 'react';
import { Container } from './styles';

const CourtInfosList: React.FC = ({ children }) => {
  return (
    <Container
      initial={{ scale: 0, opacity: 0, x: -500 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      transition={{ ease: 'easeOut', duration: 0.25 }}
    >
      {children}
    </Container>
  );
};

export default CourtInfosList;
