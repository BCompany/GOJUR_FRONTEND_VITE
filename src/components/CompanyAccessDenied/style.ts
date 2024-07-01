import styled from 'styled-components';

export const Container = styled.div`

  display:flex;
  flex-direction:column;
  font-size:0.765rem;
  align-items: center;
  justify-content: center;

  .warning {
    font-size:0.85rem;
    font-weight:600;
    color: var(--blue-twitter);
    padding: 0.5rem 0.5rem;
    border-bottom: solid 1px var(--blue-twitter);
    border-top: solid 1px var(--blue-twitter);
  }

  .information {
    font-size:0.65rem;
    text-align:center;
    margin-top:1rem;
    color: var(--blue-twitter);

    >span {
      font-weight:600;
      cursor:pointer;
      :hover{
        color: var(--orange)
      }
    }
  }

  .
`;


