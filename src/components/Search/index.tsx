/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  ChangeEvent,
  useEffect,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { handleInputChange } from 'react-select/src/utils';

import { Container } from './styles';

interface SearchData {
  id: number;
  result: string;
  type: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  handleRequest?(): void;
  icon?: React.ComponentType<IconBaseProps>;
  style?: object;
}

const Search: React.FC<InputProps> = ({
  name,
  icon: Icon,
  handleRequest,
  style,
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
    <Container isFocused={isFocused} style={style}>
      <input onFocus={handleInputFocus} onBlur={handleInputBlur} {...rest} />
      {children}
      {Icon && <Icon size={20} onClick={handleRequest} />}
    </Container>
  );
};

export default Search;
