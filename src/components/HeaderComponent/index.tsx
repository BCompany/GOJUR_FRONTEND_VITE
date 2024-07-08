import React, {
  AreaHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FiX } from 'react-icons/fi';

import { Container } from './styles';

interface HeaderProps extends AreaHTMLAttributes<HTMLAreaElement> {
  title: string;
  cursor: boolean;
  action?: any;
}

const HeaderComponent: React.FC<HeaderProps> = ({title, children, cursor, action, ...rest}) => {
  const [haveAction, setHaveAction] = useState(false);


  useEffect(() => {
    if (action) {
      setHaveAction(!haveAction);
    }
  }, []);


  const handleClose = useCallback(() => {
    console.log('Fechar');
  }, []);


  return (
    <Container id='Container' cursorMouse={cursor} handleClose={haveAction}>
      <section {...rest}>
        <p>{title}</p>
      </section>
      <div>
        <FiX onClick={action} />
      </div>
    </Container>
  );
};

export default HeaderComponent;
