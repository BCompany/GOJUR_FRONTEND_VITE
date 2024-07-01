import React, { ButtonHTMLAttributes } from 'react';
import { FiLogIn } from 'react-icons/fi';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonLoginScreen: React.FC<ButtonProps> = props => {
  return (
    <Container {...props}>
      {props.children}
      <FiLogIn />
    </Container>
  );
};

export default ButtonLoginScreen;
