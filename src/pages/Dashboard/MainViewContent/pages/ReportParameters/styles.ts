import styled from 'styled-components';

interface menuClick {
  isOpen: boolean;
}

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;
`;

export const TollBar = styled.div`
  display: flex;
  max-height: 1.5rem;
  font-size: 0.65rem;
  justify-content: space-between;

  .buttonReturn {
    display: flex;
    flex: 1;
    justify-content: start;
  }

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

export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  overflow: auto;

  span {
    font-size: 0.675rem;
    color: var(--blue-twitter);

    > span {
      margin-left: 5px;
    }
  }
`;


export const CropContainer = styled.div`
  width: 800px;
  margin-left: 18%;
  margin-Top: 1%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #000;
  position: relative;
`;

export const ImgControls = styled.div`
  margin-left: 18%;
  width: 800px;
  height: 100px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background-color: var(--white-card);
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  /* align-items: center; */
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Montserrat;
    font-size: 1rem;
    color: var(--secondary);

    & + label {
      margin-top: 0.5rem;
    }

    input {
      width: 650px;
      margin: 0 0.5rem;
    }
  }

  button {
    flex: 1;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: var(--blue-twitter);
    color: var(--white);
    font-weight: 600;
    font-size: 0.75rem;
    font-family: Poppins;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(90%);
    }
  }


  .button-controls {
    display: flex;
    align-items: center;
    justify-content: center;


    > label {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      padding: 0.25rem;
      border-radius: 0.25rem;
      background-color: var(--blue-twitter);
      color: var(--white);
      font-weight: 600;
      font-size: 0.75rem;
      font-family: Poppins;
      transition: filter 0.2s;

    &:hover {
      filter: brightness(90%);
    }
      >input {
        display: none;
      }
    }
    
  }
`;

export const CropContainerMobile = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #000;
  position: relative;
`;

export const ImgControlsMobile = styled.div`
  width: 100%;
  height: 300px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background-color: var(--white-card);
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  /* align-items: center; */
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Montserrat;
    font-size: 1rem;
    color: var(--secondary);

    & + label {
      margin-top: 0.5rem;
    }

    input {
      width: 650px;
      margin: 0 0.5rem;
    }
  }

  button {
    flex: 1;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: var(--blue-twitter);
    color: var(--white);
    font-weight: 600;
    font-size: 0.75rem;
    font-family: Poppins;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(90%);
    }
  }


  .button-controls {
    display: flex;
    align-items: center;
    justify-content: center;


    > label {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      padding: 0.25rem;
      border-radius: 0.25rem;
      background-color: var(--blue-twitter);
      color: var(--white);
      font-weight: 600;
      font-size: 0.75rem;
      font-family: Poppins;
      transition: filter 0.2s;

    &:hover {
      filter: brightness(90%);
    }
      >input {
        display: none;
      }
    }
    
  }
`;

export const AccountInformationCard = styled.div`
  /* border: 1px solid red; */
  flex: 1;
  min-height: 700px;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--white-card);
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.4);
  border-radius: 0.25rem;

  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.25rem 1rem;
  }

  .infoMessage {
    width:1.2rem;
    height:1.2rem;
    margin-top: 5px;
    margin-left: 1%;
    margin-bottom: auto;
    color: #2c8ed6;
  }

  .infoMessageMobile {
    width:1.2rem;
    height:1.2rem;
    margin-top: auto;
    margin-left: 1%;
    margin-bottom: auto;
    color: #2c8ed6;
  }

  .headerLabel {
    font-size: 19px;
    margin-left: 1%;
    margin-top: 2%;
  }

  .headerLabelMobile {
    font-size: 13px;
    margin-left: 1%;
    margin-top: 2%;
  }

  .headerTypeDiv {
    display: flex;
    margin-top: 0.5%;
  }

  .headerTypeLabel {
    font-size: 16px;
    margin-left: 1%;
    width: 20%;
  }

  .headerTypeLabelMobile {
    font-size: 12px;
    margin-left: 1%;
    width: 90%;
  }

  .headerTypeSelect {
    background-color: white;
    margin-left: 1%;
  }

  .informationDiv {
    margin-top: 2%;
    margin-left: 1%;
    font-size: 16px;
  }

  .informationDivMobile {
    margin-top: 1%;
    margin-left: 1%;
    font-size: 11px;
  }

  .textArea {
    width: 48%;
    margin-left: 0.5%;
    margin-top: 1%;
  }

  .headerImage {
    width: auto;
    max-width: 400px;
    height: 50px;
    margin-left: 5%;
    margin-top: 3%;
  }

  .headerImageMobile {
    width: auto;
    max-width: 300px;
    height: 50px;
    margin-left: 5%;
    margin-top: 3%;
  }

  .uploadButton {
    display: flex;
    margin-left: 5%;
    margin-top: 1%;
  }

  .uploadButtonMobile {
    display: flex;
    margin-left: 35%;
    margin-top: 1%;
  }

  .footerLabel {
    font-size: 19px;
    margin-left: 1%;
    margin-top: 5%;
  }

  .footerLabelMobile {
    font-size: 19px;
    margin-left: 1%;
    margin-top: 5%;
  }

  .footerInformation {
    margin-left: 1%;
    font-size: 16px;
    display: inline-block;
  }

  .footerInformationMobile {
    margin-left: 1%;
    font-size: 7.5px;
    display: inline-block;
  }

  .buttonAddPage {
    display: inline-block;
    margin-left: 0.5%
  }

  .buttonAddPageMobile {
    display: inline-block;
    margin-left: 1%
  }

  .buttonIcon {
    display: inline-block;
    margin-top: 1%;
  }

  .textAreaFooter {
    width: 48%;
    margin-left: 0.5%;
    margin-bottom: 2%;
  }

  .textAreaFooterMobile {
    margin-left: 0.5%;
    margin-bottom: 2%;
  }


  /* svg {
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
  } */
             
  input, select {
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255,255,255,0.25);
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
      #BtSvCl{
        margin-right: 10px
      }
    }
  } 
`;
