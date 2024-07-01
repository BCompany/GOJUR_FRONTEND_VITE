/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { InputHTMLAttributes, useState, useCallback } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Container isFocused={isFocused}>
      <input onFocus={handleInputFocus} onBlur={handleInputBlur} {...rest} />
      {Icon && <Icon size={20} />}
    </Container>
  );
};

export default Input;
