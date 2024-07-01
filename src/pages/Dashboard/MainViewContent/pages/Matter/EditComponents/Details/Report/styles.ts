import styled from 'styled-components'


export const Container = styled.div`
  
  font-size: 0.675rem;
  font-family:montserrat, verdana;
  
  header {
    top:0;
    font-size: 0.765rem;
    margin-top:-50px;    
    margin-bottom:1rem;
    padding: 1rem;    
    font-weight:400;
    text-align:center;
    border-bottom: 1px solid var(--gray);
  }

  footer {
    text-align:center;
  }

  > div {
    margin:1rem;
    display:flex;
    flex-direction: column;
    justify-content: center;
    padding:1rem; 
    text-align:center;
    max-height:10rem;
    overflow:auto;

    >p {
      padding:0.2rem;

      >svg {
        width:0.85rem;
        height:0.85rem;
        color: var(--blue-twitter);
        margin-left:5px;
        top:5px;
        cursor:pointer;

        &:hover {
          color: var(--orange);
        }
      }
    }
  }

`;

