import styled from 'styled-components';

export const Container = styled.button`
  width: 100%;
  height: 4rem;
  background: var(--green);
  color: var(--gray);
  margin-top: 2rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-family: poppins;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding-left: 6rem; */
  /* box-shadow: 1px 2px 16px 8px rgba(230, 230, 250, 1); */

  > svg {
    width: 1.5rem;
    height: 1.5rem;
    color: var(--white);
    background-color: transparent;
    margin-left: 0.5rem;
  }

  &:hover {
    background: var(--green-dark);
    color: var(--white);
  }
`;
