import styled from 'styled-components';

export const Container = styled.div`

  label {
     display: flex;
     flex-direction: column;
     align-items: center;
     margin: 0 0.5rem;
     p {
       font-size: 0.625rem;
       color: var(--secondary);
     }

     input, select {
       margin-top: 0.5rem;
       border-bottom: 1px solid rgba(0,0,0,0.1);
       color: var(--primary);
       padding: 0.25rem;
       width: 100%;

       &:focus{
        border-bottom: 1px solid var(--orange);

       }
     }
   }
`;