import React, { ButtonHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const BackButton: React.FC<ButtonProps> = ({ icon: Icon, ...rest }) => {
  return (
    <Container {...rest}>{Icon && <Icon size={32} color="#fff" />}</Container>
  );
};

export default BackButton;
