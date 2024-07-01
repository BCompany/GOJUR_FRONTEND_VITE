import styled from 'styled-components';

interface colorEvent {
  color: string;
  status: string;
}

export const Container = styled.div`
  margin-top:0.5rem;
  font-size:0.8rem;
  font-weight:500;
  color:var(--blue-twitter);

  > svg{
    width:1rem;
    height:1rem;
    color:var(--blue-twitter);
  }
`

export const Content = styled.div`
    display: grid;
    width: 100%;   // mobile
    @media (min-width: 480px) {
      width: 203%; // browser
    } 
    margin-top:-15px;
    grid-gap:1rem;
    font-size:0.65rem;
    font-weight:300;
    color:var(--secondary);
    
    @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
    }   

    .messageEmpty{
      font-size:0.65rem;
      text-align:center;
      justify-content:center;
      padding-top:1rem;
      width:200%;
      margin-left:30px;
      color:var(--blue-twitter);
  }
`
export const EventsItem = styled.div<colorEvent>`
  
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;    
    padding:0.30rem;
    word-break: break-all;    
    font-family: Montserrat verdana;
    background-color: var(--white);
    //cursor:pointer;
    border-left: 5px solid  ${props => (props.color)};
    text-decoration-line: ${props => (props.status == 'L'? 'line-through':'none')};
    /* height:8rem;
    overflow:auto; */
    /* cursor:pointer; */
    
    p{
      margin-left:5px;
    }

    >p label{
        font-weight:500;
        margin-right:0.1rem;
      }
    }

    div>svg{
      width:1.5rem;
      height:1.5rem;
      color: var(--blue-twitter);
    }

    .buttons{
      margin-top:0.5rem;
      float:right;
    }
`;
