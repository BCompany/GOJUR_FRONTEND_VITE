import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}

export const OverlayPublicationNames = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:1;

    /* text inside overlay */
    >div{
      background: var(--white-card);
      height:3rem;
      color:var(--blue-twitter);
      font-size:0.765rem;
      text-align:center;
      padding:1rem;
      margin-left:30vw;
      margin-right:25vw;
      margin-top:20%;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    }
`;

export const TollBar = styled.div`
  display: flex;
  max-height: 1.5rem;
  font-size: 0.65rem;
  justify-content: space-between;
  margin-top:auto;
  margin-bottom:auto;
  margin-left:400px;
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: auto;
  @media (min-width: 480px) {
    padding: 0.2rem 1.5rem; // browser
  }

  .infoMessage{
      color: var(--blue-twitter);  
      margin-left:10px;
      width:1rem;
      height:1rem;
      margin-top:auto;
      margin-bottom:auto;
    }
`;


export const TaskBar = styled.div`
  display: flex; 
  align-items: center;
  justify-content: space-between;
 
  div {
    display: flex;
    align-items: center;
    justify-content: center;
   
    #options {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;

     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }

     &:hover {
       svg {
        color: var(--orange);
       }
      }
    }
  }

  p {
    font-family: Montserrat;
    font-size: 0.625rem;
    color: var(--secondary);
  }
`;

export const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;    
    height: auto;
    min-height: 350px;
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    margin-top: 1%;

    header {
      font-size: 18px;
      width: 100%;
      background-color: rgba(0,0,0,0.1);
      color: var(--blue-twitter);
      padding: 0.25rem 1rem;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
      font-weight:500;
      text-align: center;
    }
    

    .secondHeader {
      text-align:center;
      font-size:0.80rem;
      font-weight:500;
      margin-top:1.5rem;
      color: var(--blue-twitter);
      margin: 0.5rem;
  }

  .buttonsAction
  {
      display:flex;
      justify-content: center;
      button{
        font-size:0.80rem;
        font-weight:450;
        margin-top:5px;
      }
  }

  .border{
      border-bottom: 1px solid black;
      margin-top: 10px;
      margin-bottom: 15px;
    }

    .InvoiceButton {
      &:hover {
        svg {
          color: var(--orange);
        }}
    }

    #message
  {
      margin-left:3rem;
      margin-right:3rem;
      padding:0.5rem;
      font-size:0.75rem;
      color: var(--secondary);
      justify-content: center;
      text-align:center;
      font-family:verdana;
      text-justify:justify;

      svg {
        width: 1rem;
        height:1rem;
        margin-right:5px;
        margin-top:5px;
        color: var(--blue-twitter);
      }

      span {
        color: var(--blue-twitter);
      }

      div {
        margin-top:10px;
        font-size:0.7rem;
        svg {
          width: 1rem;
          height:1rem;
          margin-top:5px;
          color: var(--blue-twitter);
        }
      }
  }
`;

export const SearchCNJBatchItem = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  margin:0.60rem;
  font-size:0.685rem;
  background-color: var(--white);
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
  border-radius: 0.25rem;
  color: var(--primary);
  font-family: Montserrat;
  position: relative;

  > header {
    background-color: rgba(0,0,0,0.1);
    font-weight:600;
    padding: 0.20rem 0.20rem;

    >svg{
      color:var(--blue-twitter);
      width:0.85rem;
      height:0.85rem;
      cursor:pointer;
    }
  }

  >div {

   display:flex;

   >div{
    font-weight:600;
    span { font-weight:300; }

    .linkInfo {
      color:var(--blue-twitter);
      cursor:pointer;
    }
   }
}`;

export const Form = styled.form`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    flex-direction: column;
    background-color: var(--white-card);
    

    input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }

  table {
    border-spacing: 0 0;
    width: 75%;
    margin-left: auto;
    margin-right: auto;

    th {
      color: white;
      font-weight: 400;
      padding: 0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.7rem;
      background-color: #0177C0;
    }

    tr:nth-child(odd) {
      background-color:#D9ECEC;
    }

    td {
      padding: 0.5rem;
      border: 0;
      background: var(--shape);
      color: var(--text-body);
      font-size: 0.7rem;
      text-align: unset;
      text-align: center;
    }
  }

`;

