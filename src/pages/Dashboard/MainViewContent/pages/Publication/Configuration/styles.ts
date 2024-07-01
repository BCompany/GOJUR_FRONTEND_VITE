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
  font-size: 0.675rem;

  .headerText{
    text-Align: center;
    height: 20px;
    font-size: 0.765rem;
    font-weight: 500;
  }

  .boxText{
    height: 30px;
    font-size: 0.765rem;
    font-weight: 500;
  }

  .box {
    margin-top: 20px;
    border: solid 1px #cacaca;
    border-Radius: 0.25rem;
    box-Shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.15);
    padding: 15px 15px 15px 15px;
  }


`;


export const OverlayPublicationConfiguration = styled.div `
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
