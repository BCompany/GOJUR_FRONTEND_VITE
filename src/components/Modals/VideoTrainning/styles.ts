import styled from 'styled-components';

export const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 width: 100%;
 flex-direction: column;
 z-index: 99998;

 > div{
   margin-bottom:1rem;
   margin-top:-1.5rem;
   width:100%;
   text-align:center;
 }

 h1 {
   font-family: Montserrat;
   font-size: 0.65rem;
   font-weight: 500;
   color: var(--primary);
 }          
`;
