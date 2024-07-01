import styled from 'styled-components';

export const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;

  h1 {
    font-family: Montserrat;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--primary);
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255,255,255,0.25);
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }
`;

export const CustomerMergeForm = styled.form`

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255,255,255,0.25);
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }
`;
