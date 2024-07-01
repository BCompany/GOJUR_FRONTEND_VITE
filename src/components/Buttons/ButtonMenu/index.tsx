import React, { ButtonHTMLAttributes, useCallback, useState } from 'react';
import { BiMenu, BiMenuAltRight } from 'react-icons/bi';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonMenu: React.FC<ButtonProps> = ({ ...rest }) => {
  const [menu, setMenu] = useState(true);

  const handleMenu = useCallback(() => {
    setMenu(!menu);
  }, [menu]);

  const Icon = menu;

  return (
    <Container isOpenMenu={menu} onClick={handleMenu} {...rest}>
      {Icon ? <BiMenu /> : <BiMenuAltRight />}
    </Container>
  );
};

export default ButtonMenu;
