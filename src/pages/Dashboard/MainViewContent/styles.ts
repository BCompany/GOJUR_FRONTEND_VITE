import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;

  background-color: var(--gray);

  @media (max-width: 1024px) {
    overflow-y: scroll;
  }

  h1 {
    font-size: 2rem;
  }
`;
