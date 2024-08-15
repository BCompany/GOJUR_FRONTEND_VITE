import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;
`;


export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  overflow: auto;

  > svg {
    width: 24px;
    height: 24px;
    color: var(--blue-twitter);
  }

  .log {
    float: left;
    margin-top: 10px;
    svg {
      color: var(--blue);
      width: 1rem;
      height: 1rem;
    }
  }

  .invoiceWarning {
    font-size: 12px;
    float: right;
    margin-top: 10px;
  }

  .invoiceWarningPayment {
    font-size: 12px;
    font-weight: 100;
  }

  span {
    font-size: 16px;
    font-weight: 600;
  }

  .paymentElements {
    border-Top: solid 1px gray;
    border-Bottom: solid 1px gray;
  }
  
  section {
    width:100%;
    flex:1;
    column-gap:1.5rem;

    .infoMessage {
        width:0.85rem;
        height:0.85rem;
        margin-top:0.7rem;
    }

    @media (min-width: 480px) {
      display:flex;
    }

    justify-content: space-around;

    > label {
        flex:1;
        font-size: 0.675rem;
        color: var(--primary);
        margin:0.3rem;

        > svg {
          width:1rem;
          height:1rem;
          color:var(--blue-twitter);
          cursor:pointer;
          float: right;
          margin-right: -25px;
          margin-top: -30px;

          &:hover {
              color: var(--orange);
          }
        }

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

        textarea {
          flex: 1;
          font-size: 0.675rem;
          padding: 0.25rem;
          background-color: #FFFFFF;
          width: 100%;
          color: var(--secondary);
          border: 1px solid #B3B3B3;
          min-height: 70px;
          height: auto;
          border-radius: 0.25rem;

          &:focus {
            border-bottom: 1px solid var(--orange);
          }
        }

        .inputField {
            font-size: 0.675rem;
            background-color: #FFFFFF;
            width: 100%;
            height:40px;
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary);
            margin-top:-2px;
            &:focus {
                border-bottom: 1px solid var(--orange);
            }
        }

        &:focus-within {
            color: var(--orange);

            &.required{
                color: var(--red);
            }
        }
    }

    > svg {
      width: 24px;
      height: 24px;
      color: var(--blue-twitter);
    }

    .flexDiv {
      font-size: 12px;
      flex: 1;

      > svg {
        width: 24px;
        height: 24px;
        color: var(--blue-twitter);
      }
    }

    .personList {
      font-size: 12px;
      flex: 1;

      @media (max-width: 480px) {
        font-size: 10px;
      }

      >p {
        padding: 0.2rem;

        >svg {
          width: 0.85rem;
          height: 0.85rem;
          color: var(--blue-twitter);
          margin-left: 5px;
          top: 5px;
          cursor: pointer;

          &:hover {
            color: var(--orange);
          }
        }
      }
    }

    .disableDiv {
      flex:1;
      font-size: 0.675rem;
      color: var(--primary);
      margin:0.3rem;

      > svg {
        width:1rem;
        height:1rem;
        color:var(--blue-twitter);
        cursor:pointer;
        float: right;
        margin-right: -25px;
        margin-top: -30px;

        &:hover {
            color: var(--orange);
        }
      }

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

      textarea {
        flex: 1;
        font-size: 0.675rem;
        padding: 0.25rem;
        background-color: #FFFFFF;
        width: 100%;
        color: var(--secondary);
        border: 1px solid #B3B3B3;
        min-height: 70px;
        height: auto;
        border-radius: 0.25rem;

        &:focus {
          border-bottom: 1px solid var(--orange);
        }
      }

      .inputField {
          font-size: 0.675rem;
          background-color: #FFFFFF;
          width: 100%;
          height:40px;
          border-bottom: 1px solid rgba(0,0,0,0.15);
          color: var(--secondary);
          margin-top:-2px;
          &:focus {
              border-bottom: 1px solid var(--orange);
          }
      }

      &:focus-within {
          color: var(--orange);

          &.required{
              color: var(--red);
          }
      }
    }

    .notificationEmailActive {
      height: 18px;
      width: 18px;
      color: blue;
    }

    .notificationEmailInactive {
      height: 18px;
      width: 18px;
      color: var(--grey);
    }

    .notificationWhatsAppActive {
      height: 18px;
      width: 18px;
      color: green;
    }

    .notificationWhatsAppInactive {
      height: 18px;
      width: 18px;
      color: var(--grey);
    }

    .trash {
      height: 18px;
      width: 18px;
      color: var(--grey);
    }

    .erase {
      height: 18px;
      width: 18px;
      color: var(--blue-twitter);
    }

  }
`;


export const Process = styled.div`
  width: 98%;
  height: 40px;
  background: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  display: flex;
  align-items: center;
  float: left;

  @media (max-width: 480px) {
    width: 100%;
  }

  transition: all 0.5s;
  > label {
    font-size: 0.75rem;
    font-weight: 400;
    padding-right: 0.25rem;
    margin-right: 1rem;
  }

  > a {
    width: 100%;
    max-width: 560px;

    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    color: var(--secondary);
    border-bottom: 1px solid var(--grey);

    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1;
    }

    @media (min-width: 1366px) {
      max-width: 858px;
    }
    @media (max-width: 1366px) {
      max-width: 560px;
    }

    &:hover {
      border-color: var(--orange);
      color: var(--orange);
    }
  }
  > button#associar {
    width: 100%;
    max-width: 560px;

    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    color: var(--secondary);
    border-bottom: 1px solid var(--grey);

    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1;
    }

    @media (min-width: 1366px) {
      max-width: 858px;
    }
    @media (max-width: 1366px) {
      max-width: 560px;
    }

    &:hover {
      border-color: var(--orange);
      color: var(--orange);
    }
  }

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    > svg {
      width: 24px;
      height: 24px;
      color: var(--blue-twitter);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);

      > svg {
        opacity: 1;
        color: var(--orange);
      }
    }
  }
`;


export const BankPaymentSlip = styled.div`
  width: 33%;
  height: 40px;
  background: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  display: flex;
  align-items: center;
  float: left;
  margin-left: 40px;
  cursor: pointer;
  color: blue;

  @media (max-width: 480px) {
    width: 100%;
  }

  > label {
    font-size: 12px;
  }

  > p {
    font-size: 12px;
  }

  > div {
    > svg {
      width: 24px;
      height: 24px;
      color: var(--blue-twitter);
    }
  }

`;


export const ChangeInstallmentsOptions = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 30rem;
  height: 10rem;
  background-color:var(--white);
  position:absolute;
  z-index:2;
  justify-content:center;
  margin-left:30%;
  margin-top:5%;
  

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }
`;


export const GridSubContainer = styled.div`
  width: 100%;
  font-family: Montserrat;
  margin-top:20px;
  border: 1px solid rgba(0,0,0,0.15);
  font-size: 13px;

  big {
    font-size:0.675rem;
    color: var(--blue-twitter);
  }

  span {
    font-size:0.65rem;
    color: var(--blue-twitter);
  }

  text-decoration {
    font-size:0.70rem;
    color: var(--blue-twitter);
  }

  table tr td {
    white-space: inherit;
    font-size:0.70rem;
  }

  svg {
      width: 1rem;
      height: 1rem;
      color: var(--blue-light);
      cursor:pointer;

      &:hover {
        color: var(--orange)
      }
  }
  & tbody tr:nth-of-type(odd){
    background-color: #D9ECEC
  }
`;


export const ModalPaymentInformation = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:30rem;
  height:8rem;
  background-color:var(--white);
  position:absolute;
  z-index:2;
  justify-content:center;
  margin-left:20%;
  margin-top:5%;
  

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }
`;


export const ModalBankPaymentSlip = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 30rem;
  height: 11rem;
  background-color: var(--white);
  position: absolute;
  z-index: 2;
  justify-content: center;
  margin-left: 22%;
  margin-top: 5%;

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }
`;


export const ModalBankPaymentSlipErrors = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 30rem;
  height: 11rem;
  background-color: var(--white);
  position: absolute;
  z-index: 2;
  justify-content: center;
  margin-left: 22%;
  margin-top: 10%;

  .menuTitle {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 93%;
    background-color: #dcdcdc;
    height: 27px;
    font-weight: 500;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 6.95%;
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


export const ModalBankPaymentSlipSecond = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 28rem;
  height: 25rem;
  background-color: #EDEDED;
  position: absolute;
  z-index: 2;
  justify-content: center;
  margin-left: 25%;
  margin-top: 5%;

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: white;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }
  
`;
