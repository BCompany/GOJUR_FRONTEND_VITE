import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Card = styled.div`
  width: 420px;
  max-width: 90%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  > img {
    width: 50%;
  }

  > h1 {
    color: var(--grey);
    font-size: 1.5rem;
  }

  > p {
    text-align: center;
  }

  .actions {
    display: flex;
    gap: 12px;
  }
`;
