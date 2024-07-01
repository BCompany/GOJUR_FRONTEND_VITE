import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 14px;
  background-color: #EDF0F7;
`;


export const Center = styled.div`
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-box {
    background-color: #EDF0F7;
  }

  .content-box {
    text-align: center;
    width: 70%;
  }
`;

export const GridFinancialInformation = styled.div`
  width: 80%;
  font-size: 0.3rem;
  margin-left: 10%;
  font-family: Montserrat;

  #gridContainer .dx-row{
    height: 90px;
    font-size: 14px;
  }

  span {
    font-size: 14px;
    color: var(--blue-twitter);
  }

  big {
    font-size: 14px;
    color: var(--blue-twitter);
  }

  svg {
      width: 0.8rem;
      height: 0.7rem;
      margin-left: 0.8rem;
      color: var(--blue-light);
      cursor: pointer;

      &:hover {
        color: var(--orange)
      }
  }
  & tbody tr:nth-of-type(odd){
    background-color: #D9ECEC
  }
`;

export const FinancialInformationOverlay = styled.div `
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
