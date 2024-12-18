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
    margin-left: -7px;
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

export const GridContainerFinancial = styled.div`
  
  width: 94.8%;
  font-size:0.3rem;
  margin-left:1%;
  font-family: Montserrat;
  
  #gridContainer .dx-row{
    height: 100px;
    font-size: 12px;
  }
  
  span {
    font-size:0.675rem;   
    color: var(--blue-twitter);
  }

  big {
    font-size:0.675rem;
    color: var(--blue-twitter);
  }

  svg {
      width: 1rem;
      height: 1rem;
      margin-left: 0.8rem;
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

export const ModalDeleteOptions = styled.div`
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

export const HamburguerHeader = styled.div`
  width: 95vw;

  .buttonHamburguer {
    justify-content:end;  
    text-align:center;
    padding-right:1rem;
    padding-top:0.5rem;
    position:relative;
    >div{
      margin-right:-1rem;
      margin-top:-4.5rem;
      position:absolute;
    }    
    .iconMenu {
      color: var(--blue);
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;


export const ModalMarkedPaid = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 630px;
  height: 150px;
  background-color: var(--white);
  position: absolute;
  z-index: 2;
  justify-content: center;
  left: 30%;
  margin-top: 10%;

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
