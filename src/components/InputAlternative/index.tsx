import React, { InputHTMLAttributes } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const InputAlternative: React.FC<InputProps> = ({ icon: Icon, ...rest }) => {
  return (
    <Container>
      <input {...rest} />
      {Icon && <Icon size={20} />}
    </Container>
  );
};

export default InputAlternative;
