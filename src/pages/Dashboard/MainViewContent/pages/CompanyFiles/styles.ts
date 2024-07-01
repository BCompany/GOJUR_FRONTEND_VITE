import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: auto;
  @media (min-width: 480px) {
    padding: 0.2rem 1.5rem; // browser
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
      width: 100%;
      background-color: rgba(0,0,0,0.1);
      padding: 0.25rem 1rem;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
      font-size:0.80rem;
      text-align:center;
      color: var(--blue-twitter);
    }

    >footer {
      display:flex;
      justify-content:center;
      border-top:solid 1px;
      border-bottom:solid 1px;
      border-color: var(--gray);
      padding: 2rem;
    }

    #message
  {
      margin-left:3rem;
      margin-right:3rem;
      padding:0.5rem;
      border-top:solid 1px;
      border-bottom:solid 1px;
      border-color: var(--gray);
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

  #selectModule {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  #downloadFiles {
    margin-top: 2%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 1.5%;
  }

  #downloadPercentage {
    margin-top: 2%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 1%;
    font-size: 15px;
    color: var(--blue-twitter);
  }

  .lastUpdate{
    color: var(--blue-twitter);
    font-size:0.70rem;
    display:flex;
    justify-content:center;
    svg{
      margin-right:0.2rem;
      width:0.85rem;
      height:0.85rem;
      cursor:pointer;
    }
  }

`;

export const ItemList = styled.div`

  display:flex;
  flex-direction:column;
  
  >span {
    display:flex;
    margin:0.2rem 0.5rem;
  }

  p{
    margin-left:0.75rem;
  }
`;

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

    .companyName {
      width: 35%;
    }

    .des_email{
      width: 35%;
      margin-left: 2%;
    }
    
    .num_telefone {
      width: 26%;
      margin-left: 2%;
    }

    .companyType {
      width: 35%;
    }

    .documentNumber {
      width: 35%;
      margin-left: 2%;
    }

    .endereco {
      margin-left: 2%;
      width: 35%;
    }

    .cep {
      width: 13%;
    }

    .bairro {
      width: 20%;
      margin-left: 2%;
    }

    .municipio {
      width: 35%;
    }

`;

