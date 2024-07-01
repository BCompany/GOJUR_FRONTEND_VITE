import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}

export const OverlayModal = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:999;

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

  .hamburguerMenu {
    flex: 1;
    display: flex;
    justify-content: end;  
  }

  #options {
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

    .Active {
      color: var(--blue-twitter);
      font-weight:600;
      font-family: montserrat;
      border:0;

      p {
        color: var(--blue-twitter);
      }

      button {
        margin-left:5px;
      }
    }

    .Desactive { 
      color: black;
      font-weight:600;
      font-family: montserrat;
      border:0;

      button {
        margin-left:5px;
      }

      &:hover {
        p {
          color: var(--orange);
        }
       svg {
        color: var(--orange);
       }
      }
    }

    .total {
    margin-top:auto;
    margin-bottom: auto;
    font-size:14px;
    margin-right:15px;
    color:var(--blue-twitter);
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

    }

    .InvoiceButton {
      &:hover {
        svg {
          color: var(--orange);
        }}
    }
`;

export const BillingInvoiceItem = styled.div`
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

  .billingContractDetailsRight {
    flex:0.5;
    padding-left:0.8rem;
    padding-right:0.8rem;
    margin-top:5px;
    padding-top:1px;
    margin-bottom:10px;
    float: right
  }

  .billingContractDetailsLeft {
    flex:1;
    padding-left:0.5rem;
    padding-right:0.5rem;
    margin-top:5px;
    padding-top:1px;
    margin-bottom:10px;
    float: left;
  }
  .matterMenu {
    flex:0.4;
    margin-top:0.3rem;
    padding: 0.15rem 0.15rem;
    border-left: 1px solid black;

    .menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0.5rem 0.5rem;
      transition: all 0.5s;

      > button {
        flex: 1;
        background-color: transparent;

        &:hover {
        svg {
          color: var(--orange);
        }}
      }

      > div {

        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        > section {
          margin-bottom: 0.5rem;
          margin-right:3px;
          display: flex;
          width:100%;
          flex-direction: column;


          > button {
              flex: 1;
              &:hover {
                svg {
                  color: var(--orange);
                }
              }
        }

      > p {
        width: 100%;
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        text-align: left;
        justify-content: center;
        margin-top: 0.15rem;
        color: var(--blue-twitter);
        min-height:1.3rem;
        cursor: pointer;
        font-size:0.63rem;
        font-weight:300;

        &:hover {
            color: var(--orange);
          }

        svg {
          width: 0.8rem;
          height: 0.8rem;
          margin-right:5px;
          color: var(--blue);
          cursor:pointer;

          &:hover {
              color: var(--orange);
              
            }
          }
        }

        &:hover {
            color: var(--orange);
          
          }
        }
      }
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

`;

