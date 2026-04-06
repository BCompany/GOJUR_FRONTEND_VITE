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


   .section {
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .section-title {
      display: flex; 
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 18px;
      align-items: center;
      gap: 8px;  
      line-height: 1;          
    }

    .section-title svg {
      //display: block;        
      margin-top: -1px;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      //margin-top: 10px;
    }

    .row input[type="number"] {
      width: 80px;
    }

    .row.channels .buttonLinkClick {
  display: flex;
  align-items: center;

}

    .channels label {
      font-weight: normal;
      margin-right: 12px;
    }

    .actions {
      text-align: right;
      margin-top: 24px;
    }

.channels .channel {
  display: flex;
  align-items: center;   /* ALINHAMENTO VERTICAL */
  gap: 6px;              /* espaço entre ícone e texto */
  cursor: pointer;
}

/* opcional: garante que o svg não "desça" */
.channels svg {
  display: block;
}

    button {
      padding: 10px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }


  .item2a{
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 3px;
  }

  .dealBlue{
    height: 23px;
    width: 23px;
    color: #72a6ef;

    svg {
      width: 23px;
      height: 23px;
      cursor:pointer;
      &:hover {
        color: var(--orange)
      }
    }
  }

  .dealGreen{
    height: 23px;
    width: 23px;
    color: #48C71F;

    svg {
      width: 23px;
      height: 23px;
      cursor:pointer;
      &:hover {
        color: var(--orange)
      }
    }
  }

  .dealYellow{
    height: 23px;
    width: 23px;
    color: #E9ED00;

    svg {
      width: 21px;
      height: 21px;
      cursor:pointer;
      &:hover {
        color: var(--orange)
      }
    }
  }

  .dealButton{
    height: 20px;
    width: 20px;
    color: #72a6ef;

    svg {
      width: 20px;
      height: 20px;
      cursor:pointer;
      &:hover {
        color: var(--orange)
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


  span{
    font-size: 14px;
  }

  label{
    font-size: 14px;
  }

  p{
    font-size: 14px;
  }

  .selectedButton {
    pointer-events: none;
    margin-right: 0.85rem;
    padding: 0.5rem;
    background-color: #EDEDED;
    font-size: 0.625rem;
    color: #FF4701;
    cursor:pointer;
    font-family: montserrat;
    border-radius: 0.25rem;
    justify-content: center;
    min-width:5.5rem;
    border: solid 1px #2c8ed6;

    > svg {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.3rem;
    }

    &:hover {
      filter: brightness(80%);
    }
  }

  .monthButton {
    height: 30px;
    background-color: var(--blue-twitter);
    font-size: 0.625rem;
    color: #FFFFFF;
    cursor:pointer;
    font-family: montserrat;
    border-radius: 0.25rem;
    justify-content: center;
    border: solid 1px #2c8ed6;
    width: 40px;

    > svg {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.3rem;
    }

    &:hover {
      filter: brightness(80%);
    }
  }

  .monthButton2 {
    height: 36px;
    background-color: var(--blue-twitter);
    font-size: 0.625rem;
    color: #FFFFFF;
    cursor:pointer;
    font-family: montserrat;
    border-radius: 0.25rem;
    justify-content: center;
    border: solid 1px #2c8ed6;
    width: 40px;
    margin-top: 6px;

    > svg {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.3rem;
    }

    &:hover {
      filter: brightness(80%);
    }
  }

  .buttons{
    float: left;
    width: 30%;
    margin-Top: -5px;
    margin-Left: 2%;
    height: 180px;
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
       
        
        .form-row {
  display: flex;
  align-items: center;
  gap: 12px; /* espaço entre label e input */
   margin-top: 12px;
    //margin-left: -7px;
}

.form-row label {
  min-width: 260px; /* controla o alinhamento */
  //font-weight: 500;
}

.form-row input {
  flex: 1; /* input ocupa o resto do espaço */
}

  .selectMonth{
    float: left;
    width: 30%;
    margin-Top: -5px;
    height: 180px;
  }

  .informTable{
    width: 90%;
    margin-top: 20px;
  }

  .visualizeButtons{
    float: left;
    width: 135px;
  }

  .autoComplete{
    width: 92.5%;
    margin-top: 12px;
    //margin-left: -7px;
  }

  table{
    font-size: 14px;
    border: solid 1px;

    .header{
      border: solid 1px;
      background-color: var(--blue-twitter);
      color: white;
      height: 30px;
      vertical-align: middle;
      font-family: sans-serif;
      font-size: 16px;
    }
  
    .rightBold{
      text-Align: right;
      font-weight: 600;
    }

    .right{
      text-Align: right;
    }

    .left{
      width: 200px;
    }

    .leftGreen{
      width: 200px;
      color: green;
    }

    .leftRed{
      width: 200px;
      color: red;
    }
  
    .debit{
      text-Align: right;
      color: red;
      width: 130px;
    }

    .credit{
      text-Align: right;
      color: green;
      width: 130px;
    }
  }
`;


export const FormCenter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export const FormCard = styled.div`
  width: 60%;
  min-width: 700px;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 1.5rem 2rem;
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
`;

export const FormTitle = styled.h5`
  margin-bottom: 1rem;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

export const SectionRow = styled.section`
  display: flex;
  gap: 20px;
  padding-top: 10px;

  label {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;