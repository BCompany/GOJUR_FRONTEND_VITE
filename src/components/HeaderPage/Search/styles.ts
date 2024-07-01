import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: none;
  border-radius: 32px;
  border: 2px solid var(--blue-light);
  flex: 1;
  min-width: 25rem;
  height: 2rem;
  color: var(--blue);
  transition: all 0.5s;

  display: flex;
  align-items: center;

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;

      > svg {
        background: transparent;
        color: var(--blue);

        &:hover {
          background-color: #ffd399;
          border-radius: 8px;
          color: var(--orange);
        }
      }
    `}

  & + div {
    margin-top: 1rem;
  }

  > svg {
    margin-right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;

    &:hover{
      color: var(--orange)
    }
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
    font-size: 0.75rem;
    font-family: Poppins;

    color: var(--secondary);

    @media (max-width: 420px) {
      width: 100%;
      padding: 1rem;
      color: var(--gray-outline);
      font-size: 0.75rem;
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
