import styled from 'styled-components';

export const Container = styled.div`
  background: #f2f6f9;
  width: 13.75rem;
  border-radius: 10px;
  border-bottom: 1px solid var(--secondary);
  display: flex;
  align-items: center;
  padding: 0.625rem;
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.35));
  transition: all 0.5s;

  > select {
    width: 13.75rem;
  }
`;
