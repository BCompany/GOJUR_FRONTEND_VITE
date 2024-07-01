import React, { TextareaHTMLAttributes, useCallback, useState } from 'react';

import { Container } from './styles';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

const TextArea: React.FC<TextAreaProps> = ({ name, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Container isFocused={isFocused}>
      <label htmlFor="text-box" id={name}>
        {name}
      </label>
      <textarea onFocus={handleInputFocus} onBlur={handleInputBlur} {...rest} />
    </Container>
  );
};

export default TextArea;
