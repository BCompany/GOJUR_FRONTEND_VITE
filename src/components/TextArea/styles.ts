import styled, { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: calc(100% - 1rem);
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid black; */

  ${props =>
    props.isFocused &&
    css`
      color: #ff9000;
      border-color: #ff9000;
    `}

  > label {
    font-size: 0.75rem;
    font-weight: 400;
  }
  > label#Descrição {
    margin-right: 1rem;
  }

  > textarea {
    flex: 1;
    height: 3.5rem;
    border-radius: 4px;
    border: 1px solid var(--grey);
    overflow: hidden;

    font-size: 0.675rem;
    font-weight: 400;
    padding: 0.25rem;
    margin-left: 0.5rem;
    margin-top: 1rem;
  }
`;
