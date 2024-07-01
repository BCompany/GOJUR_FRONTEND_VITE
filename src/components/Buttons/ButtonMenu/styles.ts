import { shade } from 'polished';
import styled from 'styled-components';

interface ContainerProps {
  isOpenMenu: boolean;
}

export const Container = styled.button<ContainerProps>`
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
  border-radius: 10px;
  transition: all 0.5s;
  margin-top: 8px;

  /* position: relative;
  left: ${props => (props.isOpenMenu ? '60px' : '160px')};
  top: 16px; */

  &:hover {
    background-color: #ffd399;
    opacity: 0.5;
  }

  > svg {
    width: 2.5rem;
    height: 2.5rem;
    color: var(--orange);
  }
`;
