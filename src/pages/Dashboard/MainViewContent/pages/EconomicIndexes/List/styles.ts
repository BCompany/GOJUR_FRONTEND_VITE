import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column; 
  
  #options {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;
     margin-left:1rem;
     margin-right:35px;

     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 2rem;
     }

     &:hover {
       svg {
        color: var(--orange);
       }
      }
    }
`;


export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 6rem;
  margin: 0.5rem 0.5rem;
  overflow: auto;
  width: 99%;
`;

export const ContentMobile = styled.div`
  flex: 1;
  overflow: auto;
  width: 99%;
  font-size:8px;
  padding:8px;
`;

export const ContentBottoms = styled.div`
  flex: 1;
  padding: 0.5rem 6rem;
  margin: 0.5rem 0.5rem;
  width: 99%;
`;