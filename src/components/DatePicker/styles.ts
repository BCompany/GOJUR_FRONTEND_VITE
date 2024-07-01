import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  flex: 1;
  max-width: 168px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--grey);
  margin-right: 0.5rem;

  @media (min-width: 1366px) {
    max-width: calc(100% - 1rem);
  }

  @media (max-width: 480px) {
    max-width: 25vw;
  }

  /* @media (max-width: 480px) {
    max-width: calc(100% - 30rem);
  } */

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  &:hover {
    border-bottom: 2px solid var(--grey);
  }

  > div {
    width: 100%;
    display: flex;
    > label {
      /* font-size: 0.6rem; */
      font-size: 0.725rem;
    }
  }

  input {
    flex: 1;
    width: 100%;
    font-size: 0.765rem;
    color: var(--secondary);
    /* padding: 0.5rem; */
  }
`;
