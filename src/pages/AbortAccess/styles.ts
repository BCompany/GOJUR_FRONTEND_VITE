import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > img {
    width: 35%;
  }

  > h1 {
    width: 100%;
    color: var(--grey);
    text-align: center;
    font-size: 1.5rem;
  }
`;
