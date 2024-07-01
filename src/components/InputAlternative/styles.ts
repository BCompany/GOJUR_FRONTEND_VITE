import styled from 'styled-components';

export const Container = styled.div`
  background: #f2f6f9;
  border-radius: 10px;
  border-bottom: 1px solid var(--secondary);
  display: flex;
  align-items: center;
  filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.35));
  transition: all 0.5s;

  & + div {
    margin-top: 16px;
  }

  > svg {
    margin-right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;

    &:hover {
      color: var(--orange);
      opacity: 0.4;
    }
  }

  input {
    flex: 1;
    width: 100%;
    height: 40px;
    padding: 1rem;
    background: transparent;
    border-radius: 10px;
    font-size: 0.875rem;
    font-family: Poppins;
    filter: drop-shadow(1px 4px 4px rgba(0, 0, 0, 0.35));

    color: var(--secondary);

    &::placeholder {
      color: var(--secondary);

      & + input {
        margin-top: 0.5rem;
      }
    }

    svg {
      margin-right: 0.5rem;
    }
  }
`;
