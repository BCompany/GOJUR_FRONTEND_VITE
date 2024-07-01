import styled from 'styled-components';

export const Container = styled.div`

  .customerContact {
      background-color: var(--white);
      box-shadow: 1px 1px 1px 1px var(--blue-soft);
      border-radius: 0.25rem; 
      min-width:20rem;     
      position:absolute;
      padding:1rem;
      margin-left:13.5rem;
      margin-top:-2.5rem;
      z-index:999;

      div {
        margin-bottom:0.2rem;

        svg {
          color:var(--blue-twitter);
          width:0.8rem; height: 0.8rem;
          margin-left:0.3rem;
          cursor:pointer;
        }
      }
      
      span:first-child{
        font-weight:600;
        margin-right:0.3rem;
      }
    }

`;