/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useState,
  useCallback,
  InputHTMLAttributes,
} from 'react';

import { Container } from './styles';

interface DataPickerProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
}

// interface Data {
//   eventId: string;
//   startDate: Date;
//   endDate: Date;
//   description: string;
//   subject: string;
// }

const DatePicker: React.FC<DataPickerProps> = ({ title, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Container isFocused={isFocused}>
      <div>
        <label htmlFor="date">{title}</label>
      </div>
      <input
        type="date"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
    </Container>
  );
};

export default DatePicker;
