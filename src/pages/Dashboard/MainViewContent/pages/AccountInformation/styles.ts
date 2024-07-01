import styled from 'styled-components';

interface menuClick{
  isOpen:boolean;
}

export const Container = styled.div`
flex: 1;
  height: 100%;
  overflow: auto;
  max-height: 100%;
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

    .button-box {
      display: flex;
      width: 250px;
      margin: 35px auto;
      position: relative;
      border-radius: 30px;
      background: #fff;
    }

    .toggle-btn {
      padding: 10px 35px;
      cursor: pointer;
      background: transparent;
      border: 0;
      outline: none;
      position: relative;
      text-align: center;
      font-size: 14px;
      font-weight: bolder;
      font-family: 'Poppins', sans-serif;
    }

    .buttn {
      left: 0;
      top: 0;
      position: absolute;
      width: 110px;
      height: 100%;
      background: orange;
      border-radius: 30px;
      transition: .3s;
    }
`;

export const TollBar = styled.div `
  display:flex;
  max-height:1.5rem;
  font-size:0.65rem;
  justify-content:space-between;

  .buttonReturn {
    display:flex;
    flex:1;
    justify-content:start;
  }

  #options {
     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }

     &:hover {
       svg { color: var(--orange); }
    }
  }
`;

export const Content = styled.div`
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

  .accountInformation{
      background: white;
      border-radius: 10px;
      box-shadow: 0px 10px 10px rgba(0,0,0,.2);
      display: flex;
      max-width: 100%;
      overflow: hidden;
      width: 90%;
      position: relative;
      margin: 3%;
    }

    .accountInformation h6 {
      opacity: .6;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .accountInformation h2 {
      letter-spacing: 1px;
    }

    .preview {
      background: var(--blue-twitter);
      color: #fff;
      width: 200px;
      position: relative;
      text-align: center;
      font-size: 16px;
    }

    .preview .btn{
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 0;
        margin-bottom: 70px;
    }
    .preview .btn2{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        bottom: 0;
        position: absolute;
    } 
      .btn button{
        width: 80%;
        height: 50px;
        color: var(--blue-twitter);
        font-size: 17px;
        font-weight: 500;
        border: none;
        outline: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 5px solid orange;
        border: 2px solid orange;
        color: white;
        background: orange;
        font-family: Montserrat;
        margin-bottom: 20px;
      }

      .preview .btn button:hover{
        border-radius: 5px;
        background:orange;
        color: #fff;
      }
      .btn2 button{
        width: 80%;
        height: 50px;
        color: var(--blue-twitter);
        font-size: 17px;
        font-weight: 500;
        border: none;
        outline: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 5px solid orange;
        border: 2px solid orange;
        color: white;
        background: orange;
        font-family: Montserrat;
      }

      .preview .btn2 button:hover{
        border-radius: 5px;
        background:orange;
        color: #fff;
      }

    h2 {
      padding: 2px;
      font-size: 14px;
    }

    h6{
      padding: 20px;
    }

    .infoDescriptionPlan {
      padding: 10px;
      position: relative;
      width: 60%;
      font-size: 13px;
      overflow: auto;
      border-left: 1px solid var(--blue-twitter);

      h2 {
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid var(--blue-twitter);
      }

      p {
        margin-top: 15px;
      }
    }

    .infoTotalPlan {
      padding: 10px;
      position: relative;
      width: 15%;
      font-size: 13px;
      overflow: auto;
      border-left: 1px solid var(--blue-twitter);
      text-align: center;

      h2 {
        font-size: 16px;
        border-bottom: 1px solid var(--blue-twitter);
      }

      p {
        margin-top: 15px;
      }

    }

    .infoResourcesUtilized {
      padding: 10px;
      position: relative;
      width: 15%;
      font-size: 13px;
      overflow: auto;
      border-left: 1px solid var(--blue-twitter);
      text-align: center;

      h2 {
        font-size: 16px;
        border-bottom: 1px solid var(--blue-twitter);
      }

      p {
        margin-top: 15px;
      }
    }
    
    @media(max-width: 768px){

      .accountInformation{
        flex-direction: column;
        width: 90%;
        margin: 1%;
      }
      .preview {
        width: 100%;
      }

      .preview h2 {
        margin: 10px 0 0;
      }

      .info h2 {
        margin-top: 20px;
      }

      .info p {
        margin-bottom: 50px;
      }
    }

`;