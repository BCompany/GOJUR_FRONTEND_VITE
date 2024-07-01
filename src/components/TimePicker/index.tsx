/* eslint-disable radix */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useEffect,
  useState,
  useCallback,
  InputHTMLAttributes,
} from 'react';
import format from 'date-fns/format';
import { useModal } from '../../context/modal';

import { Container } from './styles';

interface TimePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  title,
  children,
  ...rest
}) => {
  const { setAppointmentTimeEnd } = useModal();
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
        type="time"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        list="times"
        {...rest}
      />
      <datalist id="times">
        <option value="07:00" />
        <option value="07:30" />
        <option value="08:00" />
        <option value="08:30" />
        <option value="09:00" />
        <option value="09:30" />
        <option value="10:00" />
        <option value="10:30" />
        <option value="11:00" />
        <option value="11:30" />
        <option value="12:00" />
        <option value="12:30" />
        <option value="13:00" />
        <option value="13:30" />
        <option value="14:00" />
        <option value="14:30" />
        <option value="15:00" />
        <option value="15:30" />
        <option value="16:00" />
        <option value="16:30" />
        <option value="17:00" />
        <option value="17:30" />
        <option value="18:00" />
        <option value="18:30" />
        <option value="19:00" />
        <option value="19:30" />
        <option value="20:00" />
        <option value="20:30" />
        <option value="21:00" />
        <option value="21:30" />
        <option value="22:00" />
        <option value="22:30" />
        <option value="23:00" />
        <option value="23:30" />
        <option value="00:00" />
      </datalist>
    </Container>
  );
};

export default TimePicker;
