import styled from 'styled-components';

interface tabActive{
  active: boolean;
}

export const Tabs = styled.div`    
  
  margin-top:0.2rem;
> div:first-child {
  /* margin: 0rem 1.5rem; */
   cursor: pointer;
   
  .buttonTabActive{
   color: var(--blue-twitter);
   font-weight:600;
   border:0;
  }
  .buttonTabInactive{        
    opacity:0.8;
    border:0;
  } 
  
  .loadingMessage {
    text-align: center;
    font-size:0.675rem;
    color: var(--blue-twitter);
    float:right;
    margin-top:3px;
    margin-right:45vw;
    right:0;
  }
  > button {
    font-family: Montserrat;
    font-size:0.65rem;    
    margin-left: 0.5rem;    
    border-right: 1px solid;    
    border-color: var(--blue-twitter);
    padding-right:0.5rem;
    
    >svg{
      margin-right:0.25rem;
      margin-top:0.35rem; 
      width:1rem;
      height:1rem;
    }
    &:hover {
      color: var(--blue-twitter)
    }
  }
  button:last-child{
    border-right: 0px solid;    
  }  
}
`;

export const Clear = styled.div `
  clear:both;  
`;

export const Tab = styled.div<tabActive>`
  /* height:85vh; */
  .messageEmpty{
    margin-top:30vh;
    font-size:0.765rem;
  }
  display: ${props => (props.active? 'block': 'none')};
  
  .progresTab {
      font-size:0.685rem;
      text-align:center;
      margin: 0.5rem;
      color: var(--blue-twitter)
  }  
`;