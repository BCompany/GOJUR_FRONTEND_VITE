import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}

interface SearchProps {
  show:boolean
}

export const ItemList = styled.div`
  display:flex;
  flex-direction:column;
`;

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

export const ModalCategory = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  background-color: var(--white);
  position: absolute;
  width: 40%;
  height: 44%;
  z-index: 9999999;
  margin-left: 20%;
  margin-top: 5%;

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 100%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 7.003%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
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
      margin-bottom:auto;
      cursor: pointer;

      &:hover {
       svg {
        color: var(--orange);
       }
      }
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

    .numSequencial {
      margin-bottom: auto;
      margin-top: auto;
      width: 12%;
      margin-left:1%;
    }

    .contractType {
      margin-bottom: auto;
      margin-top: auto;
      width: 12%;
      margin-left:1%;
    }

    .selectPeople {
      margin-bottom: auto;
      margin-top: auto;
      width: 43%;
    }

    .selectDescription {
      margin-bottom: auto;
      margin-top: auto;
      width: 45%;
    }

    .selectDta {
      width:21%; 
      margin-bottom: auto;
      margin-top: auto;
    }

    .serviceDescription {
      margin-top: 1%;
      width: 78%;
    }

    .serviceValue {
      width: 10%;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 1%;
    }

    .serviceQtd {
      width: 10%;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 2%;
    }

    .serviceDescount {
      width: 10%;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 2%;
    }

    .qtdRecorrencia {
      margin-left: 2.5%;
      width: 9%;
      margin-top: auto;
      margin-bottom: auto;
    }

    .recorrenciaType {
      margin-left: 2.5%;
      width: 20%;
      margin-top: auto;
      margin-bottom: auto;
    }

    .paymentType{
      width: 31.8%;
      margin-top: auto;
      margin-bottom: auto;
    }

    .selectPaymentForm {
      margin-left: 1.5%;
      width: 32.5%;
      margin-top: auto;
      margin-bottom: auto;
    }

    .selectDtaVencimento {
      width: 31.4%;
      margin-left: 2.5%;
      margin-top: auto;
      margin-bottom: auto;
    }

    .selectDtaExpires{
      width: 18%;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: 2%;
    }

    .selectCostCenter {
      width:32.5%; 
      margin-bottom: auto;
      margin-top: auto;
    }

    .selectPaymentSlip {
      margin-left: 1.5%;
      width:32.5%; 
      margin-bottom: auto;
      margin-top: auto;
    }

    .invoicing {
      margin-top:auto;
      margin-bottom: auto;
      margin-left: 40%;
      color: var(--blue-twitter);
    }

    .selectCategory{
      width: 95%;
      margin-left: 2%;
    }

    .divAddButon {
      margin-left: 2%;
      margin-top: auto;
      display: flex;
    }

    .invoicingPrincipalDiv{
      display: flex;
      margin-top: 2%;
    }

    .invoicingFirstSpan {
      margin-top: auto;
      margin-bottom: auto;
    }

    .invoicingSecondSpan {
      margin-left: 1%;
      margin-top: auto;
      margin-bottom: auto;
    }

    .daysInputDiv {
      width: 5%;
      margin-left: 1%;
    }

    .divEmailInvoicing {
      display: flex;
      margin-top: 3%;
    }

    .spanEmailInvoicing {
      margin-top: 0.5%;
      margin-bottom: auto;
      width: 10%;
    }

    .flgDiv{
      margin-top: 0.5%;
      margin-bottom: auto;
    }

    .flgInputEmail {
      margin-left: 3.5%;
      width: 51.3%;
    }

    .qtd_FaturamentoFiscal {
      width: 31.8%;
      margin-left: 2.3%;
    }

    .fluxoFicalType {
      width: 31.8%;
      margin-left: 2%;
      margin-top: auto;
      margin-bottom: auto;
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

    .border{
      border-bottom: 1px solid black;
      margin-top: 10px;
      margin-bottom: 15px;
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
      background-color: white;
      width: 100%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }

    textarea {
          flex: 1;
          font-size: 0.675rem;
          padding: 0.25rem;
          background-color: #FFFFFF;
          width: 100%;
          color: var(--secondary);
          border: 1px solid #B3B3B3;
          min-height: 70px;
          height: 150px;
          border-radius: 0.25rem;
          max-width: 100%;

          &:focus {
            border-bottom: 1px solid var(--orange);
          }
        }

`;

