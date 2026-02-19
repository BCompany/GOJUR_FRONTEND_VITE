import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;

  .information {
    left: 32%;
  }

`;


export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  overflow: auto;

  @media (max-width: 480px) {
    min-width: 1300px;
  }

  .selectPeople {
    float: left;
    width: 53%;
    margin-Left: 5%;
    padding-left: 5%;
  }

  .attachMatter {
    float: left;
    width: 35%;
    margin-Left: 3%;
    margin-top: 3px;
  }

  .valorAcordo {
    float: left;
    width: 20%;
    margin-Left: 5.5%;
    margin-Top: -11px;
  }

  .parcelasAcordo {
    float: left;
    width: 20%;
    margin-Left: 1%;
    margin-Top: -10px;
  }

  .dataAcordo {
    float: left;
    width: 22%;
    margin-Left: 3%;
    margin-top: -40px;
  }

  .periodDeal {
    float: right;
    width: 10%;
    margin-Right: 5%;
    margin-top: -10px;
  }

  .proratingDeal {
    float: left;
    width: 20%;
    margin-Left: 5.5%;
  }

  .companyDeal {
    float: left;
    width: 20%;
    margin-Left: 3%;
    margin-top: -10px;
  }

  .customerDeal {
    float: left;
    width: 20%;
    margin-Left: 3%;
    margin-top: -10px;
  }

  .reminder {
    float: left;
    width: 20%;
    margin-Left: 3.5%;
    color:var(--blue-twitter);
    margin-Top: -12px;
  }

  .updateDeal {
    float: left;
    width: 20%;
    margin-Left: 3.5%;
    color:var(--blue-twitter);
    margin-Top: 35px;

    svg {
      width: 1rem;
      height: 1rem;
      font-Weight: 600;
      color: var(--blue-twitter);
      cursor: pointer;
    }
  }

  .notifyPeople {
    float: left;
    margin-Left: 1%;
    margin-top: 5px;
    font-size: 12px;
    color: #000;
  }

  .parcelaAtualDeal2 {
    height: 50px;
    margin-left: 2px;

    span {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .tipoAcordoResumo {
    float: left;
    width: 2%;
    margin-Left: 3%;
    margin-Top: 35px;
  }
  
  .dataAcordoResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
    margin-Top: -30px;
  }

  .valorAcordoResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
    margin-Top: -3px;
  }

  .categoriaResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
  }

  .formaPagamentoResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
  }

  .centroCustoResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
  }

  .descricaoResumo {
    float: left;
    margin-Left: 7%;
    background-Color: #FFFFFF;
    width: 88%;
    margin-Top: -27px;
    border: solid 1px #d6cdcd;
  }

  .resumo {
    border: solid 1px #cacaca;
    height: 470px;
    border-Radius: 0.25rem;
    box-Shadow: 1px 1px 4px 0.5px rgba(146, 141, 141, 0.15);
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

  .documentButton{
    opacity: 0;
    position: absolute;
    /* margin-Left: -100%; */
    width: 100%;
    height: 35px;
    cursor: pointer;
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

  span {
    font-size: 0.675rem;
  }

  label {
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
      //height:40px;
      padding: 0.40rem;
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

  .selectPeople {
  margin: 0.5rem 0;
}

  .selected-people-inline {
    display: flex;
    align-items: center;
    flex-wrap: nowrap; 
    gap: 0.2rem; 
    overflow-x: auto; 
    margin-top: 0.5rem;
    padding-left: 1%;
  }

  .selected-person-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.3rem; 
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 5px; 
    font-size: 40%; 
    color: #333;
    white-space: nowrap;
    font-weight: 500;
  }

  .remove-person-btn {
    background: none;
    border: none;
    font-size: 0.75rem; 
    font-weight: bold;
    cursor: pointer;
    margin-left: 0.2rem;
    color: #999;
  }

  .remove-person-btn:hover {
    color: #ff0000;
  }

`;


export const Process = styled.div`
  width: 100%;
  background: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  display: flex;
  align-items: center;
  margin-top: 15px;

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


export const OverlayFinancial = styled.div `
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
      height: 3rem;
      color: var(--blue-twitter);
      font-size: 0.765rem;
      text-align: center;
      padding: 1rem;
      margin-left: 30vw;
      margin-right: 25vw;
      margin-top: 20%;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    }
`;


export const ModalInformation = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 630px;
  height: 150px;
  background-color: var(--white);
  position: absolute;
  z-index: 2;
  justify-content: center;
  left: 35%;
  margin-top: 10%;

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;

    > svg {
      width: 0.85rem;
      height: 0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }
`;

export const ModalInformationMobile = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 90%;
  height: auto;
  max-height: none;
  background-color: var(--white);
  position: absolute;
  z-index: 2;
  justify-content: center;
  width: 90%;
  top: 50%;
  left: 50%;
  margin-left: 20%;
  transform: translate(-50%, -50%);

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;

    > svg {
      width: 0.85rem;
      height: 0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }
`;


export const ContentMobile = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin-left: 0.5rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 95%;

  .selectPeople {
    width: 100%;
    margin-top:3%;
  }

  .attachMatter {
    width: 100%;
  }

  .valorAcordo {
    width: 100%;
    margin-top:3%;
  }

  .parcelasAcordo {
    width: 100%;
    margin-top:3%;
  }

  .dataAcordo {
    width: 200%;
  }

  .sc-cidCJl{
    max-width: 50%;
  }

  .periodDeal {
    width: 100%;
  }

  .proratingDeal {
    width: 100%;
    margin-top:2%;
  }

  .companyDeal {
    width: 100%;
    margin-top:8%;
  }

  .customerDeal {
    width: 100%;
    margin-top:8%;
  }

  .reminder {
    width: 100%;
    color:var(--blue-twitter);
    margin-top:7%;

    svg {
      width: 1rem;
      height: 1rem;
      font-Weight: 600;
      color: var(--blue-twitter);
      cursor: pointer;
    }
  }

  .updateDeal {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 8%;

    color: var(--blue-twitter);

    svg {
      width: 1rem;
      height: 1rem;
      font-weight: 600;
      color: var(--blue-twitter);
      cursor: pointer;
    }
}

  .notifyPeople {
    font-size: 12px;
    color: #000;
    display: flex;
    margin-top:3%;
  }

  .parcelaAtualDeal {
    margin-top: 8%;

    span {
      font-size: 12px;
      font-weight: 600;
    }
  }

  .tipoAcordoResumo {
    width: 10%;
    margin: 3%;
  }
  
  .dataAcordoResumo {
    margin-top: -5%;
    width: 190%;
    margin-left: 3%;
  }

  .valorAcordoResumo {
    width: 94%;
    margin: 3%;
  }

  .categoriaResumo {
    width: 94%;
    margin: 3%;
  }

  /* .formaPagamentoResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
  }

  .centroCustoResumo {
    float: left;
    width: 16%;
    margin-Left: 2%;
  } */

  .descricaoResumo {
    background-Color: #FFFFFF;
    width: 94%;
    border: solid 1px #d6cdcd;
    margin: 3%;
  }

  .resumo {
    border: solid 1px #cacaca;
    border-Radius: 0.25rem;
    box-Shadow: 1px 1px 4px 0.5px rgba(146, 141, 141, 0.15);
  }

  .label-resum {
    border-bottom: 2px solid #cacaca;
    text-align: center;
  }

  .dnhHWy .sc-cidCJl {
    max-width: 94%;
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

  .documentButton{
    opacity: 0;
    position: absolute;
    /* margin-Left: -100%; */
    width: 100%;
    height: 35px;
    cursor: pointer;
  }

  span {
    font-size: 0.675rem;
  }

  label {
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

`;
