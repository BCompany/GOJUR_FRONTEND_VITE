/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { InputHTMLAttributes, useCallback, useState } from 'react';
import { IconBaseProps } from 'react-icons';

import { Container, InputBox } from './styles';

interface AutoCompleteProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const Autocomplete: React.FC<AutoCompleteProps> = ({
  label,
  value,
  icon: Icon,
  children,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Container isFocused={isFocused}>
      <label htmlFor="autocomplete">{label}</label>

      <InputBox isFocused={isFocused}>
        <input
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...rest}
          type="search"
        />
        {children}
        {Icon && <Icon size={20} />}
      </InputBox>
    </Container>
  );
};

export default Autocomplete;
