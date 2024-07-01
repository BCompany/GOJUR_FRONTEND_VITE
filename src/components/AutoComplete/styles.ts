import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  /* border: 1px solid black; */
  width: calc(100% - 1rem);

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 1rem;
  /* border: 1.5px solid black; */

  > label {
    font-size: 0.75rem;
    margin-right: 1rem;
  }

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}
`;

export const InputBox = styled.div<ContainerProps>`
  /* border: 1px solid black; */
  width: calc(100% - 1rem);

  > input {
    width: calc(100% - 1rem);
    height: 2rem;
    padding-left: 1rem;
    margin-left: 1rem;
    border-bottom: 1px solid var(--grey);
    font-size:0.665rem;

    ${props =>
      props.isFocused &&
      css`
        border-color: #ff9000;
      `}

    &:hover {
      border-bottom: 2px solid var(--grey);
    }
  }
`;
