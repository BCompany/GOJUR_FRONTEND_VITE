import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}

export const Box = styled.div`
  width: 10rem;
  height: 5rem;
  background: var(--white);
  border: 1px solid #000;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  margin-left: 2%;

  cursor: pointer;

  > a {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--secondary);
    text-align: center;
    text-decoration: none;

    > p {
      font-family: Montserrat;
      font-size: 0.75rem;
      color: var(--secondary);
      text-align: center;
    }
  }
`;

export const OverlayCustomerConfiguration = styled.div `
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
  margin-left:190px;

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
  column-gap:1.5rem;
  justify-content: space-around;
  @media (min-width: 480px) {
    padding: 0.5rem 3rem; // browser
  }
  

  .infoMessage{
      color: var(--blue-twitter);  
      margin-left:10px;
      width:1rem;
      height:1rem;
      margin-top:auto;
      margin-bottom:auto;
    }

  .headerButtons{
    margin-left:1px;
  }
  
  .selectCompany{
    width:300px;
    margin-top:auto;
    margin-bottom:auto;
    text-align:left;
  }

  .accountInformationCompany{
    margin-bottom:auto;
    margin-top:auto;
  }

  .accountInformation{
    margin-bottom:auto;
    margin-top:auto;
    margin-left:15px;
  }

  .selectPlan{
    margin-top:auto;
    margin-bottom:auto;
  }

  .selectResources{
    margin-top:auto;
    margin-bottom:auto;
    margin-left:20px;
  }

  .qtdLabel{
    margin-left:20px;
    margin-top:auto;
    margin-bottom:auto;
  }

  .resourceNumber{
    margin-top:auto;
    margin-bottom:auto;
    margin-left:10px;
  }

  .resourceNumberInput{
    background-color:white;
    width:75px
  }

  .saveAndCancelDiv{
    float:right;
    margin-right:20px;
  }

  .cancelButton{
    float:left;
    width:100px;
  }

  .searchMatter{
    width:100px;
    margin-left:0px;
    border-bottom:none;
  }

  .userListFilterLabel{
    margin-top:auto;
    margin-bottom:auto;
  }

  .userListFilterSelect{
    background-color:white;
    margin-left:10px;
  }

  .searchUsersByEmail{
    border-bottom: 0px;

    &:focus {
        border-bottom: 0px;
      }
  }

  .searchPublications{
    border-bottom: 0px;

    &:focus {
        border-bottom: 0px;
      }
  }

  .xRayLabel{
    margin-top:auto;
    margin-bottom:auto;
    font-size: 15px;
  }

  .xRayDiv{
    height: 25px;
  }

  .xRayDivTable{
    width: 280px;
    height: 25px;
    float: left;
  }

  #headerLabel
  {
    display:flex;
    font-size:0.9rem;
    color: var(--secondary);
    font-family:verdana;
    text-justify:justify;
    justify-content: center;
    margin-top: 20px;

    span {
      color: var(--blue-twitter);
    }

    div {
      font-weight: bold;
      font-size:1rem;
      color: var(--blue-twitter);
      border-bottom: 1px solid var(--blue-twitter);
      width: 200px;
      text-align: center;
    }
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
`;


export const Form = styled.form`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    flex-direction: column;
    align-items: center;
    background-color: var(--white-card);
    

    input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 100%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }

    section#week {
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right:2px;

      > button {
        border: 1px solid var(--secondary);
        font-family: Montserrat;
        font-weight: 500;
        font-size: 0.675rem;
        color: var(--primary);
        background-color: var(--white);
        padding: 0.15rem;

        &:hover {
          color: var(--blue);
        }
      }
    }
  
    section#dados{
      display: grid;
      height: auto;
      min-height: 200px;

      @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
      }

      grid-gap: 1rem;
      position:relative;
      background-color: var(--white-card);
      padding: 0.5rem;

      
      & + section {
        margin-top: 0.5rem;
      }
      
      > textarea {
          border: 1px solid rgba(0,0,0,0.5);
          width: 100%;
          @media (min-width: 480px) {
            width: 200%;
          }
          min-height: 12rem;
          height: auto;
          padding: 0.5rem;
          background-color: var(--white);
          color: var(--secondary);
          font-size: 0.75rem;
        }

    >  label {
        font-size: 0.675rem;
        color: var(--primary);
        display: flex;
        flex-direction: column;    

        &:focus-within {
          color: var(--orange);

          &.required{
          color: var(--red);
          }
        }

        p{
          display: flex;
          align-items: center;

          svg {
            color: var(--green);
            margin-left: 0.5rem;
            width: 1rem;
            height: 1rem;
          }
        }
                  
      }
    
    }

`;
