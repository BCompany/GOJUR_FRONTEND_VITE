import styled from 'styled-components'

export const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 font-size: 0.625rem;

 h1 {
   font-family: Montserrat;
   font-size: 0.725rem;
   font-weight: 500;
   color: var(--primary);
 }

 div{
  display:  flex;
  flex-direction: column;
  margin-top: 1rem;
  width: 100%;
  border-bottom: 1px solid var(--grey);
  text-align: center;
 }
 
> footer { margin-top: 1rem; }
       
`;