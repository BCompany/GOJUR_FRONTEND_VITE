import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 12px;
  background-color: #FFFFFF;
`;


export const Center = styled.div`
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-box {
    background-color: #FFFFFF;
  }

  .content-box {
    text-align: center;
    width: 60%;
  }
`;


export const OverlaySubscriber = styled.div `
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;

  .message {
    position: absolute;
    background: var(--yellow);
    box-shadow: 2px 2px 2px 2px rgb(0 0 0 / 40%);
    border-radius: 0.25rem;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--blue-twitter);
    font-family: Montserrat;
    padding: 0.5rem 0.5rem;
    margin-right: 1.7rem;
    margin-bottom: 1px;
    cursor: pointer;
    z-index: 999999;
    min-width: 10rem;
    margin-top: 22%;
    margin-left: 38%;
    bottom: 50%;
    right: 30%;
  }
`;


export const ModalAlert = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 570px;
  min-height: 14rem;
  max-height: 14rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 30%;
  margin-top: 10%;

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
    width: 93%;
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
    width: 6.9%;
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