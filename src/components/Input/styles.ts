import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: none;
  border-radius: 10px;
  border: 2px solid var(--secondary);
  width: 100%;
  color: var(--secondary);
  transition: all 0.5s;

  display: flex;
  align-items: center;

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  & + div {
    margin-top: 1rem;
  }

  > svg {
    margin-right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (max-width: 420px) {
    border: 2px solid var(--gray-outline);
    color: var(--gray-outline);
  }

  input {
    flex: 1;
    width: 100%;
    padding: 1rem;
    background: transparent;
    border-radius: 10px;
    font-size: 1rem;
    font-family: Poppins;

    color: var(--secondary);

    @media (max-width: 420px) {
      width: 100%;
      padding: 1rem;
      color: var(--gray-outline);
      font-size: 1rem;
    }

    &::placeholder {
      color: var(--secondary);

      @media (max-width: 420px) {
        color: var(--gray-outline);
      }

      & + input {
        margin-top: 1rem;
      }
    }

    svg {
      margin-right: 0.5rem;
    }
  }
`;
