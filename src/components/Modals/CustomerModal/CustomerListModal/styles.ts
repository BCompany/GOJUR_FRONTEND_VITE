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

 > div{
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-gap: 0.5rem;
   align-items: center;
   justify-content: space-between;
   margin-top: 1rem;

 
   .autoSelect{
     width: 230px;
  }

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
 }

 > button {
  position: relative;
  bottom: -32px;
  background-color: var(--blue);
  padding: 0.5rem 2rem;
  border-radius: 0.25rem;
  color: var(--white);
  
  &:hover{
    filter: brightness(80%);
  }
 }  
`;
