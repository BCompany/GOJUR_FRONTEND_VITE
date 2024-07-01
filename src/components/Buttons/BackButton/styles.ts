import { shade } from 'polished';
import styled from 'styled-components';

export const Container = styled.button`
  width: 3rem;
  height: 3rem;
  background-color: var(--orange);
  border-radius: 8px;
  position: relative;
  right: -128px;
  top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${shade(0.1, '#ff9000')};
  }
`;
