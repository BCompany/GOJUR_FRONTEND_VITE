import styled from 'styled-components'

export const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 font-size: 0.75rem;

 h1 {
   font-family: Montserrat;
   font-size: 0.625rem;
   font-weight: 500;
   color: var(--primary);
 }

 > div{
  display:  flex;
  flex-direction: column;
  margin-top: 1rem;
  width: 100%;
  
   label {
     display: flex;
     flex-direction: column;
     align-items: center;
     margin: 0 0.5rem;
     font-size: 0.625rem;

     & + label {
       margin-top: 0.5rem;
     }
     p {
       color: var(--secondary);
     }

     input, select {
       margin-top: 0.5rem;
       border-bottom: 1px solid rgba(0,0,0,0.1);
       width: 100%;
     }
     select#fixed {
        -webkit-appearance: none;
    }

     select {
       width: 10%;
     }
     
   }
 }
 
> footer {
    margin-top: 1rem;
  }
       
`;