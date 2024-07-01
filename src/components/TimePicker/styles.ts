import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid var(--grey);
  margin-right: 0.5rem;

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
      font-size: 0.675rem;
      //font-size: 0.765rem;
    }
  }

  input {
    flex: 1;

    min-width: 120px;
    font-size: 0.765rem;

    @media (max-width: 480px) {
      width: 17vw;
      min-width: 10vw;
    }

    color: var(--secondary);

    /* padding: 0.5rem; */
  }
`;
